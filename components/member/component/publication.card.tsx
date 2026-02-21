import React, { useState } from "react";
import type { IPublication } from "@/app/api/publication/types";
import { useComments, useAddComment } from "@/hooks/useComment";
import { useRouter } from "next/navigation";
import { usePublicationUIStore } from "@/store/usePublicationStore";
import { FaCheck, FaTimes, FaCommentAlt, FaRegClock, FaCircle, FaEdit } from "react-icons/fa";

const STATUS_CONFIG = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600", icon: FaEdit },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-100", icon: FaRegClock },
  approved: { label: "Published", className: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: FaCheck },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-100", icon: FaTimes },
} as const;

type PublicationStatus = keyof typeof STATUS_CONFIG;

type PublicationCardProps = {
  publication?: IPublication | null;
  className?: string;
  isAdmin?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onDelete?: (id: string) => void;
  baseRoute?: string;
};

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
    try { return JSON.stringify(author); } catch { return "Unknown"; }
  }
  return "Unknown";
}

function getCommentTime(comment: any): string {
  const rawDate = comment?.createdAt || comment?.timestamp || comment?.date || comment?.created_at || comment?.postedAt;
  if (!rawDate) return "";
  try {
    const d = typeof rawDate === "string" || typeof rawDate === "number" ? new Date(rawDate) : rawDate instanceof Date ? rawDate : undefined;
    if (!d || isNaN(+d)) return "";
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch { return ""; }
}

const PublicationComments: React.FC<{ publicationId: string }> = ({ publicationId }) => {
  const [input, setInput] = useState("");
  const { data: commentsRaw = [], isPending, error, refetch } = useComments(publicationId);
  const addComment = useAddComment();

  const comments: any[] = Array.isArray(commentsRaw)
    ? commentsRaw
    : (commentsRaw && typeof commentsRaw === "object" && commentsRaw !== null) ? Object.values(commentsRaw) : [];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addComment.mutate({ publicationId, text: trimmed }, { onSuccess: () => { setInput(""); refetch?.(); } });
  };

  return (
    <div className="border-t border-slate-100 pt-4 mt-4 px-1" aria-labelledby="comments-heading">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3" id="comments-heading">Comments</h4>
      <form onSubmit={handleAddComment} className="flex gap-2 mb-3" aria-label="Add a comment">
        <input
          id={`comment-input-${publicationId}`}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          disabled={addComment.isPending}
          maxLength={400}
        />
        <button
          type="submit"
          disabled={addComment.isPending || !input.trim()}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          Send
        </button>
      </form>
      {isPending && <div className="text-slate-400 text-xs mb-2">Loading...</div>}
      {error && (
        <div className="text-red-500 text-xs mb-2">
          Error loading comments. <button onClick={() => refetch?.()} className="underline font-bold">Retry</button>
        </div>
      )}
      {!isPending && comments.length === 0 && <div className="text-slate-400 italic text-xs">No comments yet.</div>}
      <ul className="space-y-2 mt-2">
        {comments.map((comment: any, idx: number) => {
          const content = comment.content ?? comment.text ?? comment.message ?? comment.body ?? "";
          const authorDisplay = getCommentAuthorDisplayName(comment.author ?? comment.user ?? comment.username ?? comment.name);
          const commentTime = getCommentTime(comment);
          return (
            <li key={comment._id || comment.id || idx} className="rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-100" tabIndex={0}>
              <div className="flex items-center mb-1">
                <span className="font-bold text-slate-700 text-xs mr-2">{authorDisplay}</span>
                {commentTime && <span className="text-slate-400 text-xs ml-auto">{commentTime}</span>}
              </div>
              <span className="text-slate-700 text-sm">{content}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  className = "",
  isAdmin = false,
  onAccept,
  onReject,
  baseRoute = "/publications",
  onDelete,
}) => {
  const router = useRouter();

  if (!publication) {
    return (
      <div className="bg-white dark:bg-card border border-slate-100 dark:border-border rounded-2xl w-full flex flex-col items-center justify-center text-slate-400 py-14 px-6">
        Invalid publication data.
      </div>
    );
  }

  const { title, content, author, createdAt, image, status, _id, category } = publication;

  const showComments = usePublicationUIStore((s) => s.openComments[_id ?? ""] ?? false);
  const toggleComments = usePublicationUIStore((s) => s.toggleComments);

  let statusValue: PublicationStatus;
  if (status === "draft") statusValue = "draft";
  else if (status === "pending") statusValue = "pending";
  else if (status === "approved") statusValue = "approved";
  else if (status === "rejected") statusValue = "rejected";
  else statusValue = "pending";

  const StatusIcon = STATUS_CONFIG[statusValue].icon;

  function getAuthorString(author: any) {
    if (!author) return "";
    if (typeof author === "string" || typeof author === "number") return author;
    if (typeof author === "object" && author !== null) {
      if (author.name) return author.name;
      if (author.email) return author.email;
      if (author._id) return author._id;
    }
    return "";
  }

  const { data: commentsForCount = [] } = useComments(_id);
  const commentCount = Array.isArray(commentsForCount) ? commentsForCount.length : Object.values(commentsForCount ?? {}).length;

  function handleCardClick(e: React.MouseEvent<HTMLDivElement>) {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (tag === "button" || tag === "input" || tag === "textarea" || tag === "a" || (e.target as HTMLElement).closest("[data-stop-propagation]")) return;
    if (publication?.status === "draft") router.push(`/publications/edit/${_id}`);
    else router.push(`${baseRoute}/${_id}`);
  }

  return (
    <div
      className={`w-full max-w-md rounded-2xl overflow-hidden bg-white dark:bg-card border border-slate-100 dark:border-border shadow-sm flex flex-col hover:shadow-lg transition-all group cursor-pointer ${className}`}
      tabIndex={0}
      onClick={handleCardClick}
      role="button"
      aria-label={`Go to publication: ${title}`}
      style={{ minHeight: 340 }}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/2.2] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {image ? (
          <img src={image} alt={`Cover image for ${title}`} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-slate-300 text-sm font-medium">No image</div>
        )}
        <span className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[statusValue].className}`}>
          <StatusIcon size={12} /> {STATUS_CONFIG[statusValue].label}
        </span>
        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-slate-700 text-xs font-bold border border-slate-200 shadow-sm">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-primary transition-colors">{title}</h2>
        <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
          <span>By <span className="font-bold text-slate-600 dark:text-slate-300">{getAuthorString(author?.name) || "Unknown"}</span></span>
          <span>·</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 whitespace-pre-line leading-relaxed">{content}</p>

        {/* Footer */}
        <div className="mt-auto pt-3 flex justify-between items-center gap-4">
          {isAdmin && statusValue === "pending" && (
            <div className="flex gap-2" data-stop-propagation>
              <button onClick={onAccept} className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors" data-stop-propagation>Approve</button>
              <button onClick={onReject} className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" data-stop-propagation>Reject</button>
            </div>
          )}
          <button
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors ml-auto ${showComments ? "bg-primary/10 text-primary border border-primary/20" : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-800"
              }`}
            onClick={(e) => { e.stopPropagation(); toggleComments(_id); }}
            data-stop-propagation
          >
            <FaCommentAlt size={12} />
            {showComments ? "Hide" : "Comments"}
            <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black">{commentCount}</span>
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4">
          <PublicationComments publicationId={_id} />
        </div>
      )}
    </div>
  );
};
