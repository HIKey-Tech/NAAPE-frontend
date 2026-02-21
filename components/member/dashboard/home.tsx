"use client";

import React from "react";
import { PublicationCard } from "../component/publication.card";
import EventCard from "../component/event.card";
import {
  FaBook,
  FaCalendarAlt,
  FaArrowRight
} from "react-icons/fa";
import { usePublications } from "@/hooks/usePublications";

import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/authcontext";
import Link from "next/link";

const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-br from-primary via-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 mb-10 text-white shadow-xl shadow-primary/20 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none hidden sm:block" />

      <div className="relative z-10 max-w-2xl w-full">
        <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-blue-50 text-sm font-bold tracking-wide uppercase mb-6 shadow-sm border border-white/10">
          Member Dashboard
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
          Welcome back, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-white">{user?.name?.split(' ')[0] || "Member"}</span>!
        </h1>
        <p className="text-blue-100/90 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
          Stay connected with the NAAPE community. Explore the latest insights, connect with peers, and prepare for upcoming events.
        </p>
      </div>

      <div className="relative z-10 w-full sm:w-auto mt-8 sm:mt-0 flex flex-col gap-3">
        <Link
          href="/member/publications/new"
          className="px-8 py-4 bg-white text-primary rounded-xl font-bold shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2 w-full sm:w-64"
        >
          <FaBook size={16} />
          <span>New Publication</span>
        </Link>
        <Link
          href="/member/events"
          className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all text-center flex items-center justify-center gap-2 w-full sm:w-64"
        >
          <FaCalendarAlt size={16} />
          <span>Browse Events</span>
        </Link>
      </div>
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
  return (
    <main className="flex-1 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <WelcomeBanner />
        <RecentPublications />
        <UpcomingEvents />
      </div>
    </main>
  );
};

export default MemberDashboardHome;
