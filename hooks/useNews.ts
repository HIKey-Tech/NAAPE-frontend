import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNews, getSingleNews, createNews } from "@/app/api/news/news";

export const useNews = () =>
    useQuery({ queryKey: ["news"], queryFn: fetchNews });

export const useSingleNews = (id: string) =>
    useQuery({
        queryKey: ["news", id],
        queryFn: () => getSingleNews(id),
        enabled: !!id
    });

export const useCreateNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createNews,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news"] }),
    });
};
