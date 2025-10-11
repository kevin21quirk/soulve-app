/**
 * Production-safe logging utility
 * Only logs in development mode to reduce console noise
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = import.meta.env.DEV;

class Logger {
  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }

  debug(message: string, data?: any) {
    if (isDev) {
      console.log(this.formatMessage('debug', message), data || '');
    }
  }

  info(message: string, data?: any) {
    if (isDev) {
      console.info(this.formatMessage('info', message), data || '');
    }
  }

  warn(message: string, data?: any) {
    if (isDev) {
      console.warn(this.formatMessage('warn', message), data || '');
    }
  }

  error(message: string, error?: any) {
    // Always log errors, even in production (for monitoring)
    console.error(this.formatMessage('error', message), error || '');
  }
}

export const logger = new Logger();
