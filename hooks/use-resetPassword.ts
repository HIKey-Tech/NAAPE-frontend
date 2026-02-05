import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "sonner";

interface ResetPasswordData {
    token: string;
    password: string;
}

const resetPassword = async ({ token, password }: ResetPasswordData) => {
    const response = await axios.post(`/auth/reset-password/${token}`, { password });
    return response.data;
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password reset successful!");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Failed to reset password";
            toast.error(message);
        },
    });
};
