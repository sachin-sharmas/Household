import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { env } from './config/env.js';
import { requireDatabase } from './middleware/database.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import { apiRouter } from './routes/index.js';

export const app = express();

// Trust the first hop reverse proxy (load balancer, Render/Railway/Heroku/nginx) so
// req.ip and secure-cookie detection reflect the real client, not the proxy.
app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.clientUrls, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

if (!env.isProduction) {
  app.use(morgan('dev'));
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
  });
});

app.use('/api', apiLimiter, requireDatabase, apiRouter);

app.use(notFound);
app.use(errorHandler);
