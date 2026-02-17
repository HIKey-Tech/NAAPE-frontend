"use client";

import Link from "next/link";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { ArrowRight, Mail } from "lucide-react";

export default function JoinCommunitySection() {
  return (
    <section className="w-full px-6 py-20">
      <div className="max-w-7xl mx-auto rounded-[3rem] bg-slate-900 overflow-hidden relative isolate">

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 px-8 py-20 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Ready to shape <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Nigeria’s Aviation Future?</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto mb-12">
            Be part of a vibrant, purpose-driven association that inspires growth,
            shares opportunities, and builds meaningful professional connections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/membership">
              <NaapButton className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-10 py-4 rounded-full text-lg shadow-xl shadow-white/10 transition-transform hover:-translate-y-1 flex items-center gap-3">
                Become a Member <ArrowRight size={20} />
              </NaapButton>
            </Link>
            <Link href="/contact">
              <NaapButton className="bg-transparent border-2 border-slate-700 hover:border-white text-white font-bold px-10 py-4 rounded-full text-lg transition-colors flex items-center gap-3">
                Contact Us
              </NaapButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
