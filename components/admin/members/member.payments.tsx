import React, { useState } from "react";
import { useAdminMemberPayments } from "@/hooks/useAdminMemberPayments";

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

const STATUS_COLORS = {
  success: { bg: "#e7faf0", color: "#187c49", label: "Paid" },
  successful: { bg: "#e7faf0", color: "#187c49", label: "Paid" },
  completed: { bg: "#e7faf0", color: "#187c49", label: "Completed" },
  pending: { bg: "#fffbe2", color: "#b88712", label: "Pending" },
  failed: { bg: "#fbeaec", color: "#af272e", label: "Failed" },
  cancelled: { bg: "#fbeaec", color: "#af272e", label: "Cancelled" },
};

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  subscription: "Subscription",
  "tokenized-payment": "Tokenized Payment",
  transfer: "Transfer",
  other: "Other",
};

// Helper function to check if payment is successful
const isSuccessfulPayment = (status: string) => {
  return status === "success" || status === "successful" || status === "completed";
};

export default function AdminMemberPayments() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { payments = [], typeStats = [], paymentStats = [], loading, error } = useAdminMemberPayments(selectedType);

  const formatAmount = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status: string) => {
    const statusConfig = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || {
      bg: "#f4f6fa",
      color: "#767676",
      label: status,
    };
    return {
      backgroundColor: statusConfig.bg,
      color: statusConfig.color,
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-block",
    };
  };

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

  return (
    <div style={{ padding: "24px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
          Member Payment History
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px" }}>
          Track and manage all membership payment transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", marginBottom: "8px" }}>
            Total Revenue
          </h3>
          <p style={{ fontSize: "24px", fontWeight: "700", color: "#059669" }}>
            {formatAmount(totalRevenue)}
          </p>
        </div>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", marginBottom: "8px" }}>
            Successful Payments
          </h3>
          <p style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
            {successfulPayments}
          </p>
        </div>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", marginBottom: "8px" }}>
            Total Transactions
          </h3>
          <p style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
            {filteredPayments.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
              Filter by Payment Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
              }}
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
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
              Search Members
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or payment type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
            Member Payments ({filteredPayments.length})
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            Loading payments...
          </div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>
            Error: {error}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            No member payments found
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f8fafc" }}>
                <tr>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                    Member
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                    Payment Type
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                    Amount
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                    Status
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                    Date
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment: MemberPayment) => (
                  <tr key={payment._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#64748b",
                          }}
                        >
                          {payment.user?.profilePicture ? (
                            <img
                              src={payment.user.profilePicture}
                              alt=""
                              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                            />
                          ) : (
                            `${payment.user?.firstName?.[0] || ""}${payment.user?.lastName?.[0] || ""}`
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                            {payment.user?.firstName || ""} {payment.user?.lastName || ""}
                          </div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {payment.user?.email || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#1e293b" }}>
                        {PAYMENT_TYPE_LABELS[payment.type] || payment.type}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                        {formatAmount(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={getStatusStyle(payment.status)}>
                        {STATUS_COLORS[payment.status as keyof typeof STATUS_COLORS]?.label || payment.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontSize: "14px", color: "#64748b" }}>
                        {formatDate(payment.createdAt)}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#64748b" }}>
                        {payment.transactionId}
                      </div>
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