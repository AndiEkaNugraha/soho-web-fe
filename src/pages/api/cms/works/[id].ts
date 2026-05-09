export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';
import { slugify } from '../../../../lib/slugify';

export async function GET({ params, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const result = await query('SELECT * FROM works WHERE id = $1', [params.id]);
  if (!result.rows.length) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  return new Response(JSON.stringify(result.rows[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT({ params, request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const cur = await query('SELECT * FROM works WHERE id = $1', [params.id]);
  if (!cur.rows.length) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  const c = cur.rows[0];
  const body = await request.json();
  const {
    title, slug: bodySlug, client_name, category, year, website_url,
    logo_url, cover_image, banner_url, banner_type,
    bg_color, grid_bg_color, accent_color,
    overview, highlight_quote, highlight_body,
    meta_title, meta_description, status, sort_order,
  } = body;

  let finalSlug = bodySlug || slugify(title || c.title);
  const slugCheck = await query('SELECT id FROM works WHERE slug = $1 AND id != $2', [finalSlug, params.id]);
  if (slugCheck.rows.length > 0) finalSlug = `${finalSlug}-${Date.now()}`;

  const result = await query(
    `UPDATE works SET
       title = $1, slug = $2, client_name = $3, category = $4, year = $5,
       website_url = $6, logo_url = $7, cover_image = $8,
       banner_url = $9, banner_type = $10, bg_color = $11, grid_bg_color = $12,
       accent_color = $13, overview = $14, highlight_quote = $15, highlight_body = $16,
       meta_title = $17, meta_description = $18, status = $19, sort_order = $20,
       updated_at = NOW()
     WHERE id = $21 RETURNING *`,
    [
      title ?? c.title, finalSlug,
      client_name ?? c.client_name, category ?? c.category, year ?? c.year,
      website_url ?? c.website_url, logo_url ?? c.logo_url, cover_image ?? c.cover_image,
      banner_url ?? c.banner_url, banner_type ?? c.banner_type,
      bg_color ?? c.bg_color, grid_bg_color ?? c.grid_bg_color, accent_color ?? c.accent_color,
      overview ?? c.overview, highlight_quote ?? c.highlight_quote, highlight_body ?? c.highlight_body,
      meta_title ?? c.meta_title, meta_description ?? c.meta_description,
      status ?? c.status, sort_order ?? c.sort_order,
      params.id,
    ]
  );

  return new Response(JSON.stringify(result.rows[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE({ params, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  await query('DELETE FROM works WHERE id = $1', [params.id]);
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
