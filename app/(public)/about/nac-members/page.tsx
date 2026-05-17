"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type NacMember = {
  name: string;
  position: string;
  photo: string;
  bio?: string;
  linkedin?: string;
};

type HierarchySection = {
  title: string;
  description?: string;
  members: NacMember[];
};

// ── Data ──────────────────────────────────────────────────────────────────────

const hierarchySections: HierarchySection[] = [
  {
    title: "National President",
    description: "Overall leadership and strategic direction of the council.",
    members: [
      {
        name: "Captain Bunmi Gindeh",
        position: "National President",
        photo: "/members/captain bunmi.png",
        linkedin: "https://www.linkedin.com/in/bunmi-gindeh",
        bio: "Capt. Gindeh leads the NAC with a vision for excellence in civil aviation and the advancement of aviation professionals in Nigeria.",
      },
    ],
  },
  {
    title: "Deputy & Vice Presidents",
    description: "Supporting leadership, engineering, and pilot excellence.",
    members: [
      {
        name: "Engr. Adebayo Oluyemi",
        position: "Deputy National President",
        photo: "/members/Adebayo.jpg",
        linkedin: "https://www.linkedin.com/in/adebayo-oluyemi",
        bio: "A core member driving national technical advancements in the industry.",
      },
      {
        name: "Engr. Richard Allison",
        position: "Vice President, Engineers",
        photo: "/members/richard.jpg",
        bio: "Coordinates engineering teams and ensures professional standards.",
      },
      {
        name: "Capt. Yakubu Ducas",
        position: "Vice President, Pilots",
        photo: "/members/yakubu.jpg",
        bio: "Represents pilot interests and ensures professional training standards.",
      },
    ],
  },
  {
    title: "Trustees",
    description: "Providing governance and compliance oversight.",
    members: [
      {
        name: "Engr. Numaliya T. Kwasau",
        position: "1st Trustee",
        photo: "/members/numalia.png",
        bio: "Experienced trustee, specialises in engineering management and governance.",
      },
      {
        name: "SFO. Tienama Obireke",
        position: "2nd Trustee",
        photo: "/members/tiemenan.jpg",
        bio: "Senior Flight Officer overseeing trust and compliance matters within NAC.",
      },
    ],
  },
  {
    title: "Secretaries & Other Leadership",
    description: "Finance, public relations, and inclusivity leadership.",
    members: [
      {
        name: "Engr. Charles Erhueh",
        position: "Financial Secretary",
        photo: "/members/charles.jpg",
        bio: "Manages financial affairs and ensures transparency in all NAC transactions.",
      },
      {
        name: "Engr. Francis N. Igwe",
        position: "Public Relations Officer",
        photo: "/members/igwe.jpg",
        bio: "Strategises and communicates NAC's public image and initiatives.",
        linkedin: "https://www.linkedin.com/in/francis-n-igwe",
      },
      {
        name: "Engr. Kyola Dyaji",
        position: "Women Leader",
        photo: "/members/kyola.jpg",
        bio: "Advocates for and empowers women in the engineering sector.",
        linkedin: "https://www.linkedin.com/in/kyola-dyaji",
      },
    ],
  },
  {
    title: "Ex-Officio",
    description: "Providing counsel and experienced support.",
    members: [
      {
        name: "Capt. Abbas Ambursa",
        position: "Ex-Officio",
        photo: "/members/abbas.jpg",
        bio: "A seasoned pilot, providing ex-officio counsel and experience to NAC.",
      },
    ],
  },
];

// ── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60 } },
};

// ── Avatar ────────────────────────────────────────────────────────────────────

function AvatarWithFallback({ src, alt, sizePx }: { src: string; alt: string; sizePx: number }) {
  const [imgError, setImgError] = useState(false);
  const initials = useMemo(() => {
    const words = alt.trim().split(" ").filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }, [alt]);

  if (imgError) {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground font-black text-2xl"
        aria-label={alt}
        role="img"
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-top"
      sizes={`${sizePx}px`}
      priority
      onError={() => setImgError(true)}
    />
  );
}

// ── LinkedIn SVG ──────────────────────────────────────────────────────────────

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 448 512" aria-hidden="true">
      <path d="M100.28 448H7.4V148.9h92.88zm-46.44-340C24.61 108 0 83.39 0 53.21A53.34 53.34 0 0153.42 0C83.58 0 108 24.62 108 54.45c0 30.16-24.42 54.55-54.16 54.55zm384 340h-92.68V302.4c0-34.7-12.36-58.4-43.36-58.4-23.64 0-37.65 15.92-43.83 31.22-2.26 5.48-2.82 13.1-2.82 20.8V448h-92.74s1.2-264.26 0-291.1h92.74v41.3c12.3-18.9 34.36-45.81 83.48-45.81 60.86 0 106.72 39.57 106.72 124.55V448z" />
    </svg>
  );
}

// ── President Card ────────────────────────────────────────────────────────────

function PresidentCard({ member }: { member: NacMember }) {
  return (
    <motion.div
      variants={fadeUpVariants as any}
      className="max-w-2xl mx-auto bg-card border border-border rounded-2xl shadow-xl shadow-primary/10 overflow-hidden hover:shadow-2xl hover:shadow-primary/15 transition-shadow duration-300"
    >
      {/* Accent top bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary to-primary/60" />

      <div className="flex flex-col sm:flex-row gap-8 p-8 sm:p-10 items-center sm:items-start">
        {/* Photo */}
        <div className="relative w-[320px] h-[320px] rounded-2xl overflow-hidden border-4 border-secondary shadow-lg shrink-0">
          <AvatarWithFallback src={member.photo} alt={member.name} sizePx={320} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <span className="self-center sm:self-start inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase">
            {member.position}
          </span>
          <h2 className="text-3xl font-black text-foreground leading-tight">
            {member.name}
          </h2>
          {member.bio && (
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              {member.bio}
            </p>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 self-center sm:self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`LinkedIn profile of ${member.name} (opens in new tab)`}
            >
              <LinkedInIcon className="w-4 h-4" />
              Connect on LinkedIn
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Member Card ───────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: NacMember }) {
  return (
    <motion.div
      variants={fadeUpVariants as any}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-1.5 transition-all duration-300 w-full cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      tabIndex={0}
      aria-label={`${member.name}, ${member.position}`}
    >
      {/* Photo */}
      <div className="relative w-full h-[380px] bg-muted overflow-hidden">
        <AvatarWithFallback src={member.photo} alt={member.name} sizePx={380} />
        {/* Gradient at bottom of photo */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <span className="inline-block self-start px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold tracking-wide">
          {member.position}
        </span>

        <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
          {member.name}
        </h3>

        {member.bio && (
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">
            {member.bio}
          </p>
        )}

        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 self-start inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`LinkedIn profile of ${member.name} (opens in new tab)`}
            onClick={(e) => e.stopPropagation()}
          >
            <LinkedInIcon className="w-3.5 h-3.5" />
            LinkedIn
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function NacMembersPage() {
  const [search, setSearch] = useState("");

  const allMembers = useMemo(
    () => hierarchySections.flatMap((s) => s.members.map((m) => ({ section: s.title, ...m }))),
    []
  );

  const filteredSections = useMemo(() => {
    if (!search.trim()) return hierarchySections;
    const lower = search.trim().toLowerCase();
    const sectionMap: { [title: string]: NacMember[] } = {};
    allMembers.forEach((member) => {
      if (
        member.name.toLowerCase().includes(lower) ||
        member.position.toLowerCase().includes(lower) ||
        (member.bio || "").toLowerCase().includes(lower)
      ) {
        if (!sectionMap[member.section]) sectionMap[member.section] = [];
        sectionMap[member.section].push(member);
      }
    });
    return hierarchySections
      .filter((s) => sectionMap[s.title])
      .map((s) => ({ ...s, members: sectionMap[s.title] }));
  }, [search, allMembers]);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero — matches site pattern ──────────────────────────────── */}
      <motion.section
        className="relative w-full flex flex-col items-center justify-center pt-32 md:pt-40 pb-20 px-6 bg-slate-50 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Background fades — same as about hero */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        {/* Text block */}
        <motion.div
          className="z-10 text-center max-w-3xl mx-auto"
          variants={fadeUpVariants as any}
        >
          <span className="text-secondary-foreground font-bold tracking-widest uppercase text-sm mb-4 block">
            National Administrative Council
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Meet Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Leaders
            </span>
          </h1>
          <div className="w-24 h-1.5 bg-accent rounded-full mx-auto mb-8" />
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Dedicated professionals steering Nigeria's aviation workforce towards safety, excellence, and progress.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or position…"
              className="w-full pl-12 pr-5 py-3.5 rounded-full bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200"
              aria-label="Search NAC members by name or position"
              aria-live="polite"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li aria-hidden="true"><span className="text-border">/</span></li>
              <li><Link href="/about/about-us" className="hover:text-primary transition-colors">About</Link></li>
              <li aria-hidden="true"><span className="text-border">/</span></li>
              <li className="text-foreground font-semibold">NAC Members</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <main id="nac-main" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">

        {filteredSections.length === 0 ? (
          <div className="py-24 text-center" role="status" aria-live="polite">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-bold text-foreground mb-1">No members found</p>
            <p className="text-sm text-muted-foreground">Try a different name or position.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            {filteredSections.map((section, idx) => {
              const sectionId = `section-${section.title.replace(/[\s&]+/g, "-").toLowerCase()}`;
              return (
                <motion.section
                  key={section.title}
                  aria-labelledby={sectionId}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {/* Section header — matches site style */}
                  <motion.div variants={fadeUpVariants as any} className="mb-12 text-center">
                    <span className="text-secondary-foreground font-bold tracking-widest uppercase text-sm mb-3 block">
                      {section.description}
                    </span>
                    <h2
                      id={sectionId}
                      className="text-3xl md:text-4xl font-black text-slate-900 mb-4"
                    >
                      {section.title}
                    </h2>
                    <div className="w-16 h-1 bg-accent rounded-full mx-auto" />
                  </motion.div>

                  {/* President → special horizontal card */}
                  {idx === 0 ? (
                    <PresidentCard member={section.members[0]} />
                  ) : (
                    <div
                      className={`grid gap-6 ${section.members.length === 1 ? "max-w-sm mx-auto" : ""}`}
                      style={{ gridTemplateColumns: `repeat(${section.members.length}, 1fr)` }}
                    >
                      {section.members.map((member) => (
                        <MemberCard key={member.name} member={member} />
                      ))}
                    </div>
                  )}
                </motion.section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
