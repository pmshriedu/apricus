// File: /lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects based on user role
      if (url.startsWith(baseUrl)) {
        // For relative URLs, check if we have stored URL to go to
        if (typeof window !== "undefined") {
          const storedUrl = sessionStorage.getItem("bookingReturnUrl");
          if (storedUrl) {
            return storedUrl;
          }
        }
        // If we don't have a stored URL, use default paths
        return url;
      }
      // Allows callbacks to external URLs if they are allowed
      return url;
    },
  },
  pages: {
    signIn: "/login", // Default login page
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
