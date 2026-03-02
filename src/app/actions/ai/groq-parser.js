"use server";

import Groq from "groq-sdk";
import { detectCompany } from "@/lib/parse-receipt";

// Strip spaces from critical fields
function sanitize(data) {
  const strip = (val) => (val ? String(val).replace(/\s+/g, "") : "");

  if (data.bin) data.bin = strip(data.bin);
  if (data.receiptNo) data.receiptNo = strip(data.receiptNo);
  if (data.date) data.date = strip(data.date);
  if (data.chequeDate) data.chequeDate = strip(data.chequeDate);
  if (data.issuedAgainst) data.issuedAgainst = strip(data.issuedAgainst);

  // Clean financial fields
  ["premium", "vat", "total", "stamp"].forEach((key) => {
    if (data[key]) {
      data[key] = String(data[key]).replace(/[^0-9.]/g, "");
    }
  });

  // Flatten receivedFrom if it comes as object
  if (data.receivedFrom && typeof data.receivedFrom === "object") {
    data.receivedFrom = Object.values(data.receivedFrom).join(", ");
  }

  // Trim all string values
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === "string") {
      data[key] = data[key].trim();
    }
  });

  return data;
}

export async function parseReceiptWithAI(text) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return { success: false, error: "Groq API key missing" };
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are a strict data extraction engine for Bangladeshi insurance money receipts.

IMPORTANT: The input text may have character spacing issues from PDF extraction (e.g., "2 6 28 00 0 77" should be "262800077"). Adjacent characters separated by spaces should be joined together for fields like Receipt No, BIN, Date, and Policy numbers.

Extract the following fields into a JSON object. Rules:
1. Do NOT guess data. If a field is blank, return null.
2. Do NOT move data between fields.
3. Strip all extra spaces from: bin, receiptNo, date, chequeDate, issuedAgainst.
4. Dates must be in DD-MM-YYYY format with no spaces.
5. Financial amounts must be plain numbers without "BDT" or commas (e.g., "25142.00").
6. For clientName: extract the business/person name from the "A/C." or "A/C.M/S." pattern in receivedFrom. Remove prefixes like "M/S", "Mr." etc.
7. modeOfPayment: extract payment method AND cheque number if present (e.g., "Cheque; 5056858").

JSON Schema:
{
  "receiptNo": "string - from 'Money Receipt No'",
  "classOfInsurance": "string - from 'Class of Insurance'",
  "date": "string - DD-MM-YYYY from 'Date'",
  "receivedFrom": "string - full text after 'Received with thanks from'",
  "clientName": "string - business/person name from A/C pattern",
  "modeOfPayment": "string - from 'Mode of Payment' including cheque number",
  "drawnOn": "string or null - from 'Drawn on'",
  "issuedAgainst": "string - from 'Issued against', no spaces",
  "chequeDate": "string - DD-MM-YYYY from 'Dated' near Mode of Payment",
  "premium": "string - number only from 'Premium BDT'",
  "vat": "string - number only from 'VAT BDT'",
  "total": "string - number only from 'Total BDT'",
  "stamp": "string or null - number only from 'Stamp BDT'",
  "bin": "string - from 'BIN', no spaces"
}

Receipt Text:
${text}

Return ONLY valid JSON.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    let parsedData = JSON.parse(responseContent || "{}");

    // Sanitize output
    parsedData = sanitize(parsedData);

    // Company detection (not AI-dependent)
    if (!parsedData.companyType) {
      parsedData.companyType = detectCompany(text);
    }

    // Static fields
    parsedData.issuingOffice = "Rangpur Branch";

    // Business rule: chequeDate = date
    if (!parsedData.chequeDate && parsedData.date) {
      parsedData.chequeDate = parsedData.date;
    }

    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Groq Error:", error);
    return { success: false, error: "AI Parsing Failed" };
  }
}
