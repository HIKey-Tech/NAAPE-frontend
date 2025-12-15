import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

// Utility functions for validation
function isValidString(val: any): val is string {
    return typeof val === "string" && !!val.trim();
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

// Create subscription - handles edge cases
const createSubscriptionRequest = async ({
    planId,
    userId,
}: {
    planId: string;
    userId: string;
}) => {
    if (!isValidString(planId)) {
        throw new Error("Invalid planId: Required and must be a non-empty string.");
    }
    if (!isValidString(userId)) {
        throw new Error("Invalid userId: Required and must be a non-empty string.");
    }
    try {
        const res = await api.post("/payments/subscription", {
            planId,
            userId,
        });
        if (!res || !res.data) {
            throw new Error("No response from server.");
        }
        if (typeof res.data.link !== "string") {
            throw new Error("Payment link missing or invalid in server response.");
        }
        return res.data;
    } catch (error: any) {
        const msg =
            safeGet(error, ["response", "data", "message"]) ||
            error.message ||
            "Failed to initiate subscription payment.";
        throw new Error(msg);
    }
};

// Verify subscription - handles edge cases
const verifySubscriptionRequest = async (transactionId: string) => {
    if (!isValidString(transactionId)) {
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
 * Main subscription hook
 */
export const useFlutterwaveSubscription = () => {
    // Safer mutation for creating a subscription
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

    /**
     * Safer query for verifying subscription with all edge cases covered.
     * 
     * @param transactionId string
     * @param enabled default true
     */
    const useVerifySubscription = (
        transactionId: string,
        enabled = true
    ) =>
        useQuery({
            queryKey: ["flutterwaveSubscriptionVerify", transactionId],
            queryFn: async () => await verifySubscriptionRequest(transactionId),
            enabled: !!isValidString(transactionId) && enabled,
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
