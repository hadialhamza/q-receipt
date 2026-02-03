import { notFound } from "next/navigation";
import ReceiptForm from "@/components/dashboard/create/ReceiptForm";
import { getReceiptById } from "@/app/actions/receipts/get-receipt-by-id";

export const metadata = {
  title: "Edit Receipt | QReceipt",
  description: "Edit existing receipt",
};

export default async function EditReceiptPage({ params }) {
  const { id } = await params;
  const result = await getReceiptById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading font-bold">Edit Receipt</h1>
        <p className="text-muted-foreground">
          Update receipt details (Receipt No: {result.data.receiptNo})
        </p>
      </div>

      <ReceiptForm initialData={result.data} receiptId={id} />
    </div>
  );
}
