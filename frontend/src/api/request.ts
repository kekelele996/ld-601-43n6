export interface ApiErrorBody {
  code: string;
  message: string;
}

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.message ?? `请求失败（${status}）`);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = body?.code ?? "HTTP_ERROR";
  }
}

export async function request<T>(input: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(input, {
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      ...init
    });
  } catch {
    // Network failure must surface to the caller; no local mock fallback is allowed.
    throw new ApiRequestError(0, { code: "NETWORK_ERROR", message: "网络异常，请检查后端服务后重试" });
  }
  if (!res.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await res.json()) as ApiErrorBody;
    } catch {
      body = null;
    }
    throw new ApiRequestError(res.status, body);
  }
  return (await res.json()) as T;
}
