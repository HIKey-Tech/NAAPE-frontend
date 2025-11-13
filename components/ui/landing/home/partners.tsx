
import Image from "next/image";

const partners = [
  {
    name: "SHELLS",
    logo: "/images/partners/shells.svg",
  },
  {
    name: "SmartFinder",
    logo: "/images/partners/smartfinder.svg",
  },
  {
    name: "Zoomer",
    logo: "/images/partners/zoomer.svg",
  },
  {
    name: "ArtVenue",
    logo: "/images/partners/artvenue.svg",
  },
  {
    name: "kontrastr",
    logo: "/images/partners/kontrastr.svg",
  },
  {
    name: "WAVESMARATHON",
    logo: "/images/partners/wavesmarathon.svg",
  },
];

export default function PartnersSection() {
  return (
    <section className="w-full max-w-screen-xl mx-auto py-14 px-6 flex flex-col items-center text-center">
      <span className="text-xs md:text-sm text-[#CA9414] font-semibold tracking-widest uppercase mb-2">
        YOU ARE IN GOOD COMPANY
      </span>
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-2">
        Our Partners & Affiliations
      </h2>
      <p className="mb-7 md:mb-10 max-w-2xl text-xs md:text-sm text-[#232835]/80">
        We collaborate with leading aviation bodies, government agencies, and global organizations to advance professional standards and promote the growth of the aviation industry.
      </p>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-6 gap-y-6 items-center justify-center">
        {partners.map((partner) => (
          <div key={partner.name} className="flex flex-col items-center">
            <div className="mb-1">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={60}
                height={40}
                className="object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
            <span className="text-xs text-[#636877] font-medium">{partner.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
