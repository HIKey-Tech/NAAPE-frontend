import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export function useSubmitForm() {
  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: { name: string; email: string; message: string }) => {
      try {
          const res = await api.post("/membership-form", { name, email, message });
        return res.data;
      } catch (error: any) {
        // Axios puts error response in error.response
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Failed to submit form.";
        throw new Error(message);
      }
    },
  });
}
