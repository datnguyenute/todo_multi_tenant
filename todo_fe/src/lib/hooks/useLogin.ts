import { useState } from "react";
import { authApi } from "../api/auth";
import { useRouter } from "next/router";
import { useAuthToken } from "@/lib/auth/AuthContext";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const authToken = useAuthToken();

  const submit = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login({ username: email, password });
      console.log("LOGIN RES:", res)
      authToken.setAccessToken(res?.access_token);
      // Redirect to Home
      router.push("/workspaces");
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

  return { submit, loading, error };
}
