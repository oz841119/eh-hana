export interface AuthUser {
  id: string;
  email: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL ?? "";

export async function fetchMe(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    return (await res.json()) as AuthUser;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
