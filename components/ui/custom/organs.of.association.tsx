"use client";

import CustomHeroSection from "@/components/ui/custom/hero.section";
import CustomBodySection from "@/components/ui/custom/custom.body";

export default function OrgansOfAssociationComponent() {
  return (
    <>
      <CustomHeroSection
        heading={<>ORGANS OF ASSOCIATION</>}
        slides={[
          {
            src: "/images/plane.jpg",
            alt: "Pilots in the cockpit of an airplane",
            caption: "The principal organs that drive the Association's mission"
          }
        ]}
        showArrows={false}
        minHeightClass="min-h-[43vh] md:min-h-[37vh]"
        className="pb-4"
      />
      <CustomBodySection
        title={null}
        paragraphs={[
          <>
            <span>The organs of the Association are:</span>
            <ul className="mt-4 mb-0 list-disc list-inside text-left text-[#232835] text-base md:text-lg font-medium space-y-1">
              <li>
                <b>The National Delegates Conference</b> <span className="text-[#606476]">(hereinafter referred to as the Conference)</span>
              </li>
              <li>
                <b>The National Executive Council</b> <span className="text-[#606476]">(hereinafter referred to as the NEC)</span>
              </li>
              <li>
                <b>The National Administrative Council</b> <span className="text-[#606476]">(hereinafter referred to as the NAC)</span>
              </li>
              <li>
                <b>The State Council</b>
              </li>
              <li>
                <b>The Women Commission</b>
              </li>
              <li>
                <b>The Branch Executive Council</b>
              </li>
            </ul>
          </>
        ]}
        imageSrc="/images/plane.jpg"
        imageAlt="Illustration of NAAPE's organs of association structure"
        containerClassName="flex flex-col items-center gap-12 w-full py-12 px-4 md:px-16 bg-white"
        textClassName="flex-1 max-w-2xl"
        imageClassName="rounded-2xl transition-transform duration-300 shadow-xl border border-gray-100"
      />
    </>
  );
}
