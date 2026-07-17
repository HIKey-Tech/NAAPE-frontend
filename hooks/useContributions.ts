import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const initializeContributionPayment = async (payload: { salary: number; percentage: number }) => {
    const response = await api.post("/payments/contributions/initialize-payment", payload);
    if (!response.data?.checkoutUrl) throw new Error("Unable to initialize contribution payment.");
    return response.data as { checkoutUrl: string; amount: number; currency: string; txRef: string };
};

export function useContributionPayment() {
    const mutation = useMutation({ mutationFn: initializeContributionPayment });
    return { initializePayment: mutation.mutateAsync, isPending: mutation.isPending };
}
