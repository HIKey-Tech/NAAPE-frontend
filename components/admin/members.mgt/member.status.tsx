import React from "react";
import { FaUsers, FaCheckCircle, FaClock, FaBan, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const STATUS_INFO: Record<string, { label: string; className: string; bgClass: string; icon: React.ElementType; description: string }> = {
  Active: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-100", bgClass: "bg-emerald-50", icon: FaCheckCircle, description: "Subscription is paid and current." },
  Expired: { label: "Expired", className: "bg-amber-50 text-amber-700 border-amber-100", bgClass: "bg-amber-50", icon: FaClock, description: "Subscription term has ended." },
  Suspended: { label: "Suspended", className: "bg-red-50 text-red-700 border-red-100", bgClass: "bg-red-50", icon: FaExclamationTriangle, description: "Temporarily blocked." },
  Pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-100", bgClass: "bg-yellow-50", icon: FaClock, description: "Payment pending review." },
  Cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600 border-slate-200", bgClass: "bg-slate-50", icon: FaTimesCircle, description: "Membership cancelled." },
};

const members = [
  { memberId: "M-002315", name: "Akira Yamada", status: "Active", expirationDate: "2025-07-09", membershipLevel: "Premium", email: "akira.yamada@email.com", joinedDate: "2022-06-24" },
  { memberId: "M-002260", name: "Elena Garcia", status: "Expired", expirationDate: "2024-02-21", membershipLevel: "Standard", email: "elena.garcia@email.com", joinedDate: "2021-05-14" },
  { memberId: "M-002080", name: "John Smith", status: "Suspended", expirationDate: "2024-11-15", membershipLevel: "Standard", email: "john.smith@email.com", joinedDate: "2020-03-09" },
  { memberId: "M-003110", name: "Emily Johnson", status: "Pending", expirationDate: "2025-03-01", membershipLevel: "Premium", email: "emily.johnson@email.com", joinedDate: "2024-02-01" },
  { memberId: "M-001780", name: "Yu Chen", status: "Cancelled", expirationDate: "2023-08-31", membershipLevel: "Basic", email: "yu.chen@email.com", joinedDate: "2019-11-15" },
];

function getStatusStats(membersList: typeof members) {
  const counts: Record<string, number> = {};
  let earliest: typeof members[0] | null = null;
  let latest: typeof members[0] | null = null;
  for (const m of membersList) {
    counts[m.status] = (counts[m.status] || 0) + 1;
    if (!earliest || m.expirationDate < earliest.expirationDate) earliest = m;
    if (!latest || m.expirationDate > latest.expirationDate) latest = m;
  }
  return { counts, total: membersList.length, earliest, latest };
}

const stats = getStatusStats(members);

const MemberStatus: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-primary/5 text-primary rounded-xl"><FaUsers size={20} /></div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Member Status</h1>
        </div>
        <p className="text-slate-500 ml-[52px]">Overview of membership statuses and details.</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Object.entries(stats.counts).map(([status, count]) => {
          const info = STATUS_INFO[status];
          const Icon = info?.icon || FaClock;
          return (
            <div key={status} className={`rounded-2xl border p-4 ${info?.className || "bg-slate-50 text-slate-600 border-slate-100"}`} title={info?.description}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} /> <span className="text-xs font-bold uppercase tracking-wide">{status}</span>
              </div>
              <span className="text-2xl font-black">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Statistics Summary</h3>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 mb-4">
          {Object.entries(stats.counts).map(([status, count]) => (
            <span key={status}><strong className="text-slate-800">{count}</strong> {status} <span className="text-slate-400">({((count / stats.total) * 100).toFixed(0)}%)</span></span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>Earliest expiry: <strong className="text-slate-700">{stats.earliest?.name}</strong> ({stats.earliest?.expirationDate})</span>
          <span>Latest expiry: <strong className="text-slate-700">{stats.latest?.name}</strong> ({stats.latest?.expirationDate})</span>
          <span className="ml-auto font-bold text-slate-800">Total: {stats.total}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["ID", "Name", "Level", "Expiry", "Email", "Joined", "Status"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const info = STATUS_INFO[m.status];
                const Icon = info?.icon || FaClock;
                return (
                  <tr key={m.memberId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">{m.memberId}</td>
                    <td className="px-5 py-4 font-bold text-slate-800">{m.name}</td>
                    <td className="px-5 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/5 text-primary border border-primary/10">{m.membershipLevel}</span></td>
                    <td className="px-5 py-4 text-slate-600">{m.expirationDate}</td>
                    <td className="px-5 py-4 text-slate-500 font-mono text-xs">{m.email}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{m.joinedDate}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${info?.className}`} title={info?.description}>
                        <Icon size={10} /> {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberStatus;
