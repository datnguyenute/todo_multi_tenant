/* eslint-disable @typescript-eslint/no-explicit-any */

import { useProjectApi } from "../api/projects";

export function useProject() {
  const { create, edit, remove } = useProjectApi();

  const createNew = async (name: string) => {
    try {
      const response = await create(name);

      if (!response || !response.data) {
        throw new Error(response?.message || "Create project failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateProject = async (id: string, name: string) => {
    try {
      const response = await edit(id, name);

      if (!response || !response.data) {
        throw new Error(response?.message || "Upddate project failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await remove(id);

      if (!response || !response.data) {
        throw new Error(response?.message || "Upddate project failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { createNew, updateProject, deleteProject };
}
