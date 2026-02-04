"use client";

import { Banknote, Hash, Wallet, ShieldCheck } from "lucide-react";
import FormInput from "../_components/FormInput";

export default function FinancialSection({ verificationStatus }) {
  return (
    <div className="pt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
          <Banknote className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Financial Details</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
            Amounts & Calculations
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormInput
          id="premium"
          label="Premium"
          icon={Banknote}
          iconClassName="text-emerald-600"
          type="number"
          step="0.01"
          placeholder="0.00"
          verificationStatus={verificationStatus}
        />
        <FormInput
          id="vat"
          label="VAT"
          icon={Hash}
          iconClassName="text-rose-500"
          type="number"
          step="0.01"
          placeholder="0.00"
          verificationStatus={verificationStatus}
        />
        <FormInput
          id="total"
          label="Total"
          icon={Wallet}
          iconClassName="text-blue-600"
          type="number"
          step="0.01"
          readOnly
          verificationStatus={verificationStatus}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormInput
          id="stamp"
          label="Stamp (Optional)"
          icon={ShieldCheck}
          iconClassName="text-amber-500"
          type="number"
          step="0.01"
          placeholder="0.00"
          verificationStatus={verificationStatus}
        />
      </div>
    </div>
  );
}
