"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useFetchSubscriptionPlans,
  useFlutterwaveSubscription,
  useSubscriptionStatus,
  SubscriptionPlan,
} from "@/hooks/useSubscription";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner";



function getTierFromPlan(plan: SubscriptionPlan): "basic" | "premium" {
  return plan.name.toLowerCase().includes("basic") ? "basic" : "premium";
}



function MembershipSubscriptionContent() {
  const { user } = useAuth();
  const userId = user?._id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect");

  const { data: plans = [], isPending, error } = useFetchSubscriptionPlans();
  const { data: subscriptionStatus } = useSubscriptionStatus();

  const {
    initializeSubscriptionPayment,
    initializingPayment,
  } = useFlutterwaveSubscription();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const selectedPlan = useMemo(
    () => plans.find((p) => p._id === selectedPlanId),
    [plans, selectedPlanId]
  );

  const isFreePlanSelected = !!selectedPlan && selectedPlan.price === 0;

  // Check if user has active premium subscription
  const hasActivePremium = subscriptionStatus?.hasSubscription && 
                           subscriptionStatus?.status === "active" && 
                           subscriptionStatus?.tier === "premium";

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan._id);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !userId || isFreePlanSelected) return;

    try {
      const tier = getTierFromPlan(selectedPlan);

      // Store redirect URL in localStorage before payment
      if (redirectUrl) {
        localStorage.setItem("postSubscriptionRedirect", redirectUrl);
      }

      const checkoutUrl = await initializeSubscriptionPayment({ tier });

      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error(err?.message || "Subscription failed");
    }
  };

  // If user has active premium subscription, show subscription status instead
  if (hasActivePremium) {
    const daysRemaining = subscriptionStatus?.endDate 
      ? Math.ceil((new Date(subscriptionStatus.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return (
      <div className="min-h-screen bg-[#fafaff] flex justify-center items-center">
        <div className="max-w-2xl w-full p-8">
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-8 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800">
                Premium Member
              </h1>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mb-6 border border-amber-200">
              <p className="text-center text-lg text-gray-700 mb-4">
                🎉 You're currently subscribed to our <span className="font-bold text-amber-700">{subscriptionStatus?.planName || "Premium"}</span> plan!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-xl font-bold text-green-600 capitalize">{subscriptionStatus?.status}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
                  <p className="text-xl font-bold text-gray-800 capitalize">{subscriptionStatus?.interval || "Monthly"}</p>
                </div>
              </div>

              {subscriptionStatus?.startDate && (
                <div className="mt-4 bg-white rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-gray-600 mb-1">Subscription Period</p>
                  <p className="text-base text-gray-800">
                    <span className="font-semibold">Started:</span> {new Date(subscriptionStatus.startDate).toLocaleDateString()}
                  </p>
                  {subscriptionStatus?.endDate && (
                    <p className="text-base text-gray-800 mt-1">
                      <span className="font-semibold">Expires:</span> {new Date(subscriptionStatus.endDate).toLocaleDateString()}
                      <span className="ml-2 text-amber-700 font-bold">
                        ({daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expires today"})
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {subscriptionStatus?.features && subscriptionStatus.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Your Premium Benefits:</h3>
                <ul className="space-y-2">
                  {subscriptionStatus.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center text-sm text-gray-600 mt-6 pt-6 border-t border-gray-200">
              <p>Need help with your subscription? Contact support at support@naape.org</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original subscription selection UI for non-premium users
  return (
    <div className="min-h-screen bg-[#fafaff] flex justify-center">
      <div className="max-w-3xl w-full p-6">
        <h1 className="text-3xl font-extrabold text-center mb-4">
          Choose Your Plan
        </h1>

        {error && (
          <p className="text-red-600 text-center font-semibold">
            Failed to load plans
          </p>
        )}

        {isPending ? (
          <p className="text-center">Loading plans…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => {
              const selected = selectedPlanId === plan._id;
              const isFree = plan.price === 0;

              return (
                <button
                  key={plan._id}
                  onClick={() => handlePlanSelect(plan)}
                  type="button"
                  className={`border-2 rounded-xl p-5 text-left transition
                    ${selected
                      ? isFree
                        ? "border-green-600 bg-green-50"
                        : "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 bg-white"
                    }
                    ${isFree ? "font-bold" : ""}
                  `}
                >
                  <h3 className="text-xl font-bold">
                    {plan.name}
                    {isFree && selected && (
                      <span className="ml-2 text-green-700 text-sm">
                        (Active)
                      </span>
                    )}
                  </h3>

                  <p
                    className={`font-extrabold mt-2 ${isFree ? "text-green-700" : "text-indigo-700"
                      }`}
                  >
                    {isFree
                      ? "Free"
                      : `₦${plan.price.toLocaleString()} / ${plan.interval}`}
                  </p>

                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {plan.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={handleSubscribe}
          disabled={
            !selectedPlan ||
            !userId ||
            initializingPayment ||
            isFreePlanSelected
          }
          className="mt-6 w-full bg-indigo-600 text-white font-bold py-4 rounded-lg disabled:opacity-50"
        >
          {initializingPayment ? "Redirecting…" : "Proceed to Payment"}
        </button>

        {isFreePlanSelected && (
          <p className="text-center mt-4 text-green-600 font-semibold">
            Free plan is active.
          </p>
        )}
      </div>
    </div>
  );
}

export default function MembershipSubscription() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafaff] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#15407c] border-t-transparent" />
      </div>
    }>
      <MembershipSubscriptionContent />
    </Suspense>
  );
}
