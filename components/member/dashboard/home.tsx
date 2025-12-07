"use client";
import React, { useMemo } from "react";
import DashboardCard from "../component/dashboardcard";
import PublicationCard from "../component/publication.card";
import CertCard from "../component/cert.card";
import {
  MdLibraryBooks,
  MdSchool,
  MdEventAvailable,
  MdWork,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { usePublications } from "@/hooks/usePublications";
import { useMemberStats } from "@/hooks/useMembers";
import { useAuth } from "@/context/authcontext";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "../component/event.card";

// --- Types ---
type DashboardCardData = {
  icon: React.ReactNode;
  value: number;
  label: string;
  highlight: string;
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
    date: "2025-11-27T09:00:00Z",
    location: "Abuja International Conference Center",
    imageUrl: "/images/plane.jpg",
    description: "The premier aviation safety event.",
    isPaid: false,
    price: 0,
    currency: "NGN",
    id: "event-1",
    registerLabel: "",
  },
  {
    title: "Crew Resource Optimization",
    date: "2026-01-12T13:00:00Z",
    location: "Lagos Expo Center",
    imageUrl: "/images/plane.jpg",
    description: "Maximize your crew efficiency.",
    isPaid: true,
    price: 5000,
    currency: "NGN",
    id: "event-2",
    registerLabel: "",
  },
  {
    title: "Safety Leadership Masterclass",
    date: "2026-03-22T15:00:00Z",
    location: "Online Webinar",
    imageUrl: "/images/plane.jpg",
    description: "Become a leader in aviation safety.",
    isPaid: false,
    price: 0,
    currency: "NGN",
    id: "event-3",
    registerLabel: "",
  },
  {
    title: "Women In Aviation",
    date: "2026-07-09T10:00:00Z",
    location: "Port Harcourt Hub",
    imageUrl: "/images/plane.jpg",
    description: "Celebrating women leaders in aviation.",
    isPaid: true,
    price: 2000,
    currency: "NGN",
    id: "event-4",
    registerLabel: "",
  },
];

// --- Animation Variants ---
const STAGGER_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.02 },
  },
};

const CARD_BOUNCE = {
  hidden: { opacity: 0, y: 24, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 26, duration: 0.5 },
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
  <div className={`flex justify-between items-center mb-4 mt-7 px-4 sm:px-0 ${className}`}>
    <motion.h2
      className="text-xl sm:text-2xl font-extrabold text-[#19223B] tracking-tight leading-tight relative"
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 140 }}
    >
      {title}
      <motion.span
        layoutId={`${title}-underline`}
        className="block h-0.5 mt-1 rounded bg-gradient-to-r from-[#4267E7] to-[#F4B645] w-12"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.23, duration: 0.4, type: "tween" }}
      />
    </motion.h2>
    {!hideLink &&
      (href ? (
        <a
          href={href}
          onClick={onLinkClick}
          className="text-[#4267E7] text-xs sm:text-sm font-semibold hover:underline focus:outline-none focus:text-[#2143B7] transition-colors px-1"
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
          className="text-[#4267E7] text-xs sm:text-sm font-semibold hover:underline focus:outline-none focus:text-[#2143B7] transition-colors bg-transparent px-1"
          tabIndex={0}
        >
          {linkLabel}
        </button>
      ))}
  </div>
);

const SectionDivider: React.FC<{ className?: string }> = ({ className = "" }) => (
  <motion.hr
    className={`border-t border-gray-100 my-7 sm:my-10 ${className}`}
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.44, delay: 0.04 }}
    style={{ transformOrigin: "left" }}
  />
);

const HorizontalScrollContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={
      `flex gap-5 overflow-x-auto scrollbar-thin scrollbar-thumb-[#d1d5db] scrollbar-track-transparent -mx-2 px-4 ${className}`
    }
    style={{ WebkitOverflowScrolling: "touch" }}
  >
    {children}
  </div>
);

// --- Skeletons ---
const DashboardCardSkeleton: React.FC = () => (
  <motion.div
    className="shrink-0 w-[92vw] max-w-[260px] min-w-[210px] rounded-2xl border bg-white px-6 py-8 flex flex-col items-start justify-between space-y-3 mx-auto"
    initial={{ scale: 0.96, opacity: 0.5 }}
    animate={{ scale: [0.96, 1.06, 0.99, 1], opacity: [0.5, 1] }}
    transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
  >
    <Skeleton className="h-10 w-10 rounded" />
    <Skeleton className="h-8 w-32 rounded" />
    <Skeleton className="h-5 w-36 rounded" />
  </motion.div>
);

const PublicationCardSkeleton: React.FC = () => (
  <motion.div
    className="shrink-0 w-full max-w-full min-w-[230px] bg-white rounded-2xl border px-4 py-7 space-y-4 mx-auto"
    initial={{ scale: 0.96, opacity: 0.5 }}
    animate={{ scale: [0.96, 1.04, 0.99, 1], opacity: [0.5, 1] }}
    transition={{ repeat: Infinity, duration: 2.4, repeatType: "mirror" }}
  >
    <Skeleton className="h-40 w-full rounded-lg" />
    <Skeleton className="h-5 w-32 rounded" />
    <Skeleton className="h-4 w-20 rounded" />
    <Skeleton className="h-4 w-2/3 rounded" />
  </motion.div>
);

// --- Dashboard Cards Section ---
const DashboardCards: React.FC = () => {
  const { data: stats, isPending, error } = useMemberStats();

  const metrics: DashboardCardData[] = [
    {
      icon: <MdLibraryBooks className="text-[#4267E7] text-3xl" />,
      value: stats?.publicationCount ?? 0,
      label: "Publications Submitted",
      highlight: "Share Your Voice",
    },
    {
      icon: <MdSchool className="text-[#41B079] text-3xl" />,
      value: stats?.trainingsEnrolled ?? 0,
      label: "Trainings Enrolled",
      highlight: "Keep Leveling Up!",
    },
    {
      icon: <MdEventAvailable className="text-[#F4B645] text-3xl" />,
      value: stats?.eventsRegistered ?? 0,
      label: "Events Registered",
      highlight: "Stay In The Loop",
    },
    {
      icon: <MdWork className="text-[#748095] text-3xl" />,
      value: stats?.jobMatches ?? 0,
      label: "Job Matches",
      highlight: "Open New Doors",
    },
  ];

  if (error) {
    return (
      <motion.div
        className="w-full text-center text-red-500 font-semibold mb-8"
        initial={{ y: -20, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Oops! Couldn't fetch your dashboard stats. <span className="animate-pulse">🚨</span>
      </motion.div>
    );
  }

  if (isPending) {
    return (
      <>
        <div className="sm:hidden mb-6 pl-1 pr-2">
          <HorizontalScrollContainer>
            {[...Array(3)].map((_, idx) => (
              <DashboardCardSkeleton key={idx} />
            ))}
          </HorizontalScrollContainer>
        </div>
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 w-full gap-7 mb-8 px-2 justify-items-center">
          {[...Array(4)].map((_, idx) => (
            <DashboardCardSkeleton key={idx} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sm:hidden mb-6 pl-1 pr-2">
        <HorizontalScrollContainer>
          <AnimatePresence>
            <motion.div
              className="flex gap-5"
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {metrics.map((card, idx) => (
                <motion.div
                  key={idx}
                  className="shrink-0 w-[92vw] max-w-[260px] min-w-[210px] mx-auto"
                  variants={CARD_BOUNCE as any}
                  whileHover={{ scale: 1.054 }}
                  whileTap={{ scale: 0.987 }}
                  transition={{ type: "spring", bounce: 0.32 }}
                >
                  <DashboardCard
                    icon={card.icon}
                    value={card.value}
                    label={card.label}
                  />
                  <motion.div
                    className="mt-3 text-xs font-medium text-[#4267E7] opacity-75 flex items-center gap-1 pl-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .27 + idx * 0.1, duration: 0.36 }}
                  >
                    <span role="img" aria-label="star">⭐</span>
                    {card.highlight}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </HorizontalScrollContainer>
      </div>
      <motion.div
        className="hidden sm:grid grid-cols-2 md:grid-cols-4 w-full gap-6 mb-9 px-2 justify-items-center"
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="show"
      >
        {metrics.map((card, idx) => (
          <motion.div
            key={idx}
            variants={CARD_BOUNCE as any}
            whileHover={{ scale: 1.045 }}
            whileTap={{ scale: 0.984 }}
            className="w-full max-w-[260px] min-w-[210px] flex flex-col items-center"
            transition={{ type: "spring", bounce: 0.34 }}
          >
            <DashboardCard
              icon={card.icon}
              value={card.value}
              label={card.label}
            />
            <motion.div
              className="mt-3 text-xs font-medium text-[#4267E7] opacity-80 text-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .285 + idx * 0.07, duration: 0.33 }}
            >
              <span role="img" aria-label="star">⭐</span>
              {card.highlight}
            </motion.div>
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
    <section className="mb-14">
      <SectionDivider />
      <div className="px-4 sm:px-0">
        <SectionHeader
          title="Publications"
          href="/forum"
          linkLabel="Join The Conversation"
        />
      </div>
      {loading ? (
        <>
          <div className="sm:hidden">
            <HorizontalScrollContainer>
              {[...Array(2)].map((_, idx) => (
                <PublicationCardSkeleton key={idx} />
              ))}
            </HorizontalScrollContainer>
          </div>
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center px-2 w-full">
            {[...Array(4)].map((_, idx) => (
              <PublicationCardSkeleton key={idx} />
            ))}
          </div>
        </>
      ) : error ? (
        <motion.div
          className="py-7 text-base text-center text-red-600 font-semibold"
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="mr-1">🚫</span> Publications couldn't load. Try refreshing!
        </motion.div>
      ) : pubList.length === 0 ? (
        <motion.div
          className="py-8 text-base text-center text-gray-400 font-semibold"
          initial={{ opacity: 0.25, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span role="img" aria-label="paper">📰</span> No publications available right now. Be the first to contribute!
        </motion.div>
      ) : (
        <>
          <div className="sm:hidden w-full">
            <HorizontalScrollContainer>
              <AnimatePresence>
                <motion.div
                  className="flex gap-5 w-full"
                  variants={STAGGER_CONTAINER}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {pubList.map((pub, idx) => (
                    <motion.div
                      key={pub._id ?? idx}
                      className="shrink-0 w-full max-w-full min-w-[230px] mx-auto flex flex-col"
                      variants={CARD_BOUNCE as any}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ type: "spring", bounce: 0.28 }}
                    >
                      <PublicationCard publication={pub} className="w-full" />
                      <motion.div
                        className="mt-3 text-xs italic text-[#41B079] flex gap-1 items-center pl-2"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + idx * 0.07, duration: 0.28 }}
                      >
                        <span>💡</span>
                        {pub.title ? <>"{pub.title}"</> : "Join the conversation!"}
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </HorizontalScrollContainer>
          </div>
          <motion.div
            className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center px-2 w-full"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
          >
            {pubList.map((pub, idx) => (
              <motion.div
                key={pub._id ?? idx}
                variants={CARD_BOUNCE as any}
                whileHover={{ scale: 1.017 }}
                whileTap={{ scale: 0.989 }}
                className="w-full max-w-full min-w-[230px] flex flex-col justify-center"
                transition={{ type: "spring", bounce: 0.25 }}
              >
                <PublicationCard publication={pub} className="w-full" />
                <motion.div
                  className="mt-3 text-xs italic text-[#41B079] text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 + idx * 0.06, duration: 0.25 }}
                >
                  {pub.title ? <>💡&nbsp;"{pub.title}"</> : "Join the conversation!"}
                </motion.div>
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
  <section className="mb-14">
    <SectionDivider />
    <div className="px-4 sm:px-0">
      <SectionHeader title="Training & Certifications" />
    </div>
    <div className="sm:hidden">
      <HorizontalScrollContainer>
        <AnimatePresence>
          <motion.div
            className="flex gap-5"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {certificationsData.map((cert, idx) => (
              <motion.div
                key={idx}
                className="shrink-0 w-[94vw] max-w-[320px] min-w-[230px] mx-auto"
                variants={CARD_BOUNCE as any}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.987 }}
                transition={{ type: "spring", bounce: 0.30 }}
              >
                <CertCard {...cert} />
                <motion.div
                  className="mt-3 text-xs font-medium text-[#41B079] flex items-center gap-1 pl-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 + idx * .09, duration: .22 }}
                >
                  <span>🎓</span>
                  {cert.status === "completed" ? "Certified!" : "In Progress"}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </HorizontalScrollContainer>
    </div>
    <motion.div
      className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-5 justify-items-center px-2"
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="show"
    >
      {certificationsData.map((cert, idx) => (
        <motion.div
          key={idx}
          variants={CARD_BOUNCE as any}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.988 }}
          className="w-full max-w-[320px] min-w-[230px] flex flex-col items-center"
          transition={{ type: "spring", bounce: 0.29 }}
        >
          <CertCard {...cert} />
          <motion.div
            className="mt-3 text-xs font-medium text-[#41B079] text-center"
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.10 + idx * .08, duration: .19 }}
          >
            🎓 {cert.status === "completed" ? "Certified!" : "In Progress"}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

// --- Events Section ---
const EventsSection: React.FC = () => (
  <section className="mb-2">
    <SectionDivider />
    <div className="px-4 sm:px-0">
      <SectionHeader title="Upcoming Events" />
    </div>
    <div className="sm:hidden">
      <HorizontalScrollContainer>
        <AnimatePresence>
          <motion.div
            className="flex gap-5"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {eventsData.map((ev, idx) => (
              <motion.div
                key={ev.id ?? idx}
                className="shrink-0 w-[94vw] max-w-[320px] min-w-[230px] mx-auto"
                variants={CARD_BOUNCE as any}
                whileHover={{ scale: 1.016 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", bounce: 0.23 }}
              >
                <EventCard
                  className="w-full"
                  id={ev.id ?? `${idx}`}
                  title={ev.title}
                  date={ev.date}
                  location={ev.location}
                  imageUrl={ev.imageUrl}
                  registerLabel={ev.isPaid && typeof ev.price === 'number' && ev.price > 0
                    ? ev.registerLabel || "Register"
                    : (ev.registerLabel || "Register")}
                  isPaid={!!ev.isPaid}
                  price={typeof ev.price === 'number' ? ev.price : 0}
                  currency={ev.currency ?? ''}
                  description={ev.description}
                />
                <motion.div
                  className="mt-3 text-xs font-semibold text-[#F4B645] flex items-center gap-1 pl-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.19 + idx * .08, duration: .18 }}
                >
                  <span role="img" aria-label="ticket">🎫</span> See You There!
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </HorizontalScrollContainer>
    </div>
    <motion.div
      className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center px-2"
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="show"
    >
      {eventsData.map((ev, idx) => (
        <motion.div
          key={ev.id ?? idx}
          variants={CARD_BOUNCE as any}
          whileHover={{ scale: 1.019 }}
          whileTap={{ scale: 0.986 }}
          className="w-full max-w-[320px] min-w-[230px] flex flex-col items-center"
          transition={{ type: "spring", bounce: 0.23 }}
        >
          <EventCard
            className="w-full"
            id={ev.id ?? `${idx}`}
            title={ev.title}
            date={ev.date}
            location={ev.location}
            imageUrl={ev.imageUrl}
            registerLabel={ev.isPaid && typeof ev.price === 'number' && ev.price > 0
              ? ev.registerLabel || "Register"
              : (ev.registerLabel || "Register")}
            isPaid={!!ev.isPaid}
            price={typeof ev.price === 'number' ? ev.price : 0}
            currency={ev.currency ?? ''}
            description={ev.description}
          />
          <motion.div
            className="mt-3 text-xs font-semibold text-[#F4B645] text-center flex items-center gap-1 justify-center"
            initial={{ opacity: 0, y: 11 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + idx * .06, duration: .14 }}
          >
            <span role="img" aria-label="ticket">🎫</span> See You There!
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

// --- Main Dashboard Home ---
const GREETING_EMOJIS = [
  "✈️", "🛩️", "🛬", "🌍", "🚀", "🎉", "🙌", "💼", "☁️"
];

function getRandomGreetingEmoji() {
  return GREETING_EMOJIS[Math.floor(Math.random() * GREETING_EMOJIS.length)];
}

const WELCOME_PHRASES = [
  "Ready to soar to new heights?",
  "Let’s take off for a great day!",
  "Navigate your career and network here.",
  "Where aviators connect & grow.",
  "Check out what’s happening in your cloud!",
  "Your hub for opportunities & inspiration."
];

function getRandomWelcomePhrase() {
  return WELCOME_PHRASES[Math.floor(Math.random() * WELCOME_PHRASES.length)];
}

const MemberDashboardHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <main className="flex-1 pb-10 bg-[#fafbfd]">
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-6 pt-9 pb-6">
        <DashboardCards />
      </section>
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-6">
        <PublicationsSection />
      </section>
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-6">
        <CertificationsSection />
        <EventsSection />
      </section>
    </main>
  );
};

export default MemberDashboardHome;
