function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return res.status(409).json({ message: "That email address is already registered." });
  }
  if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    return res.status(400).json({ message: "One of the selected records does not exist." });
  }
  const status = Number(error.status) || 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({ message: status >= 500 ? "An unexpected server error occurred." : error.message });
}

module.exports = { notFound, errorHandler };
