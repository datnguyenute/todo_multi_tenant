import { useAuthHttp } from "./http";

export function useWorkspaceApi() {

    const { request } = useAuthHttp();
  
  return {
    list: () => request("/workspaces")
  }
}
