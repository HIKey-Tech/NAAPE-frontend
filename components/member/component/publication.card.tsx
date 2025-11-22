import React, { useRef, useEffect, useState, useCallback } from "react";
import type { IPublication } from "@/app/api/publication/types";
import { useComments, useAddComment, useDeleteComment } from "@/hooks/useComment";

// Improved semantic color map and clearer label mapping
const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        bg: "bg-[#FFF2CA]",
        text: "text-[#E2A900]",
    },
    approved: {
        label: "Published",
        bg: "bg-[#DAFBE8]",
        text: "text-[#27AE60]",
    },
    rejected: {
        label: "Rejected",
        bg: "bg-[#FFDADA]",
        text: "text-[#D33A2C]",
    },
} as const;

type PublicationStatus = keyof typeof STATUS_CONFIG;

type PublicationCardProps = {
    publication?: IPublication | null;
    className?: string;
    isAdmin?: boolean;
    onAccept?: () => void;
    onReject?: () => void;
};

const splitTitle = (title: string, maxLineLength = 30): [string, string] => {
    if (!title) return ["", ""];
    if (title.length <= maxLineLength) return [title, ""];
    const splitIndex = title.lastIndexOf(" ", maxLineLength);
    if (splitIndex <= 0) return [title, ""];
    return [title.slice(0, splitIndex), title.slice(splitIndex + 1)];
};

const ANIMATION_CLASS = "publication-card-animate";
const ANIMATION_CSS = `
.${ANIMATION_CLASS} {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
    transition:
        opacity 0.66s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.54s cubic-bezier(0.4, 0, 0.2, 1);
}
.${ANIMATION_CLASS}.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.${ANIMATION_CLASS}:hover {
    transform: translateY(-4px) scale(1.025);
    box-shadow: 0 4px 18px rgba(30,41,59,0.11), 0 1.5px 6px rgba(30,41,59,0.08);
    transition:
        opacity 0.66s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.20s cubic-bezier(.42,0,.58,1),
        box-shadow 0.21s cubic-bezier(.42,0,.58,1);
}
`;

let animationInjected = false;
function injectAnimationCSS() {
    if (typeof window !== "undefined" && !animationInjected) {
        if (!document.getElementById("pubcard-anim-style")) {
            const style = document.createElement("style");
            style.id = "pubcard-anim-style";
            style.textContent = ANIMATION_CSS;
            document.head.appendChild(style);
            animationInjected = true;
        }
    }
}

// ---------- Comments Block ----------
const PublicationComments: React.FC<{ publicationId: string; setCommentCount?: (count: number) => void }> = ({
    publicationId,
    setCommentCount,
}) => {
    const { data: commentsRaw = [], isPending, error, refetch } = useComments(publicationId);
    const addComment = useAddComment();
    const deleteComment = useDeleteComment();
    const [input, setInput] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Ensure comments is always an array (fixes .map is not a function error)
    const comments: any[] = Array.isArray(commentsRaw)
        ? commentsRaw
        : (commentsRaw && typeof commentsRaw === "object" && commentsRaw !== null)
        ? Object.values(commentsRaw)
        : [];

    // Report comments count up to parent if requested
    useEffect(() => {
        if (setCommentCount) setCommentCount(comments.length);
    }, [comments.length, setCommentCount]);

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!input.trim()) return;
            setSubmitting(true);
            try {
                await addComment.mutateAsync({ publicationId, text: input.trim() });
                setInput("");
                refetch?.();
                setTimeout(() => {
                    const scrollable = document.getElementById("comments-list-scrollable");
                    if (scrollable)
                        scrollable.scrollTop = scrollable.scrollHeight;
                }, 150);
            } finally {
                setSubmitting(false);
            }
        },
        [input, addComment, publicationId, refetch]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            setDeletingId(id);
            try {
                await deleteComment.mutateAsync(id);
                refetch?.();
            } finally {
                setDeletingId(null);
            }
        },
        [deleteComment, refetch]
    );

    function getCommentKey(comment: any, index: number) {
        if (comment.id) return comment.id;
        if (comment._id) return comment._id;
        if (comment.createdAt && comment.author) return `${comment.createdAt}-${getAuthorString(comment.author)}`;
        return `idx-${index}`;
    }

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

    function getAvatarInitials(author: any) {
        const s = getAuthorString(author);
        if (!s) return "U";
        const names = (s as string).split(" ");
        if (names.length === 1) return names[0][0]?.toUpperCase() || "U";
        return `${names[0][0]?.toUpperCase() || ""}${names[1][0]?.toUpperCase() || ""}`;
    }
    function avatarColor(author: any) {
        const str = getAuthorString(author) || "";
        let hash = 0;
        for (let i = 0; i < str.length; ++i) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return `hsl(${Math.abs(hash) % 360},70%,88%)`;
    }

    useEffect(() => {
        if (inputRef.current) inputRef.current.blur();
    }, []);

    return (
        <div className="mt-4 border-t pt-3">
            <form
                onSubmit={onSubmit}
                className="flex gap-2 mb-2"
                autoComplete="off"
            >
                <div className="relative w-full flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        className="block w-full border rounded-full px-3 py-2 text-[15px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2268E5] focus:border-[#2268E5] placeholder-gray-400 transition"
                        placeholder="Add a comment..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={submitting}
                        maxLength={400}
                        aria-label="Add a comment"
                    />
                    <span className="absolute top-1.5 right-3 text-gray-400 text-xs select-none">{input.length}/400</span>
                </div>
                <button
                    type="submit"
                    className="bg-[var(--primary,#2268E5)] px-4 py-2 text-white rounded-full font-semibold text-[15px] transition-colors hover:bg-blue-700 disabled:bg-gray-300 focus:outline-none shadow-sm"
                    disabled={submitting || !input.trim()}
                    aria-label="Post comment"
                >
                    {submitting
                        ?
                        <span className="flex items-center gap-1">
                            <svg className="animate-spin inline w-4 h-4 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                            Posting...
                        </span>
                        : <span className="flex items-center gap-1">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-0.5"><path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="currentColor"/></svg>
                            Send
                        </span>
                    }
                </button>
            </form>
            <div id="comments-list-scrollable" className="mt-1 max-h-52 overflow-y-auto pr-1 transition-all duration-200 comments-scrollbar">
                {isPending && (
                    <div className="py-3 flex items-center justify-center">
                        <svg className="animate-spin w-5 h-5 mr-2 text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="#DDD" strokeWidth="4" fill="none"/><path className="opacity-75" fill="#E1E8FF" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                        <span className="text-gray-400 text-sm">Loading comments...</span>
                    </div>
                )}
                {error && (
                    <div className="py-3 flex items-center space-x-2 text-red-500 text-sm">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#D33A2C" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#D33A2C" strokeWidth="2" strokeLinecap="round"/></svg>
                        <span>Error loading comments.</span>
                        <button onClick={() => refetch?.()} className="underline text-blue-700 hover:text-blue-900 text-xs">Retry</button>
                    </div>
                )}
                {!isPending && comments.length === 0 && (
                    <div className="py-3 flex items-center justify-center text-gray-400 text-sm">
                        <svg width="16" height="16" className="mr-1" viewBox="0 0 20 20" fill="none"><path d="M4 10a6 6 0 0012 0 6 6 0 00-12 0zm6 4a4 4 0 100-8 4 4 0 000 8z" fill="#CAD5E3"/></svg>
                        No comments yet.
                    </div>
                )}
                {comments.map((comment: any, idx: number) => {
                    const authorVal =
                        comment.author?.name
                            ? comment.author.name
                            : comment.author
                                ? getAuthorString(comment.author)
                                : comment.username
                                    ? comment.username
                                    : comment.user
                                        ? getAuthorString(comment.user)
                                        : "Unknown";

                    const content =
                        comment.content !== undefined ? comment.content :
                        comment.text !== undefined ? comment.text :
                        comment.message !== undefined ? comment.message :
                        comment.body !== undefined ? comment.body :
                        "";

                    return (
                        <div
                            key={getCommentKey(comment, idx)}
                            className="flex group items-start gap-3 mb-3 last:mb-0"
                        >
                            <div
                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-[#38588c] shadow"
                                style={{ background: avatarColor(comment.author) }}
                                title={authorVal}
                            >
                                {getAvatarInitials(comment.author)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-[#23426D] text-[14px] truncate max-w-[120px]">{authorVal}</span>
                                    <span className="mx-1 text-gray-300 select-none text-xs">&bull;</span>
                                    <span className="text-gray-400 text-xs" title={comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}>
                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                    </span>
                                    {comment.canDelete && (
                                        <button
                                            className="ml-auto text-xs text-red-400 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 focus:bg-red-100 transition-colors focus:outline-none"
                                            onClick={() => handleDelete(comment.id)}
                                            disabled={deletingId === comment.id}
                                            aria-label="Delete comment"
                                            type="button"
                                        >
                                            {deletingId === comment.id ?
                                                <span className="flex items-center gap-1">
                                                    <svg className="animate-spin w-3 h-3" viewBox="0 0 16 16"><circle className="opacity-25" cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="3" fill="none"/><path className="opacity-75" fill="#D33A2C" d="M2 8a6 6 0 016-6v6H2z"/></svg>
                                                    Deleting...
                                                </span>
                                                : "Delete"}
                                        </button>
                                    )}
                                </div>
                                <div className="text-[15px] text-[#384D6B] bg-gray-100/40 rounded-lg px-3 py-1.5 mt-1 whitespace-pre-line break-words shadow-sm min-h-[34px]">
                                    {content}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ------ Publication Card ------
const PublicationCard: React.FC<PublicationCardProps> = ({
    publication,
    className = "",
    isAdmin = false,
    onAccept,
    onReject,
}) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [commentsOpen, setCommentsOpen] = useState(false);

    // NEW: State for comment count
    const [commentCount, setCommentCount] = useState<number | null>(null);

    // Defensive render for missing publication
    if (!publication) {
        return (
            <div
                className={[
                    ANIMATION_CLASS,
                    "bg-white border border-[#E5EAF2] rounded-2xl shadow-sm max-w-full w-full overflow-hidden flex flex-col items-center justify-center text-[#96A6BF] py-12",
                    className
                ].join(" ")}
                style={{ boxShadow: "0 1px 6px rgba(30,41,59,0.05)" }}
            >
                Invalid publication data.
            </div>
        );
    }

    useEffect(() => {
        injectAnimationCSS();
        const card = cardRef.current;
        if (!card) return;

        const reducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        if (reducedMotion) {
            card.classList.add("visible");
            return;
        }

        let timer: ReturnType<typeof setTimeout> | null = null;
        const observer = (typeof window !== "undefined" && "IntersectionObserver" in window)
            ? new window.IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        timer = setTimeout(() => {
                            card.classList.add("visible");
                        }, 40 + Math.random() * 120);
                    }
                });
            })
            : null;

        if (observer) observer.observe(card);
        else card.classList.add("visible");

        return () => {
            if (observer) observer.disconnect();
            if (timer) clearTimeout(timer);
        };
    }, []);

    const {
        title,
        content,
        author,
        createdAt,
        image,
        status,
        _id
    } = publication;

    const statusValue: PublicationStatus =
        status === "approved"
            ? "approved"
            : status === "pending"
            ? "pending"
            : "rejected";
    const statusInfo = STATUS_CONFIG[statusValue] || STATUS_CONFIG["pending"];

    const [mainTitle, subTitle] = splitTitle(title);

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

    return (
        <div
            ref={cardRef}
            className={[
                ANIMATION_CLASS,
                "bg-white border border-[#E5EAF2] rounded-2xl shadow-sm max-w-full w-full overflow-hidden transition-shadow hover:shadow-md duration-150 flex flex-col",
                className
            ].join(" ")}
            style={{ boxShadow: "0 1px 6px rgba(30,41,59,0.05)" }}
        >
            <div className="w-full bg-gray-200 relative h-36 sm:h-40 md:h-44 lg:h-48">
                <img
                    src={image || "/images/plane.jpg"}
                    alt={title}
                    className="object-cover w-full h-full transition-transform duration-400 group-hover:scale-[1.07]"
                    draggable={false}
                    loading="lazy"
                    style={{ aspectRatio: "16/9", minHeight: "100%" }}
                />
            </div>
            <div className="p-3 pt-2 pb-3 flex flex-col gap-2 sm:p-4 sm:pt-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="text-[16px] sm:text-[18px] font-semibold text-[#222F43] leading-tight truncate max-w-full">{mainTitle}</div>
                        {subTitle && (
                            <div className="text-[16px] sm:text-[18px] font-semibold text-[#222F43] leading-tight truncate max-w-full">{subTitle}</div>
                        )}
                    </div>
                    <span
                        className={[
                            "inline-flex items-center px-2 sm:px-3 py-1 rounded-full",
                            statusInfo.bg, statusInfo.text,
                            "text-[13px] sm:text-[15px] font-medium whitespace-nowrap mt-2 sm:mt-0 self-start sm:self-auto transition-all duration-200"
                        ].join(" ")}
                        title={statusInfo.label}
                    >
                        <span className="text-[18px] sm:text-[22px] mr-1 leading-none">●</span>
                        {statusInfo.label}
                    </span>
                </div>
                {content && (
                    <div
                        className="text-[14px] sm:text-[15px] text-[#384D6B] mt-2 sm:mt-2.5 line-clamp-2 sm:line-clamp-3 overflow-hidden break-words"
                        title={content}
                    >
                        {content}
                    </div>
                )}
                <div className="text-[13px] sm:text-[15px] text-[#96A6BF] font-normal mt-1 sm:mt-2 truncate max-w-full overflow-hidden whitespace-nowrap">
                    by {getAuthorString(author) || "Unknown"} &ndash;{" "}
                    {createdAt
                        ? new Date(createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })
                        : "Unknown date"}
                </div>
                {isAdmin && statusValue === "pending" && (
                    <div className="mt-3 flex gap-3 justify-end">
                        <button
                            className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-medium px-3 py-1 rounded text-[13px] focus:outline-none"
                            type="button"
                            onClick={onAccept}
                        >
                            Accept
                        </button>
                        <button
                            className="bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium px-3 py-1 rounded text-[13px] focus:outline-none"
                            type="button"
                            onClick={onReject}
                        >
                            Reject
                        </button>
                    </div>
                )}
                <div className="mt-2 flex justify-end">
                    <button
                        className={`flex items-center gap-1 py-1.5 px-3 rounded-full text-[13px] font-medium text-[#2268E5] bg-[#EDF2FE] hover:bg-[#E4EEFC] transition-colors focus:outline-none shadow-sm ${
                            commentsOpen ? "ring-2 ring-[#2268E5] bg-[#E4EEFC]" : ""
                        }`}
                        onClick={() => setCommentsOpen(v => !v)}
                        type="button"
                        aria-expanded={commentsOpen}
                        aria-controls={`pubcard-comments-${_id}`}
                    >
                        <svg viewBox="0 0 20 20" fill="none" width="18" height="18" className="mr-[2px] inline-block align-middle" aria-hidden="true">
                            <path d="M6.7 15.91c-2.98 0-5.33-2.02-5.33-4.5s2.35-4.5 5.33-4.5c.45 0 .89.04 1.32.13.71-1.35 2.3-2.27 4.11-2.27 2.12 0 3.85 1.25 3.85 2.79 0 .08-.01.16-.02.24.72.61 1.15 1.39 1.15 2.24 0 1.85-1.98 3.36-4.43 3.36a5.92 5.92 0 01-1.4-.15c-.38 1.04-1.65 1.81-3.19 1.81Z"  stroke="#2268E5" strokeWidth="1.56" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {/* PATCH: Add comment count next to Comments */}
                        {commentsOpen ? "Hide comments" : "Comments"}
                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full bg-[#E5EAF2] text-[#5D6B89] font-semibold text-xs">
                            {commentCount !== null ? commentCount : <span className="opacity-40">&ndash;</span>}
                        </span>
                    </button>
                </div>
                {commentsOpen && (
                    <div className="pt-1" id={`pubcard-comments-${_id}`}>
                        {/* Pass setCommentCount so that child can update parent when count changes */}
                        <PublicationComments publicationId={_id ?? "na"} setCommentCount={setCommentCount} />
                    </div>
                )}
            </div>
            <style jsx global>{`
                .comments-scrollbar::-webkit-scrollbar {
                  height: 8px;
                  width: 7px;
                  background: transparent;
                }
                .comments-scrollbar::-webkit-scrollbar-thumb {
                  background: #e5eaf2;
                  border-radius: 6px;
                }
                .comments-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
            `}</style>
        </div>
    );
};

export default PublicationCard;
