/**
 * Verifies extracted data against raw PDF text with Confidence Scoring.
 * Returns per-field scores and overall accuracy percentage.
 */
export function verifyExtraction(rawText, extractedData) {
  const fieldScores = {};

  // Normalize: lowercase + remove all spaces, dots, commas, dashes
  const normalize = (str) => {
    if (!str) return "";
    return String(str)
      .toLowerCase()
      .replace(/[\s,.\-/:]/g, "");
  };

  const normalizedRawText = normalize(rawText);

  // Weight map — financial fields get higher weight
  const fieldWeights = {
    receiptNo: 10,
    date: 8,
    classOfInsurance: 6,
    receivedFrom: 5,
    clientName: 4,
    modeOfPayment: 5,
    issuedAgainst: 6,
    premium: 10,
    vat: 8,
    total: 10,
    bin: 7,
    stamp: 4,
    chequeDate: 3,
    sumOf: 3,
    drawnOn: 2,
  };

  let totalWeight = 0;
  let weightedScore = 0;

  Object.keys(extractedData).forEach((key) => {
    const value = extractedData[key];

    // Skip non-verifiable fields
    if (key === "companyType" || key === "issuingOffice") return;

    // Skip empty fields
    if (!value || value === "null" || value === "") {
      fieldScores[key] = { score: 0, status: "empty" };
      return;
    }

    const weight = fieldWeights[key] || 3;
    let score = 0;

    // Date fields: check multiple formats
    if (key.toLowerCase().includes("date")) {
      const parts = String(value).split("-");
      if (parts.length === 3) {
        const format1 = normalize(`${parts[2]}-${parts[1]}-${parts[0]}`);
        const format2 = normalize(value);
        if (
          normalizedRawText.includes(format1) ||
          normalizedRawText.includes(format2)
        ) {
          score = 100;
        }
      } else {
        score = normalizedRawText.includes(normalize(value)) ? 100 : 0;
      }
    }
    // Financial fields: check numeric value presence
    else if (["premium", "vat", "total", "stamp"].includes(key)) {
      const numericVal = normalize(value);
      if (numericVal.length > 0 && normalizedRawText.includes(numericVal)) {
        score = 100;
      } else {
        // Partial match: check without decimals
        const intPart = normalize(String(Math.floor(parseFloat(value) || 0)));
        score = normalizedRawText.includes(intPart) ? 80 : 0;
      }
    }
    // Text fields
    else {
      const normalizedVal = normalize(value);
      if (normalizedVal.length === 0) {
        score = 100; // Empty extracted = not mismatch
      } else if (normalizedRawText.includes(normalizedVal)) {
        score = 100; // Exact match
      } else {
        // Partial match: check if significant portion exists
        const words = String(value)
          .split(/\s+/)
          .filter((w) => w.length > 2);
        if (words.length > 0) {
          const matchedWords = words.filter((w) =>
            normalizedRawText.includes(normalize(w)),
          );
          score = Math.round((matchedWords.length / words.length) * 100);
        }
      }
    }

    const status =
      score >= 80
        ? "verified"
        : score >= 40
          ? "partial"
          : score > 0
            ? "weak"
            : "mismatch";
    fieldScores[key] = { score, status };

    totalWeight += weight;
    weightedScore += (score / 100) * weight;
  });

  // Financial cross-check: premium + vat + stamp ≈ total
  const premium =
    parseFloat(String(extractedData.premium || "0").replace(/,/g, "")) || 0;
  const vat =
    parseFloat(String(extractedData.vat || "0").replace(/,/g, "")) || 0;
  const stamp =
    parseFloat(String(extractedData.stamp || "0").replace(/,/g, "")) || 0;
  const total =
    parseFloat(String(extractedData.total || "0").replace(/,/g, "")) || 0;
  const calculatedTotal = premium + vat + stamp;
  const financialValid = total > 0 && Math.abs(calculatedTotal - total) < 1;

  // Overall accuracy percentage
  const overallConfidence =
    totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;

  return {
    fieldScores,
    overallConfidence,
    financialValid,
  };
}

/**
 * Validation Gate — checks critical fields
 */
export function validateExtraction(data) {
  const criticalFields = [
    "receiptNo",
    "total",
    "date",
    "classOfInsurance",
    "premium",
  ];

  const missingFields = criticalFields.filter(
    (f) => !data[f] || data[f] === "",
  );
  const isValid = missingFields.length === 0;

  return { isValid, missingFields };
}
