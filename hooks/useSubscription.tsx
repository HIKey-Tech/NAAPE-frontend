import api from "@/lib/axios";
import { useQuery, useMutation } from "@tanstack/react-query";

export type SubscriptionTier = "basic" | "premium";

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
