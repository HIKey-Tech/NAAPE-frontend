"use client";
import React, { useMemo } from "react";
import DashboardCard from "../component/dashboardcard";
import PublicationCard from "../component/publication.card";
import EventCard from "../component/event.card";
import CertCard from "../component/cert.card";
import {
  MdAttachMoney,
  MdLibraryBooks,
  MdAssignmentTurnedIn,
  MdWork,
} from "react-icons/md";

import { motion, AnimatePresence } from "framer-motion";
import { usePublications } from "@/hooks/usePublications";

// Dashboard Card Data Types
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
  progress?: number;
};

type EventData = {
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  onRegister: () => void;
  registerLabel: string;
};

// Demo data (would come from props/api in real app)
const dashboardCardsData: DashboardCardData[] = [
  {
    icon: <MdAttachMoney className="text-[#4267E7] text-2xl" />,
    value: 12,
    label: "Publications Submitted",
  },
  {
    icon: <MdLibraryBooks className="text-[#41B079] text-2xl" />,
    value: 4,
    label: "Trainings Enrolled",
  },
  {
    icon: <MdAssignmentTurnedIn className="text-[#F4B645] text-2xl" />,
    value: 5,
    label: "Events Registered",
  },
  {
    icon: <MdWork className="text-[#748095] text-2xl" />,
    value: 3,
    label: "Job Matches",
  },
];

const certificationsData: CertificationData[] = [
  {
    title: "Advanced CRM for Flight Crews",
    startDate: "Nov 27, 2025",
    description:
      "Enhance crew resource management, decision-making, and communication skills in high-stress situations.",
    status: "ongoing",
    progress: 75,
  },
  {
    title: "Advanced CRM for Flight Crews",
    startDate: "Nov 27, 2025",
    description:
      "Enhance crew resource management, decision-making, and communication skills in high-stress situations.",
    status: "pending",
  },
  {
    title: "Advanced CRM for Flight Crews",
    startDate: "Nov 27, 2025",
    description:
      "Enhance crew resource management, decision-making, and communication skills in high-stress situations.",
    status: "completed",
  },
];

const eventsData: EventData[] = [
  {
    title: "Annual Aviation Safety",
    date: "Nov 27, 2025",
    location: "Abuja International Conference Center",
    imageUrl: "/images/plane.jpg",
    onRegister: () => alert("Register for Aviation Safety Event!"),
    registerLabel: "Register",
  },
  {
    title: "Annual Aviation Safety",
    date: "Nov 27, 2025",
    location: "Abuja International Conference Center",
    imageUrl: "/images/plane.jpg",
    onRegister: () => alert("Register for Aviation Safety Event!"),
    registerLabel: "Register",
  },
  {
    title: "Annual Aviation Safety",
    date: "Nov 27, 2025",
    location: "Abuja International Conference Center",
    imageUrl: "/images/plane.jpg",
    onRegister: () => alert("Register for Aviation Safety Event!"),
    registerLabel: "Register",
  },
  {
    title: "Annual Aviation Safety",
    date: "Nov 27, 2025",
    location: "Abuja International Conference Center",
    imageUrl: "/images/plane.jpg",
    onRegister: () => alert("Register for Aviation Safety Event!"),
    registerLabel: "Register",
  },
];

// Animation variants
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.07 },
  },
};

const cardFadeSlide = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 58, damping: 16 },
  },
};

// Section Header Component
type SectionHeaderProps = {
  title: string;
  linkLabel?: string;
  href?: string;
  hideLink?: boolean;
  onLinkClick?: () => void;
  className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  linkLabel = "View All",
  href = "",
  hideLink = false,
  onLinkClick,
  className = "",
}) => (
  <div className={`flex justify-between items-center mb-3 mt-2 ${className}`}>
    <h2 className="text-[17px] sm:text-lg font-semibold text-[#222F43] tracking-tight">
      {title}
    </h2>
    {!hideLink &&
      (href ? (
        <a
          href={href}
          onClick={onLinkClick}
          className="text-[#4267E7] text-[13px] font-medium hover:underline focus:outline-none focus:text-[#2143B7] transition-colors"
          tabIndex={0}
          aria-label={
            typeof linkLabel === "string" ? linkLabel : "Section navigation"
          }
        >
          {linkLabel}
        </a>
      ) : (
        <button
          type="button"
          onClick={onLinkClick}
          className="text-[#4267E7] text-[13px] font-medium hover:underline focus:outline-none focus:text-[#2143B7] transition-colors bg-transparent"
          tabIndex={0}
        >
          {linkLabel}
        </button>
      ))}
  </div>
);

// Horizontal Scroll Utility
const HorizontalScrollContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#d1d5db] scrollbar-track-transparent -mx-2 px-2 ${className}`}
    style={{ WebkitOverflowScrolling: "touch" }}
  >
    {children}
  </div>
);

// Subcomponents for improved clarity and reusability

const DashboardCards: React.FC = () => (
  <>
    {/* Mobile: horizontal scroll */}
    <div className="sm:hidden mb-8">
      <HorizontalScrollContainer>
        <AnimatePresence>
          <motion.div
            className="flex gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {dashboardCardsData.map((card, idx) => (
              <motion.div
                key={idx}
                className="shrink-0 w-[83vw] max-w-xs"
                style={{ minWidth: "200px" }}
                variants={cardFadeSlide as any}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <DashboardCard icon={card.icon} value={card.value} label={card.label} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </HorizontalScrollContainer>
    </div>
    {/* Desktop: grid */}
    <motion.div
      className="hidden sm:grid grid-cols-2 md:grid-cols-4 w-full gap-5 mb-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {dashboardCardsData.map((card, idx) => (
        <motion.div
          key={idx}
          variants={cardFadeSlide as any}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <DashboardCard icon={card.icon} value={card.value} label={card.label} />
        </motion.div>
      ))}
    </motion.div>
  </>
);

const PublicationsSection: React.FC = () => {
  const { data: publications, isPending: loading, error } = usePublications();

  // Memoize for perf
  const pubList = useMemo(() => publications ?? [], [publications]);

  return (
    <section className="mb-10">
      <SectionHeader title="News & Publications" href="/publications" />
      {loading ? (
        <div className="py-8 text-center text-[#8796ad]">Loading publications…</div>
      ) : error ? (
        <div className="py-8 text-center text-red-600">
          Failed to load publications.
        </div>
      ) : pubList.length === 0 ? (
        <div className="py-8 text-center text-gray-400">No publications available right now.</div>
      ) : (
        <>
          {/* Mobile scroll */}
          <div className="sm:hidden">
            <HorizontalScrollContainer>
              <AnimatePresence>
                <motion.div
                  className="flex gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {pubList.map((pub, idx) => (
                    <motion.div
                      key={pub._id ?? idx}
                      className="shrink-0 w-[87vw] max-w-sm"
                      style={{ minWidth: "220px" }}
                      variants={cardFadeSlide as any}
                      whileHover={{ scale: 1.025 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <PublicationCard publication={pub} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </HorizontalScrollContainer>
          </div>
          {/* Desktop grid */}
          <motion.div
            className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {pubList.map((pub, idx) => (
              <motion.div
                key={pub._id ?? idx}
                variants={cardFadeSlide as any}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
              >
                <PublicationCard publication={pub} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </section>
  );
};

const CertificationsSection: React.FC = () => (
  <section className="mb-10">
    <SectionHeader title="Training & Certifications" />
    {/* Mobile: horizontal scroll */}
    <div className="sm:hidden">
      <HorizontalScrollContainer>
        <AnimatePresence>
          <motion.div
            className="flex gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {certificationsData.map((cert, idx) => (
              <motion.div
                key={idx}
                className="shrink-0 w-[87vw] max-w-sm"
                style={{ minWidth: "220px" }}
                variants={cardFadeSlide as any}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
              >
                <CertCard {...cert} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </HorizontalScrollContainer>
    </div>
    {/* Desktop: grid */}
    <motion.div
      className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-4"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {certificationsData.map((cert, idx) => (
        <motion.div
          key={idx}
          variants={cardFadeSlide as any}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.97 }}
        >
          <CertCard {...cert} />
        </motion.div>
      ))}
    </motion.div>
  </section>
);

const EventsSection: React.FC = () => (
  <section>
    <SectionHeader title="Upcoming Events" />
    {/* Mobile: horizontal scroll */}
    <div className="sm:hidden">
      <HorizontalScrollContainer>
        <AnimatePresence>
          <motion.div
            className="flex gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {eventsData.map((ev, idx) => (
              <motion.div
                key={idx}
                className="shrink-0 w-[87vw] max-w-sm"
                style={{ minWidth: "220px" }}
                variants={cardFadeSlide as any}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
              >
                <EventCard {...ev} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </HorizontalScrollContainer>
    </div>
    {/* Desktop: grid */}
    <motion.div
      className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {eventsData.map((ev, idx) => (
        <motion.div
          key={idx}
          variants={cardFadeSlide as any}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.97 }}
        >
          <EventCard {...ev} />
        </motion.div>
      ))}
    </motion.div>
  </section>
);

// Main MemberDashboardHome
const MemberDashboardHome: React.FC = () => {
  return (
    <section className="w-full max-w-full px-2 sm:px-4 py-8">
      {/* Welcome Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="text-[16px] font-medium text-[#212B36]">
          Good Morning, Engr. Akeem!
        </div>
        <div className="text-[13px] text-[#919EAB] mt-0.5">
          Here’s what’s happening in your aviation network today.
        </div>
      </motion.div>
      <DashboardCards />
      <PublicationsSection />
      <CertificationsSection />
      <EventsSection />
    </section>
  );
};

export default MemberDashboardHome;
