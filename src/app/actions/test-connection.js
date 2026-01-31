"use server";

import { connectDB, getDB } from "@/lib/db/db";

/**
 * Test MongoDB connection
 * @returns {Promise<{success: boolean, message: string, dbName?: string}>}
 */
export async function testConnection() {
  try {
    await connectDB();
    const db = await getDB();

    // Ping the database
    await db.command({ ping: 1 });

    return {
      success: true,
      message: "Successfully connected to MongoDB!",
      dbName: db.databaseName,
    };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return {
      success: false,
      message: `Failed to connect: ${error.message}`,
    };
  }
}
