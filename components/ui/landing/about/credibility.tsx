
import { LegacyStatCard } from "@/components/ui/custom/legacy.card";
import { ShieldCheck, Crown, GraduationCap, Users2 } from "lucide-react";

/**
 * CredibilitySection - displays organizational credibility metrics in card format.
 */

// You may want to provide your own image and adjust path as needed
const BACKGROUND_IMAGE_URL = '/images/plane.jpg';

const credibilityStats = [
    {
        icon: <ShieldCheck size={28} strokeWidth={1.6} className="text-[#B1B8C7]" aria-hidden="true" />,
        value: "100%",
        label: <>Safety & Compliance<br />Advocacy</>,
    },
    {
        icon: <Crown size={28} strokeWidth={1.6} className="text-[#B1B8C7]" aria-hidden="true" />,
        value: "39+",
        label: <>Years of Aviation<br />Leadership</>,
    },
    {
        icon: <GraduationCap size={28} strokeWidth={1.6} className="text-[#B1B8C7]" aria-hidden="true" />,
        value: "50+",
        label: <>Training & Development<br />Programs</>,
    },
    {
        icon: <Users2 size={28} strokeWidth={1.6} className="text-[#B1B8C7]" aria-hidden="true" />,
        value: "1200+",
        label: <>Pilots & Engineers<br />Represented</>,
    },
];

export default function CredibilitySection() {
    return (
        <section
            className="w-full flex justify-center items-center py-16 relative"
            aria-labelledby="credibility-title"
            style={{
                backgroundColor: "#13151C",
                backgroundImage: `linear-gradient(rgba(19,21,28,0.90),rgba(19,21,28,0.92)), url('${BACKGROUND_IMAGE_URL}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-4 gap-7 px-4">
                {credibilityStats.map((stat, idx) => (
                    <LegacyStatCard
                        key={stat.value + "-" + idx}
                        icon={stat.icon}
                        value={stat.value}
                        label={stat.label}
                        className="bg-white"
                    />
                ))}
            </div>
        </section>
    );
}

