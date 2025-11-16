// lib/connecteam.ts
const BASE_URL = process.env.CONNECTTEAM_API_BASE_URL!;
const API_KEY = process.env.CONNECTTEAM_API_KEY!;

if (!BASE_URL || !API_KEY) {
  throw new Error("Connecteam API env vars are not set");
}

export async function connecteamFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Connecteam API error ${res.status}: ${body || res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}
