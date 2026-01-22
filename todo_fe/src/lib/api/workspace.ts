import { useSession } from "next-auth/react";
import { sendRequest } from "./http";

export function useWorkspaceApi() {
  const { data: session } = useSession();

  return {
    list: () => {
      return sendRequest<IBackendRes<IWorkspace[]>>({
        method: "GET",
        url: "/workspaces",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    },
    create: (name: string) => {
      return sendRequest<IBackendRes<IWorkspace>>({
        method: "POST",
        url: "/workspaces",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: { name, ownerId: session?.user.id },
      });
    },
  };
}
