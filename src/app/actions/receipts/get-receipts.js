"use server";

import { ObjectId } from "mongodb";
import { getDB, COLLECTIONS } from "@/lib/db/helpers";
import { count } from "@/lib/db/helpers";

/**
 * Get all receipts with search and pagination
 */
export async function getReceipts({ search = "", page = 1, limit = 50 } = {}) {
  try {
    const db = await getDB();

    // Build search query
    const query = {};
    if (search && search.trim()) {
      query.$or = [
        { receiptNo: { $regex: search, $options: "i" } },
        { receivedFrom: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch receipts with pagination
    const receipts = await db
      .collection(COLLECTIONS.RECEIPTS)
      .find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const total = await count(COLLECTIONS.RECEIPTS, query);

    return {
      success: true,
      data: receipts.map((receipt) => ({
        ...receipt,
        _id: receipt._id.toString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Get receipts error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch receipts",
      data: [],
      total: 0,
    };
  }
}
