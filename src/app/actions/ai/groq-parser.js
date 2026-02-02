"use server";

import Groq from "groq-sdk";

export async function parseReceiptWithAI(text) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return { success: false, error: "Groq API key missing" };
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are a strict data extraction engine. The input text is already structured with key-value pairs (e.g., "Field : Value"). 
      
      YOUR JOB:
      1. Map the text values to the JSON fields below.
      2. Fix any minor OCR errors (e.g., "Banl" -> "Bank").
      3. Format dates as DD-MM-YYYY.

      CRITICAL RULES:
      1. **NO INFERENCE:** Do not guess data. If a field is blank in the text, return null.
      2. **NO TRANSFER:** Do NOT move data from one field to another.
      3. **FULL TEXT EXTRACTION:** For "classOfInsurance", extract the COMPLETE line text.

      Required Data:
      - issuingOffice (Static: "Rangpur Branch" - or extract from "Issuing Office :")
      - receiptNo (Extract from "Money Receipt No :")
      - classOfInsurance (Extract from "Class of Insurance :")
      - date (Extract from "Date :", Format: DD-MM-YYYY)
      - receivedFrom (Extract from "Received with thanks from" block)
      - sumOf (Extract from "The sum of". Keep the format "amount (words)")
      - modeOfPayment (Extract from "Mode of Payment")
      - drawnOn (Extract from "Drawn on")
      - issuedAgainst (Extract from "Issued against")
      - chequeDate (Extract from "Dated", Format: DD-MM-YYYY)
      - premium (Extract from "Premium BDT")
      - vat (Extract from "VAT BDT")
      - total (Extract from "Total BDT")
      - bin (Extract from "BIN :")
      - stamp (Extract from "Stamp BDT" if present)

      Receipt Text:
      ${text}

      Return ONLY valid JSON.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0, // Strict deterministic mode
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    const parsedData = JSON.parse(responseContent || "{}");

    // Fix: If receivedFrom comes as an object, flatten it to string
    if (
      parsedData.receivedFrom &&
      typeof parsedData.receivedFrom === "object"
    ) {
      parsedData.receivedFrom = Object.values(parsedData.receivedFrom).join(
        ", ",
      );
    }

    // Improved company detection logic
    if (!parsedData.companyType) {
      const lowerText = text.toLowerCase();
      if (
        lowerText.includes("takaful") ||
        lowerText.includes("islami insurance")
      ) {
        parsedData.companyType = "TAKAFUL";
      } else if (lowerText.includes("federal insurance")) {
        parsedData.companyType = "FEDERAL";
      } else {
        parsedData.companyType = "GLOBAL";
      }
    }

    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Groq Error:", error);
    return { success: false, error: "AI Parsing Failed" };
  }
}
