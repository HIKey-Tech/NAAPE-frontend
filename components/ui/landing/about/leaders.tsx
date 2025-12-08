"use client";

import { LeaderCard } from "@/components/ui/custom/leadercard";
import { motion } from "framer-motion";

// Improved: Respectful aesthetic, storytelling feel, better visual hierarchy & contrast, no shadow/gradient.
const leaders = [
    {
        name: "Engr. Abednego Galadima",
        title: "National President",
        photoSrc: "/members/Abednego.jpg",
        socials: {
            linkedin: "https://www.linkedin.com/in/danjuma-yakubu",
            twitter: "https://twitter.com/danjumayakubu",
        },
        contactLabel: "Contact Engr. Abednego",
        contactHref: "mailto:danjuma.yakubu@naape.org",
    },
    {
        name: "Engr. Adebayo Oluyemi",
        title: "Deputy National President",
        photoSrc: "/members/Adebayo.jpg",
        socials: {
            linkedin: "https://www.linkedin.com/in/susan-iheanacho",
        },
        contactLabel: "Contact Engr. Adebayo",
        contactHref: "mailto:susan.iheanacho@naape.org",
    },
    {
        name: "Engr. Richard Allison",
        title: "Vice President, Engineers",
        photoSrc: "/members/richard.jpg",
        socials: {
            twitter: "https://twitter.com/waleajayi",
        },
        contactLabel: "Contact Engr. Richard",
        contactHref: "mailto:wale.ajayi@naape.org",
    },
    {
        name: "Capt. Yakubu Ducas",
        title: "Vice President, Pilots",
        photoSrc: "/members/yakubu.jpg",
        socials: {
            linkedin: "https://www.linkedin.com/in/fatima-bello",
            facebook: "https://facebook.com/fatimabello",
        },
        contactLabel: "Contact Capt. Yakubu",
        contactHref: "mailto:fatima.bello@naape.org",
    },
];

// Animation variants
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.16,
            delayChildren: 0.06,
        },
    },
};

const titleVariants = {
    hidden: { opacity: 0, y: 36 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 68,
            damping: 14,
            duration: 0.52,
        },
    },
};

const introVariants = {
    hidden: { opacity: 0, y: 36 },
    show: {
        opacity: 0.93,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 66,
            damping: 18,
            duration: 0.55,
            delay: 0.09,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 38, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 62,
            damping: 15,
            duration: 0.54,
        },
    },
};

export default function LeadershipTimelineSection() {
    return (
        <motion.section
            className="w-full py-20 md:py-24 px-4 md:px-0 flex flex-col items-center bg-neutral-50 border-t border-neutral-200"
            aria-labelledby="leadership-title"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            <motion.h2
                id="leadership-title"
                className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#232835] mb-4 text-center"
                variants={titleVariants as any}
            >
                Meet Our Leadership
            </motion.h2>
            <motion.p
                className="max-w-2xl text-base md:text-lg font-medium text-neutral-700 text-center mb-12 md:mb-16 leading-relaxed"
                variants={introVariants as any}
            >
                Our leaders are custodians of excellence, history and service in Nigerian aviation. Their diverse experiences, tireless advocacy, and passion for uplifting pilots and engineers shape our story and legacy.
            </motion.p>
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl"
                variants={containerVariants}
            >
                {leaders.map((leader) => (
                    <motion.div
                        key={leader.name}
                        variants={cardVariants as any}
                        // No hover shadow, but subtle scale for interactivity.
                        whileHover={{
                            scale: 1.025,
                        }}
                        transition={{ type: "spring", stiffness: 110, damping: 18 }}
                        className="flex justify-center"
                    >
                        <LeaderCard
                            name={leader.name}
                            title={leader.title}
                            photoSrc={leader.photoSrc}
                            socials={leader.socials}
                            contactLabel={leader.contactLabel}
                            contactHref={leader.contactHref}
                            className="w-full max-w-xs md:w-60 border border-neutral-200 bg-white rounded-xl"
                            // add class for story motif – gentle border and slight sepia bg
                        />
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}
