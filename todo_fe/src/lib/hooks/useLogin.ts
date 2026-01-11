import { useState } from "react";
import { authApi } from "../api/auth";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await authApi.login({username:email, password});
      // Redirect to Home
      window.location.href = "/workspaces";
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return {submit, loading, error};
}
