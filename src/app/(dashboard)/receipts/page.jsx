import { getReceipts } from "@/app/actions/receipts/get-receipts";
import ReceiptsTable from "./_components/ReceiptsTable";

export const metadata = {
  title: "All Receipts | Invoice Corrector",
  description: "Manage and track all insurance receipts",
};

export default async function ReceiptsPage(props) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const page = parseInt(searchParams?.page || "1", 10);

  const result = await getReceipts({ search, page, limit: 50 });

  return (
    <ReceiptsTable
      initialReceipts={result.data || []}
      initialTotal={result.total || 0}
      initialPage={page}
    />
  );
}
