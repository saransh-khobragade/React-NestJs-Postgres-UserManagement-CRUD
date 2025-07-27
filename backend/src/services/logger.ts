/* eslint-disable no-console */
// Simple console-based logger
const getTimestamp = (): string => {
  return new Date().toISOString();
};

const logger = {
  error: (message: string, ...args: unknown[]): void => {
    console.error(`[${getTimestamp()}] ERROR:`, message, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`[${getTimestamp()}] WARN:`, message, ...args);
  },
  info: (message: string, ...args: unknown[]): void => {
    console.info(`[${getTimestamp()}] INFO:`, message, ...args);
  },
  http: (message: string, ...args: unknown[]): void => {
    console.log(`[${getTimestamp()}] HTTP:`, message, ...args);
  },
  debug: (message: string, ...args: unknown[]): void => {
    console.debug(`[${getTimestamp()}] DEBUG:`, message, ...args);
  },
};

export default logger;
