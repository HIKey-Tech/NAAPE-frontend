import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    // If no token & trying to access a protected route → redirect to login
    if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If token exists & user tries to access /login → redirect to dashboard
    if (token && req.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        "/dashboard/:path*",   // protect dashboard
        "/settings/:path*",    // optional: protect settings
        "/profile/:path*",     // optional
        "/login",              // redirect logged in users
    ],
};
