"use client";

import dynamic from "next/dynamic";

const PDFLivePreview = dynamic(
    () => import("../../components/receipts/pdf/PDFLivePreview"),
    { ssr: false }
);

export default function PDFPreviewPage() {
    return <PDFLivePreview />;
}
