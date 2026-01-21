import { useSession } from "next-auth/react";
import { sendRequest } from "./http";

export function useAuthApi() {
  const { data: session } = useSession();

  return {
    logout: () => {
      return sendRequest<IBackendRes<IWorkspace[]>>({
        method: "POST",
        url: "/auth/logout",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    }
  };
}
