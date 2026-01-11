import DashboardLayout from "@/components/layout/DashboardLayout";
import withAuth from "@/lib/hoc/withAuth";

function WorkspacesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workspaces</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* {workspaces.map((ws) => ( */}
          <div  className="rounded-lg border bg-background p-4 hover:shadow">
            <div className="font-medium">123</div>
          </div>
        {/* ))} */}
      </div>
    </div>
  );
}

WorkspacesPage.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default withAuth(WorkspacesPage);
