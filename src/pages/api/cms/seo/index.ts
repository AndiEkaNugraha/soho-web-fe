export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';

export async function GET({ cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const result = await query('SELECT * FROM page_seo ORDER BY id ASC');
  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}
