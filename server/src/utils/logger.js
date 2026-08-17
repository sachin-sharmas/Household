const LEVELS = ['error', 'warn', 'info', 'debug'];

function timestamp() {
  return new Date().toISOString();
}

function log(level, message, meta) {
  const line = `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
  const args = meta !== undefined ? [line, meta] : [line];

  if (level === 'error') console.error(...args);
  else if (level === 'warn') console.warn(...args);
  else console.log(...args);
}

export const logger = Object.fromEntries(LEVELS.map((level) => [level, (message, meta) => log(level, message, meta)]));
