import Image from "next/image";

export default function AboutHeroSection() {
  return (
    <section className="w-full h-screen bg-white flex flex-col items-center pt-12 pb-10 px-4 md:px-6">
      <div className="max-w-full w-full flex flex-col items-center text-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#232835] leading-tight mb-2">
          About the National Association of <br className="hidden md:block" />
          Aircraft Pilots &amp; Engineers
        </h1>
        <p className="text-[#4B4B55] text-base md:text-lg font-medium max-w-2xl mx-auto">
          Championing the legacy and future of aviation professionals with an unwavering commitment to safety, advocacy and excellence.
        </p>
      </div>
      <div className="w-full px-10   flex justify-center">
        <div className="relative rounded-xl h-full overflow-hidden shadow-xl w-full max-w-full">
          <Image
            src="/images/plane.jpg"
            alt="Airplane parked with control tower at sunset"
            width={650}
            height={650}
            className="object-cover w-full h-full md:h-80"
            priority
          />
        </div>
      </div>
    </section>
  );
}

