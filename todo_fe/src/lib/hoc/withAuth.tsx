import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function withAuth(Page: any) {
  return function ProtectedPage(props: any) {
    const {user, loading} = useAuth();

    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/auth/login");
      }
    }, [loading, user, router]);

    if (loading || !user) return null;

    return <Page {...props}></Page>
  }
}

export default withAuth;