"use server";

import { z } from "zod";
import { insertOne, COLLECTIONS, ensureShortCodeIndex } from "@/lib/db/helpers";
import { generateUniqueShortCode } from "./generate-short-code";

// Receipt validation schema
const receiptSchema = z.object({
  companyType: z.enum(["GLOBAL", "FEDERAL", "TAKAFUL"]),
  issuingOffice: z.string().min(1),
  receiptNo: z.string().min(1),
  classOfInsurance: z.string().min(1),
  date: z.string(),
  receivedFrom: z.string().min(1),
  sumOf: z.string(),
  modeOfPayment: z.string().min(1),
  drawnOn: z.string().optional(),
  issuedAgainst: z.string().optional(),
  chequeDate: z.string().optional(),
  premium: z.string(),
  vat: z.string(),
  total: z.string(),
});

/**
 * Create a new receipt
 * @param {object} data - Receipt data
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createReceipt(data) {
  try {
    // Ensure short code index exists
    await ensureShortCodeIndex();

    // Validate data
    const validatedData = receiptSchema.parse(data);

    // Generate unique receipt number
    const receiptNo = await generateReceiptNumber();

    // Generate unique short code for public URL
    const shortCode = await generateUniqueShortCode();

    // Prepare receipt document
    const receipt = {
      ...validatedData,
      receiptNo,
      shortCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into MongoDB
    const result = await insertOne(COLLECTIONS.RECEIPTS, receipt);

    return {
      success: true,
      data: {
        receiptNo,
        shortCode,
        id: result._id.toString(),
      },
    };
  } catch (error) {
    console.error("Create receipt error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid receipt data: " + error.errors[0].message,
      };
    }

    return {
      success: false,
      error: "Failed to create receipt. Please try again.",
    };
  }
}

/**
 * Generate unique receipt number
 * Format: GIL-YYYYMMDD-XXXX
 */
async function generateReceiptNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);

  return `GIL-${year}${month}${day}-${random}`;
}
