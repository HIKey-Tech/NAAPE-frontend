"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CertCard from "../component/cert.card";
import { FilterHeader } from "../component/header";

// Sample data - replace with real API integration as needed
const NEWS = Array.from({ length: 100 }).map((_, i) => ({
    imageUrl: "/images/plane.jpg",
    title: "Aero Certification " + (i + 1),
    author: "Engr. Jane Smith",
    date: "Mar 22, 2024",
    status: "published",
}));

// Animation variants for card grid items
const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.08,
            duration: 0.48,
            type: "spring",
            stiffness: 70,
            damping: 18,
        }
    }),
    exit: { opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.25 } }
};

export default function TrainingsComponent() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
        from: undefined,
        to: undefined,
    });
    const [filterOpen, setFilterOpen] = useState(false);

    // For UI simplicity, don't apply real date or filter logic
    const filteredTrainings = NEWS.filter((pub) =>
        pub.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-4 sm:px-0 py-4 bg-white w-full">
            <FilterHeader
                title="Training & Certifications"
                search={search}
                setSearch={setSearch}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                dateRange={dateRange}
                setDateRange={setDateRange}
                searchPlaceholder="Search for Trainings and Cert here..."
                sortLabel="Newest"
            />
            <div className="grid gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {filteredTrainings.length === 0 ? (
                        <motion.div
                            className="col-span-full text-center text-[#96A6BF] text-[16px] py-20 font-medium"
                            key="no-trainings"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 14 }}
                            transition={{ duration: 0.33 }}
                        >
                            Nothing New
                        </motion.div>
                    ) : (
                        filteredTrainings.map((training, idx) => (
                            <motion.div
                                key={training.title + idx}
                                className="flex"
                                custom={idx}
                                variants={cardVariants as any}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <CertCard
                                    title={training.title}
                                    startDate={training.date}
                                    description={"This is a dummy description for the training or certification. Replace with real data as needed."}
                                    status={"ongoing"}
                                    progress={25}
                                />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
