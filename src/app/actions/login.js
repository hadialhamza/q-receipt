"use server";

import bcrypt from "bcryptjs";
import { findOne, COLLECTIONS } from "@/lib/db/helpers";

/**
 * Login user with email and password
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{success: boolean, message: string, user?: object}>}
 */
export async function loginUser({ email, password }) {
  try {
    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // Find user by email
    const user = await findOne(COLLECTIONS.USERS, {
      email: email.toLowerCase(),
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: "Login successful!",
      user: {
        ...userWithoutPassword,
        id: user._id.toString(),
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}
