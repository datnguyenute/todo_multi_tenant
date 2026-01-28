import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { IProject } from "@/types/next-auth";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProject } from "@/lib/hooks/useProject";
import { toast } from "sonner";
import { useEffect } from "react";

interface IProjectSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project: IProject | null;
}

const formSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters").max(50, "Project name is too long"),
});

export function ProjectSheet(props: IProjectSheetProps) {
  const { open, project, onOpenChange } = props;
  const isEdit = Boolean(project);
  const queryClient = useQueryClient();
  const { createNew, updateProject } = useProject();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: project?.name ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      if (isEdit && project) {
        return updateProject(project.id, values.projectName);
      }

      return createNew(values.projectName);
    },

    onSuccess: () => {
      if (isEdit) {
        toast.success("Update project success");
      } else {
        toast.success("Create project success");
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.reset();
      onOpenChange(false);
    },

    onError: (error) => {
      form.setError("root", {
        type: "server",
        message: error?.message || "Create project failed",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (project) {
      form.reset({
        projectName: project.name,
      });
    } else {
      form.reset({
        projectName: "",
      });
    }
  }, [project, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
            <SheetHeader>
              <SheetTitle>{isEdit ? "Edit project" : "Create project"}</SheetTitle>
              <SheetDescription>
                Make changes or create new project here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
              )}
            </div>
            <SheetFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save changes"}
              </Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
