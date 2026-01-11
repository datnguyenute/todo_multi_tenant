import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-sm rounded-xl bg-background p-6 shadow">{children}</div>
    </div>
  );
};

export default AuthLayout;
