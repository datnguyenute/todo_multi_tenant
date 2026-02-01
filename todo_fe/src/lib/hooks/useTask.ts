/* eslint-disable @typescript-eslint/no-explicit-any */

import { useTaskApi } from "../api/tasks";

export function useTask() {
  const { create, edit, remove, listByProject, detail, listByUser } = useTaskApi();

  const list = async (projectId: string) => {
    try {
      const response = await listByProject(projectId);

      if (!response || !response.data) {
        throw new Error(response?.message || "Get tasks by project failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const listOfUser = async () => {
    try {
      const response = await listByUser();

      if (!response || !response.data) {
        throw new Error(response?.message || "Get tasks by project failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const view = async (id: string) => {
    try {
      const response = await detail(id);

      if (!response || !response.data) {
        throw new Error(response?.message || "Get task detail failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const createNew = async (title: string, projectId: string, assigneeId: string, file?: File) => {
    try {
      const response = await create(title, projectId, assigneeId, file);

      if (!response || !response.data) {
        throw new Error(response?.message || "Create task failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateTask = async (id: string, title: string, projectId: string, assigneeId: string, file?: File) => {
    try {
      const response = await edit(id, title, projectId, assigneeId, file);

      if (!response || !response.data) {
        throw new Error(response?.message || "Upddate task failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await remove(id);

      if (!response || !response.data) {
        throw new Error(response?.message || "Delete task failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { list, createNew, updateTask, deleteTask, view, listOfUser };
}
