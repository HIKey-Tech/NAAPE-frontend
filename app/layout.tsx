
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Modern, geometric sans-serif
import "./globals.css";
import { Providers } from "@/context/provider/provider";
import { Toaster } from "@/components/ui/sonner";
import TopNavbar from "@/components/ui/landing/home/navbar";
import Footer from "@/components/ui/landing/home/footer";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta-sans", // Custom variable
  display: "swap",
});

export const metadata: Metadata = {
  title: "Welcome to NAAPE official app",
  description: "Welcome to NAAPE official app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${jakartaSans.variable} font-sans antialiased`}
      >

        <Providers>


          <main>
            {children}
          </main>
          <Toaster />

        </Providers>

      </body>
    </html>
  );
}
