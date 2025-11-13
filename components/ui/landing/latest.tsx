
import { NaapButton } from "@/components/ui/custom/button.naap";
import { NewsCard } from "@/components/ui/custom/news.card";

// Dummy Latest News Data
const newsList = [
    {
        imageUrl: "/images/plane.jpg",
        title: "Tenants of Safety in Nigerian Aviation Industry",
        summary: "Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.",
        authorName: "Samuel Ajayi",
        authorRole: "Aviation Analyst",
        authorAvatarUrl: "",
        linkUrl: "/news/safety-nigerian-aviation",
        category: "Insight",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "Tenants of Safety in Nigerian Aviation Industry",
        summary: "Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.",
        authorName: "Samuel Ajayi",
        authorRole: "Aviation Analyst",
        authorAvatarUrl: "",
        linkUrl: "/news/safety-nigerian-aviation",
        category: "Insight",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "Meet the New Aviation Minister: A Vision for Safer Skies",
        summary: "NAAPE meets with the new Minister of Aviation to discuss future prospects and collaborative growth to ensure Nigerian skies remain among Africa's safest.",
        authorName: "Ngozi Okoronkwo",
        authorRole: "NAAPE Correspondent",
        authorAvatarUrl: "",
        linkUrl: "/news/new-aviation-minister",
        category: "Leadership",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "NAAPE Quarterly Magazine now out!",
        summary: "The latest NAAPE magazine features sector trends, regulatory updates, interviews with top engineers, and news from the association’s leadership.",
        authorName: "Editorial Board",
        authorRole: "NAAPE",
        authorAvatarUrl: "",
        linkUrl: "/news/naape-magazine-issue",
        category: "Publication",
    },
];


export default function LatestNews() {
    return (
        <section className="w-full max-w-full mx-auto min-h-full p-6 my-6">
            <div className="mb-8 flex flex-col items-center ">
                <span className="text-[#CA9414] font-bold text-xs md:text-sm tracking-widest uppercase mb-2">
                    WHAT'S NEW?
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-1 text-center">
                    Latest News & Publications
                </h2>
                <p className="text-[#5B6170] text-base md:text-lg font-normal mt-2 text-center max-w-2xl">
                    Stay up to date with the latest developments, insights, and publications from NAAPE and its partners.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {newsList.map((news, index) => (
                    <NewsCard key={index} {...news} />
                ))}
            </div>

            <div className="flex justify-center mt-10">
                <a href="/news">
                    <NaapButton
                        className="bg-[#2852B4] hover:bg-[#2347A0] text-white font-semibold px-7 py-3 text-base shadow transition"
                    >
                        View All
                    </NaapButton>
                </a>
            </div>
        </section>
    );
}
