"use client";
import React, { useMemo } from "react";
import DashboardCard from "../component/dashboardcard";
import PublicationCard from "../component/publication.card";
import CertCard from "../component/cert.card";
import {
  MdAttachMoney,
  MdLibraryBooks,
  MdAssignmentTurnedIn,
  MdWork,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { usePublications } from "@/hooks/usePublications";
import { useMemberStats } from "@/hooks/useMembers";
import { useAuth } from "@/context/authcontext";
import { Skeleton } from "@/components/ui/skeleton";

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
  progress?: number;
};
type EventCardProps = {
  id?: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  onRegister?: () => void;
  registerLabel: string;
  isPaid?: boolean;
  price?: number;
  currency?: string;
  description?: string;
  [key: string]: any;
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

const eventsData: EventCardProps[] = [
  {
    title: "Annual Aviation Safety",
    date: "Nov 27, 2025",
    location: "Abuja International Conference Center",
    imageUrl: "/images/plane.jpg",
    onRegister: () => alert("Register for Aviation Safety Event!"),
    registerLabel: "Register",
    isPaid: false,
    price: 0,
    currency: "NGN",
  },
  {
    title: "Crew Resource Optimization",
    date: "Jan 12, 2026",
    location: "Lagos Expo Center",
    imageUrl: "/images/plane.jpg",
    onRegister: () => alert("Register for Crew Resource Event!"),
    registerLabel: "Join",
    isPaid: true,
    price: 5000,
    currency: "NGN",
  },
  {
    title: "Safety Leadership Masterclass",
    date: "Mar 22, 2026",
    location: "Online Webinar",
    imageUrl: "/images/plane.jpg",
    onRegister: () => alert("Register for Leadership Masterclass!"),
    registerLabel: "Register",
    isPaid: false,
    price: 0,
    currency: "NGN",
  },
  {
    title: "Women In Aviation",
    date: "Jul 9, 2026",
    location: "Port Harcourt Hub",
    imageUrl: "/images/plane.jpg",
    onRegister: () => alert("Register for Women In Aviation Event!"),
    registerLabel: "Attend",
    isPaid: true,
    price: 2000,
    currency: "NGN",
  },
];

// --- Animation Variants ---
// SUBTLE animation variant: reduce movement and bounciness, smooth fade, short movement, milder scale
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

const cardFadeSlide = {
  hidden: { opacity: 0, y: 10, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "tween", duration: 0.3, ease: [0.36, 0, 0.66, -0.56] },
  },
};

// --- Utility Components ---
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
            typeof linkLabel === "string"
              ? linkLabel
              : "Section navigation"
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

const HorizontalScrollContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={
      `flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#d1d5db] scrollbar-track-transparent -mx-2 px-2 ${className}`
    }
    style={{ WebkitOverflowScrolling: "touch" }}
  >
    {children}
  </div>
);

// --- Skeletons ---
const DashboardCardSkeleton: React.FC = () => (
  <div className="shrink-0 w-[83vw] max-w-xs min-w-[200px] rounded-xl border bg-white px-5 py-6 flex flex-col items-start justify-between space-y-3 shadow-sm">
    <Skeleton className="h-8 w-8 rounded" />
    <Skeleton className="h-7 w-24 rounded" />
    <Skeleton className="h-5 w-32 rounded" />
  </div>
);

const PublicationCardSkeleton: React.FC = () => (
  <div className="shrink-0 w-[87vw] max-w-sm min-w-[220px] bg-white rounded-xl border px-4 py-4 space-y-3 shadow-sm">
    <Skeleton className="h-40 w-full rounded-lg" />
    <Skeleton className="h-5 w-32 rounded" />
    <Skeleton className="h-4 w-20 rounded" />
    <Skeleton className="h-4 w-2/3 rounded" />
  </div>
);

// --- Dashboard Cards Section ---
const DashboardCards: React.FC = () => {
  const { data: stats, isPending, error } = useMemberStats();

  const cards: DashboardCardData[] = [
    {
      icon: <MdAttachMoney className="text-[#4267E7] text-2xl" />,
      value: stats?.publicationCount ?? 0,
      label: "Publications Submitted",
    },
    {
      icon: <MdLibraryBooks className="text-[#41B079] text-2xl" />,
      value: stats?.trainingsEnrolled ?? 0,
      label: "Trainings Enrolled",
    },
    {
      icon: <MdAssignmentTurnedIn className="text-[#F4B645] text-2xl" />,
      value: stats?.eventsRegistered ?? 0,
      label: "Events Registered",
    },
    {
      icon: <MdWork className="text-[#748095] text-2xl" />,
      value: stats?.jobMatches ?? 0,
      label: "Job Matches",
    },
  ];

  if (error) {
    return (
      <div className="w-full text-center text-red-500 mb-8">
        Failed to load dashboard stats.
      </div>
    );
  }

  if (isPending) {
    return (
      <>
        <div className="sm:hidden mb-8">
          <HorizontalScrollContainer>
            {[...Array(3)].map((_, idx) => (
              <DashboardCardSkeleton key={idx} />
            ))}
          </HorizontalScrollContainer>
        </div>
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 w-full gap-5 mb-8">
          {[...Array(4)].map((_, idx) => (
            <DashboardCardSkeleton key={idx} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
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
              {cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  className="shrink-0 w-[83vw] max-w-xs"
                  style={{ minWidth: "200px" }}
                  variants={cardFadeSlide as any}
                  // Subtle: little or no scale increase on hover/tap
                  whileHover={{ scale: 1.012 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DashboardCard
                    icon={card.icon}
                    value={card.value}
                    label={card.label}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </HorizontalScrollContainer>
      </div>
      <motion.div
        className="hidden sm:grid grid-cols-2 md:grid-cols-4 w-full gap-5 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={cardFadeSlide as any}
            whileHover={{ scale: 1.012 }}
            whileTap={{ scale: 0.985 }}
          >
            <DashboardCard
              icon={card.icon}
              value={card.value}
              label={card.label}
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

// --- Publications Section ---
const PublicationsSection: React.FC = () => {
  const { data: publications, isPending: loading, error } = usePublications();
  const pubList = useMemo(() => publications ?? [], [publications]);

  return (
    <section className="mb-10">
      <SectionHeader
        title="Publications"
        href="/forum"
        linkLabel="Join The Conversation"
      />
      {loading ? (
        <>
          <div className="sm:hidden">
            <HorizontalScrollContainer>
              {[...Array(2)].map((_, idx) => (
                <PublicationCardSkeleton key={idx} />
              ))}
            </HorizontalScrollContainer>
          </div>
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <PublicationCardSkeleton key={idx} />
            ))}
          </div>
        </>
      ) : error ? (
        <div className="py-8 text-center text-red-600">
          Failed to load publications.
        </div>
      ) : pubList.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          No publications available right now.
        </div>
      ) : (
        <>
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
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <PublicationCard publication={pub} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </HorizontalScrollContainer>
          </div>
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
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
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

// --- Certifications Section ---
const CertificationsSection: React.FC = () => (
  <section className="mb-10">
    <SectionHeader title="Training & Certifications" />
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
                whileHover={{ scale: 1.012 }}
                whileTap={{ scale: 0.985 }}
              >
                <CertCard {...cert} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </HorizontalScrollContainer>
    </div>
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
          whileHover={{ scale: 1.012 }}
          whileTap={{ scale: 0.985 }}
        >
          <CertCard {...cert} />
        </motion.div>
      ))}
    </motion.div>
  </section>
);

// --- EventCard Component ---
const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  location,
  imageUrl,
  onRegister,
  registerLabel,
  isPaid = false,
  price = 0,
  currency = "NGN",
}) => (
  <div
    className="flex flex-col bg-white border rounded-xl shadow-sm overflow-hidden min-h-[310px] group hover:shadow-md transition-shadow duration-150"
    data-event-id={id}
  >
    <div className="relative w-full h-44 bg-gray-100">
      <img
        src={imageUrl}
        alt={title}
        className="object-cover w-full h-full"
        loading="lazy"
        draggable={false}
      />
      {isPaid ? (
        <span className="absolute top-2 right-2 bg-[#4267E7] text-white rounded px-2 py-0.5 text-xs font-bold shadow-sm">
          {price > 0 ? (
            <>
              {currency} {price.toLocaleString()}
            </>
          ) : (
            "Paid"
          )}
        </span>
      ) : (
        <span className="absolute top-2 right-2 bg-[#41B079] text-white rounded px-2 py-0.5 text-xs font-bold shadow-sm">
          Free
        </span>
      )}
    </div>
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>
          <svg width="16" height="16" fill="none" className="inline align-middle">
            <circle cx="8" cy="8" r="8" fill="#4267E7" fillOpacity="0.09" />
            <path d="M5.833 8.417L7.25 9.833l3-3" stroke="#4267E7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-semibold">{date}</span>
      </div>
      <h3 className="text-base font-bold text-[#212B36] mt-1 mb-2 leading-snug line-clamp-2">{title}</h3>
      <div className="flex items-center gap-1 text-xs text-[#748095] mb-3">
        <svg width="15" height="15" fill="none" className="inline align-middle mt-[-2px]">
          <circle cx="7.5" cy="7.5" r="7.5" fill="#F7C873" fillOpacity="0.16" />
          <path d="M12 11.25V10.5A1.5 1.5 0 0010.5 9h-6A1.5 1.5 0 003 10.5v.75" stroke="#F4B645" strokeWidth="1" strokeLinecap="round" />
          <circle cx="7.5" cy="6.25" r="2.25" stroke="#F4B645" strokeWidth="1" />
        </svg>
        <span className="ml-0.5">{location}</span>
      </div>
      <div className="mt-auto flex">
        <button
          type="button"
          className="inline-flex items-center justify-center bg-[#4267E7] hover:bg-[#2143B7] text-white font-medium text-sm rounded-lg px-4 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4267E7]"
          onClick={onRegister}
        >
          {registerLabel}
        </button>
      </div>
    </div>
  </div>
);

// --- Events Section ---
const EventsSection: React.FC = () => (
  <section>
    <SectionHeader title="Upcoming Events" />
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
                key={ev.id ?? idx}
                className="shrink-0 w-[87vw] max-w-sm"
                style={{ minWidth: "220px" }}
                variants={cardFadeSlide as any}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
              >
                <EventCard {...ev} id={ev.id ?? `event-${idx}`} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </HorizontalScrollContainer>
    </div>
    <motion.div
      className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {eventsData.map((ev, idx) => (
        <motion.div
          key={ev.id ?? idx}
          variants={cardFadeSlide as any}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.985 }}
        >
          <EventCard {...ev} id={ev.id ?? `event-${idx}`} />
        </motion.div>
      ))}
    </motion.div>
  </section>
);

// --- Main Dashboard Home ---
const MemberDashboardHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <main className="flex-1 pb-8">
      <section className="w-full max-w-full px-2 sm:px-4 py-8">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.36, 0, 0.66, -0.56] }}
        >
          <div className="text-[16px] font-medium text-[#212B36]">
            {user?.name ? (
              <>Good to see you, <span className="font-semibold">{user.name}</span>!</>
            ) : (
              <>Welcome!</>
            )}
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
    </main>
  );
};

export default MemberDashboardHome;
