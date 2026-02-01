import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus, Briefcase } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { useWorkspaceApi } from "@/lib/api/workspace";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserApi } from "@/lib/api/users";
import { MultiUserPicker, UserOption } from "@/components/common/MultipleUserPicker";

function WorkspaceDetailPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { detail, addMembers } = useWorkspaceApi();
  const { list } = useUserApi();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: workspace = null } = useQuery({
    queryKey: ["workspace", id],
    queryFn: () => detail(id).then((res) => res.data),
    enabled: !!id && !!session,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["users-list"],
    queryFn: () => list().then((res) => res.data as UserOption[]),
    enabled: !!session && isDialogOpen, // Only fetch when dialog opens
  });

  const addMembersMutation = useMutation({
    mutationFn: (userIds: string[]) => addMembers(id, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", id] });
      setSelectedUserIds([]);
      setIsDialogOpen(false);
    },
  });
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold tracking-tight">{workspace?.name || "Loading..."}</h3>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Members to Workspace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Users</label>
                <MultiUserPicker
                  users={allUsers}
                  selected={selectedUserIds}
                  onChange={setSelectedUserIds}
                  placeholder="Search users by name or email..."
                />
              </div>
              <Button
                onClick={() => addMembersMutation.mutate(selectedUserIds)}
                className="w-full"
                disabled={addMembersMutation.isPending || selectedUserIds.length === 0}
              >
                {addMembersMutation.isPending ? "Adding..." : `Add ${selectedUserIds.length} Members`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Members List Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <div className="mr-2 h-5 w-5"> Members</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workspace?.members?.map((m) => (
                <div key={m.id} className="flex justify-between text-sm border-b pb-2">
                  <span>{m.user?.name || m.user?.email}</span>
                  <span className="text-muted-foreground capitalize">{m.role}</span>
                </div>
              )) || <p className="text-sm text-muted-foreground">No members found.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Projects Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="mr-2 h-5 w-5" /> Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Projects associated with this workspace will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

WorkspaceDetailPage.getLayout = (page: React.ReactNode) => (
  <DashboardLayout pageName="Workspace Details">{page}</DashboardLayout>
);
WorkspaceDetailPage.requireAuth = true;

export default WorkspaceDetailPage;
