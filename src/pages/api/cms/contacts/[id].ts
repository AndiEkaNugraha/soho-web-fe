export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';

export async function PUT({ params, request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await request.json();
  const { status, note } = body;

  const valid = ['new', 'progress', 'done'];
  if (status && !valid.includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });
  }

  const current = await query('SELECT * FROM contact_submissions WHERE id = $1', [params.id]);
  if (!current.rows.length) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  const cur = current.rows[0];
  const result = await query(
    `UPDATE contact_submissions
     SET status = $1, note = $2
     WHERE id = $3 RETURNING *`,
    [status ?? cur.status, note !== undefined ? note : cur.note, params.id]
  );

  return new Response(JSON.stringify(result.rows[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
