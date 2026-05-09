export const prerender = false;

import { findOrCreateUser, createSession } from '../../../lib/auth';

export async function GET({ url, cookies, redirect }: any) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get('oauth_state')?.value;

  cookies.delete('oauth_state', { path: '/' });

  if (!code || !state || state !== storedState) {
    return redirect('/cms/login?error=invalid_state');
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: import.meta.env.GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: import.meta.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) throw new Error('token_exchange_failed');

    const tokens = await tokenRes.json();

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) throw new Error('userinfo_failed');

    const googleUser = await userRes.json();

    const user = await findOrCreateUser({
      id: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    });

    const sessionId = await createSession(user.id);

    cookies.set('session', sessionId, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return redirect('/cms/articles');
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    const errorCode = err.message === 'Unauthorized' ? 'unauthorized' : 'auth_failed';
    return redirect(`/cms/login?error=${errorCode}`);
  }
}
