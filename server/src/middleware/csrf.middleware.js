import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// CSRF protection for the SameSite=None auth cookie: browsers always send an
// Origin header on cross-site state-changing requests, so a mismatch means the
// request was not initiated by our frontend. Requests without an Origin header
// (curl, mobile apps, server-to-server) are allowed — they don't carry
// browser-managed cookies, so they are not CSRF vectors.
export function verifyOrigin(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const origin = req.headers.origin;

  if (origin && !env.clientUrls.includes(origin)) {
    return next(ApiError.forbidden('Request origin not allowed'));
  }

  next();
}
