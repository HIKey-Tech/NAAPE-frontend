"use client";

import Link from "next/link";
import { BookOpen, Users } from "lucide-react";

export default function PublicationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Publications
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of publications from NAAPE and our members
          </p>
        </div>

        {/* Publication Categories */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* NAAPE Publications */}
          <Link
            href="/publication/naape"
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3 group-hover:text-[#003366] transition-colors">
                NAAPE Publications
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Official publications, reports, and documents from the National Association of Aircraft Pilots and Engineers
              </p>
              <div className="mt-6 flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                View Publications
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD600]/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          </Link>

          {/* Member Publications */}
          <Link
            href="/publication/members"
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#FFD600]/20 rounded-full mb-6 group-hover:bg-[#FFD600]/30 transition-colors">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3 group-hover:text-[#003366] transition-colors">
                Member Publications
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Research papers, articles, and contributions from our esteemed members and aviation professionals
              </p>
              <div className="mt-6 flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                View Publications
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
