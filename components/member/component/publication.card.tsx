import React, { useRef, useState } from "react";
import type { IPublication } from "@/app/api/publication/types";
import { useComments, useAddComment } from "@/hooks/useComment";
import { useRouter } from "next/navigation";

// Status configuration
const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        bg: "bg-yellow-50 border-yellow-300",
        text: "text-yellow-900",
        icon: (
            <svg className="inline-block mr-2" width="22" height="22" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: "middle" }}>
                <circle cx="10" cy="10" r="8" stroke="#FFD600" strokeWidth="2.5" fill="#FFF9E5" />
                <path d="M10 6v5" stroke="#E2A900" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="13.5" r="1" fill="#E2A900" />
            </svg>
        ),
    },
    approved: {
        label: "Published",
        bg: "bg-green-50 border-green-400",
        text: "text-green-900",
        icon: (
            <svg className="inline-block mr-2" width="22" height="22" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: "middle" }}>
                <circle cx="10" cy="10" r="8" stroke="#26C281" strokeWidth="2.5" fill="#D6FFE7" />
                <path d="M7 10.5l2.2 2L13 8.5" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    rejected: {
        label: "Rejected",
        bg: "bg-red-50 border-red-300",
        text: "text-red-900",
        icon: (
            <svg className="inline-block mr-2" width="22" height="22" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: "middle" }}>
                <circle cx="10" cy="10" r="8" stroke="#FF6161" strokeWidth="2.5" fill="#FFD8D8" />
                <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="#D33A2C" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
} as const;

type PublicationStatus = keyof typeof STATUS_CONFIG;

type PublicationCardProps = {
    publication?: IPublication | null;
    className?: string;
    isAdmin?: boolean;
    onAccept?: () => void;
    onReject?: () => void;
    onDelete?: (id: string) => void;
};

// Comments block
const PublicationComments: React.FC<{ publicationId: string, cardWidth?: string | number, cardHeight?: string | number }> = ({ publicationId, cardWidth, cardHeight }) => {
    const [input, setInput] = useState("");
    const { data: commentsRaw = [], isPending, error, refetch } = useComments(publicationId);
    const addComment = useAddComment();

    // Always array
    const comments: any[] = Array.isArray(commentsRaw)
        ? commentsRaw
        : (commentsRaw && typeof commentsRaw === "object" && commentsRaw !== null)
            ? Object.values(commentsRaw)
            : [];

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;
        addComment.mutate(
            { publicationId, text: trimmed },
            {
                onSuccess: () => {
                    setInput("");
                    refetch?.();
                },
            }
        );
    };

    return (
        <div className="border-t border-gray-200 pt-6 mt-6 px-4 sm:px-6">
            <h4 className="font-semibold mb-2 text-gray-800">Comments</h4>
            <form onSubmit={handleAddComment} className="flex mb-3 gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Add a comment"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    disabled={addComment.isPending}
                    maxLength={400}
                />
                <button
                    type="submit"
                    disabled={addComment.isPending || !input.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60"
                >
                    Send
                </button>
            </form>
            {isPending && <div className="text-gray-400 text-sm mb-2">Loading...</div>}
            {error && (
                <div className="text-red-500 text-sm mb-2">
                    Error loading comments.{" "}
                    <button onClick={() => refetch?.()} className="underline">Retry</button>
                </div>
            )}
            {!isPending && comments.length === 0 && (
                <div className="text-gray-400 italic text-sm">No comments yet.</div>
            )}
            <ul className="space-y-2 mt-2">
                {comments.map((comment: any, idx: number) => {
                    const content =
                        comment.content ?? comment.text ?? comment.message ?? comment.body ?? "";
                    let author = "Unknown";
                    if (comment.author) {
                        if (typeof comment.author === "string" || typeof comment.author === "number") {
                            author = String(comment.author);
                        } else if (typeof comment.author === "object" && comment.author.name) {
                            author = comment.author.name;
                        } else if (typeof comment.author === "object" && comment.author.email) {
                            author = comment.author.email;
                        }
                    }
                    return (
                        <li key={comment._id || comment.id || idx} className="border border-gray-100 rounded px-3 py-2 bg-gray-50">
                            <span className="font-bold text-gray-700 text-sm mr-2">{author}:</span>
                            <span className="text-gray-800 text-sm">{content}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

// Pill base classes
const pillBaseClasses = [
    "inline-flex items-center justify-center",
    "rounded-full",
    "font-bold uppercase tracking-wide",
    "text-sm sm:text-base",
    "min-w-[140px]",
    "min-h-[44px]",
    "px-6",
    "py-2.5",
    "border",
    "whitespace-nowrap",
    "select-none"
].join(" ");

const CATEGORY_COLOR_MAP: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    science: { bg: "bg-[#DEEFFB]", text: "text-[#246BAE]", icon: <span className="mr-1.5">🔬</span> },
    art: { bg: "bg-[#FFE3F7]", text: "text-[#C43A93]", icon: <span className="mr-1.5">🎨</span> },
    technology: { bg: "bg-[#E5F6EC]", text: "text-[#219150]", icon: <span className="mr-1.5">💻</span> },
    history: { bg: "bg-[#FEF4E9]", text: "text-[#B5691B]", icon: <span className="mr-1.5">🏛️</span> },
    default: { bg: "bg-[#EDF2FE]", text: "text-[#4073C8]", icon: <span className="mr-1.5">📚</span> },
};

function getCategoryStyle(categoryVal?: string | null) {
    if (!categoryVal) return CATEGORY_COLOR_MAP.default;
    const key = String(categoryVal).toLowerCase();
    return CATEGORY_COLOR_MAP[key] || CATEGORY_COLOR_MAP.default;
}

// Used in both list and detail! (Use consistent push URL /publication/[id])
const PublicationCard: React.FC<PublicationCardProps> = ({
    publication,
    className = "",
    isAdmin = false,
    onAccept,
    onReject,
    onDelete,
}) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [showComments, setShowComments] = useState(false);
    const router = useRouter();
    const [cardDims, setCardDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    React.useEffect(() => {
        function updateDims() {
            if (cardRef.current) {
                setCardDims({
                    width: cardRef.current.offsetWidth,
                    height: cardRef.current.offsetHeight,
                });
            }
        }
        updateDims();
        window.addEventListener("resize", updateDims);
        return () => window.removeEventListener("resize", updateDims);
    }, []);

    if (!publication) {
        return (
            <div
                className={[
                    "bg-white border border-[#E5EAF2] rounded-2xl w-full overflow-hidden flex flex-col items-center justify-center text-[#96A6BF] py-14 px-6",
                    className
                ].join(" ")}
            >
                Invalid publication data.
            </div>
        );
    }

    const {
        title,
        content,
        author,
        createdAt,
        image,
        status,
        _id,
        category
    } = publication;

    // Always resolve to "approved", "pending" or "rejected"
    let statusValue: PublicationStatus;
    if (status === "approved") {
        statusValue = "approved";
    } else if (status === "pending") {
        statusValue = "pending";
    } else if (status === "rejected") {
        statusValue = "rejected";
    } else {
        statusValue = "pending";
    }
    const statusInfo = STATUS_CONFIG[statusValue] || STATUS_CONFIG["pending"];

    function getAuthorString(author: any) {
        if (!author) return "";
        if (typeof author === "string" || typeof author === "number") return author;
        if (typeof author === "object" && author !== null) {
            if (author.name) return author.name;
            if (author.email) return author.email;
            if (author._id) return author._id;
            try {
                return JSON.stringify(author);
            } catch {
                return "";
            }
        }
        return "";
    }

    // Counting comments for pill
    const { data: commentsForCount = [] } = useComments(_id);
    const commentCount =
        Array.isArray(commentsForCount)
            ? commentsForCount.length
            : (commentsForCount && typeof commentsForCount === "object" && commentsForCount !== null)
                ? Object.values(commentsForCount).length
                : 0;

    // This push must match the [id] route used in @publication.detail.tsx
    // For list and card click: /publication/[id] (not /publications/)
    function handleCardClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // Only navigate on outside card click, not on button et al.
        const tag = (e.target as HTMLElement).tagName.toLowerCase();
        if (
            tag === "button" ||
            tag === "input" ||
            tag === "textarea" ||
            tag === "a" ||
            (e.target as HTMLElement).closest("[data-stop-propagation]")
        ) {
            return;
        }
        if (_id) {
            // IMPORTANT: To match [id] param route in @publication.detail.tsx
            router.push(`/publications/${_id}`);
        }
    }

    return (
        <div
            ref={cardRef}
            className={[
                "flex flex-col items-stretch justify-stretch",
                "w-full",
                className,
                "cursor-pointer",
                "group/publicationcard"
            ].join(" ")}
            style={{
                position: "relative",
                width: "100%",
                maxWidth: "640px",
                aspectRatio: "1 / 1",
                minWidth: "320px",
                minHeight: "320px",
                maxHeight: "640px",
                margin: "0 auto",
            }}
            onClick={handleCardClick}
            tabIndex={0}
            role="button"
            aria-label={title ? `Go to publication: ${title}` : "Go to publication"}
            onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                    // "as any" to satisfy handler
                    handleCardClick(e as any);
                }
            }}
        >
            {/* Card Size overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 8,
                    left: 16,
                    zIndex: 20,
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: "8px",
                    padding: "2px 10px",
                    fontSize: "12px",
                    color: "#446199",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                className="select-none"
                aria-label="Card dimensions"
            >
                {`Width: ${cardDims.width || "-"}px, Height: ${cardDims.height || "-"}px`}
            </div>
            <article
                className={[
                    "bg-white",
                    "border border-blue-200 rounded-[2rem] w-full h-full overflow-hidden flex flex-col group",
                ].join(" ")}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* Top image header */}
                <div
                    className="relative w-full bg-blue-50 overflow-hidden flex flex-shrink-0 border-b-2 border-blue-100"
                    style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        minHeight: 0,
                        maxHeight: "50%",
                        height: "50%",
                    }}
                >
                    <img
                        src={image}
                        alt={title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.025] group-hover:brightness-105"
                        draggable={false}
                        loading="lazy"
                        style={{
                            minHeight: "100%",
                            minWidth: "100%",
                            width: "100%",
                            height: "100%",
                        }}
                    />
                    {/* Pills */}
                    <div className="absolute top-7 left-0 w-full flex justify-between items-center px-7 z-10 pointer-events-none" style={{ gap: '8px' }}>
                        {/* Category Pill */}
                        <div className="flex-1 flex min-w-0">
                            {category && (
                                <span
                                    className={[
                                        pillBaseClasses,
                                        getCategoryStyle(category).bg,
                                        getCategoryStyle(category).text,
                                        "border-blue-200",
                                        "backdrop-blur-md",
                                    ].join(" ")}
                                    title={`Category: ${category}`}
                                    style={{
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        letterSpacing: "0.1em",
                                        pointerEvents: "auto"
                                    }}
                                >
                                    {getCategoryStyle(category).icon}
                                    <span className="truncate block">{String(category)}</span>
                                </span>
                            )}
                        </div>
                        {/* Status Pill */}
                        <div className="flex-1 flex min-w-0 justify-end">
                            <span
                                className={[
                                    pillBaseClasses,
                                    statusInfo.bg, statusInfo.text,
                                    "border-[#D9E7FF]",
                                ].join(" ")}
                                title={statusInfo.label}
                                style={{
                                    letterSpacing: "0.12em",
                                    pointerEvents: "auto"
                                }}
                            >
                                {statusInfo.icon}
                                <span className="truncate block">{statusInfo.label}</span>
                            </span>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="flex flex-col gap-6 flex-1 overflow-auto relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
                    {/* Title */}
                    <header className="flex flex-col gap-2 w-full pt-5">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#184072] tracking-tighter w-full truncate whitespace-nowrap">
                            {title}
                        </h2>
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 mt-2 ml-0.5 text-[#7890B0] text-[15px] font-semibold tracking-wide">
                            <span className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-1.5">
                                <svg className="w-5 h-5 text-blue-400 mr-1" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="9" fill="#E5EAF2" />
                                    <path d="M6 12.5V8.5c0-2 1-3 4-3s4 1 4 3v4c0 2-1 3-4 3s-4-1-4-3z" stroke="#3666AE" strokeWidth="1.2" />
                                    <circle cx="10" cy="12" r="1" fill="#3666AE" />
                                </svg>
                                <span>{getAuthorString(author?.name) || "Unknown"}</span>
                            </span>
                            <span className="text-gray-200 text-[20px] select-none font-bold">&middot;</span>
                            <span className="rounded-xl bg-blue-50 px-3 py-1.5">
                                {createdAt
                                    ? new Date(createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                    })
                                    : "Unknown date"}
                            </span>
                        </div>
                    </header>
                    {content && (
                        <section
                            className="text-base sm:text-lg text-[#294469] leading-relaxed font-semibold line-clamp-4 overflow-hidden break-words bg-white rounded-xl p-5 border border-[#E8F1FF] transition w-full"
                            title={content}
                            style={{ wordBreak: "break-word" }}
                        >
                            {content}
                        </section>
                    )}
                    {/* Admin action buttons */}
                    {isAdmin && statusValue === "pending" && (
                        <div className="mt-2 flex gap-4 justify-end border-t border-blue-100 pt-4 w-full">
                            <button
                                className="bg-green-100 hover:bg-green-200 text-green-900 px-6 py-2.5 rounded-xl font-bold text-base flex items-center gap-2 transition focus:outline-none ring-2 ring-green-200/50 border border-green-200"
                                type="button"
                                onClick={onAccept}
                                data-stop-propagation
                            >
                                <svg width="20" height="20" fill="none" className="mr-1" viewBox="0 0 20 20">
                                    <path d="M4 10l4 4 8-8" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Accept
                            </button>
                            <button
                                className="bg-red-100 hover:bg-red-200 text-red-900 px-6 py-2.5 rounded-xl font-bold text-base flex items-center gap-2 transition focus:outline-none ring-2 ring-red-200/50 border border-red-200"
                                type="button"
                                onClick={onReject}
                                data-stop-propagation
                            >
                                <svg width="20" height="20" fill="none" className="mr-1" viewBox="0 0 20 20">
                                    <path d="M6 6l8 8M14 6l-8 8" stroke="#D33A2C" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Reject
                            </button>
                        </div>
                    )}
                    {/* Comments Toggle */}
                    <div className="mt-3 flex justify-end w-full">
                        <button
                            className={`flex items-center gap-3 py-2.5 px-6 rounded-xl text-base font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 transition-all focus:outline-none ${
                                showComments ? "ring-2 ring-blue-400 bg-blue-100" : ""
                            }`}
                            onClick={e => {
                                e.stopPropagation();
                                setShowComments((v) => !v);
                            }}
                            type="button"
                            data-stop-propagation
                            aria-expanded={showComments}
                            aria-controls={`pubcard-comments-${_id}`}
                            style={{ minWidth: 140, justifyContent: "center", alignItems: "center" }}
                        >
                            <svg viewBox="0 0 20 20" fill="none" width="20" height="20" className="inline-block align-middle" aria-hidden="true">
                                <path d="M6.7 15.91c-2.98 0-5.33-2.02-5.33-4.5s2.35-4.5 5.33-4.5c.45 0 .89.04 1.32.13.71-1.35 2.3-2.27 4.11-2.27 2.12 0 3.85 1.25 3.85 2.79 0 .08-.01.16-.02.24.72.61 1.15 1.39 1.15 2.24 0 1.85-1.98 3.36-4.43 3.36a5.92 5.92 0 01-1.4-.15c-.38 1.04-1.65 1.81-3.19 1.81Z" stroke="#2268E5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {showComments ? "Hide comments" : "Show comments"}
                            <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-sm">
                                {typeof commentCount === "number" ? commentCount : <span className="opacity-40">&ndash;</span>}
                            </span>
                        </button>
                    </div>
                    {/* Comments section */}
                    {showComments && (
                        <div className="pt-4 w-full" id={`pubcard-comments-${_id}`}>
                            <PublicationComments
                                publicationId={_id ?? "na"}
                                cardWidth={cardDims.width}
                                cardHeight={cardDims.height}
                            />
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
};

export default PublicationCard;
