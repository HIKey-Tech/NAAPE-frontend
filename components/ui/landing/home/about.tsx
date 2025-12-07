
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { NaapButton } from "@/components/ui/custom/button.naap";
import Link from "next/link";

export default function AboutSection() {
    return (
        <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#e5ecfa] overflow-hidden px-4 py-6 md:px-0">
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

            <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-12 w-full max-w-full p-6">
                {/* Left: Card-like video preview */}
                <div className="flex-shrink-0 flex-grow-0 w-full md:w-fit max-w-fit">
                    <div className="relative rounded-[18px] overflow-hidden bg-[#232835] border border-[#E6EAF1] min-h-full">
                        <Image
                            src="/images/loginpic.jpg"
                            alt="Nigerian pilots in cockpit"
                            width={450}
                            height={450}
                            priority
                            className="object-cover w-full h-full mt-[34px] select-none"
                            style={{
                                objectPosition: "center",
                            }}
                        />
                        {/* Video play button overlay */}
                        <button
                            aria-label="Play Video"
                            tabIndex={0}
                            className="transition-transform duration-200 hover:scale-105 focus:scale-100 active:scale-95 absolute left-1/2 top-[calc(50%+16px)] -translate-x-1/2 -translate-y-1/2 z-20 bg-black/45 hover:bg-black/60 rounded-full p-4 flex items-center justify-center focus:outline-none border-4 border-white/30"
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
                <div className="flex flex-col justify-center gap-3 md:gap-5 w-full max-w-xl">
                    <span className="text-[#CA9414] font-bold text-xs md:text-sm tracking-wider uppercase mb-1 md:mb-0 letter-spacing[.11em]">
                        ABOUT NAAPE
                    </span>
                    <h2 className=" text-[2.15rem] md:text-[2.4rem] font-extrabold leading-tight mb-1 md:mb-2 tracking-tight">
                        <span className="block mb-0.5">
                            Advancing <span className="">Aviation Excellence</span>
                        </span>
                        <span className="block  text-[1.34rem] md:text-[1.5rem] font-bold tracking-wide">
                            and Safety in Nigeria
                        </span>
                    </h2>
                    <hr className="w-12 border-t-2 border-[#CA9414] mb-2 md:mb-2 mt-[4px] md:mt-[6px] rounded-lg" />
                    <p className=" text-[1.07rem] md:text-lg font-medium leading-relaxed mb-2 md:mb-4 w-full max-w-prose">
                        Since 1985, the <span className="font-bold">National Association of Aircraft Pilots and Engineers (NAAPE)</span> has been the united voice of Nigeria’s pilots and engineers—<span className=" font-semibold">our mission is to advance aviation safety, professionalism, and technical expertise</span> in the Nigerian aviation industry through advocacy and safeguarding the rights of those who keep our skies secure.
                    </p>

                    <Link href="/about-us">
                        <NaapButton
                            className="bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 w-fit text-white font-semibold px-7 py-3 text-base transition flex items-center gap-2 rounded-full shadow-none border-0"
                            icon={<FaArrowRight size={16} />}
                            iconPosition="right"
                        >
                            Learn more
                        </NaapButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}

