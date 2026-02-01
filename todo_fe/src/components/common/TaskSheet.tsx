import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { ITask } from "@/types/next-auth";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProject } from "@/lib/hooks/useProject";
import { toast } from "sonner";
import { useEffect } from "react";

interface ITaskSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: ITask | null;
}

const formSchema = z.object({
  title: z.string().min(3, "Task titile must be at least 3 characters").max(50, "Task title is too long"),
  description: z
    .string()
    .min(10, "Task description must be at least 10 characters")
    .max(100, "Task description is too long"),
  projectId: z.string(),
  assigneeId: z.string(),
});

export function TaskSheet(props: ITaskSheetProps) {
  const { open, task, onOpenChange } = props;
  const isEdit = Boolean(task);
  const queryClient = useQueryClient();
  const { createNew, updateProject } = useProject();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      projectId: task?.projectId ?? "",
      assigneeId: task?.assigneeid ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      if (isEdit && task) {
        return updateProject(task.id, values.title);
      }

      return createNew(values.title);
    },

    onSuccess: () => {
      if (isEdit) {
        toast.success("Update task success");
      } else {
        toast.success("Create task success");
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.reset();
      onOpenChange(false);
    },

    onError: (error) => {
      form.setError("root", {
        type: "server",
        message: error?.message || "Create task failed",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        assigneeId: task.assigneeid,
      });
    } else {
      form.reset({
        title: "",
      });
    }
  }, [task, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
            <SheetHeader>
              <SheetTitle>{isEdit ? "Edit task" : "Create task"}</SheetTitle>
              <SheetDescription>
                Make changes or create new task here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Task title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Task description" />
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
