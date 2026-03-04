import axios from "axios";
import { getContentLang } from "../i18n/i18n";
import { getAccessToken, getRefreshToken, setTokens, clearTokens, clearStoredUser } from "../auth/authStorage";
import { refreshApi } from "../auth/authApi";

const baseURL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL,
  timeout: 15000
});

function shouldAttachLang(url) {
  if (!url) return false;
  if (url.startsWith("/api/topics")) return true;
  if (url.includes("/lesson")) return true;
  if (url.includes("/tasks")) return true;
  if (url.includes("/test")) return true;
  return false;
}

// 1) request interceptor: lang + auth header
apiClient.interceptors.request.use((config) => {
  const url = config.url || "";

  // контентный lang
  if (shouldAttachLang(url)) {
    config.params = config.params || {};
    if (!config.params.lang) config.params.lang = getContentLang();
  }

  // bearer token
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 2) response interceptor: refresh on 401 (один refresh на все)
let isRefreshing = false;
let queue = [];

function processQueue(error, newToken) {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  queue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!error.response) throw error;

    const status = error.response.status;

    // Если 401 и это не попытка refresh/login/register — пробуем обновить токен
    const url = original?.url || "";
    const isAuthEndpoint =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/register") ||
      url.includes("/api/auth/refresh");

    if (status === 401 && !isAuthEndpoint && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        // ждём, пока завершится текущий refresh
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (newToken) => {
              original.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(original));
            },
            reject
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          clearStoredUser();
          throw error;
        }

        const data = await refreshApi({ refreshToken });
        // ожидаем новый accessToken (и иногда refreshToken)
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });

        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiClient(original);
      } catch (e) {
        processQueue(e, null);
        clearTokens();
        clearStoredUser();
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

export function normalizeApiError(error) {
  if (!error.response) {
    return {
      kind: "NETWORK",
      status: null,
      message: "Сервис временно недоступен. Проверьте интернет или попробуйте позже."
    };
  }

  const status = error.response.status;
  const serverMsg = error.response.data?.message || error.response.data?.error || null;

  if (status >= 500) return { kind: "SERVER", status, message: "Ошибка сервера. Попробуйте позже." };
  if (status === 404) return { kind: "NOT_FOUND", status, message: "Ресурс не найден." };
  if (status === 401) return { kind: "UNAUTHORIZED", status, message: "Нужно войти в аккаунт." };
  if (status === 403) return { kind: "FORBIDDEN", status, message: "Недостаточно прав доступа." };
  if (status === 429) return { kind: "RATE_LIMIT", status, message: "Слишком много запросов. Подождите немного." };

  return { kind: "CLIENT", status, message: serverMsg || "Проверьте введённые данные и попробуйте ещё раз." };
}