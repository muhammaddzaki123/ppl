"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormState } from "react-dom";
import { toast } from "sonner";

import { updatePassword, User } from "@/actions/user";
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

const formSchema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

interface PasswordFormProps {
  user: User;
  onSuccess: () => void;
}

export function PasswordForm({ user, onSuccess }: PasswordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const action = updatePassword.bind(null, user.id);
  const [state, formAction] = useFormState(action, { status: "idle", message: "" });

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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Masukkan password baru" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password Baru</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Konfirmasi password baru"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Ubah Password
        </Button>
      </form>
    </Form>
  );
}
