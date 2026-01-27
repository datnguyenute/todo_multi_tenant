import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../navigation/AppSidebar";
import { SiteHeader } from "../navigation/SideHeader";

interface IDashboardLayoutProps {
  children: React.ReactNode;
  pageName: string;
}

const DashboardLayout = ({ pageName, children }: IDashboardLayoutProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.error === "RefreshAccessTokenError") {
    router.replace("/auth/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader pageName={pageName} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default DashboardLayout;
