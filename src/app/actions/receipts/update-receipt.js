"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { findOne, updateOne, COLLECTIONS } from "@/lib/db/helpers";
import { z } from "zod";

// Updated schema to match create-receipt.js
const receiptSchema = z.object({
  companyType: z.enum(["GLOBAL", "FEDERAL", "TAKAFUL"]),
  issuingOffice: z.string().optional(),
  bin: z.string().optional(),
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
  stamp: z.string().optional(),
  total: z.string(),
  clientName: z.string().optional(),
});

/**
 * Update existing receipt
 */
export async function updateReceipt(id, data) {
  try {
    // Validate input
    const validatedData = receiptSchema.parse(data);

    // Check if receipt exists
    const existing = await findOne(COLLECTIONS.RECEIPTS, {
      _id: new ObjectId(id),
    });

    if (!existing) {
      return {
        success: false,
        error: "Receipt not found",
      };
    }

    // Update receipt
    await updateOne(
      COLLECTIONS.RECEIPTS,
      { _id: new ObjectId(id) },
      {
        $set: {
          ...validatedData,
          updatedAt: new Date(),
        },
      },
    );

    // Get updated document
    const updated = await findOne(COLLECTIONS.RECEIPTS, {
      _id: new ObjectId(id),
    });

    // Revalidate pages
    revalidatePath("/receipts");
    revalidatePath(`/view/${id}`);

    return {
      success: true,
      data: {
        ...updated,
        _id: updated._id.toString(),
      },
    };
  } catch (error) {
    console.error("Update receipt error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed: " + error.errors[0].message,
      };
    }

    return {
      success: false,
      error: error.message || "Failed to update receipt",
    };
  }
}
