import { PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../navigation/AppSidebar";
import { SiteHeader } from "../navigation/SideHeader";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.error === "RefreshAccessTokenError") {
    router.replace("/auth/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default DashboardLayout;
