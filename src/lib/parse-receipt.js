/**
 * Fallback Regex Parser
 * Used when AI fails or for offline processing
 */

function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return dateStr;
}

export function parseReceiptData(text) {
  const cleanText = text.replace(/\s+/g, " ").trim();

  const data = {
    companyType: "GLOBAL", // Default company type
    issuingOffice: "",
    receiptNo: "",
    classOfInsurance: "",
    date: "",
    receivedFrom: "",
    sumOf: "",
    modeOfPayment: "",
    drawnOn: "",
    issuedAgainst: "",
    chequeDate: "",
    premium: "",
    vat: "",
    total: "",
  };

  try {
    // 1. Receipt No (Generic Pattern: Matches "RNP-..." or just numbers)
    const receiptNoMatch = cleanText.match(
      /(?:Money Receipt No|Receipt No)[\s.:]*([A-Z0-9-]+)/i,
    );
    if (receiptNoMatch) data.receiptNo = receiptNoMatch[1];

    // 2. Issuing Office (Heuristic: Text before Receipt No)
    if (data.receiptNo) {
      let textBefore = cleanText.split(data.receiptNo)[0];
      // Remove headers
      textBefore = textBefore
        .replace(
          /(Money Receipt No|Issuing Office|Date\s*:|MONEY RECEIPT)/gi,
          "",
        )
        .trim();
      const officeMatch = textBefore.match(
        /([a-zA-Z\s]+Branch|[a-zA-Z\s]+Office)$/i,
      );
      if (officeMatch) data.issuingOffice = officeMatch[0].trim();
    }

    // 3. Class of Insurance
    const classMatch = cleanText.match(/(Fire|Marine|Motor|Miscellaneous)/i);
    if (classMatch) data.classOfInsurance = classMatch[1];

    // 4. Date
    const dateMatch = cleanText.match(/(\d{2}-\d{2}-\d{4})/);
    if (dateMatch) data.date = formatDateForInput(dateMatch[1]);

    // 5. Received From (Generic Sandwich)
    const clientMatch = cleanText.match(
      /Received with thanks from\s+(.*?)\s+(?:MUSHAK|Premium|The sum of)/i,
    );
    if (clientMatch) data.receivedFrom = clientMatch[1].trim();

    // 6. Sum of (Text in parentheses)
    const sumWordsMatch =
      cleanText.match(/\(([^)]*One Lakh[^)]*)\)/i) ||
      cleanText.match(/\( (.*?) \)/i);
    if (sumWordsMatch) {
      let extractedSum = sumWordsMatch[1].trim();
      if (!extractedSum.toLowerCase().endsWith("taka")) extractedSum += " taka";
      data.sumOf = extractedSum;
    }

    // 7. Mode of Payment
    const modeMatch = cleanText.match(/(Cheque[;\s]*\d+|Cash)/i);
    if (modeMatch) data.modeOfPayment = modeMatch[1];

    // 8. Drawn on (Strict regex for fallback too)
    const bankMatch = cleanText.match(
      /Drawn on\s+([a-zA-Z\s]+Bank[a-zA-Z\s]*)/i,
    );
    if (bankMatch) data.drawnOn = bankMatch[1].trim();

    // 9. Financials
    const premiumMatch = cleanText.match(
      /Premium\s*(?:BDT)?\s*([\d,]+\.\d{2})/i,
    );
    if (premiumMatch) data.premium = premiumMatch[1].replace(/,/g, "");

    const vatMatch = cleanText.match(/VAT\s*(?:BDT)?\s*([\d,]+\.\d{2})/i);
    if (vatMatch) data.vat = vatMatch[1].replace(/,/g, "");

    const totalMatch = cleanText.match(/Total\s*(?:BDT)?\s*([\d,]+\.\d{2})/i);
    if (totalMatch) data.total = totalMatch[1].replace(/,/g, "");
  } catch (error) {
    console.error("Regex Parsing Error:", error);
  }

  return data;
}
