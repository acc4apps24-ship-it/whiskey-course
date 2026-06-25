export const SESSION_COOKIE = "wj_session_id";

export function getSessionIdCookie(): string | null {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));

  if (!match) return null;

  return decodeURIComponent(match.split("=").slice(1).join("="));
}

export function setSessionIdCookie(sessionId: string): void {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

export function clearSessionIdCookie(): void {
  document.cookie = `${SESSION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}
