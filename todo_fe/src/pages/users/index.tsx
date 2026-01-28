/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserSheet } from "@/components/common/UserSheet";
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
import { useUserApi } from "@/lib/api/users";
import { IUser } from "@/types/next-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

function UsersPage() {
  const { list, remove } = useUserApi();
  const { data: session } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<IUser | null>(null);
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await list();
      return res.data ?? [];
    },
    enabled: !!session,
  });

  const openCreate = () => {
    setEditingUser(null);
    setSheetOpen(true);
  };

  const openEdit = (user: IUser) => {
    setEditingUser(user);
    setSheetOpen(true);
  };

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteUserTarget(null);
    },
  });

  const handleDelete = async (user: IUser) => {
    const ok = await confirm({
      title: "Delete user",
      description: (
        <>
          Are you sure you want to delete <span className="font-semibold">{user.name}</span>? This action cannot be
          undone.
        </>
      ),
      confirmText: "Delete",
      destructive: true,
    });

    if (!ok) return;

    deleteUser(user.id);
  };

  return (
    <>
      <div className="px-4 lg:px-6 text-right">
        <Button size="sm" type="button" variant="outline" onClick={openCreate}>
          <Plus />
          <span>Create new user</span>
        </Button>
      </div>
      <UserSheet open={sheetOpen} user={editingUser} onOpenChange={setSheetOpen} />
      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: IUser) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>{user.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(user)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(user)}
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

UsersPage.getLayout = (page: React.ReactNode) => <DashboardLayout pageName="Users">{page}</DashboardLayout>;
UsersPage.requireAuth = true;

export default UsersPage;
