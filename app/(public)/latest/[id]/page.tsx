"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const newsList = [
    {
        imageUrl: "/home/news1.jpg",
        title: "Tenants of Safety in Nigerian Aviation Industry",
        summary: "Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.",
        publishedAt: "2024-05-05T10:00:00Z",
        authorName: "Samuel Ajayi",
        authorRole: "Member",
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
    const news = newsList.find((item) => item.id === id);
    if (!news) return null;
    return {
        image: news.imageUrl,
        title: news.title,
        summary: news.summary,
        content: news.content,
        date: news.publishedAt.split("T")[0],
        tag: news.category,
        author: { name: news.authorName, avatarUrl: "/images/logos/naape.svg", role: news.authorRole },
    };
}

function InfoLabel({ label, value, color }: {label: string, value: string, color?: string}) {
    return (
        <div className="flex gap-2 items-center mb-1 text-[15px]">
            <span className="font-semibold uppercase tracking-wide" style={color ? { color } : { color: "#193B7A" }}>
                {label}:
            </span>
            <span className="font-medium text-gray-700">{value}</span>
        </div>
    );
}

export default function LatestNewsDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const news = useMemo(() => findNewsById(id), [id]);

    if (!news) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F5F6FA]">
                <section className="w-full max-w-lg bg-white border border-[#193B7A] rounded-xl p-6">
                    <h1 className="text-[2rem] font-extrabold text-[#193B7A] mb-2 leading-tight tracking-tight">
                        News Article Not Found
                    </h1>
                    <p className="mb-6 text-gray-600 font-medium">
                        Sorry, we couldn't find that news article. Double-check the URL or return to the latest updates.
                    </p>
                    <button
                        className="inline-block bg-[#193B7A] text-white px-6 py-2 rounded-full font-bold text-base uppercase transition-colors hover:bg-[#154075]"
                        onClick={() => router.push("/home#latest")}
                    >
                        Back to Latest News
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F6FA] py-10 px-2 sm:px-0 flex justify-center">
            <article className="w-full max-w-3xl bg-white border-[2px] border-[#193B7A] rounded-2xl p-0 sm:p-0">
                {/* Visual Hierarchy: Header with image */}
                <header className="w-full border-b border-[#E5E7EB] flex flex-col items-start p-6 pb-3">
                    {/* News category and date */}
                    <div className="flex gap-4 items-center mb-2">
                        <span className="inline-block bg-[#193B7A] text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                            {news.tag}
                        </span>
                        <span className="text-sm font-semibold text-[#CA9414] tracking-wide" title="Published date">
                            {news.date}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[#193B7A] mb-2">
                        {news.title}
                    </h1>
                    <p className="text-base sm:text-lg text-[#444] font-semibold mb-2 max-w-2xl">
                        {news.summary}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                        <img
                            src={news.author.avatarUrl}
                            alt={news.author.name}
                            width={34}
                            height={34}
                            className="rounded-full border border-[#CA9414] bg-[#fff]"
                            style={{ objectFit: "cover" }}
                        />
                        <div>
                            <span className="font-semibold text-[#193B7A] leading-snug">{news.author.name}</span>{" "}
                            <span className="text-xs text-[#CA9414] font-bold uppercase ml-2">{news.author.role}</span>
                        </div>
                    </div>
                </header>
                {/* Main image */}
                {news.image && (
                    <div className="w-full border-b border-[#E5E7EB]">
                        <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-[210px] sm:h-[275px] object-cover object-center rounded-0"
                            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                        />
                    </div>
                )}

                {/* Article Content */}
                <section className="p-6 pt-5 pb-7 leading-relaxed">
                    {/* More informative intro */}
                    <section className="mb-7">
                        <InfoLabel label="Published" value={news.date} />
                        <InfoLabel label="Type" value={news.tag} color="#CA9414" />
                        <InfoLabel label="Author" value={`${news.author.name} (${news.author.role})`} />
                    </section>
                    {/* Article body */}
                    <div
                        className="prose max-w-none text-[#292d32] font-medium"
                        style={{
                            fontSize: "1.09rem",
                            lineHeight: "1.7",
                        }}
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                </section>

                {/* Back link */}
                <nav className="border-t border-[#E5E7EB] p-6 pt-4 flex">
                    <button
                        className="inline-block bg-[#193B7A] text-white px-5 py-2 rounded-full font-bold text-base uppercase transition-colors hover:bg-[#154075]"
                        onClick={() => router.push("/home#latest")}
                        aria-label="Back to latest news"
                    >
                        ← Back to Latest News
                    </button>
                </nav>
            </article>
        </main>
    );
}
