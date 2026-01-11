const API_URL = process.env.NEXT_PUBLIC_API_URL!

export async function http<T>(url: string,  options: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options
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