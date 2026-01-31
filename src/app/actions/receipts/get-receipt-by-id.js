"use server";

import { ObjectId } from "mongodb";
import { findOne, COLLECTIONS } from "@/lib/db/helpers";

/**
 * Get single receipt by ID
 */
export async function getReceiptById(id) {
  try {
    const receipt = await findOne(COLLECTIONS.RECEIPTS, {
      _id: new ObjectId(id),
    });

    if (!receipt) {
      return {
        success: false,
        error: "Receipt not found",
      };
    }

    return {
      success: true,
      data: {
        ...receipt,
        _id: receipt._id.toString(),
      },
    };
  } catch (error) {
    console.error("Get receipt by ID error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch receipt",
    };
  }
}
