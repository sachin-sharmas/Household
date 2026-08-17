import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

export function requireDatabase(_req, _res, next) {
  if (mongoose.connection.readyState !== 1) {
    return next(
      new ApiError(503, 'Database is not connected. Configure MONGO_URI and start MongoDB, then restart the server.')
    );
  }

  next();
}
