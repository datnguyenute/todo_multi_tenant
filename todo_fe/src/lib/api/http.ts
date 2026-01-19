import { useAuth } from "../auth/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export function useAuthHttp() {
  const { accessToken, setAccessToken, logout } = useAuth();

  async function request<T>(url: string, init?: RequestInit, overrideToken?: string): Promise<T> {
    const tokenToUse = overrideToken ?? accessToken;
    const res = await fetch(`${API_URL}${url}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init?.headers || {}),
        ...(tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {}),
      },
    });

    if (res.status !== 401) {
      return res.json();
    }
    // Authentication
    const newToken = await refreshToken();

    if (!newToken) {
      console.log("LOGGGGOUT");
      logout();
      return Promise.reject(null);
    }

    setAccessToken(newToken);
    return request<T>(url, init, newToken);
  }

  return { request };
}

export function useHttp() {
  async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${url}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init?.headers || {}),
      },
    });

    return res.json();
  }

  return { request };
}

async function refreshToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = fetch(`${API_URL}/auth/refresh`, {
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = await res.json();
      return data.access_token as string;
    })
    .finally(() => {
      isRefreshing = false;
    });

  return refreshPromise;
}

export const sendRequest = async <T>(props: IRequest) => {
  const { url, method, body, useCredentials = false, headers = {}, nextOption = {} } = props;

  const options = {
    method: method,
    headers: new Headers({ "content-type": "application/json", ...headers }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";

  // if (queryParams) {
  //   url = `${url}?${queryString.stringify(queryParams)}`;
  // }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T; //generic
    } else {
      return res.json().then(function (json) {
        return {
          statusCode: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T;
      });
    }
  });
};
