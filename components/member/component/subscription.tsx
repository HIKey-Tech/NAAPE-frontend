import React, { useState, useEffect } from "react";
import { useFetchSubscriptionPlans, useFlutterwaveSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/context/authcontext";

// SubscriptionPlan interface based on backend data schema
export interface SubscriptionPlan {
  _id: string;
  name: string;
  flutterwavePlanId: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  highlight?: boolean;
  description?: string;
}

export default function MembershipSubscription() {
  const {
    createSubscription,
    creating,
    createError,
    createData,
    resetCreate,
    useVerifySubscription,
  } = useFlutterwaveSubscription();

  const {
    data: planData,
    isPending: plansLoading,
    error: plansError,
  } = useFetchSubscriptionPlans();

  const { user } = useAuth();
  const userId = user?._id || "";

  const [activeSub, setActiveSub] = useState<null | {
    planId: string;
    planLabel: string;
    startedAt: string;
    expiresAt: string;
  }>(null);
  const [loadingActiveSub, setLoadingActiveSub] = useState(true);
  const [planId, setPlanId] = useState("");
  const [startedPayment, setStartedPayment] = useState(false);
  const [txId, setTxId] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  // Plans sourced from fetch hook (typed)
  const PLANS: SubscriptionPlan[] = planData || [];

  console.log("the plans", planData)

  // Automatically detect and set "premium basic" (free/entry) plan as active, with notice for free for 2 months
  useEffect(() => {
    setLoadingActiveSub(true);
    // Only run if plans loaded
    if (PLANS.length > 0) {
      // Try to find a "Premium Basic" or "Free" plan (case-insensitive, fallback to first plan)
      const freePlan =
        PLANS.find(
          (p) =>
            p.name.toLowerCase().includes("basic") ||
            p.name.toLowerCase().includes("free") ||
            p.price === 0
        ) || PLANS[0];

      if (freePlan) {
        const today = new Date();
        const startedAt = today.toISOString().slice(0, 10);
        // Add 2 months to today
        const expires = new Date(today);
        expires.setMonth(today.getMonth() + 2);
        const expiresAt = expires.toISOString().slice(0, 10);

        setActiveSub({
          planId: freePlan._id,
          planLabel: freePlan.name,
          startedAt,
          expiresAt,
        });

        setPlanId(freePlan._id); // Select the free plan by default
      } else {
        setActiveSub(null);
      }
      setLoadingActiveSub(false);
    }
  }, [PLANS.length]);

  const {
    data: verifyData,
    error: verifyError,
    isLoading: verifying,
    refetch: refetchVerify,
  } = useVerifySubscription(txId, !!(showVerify && typeof txId === "string" && txId.trim().length > 0));

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    resetCreate();
    setStartedPayment(false);

    // If already free plan, don't process subscription
    const currentPlan = PLANS.find((p) => p._id === planId);
    if (currentPlan && (currentPlan.price === 0 || currentPlan.name.toLowerCase().includes("free") || currentPlan.name.toLowerCase().includes("basic"))) {
      window.alert("You are already on the free subscription (Premium Basic). Enjoy 2 months free!");
      return;
    }

    if (!(typeof planId === "string" && planId.trim())) {
      window.alert("Missing Plan\nPlease select a subscription plan.");
      return;
    }
    if (!(typeof userId === "string" && userId.trim())) {
      window.alert("Missing User ID\nUser ID could not be determined.");
      return;
    }
    try {
      const res = await createSubscription({ planId, userId });
      if (res && res.link) {
        setStartedPayment(true);
        setShowVerify(true);
        window.open(res.link, "_blank");
        window.alert("Payment link opened! Please complete payment in your browser.");
      }
    } catch (err) {
      // Error shown by createError below
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    refetchVerify();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafaff", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: 650, width: "100%", padding: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#2d2167", textAlign: "center", margin: "24px 0 8px" }}>
          Choose Your Plan
        </h1>
        <p style={{ fontSize: 16, color: "#6F6E8B", textAlign: "center", maxWidth: 400, margin: "0 auto 24px" }}>
          Invest in your growth—get instant access in minutes!
        </p>

        {/* Subscription status */}
        {/* 
        {loadingActiveSub ? (
          <div style={{ display: "flex", alignItems: "center", background: "#f8fffd", border: "2px solid #b3efcd", borderRadius: 13, padding: 12, marginBottom: 18 }}>
            <span style={{ color: "#4B38E7", marginRight: 9 }}><b>⏳</b></span>
            <span style={{ color: "#198754", fontWeight: 800 }}>Checking subscription status…</span>
          </div>
        ) : activeSub ? (
          <div style={{ display: "flex", alignItems: "center", background: "#e0fee6", border: "2px solid #0A9953", borderRadius: 13, padding: 15, marginBottom: 18 }}>
            <span style={{ fontSize: 31, marginRight: 12 }}>🌟</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#198754", fontWeight: 800 }}>
                You have an <span style={{ color: "#0A9953", fontWeight: "bold" }}>{activeSub.planLabel}</span> active!
              </div>
              <div style={{ color: "#376d49", fontWeight: 600, fontSize: 13 }}>
                Free for 2 months. Active from <b>{activeSub.startedAt}</b> until <b>{activeSub.expiresAt}</b>
              </div>
            </div>
            <span style={{ background: "#0A9953", color: "#fff", borderRadius: 15, padding: "4px 10px", fontWeight: 900, marginLeft: 8 }}>Active</span>
          </div>
        ) : null}
        */}
        {activeSub ? (
          <div style={{ display: "flex", alignItems: "center", background: "#e0fee6", border: "2px solid #0A9953", borderRadius: 13, padding: 15, marginBottom: 18 }}>
            <span style={{ fontSize: 31, marginRight: 12 }}>🌟</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#198754", fontWeight: 800 }}>
                You have an <span style={{ color: "#0A9953", fontWeight: "bold" }}>{activeSub.planLabel}</span> active!
              </div>
              <div style={{ color: "#376d49", fontWeight: 600, fontSize: 13 }}>
                Free for 2 months. Active from <b>{activeSub.startedAt}</b> until <b>{activeSub.expiresAt}</b>
              </div>
            </div>
            <span style={{ background: "#0A9953", color: "#fff", borderRadius: 15, padding: "4px 10px", fontWeight: 900, marginLeft: 8 }}>Active</span>
          </div>
        ) : null}

        {/* Notice for free subscription */}
        {activeSub && PLANS.length > 0 && (() => {
          const planObj = PLANS.find((p) => p._id === activeSub.planId);
          if (planObj && (planObj.price === 0 || planObj.name.toLowerCase().includes("basic") || planObj.name.toLowerCase().includes("free"))) {
            return (
              <div style={{ background: "#e9f7e9", border: "1.5px solid #6ac99a", color: "#174f31", borderRadius: 9, padding: 13, fontSize: 15.3, fontWeight: 600, marginBottom: 15, textAlign: "center" }}>
                🎉 <span style={{ color: "#0A9953", fontWeight: "bold" }}>Premium Basic is active!</span> <br />
                Enjoy <b>FREE Premium Basic</b> access for <b>2 months</b>.
              </div>
            );
          }
          return null;
        })()}

        {/* Fetch plan errors */}
        {plansError && (
          <div style={{ color: "#D8000C", fontWeight: 700, marginBottom: 15, textAlign: "center" }}>
            {plansError.message || "Could not load subscription plans."}
          </div>
        )}

        {/* Plans */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: 15,
          justifyContent: "center",
          marginBottom: 18,
          width: "100%"
        }}>
          {plansLoading ? (
            <div style={{ width: "100%", textAlign: "center", fontWeight: 600, color: "#5048b0" }}>Loading plans…</div>
          ) : (
            PLANS.map((plan) => {
              const id = plan._id;
              // The Premium Basic (free plan) is always selected/active
              const isFreePlan = plan.price === 0 || plan.name.toLowerCase().includes("free") || plan.name.toLowerCase().includes("basic");
              const isSelected = planId === id || isFreePlan;
              const isActive = activeSub && activeSub.planId === id;

              const priceText = plan.price === 0
                ? "₦0 / 2 months (Free)" // Show the free text for 2 months, adjust as needed
                : `${plan.currency === "NGN" ? "₦" : ""}${plan.price.toLocaleString()}${plan.currency !== "NGN" ? ` ${plan.currency}` : ""} / ${plan.interval}`;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => !isFreePlan && setPlanId(id)}
                  disabled={!!isActive || isFreePlan}
                  style={{
                    flex: 1,
                    background: isActive || isFreePlan
                      ? "#e9ffe9"
                      : isSelected
                        ? "#ECECFF"
                        : plan.highlight
                          ? "#F2FBF6"
                          : "#fff",
                    border: `2px solid ${
                      isActive || isFreePlan
                        ? "#0A9953"
                        : isSelected
                          ? "#4B38E7"
                          : plan.highlight
                            ? "#0A9953"
                            : "#e3e3e7"
                    }`,
                    borderRadius: 13,
                    padding: "20px 13px",
                    alignItems: "flex-start",
                    margin: "0 2.5px 5px",
                    opacity: isActive || isFreePlan ? 0.7 : 1,
                    boxShadow: isActive || isFreePlan ? "0 5px 10px 0 #5defa522" : "none",
                    cursor: (isActive || isFreePlan) ? "not-allowed" : "pointer",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <span style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: isActive || isFreePlan
                      ? "#0A9953"
                      : plan.highlight
                        ? "#0A9953"
                        : "#363062"
                  }}>
                    {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                    {(isActive || isFreePlan) && (
                      <span style={{
                        color: "#0A9953",
                        fontWeight: "bold",
                        fontSize: 13,
                        marginLeft: 4
                      }}> (Current)</span>
                    )}
                    {plan.highlight && (
                      <span style={{
                        color: "#fff",
                        background: "#0A9953",
                        borderRadius: 5,
                        fontSize: 10,
                        padding: "2px 6px",
                        marginLeft: 7,
                        marginRight: 0,
                        fontWeight: "800"
                      }}> RECOMMENDED </span>
                    )}
                  </span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#4B38E7", margin: "5px 0 7px" }}>{priceText}</span>
                  <span style={{ fontSize: 13.5, color: "#74718a", marginBottom: 7 }}>
                    {plan.price === 0
                      ? "Get Premium Basic for free for 2 months! 🎉 (No payment required)"
                      : plan.description ??
                        `Billed ${plan.interval}, cancel anytime`
                    }
                  </span>
                  <div style={{ marginTop: 8, marginBottom: 4 }}>
                    {(plan.features || []).map((perk, i) => (
                      <div key={i} style={{
                        fontSize: 13.6,
                        color: "#0A9953",
                        margin: "1.5px 0",
                        fontWeight: 600,
                      }}>
                        {perk}
                      </div>
                    ))}
                  </div>
                  {isSelected && !isFreePlan && (
                    <span style={{
                      fontSize: 13,
                      color: "#198754",
                      marginTop: 9,
                      fontWeight: "700",
                    }}>Selected ✓</span>
                  )}
                  {(isActive || isFreePlan) && (
                    <span style={{
                      marginTop: 9,
                      color: "#198754",
                      fontSize: 13,
                      fontWeight: "bold",
                      background: "#e3ffe7",
                      borderRadius: 8,
                      padding: "1px 8px",
                      alignSelf: "flex-start"
                    }}>✔ Active Subscription</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Subscription Form */}
        <form onSubmit={handleSubscribe} style={{
          width: "100%",
          marginTop: 10,
          marginBottom: 30,
          background: "#fff",
          borderRadius: 10,
          padding: 16,
          border: "1px solid #ececec",
        }}>
          <div style={{ fontSize: 15, fontWeight: "700", marginBottom: 7, marginTop: 1, color: "#363062", letterSpacing: 0.07 }}>
            User ID
          </div>
          <input
            disabled
            type="text"
            value={userId}
            style={{
              border: "1px solid #dadbec",
              borderRadius: 7,
              padding: 11,
              marginBottom: 9,
              fontSize: 16,
              background: "#f0f0f7",
              color: "#716e8b",
              fontWeight: 500,
              width: "100%",
            }}
            placeholder="User ID"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={
              !(typeof userId === "string" && userId.trim())
              || !(typeof planId === "string" && planId.trim())
              || creating
              || (!!activeSub && activeSub.planId === planId)
              || plansLoading
              || !!plansError
              // Always disable for free plan (already active)
              || (() => {
                const planObj = PLANS.find((p) => p._id === planId);
                return planObj && (planObj.price === 0 || planObj.name.toLowerCase().includes("free") || planObj.name.toLowerCase().includes("basic"));
              })()
            }
            style={{
              marginTop: 6,
              background: (
                !(typeof userId === "string" && userId.trim())
                || !(typeof planId === "string" && planId.trim())
                || creating
                || (!!activeSub && activeSub.planId === planId)
                || plansLoading
                || !!plansError
                || (() => {
                  const planObj = PLANS.find((p) => p._id === planId);
                  return planObj && (planObj.price === 0 || planObj.name.toLowerCase().includes("free") || planObj.name.toLowerCase().includes("basic"));
                })()
              )
                ? "#bbb"
                : "#4B38E7",
              border: "none",
              borderRadius: 9,
              width: "100%",
              alignItems: "center",
              padding: "15px 0",
              marginBottom: 2,
              color: "#fff",
              fontWeight: 900,
              fontSize: 16.5,
              letterSpacing: 0.5,
              cursor:
                !(typeof userId === "string" && userId.trim())
                || !(typeof planId === "string" && planId.trim())
                || creating
                || (!!activeSub && activeSub.planId === planId)
                || plansLoading
                || !!plansError
                || (() => {
                  const planObj = PLANS.find((p) => p._id === planId);
                  return planObj && (planObj.price === 0 || planObj.name.toLowerCase().includes("free") || planObj.name.toLowerCase().includes("basic"));
                })()
                  ? "not-allowed" : "pointer"
            }}
          >
            {creating ? (
              "Processing…"
            ) : (() => {
              // If free plan, show "Already on Premium Basic"
              const planObj = PLANS.find((p) => p._id === planId);
              if (planObj && (planObj.price === 0 || planObj.name.toLowerCase().includes("free") || planObj.name.toLowerCase().includes("basic"))) {
                return "Already on Premium Basic (Free)";
              }
              if (activeSub && activeSub.planId === planId) {
                return "Already Subscribed";
              }
              return "Start Subscription";
            })()}
          </button>
        </form>

        {createError && (
          <div style={{
            color: "#D8000C",
            marginTop: 14,
            fontSize: 14.5,
            textAlign: "center",
            fontWeight: 700
          }}>
            {createError.message}
          </div>
        )}

        {createData?.link && (
          <div style={{
            color: "#11aa4c",
            marginTop: 12,
            fontSize: 15.5,
            textAlign: "center",
            fontWeight: 700
          }}>
            Payment link opened or copied. Complete payment, then enter transaction ID below to verify.
          </div>
        )}

        {showVerify && (
          <form
            onSubmit={handleVerify}
            style={{
              borderTopWidth: 0,
              marginTop: 3,
              background: "#FFF",
              borderRadius: 10,
              width: "100%",
              padding: 17,
              marginBottom: 10,
              border: "1px solid #edf1fa",
              alignSelf: "center",
            }}
          >
            <div style={{
              fontSize: 15.5,
              fontWeight: "800",
              marginBottom: 11,
              color: "#363062",
              textAlign: "center",
              letterSpacing: 0.08,
            }}>
              Verify Your Payment
            </div>
            <input
              type="text"
              placeholder="Enter transaction ID"
              value={txId}
              onChange={e => setTxId(e.target.value)}
              style={{
                border: "1px solid #dadbec",
                borderRadius: 7,
                padding: 11,
                marginBottom: 9,
                fontSize: 16,
                background: "#FAFAFF",
                color: "#15143b",
                fontWeight: 500,
                width: "100%",
              }}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!(typeof txId === "string" && txId.trim()) || verifying}
              style={{
                marginTop: 4,
                background: (!(typeof txId === "string" && txId.trim()) || verifying) ? "#bbb" : "#0A9953",
                border: "none",
                borderRadius: 9,
                width: "100%",
                alignItems: "center",
                padding: "14px 0",
                marginBottom: 2,
                color: "#fff",
                fontWeight: 900,
                fontSize: 16.5,
                letterSpacing: 0.5,
                cursor: (!(typeof txId === "string" && txId.trim()) || verifying) ? "not-allowed" : "pointer"
              }}
            >
              {verifying ? "Verifying…" : "Verify Payment"}
            </button>
            {verifyError && (
              <div style={{
                color: "#D8000C",
                marginTop: 14,
                fontSize: 14.5,
                textAlign: "center",
                fontWeight: 700
              }}>
                {verifyError.message}
              </div>
            )}
            {verifyData && (
              <div style={{
                color: "#11aa4c",
                marginTop: 12,
                fontSize: 15.5,
                textAlign: "center",
                fontWeight: 700
              }}>
                {verifyData.message || "Subscription verified!"}
              </div>
            )}
          </form>
        )}

        <div style={{ marginTop: 26, width: "100%", textAlign: "left" }}>
          <div style={{ fontSize: 16.3, fontWeight: 800, color: "#2a175d", marginBottom: 6 }}>
            Why subscribe?
          </div>
          <div style={{ fontSize: 14.2, color: "#4B38E7", fontWeight: 600, marginBottom: 1, marginLeft: 3 }}>
            • Unlock all pro features and get priority support
          </div>
          <div style={{ fontSize: 14.2, color: "#4B38E7", fontWeight: 600, marginBottom: 1, marginLeft: 3 }}>
            • Cancel anytime—no hidden fees
          </div>
          <div style={{ fontSize: 14.2, color: "#4B38E7", fontWeight: 600, marginBottom: 1, marginLeft: 3 }}>
            • Join 1000+ users growing with us 🚀
          </div>
        </div>
      </div>
    </div>
  );
}
