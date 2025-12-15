import { approvePublication, createPublication, editPublication, deletePublication, fetchAllPublications, getMyPublications, getSinglePublication, rejectPublication } from "@/app/api/publication/publication";
import { IPublication } from "@/app/api/publication/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePublications = (status?: string) => {
    return useQuery<IPublication[]>({
        queryKey: ['publications', status],
        queryFn: () => fetchAllPublications(status)
    })
}

export const useCreatePublication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPublication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["publications"] });
        },
    });
};

export function useMyPublications(status?: string) {
    return useQuery({
        queryKey: ["my_publications", status],
        queryFn: () => getMyPublications(status),
    });
}


export const useGetSinglePublication = (id: string) => {
    return useQuery<IPublication>({
        queryKey: ['single_publication', id],
        queryFn: () => getSinglePublication(id)
    })
}

export const useApprovePublication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approvePublication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
        },
    });
};

export const useRejectPublication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectPublication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
        },
    });
};

// Edit publication mutation
export const useEditPublication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) =>
            editPublication(id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my_publications"] });
            queryClient.invalidateQueries({ queryKey: ["publications"] });
        },
    });
};

// Delete publication mutation
export const useDeletePublication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deletePublication(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my_publications"] });
            queryClient.invalidateQueries({ queryKey: ["publications"] });
        },
    });
};