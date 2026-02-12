"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BrowsePublicationsPage from "@/components/member/publications/browse.publications";
import { useSubscriptionStatus } from "@/hooks/useSubscription";
import { useAuth } from "@/context/authcontext";

export default function BrowsePublicationsRoute() {
    const router = useRouter();
    const { user } = useAuth();
    const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();

    useEffect(() => {
        // Redirect non-premium members to subscription page
        if (!isLoading && user) {
            const isAdmin = user.role === "admin" || user.role === "editor";
            const hasActiveSubscription = subscriptionStatus?.hasSubscription;
            
            if (!isAdmin && !hasActiveSubscription) {
                router.push("/subscription?redirect=/publications/browse");
            }
        }
    }, [subscriptionStatus, isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#15407c] border-t-transparent" />
                <span className="ml-3 text-lg">Loading...</span>
            </div>
        );
    }

    return <BrowsePublicationsPage />;
}
