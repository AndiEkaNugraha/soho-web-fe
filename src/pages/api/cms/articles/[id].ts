export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';
import { slugify } from '../../../../lib/slugify';

export async function GET({ params, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const result = await query(
    `SELECT a.*, c.name as category_name
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.id = $1`,
    [params.id]
  );

  if (!result.rows.length) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(result.rows[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT({ params, request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const current = await query('SELECT * FROM articles WHERE id = $1', [params.id]);
  if (!current.rows.length) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  const cur = current.rows[0];
  const body = await request.json();
  const { title, slug: bodySlug, excerpt, content, cover_image, author_name, category_id, type, status, tags, meta_title, meta_description } = body;

  let finalSlug = bodySlug || slugify(title || cur.title);
  const slugCheck = await query('SELECT id FROM articles WHERE slug = $1 AND id != $2', [finalSlug, params.id]);
  if (slugCheck.rows.length > 0) finalSlug = `${finalSlug}-${Date.now()}`;

  const nowPublished = (status ?? cur.status) === 'published';
  const wasPublished = cur.status === 'published';
  const published_at = nowPublished && !wasPublished ? new Date() : cur.published_at;

  const result = await query(
    `UPDATE articles SET
       title = $1, slug = $2, excerpt = $3, content = $4, cover_image = $5,
       author_name = $6, category_id = $7, type = $8, status = $9, tags = $10,
       meta_title = $11, meta_description = $12, published_at = $13, updated_at = NOW()
     WHERE id = $14 RETURNING *`,
    [
      title ?? cur.title,
      finalSlug,
      excerpt ?? cur.excerpt,
      content ?? cur.content,
      cover_image ?? cur.cover_image,
      author_name ?? cur.author_name,
      category_id !== undefined ? (category_id ? Number(category_id) : null) : cur.category_id,
      type ?? cur.type,
      status ?? cur.status,
      tags ?? cur.tags,
      meta_title !== undefined ? meta_title : cur.meta_title,
      meta_description !== undefined ? meta_description : cur.meta_description,
      published_at,
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

  await query('DELETE FROM articles WHERE id = $1', [params.id]);
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
