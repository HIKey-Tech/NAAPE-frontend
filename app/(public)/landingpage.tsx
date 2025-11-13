


import TopNavbar from "../../components/ui/landing/navbar";
import Hero from "../../components/ui/landing/hero";
import OurLegacy from "../../components/ui/landing/legacy";
import AboutSection from "../../components/ui/landing/about";
import WhyJoinSection from "../../components/ui/landing/why";
import LatestNews from "../../components/ui/landing/latest";
import UpcomingEvents from "../../components/ui/landing/events";
import PartnersSection from "../../components/ui/landing/partners";
import TestimonialsSection from "../../components/ui/landing/testimonial";
import FAQSection from "../../components/ui/landing/faq";
import JoinCommunitySection from "../../components/ui/landing/join";
import Footer from "../../components/ui/landing/footer";

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
            <WhyJoinSection />

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
            <JoinCommunitySection />


            {/* Footer */}
            <Footer />

        </main>
    );
}
