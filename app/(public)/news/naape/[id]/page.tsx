"use client";

import { useParams, useRouter } from "next/navigation";
import NewsDetails from "@/components/ui/custom/news.details";
import { useMemo } from "react";

// Dummy news data (should match or be refactored from the main news listing)
const NEWS: Array<{
  id: string;
  title: string;
  summary?: string;
  content: string;
  image: string;
  date: string;
  tag?: string;
  author?: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
}> = [
  {
    id: "agm-2024",
    title: "NAAPE Celebrates Successful Annual General Meeting",
    summary: "The National Association of Aircraft Pilots and Engineers (NAAPE) held its 2024 AGM, uniting aviation professionals to inspire growth.",
    content: `
      <p>The National Association of Aircraft Pilots and Engineers (NAAPE) successfully conducted its 2024 Annual General Meeting (AGM) in Lagos. The event saw members and stakeholders gather to discuss progress, innovation, and the future of Nigeria’s aviation sector.</p>
      <ul>
        <li>Keynote speeches from industry leaders</li>
        <li>Panel discussions on pilot and engineering education</li>
        <li>Celebration of long-serving members</li>
      </ul>
      <p>NAAPE continues to drive excellence, support its members, and uphold safety standards across the country.</p>
    `,
    image: "/images/plane.jpg",
    date: "2024-04-14",
    tag: "Events",
    author: {
      name: "NAAPE Media Team",
      avatarUrl: "/images/logos/naape.svg",
      role: "Events",
    },
  },
  {
    id: "workshop-2024",
    title: "Aviation Safety Workshop Highlighted Industry Best Practices",
    summary: "Safety experts gathered at NAAPE HQ to discuss new standards and procedures.",
    content: `
      <p>NAAPE hosted its annual safety workshop, bringing together experts from across the aviation sector to discuss trends, best practices, and the latest regulatory developments. Attendees participated in hands-on sessions and breakout groups to address emerging challenges in aviation safety.</p>
      <p>This year’s focus: <strong>innovation in technical training and digital monitoring</strong> of aircraft.</p>
    `,
    image: "/images/news/naape/safety-workshop.jpg",
    date: "2024-02-18",
    tag: "Events",
    author: {
      name: "NAAPE Media Team",
      avatarUrl: "/images/logos/naape.svg",
      role: "Safety",
    },
  },
  {
    id: "wia-2024",
    title: "Women in Aviation, Inspiring Change",
    summary: "NAAPE hosted an empowering session for women professionals in aviation.",
    content: `
      <p>The Women in Aviation forum, organized by NAAPE, brought together female professionals and students to discuss inclusivity, leadership, and career advancement in Nigerian aviation. The event featured inspiring stories, mentorship, and networking opportunities.</p>
      <blockquote>“Empowering women is not just the right thing to do, it’s essential for the future of our industry.”</blockquote>
    `,
    image: "/images/news/naape/women-in-aviation.jpg",
    date: "2024-03-10",
    tag: "Initiatives",
    author: {
      name: "NAAPE Media Team",
      avatarUrl: "/images/logos/naape.svg",
      role: "Initiatives",
    },
  },
];

// Find news item by id util
function getNewsById(id: string | undefined) {
  if (!id) return null;
  return NEWS.find((item) => item.id === id) || null;
}

export default function NaapeNewsDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Next.js dynamic route params: [id]
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const news = useMemo(() => getNewsById(id), [id]);

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
            onClick={() => router.push("/news/naape")}
          >
            Back to NAAPE News
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
        author={news.author || {
          name: "NAAPE Media Team",
          avatarUrl: "/images/logos/naape.svg"
        }}
        backHref="/news/naape"
      />
    </main>
  );
}
