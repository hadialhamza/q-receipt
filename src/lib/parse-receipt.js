/**
 * Helper function to convert DD-MM-YYYY to YYYY-MM-DD
 */
function formatDateForInput(dateStr) {
    if (!dateStr) return "";
    const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (match) {
        return `${match[3]}-${match[2]}-${match[1]}`;
    }
    return dateStr;
}

export function parseReceiptData(text) {
    // 1. Clean the text
    const cleanText = text.replace(/\s+/g, " ").trim();

    const data = {
        issuingOffice: "Rangpur Branch", // Static value
        receiptNo: "",
        classOfInsurance: "",
        date: "",
        receivedFrom: "",
        sumOf: "",
        amountNumber: "",
        modeOfPayment: "",
        drawnOn: "",
        issuedAgainst: "",
        chequeDate: "",
        premium: "",
        vat: "",
        total: "",
    };

    try {
        // --- 1. Receipt No (Pattern: RNP-YYYY-XXXXXX) ---
        const receiptNoMatch = cleanText.match(/(RNP-\d{4}-\d+)/);
        if (receiptNoMatch) {
            data.receiptNo = receiptNoMatch[1];
        }

        // --- 2. Class of Insurance ---
        const classMatch = cleanText.match(/(Fire|Marine|Motor|Miscellaneous)/i);
        if (classMatch) data.classOfInsurance = classMatch[1];

        // --- 3. Date ---
        const dateMatch = cleanText.match(/(\d{2}-\d{2}-\d{4})/);
        if (dateMatch) {
            data.date = formatDateForInput(dateMatch[1]);
        }

        // --- 4. Received From ---
        const clientMatch = cleanText.match(/Received with thanks from\s+(.*?)\s+(?:MUSHAK|Premium)/i);
        if (clientMatch) {
            data.receivedFrom = clientMatch[1].trim();
        }

        // --- FIX: Sum of (Prevent Double Taka) ---
        // Capture text inside parentheses
        const sumWordsMatch = cleanText.match(/\(([^)]*One Lakh[^)]*)\)/i) || cleanText.match(/\( (.*?) \)/i);

        if (sumWordsMatch) {
            let extractedSum = sumWordsMatch[1].trim();
            // Only add 'taka' if it's NOT already there
            if (!extractedSum.toLowerCase().endsWith('taka')) {
                extractedSum += " taka";
            }
            data.sumOf = extractedSum;
        } else {
            // Fallback
            const fallbackSum = cleanText.match(/Tk\.\s*[\d,]+\.\d{2}\s*\((.*?)\)/);
            if (fallbackSum) data.sumOf = fallbackSum[1];
        }

        // --- 5. Mode of Payment ---
        const modeMatch = cleanText.match(/(Cheque[;\s]*\d+|Cash)/i);
        if (modeMatch) data.modeOfPayment = modeMatch[1];

        // --- 6. Drawn on & Cheque Date ---
        const bankMatch = cleanText.match(/([a-zA-Z\s]+Bank[a-zA-Z\s]*)\s+(\d{2}-\d{2}-\d{4})/i);
        if (bankMatch) {
            data.drawnOn = bankMatch[1].trim();
            data.chequeDate = formatDateForInput(bankMatch[2].trim());
        }

        // --- 7. Issued Against ---
        const issuedMatch = cleanText.match(/(GIL\/[A-Z0-9\/-]+)/);
        if (issuedMatch) data.issuedAgainst = issuedMatch[1];

        // --- 8. Financials ---
        const premiumMatch = cleanText.match(/Premium\s*BDT\s*([\d,]+\.\d{2})/i);
        if (premiumMatch) data.premium = premiumMatch[1].replace(/,/g, "");

        const vatMatch = cleanText.match(/VAT\s*BDT\s*([\d,]+\.\d{2})/i);
        if (vatMatch) data.vat = vatMatch[1].replace(/,/g, "");

        // Total Logic
        if (data.premium && data.vat) {
            const totalCalc = parseFloat(data.premium) + parseFloat(data.vat);
            data.total = totalCalc.toFixed(2);
        } else {
            const totalMatch = cleanText.match(/Total\s*(?:BDT)?\s*([\d,]+\.\d{2})/i);
            if (totalMatch) data.total = totalMatch[1].replace(/,/g, "");
        }

    } catch (error) {
        console.error("Parsing Error:", error);
    }

    return data;
}