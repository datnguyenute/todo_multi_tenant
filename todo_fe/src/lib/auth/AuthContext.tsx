import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthToken = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing!!!");

  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  });

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    } else {
      localStorage.removeItem("access_token");
    }
  }, [accessToken]);

  return <AuthContext.Provider value={{ accessToken, setAccessToken }}>{children}</AuthContext.Provider>;
}
