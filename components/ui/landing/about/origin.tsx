import Image from "next/image";

export default function OriginSection() {
    return (
        <section className="flex flex-col md:flex-row items-start md:items-center gap-12 w-full py-16 px-4 md:px-16 bg-white">
            {/* Image Content */}
            <div className="flex-1 flex justify-center items-center max-w-xl md:max-w-full mb-8 md:mb-0">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                    <Image
                        src="/images/plane.jpg"
                        alt="NAAPE Origin"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl transition-transform duration-300 hover:scale-105"
                        priority
                    />
                </div>
            </div>
            {/* Text Content */}
            <div className="flex-1 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-800 mb-5 leading-tight">
                    Our Origins <span className="font-normal">(1984–1985)</span>
                </h2>
                <div className="text-neutral-700 text-base md:text-lg leading-relaxed space-y-4">
                    <p>
                        Subsequently, NAAPE successfully held its maiden delegates Conference on 17th to 18th May, 1984 at the Nigeria Airways Sports Club, C.I.A., Ikeja, Lagos (now demolished). The Conference elected the first National Executive Council (NEC) – now National Administrative Council (NAC) – with Capt. Ade Olubadewo, who worked with Aero Contractors, as the first National President of NAAPE.
                    </p>
                    <p>
                        The NEC then appointed Comrade Michael Ekujumi as the first General Secretary (then called Professional Secretary) in June, 1984. Thereafter, the NEC set the machinery in motion for the registration of the Association as a trade union which was accomplished in August, 1985.
                    </p>
                </div>
            </div>
        </section>
    );
}
