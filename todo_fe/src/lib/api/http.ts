const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function http<T>(url: string, options?: RequestInit & { token?: string | null }): Promise<T> {
  const { token, ...fetchOptions } = options || {};
  const res = await fetch(`${API_URL}${url}`, {
    credentials: "include",
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let error = {};
    try {
      error = await res.json();
    } catch {}

    throw error;
  }

  return res.json();
}
