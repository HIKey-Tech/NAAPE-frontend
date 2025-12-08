
import { ShieldCheck, Crown, GraduationCap, Users2 } from "lucide-react";
import CredibilityCards from "@/components/ui/custom/credibility.card";

// Remove gradient + shadow, historic/sepia overlay, serious typography, story motif
const BACKGROUND_IMAGE_URL = '/images/plane.jpg';

// Conform to CredibilityStat interface: label must be string
const credibilityStats = [
    {
        icon: <ShieldCheck size={32} strokeWidth={1.5} className="text-[#8f7341]" aria-hidden="true" />,
        value: "100%",
        label: "Safety & Compliance — Advocacy",
        description: "Our unwavering commitment to standards and worker representation has protected aviation safety since 1985.",
    },
    {
        icon: <Crown size={32} strokeWidth={1.5} className="text-[#8f7341]" aria-hidden="true" />,
        value: "39+",
        label: "Years of Leadership — Aviation History",
        description: "Built by pioneers and visionaries, NAAPE's leadership has shaped the story of Nigerian aviation for four decades.",
    },
    {
        icon: <GraduationCap size={32} strokeWidth={1.5} className="text-[#8f7341]" aria-hidden="true" />,
        value: "50+",
        label: "Training Programs — Technical Growth",
        description: "We foster education, knowledge transfer, and professional growth for both pilots and engineers nationwide.",
    },
    {
        icon: <Users2 size={32} strokeWidth={1.5} className="text-[#8f7341]" aria-hidden="true" />,
        value: "1200+",
        label: "Members Represented — Pilots & Engineers",
        description: "An enduring community united by skill, professionalism, and pride—our members carry on NAAPE's legacy.",
    },
];

export { credibilityStats };

export default function CredibilitySection() {
    return (
        <section
            className="relative w-full flex justify-center items-center py-20 md:py-24"
            aria-labelledby="credibility-title"
            style={{
                backgroundColor: "#fbf5ea",
                backgroundImage: `url('${BACKGROUND_IMAGE_URL}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderTop: "1.5px solid #e0d2b0"
            }}
        >
            {/* Sepia overlay for historic mood */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "rgba(245, 236, 220, 0.92)",
                    mixBlendMode: "multiply"
                }}
            />
            <div className="relative w-full max-w-7xl mx-auto px-4 z-10">
                <header className="mb-10 flex flex-col items-center text-center">
                    <h2 id="credibility-title"
                        className="font-serif text-[2rem] md:text-[2.35rem] font-extrabold text-[#8f7341] tracking-tight leading-tight mb-1"
                        style={{ textShadow: "0 1px 0 #f4e4c6" }}
                    >
                        <span className="block">Our Credibility,</span>
                        <span className="block text-[#785e2e] font-semibold text-[1.22rem] md:text-[1.34rem] tracking-wide">Written in Aviation History</span>
                    </h2>
                    <span className="block w-16 h-1 rounded bg-[#c1a86e] mt-3 mb-0.5" />
                </header>
                <CredibilityCards stats={credibilityStats} />
            </div>
        </section>
    );
}

