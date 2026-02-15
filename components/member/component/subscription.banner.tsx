"use client";

import { useSubscriptionStatus } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";
import { FaCrown, FaLock, FaCheckCircle } from "react-icons/fa";

interface SubscriptionBannerProps {
    showUpgradePrompt?: boolean;
    feature?: string;
}

export function SubscriptionBanner({ showUpgradePrompt = false, feature }: SubscriptionBannerProps) {
    const router = useRouter();
    const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();

    if (isLoading) {
        return null;
    }

    // User has active subscription
    if (subscriptionStatus?.hasSubscription && subscriptionStatus.status === "active") {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white rounded-full p-2">
                            <FaCrown className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900 text-lg">
                                {subscriptionStatus.tier?.toUpperCase()} Member
                            </h3>
                            <p className="text-sm text-blue-700">
                                Active until {subscriptionStatus.endDate ? new Date(subscriptionStatus.endDate).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                    </div>
                    <FaCheckCircle className="text-green-500 text-2xl" />
                </div>
            </div>
        );
    }

    // User needs to upgrade
    if (showUpgradePrompt) {
        return (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                    <div className="bg-amber-500 text-white rounded-full p-3 flex-shrink-0">
                        <FaLock className="text-2xl" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-amber-900 text-xl mb-2">
                            Subscription Required
                        </h3>
                        <p className="text-amber-800 mb-4">
                            {feature 
                                ? `To ${feature}, you need an active subscription.`
                                : "This feature requires an active subscription to access."
                            }
                        </p>
                        <p className="text-sm text-amber-700 mb-4">
                            Subscribe now to unlock:
                        </p>
                        <ul className="text-sm text-amber-800 mb-4 space-y-1 ml-4">
                            <li>✓ Access to all publications</li>
                            <li>✓ Create and submit your own publications</li>
                            <li>✓ Exclusive member resources</li>
                            <li>✓ Priority event registration</li>
                        </ul>
                        <button
                            onClick={() => router.push("/subscription")}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            View Subscription Plans
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Simple status indicator
    return (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-400 text-white rounded-full p-2">
                        <FaLock className="text-lg" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-700">Free Member</h3>
                        <p className="text-sm text-gray-600">
                            Upgrade to access premium features
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/subscription")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Upgrade
                </button>
            </div>
        </div>
    );
}

export function SubscriptionBadge() {
    const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();

    if (isLoading || !subscriptionStatus?.hasSubscription) {
        return null;
    }

    const tierColors = {
        free: "bg-green-500",
        premium: "bg-purple-600",
    };

    const tierColor = subscriptionStatus.tier ? tierColors[subscriptionStatus.tier] : "bg-gray-500";

    return (
        <span className={`${tierColor} text-white text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1`}>
            <FaCrown className="text-xs" />
            {subscriptionStatus.tier?.toUpperCase()}
        </span>
    );
}
