import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/lib/hooks/useWorkspace";
import { CirclePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const formSchema = z.object({
  workspaceName: z
    .string()
    .min(3, "Workspace name must be at least 3 characters")
    .max(50, "Workspace name is too long"),
});

export function WorkspaceCreate() {
  const { createNew, loading, error } = useWorkspace();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspaceName: "Workspace",
    },
  });

  const mutation = useMutation({
    mutationFn: (name: string) => createNew(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      form.reset();

      setOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values.workspaceName);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" type="button">
          <CirclePlus />
          <span>Create</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create new workspace</DialogTitle>
              <DialogDescription>Create a new workspace here. Click save when you&apos;re done.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="workspaceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Workspace name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
