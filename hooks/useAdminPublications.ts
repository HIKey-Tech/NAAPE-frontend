import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllPublications,
    getPublicationStats,
    deletePublication,
    updatePublication,
    PublicationFilters
} from "@/app/api/admin/publication";
import { IPublication } from "@/app/api/publication/types";

// Fetch all publications with filters
export const useAdminPublications = (filters?: PublicationFilters) => {
    return useQuery({
        queryKey: ["admin-publications", filters],
        queryFn: () => getAllPublications(filters),
        staleTime: 30000, // 30 seconds
    });
};

// Fetch publication statistics
export const usePublicationStats = () => {
    return useQuery({
        queryKey: ["publication-stats"],
        queryFn: getPublicationStats,
        staleTime: 60000, // 1 minute
    });
};

// Delete publication mutation
export const useDeletePublication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            deletePublication(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
            queryClient.invalidateQueries({ queryKey: ["publication-stats"] });
        },
    });
};

// Update publication mutation
export const useUpdatePublication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: Partial<Pick<IPublication, "title" | "content" | "category" | "status">>;
        }) => updatePublication(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
            queryClient.invalidateQueries({ queryKey: ["publication-stats"] });
        },
    });
};
