"use client";

import { FaqCard, FaqItem } from "@/components/ui/custom/faq.card";
import { motion } from "framer-motion";

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

export default function FAQSection() {
    return (
        <motion.section
            className="w-full max-w-full mx-auto py-16 px-4 flex flex-col items-center"
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
                className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-5 text-center"
                variants={itemFade}
                custom={1}
            >
                Find quick answers to common questions about NAAPE
                <br className="hidden md:inline" /> membership, benefits, and activities.
            </motion.h2>
            <motion.div
                className="w-full"
                variants={itemFade}
                custom={2}
            >
                <FaqCard faqs={faqs} className="mt-2 bg-white rounded shadow max-w-full gap-4 p-10 justify-center w-full" />
            </motion.div>
        </motion.section>
    );
}
