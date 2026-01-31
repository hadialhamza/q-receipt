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

Required Data:
- issuingOffice (Text associated with "Issuing Office")
- receiptNo (Text associated with "Money Receipt No" or "Receipt No")
- classOfInsurance (Fire/Marine/Motor/Miscellaneous)
- date (Main receipt date, YYYY-MM-DD)
- receivedFrom (Full text block under "Received with thanks from")

- sumOf (COMBINED STRING: Extract the numeric amount followed by the amount in words exactly as shown in the PDF. 
  Example format: "1,02,695.00 (One Lakh Two Thousand Six Hundred Ninety Five taka)". 
  Do NOT return them separately. Keep the parentheses.)

- modeOfPayment (Cheque/Cash details)
- drawnOn (Bank name IF present next to "Drawn on" label)
- issuedAgainst (Policy number/Code)
- chequeDate (Look specifically for the label "Dated" at the bottom of the receipt. Convert to YYYY-MM-DD.)
- premium (Numeric value)
- vat (Numeric value)
- total (Numeric value)

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

    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Groq Error:", error);
    return { success: false, error: "AI Parsing Failed" };
  }
}
