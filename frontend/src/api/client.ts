import { getAccessToken } from "../auth/AuthContext";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function buildHeaders(extra?: HeadersInit, includeAuth = true): Headers {
  const headers = new Headers(extra);
  if (includeAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
}

interface RequestOptions extends RequestInit {
  /** Attach the in-memory access token as a Bearer header. Defaults to true. */
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: buildHeaders(headers, auth),
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: "GET" });
}

export function apiPostJson<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
  const headers = new Headers(options?.headers);
  headers.set("Content-Type", "application/json");
  return request<T>(path, {
    ...options,
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}
