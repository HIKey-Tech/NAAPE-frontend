
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { NaapButton } from "@/components/ui/custom/button.naap";
import Link from "next/link";

export default function AboutSection() {
    return (
        <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center bg-muted/30 overflow-hidden px-6 py-16 md:px-12">
            {/* Soft full-bg overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/handplane.jpg')] bg-cover bg-center opacity-[0.03]"
                aria-hidden
            ></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-16 w-full max-w-7xl mx-auto">
                {/* Left: Card-like video preview */}
                <div className="flex-shrink-0 w-full md:w-1/2 group">
                    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl shadow-indigo-500/10 min-h-[500px]">
                        <Image
                            src="/images/handplane.jpg"
                            alt="Nigerian pilots in cockpit"
                            width={800}
                            height={800}
                            priority
                            className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Video play button overlay */}

                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex flex-col justify-center gap-6 w-full md:w-1/2">
                    <div className="flex flex-col gap-2">
                        <span className="text-accent font-bold text-sm tracking-widest uppercase">
                            About NAAPE
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
                            Advancing <span className="text-primary bg-primary/5 px-2 rounded-lg decoration-clone">Aviation Excellence</span><br />
                            and Safety in Nigeria
                        </h2>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                        Since 1985, the <span className="text-foreground font-bold">National Association of Aircraft Pilots and Engineers (NAAPE)</span> has been the united voice of Nigeria’s pilots and engineers—<span className="text-primary font-semibold">our mission is to advance aviation safety, professionalism, and technical expertise</span> in the Nigerian aviation industry through advocacy and safeguarding the rights of those who keep our skies secure.
                    </p>

                    <Link href="/about/about-us" className="mt-4">
                        <NaapButton
                            className="bg-primary hover:bg-blue-700 text-white font-bold px-8 py-4 text-base transition-all rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center gap-2"
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
