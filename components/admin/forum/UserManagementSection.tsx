"use client";

import React, { useState } from "react";
import { FaSearch, FaUsers, FaUserCheck, FaBan, FaUserShield, FaExclamationTriangle, FaSyncAlt, FaFilter, FaEye, FaUserTimes, FaUnlock, FaVolumeOff, FaClock, FaComments, FaReply, FaChevronDown, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
import useUserManagement, { ForumUser, BanUserData } from "@/hooks/useUserManagement";

function UserRestrictionModal({ isOpen, onClose, user, onRestrict, isProcessing }: { isOpen: boolean; onClose: () => void; user: ForumUser | null; onRestrict: (userId: string, data: BanUserData) => Promise<void>; isProcessing: boolean; }) {
    const [restrictionType, setRestrictionType] = useState<'ban' | 'suspend' | 'mute'>('ban');
    const [reason, setReason] = useState("");
    const [duration, setDuration] = useState("7");
    if (!isOpen || !user) return null;

    const handleSubmit = async () => {
        if (!reason.trim()) { alert("Please provide a reason"); return; }
        try {
            await onRestrict(user._id, { banType: restrictionType === 'ban' ? 'permanent' : restrictionType === 'suspend' ? 'temporary' : 'mute', reason, duration: restrictionType !== 'ban' ? parseInt(duration) : undefined });
            onClose(); setReason(""); setDuration("7");
        } catch (e) { /* error handled by hook */ }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><FaBan className="w-5 h-5 text-red-500" /></div>
                        <h2 className="text-lg font-bold text-slate-900">Restrict User</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><FaTimes className="w-3.5 h-3.5 text-slate-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-bold">{user.name.charAt(0).toUpperCase()}</div>
                        <div><div className="font-bold text-slate-900 text-sm">{user.name}</div><div className="text-xs text-slate-500">{user.email}</div></div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Restriction Type</label>
                        <Select value={restrictionType} onValueChange={(v: any) => setRestrictionType(v)}>
                            <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="ban">Permanent Ban</SelectItem><SelectItem value="suspend">Temporary Suspension</SelectItem><SelectItem value="mute">Mute</SelectItem></SelectContent>
                        </Select>
                    </div>
                    {restrictionType !== 'ban' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Duration (days)</label>
                            <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="1">1 day</SelectItem><SelectItem value="3">3 days</SelectItem><SelectItem value="7">7 days</SelectItem><SelectItem value="14">14 days</SelectItem><SelectItem value="30">30 days</SelectItem><SelectItem value="90">90 days</SelectItem></SelectContent>
                            </Select>
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Reason *</label>
                        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason for restriction..." rows={3} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
                    <Button variant="outline" onClick={onClose} className="rounded-xl font-bold border-slate-200">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isProcessing || !reason.trim()} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md shadow-red-600/20">{isProcessing ? "Processing..." : "Apply Restriction"}</Button>
                </div>
            </div>
        </div>
    );
}

const UserManagementSection: React.FC = () => {
    const { users, metrics, isLoading, isRestricting, error, searchTerm, roleFilter, statusFilter, currentPage, totalPages, fetchUsers, banUser, unbanUser, setSearchTerm, setRoleFilter, setStatusFilter, setCurrentPage } = useUserManagement();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<ForumUser | null>(null);
    const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);
    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    const handleSelectUser = (userId: string, checked: boolean) => { if (checked) setSelectedUsers(p => [...p, userId]); else setSelectedUsers(p => p.filter(id => id !== userId)); };
    const handleSelectAll = (checked: boolean) => { if (checked) setSelectedUsers(users.map((u: ForumUser) => u._id)); else setSelectedUsers([]); };

    const handleRestrict = (user: ForumUser) => { setSelectedUser(user); setIsRestrictionModalOpen(true); };
    const handleUnban = async (userId: string) => { try { await unbanUser(userId); toast.success("User unbanned successfully"); } catch (e) { /* error handled by hook */ } };

    const getStatusBadge = (user: ForumUser) => {
        if (user.status === 'permanent') return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Banned</span>;
        if (user.status === 'temporary') return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Suspended</span>;
        if (user.status === 'mute') return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Muted</span>;
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Active</span>;
    };

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = { admin: "bg-purple-100 text-purple-700", moderator: "bg-primary/10 text-primary", member: "bg-slate-100 text-slate-600" };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[role] || colors.member}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>;
    };

    const isProcessing = isRestricting;
    const stats = { total: metrics?.totalUsers || 0, active: metrics?.activeUsers || 0, restricted: metrics?.restrictedUsers || 0, totalPosts: metrics?.totalPosts || 0 };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div><p className="text-slate-500">Loading users...</p></div></div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[400px]"><div className="text-center"><div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4"><FaExclamationTriangle className="w-8 h-8 text-red-500" /></div><p className="text-red-600 mb-4 font-medium">Error loading users: {error}</p><Button onClick={fetchUsers} variant="outline" className="rounded-xl font-bold border-slate-200"><FaSyncAlt className="w-4 h-4 mr-2" />Retry</Button></div></div>
    );

    const statCards = [
        { label: "Total Users", value: stats.total, icon: FaUsers, bg: "bg-primary/5", ic: "text-primary", vc: "text-slate-900", sub: "All forum users" },
        { label: "Active", value: stats.active, icon: FaUserCheck, bg: "bg-emerald-50", ic: "text-emerald-500", vc: "text-emerald-600", sub: "Currently active" },
        { label: "Restricted", value: stats.restricted, icon: FaBan, bg: "bg-red-50", ic: "text-red-500", vc: "text-red-600", sub: "Banned or suspended" },
        { label: "Total Posts", value: stats.totalPosts, icon: FaComments, bg: "bg-purple-50", ic: "text-purple-500", vc: "text-purple-600", sub: "Threads & replies" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-slate-900">User Management</h1><p className="text-slate-500">Manage forum users and permissions</p></div>
                <Button onClick={fetchUsers} disabled={isLoading} variant="outline" size="sm" className="rounded-xl font-bold border-slate-200"><FaSyncAlt className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Refresh</Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</span>
                            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.ic}`} /></div>
                        </div>
                        <div className={`text-2xl font-bold ${s.vc}`}>{s.value}</div>
                        <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><FaFilter className="w-4 h-4 text-slate-500" /></div>
                    <h3 className="text-base font-bold text-slate-900">Filters</h3>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Search Users</label>
                            <div className="relative"><FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" /></div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Role</label>
                            <Select value={roleFilter || 'all'} onValueChange={(v) => setRoleFilter(v === 'all' ? '' : v)}>
                                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="All Roles" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="moderator">Moderator</SelectItem><SelectItem value="member">Member</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status</label>
                            <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
                                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="All Status" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="banned">Banned</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="muted">Muted</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><FaUsers className="w-4 h-4 text-primary" /></div>
                        <h3 className="text-base font-bold text-slate-900">Forum Users</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{users.length}</span>
                    </div>
                    {users.length > 0 && (<div className="flex items-center gap-2"><Checkbox checked={selectedUsers.length === users.length} onCheckedChange={handleSelectAll} /><span className="text-sm text-slate-500">Select All</span></div>)}
                </div>
                <div className="p-5">
                    {users.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4"><FaUsers className="w-8 h-8 text-slate-300" /></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No users found</h3>
                            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div key={user._id} className="rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                                    <div className="flex items-center gap-4 p-4">
                                        <Checkbox checked={selectedUsers.includes(user._id)} onCheckedChange={(checked) => handleSelectUser(user._id, checked as boolean)} />
                                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">{user.name.charAt(0).toUpperCase()}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                                                {getRoleBadge(user.role)}
                                                {getStatusBadge(user)}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                                                <span>{user.email}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>Joined {format(new Date(user.createdAt), 'MMM dd, yyyy')}</span>
                                                {user.forumActivity && (<>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="inline-flex items-center gap-1"><FaComments className="w-3 h-3" />{user.forumActivity.threadCount} threads</span>
                                                    <span className="inline-flex items-center gap-1"><FaReply className="w-3 h-3" />{user.forumActivity.replyCount} replies</span>
                                                </>)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors" title="View details"><FaChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedUser === user._id ? 'rotate-180' : ''}`} /></button>
                                            {user.status === 'permanent' ? (
                                                <button onClick={() => handleUnban(user._id)} disabled={isProcessing} className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-50" title="Unban"><FaUnlock className="w-3.5 h-3.5" /></button>
                                            ) : (
                                                <button onClick={() => handleRestrict(user)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors" title="Restrict"><FaBan className="w-3.5 h-3.5" /></button>
                                            )}
                                        </div>
                                    </div>
                                    {expandedUser === user._id && (
                                        <div className="px-4 pb-4 border-t border-slate-100 pt-4 ml-16">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {user.forumActivity && (
                                                    <div className="space-y-2">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Forum Statistics</h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="p-2 bg-white rounded-xl border border-slate-100 text-center"><div className="text-lg font-bold text-slate-900">{user.forumActivity.threadCount}</div><div className="text-xs text-slate-500">Threads</div></div>
                                                            <div className="p-2 bg-white rounded-xl border border-slate-100 text-center"><div className="text-lg font-bold text-slate-900">{user.forumActivity.replyCount}</div><div className="text-xs text-slate-500">Replies</div></div>
                                                        </div>
                                                        {user.forumActivity.lastActivity && <div className="text-xs text-slate-500"><FaClock className="w-3 h-3 inline mr-1" />Last active: {format(new Date(user.forumActivity.lastActivity), 'MMM dd, yyyy HH:mm')}</div>}
                                                    </div>
                                                )}
                                                {user.banStatus && user.status !== 'active' && (
                                                    <div className="space-y-2">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Restriction Details</h4>
                                                        <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-1">
                                                            {user.banStatus.reason && <div className="text-sm text-slate-700"><span className="font-bold text-slate-500 text-xs">Reason:</span> {user.banStatus.reason}</div>}
                                                            <div className="text-xs text-slate-500">Type: {user.banStatus.type}</div>
                                                            {user.banStatus.expiresAt && <div className="text-xs text-slate-500">Expires: {format(new Date(user.banStatus.expiresAt), 'MMM dd, yyyy')}</div>}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                            <div className="text-sm text-slate-500">Page {currentPage} of {totalPages}</div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-xl font-bold border-slate-200">Previous</Button>
                                <Button size="sm" variant="outline" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-xl font-bold border-slate-200">Next</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <UserRestrictionModal isOpen={isRestrictionModalOpen} onClose={() => { setIsRestrictionModalOpen(false); setSelectedUser(null); }} user={selectedUser} onRestrict={banUser} isProcessing={isProcessing} />
        </div>
    );
};

export default UserManagementSection;