"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LetterPreview } from "@/components/letter-preview";

const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface FieldProps {
  field: {
    onChange: (value: any) => void;
    value: string;
    name: string;
    onBlur: () => void;
  };
}

export function GenericLetterForm() {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormValues) {
    setFormData(data);
    setShowPreview(true);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter customer name" />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit">Generate Letter</Button>
          </div>
        </form>
      </Form>

      {formData && (
        <LetterPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          letterType="GENERIC"
          data={formData}
        />
      )}
    </>
  );
} 