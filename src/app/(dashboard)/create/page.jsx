import ReceiptForm from "@/components/dashboard/create/ReceiptForm";

export const metadata = {
    title: "Create Receipt | QReceipt",
    description: "Generate a new digital receipt with QR code",
};

export default function CreateReceiptPage() {
    return <ReceiptForm />;
}
