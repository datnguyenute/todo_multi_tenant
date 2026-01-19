import { useRouter } from "next/router";
import { useAuth } from "../auth/AuthContext";
import { PropsWithChildren, useEffect } from "react";

// /* eslint-disable @typescript-eslint/no-explicit-any */
// function AuthGate({ children }: PropsWithChildren) {
//   const { accessToken } = useAuth();
//   const router = useRouter();

//   if (!accessToken) {
//     router.replace("/auth/login");
//     return null;
//   }

//   return <>{children}</>;
// }

function AuthGate({ children }: PropsWithChildren) {
  const { accessToken,  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('AuthGate    ', accessToken);
    if (!accessToken) {
      router.replace("/auth/login");
    }
  }, [accessToken, router]);

  return <>123{children}</>;
}

export default AuthGate;
