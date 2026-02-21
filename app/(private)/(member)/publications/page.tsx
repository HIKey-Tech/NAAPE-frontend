"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSubscriptionStatus } from "@/hooks/useSubscription";
import { useAuth } from "@/context/authcontext";
import AllPublicationsPage from "@/components/member/publications/all.publications";

export default function PublicationPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();

    useEffect(() => {
        if (!isLoading && user) {
            const isAdmin = user.role === "admin" || user.role === "editor";
            const hasActiveSubscription = subscriptionStatus?.hasSubscription;

            if (!isAdmin && !hasActiveSubscription) {
                router.push("/subscription?redirect=/publications");
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

    return (
        <main className="">
            <AllPublicationsPage isAdmin={false} />
        </main>
    );
}
