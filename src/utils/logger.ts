// Production-safe logger utility

const isDev = import.meta.env.DEV;

export const devLogger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  
  debug: (...args: any[]) => {
    if (isDev) console.debug(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
};

