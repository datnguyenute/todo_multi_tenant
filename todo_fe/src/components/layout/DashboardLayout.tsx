import { PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../navigation/AppSidebar";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.error === "RefreshAccessTokenError") {
    router.replace("/auth/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        {children}
      </main>
    </SidebarProvider>
  );
};
export default DashboardLayout;
