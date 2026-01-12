/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from "@/components/layout/DashboardLayout";
import { workspaceApi } from "@/lib/api/workspace";
import { useAuthToken } from "@/lib/auth/AuthContext";
import withAuth from "@/lib/hoc/withAuth";
import { useEffect, useState } from "react";

function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    workspaceApi.list(accessToken).then((value: any) => setWorkspaces(value));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workspaces</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces.map((ws: any) => (
          <div key={ws.id} className="rounded-lg border bg-background p-4 hover:shadow">
            <div className="font-medium">{ws.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

WorkspacesPage.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default withAuth(WorkspacesPage);
