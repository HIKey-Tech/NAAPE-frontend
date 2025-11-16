import React from "react";

// Centralized status config for label, color, and background
const STATUS_CONFIG: Record<
    "pending" | "ongoing" | "completed",
    { label: string; text: string; bg: string; icon: string }
> = {
    ongoing: {
        label: "Ongoing",
        text: "text-[#FFA000]",
        bg: "bg-[#FFF7E0]",
        icon: "⏳",
    },
    completed: {
        label: "Completed",
        text: "text-[#43B047]",
        bg: "bg-[#E6F5EA]",
        icon: "✔️",
    },
    pending: {
        label: "Pending",
        text: "text-[#AEBFD3]",
        bg: "bg-[#F1F2F6]",
        icon: "⏺️",
    },
};

type CertCardProps = {
    title: string;
    startDate: string;
    description: string;
    status: "ongoing" | "completed" | "pending";
    progress?: number; // percentage, for ongoing
    className?: string;
};

// Optional helper: truncate description longer than 98 chars, add ellipsis
const truncate = (text: string, max = 98) =>
    text.length > max ? text.slice(0, max) + "…" : text;

const CertCard: React.FC<CertCardProps> = ({
    title,
    startDate,
    description,
    status,
    progress,
    className = "",
}) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

    return (
        <div
            className={`rounded-2xl border border-[#E5EAF2] shadow-sm bg-white w-full max-w-full p-5 flex flex-col justify-between transition-shadow hover:shadow-md duration-200 ${className}`}
            style={{ boxShadow: "0 1px 6px rgba(30,41,59,0.06)" }}
        >
            <div>
                <div className="font-semibold text-[20px] text-[#222F43] leading-tight mb-1 line-clamp-2 break-words">
                    {title}
                </div>
                <div className="text-[15px] text-[#91A1B6] font-medium mb-3 select-none">
                    <span className="inline-block mr-1.5 align-middle">
                        <svg width="15" height="15" fill="none" viewBox="0 0 16 16"><path fill="#B7BDC8" d="M12.94 10.617A6.001 6.001 0 1 1 14 8a5.98 5.98 0 0 1-1.06 2.617zm-1.268 1.505A4.997 4.997 0 0 0 13 8c0-2.763-2.237-5-5-5S3 5.237 3 8s2.237 5 5 5c1.123 0 2.17-.368 3.002-.878l.021-.014a.016.016 0 0 1 .016 0c.096-.079.205-.162.315-.245l.318-.241zM8.75 4a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 .334.626l2.5 1.667a.75.75 0 1 0 .832-1.252l-2.166-1.444V4z"/>
                        </svg>
                    </span>
                    <span>Starts: {startDate}</span>
                </div>
                <div className="text-[15px] text-[#222F43] font-normal leading-snug mb-6 break-words line-clamp-3">
                    {truncate(description)}
                </div>
            </div>
            <div className="flex items-center">
                <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[15px] font-medium whitespace-nowrap ${cfg.text} ${cfg.bg}`}
                    style={{ minWidth: 110, letterSpacing: "0.02em" }}
                    title={cfg.label + (status === "ongoing" && progress !== undefined ? ` - ${progress}%` : "")}
                >
                    <span className="text-[19px] mr-1">{cfg.icon}</span>
                    {cfg.label}
                    {status === "ongoing" && progress !== undefined && (
                        <span className="ml-1 text-[#748095] font-semibold">{progress}%</span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default CertCard;

