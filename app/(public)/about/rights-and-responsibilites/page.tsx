import CustomHeroSection from "@/components/ui/custom/hero.section";
import CustomBodySection from "@/components/ui/custom/custom.body";

export default function RightsAndResponsibilitiesPage() {
    return (
        <>
            <CustomHeroSection
                heading={<>RIGHTS AND RESPONSIBILITIES</>}
                subheading={
                    <>
                        The Constitution spells out the main rights and responsibilities of all NAAPE members. Below are some of the fundamental provisions:
                    </>
                }
                slides={[
                    {
                        src: "/images/plane.jpg",
                        alt: "Pilots in the cockpit of an airplane",
                        caption: "Upholding rights and responsibilities for every NAAPE member"
                    }
                ]}
                showArrows={false}
                minHeightClass="min-h-[45vh] md:min-h-[38vh]"
                className="pb-4"
            />

            <CustomBodySection
                title={
                    <>
                        Members’ Key Rights & Responsibilities
                    </>
                }
                paragraphs={[
                    <>
                        <ul className="mt-2 mb-0 list-disc list-inside text-left text-[#232835] text-base md:text-lg font-medium space-y-2">
                            <li>
                                Every member of the Association shall have both right and duty to fully and freely participate in all activities of the Association as relevant sections of the Constitution permit.
                            </li>
                            <li>
                                Every member shall have the right to vote and be voted for at Branch and National levels, and at other organs of the Association without hindrance, and subject only to conditions imposed by relevant sections of this Constitution as well as other uniformly imposed conditions by persons and organs authorized to do so by this Constitution.
                            </li>
                            <li>
                                Voting shall be by person or by proxy. If by proxy, the proxy shall be a person who is entitled to vote, and shall have a written permission of the member given in the format approved by NAC.
                            </li>
                            <li>
                                Every member shall be entitled to be treated fairly by all organs and offices of the Association and in the case of disciplinary procedure shall be entitled to fair hearing.
                            </li>
                            <li>
                                Every member shall be entitled to be heard at all meetings which the member is entitled to attend by the Constitution.
                            </li>
                        </ul>
                    </>
                ]}
                imageSrc="/about/cockpit.jpg"
                imageAlt="Illustration representing fairness and rights"
                containerClassName="flex flex-col-reverse md:flex-row items-start md:items-center gap-12 w-full py-10 px-4 md:px-16 bg-white"
                textClassName="flex-1 max-w-2xl"
                imageClassName="rounded-2xl transition-transform duration-300 hover:scale-105"
            />
        </>
    );
}