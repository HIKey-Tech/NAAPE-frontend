"use client";

import { Training } from "@/app/api/trainings/trainings";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Video, Users } from "lucide-react";
import Link from "next/link";

function formatDate(date: string) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function TrainingCard({ training, hrefBase = "/trainings" }: { training: Training; hrefBase?: string }) {
    const price = training.isPaid
        ? `${training.currency === "NGN" ? "₦" : training.currency}${training.price.toLocaleString()}`
        : "Free";

    return (
        <Link
            href={`${hrefBase}/${training._id}`}
            className="group bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
            <div className="relative h-44 bg-slate-100 overflow-hidden">
                {training.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={training.imageUrl}
                        alt={training.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-300">
                        {training.type === "online" ? <Video size={40} /> : <MapPin size={40} />}
                    </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={training.type === "online" ? "bg-blue-600" : "bg-emerald-600"}>
                        {training.type === "online" ? "Online" : "In-Person"}
                    </Badge>
                    <Badge className={training.isPaid ? "bg-amber-600" : "bg-slate-600"}>{price}</Badge>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">{training.title}</h3>
                {training.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{training.description}</p>
                )}
                <div className="mt-auto space-y-1.5 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(training.date)}
                    </div>
                    {training.type === "in-person" && training.address && (
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-slate-400" />
                            <span className="line-clamp-1">{training.address}</span>
                        </div>
                    )}
                    {training.maxCapacity ? (
                        <div className="flex items-center gap-2">
                            <Users size={14} className="text-slate-400" />
                            {training.isFull
                                ? <span className="text-red-600 font-medium">Full</span>
                                : `${training.spotsRemaining} spots remaining`}
                        </div>
                    ) : null}
                </div>
            </div>
        </Link>
    );
}
