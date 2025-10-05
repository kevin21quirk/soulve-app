import { z } from 'zod';

/**
 * Authentication helper utilities
 */

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email is too short')
  .max(255, 'Email is too long')
  .transform((email) => email.toLowerCase().trim());

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens and apostrophes')
  .transform((name) => name.trim());

// Complete signup form schema
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Get user-friendly auth error message
 */
export const getAuthErrorMessage = (error: any): string => {
  const message = error?.message?.toLowerCase() || '';
  
  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (message.includes('email not confirmed')) {
    return 'Please verify your email address before signing in. Check your inbox for the verification link.';
  }
  
  if (message.includes('user already registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  
  if (message.includes('email rate limit')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  
  if (message.includes('network')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (message.includes('password')) {
    return 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers.';
  }
  
  // Return original error message if we don't have a specific handler
  return error?.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Check if email needs verification
 */
export const needsEmailVerification = (error: any): boolean => {
  return error?.message?.toLowerCase().includes('email not confirmed');
};

/**
 * Generate secure redirect URL
 */
export const getRedirectUrl = (path: string = '/'): string => {
  const origin = window.location.origin;
  return `${origin}${path}`;
};

/**
 * Sanitize redirect URL to prevent open redirect vulnerabilities
 */
export const sanitizeRedirectUrl = (url: string | null): string => {
  if (!url) return '/dashboard';
  
  // Only allow relative URLs or same-origin URLs
  try {
    const parsedUrl = new URL(url, window.location.origin);
    if (parsedUrl.origin === window.location.origin) {
      return parsedUrl.pathname + parsedUrl.search;
    }
  } catch {
    // Invalid URL, return default
  }
  
  return '/dashboard';
};

/**
 * Password strength calculator
 */
export const calculatePasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  if (score <= 2) {
    return { score, label: 'Weak', color: 'text-red-600' };
  } else if (score <= 4) {
    return { score, label: 'Fair', color: 'text-orange-600' };
  } else if (score <= 5) {
    return { score, label: 'Good', color: 'text-yellow-600' };
  } else {
    return { score, label: 'Strong', color: 'text-green-600' };
  }
};

/**
 * Format session expiry time
 */
export const formatSessionExpiry = (expiresAt: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const secondsUntilExpiry = expiresAt - now;
  
  if (secondsUntilExpiry <= 0) {
    return 'Expired';
  }
  
  const minutes = Math.floor(secondsUntilExpiry / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
};
