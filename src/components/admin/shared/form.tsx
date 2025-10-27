"use client";

import * as React from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Path,
  DefaultValues,
  Resolver,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FormFieldConfig<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  type: string;
  placeholder?: string;
}

interface GenericFormProps<TFormValues extends FieldValues> {
  // Use ZodType to keep the generic TFormValues strongly-typed for the resolver
  schema: z.ZodType<TFormValues, any, any>;
  fields: FormFieldConfig<TFormValues>[];
  onSubmit: SubmitHandler<TFormValues>;
  initialData?: TFormValues;
  isLoading?: boolean;
}

export function GenericForm<TFormValues extends FieldValues>({
  schema,
  fields,
  onSubmit,
  initialData,
  isLoading,
}: GenericFormProps<TFormValues>) {
  const form = useForm<TFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<
      TFormValues,
      any,
      TFormValues
    >,
    defaultValues: initialData as DefaultValues<TFormValues> | undefined,
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {fields.map((fieldConfig) => (
            <FormField
              key={fieldConfig.name}
              control={form.control}
              name={fieldConfig.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldConfig.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={fieldConfig.type}
                      placeholder={fieldConfig.placeholder}
                      {...field}
                      value={
                        field.value as
                          | string
                          | number
                          | readonly string[]
                          | undefined
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </Form>
  );
}
