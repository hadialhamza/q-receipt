import { FilePlus } from "lucide-react";
import ReceiptForm from "@/components/dashboard/create/ReceiptForm";

export const metadata = {
  title: "Create Receipt | Invoice Corrector",
  description: "Generate and correct insurance receipts using AI.",
};

export default function CreateReceiptPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <FilePlus className="size-6" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Receipt
          </h1>
        </div>
        <p className="text-muted-foreground ml-16">
          Generate a new insurance receipt manually or auto-fill using AI.
        </p>
      </div>

      <ReceiptForm />
    </div>
  );
}
