/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { useAuthToken } from "@/lib/auth/AuthContext";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    console.log('> useAuth accessToken: ', accessToken);
    // if (!accessToken) {
    //   setLoading(false);
    //   return;
    // }

    authApi
      .me(accessToken)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [accessToken]);

  return { user, loading };
}
