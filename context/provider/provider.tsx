"use client"

import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../authcontext";

// import {
//     ClerkProvider,
    
// } from '@clerk/nextjs'
// // import { GoogleOAuthProvider } from "@react-oauth/google";




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
            {/* <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}> */}
            {/* <ClerkProvider> */}

            <AuthProvider>

                {children}
                </AuthProvider>
                {/* </ClerkProvider> */}

                
            {/* </GoogleOAuthProvider> */}

        </QueryClientProvider>

    )

}