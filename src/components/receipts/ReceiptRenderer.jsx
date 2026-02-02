import ReceiptTemplate from "./templates/ReceiptTemplate";

export default function ReceiptRenderer({ data, code }) {
  return <ReceiptTemplate data={data} code={code} />;
}
