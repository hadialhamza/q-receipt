"use client";

import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import QRCode from "qrcode";

export default function DownloadQrAction({ receiptNo, shortCode }) {
  const handleDownload = async () => {
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/pe/${shortCode}`;

      // Generate QR Data URL
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      // trigger download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `QR-${receiptNo}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR Code downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate QR Code");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      className="text-blue-600 hover:text-blue-700 h-8 w-8 p-0"
      title="Download QR Code"
    >
      <QrCode className="size-4" />
    </Button>
  );
}
