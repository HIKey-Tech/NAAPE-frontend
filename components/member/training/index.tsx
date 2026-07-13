"use client";
import { useState } from "react";
import { useTrainings, useMyTrainings } from "@/hooks/useTrainings";
import TrainingCard from "@/components/trainings/training-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Video, MapPin } from "lucide-react";
import Link from "next/link";

const TYPE_FILTERS = [
    { label: "All formats", value: "" },
    { label: "Online", value: "online" },
    { label: "In-Person", value: "in-person" },
] as const;

const PRICING_FILTERS = [
    { label: "All prices", value: "" },
    { label: "Free", value: "free" },
    { label: "Paid", value: "paid" },
] as const;

export default function TrainingsComponent() {
    const [tab, setTab] = useState<"browse" | "mine">("browse");
    const [search, setSearch] = useState("");
    const [type, setType] = useState<"" | "online" | "in-person">("");
    const [pricing, setPricing] = useState<"" | "free" | "paid">("");

    const { data, isLoading } = useTrainings({
        search: search || undefined,
        type: type || undefined,
        pricing: pricing || undefined,
        limit: 30,
    });
    const { data: myData, isLoading: myLoading } = useMyTrainings(tab === "mine");

    const trainings = data?.trainings || [];
    const myTrainings = myData?.trainings || [];

    const chipClass = (active: boolean) =>
        `px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
            active
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
        }`;

    return (
        <div className="px-4 sm:px-6 py-6 bg-white w-full min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Trainings & Certifications</h1>
                <div className="flex gap-2">
                    <button className={chipClass(tab === "browse")} onClick={() => setTab("browse")}>
                        Browse
                    </button>
                    <button className={chipClass(tab === "mine")} onClick={() => setTab("mine")}>
                        My Trainings
                    </button>
                </div>
            </div>

            {tab === "browse" && (
                <>
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                                placeholder="Search trainings..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            {TYPE_FILTERS.map((f) => (
                                <button key={f.value} className={chipClass(type === f.value)} onClick={() => setType(f.value)}>
                                    {f.label}
                                </button>
                            ))}
                            {PRICING_FILTERS.map((f) => (
                                <button key={f.value} className={chipClass(pricing === f.value)} onClick={() => setPricing(f.value)}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : trainings.length === 0 ? (
                        <div className="text-center text-slate-400 py-20 font-medium">No trainings found</div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {trainings.map((training: any) => (
                                <TrainingCard key={training._id} training={training} hrefBase="/training" />
                            ))}
                        </div>
                    )}
                </>
            )}

            {tab === "mine" && (
                myLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : myTrainings.length === 0 ? (
                    <div className="text-center text-slate-400 py-20 font-medium">
                        You haven&apos;t registered for any trainings yet.
                        <button onClick={() => setTab("browse")} className="block mx-auto mt-3 text-primary hover:underline font-semibold">
                            Browse trainings
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-3xl">
                        {myTrainings.map((t: any) => (
                            <Link
                                key={t._id}
                                href={`/training/${t._id}`}
                                className="flex items-center justify-between gap-4 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">{t.title}</p>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={13} />
                                            {new Date(t.date).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            {t.type === "online" ? <Video size={13} /> : <MapPin size={13} />}
                                            {t.type === "online" ? "Online" : t.address || "In-Person"}
                                        </span>
                                    </div>
                                </div>
                                <Badge className={t.registration?.paymentStatus === "successful" ? "bg-green-600" : "bg-slate-500"}>
                                    {t.registration?.paymentStatus === "successful" ? "Paid" : "Registered"}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
