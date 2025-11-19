"use client";

import CustomHeroSection from "@/components/ui/custom/hero.section";

const slides = [
    {
        src: "/images/plane.jpg",
        alt: "Airplane parked at sunset near control tower for NAAPE",
        caption: "From our latest aviation event — Lagos, 2024"
    },
    {
        src: "/images/leader.png",
        alt: "NAAPE conference in session with attendees",
        caption: "Annual NAAPE Conference — Abuja, 2023"
    },
    {
        src: "/images/event2.jpg",
        alt: "Group photo of NAAPE members",
        caption: "Celebrating Our Community — Members' Meetup"
    }
];

export default function GalleryHeroSection() {
    return (
        <CustomHeroSection
            heading="NAAPE Media Gallery"
            subheading={
                "Dive into our curated collection of photos, videos, and podcasts—featuring memorable events, vibrant moments, and inspiring stories from our members."
            }
            slides={slides}
        />
    );
}
