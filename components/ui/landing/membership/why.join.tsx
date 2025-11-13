import { FaHandshake, FaLayerGroup } from "react-icons/fa";

import { HiOutlineLightBulb } from "react-icons/hi2";
import Image from "next/image";

const CARD_DATA = [
    {
        icon: <FaHandshake size={28} />,
        title: "Vibrant Community",
        description:
            "Belong to a strong, collaborative network of Nigerian pilots and engineers sharing a passion for safety, growth, and advancement.",
        bg: "bg-gradient-to-br from-[#ebf1fc] to-white",
    },
    {
        icon: <HiOutlineLightBulb size={28} />,
        title: "Professional Growth",
        description:
            "Access members-only networking events, industry advocacy, leadership development, and career resources.",
        bg: "bg-gradient-to-br from-[#f1f7ef] to-white",
    },
    {
        icon: <FaLayerGroup size={28} />,
        title: "Membership for Every Stage",
        description:
            "Whether you’re a Student, Associate, or Full Member, our tailored tiers support every step of your aviation career.",
        bg: "bg-gradient-to-br from-[#e6f3fa] to-white",
    },
];

export default function WhyJoinSection() {
    return (
        <section className="relative w-full bg-[#222836] py-20 px-4 flex items-center justify-center overflow-hidden">
            {/* Soft-pattern overlay background for subtle aviation theme */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/images/plane.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-10"
                    priority={false}
                />
                <div
                    aria-hidden
                    className="absolute inset-0 bg-[#222836] opacity-70"
                    style={{ mixBlendMode: "multiply" }}
                ></div>
            </div>
            <div className="relative z-10 mx-auto w-full max-w-6xl flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-4 tracking-tight drop-shadow-md">
                    Why Join <span className="text-[#42A5F5] underline underline-offset-4">NAAPE?</span>
                </h2>
                <p className="text-[#bfc8de] text-base max-w-2xl text-center mb-11 mx-auto font-medium">
                    Join Nigeria’s premier organization for aviation professionals. Membership with NAAPE connects you to a powerful community, unlocks exclusive opportunities, and supports your journey from student to leader.
                </p>
                <div className="w-full flex flex-col md:flex-row md:items-stretch gap-8 md:gap-7 justify-center items-center">
                    {CARD_DATA.map((card, idx) => (
                        <div
                            key={card.title}
                            className={`flex-1 w-full ${card.bg} rounded-2xl shadow-xl px-8 py-10 max-w-xs flex flex-col items-center text-center gap-4 border border-[#e6eaf3]/60`}
                        >
                            <span className="text-[#2852B4] bg-white shadow-md rounded-full p-3 mb-1">
                                {card.icon}
                            </span>
                            <div className="font-semibold text-xl md:text-[1.35rem] text-[#1A2340]">
                                {card.title}
                            </div>
                            <div className="text-[#485669] text-[1rem] md:text-[1.08rem] font-medium">
                                {card.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
