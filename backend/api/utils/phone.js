function normalizeKenyanPhone(value) {
  if (typeof value !== "string" || !/^\+?[\d\s()-]{9,20}$/.test(value.trim())) return null;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) digits = digits.slice(3);
  else if (digits.startsWith("0") && digits.length === 10) digits = digits.slice(1);
  if (!/^[17]\d{8}$/.test(digits)) return null;
  return `+254${digits}`;
}

module.exports = { normalizeKenyanPhone };
