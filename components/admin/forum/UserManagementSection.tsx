"use client";

import React, { useState } from "react";
import {
    FaUsers,
    FaBan,
    FaClock,
    FaVolumeMute,
    FaSearch,
    FaFilter,
    FaSyncAlt,
    FaExclamationTriangle,
    FaEye,
    FaComments,
    FaReply,
    FaCalendarAlt,
    FaShieldAlt,
    FaUndo
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { UserRestrictionData } from "@/app/api/admin/forum";
import UserRestrictionModal from "./UserRestrictionModal";
import useUserManagement, { ForumUser } from "@/hooks/useUserManagement";

const UserManagementSection: React.FC = () => {
    const {
        users,
        totalUsers,
        metrics,
        isLoading,
        isRestricting,
        error,
        searchTerm,
        roleFilter,
        statusFilter,
        currentPage,
        totalPages,
        fetchUsers,
        banUser,
        unbanUser,
        setSearchTerm,
        setRoleFilter,
        setStatusFilter,
        setCurrentPage
    } = useUserManagement();

    const [restrictingUser, setRestrictingUser] = useState<ForumUser | null>(null);
    const [restrictionType, setRestrictionType] = useState<'ban' | 'suspend' | 'mute' | null>(null);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value === 'all' ? '' : value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value === 'all' ? '' : value);
        setCurrentPage(1);
    };

    const handleRestrictUser = (user: ForumUser, type: 'ban' | 'suspend' | 'mute') => {
        setRestrictingUser(user);
        setRestrictionType(type);
    };

    const handleUnbanUser = async (user: ForumUser) => {
        try {
            await unbanUser(user._id, "Restriction removed by admin");
            toast.success(`${user.name} has been unrestricted`);
        } catch (error) {
            toast.error("Failed to remove restriction");
        }
    };

    const handleRestrictionSubmit = async (data: UserRestrictionData): Promise<boolean> => {
        if (!restrictingUser || !restrictionType) return false;
        
        try {
            await banUser(restrictingUser._id, {
                banType: restrictionType === 'suspend' ? 'temporary' : restrictionType === 'mute' ? 'mute' : 'permanent',
                duration: data.duration,
                reason: data.reason
            });
            
            const actionText = restrictionType === 'ban' ? 'banned' : 
                              restrictionType === 'suspend' ? 'suspended' : 'muted';
            toast.success(`${restrictingUser.name} has been ${actionText}`);
            return true;
        } catch (error) {
            toast.error(`Failed to ${restrictionType} user`);
            return false;
        }
    };

    const getStatusBadge = (user: ForumUser) => {
        if (!user.banStatus) {
            return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
        }

        const { type, expiresAt } = user.banStatus;
        const isExpired = expiresAt && new Date(expiresAt) < new Date();
        
        if (isExpired) {
            return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
        }

        switch (type) {
            case 'permanent':
                return <Badge variant="destructive">Banned</Badge>;
            case 'temporary':
                return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Suspended</Badge>;
            case 'mute':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Muted</Badge>;
            default:
                return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge variant="default" className="bg-red-100 text-red-800">Admin</Badge>;
            case 'editor':
                return <Badge variant="default" className="bg-blue-100 text-blue-800">Editor</Badge>;
            case 'member':
                return <Badge variant="secondary">Member</Badge>;
            default:
                return <Badge variant="secondary">{role}</Badge>;
        }
    };

    const isUserRestricted = (user: ForumUser) => {
        if (!user.banStatus) return false;
        const { expiresAt } = user.banStatus;
        return !expiresAt || new Date(expiresAt) > new Date();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">Error loading users: {error}</p>
                    <Button onClick={fetchUsers} variant="outline">
                        <FaSyncAlt className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Manage forum users and their permissions</p>
                </div>
                <Button 
                    onClick={fetchUsers} 
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                >
                    <FaSyncAlt className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <FaUsers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.totalUsers || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Registered members
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <FaShieldAlt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {metrics?.activeUsers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            No restrictions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Restricted Users</CardTitle>
                        <FaBan className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {metrics?.restrictedUsers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Banned/suspended/muted
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FaComments className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {metrics?.totalPosts || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Threads + replies
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaFilter className="w-5 h-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search Users</label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <Select value={roleFilter || 'all'} onValueChange={handleRoleFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="permanent">Banned</SelectItem>
                                    <SelectItem value="temporary">Suspended</SelectItem>
                                    <SelectItem value="mute">Muted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaUsers className="w-5 h-5" />
                        Forum Users
                        <Badge variant="secondary" className="ml-2">
                            {users.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="text-center py-12">
                            <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || roleFilter || statusFilter 
                                    ? "Try adjusting your filters to see more results."
                                    : "No users have been registered yet."
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {users.map((user: ForumUser) => (
                                <div
                                    key={user._id}
                                    className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                >
                                    {/* User Avatar/Initial */}
                                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {user.name}
                                            </h3>
                                            {getRoleBadge(user.role)}
                                            {getStatusBadge(user)}
                                        </div>
                                        <p className="text-sm text-gray-600 truncate mb-2">
                                            {user.email}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Joined: {format(new Date(user.createdAt), 'MMM dd, yyyy')}</span>
                                            {user.forumActivity?.lastActivity && (
                                                <span>Last active: {format(new Date(user.forumActivity.lastActivity), 'MMM dd, yyyy')}</span>
                                            )}
                                        </div>
                                        
                                        {/* Ban Status Details */}
                                        {user.banStatus && isUserRestricted(user) && (
                                            <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                                                <p className="text-red-800 font-medium">
                                                    Reason: {user.banStatus.reason}
                                                </p>
                                                {user.banStatus.expiresAt && (
                                                    <p className="text-red-600">
                                                        Expires: {format(new Date(user.banStatus.expiresAt), 'MMM dd, yyyy HH:mm')}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Forum Activity Stats */}
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="font-medium text-gray-900">
                                                {user.forumActivity?.threadCount || 0}
                                            </div>
                                            <div className="text-gray-500">Threads</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-medium text-gray-900">
                                                {user.forumActivity?.replyCount || 0}
                                            </div>
                                            <div className="text-gray-500">Replies</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-medium text-gray-900">
                                                {(user.forumActivity?.threadCount || 0) + (user.forumActivity?.replyCount || 0)}
                                            </div>
                                            <div className="text-gray-500">Total</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {user.role !== 'admin' && (
                                            <>
                                                {isUserRestricted(user) ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleUnbanUser(user)}
                                                        disabled={isRestricting}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        <FaUndo className="w-4 h-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleRestrictUser(user, 'ban')}
                                                            disabled={isRestricting}
                                                            className="text-red-600 hover:text-red-700"
                                                            title="Permanently ban user"
                                                        >
                                                            <FaBan className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleRestrictUser(user, 'suspend')}
                                                            disabled={isRestricting}
                                                            className="text-orange-600 hover:text-orange-700"
                                                            title="Temporarily suspend user"
                                                        >
                                                            <FaClock className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleRestrictUser(user, 'mute')}
                                                            disabled={isRestricting}
                                                            className="text-yellow-600 hover:text-yellow-700"
                                                            title="Mute user (read-only access)"
                                                        >
                                                            <FaVolumeMute className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => window.open(`/admin/forum/users/${user._id}/activity`, '_blank')}
                                            title="View user activity"
                                        >
                                            <FaEye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Restriction Modal */}
            {restrictingUser && restrictionType && (
                <UserRestrictionModal
                    isOpen={!!restrictingUser}
                    onClose={() => {
                        setRestrictingUser(null);
                        setRestrictionType(null);
                    }}
                    onSubmit={handleRestrictionSubmit}
                    user={restrictingUser}
                    restrictionType={restrictionType}
                    isLoading={isRestricting}
                />
            )}
        </div>
    );
};

export default UserManagementSection;