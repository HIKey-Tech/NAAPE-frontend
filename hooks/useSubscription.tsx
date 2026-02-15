import api from "@/lib/axios";
import { useQuery, useMutation } from "@tanstack/react-query";

export type SubscriptionTier = "free" | "premium";

export interface SubscriptionPlan {
    _id: string;
    name: string;
    flutterwavePlanId: string;
    price: number;
    currency: string;
    interval: string;
    features: string[];
    isActive: boolean;
}

export interface SubscriptionStatus {
    hasSubscription: boolean;
    status: "active" | "pending" | "cancelled" | "expired" | "none";
    tier: "free" | "premium" | null;
    planName?: string;
    startDate?: string;
    endDate?: string;
    features?: string[];
    interval?: string;
    message?: string;
}

/* ----------------------------- FETCH PLANS ----------------------------- */

export const fetchSubscriptionPlansRequest = async (): Promise<SubscriptionPlan[]> => {
    const res = await api.get("/admin/plans/get-plans");

    if (!Array.isArray(res?.data?.data)) {
        throw new Error("Malformed plans response");
    }

    return res.data.data;
};

export function useFetchSubscriptionPlans(enabled = true) {
    return useQuery({
        queryKey: ["subscription-plans"],
        queryFn: fetchSubscriptionPlansRequest,
        enabled,
    });
}

/* ---------------------- INITIALIZE SUBSCRIPTION PAYMENT ---------------------- */

export const initializeSubscriptionPaymentRequest = async ({
    tier,
}: {
    tier: SubscriptionTier;
}) => {
    const res = await api.post("/payments/subscription/initialize-payment", { tier });

    if (!res?.data?.checkoutUrl) {
        throw new Error("Failed to initialize payment");
    }

    return res.data.checkoutUrl as string;
};

/* ---------------------- FETCH SUBSCRIPTION STATUS ---------------------- */

export const fetchSubscriptionStatusRequest = async (): Promise<SubscriptionStatus> => {
    const res = await api.get("/payments/subscription/status");
    return res.data;
};

export function useSubscriptionStatus(enabled = true) {
    return useQuery({
        queryKey: ["subscription-status"],
        queryFn: fetchSubscriptionStatusRequest,
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
}

/* ----------------------------- MAIN HOOK ------------------------------- */

export function useFlutterwaveSubscription() {
    const initializePaymentMutation = useMutation({
        mutationFn: initializeSubscriptionPaymentRequest,
    });

    return {
        initializeSubscriptionPayment: initializePaymentMutation.mutateAsync,
        initializingPayment: initializePaymentMutation.isPending,
    };
}
