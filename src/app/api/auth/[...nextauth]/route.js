import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig, verifyCredentials } from "@/lib/auth.config";

const handler = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await verifyCredentials(
                    credentials.email,
                    credentials.password
                );

                if (!user) {
                    return null;
                }

                return user;
            },
        }),
    ],
});

export { handler as GET, handler as POST };
