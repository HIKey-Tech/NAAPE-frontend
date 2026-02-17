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
import { FaCrown, FaStar, FaCheck, FaSpinner, FaClock, FaCalendarAlt, FaGem, FaArrowRight } from "react-icons/fa";

function getTierFromPlan(plan: SubscriptionPlan): "free" | "premium" {
  return plan.name.toLowerCase().includes("free") ? "free" : "premium";
}

function MembershipSubscriptionContent() {
  const { user } = useAuth();
  const userId = user?._id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect");

  const { data: plans = [], isPending, error } = useFetchSubscriptionPlans();
  const { data: subscriptionStatus, isLoading: isLoadingSubscription } = useSubscriptionStatus();

  const { initializeSubscriptionPayment, initializingPayment } = useFlutterwaveSubscription();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const selectedPlan = useMemo(
    () => plans.find((p) => p._id === selectedPlanId),
    [plans, selectedPlanId]
  );

  const isFreePlanSelected = !!selectedPlan && selectedPlan.price === 0;
  const hasActiveSubscription = subscriptionStatus?.hasSubscription && subscriptionStatus?.status === "active";

  const handlePlanSelect = (plan: SubscriptionPlan) => setSelectedPlanId(plan._id);

  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading subscription status...</p>
        </div>
      </div>
    );
  }

  // Active Subscription View
  if (hasActiveSubscription) {
    const daysRemaining = subscriptionStatus?.endDate
      ? Math.ceil((new Date(subscriptionStatus.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Hero */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-slate-50 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200/40">
              {subscriptionStatus?.tier === "free" ? <FaStar className="text-white text-2xl" /> : <FaCrown className="text-white text-2xl" />}
            </div>
            <h1 className="text-2xl font-black text-slate-800 capitalize mb-1">
              {subscriptionStatus?.tier === "free" ? "Free Plan Member" : `${subscriptionStatus?.tier || "Active"} Member`}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 mt-2">
              <FaCheck size={10} /> Active
            </span>
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Status</p>
                <p className="text-lg font-black text-emerald-600 capitalize">{subscriptionStatus?.status}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Billing</p>
                <p className="text-lg font-black text-slate-700 capitalize">{subscriptionStatus?.interval || "Monthly"}</p>
              </div>
            </div>

            {subscriptionStatus?.startDate && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Subscription Period</p>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <FaCalendarAlt size={12} className="text-slate-400" />
                  <span><strong>Started:</strong> {new Date(subscriptionStatus.startDate).toLocaleDateString()}</span>
                </div>
                {subscriptionStatus?.endDate && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 mt-1.5">
                    <FaClock size={12} className="text-slate-400" />
                    <span>
                      <strong>Expires:</strong> {new Date(subscriptionStatus.endDate).toLocaleDateString()}
                      <span className="ml-2 text-amber-600 font-bold text-xs">
                        ({daysRemaining > 0 ? `${daysRemaining} days left` : "Expires today"})
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}

            {subscriptionStatus?.features && subscriptionStatus.features.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Your Benefits</h3>
                <div className="space-y-2">
                  {subscriptionStatus.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <FaCheck className="text-emerald-500 mt-0.5 shrink-0" size={12} />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 text-center">
              {subscriptionStatus?.tier === "free" ? (
                <button
                  onClick={() => window.location.href = '/subscription'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors text-sm"
                >
                  <FaGem size={14} /> Upgrade to Premium <FaArrowRight size={12} />
                </button>
              ) : (
                <p className="text-sm text-slate-400">Need help? Contact support@naape.org</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Plan Selection View
  const handleSubscribe = async () => {
    if (!selectedPlan || !userId) return;
    try {
      const tier = getTierFromPlan(selectedPlan);
      if (tier === "free") {
        const response = await fetch("/api/v1/payments/subscription/initialize-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ tier: "free" })
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Free subscription activated!");
          window.location.reload();
        } else {
          toast.error(data.message || "Failed to activate free subscription");
        }
        return;
      }
      if (redirectUrl) localStorage.setItem("postSubscriptionRedirect", redirectUrl);
      const checkoutUrl = await initializeSubscriptionPayment({ tier });
      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error(err?.message || "Subscription failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaGem size={24} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Choose Your Plan</h1>
        <p className="text-slate-500">Select the plan that works best for you.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm font-medium p-4 rounded-xl border border-red-100 mb-6 text-center">
          Failed to load plans. Please try again.
        </div>
      )}

      {isPending ? (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <FaSpinner className="animate-spin text-2xl mb-3" />
          <span className="font-medium">Loading plans...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {plans.map((plan) => {
            const selected = selectedPlanId === plan._id;
            const isFree = plan.price === 0;
            return (
              <button
                key={plan._id}
                onClick={() => handlePlanSelect(plan)}
                type="button"
                className={`text-left rounded-2xl border-2 p-6 transition-all relative overflow-hidden group hover:shadow-lg ${selected
                  ? isFree
                    ? "border-emerald-400 bg-emerald-50/30 shadow-md shadow-emerald-100"
                    : "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
              >
                {!isFree && (
                  <div className="absolute top-4 right-4">
                    <FaCrown className={`text-lg ${selected ? 'text-primary' : 'text-slate-300'} group-hover:text-primary transition-colors`} />
                  </div>
                )}
                <h3 className="text-xl font-black text-slate-800 capitalize mb-1">{plan.name}</h3>
                <p className={`text-2xl font-black mb-4 ${isFree ? "text-emerald-600" : "text-primary"}`}>
                  {isFree ? "Free" : `₦${plan.price.toLocaleString()} / ${plan.interval}`}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <FaCheck className={`mt-0.5 shrink-0 ${isFree ? 'text-emerald-500' : 'text-primary'}`} size={12} />
                      {f}
                    </li>
                  ))}
                </ul>
                {selected && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${isFree ? 'bg-emerald-400' : 'bg-primary'}`} />
                )}
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={!selectedPlan || !userId || initializingPayment}
        className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-base flex items-center justify-center gap-2"
      >
        {initializingPayment ? (
          <><FaSpinner className="animate-spin" /> Processing...</>
        ) : selectedPlan?.price === 0 ? (
          <><FaCheck /> Activate Free Plan</>
        ) : (
          <><FaArrowRight /> Proceed to Payment</>
        )}
      </button>
    </div>
  );
}

export default function MembershipSubscription() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <MembershipSubscriptionContent />
    </Suspense>
  );
}
