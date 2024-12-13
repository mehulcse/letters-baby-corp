"use client";

import { AddressLetterForm } from "@/components/forms/address-letter-form";
import { GenericLetterForm } from "@/components/forms/generic-letter-form";
import { TUTULetterForm } from "@/components/forms/tutu-letter-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type LetterType = "TUTU" | "GENERIC" | "ADDRESS";

export function LetterGenerator() {
  const [selectedType, setSelectedType] = useState<LetterType | null>(null);

  const handleTypeChange = (value: string) => {
    setSelectedType(value as LetterType);
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Letter Type
        </label>
        <Select onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a letter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TUTU">TUTU Letter</SelectItem>
            <SelectItem value="GENERIC">Generic Letter</SelectItem>
            <SelectItem value="ADDRESS">Address Letter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {selectedType === "TUTU" && <TUTULetterForm />}
        {selectedType === "GENERIC" && <GenericLetterForm />}
        {selectedType === "ADDRESS" && <AddressLetterForm />}
      </div>
    </div>
  );
} 