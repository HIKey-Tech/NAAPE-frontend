"use client";

import Image from "next/image";
import { useState, useMemo, useState as useReactState } from "react";

/**
 * Improvements:
 * - Added search/filter functionality.
 * - Responsive grid adapts better and uses auto-fit for member cards.
 * - Alphabetical sorting within sections, for easier lookup.
 * - Enhanced Avatar fallback for better accessibility/UX.
 * - Section header has optional description for future extensibility.
 * - Use consistent, accessible ARIA labels.
 * - Improved visual contrast for section blocks.
 */

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

const hierarchySections: HierarchySection[] = [
  {
    title: "National President",
    description: "Overall leadership and strategic direction of the council.",
    members: [
      {
        name: "Engr. Abednego Galadima",
        position: "National President",
        photo: "/members/Abednego.jpg",
        linkedin: "https://www.linkedin.com/in/abednego-galadima",
        bio: "Engr. Galadima leads the NAC with a vision for excellence in civil aviation engineering and administration.",
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
        bio: "Experienced trustee, specializes in engineering management and governance.",
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
        bio: "Strategizes and communicates NAC's public image and initiatives.",
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

// Improved avatar: just initials, better fallback color, ARIA text
function AvatarWithFallback({ src, alt }: { src: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  // Use up to 2 initials for fallback, prioritize first/last words
  const initials = useMemo(() => {
    const words = alt.trim().split(" ");
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }, [alt]);
  return imgError ? (
    <div
      className="w-32 h-32 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-extrabold text-3xl border-2 border-blue-300"
      aria-label={alt}
      role="img"
    >
      {initials}
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="128px"
      priority
      onError={() => setImgError(true)}
    />
  );
}

// Accessible member card, keyboard and aria improvements
function MemberCard({ member }: { member: NacMember }) {
  return (
    <div
      className="group flex flex-col items-center bg-white p-5 rounded-3xl shadow-lg hover:shadow-blue-200 focus:shadow-blue-200 transition duration-200 border border-blue-50 hover:-translate-y-1 relative outline-none focus:ring-2 focus:ring-blue-400"
      tabIndex={0}
      aria-label={`${member.name}, ${member.position}${member.bio ? ": " + member.bio : ""}`}
    >
      <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-blue-200 shadow-xl">
        <AvatarWithFallback src={member.photo} alt={member.name} />
      </div>
      <div className="text-xl font-semibold text-slate-900 text-center mb-1 group-hover:text-blue-700 group-focus:text-blue-700 transition">
        {member.name}
      </div>
      <div className="text-sm text-blue-600 font-medium text-center mb-1">{member.position}</div>
      {member.bio && (
        <div className="text-xs text-slate-600 text-center mb-2">{member.bio}</div>
      )}
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 focus:bg-blue-200 focus:outline-none transition"
          tabIndex={0}
          aria-label={`LinkedIn profile of ${member.name}`}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 448 512"
            aria-hidden="true"
          >
            <path d="M100.28 448H7.4V148.9h92.88zm-46.44-340C24.61 108 0 83.39 0 53.21A53.34 53.34 0 0153.42 0C83.58 0 108 24.62 108 54.45c0 30.16-24.42 54.55-54.16 54.55zm384 340h-92.68V302.4c0-34.7-12.36-58.4-43.36-58.4-23.64 0-37.65 15.92-43.83 31.22-2.26 5.48-2.82 13.1-2.82 20.8V448h-92.74s1.2-264.26 0-291.1h92.74v41.3c12.3-18.9 34.36-45.81 83.48-45.81 60.86 0 106.72 39.57 106.72 124.55V448z"/>
          </svg>
          LinkedIn
        </a>
      )}
    </div>
  );
}

// Section component for semantic clarity, accepts children (cards)
function SectionBlock({ section, children }: { section: HierarchySection; children: React.ReactNode }) {
  return (
    <section
      key={section.title}
      aria-labelledby={section.title.replace(/\s+/g, "-").toLowerCase()}
      className="bg-blue-50/40 rounded-2xl px-4 py-7 shadow-inner border border-blue-100"
    >
      <h2
        id={section.title.replace(/\s+/g, "-").toLowerCase()}
        className="text-2xl font-bold text-blue-800 mb-2 tracking-tight text-center"
      >
        {section.title}
      </h2>
      {section.description && (
        <div className="text-sm text-blue-700 mb-6 text-center">{section.description}</div>
      )}
      {children}
    </section>
  );
}

// Main members page with search and improved layout
export default function NacMembersPage() {
  const [search, setSearch] = useReactState("");

  // Flatten all members for search
  const allMembers = useMemo(
    () => hierarchySections.flatMap((s) => s.members.map((m) => ({ section: s.title, ...m }))),
    []
  );

  // Organize filtered members by section
  const filteredSections = useMemo(() => {
    if (!search.trim()) {
      // Return original, but alphabetically sorted in each section
      return hierarchySections.map((section) => ({
        ...section,
        members: [...section.members].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      }));
    }
    // Search by name, position, or bio
    const lower = search.trim().toLowerCase();
    // Group by section after filtering
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
    // Keep sections with at least one match, in original order
    return hierarchySections
      .filter((section) => sectionMap[section.title])
      .map((section) => ({
        ...section,
        members: sectionMap[section.title].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      }));
  }, [search]);

  return (
    <div className="mx-auto max-w-5xl justify-center items-center py-10 px-2 sm:px-4">
      <h1 className="text-4xl font-extrabold mb-4 text-center text-blue-900 tracking-tight">
        National Advisory Council
        <span className="block text-lg font-normal mt-2 text-blue-500">
          Meet Our Leaders
        </span>
      </h1>
      <div className="flex justify-center mb-8">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, position, or bio…"
          className="w-full max-w-md px-4 py-2 rounded-lg border border-blue-200 shadow focus:ring-2 focus:ring-blue-400 outline-none text-base"
          aria-label="Search NAC members"
        />
      </div>
      <div className="flex flex-col gap-12">
        {filteredSections.length === 0 ? (
          <div className="py-12 text-center text-gray-400 select-none text-base font-medium">
            <span role="status">No members found.</span>
          </div>
        ) : (
          filteredSections.map((section) =>
            section.members.length === 0 ? null : (
              <SectionBlock key={section.title} section={section}>
                <div className="grid gap-8 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-cols-fr justify-center">
                  {section.members.map((member) => (
                    <MemberCard key={member.name} member={member} />
                  ))}
                </div>
              </SectionBlock>
            )
          )
        )}
      </div>
    </div>
  );
}
