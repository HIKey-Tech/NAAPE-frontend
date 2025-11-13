"use client";

import Link from "next/link";
import { NaapButton } from "@/components/ui/custom/button.naap";

export default function JoinCommunitySection() {
  return (
    <section className="w-full max-w-full mx-auto py-16 px-4 flex flex-col items-center">
      <h2 className="text-lg md:text-2xl font-bold text-[#232835] text-center mb-7">
        Join the community shaping Nigeria’s aviation industry.
      </h2>
      <div className="flex flex-row gap-3">
        <NaapButton >
          <Link href="/membership">Become a member</Link>
        </NaapButton>
        <NaapButton  >
          <Link href="/contact">Contact Us</Link>
        </NaapButton>
      </div>
    </section>
  );
}
