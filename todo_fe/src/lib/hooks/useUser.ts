/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserApi } from "../api/users";

export function useUser() {
  const { create, edit, remove } = useUserApi();

  const createNew = async (name: string, email: string, password: string) => {
    try {
      const response = await create(name, email, password);

      if (!response || !response.data) {
        throw new Error(response?.message || "Create user failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (id: string, name: string, email: string, password: string) => {
    try {
      const response = await edit(id, name, email, password);

      if (!response || !response.data) {
        throw new Error(response?.message || "Upddate user failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await remove(id);

      if (!response || !response.data) {
        throw new Error(response?.message || "Upddate user failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { createNew, updateUser, deleteUser };
}
