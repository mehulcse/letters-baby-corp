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
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  trackingId: z.string().min(1, "Tracking ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface FieldProps {
  field: {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    name: string;
    onBlur: () => void;
  };
}

export function AddressLetterForm() {
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
            name="name"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter name" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter address" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter phone number" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trackingId"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Tracking ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter tracking ID" />
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
          letterType="ADDRESS"
          data={formData}
        />
      )}
    </>
  );
} 