"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LetterPreview } from "@/components/letter-preview";
import type { ReactNode } from "react";

const formSchema = z.object({
  language: z.enum(["hindi", "gujarati", "marathi"]),
  englishName: z.string().min(1, "Name is required"),
  localName: z.string().min(1, "Name in selected language is required"),
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

export function TUTULetterForm(): ReactNode {
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
            name="language"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Select Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="englishName"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Name in English</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter name in English" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="localName"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>
                  Name in {form.watch("language") || "selected language"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`Enter name in ${
                      form.watch("language") || "selected language"
                    }`}
                  />
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
          letterType="TUTU"
          data={formData}
        />
      )}
    </>
  );
} 