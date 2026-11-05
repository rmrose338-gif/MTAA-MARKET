const crypto = require("crypto");
const { normalizeKenyanPhone } = require("../utils/phone");

const endpoints = {
  sandbox: "https://sandbox.safaricom.co.ke",
  production: "https://api.safaricom.co.ke",
};

function formatDarajaTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}${values.month}${values.day}${values.hour}${values.minute}${values.second}`;
}

function getConfiguration() {
  const environment = process.env.MPESA_ENV || "sandbox";
  const callbackUrl = process.env.MPESA_CALLBACK_URL || "";
  const callbackToken = process.env.MPESA_CALLBACK_TOKEN || "";
  let validCallback = false;
  try {
    const url = new URL(callbackUrl);
    validCallback = url.protocol === "https:" && Boolean(url.hostname);
  } catch {
    validCallback = false;
  }
  const missingSettings = [];
  if (!endpoints[environment]) missingSettings.push("MPESA_ENV");
  if (!process.env.MPESA_CONSUMER_KEY) missingSettings.push("MPESA_CONSUMER_KEY");
  if (!process.env.MPESA_CONSUMER_SECRET) missingSettings.push("MPESA_CONSUMER_SECRET");
  if (!/^\d+$/.test(process.env.MPESA_SHORTCODE || "")) missingSettings.push("MPESA_SHORTCODE");
  if (!process.env.MPESA_PASSKEY) missingSettings.push("MPESA_PASSKEY");
  if (!validCallback) missingSettings.push("MPESA_CALLBACK_URL");
  if (callbackToken.length < 32) missingSettings.push("MPESA_CALLBACK_TOKEN");
  return {
    configured: missingSettings.length === 0,
    environment,
    callbackUrl,
    callbackToken,
    missingSettings,
  };
}

function callbackUrlWithToken(callbackUrl, callbackToken) {
  const url = new URL(callbackUrl);
  url.searchParams.set("token", callbackToken);
  return url.toString();
}

async function parseResponse(response, action) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.errorMessage || data.error_description || data.ResponseDescription;
    throw new Error(detail || `M-Pesa ${action} failed (HTTP ${response.status}).`);
  }
  return data;
}

async function getAccessToken(environment) {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
  ).toString("base64");
  const response = await fetch(
    `${endpoints[environment]}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
      signal: AbortSignal.timeout(12000),
    },
  );
  const data = await parseResponse(response, "authentication");
  if (typeof data.access_token !== "string" || !data.access_token) {
    throw new Error("M-Pesa authentication did not return an access token.");
  }
  return data.access_token;
}

async function initiateStkPush({ orderId, amount, phone }) {
  const config = getConfiguration();
  if (!config.configured) {
    throw new Error("M-Pesa payments are not configured. Add the Daraja credentials and public HTTPS callback settings to the API environment.");
  }
  const normalizedPhone = normalizeKenyanPhone(phone);
  if (!normalizedPhone) throw new Error("Enter a valid Kenyan M-Pesa number.");
  const shortcode = process.env.MPESA_SHORTCODE;
  const timestamp = formatDarajaTimestamp();
  const password = Buffer.from(`${shortcode}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");
  const accessToken = await getAccessToken(config.environment);
  const response = await fetch(`${endpoints[config.environment]}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.max(1, Math.round(amount)),
      PartyA: normalizedPhone.replace("+", ""),
      PartyB: shortcode,
      PhoneNumber: normalizedPhone.replace("+", ""),
      CallBackURL: callbackUrlWithToken(config.callbackUrl, config.callbackToken),
      AccountReference: `MT${String(orderId).slice(-10)}`,
      TransactionDesc: `Mtaa#${String(orderId).slice(-8)}`,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await parseResponse(response, "payment request");
  if (data.ResponseCode !== "0" || !data.CheckoutRequestID) {
    throw new Error(data.ResponseDescription || "M-Pesa did not accept the payment request.");
  }
  return {
    checkoutRequestId: data.CheckoutRequestID,
    customerMessage: data.CustomerMessage || "Check your phone and enter your M-Pesa PIN to approve the payment.",
  };
}

function callbackTokenIsValid(candidate) {
  const expected = Buffer.from(process.env.MPESA_CALLBACK_TOKEN || "");
  const supplied = Buffer.from(typeof candidate === "string" ? candidate : "");
  return expected.length >= 32
    && expected.length === supplied.length
    && crypto.timingSafeEqual(expected, supplied);
}

function hashPaymentAccessToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  callbackTokenIsValid,
  formatDarajaTimestamp,
  getConfiguration,
  hashPaymentAccessToken,
  initiateStkPush,
};
