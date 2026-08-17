import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const RETRY_INTERVAL_MS = 10000;

export async function connectDb(onConnected) {
  mongoose.set('bufferCommands', false);
  mongoose.set('strictQuery', true);
  mongoose.connection.on('error', (error) => {
    logger.warn(`MongoDB connection error: ${error.message}`);
  });

  if (!env.mongoUri) {
    logger.warn('MONGO_URI is not set. API will start, but database routes will fail until MongoDB is configured.');
    return false;
  }

  const options = { serverSelectionTimeoutMS: 10000 };

  if (env.mongoTlsCertFile) {
    options.tlsCertificateKeyFile = env.mongoTlsCertFile;
  }

  try {
    await mongoose.connect(env.mongoUri, options);
    logger.info('MongoDB connected');
    return true;
  } catch (error) {
    logger.warn(`MongoDB connection failed: ${error.message}`);
    logger.warn(`Retrying in the background every ${RETRY_INTERVAL_MS / 1000}s...`);
    scheduleReconnect(env.mongoUri, options, onConnected);
    return false;
  }
}

export async function disconnectDb() {
  await mongoose.connection.close();
}

function scheduleReconnect(uri, options, onConnected) {
  const timer = setInterval(async () => {
    try {
      await mongoose.connect(uri, options);
      logger.info('MongoDB connected (background retry)');
      clearInterval(timer);
      await onConnected?.();
    } catch (error) {
      logger.warn(`MongoDB reconnect attempt failed: ${error.message}`);
    }
  }, RETRY_INTERVAL_MS);
  timer.unref();
}
