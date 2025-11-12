"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqCardProps {
  faqs: FaqItem[];
  className?: string;
}

export const FaqCard: React.FC<FaqCardProps> = ({ faqs, className = "" }) => {
  // Let each item be collapsible independently.
  // Use type="multiple" for independent expand/collapse.
  return (
    <Accordion
      type="multiple"
      className={`w-full flex flex-col ${className}`}
      defaultValue={[]}
    >
      {faqs.map((faq, idx) => (
        <AccordionItem
          key={idx}
          value={String(idx)}
          className="border-b border-black/20"
        >
          <AccordionTrigger className="py-3 px-2 text-left flex items-center justify-between">
            <span className="font-semibold text-sm md:text-base text-[#232835]">
              {faq.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-4 text-sm text-[#222844]">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
