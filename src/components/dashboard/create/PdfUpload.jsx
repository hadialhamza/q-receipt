"use client";

import { useState } from "react";
import { FileUp, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { extractTextFromPdf } from "@/lib/pdf-extractor";
import { parseReceiptData } from "@/lib/parse-receipt";

export function PdfUpload({ onDataExtracted }) {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }

        setLoading(true);
        setFileName(file.name);

        try {
            toast.info("Extracting text from PDF...");

            // Extract text using pdfjs-dist
            const text = await extractTextFromPdf(file);

            console.log("=== EXTRACTED TEXT ===");
            console.log(text);
            console.log("===================");

            // Parse extracted text using parse-receipt utility
            const extractedData = parseReceiptData(text);

            if (Object.keys(extractedData).length > 0) {
                onDataExtracted(extractedData);
                toast.success("Text extracted successfully!");
            } else {
                toast.warning("Could not extract receipt data. Please fill manually.");
            }
        } catch (error) {
            console.error("PDF extraction error:", error);
            toast.error(error.message || "Failed to process PDF. Please try again.");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    return (
        <div className="rounded-lg border bg-card p-6 text-center sticky top-6">
            <div className="bg-primary/10 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {loading ? (
                    <Loader2 className="animate-spin text-primary" size={32} />
                ) : (
                    <FileText className="text-primary" size={32} />
                )}
            </div>

            <h3 className="text-lg font-bold mb-2">PDF Auto-Fill</h3>
            <p className="text-sm text-muted-foreground mb-6">
                Upload a digital PDF receipt. Text will be extracted automatically.
            </p>

            <label className="cursor-pointer block">
                <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={loading}
                />
                <span className="block w-full bg-background border hover:border-primary text-foreground font-medium py-3 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50">
                    <FileUp className="inline-block mr-2 mb-1" size={18} />
                    {loading ? "Extracting..." : "Upload PDF"}
                </span>
            </label>

            {fileName && !loading && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-3 flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} />
                    {fileName}
                </p>
            )}

            <p className="text-xs text-muted-foreground mt-4">
                Direct text extraction from digital PDFs
            </p>
        </div>
    );
}
