import React from "react";

export interface CredibilityStat {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  description: string;
}

interface CredibilityCardsProps {
  stats?: CredibilityStat[]; // Make stats optional to handle undefined
  className?: string;
}

export default function CredibilityCards({ stats = [], className = "" }: CredibilityCardsProps) {
  return (
    <div
      className={`
        grid 
        grid-cols-1 
        xs:grid-cols-2
        sm:grid-cols-2
        md:grid-cols-4 
        gap-5 
        sm:gap-6 
        md:gap-8 
        ${className}
      `}
    >
      {stats.map((stat, idx) => (
        <div
          key={stat.value + "-" + idx}
          className="
            flex flex-col 
            bg-[#fcf7ee]/90 
            border border-[#dfcba7] 
            rounded-lg 
            px-4 py-5
            sm:px-5 sm:py-7 
            md:py-10 
            items-center 
            text-center
            transition-shadow duration-150 hover:shadow-lg
            w-full
            min-w-0
          "
        >
          <span className="mb-3 text-[2rem] sm:text-[2.3rem]">{stat.icon}</span>
          <span className="text-[2rem] sm:text-[2.3rem] font-extrabold font-mono text-[#5c4725] mb-1 tracking-wide leading-none drop-shadow-none">
            {stat.value}
          </span>
          <div className="font-semibold text-[#6e572b] text-[1.04rem] sm:text-[1.17rem] leading-tight mb-0">
            {stat.label}
          </div>
          <hr className="w-8 sm:w-10 border-t-[1.5px] border-[#aea078] my-3 rounded-lg opacity-65" />
          <div className="text-[#5f533a] text-[0.92rem] sm:text-[0.98rem] font-medium leading-snug opacity-90">
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  );
}
