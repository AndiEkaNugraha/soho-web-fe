export const prerender = false;

import { query } from '../../../../lib/db';
import { getSessionUser } from '../../../../lib/auth';

export async function PUT({ params, request, cookies }: any) {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await request.json();
  const { meta_title, meta_description, og_image } = body;

  const result = await query(
    `UPDATE page_seo
     SET meta_title = $1, meta_description = $2, og_image = $3, updated_at = NOW()
     WHERE page_key = $4
     RETURNING *`,
    [meta_title ?? '', meta_description ?? '', og_image ?? '', params.key]
  );

  if (!result.rows.length) {
    return new Response(JSON.stringify({ error: 'Page not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(result.rows[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
