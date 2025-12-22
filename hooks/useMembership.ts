import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

// The backend expects the following fields in the request body.
// We mirror that structure here in the mutation function.
export function useSubmitForm() {
  return useMutation({
    mutationFn: async (form: {
      name: string;
      tel: string;
      email: string;
      address: string;
      designation?: string;
      dateOfEmployment?: Date;
      section?: string;
      qualification?: string;
      licenseNo?: string;
      employer?: string;
      rank?: string;
      signature?: string;
      date?: Date;
    }) => {
      try {
        // Send all expected fields to the backend.
        // We do not need to format any fields or create a message string here, backend does this.
        const res = await api.post("/membership-form", form);
        return res.data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Failed to submit membership form.";
        throw new Error(message);
      }
    },
  });
}
