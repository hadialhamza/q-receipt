"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { findOne, deleteOne, COLLECTIONS } from "@/lib/db/helpers";

/**
 * Delete receipt by ID
 */
export async function deleteReceipt(id) {
  try {
    // Check if receipt exists
    const receipt = await findOne(COLLECTIONS.RECEIPTS, {
      _id: new ObjectId(id),
    });

    if (!receipt) {
      return {
        success: false,
        error: "Receipt not found",
      };
    }

    // Delete receipt
    await deleteOne(COLLECTIONS.RECEIPTS, {
      _id: new ObjectId(id),
    });

    // Revalidate receipts page
    revalidatePath("/receipts");

    return {
      success: true,
      message: "Receipt deleted successfully",
    };
  } catch (error) {
    console.error("Delete receipt error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete receipt",
    };
  }
}
