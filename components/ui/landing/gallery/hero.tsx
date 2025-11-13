import Image from "next/image";

export default function GalleryHeroSection() {
    return (
        <section className="w-full min-h-screen bg-gradient-to-b from-[#f8fafc] to-white flex flex-col items-center pt-16 pb-12 px-4 md:px-8">
            <div className="max-w-4xl w-full flex flex-col items-center text-center gap-5 mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1a2236] leading-tight mb-2 drop-shadow-md">
                    NAAPE Media Gallery
                </h1>
                <p className="text-[#42425a] text-lg md:text-xl font-medium max-w-3xl mx-auto">
                    Dive into our curated collection of photos, videos, and podcasts—featuring memorable events, vibrant moments, and inspiring stories from our members.
                </p>
            </div>
            <div className="w-full flex justify-center">
                <div className="relative rounded-2xl h-72 md:h-96 overflow-hidden shadow-2xl w-full max-w-3xl border border-gray-200 bg-white">
                    <Image
                        src="/images/plane.jpg"
                        alt="Airplane parked at sunset near control tower for NAAPE"
                        fill
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, 650px"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                        <span className="text-white text-base md:text-lg font-semibold">
                            From our latest aviation event — Lagos, 2024
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

