import { IPublication } from "@/app/api/publication/types";
import React from "react";
import { useApprovePublication, useRejectPublication } from "@/hooks/usePublications";
import { toast } from "sonner";

export interface PublicationTableProps {
    publications: IPublication[];
    renderAction?: (publication: IPublication) => React.ReactNode;
}

const STATUS_LABELS: Record<IPublication["status"], { label: string; className: string; dotColor: string; borderClass: string }> = {
    pending: {
        label: "Pending",
        className: "text-yellow-800 bg-yellow-50",
        dotColor: "#CA8A04",
        borderClass: "border-yellow-200"
    },
    approved: {
        label: "Approved",
        className: "text-green-800 bg-green-50",
        dotColor: "#16A34A",
        borderClass: "border-green-200"
    },
    rejected: {
        label: "Rejected",
        className: "text-red-800 bg-red-50",
        dotColor: "#B91C1C",
        borderClass: "border-red-200"
    },
};

// Utility: Format ISO date as "YYYY-MM-DD"
function formatDate(dateString?: string) {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString;
    // More readable for detailed ruling
    return dateObj.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const getInitials = (name: string) =>
    name ? name.trim().split(" ").map(word => word[0]).join("").substring(0, 2).toUpperCase() : "";

const AuthorAvatar: React.FC<{ name: string; email?: string; image?: string }> = ({ name }) => (
    <span
        className="w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-300 flex items-center justify-center text-[15px] font-bold text-gray-500 select-none"
        aria-label={getInitials(name)}
    >
        {getInitials(name)}
    </span>
);

export const PublicationTable: React.FC<PublicationTableProps> = ({
    publications,
    renderAction,
}) => {
    const approveMutation = useApprovePublication();
    const rejectMutation = useRejectPublication();

    const handleAccept = React.useCallback(
        (publication: IPublication) => {
            approveMutation.mutate(publication._id, {
                onSuccess: () => toast.success("Publication approved"),
                onError: (error: any) =>
                    toast.error(
                        error?.response?.data?.message || error?.message || "Failed to approve publication"
                    )
            });
        },
        [approveMutation]
    );

    const handleReject = React.useCallback(
        (publication: IPublication) => {
            rejectMutation.mutate(publication._id, {
                onSuccess: () => toast.success("Publication rejected"),
                onError: (error: any) =>
                    toast.error(
                        error?.response?.data?.message || error?.message || "Failed to reject publication"
                    )
            });
        },
        [rejectMutation]
    );

    return (
        <div className="overflow-x-auto w-full rounded border border-gray-300 bg-white">
            <table className="min-w-full table-fixed text-[15px] border-separate border-spacing-0">
                <thead>
                    <tr>
                        <th
                            className="px-5 py-4 font-bold text-left bg-slate-100 text-slate-800 border-b-2 border-gray-300 tracking-wide text-[16px] w-[210px]"
                            scope="col"
                        >
                            <span className="flex items-center gap-2">
                                Author
                                <span aria-label="Sorted by" className="ml-0.5 text-xs text-slate-500">▼</span>
                            </span>
                        </th>
                        <th
                            className="px-5 py-4 font-bold text-left bg-slate-100 text-slate-800 border-b-2 border-gray-300 tracking-wide text-[16px]"
                            scope="col"
                        >
                            Title
                        </th>
                        <th
                            className="px-5 py-4 font-bold text-left bg-slate-100 text-slate-800 border-b-2 border-gray-300 tracking-wide text-[16px]"
                            scope="col"
                        >
                            Submitted
                        </th>
                        <th
                            className="px-5 py-4 font-bold text-left bg-slate-100 text-slate-800 border-b-2 border-gray-300 tracking-wide text-[16px]"
                            scope="col"
                        >
                            Status
                        </th>
                        <th
                            className="px-5 py-4 font-bold text-left bg-slate-100 text-slate-800 border-b-2 border-gray-300 tracking-wide text-[16px] w-36"
                            scope="col"
                        >
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {publications.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-14 text-gray-400 text-base font-semibold border-b border-gray-200">
                                No publications found.
                            </td>
                        </tr>
                    ) : (
                        publications.map((pub, i) => {
                            const { author, title, createdAt, status, _id } = pub;
                            const info = STATUS_LABELS[status] || STATUS_LABELS.pending;
                            return (
                                <tr
                                    key={_id}
                                    className={`group${
                                        i % 2 === 1 ? " bg-slate-50" : ""
                                    } border-b last:border-b-0 border-gray-200`}
                                >
                                    {/* Author */}
                                    <td className="px-5 py-4 min-w-[170px] align-top border-r border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <AuthorAvatar name={author.name} email={author.email} />
                                            <div className="min-w-0 leading-snug">
                                                <div
                                                    className="font-semibold text-gray-900 max-w-[120px] truncate"
                                                    title={author.name}
                                                >
                                                    {author.name}
                                                </div>
                                                <div className="text-xs text-blue-900 bg-blue-50 inline-block px-2 py-0.5 rounded-full border border-blue-200 font-medium mt-1">
                                                    {author.role}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Title */}
                                    <td
                                        className="px-5 py-4 text-gray-800 whitespace-nowrap align-top border-r border-gray-200 max-w-[320px]"
                                        title={title}
                                    >
                                        <div className="font-medium truncate">{title}</div>
                                    </td>
                                    {/* Submitted */}
                                    <td
                                        className="px-5 py-4 align-top text-slate-700 border-r border-gray-200 whitespace-nowrap"
                                        title={createdAt}
                                    >
                                        <span className="inline-block font-mono text-[14px] text-slate-700 leading-none tracking-tight">
                                            {formatDate(createdAt)}
                                        </span>
                                    </td>
                                    {/* Status */}
                                    <td className="px-5 py-4 align-top border-r border-gray-200">
                                        <span
                                            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border text-sm font-medium tracking-wide ${info.className} ${info.borderClass}`}
                                            style={{ borderWidth: "1.5px" }}
                                        >
                                            <span
                                                className="inline-block w-[0.85em] h-[0.85em] rounded-full"
                                                style={{
                                                    background: info.dotColor,
                                                    minWidth: "0.88em",
                                                    minHeight: "0.88em",
                                                    border: "1.5px solid #E5E7EB",
                                                }}
                                                aria-hidden="true"
                                            />
                                            <span className="align-middle">{info.label}</span>
                                        </span>
                                    </td>
                                    {/* Action */}
                                    <td className="px-5 py-4 align-top flex gap-3 justify-end items-center bg-white border-none">
                                        {renderAction ? (
                                            renderAction(pub)
                                        ) : status === "pending" ? (
                                            <>
                                                <button
                                                    className="px-4 py-1 font-semibold text-[13px] bg-green-50 border border-green-400 text-green-900 rounded focus:outline-none focus:ring-2 focus:ring-green-200 hover:bg-green-100 transition"
                                                    title="Accept"
                                                    type="button"
                                                    onClick={() => handleAccept(pub)}
                                                    disabled={approveMutation.isPending}
                                                >
                                                    {approveMutation.isPending ? "Accepting..." : "Accept"}
                                                </button>
                                                <button
                                                    className="px-4 py-1 font-semibold text-[13px] bg-red-50 border border-red-400 text-red-900 rounded focus:outline-none focus:ring-2 focus:ring-red-200 hover:bg-red-100 transition"
                                                    title="Reject"
                                                    type="button"
                                                    onClick={() => handleReject(pub)}
                                                    disabled={rejectMutation.isPending}
                                                >
                                                    {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-gray-400 italic text-[13px] flex-1">No actions</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            <div className="border-t border-gray-300" />
        </div>
    );
};
