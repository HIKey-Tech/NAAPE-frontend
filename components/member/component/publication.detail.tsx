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
        bg: "bg-gray-50 border-gray-300",
        text: "text-gray-900",
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#9CA3AF" strokeWidth="2" />
                <path d="M7 10h6M10 7v6" stroke="#6B7280" strokeWidth="2" />
            </svg>
        ),
    },
    pending: {
        label: "Pending",
        bg: "bg-yellow-50 border-yellow-300",
        text: "text-yellow-900",
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#FFD600" strokeWidth="2" />
                <path d="M10 6v5" stroke="#E2A900" strokeWidth="2" />
                <circle cx="10" cy="14" r="1" fill="#E2A900" />
            </svg>
        ),
    },
    approved: {
        label: "Published",
        bg: "bg-green-50 border-green-400",
        text: "text-green-900",
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#26C281" strokeWidth="2" />
                <path d="M6.5 10.5l2.5 2.5L13.5 8" stroke="#27AE60" strokeWidth="2" />
            </svg>
        ),
    },
    rejected: {
        label: "Rejected",
        bg: "bg-red-50 border-red-300",
        text: "text-red-900",
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#FF6161" strokeWidth="2" />
                <path d="M7 7l6 6M13 7l-6 6" stroke="#D33A2C" strokeWidth="2" />
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

    console.log("The comments", data)

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
        <section className="border-t pt-6 mt-10">
            <h3 className="font-bold text-lg mb-3">Comments</h3>

            <form onSubmit={submit} className="flex gap-2 mb-4">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Add a comment"
                />
                <button
                    disabled={!text.trim()}
                    className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
                >
                    Send
                </button>
            </form>

            {isPending && <p className="text-gray-400">Loading comments...</p>}

            {!isPending && comments.length === 0 && (
                <p className="italic text-gray-400">No comments yet.</p>
            )}

            <ul className="space-y-2">
                {comments.map((c) => (
                    <li
                        key={c._id}
                        className="bg-gray-50 border rounded px-3 py-2"
                    >
                        <strong className="mr-2">{getAuthorLabel(c.author)}:</strong>
                        {c.text || c.content}
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
                    className="px-3 py-1 bg-yellow-200 rounded"
                >
                    Edit
                </button>
                <button
                    onClick={remove}
                    className="px-3 py-1 bg-red-200 rounded"
                >
                    Delete
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-2">
            <input
                className="border px-3 py-2 rounded w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className="border px-3 py-2 rounded w-full"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex gap-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded">
                    Save
                </button>
                <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
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

    // Check subscription status and redirect if needed
    useEffect(() => {
        if (!subscriptionLoading && publication && user) {
            const isAdmin = user.role === "admin" || user.role === "editor";
            const hasActiveSubscription = subscriptionStatus?.hasSubscription;
            const isAuthor = isOwner(user, publication.author);
            
            // Allow access if: admin, has subscription, or is the author
            if (!isAdmin && !hasActiveSubscription && !isAuthor) {
                router.push(`/subscription?redirect=/publications/${publicationId}`);
            }
        }
    }, [subscriptionStatus, subscriptionLoading, publication, user, router, publicationId]);

    if (isPending || subscriptionLoading)
        return <div className="text-center py-20">Loading…</div>;

    if (error || !publication)
        return <div className="text-center py-20">Not found</div>;

    const canEdit = isOwner(user, publication.author);

    const status =
        STATUS_CONFIG[publication.status as PublicationStatus] ??
        STATUS_CONFIG.pending;

    // const refs = Array.isArray(publication.references)
    //     ? publication.
    //     : [];

    // const files = Array.isArray(publication.attachments)
    //     ? publication.attachments
    //     : [];

    return (
        <article className="max-w-3xl mx-auto bg-white border rounded-xl overflow-hidden mt-10">
            <img
                src={publication.image || FallbackImage}
                className="w-full h-[300px] object-cover"
                alt={publication.title}
            />

            <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{publication.title}</h1>
                    {!hideStatus && (
                        <span
                            className={`px-4 py-1 rounded-full border ${status.bg} ${status.text}`}
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

                <p className="text-gray-700 whitespace-pre-line">
                    {publication.content}
                </p>

                {/* {refs.length > 0 && (
                    <ul className="list-disc ml-6">
                        {refs.map((r) => (
                            <li key={r}>
                                <a
                                    href={r}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {r}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                {files.length > 0 && (
                    <ul>
                        {files.map((f: any) => (
                            <li key={f.url}>
                                <a href={f.url} className="underline">
                                    {f.name || f.url}
                                </a>
                            </li>
                        ))}
                    </ul>
                )} */}

                <PublicationComments publicationId={publication._id!} />
            </div>
        </article>
    );
}

