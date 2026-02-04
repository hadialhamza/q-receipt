"use client";

import { useFormContext } from "react-hook-form";
import { Hash, FileText } from "lucide-react";
import FormInput from "../_components/FormInput";

export default function IdentificationSection({ verificationStatus }) {
  const { register } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          id="bin"
          label="BIN"
          icon={Hash}
          iconClassName="text-indigo-500"
          placeholder="e.g. 000001297-0202"
          verificationStatus={verificationStatus}
        />
        <FormInput
          id="receiptNo"
          label="Receipt No"
          icon={FileText}
          iconClassName="text-blue-500"
          placeholder="e.g. GIC/RGP/MV/23/001"
          verificationStatus={verificationStatus}
        />
      </div>
      {/* Hidden Static Fields for Compatibility */}
      <input type="hidden" {...register("issuingOffice")} />
      <input type="hidden" {...register("clientName")} />
    </>
  );
}
