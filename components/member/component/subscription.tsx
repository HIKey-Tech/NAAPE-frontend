import React, { useState, useEffect } from "react";
import { useFlutterwaveSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/context/authcontext";

/**
 * Custom hook to fetch active subscription status.
 * Replace this mock with your actual API integration.
 * (Simple UI mock: active subscription shown if userId ends with "2".)
 */
function useActiveSubscription(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState<null | {
    planId: string;
    planLabel: string;
    startedAt: string;
    expiresAt: string;
  }>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (typeof userId === "string" && userId.trim() && userId.endsWith("2")) {
        setActive({
          planId: "premium",
          planLabel: "Premium Plan",
          startedAt: "2023-11-01",
          expiresAt: "2024-12-01",
        });
      } else {
        setActive(null);
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [userId]);

  return { subscription: active, isLoading };
}

const PLANS = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "₦3,000/mo",
    description: "Essential features for getting started.",
    perks: ["✓ Full Platform Access", "✓ Email Support"],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "₦8,500/mo",
    description: "Everything in Basic, plus advanced perks.",
    perks: [
      "✓ Priority Support",
      "✓ All Advanced Features",
      "✓ Early Access to New Tools",
    ],
    highlight: true,
  },
];

export default function MembershipSubscription() {
  const {
    createSubscription,
    creating,
    createError,
    createData,
    resetCreate,
    useVerifySubscription,
  } = useFlutterwaveSubscription();

  const { user } = useAuth();
  const userId = user?._id || "";

  // Use custom (mocked) hook for "active subscription" – replace w/ real query!
  const { subscription: activeSub, isLoading: loadingActiveSub } = useActiveSubscription(userId);

  const [planId, setPlanId] = useState("");
  const [startedPayment, setStartedPayment] = useState(false);
  const [txId, setTxId] = useState("");
  const [showVerify, setShowVerify] = useState(false);

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
        // Open payment link
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
                Active from <b>{activeSub.startedAt}</b> until <b>{activeSub.expiresAt}</b>
              </div>
            </div>
            <span style={{ background: "#0A9953", color: "#fff", borderRadius: 15, padding: "4px 10px", fontWeight: 900, marginLeft: 8 }}>Active</span>
          </div>
        ) : null}

        {/* Plans */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: 15,
          justifyContent: "center",
          marginBottom: 18,
          width: "100%"
        }}>
          {PLANS.map((plan) => {
            const isSelected = planId === plan.id;
            const isActive = activeSub && activeSub.planId === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setPlanId(plan.id)}
                disabled={!!isActive}
                style={{
                  flex: 1,
                  // minWidth: 0,
                  // maxWidth: 170,
                  background: isActive ? "#e9ffe9" : isSelected ? "#ECECFF" : plan.highlight ? "#F2FBF6" : "#fff",
                  border: `2px solid ${
                    isActive
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
                  opacity: isActive ? 0.7 : 1,
                  boxShadow: isActive ? "0 5px 10px 0 #5defa522" : "none",
                  cursor: !!isActive ? "not-allowed" : "pointer",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <span style={{
                  fontSize: 17,
                  fontWeight: "700",
                  color: isActive
                    ? "#0A9953"
                    : plan.highlight
                    ? "#0A9953"
                    : "#363062"
                }}>
                  {plan.name}
                  {isActive && (
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
                <span style={{ fontSize: 22, fontWeight: 800, color: "#4B38E7", margin: "5px 0 7px" }}>{plan.price}</span>
                <span style={{ fontSize: 13.5, color: "#74718a", marginBottom: 7 }}>
                  {plan.description}
                </span>
                <div style={{ marginTop: 8, marginBottom: 4 }}>
                  {plan.perks.map((perk, i) => (
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
                {isSelected && (
                  <span style={{
                    fontSize: 13,
                    color: "#198754",
                    marginTop: 9,
                    fontWeight: "700",
                  }}>Selected ✓</span>
                )}
                {isActive && (
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
          })}
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
            }
            style={{
              marginTop: 6,
              background: (
                !(typeof userId === "string" && userId.trim())
                || !(typeof planId === "string" && planId.trim())
                || creating
                || (!!activeSub && activeSub.planId === planId)
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
                  ? "not-allowed" : "pointer"
            }}
          >
            {creating ? (
              "Processing…"
            ) : (activeSub && activeSub.planId === planId) ? (
              "Already Subscribed"
            ) : (
              "Start Subscription"
            )}
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

