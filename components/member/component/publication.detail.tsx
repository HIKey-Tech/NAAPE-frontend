"use client"


import React, { useEffect, useRef, useState } from "react";
import type { IPublication } from "@/app/api/publication/types";
import { useParams, useRouter } from "next/navigation";
import { useComments, useAddComment } from "@/hooks/useComment";
import { useGetSinglePublication, usePublications } from "@/hooks/usePublications";

// Treat this as [slug] route

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
    science: { bg: "bg-[#DEEFFB]", text: "text-[#246BAE]", icon: <span className="mr-2">🔬</span> },
    art: { bg: "bg-[#FFE3F7]", text: "text-[#C43A93]", icon: <span className="mr-2">🎨</span> },
    technology: { bg: "bg-[#E5F6EC]", text: "text-[#219150]", icon: <span className="mr-2">💻</span> },
    history: { bg: "bg-[#FEF4E9]", text: "text-[#B5691B]", icon: <span className="mr-2">🏛️</span> },
    default: { bg: "bg-[#EDF2FE]", text: "text-[#4073C8]", icon: <span className="mr-2">📚</span> },
};

function getCategoryStyle(categoryVal?: string | null) {
    if (!categoryVal) return CATEGORY_COLOR_MAP.default;
    const key = String(categoryVal).toLowerCase();
    return CATEGORY_COLOR_MAP[key] || CATEGORY_COLOR_MAP.default;
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

const PublicationComments: React.FC<{ publicationId: string }> = ({ publicationId }) => {
    const [input, setInput] = useState("");
    const { data: commentsRaw = [], isPending, error, refetch } = useComments(publicationId);
    const addComment = useAddComment();
    console.log("publication Id", publicationId)

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
        <section className="border-t border-gray-200 pt-6 mt-6 px-2 sm:px-8 max-w-2xl">
            <h4 className="font-semibold mb-3 text-[#214377] text-xl">Comments</h4>
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
        </section>
    );
};

const DetailMetaRow = ({
    icon,
    label,
    value,
    children,
    title,
}: {
    icon?: React.ReactNode;
    label?: string;
    value?: string | React.ReactNode;
    children?: React.ReactNode;
    title?: string;
}) => (
    <div className="flex items-start gap-4 w-full pb-3 last:pb-0" title={title}>
        {icon && (
            <span className="text-xl flex-shrink-0 pt-0.5 mr-1">{icon}</span>
        )}
        <div className="flex flex-col">
            {label && (
                <span className="text-xs uppercase text-[#7B93B7] font-bold mb-0.5">{label}</span>
            )}
            {value && (
                <span className="text-[16px] sm:text-[18px] font-semibold text-[#204272]">
                    {value}
                </span>
            )}
            {children}
        </div>
    </div>
);

const FallbackImage =
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=thumb&w=600&q=80";

// --- For routing back to card grid ---
const BackToCardButton: React.FC<{ backHref?: string }> = ({ backHref }) => {
    const router = useRouter();
    return (
        <button
            onClick={() => {
                if (backHref) router.push(backHref);
                else router.back();
            }}
            className="bg-blue-100 text-blue-900 rounded px-3 py-1 mb-2 font-semibold border border-blue-200 hover:bg-blue-200 transition-colors"
            style={{ width: "auto", marginTop: 22, marginLeft: 32, zIndex: 30, position: "absolute" }}
        >
            ← Back to Publications
        </button>
    );
};

// Main detail component for [slug] route
const PublicationDetail: React.FC<{ publicationId?: string; backTo?: string }> = ({ publicationId, backTo }) => {
    // For [slug] routes, param is typically called slug, but we alias to id for consistency
    const params = useParams();
    let id = publicationId;
    // Prefer prop if provided, otherwise use slug param; fallback to treating param as string/array
    if (!id) {
        // Accept [slug] or [id] as key for param
        const slugParam = (params as any)?.slug ?? (params as any)?.id;
        if (typeof slugParam === "string") {
            id = slugParam;
        } else if (Array.isArray(slugParam)) {
            id = slugParam[0];
        }
    }
    if (!id) {
        return (
            <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-[#E5EAF2]">
                <span className="text-2xl text-red-400 font-bold mb-2">Not Found</span>
                <div className="text-[#96A6BF]">No publication id provided.</div>
            </div>
        );
    }

    const { data: publication, isPending, error } = useGetSinglePublication(id as string);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [dims, setDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    useEffect(() => {
        function updateDims() {
            if (containerRef.current) {
                setDims({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        }
        updateDims();
        window.addEventListener('resize', updateDims);
        return () => window.removeEventListener('resize', updateDims);
    }, []);

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-[400px] py-16 bg-white rounded-2xl border border-[#E6EDF5]">
                <div className="text-lg text-[#7890B0] font-semibold">Loading publication details...</div>
            </div>
        );
    }

    if (error || !publication) {
        return (
            <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-[#E5EAF2]">
                <span className="text-2xl text-red-400 font-bold mb-2">Not Found</span>
                <div className="text-[#96A6BF]">Unable to load the requested publication.</div>
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
        summary,
        tags,
        updatedAt,
        references,
        attachments
    } = publication as unknown as IPublication & {
        summary?: string;
        tags?: string[] | string;
        references?: string[] | string;
        attachments?: { url: string; name: string }[] | string;
        updatedAt?: string;
    };

    const statusValue: PublicationStatus =
        status === "approved"
            ? "approved"
            : status === "pending"
                ? "pending"
                : "rejected";
    const statusInfo = STATUS_CONFIG[statusValue] || STATUS_CONFIG["pending"];

    const tagList = Array.isArray(tags)
        ? tags
        : tags
            ? String(tags).split(",").map((t) => t.trim()).filter(Boolean)
            : [];
    const refList = Array.isArray(references)
        ? references
        : references
            ? String(references).split(/[,;]+/).map((r) => r.trim()).filter(Boolean)
            : [];
    let files =
        typeof attachments === "string"
            ? []
            : Array.isArray(attachments)
                ? attachments
                : [];

    const mainImage = image || FallbackImage;

    // Use backTo query param, if any, to return to grid
    let backHref: string | undefined = backTo;
    if (typeof window !== "undefined" && !backHref) {
        const url = new URL(window.location.href);
        if (url.searchParams.has("backTo")) {
            backHref = url.searchParams.get("backTo") || undefined;
        }
    }

    return (
        <section
            ref={containerRef}
            className="w-full max-w-3xl mx-auto bg-white border border-blue-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col"
            style={{
                minWidth: 320,
                minHeight: 400,
                marginTop: 36,
                position: "relative",
            }}
        >
            {/* "Back" button (to publication card grid) */}
            <BackToCardButton backHref={backHref} />

            {/* Dim overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 22,
                    left: 22,
                    zIndex: 20,
                    background: "rgba(255,255,255,0.90)",
                    borderRadius: "8px",
                    padding: "1px 10px",
                    fontSize: "12px",
                    color: "#446199",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
                className="select-none"
                aria-label="Container dimensions"
            >
                {`Width: ${dims.width || "-"}px, Height: ${dims.height || "-"}px`}
            </div>
            {/* Header image */}
            <div
                className="relative w-full bg-blue-50 flex items-center justify-center overflow-hidden border-b-2 border-blue-100"
                style={{
                    width: "100%",
                    aspectRatio: "2/1",
                    minHeight: 148,
                    maxHeight: 340,
                    height: "auto",
                }}
            >
                <img
                    src={mainImage}
                    alt={title}
                    className="object-cover w-full h-full transition-transform duration-400"
                    draggable={false}
                    loading="lazy"
                    style={{
                        minHeight: "100%",
                        minWidth: "100%",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(1.04)",
                    }}
                />
                {/* Pills row: category and status */}
                <div className="absolute top-7 left-0 w-full flex justify-between items-center px-8 z-10 pointer-events-none" style={{ gap: 12 }}>
                    <div className="flex-1 min-w-0 flex">
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
                                    pointerEvents: "auto",
                                    maxWidth: 200
                                }}
                            >
                                {getCategoryStyle(category).icon}
                                <span className="truncate block">{String(category)}</span>
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 flex justify-end">
                        <span
                            className={[
                                pillBaseClasses,
                                statusInfo.bg, statusInfo.text,
                                "border-blue-200",
                            ].join(" ")}
                            title={statusInfo.label}
                            style={{
                                pointerEvents: "auto",
                            }}
                        >
                            {statusInfo.icon}
                            <span className="truncate block">{statusInfo.label}</span>
                        </span>
                    </div>
                </div>
            </div>
            {/* Main content */}
            <div className="flex flex-col gap-6 px-6 sm:px-12 pt-8 pb-10 w-full">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#184072] tracking-tight mb-2 break-words">
                    {title}
                </h1>
                {/* Meta info */}
                <div className="flex flex-col sm:flex-row sm:gap-16 gap-3 mb-3">
                    <DetailMetaRow
                        icon={<svg className="w-5 h-5 mr-1.5 text-blue-400" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#E5EAF2" /><path d="M6 12.5V8.5c0-2 1-3 4-3s4 1 4 3v4c0 2-1 3-4 3s-4-1-4-3z" stroke="#3666AE" strokeWidth="1.2" /><circle cx="10" cy="12" r="1" fill="#3666AE" /></svg>}
                        label="Author"
                        value={author?.name?.toString() || getAuthorString(author) || "Unknown"}
                    />
                    <DetailMetaRow
                        icon={<svg className="w-5 h-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24"><path stroke="#4061a5" strokeWidth="1.4" d="M12 7v5l4 2" /><circle cx="12" cy="12" r="10" stroke="#C9D9F6" strokeWidth="1.7" fill="#F0F5FB" /></svg>}
                        label="Published"
                        value={createdAt
                            ? new Date(createdAt).toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "Unknown date"}
                    />
                    {updatedAt && (
                        <DetailMetaRow
                            icon={<svg className="w-5 h-5 text-blue-300 mr-1" fill="none" viewBox="0 0 24 24"><path stroke="#3896f6" strokeWidth="1.5" d="M17.8 17.8A8 8 0 1 1 21 12" /><path stroke="#3896f6" strokeWidth="1.5" d="M12 8v4l4 2" /></svg>}
                            label="Updated"
                            value={new Date(updatedAt).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: '2-digit', minute: '2-digit' })}
                        />
                    )}
                </div>

                {/* Summary */}
                {summary && (
                    <DetailMetaRow
                        icon={<svg className="w-5 h-5 text-amber-400 mr-1" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="5" fill="#FFFDE1" /><path d="M5 7h10M5 10h10M5 13h7" stroke="#D9A53E" strokeWidth="1.7" strokeLinecap="round" /></svg>}
                        label="Summary"
                        value={<span className="font-medium text-[#535c7d]">{summary}</span>}
                    />
                )}

                {/* Full Content */}
                {content && (
                    <section className="border-l-4 border-blue-200 bg-[#f7faff] py-5 px-7 rounded-xl shadow-xs mt-2 mb-3">
                        <h2 className="text-xl font-bold text-[#21569A] mb-3">Full Text</h2>
                        <div
                            className="text-base sm:text-lg text-[#294469] font-semibold leading-relaxed break-words whitespace-pre-line"
                            style={{ wordBreak: "break-word" }}
                        >
                            {content}
                        </div>
                    </section>
                )}

                {/* Tags */}
                {tagList && tagList.length > 0 && (
                    <DetailMetaRow
                        icon={<span className="mr-1.5 text-blue-400 text-xl">🏷️</span>}
                        label="Tags"
                        value={
                            <div className="flex flex-wrap gap-2">
                                {tagList.map((tag, i) => (
                                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold text-xs">
                                        {String(tag)}
                                    </span>
                                ))}
                            </div>
                        }
                    />
                )}

                {/* References */}
                {refList && refList.length > 0 && (
                    <DetailMetaRow
                        icon={<span className="mr-1.5 text-gray-400 text-xl">🔗</span>}
                        label="References"
                        value={
                            <ul className="list-disc ml-5 text-[15px] font-medium text-[#3f4877] space-y-1 pt-1">
                                {refList.map((ref, i) => (
                                    <li key={i}>
                                        {/^https?:\/\//i.test(ref)
                                            ? (
                                                <a href={ref} className="text-blue-500 underline break-all" target="_blank" rel="noopener noreferrer">{ref}</a>
                                            )
                                            : ref
                                        }
                                    </li>
                                ))}
                            </ul>
                        }
                    />
                )}

                {/* Attachments */}
                {files && files.length > 0 && (
                    <DetailMetaRow
                        icon={<span className="mr-2 text-blue-300 text-xl">📎</span>}
                        label="Attachments"
                        value={
                            <ul className="ml-2 list-disc text-blue-500 underline space-y-1">
                                {files.map((f, i) => (
                                    <li key={i}>
                                        <a href={f.url} download target="_blank" rel="noopener noreferrer">{f.name || f.url}</a>
                                    </li>
                                ))}
                            </ul>
                        }
                    />
                )}

                {/* Comments Section */}
                <PublicationComments publicationId={_id || id || ""} />
            </div>
        </section>
    );
};

export default PublicationDetail;
