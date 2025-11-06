/**
 * Secure error handling utility for edge functions
 * Sanitizes error messages to prevent information leakage
 */

export type ErrorCategory = 'auth' | 'validation' | 'not_found' | 'rate_limit' | 'service' | 'unknown';

interface SafeErrorResponse {
  error: string;
  code?: string;
}

/**
 * Categorize errors and return safe error messages for clients
 */
export function sanitizeError(error: any): SafeErrorResponse {
  // Log full error server-side for debugging
  console.error('Full error details (server-side only):', {
    message: error.message,
    stack: error.stack,
    cause: error.cause,
    timestamp: new Date().toISOString()
  });

  // Return safe error messages to clients
  const errorMessage = error.message?.toLowerCase() || '';

  // Authentication errors
  if (errorMessage.includes('unauthorized') || 
      errorMessage.includes('authentication') || 
      errorMessage.includes('jwt') ||
      errorMessage.includes('no authorization')) {
    return {
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    };
  }

  // Validation errors
  if (errorMessage.includes('invalid') || 
      errorMessage.includes('validation') ||
      errorMessage.includes('missing required')) {
    return {
      error: 'Invalid request data',
      code: 'VALIDATION_ERROR'
    };
  }

  // Rate limiting
  if (errorMessage.includes('rate limit') || 
      errorMessage.includes('too many requests') ||
      error.status === 429) {
    return {
      error: 'Too many requests. Please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    };
  }

  // Not found errors
  if (errorMessage.includes('not found') || 
      errorMessage.includes('no data') ||
      error.status === 404) {
    return {
      error: 'Resource not found',
      code: 'NOT_FOUND'
    };
  }

  // Service/API errors (external services, email, AI, etc.)
  if (errorMessage.includes('api') || 
      errorMessage.includes('service') ||
      errorMessage.includes('email') ||
      errorMessage.includes('resend') ||
      errorMessage.includes('lovable') ||
      errorMessage.includes('credits') ||
      error.status === 402 ||
      error.status === 503) {
    return {
      error: 'Service temporarily unavailable. Please try again later',
      code: 'SERVICE_UNAVAILABLE'
    };
  }

  // Database errors (never expose schema details)
  if (errorMessage.includes('database') || 
      errorMessage.includes('postgres') ||
      errorMessage.includes('supabase') ||
      errorMessage.includes('foreign key') ||
      errorMessage.includes('constraint') ||
      errorMessage.includes('duplicate key')) {
    return {
      error: 'Unable to process request',
      code: 'PROCESSING_ERROR'
    };
  }

  // Default safe error message
  return {
    error: 'An error occurred while processing your request',
    code: 'INTERNAL_ERROR'
  };
}

/**
 * Create a safe error response with CORS headers
 */
export function createErrorResponse(
  error: any, 
  status: number = 500,
  corsHeaders: Record<string, string>
): Response {
  const safeError = sanitizeError(error);
  
  return new Response(
    JSON.stringify(safeError),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
}
