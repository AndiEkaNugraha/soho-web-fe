import { query } from './db';

export async function createSession(userId: number): Promise<string> {
  const sessionId = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
    [sessionId, userId, expiresAt]
  );
  return sessionId;
}

export async function getSessionUser(sessionId: string | undefined) {
  if (!sessionId) return null;
  try {
    const result = await query(
      `SELECT u.id, u.email, u.name, u.avatar
       FROM sessions s
       JOIN cms_users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.expires_at > NOW()`,
      [sessionId]
    );
    return result.rows[0] || null;
  } catch {
    return null;
  }
}

export async function deleteSession(sessionId: string) {
  await query('DELETE FROM sessions WHERE id = $1', [sessionId]);
}

export async function findOrCreateUser(googleUser: {
  id: string;
  email: string;
  name: string;
  picture: string;
}) {
  const allowedEmails = import.meta.env.CMS_ALLOWED_EMAILS
    ? import.meta.env.CMS_ALLOWED_EMAILS.split(',').map((e: string) => e.trim()).filter(Boolean)
    : [];

  if (allowedEmails.length > 0 && !allowedEmails.includes(googleUser.email)) {
    throw new Error('Unauthorized');
  }

  const existing = await query('SELECT * FROM cms_users WHERE google_id = $1', [googleUser.id]);

  if (existing.rows.length > 0) {
    await query(
      'UPDATE cms_users SET email = $1, name = $2, avatar = $3 WHERE google_id = $4',
      [googleUser.email, googleUser.name, googleUser.picture, googleUser.id]
    );
    return existing.rows[0];
  }

  const result = await query(
    'INSERT INTO cms_users (google_id, email, name, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
    [googleUser.id, googleUser.email, googleUser.name, googleUser.picture]
  );
  return result.rows[0];
}
