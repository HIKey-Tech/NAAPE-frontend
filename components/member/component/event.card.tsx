import React from "react";

// Helper: truncate long event titles for better card layout
const truncate = (text: string, max = 40) =>
    text.length > max ? text.slice(0, max - 1) + "…" : text;

type EventCardProps = {
    title: string;
    date: string;
    location: string;
    imageUrl: string;
    onRegister?: () => void;
    className?: string;
    registerLabel?: string;
    disabled?: boolean;
};

const EventCard: React.FC<EventCardProps> = ({
    title,
    date,
    location,
    imageUrl,
    onRegister,
    className = "",
    registerLabel = "Register",
    disabled = false,
}) => {
    return (
        <div
            className={`bg-white border border-[#E5EAF2] rounded-2xl shadow-sm overflow-hidden flex flex-col items-stretch min-h-[246px] transition-shadow hover:shadow-md duration-200 ${className}`}
            style={{ boxShadow: "0 1px 8px rgba(34,47,67,0.08)" }}
        >
            {/* Banner/Event Image */}
            <div className="relative w-full h-28 bg-[#F3F6FA] flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt={title}
                    className="object-cover w-full h-full mx-auto my-3  transition-transform group-hover:scale-105"
                    draggable={false}
                    loading="lazy"
                />
            </div>
            {/* Event Content */}
            <div className="flex flex-col flex-1 px-5 py-4">
                <div className="text-[18px] font-semibold text-[#222F43] leading-tight mb-1 line-clamp-2 break-words">
                    {truncate(title)}
                </div>
                <div className="flex items-center text-[15px] text-[#748095] font-medium gap-2 mb-1">
                    <span className="inline-block align-middle">
                        <svg width="15" height="15" fill="none" viewBox="0 0 16 16"><path fill="#B7BDC8" d="M12.94 10.617A6.001 6.001 0 1 1 14 8a5.98 5.98 0 0 1-1.06 2.617zm-1.268 1.505A4.997 4.997 0 0 0 13 8c0-2.763-2.237-5-5-5S3 5.237 3 8s2.237 5 5 5c1.123 0 2.17-.368 3.002-.878l.021-.014a.016.016 0 0 1 .016 0c.096-.079.205-.162.315-.245l.318-.241zM8.75 4a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 .334.626l2.5 1.667a.75.75 0 1 0 .832-1.252l-2.166-1.444V4z" /></svg>
                    </span>
                    <span>{date}</span>
                </div>
                <div className="text-[15px] text-[#96A6BF] font-normal line-clamp-2 leading-tight mb-4">
                    <span className="inline-block align-middle mr-1">
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#B7BDC8" d="M8 2a4 4 0 0 0-4 4c0 2.157 2.267 5.184 3.284 6.41A1 1 0 0 0 8 13a1 1 0 0 0 .715-.59C9.733 11.185 12 8.158 12 6a4 4 0 0 0-4-4zm0 8.67C5.954 8.09 4 5.69 4 6a4 4 0 1 1 8 0c0 .31-1.954 2.09-4 4.67zm0-6.336a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0 4.332a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" /></svg>
                    </span>
                    {location}
                </div>
                {/* Register Button */}
                <button
                    type="button"
                    onClick={onRegister}
                    disabled={disabled}
                    className={`mt-auto px-5 py-1.5 border border-[#D5E3F7] rounded-md text-[#4267E7] font-medium text-[15px] transition-colors hover:bg-[#F2F7FF] focus:outline-none focus:ring-2 focus:ring-[#B2D7EF] active:bg-[#E7F1FF] ${disabled ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                    aria-label={`Register for ${title}`}
                >
                    {registerLabel}
                </button>
            </div>
        </div>
    );
};

export default EventCard;

