"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type PublishedPublicationCardProps = {
    imageUrl: string;
    title: string;
    summary: string;
    authorName: string;
    authorRole?: string;
    authorAvatarUrl?: string;
    linkUrl: string;
    category?: string;
    publishedDate?: string;
    className?: string;
};

// Helper: splits a long title for 2-line layout, as in original member PublicationCard
const splitTitle = (title: string, maxLineLength = 32): [string, string] => {
    if (!title) return ["", ""];
    if (title.length <= maxLineLength) return [title, ""];
    const spaceIdx =
        title.lastIndexOf(" ", maxLineLength) !== -1
            ? title.lastIndexOf(" ", maxLineLength)
            : maxLineLength;
    return [title.slice(0, spaceIdx), title.slice(spaceIdx).trim()];
};

// Fade-in/scale-in animation CSS, following the user/member publication.card.tsx pattern
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

export const PublishedPublicationCard: React.FC<PublishedPublicationCardProps> = ({
    imageUrl,
    title,
    summary,
    authorName,
    authorRole,
    authorAvatarUrl,
    linkUrl,
    category,
    publishedDate,
    className = "",
}) => {
    const [mainTitle, subTitle] = splitTitle(title);
    const cardRef = React.useRef<HTMLDivElement | null>(null);

    // Fade-in on enter viewport
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
                              }, 45 + Math.random() * 120);
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

    return (
        <Card
            ref={cardRef}
            className={`
                ${ANIMATION_CLASS}
                overflow-hidden rounded-2xl border border-[#E5EAF2] bg-white shadow-sm
                p-0 hover:shadow-md transition
                flex flex-col
                ${className}
            `}
            style={{ boxShadow: "0 1px 6px rgba(30,41,59,0.05)" }}
        >
            {/* Image */}
            <div className="relative w-full h-56 sm:h-64 md:h-72 bg-gray-200">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        priority={false}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">
                        No Image
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <CardContent className="flex-1 flex flex-col gap-2 p-4 pt-3">
                {/* Category only in the row, status removed */}
                <div className="flex items-start justify-between gap-2 mb-1">
                    {category && (
                        <Badge variant="outline" className="w-fit text-xs font-semibold text-[#1B0D09] bg-[#F4B05F]">
                            {category}
                        </Badge>
                    )}
                </div>
                {/* Title split into up to 2 lines */}
                <CardTitle className="text-base font-bold leading-tight mb-0">
                    {mainTitle}
                    {subTitle && (
                        <div>
                            {subTitle}
                        </div>
                    )}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs font-normal mb-2 line-clamp-3">{summary}</CardDescription>
                {/* Author */}
                <div className="flex items-center gap-2 mt-auto pt-3">
                    <Avatar className="w-7 h-7 border">
                        {authorAvatarUrl ? (
                            <AvatarImage src={authorAvatarUrl} alt={authorName} />
                        ) : (
                            <AvatarFallback>
                                {authorName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-[#363749]">{authorName}</span>
                        {authorRole && (
                            <span className="text-[11px] text-[#6B7280]">{authorRole}</span>
                        )}
                    </div>
                    {publishedDate && (
                        <span className="ml-3 text-[12px] text-[#96A6BF] font-normal truncate">{publishedDate}</span>
                    )}
                </div>
            </CardContent>

            {/* Footer / Read More Button */}
            <CardFooter className="pt-0 pb-3 px-4">
                <Link
                    href={linkUrl}
                    className="text-[#2852B4] text-sm font-semibold hover:underline flex items-center gap-1"
                >
                    Read More{" "}
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" /></svg>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default PublishedPublicationCard;

