import { Briefcase, ShieldCheck, BarChart2, Handshake } from "lucide-react";

/**
 * More explicit, less repetition, stronger copy & better accessibility improvements.
 */
const whatWeDoItems = [
    {
        icon: Briefcase,
        title: "Member Advocacy",
        description:
            "We actively protect and advance the professional and economic interests of all our members, ensuring their voices are heard at every level within the industry.",
    },
    {
        icon: ShieldCheck,
        title: "Safety & Security",
        description:
            "We champion and uphold the highest standards of aviation safety and security, fostering a safer environment for all stakeholders.",
    },
    {
        icon: BarChart2,
        title: "Continuous Learning",
        description:
            "We provide regular opportunities for learning, growth, and professional development to help our members excel in their careers.",
    },
    {
        icon: Handshake,
        title: "Ethics & Excellence",
        description:
            "We uphold a strict code of ethics and cultivate a culture of excellence and integrity across everything we do.",
    },
];

export default function WhatWeDoSection() {
    return (
        <section
            className="w-full py-16 px-4 md:px-0 flex flex-col items-center bg-white"
            aria-labelledby="whatwedo-title"
        >
            <h2
                id="whatwedo-title"
                className="text-neutral-900 text-2xl md:text-3xl font-semibold mb-8 text-center"
            >
                What We Do
            </h2>
            <div
                className="
                    w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8
                    md:gap-4
                "
                role="list"
                aria-label="Key focus areas of NAAPE"
            >
                {whatWeDoItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.title}
                            className="flex flex-col items-center text-center bg-[#F7F9FC] rounded-lg shadow-sm hover:shadow-md transition p-6 h-full"
                            tabIndex={0}
                            role="listitem"
                            aria-label={item.title + '. ' + item.description}
                        >
                            <Icon
                                size={38}
                                strokeWidth={1.7}
                                className="mx-auto mb-4 text-blue-500"
                                aria-hidden="true"
                            />
                            <h3 className="text-lg text-[#232835] font-semibold mb-2">{item.title}</h3>
                            <p className="text-base text-neutral-600 leading-normal">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
