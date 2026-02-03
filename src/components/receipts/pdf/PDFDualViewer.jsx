"use client";

import React, { useState } from "react";

const PdfPanel = ({ title, bgHeader, bgPanel }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
        }
    };

    return (
        <div className={`w-1/2 h-full flex flex-col border-r border-gray-300 relative ${bgPanel}`}>
            {/* Header / Upload Bar */}
            <div className={`p-3 border-b border-gray-200 flex justify-between items-center shadow-sm z-10 ${bgHeader}`}>
                <span className="font-bold text-sm text-gray-700">{title}</span>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
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
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full"
                        title={title}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">Upload PDF to View</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PDFDualViewer = () => {
    return (
        <div className="w-full h-screen bg-gray-50 flex flex-col">
            <div className="flex-none p-4 bg-white border-b shadow-sm z-20">
                <h1 className="font-bold text-xl text-gray-800">Dual PDF Comparator</h1>
                <p className="text-xs text-gray-500 mt-1">Upload files on both sides to compare details pixel-by-pixel.</p>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <PdfPanel title="Left Document" bgHeader="bg-blue-50" bgPanel="bg-white" />
                <PdfPanel title="Right Document" bgHeader="bg-green-50" bgPanel="bg-gray-50" />
            </div>
        </div>
    );
};

export default PDFDualViewer;
