export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';
import { slugify } from '../../../../lib/slugify';

export async function PUT({ params, request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await request.json();
  const { name, description } = body;

  const current = await query('SELECT * FROM categories WHERE id = $1', [params.id]);
  if (!current.rows.length) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  const cur = current.rows[0];
  const newName = name ?? cur.name;
  const newSlug = name ? slugify(name) : cur.slug;
  const newDesc = description !== undefined ? description : cur.description;

  if (name) {
    const slugCheck = await query('SELECT id FROM categories WHERE slug = $1 AND id != $2', [newSlug, params.id]);
    if (slugCheck.rows.length > 0) {
      return new Response(JSON.stringify({ error: 'Category with this name already exists' }), { status: 409 });
    }
  }

  const result = await query(
    'UPDATE categories SET name = $1, slug = $2, description = $3 WHERE id = $4 RETURNING *',
    [newName, newSlug, newDesc, params.id]
  );

  return new Response(JSON.stringify(result.rows[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE({ params, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  await query('DELETE FROM categories WHERE id = $1', [params.id]);
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
