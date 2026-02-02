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
  // Normalize colons: Ensure "Field:Value" has spacing "Field : Value" for easier parsing
  const cleanText = text.replace(/:\s*/g, " : ");

  const extract = (pattern) => {
    const match = cleanText.match(pattern);
    return match ? match[1].trim() : "";
  };

  // Company Detection Logic
  let companyType = "GLOBAL";
  const lowerText = text.toLowerCase();
  if (lowerText.includes("takaful") || lowerText.includes("www.takaful.com.bd")) {
    companyType = "TAKAFUL";
  } else if (lowerText.includes("federal") || lowerText.includes("www.federalinsubd.com")) {
    companyType = "FEDERAL";
  }

  const data = {
    companyType, // Dynamic company type
    issuingOffice: "Rangpur Branch", // Default static as requested
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
    bin: "",
    stamp: "",
  };

  try {
    // 1. Basic Fields (Key : Value)
    data.bin = extract(/BIN\s*:\s*([\d-]+)/i);
    data.receiptNo = extract(/(?:Money Receipt No|Receipt No)\s*:\s*([A-Z0-9-]+)/i);
    data.classOfInsurance = extract(/Class of Insurance\s*:\s*([^\n\r]+?)(?=\s+Date|Date\s*:|$)/i);

    // 2. Dates (DD-MM-YYYY)
    // Primary Date
    const dateMatch = cleanText.match(/Date\s*:\s*(\d{2}-\d{2}-\d{4})/i);
    if (dateMatch) data.date = dateMatch[1];

    // Cheque Date
    const chequeDateMatch = cleanText.match(/Dated\s*(\d{2}-\d{2}-\d{4})/i);
    if (chequeDateMatch) data.chequeDate = chequeDateMatch[1];

    // 3. Received From (Multi-line sandwich)
    // Captures text between "Received with thanks from" and the next known keyword
    const clientMatch = cleanText.match(
      /Received with thanks from\s+([\s\S]+?)(?=\s+(?:The sum of|Mode of Payment|MUSHAK))/i
    );
    if (clientMatch) {
      data.receivedFrom = clientMatch[1].replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    }

    // 4. Sum of (Text in parentheses)
    const sumMatch = cleanText.match(/The sum of.*?\(([^)]+)\)/i);
    if (sumMatch) {
      let sumText = sumMatch[1].trim();
      if (!sumText.toLowerCase().includes("taka")) sumText += " taka";
      const amountMatch = cleanText.match(/The sum of.*?Tk\.\s*([\d,]+\.\d{2})/i);
      if (amountMatch) {
        data.sumOf = `${amountMatch[1]} (${sumText})`;
      } else {
        data.sumOf = sumText;
      }
    }

    // 5. Mode of Payment
    data.modeOfPayment = extract(/Mode of Payment\s+(.+?)(?=\s+Dated|\s+Drawn on|$)/i);

    // 6. Drawn on
    data.drawnOn = extract(/Drawn on\s+(.+?)(?=\s+Issued against|$)/i);

    // 7. Issued Against
    data.issuedAgainst = extract(/Issued against\s+([A-Z0-9\/-]+)/i);

    // 8. Financials
    data.premium = extract(/Premium\s+BDT\s+([\d,]+\.\d{2})/i).replace(/,/g, "");
    data.vat = extract(/VAT\s+BDT\s+([\d,]+\.\d{2})/i).replace(/,/g, "");
    data.total = extract(/Total\s+BDT\s+([\d,]+\.\d{2})/i).replace(/,/g, "");

    // Stamp (Optional)
    const stampMatch = cleanText.match(/Stamp\s+BDT\s+([\d,]+\.\d{2})/i);
    if (stampMatch) data.stamp = stampMatch[1].replace(/,/g, "");

  } catch (error) {
    console.error("Regex Parsing Error:", error);
  }

  return data;
}
