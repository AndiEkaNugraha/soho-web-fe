export const prerender = false;

export async function GET({ cookies, redirect }: any) {
  const state = crypto.randomUUID().replace(/-/g, '');

  cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });

  const params = new URLSearchParams({
    client_id: import.meta.env.GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
