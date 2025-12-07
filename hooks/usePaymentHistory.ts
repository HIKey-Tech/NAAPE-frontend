import api from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const STALE_TIME = 1000 * 60 * 2; // 2 min

export const usePaymentHistory = (userId: string | null | undefined) => {
    const queryClient = useQueryClient();

    const isUserIdValid = typeof userId === "string" && userId.trim().length > 0;

    const paymentHistoryKey = ["paymentHistory", userId ?? ""];

    const fetchHistory = async () => {
        if (!isUserIdValid) {
            throw new Error("User ID is required to fetch payment history.");
        }
        // Synchronous cache lookup (optimistic hydration)
        const cached = queryClient.getQueryData(paymentHistoryKey);
        if (cached && Array.isArray(cached)) {
            return cached;
        }
        // Network fetch fallback
        try {
            const res = await api.get(`/payment/history/${userId}`);
            if (
                !res ||
                !res.data ||
                !Array.isArray(res.data.history)
            ) {
                return [];
            }
            // Manual cache set (not essential due to react-query, illustrative)
            queryClient.setQueryData(paymentHistoryKey, res.data.history);
            return res.data.history;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                queryClient.setQueryData(paymentHistoryKey, []);
                return [];
            }
            throw error;
        }
    };

    const {
        data: history = [],
        isLoading: loading,
        isError,
        error,
        refetch,
        isRefetching,
        isFetched,
        isFetching,
    } = useQuery({
        queryKey: paymentHistoryKey,
        queryFn: fetchHistory,
        enabled: isUserIdValid,
        retry: 1,
        staleTime: STALE_TIME,
    });

    const safeHistory = Array.isArray(history) ? history : [];

    let errorMsg: string | null = null;
    if (isError) {
        if (
            error &&
            typeof error === "object" &&
            "message" in error
        ) {
            errorMsg = (error as any).message ?? "Unknown error";
        } else {
            errorMsg = "Failed to load payment history.";
        }
    }

    return {
        loading: loading || isFetching || isRefetching,
        history: safeHistory,
        error: errorMsg,
        hasError: isError,
        refetch,
        fetched: isFetched,
        userIdValid: isUserIdValid,
        empty: safeHistory.length === 0 && isFetched && !loading && !isError,
        setCache: (data: any) => queryClient.setQueryData(paymentHistoryKey, data),
    };
};
