const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:80";

interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  error: boolean;
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json();

  if (!res.ok || body.error) {
    const err = new Error(body.message || `Request failed (${res.status})`);
    (err as any).status = res.status;
    (err as any).data = body.data;
    throw err;
  }

  return body;
}
