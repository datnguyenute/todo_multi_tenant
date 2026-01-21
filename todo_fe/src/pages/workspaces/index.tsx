/* eslint-disable @typescript-eslint/no-explicit-any */
import { WorkspaceItem } from "@/components/common/workspaceItem";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useWorkspaceApi } from "@/lib/api/workspace";
import { useEffect, useState } from "react";

function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const { list } = useWorkspaceApi();

  useEffect(() => {
    const fetchData = async () => {
      const response = await list();

      if (response.data) {
        setWorkspaces(response.data || []);
      }
    };
    fetchData();
  }, [list]);

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces.map((ws: any) => (
          <WorkspaceItem  key={ws.id} name={ws.name} />
        ))}
      </div>
  );
}

WorkspacesPage.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
WorkspacesPage.requireAuth = true;

export default WorkspacesPage;
