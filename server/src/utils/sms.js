import twilio from 'twilio';
import { env } from '../config/env.js';
import { logger } from './logger.js';

const isConfigured = Boolean(env.twilio.accountSid && env.twilio.authToken && env.twilio.phoneNumber);
const client = isConfigured ? twilio(env.twilio.accountSid, env.twilio.authToken) : null;

// Best-effort SMS send: never throws, never blocks the caller's response.
// Missing config or missing recipient phone number are silently skipped (logged).
export async function sendSms(to, message) {
  if (!isConfigured) {
    logger.warn('Skipping SMS: Twilio is not configured.');
    return;
  }

  if (!to) {
    logger.warn('Skipping SMS: recipient has no phone number on file.');
    return;
  }

  const normalizedTo = to.replace(/[\s-]/g, '');

  try {
    await client.messages.create({
      to: normalizedTo,
      from: env.twilio.phoneNumber,
      body: message
    });
  } catch (error) {
    logger.warn(`Failed to send SMS to ${to}: ${error.message}`);
  }
}
