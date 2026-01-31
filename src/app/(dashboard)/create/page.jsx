import ReceiptForm from "@/components/dashboard/create/ReceiptForm";

export const metadata = {
  title: "Create Receipt | Invoice Corrector",
  description: "Generate and correct insurance receipts using AI.",
};

export default function CreateReceiptPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Create Receipt</h1>
        <p className="text-muted-foreground">
          Generate a new insurance receipt or correct an existing one.
        </p>
      </div>

      <ReceiptForm />
    </div>
  );
}
