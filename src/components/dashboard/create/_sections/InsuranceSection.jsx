"use client";

import { Calendar, ShieldCheck } from "lucide-react";
import FormInput from "../_components/FormInput";

export default function InsuranceSection({ verificationStatus }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormInput
        id="classOfInsurance"
        label="Class of Insurance"
        icon={ShieldCheck}
        iconClassName="text-emerald-500"
        placeholder="e.g. Comprehensive Motor Insurance"
        verificationStatus={verificationStatus}
      />
      <FormInput
        id="date"
        label="Date (DD-MM-YYYY)"
        icon={Calendar}
        iconClassName="text-orange-500"
        placeholder="dd-mm-yyyy"
        verificationStatus={verificationStatus}
      />
    </div>
  );
}
