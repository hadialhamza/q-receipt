/**
 * PDF Text Extractor Utility
 * Extracts text from digital PDFs using pdfjs-dist (client-side)
 */

/**
 * Extract text from a PDF file
 * @param {File} file - PDF file object
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromPdf(file) {
    try {
        // Dynamically import pdfjs-dist
        const pdfjsLib = await import("pdfjs-dist");

        // Configure worker from unpkg CDN (more reliable than cdnjs)
        // Using unpkg without version will automatically use the installed package version
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";

        // Loop through all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Extract text items and join them
            const pageText = textContent.items
                .map((item) => item.str)
                .join(" ");

            fullText += pageText + "\n";
        }

        return fullText.trim();
    } catch (error) {
        console.error("PDF extraction error:", error);

        if (error.name === "PasswordException") {
            throw new Error("This PDF is password-protected. Please use an unlocked PDF.");
        }

        throw new Error("Failed to extract text from PDF. Please ensure it's a valid PDF file.");
    }
}
