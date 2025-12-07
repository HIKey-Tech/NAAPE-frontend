"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface NewsDetailsProps {
    imageUrl: string;
    title: string;
    content: string | React.ReactNode;
    date?: string | Date;
    author?: {
        name: string;
        avatarUrl?: string;
        role?: string;
    };
    category?: string;
    backHref?: string;
    className?: string;
}

/**
 * NewsDetails component renders details of a news article:
 * - News image with category badge
 * - Title, date, author
 * - Body/content
 * - Back button
 */
const NewsDetails: React.FC<NewsDetailsProps> = ({
    imageUrl,
    title,
    content,
    date,
    author,
    category,
    backHref = "/news",
    className = "",
}) => {
    // Format date for display
    let displayDate = "";
    let isoDate = "";
    let displayTime = "";
    if (date) {
        const d = typeof date === "string" ? new Date(date) : date;
        if (!isNaN(d.valueOf())) {
            displayDate = d.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            displayTime = d.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }).toLowerCase();
            isoDate = d.toISOString();
        }
    }

    // Get initials for author avatar fallback
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

    return (
        <article
            className={`bg-[#F8FAFC] ring-1 ring-[#eaeaea] max-w-3xl mx-auto rounded-2xl shadow-md overflow-hidden ${className}`}
        >
            {/* Header image section */}
            <div className="relative w-full aspect-[2.2/1] min-h-[200px] max-h-[380px] overflow-hidden group">
                <Image
                    src={imageUrl}
                    alt={typeof title === "string" ? title : ""}
                    fill
                    priority
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 900px) 100vw, 900px"
                />
                {/* Gradient overlay and category */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418b9] via-transparent to-transparent pointer-events-none" />
                {category && (
                    <div className="absolute bottom-5 right-6 z-20">
                        <span className="px-4 py-[6px] md:text-base text-sm font-semibold rounded-full shadow bg-[#ffd59e]/90 text-[color:oklch(0.32_0.13_266.81)] border-none uppercase tracking-wider drop-shadow backdrop-blur-[2px]">
                            {category}
                        </span>
                    </div>
                )}
            </div>
            {/* Body */}
            <div className="flex flex-col gap-0 p-7 pt-7 md:pt-8">
                <h1 className="text-[1.95rem] md:text-[2.7rem] font-extrabold leading-tight mb-2.5 text-[color:oklch(0.141_0.005_285.823)] tracking-tight drop-shadow-sm [text-shadow:rgba(215,_187,_115,_0.07)_0px_1.5px_0px]">
                    {title}
                </h1>
                <div className="flex items-center gap-5 mb-3 mt-1">
                    {/* Author */}
                    {author && (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 shadow-inner flex items-center justify-center bg-white"
                                style={{ borderColor: "oklch(0.32 0.13 266.81)" }}
                            >
                                {author.avatarUrl ? (
                                    <Image
                                        src={author.avatarUrl}
                                        alt={author.name}
                                        width={48}
                                        height={48}
                                        className="object-cover rounded-full w-full h-full"
                                    />
                                ) : (
                                    <span className="bg-[#D2ECF7] text-primary flex items-center justify-center w-full h-full text-xl font-bold rounded-full" style={{ color: "oklch(0.32 0.13 266.81)" }}>
                                        {getInitials(author.name)}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col justify-center ml-1">
                                <span className="text-base md:text-lg font-bold text-[color:oklch(0.141_0.005_285.823)] leading-tight">
                                    {author.name}
                                </span>
                                {author.role && (
                                    <span className="text-xs md:text-sm text-[#95a0b5] font-medium leading-none uppercase tracking-wide">
                                        {author.role}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Date & Time */}
                    {(displayDate || displayTime) && (
                        <span
                            className="flex items-center bg-[#f5f7fb] px-3 py-[3px] md:py-[6px] rounded-md text-primary font-medium text-xs md:text-sm ml-auto"
                            title={displayDate + (displayTime ? ` at ${displayTime}` : "")}
                            style={{
                                color: "oklch(0.32 0.13 266.81)",
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="inline-block mr-1.5"
                                aria-hidden="true"
                                style={{ minWidth: 16, minHeight: 16 }}
                            >
                                <circle
                                    cx="10"
                                    cy="10"
                                    r="8"
                                    stroke="oklch(0.32 0.13 266.81)"
                                    strokeWidth="1.5"
                                    fill="#f7fbff"
                                />
                                <path
                                    d="M10 6V10L13 12"
                                    stroke="oklch(0.32 0.13 266.81)"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <time dateTime={isoDate}>
                                {displayDate}
                                {displayTime && (
                                    <>
                                        <span className="mx-1 text-[#b0bcd5] font-bold">•</span>
                                        {displayTime}
                                    </>
                                )}
                            </time>
                        </span>
                    )}
                </div>
                {/* Divider */}
                <div className="my-6 mb-7 w-full border-t border-dashed border-neutral-300/70" />
                {/* Content Body */}
                <section className="prose md:prose-lg max-w-none text-[#252a36] leading-relaxed prose-headings:font-semibold prose-h2:text-[1.3rem] prose-h2:mt-7 prose-h2:mb-2 prose-img:rounded-lg prose-img:shadow prose-p:my-3 prose-a:text-primary prose-a:underline underline-offset-2 selection:bg-yellow-100/50">
                    {typeof content === "string" ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        content
                    )}
                </section>
            </div>
            {/* Footer / Back */}
            <footer className="px-7 pt-0 pb-6 flex items-center justify-between border-t border-neutral-200 mt-0">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-1.5 text-primary text-base font-semibold hover:underline hover:text-[color:oklch(0.32_0.13_266.81)] transition-colors duration-200 group/link"
                    tabIndex={0}
                    style={{
                        color: "oklch(0.32 0.13 266.81)",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block mr-1 h-4 w-4 group-hover/link:-translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 16 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                        style={{
                            color: "oklch(0.32 0.13 266.81)",
                        }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 12l-4-4 4-4"
                        />
                    </svg>
                    Back to News
                </Link>
            </footer>
        </article>
    );
};

export default NewsDetails;
