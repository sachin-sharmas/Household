import { env } from '../config/env.js';
import { logger } from './logger.js';

// Free-tier hosts (Render, etc.) spin the service down after ~15 minutes with
// no inbound traffic. Pinging our own public URL every 10 minutes counts as
// traffic and keeps the instance awake, so users never hit a cold start.
const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000;

export function startKeepAlive() {
  if (!env.keepAliveUrl) return;

  const url = `${env.keepAliveUrl.replace(/\/+$/, '')}/api/health`;
  logger.info(`Keep-alive enabled: pinging ${url} every ${KEEP_ALIVE_INTERVAL_MS / 60000} minutes`);

  const timer = setInterval(async () => {
    try {
      await fetch(url, { signal: AbortSignal.timeout(30000) });
    } catch (error) {
      logger.warn(`Keep-alive ping failed: ${error.message}`);
    }
  }, KEEP_ALIVE_INTERVAL_MS);

  timer.unref();
}
