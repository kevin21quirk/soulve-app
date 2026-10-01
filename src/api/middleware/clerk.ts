import { createMiddleware } from 'hono/factory';
import { createClerkClient } from '@clerk/backend';

// Typed context extension
declare module 'hono' {
  interface ContextVariableMap {
    clerkUserId: string;
    clerkUserEmail: string | null;
  }
}

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * requireAuth middleware — verifies the Clerk session token from the
 * Authorization: Bearer <token> header and injects clerkUserId into context.
 */
export const requireAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const payload = await clerkClient.verifyToken(token);
    c.set('clerkUserId', payload.sub);
    // email_addresses[0].email_address is on the User object, not the token
    // We set it null here; routes that need it can fetch the user
    c.set('clerkUserEmail', null);
    await next();
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
});

export { clerkClient };
