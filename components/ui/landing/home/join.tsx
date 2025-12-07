"use client";

import Link from "next/link";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { FaUsers, FaPaperPlane } from "react-icons/fa";

export default function JoinCommunitySection() {
  return (
    <section className="w-full max-w-full mx-auto py-20 px-4 flex flex-col items-center 
      bg-gradient-to-br from-primary/5 to-accent/0 border border-black/10 my-12">

      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="bg-primary/80 rounded-full p-4 mb-2">
          <FaUsers className="text-white text-3xl md:text-4xl" />
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-[#232835] text-center">
          Ready to shape Nigeria’s aviation future?
        </h2>
        <p className="text-[#596077] text-base md:text-lg text-center max-w-2xl mt-2 font-medium">
          Be part of a vibrant, purpose-driven association that inspires growth, shares opportunities,
          and builds meaningful professional connections across the nation’s dynamic aviation sector.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center items-stretch sm:items-center">
        <NaapButton
          className="bg-[color:var(--primary)] pointer-cursor hover:bg-[color:var(--primary)]/90 text-white font-semibold px-8 py-3.5 text-[1.08rem] w-full sm:w-auto rounded-full transition flex items-center gap-2 justify-center shadow-sm"
        >
          <Link href="/membership" className="flex items-center gap-2 w-full h-full justify-center">
            <FaUsers className="text-[1.2em] md:text-base" />
            <span>Become a Member</span>
          </Link>
        </NaapButton>
        <NaapButton
          variant="ghost"
          className="flex items-center gap-2 px-8 py-3.5 text-[1.08rem] w-full sm:w-auto font-semibold sm:min-w-[210px] justify-center border-2 border-primary text-primary bg-white hover:bg-primary/10 transition-all rounded-full focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
        >
          <Link href="/contact" className="flex items-center gap-2 w-full h-full justify-center">
            <FaPaperPlane className="text-[1.2em] md:text-base" />
            <span>Contact Us</span>
          </Link>
        </NaapButton>
      </div>
    </section>
  );
}
