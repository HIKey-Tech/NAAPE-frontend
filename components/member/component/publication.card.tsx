import React, { useState } from "react";
import type { IPublication } from "@/app/api/publication/types";
import { useComments, useAddComment } from "@/hooks/useComment";
import { useRouter } from "next/navigation";

// STATUS_CONFIG: unchanged
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-50 border-yellow-300",
    text: "text-yellow-900",
    icon: (
      <svg className="inline-block mr-2" width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <circle cx="10"  r="8" stroke="#FFD600" strokeWidth="2.5" fill="#FFF9E5" />
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
      <svg className="inline-block mr-2" width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
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
      <svg className="inline-block mr-2" width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
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

// Utility for comment author name extraction
function getCommentAuthorDisplayName(author: any): string {
  if (!author) return "Unknown";
  if (typeof author === "string" || typeof author === "number") return String(author);
  if (typeof author === "object" && author !== null) {
    if (author.name) return author.name;
    if (author.fullName) return author.fullName;
    if (author.firstName && author.lastName) return `${author.firstName} ${author.lastName}`;
    if (author.email) return author.email;
    if (author.username) return author.username;
    if (author._id) return author._id;
    try {
      return JSON.stringify(author);
    } catch {
      return "Unknown";
    }
  }
  return "Unknown";
}

// Utility for comment time extraction/formatting
function getCommentTime(comment: any): string {
  const rawDate =
    comment?.createdAt ||
    comment?.timestamp ||
    comment?.date ||
    comment?.created_at ||
    comment?.postedAt;

  if (!rawDate) return "";
  try {
    const d = typeof rawDate === "string" || typeof rawDate === "number"
      ? new Date(rawDate)
      : rawDate instanceof Date
        ? rawDate
        : undefined;
    if (!d || isNaN(+d)) return "";
    // Only show localized time, e.g., 10:15 AM
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

// Comment feature (ensured author name display, and time)
const PublicationComments: React.FC<{ publicationId: string }> = ({ publicationId }) => {
  const [input, setInput] = useState("");
  const { data: commentsRaw = [], isPending, error, refetch } = useComments(publicationId);
  const addComment = useAddComment();

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
    <div className="border-t border-gray-200 pt-4 mt-6 px-2 sm:px-3 transition-all" aria-labelledby="comments-heading">
      <h4 className="font-semibold mb-2 text-gray-800" id="comments-heading">Comments</h4>
      <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row mb-3 gap-2" aria-label="Add a comment">
        <label htmlFor={`comment-input-${publicationId}`} className="sr-only">Add a comment</label>
        <input
          id={`comment-input-${publicationId}`}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a comment"
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          disabled={addComment.isPending}
          maxLength={400}
          aria-disabled={addComment.isPending}
        />
        <button
          type="submit"
          disabled={addComment.isPending || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60"
          aria-disabled={addComment.isPending || !input.trim()}
          aria-label="Send comment"
        >
          Send
        </button>
      </form>
      {isPending && <div className="text-gray-400 text-sm mb-2" aria-live="polite">Loading...</div>}
      {error && (
        <div className="text-red-500 text-sm mb-2" role="alert">
          Error loading comments.{" "}
          <button onClick={() => refetch?.()} className="underline" aria-label="Retry loading comments">Retry</button>
        </div>
      )}
      {!isPending && comments.length === 0 && (
        <div className="text-gray-400 italic text-sm">No comments yet.</div>
      )}
      <ul className="space-y-2 mt-2" aria-live="polite">
        {comments.map((comment: any, idx: number) => {
          const content =
            comment.content ?? comment.text ?? comment.message ?? comment.body ?? "";
          const authorDisplay = getCommentAuthorDisplayName(
            // Root: try comment.author, but also try possible fallback fields if necessary
            comment.author ?? comment.user ?? comment.username ?? comment.name
          );
          const commentTime = getCommentTime(comment);
          return (
            <li
              key={comment._id || comment.id || idx}
              className="border border-gray-100 rounded px-3 py-2 bg-gray-50"
              tabIndex={0}
              aria-label={
                `Comment by ${authorDisplay}${commentTime ? ` at ${commentTime}` : ""}: ${content}`
              }
            >
              <div className="flex flex-row items-center mb-1">
                <span className="font-bold text-gray-700 text-sm mr-2">{authorDisplay}</span>
                {commentTime && (
                  <span className="text-gray-400 text-xs italic ml-auto" title={commentTime}>
                    {commentTime}
                  </span>
                )}
              </div>
              <span className="text-gray-800 text-sm">{content}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Card UI
const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  className = "",
  isAdmin = false,
  onAccept,
  onReject,
  onDelete,
}) => {
  const [showComments, setShowComments] = useState(false);
  const router = useRouter();

  if (!publication) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl w-full flex flex-col items-center justify-center text-gray-400 py-14 px-6 aspect-square">
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
    category,
  } = publication;

  // status handling
  let statusValue: PublicationStatus;
  if (status === "approved") statusValue = "approved";
  else if (status === "pending") statusValue = "pending";
  else if (status === "rejected") statusValue = "rejected";
  else statusValue = "pending";

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

  // Count comments
  const { data: commentsForCount = [] } = useComments(_id);
  const commentCount =
    Array.isArray(commentsForCount)
      ? commentsForCount.length
      : (commentsForCount && typeof commentsForCount === "object" && commentsForCount !== null)
        ? Object.values(commentsForCount).length
        : 0;

  function handleCardClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
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
      router.push(`/publications/${_id}`);
    }
  }

  return (
    <div
      className={[
        "w-full max-w-md",
        "rounded-xl overflow-hidden",
        // remove shadow-md and use a thicker border
        "bg-white border-2 border-blue-200",
        "flex flex-col",
        className,
      ].join(" ")}
      tabIndex={0}
      onClick={handleCardClick}
      role="button"
      aria-label={title ? `Go to publication: ${title}` : "Go to publication"}
      aria-describedby={`pubcard-info-${_id}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCardClick(e as any);
      }}
      style={{ cursor: "pointer", minHeight: 340 }}
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/2.2] bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={title ? `Cover image for ${title}` : "Publication cover"}
            className="object-cover w-full h-full"
            style={{ minHeight: 140, maxHeight: 220 }}
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-3xl text-gray-300">No image</div>
        )}

        {/* STATUS PILL */}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold border ${STATUS_CONFIG[statusValue].bg} ${STATUS_CONFIG[statusValue].text}`}>
          {STATUS_CONFIG[statusValue].icon}
          {STATUS_CONFIG[statusValue].label}
        </span>
        {/* CATEGORY PILL */}
        {category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold border border-blue-200">
            {String(category)}
          </span>
        )}
      </div>
      {/* CONTENT */}
      <div id={`pubcard-info-${_id}`} className="flex flex-col gap-2 p-4 flex-1">
        {/* TITLE */}
        <h2 className="text-xl font-bold truncate w-full">{title}</h2>
        {/* META */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            By <span className="font-semibold">{getAuthorString(author?.name) || "Unknown"}</span>
          </span>
          <span>·</span>
          <span>
            {createdAt
              ? new Date(createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown date"}
          </span>
        </div>
        {/* MAIN CONTENT (excerpt) */}
        <p className="text-gray-700 text-base mt-1 mb-2 line-clamp-3 whitespace-pre-line">{content}</p>
        {/* Action bar */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-2 sm:gap-6 mt-auto">
          {/* Admin - accept/reject */}
          {isAdmin && statusValue === "pending" && (
            <div className="flex flex-row gap-2">
              <button
                className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-full font-semibold text-sm border border-green-200"
                onClick={onAccept}
                type="button"
                data-stop-propagation
                aria-label="Accept publication"
              >
                Accept
              </button>
              <button
                className="bg-red-100 hover:bg-red-200 text-red-900 px-4 py-2 rounded-full font-semibold text-sm border border-red-200"
                onClick={onReject}
                type="button"
                data-stop-propagation
                aria-label="Reject publication"
              >
                Reject
              </button>
            </div>
          )}
          {/* Comments toggle */}
          <button
            className={`flex items-center gap-1 text-blue-700 font-semibold px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-sm ${showComments ? 'bg-blue-100 border-blue-300' : ''}`}
            onClick={e => {
              e.stopPropagation();
              setShowComments(v => !v);
            }}
            type="button"
            aria-expanded={showComments}
            aria-controls={`pubcard-comments-${_id}`}
            data-stop-propagation
          >
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18" className="inline-block align-middle mr-1" aria-hidden="true">
              <path d="M6.7 15.91c-2.98 0-5.33-2.02-5.33-4.5s2.35-4.5 5.33-4.5c.45 0 .89.04 1.32.13.71-1.35 2.3-2.27 4.11-2.27 2.12 0 3.85 1.25 3.85 2.79 0 .08-.01.16-.02.24.72.61 1.15 1.39 1.15 2.24 0 1.85-1.98 3.36-4.43 3.36a5.92 5.92 0 01-1.4-.15c-.38 1.04-1.65 1.81-3.19 1.81Z" stroke="#2268E5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {showComments ? "Hide comments" : "Comments"}
            <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-xs">
              {commentCount}
            </span>
          </button>
        </div>
      </div>
      {/* COMMENTS */}
      {showComments && (
        <div className="px-3 pb-2 pt-1" id={`pubcard-comments-${_id}`}>
          <PublicationComments publicationId={_id ?? "na"} />
        </div>
      )}
    </div>
  );
};

export default PublicationCard;
