import { app } from './app.js';
import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';
import { seedDefaults } from './seed/index.js';
import { startKeepAlive } from './utils/keepAlive.js';
import { logger } from './utils/logger.js';

async function start() {
  const dbConnected = await connectDb(seedDefaults);
  if (dbConnected) {
    await seedDefaults();
  }

  const server = app.listen(env.port, () => {
    logger.info(`Household Grocery Management API running on http://localhost:${env.port}`);
  });

  startKeepAlive();

  const shutdown = (signal) => async () => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown('SIGTERM'));
  process.on('SIGINT', shutdown('SIGINT'));
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

start();
