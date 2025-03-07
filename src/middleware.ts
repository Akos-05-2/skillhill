import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes protection
    if (path.startsWith("/admin")) {
      if (token?.roleId !== 4 && token?.roleId !== 5) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Teacher routes protection
    if (path.startsWith("/teacher")) {
      if (token?.roleId !== 3) {
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

// Configure which routes to protect
export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*"],
};
