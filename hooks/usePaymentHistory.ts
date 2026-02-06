import api from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const STALE_TIME = 1000 * 60 * 2; // 2 min

export const usePaymentHistory = (userId: string | null | undefined) => {
    const queryClient = useQueryClient();

    const isUserIdValid = typeof userId === "string" && userId.trim().length > 0;

    const paymentHistoryKey = ["paymentHistory", userId ?? ""];

    const fetchHistory = async () => {
        console.log("\n=== FRONTEND: Fetching Payment History ===");
        console.log("Timestamp:", new Date().toISOString());
        console.log("User ID:", userId);
        console.log("Is User ID Valid:", isUserIdValid);
        
        if (!isUserIdValid) {
            console.log("❌ User ID is invalid or missing");
            throw new Error("User ID is required to fetch payment history.");
        }
        
        // Synchronous cache lookup (optimistic hydration)
        const cached = queryClient.getQueryData(paymentHistoryKey);
        if (cached && Array.isArray(cached)) {
            console.log("✅ Returning cached data:", cached.length, "records");
            return cached;
        }
        
        // Network fetch fallback
        try {
            const endpoint = `/payments/history/${userId}`;
            console.log("🌐 Making API request to:", endpoint);
            console.log("🔑 Token from localStorage:", localStorage.getItem("token") ? "Present" : "Missing");
            
            const res = await api.get(endpoint);
            
            console.log("✅ API Response received");
            console.log("Response status:", res.status);
            console.log("Response data:", JSON.stringify(res.data, null, 2));
            
            if (
                !res ||
                !res.data ||
                !Array.isArray(res.data.history)
            ) {
                console.log("⚠️ Invalid response format, returning empty array");
                return [];
            }
            
            console.log("📦 Payment history count:", res.data.history.length);
            console.log("📦 Payment history records:", res.data.history);
            
            // Manual cache set (not essential due to react-query, illustrative)
            queryClient.setQueryData(paymentHistoryKey, res.data.history);
            return res.data.history;
        } catch (error: any) {
            console.error("❌ ERROR fetching payment history:");
            console.error("Error message:", error.message);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Full error:", error);
            
            if (error.response && error.response.status === 404) {
                console.log("⚠️ 404 error, setting empty cache");
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
