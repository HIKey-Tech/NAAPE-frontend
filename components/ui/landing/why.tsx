

import Image from "next/image";
import { FaRegCalendarCheck, FaChalkboardTeacher } from "react-icons/fa";
import { MdSecurity, MdTrendingUp } from "react-icons/md";
import { NaapButton } from "@/components/ui/custom/button.naap";

export default function WhyJoinSection() {
    return (
        <section className="relative w-full max-w-full py-12 h-full px-6 md:px-6 flex flex-col md:flex-row items-center justify-center min-h-[34rem] gap-8 bg-white">
            <div className="flex-1 flex flex-col justify-center items-start gap-6 max-w-xl h-fit w-full">
                <span className="inline-block bg-[#FFF6E0] text-[#CA9414] font-bold text-xs md:text-sm tracking-widest uppercase rounded-full px-4 py-1 mb-1 md:mb-0 shadow-sm">
                    WHY JOIN NAAPE
                </span>
                <h2 className="text-[#232835] text-[1.4rem] md:text-[2rem] font-extrabold leading-tight">
                    Championing Excellence And Integrity Across Aviation’s Four Pillars.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full my-2">

                    {[
                        {
                            icon: <FaRegCalendarCheck />,
                            text: "Advocating the rights and improving the working conditions for all our members"
                        },
                        {
                            icon: <FaChalkboardTeacher />,
                            text: "Providing access to world-class training programs to ensure members are globally competitive."
                        },
                        {
                            icon: <MdSecurity />,
                            text: "Promoting and upholding the highest safety standards across the Nigerian aviation industry."
                        },
                        {
                            icon: <MdTrendingUp />,
                            text: "Creating opportunities for career growth, networking, and continuous learning."
                        }
                    ].map((pillar, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                            <span className="w-10 h-10 flex items-center justify-center bg-[#F5F7FA] rounded-lg text-[#2852B4] text-2xl mb-1">
                                {pillar.icon}
                            </span>
                            <p className="text-[#363749] text-sm font-medium">
                                {pillar.text}
                            </p>
                        </div>
                    ))}
                </div>
                <NaapButton
                    className="bg-[#2852B4] hover:bg-[#2347A0] text-white font-semibold px-7 py-3 text-base shadow w-fit transition mt-2"
                >
                    Become A Member
                </NaapButton>
            </div>
            <div className="flex-1 w-full h-full flex items-center justify-center mt-10 md:mt-0 ">
                <div className="rounded-xl overflow-hidden shadow-2xl border border-[#E6EAF1] bg-white w-full max-w-full relative">
                    <Image
                        src="/images/plane.jpg"
                        alt="Jet airplane at sunrise"
                        width={440}
                        height={440}
                        className="object-cover w-full h-full"
                        priority
                        style={{ borderRadius: "16px" }}
                    />
                </div>
            </div>
        </section>
    );
}
