"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { ReceiptDocument } from "@/components/receipts/pdf/ReceiptDocument";
import QRCode from "qrcode";

export default function DownloadPdfAction({ data, shortCode }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // 1. Generate QR Code for the PDF
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/pe/${shortCode}`;

      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      });

      // 2. Generate PDF Blob
      const blob = await pdf(
        <ReceiptDocument
          data={data}
          qrCodeDataUrl={qrDataUrl}
          shortCode={shortCode}
        />,
      ).toBlob();

      // 3. Trigger Download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Receipt-${data.receiptNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("PDF Downloaded!");
    } catch (error) {
      console.error("PDF Gen Error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      className="text-orange-600 hover:text-orange-700 h-8 w-8 p-0"
      title="Download PDF"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <FileDown className="size-4" />
      )}
    </Button>
  );
}
