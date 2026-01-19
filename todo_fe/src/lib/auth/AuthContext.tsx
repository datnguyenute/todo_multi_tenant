import { createContext, useContext, useState } from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  isInitializing: boolean | true;
  setIsInitializing: (value: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.log("AuthProvider missing!!!");
    throw new Error("AuthProvider missing!!!");
  }

  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  function logout() {
    console.log("setAccessToken setNull");
    setAccessToken(null);
    // setUser(null);
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isInitializing, setIsInitializing, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
