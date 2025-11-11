"use client";

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { NaapButton } from "@/components/ui/custom/button.naap";

export default function AboutSection() {
    return (
        <section className="relative w-full min-h-[38rem] flex items-center justify-center bg-[#F5F7FA] overflow-hidden md:px-0 md:py-0">
            {/* Soft full-bg overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                aria-hidden
                style={{
                    backgroundImage: "url('/images/handplane.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.30,
                }}
            ></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-center items-center md:items-stretch gap-10 w-full max-w-6xl px-4 md:px-8 py-10">
                {/* Left: Card-like video preview */}
                <div className="flex-shrink-0 flex-grow-0 w-full md:w-[430px] max-w-full">
                    <div className="relative rounded-[18px] overflow-hidden shadow-2xl bg-[#232835] border border-[#E6EAF1] min-h-[300px]">
                        {/* "Browser" like header bar */}
                        <div className="flex items-center gap-2 px-4 h-[34px] bg-black/20 absolute top-0 left-0 w-full z-10">
                            <span className="w-2 h-2 rounded-full bg-[#fff] opacity-60"></span>
                            <span className="w-2 h-2 rounded-full bg-[#fff] opacity-40"></span>
                            <span className="w-2 h-2 rounded-full bg-[#fff] opacity-20"></span>
                        </div>
                        <Image
                            src="/images/loginpic.jpg"
                            alt="Nigerian pilots in cockpit"
                            width={450}
                            height={450}
                            priority
                            className="object-cover w-full h-[260px] md:h-[282px] mt-[34px] select-none"
                            style={{
                                objectPosition: "center",
                            }}
                        />
                        {/* Video play button overlay */}
                        <button
                            aria-label="Play Video"
                            tabIndex={0}
                            className="transition-transform duration-200 hover:scale-105 focus:scale-100 active:scale-95 absolute left-1/2 top-[calc(50%+16px)] -translate-x-1/2 -translate-y-1/2 z-20 bg-black/45 hover:bg-black/60 rounded-full p-4 flex items-center justify-center shadow-2xl focus:outline-none border-4 border-white/30"
                            style={{ boxShadow: "0 4px 30px 0 rgba(30,45,80,0.22)" }}
                        >
                            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
                                <circle
                                    cx="27"
                                    cy="27"
                                    r="25"
                                    fill="#fff"
                                    fillOpacity="0.18"
                                    stroke="#fff"
                                    strokeWidth="2"
                                />
                                <polygon
                                    points="23,20 36,27 23,34"
                                    fill="#fff"
                                    style={{ filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.14))" }}
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 flex flex-col justify-center gap-5 md:pl-6 max-w-2xl">
                    <span className="text-[#CA9414] font-bold text-xs md:text-sm tracking-widest uppercase mb-1 md:mb-0">
                        ABOUT NAAPE
                    </span>
                    <h2 className="text-[#232835] text-[1.6rem] md:text-[2rem] font-extrabold leading-tight mb-1 md:mb-2">
                        Advancing Aviation Excellence<br className="hidden md:block" />
                        and Safety in Nigeria
                    </h2>
                    <p className="text-[#3B3B46] text-[0.99rem] md:text-base font-normal leading-relaxed mb-2 md:mb-4 max-w-xl">
                        Since 1985, the National Association of Aircraft Pilots and Engineers (NAAPE) has been the united voice of Nigeria’s pilots and engineers – our mission is to advance the aviation safety, professionalism, technical expertise in the Nigerian aviation industry through advocacy and the rights of those who keep the skies secure.
                    </p>
                    <NaapButton
                        className="bg-[#2852B4] hover:bg-[#2347A0] w-fit text-white font-semibold px-7 py-3 text-base shadow rounded transition flex items-center gap-2"
                        icon={<FaArrowRight size={16} />}
                        iconPosition="right"
                    >
                        Learn more
                    </NaapButton>
                </div>
            </div>
        </section>
    );
}
