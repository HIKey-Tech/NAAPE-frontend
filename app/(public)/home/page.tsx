"use client"

import TopNavbar from "@/components/ui/landing/home/navbar";
import Footer from "@/components/ui/landing/home/footer";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { LuPlane } from "react-icons/lu";
import Hero from "@/components/ui/landing/home/hero";
import AboutSection from "@/components/ui/landing/home/about";
import LatestNews from "@/components/ui/landing/home/latest";
import UpcomingEvents from "@/components/ui/landing/home/events";
import PartnersSection from "@/components/ui/landing/home/partners";
import TestimonialsSection from "@/components/ui/landing/home/testimonial";
import FAQSection from "@/components/ui/landing/home/faq";
import JoinCommunitySection from "@/components/ui/landing/home/join";
import WhyJoinSection from "@/components/ui/landing/home/why";

// WhatsApp icon SVG (inline, so we don't need extra packages)
function WhatsAppIcon({ size = 30 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <circle cx="16" cy="16" r="16" fill="#25D366" />
            <path
                d="M21.67 18.78c-.33-.17-1.98-.98-2.29-1.09-.31-.12-.53-.17-.76.17-.22.33-.87 1.09-1.07 1.31-.2.22-.4.24-.73.08-.33-.17-1.39-.51-2.65-1.62-.98-.87-1.64-1.94-1.83-2.27-.19-.33-.02-.51.15-.68.15-.15.33-.4.49-.6.16-.2.22-.33.32-.55.11-.22.05-.41-.02-.57-.07-.16-.76-1.87-1.05-2.56-.27-.65-.55-.55-.75-.56-.2-.01-.42-.01-.63-.01-.22 0-.57.08-.88.41-.31.34-1.14 1.11-1.14 2.77 0 1.7 1.1 3.34 1.26 3.57.16.23 2.17 3.33 5.18 4.26 1.12.33 1.99.41 2.67.24.55-.14 1.67-.7 1.9-1.39.24-.7.24-1.3.17-1.42-.07-.12-.3-.19-.62-.36z"
                fill="#fff"
            />
        </svg>
    );
}

// IMPROVED: WhatsApp Floating Button as a React Component with 'Contact us' message, click ripple, accessibility, animation, and expanded UI
function WhatsAppFloat() {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [ripple, setRipple] = useState(false);

    // Phone and message (can be easily customized)
    const phone = "+2348139698820";
    const message = "Hello! I need assistance.";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Responsive adjustments
    useEffect(() => {
        function syncMobile() {
            setIsMobile(window.innerWidth <= 600);
        }
        syncMobile();
        window.addEventListener("resize", syncMobile);
        return () => window.removeEventListener("resize", syncMobile);
    }, []);

    // Button base style
    const btnSize = isMobile ? 50 : 60;
    const iconSize = isMobile ? 24 : 30;

    // Improved button: bigger touch, floating animation, outline, accessibility, expand for quick message
    return (
        <>
            {/* Expanded chat prompt */}
            <motion.div
                initial={false}
                animate={isOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
                style={{
                    pointerEvents: isOpen ? "auto" : "none",
                    position: "fixed",
                    bottom: btnSize + (isMobile ? 24 : 32),
                    right: (isMobile ? 15 : 22),
                    zIndex: 1050,
                    minWidth: 210,
                    borderRadius: 12,
                    background: "#fff",
                    boxShadow: "0 2px 12px rgba(37, 211, 102, 0.18)",
                    color: "#222",
                    padding: "18px 20px 10px 18px",
                    fontSize: 16,
                    lineHeight: 1.4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                    alignItems: "flex-start",
                    border: "2px solid #25D366",
                }}
                aria-live={isOpen ? "polite" : undefined}
            >
                <div style={{ fontWeight: 600, fontSize: 18, display: "flex", alignItems: "center", gap: 6 }}>
                    <WhatsAppIcon size={22} /> Let's chat on WhatsApp!
                </div>
                <span>
                    Need help? Tap <b>Send Message</b> to chat directly with our team.
                </span>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        background: "#25D366",
                        color: "#fff",
                        borderRadius: 6,
                        padding: "7px 18px",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontSize: 16,
                        outline: "none",
                        border: "none",
                        boxShadow: "0 1px 8px #25d36622",
                        marginTop: 3,
                        letterSpacing: 0.1,
                        display: "inline-block",
                        cursor: "pointer"
                    }}
                    tabIndex={isOpen ? 0 : -1}
                    aria-label="Send WhatsApp message"
                    onClick={() => setIsOpen(false)}
                >
                    Send Message
                </a>
            </motion.div>

            {/* WhatsApp Floating Button */}
            <motion.button
                aria-label="Chat with us on WhatsApp"
                type="button"
                className="whatsapp-float"
                title="Contact us on WhatsApp"
                style={{
                    position: "fixed",
                    bottom: isMobile ? 15 : 20,
                    right: isMobile ? 15 : 20,
                    width: btnSize,
                    height: btnSize,
                    borderRadius: "50%",
                    border: "none",
                    background: "#25D366",
                    boxShadow: ripple
                        ? "0 3px 18px #25d36677, 0 0 0 9px #25d36644"
                        : "2px 2px 10px rgba(0,0,0,0.3)",
                    zIndex: 1040,
                    cursor: "pointer",
                    outline: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "box-shadow 0.18s, background 0.18s",
                    boxSizing: "border-box",
                    userSelect: "none",
                    WebkitTapHighlightColor: "transparent",
                    willChange: "transform",
                    touchAction: "manipulation"
                }}
                onClick={() => {
                    setIsOpen(o => !o);
                    setRipple(true);
                    setTimeout(() => setRipple(false), 240);
                }}
                onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                        setIsOpen(o => !o);
                    }
                }}
                tabIndex={0}
                onBlur={() => setRipple(false)}
                onMouseLeave={() => setRipple(false)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls="whatsapp-float-dialog"
                role="button"
            >
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: ripple ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 330, damping: 22, duration: 0.19 }}
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%",
                    }}
                >
                    <WhatsAppIcon size={iconSize} />
                </motion.div>
                {/* 'Contact Us' label on desktop, only when not open */}
                {!isOpen && !isMobile && (
                    <motion.span
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 10 }}
                        transition={{ delay: 0.18, duration: 0.24 }}
                        style={{
                            position: "absolute",
                            right: btnSize + 12,
                            bottom: 0,
                            height: btnSize,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                            fontSize: 17,
                            color: "#245850",
                            background: "#fff",
                            borderRadius: 8,
                            padding: "0 14px",
                            boxShadow: "0 2px 12px #25d36622",
                            pointerEvents: "none",
                            userSelect: "none"
                        }}
                    >
                        Contact&nbsp;Us
                    </motion.span>
                )}
            </motion.button>
        </>
    );
}

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
            {/* WhatsApp Floating Button */}
            <WhatsAppFloat />
        </main>
    );
}
