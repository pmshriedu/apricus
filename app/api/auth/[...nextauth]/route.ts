// File: /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

// Export the handler with our authOptions configuration
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
