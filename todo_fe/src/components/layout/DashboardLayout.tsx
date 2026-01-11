import { ReactNode } from "react";
import Sidebar from "../navigation/Sidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-muted/60 p-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
