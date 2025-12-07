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
        <span title={dateObj.toLocaleString()} className="text-gray-500 font-medium">
            {dateObj.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
            })}
        </span>
    );
}

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
            className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-colors font-semibold px-4 py-2 rounded-lg text-[15px] flex items-center gap-2 disabled:opacity-60 shadow-sm focus:outline-none"
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
                    </svg>
                    <span className="font-medium">Making admin...</span>
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
                    <span className="font-semibold">Make admin</span>
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

export const MembersTable: React.FC<MembersTableProps> = ({
    members,
    onMakeAdmin,
    isLoading,
    makeAdminLoadingId,
}) => {
    return (
        <div className="overflow-x-auto w-full rounded-xl shadow-lg border border-gray-100 bg-white">
            <table className="min-w-full divide-y divide-gray-100 text-[15px]">
                <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                    <tr>
                        <th className="px-6 py-5 font-bold text-left text-gray-500 text-xs uppercase tracking-wider w-10"></th>
                        <th className="px-6 py-5 font-bold text-left text-gray-800 text-sm uppercase tracking-wider w-[220px]">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx={12} cy={12} r={9} strokeWidth={2}></circle>
                                </svg>
                                Name
                            </span>
                        </th>
                        <th className="px-6 py-5 font-bold text-left text-gray-800 text-sm uppercase tracking-wider">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M2 6h20M2 12h20M2 18h20" strokeWidth={2} strokeLinecap="round"></path>
                                </svg>
                                Email
                            </span>
                        </th>
                        <th className="px-6 py-5 font-bold text-left text-gray-800 text-sm uppercase tracking-wider w-40">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="4" y="6" width="16" height="12" rx="2" strokeWidth={2}></rect>
                                </svg>
                                Role
                            </span>
                        </th>
                        <th className="px-6 py-5 font-bold text-left text-gray-800 text-sm uppercase tracking-wider">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M7 10V6a5 5 0 0110 0v4" strokeWidth={2}></path>
                                    <rect x="3" y="10" width="18" height="10" rx="2" strokeWidth={2}></rect>
                                </svg>
                                Joined
                            </span>
                        </th>
                        <th className="px-6 py-5 font-bold text-left text-gray-800 text-sm uppercase tracking-wider w-40">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5v14" strokeWidth={2}></path>
                                </svg>
                                Action
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="text-center py-20 text-gray-400 text-base font-semibold">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <svg className="animate-spin w-8 h-8 text-blue-400 mb-2" viewBox="0 0 24 24">
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
                                    <span className="text-lg font-semibold text-gray-500">Loading members...</span>
                                </div>
                            </td>
                        </tr>
                    ) : members.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-20 text-gray-400 text-base font-semibold">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <svg width="44" height="44" fill="none" viewBox="0 0 24 24" className="mx-auto text-gray-200 mb-2">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-gray-200"></circle>
                                        <path
                                            d="M8.5,12A3.5,3.5,0,0,1,12,15.5,3.5,3.5,0,0,1,15.5,12"
                                            stroke="currentColor"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            className="text-gray-300"
                                        />
                                    </svg>
                                    <span className="text-lg font-semibold text-gray-400">No members found.</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        members.map((member, idx) => (
                            <tr
                                key={member._id}
                                className="hover:bg-blue-50/60 transition-colors group relative"
                                style={{ zIndex: 1 }}
                            >
                                {/* Index */}
                                <td className="px-6 py-5 text-gray-400 text-xs font-mono font-semibold">{idx + 1}</td>
                                {/* Name & Avatar */}
                                <td className="px-6 py-5 flex items-center gap-4 min-w-[170px]">
                                    <MemberAvatar name={member.name} image={member.image} />
                                    <div className="min-w-0">
                                        <div
                                            className="font-semibold text-gray-900 leading-5 truncate max-w-[160px] text-[16px]"
                                            title={member.name}
                                        >
                                            {member.name}
                                        </div>
                                        <div className="text-gray-400 text-[13px] truncate max-w-[160px]">{member.email}</div>
                                    </div>
                                </td>
                                {/* Email */}
                                <td className="px-6 py-5 text-gray-700 whitespace-nowrap max-w-[260px] truncate font-medium" title={member.email}>
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="hover:underline outline-none focus-visible:ring-2 rounded px-1.5 transition text-blue-700 font-semibold"
                                    >
                                        {member.email}
                                    </a>
                                </td>
                                {/* Role */}
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className={
                                        member.role === "admin"
                                            ? "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-green-900 bg-green-100 font-bold shadow-sm text-sm"
                                            : "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-700 bg-gray-100 font-semibold text-sm"
                                    }>
                                        {member.role === "admin"
                                            ? <svg className="w-4 h-4 inline-block text-green-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L12 12M12 12L16 16M12 12L8 16" />
                                            </svg>
                                            : <svg className="w-4 h-4 inline-block text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        }
                                        <span>
                                            <span className="capitalize">{member.role}</span>
                                        </span>
                                    </span>
                                </td>
                                {/* Joined */}
                                <td className="px-6 py-5 text-gray-700 whitespace-nowrap font-semibold" title={member.createdAt}>
                                    {formatDate(member.createdAt)}
                                </td>
                                {/* Action */}
                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                    {member.role === "admin" ? (
                                        <span className="text-gray-400 italic text-[14px] flex items-center gap-2 font-semibold" title="Already an admin">
                                            <svg className="w-4 h-4 inline-block text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16"></path></svg>
                                            Already admin
                                        </span>
                                    ) : onMakeAdmin ? (
                                        <AdminActionButton
                                            memberId={member._id}
                                            isLoading={makeAdminLoadingId === member._id}
                                            onClick={() => onMakeAdmin(member._id)}
                                        />
                                    ) : (
                                        <span className="text-gray-300 italic text-[14px] font-medium">No action</span>
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
