"use client";

import { ShieldCheck, Crown, GraduationCap, Users2 } from "lucide-react";
import CredibilityCards from "@/components/ui/custom/credibility.card";

const credibilityStats = [
    {
        icon: <ShieldCheck size={28} className="text-primary" />,
        value: "100%",
        label: "Safety & Compliance",
        description: "Unwavering commitment to standards and worker representation since 1985.",
    },
    {
        icon: <Crown size={28} className="text-accent" />,
        value: "39+",
        label: "Years of Leadership",
        description: "Pioneers and visionaries shaping the story of Nigerian aviation for four decades.",
    },
    {
        icon: <GraduationCap size={28} className="text-primary" />,
        value: "50+",
        label: "Training Programs",
        description: "Fostering education, knowledge transfer, and professional growth nationwide.",
    },
    {
        icon: <Users2 size={28} className="text-accent" />,
        value: "1200+",
        label: "Members Represented",
        description: "A community united by skill, professionalism, and pride in aviation.",
    },
];

export { credibilityStats };

export default function CredibilitySection() {
    return (
        <section className="relative py-24 px-6 md:px-12 w-full overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-slate-900" />
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: "url('/images/plane.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95" />

            <div className="relative z-10 max-w-7xl mx-auto text-center">
                <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Our Impact</span>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                    Credibility Written in <span className="text-accent">Aviation History</span>
                </h2>
                <p className="text-lg text-slate-300 font-medium max-w-2xl mx-auto mb-16">
                    Decades of excellence, advocacy, and leadership in Nigerian aviation.
                </p>
                <CredibilityCards stats={credibilityStats} />
            </div>
        </section>
    );
}
