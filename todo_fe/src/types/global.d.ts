/* eslint-disable @typescript-eslint/no-explicit-any */
export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IWorkspace {
    id: string;
    name: string;
    members: IUser[];
  }

  interface IProject {
    id: string;
    name: string;
    updatedAt?: string;
  }

  interface ITask {
    id: string;
    title: string;
    description: string;
    projectId: string;
    assigneeid: string;
    fileBase64: string;
    updatedAt?: string;
    project?: IProject;
  }
}
