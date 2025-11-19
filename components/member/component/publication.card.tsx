import React, { useRef, useEffect } from "react";

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

// Animation (fade-in and scale-in) CSS in JS - injected to <head> once
const ANIMATION_CLASS = "publication-card-animate";
const ANIMATION_CSS = `
.${ANIMATION_CLASS} {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
    transition:
        opacity 0.66s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.54s cubic-bezier(0.4, 0, 0.2, 1);
}
.${ANIMATION_CLASS}.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.${ANIMATION_CLASS}:hover {
    transform: translateY(-4px) scale(1.025);
    box-shadow: 0 4px 18px rgba(30,41,59,0.11), 0 1.5px 6px rgba(30,41,59,0.08);
    transition:
        opacity 0.66s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.20s cubic-bezier(.42,0,.58,1),
        box-shadow 0.21s cubic-bezier(.42,0,.58,1);
}
`;
let styleInjected = false;
function injectAnimationCSS() {
    if (typeof window !== "undefined" && !styleInjected) {
        if (!document.getElementById("pubcard-anim-style")) {
            const s = document.createElement("style");
            s.id = "pubcard-anim-style";
            s.textContent = ANIMATION_CSS;
            document.head.appendChild(s);
            styleInjected = true;
        }
    }
}

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
    const cardRef = useRef<HTMLDivElement | null>(null);

    // Fade-in on viewport (intersection observer):
    useEffect(() => {
        injectAnimationCSS();
        const card = cardRef.current;
        if (!card) return;

        // If user prefers reduced motion, show immediately
        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            card.classList.add("visible");
            return;
        }

        // Intersection Observer for fade/slide-in on enter view
        let timer: ReturnType<typeof setTimeout> | null = null;
        const observer =
            typeof window !== "undefined" && "IntersectionObserver" in window
                ? new window.IntersectionObserver(
                      (entries) => {
                          entries.forEach((entry) => {
                              if (entry.isIntersecting) {
                                  // Stagger animation based on index for a cascading effect
                                  timer = setTimeout(() => {
                                      card.classList.add("visible");
                                  }, 45 + Math.random() * 120);
                                //   observer.disconnect();
                              }
                          });
                      }
                  )
                : null;
        if (observer) observer.observe(card);
        else {
            // Fallback: show immediately
            card.classList.add("visible");
        }
        return () => {
            if (observer) observer.disconnect();
            if (timer) clearTimeout(timer);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`
                ${ANIMATION_CLASS}
                bg-white border border-[#E5EAF2]
                rounded-2xl shadow-sm
                max-w-full w-full overflow-hidden
                transition-shadow hover:shadow-md duration-150
                flex flex-col
                ${className}
            `}
            style={{ boxShadow: "0 1px 6px rgba(30,41,59,0.05)" }}
        >
            <div className={`
                w-full bg-gray-200 relative
                h-36
                sm:h-40
                md:h-44
                lg:h-48
            `}>
                <img
                    src={imageUrl}
                    alt={title}
                    className="object-cover w-full h-full transition-transform duration-400 group-hover:scale-[1.07]"
                    draggable={false}
                    loading="lazy"
                    style={{ aspectRatio: "16/9", minHeight: "100%" }}
                />
            </div>
            <div className={`
                p-3
                pt-2
                pb-3
                flex flex-col gap-2
                sm:p-4 sm:pt-3
            `}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1">
                        <div
                            className="
                                text-[16px]
                                sm:text-[18px]
                                font-semibold text-[#222F43]
                                leading-tight
                                truncate
                                max-w-full
                            "
                        >
                            {mainTitle}
                        </div>
                        {subTitle && (
                            <div className="
                                text-[16px]
                                sm:text-[18px]
                                font-semibold text-[#222F43]
                                leading-tight
                                truncate
                                max-w-full
                            ">
                                {subTitle}
                            </div>
                        )}
                    </div>
                    <span
                        className={`
                            inline-flex items-center
                            px-2 sm:px-3 py-1
                            rounded-full
                            ${statusInfo.bg} ${statusInfo.text}
                            text-[13px] sm:text-[15px]
                            font-medium whitespace-nowrap
                            mt-2 sm:mt-0 self-start sm:self-auto
                            transition-all duration-200
                        `}
                        title={statusInfo.label}
                    >
                        <span className="text-[18px] sm:text-[22px] mr-1 leading-none">●</span>
                        {statusInfo.label}
                    </span>
                </div>
                <div
                    className="
                        text-[13px] sm:text-[15px]
                        text-[#96A6BF] font-normal
                        mt-1 sm:mt-2
                        truncate
                        max-w-full
                        overflow-hidden
                        whitespace-nowrap
                    "
                >
                    by {author} &ndash; {date}
                </div>
            </div>
        </div>
    );
};

export default PublicationCard;
