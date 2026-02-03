"use server";

import Groq from "groq-sdk";

export async function extractClientNameAI(text) {
  try {
    if (!text || !text.trim()) return { success: false, name: null };
    if (!process.env.GROQ_API_KEY) {
      return { success: false, error: "Groq API key missing" };
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are a Name Entity Recognition expert. Extract the Client Name or Business Name (Not the bank name) from the provided text. Business names mostly can be Bangladeshi local standard names like "M/S ABC Traders", "XYZ Enterprise", "ABC Hardware", "ABC Import Export", etc.
    
    Rules:
    1. Extract ONLY the name.
    2. Remove prefixes like "Received with thanks from", "M/S", "Mr.", "Mrs.", "Prop.", "A/c" unless they are essential to the business name.
    3. If multiple lines exist, focus on the first line or the most prominent name entity.
    4. If no name is found, return null.

    Text: "${text}"

    Return JSON: { "name": "Extracted Name" }`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    const parsed = JSON.parse(responseContent || "{}");

    return { success: true, name: parsed.name || null };
  } catch (error) {
    console.error("AI Name Extraction Error:", error);
    return { success: false, error: "Extraction Failed" };
  }
}
