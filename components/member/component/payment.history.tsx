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
  successful: { label: "Successful", className: "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm", icon: FaCheckCircle },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm", icon: FaCheckCircle },
  success: { label: "Success", className: "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm", icon: FaCheckCircle },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm", icon: FaClock },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 border border-red-200 shadow-sm", icon: FaTimesCircle },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border border-red-200 shadow-sm", icon: FaTimesCircle },
  refunded: { label: "Refunded", className: "bg-primary/5 text-primary border border-primary/20 shadow-sm", icon: FaExchangeAlt },
};

const TYPE_LABELS: Record<string, string> = {
  event: "Event Payment",
  subscription: "Subscription",
};

const TABS: { key: PaymentType; label: string }[] = [
  { key: "event", label: "Events" },
  { key: "subscription", label: "Subscription" },
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
  const status = STATUS_MAP[statusKey] || { label: item.status, className: "bg-slate-100 text-slate-600 border border-slate-200 shadow-sm", icon: FaClock };
  const StatusIcon = status.icon;

  const details: string[] = [];
  const md = item.metadata || {};
  if (item.type === "event" && (md.eventTitle || md.eventName)) details.push(`Event: ${md.eventTitle || md.eventName}`);
  if (item.type === "subscription" && md.planName) details.push(`Plan: ${md.planName}`);
  if (md.description) details.push(md.description);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 mb-4 hover:shadow-md hover:border-slate-300 transition-all duration-300 group" title={`Transaction ID: ${item.transactionId}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Left Side: Type and Date */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg font-black text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            {(TYPE_LABELS[item.type] || "Payment")[0]}
          </div>
          <div>
            <p className="font-bold text-base text-slate-900">{TYPE_LABELS[item.type] || "Payment"}</p>
            <p className="text-sm font-medium text-slate-400 mt-0.5">{formatDate(item.createdAt)}</p>
          </div>
        </div>

        {/* Right Side: Amount and Status */}
        <div className="flex flex-col sm:items-end gap-2">
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 justify-between w-full sm:w-auto">
            <div className="text-2xl font-black text-slate-900 tracking-tight">{formatAmount(item.amount, item.currency)}</div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${status.className}`}>
              <StatusIcon size={12} /> {status.label}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-slate-100 my-4" />

      {/* Details Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-slate-500">
        <div className="font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-xs text-slate-400">
          TX: <span className="text-slate-600 font-medium">{item.transactionId || "—"}</span>
        </div>
        {details.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {details.map((line, idx) => (
              <span key={idx} className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg border border-primary/10 text-xs font-bold">
                {line}
              </span>
            ))}
          </div>
        )}
      </div>
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent w-full pb-20">
      {/* Header Section */}
      <div className="w-full pt-10 pb-8 bg-white dark:bg-transparent border-b border-slate-100 dark:border-border px-6 sm:px-10 mb-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2 border border-primary/10 dark:border-primary/20">
              <FaCreditCard size={20} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Payment <span className="text-primary">History</span></h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Track and manage all your past transactions, event bookings, and subscription payments in one place.
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex overflow-x-auto gap-1 scrollbar-hide shrink-0 max-w-full">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary/50 relative ${selectedTab === tab.key
                  ? "bg-white dark:bg-card text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <FaSpinner className="animate-spin text-4xl mb-4 text-primary/40" />
            <span className="font-bold text-lg text-slate-600">Loading payment records...</span>
            <span className="text-sm text-slate-400 mt-1">Please wait while we fetch your history.</span>
          </div>
        )}

        {hasError && (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
              <FaTimesCircle className="text-2xl text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2 mt-4">Unable to Load Records</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 max-w-sm mx-auto">{error || "There was an error loading your payment history."}</p>
            <button onClick={() => refetch} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-colors text-sm">
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !hasAny && !hasError && (
          <div className="text-center py-24 bg-white dark:bg-card rounded-3xl border border-slate-100 dark:border-border shadow-sm px-6">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-700">
              <FaReceipt className="text-3xl text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">No Payment History found</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              You haven't made any payments yet. All your completed transactions will securely appear here.
            </p>
          </div>
        )}

        {!loading && hasAny && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6 border-dashed">
            <h3 className="text-lg font-bold text-slate-600 mb-2">No {TYPE_LABELS[selectedTab]}</h3>
            <p className="text-sm text-slate-500 font-medium">You don't have any payments under this category.</p>
          </div>
        )}

        {/* List */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-1">
            {filtered.map(item => <PaymentRow key={item._id || item.transactionId} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
