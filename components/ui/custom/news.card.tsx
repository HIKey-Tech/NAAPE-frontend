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
import { Calendar, Clock, User } from "lucide-react";

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

function getInitials(name: string) {
    if (!name) return "NA";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function formatDate(date?: string | Date) {
    if (!date) return null;
    const d = new Date(date);
    return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
}

const FALLBACK_IMAGE_URL = "/images/news-placeholder.png";

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
    const dateInfo = formatDate(publishedAt);
    const link = linkUrl || "#";

    return (
        <Card className={`group overflow-hidden rounded-3xl border-0 shadow-lg shadow-slate-200/50 bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full max-w-sm mx-auto ${className}`}>

            {/* Image Section */}
            <div className="relative h-60 w-full overflow-hidden">
                <Image
                    src={imageUrl || FALLBACK_IMAGE_URL}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                {/* Overlay Content */}
                <div className="absolute top-4 left-4">
                    {category && (
                        <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm font-bold shadow-sm">
                            {category}
                        </Badge>
                    )}
                </div>

                {dateInfo && (
                    <div className="absolute bottom-4 left-4 right-4 flex items-center text-white/90 text-xs font-medium gap-3">
                        <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                            <Calendar size={12} className="text-accent" />
                            {dateInfo.date}
                        </span>
                        <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                            <Clock size={12} className="text-accent" />
                            {dateInfo.time}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <CardContent className="flex-1 flex flex-col gap-4 p-6">
                <Link href={link} className="group-hover:text-primary transition-colors">
                    <CardTitle className="text-xl font-bold leading-tight line-clamp-2 text-slate-900">
                        {title}
                    </CardTitle>
                </Link>
                <CardDescription className="text-slate-500 line-clamp-3 leading-relaxed">
                    {summary}
                </CardDescription>

                <div className="mt-auto pt-6 flex items-center gap-3 border-t border-slate-100 w-full">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarImage src={authorAvatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {getInitials(authorName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{authorName || "NAAPE"}</span>
                        {authorRole && <span className="text-xs text-slate-400 font-medium">{authorRole}</span>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
