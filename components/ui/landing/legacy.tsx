"use client";

import { LegacyStatCard } from "@/components/ui/custom/legacy.card";
import {
    FaShieldAlt,
    FaRegClock,
    FaChalkboardTeacher,
    FaUserFriends,
} from "react-icons/fa";

export default function OurLegacy() {
    const stats = [
        {
            value: "100%",
            label: <>Safety &amp; Compliance Advocacy</>,
            icon: <FaShieldAlt size={28} className="text-[#CA9414]" />,
        },
        {
            value: "39+",
            label: <>Years of Aviation Leadership</>,
            icon: <FaRegClock size={28} className="text-[#2347A0]" />,
        },
        {
            value: "50+",
            label: <>Training &amp; Development Programs</>,
            icon: <FaChalkboardTeacher size={28} className="text-[#3970D8]" />,
        },
        {
            value: "1200+",
            label: <>Pilots &amp; Engineers Represented</>,
            icon: <FaUserFriends size={28} className="text-[#2852B4]" />,
        },
    ];

    return (
        <section className="w-full bg-white  md:px-0 flex flex-col items-center">
            <div className="w-full px-6 py-10 max-w-full mx-auto flex flex-col items-center text-center gap-6">
                <span className="text-[#CA9414] font-semibold text-sm tracking-widest mb-2">
                    OUR LEGACY
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-[#232835] mb-2">
                    Building a Legacy That Soars
                </h2>
                <p className="text-[#4B4B55] max-w-2xl text-base md:text-lg mb-6">
                    Born from the merger of two pioneering aviation groups in 1984, NAAPE represents a legacy of unity, professionalism, and service.
                </p>
                <div className="grid grid-cols-1 item-center justify-center sm:grid-cols-2 md:grid-cols-4 gap-6 w-full mt-4">
                    {stats.map(({ value, label, icon }, idx) => (
                        <LegacyStatCard
                            key={idx}
                            value={value}
                            label={label}
                            icon={icon}
                            className="w-full"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
