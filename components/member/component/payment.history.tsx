import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/authcontext";
import { usePaymentHistory } from "../../../hooks/usePaymentHistory";
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaClock, FaExchangeAlt, FaSpinner, FaReceipt } from "react-icons/fa";

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

const STATUS_MAP: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: FaCheckCircle },
  success: { label: "Success", className: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: FaCheckCircle },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-100", icon: FaClock },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 border border-red-100", icon: FaTimesCircle },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border border-red-100", icon: FaTimesCircle },
  refunded: { label: "Refunded", className: "bg-primary/5 text-primary border border-primary/10", icon: FaExchangeAlt },
};

const TYPE_LABELS: Record<PaymentType, string> = {
  event: "Event",
  subscription: "Subscription",
  "tokenized-payment": "Tokenized",
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
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: currency || "NGN", minimumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency || "NGN"} ${amount}`;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const PaymentRow: React.FC<{ item: PaymentHistoryItem }> = ({ item }) => {
  const statusKey = (item.status || "").toLowerCase();
  const status = STATUS_MAP[statusKey] || { label: item.status, className: "bg-slate-100 text-slate-600", icon: FaClock };
  const StatusIcon = status.icon;

  const details: string[] = [];
  const md = item.metadata || {};
  if (item.type === "event" && md.eventName) details.push(`Event: ${md.eventName}`);
  if (item.type === "subscription" && md.planName) details.push(`Plan: ${md.planName}`);
  if (md.description) details.push(md.description);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4 hover:shadow-md transition-all" title={`Transaction ID: ${item.transactionId}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-500">
            {TYPE_LABELS[item.type][0]}
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">{TYPE_LABELS[item.type]}</p>
            <p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status.className}`}>
          <StatusIcon size={10} /> {status.label}
        </span>
      </div>
      <div className="text-2xl font-black text-slate-800 tracking-tight mb-2">{formatAmount(item.amount, item.currency)}</div>
      <div className="text-xs text-slate-400 font-mono">TX: {item.transactionId || "—"}</div>
      {details.length > 0 && (
        <div className="mt-3 bg-slate-50 rounded-xl px-4 py-2.5 text-xs text-slate-500 space-y-1 border border-slate-100">
          {details.map((line, idx) => <div key={idx}>{line}</div>)}
        </div>
      )}
    </div>
  );
};

const PaymentHistory: React.FC = () => {
  const { user } = useAuth();
  const userId = user?._id || (user as any)?.id;
  const { history, loading, error, hasError, refetch } = usePaymentHistory(userId);
  const [selectedTab, setSelectedTab] = useState<PaymentType>("event");

  const filtered = useMemo(() => {
    if (!Array.isArray(history)) return [];
    return history.filter((item: PaymentHistoryItem) => item.type === selectedTab);
  }, [history, selectedTab]);

  const hasAny = Array.isArray(history) && history.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
            <FaCreditCard size={20} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment History</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 mb-6 flex overflow-x-auto gap-1 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedTab === tab.key
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-slate-500 hover:bg-slate-50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FaSpinner className="animate-spin text-2xl mb-3" />
          <span className="font-medium">Loading payment history...</span>
        </div>
      )}

      {hasError && (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-xl text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">Unable to Load</h3>
          <p className="text-sm text-slate-500 mb-4">{error || "There was an error loading your payment history."}</p>
          <button onClick={() => refetch} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors text-sm">
            Retry
          </button>
        </div>
      )}

      {!loading && !hasAny && !hasError && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaReceipt className="text-2xl text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">No Payment History</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">You haven't made any payments yet. Completed payments will appear here.</p>
        </div>
      )}

      {!loading && hasAny && filtered.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-lg font-bold text-slate-600 mb-1">No "{TYPE_LABELS[selectedTab]}" payments</h3>
          <p className="text-sm text-slate-400">Switch tabs or try refreshing.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div>
          {filtered.map(item => <PaymentRow key={item._id || item.transactionId} item={item} />)}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
