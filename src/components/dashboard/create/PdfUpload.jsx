"use client";

import { useState } from "react";
import { FileUp, Loader2, FileText, X, Eye, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { extractTextFromPdf, renderPdfToImage } from "@/lib/pdf-extractor";
import { parseReceiptData } from "@/lib/parse-receipt";
import { parseReceiptWithAI } from "@/app/actions/ai/groq-parser";
import { verifyExtraction, validateExtraction } from "@/lib/verification";
import { Button } from "@/components/ui/button";
import { GlassMagnifier } from "@/components/ui/GlassMagnifier";

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

      console.log("=== RAW TEXT ===", text);

      // ----------------------------------------------------
      // LEVEL 1: REGEX PARSING (Offline / Fast)
      // ----------------------------------------------------
      const regexData = parseReceiptData(text);

      // ----------------------------------------------------
      // LEVEL 2: VALIDATION GATE
      // ----------------------------------------------------
      const { isValid, missingFields } = validateExtraction(regexData);

      if (isValid) {
        // SUCCESS: Regex found everything (including clientName via regex)
        console.log("✅ Regex Extraction Successful!", regexData);

        toast.success("Data extracted successfully! ⚡");

        const verificationStatus = verifyExtraction(text, regexData);
        onDataExtracted(regexData, verificationStatus);

        setLoading(false);
        return; // EXIT EARLY (Skip AI)
      }

      // ----------------------------------------------------
      // LEVEL 3: AI BACKUP (Only if Validation Fails)
      // ----------------------------------------------------
      console.warn("⚠️ Regex incomplete. Missing:", missingFields);
      toast.warning(`Switching to AI... Missing: ${missingFields.join(", ")}`);

      try {
        const aiResult = await parseReceiptWithAI(text);

        if (aiResult.success) {
          console.log("🤖 AI Extraction Result:", aiResult.data);
          toast.success("AI Enhanced Extraction Complete 🤖");

          const verificationStatus = verifyExtraction(text, aiResult.data);
          onDataExtracted(aiResult.data, verificationStatus);
        } else {
          // AI Failed, force fallback data anyway
          toast.error("AI failed too. Using partial data.");
          onDataExtracted(regexData, {});
        }
      } catch (aiError) {
        console.error("AI Error:", aiError);
        toast.error("AI Error. Using partial data.");
        onDataExtracted(regexData, {});
      }

    } catch (error) {
      console.error("Extraction error:", error);
      toast.error("Failed to process PDF.");
      setPreviewImage(null);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const clearFile = () => {
    setPreviewImage(null);
    onDataExtracted({}, {});
  };

  return (
    <div
      className={`rounded-lg border bg-card ${previewImage ? "p-0 overflow-hidden" : "p-6"} sticky top-6 transition-all duration-300`}
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
          <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-4">
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
        <div className="text-center">
          <div className="bg-primary/10 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {loading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : (
              <FileText className="text-primary" size={32} />
            )}
          </div>

          <h3 className="text-lg font-bold mb-2">PDF Auto-Fill</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Upload a receipt to extract data and enable <b>Magic Zoom</b>{" "}
            preview.
          </p>

          <label className="cursor-pointer block">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
              disabled={loading}
            />
            <span className=" w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <FileUp size={18} />
                  Upload PDF
                </>
              )}
            </span>
          </label>

          <p className="text-xs text-muted-foreground mt-4">
            Powered by AI & OCR
          </p>
        </div>
      )}
    </div>
  );
}
