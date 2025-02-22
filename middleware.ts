import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If the path starts with /apricus-admin
  if (path.startsWith("/apricus-admin")) {
    // Allow access to login and registration pages without authentication
    if (path === "/apricus-admin/auth") {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If there's no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/apricus-admin/auth", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role
    if (token.role !== "ADMIN") {
      // Redirect unauthorized users to home page or show error
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Allow the request to continue
    return NextResponse.next();
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: "/apricus-admin/:path*",
};

/* To disable registration access later, simply remove the "|| path === "/apricus-admin/register"" 
   part from the condition, so it becomes:

   if (path === "/apricus-admin/auth") {
     return NextResponse.next();
   }
*/
