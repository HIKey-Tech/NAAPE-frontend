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
                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-[3px] bg-[#ffd59e]/80 text-xs font-semibold rounded shadow text-[color:oklch(0.32_0.13_266.81)] border-none">
                            {category}
                        </span>
                    </div>
                )}
            </div>
            {/* Body */}
            <div className="flex flex-col gap-2 p-7 pt-6">
                <h1 className="text-2xl md:text-3xl font-semibold leading-tight mb-2 text-[color:oklch(0.141_0.005_285.823)]">
                    {title}
                </h1>
                {(displayDate || displayTime) && (
                    <div className="flex items-center gap-2 mb-3 mt-1">
                        <span
                            className="flex items-center bg-[#eaf2fa] px-2 py-[2px] rounded-md text-primary font-medium text-xs"
                            title={displayDate + (displayTime ? ` at ${displayTime}` : "")}
                            style={{
                                color: "oklch(0.32 0.13 266.81)",
                            }}
                        >
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
                            <time dateTime={isoDate}>{displayDate}{displayTime && (<><span className="mx-1 text-[#b0bcd5]">•</span> {displayTime}</>)}</time>
                        </span>
                    </div>
                )}

                {/* Author */}
                {author && (
                    <div className="flex items-center gap-2 mb-4 mt-1">
                        <div
                            className="w-11 h-11 rounded-full border-[2px] shadow-inner flex items-center justify-center bg-white"
                            style={{ borderColor: "oklch(0.32 0.13 266.81)" }}
                        >
                            {author.avatarUrl ? (
                                <Image
                                    src={author.avatarUrl}
                                    alt={author.name}
                                    width={44}
                                    height={44}
                                    className="object-cover rounded-full w-full h-full"
                                />
                            ) : (
                                <span className="bg-[#D2ECF7] text-primary flex items-center justify-center w-full h-full text-base font-bold rounded-full" style={{ color: "oklch(0.32 0.13 266.81)" }}>
                                    {getInitials(author.name)}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col justify-center ml-1">
                            <span className="text-base font-semibold text-[color:oklch(0.141_0.005_285.823)] leading-tight">{author.name}</span>
                            {author.role && (
                                <span className="text-xs text-[#95a0b5] font-medium leading-none">{author.role}</span>
                            )}
                        </div>
                    </div>
                )}
                {/* Content Body */}
                <section className="prose md:prose-lg max-w-none text-[#33394a]">
                    {typeof content === "string" ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        content
                    )}
                </section>
            </div>
            {/* Footer / Back */}
            <footer className="px-7 pt-0 pb-5 flex items-center justify-between">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline hover:text-[color:oklch(0.32_0.13_266.81)] transition-colors duration-200 group/link"
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
