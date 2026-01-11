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
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("AUTH CONTEXT TOKEN:", accessToken);
  }, [accessToken]);

  return <AuthContext.Provider value={{ accessToken, setAccessToken }}>{children}</AuthContext.Provider>;
}
