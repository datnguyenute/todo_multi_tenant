/* eslint-disable @typescript-eslint/no-explicit-any */
import { WorkspaceCreate } from "@/components/common/WorkSpaceCreate";
import { WorkspaceItem } from "@/components/common/WorkspaceItem";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useWorkspaceApi } from "@/lib/api/workspace";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

function WorkspacesPage() {
  // const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const { list } = useWorkspaceApi();
  const { data: session } = useSession();

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await list();
      return res.data ?? [];
    },
    enabled: !!session,
  });

  return (
    <>
      <div className="px-4 lg:px-6 text-right ">
        <WorkspaceCreate />
      </div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {isLoading && <p>Loading...</p>}
        {workspaces.map((ws: any) => (
          <WorkspaceItem key={ws.id} name={ws.name} />
        ))}
      </div>
    </>
  );
}

WorkspacesPage.getLayout = (page: React.ReactNode) => <DashboardLayout pageName="Workspaces">{page}</DashboardLayout>;
WorkspacesPage.requireAuth = true;

export default WorkspacesPage;
