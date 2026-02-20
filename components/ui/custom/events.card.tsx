"use client";

import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";

export interface EventCardProps {
    imageUrl?: string;
    title: string;
    date: string | Date;
    time?: string;
    venue?: string;
    location?: string;
    registerUrl?: string;
    className?: string;
    onCardClick?: () => void;
    [key: string]: any; // allow extra API props to pass through without error
}

export default function EventCard({
    imageUrl,
    title,
    date,
    time,
    venue,
    location,
    registerUrl,
    className = "",
    onCardClick,
    ...rest
}: EventCardProps) {
    const displayVenue = venue || location || "TBA";
    const displayDate = typeof date === "string" ? date : date instanceof Date ? date.toLocaleDateString() : "TBA";
    const displayTime = time || "";
    const displayImage = imageUrl || "/images/plane.jpg";

    return (
        <div
            onClick={onCardClick}
            className={`group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-0 ${className}`}
        >
            {/* Image */}
            <div className="relative h-60 w-full overflow-hidden">
                <img
                    src={displayImage}
                    alt={title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold">
                        <Calendar size={12} className="text-accent" />
                        {displayDate}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex-1 flex flex-col gap-2 min-h-[5rem]">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                    </h3>

                    <div className="flex flex-col gap-2 mt-auto">
                        {displayTime && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Clock size={14} className="text-slate-400 shrink-0" />
                                <span>{displayTime}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin size={14} className="text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{displayVenue}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6 mt-auto border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        View Details
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
