"use client";

import React, { useMemo, useState } from "react";
import {
  useFetchSubscriptionPlans,
  useFlutterwaveSubscription,
  SubscriptionPlan,
} from "@/hooks/useSubscription";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

function getTierFromPlan(plan: SubscriptionPlan): "basic" | "premium" {
  return plan.name.toLowerCase().includes("basic") ? "basic" : "premium";
}

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

export default function MembershipSubscription() {
  const { user } = useAuth();
  const userId = user?._id;

  const { data: plans = [], isPending, error } = useFetchSubscriptionPlans();

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

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan._id);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !userId || isFreePlanSelected) return;

    try {
      const tier = getTierFromPlan(selectedPlan);

      const checkoutUrl = await initializeSubscriptionPayment({ tier });

      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error(err?.message || "Subscription failed");
    }
  };

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
