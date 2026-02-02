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
  stamp: z.string().optional(), // Added Stamp
  total: z.string(),
  bin: z.string().optional(), // Added BIN
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

    // Use receipt number from client
    // const receiptNo = await generateReceiptNumber(); // REMOVED: Overwriting logic


    // Generate unique short code for public URL
    const shortCode = await generateUniqueShortCode();

    // Prepare receipt document
    const receipt = {
      ...validatedData,
      // receiptNo is already in validatedData
      // receiptNo,
      shortCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into MongoDB
    const result = await insertOne(COLLECTIONS.RECEIPTS, receipt);

    return {
      success: true,
      data: {
        receiptNo: validatedData.receiptNo,
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


