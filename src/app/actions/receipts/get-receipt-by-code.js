"use server";

import { findReceiptByShortCode } from "@/lib/db/helpers";

/**
 * Get receipt by short code (public access)
 * @param {string} shortCode - 6-character unique code
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function getReceiptByCode(shortCode) {
    try {
        if (!shortCode || shortCode.length !== 6) {
            return {
                success: false,
                error: "Invalid short code format",
            };
        }

        const receipt = await findReceiptByShortCode(shortCode);

        if (!receipt) {
            return {
                success: false,
                error: "Receipt not found",
            };
        }

        // Convert ObjectId to string for client
        const receiptData = {
            ...receipt,
            _id: receipt._id.toString(),
        };

        return {
            success: true,
            data: receiptData,
        };
    } catch (error) {
        console.error("Get receipt by code error:", error);
        return {
            success: false,
            error: "Failed to retrieve receipt",
        };
    }
}
