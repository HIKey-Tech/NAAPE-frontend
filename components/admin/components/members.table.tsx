import { IMember } from "@/app/api/member/type";
import React from "react";

// Enhanced avatar for better accessibility and fallback
const getInitials = (name: string) =>
    name
        ? name
              .trim()
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
        : "";

const colors = [
    "bg-red-100 text-red-600",
    "bg-yellow-100 text-yellow-600",
    "bg-green-100 text-green-600",
    "bg-blue-100 text-blue-600",
    "bg-indigo-100 text-indigo-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
];

function avatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

const MemberAvatar: React.FC<{ name: string; image?: string }> = ({ name, image }) =>
    image ? (
        <img
            src={image}
            alt={name}
            title={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            loading="lazy"
            onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
            }
        />
    ) : (
        <span
            className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden text-base font-bold select-none ${avatarColor(
                name || ""
            )}`}
            title={name}
            aria-label={getInitials(name)}
        >
            {getInitials(name)}
        </span>
    );

function formatDate(dateString?: string) {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return "";
    return (
        <span title={dateObj.toLocaleString()}>
            {dateObj.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
            })}
        </span>
    );
}

// Improved "Make Admin" button with icons and tooltip for accessibility
function AdminActionButton({
    memberId,
    isLoading,
    onClick,
}: {
    memberId: string;
    isLoading: boolean;
    onClick: () => void;
}) {
    return (
        <button
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors font-medium px-4 py-2 rounded text-[14px] focus:outline-none flex items-center gap-2 disabled:opacity-60"
            type="button"
            aria-busy={isLoading}
            disabled={isLoading}
            title="Promote to Admin"
            onClick={onClick}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin w-4 h-4 mr-2 inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        ></path>
                    </svg>{" "}
                    Making admin...
                </>
            ) : (
                <>
                    <svg
                        className="w-4 h-4 mr-2 inline-block"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Make admin
                </>
            )}
        </button>
    );
}

export interface MembersTableProps {
    members: IMember[];
    onMakeAdmin?: (memberId: string) => void;
    isLoading?: boolean;
    makeAdminLoadingId?: string | null;
}

// Optionally, show a row index for readability
export const MembersTable: React.FC<MembersTableProps> = ({
    members,
    onMakeAdmin,
    isLoading,
    makeAdminLoadingId,
}) => {
    return (
        <div className="overflow-x-auto w-full rounded-lg shadow border border-gray-100 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-[15px]">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-left text-gray-700 w-10"></th>
                        <th className="px-6 py-4 font-semibold text-left text-gray-700 w-[220px]">Name</th>
                        <th className="px-6 py-4 font-semibold text-left text-gray-700">Email</th>
                        <th className="px-6 py-4 font-semibold text-left text-gray-700 w-40">Role</th>
                        <th className="px-6 py-4 font-semibold text-left text-gray-700">Joined</th>
                        <th className="px-6 py-4 font-semibold text-left text-gray-700 w-40">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="text-center py-16 text-gray-400 text-base font-semibold">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <svg className="animate-spin w-6 h-6 text-blue-400 mb-2" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        ></path>
                                    </svg>
                                    Loading members...
                                </div>
                            </td>
                        </tr>
                    ) : members.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-16 text-gray-400 text-base font-semibold">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mx-auto text-gray-200 mb-2">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-gray-200"></circle>
                                        <path
                                            d="M8.5,12A3.5,3.5,0,0,1,12,15.5,3.5,3.5,0,0,1,15.5,12"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                            className="text-gray-300"
                                        />
                                    </svg>
                                    No members found.
                                </div>
                            </td>
                        </tr>
                    ) : (
                        members.map((member, idx) => (
                            <tr key={member._id} className="hover:bg-blue-50/50 transition-colors group">
                                {/* Index */}
                                <td className="px-6 py-4 text-gray-400 text-xs font-mono">{idx + 1}</td>
                                {/* Name & Avatar */}
                                <td className="px-6 py-4 flex items-center gap-4 min-w-[170px]">
                                    <MemberAvatar name={member.name} image={member.image} />
                                    <div className="min-w-0">
                                        <div
                                            className="font-medium text-gray-900 leading-5 truncate max-w-[150px]"
                                            title={member.name}
                                        >
                                            {member.name}
                                        </div>
                                    </div>
                                </td>
                                {/* Email */}
                                <td className="px-6 py-4 text-gray-700 whitespace-nowrap max-w-[260px] truncate" title={member.email}>
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="hover:underline outline-none focus-visible:ring-2 rounded px-1.5 transition"
                                    >
                                        {member.email}
                                    </a>
                                </td>
                                {/* Role */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={
                                        member.role === "admin"
                                            ? "inline-flex items-center gap-1.5 px-3 py-1 rounded text-green-700 bg-green-100 font-medium text-xs"
                                            : "inline-flex items-center gap-1.5 px-3 py-1 rounded text-gray-700 bg-gray-100 font-medium text-xs"
                                    }>
                                        {member.role === "admin"
                                            ? <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L12 12M12 12L16 16M12 12L8 16" />
                                            </svg>
                                            : <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        }
                                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                    </span>
                                </td>
                                {/* Joined */}
                                <td className="px-6 py-4 text-gray-700 whitespace-nowrap" title={member.createdAt}>
                                    {formatDate(member.createdAt)}
                                </td>
                                {/* Action */}
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {member.role === "admin" ? (
                                        <span className="text-gray-400 italic text-[13px] flex items-center gap-2" title="Already an admin">
                                            <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16"></path></svg>
                                            Already admin
                                        </span>
                                    ) : onMakeAdmin ? (
                                        <AdminActionButton
                                            memberId={member._id}
                                            isLoading={makeAdminLoadingId === member._id}
                                            onClick={() => onMakeAdmin(member._id)}
                                        />
                                    ) : (
                                        <span className="text-gray-400 italic text-[13px]">No action</span>
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
