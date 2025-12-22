import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

// Utility functions for validation
function isValidTier(val: string): val is "basic" | "premium" {
    return typeof val === "string" && ["basic", "premium"].includes(val);
}
function safeGet(obj: any, path: string[], fallback: any = null) {
    return path.reduce((acc, curr) => (acc && acc[curr] !== undefined ? acc[curr] : fallback), obj);
}

// Fetch subscription plans
export const fetchSubscriptionPlansRequest = async () => {
    try {
        const res = await api.get("/admin/plans/get-plans");
        if (!res || !res.data) {
            throw new Error("No response from server while fetching plans.");
        }
        return res.data.data;
    } catch (error: any) {
        const msg =
            safeGet(error, ["response", "data", "message"]) ||
            error.message ||
            "Failed to fetch subscription plans.";
        throw new Error(msg);
    }
};

// Hook: Fetch subscription plans via react-query
export function useFetchSubscriptionPlans(enabled = true) {
    return useQuery({
        queryKey: ["subscriptionPlans"],
        queryFn: fetchSubscriptionPlansRequest,
        enabled,
        retry: 1,
    });
}

// Create subscription with tier validation
const createSubscriptionRequest = async ({
    tier,
}: {
    tier: "basic" | "premium";
}) => {
    if (!isValidTier(tier)) {
        throw new Error("Invalid subscription tier");
    }

    try {
        // API endpoint expects { tier }
        const res = await api.post("/payments/subscription", { tier });

        if (!res || !res.data) {
            throw new Error("Failed to create subscription (no response from server)");
        }
        const data = res.data?.subscription;
        if (!data) {
            throw new Error(res.data?.error || "Failed to create subscription");
        }
        return {
            message: res.data.message,
            subscription: data,
        };
    } catch (err: any) {
        const msg =
            safeGet(err, ["response", "data", "error"]) ||
            safeGet(err, ["response", "data", "message"]) ||
            err.message ||
            "create subscription failed";
        throw new Error(msg);
    }
};

// Verify subscription - edge case handling (unchanged from before)
const verifySubscriptionRequest = async (transactionId: string) => {
    if (typeof transactionId !== "string" || !transactionId.trim()) {
        throw new Error("Invalid transactionId: Required and must be a non-empty string.");
    }
    try {
        const res = await api.get(
            `/payments/subscription/verify?transaction_id=${encodeURIComponent(transactionId)}`
        );
        if (!res || !res.data) {
            throw new Error("No response from server during verification.");
        }
        if (typeof res.data.message !== "string") {
            throw new Error("Missing or invalid message in verification response.");
        }
        return res.data;
    } catch (error: any) {
        const msg =
            safeGet(error, ["response", "data", "message"]) ||
            error.message ||
            "Failed to verify subscription payment.";
        throw new Error(msg);
    }
};

/**
 * Main subscription hook (for creating & verifying)
 */
export const useFlutterwaveSubscription = () => {
    // Mutation for creating a subscription (by tier)
    const {
        mutateAsync: createSubscription,
        isPending: creating,
        error: createError,
        data: createData,
        reset: resetCreate,
        ...restCreate
    } = useMutation({
        mutationFn: createSubscriptionRequest,
    });

    

    /** Query for verifying a subscription by transactionId */
    const useVerifySubscription = (
        transactionId: string,
        enabled = true
    ) =>
        useQuery({
            queryKey: ["flutterwaveSubscriptionVerify", transactionId],
            queryFn: async () => await verifySubscriptionRequest(transactionId),
            enabled: typeof transactionId === "string" && !!transactionId.trim() && enabled,
            retry: 1,
        });

    return {
        createSubscription,
        creating,
        createError,
        createData,
        resetCreate,
        useVerifySubscription,
        _createSubscriptionMutation: { ...restCreate },
    };
};
