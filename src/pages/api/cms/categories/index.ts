export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';
import { slugify } from '../../../../lib/slugify';

export async function GET({ cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const result = await query(`
    SELECT c.*, COUNT(a.id)::int as article_count
    FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id
    GROUP BY c.id
    ORDER BY c.name
  `);

  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await request.json();
  const { name, description } = body;

  if (!name) return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });

  const slug = slugify(name);

  const slugCheck = await query('SELECT id FROM categories WHERE slug = $1', [slug]);
  if (slugCheck.rows.length > 0) {
    return new Response(JSON.stringify({ error: 'Category with this name already exists' }), { status: 409 });
  }

  const result = await query(
    'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
    [name, slug, description || '']
  );

  return new Response(JSON.stringify(result.rows[0]), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
