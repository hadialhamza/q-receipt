"use server";

import { deleteMany, COLLECTIONS } from "@/lib/db/helpers";

/**
 * Delete all receipts (for development/testing only)
 * @returns {Promise<{success: boolean, deletedCount?: number, error?: string}>}
 */
export async function deleteAllReceipts() {
    try {
        const result = await deleteMany(COLLECTIONS.RECEIPTS, {});

        return {
            success: true,
            deletedCount: result.deletedCount,
        };
    } catch (error) {
        console.error("Delete all receipts error:", error);
        return {
            success: false,
            error: "Failed to delete receipts. Please try again.",
        };
    }
}
