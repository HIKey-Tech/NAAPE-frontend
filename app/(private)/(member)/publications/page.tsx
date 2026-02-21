"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSubscriptionStatus } from "@/hooks/useSubscription";
import { useAuth } from "@/context/authcontext";
import AllPublicationsPage from "@/components/member/publications/all.publications";

export default function PublicationPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();

    useEffect(() => {
        if (!isLoading && !authLoading && user) {
            const isAdmin = user.role === "admin" || user.role === "editor";
            const hasActiveSubscription = subscriptionStatus?.hasSubscription;

            if (!isAdmin && !hasActiveSubscription) {
                router.replace("/subscription?redirect=/publications");
            }
        }
    }, [subscriptionStatus, isLoading, authLoading, user, router]);

    const isAdmin = user?.role === "admin" || user?.role === "editor";
    const hasActiveSubscription = subscriptionStatus?.hasSubscription;

    if (isLoading || authLoading || (!isAdmin && !hasActiveSubscription && user)) {
        return null;
    }

    return (
        <main className="">
            <AllPublicationsPage isAdmin={false} />
        </main>
    );
}
