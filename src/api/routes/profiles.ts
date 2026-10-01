import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sql } from '../db.js';
import { requireAuth, clerkClient } from '../middleware/clerk.js';

const profiles = new Hono();

// GET /api/profiles/me  — return current user's profile.
// Lazy-provisions a Neon profile for Clerk users who signed up before the
// webhook existed (same insert shape as the clerk user.created webhook).
profiles.get('/me', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  let rows = await sql`
    SELECT * FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1
  `;

  if (!rows.length) {
    let email: string | null = null;
    let firstName: string | null = null;
    let lastName: string | null = null;
    try {
      const user = await clerkClient.users.getUser(clerkUserId);
      email = user.emailAddresses?.[0]?.emailAddress ?? null;
      firstName = user.firstName ?? null;
      lastName = user.lastName ?? null;
    } catch (err) {
      console.error('Clerk getUser failed during profile provisioning:', err);
    }
    await sql`
      INSERT INTO public.profiles (id, clerk_user_id, email, first_name, last_name, created_at, updated_at)
      VALUES (gen_random_uuid(), ${clerkUserId}, ${email}, ${firstName}, ${lastName}, now(), now())
      ON CONFLICT (clerk_user_id) DO NOTHING
    `;
    rows = await sql`
      SELECT * FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1
    `;
  }

  if (!rows.length) return c.json({ error: 'Profile not found' }, 404);

  const profile = rows[0] as Record<string, unknown>;
  const adminRows = await sql`SELECT public.is_admin(${profile.id as string}::uuid) AS ok`;
  const onboardingRows = await sql`
    SELECT EXISTS (SELECT 1 FROM public.questionnaire_responses WHERE user_id = ${profile.id as string}::uuid) AS done
  `;
  return c.json({
    ...profile,
    is_admin: adminRows[0]?.ok === true,
    onboarding_completed: onboardingRows[0]?.done === true,
  });
});

// POST /api/profiles/me/questionnaire — save onboarding questionnaire response
const questionnaireSchema = z.object({
  user_type: z.string(),
  response_data: z.any(),
  motivation: z.string().optional(),
  agree_to_terms: z.boolean(),
});
profiles.post('/me/questionnaire', requireAuth, zValidator('json', questionnaireSchema), async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const body = c.req.valid('json');
  const prof = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!prof.length) return c.json({ error: 'Profile not found' }, 404);
  const rows = await sql`
    INSERT INTO public.questionnaire_responses (user_id, user_type, response_data, motivation, agree_to_terms)
    VALUES (${prof[0].id as string}::uuid, ${body.user_type}, ${JSON.stringify(body.response_data)}, ${body.motivation ?? null}, ${body.agree_to_terms})
    RETURNING id
  `;
  return c.json(rows[0], 201);
});

// GET /api/profiles/:id  — public profile by UUID
profiles.get('/:id', async (c) => {
  const id = c.req.param('id');
  const rows = await sql`
    SELECT id, first_name, last_name, bio, avatar_url, banner_url,
           skills, interests, website, facebook, twitter, instagram, linkedin,
           location, user_type, is_founding_member, created_at
    FROM public.profiles
    WHERE id = ${id}::uuid
    LIMIT 1
  `;
  if (!rows.length) return c.json({ error: 'Profile not found' }, 404);
  return c.json(rows[0]);
});

const updateSchema = z.object({
  first_name:   z.string().max(100).optional(),
  last_name:    z.string().max(100).optional(),
  bio:          z.string().max(2000).optional(),
  location:     z.string().max(200).optional(),
  phone:        z.string().max(50).optional().nullable(),
  website:      z.string().url().optional().nullable(),
  facebook:     z.string().optional().nullable(),
  twitter:      z.string().optional().nullable(),
  instagram:    z.string().optional().nullable(),
  linkedin:     z.string().optional().nullable(),
  skills:       z.array(z.string()).optional(),
  interests:    z.array(z.string()).optional(),
  avatar_url:   z.string().url().optional().nullable(),
  banner_url:   z.string().url().optional().nullable(),
  banner_type:  z.string().optional().nullable(),
  user_type:    z.enum(['individual', 'organisation', 'business', 'admin']).optional(),
});

// PATCH /api/profiles/me  — update current user's profile
profiles.patch('/me', requireAuth, zValidator('json', updateSchema), async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const body = c.req.valid('json');

  // Only update supplied fields
  const sets: string[] = [];
  const vals: unknown[] = [];
  const addField = (col: string, val: unknown) => {
    if (val !== undefined) { sets.push(`${col} = $${vals.length + 1}`); vals.push(val); }
  };

  addField('first_name',  body.first_name);
  addField('last_name',   body.last_name);
  addField('bio',         body.bio);
  addField('location',    body.location);
  addField('phone',       body.phone);
  addField('website',     body.website);
  addField('facebook',    body.facebook);
  addField('twitter',     body.twitter);
  addField('instagram',   body.instagram);
  addField('linkedin',    body.linkedin);
  addField('skills',      body.skills);
  addField('interests',   body.interests);
  addField('avatar_url',  body.avatar_url);
  addField('banner_url',  body.banner_url);
  addField('banner_type', body.banner_type);
  addField('user_type',   body.user_type);

  if (!sets.length) return c.json({ error: 'No fields to update' }, 400);

  sets.push(`updated_at = now()`);
  vals.push(clerkUserId);

  const updateSql = `
    UPDATE public.profiles
    SET ${sets.join(', ')}
    WHERE clerk_user_id = $${vals.length}
    RETURNING *
  `;

  const rows = await sql.query(updateSql, vals);
  if (!rows.length) return c.json({ error: 'Profile not found' }, 404);
  return c.json(rows[0]);
});

// GET /api/profiles  — search/list profiles
profiles.get('/', async (c) => {
  const q = c.req.query('q');
  const limit = Math.min(Number(c.req.query('limit') ?? 20), 50);
  const offset = Number(c.req.query('offset') ?? 0);

  if (q) {
    const rows = await sql`
      SELECT id, first_name, last_name, avatar_url, bio, user_type, location
      FROM public.profiles
      WHERE first_name ILIKE ${'%' + q + '%'}
         OR last_name  ILIKE ${'%' + q + '%'}
      ORDER BY first_name, last_name
      LIMIT ${limit} OFFSET ${offset}
    `;
    return c.json(rows);
  }

  const rows = await sql`
    SELECT id, first_name, last_name, avatar_url, bio, user_type, location
    FROM public.profiles
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return c.json(rows);
});

export default profiles;
