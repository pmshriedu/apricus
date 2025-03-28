import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If the path starts with /apricus-admin
  if (path.startsWith("/apricus-admin")) {
    // Allow access to the staff login page without authentication
    if (path === "/apricus-admin/auth") {
      return NextResponse.next();
    }

    // Allow access to /apricus-admin/staff without special restrictions
    if (path === "/apricus-admin/staff") {
      return NextResponse.next();
    }

    // Specific restriction for register page (admin-only)
    if (path === "/apricus-admin/register") {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // If there's no token or user is not an admin
      if (!token || token.role !== "ADMIN") {
        const loginUrl = new URL("/apricus-admin/auth", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If there's no token, redirect to login for other admin routes
    if (!token) {
      const loginUrl = new URL("/apricus-admin/auth", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Block staff users from accessing admin-specific routes
    const adminOnlyRoutes = [
      "/apricus-admin/dashboard/user-management",
      "/apricus-admin/dashboard/user-register",
      "/apricus-admin/dashboard/post-location",
      "/apricus-admin/dashboard/post-hotel",

      "/apricus-admin/dashboard/post-amenities",
      "/apricus-admin/dashboard/coupons-post",
    ];

    // Redirect staff users trying to access admin-only routes
    if (
      token.role === "STAFF" &&
      adminOnlyRoutes.some(
        (route) => path === route || path.startsWith(route + "/")
      )
    ) {
      const dashboardUrl = new URL("/apricus-admin/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Check if user has staff or admin role for dashboard and other routes
    if (token.role !== "STAFF" && token.role !== "ADMIN") {
      // Redirect unauthorized users to home page
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Allow the request to continue for staff and admin
    return NextResponse.next();
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/apricus-admin/:path*"],
};
