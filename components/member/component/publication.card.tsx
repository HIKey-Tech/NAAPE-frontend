import React from "react";

// Centralized status style config with semantic color keys
const STATUS_STYLES: Record<
    "pending" | "published" | "rejected",
    { label: string; bg: string; text: string }
> = {
    pending: {
        label: "Pending",
        bg: "bg-[#FFF2CA]",
        text: "text-[#E2A900]",
    },
    published: {
        label: "Published",
        bg: "bg-[#DAFBE8]",
        text: "text-[#27AE60]",
    },
    rejected: {
        label: "Rejected",
        bg: "bg-[#FFDADA]",
        text: "text-[#D33A2C]",
    },
};

type PublicationStatus = keyof typeof STATUS_STYLES;

type PublicationCardProps = {
    imageUrl: string;
    title: string;
    author: string;
    date: string;
    status: PublicationStatus;
    className?: string;
};

// Helper: Intelligently splits a long title for improved 2-line layout
const splitTitle = (title: string, maxLineLength = 28): [string, string] => {
    if (title.length <= maxLineLength) return [title, ""];
    const spaceIdx =
        title.lastIndexOf(" ", maxLineLength) !== -1
            ? title.lastIndexOf(" ", maxLineLength)
            : maxLineLength;
    return [title.slice(0, spaceIdx), title.slice(spaceIdx).trim()];
};

const PublicationCard: React.FC<PublicationCardProps> = ({
    imageUrl,
    title,
    author,
    date,
    status,
    className = "",
}) => {
    const statusInfo = STATUS_STYLES[status] ?? STATUS_STYLES["pending"];
    const [mainTitle, subTitle] = splitTitle(title);

    return (
        <div
            className={`bg-white border border-[#E5EAF2] rounded-2xl shadow-sm max-w-full w-full overflow-hidden transition-shadow hover:shadow-md duration-150 ${className}`}
            style={{ boxShadow: "0 1px 6px rgba(30,41,59,0.05)" }}
        >
            <div className="h-40 w-full bg-gray-200 relative">
                <img
                    src={imageUrl}
                    alt={title}
                    className="object-cover w-full h-full"
                    draggable={false}
                    loading="lazy"
                />
            </div>
            <div className="p-4 pt-3 pb-3 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-[18px] font-semibold text-[#222F43] leading-tight truncate">
                            {mainTitle}
                        </div>
                        {subTitle && (
                            <div className="text-[18px] font-semibold text-[#222F43] leading-tight truncate">
                                {subTitle}
                            </div>
                        )}
                    </div>
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text} text-[15px] font-medium whitespace-nowrap`}
                        title={statusInfo.label}
                    >
                        <span className="text-[22px] mr-1 leading-none">●</span>
                        {statusInfo.label}
                    </span>
                </div>
                <div className="text-[15px] text-[#96A6BF] font-normal mt-2 ellipsis overflow-hidden whitespace-nowrap">
                    by {author} &ndash; {date}
                </div>
            </div>
        </div>
    );
};

export default PublicationCard;
