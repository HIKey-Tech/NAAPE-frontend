"use client";

import { useParams, useRouter } from "next/navigation";
import { useSingleNews } from "@/hooks/useNews";
import NewsDetails from "@/components/ui/custom/news.details";

export default function MemberNewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const { data: news, isLoading, isError } = useSingleNews(id || "");

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#193B7A] mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading news article...</p>
                </div>
            </div>
        );
    }

    if (isError || !news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F8FAFC]">
                <div className="max-w-md text-center bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-2 text-[#193B7A]">News Article Not Found</h1>
                    <p className="mb-6 text-gray-600">
                        Sorry, we couldn't find that news article.
                    </p>
                    <button
                        className="bg-[#193B7A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#154075] transition-colors"
                        onClick={() => router.push("/news")}
                    >
                        Back to News
                    </button>
                </div>
            </div>
        );
    }

    // Extract author information
    const author = typeof news.author === "object" && news.author
        ? {
            name: news.author.name || "NAAPE",
            avatarUrl: news.author.avatarUrl || "/logo.png",
            role: news.author.role || "Admin"
        }
        : {
            name: "NAAPE",
            avatarUrl: "/logo.png",
            role: "Admin"
        };

    return (
        <main className="min-h-screen bg-[#F8FAFC] py-10 px-2 sm:px-0">
            <NewsDetails
                imageUrl={news.image || "/images/plane.jpg"}
                title={news.title}
                content={news.content}
                date={news.createdAt || news.updatedAt}
                author={author}
                category={news.category || "News"}
                backHref="/news"
                newsId={news._id}
                showComments={true}
            />
        </main>
    );
}
