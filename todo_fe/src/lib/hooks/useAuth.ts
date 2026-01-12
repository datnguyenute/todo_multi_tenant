/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { useAuthToken } from "@/lib/auth/AuthContext";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    let cancelled = false;

    async function fetchMe() {
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const me = await authApi.me(accessToken);
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMe();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);
  return { user, loading };
}
