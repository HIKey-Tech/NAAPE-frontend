import Image from "next/image";

export default function FutureSection() {
    return (
        <section className="flex flex-col md:flex-row items-start md:items-center gap-12 w-full py-16 px-4 md:px-16 bg-white">
            {/* Text Content */}
            <div className="flex-1 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-800 mb-5 leading-tight">
                    Flying the Future of Nigeria’s<br />
                    <span className="font-normal">Aviation Professionals</span>
                </h2>
                <div className="text-neutral-700 text-base md:text-lg leading-relaxed space-y-4">
                    <p>
                        Being a platform for frontline professionals in aviation, NAAPE is a leading voice for safe flights operation in Nigeria, hence its motto, <b>We Do Right For Safety</b>. NAAPE is also a strong advocate for the full autonomy and effectiveness of the Nigerian Civil Aviation Authority (NCAA) being the sector regulator. NAAPE is equally the rallying point for Pilots and Aircraft Maintenance Engineers on professional, ethical and sector growth issues.
                    </p>
                    <p>
                        Above all, NAAPE performs its traditional role of vanguard for the protection and advancement of the workplace rights of its members with passion and dedication.
                    </p>
                    <p>
                        The present National President is Engr. Abednego Galadima, elected in July, 2018.
                        <br />
                        NAAPE is an affiliate of the Nigeria Labour Congress of Nigeria (NLC).
                    </p>
                </div>
            </div>
            {/* Image Content */}
            <div className="flex-1 flex justify-center items-center max-w-xl md:max-w-full">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                    <Image
                        src="/images/plane.jpg"
                        alt="NAAPE Pilot in cockpit looking at future"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl transition-transform duration-300 hover:scale-105"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
