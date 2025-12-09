"use client";
import React from "react";
import DashboardCard from "../component/dashboardcard";
import PublicationCard from "../component/publication.card";
import CertCard from "../component/cert.card";
import EventCard from "../component/event.card";
import {
  MdLibraryBooks,
  MdSchool,
  MdEventAvailable,
  MdWork,
} from "react-icons/md";
import { usePublications } from "@/hooks/usePublications";
import { useMemberStats } from "@/hooks/useMembers";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/authcontext";

// --- Types ---
type DashboardCardData = {
  icon: React.ReactNode;
  value: number;
  label: string;
};
type CertificationStatus = "pending" | "ongoing" | "completed";
type CertificationData = {
  title: string;
  startDate: string;
  description: string;
  status: CertificationStatus;
};

// --- Dummy Data ---
const certificationsData: CertificationData[] = [
  {
    title: "Human Factors in Aviation Safety",
    startDate: "Oct 13, 2024",
    description:
      "Understand human limitations and performance in aviation to minimize errors and improve operational safety.",
    status: "completed",
  },
  {
    title: "Risk Assessment & Decision Making",
    startDate: "Feb 2, 2025",
    description:
      "Master essential risk evaluation methods and real-time decision strategies for safe flight operations.",
    status: "completed",
  },
  {
    title: "Fatigue Management Strategies",
    startDate: "May 19, 2025",
    description:
      "Learn how to recognize, mitigate, and manage fatigue to ensure enhanced crew alertness and well-being.",
    status: "completed",
  },
];

// --- Dashboard Cards Section ---
const DashboardCards: React.FC = () => {
  const { data: stats, isPending, error } = useMemberStats();
  const metrics: DashboardCardData[] = [
    {
      icon: <MdLibraryBooks size={32} color="#1843BF" />,
      value: stats?.publicationCount ?? 0,
      label: "Publications",
    },
    {
      icon: <MdSchool size={32} color="#089669" />,
      value: stats?.trainingsEnrolled ?? 0,
      label: "Trainings",
    },
    {
      icon: <MdEventAvailable size={32} color="#DB8801" />,
      value: stats?.eventsRegistered ?? 0,
      label: "Events",
    },
    {
      icon: <MdWork size={32} color="#4D5770" />,
      value: stats?.jobMatches ?? 0,
      label: "Jobs",
    },
  ];

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold py-4 bg-white rounded-xl shadow-sm">
        Couldn't fetch stats.
      </div>
    );

  return (
    <section aria-label="Dashboard summary cards" className="mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {isPending
          ? [...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#e5eaf2] bg-white p-5 flex flex-col items-center shadow-xs animate-pulse transition"
              >
                <div className="bg-gray-200 rounded-full w-12 h-12 mb-3" />
                <div className="w-20 h-5 bg-gray-100 mb-2 rounded" />
                <div className="w-12 h-4 bg-gray-100 rounded" />
              </div>
            ))
          : metrics.map((card, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#e5eaf2] bg-white p-5 flex flex-col items-center shadow-sm hover:shadow-md transition"
              >
                <div className="mb-2">{card.icon}</div>
                <div className="font-extrabold text-2xl mt-1 text-[#1843BF] tracking-tight">
                  {card.value}
                </div>
                <div className="text-[14px] text-[#4D5770] font-medium tracking-wide mt-1 uppercase">
                  {card.label}
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

// --- Section Headline component ---
const SectionHeading: React.FC<{
  title: string;
  children?: React.ReactNode;
}> = ({ title, children }) => (
  <div className="flex items-center justify-between mb-5">
    <h2 className="font-extrabold text-xl text-[#15407C] tracking-tight flex-1 select-none">
      {title}
    </h2>
    {children}
  </div>
);

// --- Publications Section ---
const PublicationsSection: React.FC = () => {
  const { data: publications, isPending: loading, error } = usePublications();

  return (
    <section className="mb-8 bg-white rounded-2xl py-6 px-4 shadow-sm border border-[#e6eaf1]">
      <SectionHeading title="Recent Publications" />
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl border bg-gray-100 p-4 h-36 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-5">
          Couldn't load publications.
        </div>
      ) : publications && publications.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {publications.slice(0, 3).map((pub: any, idx: number) => (
            <PublicationCard
              key={pub._id ?? idx}
              publication={pub}
              className="w-full"
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-[#8BA4C9] py-6 font-medium">
          No publications yet.
        </div>
      )}
    </section>
  );
};

// --- Certifications Section ---
const CertificationsSection: React.FC = () => (
  <section className="mb-8 bg-white rounded-2xl py-6 px-4 shadow-sm border border-[#e6eaf1]">
    <SectionHeading title="Certifications" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {certificationsData.map((cert, idx) => (
        <CertCard key={idx} {...cert} />
      ))}
    </div>
  </section>
);

// --- Events Section ---
const EventsSection: React.FC = () => {
  const { data: events, isPending, error } = useEvents();

  return (
    <section className="mb-8 bg-white rounded-2xl py-6 px-4 shadow-sm border border-[#e6eaf1]">
      <SectionHeading title="Upcoming Events" />
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl border bg-gray-100 p-4 h-44 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-5">
          Couldn't load events.
        </div>
      ) : Array.isArray(events) && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {events.slice(0, 3).map((ev: any, idx: number) => (
            <EventCard
              key={ev._id ?? idx}
              {...ev}
              className="w-full"
              id={ev._id?.toString() ?? `${idx}`}
              // registerLabel={ev.registerLabel || "Register"}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-[#8BA4C9] py-6 font-medium">
          No upcoming events.
        </div>
      )}
    </section>
  );
};

// --- Main Dashboard Home ---
const MemberDashboardHome: React.FC = () => {
  useAuth(); // Ensure user exists

  return (
    <main className="flex-1 pb-10 bg-[#f5f7fb] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-8 pt-8 pb-4">
        <DashboardCards />
        <div className="space-y-7">
          <PublicationsSection />
          <CertificationsSection />
          <EventsSection />
        </div>
      </div>
    </main>
  );
};

export default MemberDashboardHome;
