


import TopNavbar from "../../components/ui/landing/home/navbar";
import Hero from "../../components/ui/landing/home/hero";
import OurLegacy from "../../components/ui/landing/home/legacy";
import AboutSection from "../../components/ui/landing/home/about";
import WhyJoinSection from "../../components/ui/landing/home/why";
import LatestNews from "../../components/ui/landing/home/latest";
import UpcomingEvents from "../../components/ui/landing/home/events";
import PartnersSection from "../../components/ui/landing/home/partners";
import TestimonialsSection from "../../components/ui/landing/home/testimonial";
import FAQSection from "../../components/ui/landing/home/faq";
import JoinCommunitySection from "../../components/ui/landing/home/join";
import Footer from "../../components/ui/landing/home/footer";

export default function LandingPage() {
    return (
        <main className="flex flex-col min-h-screen bg-[#F5F7FA]">

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




        </main>
    );
}
