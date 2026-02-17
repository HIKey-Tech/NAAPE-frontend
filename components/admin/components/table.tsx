import { IPublication } from "@/app/api/publication/types";
import React from "react";
import { useApprovePublication, useRejectPublication } from "@/hooks/usePublications";
import { toast } from "sonner";
import { FaCheck, FaTimes, FaCalendarAlt, FaUser } from "react-icons/fa";

export interface PublicationTableProps {
    publications: IPublication[];
    renderAction?: (publication: IPublication) => React.ReactNode;
}

const getStatusStyles = (status: IPublication["status"]) => {
    switch (status) {
        case 'approved': return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case 'rejected': return "bg-red-50 text-red-700 border-red-100";
        case 'pending': return "bg-amber-50 text-amber-700 border-amber-100";
        default: return "bg-slate-50 text-slate-700 border-slate-100";
    }
};

const getInitials = (name: string) =>
    name ? name.trim().split(" ").map(word => word[0]).join("").substring(0, 2).toUpperCase() : "";

const AuthorAvatar: React.FC<{ name: string; }> = ({ name }) => (
    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 ring-2 ring-white shadow-sm">
        {getInitials(name)}
    </div>
);

// Utility: Format ISO date
function formatDate(dateString?: string) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

export const PublicationTable: React.FC<PublicationTableProps> = ({
    publications,
    renderAction,
}) => {
    const approveMutation = useApprovePublication();
    const rejectMutation = useRejectPublication();

    const handleAccept = (pub: IPublication) => {
        toast.promise(approveMutation.mutateAsync(pub._id), {
            loading: "Approving...",
            success: "Publication approved",
            error: "Failed to approve"
        });
    };

    const handleReject = (pub: IPublication) => {
        toast.promise(rejectMutation.mutateAsync(pub._id), {
            loading: "Rejecting...",
            success: "Publication rejected",
            error: "Failed to reject"
        });
    };

    if (publications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                    <FaUser size={16} />
                </div>
                <h3 className="text-slate-900 font-semibold">No publications found</h3>
                <p className="text-slate-500 text-sm mt-1">There are no publications to review at this time.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-100">
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[40%]">Title</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {publications.map((pub) => {
                        const statusClass = getStatusStyles(pub.status);
                        return (
                            <tr key={pub._id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <AuthorAvatar name={pub.author.name} />
                                        <div>
                                            <div className="font-semibold text-slate-800 text-sm">{pub.author.name}</div>
                                            <div className="text-xs text-slate-500">{pub.author.email || "No email"}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="font-medium text-slate-800 text-sm truncate max-w-[300px]" title={pub.title}>
                                        {pub.title}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-md w-fit">
                                        <FaCalendarAlt className="mr-1.5 opacity-70" />
                                        {formatDate(pub.createdAt)}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusClass}`}>
                                        {pub.status.charAt(0).toUpperCase() + pub.status.slice(1)}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {renderAction ? renderAction(pub) : (
                                            pub.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAccept(pub)}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(pub)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium italic">Completed</span>
                                            )
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
