import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from './logger.js';

const isConfigured = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.smtp.from);
const transporter = isConfigured
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: { user: env.smtp.user, pass: env.smtp.pass }
    })
  : null;

// Best-effort email send: never throws, never blocks the caller's response.
// Missing config or missing recipient email are silently skipped (logged).
export async function sendEmail({ to, subject, text, replyTo }) {
  if (!isConfigured) {
    logger.warn('Skipping email: SMTP is not configured.');
    return;
  }

  if (!to) {
    logger.warn('Skipping email: recipient has no email on file.');
    return;
  }

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to,
      replyTo,
      subject,
      text
    });
  } catch (error) {
    logger.warn(`Failed to send email to ${to}: ${error.message}`);
  }
}
