"use client";

import React, { useState, useEffect } from "react";
import PublishedPublicationCard from "@/components/ui/custom/publication.card";
import Link from "next/link";
import api from "@/lib/axios";
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

export default function NaapePublicationsComponent() {
    const [publications, setPublications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchPublications = async () => {
            setLoading(true);
            try {
                const response = await api.get("/publications", {
                    params: {
                        page,
                        limit: 9,
                        search: searchTerm || undefined,
                        authorRole: "admin",
                        status: "approved",
                    }
                });
                setPublications(response.data.data || []);
                if (response.data.pagination) {
                    setTotalPages(response.data.pagination.pages || 1);
                } else {
                    setTotalPages(1);
                }
            } catch (error) {
                console.error("Failed to fetch publications:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPublications();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, searchTerm]);

    return (
        <div className="min-h-screen bg-gray-50 w-full flex flex-col items-center">
            {/* Simple Hero Section */}
            <div className="w-full pt-32 pb-16 bg-white border-b border-slate-100 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                    NAAPE <span className="text-primary">Publications</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Access officially released publications, research, and guidelines from the National Association of Aircraft Pilots and Engineers.
                </p>
                <div className="mt-8 flex justify-center max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search official publications..."
                        className="pl-10 h-12 rounded-full border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-sm"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            <section className="w-full max-w-7xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : publications.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                        <p className="text-lg font-medium">No official publications found.</p>
                        {searchTerm && (
                            <button onClick={() => { setSearchTerm(""); setPage(1); }} className="mt-4 text-primary hover:underline font-bold">
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {publications.map((pub) => (
                                <Link href={`/publication/naape/${pub._id || pub.id}`} key={pub._id || pub.id} className="block group focus:outline-none focus:ring-2 focus:ring-primary rounded-3xl transition-transform hover:-translate-y-1">
                                    <PublishedPublicationCard
                                        imageUrl={pub.image || pub.imageUrl || "/logo.png"}
                                        title={pub.title}
                                        summary={pub.summary || (pub.content?.substring(0, 150) + "...")}
                                        authorName={pub.author?.name || pub.authorName || "NAAPE"}
                                        authorRole={pub.author?.role || pub.authorRole || "Admin"}
                                        authorAvatarUrl={pub.authorAvatarUrl || "/logo.png"}
                                        linkUrl={`/publication/naape/${pub._id || pub.id}`}
                                        category={pub.category}
                                        publishedDate={
                                            (pub.createdAt || pub.publishedDate)
                                                ? new Date(pub.createdAt || pub.publishedDate).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                                : ""
                                        }
                                        className="publications-card-animate"
                                    />
                                </Link>
                            ))}
                        </div>

                        {!loading && totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (page > 1) setPage(page - 1);
                                                }}
                                                className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    isActive={page === i + 1}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setPage(i + 1);
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (page < totalPages) setPage(page + 1);
                                                }}
                                                className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
