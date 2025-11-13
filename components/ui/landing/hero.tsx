"use client";

import Image from "next/image";
import Link from "next/link";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
    return (
        <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#e5ecfa] overflow-hidden px-4 py-6 md:px-0">
            {/* Subtle silhouette background for aviation theme */}
            <div
                aria-hidden
                className="absolute inset-0 z-0 flex justify-center items-center"
                style={{
                    pointerEvents: "none",
                }}
            >
                <Image
                    src="/images/handplane.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-10 md:opacity-15"
                    priority
                />
            </div>
            {/* Main Content */}
            <div className="relative z-10 flex px-6 h-full flex-col md:flex-row items-center w-full  gap-4 md:gap-4">
                {/* Left Side: Heading and CTA */}
                <div className="flex-1 text-center md:text-left h-full flex flex-col items-center md:items-start gap-7 md:gap-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#232835] leading-tight md:leading-[1.15]">
                        Empowering Nigeria&apos;s<br />
                        <span className="text-[#2852B4]">Aviators and Engineers</span>
                    </h1>
                    <p className="text-[#585C67] text-base md:text-lg max-w-lg md:max-w-xl">
                        NAAPE represents the collective strength and professionalism of aircraft pilots and engineers across Nigeria.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-3 md:mt-4 w-full md:w-auto items-center md:items-start">
                        <Link href="/register" className="w-full sm:w-auto">
                            <NaapButton
                                className="bg-[#2852B4] hover:bg-[#2347A0] w-full h-full sm:w-auto text-white text-base font-semibold px-7 py-3 shadow"
                                icon={<FaArrowRight size={18} />}
                                iconPosition="right"
                            >
                                Join NAAPE
                            </NaapButton>
                        </Link>
                        <Link href="/about" className="w-full sm:w-auto">
                            <NaapButton
                                // variant="outline"
                                className="border-[#2852B4] h-full border text-[#2852B4] hover:bg-[#eef2fa] text-base font-semibold px-7 py-3 w-full sm:w-auto  bg-transparent"
                            >
                                Learn More
                            </NaapButton>
                        </Link>
                    </div>
                </div>
                {/* Right Side: Cockpit Image */}
                <div className="flex-1 flex w-full justify-center items-center">
                    <div className="rounded-2xl shadow-xl overflow-hidden border border-[#E6EAF1] bg-white  w-full h-full flex items-center justify-center">
                        <Image
                            src="/images/loginpic.jpg"
                            alt="Nigerian pilots in cockpit"
                            width={440}
                            height={440}
                            className="object-cover w-full h-full"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
