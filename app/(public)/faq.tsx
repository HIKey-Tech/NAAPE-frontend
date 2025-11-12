"use client";

import { FaqCard, FaqItem } from "@/components/ui/custom/faq.card";

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

export default function FAQSection() {
    return (
        <section className="w-full max-w-full mx-auto py-16 px-4 flex flex-col items-center">
            <span className="text-xs md:text-sm text-[#CA9414] font-semibold tracking-widest uppercase mb-2 text-center">
                FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-5 text-center">
                Find quick answers to common questions about NAAPE<br className="hidden md:inline" /> membership, benefits, and activities.
            </h2>
            <FaqCard faqs={faqs} className="mt-2 bg-white rounded shadow max-w-full w-full" />
        </section>
    );
}
