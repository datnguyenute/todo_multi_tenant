import { useSession } from "next-auth/react";
import { sendRequest } from "./http";
import { IUser } from "@/types/next-auth";

export function useUserApi() {
  const { data: session } = useSession();

  return {
    list: () => {
      return sendRequest<IBackendRes<IUser[]>>({
        method: "GET",
        url: "/users",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    },
    create: (name: string, email: string, password: string) => {
      return sendRequest<IBackendRes<IUser[]>>({
        method: "POST",
        url: "/users",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: { name, email, password },
      });
    },
    edit: (id: number, name: string, email: string, password: string) => {
      return sendRequest<IBackendRes<IUser[]>>({
        method: "PATCH",
        url: "/users/" + id,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: { name, email, password },
      });
    },
  };
}
