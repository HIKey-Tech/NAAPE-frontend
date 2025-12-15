import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

/**
 * Request function for forgot password.
 * Accepts an object with email property, sends POST to /auth/forgot-password
 */
const forgotPasswordRequest = async ({ email }: { email: string }) => {
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new Error("A valid email address is required.");
  }
  try {
    const res = await api.post("/auth/forgot-password", { email });
    if (!res || !res.data) {
      throw new Error("No response from server.");
    }
    return res.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to send forgot password request.";
    throw new Error(msg);
  }
};

/**
 * useForgotPassword hook using TanStack Query's mutation.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
  });
}
