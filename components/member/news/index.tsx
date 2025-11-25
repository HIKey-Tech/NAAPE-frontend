"use client";
import React, { useState } from "react";
import { FilterHeader } from "../component/header";
import { NewsCard } from "@/components/ui/custom/news.card";
import { useNews } from "@/hooks/useNews";

export default function NewsCpmponent() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
        from: undefined,
        to: undefined,
    });
    const [filterOpen, setFilterOpen] = useState(false);

    // Integrate the useNews hook
    const { data: newsList, isPending: isLoading, isError } = useNews();

    // For UI simplicity, don't apply real date or filter logic yet
    const filteredPublications =
        Array.isArray(newsList)
            ? newsList.filter((news: any) =>
                  news.title?.toLowerCase().includes(search.toLowerCase())
              )
            : [];

    // Helper to safely extract author fields (in case author is an object)
    function getAuthorName(author: any): string {
        if (!author) return "Engr. Jane Smith";
        if (typeof author === "string") return author;
        if (typeof author === "object" && author.name) return author.name;
        return "Engr. Jane Smith";
    }
    function getAuthorRole(news: any): string {
        // If authorRole is provided explicitly, use it
        if (news.authorRole && typeof news.authorRole === "string") return news.authorRole;
        // Sometimes the author object may have a role or similar field
        if (news.author && typeof news.author === "object" && news.author.role && typeof news.author.role === "string") return news.author.role;
        return "NAAPE";
    }
    function getAuthorAvatarUrl(news: any): string {
        if (news.authorAvatarUrl && typeof news.authorAvatarUrl === "string") return news.authorAvatarUrl;
        if (news.author && typeof news.author === "object" && news.author.avatarUrl && typeof news.author.avatarUrl === "string")
            return news.author.avatarUrl;
        return "";
    }

    // Helper to get publication date/time (for NewsCard's publishedAt prop)
    function getPublishedAt(news: any): string | Date | undefined {
        // Provide the explicit "publishedAt" field, or fallback to "createdAt" field, or undefined
        if (news.publishedAt) return news.publishedAt;
        if (news.createdAt) return news.createdAt;
        return undefined;
    }

    return (
        <div className="px-0 sm:px-0 py-4 bg-white w-full">
            <FilterHeader
                title="News"
                search={search}
                setSearch={setSearch}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                dateRange={dateRange}
                setDateRange={setDateRange}
                searchPlaceholder="Search News..."
                sortLabel="Newest"
            />
            <div className="grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                        Loading News...
                    </div>
                ) : isError ? (
                    <div className="col-span-full text-center text-red-500 py-16 font-medium">
                        Failed to load news.
                    </div>
                ) : filteredPublications.length === 0 ? (
                    <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                        Nothing New
                    </div>
                ) : (
                    filteredPublications.map((news: any, idx: number) => (
                        <NewsCard
                            key={news.id ?? news._id ?? idx}
                            imageUrl={news.imageUrl || "/images/plane.jpg"}
                            title={news.title}
                            summary={
                                (typeof news.summary === "string" && news.summary) || 
                                (typeof news.content === "string" ? news.content.slice(0, 128) + "..." : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec.")
                            }
                            authorName={getAuthorName(news.author)}
                            authorRole={getAuthorRole(news)}
                            authorAvatarUrl={getAuthorAvatarUrl(news)}
                            linkUrl={news.linkUrl || (typeof news._id === "string" ? `/news/${news._id}` : "#")}
                            category={news.category || "Naape News"}
                            publishedAt={getPublishedAt(news)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
