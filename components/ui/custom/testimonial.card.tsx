"use client";

import { FaQuoteLeft } from "react-icons/fa";

export interface TestimonialCardProps {
  testimonial: string;
  name: string;
  title: string;
  avatarUrl?: string; // Optional: for future use if avatars are added
  className?: string;
}

export function TestimonialCard({
  testimonial,
  name,
  title,
  avatarUrl,
  className = "",
}: TestimonialCardProps) {
  return (
    <div
      className={`relative bg-gradient-to-b from-white via-[#F5F7FB] to-white rounded-2xl shadow-xl border border-black/5 px-8 py-8 flex flex-col items-center text-center min-w-[270px] max-w-[420px] mx-auto transition-all duration-200 hover:shadow-2xl ${className}`}
    >
      {/* Quotation Icon */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary rounded-full p-3 shadow-md">
        <FaQuoteLeft className="text-white text-lg md:text-2xl" />
      </div>

      {/* Testimonial Text */}
      <p className="mt-5 italic font-medium text-primary/90 text-base md:text-lg leading-relaxed mb-8">
        &ldquo;{testimonial}&rdquo;
      </p>

      {/* Divider */}
      <hr className="w-16 border-[#CA9414]/30 my-2" />

      {/* Avatar, Name, Title */}
      <div className="flex flex-col items-center mt-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-14 h-14 rounded-full object-cover border-4 border-primary/30 shadow mb-2"
          />
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary/40 text-white font-bold text-xl mb-2 select-none shadow-sm">
            {name
              .split(" ")
              .map(word => word[0] || "")
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}

        {/* Name */}
        <span className="block font-bold text-[#222844] text-base md:text-lg mt-1">
          {name}
        </span>

        {/* Title/Role */}
        <span className="block text-xs md:text-sm font-medium text-[#968BA1] mt-0.5 tracking-wide">
          {title}
        </span>
      </div>
    </div>
  );
}
