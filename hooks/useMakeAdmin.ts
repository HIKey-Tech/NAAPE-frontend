import { makeAdmin } from "@/app/api/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMakeAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => makeAdmin(id),
        onSuccess: () => {
            // Invalidate and refetch "members" query, ensuring UI always has fresh data
            queryClient.invalidateQueries({ queryKey: ["members"] });
            queryClient.refetchQueries({ queryKey: ["members"] });
        },
    });
};
