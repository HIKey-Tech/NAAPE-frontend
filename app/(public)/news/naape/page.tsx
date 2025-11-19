"use client";

import { useState } from "react";
import NewsHeroSection from "@/components/ui/landing/news";
import type { ReactNode } from "react";
import { LandingTabs } from "@/components/ui/custom/landing.tab";
import { NewsCard } from "@/components/ui/custom/news.card";

// Tab icon examples (optional, import icons you want to use)
import { Newspaper, Calendar, Users } from "lucide-react";

// News Slide type and hero slides
type NewsSlide = {
    src: string;
    alt: string;
    caption?: ReactNode;
    headline?: ReactNode;
    excerpt?: ReactNode;
    link?: string;
};

const NAAPE_NEWS_HERO_SLIDES: NewsSlide[] = [
    {
        src: "/images/plane.jpg",
        alt: "NAAPE Celebrates Successful Event",
        headline: "NAAPE Celebrates Successful Annual General Meeting",
        excerpt: "The National Association of Aircraft Pilots and Engineers (NAAPE) held its 2024 AGM, uniting aviation professionals to inspire growth.",
        caption: "Lagos, 2024 · Photo: NAAPE",
        link: "https://naape.org.ng/news/agm-2024",
    },
    {
        src: "/images/event1.jpg",
        alt: "NAAPE Safety Workshop",
        headline: "NAAPE Hosts National Aviation Safety Workshop",
        excerpt: "Experts discussed current trends and best practices in aviation safety during NAAPE's national workshop.",
        caption: "NAAPE Headquarters · Feb 2024",
        link: "https://naape.org.ng/news/safety-workshop",
    },
    {
        src: "/images/event2.jpg",
        alt: "Women in Aviation Forum",
        headline: "NAAPE Champions Women in Aviation Initiative",
        excerpt: "A special forum spotlighted female trailblazers, promoting inclusivity within Nigeria's aviation sector.",
        caption: "NAAPE Women in Aviation, March 2024",
        link: "https://naape.org.ng/news/women-in-aviation",
    },
];

// Enhanced tab configuration with icons
const NEWS_TABS = [
    { value: "all", label: "All News", icon: <Newspaper className="w-4 h-4 mr-1" /> },
    { value: "events", label: "Events", icon: <Calendar className="w-4 h-4 mr-1" /> },
    { value: "initiatives", label: "Initiatives", icon: <Users className="w-4 h-4 mr-1" /> },
];

type NewsItem = {
    id: string;
    title: string;
    summary: string;
    date: string;
    image?: string;
    tag?: string;
    link?: string;
};

const ALL_NEWS: NewsItem[] = [
    {
        id: "agm-2024",
        title: "NAAPE Celebrates Successful AGM",
        summary: "The annual general meeting brought together aviation professionals for collaboration and growth.",
        date: "2024-04-20",
        image: "/images/news/naape/naape-banner.jpg",
        tag: "Events",
        link: "https://naape.org.ng/news/agm-2024",
    },
    {
        id: "workshop-2024",
        title: "Aviation Safety Workshop Highlighted Industry Best Practices",
        summary: "Safety experts gathered at NAAPE HQ to discuss new standards and procedures.",
        date: "2024-02-18",
        image: "/images/news/naape/safety-workshop.jpg",
        tag: "Events",
        link: "https://naape.org.ng/news/safety-workshop",
    },
    {
        id: "wia-2024",
        title: "Women in Aviation, Inspiring Change",
        summary: "NAAPE hosted an empowering session for women professionals in aviation.",
        date: "2024-03-10",
        image: "/images/news/naape/women-in-aviation.jpg",
        tag: "Initiatives",
        link: "https://naape.org.ng/news/women-in-aviation",
    },
];

function filterNews(tab: string, search: string) {
    let filtered = ALL_NEWS;
    if (tab !== "all") {
        filtered = filtered.filter(item =>
            (item.tag || "").toLowerCase().includes(tab)
        );
    }
    if (search.trim()) {
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(search.toLowerCase())
            || item.summary.toLowerCase().includes(search.toLowerCase())
        );
    }
    return filtered.sort((a, b) => b.date.localeCompare(a.date));
}

// Adapted NewsList component to use NewsCard
function NewsList({ news }: { news: NewsItem[] }) {
    if (!news.length) {
        return (
            <div className="py-12 text-center text-gray-500">
                No news articles found.
            </div>
        );
    }
    return (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {news.map(item => (
                <NewsCard
                    key={item.id}
                    imageUrl={item.image || ""}
                    title={item.title}
                    summary={item.summary}
                    // For this example, generic/fallback author, role, and avatar are provided.
                    // In real data, replace with actual author fields.
                    authorName="NAAPE"
                    authorRole={item.tag || undefined}
                    authorAvatarUrl="/images/logos/naape.svg"
                    linkUrl={item.link || "#"}
                    category={item.tag}
                />
            ))}
        </div>
    );
}

export default function NaapeNewsPage() {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredNews = filterNews(activeTab, searchTerm);

    return (
        <div className="min-h-screen bg-gray-50 w-full">
            <NewsHeroSection
                heading={
                    <>
                        NAAPE <span className="text-[#357AA8]">News & Highlights</span>
                    </>
                }
                subheading="Updates, features, and stories from the National Association of Aircraft Pilots and Engineers."
                slides={NAAPE_NEWS_HERO_SLIDES}
                intervalMs={4800}
                minHeightClass="min-h-[29rem] md:min-h-[32rem]"
                className="pt-0"
            >
                <div className="mt-4 flex flex-col items-center gap-2 text-sm text-[#42425a]">
                    Want to contribute a story? <a href="mailto:media@naape.org.ng" className="font-semibold text-[#357AA8] hover:underline">Contact our media team</a>
                </div>
            </NewsHeroSection>
            <section className="w-full max-w-full h-full mx-auto px-2  pt-8 pb-20">
                <div className="w-full flex flex-col items-center  mx-auto">
                    <LandingTabs
                        tabs={NEWS_TABS}
                        defaultValue={activeTab}
                        showTabs={true}
                        showSearch={true}
                        searchPlaceholder="Search news..."
                        onTabChange={(tab) => {
                            setActiveTab(tab);
                            setSearchTerm("");
                        }}
                        onSearch={(val: string) => setSearchTerm(val)}
                        // Improved tabPanel layout: card underlines and more padding for distinction
                        tabPanel={(tab, isActive) =>
                            isActive ? (
                                <div className="bg-white h-full rounded-xl px-2 md:px-6 py-6 mt-2 ">
                                    <NewsList news={filterNews(tab.value, searchTerm)} />
                                </div>
                            ) : null
                        }
                        tabListClassName="!mb-0 !mt-0 w-full md:justify-center border-b border-blue-100 h-full bg-white/90 rounded-t-xl px-2 sm:px-3 pt-2"
                        className="bg-transparent shadow-none w-full"
                    />
                </div>
            </section>
        </div>
    );
}
