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
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-slate-900/80" /> {/* Dark overlay for readability */}
            </div>

            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 md:py-40 min-h-screen flex flex-col justify-center">
                <div className="flex flex-col items-start justify-center text-left w-full">
                    {/* Left Aligned Content */}
                    <motion.div
                        className="flex flex-col items-start gap-6 max-w-4xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            The National Association of Aircraft Pilots & Engineers
                        </motion.h1>

                        <motion.div
                            className="h-1 w-32 bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 128 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        />

                        <motion.div
                            className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-200 min-h-[3rem]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <span aria-hidden="true">
                                {displayed}
                                <span className={`ml-1 inline-block w-[3px] h-[1.2em] align-middle bg-primary ${!done ? 'animate-blink' : 'opacity-0'}`}></span>
                            </span>
                            {done && <span className="sr-only">{heroTypewriteText}</span>}
                        </motion.div>

                        <motion.p
                            className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-light"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            Uniting professionals, elevating standards, and shaping the future of aviation in Nigeria and beyond.
                        </motion.p>

                        <motion.div
                            className="flex flex-row gap-4 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            <Link href="/membership">
                                <NaapButton
                                    className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg shadow-primary/20 px-8 py-6 text-lg rounded-full"
                                >
                                    Join The Association
                                </NaapButton>
                            </Link>
                            <Link href="/about/about-us">
                                <NaapButton
                                    className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
                                >
                                    Learn More
                                </NaapButton>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
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
