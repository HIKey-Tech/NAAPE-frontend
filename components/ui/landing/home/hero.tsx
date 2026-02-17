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
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero_bg.jpg"
                    alt="Aviation Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-slate-900/70" /> {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40" />
            </div>

            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:py-0 min-h-screen flex flex-col justify-center">
                <div className="flex flex-col items-start text-left max-w-4xl mr-auto gap-8">

                    <motion.div
                        className="flex flex-col items-start gap-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.span
                            className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-semibold tracking-wide uppercase"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Excellence in Aviation since 1984
                        </motion.span>

                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-[4rem] lg:text-[5rem] font-black tracking-tight leading-[1.1] text-white"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            The National Association of <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                                Aircraft Pilots & Engineers
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-slate-200 text-lg md:text-xl max-w-2xl leading-relaxed font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            aria-live="polite"
                        >
                            <span aria-hidden="true">
                                {displayed}
                                {!done && showCursor && (
                                    <span className="ml-0.5 font-mono text-blue-300 animate-blink" style={{ opacity: 0.7 }}>|</span>
                                )}
                            </span>
                            {done && <span className="sr-only">{srText}</span>}
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 w-full justify-start mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        <Link href="/membership" className="w-full sm:w-auto">
                            <NaapButton
                                className="bg-primary hover:bg-blue-600 w-full sm:w-auto text-white text-lg font-bold px-10 py-4 transition-all rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1"
                                icon={<ArrowRight size={20} />}
                                iconPosition="right"
                            >
                                Join NAAPE
                            </NaapButton>
                        </Link>
                        <Link href="/about/about-us" className="w-full sm:w-auto">
                            <NaapButton
                                className="border-2 border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white hover:text-white text-lg font-bold px-10 py-4 w-full sm:w-auto transition-all rounded-full hover:border-white/50"
                            >
                                Learn More
                            </NaapButton>
                        </Link>
                    </motion.div>
                </div>

                {/* Stats Row */}
                <motion.div
                    className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 lg:mt-24"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    {stats.map(({ icon: Icon, value, label }, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-5 border border-white/10 hover:bg-white/15 hover:scale-[1.02] transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                <Icon size={24} className="text-sky-300 group-hover:text-sky-200" />
                            </div>
                            <div>
                                <p className="text-2xl md:text-3xl font-black text-white leading-none">{value}</p>
                                <p className="text-sm text-slate-300 font-semibold mt-1">{label}</p>
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
