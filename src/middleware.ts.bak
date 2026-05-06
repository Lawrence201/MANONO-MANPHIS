import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;

        // Admin routes protection
        if (pathname.startsWith("/admin")) {
            // Check if user has admin role
            if (token?.role !== "admin") {
                const loginUrl = new URL("/login", req.url);
                loginUrl.searchParams.set("callbackUrl", pathname);
                return NextResponse.redirect(loginUrl);
            }
        }

        // Admin API routes protection
        // Exclude MFA routes called during login (before a session exists)
        const isMfaPublicRoute =
            pathname.startsWith("/api/admin/mfa/verify-credentials") ||
            pathname.startsWith("/api/admin/mfa/verify");

        if (pathname.startsWith("/api/admin") && !isMfaPublicRoute) {
            if (!token || token.role !== "admin") {
                return NextResponse.json(
                    { error: "Unauthorized - Admin access required" },
                    { status: 401 }
                );
            }
        }

        // Add security headers to all responses
        const response = NextResponse.next();

        // Prevent MIME type sniffing
        response.headers.set("X-Content-Type-Options", "nosniff");

        // Prevent clickjacking
        response.headers.set("X-Frame-Options", "DENY");

        // XSS Protection (legacy browsers)
        response.headers.set("X-XSS-Protection", "1; mode=block");

        // Referrer Policy
        response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

        // Permissions Policy
        response.headers.set(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=()"
        );

        return response;
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Always allow access to login page
                if (pathname === "/login") {
                    return true;
                }

                // Allow public routes
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/api/admin/mfa/verify-credentials") ||
                    pathname.startsWith("/api/admin/mfa/verify") ||
                    pathname.startsWith("/api/halls") ||
                    pathname.startsWith("/api/hostels") ||
                    pathname.startsWith("/api/packages") ||
                    pathname.startsWith("/api/bookings") ||
                    pathname.startsWith("/api/package-bookings") ||
                    pathname.startsWith("/api/payments") ||
                    pathname.startsWith("/api/chatbot") ||
                    pathname.startsWith("/api/gcb") ||
                    pathname.startsWith("/api/communication") ||
                    pathname.startsWith("/api/receipts") ||
                    pathname.startsWith("/api/uploads") ||
                    pathname.startsWith("/_next") ||
                    pathname.startsWith("/images") ||
                    pathname.startsWith("/uploads") ||
                    pathname === "/favicon.ico" ||
                    pathname === "/"
                ) {
                    return true;
                }

                // Website pages are public
                if (
                    !pathname.startsWith("/admin") &&
                    !pathname.startsWith("/api/admin")
                ) {
                    return true;
                }

                // Admin routes require authentication
                if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
                    return !!token;
                }

                return true;
            },
        },
    }
);

export const config = {
    matcher: [
        // Match all routes except static files and auth routes
        "/((?!api/auth|_next/static|_next/image|favicon.ico|images|uploads).*)",
    ],
};
