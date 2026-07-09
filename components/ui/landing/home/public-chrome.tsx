"use client";

import { usePathname } from "next/navigation";
import TopNavbar from "./navbar";
import Footer from "./footer";
import WhatsAppFloat from "@/components/ui/custom/whatsapp";

// Routes that render their own (role-based) chrome and must not get the public navbar/footer.
// ponytail: regex list; add a route here if another one needs to own its chrome.
const OWNS_CHROME = /^\/events\/[^/]+/;

export default function PublicChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (OWNS_CHROME.test(pathname)) {
        return <>{children}</>;
    }

    return (
        <>
            <main>
                <TopNavbar />
                {children}
                <Footer />
            </main>
            <WhatsAppFloat />
        </>
    );
}
