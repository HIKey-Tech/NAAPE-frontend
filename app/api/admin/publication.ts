import axios from "@/lib/axios";
import { IPublication } from "../publication/types";

export interface PublicationFilters {
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export interface PublicationStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    draft: number;
}

export interface PaginatedPublications {
    message: string;
    data: IPublication[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Get all publications with filters
export const getAllPublications = async (filters?: PublicationFilters): Promise<PaginatedPublications> => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await axios.get(`/admin/publications?${params.toString()}`);
    return response.data;
};

// Get publication statistics
export const getPublicationStats = async (): Promise<{ message: string; data: PublicationStats }> => {
    const response = await axios.get("/admin/publications/stats");
    return response.data;
};

// Delete publication
export const deletePublication = async (id: string, reason?: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/admin/publications/${id}`, {
        data: { reason }
    });
    return response.data;
};

// Update publication
export const updatePublication = async (
    id: string,
    data: Partial<Pick<IPublication, "title" | "content" | "category" | "status">>
): Promise<{ message: string; data: IPublication }> => {
    const response = await axios.patch(`/admin/publications/${id}`, data);
    return response.data;
};
