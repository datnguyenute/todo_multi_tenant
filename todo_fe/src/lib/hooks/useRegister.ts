import { useState } from "react";
import { authApi } from "../api/auth";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (name: string, email: string, password: string, ) => {
    setLoading(true);
    setError(null);

    try {
      await authApi.register({name, email, password});
      // Redirect to Home
      window.location.href = "/auth/login";
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Register failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return {submit, loading, error};
}
