import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        username: email,
        password: password,
        redirect: false,
      });

      if (!res?.error) {
        router.replace("/");
      } else {
        setError(res.error);
      }
    } catch {
      setError("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
