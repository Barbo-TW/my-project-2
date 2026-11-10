/**
 * 404 Not Found middleware for unmatched routes.
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
    statusCode: 404
  });
}

/**
 * Centralized error handling middleware.
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (err.type === 'entity.parse.failed' ? 400 : 500);
  const message =
    err.type === 'entity.parse.failed'
      ? 'Invalid JSON payload in request body'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : 'Bad Request',
    message,
    statusCode
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
