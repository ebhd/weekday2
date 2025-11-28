// features/admin/client/adminApi.ts
async function apiRequest<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const msg = ct.includes("application/json")
      ? (await res.json()).error
      : await res.text();
    throw new Error(msg || `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiPatch = <TBody extends object, T = any>(
  url: string,
  body: TBody
) => apiRequest<T>("PATCH", url, body);

export const apiPost = <TBody extends object, T = any>(
  url: string,
  body: TBody
) => apiRequest<T>("POST", url, body);

export const apiDelete = <T = any>(url: string) => apiRequest<T>("DELETE", url);
