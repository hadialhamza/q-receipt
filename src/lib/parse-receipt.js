/**
 * Enhanced Regex Parser
 * Extracts data from PDF text with smart pattern matching
 */

// Shared company detection utility
export function detectCompany(text) {
  const lower = text.toLowerCase();
  if (
    lower.includes("takaful") ||
    lower.includes("www.takaful.com.bd") ||
    lower.includes("islami insurance")
  ) {
    return "TAKAFUL";
  }
  if (lower.includes("federal") || lower.includes("www.federalinsubd.com")) {
    return "FEDERAL";
  }
  return "GLOBAL";
}

// Remove all spaces from a string (for BIN, receiptNo, dates, issuedAgainst)
function stripSpaces(str) {
  return str ? str.replace(/\s+/g, "") : "";
}

export function parseReceiptData(text) {
  // Normalize colons for consistent extraction
  const cleanText = text.replace(/:\s*/g, " : ");

  const extract = (pattern) => {
    const match = cleanText.match(pattern);
    return match ? match[1].trim() : "";
  };

  const companyType = detectCompany(text);

  const data = {
    companyType,
    issuingOffice: "Rangpur Branch",
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
    clientName: "",
  };

  try {
    // 1. BIN — full number with dash, strip spaces
    const binMatch = text.match(/BIN\s*:\s*([\d\s-]+)/i);
    if (binMatch) {
      data.bin = stripSpaces(binMatch[1]);
    }

    // 2. Receipt No — strip spaces
    const receiptMatch = cleanText.match(
      /(?:Money Receipt No|Receipt No)\s*:\s*([^\n\r]+?)(?=\s*$|\n)/im,
    );
    if (receiptMatch) {
      data.receiptNo = stripSpaces(receiptMatch[1]);
    }

    // 3. Class of Insurance — text between label and "Date"
    data.classOfInsurance = extract(
      /Class of Insurance\s*:\s*([^\n\r]+?)(?=\s+Date|Date\s*:|$)/i,
    );

    // 4. Date — extract and strip spaces, original format
    const dateMatch = cleanText.match(/Date\s*:\s*([\d\s-]+)/i);
    if (dateMatch) {
      data.date = stripSpaces(dateMatch[1]);
    }

    // 5. Cheque Date = same as date (business rule: both dates always same)
    data.chequeDate = data.date;

    // 6. Received From — multi-line capture between keyword and "The sum of"
    const receivedMatch = text.match(
      /Received with thanks from\s+([\s\S]+?)(?=\s*The sum of)/i,
    );
    if (receivedMatch) {
      data.receivedFrom = receivedMatch[1]
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // 7. Client Name — extract from A/C. or A/C.M/S. pattern
      const acMatch = data.receivedFrom.match(
        /A\/C\.(?:M\/S\.)?\s*([^,.\n]+)/i,
      );
      if (acMatch && acMatch[1]) {
        data.clientName = acMatch[1].trim();
      } else {
        // Fallback: use prefix-based extraction
        const nameRegex = /(?:Mr\.|Md\.|Mrs\.|Mst\.|M\/S|Prop\.)\s+([^,\n;]+)/i;
        const nameMatch = data.receivedFrom.match(nameRegex);
        if (nameMatch && nameMatch[1]) {
          data.clientName = nameMatch[1].trim();
        } else {
          data.clientName = data.receivedFrom
            .split(/[,;]/)[0]
            .substring(0, 50)
            .trim();
        }
      }
    }

    // 8. Mode of Payment — payment method + optional number, stop at "Dated"
    const modeMatch = text.match(/Mode of Payment\s+(.+?)\s+Dated\b/i);
    if (modeMatch) {
      data.modeOfPayment = modeMatch[1].trim();
    } else {
      // Fallback: capture until end of line
      const modeFallback = text.match(/Mode of Payment\s+(.+?)$/im);
      if (modeFallback) data.modeOfPayment = modeFallback[1].trim();
    }

    // 9. Drawn on
    data.drawnOn = extract(/Drawn on\s+(.+?)(?=\s+Issued against|$)/i);

    // 10. Issued Against — match until end of line, strip spaces
    const issuedMatch = text.match(/Issued against\s+(.+?)$/im);
    if (issuedMatch) {
      data.issuedAgainst = stripSpaces(issuedMatch[1]);
    }

    // 11. Financial Fields — amounts with commas and decimals
    data.premium = extract(/Premium\s+BDT\s+([\d,]+\.\d{2})/i).replace(
      /,/g,
      "",
    );
    data.vat = extract(/VAT\s+BDT\s+([\d,]+\.\d{2})/i).replace(/,/g, "");
    data.total = extract(/Total\s+BDT\s+([\d,]+\.\d{2})/i).replace(/,/g, "");

    const stampMatch = cleanText.match(/Stamp\s+BDT\s+([\d,]+\.\d{2})/i);
    if (stampMatch) {
      data.stamp = stampMatch[1].replace(/,/g, "");
    }

    // 12. sumOf — will be calculated in post-processing (PdfUpload)
    // For now, extract raw if available
    const sumMatch = text.match(/The sum of\s+([\s\S]+?)(?=\n|$)/i);
    if (sumMatch) {
      data.sumOf = sumMatch[1].trim();
    }
  } catch (error) {
    console.error("Regex Parsing Error:", error);
  }

  return data;
}
