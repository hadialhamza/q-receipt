import { getReceiptByCode } from "@/app/actions/receipts/get-receipt-by-code";
import ReceiptRenderer from "@/components/receipts/ReceiptRenderer";
import NotFoundReceipt from "@/components/receipts/NotFoundReceipt";
import "../fonts.css";

export const metadata = {
    title: "Money Receipt | QReceipt",
    description: "View your receipt",
};

export default async function PublicReceiptPage({ params }) {
    const { code } = await params;

    const result = await getReceiptByCode(code);

    if (!result.success || !result.data) {
        return <NotFoundReceipt />;
    }

    return (
        <div className="light bg-[whitesmoke] min-h-screen">
            <ReceiptRenderer data={result.data} code={code} />
        </div>
    );
}
