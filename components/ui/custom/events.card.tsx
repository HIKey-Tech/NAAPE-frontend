"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Types
export interface EventCardProps {
    imageUrl: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    registerUrl?: string;
    className?: string;
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 13, duration: 0.55 } },
    hover: { scale: 1.03, boxShadow: "0 8px 32px 2px rgba(44,49,73,0.14)" }
};

const imageVariants = {
    hidden: { scale: 0.97, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.1, duration: 0.55 } }
};

const contentVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.42, type: "spring", stiffness: 50, damping: 18 } }
};

const buttonVariants = {
    hover: { backgroundColor: "#232B43", color: "#fff" }
};

export function EventCard({
    imageUrl,
    title,
    date,
    time,
    venue,
    registerUrl,
    className = "",
}: EventCardProps) {
    return (
        <motion.div
            className={`rounded-lg overflow-hidden shadow-sm bg-[#0A1328] flex flex-col transition hover:shadow-lg ${className}`}
            variants={cardVariants as any}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.25 }}
        >
            {/* Image */}
            <motion.div
                className="relative w-full h-48"
                variants={imageVariants}
            >
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>

            {/* Content */}
            <motion.div
                className="flex-1 flex flex-col px-5 pt-5 pb-7"
                variants={contentVariants as any}
            >
                <h4 className="text-xs md:text-sm text-[#5F6282] font-semibold mb-1">{title}</h4>
                <div className="text-[#C8CBD4] text-sm font-medium mb-1">
                    {date} - {time}
                </div>
                <div className="text-[#C8CBD4] text-xs mb-4">
                    {venue}
                </div>
                <div className="mt-auto">
                    <Link href={registerUrl ?? "#"} passHref>
                        <motion.button
                            className="w-full border border-[#2C3049] text-[#4561FF] hover:bg-[#232B43] rounded py-1.5 text-sm font-semibold transition"
                            variants={buttonVariants}
                            whileHover="hover"
                            type="button"
                        >
                            Register
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}
