"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function OrgansOfAssociationComponent() {
  const organs = [
    { name: "The National Delegates Conference", note: "(hereinafter referred to as the Conference)" },
    { name: "The National Executive Council", note: "(hereinafter referred to as the NEC)" },
    { name: "The National Administrative Council", note: "(hereinafter referred to as the NAC)" },
    { name: "The State Council", note: "" },
    { name: "The Women Commission", note: "" },
    { name: "The Branch Executive Council", note: "" },
  ];

  return (
    <section className="py-24 pt-32 md:pt-40 px-6 md:px-12 bg-white w-full min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Our Structure</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            Organs of <span className="text-primary">Association</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            The principal organs that drive the Association's mission. The organs of the Association are:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 text-left"
          >
            {organs.map((organ, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-white shadow-sm flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    {organ.name}
                  </h4>
                  {organ.note && <p className="text-slate-500 text-sm mt-1">{organ.note}</p>}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 flex items-center justify-center p-12 bg-slate-50 border border-slate-100"
          >
            <div className="relative w-full h-full max-w-md max-h-md">
              <Image
                src="/logo.png"
                alt="NAAPE Logo"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
