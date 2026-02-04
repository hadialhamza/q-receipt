"use client";

import { CreditCard, Building2, FileText, Calendar } from "lucide-react";
import FormInput from "../_components/FormInput";

export default function PaymentSection({ verificationStatus }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          id="modeOfPayment"
          label="Mode of Payment"
          icon={CreditCard}
          iconClassName="text-cyan-500"
          placeholder="e.g. Cash / Cheque No. 1234"
          verificationStatus={verificationStatus}
        />
        <FormInput
          id="drawnOn"
          label="Drawn On (Optional)"
          icon={Building2}
          iconClassName="text-pink-500"
          placeholder="e.g. Dutch Bangla Bank, Dhaka Br."
          verificationStatus={verificationStatus}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          id="issuedAgainst"
          label="Issued Against (Optional)"
          icon={FileText}
          iconClassName="text-indigo-500"
          placeholder="e.g. Policy Number / Cover Note"
          verificationStatus={verificationStatus}
        />
        <FormInput
          id="chequeDate"
          label="Cheque Date (DD-MM-YYYY)"
          icon={Calendar}
          iconClassName="text-orange-500"
          placeholder="dd-mm-yyyy"
          verificationStatus={verificationStatus}
        />
      </div>
    </>
  );
}
