"use client";

import Image from "next/image";
import Link from "next/link";
import { Card,  CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
    className = ""
}: NewsCardProps) {
    return (
        <Card className={`overflow-hidden rounded-lg shadow-sm p-0 hover:shadow-md transition ${className}`}>
            {/* Image */}
            <div className="relative w-full h-56 sm:h-64 md:h-72">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <CardContent className="flex-1 flex flex-col gap-2 p-4">
                {/* Category */}
                {category && (
                    <Badge
                        variant="outline"
                        className="w-fit text-xs font-semibold text-[#1B0D09] bg-[#F4B05F]"
                    >
                        {category}
                    </Badge>
                )}

                <CardTitle className="text-base font-bold leading-tight mb-1">{title}</CardTitle>
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
                </div>
            </CardContent>

            {/* Footer / Link */}
            <CardFooter className="pt-0 pb-3 px-4">
                <Link
                    href={linkUrl}
                    className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
                >
                    Read More <svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" /></svg>
                </Link>
            </CardFooter>
        </Card>
    );
}

