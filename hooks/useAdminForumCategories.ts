import { useQuery } from "@tanstack/react-query";
import { getAllCategoriesAdmin } from "@/app/api/admin/forum";

export const useAdminForumCategories = () => {
    return useQuery({
        queryKey: ["admin-forum-categories"],
        queryFn: getAllCategoriesAdmin,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};