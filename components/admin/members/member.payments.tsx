import React, { useState } from "react";
import { useAdminMemberPayments } from "@/hooks/useAdminMemberPayments";
import { FaDollarSign, FaCheckCircle, FaReceipt, FaSearch, FaFilter, FaCreditCard } from "react-icons/fa";

interface MemberPayment {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  type: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  metadata: any;
  createdAt: string;
}

interface TypeStats {
  _id: string;
  count: number;
  totalAmount: number;
  statuses: string[];
}

const STATUS_STYLES: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  successful: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  success: "Paid",
  successful: "Paid",
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
  cancelled: "Cancelled",
};

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  subscription: "Subscription",
  "tokenized-payment": "Tokenized Payment",
  transfer: "Transfer",
  other: "Other",
};

const isSuccessfulPayment = (status: string) =>
  status === "success" || status === "successful" || status === "completed";

export default function AdminMemberPayments() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { payments = [], typeStats = [], paymentStats = [], loading, error } = useAdminMemberPayments(selectedType);

  const formatAmount = (amount: number, currency: string = "NGN") =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const filteredPayments = payments.filter(
    (payment: MemberPayment) =>
      (payment.user?.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (payment.user?.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (payment.user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (payment.type?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredPayments
    .filter((p: MemberPayment) => isSuccessfulPayment(p.status))
    .reduce((sum: number, p: MemberPayment) => sum + p.amount, 0);

  const successfulPayments = filteredPayments.filter(
    (p: MemberPayment) => isSuccessfulPayment(p.status)
  ).length;

  const statCards = [
    { label: "Total Revenue", value: formatAmount(totalRevenue), icon: FaDollarSign, bg: "bg-emerald-50", ic: "text-emerald-500", vc: "text-emerald-600" },
    { label: "Successful Payments", value: successfulPayments, icon: FaCheckCircle, bg: "bg-primary/5", ic: "text-primary", vc: "text-slate-900" },
    { label: "Total Transactions", value: filteredPayments.length, icon: FaReceipt, bg: "bg-purple-50", ic: "text-purple-500", vc: "text-slate-900" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Member Payment History</h1>
        <p className="text-slate-500 mt-1">Track and manage all membership payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.ic}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${s.vc}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
            <FaFilter className="w-4 h-4 text-slate-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Filters</h3>
        </div>
        <div className="p-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Payment Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value="all">All Payment Types</option>
                {typeStats.map((stat: TypeStats) => (
                  <option key={stat._id} value={stat._id}>
                    {PAYMENT_TYPE_LABELS[stat._id] || stat._id} ({stat.count} payments)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Search Members</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or payment type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <FaCreditCard className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Member Payments</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{filteredPayments.length}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-slate-500 text-sm">Loading payments...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm">Error: {error}</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <FaReceipt className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No payments found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Member", "Payment Type", "Amount", "Status", "Date", "Transaction ID"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment: MemberPayment) => (
                  <tr key={payment._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {payment.user?.profilePicture ? (
                          <img
                            src={payment.user.profilePicture}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {`${payment.user?.firstName?.[0] || ""}${payment.user?.lastName?.[0] || ""}`}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-900 truncate">
                            {payment.user?.firstName || ""} {payment.user?.lastName || ""}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{payment.user?.email || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                        {PAYMENT_TYPE_LABELS[payment.type] || payment.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900">{formatAmount(payment.amount, payment.currency)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[payment.status] || "bg-slate-100 text-slate-600"}`}>
                        {STATUS_LABELS[payment.status] || payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{formatDate(payment.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-slate-400">{payment.transactionId}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}