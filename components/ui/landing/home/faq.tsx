"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What are the eligibility requirements?",
    answer: "Membership is open to licensed aviation professionals (pilots, engineers, flight dispatchers, etc.) and students pursuing aviation careers, subject to approval and compliance with NAAPE’s membership criteria.",
  },
  {
    question: "How do I apply for membership?",
    answer: "You can apply online through our membership portal, or download the application form and submit it along with the required documentation. Applications are reviewed by our membership committee.",
  },
  {
    question: "What are the annual membership fees?",
    answer: "Annual membership fees vary by membership category (professional, associate, student). Current rates and payment instructions are available on our membership page.",
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes, NAAPE prioritizes your privacy. Personal data is securely stored and used only for official association purposes. We do not share your information with third parties without your consent.",
  },
  {
    question: "How can we get in touch?",
    answer: "For any inquiries, please visit our Contact page for phone numbers, email addresses, and our online contact form. We’re here to help!",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full max-w-4xl mx-auto py-24 px-6">
      <div className="text-center mb-16">
        <span className="text-sm font-bold text-accent tracking-widest uppercase mb-2 block">
          Support
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Find quick answers to common questions about NAAPE membership, benefits, and activities.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`border rounded-2xl transition-all duration-300 ${isOpen ? "bg-white border-primary/20 shadow-lg shadow-primary/5" : "bg-white border-slate-200 hover:border-slate-300"}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className={`text-lg font-bold transition-colors ${isOpen ? "text-primary" : "text-slate-800"}`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-full transition-colors ${isOpen ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                  {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  );
}
