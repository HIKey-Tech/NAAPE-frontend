"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FiHelpCircle } from "react-icons/fi";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqCardProps {
  faqs: FaqItem[];
  className?: string;
}

export const FaqCard: React.FC<FaqCardProps> = ({ faqs, className = "" }) => {
  return (
    <section
      className={`w-full max-w-2xl mx-auto bg-gradient-to-br from-card/95 to-background/80 rounded-2xl shadow-lg border border-black/10 transition-all p-2 md:p-5 ${className}`}
      aria-label="Frequently Asked Questions"
    >
      <div className="flex items-center gap-2 mb-4">
        <FiHelpCircle className="text-primary text-2xl md:text-3xl" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#232835] tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>
      <p className="text-[#5B6170] text-sm md:text-base mb-6">
        Find answers to the most common questions below. Looking for something specific? <span className="font-medium text-primary">Contact our support</span> if you need more help.
      </p>
      <Accordion
        type="multiple"
        className="w-full flex flex-col gap-2"
        defaultValue={[]}
      >
        {faqs.map((faq, idx) => (
          <AccordionItem
            key={idx}
            value={String(idx)}
            className="border border-black/10 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
          >
            <AccordionTrigger className="py-4 px-4 flex items-center gap-2 text-left justify-between group-hover:bg-background/50 group-focus:bg-background/60 group-active:bg-background/70 transition">
              <span className="font-bold text-base md:text-lg text-[#232835] flex-1">
                Q{idx + 1}. {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-3 bg-background border-t border-black/10 text-[15px] text-[#162032] leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="block mt-[0.2em] text-primary font-bold">A:</span>
                <div>{faq.answer}</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
