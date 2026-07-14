"use client";

import { useState } from "react";
import { useCourses, useMyCourses } from "@/hooks/useCourses";
import CourseCard from "@/components/courses/course-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Layers, Award } from "lucide-react";
import Link from "next/link";

const PRICING_FILTERS = [
    { label: "All prices", value: "" },
    { label: "Free", value: "free" },
    { label: "Paid", value: "paid" },
] as const;

export default function MemberCoursesPage() {
    const [tab, setTab] = useState<"browse" | "mine">("browse");
    const [search, setSearch] = useState("");
    const [pricing, setPricing] = useState<"" | "free" | "paid">("");

    const { data, isLoading } = useCourses({
        search: search || undefined,
        pricing: pricing || undefined,
        limit: 30,
    });
    const { data: myData, isLoading: myLoading } = useMyCourses(tab === "mine");

    const courses = data?.courses || [];
    const myCourses = myData?.courses || [];

    const chipClass = (active: boolean) =>
        `px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
            active
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
        }`;

    return (
        <div className="px-4 sm:px-6 py-6 bg-white w-full min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Online Courses</h1>
                <div className="flex gap-2">
                    <button className={chipClass(tab === "browse")} onClick={() => setTab("browse")}>
                        Browse
                    </button>
                    <button className={chipClass(tab === "mine")} onClick={() => setTab("mine")}>
                        My Courses
                    </button>
                </div>
            </div>

            {tab === "browse" && (
                <>
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                                placeholder="Search courses..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
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
                    ) : courses.length === 0 ? (
                        <div className="text-center text-slate-400 py-20 font-medium">No courses found</div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course: any) => (
                                <CourseCard key={course._id} course={course} hrefBase="/member/courses" />
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
                ) : myCourses.length === 0 ? (
                    <div className="text-center text-slate-400 py-20 font-medium">
                        You haven&apos;t enrolled in any courses yet.
                        <button onClick={() => setTab("browse")} className="block mx-auto mt-3 text-primary hover:underline font-semibold">
                            Browse courses
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-3xl">
                        {myCourses.map((c: any) => {
                            const total = c.moduleCount || 0;
                            const done = c.progress?.completedModules?.length || 0;
                            const completed = !!c.progress?.completedAt;
                            return (
                                <Link
                                    key={c._id}
                                    href={completed ? `/member/courses/${c._id}` : `/courses/${c._id}/learn`}
                                    className="flex items-center justify-between gap-4 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-900 truncate">{c.title}</p>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Layers size={13} /> {done}/{total} modules
                                            </span>
                                        </div>
                                        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-xs">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${total ? (done / total) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <Badge className={completed ? "bg-green-600" : "bg-blue-600"}>
                                        {completed ? (
                                            <span className="flex items-center gap-1"><Award size={12} /> Completed</span>
                                        ) : (
                                            "In progress"
                                        )}
                                    </Badge>
                                </Link>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
}
