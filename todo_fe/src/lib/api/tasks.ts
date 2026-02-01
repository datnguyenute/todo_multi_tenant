import { useSession } from "next-auth/react";
import { sendRequest } from "./http";
import { ITask } from "@/types/next-auth";

export function useTaskApi() {
  const { data: session } = useSession();

  return {
    listByProject: (projectId: string) => {
      return sendRequest<IBackendRes<ITask[]>>({
        method: "GET",
        url: `/tasks/project/${projectId}`,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    },
    listByUser: () => {
      return sendRequest<IBackendRes<ITask[]>>({
        method: "GET",
        url: `/tasks/user/${session?.user.id}`,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    },
    detail: (taskId: string) => {
      return sendRequest<IBackendRes<ITask[]>>({
        method: "GET",
        url: `/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    },
    create: async (title: string, projectId: string, assigneeId: string, file?: File) => {
      const base64 = file ? await toBase64(file) : "";
      return sendRequest<IBackendRes<ITask[]>>({
        method: "POST",
        url: "/tasks",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: {
          title,
          projectId,
          assigneeId,
          fileBase64: base64,
        },
      });
    },
    edit: async (id: string, title: string, projectId: string, assigneeId: string, file?: File) => {
      const base64 = file ? await toBase64(file) : "";
      return sendRequest<IBackendRes<ITask[]>>({
        method: "PATCH",
        url: "/tasks/" + id,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: {
          title,
          projectId,
          assigneeId,
          fileBase64: base64,
        },
      });
    },
    remove: (id: string) => {
      return sendRequest<IBackendRes<null>>({
        method: "DELETE",
        url: "/tasks/" + id,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    },
  };
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
  });
