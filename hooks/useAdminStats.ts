import { getAdminStats } from "@/app/api/admin/admin.stats";
import { useQuery } from "@tanstack/react-query";

export const useAdminStats = () => {
    return useQuery({
        queryKey: ["admin-stats"],
        queryFn: getAdminStats,
    });
};
