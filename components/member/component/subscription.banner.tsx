"use client";

import { useSubscriptionStatus } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";
import { FaCrown, FaLock, FaCheck, FaArrowRight, FaGem } from "react-icons/fa";

interface SubscriptionBannerProps {
    showUpgradePrompt?: boolean;
    feature?: string;
}

export function SubscriptionBanner({ showUpgradePrompt = false, feature }: SubscriptionBannerProps) {
    const router = useRouter();
    const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();

    if (isLoading) return null;

    // Active subscription
    if (subscriptionStatus?.hasSubscription && subscriptionStatus.status === "active") {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/5 text-primary rounded-xl">
                            <FaCrown size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 capitalize">
                                {subscriptionStatus.tier} Member
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Active until {subscriptionStatus.endDate ? new Date(subscriptionStatus.endDate).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <FaCheck size={10} /> Active
                    </span>
                </div>
            </div>
        );
    }

    // Upgrade prompt
    if (showUpgradePrompt) {
        return (
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 mb-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                        <FaLock size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-slate-800 text-lg mb-1">Subscription Required</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            {feature
                                ? `To ${feature}, you need an active subscription.`
                                : "This feature requires an active subscription to access."
                            }
                        </p>
                        <div className="space-y-2 mb-5">
                            {["Access to all publications", "Create and submit your own publications", "Exclusive member resources", "Priority event registration"].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                                    <FaCheck className="text-emerald-500 shrink-0" size={12} /> {item}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => router.push("/subscription")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors text-sm"
                        >
                            <FaGem size={14} /> View Plans <FaArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Simple status
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 text-slate-500 rounded-xl">
                        <FaLock size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-700">Free Member</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Upgrade to access premium features</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/subscription")}
                    className="px-5 py-2 bg-primary text-white font-bold rounded-xl text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
                >
                    Upgrade
                </button>
            </div>
        </div>
    );
}

export function SubscriptionBadge() {
    const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();

    if (isLoading || !subscriptionStatus?.hasSubscription) return null;

    const tierColors: Record<string, string> = {
        free: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        premium: "bg-purple-50 text-purple-700 border border-purple-100",
    };

    const tierColor = subscriptionStatus.tier ? tierColors[subscriptionStatus.tier] || "bg-slate-100 text-slate-600" : "bg-slate-100 text-slate-600";

    return (
        <span className={`${tierColor} text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5`}>
            <FaCrown size={10} />
            {subscriptionStatus.tier?.toUpperCase()}
        </span>
    );
}
