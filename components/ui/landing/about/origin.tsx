"use client"

import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.19,
            delayChildren: 0.09,
        },
    },
};

const textBlockVariants = {
    hidden: { opacity: 0, x: -36 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 70,
            damping: 18,
            duration: 0.53,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 26 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 60,
            damping: 17,
            duration: 0.5,
        },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.96, x: 34 },
    show: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 65,
            damping: 16,
            duration: 0.52,
        },
    },
};

export default function OriginSection() {
    return (
        <motion.section
            className="flex flex-col md:flex-row items-start md:items-center gap-12 w-full py-16 px-4 md:px-16 bg-white"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.34 }}
        >
            {/* Image Content */}
            <motion.div
                className="flex-1 flex justify-center items-center max-w-xl md:max-w-full mb-8 md:mb-0"
                variants={imageVariants as any}
            >
                <motion.div
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 32px 0 rgba(36,80,180,0.13)" }}
                    transition={{ type: "spring", stiffness: 210, damping: 18 }}
                >
                    <Image
                        src="/images/plane.jpg"
                        alt="NAAPE Origin"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl transition-transform duration-300 hover:scale-105"
                        priority
                    />
                </motion.div>
            </motion.div>
            {/* Text Content */}
            <motion.div
                className="flex-1 max-w-2xl"
                variants={textBlockVariants as any}
            >
                <motion.h2
                    className="text-3xl md:text-4xl font-extrabold text-neutral-800 mb-5 leading-tight"
                    variants={fadeUpVariants as any}
                >
                    Our Origins <span className="font-normal">(1984–1985)</span>
                </motion.h2>
                <motion.div
                    className="text-neutral-700 text-base md:text-lg leading-relaxed space-y-4"
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.11 }}
                >
                    <p>
                        Subsequently, NAAPE successfully held its maiden delegates Conference on 17th to 18th May, 1984 at the Nigeria Airways Sports Club, C.I.A., Ikeja, Lagos (now demolished). The Conference elected the first National Executive Council (NEC) – now National Administrative Council (NAC) – with Capt. Ade Olubadewo, who worked with Aero Contractors, as the first National President of NAAPE.
                    </p>
                    <p>
                        The NEC then appointed Comrade Michael Ekujumi as the first General Secretary (then called Professional Secretary) in June, 1984. Thereafter, the NEC set the machinery in motion for the registration of the Association as a trade union which was accomplished in August, 1985.
                    </p>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
