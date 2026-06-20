/**
 * Simple logger utility that only logs in development mode.
 * Helps prevent console.error/warn/log from leaking into production.
 */
export const logger = {
  log: (...args) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (__DEV__) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (__DEV__) {
      console.error(...args);
    }
  },
};

export default logger;
