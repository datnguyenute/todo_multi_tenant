import { http } from "./http";

export const workspaceApi = {
  list: () => http("/workspaces"),
};
