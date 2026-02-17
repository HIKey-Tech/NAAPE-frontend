"use client";

import React from "react";
import { PublicationCard } from "../component/publication.card";
import EventCard from "../component/event.card";
import {
  FaBook,
  FaCalendarAlt,
  FaBriefcase,
  FaArrowRight
} from "react-icons/fa";
import { usePublications } from "@/hooks/usePublications";
import { useMemberStats } from "@/hooks/useMembers";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/authcontext";
import Link from "next/link";

// --- Components ---

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass
}: {
  label: string,
  value: number,
  icon: React.ElementType,
  colorClass: string,
  bgClass: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1 group-hover:text-primary transition-colors">{value}</h3>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

const DashboardStats: React.FC = () => {
  const { data: stats, isPending } = useMemberStats();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const items = [
    { label: "Publications", value: stats?.publicationCount ?? 0, icon: FaBook, color: "text-primary", bg: "bg-primary/5" },
    { label: "Events", value: stats?.eventsRegistered ?? 0, icon: FaCalendarAlt, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Jobs", value: stats?.jobMatches ?? 0, icon: FaBriefcase, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      {items.map((item) => (
        <StatCard
          key={item.label}
          {...item}
          colorClass={item.color}
          bgClass={item.bg}
        />
      ))}
    </div>
  );
};

const SectionHeader = ({ title, href }: { title: string, href?: string }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
    {href && (
      <Link href={href} className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group">
        View All <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
);

const RecentPublications: React.FC = () => {
  const { data: publications, isPending, error } = usePublications();

  return (
    <section className="mb-12">
      <SectionHeader title="Recent Publications" href="/publications" />

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-xl text-center text-sm font-medium">Failed to load publications</div>
      ) : publications && publications.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.slice(0, 3).map((pub: any) => (
            <PublicationCard key={pub._id} publication={pub} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
            <FaBook />
          </div>
          <p className="text-slate-500 font-medium">No publications found</p>
        </div>
      )}
    </section>
  );
};

const UpcomingEvents: React.FC = () => {
  const { data: events, isPending, error } = useEvents();

  return (
    <section className="mb-8">
      <SectionHeader title="Upcoming Events" href="/member/events" />

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-xl text-center text-sm font-medium">Failed to load events</div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((ev: any) => (
            <EventCard
              key={ev._id}
              {...ev}
              id={ev._id}
              className="w-full h-full"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
            <FaCalendarAlt />
          </div>
          <p className="text-slate-500 font-medium">No upcoming events</p>
        </div>
      )}
    </section>
  );
};

const MemberDashboardHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <main className="flex-1 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-2 text-lg">Welcome back, {user?.name?.split(' ')[0] || "Member"}</p>
        </div>

        <DashboardStats />
        <RecentPublications />
        <UpcomingEvents />
      </div>
    </main>
  );
};

export default MemberDashboardHome;
