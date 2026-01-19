import { useHttp } from "@/lib/api/http";

type LoginPayload = {
  username: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export function useAuthApi() {
  const { request } = useHttp();

  return {
    login: (data: LoginPayload) =>
      request<{
        access_token: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),

    register: (data: RegisterPayload) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),

    me: () => request("/auth/account"),

    refresh: () =>
      request<{ access_token: string }>("/auth/refresh", {
        method: "POST",
      }),
  };
}
