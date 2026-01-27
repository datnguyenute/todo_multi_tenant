import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { IUser } from "@/types/next-auth";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/lib/hooks/useUser";
import { toast } from "sonner";
import { useEffect } from "react";

interface IUserSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: IUser | null;
}

const formSchema = z.object({
  userName: z.string().min(3, "User name must be at least 3 characters").max(50, "User name is too long"),
  email: z.string().email("Ivalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export function UserSheet(props: IUserSheetProps) {
  const { open, user, onOpenChange } = props;
  const isEdit = Boolean(user);
  const queryClient = useQueryClient();
  const { createNew, updateUser } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      if (isEdit && user) {
        return updateUser(user.id, values.userName, values.email, values.password);
      }

      return createNew(values.userName, values.email, values.password);
    },

    onSuccess: () => {
      if (isEdit) {
        toast.success("Update user success");
      } else {
        toast.success("Create user success");
      }
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.reset();
      onOpenChange(false);
    },

    onError: (error) => {
      form.setError("root", {
        type: "server",
        message: error?.message || "Create user failed",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (user) {
      form.reset({
        userName: user.name,
        email: user.email,
        password: "",
      });
    } else {
      form.reset({
        userName: "",
        email: "",
        password: "",
      });
    }
  }, [user, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
            <SheetHeader>
              <SheetTitle>{isEdit ? "Edit user" : "Create user"}</SheetTitle>
              <SheetDescription>
                Make changes or create new user here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="User name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Password" type="password" />
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
