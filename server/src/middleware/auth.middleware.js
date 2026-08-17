import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ROLES } from '../constants/index.js';
import { User } from '../models/User.js';
import { getTokenFromRequest, verifyToken } from '../utils/jwt.js';

export const requireAuth = catchAsync(async (req, _res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw ApiError.unauthorized();
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired session');
  }

  const user = await User.findById(payload.id);

  if (!user) {
    throw ApiError.unauthorized('User no longer exists');
  }

  req.user = user;
  next();
});

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== ROLES.ADMIN) {
    return next(ApiError.forbidden('Admin access required'));
  }

  next();
}
