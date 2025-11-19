import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// A utility to decode a JWT and extract the payload
function parseJwt(token: string): any | null {
    if (!token) return null;
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const ADMIN_PATH = "/admin";
    const MEMBER_PATH = "/dashboard";

    // If no token & trying to access a protected route → redirect to login
    if (
        !token &&
        (
            req.nextUrl.pathname.startsWith(MEMBER_PATH) ||
            req.nextUrl.pathname.startsWith(ADMIN_PATH)
        )
    ) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = token ? parseJwt(token) : null;
    // If token exists & user tries to access /login → redirect based on role
    if (token && req.nextUrl.pathname === "/login") {
        if (user?.role === "admin") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        } else {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    // If trying to access admin route but not admin, redirect to /dashboard
    if (
        token &&
        req.nextUrl.pathname.startsWith(ADMIN_PATH) &&
        user?.role !== "admin"
    ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If trying to access dashboard (non-admin) route but user is admin, redirect to /admin
    if (
        token &&
        req.nextUrl.pathname.startsWith(MEMBER_PATH) &&
        user?.role === "admin" &&
        !req.nextUrl.pathname.startsWith(ADMIN_PATH) // don't redirect /admin
    ) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/settings/:path*",
        "/profile/:path*",
        "/login",
    ],
};
