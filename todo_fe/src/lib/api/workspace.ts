import { http } from "./http";

export const workspaceApi = {
  list: (token: string | null) => http("/workspaces", { token }),
};
