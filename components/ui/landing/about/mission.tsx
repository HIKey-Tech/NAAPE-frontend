"use client"
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 60, damping: 14 }
    },
};

export default function MissionSection() {
    return (
        <motion.section
            className="bg-[#2852B4] w-full py-16 px-4 md:px-0 flex flex-col items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
        >
            <motion.h2
                className="text-white text-2xl md:text-3xl font-semibold mb-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
            >
                Our Mission & Vision
            </motion.h2>
            <motion.div
                className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-stretch"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {/* Mission */}
                <motion.div
                    className="bg-white rounded-md shadow-lg px-6 py-8 flex-1 min-w-[300px] flex flex-col items-center text-center border border-gray-100"
                    variants={cardVariants as any}
                >
                    <h3 className="font-medium text-neutral-800 text-lg mb-3">Mission</h3>
                    <p className="text-neutral-700 text-sm md:text-base">
                        To promote excellence, protect members' rights, and uphold the highest standards of aviation safety and ethics through advocacy, collaboration, and continuous professional development.
                    </p>
                </motion.div>
                {/* Vision */}
                <motion.div
                    className="bg-white rounded-md shadow-lg px-6 py-8 flex-1 min-w-[300px] flex flex-col items-center text-center border border-gray-100"
                    variants={cardVariants as any}
                >
                    <h3 className="font-medium text-neutral-800 text-lg mb-3">Vision</h3>
                    <p className="text-neutral-700 text-sm md:text-base">
                        To be the leading voice and unifying force for aircraft pilots and engineers in Nigeria, championing safety, professionalism, and integrity across the aviation industry.
                    </p>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
