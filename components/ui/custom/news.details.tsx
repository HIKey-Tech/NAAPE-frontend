"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import NewsComments from "./news.comments";

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
    newsId?: string;
    showComments?: boolean;
}

/**
 * NewsDetails component renders details of a news article:
 * - News image with category badge
 * - Title, date, author
 * - Body/content
 * - Comments section (if newsId provided)
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
    newsId,
    showComments = true,
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
            className={`bg-white border border-slate-100 max-w-3xl mx-auto rounded-2xl shadow-sm overflow-hidden ${className}`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />
                {category && (
                    <div className="absolute bottom-5 right-6 z-20">
                        <span className="px-4 py-1.5 md:text-base text-sm font-bold rounded-full shadow bg-amber-100/90 text-amber-800 border border-amber-200/50 uppercase tracking-wider backdrop-blur-sm">
                            {category}
                        </span>
                    </div>
                )}
            </div>
            {/* Body */}
            <div className="flex flex-col gap-0 p-7 pt-7 md:pt-8">
                <h1 className="text-[1.95rem] md:text-[2.7rem] font-extrabold leading-tight mb-2.5 text-slate-900 tracking-tight">
                    {title}
                </h1>
                <div className="flex items-center gap-5 mb-3 mt-1">
                    {/* Author */}
                    {author && (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary/30 shadow-inner flex items-center justify-center bg-white overflow-hidden"
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
                                    <span className="bg-primary/10 text-primary flex items-center justify-center w-full h-full text-xl font-bold rounded-full">
                                        {getInitials(author.name)}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col justify-center ml-1">
                                <span className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                                    {author.name}
                                </span>
                                {author.role && (
                                    <span className="text-xs md:text-sm text-slate-400 font-medium leading-none uppercase tracking-wide">
                                        {author.role}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Date & Time */}
                    {(displayDate || displayTime) && (
                        <span
                            className="flex items-center bg-slate-50 px-3 py-1 md:py-1.5 rounded-lg text-primary font-medium text-xs md:text-sm ml-auto border border-slate-100"
                            title={displayDate + (displayTime ? ` at ${displayTime}` : "")}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="inline-block mr-1.5 text-primary"
                                aria-hidden="true"
                                style={{ minWidth: 16, minHeight: 16 }}
                            >
                                <circle
                                    cx="10"
                                    cy="10"
                                    r="8"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                                <path
                                    d="M10 6V10L13 12"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <time dateTime={isoDate}>
                                {displayDate}
                                {displayTime && (
                                    <>
                                        <span className="mx-1 text-slate-300 font-bold">•</span>
                                        {displayTime}
                                    </>
                                )}
                            </time>
                        </span>
                    )}
                </div>
                {/* Divider */}
                <div className="my-6 mb-7 w-full border-t border-dashed border-slate-200" />
                {/* Content Body */}
                <section className="prose md:prose-lg max-w-none text-slate-700 leading-relaxed prose-headings:font-semibold prose-h2:text-[1.3rem] prose-h2:mt-7 prose-h2:mb-2 prose-img:rounded-lg prose-img:shadow prose-p:my-3 prose-a:text-primary prose-a:underline underline-offset-2 selection:bg-primary/10">
                    {typeof content === "string" ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        content
                    )}
                </section>

                {/* Comments Section */}
                {showComments && newsId && (
                    <div className="px-0 pb-0">
                        <NewsComments newsId={newsId} />
                    </div>
                )}
            </div>
            {/* Footer / Back */}
            <footer className="px-7 pt-0 pb-6 flex items-center justify-between border-t border-slate-100 mt-0">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-1.5 text-primary text-base font-bold hover:underline hover:text-primary/80 transition-colors duration-200 group/link"
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
