"use server";

import { generateShortCode } from "@/lib/utils";
import { findReceiptByShortCode } from "@/lib/db/helpers";

/**
 * Generate a unique short code for receipt
 * Checks database for collisions and retries if needed
 * @param {number} maxAttempts - Maximum retry attempts (default: 5)
 * @returns {Promise<string>} Unique short code
 */
export async function generateUniqueShortCode(maxAttempts = 5) {
    let attempts = 0;

    while (attempts < maxAttempts) {
        const code = generateShortCode(6);

        // Check if code already exists in database
        const existing = await findReceiptByShortCode(code);

        if (!existing) {
            return code;
        }

        attempts++;
    }

    // If we've exhausted all attempts, throw error
    throw new Error(
        `Failed to generate unique short code after ${maxAttempts} attempts`
    );
}
