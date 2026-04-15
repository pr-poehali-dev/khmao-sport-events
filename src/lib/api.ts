export const API = {
  auth:   'https://functions.poehali.dev/6514b651-30b4-4866-bbea-e1cf6ffbdc20',
  events: 'https://functions.poehali.dev/14f13334-7ef7-48e8-8873-8b12d76ef588',
  posts:  'https://functions.poehali.dev/9f80646a-90b3-4b52-8b7b-1142fee5b717',
  admin:  'https://functions.poehali.dev/15f6577d-e5c4-4e31-8639-5ed76069d9f4',
};

export function getSessionId(): string | null {
  return localStorage.getItem('session_id');
}

export function setSession(sessionId: string): void {
  localStorage.setItem('session_id', sessionId);
}

export function clearSession(): void {
  localStorage.removeItem('session_id');
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const sid = getSessionId();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (sid) headers['X-Session-Id'] = sid;
  return fetch(url, { ...options, headers });
}
