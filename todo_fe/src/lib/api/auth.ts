/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "./http";

export const authApi = {
  login: (data: { username: string; password: string }): any =>
    http("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: { name: string; email: string; password: string }) =>
    http("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: (token: string | null) => {
    return http("/auth/account", { token });
  },
};
