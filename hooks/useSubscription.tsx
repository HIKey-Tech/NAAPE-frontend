import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

// Utility functions for validation
function isValidString(val: any): val is string {
    return typeof val === "string" && !!val.trim();
}
function isValidPayload(payload: any): payload is { planId: string; userId: string } {
    return payload &&
        typeof payload === "object" &&
        isValidString(payload.planId) &&
        isValidString(payload.userId);
}
function safeGet(obj: any, path: string[], fallback: any = null) {
    return path.reduce((acc, curr) => (acc && acc[curr] !== undefined ? acc[curr] : fallback), obj);
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
        const res = await api.post("/payment/subscription", {
            planId,
            userId,
        });
        if (!res || !res.data) {
            throw new Error("No response from server.");
        }
        // Expecting a payment link in res.data.link
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
            `/payment/subscription/verify?transaction_id=${encodeURIComponent(transactionId)}`
        );
        if (!res || !res.data) {
            throw new Error("No response from server during verification.");
        }
        // Expect success message or details
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

    // Safer query for verifying subscription with all edge cases covered
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
