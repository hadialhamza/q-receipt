/**
 * Verifies extracted data against raw PDF text with Aggressive Normalization.
 * Prevents False Positives caused by spacing/formatting issues.
 */
export function verifyExtraction(rawText, extractedData) {
  const status = {};

  // Normalize: lowercase + remove all spaces, dots, commas, dashes
  const normalize = (str) => {
    if (!str) return "";
    return String(str)
      .toLowerCase()
      .replace(/[\s,\.\-\/:]/g, "");
  };

  const normalizedRawText = normalize(rawText);

  Object.keys(extractedData).forEach((key) => {
    const aiValue = extractedData[key];

    // Skip empty fields
    if (!aiValue || aiValue === "null") {
      status[key] = "empty";
      return;
    }

    let isMatch = false;

    // Rule 1: Dates (Check both YYYY-MM-DD and DD-MM-YYYY)
    if (key.toLowerCase().includes("date")) {
      const parts = String(aiValue).split("-");
      if (parts.length === 3) {
        // Check YYYYMMDD and DDMMYYYY
        const format1 = normalize(`${parts[2]}-${parts[1]}-${parts[0]}`); // 30122025
        const format2 = normalize(aiValue); // 20251230

        isMatch =
          normalizedRawText.includes(format1) ||
          normalizedRawText.includes(format2);
      } else {
        isMatch = normalizedRawText.includes(normalize(aiValue));
      }
    }

    // Rule 2: Universal Check (Text & Amounts)
    else {
      const normalizedAIValue = normalize(aiValue);
      // Only verify if the value has meaningful length
      if (normalizedAIValue.length > 0) {
        isMatch = normalizedRawText.includes(normalizedAIValue);
      } else {
        isMatch = true; // Empty string is strictly not a mismatch
      }
    }

    status[key] = isMatch ? "verified" : "mismatch";
  });

  return status;
}
