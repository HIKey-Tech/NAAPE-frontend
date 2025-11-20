import { createPublication, fetchAllPublications, getSinglePublication } from "@/app/api/publication/publication";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePublications = () => {
    return useQuery({
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
    return useQuery({
        queryKey: ['single_publication'],
        queryFn: ()=> getSinglePublication(id)
    })
}