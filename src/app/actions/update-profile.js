"use server";

import { updateOne, COLLECTIONS } from "@/lib/db/helpers";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";

export async function updateProfile({ name, image }) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user || !session.user.email) {
      return {
        success: false,
        message: "You must be logged in to update your profile.",
      };
    }

    const email = session.user.email;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;

    updateData.updatedAt = new Date();

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        message: "No data provided to update.",
      };
    }

    // Update user document in database
    const result = await updateOne(
      COLLECTIONS.USERS,
      { email: email.toLowerCase() },
      { $set: updateData },
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      // If nothing was modified, it might be the same data
      return {
        success: true,
        message: "Profile is already up to date.",
      };
    }

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: "An error occurred while updating your profile.",
    };
  }
}
