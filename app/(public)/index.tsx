"use client";

import Image from "next/image";
import Link from "next/link";
import TopNavbar from "./navbar";
import Hero from "./hero";
import OurLegacy from "./legacy";
import AboutSection from "./about";
import WhyJoinSection from "./why";
import LatestNews from "./latest";
import UpcomingEvents from "./events";
import PartnersSection from "./partners";
import TestimonialsSection from "./testimonial";
import FAQSection from "./faq";
import JoinCommunitySection from "./join";

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

            {/* WHy Join Us */}
            <WhyJoinSection/>

            {/* latest news and publications */}
            <LatestNews />
            
            {/* Upcoming events */}
            <UpcomingEvents />
            
            {/* Partners */}
            <PartnersSection />
            
            {/* Testimonial */}
            <TestimonialsSection />

            {/* FAQ */}
            <FAQSection />
            
            {/* Join Community */}
            <JoinCommunitySection/>
            

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
