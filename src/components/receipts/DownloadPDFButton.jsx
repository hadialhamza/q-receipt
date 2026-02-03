"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import QRCode from "qrcode";

// Dynamically import the PDF wrapper to avoid SSR issues
const PDFLinkWrapper = dynamic(() => import("./pdf/PDFLinkWrapper"), {
  ssr: false,
  loading: () => <span className="text-gray-400">Loading PDF...</span>,
});

export default function DownloadPDFButton({ shortCode, data }) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Generate QR Code Data URL once for the PDF
    const generateQR = async () => {
      if (shortCode) {
        try {
          // Use origin or default
          const origin =
            typeof window !== "undefined"
              ? window.location.origin
              : "https://qreceipt.com";
          const url = `${origin}/pe/${shortCode}`;
          // Generate QR as Data URL for react-pdf Image
          const dataUrl = await QRCode.toDataURL(url, {
            width: 200,
            margin: 1,
            color: { dark: "#000000", light: "#ffffff" },
          });
          setQrCodeDataUrl(dataUrl);
        } catch (err) {
          console.error("QR Gen Error", err);
        }
      }
    };

    generateQR();
  }, [shortCode]);

  if (!isClient || !data) {
    return null;
  }

  // Render the wrapper only when we have data and are on client
  return (
    <div className="inline-block">
      <PDFLinkWrapper
        data={data}
        shortCode={shortCode}
        qrCodeDataUrl={qrCodeDataUrl}
      />
    </div>
  );
}
