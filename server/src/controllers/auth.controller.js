import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { PASSWORD_RESET_TOKEN_TTL_MS, ROLES } from '../constants/index.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { clearAuthCookie, setAuthCookie, signToken } from '../utils/jwt.js';
import { isEmailConfigured, sendEmail } from '../utils/mail.js';
import { User } from '../models/User.js';

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
}

export const register = catchAsync(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict('Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, phone, passwordHash, role: ROLES.USER });

  setAuthCookie(res, signToken(user));
  res.status(201).json({ user: toPublicUser(user) });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password || '', user.passwordHash);

  if (!isPasswordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  setAuthCookie(res, signToken(user));
  res.json({ user: toPublicUser(user) });
});

export const logout = catchAsync(async (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
});

export const me = catchAsync(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export const forgotPassword = catchAsync(async (req, res) => {
  if (!isEmailConfigured) {
    throw new ApiError(503, 'Password reset is unavailable right now. Please contact your household admin.');
  }

  const { email } = req.body;
  const user = await User.findOne({ email });

  // Only regular users reset via email; admin credentials are managed via env
  // config. The response is identical either way so email addresses cannot be
  // probed through this endpoint.
  if (user && user.role === ROLES.USER) {
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordTokenHash = hashResetToken(token);
    user.resetPasswordExpiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);
    await user.save();

    const resetUrl = `${env.clientUrls[0]}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your Household Grocery password',
      text: `Hi ${user.name},\n\nSomeone requested a password reset for this account. Open the link below to choose a new password. The link expires in ${PASSWORD_RESET_TOKEN_TTL_MS / 60000} minutes.\n\n${resetUrl}\n\nIf you didn't request this, you can ignore this email - your password will stay unchanged.\n\n- Household Grocery`
    });
  }

  res.json({ message: 'If that email is registered, a password reset link has been sent.' });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordTokenHash: hashResetToken(token),
    resetPasswordExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    throw ApiError.badRequest('This reset link is invalid or has expired. Please request a new one.');
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  res.json({ message: 'Password updated. You can now log in with your new password.' });
});
