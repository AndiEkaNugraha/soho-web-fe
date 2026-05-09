export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';
import { slugify } from '../../../../lib/slugify';

export async function GET({ cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const result = await query(
    `SELECT id, title, slug, client_name, category, year, cover_image, status, sort_order, created_at
     FROM works ORDER BY sort_order ASC, created_at DESC`
  );
  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await request.json();
  const {
    title, slug: bodySlug, client_name, category, year, website_url,
    logo_url, cover_image, banner_url, banner_type,
    bg_color, grid_bg_color, accent_color,
    overview, highlight_quote, highlight_body,
    meta_title, meta_description, status,
  } = body;

  if (!title) return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });

  let slug = bodySlug || slugify(title);
  const existing = await query('SELECT id FROM works WHERE slug = $1', [slug]);
  if (existing.rows.length > 0) slug = `${slug}-${Date.now()}`;

  const maxOrder = await query('SELECT COALESCE(MAX(sort_order),0) as m FROM works');
  const sort_order = (maxOrder.rows[0]?.m || 0) + 1;

  const result = await query(
    `INSERT INTO works
       (title, slug, client_name, category, year, website_url, logo_url, cover_image,
        banner_url, banner_type, bg_color, grid_bg_color, accent_color,
        overview, highlight_quote, highlight_body, meta_title, meta_description, status, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
     RETURNING *`,
    [
      title, slug, client_name || '', category || '', year || '',
      website_url || '', logo_url || '', cover_image || '',
      banner_url || '', banner_type || 'video',
      bg_color || '#e9e8e9', grid_bg_color || '#dedbdf', accent_color || '#000000',
      overview || '', highlight_quote || 'Simplicity, elegance, innovation!',
      highlight_body || '', meta_title || '', meta_description || '',
      status || 'draft', sort_order,
    ]
  );

  return new Response(JSON.stringify(result.rows[0]), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
