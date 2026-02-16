import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getForumUsers, banUserAdmin, unbanUserAdmin } from "@/app/api/admin/forum";

export interface ForumUser {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'member';
    createdAt: string;
    forumActivity?: {
        threadCount: number;
        replyCount: number;
        lastActivity?: string;
    };
    banStatus?: {
        type: 'permanent' | 'temporary' | 'mute';
        reason: string;
        expiresAt?: string;
        bannedBy: string;
    };
    status: 'active' | 'permanent' | 'temporary' | 'mute';
}

export interface UserRestrictionData {
    reason: string;
    duration?: number; // in days, for temporary restrictions
}

export interface BanUserData {
    banType: 'permanent' | 'temporary' | 'mute';
    duration?: number;
    reason: string;
}

const useUserManagement = () => {
    const [users, setUsers] = useState<ForumUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRestricting, setIsRestricting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    
    const USERS_PER_PAGE = 20;

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const params: any = {
                page: currentPage,
                limit: USERS_PER_PAGE
            };
            
            if (searchTerm.trim()) {
                params.search = searchTerm.trim();
            }
            
            if (roleFilter) {
                params.role = roleFilter;
            }
            
            if (statusFilter) {
                params.status = statusFilter;
            }
            
            const response = await getForumUsers(params);
            
            setUsers(response.data);
            setTotalPages(response.pagination.pages);
            setTotalUsers(response.pagination.total);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            setError(error.response?.data?.message || "Failed to fetch users");
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, roleFilter, statusFilter]);

    const banUser = useCallback(async (userId: string, data: BanUserData) => {
        try {
            setIsRestricting(true);
            await banUserAdmin(userId, data);
            await fetchUsers(); // Refresh the list
        } catch (error: any) {
            console.error("Error banning user:", error);
            throw new Error(error.response?.data?.message || "Failed to restrict user");
        } finally {
            setIsRestricting(false);
        }
    }, [fetchUsers]);

    const unbanUser = useCallback(async (userId: string, reason?: string) => {
        try {
            setIsRestricting(true);
            await unbanUserAdmin(userId, { reason });
            await fetchUsers(); // Refresh the list
        } catch (error: any) {
            console.error("Error unbanning user:", error);
            throw new Error(error.response?.data?.message || "Failed to remove restriction");
        } finally {
            setIsRestricting(false);
        }
    }, [fetchUsers]);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage === 1) {
                fetchUsers();
            } else {
                setCurrentPage(1); // This will trigger fetchUsers via the dependency
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Fetch users when filters or page changes
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Reset to first page when filters change
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [roleFilter, statusFilter]);

    return {
        // Data
        users,
        totalUsers,
        
        // Loading states
        isLoading,
        isRestricting,
        error,
        
        // Filters
        searchTerm,
        roleFilter,
        statusFilter,
        setSearchTerm,
        setRoleFilter,
        setStatusFilter,
        
        // Pagination
        currentPage,
        totalPages,
        setCurrentPage,
        
        // Actions
        fetchUsers,
        banUser,
        unbanUser
    };
};

export default useUserManagement;