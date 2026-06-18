import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // List of routes that require ADMIN privileges
    const adminRoutes = ["/inventory", "/admin", "/dashboard", "/clients", "/settings"];
    
    // Check if the requested path is an admin route
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

    if (isAdminRoute) {
      if (token?.role !== "admin") {
        // If it's a client attempting to access the dashboard, redirect them to the home page
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Protect these routes with the middleware
  matcher: [
    "/inventory/:path*", 
    "/admin/:path*", 
    "/dashboard/:path*", 
    "/clients/:path*", 
    "/settings/:path*"
  ],
};
