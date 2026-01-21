/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/router";
import { sendRequest } from "../api/http";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await sendRequest<IBackendRes<any>>({
        url: "/auth/register",
        method: "POST",
        body: { name, email, password },
      });

      if (response && response.data) {
        // Redirect to Login
        router.replace("/auth/login");
      } else {
        setError(response.message);
      }
    } catch {
      setError("Register failed!");
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
