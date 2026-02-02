"use server";

import Groq from "groq-sdk";

export async function parseReceiptWithAI(text) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return { success: false, error: "Groq API key missing" };
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are a strict data extraction engine. Extract data EXACTLY as it appears in the text.
    
      CRITICAL RULES:
      1. **NO INFERENCE:** Do not guess data. If a field is blank in the text, return null.
      2. **NO TRANSFER:** Do NOT move data from one field to another.
      3. **DRAWN ON RULE:** Only extract "Drawn on" if it is explicitly written next to the label. If blank, return null.
      4. **CLEAN CLIENT NAME:** In "receivedFrom", capture the full name/address block but EXCLUDE system labels like "MUSHAK", "BIN", "MONEY RECEIPT", or "Date".
      5. **FULL TEXT EXTRACTION:** For "classOfInsurance", extract the COMPLETE line text (e.g., "Marine Cargo" instead of just "Marine"). Do NOT truncate.

      Required Data:
      - issuingOffice (Text associated with "Issuing Office")
      - receiptNo (Text associated with "Money Receipt No" or "Receipt No")
      - classOfInsurance (Full descriptive text, e.g. "Marine Cargo", "Fire & Allied Perils")
      - date (Main receipt date. FORMAT: DD-MM-YYYY exactly as in source)
      - receivedFrom (Full text block under "Received with thanks from")

      - sumOf (COMBINED STRING: Extract the numeric amount followed by the amount in words exactly as shown in the PDF. 
        Example format: "1,02,695.00 (One Lakh Two Thousand Six Hundred Ninety Five taka)". 
        Do NOT return them separately. Keep the parentheses.)

      - modeOfPayment (Cheque/Cash details)
      - drawnOn (Bank name IF present next to "Drawn on" label)
      - issuedAgainst (Policy number/Code)
      - chequeDate (Look specifically for the label "Dated" at the bottom of the receipt. FORMAT: DD-MM-YYYY exactly as in source)
      - premium (Numeric value)
      - vat (Numeric value)
      - total (Numeric value)
      
      - bin (Look for "BIN:" or "BIN" and extract the number following it, e.g. "000001297-0202")
      - stamp (Look for "Stamp" value relative to financial amounts. If present, extract numeric value. If not found, return null)

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
