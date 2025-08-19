
/**
 * Security utilities for input validation and XSS protection
 */

/**
 * Enhanced HTML sanitization to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div to contain the HTML
  const div = document.createElement('div');
  div.textContent = html;
  
  // Remove any remaining HTML entities that could be dangerous
  return div.innerHTML
    .replace(/&lt;script/gi, '&amp;lt;script')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '');
};

/**
 * Validate and sanitize user input
 */
export const validateInput = {
  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  /**
   * Validate username (alphanumeric, underscore, hyphen)
   */
  username: (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  },

  /**
   * Enhanced text sanitization for display
   */
  text: (text: string): string => {
    if (!text) return '';
    return text
      .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data URLs
      .trim()
      .substring(0, 1000); // Limit length
  },

  /**
   * Validate URL format
   */
  url: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  /**
   * Enhanced search query sanitization
   */
  searchQuery: (query: string): string => {
    if (!query) return '';
    return query
      .replace(/[<>'"&;()]/g, '') // Remove dangerous characters
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/data:/gi, '') // Remove data URLs
      .replace(/vbscript:/gi, '') // Remove vbscript protocol
      .replace(/--/g, '') // Remove SQL comment markers
      .replace(/\/\*/g, '') // Remove SQL block comment start
      .replace(/\*\//g, '') // Remove SQL block comment end
      .trim()
      .substring(0, 100); // Limit search query length
  },

  /**
   * Server-side validation for critical operations
   */
  serverValidation: {
    isValidPostContent: (content: string): boolean => {
      if (!content || content.length > 5000) return false;
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i,
        /data:text\/html/i,
        /vbscript:/i
      ];
      return !suspiciousPatterns.some(pattern => pattern.test(content));
    },
    
    isValidEmail: (email: string): boolean => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email) && email.length <= 254 && !email.includes('..') && !email.startsWith('.') && !email.endsWith('.');
    },
    
    isValidUrl: (url: string): boolean => {
      try {
        const urlObj = new URL(url);
        return ['http:', 'https:'].includes(urlObj.protocol) && 
               !urlObj.hostname.includes('localhost') &&
               !urlObj.hostname.startsWith('127.') &&
               !urlObj.hostname.startsWith('192.168.');
      } catch {
        return false;
      }
    }
  },
};

/**
 * Content Security Policy helpers
 */
export const csp = {
  /**
   * Generate a nonce for inline scripts
   */
  generateNonce: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Validate that a script source is allowed
   */
  isAllowedSource: (src: string): boolean => {
    const allowedDomains = [
      'cdn.gpteng.co',
      'localhost',
      window.location.hostname,
    ];
    
    try {
      const url = new URL(src);
      return allowedDomains.includes(url.hostname);
    } catch {
      return false;
    }
  },
};

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  /**
   * Check if request is within rate limit
   */
  isAllowed(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  /**
   * Clean up old entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [identifier, requests] of this.requests) {
      const validRequests = requests.filter(time => time > now - 3600000); // Keep last hour
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Clean up rate limiter every hour
setInterval(() => rateLimiter.cleanup(), 3600000);
