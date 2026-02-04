"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CompanySection() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const companyType = watch("companyType");

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="w-full md:w-1/2">
        <Label
          htmlFor="companyType"
          className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground tracking-wide"
        >
          Select Company Template
        </Label>
        <Select
          value={companyType}
          onValueChange={(value) => setValue("companyType", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-100">
            <SelectItem value="GLOBAL">Global Insurance Ltd.</SelectItem>
            <SelectItem value="FEDERAL">
              Federal Insurance Company Ltd.
            </SelectItem>
            <SelectItem value="TAKAFUL">
              Takaful Islami Insurance Ltd.
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.companyType && (
          <p className="text-destructive text-[10px] font-bold uppercase mt-1">
            {errors.companyType.message}
          </p>
        )}
      </div>
    </div>
  );
}
