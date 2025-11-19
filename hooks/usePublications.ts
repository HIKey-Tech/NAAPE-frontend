import { fetchAllPublications } from "@/app/api/publication/get.publication";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePublications = () => {
    return useQuery({
        queryKey: ['publications'],
        queryFn: fetchAllPublications
    })
}