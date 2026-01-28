/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectSheet } from "@/components/common/ProjectSheet";
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
import { useProjectApi } from "@/lib/api/projects";
import { IProject } from "@/types/next-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

function ProjectsPage() {
  const { list, remove } = useProjectApi();
  const { data: session } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await list();
      return res.data ?? [];
    },
    enabled: !!session,
  });

  const openCreate = () => {
    setEditingProject(null);
    setSheetOpen(true);
  };

  const openEdit = (project: IProject) => {
    setEditingProject(project);
    setSheetOpen(true);
  };

  const { mutate: deleteProject, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleDelete = async (project: IProject) => {
    const ok = await confirm({
      title: "Delete project",
      description: (
        <>
          Are you sure you want to delete <span className="font-semibold">{project.name}</span>? This action cannot be
          undone.
        </>
      ),
      confirmText: "Delete",
      destructive: true,
    });

    if (!ok) return;

    deleteProject(project.id);
  };

  return (
    <>
      <div className="px-4 lg:px-6 text-right">
        <Button size="sm" type="button" variant="outline" onClick={openCreate}>
          <Plus />
          <span>Create new project</span>
        </Button>
      </div>
      <ProjectSheet open={sheetOpen} project={editingProject} onOpenChange={setSheetOpen} />
      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          {isLoading && <p>Loading...</p>}
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project: IProject) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(project)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(project)}
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

ProjectsPage.getLayout = (page: React.ReactNode) => <DashboardLayout pageName="Projects">{page}</DashboardLayout>;
ProjectsPage.requireAuth = true;

export default ProjectsPage;
