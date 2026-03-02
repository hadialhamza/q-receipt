async function getPdfJs() {
  const pdfjsLib = await import("pdfjs-dist");
  // Using unpkg for worker script to avoid version mismatch issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  return pdfjsLib;
}
export async function extractTextFromPdf(file) {
  try {
    const pdfjsLib = await getPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();

    // Extract text items with coordinates and width
    let items = textContent.items.map((item) => ({
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width || 0,
      height: item.height || 10,
    }));

    items = items.filter((item) => item.text.trim().length > 0);

    // Sort: Top-to-Bottom (Y descending), then Left-to-Right (X ascending)
    items.sort((a, b) => {
      const yDiff = b.y - a.y;
      if (Math.abs(yDiff) < 1) return a.x - b.x;
      return yDiff;
    });

    // Line reconstruction with Smart Character Proximity Detection
    const LINE_TOLERANCE = 6; // Max Y diff for same line
    const CHAR_PROXIMITY = 2; // Max gap (px) to join without space

    const lineGroups = [];
    let currentGroup = [];
    let currentLineY = -1;

    items.forEach((item) => {
      if (
        currentLineY === -1 ||
        Math.abs(item.y - currentLineY) < LINE_TOLERANCE
      ) {
        currentGroup.push(item);
        if (currentLineY === -1) currentLineY = item.y;
      } else {
        if (currentGroup.length > 0) lineGroups.push(currentGroup);
        currentGroup = [item];
        currentLineY = item.y;
      }
    });
    if (currentGroup.length > 0) lineGroups.push(currentGroup);

    // Build lines using proximity-based joining
    const lines = lineGroups.map((group) => {
      // Sort group items by X position (left to right)
      group.sort((a, b) => a.x - b.x);

      let lineText = group[0].text;
      for (let i = 1; i < group.length; i++) {
        const prev = group[i - 1];
        const curr = group[i];
        // Calculate actual pixel gap between end of prev item and start of current
        const gap = curr.x - (prev.x + prev.width);

        if (gap < CHAR_PROXIMITY) {
          // Close proximity: join directly (fragmented characters)
          lineText += curr.text;
        } else {
          // Normal gap: add space
          lineText += " " + curr.text;
        }
      }
      return lineText;
    });

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
