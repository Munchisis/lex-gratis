import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Reads ADMIN_EMAILS from .env.local — comma separated
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth/login",
    error:  "/auth/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter your email and password.");
        }

        const email = credentials.email.toLowerCase();
        const isAdminEmail = getAdminEmails().includes(email);

        await connectDB();

        let user = await User.findOne({ email }).select("+password");

        if (!user) {
          throw new Error("No account found with that email address.");
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error("Incorrect password. Please try again.");
        }

        // Auto-promote to admin if email is in the whitelist
        if (isAdminEmail && user.role !== "admin") {
          user = await User.findOneAndUpdate(
            { email },
            { role: "admin", isApproved: true },
            { new: true }
          ).select("+password");
        }

        // Block unapproved lawyers
        if (user!.role === "lawyer" && !user!.isApproved) {
          throw new Error(
            "Your account is pending approval. You will receive an email once an admin approves your registration."
          );
        }

        return {
          id:         user!._id.toString(),
          name:       user!.name,
          email:      user!.email,
          role:       user!.role,
          isApproved: user!.isApproved,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id         = user.id;
        token.role       = user.role;
        token.isApproved = user.isApproved;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id         = token.id;
        session.user.role       = token.role;
        session.user.isApproved = token.isApproved;
      }
      return session;
    },
  },
};