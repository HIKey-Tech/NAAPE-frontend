import { createPublication, fetchAllPublications, getSinglePublication } from "@/app/api/publication/publication";
import { IPublication } from "@/app/api/publication/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePublications = () => {
    return useQuery<IPublication[]>({
        queryKey: ['publications'],
        queryFn: fetchAllPublications
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

export const useGetSinglePublication = (id: string) => {
    return useQuery<IPublication>({
        queryKey: ['single_publication', id],
        queryFn: () => getSinglePublication(id)
    })
}