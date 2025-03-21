import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If the path starts with /apricus-admin
  if (path.startsWith("/apricus-admin")) {
    // Allow access to the auth page without authentication
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
      // Redirect unauthorized users to home page
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Allow the request to continue for admins
    return NextResponse.next();
  }

  // For customer-only pages if needed
  if (path.startsWith("/customer")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If there's no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Allow any authenticated user (both customer and admin)
    return NextResponse.next();
  }

  // Only apply to Plural callback routes
  if (path.startsWith("/api/plural/callback")) {
    // Clone the request headers
    const requestHeaders = new Headers(request.headers);

    // Remove the x-forwarded-host header if it exists
    requestHeaders.delete("x-forwarded-host");

    // Create a new request with modified headers
    const modifiedRequest = new Request(request.url, {
      method: request.method,
      headers: requestHeaders,
      body: request.body,
    });

    // Return the modified request
    return NextResponse.next({
      request: modifiedRequest,
    });
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/apricus-admin/:path*",
    "/customer/:path*",
    "/api/plural/callback/:path*",
  ],
};
