"use client"
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
import TopNavbar from "@/components/ui/landing/home/navbar";
import Footer from "@/components/ui/landing/home/footer";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { LuPlane } from "react-icons/lu";

// Define the section anchors
const SECTIONS = [
    "hero",
    "legacy",
    "about",
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
                    style={{ filter: "drop-shadow(0 6px 24px #1d4ed8cc)" }}
                >
                    <LuPlane
                        size={72}
                        color="#2852B4"
                        className="select-none"
                        style={{
                            width: 72,
                            height: 72
                        }}
                    />
                </motion.div>
            </motion.div>
            {/* Render children with sectionRefs */}
            {SECTIONS.map((key, i) => {
                let Comp;
                switch (key) {
                    case "hero": Comp = Hero; break;
                    // case "legacy": Comp = OurLegacy; break;
                    case "about": Comp = AboutSection; break;
                    case "why": Comp = WhyJoinSection; break;
                    case "latest": Comp = LatestNews; break;
                    case "events": Comp = UpcomingEvents; break;
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
            <Footer />
        </main>
    );
}
