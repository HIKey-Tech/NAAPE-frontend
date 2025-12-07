import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/authcontext";
import { usePaymentHistory } from "../../../hooks/usePaymentHistory";

// Types for payment records
type PaymentType = "event" | "subscription" | "tokenized-payment" | "transfer" | "other";
interface PaymentHistoryItem {
  _id: string;
  user: string;
  type: PaymentType;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  metadata: any;
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  completed: { label: "Completed", color: "#21C87A", icon: "✔️" },
  success: { label: "Success", color: "#21C87A", icon: "✔️" },
  pending: { label: "Pending", color: "#EFB00C", icon: "⏳" },
  failed: { label: "Failed", color: "#E57373", icon: "✖️" },
  cancelled: { label: "Cancelled", color: "#E57373", icon: "✖️" },
  refunded: { label: "Refunded", color: "#3866b7", icon: "↩" },
};

const TYPE_LABELS: Record<PaymentType, string> = {
  event: "Event",
  subscription: "Subscription",
  "tokenized-payment": "Tokenized Payment",
  transfer: "Transfer",
  other: "Other",
};

const TABS: { key: PaymentType; label: string }[] = [
  { key: "event", label: "Events" },
  { key: "subscription", label: "Subscription" },
  { key: "tokenized-payment", label: "Tokenized" },
  { key: "transfer", label: "Transfer" },
  { key: "other", label: "Other" },
];

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency || "NGN"} ${amount}`;
  }
}
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const badgeStyle = (color: string) => ({
  background: color,
  color: "#fff",
  fontWeight: 700,
  borderRadius: 10,
  padding: "3px 11px",
  display: "inline-flex",
  alignItems: "center",
  fontSize: 14,
  letterSpacing: "0.02em",
  minWidth: 82,
  justifyContent: "center",
  marginLeft: 5
});

const tabBtnStyle = (selected: boolean) => ({
  background: selected ? "#253fa9" : "#f6f7fa",
  color: selected ? "#fff" : "#253fa9",
  fontWeight: selected ? 700 : 500,
  border: "none",
  padding: "8px 22px",
  borderRadius: 18,
  marginRight: 8,
  cursor: "pointer",
  fontSize: 15.3,
  letterSpacing: "0.07em",
  boxShadow: selected ? "0 2px 9px #253fa91a" : undefined,
  transition: "background .22s,color .18s"
});

const PaymentRow: React.FC<{ item: PaymentHistoryItem }> = ({ item }) => {
  const statusKey = (item.status || "").toLowerCase();
  const status = STATUS_MAP[statusKey] || { label: item.status, color: "#d4dbe8", icon: "•" };

  // Extract major metadata for tooltips/details
  const details: string[] = [];
  const md = item.metadata || {};
  if (item.type === "event" && md.eventName) details.push(`Event: ${md.eventName}`);
  if (item.type === "subscription" && md.planName) details.push(`Plan: ${md.planName}`);
  if (md.description) details.push(md.description);
  if (md.reference) details.push(`Ref: ${md.reference}`);
  if (md.channel) details.push(`Channel: ${md.channel}`);
  if (md.gateway) details.push(`Gateway: ${md.gateway}`);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 1px 11px #eaf1fc36",
        padding: "18px 18px 14px 20px",
        marginBottom: 17,
        maxWidth: 520,
        marginLeft: "auto",
        marginRight: "auto",
        border: "1.1px solid #e4e6f1",
        display: "flex",
        flexDirection: "column",
        gap: 7,
      }}
      title={`Transaction ID: ${item.transactionId}`}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 33,
              height: 33,
              borderRadius: "50%",
              background: "#f1f3fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#253fa9",
              fontSize: 19.5,
              fontWeight: 900,
              marginRight: 5,
            }}
            aria-label={TYPE_LABELS[item.type]}
          >
            {TYPE_LABELS[item.type][0] || "?"}
          </span>
          <span
            style={{
              color: "#213869",
              fontWeight: 700,
              fontSize: 15.9,
              letterSpacing: "0.04em",
            }}
          >
            {TYPE_LABELS[item.type]}
          </span>
        </span>
        <span style={badgeStyle(status.color)} title={status.label}>
          <span style={{ fontSize: 16, marginRight: 5 }}>{status.icon}</span>
          {status.label}
        </span>
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 22,
          color: "#19496d",
          letterSpacing: "0.04em",
          marginBottom: 2,
        }}
      >
        {formatAmount(item.amount, item.currency)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 14.2 }}>
        <span>
          <strong style={{ color: "#51607a" }}>TX:</strong>{" "}
          <span style={{ color: "#273046" }}>{item.transactionId || "—"}</span>
        </span>
        <span>
          <strong style={{ color: "#51607a" }}>Date:</strong>{" "}
          <span style={{ color: "#425" }}>{formatDate(item.createdAt)}</span>
        </span>
      </div>
      {details.length > 0 && (
        <div
          style={{
            fontSize: 13.7,
            color: "#556",
            background: "#f8faff",
            borderRadius: 7,
            padding: "6px 12px",
            marginTop: 2,
            marginBottom: 0,
            lineHeight: 1.7,
          }}
        >
          {details.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const PaymentHistory: React.FC = () => {
  const { user } = useAuth();
  const userId = user?._id;

  const {
    history,
    loading,
    error,
    hasError,
    refetch,
  } = usePaymentHistory(userId);
  const [selectedTab, setSelectedTab] = useState<PaymentType>("event");

  const filtered = useMemo(() => {
    if (!Array.isArray(history)) return [];
    return history.filter((item: PaymentHistoryItem) => item.type === selectedTab);
  }, [history, selectedTab]);

  const hasAny = Array.isArray(history) && history.length > 0;

  return (
    <div style={{
      maxWidth: 600,
      margin: "0 auto",
      padding: "36px 0 40px",
      background: "none",
    }}>
      <h2 style={{
        textAlign: "center",
        fontWeight: 800,
        color: "#293b5a",
        letterSpacing: ".04em",
        fontSize: 22,
        marginBottom: 24,
      }}>
        Payment History
      </h2>
      <div style={{
        display: "flex",
        justifyContent: "center",
        background: "#fff",
        borderRadius: 13,
        boxShadow: "0 2px 10px #e9ebfa40",
        marginBottom: 21,
        padding: "9px 0"
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            style={tabBtnStyle(selectedTab === tab.key)}
            aria-current={selectedTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{
          padding: "50px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div className="animate-spin" style={{
            width: 28,
            height: 28,
            marginBottom: 18,
            border: "4px solid #d4e0ff",
            borderTop: "4px solid #4267e7",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite"
          }}></div>
          <span style={{ color: "#334", fontWeight: 600 }}>Loading your payment history...</span>
        </div>
      )}

      {hasError && (
        <div style={{
          color: "#c33",
          textAlign: "center",
          padding: "35px 0 24px",
          margin: "0 auto"
        }}>
          <div style={{ fontWeight: 800, fontSize: 21, marginBottom: 5 }}>Unable to load</div>
          <div style={{ fontSize: 15.5, color: "#b33", marginBottom: 14 }}>
            {error || "There was an error loading your payment history."}
          </div>
          <button
            style={{
              background: "#4267e7",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 700,
              padding: "8px 37px",
              border: "none",
              fontSize: 16,
              letterSpacing: "0.05em",
              cursor: "pointer",
              marginTop: 1,
            }}
            onClick={()=> refetch}
          >Retry</button>
        </div>
      )}

      {!loading && !hasAny && (
        <div style={{
          textAlign: "center",
          marginTop: 70,
          color: "#7a7fae"
        }}>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No Payment History Found</div>
          <div style={{
            color: "#929bcf",
            fontSize: 15.3,
            fontWeight: 400,
            letterSpacing: 0.05,
            maxWidth: 350,
            margin: "0 auto"
          }}>
            You haven’t made any payments yet. Any payments you complete will show here with all their details.
          </div>
        </div>
      )}

      {!loading && hasAny && filtered.length === 0 && (
        <div style={{
          textAlign: "center",
          marginTop: 50,
          color: "#767bae"
        }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
            No "{TYPE_LABELS[selectedTab]}" payments yet
          </div>
          <div style={{ fontSize: 15.3, color: "#9ba3c2", fontWeight: 400 }}>
            Switch tabs or try refreshing.
          </div>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div>
          {filtered.map(item => (
            <PaymentRow key={item._id || item.transactionId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;

