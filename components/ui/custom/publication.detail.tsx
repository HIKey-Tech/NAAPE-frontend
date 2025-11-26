"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type PublicationDetailProps = {
    imageUrl: string;
    title: string;
    summary?: string;
    content: string | React.ReactNode;
    authorName: string;
    authorRole?: string;
    authorAvatarUrl?: string;
    category?: string;
    publishedDate?: string | Date;
    backHref?: string;
    className?: string;
};

// Helper: initials fallback
function getInitials(name?: string) {
    if (!name || typeof name !== "string" || !name.trim()) return "NA";
    const parts = name.trim().split(/\s+/);
    return (
        parts
            .map((s) => s[0]?.toUpperCase() || "")
            .join("")
            .slice(0, 2) || "NA"
    );
}

// Animation copied from card
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
        if (!document.getElementById("pubcard-anim-style-detail")) {
            const s = document.createElement("style");
            s.id = "pubcard-anim-style-detail";
            s.textContent = ANIMATION_CSS;
            document.head.appendChild(s);
            styleInjected = true;
        }
    }
}

export const PublicationDetail: React.FC<PublicationDetailProps> = ({
    imageUrl,
    title,
    summary,
    content,
    authorName,
    authorRole,
    authorAvatarUrl,
    category,
    publishedDate,
    backHref = "/publications",
    className = "",
}) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null);

    // Animation (fade-in on view)
    React.useEffect(() => {
        injectAnimationCSS();
        const card = cardRef.current;
        if (!card) return;
        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            card.classList.add("visible");
            return;
        }
        let timer: ReturnType<typeof setTimeout> | null = null;
        const observer =
            typeof window !== "undefined" && "IntersectionObserver" in window
                ? new window.IntersectionObserver(entries => {
                      entries.forEach(entry => {
                          if (entry.isIntersecting) {
                              timer = setTimeout(() => {
                                  card.classList.add("visible");
                              }, 50 + Math.random() * 120);
                          }
                      });
                  })
                : null;
        if (observer) observer.observe(card);
        else card.classList.add("visible");
        return () => {
            if (observer) observer.disconnect();
            if (timer) clearTimeout(timer);
        };
    }, []);

    // Date formatting
    let displayDate = "";
    if (publishedDate) {
        const d =
            typeof publishedDate === "string"
                ? new Date(publishedDate)
                : publishedDate;
        if (!isNaN(d.valueOf())) {
            displayDate = d.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
    }

    return (
        <Card
            ref={cardRef}
            className={`
                ${ANIMATION_CLASS}
                w-full max-w-3xl mx-auto bg-white border rounded-2xl shadow-md overflow-hidden
                flex flex-col
                ${className}
            `}
            style={{ boxShadow: "0 1px 10px rgba(30,41,59,0.08)" }}
        >
            {/* Header Image */}
            <div className="relative w-full h-64 md:h-80 bg-gray-200">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={typeof title === "string" ? title : ""}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width:900px) 100vw, 900px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                {/* Category */}
                {category && (
                    <div className="absolute top-4 left-4 z-10">
                        <Badge variant="outline" className="w-fit text-xs font-semibold text-[#1B0D09] bg-[#F4B05F]">
                            {category}
                        </Badge>
                    </div>
                )}
            </div>
            {/* Body */}
            <div className="flex flex-col gap-3 p-7 pt-6">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2 text-[color:oklch(0.141_0.005_285.823)]">
                    {title}
                </h1>
                {summary && (
                    <div className="text-base text-[#4B576A] mb-2">{summary}</div>
                )}

                {/* Date &/or category (optional) */}
                {(displayDate || category) && (
                    <div className="flex items-center gap-5 mb-2">
                        {displayDate && (
                            <span className="flex items-center gap-1 text-xs text-[#878A97] font-medium">
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="inline-block mr-1"
                                    aria-hidden="true"
                                    style={{ minWidth: 15, minHeight: 15 }}
                                >
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="8"
                                        stroke="#B0B4C5"
                                        strokeWidth="1.5"
                                        fill="#f7fbff"
                                    />
                                    <path
                                        d="M10 6V10L13 12"
                                        stroke="#B0B4C5"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                {displayDate}
                            </span>
                        )}
                    </div>
                )}
                {/* Author */}
                <div className="flex items-center gap-2 mb-4">
                    <Avatar className="w-11 h-11 border">
                        {authorAvatarUrl ? (
                            <AvatarImage src={authorAvatarUrl} alt={authorName} />
                        ) : (
                            <AvatarFallback>
                                {getInitials(authorName)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col justify-center ml-1">
                        <span className="text-base font-semibold text-[#343658] leading-tight">{authorName}</span>
                        {authorRole && (
                            <span className="text-xs text-[#95a0b5] font-medium">{authorRole}</span>
                        )}
                    </div>
                </div>
                {/* Body Content */}
                <section className="prose md:prose-lg max-w-none text-[#322B23]">
                    {typeof content === "string" ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        content
                    )}
                </section>
            </div>
            {/* Footer / Back */}
            <footer className="px-7 pt-0 pb-6 flex items-center justify-between">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-1 text-[#2852B4] text-sm font-semibold hover:underline hover:text-[#1B3F90] transition-colors duration-200 group/link"
                    tabIndex={0}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block mr-1 h-4 w-4 group-hover/link:-translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 16 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                        style={{ color: "#2852B4" }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 12l-4-4 4-4"
                        />
                    </svg>
                    Back to Publications
                </Link>
            </footer>
        </Card>
    );
};

export default PublicationDetail;
