"use client";

import { useState, useEffect } from "react";
import { useCourses } from "@/hooks/useCourses";
import CourseCard from "@/components/courses/course-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const PRICING_FILTERS = [
    { label: "All prices", value: "" },
    { label: "Free", value: "free" },
    { label: "Paid", value: "paid" },
] as const;

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [pricing, setPricing] = useState<"" | "free" | "paid">("");
    const [page, setPage] = useState(1);
    const limit = 9;

    const { data, isLoading, isError } = useCourses({
        page,
        limit,
        search: searchTerm || undefined,
        pricing: pricing || undefined,
    });

    const courses = data?.courses || [];
    const totalPages = data?.pagination?.pages || 1;

    useEffect(() => {
        setPage(1);
    }, [searchTerm, pricing]);

    const chipClass = (active: boolean) =>
        `px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            active
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
        }`;

    return (
        <div className="min-h-screen bg-gray-50 w-full flex flex-col items-center">
            <div className="w-full pt-32 pb-16 bg-white border-b border-slate-100 text-center px-4">
                <span className="text-sm font-bold text-accent tracking-widest uppercase mb-2 block">
                    Learning Management
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                    Online <span className="text-primary">Courses</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Learn at your own pace with expert-built courses — videos, lessons, quizzes and certificates.
                </p>
                <div className="mt-8 flex justify-center max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search courses..."
                        className="pl-10 h-12 rounded-full border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {PRICING_FILTERS.map((f) => (
                        <button key={f.value} className={chipClass(pricing === f.value)} onClick={() => setPricing(f.value)}>
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <section className="w-full max-w-6xl mx-auto px-4 py-16">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="py-20 text-center text-red-500 bg-white rounded-3xl border border-red-50 shadow-sm max-w-2xl mx-auto">
                        <p className="text-lg font-medium">Failed to load courses.</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                        <p className="text-lg font-medium">No courses found.</p>
                        {(searchTerm || pricing) && (
                            <button
                                onClick={() => { setSearchTerm(""); setPricing(""); }}
                                className="mt-4 text-primary hover:underline font-bold"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {courses.map((course: any) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                )}

                {!isLoading && totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                                        className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={page === i + 1}
                                            onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                                            className="cursor-pointer"
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                                        className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </section>
        </div>
    );
}
