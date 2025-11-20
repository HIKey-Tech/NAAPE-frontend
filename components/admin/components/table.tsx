import { IPublication } from "@/app/api/publication/types";
import React, { ReactNode } from "react";



export interface PublicationTableProps {
    publications: IPublication[];
    renderAction?: (publication: IPublication) => ReactNode;
}

const statusInfo: Record<IPublication["status"], { label: string; className: string; dotColor: string }> = {
    pending: {
        label: "Pending",
        className: "text-yellow-600 bg-yellow-50",
        dotColor: "#F59E42",
    },
    approved: {
        label: "Approved",
        className: "text-green-700 bg-green-50",
        dotColor: "#4ADE80",
    },
    rejected: {
        label: "Rejected",
        className: "text-red-600 bg-red-50",
        dotColor: "#F87171",
    },
};

function formatDate(dateString: string) {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString; // fallback if can't parse
    const y = dateObj.getFullYear();
    const m = `${dateObj.getMonth() + 1}`.padStart(2, "0");
    const d = `${dateObj.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
}

const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const PublicationTable: React.FC<PublicationTableProps> = ({
    publications,
    renderAction,
}) => {
    return (
        <div className="overflow-x-auto w-full rounded-lg shadow border border-gray-100 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-[15px]">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700 w-[200px]">
                            Author
                            <span aria-label="Sorted by" className="inline-block ml-1 text-xs text-gray-400 align-middle">▼</span>
                        </th>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700">Title</th>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700">Submitted</th>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700">Status</th>
                        <th className="px-4 py-3 font-semibold text-left text-gray-700 w-12">Action</th>
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
                        publications.map((pub) => (
                            <tr key={pub._id} className="hover:bg-gray-50 transition-colors">
                                {/* Author */}
                                <td className="px-4 py-3 flex items-center gap-3 min-w-[170px]">
                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
                                        {pub.author.avatarUrl ? (
                                            <img
                                                src={''}
                                                alt={pub.author.name}
                                                className="w-9 h-9 rounded-full object-cover"
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <span className="text-md text-gray-400 font-bold select-none">
                                                {getInitials(pub.author.name)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 leading-5 truncate max-w-[120px]">
                                            {pub.author.name}
                                        </div>
                                        <div className="text-xs text-gray-500">{pub.author.role}</div>
                                    </div>
                                </td>
                                {/* Title */}
                                <td className="px-4 py-3 text-gray-900 whitespace-nowrap max-w-[280px] truncate">{pub.title}</td>
                                {/* Submitted */}
                                <td className="px-4 py-3 text-gray-700 whitespace-nowrap" title={pub.createdAt}>
                                    {formatDate(pub.createdAt)}
                                </td>
                                {/* Status */}
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded font-medium ${statusInfo[pub.status].className}`}
                                    >
                                        <span
                                            className="inline-block w-[0.85em] h-[0.85em] rounded-full mr-1"
                                            style={{
                                                background: statusInfo[pub.status].dotColor,
                                                minWidth: "0.8em",
                                                minHeight: "0.8em",
                                            }}
                                            aria-hidden="true"
                                        />
                                        <span className="align-middle">{statusInfo[pub.status].label}</span>
                                    </span>
                                </td>
                                {/* Action */}
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                    {renderAction ? (
                                        renderAction(pub)
                                    ) : (
                                        <button
                                            className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            title="More actions"
                                            aria-label={`More actions for ${pub.title}`}
                                            tabIndex={0}
                                            type="button"
                                        >
                                            <svg
                                                width={20}
                                                height={20}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 20 20"
                                                className="inline-block align-middle"
                                                aria-hidden="true"
                                            >
                                                <circle cx="4" cy="10" r="1.5" fill="currentColor" />
                                                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                                                <circle cx="16" cy="10" r="1.5" fill="currentColor" />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
