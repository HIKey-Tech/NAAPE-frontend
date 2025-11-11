"use client"

import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



// Lazily create QueryClient to avoid recreating on every render
function useStableQueryClient() {
    const [client] = useState(() => new QueryClient());
    return client;
}

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    const queryClient = useStableQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>

    )

}