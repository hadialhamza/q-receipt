import bcrypt from "bcryptjs";
import { findOne, COLLECTIONS } from "@/lib/db/helpers";

export const authConfig = {
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.image = session.user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

// Verify user credentials
export async function verifyCredentials(email, password) {
  try {
    if (!email || !password) {
      return null;
    }

    // Find user by email
    const user = await findOne(COLLECTIONS.USERS, {
      email: email.toLowerCase(),
    });

    if (!user) {
      return null;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.image,
    };
  } catch (error) {
    console.error("Credential verification error:", error);
    return null;
  }
}
