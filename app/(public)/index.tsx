"use client";

import Image from "next/image";
import Link from "next/link";
import TopNavbar from "./navbar";
import Hero from "./hero";
import OurLegacy from "./legacy";
import AboutSection from "./about";

export default function LandingPage() {
    return (
        <main className="flex flex-col min-h-screen bg-[#F5F7FA]">
            {/* Top Navbar */}
            <TopNavbar />
            {/* Hero Section */}
            <Hero />

            {/* Our Legacy Section */}
            <OurLegacy />

            {/* About us */}

            <AboutSection />

            {/* Features */}
            <section className="bg-white py-14 px-8 md:px-24">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#2852B4]">
                    Why Join NAAPE?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-[#F5F7FA] rounded-lg p-6 text-center shadow">
                        <h3 className="text-xl font-semibold mb-3 text-[#2347A0]">Professional Network</h3>
                        <p className="text-[#61647A]">Connect with fellow engineers and pilots across industries for collaboration and mentorship.</p>
                    </div>
                    <div className="bg-[#F5F7FA] rounded-lg p-6 text-center shadow">
                        <h3 className="text-xl font-semibold mb-3 text-[#2347A0]">Member Resources</h3>
                        <p className="text-[#61647A]">Get access to technical magazines, newsletters, events, and training materials curated for your growth.</p>
                    </div>
                    <div className="bg-[#F5F7FA] rounded-lg p-6 text-center shadow">
                        <h3 className="text-xl font-semibold mb-3 text-[#2347A0]">Opportunities</h3>
                        <p className="text-[#61647A]">Stay ahead with job boards, exclusive programs, and leadership opportunities for members.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto bg-[#E6EAF1] py-4 flex flex-col md:flex-row justify-between items-center px-8 md:px-24 gap-2 text-[#576076] text-sm">
                <span>&copy; {new Date().getFullYear()} NAAPE. All rights reserved.</span>
                <div className="flex gap-4">
                    <Link href="/about" className="hover:underline">About</Link>
                    <Link href="/contact" className="hover:underline">Contact</Link>
                    <Link href="/membership" className="hover:underline">Membership</Link>
                </div>
            </footer>
        </main>
    );
}
