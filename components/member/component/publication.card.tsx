import React, { useRef, useState, useCallback } from "react";
import type { IPublication } from "@/app/api/publication/types";
import { useComments, useAddComment } from "@/hooks/useComment";

const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: (
            <svg
                className="inline-block mr-1"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                style={{ verticalAlign: "middle" }}
            >
                <circle cx="10" cy="10" r="8" stroke="#FFD600" strokeWidth="2" fill="#FFF9E5" />
                <path d="M10 6v5" stroke="#E2A900" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="13.5" r="1" fill="#E2A900" />
            </svg>
        ),
    },
    approved: {
        label: "Published",
        bg: "bg-green-100",
        text: "text-green-800",
        icon: (
            <svg
                className="inline-block mr-1"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                style={{ verticalAlign: "middle" }}
            >
                <circle cx="10" cy="10" r="8" stroke="#26C281" strokeWidth="2" fill="#D6FFE7" />
                <path d="M7 10.5l2.2 2L13 8.5" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    rejected: {
        label: "Rejected",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: (
            <svg
                className="inline-block mr-1"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                style={{ verticalAlign: "middle" }}
            >
                <circle cx="10" cy="10" r="8" stroke="#FF6161" strokeWidth="2" fill="#FFD8D8" />
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

const splitTitle = (title: string, maxLineLength = 30): [string, string] => {
    if (!title) return ["", ""];
    if (title.length <= maxLineLength) return [title, ""];
    const splitIndex = title.lastIndexOf(" ", maxLineLength);
    if (splitIndex <= 0) return [title, ""];
    return [title.slice(0, splitIndex), title.slice(splitIndex + 1)];
};

// ---------- Comments Block (Improved Hierarchy) ----------
const PublicationComments: React.FC<{ publicationId: string }> = ({
    publicationId,
}) => {
    const [input, setInput] = useState("");

    const {
        data: commentsRaw = [],
        isPending,
        error,
        refetch,
    } = useComments(publicationId);

    const addComment = useAddComment();

    const comments: any[] = Array.isArray(commentsRaw)
        ? commentsRaw
        : (commentsRaw && typeof commentsRaw === "object" && commentsRaw !== null)
            ? Object.values(commentsRaw)
            : [];

    const handleAddComment = useCallback(
        async (e: React.FormEvent) => {
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
        },
        [addComment, input, publicationId, refetch]
    );

    function getCommentKey(comment: any, index: number) {
        if (comment.id) return comment.id;
        if (comment._id) return comment._id;
        if (comment.createdAt && comment.author) return `${comment.createdAt}-${getAuthorString(comment.author)}`;
        return `idx-${index}`;
    }

    function getAuthorString(author: any) {
        if (!author) return "";
        if (typeof author === "string" || typeof author === "number") return String(author);
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
        <div className="border-t border-gray-200 pt-5 mt-2 w-full">
            <h3 className="text-base font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <svg width="18" height="18" className="inline-block text-blue-400" fill="none" viewBox="0 0 20 20">
                    <path d="M6.7 15.91c-2.98 0-5.33-2.02-5.33-4.5s2.35-4.5 5.33-4.5c.45 0 .89.04 1.32.13.71-1.35 2.3-2.27 4.11-2.27 2.12 0 3.85 1.25 3.85 2.79 0 .08-.01.16-.02.24.72.61 1.15 1.39 1.15 2.24 0 1.85-1.98 3.36-4.43 3.36a5.92 5.92 0 01-1.4-.15c-.38 1.04-1.65 1.81-3.19 1.81Z" stroke="#2268E5" strokeWidth="1.56" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Comments
            </h3>
            <form
                onSubmit={handleAddComment}
                className="flex items-center gap-2 mb-4"
                autoComplete="off"
            >
                <input
                    type="text"
                    className="block w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition"
                    placeholder="Add a comment..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={addComment.isPending}
                    maxLength={400}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60"
                    disabled={addComment.isPending || !input.trim()}
                >
                    Send
                </button>
            </form>
            <div className="max-h-44 overflow-y-auto pr-2">
                {isPending && (
                    <div className="py-2 text-center text-gray-400 text-xs">Loading comments...</div>
                )}
                {error && (
                    <div className="py-2 text-center text-red-500 text-xs flex items-center justify-center gap-2">
                        Error loading comments.
                        <button onClick={() => refetch?.()} className="underline ml-2 text-blue-600">Retry</button>
                    </div>
                )}
                {!isPending && comments.length === 0 && (
                    <div className="py-2 text-center text-gray-400 text-xs">
                        No comments yet.
                    </div>
                )}
                <ul className="space-y-2">
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
                          <li
                              key={getCommentKey(comment, idx)}
                              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                          >
                              <div className="flex items-center gap-2 mb-1.5">
                                  <span className="font-medium text-blue-700 text-xs">{authorVal}</span>
                                  <span className="text-gray-400 text-xs">
                                      {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                  </span>
                              </div>
                              <div className="text-sm text-gray-800 whitespace-pre-line">{content}</div>
                          </li>
                      );
                  })}
                </ul>
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
    onDelete,
}) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [showComments, setShowComments] = useState(false);

    if (!publication) {
        return (
            <div
                className={[
                    "bg-white border border-[#E5EAF2] rounded-2xl max-w-full w-full overflow-hidden flex flex-col items-center justify-center text-[#96A6BF] py-12",
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

    const {
        data: commentsForCount = [],
    } = useComments(_id);

    const commentCount =
        Array.isArray(commentsForCount)
            ? commentsForCount.length
            : (commentsForCount && typeof commentsForCount === "object" && commentsForCount !== null)
                ? Object.values(commentsForCount).length
                : 0;

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

    return (
        <div
            ref={cardRef}
            className={[
                "bg-gradient-to-br from-white via-[#FAFCFE] to-[#F3F7FB] border border-[#E5EAF2] rounded-2xl max-w-full w-full overflow-hidden flex flex-col group",
                className
            ].join(" ")}
        >
            {/* Header with category chip & status label */}
            <div className="relative w-full bg-gradient-to-tr from-blue-200/50 to-gray-100 h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 overflow-hidden flex flex-shrink-0">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.025] group-hover:brightness-105"
                    draggable={false}
                    loading="lazy"
                    style={{ aspectRatio: "16/9", minHeight: "100%" }}
                />
                {/* Category Chip */}
                <div className="absolute top-3 left-3 flex gap-2 z-10">
                    {category && (
                        <span
                            className={[
                                "inline-flex items-center px-2 py-0.5 rounded-full border border-[#E5EAF2] bg-white/90 backdrop-blur-md",
                                getCategoryStyle(category).text,
                                "text-xs font-semibold whitespace-nowrap tracking-wide"
                            ].join(" ")}
                            title={`Category: ${category}`}
                            style={{
                                maxWidth: 160,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                            }}
                        >
                            {getCategoryStyle(category).icon}
                            {String(category)}
                        </span>
                    )}
                </div>
                {/* Status Chip */}
                <span
                    className={[
                        "absolute top-3 right-3 inline-flex items-center px-2 py-1 rounded-full",
                        statusInfo.bg, statusInfo.text,
                        "text-base font-semibold whitespace-nowrap"
                    ].join(" ")}
                    title={statusInfo.label}
                >
                    {statusInfo.icon}
                    {statusInfo.label}
                </span>
            </div>
            {/* Card Content Split */}
            <div className="p-5 pb-4 flex flex-col gap-4 sm:p-6 sm:pt-5 w-full">
                {/* TITLE */}
                <div className="mb-0 flex flex-col">
                    <div className="flex items-end gap-2 min-w-0">
                        <h2 className="text-[22px] sm:text-[25px] leading-tight font-extrabold text-[#173357] tracking-tight truncate max-w-full">
                            {mainTitle}
                            {subTitle && (
                                <span className="ml-1 block text-[#3666AE] font-bold text-[17px] truncate max-w-xs">{subTitle}</span>
                            )}
                        </h2>
                    </div>
                    {/* Publication meta */}
                    <div className="flex items-center gap-3 mt-2 ml-0.5 text-[#7890B0] text-[14px] font-medium">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="9" fill="#E5EAF2" />
                                <path d="M6 12.5V8.5c0-2 1-3 4-3s4 1 4 3v4c0 2-1 3-4 3s-4-1-4-3z" stroke="#3666AE" strokeWidth="1.2" />
                                <circle cx="10" cy="12" r="1" fill="#3666AE" />
                            </svg>
                            <span>{getAuthorString(author) || "Unknown"}</span>
                        </span>
                        <span className="mx-1.5 select-none text-gray-300 text-lg">&bull;</span>
                        <span>
                            {createdAt
                                ? new Date(createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })
                                : "Unknown date"}
                        </span>
                    </div>
                </div>

                {content && (
                    <div
                        className="text-[15px] sm:text-[16px] text-[#294469] leading-relaxed mt-1 line-clamp-4 sm:line-clamp-5 overflow-hidden break-words bg-gradient-to-r from-white to-[#F8FBFF] rounded-xl p-4 border border-[#EFF2F7] font-normal"
                        title={content}
                    >
                        {content}
                    </div>
                )}

                {/* Action buttons (admin): visually isolated */}
                {isAdmin && statusValue === "pending" && (
                    <div className="mt-4 flex gap-3 justify-end border-t border-blue-50 pt-4 w-full">
                        <button
                            className="bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-800 px-5 py-2 rounded-xl font-semibold text-[15px] flex items-center gap-2 transition focus:outline-none border border-green-200"
                            type="button"
                            onClick={onAccept}
                        >
                            <svg width="16" height="16" fill="none" className="mr-1" viewBox="0 0 16 16">
                                <path d="M4 8l3 3 5-5" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Accept
                        </button>
                        <button
                            className="bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 px-5 py-2 rounded-xl font-semibold text-[15px] flex items-center gap-2 transition focus:outline-none border border-red-200"
                            type="button"
                            onClick={onReject}
                        >
                            <svg width="16" height="16" fill="none" className="mr-1" viewBox="0 0 16 16">
                                <path d="M5 5l6 6M11 5l-6 6" stroke="#D33A2C" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Reject
                        </button>
                    </div>
                )}

                <div className="mt-3 flex justify-end w-full">
                    <button
                        className={`flex items-center gap-2 py-2 px-5 rounded-xl text-[15px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all focus:outline-none ${
                            showComments ? "ring-2 ring-blue-500 bg-blue-100" : ""
                        }`}
                        onClick={() => setShowComments((v) => !v)}
                        type="button"
                        aria-expanded={showComments}
                        aria-controls={`pubcard-comments-${_id}`}
                    >
                        <svg viewBox="0 0 20 20" fill="none" width="20" height="20" className="inline-block align-middle" aria-hidden="true">
                            <path d="M6.7 15.91c-2.98 0-5.33-2.02-5.33-4.5s2.35-4.5 5.33-4.5c.45 0 .89.04 1.32.13.71-1.35 2.3-2.27 4.11-2.27 2.12 0 3.85 1.25 3.85 2.79 0 .08-.01.16-.02.24.72.61 1.15 1.39 1.15 2.24 0 1.85-1.98 3.36-4.43 3.36a5.92 5.92 0 01-1.4-.15c-.38 1.04-1.65 1.81-3.19 1.81Z" stroke="#2268E5" strokeWidth="1.56" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {showComments ? "Hide comments" : "Show comments"}
                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
                            {typeof commentCount === "number"
                                ? commentCount
                                : <span className="opacity-40">&ndash;</span>}
                        </span>
                    </button>
                </div>

                {showComments && (
                    <div className="pt-2 w-full" id={`pubcard-comments-${_id}`}>
                        <PublicationComments publicationId={_id ?? "na"} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicationCard;
