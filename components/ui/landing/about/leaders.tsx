"use client";

import { LeaderCard } from "@/components/ui/custom/leadercard";
import { motion } from "framer-motion";

// Potentially improve: use real people/photos, more diverse structure, fix typographical/class bugs
// Accessibility, responsiveness and easy maintainability improved
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
            staggerChildren: 0.19,
            delayChildren: 0.10,
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
            stiffness: 70,
            damping: 15,
            duration: 0.55,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 38, scale: 0.97 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 60,
            damping: 16,
            duration: 0.55,
        },
    },
};

export default function LeadershipTimelineSection() {
    return (
        <motion.section
            className="w-full py-16 px-4 md:px-0 flex flex-col items-center bg-[#F6F9FC]"
            aria-labelledby="leadership-title"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            <motion.h2
                id="leadership-title"
                className="text-neutral-900 text-2xl md:text-3xl font-semibold mb-10 text-center"
                variants={titleVariants as any}
            >
                Meet Our Leadership
            </motion.h2>
            <motion.div
                className="flex flex-col md:flex-row flex-wrap gap-8 md:gap-6 w-full max-w-6xl justify-center items-stretch"
                variants={containerVariants}
            >
                {leaders.map((leader) => (
                    <motion.div
                        key={leader.name}
                        variants={cardVariants as any}
                        whileHover={{
                            scale: 1.04,
                            boxShadow: "0 8px 28px 0 rgba(36,80,180,0.15)",
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                        className="flex justify-center"
                    >
                        <LeaderCard
                            name={leader.name}
                            title={leader.title}
                            photoSrc={leader.photoSrc}
                            socials={leader.socials}
                            contactLabel={leader.contactLabel}
                            contactHref={leader.contactHref}
                            className="w-full max-w-xs md:w-64"
                        />
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}
