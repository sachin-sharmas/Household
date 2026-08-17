import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AUTH_COOKIE_MAX_AGE_MS, AUTH_COOKIE_NAME } from '../constants/index.js';

export function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: env.cookieSecure ? 'none' : 'lax',
    secure: env.cookieSecure,
    maxAge: AUTH_COOKIE_MAX_AGE_MS
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME);
}

export function getTokenFromRequest(req) {
  return req.cookies?.[AUTH_COOKIE_NAME];
}
