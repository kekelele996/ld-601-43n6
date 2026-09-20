import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface ApiErrorBody {
  code?: string;
  message?: string;
}

const fallbackMessage = (code: string, fallback: string) =>
  (ERROR_MESSAGES as Record<string, string>)[code] ?? fallback;

// 所有接口请求统一经此封装：服务端失败直接抛出，禁止回退本地假数据
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      ...init
    });
  } catch {
    throw new ApiError(0, ERROR_CODES.NETWORK_ERROR, ERROR_MESSAGES.NETWORK_ERROR);
  }

  if (!res.ok) {
    let body: ApiErrorBody = {};
    try {
      body = (await res.json()) as ApiErrorBody;
    } catch {
      body = {};
    }
    // 服务端消息优先；缺失时按错误码映射本地文案
    const code = body.code ?? ERROR_CODES.INTERNAL_ERROR;
    const message = body.message ?? fallbackMessage(code, `请求失败（${res.status}）`);
    throw new ApiError(res.status, code, message);
  }

  return (await res.json()) as T;
}
