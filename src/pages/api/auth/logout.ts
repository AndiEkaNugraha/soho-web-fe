export const prerender = false;

import { deleteSession } from '../../../lib/auth';

export async function POST({ cookies, redirect }: any) {
  const sessionId = cookies.get('session')?.value;
  if (sessionId) {
    await deleteSession(sessionId).catch(() => {});
  }
  cookies.delete('session', { path: '/' });
  return redirect('/cms/login');
}
