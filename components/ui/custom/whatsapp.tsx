"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa"; // import from react-icons

export default function WhatsAppFloat() {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [ripple, setRipple] = useState(false);

    // Pulsate controls
    const controls = useAnimation();

    // Phone and message (can be easily customized)
    const phone = "+2349132508804";
    const message = "Hello! I need assistance.";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Responsive adjustments
    useEffect(() => {
        function syncMobile() {
            setIsMobile(typeof window !== "undefined" && window.innerWidth <= 600);
        }
        syncMobile();
        window.addEventListener("resize", syncMobile);
        return () => window.removeEventListener("resize", syncMobile);
    }, []);

    // Pulsating (micro animation) effect
    useEffect(() => {
        if (!isOpen) {
            controls.start({
                scale: [1, 1.11, 1.07, 1],
                boxShadow: [
                    "2px 2px 10px rgba(0,0,0,0.3)",
                    "0 6px 18px #25d3669c, 0 0 0 6px #25d36633",
                    "2px 2px 12px rgba(0,0,0,0.36)",
                    "2px 2px 10px rgba(0,0,0,0.3)"
                ]
            });
        } else {
            controls.set({ scale: 1, boxShadow: "2px 2px 10px rgba(0,0,0,0.3)" });
        }
    }, [isOpen, controls]);

    // Always pulse unless open
    useEffect(() => {
        let pulseTimeout: NodeJS.Timeout;
        let running = true;
        const repeatPulse = async () => {
            while (running && !isOpen) {
                await controls.start({
                    scale: [1, 1.07, 1.16, 1],
                    boxShadow: [
                        "2px 2px 10px rgba(0,0,0,0.3)",
                        "0 6px 18px #25d3669c, 0 0 0 10px #25d36622",
                        "2px 2px 17px rgba(37, 211, 102, 0.38)",
                        "2px 2px 10px rgba(0,0,0,0.3)"
                    ],
                    transition: { duration: 1.16, ease: "easeInOut" }
                });
                // Small pause between pulses
                await new Promise(resolve => {
                    pulseTimeout = setTimeout(resolve, 1400);
                });
            }
        };
        repeatPulse();
        return () => {
            running = false;
            if (pulseTimeout) clearTimeout(pulseTimeout);
            controls.set({ scale: 1, boxShadow: "2px 2px 10px rgba(0,0,0,0.3)" });
        };
    }, [controls, isOpen]);

    // Button base style
    const btnSize = isMobile ? 50 : 60;
    const iconSize = isMobile ? 28 : 34;

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
                <div style={{ fontWeight: 600, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <FaWhatsapp size={26} color="#25D366" /> Let's chat on WhatsApp!
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
                    touchAction: "manipulation",
                }}
                animate={controls}
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
                    <FaWhatsapp size={iconSize} color="#fff" />
                </motion.div>
            </motion.button>
        </>
    );
}
