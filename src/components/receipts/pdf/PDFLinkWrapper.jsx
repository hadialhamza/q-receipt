"use client";

import React from "react";
import { usePDF } from "@react-pdf/renderer";
import { ReceiptDocument } from "./ReceiptDocument";

const PDFLinkWrapper = ({ data, shortCode, qrCodeDataUrl }) => {
    const [instance] = usePDF({
        document: <ReceiptDocument data={data} qrCodeDataUrl={qrCodeDataUrl} shortCode={shortCode} />
    });

    if (instance.loading) {
        return <span className="text-gray-400 font-medium">Generating PDF...</span>;
    }

    if (instance.error) {
        console.error("PDF Generation Error:", instance.error);
        return <span className="text-red-500 font-medium">Error generating PDF</span>;
    }

    return (
        <a
            href={instance.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0d6efd] hover:text-[#0a58ca] underline text-lg hover:underline font-medium transition-colors"
        >
            Download PDF
        </a>
    );
};

export default PDFLinkWrapper;
