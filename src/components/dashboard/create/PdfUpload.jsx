"use client";

import { useState } from "react";
import { FileUp, Loader2, FileText, X, Eye } from "lucide-react";
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
            <div className="p-3 border-b bg-muted/30 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Eye size={16} />
                Hover to Zoom
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                title="Close Preview"
              >
                <X size={18} />
              </Button>
            </div>

            {/* 🔍 MAGNIFIER AREA */}
            <div className="flex-1 bg-gray-100 overflow-auto flex items-start justify-center">
              <div className="shadow-lg w-full max-w-full bg-white">
                <GlassMagnifier
                  imageSrc={previewImage}
                  magnifierSize={200}
                  zoomLevel={2.5}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t bg-background z-10">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <div className="text-xs text-center text-muted-foreground hover:text-primary underline cursor-pointer">
                  {loading ? "Analyzing new file..." : "Upload different PDF"}
                </div>
              </label>
            </div>
          </div>
        ) : (
          /* --- STATE 2: UPLOAD MODE (Default) --- */
          <div className="text-center h-full flex flex-col justify-center">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 p-8 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="bg-primary/10 size-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                {loading ? (
                  <Loader2 className="animate-spin text-primary size-10" />
                ) : (
                  <FileText className="text-primary size-10" />
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">PDF Auto-Fill</h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-[240px] mx-auto">
                Upload a receipt to automatically extract data and enable{" "}
                <b>Magic Info</b>.
              </p>

              <label className="cursor-pointer block relative max-w-[200px] mx-auto">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <div className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FileUp
                        size={18}
                        className="group-hover:-translate-y-0.5 transition-transform"
                      />
                      <span>Upload PDF</span>
                    </>
                  )}
                </div>
              </label>

              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mt-8 font-semibold">
                Powered by AI & OCR
              </p>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
