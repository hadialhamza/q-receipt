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

    // 2. Process text items with coordinates
    let items = textContent.items.map((item) => ({
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
    }));

    // Filter empty text
    items = items.filter((item) => item.text.trim().length > 0);

    // 3. Sort line by line (Y-axis sorting)
    items.sort((a, b) => b.y - a.y || a.x - b.x);

    const lines = [];
    let currentLineY = -1;
    let currentLineText = [];
    const tolerance = 6;

    items.forEach((item) => {
      if (currentLineY === -1 || Math.abs(item.y - currentLineY) < tolerance) {
        currentLineText.push(item.text);
        currentLineY = item.y;
      } else {
        lines.push(currentLineText.join(" "));
        currentLineText = [item.text];
        currentLineY = item.y;
      }
    });
    if (currentLineText.length > 0) lines.push(currentLineText.join(" "));

    // 4. Apply logic to extract only relevant parts
    const finalRawLines = [];
    let startCapturing = false;
    let binLine = null;

    for (const line of lines) {
      // Find BIN (wherever it is in the header)
      if (line.toUpperCase().includes("BIN")) {
        binLine = line.trim();
      }

      // Start capturing when "Issuing Office" is found
      if (line.toLowerCase().includes("issuing office")) {
        startCapturing = true;
      }

      // If capture mode is on, take the lines
      if (startCapturing) {
        // Skip unnecessary lines
        const lowerLine = line.toLowerCase();
        if (
          lowerLine.includes("money receipt") ||
          lowerLine.includes("mushak")
        ) {
          continue; // Skip this line
        }

        finalRawLines.push(line.trim());
      }
    }

    // Add BIN number to the top (if found)
    if (binLine && !finalRawLines.includes(binLine)) {
      finalRawLines.unshift(binLine);
    }

    return finalRawLines.join("\n");
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
