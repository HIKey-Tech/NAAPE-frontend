"use client";

import { useState } from "react";
import { FaqItem } from "@/components/ui/custom/faq.card";
import { motion, AnimatePresence } from "framer-motion";
import { MdExpandMore } from "react-icons/md";

const faqs: FaqItem[] = [
    {
        question: "What are the eligibility requirements?",
        answer:
            "Membership is open to licensed aviation professionals (pilots, engineers, flight dispatchers, etc.) and students pursuing aviation careers, subject to approval and compliance with NAAPE’s membership criteria.",
    },
    {
        question: "How do I apply for membership?",
        answer:
            "You can apply online through our membership portal, or download the application form and submit it along with the required documentation. Applications are reviewed by our membership committee.",
    },
    {
        question: "What are the annual membership fees?",
        answer:
            "Annual membership fees vary by membership category (professional, associate, student). Current rates and payment instructions are available on our membership page.",
    },
    {
        question: "Is my personal information safe?",
        answer:
            "Yes, NAAPE prioritizes your privacy. Personal data is securely stored and used only for official association purposes. We do not share your information with third parties without your consent.",
    },
    {
        question: "How can we get in touch?",
        answer:
            "For any inquiries, please visit our Contact page for phone numbers, email addresses, and our online contact form. We’re here to help!",
    },
];

const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const itemFade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 + i * 0.18, duration: 0.5 }
    })
};

const answerVariants = {
  collapsed: { height: 0, opacity: 0, marginTop: 0 },
  open: { height: "auto", opacity: 1, marginTop: 16 }
};

function FAQItem({
    faq,
    isOpen,
    onClick,
    index
}: {
    faq: FaqItem;
    isOpen: boolean;
    onClick: () => void;
    index: number;
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            variants={itemFade}
            custom={index + 2}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white border shadow-md rounded-lg overflow-hidden mb-3 transition"
        >
            <button
                className={`w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none transition-colors group`}
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className="font-medium text-[#232835] text-base md:text-lg group-hover:text-[#CA9414] transition">{faq.question}</span>
                < MdExpandMore

                    className={`h-6 w-6 text-[#CA9414] ml-3 min-w-6 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="answer"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={answerVariants}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-6 pb-6 pr-1 text-[#475569] text-[15px] leading-relaxed"
                    >
                        {faq.answer}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <motion.section
            className="w-full max-w-2xl mx-auto py-20 px-4 flex flex-col items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.45 }}
            variants={sectionVariants as any}
        >
            <motion.span
                className="text-xs md:text-sm text-[#CA9414] font-semibold tracking-widest uppercase mb-2 text-center"
                variants={itemFade}
                custom={0}
            >
                FREQUENTLY ASKED QUESTIONS
            </motion.span>
            <motion.h2
                className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-8 text-center"
                variants={itemFade}
                custom={1}
            >
                Find quick answers to common questions about NAAPE
                <br className="hidden md:inline" /> membership, benefits, and activities.
            </motion.h2>
            <div className="w-full">
                {faqs.map((faq, idx) => (
                    <FAQItem
                        key={faq.question}
                        faq={faq}
                        isOpen={openIndex === idx}
                        onClick={() =>
                            setOpenIndex(openIndex === idx ? null : idx)
                        }
                        index={idx}
                    />
                ))}
            </div>
        </motion.section>
    );
}
