import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sql } from '../db';
import { requireAuth } from '../middleware/clerk';

const organizations = new Hono();

const createSchema = z.object({
  name:          z.string().min(1).max(500),
  description:   z.string().optional().nullable(),
  website:       z.string().url().optional().nullable(),
  logo_url:      z.string().url().optional().nullable(),
  contact_email: z.string().email().optional().nullable(),
  location:      z.string().optional().nullable(),
  org_type:      z.string().optional().nullable(),
  charity_number: z.string().optional().nullable(),
});

// GET /api/organizations
organizations.get('/', async (c) => {
  const limit  = Math.min(Number(c.req.query('limit') ?? 20), 50);
  const offset = Number(c.req.query('offset') ?? 0);
  const q = c.req.query('q');

  const rows = q
    ? await sql`
        SELECT id, name, description, logo_url, website, location, org_type, created_at
        FROM public.organizations
        WHERE name ILIKE ${'%' + q + '%'} AND is_active = true
        ORDER BY name
        LIMIT ${limit} OFFSET ${offset}
      `
    : await sql`
        SELECT id, name, description, logo_url, website, location, org_type, created_at
        FROM public.organizations
        WHERE is_active = true
        ORDER BY name
        LIMIT ${limit} OFFSET ${offset}
      `;

  return c.json(rows);
});

// GET /api/organizations/:id
organizations.get('/:id', async (c) => {
  const id = c.req.param('id');
  const rows = await sql`
    SELECT o.*, om.role AS member_role
    FROM public.organizations o
    LEFT JOIN public.organization_members om ON om.organization_id = o.id
    WHERE o.id = ${id}::uuid AND o.is_active = true
    LIMIT 1
  `;
  if (!rows.length) return c.json({ error: 'Organization not found' }, 404);
  return c.json(rows[0]);
});

// GET /api/organizations/:id/members
organizations.get('/:id/members', requireAuth, async (c) => {
  const id = c.req.param('id');
  const rows = await sql`
    SELECT om.role, om.created_at, pr.id, pr.first_name, pr.last_name, pr.avatar_url
    FROM public.organization_members om
    JOIN public.profiles pr ON pr.id = om.user_id
    WHERE om.organization_id = ${id}::uuid
    ORDER BY pr.first_name, pr.last_name
  `;
  return c.json(rows);
});

// POST /api/organizations
organizations.post('/', requireAuth, zValidator('json', createSchema), async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const body = c.req.valid('json');

  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Profile not found' }, 404);
  const ownerId = profile[0].id;

  const org = await sql`
    INSERT INTO public.organizations
      (name, description, website, logo_url, contact_email, location, org_type,
       charity_number, owner_id, is_active)
    VALUES
      (${body.name}, ${body.description ?? null}, ${body.website ?? null},
       ${body.logo_url ?? null}, ${body.contact_email ?? null}, ${body.location ?? null},
       ${body.org_type ?? null}, ${body.charity_number ?? null}, ${ownerId}::uuid, true)
    RETURNING *
  `;

  // Add creator as admin member
  await sql`
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (${org[0].id}::uuid, ${ownerId}::uuid, 'admin')
    ON CONFLICT DO NOTHING
  `;

  return c.json(org[0], 201);
});

// POST /api/organizations/:id/members  — invite/add member
organizations.post('/:id/members', requireAuth, async (c) => {
  const clerkUserId = c.get('clerkUserId');
  const orgId = c.req.param('id');
  const { user_id, role = 'member' } = await c.req.json<{ user_id: string; role?: string }>();

  // Verify requester is org admin
  const profile = await sql`SELECT id FROM public.profiles WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;
  if (!profile.length) return c.json({ error: 'Unauthorized' }, 403);

  const isAdmin = await sql`
    SELECT 1 FROM public.organization_members
    WHERE organization_id = ${orgId}::uuid AND user_id = ${profile[0].id}::uuid AND role = 'admin'
    LIMIT 1
  `;
  if (!isAdmin.length) return c.json({ error: 'Forbidden: not an admin' }, 403);

  await sql`
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (${orgId}::uuid, ${user_id}::uuid, ${role})
    ON CONFLICT (organization_id, user_id) DO UPDATE SET role = EXCLUDED.role
  `;

  return c.json({ added: true });
});

export default organizations;
