export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';

export async function PUT({ params, request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const cur = await query('SELECT * FROM work_images WHERE id = $1', [params.imageId]);
  if (!cur.rows.length) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  const c = cur.rows[0];
  const body = await request.json();
  const { url, type, layout, alt_text, sort_order } = body;

  const result = await query(
    `UPDATE work_images SET
       url = $1, type = $2, layout = $3, alt_text = $4, sort_order = $5
     WHERE id = $6 RETURNING *`,
    [
      url ?? c.url,
      type ?? c.type,
      layout ?? c.layout,
      alt_text ?? c.alt_text,
      sort_order ?? c.sort_order,
      params.imageId,
    ]
  );

  return new Response(JSON.stringify(result.rows[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE({ params, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  await query('DELETE FROM work_images WHERE id = $1', [params.imageId]);
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
