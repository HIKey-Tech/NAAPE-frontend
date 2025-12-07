"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
    hidden: { scale: 0.98, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.08, duration: 0.44 } }
};

const contentVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.17, duration: 0.43, type: "spring", stiffness: 54, damping: 16 } }
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
            className={`rounded-xl overflow-hidden shadow-lg border bg-gradient-to-b from-card via-background/90 to-card/95 flex flex-col transition-all hover:shadow-xl ${className}`}
            variants={cardVariants as any}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.23 }}
        >
            {/* Image with subtle overlay */}
            <motion.div
                className="relative w-full h-52"
                variants={imageVariants}
            >
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Content section with detailed visual hierarchy */}
            <motion.div
                className="flex-1 flex flex-col gap-2 px-6 pt-6 pb-7"
                variants={contentVariants as any}
            >
                {/* Event Title */}
                <h3 className="text-lg md:text-xl font-extrabold text-primary mb-0.5 truncate" title={title}>
                    {title}
                </h3>
                {/* Date and Time with icons */}
                <div className="flex items-center text-muted-foreground gap-3 text-sm font-semibold mb-1.5">
                    <span className="flex items-center gap-1.5">
                        <svg width={17} height={17} className="inline" fill="none" viewBox="0 0 20 20">
                            <rect x="2.2" y="4.7" width="15.6" height="13.1" rx="2" fill="currentColor" opacity="0.11" />
                            <rect x="2.2" y="4.7" width="15.6" height="13.1" rx="2" stroke="currentColor" strokeWidth="1.1"/>
                            <rect x="4.5" y="7.5" width="11" height="7" rx="1.1" fill="none" />
                            <rect x="6.7" y="2.9" width="1.3" height="3.1" rx="0.6" fill="currentColor" />
                            <rect x="11.9" y="2.9" width="1.3" height="3.1" rx="0.6" fill="currentColor" />
                        </svg>
                        <span className="">{date}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <svg width={16} height={16} className="inline" fill="none" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="8.2" stroke="currentColor" strokeWidth="1.1" opacity="0.14" />
                            <path d="M10 5.5v4.2l3.1 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                        </svg>
                        <span>{time}</span>
                    </span>
                </div>
                {/* Venue */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <svg width={16} height={16} className="inline" fill="none" viewBox="0 0 18 18">
                        <path d="M9 16c2-2.5 6-6.83 6-9.45C15 3.4 12.31 1 9 1 5.69 1 3 3.4 3 6.55 3 9.18 7 13.48 9 16z" stroke="currentColor" strokeWidth="1.18" strokeLinejoin="round" opacity="0.22"/>
                        <circle cx="9" cy="7" r="2.1" stroke="currentColor" strokeWidth="1.05"/>
                    </svg>
                    <span className="whitespace-pre-line line-clamp-2">{venue}</span>
                </div>
                {/* Divider */}
                <div className="border-t border-muted my-2" />

                {/* Register CTA button */}
                <div className="mt-auto flex justify-end">
                    <Link href={registerUrl ?? "#"} passHref>
                        <motion.button
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                            whileHover={{ scale: 1.048 }}
                            type="button"
                        >
                            <svg width={17} height={17} viewBox="0 0 20 20" fill="none" className="inline -ml-1">
                                <rect x="3.7" y="7.4" width="12.6" height="6.6" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                                <path d="M12.7 7.5v-1.1A2.2 2.2 0 0 0 10.5 4.2h-1A2.2 2.2 0 0 0 7.3 6.4v1.1" stroke="currentColor" strokeWidth="1.1"/>
                            </svg>
                            Register
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}
