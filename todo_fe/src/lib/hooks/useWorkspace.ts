/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { useWorkspaceApi } from "../api/workspace";

export function useWorkspace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { create } = useWorkspaceApi();

  const createNew = async (name: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await create(name);

      if (response && response.data) {
        toast("Create workspace success");
      } else {
        setError(response.message);
      }
    } catch {
      setError("Create new workspace failed!");
    } finally {
      setLoading(false);
    }
  };

  return { createNew, loading, error };
}
