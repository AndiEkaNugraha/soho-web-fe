export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';
import { slugify } from '../../../../lib/slugify';

export async function GET({ request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const status = url.searchParams.get('status');
  const categoryId = url.searchParams.get('category_id');

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (type) { conditions.push(`a.type = $${params.length + 1}`); params.push(type); }
  if (status) { conditions.push(`a.status = $${params.length + 1}`); params.push(status); }
  if (categoryId) { conditions.push(`a.category_id = $${params.length + 1}`); params.push(categoryId); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(
    `SELECT a.*, c.name as category_name
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     ${where}
     ORDER BY a.created_at DESC`,
    params
  );

  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await request.json();
  const { title, excerpt, content, cover_image, author_name, category_id, type, status, tags, meta_title, meta_description } = body;

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
  }

  let slug = slugify(title);
  const existing = await query('SELECT id FROM articles WHERE slug = $1', [slug]);
  if (existing.rows.length > 0) slug = `${slug}-${Date.now()}`;

  const published_at = status === 'published' ? new Date() : null;

  const result = await query(
    `INSERT INTO articles
       (title, slug, excerpt, content, cover_image, author_name, category_id, type, status, tags, meta_title, meta_description, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      title, slug, excerpt || '', content || '',
      cover_image || '', author_name || '',
      category_id ? Number(category_id) : null,
      type || 'blog', status || 'draft',
      tags || '', meta_title || '', meta_description || '', published_at,
    ]
  );

  return new Response(JSON.stringify(result.rows[0]), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
