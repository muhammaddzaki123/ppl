"use client";

import { useEffect, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { addUser, updateUser, User } from "@/actions/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().optional(),
});

const editSchema = formSchema.omit({ password: true });
const addSchema = formSchema.refine((data) => data.password && data.password.length >= 8, {
  message: "Password minimal 8 karakter",
  path: ["password"],
});


interface UserFormProps {
  user?: User;
  onSuccess: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const isEditing = !!user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(isEditing ? editSchema : addSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
  });

  const action = isEditing ? updateUser.bind(null, user.id) : addUser;
  const [state, formAction] = useActionState(action, { status: "idle", message: "" });

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      onSuccess();
    } else if (state.status === "error") {
      toast.error(state.message);
      if(state.errors) {
        Object.entries(state.errors).forEach(([key, value]) => {
            form.setError(key as keyof z.infer<typeof formSchema>, {
                type: "manual",
                message: value[0],
            });
        });
      }
    }
  }, [state, onSuccess, form]);


  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama" {...field} />
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
                <Input type="email" placeholder="Masukkan email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isEditing && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Masukkan password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isEditing ? "Simpan Perubahan" : "Tambah User"}
        </Button>
      </form>
    </Form>
  );
}
