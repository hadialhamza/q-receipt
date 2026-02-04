import ReceiptForm from "@/components/dashboard/create/ReceiptForm";
import CreateHeader from "./_components/CreateHeader";

export const metadata = {
  title: "Create Receipt | Invoice Corrector",
  description: "Generate and correct insurance receipts using AI.",
};

export default function CreateReceiptPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <CreateHeader />

      <ReceiptForm />
    </div>
  );
}
