"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { IPublication } from "@/app/api/publication/types";
import { useParams, useRouter } from "next/navigation";

import { useComments, useAddComment } from "@/hooks/useComment";
import {
    useGetSinglePublication,
    useDeletePublication,
    useEditPublication,
} from "@/hooks/usePublications";

import { useAuth } from "@/context/authcontext";
import { useSubscriptionStatus } from "@/hooks/useSubscription";
import { getAuthorLabel, isOwner, normalizeArray } from "@/lib/utils";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const STATUS_CONFIG = {
    draft: {
        label: "Draft",
        bg: "bg-slate-50 border-slate-200",
        text: "text-slate-700",
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#94a3b8" strokeWidth="2" />
                <path d="M7 10h6M10 7v6" stroke="#64748b" strokeWidth="2" />
            </svg>
        ),
    },
    pending: {
        label: "Pending",
        bg: "bg-amber-50 border-amber-200",
        text: "text-amber-700",
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#f59e0b" strokeWidth="2" />
                <path d="M10 6v5" stroke="#d97706" strokeWidth="2" />
                <circle cx="10" cy="14" r="1" fill="#d97706" />
            </svg>
        ),
    },
    approved: {
        label: "Published",
        bg: "bg-emerald-50 border-emerald-200",
        text: "text-emerald-700",
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#10b981" strokeWidth="2" />
                <path d="M6.5 10.5l2.5 2.5L13.5 8" stroke="#059669" strokeWidth="2" />
            </svg>
        ),
    },
    rejected: {
        label: "Rejected",
        bg: "bg-red-50 border-red-200",
        text: "text-red-700",
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="2" />
                <path d="M7 7l6 6M13 7l-6 6" stroke="#dc2626" strokeWidth="2" />
            </svg>
        ),
    },
} as const;

type PublicationStatus = keyof typeof STATUS_CONFIG;

const FallbackImage =
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80";


/* -------------------------------------------------------------------------- */
/*                               COMMENTS BLOCK                               */
/* -------------------------------------------------------------------------- */

const PublicationComments = ({ publicationId }: { publicationId: string }) => {
    const [text, setText] = useState("");
    const { data = [], isPending, refetch } = useComments(publicationId);
    const addComment = useAddComment();

    const comments = Array.isArray(data) ? data : [];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        addComment.mutate(
            { publicationId, text: text.trim() },
            { onSuccess: () => (setText("")) }
        );
    };

    return (
        <section className="border-t border-slate-100 pt-6 mt-10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Comments</h3>

            <form onSubmit={submit} className="flex gap-2 mb-4">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    placeholder="Add a comment"
                />
                <button
                    disabled={!text.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                    Send
                </button>
            </form>

            {isPending && <p className="text-slate-400 text-sm">Loading comments...</p>}

            {!isPending && comments.length === 0 && (
                <p className="italic text-slate-400 text-sm">No comments yet.</p>
            )}

            <ul className="space-y-2">
                {comments.map((c) => (
                    <li
                        key={c._id}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                    >
                        <strong className="mr-2 text-slate-700 text-sm">{getAuthorLabel(c.author)}:</strong>
                        <span className="text-slate-600 text-sm">{c.text || c.content}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

/* -------------------------------------------------------------------------- */
/*                             ACTIONS (EDIT/DEL)                             */
/* -------------------------------------------------------------------------- */

const PublicationActions = ({
    publication,
    onDeleted,
    onEdited,
}: {
    publication: IPublication;
    onDeleted: () => void;
    onEdited: () => void;
}) => {
    const router = useRouter();
    const del = useDeletePublication();
    const edit = useEditPublication();

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(publication.title);
    const [content, setContent] = useState(publication.content);

    useEffect(() => {
        setTitle(publication.title);
        setContent(publication.content);
    }, [publication.title, publication.content]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        edit.mutate(
            { id: publication._id!, updatedData: { title, content } },
            { onSuccess: () => (setEditing(false), onEdited()) }
        );
    };

    const remove = () => {
        if (!confirm("Delete this publication?")) return;
        del.mutate(publication._id!, {
            onSuccess: () => {
                onDeleted();
                router.back();
            },
        });
    };

    if (!editing) {
        return (
            <div className="flex gap-2">
                <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold text-sm hover:bg-amber-100 transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={remove}
                    className="px-4 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                >
                    Delete
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <input
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex gap-2">
                <button className="bg-primary text-white px-4 py-1.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
                    Save
                </button>
                <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};


/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function PublicationDetail({ hideStatus = false }: { hideStatus?: boolean }) {
    const params = useParams<{ publicationId: string }>();
    const publicationId = params.publicationId;

    const { user } = useAuth();
    const router = useRouter();
    const { data: subscriptionStatus, isLoading: subscriptionLoading } = useSubscriptionStatus();

    const {
        data: publication,
        isPending,
        error,
        refetch,
    } = useGetSinglePublication(publicationId as any);

    useEffect(() => {
        if (!subscriptionLoading && publication && user) {
            const isAdmin = user.role === "admin" || user.role === "editor";
            const hasActiveSubscription = subscriptionStatus?.hasSubscription;
            const isAuthor = isOwner(user, publication.author);

            if (!isAdmin && !hasActiveSubscription && !isAuthor) {
                router.push(`/subscription?redirect=/publications/${publicationId}`);
            }
        }
    }, [subscriptionStatus, subscriptionLoading, publication, user, router, publicationId]);

    if (isPending || subscriptionLoading)
        return (
            <div className="text-center py-20">
                <div className="w-10 h-10 border-2 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                <span className="text-slate-400 font-medium text-sm">Loading…</span>
            </div>
        );

    if (error || !publication)
        return (
            <div className="text-center py-20">
                <span className="text-slate-400 font-medium text-sm">Not found</span>
            </div>
        );

    const canEdit = isOwner(user, publication.author);

    const status =
        STATUS_CONFIG[publication.status as PublicationStatus] ??
        STATUS_CONFIG.pending;

    return (
        <article className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-2xl overflow-hidden mt-10 shadow-sm">
            <img
                src={publication.image || FallbackImage}
                className="w-full h-[300px] object-cover"
                alt={publication.title}
            />

            <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-900">{publication.title}</h1>
                    {!hideStatus && (
                        <span
                            className={`px-4 py-1 rounded-full border text-xs font-bold ${status.bg} ${status.text}`}
                        >
                            {status.label}
                        </span>
                    )}
                </div>

                {canEdit && (
                    <PublicationActions
                        publication={publication}
                        onDeleted={() => router.back()}
                        onEdited={refetch}
                    />
                )}

                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                    {publication.content}
                </p>

                <PublicationComments publicationId={publication._id!} />
            </div>
        </article>
    );
}
