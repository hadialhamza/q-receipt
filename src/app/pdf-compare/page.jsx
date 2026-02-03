"use client";

import dynamic from "next/dynamic";

const PDFDualViewer = dynamic(
    () => import("../../components/receipts/pdf/PDFDualViewer"),
    { ssr: false }
);

export default function PDFComparePage() {
    return <PDFDualViewer />;
}
