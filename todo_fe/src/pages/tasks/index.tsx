/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskSheet } from "@/components/common/TaskSheet";
import { useConfirm } from "@/components/confirm.provider";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTaskApi } from "@/lib/api/tasks";
import { ITask } from "@/types/next-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

function TasksPage() {
  const { listByUser, edit, remove } = useTaskApi();
  const { data: session } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ITask | null>(null);
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await listByUser();
      return res.data ?? [];
    },
    enabled: !!session,
  });

  const openCreate = () => {
    setEditingProject(null);
    setSheetOpen(true);
  };

  const openEdit = (project: ITask) => {
    setEditingProject(project);
    setSheetOpen(true);
  };

  const { mutate: deleteProject, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleDelete = async (task: ITask) => {
    const ok = await confirm({
      title: "Delete project",
      description: (
        <>
          Are you sure you want to delete <span className="font-semibold">{task.title}</span>? This action cannot be
          undone.
        </>
      ),
      confirmText: "Delete",
      destructive: true,
    });

    if (!ok) return;

    deleteProject(task.id);
  };

  return (
    <>
      <div className="px-4 lg:px-6 text-right">
        <Button size="sm" type="button" variant="outline" onClick={openCreate}>
          <Plus />
          <span>Create new task</span>
        </Button>
      </div>
      <TaskSheet open={sheetOpen} task={editingProject} onOpenChange={setSheetOpen} />
      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          {isLoading && <p>Loading...</p>}
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task: ITask) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.project?.name}</TableCell>
                  <TableCell>{task.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(task)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(task)}
                          disabled={isDeleting}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

TasksPage.getLayout = (page: React.ReactNode) => <DashboardLayout pageName="Tasks">{page}</DashboardLayout>;
TasksPage.requireAuth = true;

export default TasksPage;
