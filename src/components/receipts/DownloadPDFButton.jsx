"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function DownloadPDFButton({ shortCode, data }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // Validate data exists
      if (!data) {
        alert("Receipt data not available. Please try again.");
        setIsGenerating(false);
        return;
      }

      console.log("PDF Generation - Receipt Data:", data);

      // Create PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = 10;

      // Add Federal Insurance Header Image
      try {
        // Load header image
        const headerImg = await fetch("/federal/header.png");
        const headerBlob = await headerImg.blob();
        const headerDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(headerBlob);
        });

        // Add image centered
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = 25; // Adjust height as needed
        doc.addImage(headerDataUrl, "PNG", margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 5;
      } catch (imgError) {
        console.error("Header image load failed:", imgError);
        // Fallback to text header
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("FEDERAL INSURANCE COMPANY PLC", pageWidth / 2, yPos, {
          align: "center",
        });
        yPos += 7;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const headOfficeText = [
          "Head Office: Navana D.H. Tower (6th Floor), 6, Panthapath, Dhaka-1215, Bangladesh.",
          "Phone: 02223374054-55, 02223374056, 02223374057, 02223374058",
          "Fax: 02223374062 Email: headoffice@federalinsubd.com Web: www.federalinsubd.com",
        ];
        headOfficeText.forEach((line) => {
          doc.text(line, pageWidth / 2, yPos, { align: "center" });
          yPos += 4;
        });
        yPos += 5;
      }

      // BIN Number
      doc.setFontSize(10);
      doc.text("BIN : 000251825-0203", margin, yPos);
      yPos += 10;

      // MONEY RECEIPT Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("MONEY RECEIPT", pageWidth / 2, yPos, { align: "center" });

      yPos += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("MUSHAK : 6.3", pageWidth / 2, yPos, { align: "center" });

      yPos += 10;

      // Receipt Details Section
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      // Left side - with safe property access
      doc.text(
        `Issuing Office        : ${data?.issuingOffice || "N/A"}`,
        margin,
        yPos,
      );
      yPos += 6;
      doc.text(`Money Receipt No. : ${data.receiptNo || "N/A"}`, margin, yPos);
      yPos += 6;
      doc.text(
        `Class of Insurance   : ${data.classOfInsurance || "N/A"}`,
        margin,
        yPos,
      );

      // Date (right aligned)
      doc.text(`Date : ${data.date || "N/A"}`, pageWidth - margin, yPos - 12, {
        align: "right",
      });

      yPos += 10;

      // Main Content Fields
      const drawField = (label, value) => {
        doc.text(label, margin, yPos);
        const labelWidth = doc.getTextWidth(label);
        doc.line(
          margin + labelWidth + 2,
          yPos + 1,
          pageWidth - margin,
          yPos + 1,
        );
        doc.text(value || "", margin + labelWidth + 4, yPos);
        yPos += 8;
      };

      doc.setFont("helvetica", "bold");
      drawField("Received with thanks from", data.receivedFrom || "");

      doc.setFont("helvetica", "normal");
      drawField("The sum of", data.sumOf || "");

      // Mode of Payment and Dated (split)
      doc.text("Mode of Payment", margin, yPos);
      const mopWidth = 50;
      doc.line(margin + 35, yPos + 1, margin + mopWidth + 30, yPos + 1);
      doc.text(data.modeOfPayment || "", margin + 37, yPos);

      doc.text("Dated", margin + mopWidth + 40, yPos);
      doc.line(margin + mopWidth + 52, yPos + 1, pageWidth - margin, yPos + 1);
      doc.text(data.chequeDate || "", margin + mopWidth + 54, yPos);
      yPos += 8;

      drawField("Drawn on", data.drawnOn || "");
      drawField("Issued against", data.issuedAgainst || "");

      yPos += 5;

      // Payment Table - Manual Drawing
      const formatAmount = (amount) => {
        if (!amount) return "0.00";
        return parseFloat(amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      };

      const tableX = margin;
      const tableWidth = 100;
      const rowHeight = 8;
      const col1Width = 40;
      const col2Width = 20;
      const col3Width = 40;

      // Draw table borders
      doc.setLineWidth(0.3);

      // Row 1: Premium
      doc.rect(tableX, yPos, tableWidth, rowHeight);
      doc.line(tableX + col1Width, yPos, tableX + col1Width, yPos + rowHeight);
      doc.line(
        tableX + col1Width + col2Width,
        yPos,
        tableX + col1Width + col2Width,
        yPos + rowHeight,
      );
      doc.text("Premium", tableX + 2, yPos + 5);
      doc.text("BDT", tableX + col1Width + col2Width / 2, yPos + 5, {
        align: "center",
      });
      doc.text(
        formatAmount(data?.premium),
        tableX + col1Width + col2Width + col3Width - 2,
        yPos + 5,
        { align: "right" },
      );

      yPos += rowHeight;

      // Row 2: VAT
      doc.rect(tableX, yPos, tableWidth, rowHeight);
      doc.line(tableX + col1Width, yPos, tableX + col1Width, yPos + rowHeight);
      doc.line(
        tableX + col1Width + col2Width,
        yPos,
        tableX + col1Width + col2Width,
        yPos + rowHeight,
      );
      doc.text("Vat", tableX + 2, yPos + 5);
      doc.text("BDT", tableX + col1Width + col2Width / 2, yPos + 5, {
        align: "center",
      });
      doc.text(
        formatAmount(data?.vat),
        tableX + col1Width + col2Width + col3Width - 2,
        yPos + 5,
        { align: "right" },
      );

      yPos += rowHeight;

      // Row 3: Total (with gray background)
      doc.setFillColor(211, 211, 211);
      doc.rect(tableX, yPos, tableWidth, rowHeight, "FD");
      doc.line(tableX + col1Width, yPos, tableX + col1Width, yPos + rowHeight);
      doc.line(
        tableX + col1Width + col2Width,
        yPos,
        tableX + col1Width + col2Width,
        yPos + rowHeight,
      );
      doc.text("Total", tableX + 2, yPos + 5);
      doc.text("BDT", tableX + col1Width + col2Width / 2, yPos + 5, {
        align: "center",
      });
      doc.text(
        formatAmount(data?.total),
        tableX + col1Width + col2Width + col3Width - 2,
        yPos + 5,
        { align: "right" },
      );

      const tableEndY = yPos + rowHeight;

      // Add QR Code
      if (shortCode) {
        try {
          const qrDataUrl = await QRCode.toDataURL(
            `${typeof window !== "undefined" ? window.location.origin : "https://qreceipt.com"}/pe/${shortCode}`,
            {
              width: 400,
              margin: 1,
            },
          );

          const qrSize = 35;
          const qrX = pageWidth - margin - qrSize - 5;
          const qrY = tableEndY - rowHeight * 3; // Position at table start
          doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
        } catch (qrError) {
          console.error("QR code generation failed:", qrError);
        }
      }

      yPos = tableEndY + 15;

      // Footer Notices
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(
        "This RECEIPT is computer generated, authorized signature is not required.",
        pageWidth / 2,
        yPos,
        { align: "center" },
      );

      yPos += 7;
      doc.setFillColor(211, 211, 211);
      doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 8, "F");
      doc.setTextColor(0, 0, 0);
      doc.text(
        "Receipt valid subject to encashment of cheque/P.O./D.D.",
        pageWidth / 2,
        yPos,
        { align: "center" },
      );

      yPos += 10;
      doc.setTextColor(255, 0, 0);
      doc.text(
        "* Note: If have any complain about Insurance, call 16130.",
        margin,
        yPos,
      );

      // Open in new tab
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="text-primary underline text-lg hover:underline font-medium transition-colors disabled:opacity-50"
    >
      {isGenerating ? "Generating..." : "Download PDF"}
    </button>
  );
}
