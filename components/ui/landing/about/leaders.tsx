"use client";

import { LeaderCard } from "@/components/ui/custom/leadercard";

// Potentially improve: use real people/photos, more diverse structure, fix typographical/class bugs
// Accessibility, responsiveness and easy maintainability improved
const leaders = [
    {
        name: "Capt. Danjuma Yakubu",
        title: "President",
        photoSrc: "/images/leader.png",
        socials: {
            linkedin: "https://www.linkedin.com/in/danjuma-yakubu",
            twitter: "https://twitter.com/danjumayakubu",
        },
        contactLabel: "Contact Danjuma",
        contactHref: "mailto:danjuma.yakubu@naape.org",
    },
    {
        name: "Engr. Susan Iheanacho",
        title: "Vice President",
        photoSrc: "/images/leader.png",
        socials: {
            linkedin: "https://www.linkedin.com/in/susan-iheanacho",
        },
        contactLabel: "Contact Susan",
        contactHref: "mailto:susan.iheanacho@naape.org",
    },
    {
        name: "Capt. Wale Ajayi",
        title: "General Secretary",
        photoSrc: "/images/leader.png",
        socials: {
            twitter: "https://twitter.com/waleajayi",
        },
        contactLabel: "Contact Wale",
        contactHref: "mailto:wale.ajayi@naape.org",
    },
    {
        name: "Engr. Fatima Bello",
        title: "Chief Safety Engineer",
        photoSrc: "/images/leader.png",
        socials: {
            linkedin: "https://www.linkedin.com/in/fatima-bello",
            facebook: "https://facebook.com/fatimabello",
        },
        contactLabel: "Contact Fatima",
        contactHref: "mailto:fatima.bello@naape.org",
    },
];

export default function LeadershipTimelineSection() {
    return (
        <section
            className="w-full py-16 px-4 md:px-0 flex flex-col items-center bg-[#F6F9FC]"
            aria-labelledby="leadership-title"
        >
            <h2
                id="leadership-title"
                className="text-neutral-900 text-2xl md:text-3xl font-semibold mb-10 text-center"
            >
                Meet Our Leadership
            </h2>
            <div className="flex flex-col md:flex-row flex-wrap gap-8 md:gap-6 w-full max-w-6xl justify-center items-stretch">
                {leaders.map((leader) => (
                    <LeaderCard
                        key={leader.name}
                        name={leader.name}
                        title={leader.title}
                        photoSrc={leader.photoSrc}
                        socials={leader.socials}
                        contactLabel={leader.contactLabel}
                        contactHref={leader.contactHref}
                        className="w-full max-w-xs md:w-64"
                    />
                ))}
            </div>
        </section>
    );
}
