"use client";

import { Building2, Banknote } from "lucide-react";
import FormTextarea from "../_components/FormTextarea";

export default function ClientSection({ verificationStatus }) {
  return (
    <>
      <FormTextarea
        id="receivedFrom"
        label="Received From"
        icon={Building2}
        iconClassName="text-violet-500"
        rows={4}
        placeholder="e.g. Mr. John, House #10, Road #5..."
        verificationStatus={verificationStatus}
      />
      <FormTextarea
        id="sumOf"
        label="The Sum of (BDT)"
        icon={Banknote}
        iconClassName="text-green-600"
        rows={2}
        placeholder="e.g. 1,02,695.00 (One Lakh...)"
        verificationStatus={verificationStatus}
      />
    </>
  );
}
