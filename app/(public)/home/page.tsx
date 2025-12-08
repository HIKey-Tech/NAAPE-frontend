"use client"

import TopNavbar from "@/components/ui/landing/home/navbar";
import Footer from "@/components/ui/landing/home/footer";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { LuPlane } from "react-icons/lu";
import Hero from "@/components/ui/landing/home/hero";
import AboutSection from "@/components/ui/landing/home/about";
import UpcomingEvents from "@/components/ui/landing/home/events";
import PartnersSection from "@/components/ui/landing/home/partners";
import TestimonialsSection from "@/components/ui/landing/home/testimonial";
import FAQSection from "@/components/ui/landing/home/faq";
import JoinCommunitySection from "@/components/ui/landing/home/join";
import WhyJoinSection from "@/components/ui/landing/home/why";
import LatestNews from "../latest/page";
// Add mission section import
import MissionSection from "@/components/ui/landing/about/mission";
import WhatsAppFloat from "@/components/ui/custom/whatsapp";
import EventsPage from "../events/page";

// Updated SECTIONS to insert "mission" before "why"
const SECTIONS = [
    "hero",
    "legacy",
    "about",
    "mission", // Add mission anchor before why
    "why",
    "latest",
    "events",
    "partners",
    "testimonial",
    "faq",
    "join"
];

function PlaneTrail() {
    // Refs for each section
    const sectionRefs = SECTIONS.map(() => useRef<HTMLDivElement>(null));
    // State for current plane position (section index)
    const [activeIndex, setActiveIndex] = useState(0);

    // Add scroll event to update plane position
    useEffect(() => {
        function onScroll() {
            for (let i = SECTIONS.length - 1; i >= 0; i--) {
                const ref = sectionRefs[i].current;
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2) {
                        setActiveIndex(i);
                        break;
                    }
                }
            }
        }
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
        // eslint-disable-next-line
    }, []);

    // Calculate the position of the plane (as a vertical %)
    const [planeTop, setPlaneTop] = useState(0);

    useEffect(() => {
        const ref = sectionRefs[activeIndex]?.current;
        if (ref) {
            const rect = ref.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const offset = scrollY + rect.top + rect.height * 0.1;
            setPlaneTop(offset);
        }
    }, [activeIndex, sectionRefs]);

    // Use controls for playful ply
    const controls = useAnimation();

    // Animate the plane plying ("flying") around: circular and wavy path, and a little scale/tilt
    useEffect(() => {
        controls.start({
            x: [
                0,
                40,
                50,
                18,
                -40,
                -70,
                -30,
                0
            ],
            y: [
                0,
                -28,
                -48,
                -29,
                10,
                26,
                31,
                0
            ],
            rotate: [
                0,
                18,
                13,
                0,
                -17,
                -24,
                -7,
                0
            ],
            scale: [
                1.01,
                0.95,
                1.08,
                1.02,
                0.98,
                1.05,
                0.97,
                1.01
            ],
            transition: {
                duration: 6,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
            }
        });
    }, [controls, planeTop]);

    // Get primary color from CSS variable (see globals.css, --primary)
    // Fallback to #2852B4 if the variable is not set, but it should be from Tailwind/your theme.
    // Use it for the icon and shadow.
    const primaryColor = typeof window !== "undefined"
        ? getComputedStyle(document.documentElement).getPropertyValue("--primary")?.trim() || "#2852B4"
        : "#2852B4";
    // Compose a drop-shadow (blue) using the primary color if possible.
    // For oklch colors, CSS can handle drop-shadow well.
    const dropShadow = `drop-shadow(0 6px 24px ${primaryColor}cc)`;

    return (
        <>
            {/* Plane icon plying (flying) around */}
            <motion.div
                initial={false}
                animate={{ top: planeTop }}
                transition={{ type: "spring", stiffness: 70, damping: 20 }}
                style={{
                    left: "calc(50vw - 36px)", // Center-ish
                    position: "absolute",
                    zIndex: 40,
                    width: 72,
                    height: 72,
                    pointerEvents: "none"
                }}
            >
                <motion.div
                    animate={controls}
                    // Use Tailwind "text-primary" to color the icon and apply the shadow using primary color
                    style={{
                        filter: dropShadow,
                    }}
                >
                    <LuPlane
                        size={72}
                        // Color: use CSS variable if possible, fallback to #2852B4
                        color="var(--primary, #2852B4)"
                        className="select-none text-primary"
                        style={{
                            width: 72,
                            height: 72,
                        }}
                    />
                </motion.div>
            </motion.div>
            {/* Render children with sectionRefs; insert MissionSection before WhyJoinSection */}
            {SECTIONS.map((key, i) => {
                let Comp;
                switch (key) {
                    case "hero": Comp = Hero; break;
                    // case "legacy": Comp = OurLegacy; break;
                    case "about": Comp = AboutSection; break;
                    case "mission": Comp = MissionSection; break; // Insert MissionSection
                    case "why": Comp = WhyJoinSection; break;
                    case "latest": Comp = LatestNews; break;
                    case "events": Comp = EventsPage; break;
                    case "partners": Comp = PartnersSection; break;
                    case "testimonial": Comp = TestimonialsSection; break;
                    case "faq": Comp = FAQSection; break;
                    case "join": Comp = JoinCommunitySection; break;
                    default: Comp = () => null; break;
                }
                // Enclose each section in a div with a ref so we can track its position
                return (
                    <div
                        ref={sectionRefs[i]}
                        key={key}
                        style={{ position: "relative" }}
                        id={key}
                    >
                        <Comp />
                    </div>
                );
            })}
        </>
    );
}

export default function LandingPage() {
    // PlaneTrail manages the refs, plane, and all sections
    return (
        <main className="flex flex-col min-h-screen bg-[#F5F7FA] relative overflow-x-clip">
            <TopNavbar />
            <div className="relative">
                <PlaneTrail />
            </div>
            <WhatsAppFloat />

            <Footer />
        </main>
    );
}
