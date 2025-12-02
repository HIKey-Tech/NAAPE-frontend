"use client";

import { useParams, useRouter } from "next/navigation";
import NewsDetails from "@/components/ui/custom/news.details";
import { useMemo } from "react";

// ---- NOTE: syncs with the @latest.tsx (see file_context_0) ----
const newsList = [
    {
        imageUrl: "/home/news1.jpg",
        title: "Tenants of Safety in Nigerian Aviation Industry",
        summary: "Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.",
        publishedAt: "2024-05-05T10:00:00Z",
        authorName: "Samuel Ajayi",
        authorRole: "Member",
        // linkUrl: "/news/naape/tenants-of-safety-in-nigerian-aviation-industry",
        category: "Publication",
        content: `
            <p>The Nigerian aviation sector is anchored on foundational principles—safety being paramount. This piece delves into the tenants that define operational excellence, innovation, and regulatory compliance across our skies.</p>
            <ul>
                <li>Central tenets from NAAPE's latest publication</li>
                <li>Regulatory updates and international best practices</li>
            </ul>
            <p>As industry standards evolve, NAAPE remains committed to disseminating accurate, actionable information to all stakeholders.</p>
        `,
        id: "tenants-of-safety-in-nigerian-aviation-industry"
    },
    {
        imageUrl: "/home/minister.jpeg",
        title: "Meet the New Aviation Minister: A Vision for Safer Skies",
        summary: "NAAPE meets with the new Minister of Aviation to discuss future prospects and collaborative growth to ensure Nigerian skies remain among Africa's safest.",
        publishedAt: "2024-05-07T10:00:00Z",
        authorName: "NAAPE",
        authorRole: "Admin",
        // linkUrl: "/news/naape/meet-the-new-aviation-minister-a-vision-for-safer-skies",
        category: "News",
        content: `
            <p>NAAPE welcomed the new Minister of Aviation for a roundtable on safety improvements, infrastructural upgrades, and the ongoing education of aviation professionals.</p>
            <p>This forward-looking partnership is designed to set new benchmarks in African aviation safety.</p>
        `,
        id: "meet-the-new-aviation-minister-a-vision-for-safer-skies"
    },
    {
        imageUrl: "/logo.png",
        title: "NAAPE Quarterly Magazine now out!",
        summary: "The latest NAAPE magazine features sector trends, regulatory updates, interviews with top engineers, and news from the association’s leadership.",
        publishedAt: "2024-05-11T10:00:00Z",
        authorName: "NAAPE",
        authorRole: "Admin",
        // linkUrl: "/news/naape/naape-quarterly-magazine-now-out",
        category: "Publication",
        content: `
            <p>From industry trends to in-depth interviews, catch the most pivotal stories shaping today's aviation sector in the new NAAPE magazine.</p>
        `,
        id: "naape-quarterly-magazine-now-out"
    },
    {
        imageUrl: "/images/event1.jpg",
        title: "Aviation Safety Workshop: Best Practices Highlighted",
        summary: "Industry leaders gathered at NAAPE's national workshop to discuss effective safety protocols, ongoing training, and future trends for a safer aviation sector.",
        publishedAt: "2024-04-28T09:00:00Z",
        authorName: "Fatima Balogun",
        authorRole: "Member",
        // linkUrl: "/news/naape/aviation-safety-workshop-best-practices-highlighted",
        category: "Publication",
        content: `
            <p>At the National Aviation Safety Workshop, leaders outlined key protocols to revolutionize operations and discussed training methods to enhance sector safety.</p>
        `,
        id: "aviation-safety-workshop-best-practices-highlighted"
    },
];

// ---- Helper to match by [id] param and map legacy field names ----
function findNewsById(id: string | undefined) {
    if (!id) return null;
    // Match by exact id
    const news = newsList.find((item) => item.id === id);
    if (!news) return null;
    // Compose a normalized object for NewsDetails
    return {
        image: news.imageUrl,
        title: news.title,
        content: news.content,
        date: news.publishedAt.split("T")[0],
        tag: news.category,
        author: { name: news.authorName, avatarUrl: "/images/logos/naape.svg", role: news.authorRole },
    };
}

export default function LatestNewsDetailsPage() {
    const params = useParams();
    const router = useRouter();

    // Next.js catch-all: [id]
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const news = useMemo(() => findNewsById(id), [id]);

    if (!news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F8FAFC]">
                <div className="max-w-md text-center">
                    <h1 className="text-2xl font-semibold mb-2 text-[#357AA8]">News article not found</h1>
                    <p className="mb-6 text-gray-500">
                        Sorry, we couldn't find that news article.
                    </p>
                    <button
                        className="bg-[#357AA8] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#256E98] transition-colors"
                        onClick={() => router.push("/home#latest")}
                    >
                        Back to Latest News
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] py-9 px-3 sm:px-0">
            <NewsDetails
                imageUrl={news.image}
                title={news.title}
                content={news.content}
                date={news.date}
                category={news.tag}
                author={news.author}
                backHref="/home#latest"
            />
        </main>
    );
}
