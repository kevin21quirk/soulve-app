import { Hono } from 'hono';
import { Webhook } from 'svix';
import { sql } from '../db.js';

const webhooks = new Hono();

/**
 * POST /api/webhooks/clerk
 * Handles Clerk user lifecycle events → syncs to Neon profiles table.
 * Configure this URL in the Clerk Dashboard → Webhooks.
 */
webhooks.post('/clerk', async (c) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error('CLERK_WEBHOOK_SECRET not set');
    return c.json({ error: 'Webhook secret not configured' }, 500);
  }

  const svixId = c.req.header('svix-id');
  const svixTimestamp = c.req.header('svix-timestamp');
  const svixSignature = c.req.header('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json({ error: 'Missing svix headers' }, 400);
  }

  const rawBody = await c.req.text();
  const wh = new Webhook(secret);

  let event: {
    type: string;
    data: {
      id: string;
      email_addresses?: Array<{ email_address: string }>;
      first_name?: string;
      last_name?: string;
    };
  };

  try {
    event = wh.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as typeof event;
  } catch {
    return c.json({ error: 'Invalid webhook signature' }, 400);
  }

  const { type, data } = event;
  const clerkId = data.id;
  const email = data.email_addresses?.[0]?.email_address ?? null;
  const firstName = data.first_name ?? null;
  const lastName = data.last_name ?? null;

  if (type === 'user.created') {
    // Create a new profile row linked to this Clerk user
    await sql`
      INSERT INTO public.profiles (id, clerk_user_id, email, first_name, last_name, created_at, updated_at)
      VALUES (gen_random_uuid(), ${clerkId}, ${email}, ${firstName}, ${lastName}, now(), now())
      ON CONFLICT (clerk_user_id) DO NOTHING
    `;
  } else if (type === 'user.updated') {
    await sql`
      UPDATE public.profiles
      SET
        email      = COALESCE(${email}, email),
        first_name = COALESCE(${firstName}, first_name),
        last_name  = COALESCE(${lastName}, last_name),
        updated_at = now()
      WHERE clerk_user_id = ${clerkId}
    `;
  } else if (type === 'user.deleted') {
    // Soft-delete: nullify clerk_user_id so the row persists for audit/content
    await sql`
      UPDATE public.profiles
      SET clerk_user_id = NULL, updated_at = now()
      WHERE clerk_user_id = ${clerkId}
    `;
  }

  return c.json({ received: true });
});

export default webhooks;
