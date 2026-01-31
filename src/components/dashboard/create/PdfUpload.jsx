"use client";

import { useState } from "react";
import { FileUp, Loader2, FileText, X, Eye, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { extractTextFromPdf, renderPdfToImage } from "@/lib/pdf-extractor";
import { parseReceiptData } from "@/lib/parse-receipt";
import { parseReceiptWithAI } from "@/app/actions/ai/groq-parser";
import { verifyExtraction } from "@/lib/verification";
import { Button } from "@/components/ui/button";
import { GlassMagnifier } from "@/components/ui/GlassMagnifier"; // আমাদের কাস্টম কম্পোনেন্ট

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

      // ১. প্যারালাল প্রসেসিং: টেক্সট এবং ইমেজ একসাথে জেনারেট হবে
      const [text, imageUrl] = await Promise.all([
        extractTextFromPdf(file), // টেক্সট বের করা
        renderPdfToImage(file), // ইমেজ বানানো (Zoom এর জন্য)
      ]);

      // প্রিভিউ সেট করা
      if (imageUrl) {
        setPreviewImage(imageUrl);
      }

      console.log("=== EXTRACTED TEXT ===", text);

      // ২. AI Parsing শুরু
      try {
        toast.loading("AI Analyzing...");
        const aiResult = await parseReceiptWithAI(text);

        if (aiResult.success) {
          const verificationStatus = verifyExtraction(text, aiResult.data);
          onDataExtracted(aiResult.data, verificationStatus);

          toast.dismiss();
          toast.success("Success! Data Verified. 🤖");
          setLoading(false);
          return;
        }
      } catch (aiError) {
        console.warn("AI Parsing failed:", aiError);
        toast.dismiss();
        toast.warning("AI busy, switching to offline mode... ⚡");
      }

      // ৩. Fallback Regex Parsing
      const manualData = parseReceiptData(text);
      if (Object.keys(manualData).length > 0) {
        onDataExtracted(manualData, {});
        toast.success("Data extracted using offline mode! ⚡");
      } else {
        toast.error("Could not read receipt data automatically.");
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
            <span className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
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
