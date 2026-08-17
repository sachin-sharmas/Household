import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, _req, res, _next) {
  const resolved = resolveError(error);

  if (resolved.statusCode >= 500) {
    logger.error(error.message, env.isProduction ? undefined : error.stack);
  }

  res.status(resolved.statusCode).json({
    message: resolved.message,
    ...(resolved.details ? { details: resolved.details } : {}),
    ...(env.isProduction ? {} : { stack: error.stack })
  });
}

function resolveError(error) {
  if (error instanceof ApiError) {
    return { statusCode: error.statusCode, message: error.message, details: error.details };
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    return { statusCode: 409, message: field ? `${field} is already in use` : 'A record with that value already exists' };
  }

  if (error.name === 'ValidationError') {
    return { statusCode: 400, message: 'Validation failed', details: error.errors };
  }

  if (error.name === 'CastError') {
    return { statusCode: 400, message: `Invalid value for ${error.path}` };
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return { statusCode: 401, message: 'Invalid or expired session' };
  }

  return { statusCode: 500, message: 'Server error' };
}
