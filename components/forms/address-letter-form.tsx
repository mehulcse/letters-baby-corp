'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AddressLetterPreview } from '@/components/address-letter-preview';

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

export interface AddressFormValues {
  name: string;
  houseNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: IndianState;
  zipCode: string;
  phone: string;
  trackingId: string;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.enum(INDIAN_STATES, {
    required_error: 'Please select a state',
  }),
  zipCode: z.string().min(6, 'ZIP code must be 6 digits').max(6),
  phone: z.string().min(10, 'Phone number must be 10 digits').max(10),
  trackingId: z.string().min(1, 'Tracking ID is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface FieldProps {
  field: {
    onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => void;
    value: string;
    name: string;
    onBlur: () => void;
  };
}

interface OptionalFieldProps {
  field: {
    onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => void;
    value: string | undefined;
    name: string;
    onBlur: () => void;
  };
}

interface SelectFieldProps {
  field: {
    onChange: (value: string) => void;
    value: string;
    name: string;
    onBlur: () => void;
  };
}

export function AddressLetterForm() {
  const [showPreview, setShowPreview] = useState(false);
  const [addresses, setAddresses] = useState<FormValues[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      houseNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: INDIAN_STATES[0],
      zipCode: '',
      phone: '',
      trackingId: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setAddresses((prev) => [...prev, data]);
    form.reset({
      name: '',
      houseNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: INDIAN_STATES[0],
      zipCode: '',
      phone: '',
      trackingId: '',
    });
  }

  const handlePreview = () => {
    if (addresses.length > 0) {
      setShowPreview(true);
    }
  };

  const handleClearAll = () => {
    setAddresses([]);
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="houseNumber"
              render={({ field }: FieldProps) => (
                <FormItem>
                  <FormLabel>House/Flat Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter house/flat number" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }: FieldProps) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter street address" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }: OptionalFieldProps) => (
              <FormItem>
                <FormLabel>Address Line 2 (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter area, landmark, etc."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }: FieldProps) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter city" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }: SelectFieldProps) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }: FieldProps) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter 6-digit PIN code" maxLength={6} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter 10-digit phone number" maxLength={10} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-4">
            <div className="flex gap-2">
              <Button type="submit">Add Address</Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearAll}
                disabled={addresses.length === 0}
              >
                Clear All
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'} added
              </p>
              <Button type="button" onClick={handlePreview} disabled={addresses.length === 0}>
                Preview All
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {showPreview && (
        <AddressLetterPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          data={addresses}
        />
      )}
    </>
  );
}
