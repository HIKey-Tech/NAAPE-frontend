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

  const currentTier = subscriptionStatus?.tier || "free";

  // Effect to default selection to the current plan
  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      const currentPlan = plans.find(p => getTierFromPlan(p) === currentTier);
      if (currentPlan) {
        setSelectedPlanId(currentPlan._id);
      }
    }
  }, [plans, currentTier, selectedPlanId]);

  const selectedPlan = useMemo(
    () => plans.find((p) => p._id === selectedPlanId),
    [plans, selectedPlanId]
  );

  const isFreePlanSelected = !!selectedPlan && selectedPlan.price === 0;

  // Only show the "Active Details" view if they are PREMIUM and ACTIVE.
  // If they are on FREE, we want to show the "Choose Your Plan" screen 
  // with "Free" marked as "Current" to encourage upgrading.
  const isPremiumActive = subscriptionStatus?.hasSubscription &&
    subscriptionStatus?.status === "active" &&
    subscriptionStatus?.tier === "premium";

  const handlePlanSelect = (plan: SubscriptionPlan) => setSelectedPlanId(plan._id);

  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Authenticating your access...</p>
        </div>
      </div>
    );
  }

  // Active Subscription View (Only for Premium Users)
  if (isPremiumActive) {
    const daysRemaining = subscriptionStatus?.endDate
      ? Math.ceil((new Date(subscriptionStatus.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-[#0a0d14] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-12 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30 ring-8 ring-primary/5">
              <FaCrown className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 capitalize mb-2">
              {subscriptionStatus?.planName || "Premium"} Member
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Subscription
            </div>
          </div>

          {/* Body */}
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Billing Cycle</p>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <FaCalendarAlt className="text-primary" />
                  </div>
                  <p className="text-xl font-black text-slate-700 dark:text-slate-300 capitalize">{subscriptionStatus?.interval || "Monthly"}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Time Remaining</p>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <FaClock className="text-amber-500" />
                  </div>
                  <p className="text-xl font-black text-slate-700 dark:text-slate-300">
                    {daysRemaining > 0 ? `${daysRemaining} Days` : "Expires Today"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-slate-800/20 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  Your Exclusive Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(subscriptionStatus?.features && subscriptionStatus.features.length > 0 ? subscriptionStatus.features : [
                    "Full platform access",
                    "Advanced analytics",
                    "Priority support",
                    "Premium content"
                  ]).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <FaCheck size={8} />
                      </div>
                      <span className="text-sm font-medium text-slate-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <FaGem size={120} />
              </div>
            </div>

            <div className="pt-6 text-center">
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Renewal Date: <span className="text-slate-600 dark:text-slate-300 font-bold">{subscriptionStatus?.endDate ? new Date(subscriptionStatus.endDate).toLocaleDateString() : "N/A"}</span>
              </p>
              <button
                onClick={() => window.location.href = 'mailto:support@naape.org'}
                className="mt-6 text-sm font-black text-primary hover:underline underline-offset-4 decoration-2"
              >
                Need assistance? Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Plan Selection View
  const handleSubscribe = async () => {
    if (!selectedPlan || !userId) return;

    // If selecting the current plan, do nothing
    if (subscriptionStatus?.tier === getTierFromPlan(selectedPlan)) return;

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-6 ring-8 ring-primary/5">
          <FaGem size={28} className="animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-4">
          Upgrade Your Experience
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Choose the perfect plan for your professional journey with NAAPE.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-sm font-medium p-4 rounded-2xl border border-red-100 dark:border-red-900/30 mb-8 text-center">
          Failed to load plans. Please refresh the page.
        </div>
      )}

      {isPending ? (
        <div className="flex flex-col items-center py-24 text-slate-400">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
          <span className="font-semibold tracking-wide">Crafting your options...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {plans.map((plan) => {
            const planTier = getTierFromPlan(plan);
            const isSelected = selectedPlanId === plan._id;
            const isCurrent = currentTier === planTier;
            const isFree = planTier === "free";

            return (
              <button
                key={plan._id}
                onClick={() => handlePlanSelect(plan)}
                type="button"
                className={`group relative text-left rounded-[2rem] border-2 p-8 transition-all duration-300 ease-out overflow-hidden flex flex-col h-full ${isSelected
                  ? isFree
                    ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-500/5 shadow-2xl shadow-emerald-500/10 scale-[1.02]"
                    : "border-primary bg-primary/5 dark:bg-primary/5 shadow-2xl shadow-primary/10 scale-[1.02]"
                  : "border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0a0d14] hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xl"
                  }`}
              >
                {/* Badges */}
                <div className="flex justify-between items-start mb-6">
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                      <FaCheck size={8} /> Current Plan
                    </span>
                  )}
                  {!isFree && (
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'} transition-colors ml-auto`}>
                      <FaCrown size={16} />
                    </div>
                  )}
                  {isFree && !isCurrent && (
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'} transition-colors ml-auto`}>
                      <FaStar size={16} />
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 capitalize mb-1">
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-black tracking-tight ${isFree ? "text-emerald-600 dark:text-emerald-400" : "text-primary"}`}>
                    {isFree ? "Free" : `₦${plan.price.toLocaleString()}`}
                  </span>
                  {!isFree && <span className="text-slate-400 font-medium">/{plan.interval}</span>}
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Everything in {plan.name}:</p>
                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-snug">
                        <div className={`mt-1 p-0.5 rounded-full ${isFree ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                          <FaCheck size={10} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decorative background element */}
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isFree ? 'bg-emerald-500' : 'bg-primary'}`} />
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleSubscribe}
          disabled={!selectedPlan || !userId || initializingPayment || (selectedPlan && getTierFromPlan(selectedPlan) === currentTier)}
          className={`w-full py-5 rounded-[1.5rem] font-black text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${!selectedPlan
            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            : selectedPlan && getTierFromPlan(selectedPlan) === currentTier
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 cursor-default shadow-none"
              : "bg-primary text-white shadow-primary/25 hover:bg-primary/90 hover:-translate-y-1"
            }`}
        >
          {initializingPayment ? (
            <><FaSpinner className="animate-spin" size={20} /> Securing your plan...</>
          ) : !selectedPlan ? (
            "Select a plan to continue"
          ) : getTierFromPlan(selectedPlan) === currentTier ? (
            <><FaCheck size={20} /> Your Active Plan</>
          ) : selectedPlan.price === 0 ? (
            <><FaStar size={20} /> Downgrade to Free</>
          ) : (
            <><FaGem size={20} /> Upgrade to Premium Now</>
          )}
        </button>

        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
          Securely processed via Flutterwave
        </p>
      </div>
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
