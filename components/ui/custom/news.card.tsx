"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Types
export interface NewsCardProps {
    imageUrl: string;
    title: string;
    summary: string;
    authorName: string;
    authorRole?: string;
    authorAvatarUrl?: string;
    linkUrl: string;
    category?: string;
    className?: string;
    publishedAt?: string | Date; // New prop for date/time (optional)
}

// Helper to safely get initials from authorName
function getInitials(name: unknown) {
    if (typeof name !== "string" || !name.trim()) return "NA";
    const parts = name.trim().split(/\s+/);
    const initials = parts.map((n) => n[0] || "").join("");
    return initials.toUpperCase().slice(0, 2);
}

// Helper to format date and time in a friendly way
function formatDateTimeParts(publishedAt?: string | Date) {
    if (!publishedAt) return null;
    let dateObj: Date;
    if (typeof publishedAt === "string") {
        dateObj = new Date(publishedAt);
        if (isNaN(dateObj.valueOf())) return null;
    } else {
        dateObj = publishedAt;
    }
    // Returns { fullDate: "June 6, 2024", shortDate: "Jun 6", time: "10:18 am" }
    const fullDate = dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const shortDate = dateObj.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
    // hour12: true = am/pm, hour: "numeric" = no leading zero
    const time = dateObj.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).toLowerCase();
    return { fullDate, shortDate, time, iso: dateObj.toISOString() };
}

export function NewsCard({
    imageUrl,
    title,
    summary,
    authorName,
    authorRole,
    authorAvatarUrl,
    linkUrl,
    category,
    className = "",
    publishedAt,
}: NewsCardProps) {
    const dateInfo = formatDateTimeParts(publishedAt);

    // Use the primary color, which in Tailwind (by default) is configured and matches #2852B4
    // We'll use 'text-primary', 'hover:text-primary', 'border-primary', etc., and inline fallbacks where needed.

    return (
        <Card
            className={`overflow-hidden rounded-2xl shadow-md p-0 hover:shadow-xl transition-all bg-[#F8FAFC] ring-1 ring-[#eaeaea] ${className}`}
        >
            {/* Image with effect */}
            <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden group">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    priority
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14141888] via-transparent to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/40" />
                {/* Show category badge on image for prominence */}
                {category && (
                    <div className="absolute top-3 left-3 z-20">
                        <Badge
                            variant="outline"
                            className="w-fit text-xs font-semibold text-[color:oklch(0.32_0.13_266.81)] bg-[#ffd59e]/80 border-none px-3 py-[3px] shadow"
                        >
                            {category}
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <CardContent className="flex-1 flex flex-col gap-3 p-5 pt-4">
                <CardTitle className="text-lg md:text-xl font-semibold leading-tight mb-2 line-clamp-2 text-[color:oklch(0.141_0.005_285.823)] hover:text-primary transition-colors duration-200">
                    <Link
                        href={linkUrl}
                        tabIndex={-1}
                        className="focus:outline-none"
                        style={{ color: "inherit" }}
                    >
                        {title}
                    </Link>
                </CardTitle>
                {/* Improved Date and Time UI */}
                {dateInfo && (
                    <div className="flex items-center gap-2 mb-2">
                        {/* Modern icon, bolder with better alignment */}
                        <span
                            className="flex items-center bg-[#eaf2fa] px-2 py-[2px] rounded-md text-primary font-medium text-xs"
                            title={dateInfo.fullDate + " at " + dateInfo.time}
                            style={{
                                color: "oklch(0.32 0.13 266.81)", // fallback to the primary colour
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
                            <time dateTime={dateInfo.iso}>
                                {dateInfo.shortDate} <span className="mx-1 text-[#b0bcd5]">•</span> {dateInfo.time}
                            </time>
                        </span>
                    </div>
                )}

                <CardDescription className="text-[#6a7586] text-sm font-normal mb-1 line-clamp-4">
                    {summary}
                </CardDescription>
                {/* Divider */}
                <div className="border-b border-[#d5e2f0] my-2" />
                {/* Author block */}
                <div className="flex items-center gap-2 mt-auto pt-1">
                    <Avatar className="w-9 h-9 border-[2px] border-primary shadow-inner bg-white" style={{ borderColor: "oklch(0.32 0.13 266.81)" }}>
                        {authorAvatarUrl ? (
                            <AvatarImage
                                src={authorAvatarUrl}
                                alt={typeof authorName === "string" ? authorName : ""}
                                className="object-cover"
                            />
                        ) : (
                            <AvatarFallback className="bg-[#D2ECF7] text-primary text-xs font-bold" style={{ color: "oklch(0.32 0.13 266.81)" }}>
                                {getInitials(authorName)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col justify-center ml-1">
                        <span className="text-[13px] font-semibold text-[color:oklch(0.141_0.005_285.823)] leading-tight">
                            {authorName}
                        </span>
                        {authorRole && (
                            <span className="text-[11px] text-[#95a0b5] font-medium leading-none">
                                {authorRole}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>

            {/* Footer / Link */}
            <CardFooter className="pt-0 pb-3 px-5 flex items-center justify-between">
                <Link
                    href={linkUrl}
                    className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline hover:text-[color:oklch(0.32_0.13_266.81)] transition-colors duration-200 group/link"
                    tabIndex={0}
                    style={{
                        color: "oklch(0.32 0.13 266.81)",
                    }}
                >
                    Read More
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform"
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
                            d="M6 4l4 4-4 4"
                        />
                    </svg>
                </Link>
            </CardFooter>
        </Card>
    );
}
