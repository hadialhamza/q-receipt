"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRCodeGenerator({ value }) {
    // Generate full URL for QR code
    const baseUrl =
        typeof window !== "undefined"
            ? window.location.origin
            : "https://qreceipt.com";
    const qrValue = `${baseUrl}/pe/${value}`;

    return (
        <div className="qr-code-container">
            <QRCodeSVG value={qrValue} size={120} level="H" includeMargin={true} />
        </div>
    );
}
