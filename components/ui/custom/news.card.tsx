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
    publishedAt?: string | Date;
}

// Helper to safely get initials from authorName
function getInitials(name: unknown) {
    if (typeof name !== "string" || !name.trim()) return "NA";
    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (parts.length === 0) return "NA";
    let initials = "";
    if (parts.length === 1) {
        initials = parts[0].slice(0, 2);
    } else {
        initials = parts[0][0] + parts[parts.length - 1][0];
    }
    initials = initials.replace(/[^A-Za-z]/g, "").toUpperCase();
    if (!initials) return "NA";
    return initials;
}

// Helper to format date and time in a friendly way, handles invalid and missing input
function formatDateTimeParts(publishedAt?: string | Date) {
    if (!publishedAt) return null;
    let dateObj: Date | null = null;
    // Accept ISO string or Date
    if (typeof publishedAt === "string") {
        // Try ISO and fallback to local parsing
        const parsed = Date.parse(publishedAt);
        if (!isNaN(parsed)) {
            dateObj = new Date(parsed);
        } else {
            // Try parsing without timezone for edge case
            const [yyyy, mm, dd] = publishedAt.match(/^(\d{4})-(\d{2})-(\d{2})/)?.slice(1) || [];
            if (yyyy && mm && dd) {
                dateObj = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
            }
        }
    } else if (publishedAt instanceof Date && !isNaN(publishedAt.valueOf())) {
        dateObj = publishedAt;
    }
    if (!dateObj || isNaN(dateObj.valueOf())) return null;

    let fullDate = "—";
    let shortDate = "—";
    let time = "—";
    try {
        fullDate = dateObj.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {}
    try {
        shortDate = dateObj.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    } catch {}
    try {
        time = dateObj.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).toLowerCase();
    } catch {}
    let iso = dateObj.toISOString ? dateObj.toISOString() : "";
    return { fullDate, shortDate, time, iso };
}

// Helper: fallback image if provided fails or is empty/broken
const FALLBACK_IMAGE_URL = "/images/news-placeholder.png";

function isValidUrl(url: string | undefined): boolean {
    if (!url) return false;
    // Accepts relative and absolute URLs 
    try {
        // Throws for bad protocols etc.
        if (url.startsWith("/") || url.startsWith("http")) return true;
        return false;
    } catch {
        return false;
    }
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
    // handle edge cases for all content
    const safeTitle = (typeof title === "string" && title.trim()) ? title : "Untitled";
    const safeSummary =
        typeof summary === "string" && summary.trim()
            ? summary
            : "No summary available.";
    const safeLink = typeof linkUrl === "string" && !!linkUrl.trim() ? linkUrl : "#";
    // Defensive: if link invalid, don't render as link
    const renderAsLink = !!linkUrl && linkUrl.trim() && linkUrl !== "#";
    // Image edge case: fallback image if error or empty
    const [imgSrc, setImgSrc] = (function () {
        // SSR can't use useState! So simulate with closure: Image will handle onError
        let current = isValidUrl(imageUrl) ? imageUrl : FALLBACK_IMAGE_URL;
        return [current, (_: string) => {}];
    })();

    // avatar fallback - only show AvatarImage if URL might be valid, else fallback
    const showAvatarImg =
        typeof authorAvatarUrl === "string" && authorAvatarUrl.trim() && isValidUrl(authorAvatarUrl);

    const safeAuthor = typeof authorName === "string" && authorName.trim()
        ? authorName
        : "NAAPE";
    const safeCategory = typeof category === "string" && category.trim() ? category : undefined;
    const safeAuthorRole = typeof authorRole === "string" && authorRole.trim() ? authorRole : undefined;

    const dateInfo = formatDateTimeParts(publishedAt);

    // Provide graceful fallback for all potential missing props
    return (
        <Card
            className={`overflow-hidden rounded-2xl shadow-md p-0 hover:shadow-xl transition-all bg-[#F8FAFC] ring-1 ring-[#eaeaea] flex flex-col ${className ?? ""}`}
        >
            {/* Image & Top overlay */}
            <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden group">
                <Image
                    src={imgSrc}
                    alt={safeTitle}
                    fill
                    priority
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(event: any) => {
                        // runtime fallback only on client
                        if (event?.target && event.target.src !== FALLBACK_IMAGE_URL) {
                            event.target.src = FALLBACK_IMAGE_URL;
                        }
                    }}
                />
                {/* Overlay: CATEGORY & Date */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-3 z-20">
                    {safeCategory && (
                        <Badge
                            variant="outline"
                            className="w-fit text-xs font-semibold text-[color:oklch(0.32_0.13_266.81)] bg-[#ffd59e]/90 border-none px-3 py-[3px] shadow pointer-events-auto"
                        >
                            {safeCategory}
                        </Badge>
                    )}
                    {dateInfo && dateInfo.shortDate !== "—" ? (
                        <div className="mt-auto pointer-events-auto">
                            <span
                                className="flex items-center bg-[#eaf2fa]/90 px-2 py-[2px] rounded-md text-primary font-medium text-xs shadow"
                                title={dateInfo.fullDate && dateInfo.time ? `${dateInfo.fullDate} at ${dateInfo.time}` : ""}
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
                                <time dateTime={dateInfo.iso}>
                                    {dateInfo.shortDate} <span className="mx-1 text-[#b0bcd5]">•</span> {dateInfo.time}
                                </time>
                            </span>
                        </div>
                    ) : null}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418cc] via-transparent to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/40 z-10" />
            </div>

            <CardContent className="flex-1 flex flex-col gap-3 px-5 pb-0 pt-5">
                <CardTitle className="text-xl md:text-2xl font-extrabold leading-tight mb-1 line-clamp-2 text-[color:oklch(0.16_0.01_279.82)] drop-shadow-sm hover:text-primary transition-colors duration-150">
                    {renderAsLink ? (
                        <Link
                            href={safeLink}
                            tabIndex={-1}
                            className="focus:outline-none"
                            style={{ color: "inherit" }}
                        >
                            {safeTitle}
                        </Link>
                    ) : (
                        <span>{safeTitle}</span>
                    )}
                </CardTitle>
                <CardDescription className="text-[15px] text-[#465069] font-normal mb-0 line-clamp-3 md:line-clamp-4 leading-relaxed">
                    {safeSummary}
                </CardDescription>
                <div className="border-b border-[#d3dde8] my-2" />
                <div className="flex items-center gap-3 mt-auto pt-1">
                    <Avatar className="w-9 h-9 border-[2px] border-primary shadow-inner bg-white" style={{ borderColor: "oklch(0.32 0.13 266.81)" }}>
                        {showAvatarImg ? (
                            <AvatarImage
                                src={authorAvatarUrl!}
                                alt={typeof safeAuthor === "string" ? safeAuthor : ""}
                                className="object-cover"
                                onError={(event: any) => {
                                    // fallback to null = show AvatarFallback
                                    event.target.onerror = null;
                                    event.target.src = "";
                                }}
                            />
                        ) : (
                            <AvatarFallback className="bg-[#D2ECF7] text-primary text-xs font-bold" style={{ color: "oklch(0.32 0.13 266.81)" }}>
                                {getInitials(safeAuthor)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col justify-center">
                        <span className="text-[14px] font-semibold text-[color:oklch(0.141_0.01_285.823)] leading-tight">
                            {safeAuthor}
                        </span>
                        {safeAuthorRole && (
                            <span className="text-[12px] text-[#99aac6] font-medium leading-none">
                                {safeAuthorRole}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-4 px-5 flex items-center justify-end">
                {renderAsLink ? (
                    <Link
                        href={safeLink}
                        className="inline-flex items-center gap-1 text-primary text-base font-semibold hover:underline hover:text-[color:oklch(0.32_0.13_266.81)] transition-colors duration-150 group/link rounded-md px-3 py-2 bg-[#eaf2fa] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        tabIndex={0}
                        style={{
                            color: "oklch(0.32 0.13 266.81)",
                        }}
                        aria-label={`Read more about: ${safeTitle}`}
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
                ) : (
                    <span
                        className="inline-flex items-center gap-1 text-[#cccccc] text-base font-semibold rounded-md px-3 py-2 bg-[#eaf2fa] shadow-sm"
                        aria-label={`No link available for: ${safeTitle}`}
                        tabIndex={-1}
                        style={{ color: "#bbbbbb", cursor: "not-allowed" }}
                    >
                        Read More
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="inline-block ml-1 h-4 w-4"
                            fill="none"
                            viewBox="0 0 16 16"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                            style={{
                                color: "#bbbbbb",
                            }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 4l4 4-4 4"
                            />
                        </svg>
                    </span>
                )}
            </CardFooter>
        </Card>
    );
}

