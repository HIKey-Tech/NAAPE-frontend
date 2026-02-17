import React from "react";

export interface CredibilityStat {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  description: string;
}

interface CredibilityCardsProps {
  stats?: CredibilityStat[];
  className?: string;
}

export default function CredibilityCards({ stats = [], className = "" }: CredibilityCardsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, idx) => (
        <div
          key={stat.value + "-" + idx}
          className="flex flex-col items-center text-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            {stat.value}
          </span>
          <h3 className="font-bold text-white text-base mb-3">
            {stat.label}
          </h3>
          <div className="w-8 h-0.5 bg-accent/50 rounded-full mb-4" />
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
