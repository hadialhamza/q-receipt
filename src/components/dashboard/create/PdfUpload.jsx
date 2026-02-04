"use client";

import { useState } from "react";
import {
  FileUp,
  Loader2,
  FileText,
  X,
  Eye,
  ZoomIn,
  ZoomOut,
  Search,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { extractTextFromPdf, renderPdfToImage } from "@/lib/pdf-extractor";
import { parseReceiptData } from "@/lib/parse-receipt";
import { parseReceiptWithAI } from "@/app/actions/ai/groq-parser";
import { verifyExtraction, validateExtraction } from "@/lib/verification";
import { Button } from "@/components/ui/button";
import { GlassMagnifier } from "@/components/ui/GlassMagnifier";
import { Card } from "@/components/ui/card";
import ScanningLoader from "@/app/(dashboard)/create/scanningLoader";

export function PdfUpload({ onDataExtracted }) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(2.5);
  const [isZoomEnabled, setIsZoomEnabled] = useState(true);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1.5));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      toast.info("Processing Receipt...");

      // 1. Extract Raw PDF Text
      const [text, imageUrl] = await Promise.all([
        extractTextFromPdf(file),
        renderPdfToImage(file),
      ]);

      if (imageUrl) {
        setPreviewImage(imageUrl);
      }

      // LEVEL 1: REGEX PARSING (Offline / Fast)
      const regexData = parseReceiptData(text);

      // LEVEL 2: VALIDATION GATE
      const { isValid, missingFields } = validateExtraction(regexData);

      if (isValid) {
        // SUCCESS: Regex found everything (including clientName via regex)
        toast.success("Data extracted successfully! ⚡");
        const verificationStatus = verifyExtraction(text, regexData);
        onDataExtracted(regexData, verificationStatus);

        return;
      }

      // LEVEL 3: AI BACKUP (Only if Validation Fails)
      toast.warning(`Switching to AI... Missing: ${missingFields.join(", ")}`);

      try {
        const aiResult = await parseReceiptWithAI(text);

        if (aiResult.success) {
          toast.success("AI Enhanced Extraction Complete 🤖");

          const verificationStatus = verifyExtraction(text, aiResult.data);
          onDataExtracted(aiResult.data, verificationStatus);
        } else {
          toast.error("AI failed too. Using partial data.");
          onDataExtracted(regexData, {});
        }
      } catch (aiError) {
        toast.error("AI Error. Using partial data.");
        onDataExtracted(regexData, {});
      }
    } catch (error) {
      toast.error("Failed to process PDF.");
      setPreviewImage(null);
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
      }
      setLoading(false);
      e.target.value = "";
    }
  };

  const clearFile = () => {
    setPreviewImage(null);
    onDataExtracted({}, {});
  };

  return (
    <>
      {loading && <ScanningLoader />}
      <Card
        className={`border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24 transition-all duration-300 ${
          previewImage ? "p-0" : "p-6"
        }`}
      >
        {/* --- STATE 1: PREVIEW MODE (With Glass Magnifier) --- */}
        {previewImage ? (
          <div className="flex flex-col h-[85vh]">
            {/* Header */}
            <div className="p-4 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between z-10 sticky top-0">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-none">
                    Receipt Preview
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wide">
                    Extracted Data Sources
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 mr-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <Button
                      variant={isZoomEnabled ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setIsZoomEnabled(!isZoomEnabled)}
                      className={`h-6 w-6 rounded-md transition-all ${
                        isZoomEnabled
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          : "text-muted-foreground hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                      title={
                        isZoomEnabled ? "Disable Magnifier" : "Enable Magnifier"
                      }
                    >
                      <Search size={12} />
                    </Button>

                    {isZoomEnabled && (
                      <>
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-0.5" />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleZoomOut}
                          disabled={zoomLevel <= 1.5}
                          className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md disabled:opacity-30"
                        >
                          <ZoomOut size={12} />
                        </Button>
                        <span className="text-[10px] font-mono font-bold w-8 text-center text-slate-600 dark:text-slate-300">
                          {zoomLevel.toFixed(1)}x
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleZoomIn}
                          disabled={zoomLevel >= 5}
                          className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md disabled:opacity-30"
                        >
                          <ZoomIn size={12} />
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFile}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    title="Remove File"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* 🔍 MAGNIFIER AREA */}
            <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 overflow-auto flex items-start justify-center relative group/preview">
              {/* Dot Pattern Background */}
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />

              <div
                className={`shadow-2xl shadow-slate-200/50 dark:shadow-black/50 w-full max-w-full ring-1 ring-slate-200 dark:ring-slate-800 bg-white overflow-hidden ${!isZoomEnabled && "p-4 flex items-center justify-center"}`}
              >
                {isZoomEnabled ? (
                  <GlassMagnifier
                    imageSrc={previewImage}
                    magnifierSize={200}
                    zoomLevel={zoomLevel}
                  />
                ) : (
                  <Image
                    src={previewImage}
                    alt="Receipt Preview"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain max-h-full"
                    unoptimized
                  />
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t bg-background z-10">
              <label className="cursor-pointer block w-full group">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <div className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-muted-foreground group-hover:text-primary group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin size-3.5" /> Analyzing...
                    </span>
                  ) : (
                    <>
                      <FileUp
                        size={14}
                        className="group-hover:-translate-y-0.5 transition-transform"
                      />
                      <span>Upload a different PDF</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
        ) : (
          /* --- STATE 2: UPLOAD MODE (Modern Dropzone) --- */
          <div className="text-center h-full flex flex-col justify-center min-h-100">
            <div className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 p-10 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 ease-in-out">
              {/* Decorative Background Glow */}
              <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Icon Container */}
                <div className="size-20 rounded-full bg-white dark:bg-slate-950 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {loading ? (
                    <Loader2 className="animate-spin text-blue-600 size-9" />
                  ) : (
                    <div className="bg-linear-to-br from-blue-600 to-violet-600 text-transparent bg-clip-text">
                      <FileUp className="text-blue-600 dark:text-blue-500 size-9" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-2">
                  Upload Receipt
                </h3>

                <p className="text-sm text-muted-foreground mb-8 max-w-65 mx-auto leading-relaxed">
                  Drag & drop your PDF here or click to browse. We&apos;ll
                  extract the data for you.
                </p>

                <label className="cursor-pointer relative z-20">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={loading}
                  />
                  <div className="px-8 py-3.5 bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FileUp size={18} />
                        <span>Select PDF File</span>
                      </>
                    )}
                  </div>
                </label>

                <div className="mt-8 flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
                  <span>Powered by AI</span>
                  <span className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
