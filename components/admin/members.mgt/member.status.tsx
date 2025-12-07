import React from "react";

// Micro animation CSS-in-JS via a style tag
const microAnimations = `
@keyframes pulse-dot {
  0% { transform: scale(1);}
  60% { transform: scale(1.16);}
  100% { transform: scale(1);}
}
@keyframes fade-in-pop {
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  80% {
    opacity: 1;
    transform: translateY(-2px) scale(1.04);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes label-float {
  0%   { opacity: 0; transform: translateY(8px);}
  100% { opacity: 1; transform: translateY(0);}
}
`;

const STATUS_INFO: Record<
  string,
  { color: string; bg: string; description: string }
> = {
  Active: {
    color: "#3CB371", // green
    bg: "#ecfdf5",
    description:
      "This member's subscription is paid, current, and in good standing. All privileges are available.",
  },
  Expired: {
    color: "#D2691E", // brown
    bg: "#f8ede7",
    description:
      "This member's subscription term has ended. Renewal is required to maintain privileges.",
  },
  Suspended: {
    color: "#FF6347", // red
    bg: "#fff0ee",
    description:
      "This membership is temporarily blocked due to overdue payment or violation of terms.",
  },
  Pending: {
    color: "#FBC02D", // yellow
    bg: "#fffbe8",
    description:
      "Registration or renewal is in process, or payment is pending review.",
  },
  Cancelled: {
    color: "#7986CB", // blue-grey
    bg: "#f5f8fd",
    description:
      "Membership has been voluntarily cancelled or revoked. Access is no longer granted.",
  },
};

const members = [
  {
    memberId: "M-002315",
    name: "Akira Yamada",
    status: "Active",
    expirationDate: "2025-07-09",
    membershipLevel: "Premium",
    email: "akira.yamada@email.com",
    joinedDate: "2022-06-24",
  },
  {
    memberId: "M-002260",
    name: "Elena Garcia",
    status: "Expired",
    expirationDate: "2024-02-21",
    membershipLevel: "Standard",
    email: "elena.garcia@email.com",
    joinedDate: "2021-05-14",
  },
  {
    memberId: "M-002080",
    name: "John Smith",
    status: "Suspended",
    expirationDate: "2024-11-15",
    membershipLevel: "Standard",
    email: "john.smith@email.com",
    joinedDate: "2020-03-09",
  },
  {
    memberId: "M-003110",
    name: "Emily Johnson",
    status: "Pending",
    expirationDate: "2025-03-01",
    membershipLevel: "Premium",
    email: "emily.johnson@email.com",
    joinedDate: "2024-02-01",
  },
  {
    memberId: "M-001780",
    name: "Yu Chen",
    status: "Cancelled",
    expirationDate: "2023-08-31",
    membershipLevel: "Basic",
    email: "yu.chen@email.com",
    joinedDate: "2019-11-15",
  },
  // ...more or load from API
];

// In-depth status chip with description tooltip
function StatusTag({ status }: { status: string }) {
  const info = STATUS_INFO[status] || {
    color: "#bbb",
    bg: "#eee",
    description: "Unknown status.",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontWeight: 700,
        color: info.color,
        background: info.bg,
        borderRadius: 7,
        padding: "2px 13px 2px 7px",
        fontSize: 13.7,
        letterSpacing: 0.11,
        textTransform: "uppercase",
        marginLeft: 5,
        animation: "fade-in-pop 0.54s cubic-bezier(.41,1.3,.64,1) both",
        position: "relative",
        cursor: "default",
      }}
      tabIndex={0}
      title={info.description}
      aria-label={`${status}: ${info.description}`}
    >
      <span
        style={{
          background: info.color,
          width: 11,
          height: 11,
          borderRadius: "50%",
          display: "inline-block",
          marginRight: 8,
          border: "2px solid #fff",
          animation: "pulse-dot 1.21s cubic-bezier(.31,1.48,.54,1.09) infinite",
        }}
        aria-hidden="true"
      />
      {status}
      <span
        style={{
          fontWeight: 400,
          fontSize: 11.2,
          marginLeft: 7,
          color: "#57648c",
          opacity: 0.7,
        }}
      >
        <span aria-hidden="true" role="img">
          ℹ️
        </span>
      </span>
    </span>
  );
}

// Calculates member status counts, member percentages, and earliest/latest expiring members
function getStatusStats(membersList: typeof members) {
  const stats: Record<
    string,
    { count: number; earliest?: any; latest?: any }
  > = {};
  let earliestExpiry: any = null;
  let latestExpiry: any = null;

  for (const m of membersList) {
    if (!(m.status in stats)) {
      stats[m.status] = { count: 1, earliest: m, latest: m };
    } else {
      stats[m.status].count += 1;
      if (m.expirationDate < stats[m.status].earliest.expirationDate) {
        stats[m.status].earliest = m;
      }
      if (m.expirationDate > stats[m.status].latest.expirationDate) {
        stats[m.status].latest = m;
      }
    }
    // For the whole dataset
    if (!earliestExpiry || m.expirationDate < earliestExpiry.expirationDate) {
      earliestExpiry = m;
    }
    if (!latestExpiry || m.expirationDate > latestExpiry.expirationDate) {
      latestExpiry = m;
    }
  }
  return {
    statusCounts: Object.fromEntries(
      Object.entries(stats).map(([k, v]) => [k, v.count])
    ),
    total: membersList.length,
    stats,
    earliestExpiry,
    latestExpiry,
  };
}

const statsData = getStatusStats(members);
const statusCounts = statsData.statusCounts;

function SectionTitle({ icon, title, subtitle }: { icon?: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: subtitle ? "flex-end" : "center",
      gap: 13,
      marginBottom: subtitle ? 0 : 24,
    }}>
      {icon && <span style={{
        fontSize: 35,
        color: "#495dcc",
        opacity: 0.68,
        marginBottom: subtitle ? 4 : 0,
      }}>{icon}</span>}
      <div>
        <h2 style={{
          fontSize: 25,
          fontWeight: 800,
          margin: 0,
          color: "#202846",
          letterSpacing: 0.18,
          lineHeight: 1.14,
          borderBottom: "2px solid #e9edf6",
          paddingBottom: subtitle ? 2 : 5,
          animation: "label-float 0.52s cubic-bezier(.41,1.3,.64,1) both",
        }}>{title}</h2>
        {subtitle && (
          <p style={{
            fontSize: 15,
            color: "#536094",
            margin: "5px 0 0 0",
            lineHeight: 1.5,
            maxWidth: 650,
            fontWeight: 400,
            animation: "label-float 0.62s cubic-bezier(.41,1.3,.64,1) both",
          }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function StatusOverviewBar() {
  return (
    <div
      style={{
        marginBottom: 30,
        marginTop: 20,
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      {Object.entries(statusCounts).map(([status, count]) => (
        <div
          key={status}
          style={{
            background: STATUS_INFO[status]?.bg || "#eee",
            color: STATUS_INFO[status]?.color || "#333",
            padding: "9px 24px 9px 15px",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 17,
            display: "flex",
            alignItems: "center",
            gap: 9,
            minWidth: 112,
            boxShadow: "0 2.5px 8px 0 rgba(136,152,220,0.07)",
            border: "1.2px solid #e3ecfa",
            animation: "fade-in-pop 0.65s cubic-bezier(.41,1.3,.64,1) both",
            lineHeight: 1.15,
            cursor: "pointer",
            position: "relative",
          }}
          tabIndex={0}
          title={STATUS_INFO[status]?.description}
          aria-label={`${status} (${count}). ${STATUS_INFO[status]?.description || ""}`}
        >
          <span
            style={{
              background: STATUS_INFO[status]?.color || "#bbb",
              width: 16,
              height: 16,
              borderRadius: "50%",
              display: "inline-block",
              marginRight: 8,
              border: "2.5px solid #fff",
              boxShadow: "0 1px 2px 0 rgba(66,86,105,0.08)",
            }}
          />
          <span>{status}</span>
          <span
            style={{
              color: "#445477",
              background: "#e2e6f7",
              borderRadius: 8,
              fontSize: 14.5,
              fontWeight: 700,
              padding: "1.5px 11px",
              marginLeft: 11,
              minWidth: 22,
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatusSummaryCard() {
  return (
    <section
      style={{
        margin: "0 auto 22px auto",
        color: "#42517c",
        fontSize: 15.5,
        background: "#f8fafd",
        border: "1px solid #e6e9ef",
        borderRadius: 10,
        padding: "19px 26px 11px 26px",
        fontWeight: 500,
        animation: "fade-in-pop 1.13s cubic-bezier(.41,1.3,.64,1) both",
        maxWidth: 710,
        boxShadow: "0 4px 12px 0 rgba(136,152,220,0.06)",
        marginTop: 0,
      }}
      aria-label="Membership statistics summary"
    >
      <h3 style={{
        fontWeight: 800,
        color: "#2b343f",
        letterSpacing: 0.04,
        margin: 0,
        fontSize: 17.5,
        marginBottom: 5,
        display: "flex",
        alignItems: "center",
        gap: 6
      }}>
        <span role="img" aria-label="Pie chart" style={{ fontSize: 17, color: "#99b" }}>📊</span>
        Membership Statistics
      </h3>
      <div style={{ marginBottom: 5, fontSize: 14.7 }}>
        {Object.entries(statusCounts).map(([status, count], idx, arr) => {
          const percent = ((count / statsData.total) * 100).toFixed(1);
          return (
            <span key={status}>
              <span
                style={{
                  color: STATUS_INFO[status]?.color || "#333",
                  fontWeight: 700,
                  margin: "0 6px 0 2px",
                }}
              >
                {count}
              </span>
              {status}
              <span
                style={{
                  fontSize: 12,
                  opacity: 0.6,
                  margin: "0 2px 0 2px",
                }}
              >
                ({percent}%)
              </span>
              {idx !== arr.length - 1 && <span>&mdash;</span>}
            </span>
          );
        })}
        .
      </div>
      <div style={{ fontSize: 13.6, marginTop: 2, color: "#616d93", display: "flex", gap: 9, flexWrap: "wrap" }}>
        <div>
          <span
            style={{
              fontWeight: 600,
              color: "#5765af",
              marginRight: 6,
            }}
          >
            Earliest expiry:
          </span>
          {statsData.earliestExpiry
            ? <b>{statsData.earliestExpiry.name}</b> + ` (${statsData.earliestExpiry.expirationDate})`
            : "N/A"}
        </div>
        <span style={{ color: "#b9bedb" }}>|</span>
        <div>
          <span
            style={{
              fontWeight: 600,
              color: "#5765af",
              marginRight: 6,
            }}
          >
            Latest expiry:
          </span>
          {statsData.latestExpiry
            ? <b>{statsData.latestExpiry.name}</b> + ` (${statsData.latestExpiry.expirationDate})`
            : "N/A"}
        </div>
      </div>
      <details style={{
        fontSize: 12.2,
        marginTop: 13,
        color: "#9099b2",
        background: "#f6f9fe",
        border: "1px solid #e3e9f6",
        borderRadius: 7,
        padding: "7px 11px",
        marginBottom: 6
      }}>
        <summary style={{
          fontWeight: 700,
          color: "#5c6fab",
          cursor: "pointer",
          outline: "none",
          fontSize: 12.8,
          marginBottom: 5
        }}>
          Status types explained
        </summary>
        <ul style={{ margin: '7px 0 2px 0', paddingLeft: 15 }}>
          {Object.entries(STATUS_INFO).map(([stat, meta]) => (
            <li key={stat}
              style={{
                marginBottom: 6,
                color: "#495084"
              }}>
              <span
                style={{
                  color: meta.color,
                  fontWeight: 600,
                  marginRight: 4,
                }}
              >
                {stat}:
              </span>
              <span>{meta.description}</span>
            </li>
          ))}
        </ul>
      </details>
      <div style={{ marginTop: 7 }}>
        <span>
          <strong>Total members: {statsData.total}</strong>
        </span>
      </div>
    </section>
  );
}

function MembersTable() {
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1.4px solid #e6e9ef",
        overflow: "hidden",
        animation: "fade-in-pop 0.64s cubic-bezier(.41,1.3,.64,1) both",
        boxShadow: "0 1.7px 6px 0 rgba(86,117,180,0.07)",
        marginBottom: 30,
        background: "#f5f8fe"
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 15.1,
          minWidth: 740,
          background: "#fff",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f2f6fb",
              color: "#295d9c",
              fontWeight: 900,
              letterSpacing: 0.04,
              textTransform: "uppercase",
              fontSize: 13.8,
              animation: "fade-in-pop 0.67s cubic-bezier(.41,1.3,.64,1) both",
              height: 36,
            }}
          >
            <th style={{ padding: "11px 13px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "11px 13px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "11px 13px", textAlign: "left" }}>Membership</th>
            <th style={{ padding: "11px 13px", textAlign: "left" }}>Expiry</th>
            <th style={{ padding: "11px 13px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "11px 13px", textAlign: "left" }}>Joined</th>
            <th style={{ padding: "11px 13px", textAlign: "left" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr
              key={m.memberId}
              style={{
                background: i % 2 === 0 ? "#fafdff" : "#f6f8fb",
                borderBottom: "1px solid #eaeef6",
                animation: `fade-in-pop 0.${78 + i * 5}s cubic-bezier(.41,1.3,.64,1) both`,
              }}
            >
              <td
                style={{
                  fontWeight: 700,
                  padding: "11px 13px",
                  color: "#7986ac",
                  letterSpacing: 0.04,
                  fontSize: 14.1,
                }}
              >
                {m.memberId}
              </td>
              <td
                style={{
                  fontWeight: 600,
                  padding: "11px 13px",
                  color: "#242842",
                  fontSize: 15.1,
                }}
              >
                {m.name}
              </td>
              <td
                style={{
                  padding: "11px 13px",
                  color: "#245ca8",
                  fontWeight: 700,
                  fontSize: 14.1,
                }}
              >
                {m.membershipLevel}
              </td>
              <td
                style={{
                  padding: "11px 13px",
                  color: "#285c4a",
                  fontWeight: 600,
                  fontSize: 13.5,
                }}
              >
                {m.expirationDate}
              </td>
              <td
                style={{
                  padding: "11px 13px",
                  color: "#246e96",
                  fontWeight: 400,
                  fontSize: 13.4,
                  fontFamily: "monospace",
                  letterSpacing: 0.05,
                }}
              >
                {m.email}
              </td>
              <td
                style={{
                  padding: "11px 13px",
                  color: "#a87c43",
                  fontWeight: 400,
                  fontSize: 13.1,
                }}
              >
                {m.joinedDate}
              </td>
              <td style={{ padding: "11px 13px" }}>
                <StatusTag status={m.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const MemberStatus: React.FC = () => {
  return (
    <>
      <style>{microAnimations}</style>
      <div
        style={{
          maxWidth: 900,
          margin: "50px auto",
          background: "#fff",
          borderRadius: 18,
          padding: "36px 38px 26px 38px",
          border: "1.8px solid #e6e9ef",
          animation: "fade-in-pop 0.48s cubic-bezier(.41,1.3,.64,1) both",
          boxShadow: "0 7px 28px 0 rgba(80,111,179,0.13)",
        }}
      >
        <SectionTitle
          icon={<span role="img" aria-label="members">👥</span>}
          title="Organization Member Status Overview"
          subtitle="Explore the status and details of the entire membership roster. Easily see totals by status, drill into member details, and view contextual explanations—hover or tap any status chip to view its meaning."
        />

        <StatusOverviewBar />
        <StatusSummaryCard />
        <MembersTable />
      </div>
    </>
  );
};

export default MemberStatus;
