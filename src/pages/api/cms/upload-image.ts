export const prerender = false;

import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../lib/auth';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getSessionUser(cookies.get('session')?.value);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Only image files are allowed (jpg, png, gif, webp, svg)' }), { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: 'File too large (max 5MB)' }), { status: 400 });
    }

    const ext = extname(file.name).toLowerCase() || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'cms');

    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, filename), buffer);

    return new Response(JSON.stringify({ location: `/uploads/cms/${filename}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[upload-image]', err);
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
  }
};
