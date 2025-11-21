import { IPublication } from "@/app/api/publication/types";
import React from "react";
import { useApprovePublication, useRejectPublication } from "@/hooks/usePublications";
import { toast } from "sonner";

export interface PublicationTableProps {
    publications: IPublication[];
    renderAction?: (publication: IPublication) => React.ReactNode;
}

const STATUS_LABELS: Record<IPublication["status"], { label: string; className: string; dotColor: string }> = {
    pending: {
        label: "Pending",
        className: "text-yellow-700 bg-yellow-100",
        dotColor: "#F59E42",
    },
    approved: {
        label: "Approved",
        className: "text-green-700 bg-green-100",
        dotColor: "#22C55E",
    },
    rejected: {
        label: "Rejected",
        className: "text-red-700 bg-red-100",
        dotColor: "#EF4444",
    },
};

// Utility: Format ISO date as "YYYY-MM-DD"
function formatDate(dateString?: string) {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString; // fallback if can't parse
    return dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

// Utility: Render initials for avatar fallback
const getInitials = (name: string) =>
    name ? name.trim().split(" ").map(word => word[0]).join("").substring(0, 2).toUpperCase() : "";

// Avatar fallback if needed, could extend to use initials/colors/etc.
const AuthorAvatar: React.FC<{ name: string; email?: string; image?: string }> = ({ name }) => (
    <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden text-md text-gray-400 font-bold select-none">
        {getInitials(name)}
    </span>
);

export const PublicationTable: React.FC<PublicationTableProps> = ({
    publications,
    renderAction,
}) => {
    const approveMutation = useApprovePublication();
    const rejectMutation = useRejectPublication();

    // Memo handlers to avoid re-creating each render
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
        <div className="overflow-x-auto w-full rounded-lg shadow border border-gray-100 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-[15px]">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700 w-[200px]">
                            Author
                            <span aria-label="Sorted by" className="inline-block ml-1 text-xs text-gray-400 align-middle">
                                ▼
                            </span>
                        </th>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700">Title</th>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700">Submitted</th>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700">Status</th>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700 w-32">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {publications.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-12 text-gray-400 text-base font-semibold">
                                No publications found.
                            </td>
                        </tr>
                    ) : (
                        publications.map((pub) => {
                            const { author, title, createdAt, status, _id } = pub;
                            const info = STATUS_LABELS[status] || STATUS_LABELS.pending;
                            return (
                                <tr key={_id} className="hover:bg-gray-50 transition-colors group">
                                    {/* Author */}
                                    <td className="px-4 py-3 flex items-center gap-3 min-w-[170px]">
                                        <AuthorAvatar name={author.name} email={author.email} />
                                        <div className="min-w-0">
                                            <div
                                                className="font-medium text-gray-900 leading-5 truncate max-w-[120px]"
                                                title={author.name}
                                            >
                                                {author.name}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">{author.role}</div>
                                        </div>
                                    </td>
                                    {/* Title */}
                                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap max-w-[280px] truncate" title={title}>
                                        {title}
                                    </td>
                                    {/* Submitted */}
                                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap" title={createdAt}>
                                        {formatDate(createdAt)}
                                    </td>
                                    {/* Status */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded font-medium ${info.className}`}>
                                            <span
                                                className="inline-block w-[0.85em] h-[0.85em] rounded-full mr-1"
                                                style={{
                                                    background: info.dotColor,
                                                    minWidth: "0.8em",
                                                    minHeight: "0.8em"
                                                }}
                                                aria-hidden="true"
                                            />
                                            <span className="align-middle">{info.label}</span>
                                        </span>
                                    </td>
                                    {/* Action */}
                                    <td className="px-4 py-3 text-right whitespace-nowrap flex gap-2 justify-end items-center">
                                        {renderAction ? (
                                            renderAction(pub)
                                        ) : status === "pending" ? (
                                            <>
                                                <button
                                                    className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-medium px-3 py-1 rounded text-[13px] focus:outline-none"
                                                    title="Accept"
                                                    type="button"
                                                    onClick={() => handleAccept(pub)}
                                                    disabled={approveMutation.isPending}
                                                >
                                                    {approveMutation.isPending ? "Accepting..." : "Accept"}
                                                </button>
                                                <button
                                                    className="bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium px-3 py-1 rounded text-[13px] focus:outline-none"
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
        </div>
    );
};
