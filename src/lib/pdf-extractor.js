async function getPdfJs() {
  const pdfjsLib = await import("pdfjs-dist");
  // Using unpkg for worker script to avoid version mismatch issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  return pdfjsLib;
}
export async function extractTextFromPdf(file) {
  try {
    // 1. Load PDF
    const pdfjsLib = await getPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();

    // 2. Extract Text & Coordinates
    // Using Coordinates because PDF text items are not guaranteed to be in reading order
    let items = textContent.items.map((item) => ({
      text: item.str,
      x: item.transform[4], // X-axis
      y: item.transform[5], // Y-axis
      height: item.height || 10,
    }));

    // Filter empty text
    items = items.filter((item) => item.text.trim().length > 0);

    // 3. Sorting (Crucial Step)
    // Sort by Y-axis (Top to Bottom), then X-axis (Left to Right)
    items.sort((a, b) => {
      // Y-axis: In PDF, Y normally starts from bottom. b.y - a.y sorts Top-to-Bottom
      const yDiff = b.y - a.y;
      if (Math.abs(yDiff) < 1) {
        // If Y difference is negligible, consider same line
        return a.x - b.x; // Sort Left to Right
      }
      return yDiff;
    });

    // 4. Line Reconstruction
    const lines = [];
    let currentLineY = -1;
    let currentLineText = [];

    // Tolerance: Max Y difference to be considered the same line.
    const tolerance = 6;

    items.forEach((item) => {
      // If first item or within vertical tolerance
      if (currentLineY === -1 || Math.abs(item.y - currentLineY) < tolerance) {
        currentLineText.push(item.text);
        if (currentLineY === -1) currentLineY = item.y;
      } else {
        // New line detected
        lines.push(currentLineText.join(" ")); // Save previous line
        currentLineText = [item.text]; // Start new line
        currentLineY = item.y; // Update Y
      }
    });

    // Push the last line
    if (currentLineText.length > 0) lines.push(currentLineText.join(" "));

    // 5. Final Output
    return lines.join("\n");
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

    // Create canvasS
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
