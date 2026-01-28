import { useSession } from "next-auth/react";
import { sendRequest } from "./http";
import { IProject } from "@/types/next-auth";

export function useProjectApi() {
  const { data: session } = useSession();

  return {
    list: () => {
      return sendRequest<IBackendRes<IProject[]>>({
        method: "GET",
        url: "/projects",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    },
    create: (name: string) => {
      return sendRequest<IBackendRes<IProject[]>>({
        method: "POST",
        url: "/projects",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: { name },
      });
    },
    edit: (id: string, name: string) => {
      return sendRequest<IBackendRes<IProject[]>>({
        method: "PATCH",
        url: "/projects/" + id,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: { name },
      });
    },
    remove: (id: string) => {
      return sendRequest<IBackendRes<null>>({
        method: "DELETE",
        url: "/projects/" + id,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    },
  };
}
