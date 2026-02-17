"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { ArrowRight, Shield, Clock, GraduationCap, Users } from "lucide-react";
import { motion } from "framer-motion";

// --- Typewriter Effect Hook ---
function useTypewriter(
    text: string,
    options: { speed?: number; punctuationPause?: number; onDone?: () => void } = {}
) {
    const { speed = 28, punctuationPause = 320, onDone } = options;
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    const frameRef = useRef(0);
    const lastTimeRef = useRef(0);
    const iRef = useRef(0);

    useEffect(() => {
        setDisplayed("");
        setDone(false);
        iRef.current = 0;
        lastTimeRef.current = performance.now();

        const loop = (now: number) => {
            if (iRef.current >= text.length) {
                setDone(true);
                if (onDone) onDone();
                return;
            }
            const dt = now - lastTimeRef.current;
            if (dt >= speed) {
                const char = text[iRef.current];
                setDisplayed((prev) => prev + char);
                iRef.current++;
                lastTimeRef.current = now;
                if ([",", ".", "!", "?", ";", ":"].includes(char)) {
                    lastTimeRef.current += punctuationPause;
                }
            }
            frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameRef.current);
    }, [text, speed, punctuationPause]);

    return { displayed, done };
}

const heroTypewriteText =
    "NAAPE unites and elevates aircraft pilots and engineers across Nigeria—advocating standards, safety, and professional excellence for every member in our aviation community.";

const stats = [
    { icon: Shield, value: "100%", label: "Safety Advocacy" },
    { icon: Clock, value: "39+", label: "Years Leading" },
    { icon: GraduationCap, value: "50+", label: "Training Programs" },
    { icon: Users, value: "1200+", label: "Members Strong" },
];

export default function Hero() {
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (showCursor) {
            interval = setInterval(() => setShowCursor((v) => !v), 540);
        }
        return () => { if (interval) clearInterval(interval); setShowCursor(true); };
    }, [showCursor]);

    const { displayed, done } = useTypewriter(heroTypewriteText, {
        speed: 32,
        punctuationPause: 260,
        onDone: () => setShowCursor(false),
    });

    const [srText, setSrText] = useState("");
    useEffect(() => { if (done) setSrText(heroTypewriteText); else setSrText(""); }, [done]);

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                backgroundSize: "24px 24px"
            }} />

            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:py-0 min-h-screen flex flex-col justify-center">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Content */}
                    <motion.div
                        className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start gap-6 max-w-2xl"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-black tracking-tight leading-[1.08]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
                                The National Association of Aircraft Pilots & Engineers
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-slate-500 text-lg md:text-xl max-w-lg leading-relaxed font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            aria-live="polite"
                        >
                            <span aria-hidden="true">
                                {displayed}
                                {!done && showCursor && (
                                    <span className="ml-0.5 font-mono text-slate-800 animate-blink" style={{ opacity: 0.7 }}>|</span>
                                )}
                            </span>
                            {done && <span className="sr-only">{srText}</span>}
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 mt-2 w-full max-w-md lg:max-w-full justify-center lg:justify-start"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                        >
                            <Link href="/membership" className="w-full sm:w-auto z-20">
                                <NaapButton
                                    className="bg-primary hover:bg-blue-700 w-full sm:w-auto text-white text-base font-bold px-8 py-3.5 transition-all rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                                    icon={<ArrowRight size={16} />}
                                    iconPosition="right"
                                >
                                    Join NAAPE
                                </NaapButton>
                            </Link>
                            <Link href="/about/about-us" className="w-full sm:w-auto z-20">
                                <NaapButton
                                    className="border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-primary text-base font-bold px-8 py-3.5 w-full sm:w-auto transition-all rounded-full"
                                >
                                    Learn More
                                </NaapButton>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: Single Hero Image with floating elements */}
                    <motion.div
                        className="flex-1 w-full max-w-lg lg:max-w-xl relative"
                        initial={{ opacity: 0, x: 30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Main Image */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/60 border-4 border-white aspect-[4/3]">
                            <Image
                                src="/images/event1.jpg"
                                alt="NAAPE aviation professionals"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                            {/* Overlay badge */}
                            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                                <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                        <Image src="/logo.png" alt="NAAPE" width={24} height={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">NAAPE Nigeria</p>
                                        <p className="text-xs text-slate-500 font-medium">Est. 1984 • Aviation Excellence</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary floating image */}
                        <motion.div
                            className="absolute -bottom-6 -left-6 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden sm:block"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Image
                                src="/images/loginpic.jpg"
                                alt="Aviation crew"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Floating stat badge */}
                        <motion.div
                            className="absolute -top-4 -right-4 bg-white rounded-2xl px-5 py-4 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <Users size={20} className="text-accent" />
                            </div>
                            <div>
                                <p className="text-lg font-black text-slate-900">1,200+</p>
                                <p className="text-xs text-slate-500 font-medium">Active Members</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Stats Row */}
                <motion.div
                    className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:mt-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    {stats.map(({ icon: Icon, value, label }, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 bg-white rounded-2xl px-5 py-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                                <Icon size={22} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
                                <p className="text-sm text-slate-500 font-semibold mt-0.5">{label}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </main>

            <style jsx global>{`
                @keyframes blink {
                    0%, 100% { opacity: 0.70; }
                    50% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 1.14s steps(2, start) infinite;
                }
            `}</style>
        </section>
    );
}
