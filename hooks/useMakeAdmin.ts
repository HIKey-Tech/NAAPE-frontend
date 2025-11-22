import { makeAdmin } from "@/app/api/admin/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMakeAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => makeAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
    });
};
