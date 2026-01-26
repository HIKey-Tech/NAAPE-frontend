import React from "react";

// Micro animation CSS-in-JS via a style tag
const microAnimations = `
@keyframes fade-in-pop {
  0% {
    opacity: 0;
    transform: translateY(22px) scale(0.98);
  }
  78% {
    opacity: 1;
    transform: translateY(-5px) scale(1.04);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes pulse-dot {
  0% { transform: scale(1);}
  60% { transform: scale(1.18);}
  100% { transform: scale(1);}
}
@keyframes label-appear {
  0% { opacity: 0; transform: translateY(7px);}
  100% { opacity: 1; transform: translateY(0);}
}
`;

// Color palette & status tags
const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  Paid: { label: "Paid", color: "#187c49", bg: "#e7faf0" },
  Failed: { label: "Failed", color: "#af272e", bg: "#fbeaec" },
  Pending: { label: "Pending", color: "#b88712", bg: "#fffbe2" },
  Refunded: { label: "Refunded", color: "#165685", bg: "#e9f5fd" },
};

// UTILITIES

function StatusTag({ status }: { status: string }) {
  const meta = STATUS[status] || { label: status, color: "#767676", bg: "#f4f6fa" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: meta.bg,
        color: meta.color,
        fontWeight: 600,
        borderRadius: 6,
        padding: "2.5px 10px",
        fontSize: 13.3,
        letterSpacing: 0.06,
        marginLeft: 0,
        animation: "fade-in-pop 0.38s cubic-bezier(.41,1.3,.64,1) both"
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: 50,
          background: meta.color,
          marginRight: 0,
          animation: "pulse-dot 1.16s infinite"
        }}
      />
      {meta.label}
    </span>
  );
}

type PaymentHistoryEntry = {
  id: string,
  date: string,
  time: string,
  amount: number,
  currency: string,
  status: string,
  method: string,
  channel?: string,
  member: {
    id: string,
    name: string,
    email: string
  },
  membershipType: string,
  covering?: string,
  processedBy: string,
  transactionFee: number,
  reference: string,
  remarks: string,
  invoice: string | null
};

function downloadFileFromUrl(url: string, filename: string) {
  // Use fetch to request file and download as blob
  fetch(url, { credentials: "include" }) // credentials in case it's behind auth
    .then(resp => {
      if (!resp.ok) throw new Error("Network response was not ok");
      return resp.blob();
    })
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.style.display = "none";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    })
    .catch(() => {
      alert("Could not download invoice. Please try again later.");
    });
}

function InvoiceDownloadButton({ url, id }: { url: string; id: string }) {
  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation();
        const filename = id ? `invoice-${id}.pdf` : "invoice.pdf";
        downloadFileFromUrl(url, filename);
      }}
      style={{
        color: "#1976d2",
        fontWeight: 600,
        textDecoration: "underline",
        fontSize: 13.5,
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        transition: "color 0.18s"
      }}
      title="Download invoice PDF"
      aria-label="Download invoice"
    >
      Invoice
    </button>
  );
}

function PaymentHistoryRow({
  entry,
  highlight,
  index,
}: {
  entry: PaymentHistoryEntry;
  highlight: boolean;
  index: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "130px 120px 100px auto 115px",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: "1.3px solid #e3e7ef",
        background: highlight ? "#f8fafc" : "#fff",
        transition: "background 0.16s, border-color 0.18s",
        animation: `fade-in-pop 0.44s cubic-bezier(.41,1.3,.64,1) both`,
        animationDelay: `${0.06 * index}s`
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontWeight: 500,
          color: "#586185",
          fontSize: 14.2,
          letterSpacing: "-0.02em",
          lineHeight: 1.06,
          minWidth: 110,
          textAlign: "left",
        }}
      >
        {entry.date}
        <br />
        <span style={{ color: "#b8bbce", fontWeight: 500, fontSize: 12.6 }}>
          {entry.time}
        </span>
      </div>
      <div style={{ textAlign: "left", paddingLeft: 8 }}>
        <div style={{ fontWeight: 700, color: "#102b40", fontSize: 15.2 }}>
          {entry.amount.toLocaleString("en-US", {
            style: "currency",
            currency: entry.currency,
          })}
        </div>
        <span style={{ color: "#7d8fab", fontSize: 13, fontWeight: 500 }}>{entry.currency}</span>
      </div>
      <div>
        <StatusTag status={entry.status} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#162f57", fontWeight: 600, fontSize: 14.7, lineHeight: 1.1 }}>
          {entry.covering}
        </span>
        <span style={{ color: "#969cb3", fontSize: 12.6, fontWeight: 500 }}>
          Member: <span style={{ color: "#314276", fontWeight: 600 }}>{entry.member.name}</span> ({entry.member.id})
        </span>
        <span style={{ color: "#8ca7be", fontSize: 12.5, fontWeight: 500 }}>
          {entry.method} &bull; {entry.processedBy}
        </span>
      </div>
      <div style={{ textAlign: "right", paddingRight: 4 }}>
        {entry.invoice ? (
          <InvoiceDownloadButton url={entry.invoice} id={entry.id} />
        ) : (
          <span style={{ color: "#adbdd7", fontWeight: 500, fontSize: 13.5 }}>N/A</span>
        )}
      </div>
    </div>
  );
}

function PaymentDetail({
  entry,
  open,
  onClose,
}: {
  entry: PaymentHistoryEntry;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(18,27,36,0.44)",
        zIndex: 1002,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        animation: "fade-in-pop 0.36s cubic-bezier(.41,1.3,.64,1) both"
      }}
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        style={{
          minWidth: 375,
          maxWidth: 420,
          width: "95vw",
          background: "#fff",
          borderRadius: 14,
          padding: "30px 26px 23px 26px",
          border: "1.5px solid #e5e9f5",
          boxSizing: "border-box",
          position: "relative",
          boxShadow: "none", // explicit no shadow
          animation: "fade-in-pop 0.36s cubic-bezier(.41,1.3,.64,1) both"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 13,
            right: 18,
            background: "none",
            border: "none",
            color: "#8696af",
            fontWeight: 800,
            fontSize: 22,
            cursor: "pointer",
            lineHeight: 1,
            padding: 0
          }}
        >
          ×
        </button>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 800,
            margin: "0 0 9px 0",
            color: "#102b40",
            borderBottom: "2px solid #e9eef6",
            paddingBottom: 5,
            letterSpacing: 0.13,
            animation: "label-appear 0.42s cubic-bezier(.41,1.3,.64,1) both"
          }}
        >
          Payment Details
        </h3>
        <div style={{ marginBottom: 12, marginTop: 7 }}>
          <StatusTag status={entry.status} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Detail label="Transaction ID" value={entry.id} />
          <Detail label="Date" value={`${entry.date} ${entry.time}`} />
          <Detail label="Member" value={`${entry.member.name} (${entry.member.id})`} />
          <Detail label="Email" value={entry.member.email} />
          <Detail
            label="Membership"
            value={entry.membershipType + (entry.covering ? `, ${entry.covering}` : "")}
          />
          <Detail label="Payment Method" value={entry.method + (entry.channel ? `, ${entry.channel}` : "")} />
          <Detail label="Processed By" value={entry.processedBy} />
          <Detail
            label="Amount"
            value={
              <span>
                {entry.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: entry.currency,
                })}
                <sup style={{ color: "#b7b7b7", fontWeight: 500, fontSize: 12, marginLeft: 2 }}>
                  {entry.currency}
                </sup>
              </span>
            }
          />
          <Detail label="Transaction Fee" value={entry.transactionFee.toLocaleString("en-US", { style: "currency", currency: entry.currency })} />
          <Detail label="Reference" value={entry.reference} />
          <Detail label="Remarks" value={entry.remarks || <span style={{ color: "#9ba2b3" }}>-</span>} />
          <Detail
            label="Invoice"
            value={
              entry.invoice ? (
                <InvoiceDownloadButton url={entry.invoice} id={entry.id} />
              ) : (
                <span style={{ color: "#afb7c2" }}>N/A</span>
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "3.5px 0",
        borderBottom: "1px solid #f3f6fb",
      }}
    >
      <span
        style={{
          fontWeight: 600,
          color: "#8490ad",
          fontSize: 13.3,
          minWidth: 110,
          letterSpacing: 0.07,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "#192744",
          fontWeight: 600,
          fontSize: 14.2,
          marginLeft: 9,
          whiteSpace: "pre-line",
        }}
      >
        {value}
      </span>
    </div>
  );
}

interface PaymentHistoryProps {
  data?: PaymentHistoryEntry[];
  memberName?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ data, memberName }) => {
  const [detailOpenIdx, setDetailOpenIdx] = React.useState<number | null>(null);

  // Defensive: default empty array if data is undefined or not an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <>
      <style>{microAnimations}</style>
      <div
        style={{
          maxWidth: 890,
          margin: "36px auto",
          background: "#fff",
          borderRadius: 18,
          border: "1.6px solid #e3e8f3",
          padding: "32px 36px 18px 36px",
          animation: "fade-in-pop 0.52s cubic-bezier(.41,1.3,.64,1) both"
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 10,
            color: "#212c40",
            letterSpacing: 0.16,
            borderBottom: "2.6px solid #e6eef8",
            paddingBottom: 9,
            marginTop: 0,
            animation: "label-appear 0.57s cubic-bezier(.41,1.3,.64,1) both"
          }}
        >
          Member Payment History
        </h2>
        <div
          style={{
            fontSize: 15.3,
            fontWeight: 500,
            color: "#686ca7",
            marginBottom: 16,
            marginTop: 2,
            animation: "label-appear 0.67s cubic-bezier(.41,1.3,.64,1) both"
          }}
        >
          All recent membership payment records{memberName && (
            <> for <span style={{ color: "#233671", fontWeight: 700 }}>{memberName}</span></>
          )}
        </div>
        <div
          style={{
            borderRadius: 11,
            border: "1.35px solid #eaedf6",
            overflow: "hidden",
            marginBottom: 22,
            marginTop: 8,
            boxShadow: "none"
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "130px 120px 100px auto 115px",
              alignItems: "center",
              background: "#f5f8fd",
              color: "#7990ba",
              fontWeight: 700,
              fontSize: 14.1,
              borderBottom: "2px solid #e1e7f0",
              letterSpacing: 0.08,
              padding: "11px 0 8px 0"
            }}
          >
            <div style={{ textAlign: "left", paddingLeft: 0 }}>Date</div>
            <div style={{ textAlign: "left" }}>Amount</div>
            <div>Status</div>
            <div>Details</div>
            <div style={{ textAlign: "right", paddingRight: 10 }}>Invoice</div>
          </div>
          {/* Table rows */}
          {safeData.map((entry, idx) => (
            <div
              tabIndex={0}
              role="button"
              aria-label={`View details for payment on ${entry.date}`}
              title={`View payment details`}
              key={entry.id}
              style={{
                cursor: "pointer",
                outline: idx === detailOpenIdx ? "2px solid #49a0f2" : undefined,
                outlineOffset: 0,
                transition: "background 0.14s, outline 0.18s"
              }}
              onClick={() => setDetailOpenIdx(idx)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") setDetailOpenIdx(idx);
              }}
            >
              <PaymentHistoryRow entry={entry} highlight={idx % 2 === 1} index={idx} />
            </div>
          ))}
        </div>
        <div style={{ color: "#96a0b8", fontSize: 13, marginLeft: 2, marginTop: 8 }}>
          Showing last {safeData.length} payments. For earlier transactions contact finance.
        </div>
        {/* Modal for payment detail */}
        {detailOpenIdx != null && safeData[detailOpenIdx] && (
          <PaymentDetail
            entry={safeData[detailOpenIdx]}
            open={true}
            onClose={() => setDetailOpenIdx(null)}
          />
        )}
      </div>
    </>
  );
};

export default PaymentHistory;
