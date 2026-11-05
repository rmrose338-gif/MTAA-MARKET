async function getSalesAnalysis() {
  const serviceUrl = process.env.PYTHON_SERVICE_URL;
  if (!serviceUrl) {
    const error = new Error("Sales analytics service is not configured.");
    error.status = 503;
    throw error;
  }
  let response;
  try {
    response = await fetch(`${serviceUrl.replace(/\/$/, "")}/analysis/sales`, { signal: AbortSignal.timeout(5000) });
  } catch (cause) {
    const error = new Error("Sales analytics service is unavailable.");
    error.status = 503;
    error.cause = cause;
    throw error;
  }
  if (!response.ok) {
    const error = new Error("Sales analytics service returned an error.");
    error.status = 502;
    throw error;
  }
  return response.json();
}

module.exports = { getSalesAnalysis };
