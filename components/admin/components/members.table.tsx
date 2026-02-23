import { IMember } from "@/app/api/member/type";
import React from "react";
import { FaShieldAlt, FaUserPlus, FaSpinner, FaUser } from "react-icons/fa";

const getInitials = (name: string) =>
    name ? name.trim().split(/\s+/).map((w) => w[0]).join("").substring(0, 2).toUpperCase() : "";

const colors = [
    "bg-primary/10 text-primary",
    "bg-purple-100 text-purple-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
    "bg-indigo-100 text-indigo-600",
    "bg-teal-100 text-teal-600",
];

function avatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

const MemberAvatar: React.FC<{ name: string; image?: string }> = ({ name, image }) =>
    image ? (
        <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
    ) : (
        <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold select-none ring-2 ring-white shadow-sm ${avatarColor(name || "")}`}>
            {getInitials(name)}
        </span>
    );

function formatDate(dateString?: string) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export interface MembersTableProps {
    members: IMember[];
    onMakeAdmin?: (memberId: string) => void;
    isLoading?: boolean;
    makeAdminLoadingId?: string | null;
    onRowClick?: (member: IMember) => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
    members,
    onMakeAdmin,
    isLoading,
    makeAdminLoadingId,
    onRowClick,
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <FaSpinner className="animate-spin text-2xl mb-3" />
                <span className="font-medium">Loading members...</span>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FaUser className="text-xl text-slate-300" />
                </div>
                <span className="font-semibold text-lg text-slate-500">No members found</span>
                <span className="text-sm text-slate-400 mt-1">Members will appear here once they sign up.</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-100">
                        <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-12">#</th>
                        <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
                        <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                        <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                        <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                        <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {members.map((member, idx) => (
                        <tr
                            key={member._id}
                            className={`group hover:bg-slate-50/50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                            onClick={() => onRowClick && onRowClick(member)}
                        >
                            <td className="py-4 px-5 text-xs text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                    <MemberAvatar name={member.name} image={member.image} />
                                    <div className="min-w-0">
                                        <div className="font-semibold text-slate-800 text-sm truncate max-w-[180px]">{member.name}</div>
                                        <div className="text-xs text-slate-400 truncate max-w-[180px] md:hidden">{member.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-5 hidden md:table-cell">
                                <a href={`mailto:${member.email}`} className="text-sm text-slate-600 hover:text-primary font-medium truncate block max-w-[240px]">
                                    {member.email}
                                </a>
                            </td>
                            <td className="py-4 px-5">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${member.role === "admin"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : "bg-slate-100 text-slate-600"
                                    }`}>
                                    {member.role === "admin" && <FaShieldAlt size={10} />}
                                    <span className="capitalize">{member.role}</span>
                                </span>
                            </td>
                            <td className="py-4 px-5 hidden sm:table-cell">
                                <span className="text-sm text-slate-500 font-medium">{formatDate(member.createdAt)}</span>
                            </td>
                            <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                                {member.role === "admin" ? (
                                    <span className="text-xs text-slate-400 italic font-medium">Admin</span>
                                ) : onMakeAdmin ? (
                                    <button
                                        onClick={() => onMakeAdmin(member._id)}
                                        disabled={makeAdminLoadingId === member._id}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {makeAdminLoadingId === member._id ? (
                                            <><FaSpinner className="animate-spin" size={12} /> Promoting...</>
                                        ) : (
                                            <><FaUserPlus size={12} /> Make Admin</>
                                        )}
                                    </button>
                                ) : (
                                    <span className="text-xs text-slate-300 italic">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
