"use client";

import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { ReceiptDocument } from "./ReceiptDocument";

// Mock Data for Design Testing
const MOCK_DATA = {
  companyType: "GLOBAL",
  bin: "123456789-0001",
  issuingOffice: "Motijheel Branch",
  receiptNo: "MR-2024-001",
  classOfInsurance: "Fire Insurance",
  date: "29-01-2026",
  receivedFrom:
    "Islami Bank Bangladesh PLC Rangpur Branch, Rangpur A/c. M/S MISTI ENTERPRISE, Burimari, Patgram, Lalmonirhat, Bangladesh.",
  sumOf: "2,220.00 (Two Thousand Two Hundred Twenty taka)",
  modeOfPayment: "Cheque; 2530850",
  chequeDate: "29-01-2026",
  drawnOn: "Mercantile Bank PLC",
  issuedAgainst: "GIL/RNP/MC-00031/01/2026",
  premium: "45000.00",
  vat: "4500.00",
  stamp: "500.00",
  total: "50000.00",
};

// Internal Panel Component for Uploads (Right Side)
const PdfUploadPanel = ({ title, bgHeader, bgPanel, fileUrl, onUpload }) => {
  return (
    <div
      className={`w-1/2 h-full flex flex-col border-r border-gray-300 relative ${bgPanel}`}
    >
      {/* Header / Upload Bar */}
      <div
        className={`p-3.5 border-b border-gray-200 flex justify-between items-center shadow-sm z-10 ${bgHeader}`}
      >
        <span className="font-bold text-sm text-gray-700">{title}</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={onUpload}
          className="text-xs text-slate-500
              file:mr-2 file:py-1 file:px-3
              file:rounded-full file:border-0
              file:text-xs file:font-semibold
              file:bg-white file:text-blue-700
              hover:file:bg-gray-100
              cursor-pointer
            "
        />
      </div>

      {/* Viewer Content */}
      <div className="flex-1 relative">
        {fileUrl ? (
          <iframe src={fileUrl} className="w-full h-full" title={title} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12 mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm">Upload Original PDF to Compare</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal Panel Component for Live Preview (Left Side)
const PdfPreviewPanel = ({ title, bgHeader, bgPanel }) => {
  // Manual Refresh Control to avoid HMR loops and timers
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div
      className={`w-1/2 h-full flex flex-col border-r border-gray-300 relative ${bgPanel}`}
    >
      <div
        className={`p-3.5 border-b border-gray-200 flex justify-between items-center shadow-sm z-10 ${bgHeader}`}
      >
        <span className="font-bold text-sm text-gray-700">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 italic hidden sm:inline">
            Click refresh to update
          </span>
          <button
            onClick={handleRefresh}
            className="bg-white rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all border border-gray-200 shadow-sm"
            title="Refresh PDF Preview"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        {/* Remount viewer when key changes to force fresh render */}
        <PDFViewer
          key={refreshKey}
          width="100%"
          height="100%"
          className="w-full h-full border-none"
        >
          <ReceiptDocument
            data={MOCK_DATA}
            shortCode="TEST-PREVIEW"
            qrCodeDataUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKw66AAAAABJRU5ErkJggg=="
          />
        </PDFViewer>
      </div>
    </div>
  );
};

const PDFLivePreview = () => {
  const [originalPdfUrl, setOriginalPdfUrl] = React.useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalPdfUrl(url);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      <div className="flex-none p-4 bg-white border-b shadow-sm z-20">
        <h1 className="font-bold text-xl text-gray-800">
          Live PDF Design Preview
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Left: Live Code Output | Right: Original Reference PDF
        </p>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <PdfPreviewPanel
          title="Generated Design"
          bgHeader="bg-blue-50"
          bgPanel="bg-white"
        />
        <PdfUploadPanel
          title="Original PDF (Target)"
          bgHeader="bg-green-50"
          bgPanel="bg-gray-50"
          fileUrl={originalPdfUrl}
          onUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default PDFLivePreview;
