/**
 * PDF Utility Functions
 * Uses pdfjs-dist to handle PDF text extraction and image rendering
 */

// Helper to get PDFJS
async function getPdfJs() {
  const pdfjsLib = await import("pdfjs-dist");
  // Using unpkg for worker script to avoid version mismatch issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  return pdfjsLib;
}

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPdf(file) {
  try {
    const pdfjsLib = await getPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText.trim();
  } catch (error) {
    console.error("PDF Text Error:", error);
    throw new Error("Failed to extract text.");
  }
}

/**
 * Render the first page of PDF as an Image Data URL
 * Used for the visual preview with magnifier
 */
export async function renderPdfToImage(file) {
  try {
    const pdfjsLib = await getPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Get the first page
    const page = await pdf.getPage(1);

    // Set scale to 2.0 for high quality zoom
    const viewport = page.getViewport({ scale: 2.0 });

    // Create canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    // Convert to Image URL
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("PDF Image Error:", error);
    return null;
  }
}
