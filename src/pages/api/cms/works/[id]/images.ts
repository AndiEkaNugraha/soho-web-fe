export const prerender = false;

import { query } from '../../../../../lib/db';
import { getSessionUser } from '../../../../../lib/auth';

export async function GET({ params, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const result = await query(
    'SELECT * FROM work_images WHERE work_id = $1 ORDER BY sort_order ASC, id ASC',
    [params.id]
  );
  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ params, request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await request.json();
  const { url, type, layout, alt_text } = body;

  if (!url) return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });

  const maxOrder = await query('SELECT COALESCE(MAX(sort_order),0) as m FROM work_images WHERE work_id = $1', [params.id]);
  const sort_order = (maxOrder.rows[0]?.m || 0) + 1;

  const result = await query(
    `INSERT INTO work_images (work_id, url, type, layout, alt_text, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [params.id, url, type || 'image', layout || 'full', alt_text || '', sort_order]
  );

  return new Response(JSON.stringify(result.rows[0]), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
