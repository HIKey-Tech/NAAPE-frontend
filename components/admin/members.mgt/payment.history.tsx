import React from "react";
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaClock, FaExchangeAlt, FaSpinner, FaTimes, FaDownload, FaReceipt } from "react-icons/fa";

const STATUS: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  Paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: FaCheckCircle },
  Failed: { label: "Failed", className: "bg-red-50 text-red-700 border border-red-100", icon: FaTimesCircle },
  Pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-100", icon: FaClock },
  Refunded: { label: "Refunded", className: "bg-primary/5 text-primary border border-primary/10", icon: FaExchangeAlt },
};

type PaymentHistoryEntry = {
  id: string; date: string; time: string; amount: number; currency: string; status: string;
  method: string; channel?: string; member: { id: string; name: string; email: string };
  membershipType: string; covering?: string; processedBy: string; transactionFee: number;
  reference: string; remarks: string; invoice: string | null;
};

function downloadFileFromUrl(url: string, filename: string) {
  fetch(url, { credentials: "include" })
    .then(resp => { if (!resp.ok) throw new Error("Network error"); return resp.blob(); })
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl; a.style.display = "none"; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    })
    .catch(() => alert("Could not download invoice."));
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS[status] || { label: status, className: "bg-slate-100 text-slate-600", icon: FaClock };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${meta.className}`}>
      <Icon size={10} /> {meta.label}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline py-2 border-b border-slate-50">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-slate-700 text-right">{value}</span>
    </div>
  );
}

function PaymentDetail({ entry, open, onClose }: { entry: PaymentHistoryEntry; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-slate-900">Payment Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><FaTimes className="text-slate-400" size={14} /></button>
        </div>
        <div className="mb-4"><StatusBadge status={entry.status} /></div>
        <div className="space-y-0">
          <DetailRow label="Transaction ID" value={entry.id} />
          <DetailRow label="Date" value={`${entry.date} ${entry.time}`} />
          <DetailRow label="Member" value={`${entry.member.name} (${entry.member.id})`} />
          <DetailRow label="Email" value={entry.member.email} />
          <DetailRow label="Membership" value={entry.membershipType + (entry.covering ? `, ${entry.covering}` : "")} />
          <DetailRow label="Method" value={entry.method + (entry.channel ? `, ${entry.channel}` : "")} />
          <DetailRow label="Processed By" value={entry.processedBy} />
          <DetailRow label="Amount" value={entry.amount.toLocaleString("en-US", { style: "currency", currency: entry.currency })} />
          <DetailRow label="Fee" value={entry.transactionFee.toLocaleString("en-US", { style: "currency", currency: entry.currency })} />
          <DetailRow label="Reference" value={entry.reference} />
          <DetailRow label="Remarks" value={entry.remarks || <span className="text-slate-400">—</span>} />
          <DetailRow label="Invoice" value={
            entry.invoice
              ? <button onClick={() => downloadFileFromUrl(entry.invoice!, `invoice-${entry.id}.pdf`)} className="text-primary font-bold text-xs hover:underline inline-flex items-center gap-1"><FaDownload size={10} /> Download</button>
              : <span className="text-slate-400">N/A</span>
          } />
        </div>
      </div>
    </div>
  );
}

interface PaymentHistoryProps {
  data?: PaymentHistoryEntry[];
  memberName?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ data, memberName }) => {
  const [detailOpenIdx, setDetailOpenIdx] = React.useState<number | null>(null);
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-primary/5 text-primary rounded-xl"><FaCreditCard size={20} /></div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment History</h1>
        </div>
        <p className="text-slate-500 ml-[52px]">
          All recent membership payment records{memberName && <> for <strong className="text-slate-700">{memberName}</strong></>}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {safeData.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaReceipt className="text-2xl text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">No Payments Found</h3>
            <p className="text-sm text-slate-400">Payment records will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Date", "Amount", "Status", "Details", "Invoice"].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {safeData.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => setDetailOpenIdx(idx)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for payment on ${entry.date}`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-700">{entry.date}</div>
                      <div className="text-xs text-slate-400">{entry.time}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{entry.amount.toLocaleString("en-US", { style: "currency", currency: entry.currency })}</div>
                      <div className="text-xs text-slate-400">{entry.currency}</div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={entry.status} /></td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-700 text-sm">{entry.covering}</div>
                      <div className="text-xs text-slate-400">{entry.member.name} • {entry.method}</div>
                    </td>
                    <td className="px-5 py-4">
                      {entry.invoice ? (
                        <button
                          onClick={e => { e.stopPropagation(); downloadFileFromUrl(entry.invoice!, `invoice-${entry.id}.pdf`); }}
                          className="text-primary font-bold text-xs hover:underline inline-flex items-center gap-1"
                        ><FaDownload size={10} /> Download</button>
                      ) : <span className="text-slate-400 text-xs">N/A</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">Showing last {safeData.length} payments. For earlier transactions contact finance.</p>

      {detailOpenIdx != null && safeData[detailOpenIdx] && (
        <PaymentDetail entry={safeData[detailOpenIdx]} open={true} onClose={() => setDetailOpenIdx(null)} />
      )}
    </div>
  );
};

export default PaymentHistory;
