import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
function withAuth(Page: any) {
  const ProtectedPage = (props: any) => {
    const { user, loading } = useAuth();

    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/auth/login");
      }
    }, [loading, user, router]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return <Page {...props}></Page>;
  };

  ProtectedPage.getLayout = Page.getLayout;

  return ProtectedPage;
}

export default withAuth;
