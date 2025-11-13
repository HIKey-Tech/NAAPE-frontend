import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { NaapButton } from "@/components/ui/custom/button.naap";

export default function MembershipHeroSection() {
    return (
        <section className="relative w-full min-h-screen flex flex-col-reverse md:flex-row items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#e5ecfa] overflow-hidden px-4 py-6 md:py-16 md:px-0">
            {/* Soft background image overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                aria-hidden
                style={{
                    backgroundImage: "url('/images/plane.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.16,
                }}
            ></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 w-full max-w-7xl mx-auto px-2 md:px-10">
                {/* Content */}
                <div className="flex flex-1 flex-col items-center md:items-start text-center md:text-left gap-6">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-[#232835] leading-tight mb-2 drop-shadow-[0_2px_12px_rgba(30,41,59,0.11)]">
                        Join Nigeria’s Premier <span className="text-primary">Aviation</span> <br className="hidden md:block" />
                        Community of Professionals
                    </h1>
                    <p className="text-[#4B4B55] text-lg md:text-xl font-medium max-w-xl mx-auto md:mx-0">
                        Become part of NAAPE—the national network for pilots, engineers, and aviation professionals committed to <span className="font-semibold text-[#232835]">advancing safety, skill, and excellence</span> in Nigeria’s aviation industry.
                    </p>
                    <div className="flex gap-5 mt-4 w-full justify-center md:justify-start">
                        <Link href="#register" passHref legacyBehavior>
                            <NaapButton
                                variant="primary"
                                className="px-7 py-3 font-semibold text-base shadow-lg"
                                icon={<FaArrowRight className="ml-1" />}
                                iconPosition="right"
                            >
                                Become a Member
                            </NaapButton>
                        </Link>
                        <Link href="#learn-more" passHref legacyBehavior>
                            <NaapButton
                                variant="ghost"
                                className="px-7 py-3 font-semibold text-base border-[#2852B4] text-[#2852B4]"
                            >
                                Learn More
                            </NaapButton>
                        </Link>
                    </div>
                </div>
                {/* Hero Image */}
                <div className="flex-1 w-full md:w-[420px] max-w-[430px] relative shadow-2xl rounded-2xl overflow-hidden border border-[#e6e9f1] bg-white/70">
                    <Image
                        src="/images/plane.jpg"
                        alt="Nigerian pilots and engineers group"
                        width={600}
                        height={600}
                        className="object-cover w-full h-72 md:h-[340px] grayscale-0"
                        priority
                    />
                    {/* Subtle shape decoration */}
                    <div
                        aria-hidden
                        className="hidden md:block absolute -bottom-10 -right-10 z-10 h-32 w-32 rounded-full bg-[#d8ecfa] opacity-70 blur-2xl"
                    ></div>
                </div>
            </div>
        </section>
    );
}
