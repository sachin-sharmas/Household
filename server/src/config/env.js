import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

if (isProduction) {
  const missing = ['JWT_SECRET', 'MONGO_URI'].filter((key) => !process.env[key]);
  if (missing.length) {
    logger.error(`Missing required environment variable(s) in production: ${missing.join(', ')}`);
    process.exit(1);
  }
} else if (!process.env.JWT_SECRET) {
  logger.warn('JWT_SECRET is not set. Falling back to an insecure development secret.');
}

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 5000,
  // CLIENT_URL accepts a comma-separated list so extra origins
  // (e.g. Vercel preview deployments) can be allowed alongside production.
  // Trailing slashes are stripped because the browser's Origin header never
  // includes one, and the cors package matches origins by exact string.
  clientUrls: (process.env.CLIENT_URL || 'https://household-six-blush.vercel.app')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  // Public URL of this API; when set, the server pings itself to stay awake
  // on free-tier hosts. Render provides RENDER_EXTERNAL_URL automatically.
  keepAliveUrl: process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL,
  mongoUri: process.env.MONGO_URI,
  mongoTlsCertFile: process.env.MONGO_TLS_CERT_FILE,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  // Secure (SameSite=None) cookies are required when the frontend is served
  // from a different site than the API. Default to secure in production;
  // COOKIE_SECURE overrides in either direction.
  cookieSecure: process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE.toLowerCase() === 'true'
    : isProduction,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@grocery.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@12345',
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT || 'mailto:admin@grocery.com'
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM
  }
};

if (env.isProduction && !env.cookieSecure) {
  logger.warn('COOKIE_SECURE is not "true" in production. Auth cookies will not be marked Secure.');
}

if (!env.vapid.publicKey || !env.vapid.privateKey) {
  logger.warn('VAPID keys are not set. Browser push notifications will be disabled. Generate keys with: npx web-push generate-vapid-keys');
}

if (!env.twilio.accountSid || !env.twilio.authToken || !env.twilio.phoneNumber) {
  logger.warn('Twilio credentials are not fully set. SMS notifications will be disabled.');
}

if (!env.smtp.host || !env.smtp.user || !env.smtp.pass || !env.smtp.from) {
  logger.warn('SMTP credentials are not fully set. Email notifications will be disabled.');
}
