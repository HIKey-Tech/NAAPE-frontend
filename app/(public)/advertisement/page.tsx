"use client";
import AdvertisementSection from "@/components/ui/landing/home/advertisement";

export default function AdminAdvertisementPage() {
  return (
    <div>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 800,
          marginTop: 26,
          marginBottom: 18,
          color: "#20294a",
          letterSpacing: 0.11,
          textAlign: "center",
        }}
      >
        Advertisement Section Overview
      </h1>
      <AdvertisementSection />
    </div>
  );
}
