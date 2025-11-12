"use client";


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
      className={`bg-white rounded shadow-md p-6 flex flex-col items-center text-center min-w-[270px] max-w-[420px] mx-auto ${className}`}
    >
      {/* Testimonial Text */}
      <p className="text-[#222844] text-sm md:text-base mb-6 leading-snug">
        {testimonial}
      </p>

      {/* Optional Avatar */}
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mx-auto mb-3"
        />
      )}

      {/* Name */}
      <span className="block font-semibold text-[#222844] text-base md:text-lg mt-auto">
        {name}
      </span>

      {/* Title/Role */}
      <span className="block text-xs text-[#8288A3] mt-0.5">{title}</span>
    </div>
  );
}
