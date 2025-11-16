import React from "react";

// Define theme variables for easy reuse and consistency
const COLORS = {
  background: "#fff",
  border: "#b9cdf1",
  borderHighlight: "#7591e6",
  iconBg: "#FFF5E0",
  iconRect: "#FFE7B2",
  iconRectStroke: "#FFD580",
  iconCircle: "#FFA602",
  iconDetail: "#FFCE73",
  text: "#585858",
  subText: "#757575",
};

const dropImageStyle: React.CSSProperties = {
  background: COLORS.background,
  border: `2px dashed ${COLORS.border}`,
  borderRadius: "14px",
  minHeight: "210px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  transition: "border 0.2s, box-shadow 0.2s",
  cursor: "pointer",
  boxShadow: "0 2px 6px 0 rgba(185, 205, 241, 0.07)",
};

const defaultIcon = (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <rect width="54" height="54" rx="12" fill={COLORS.iconBg} />
    <g filter="url(#icon_dropshadow)">
      <rect x="12" y="14" width="30" height="26" rx="4" fill={COLORS.iconRect} />
      <rect x="12.5" y="14.5" width="29" height="25" rx="3.5" stroke={COLORS.iconRectStroke} />
    </g>
    <circle cx="19.5" cy="21.5" r="2.5" fill={COLORS.iconCircle} />
    <path
      d="M14 36l6.881-8.13c1.572-1.855 4.409-1.855 5.981 0l8.607 10.163c1.384 1.634 4.08 1.015 4.08-1.037V18a4 4 0 00-4-4H16a4 4 0 00-4 4v20a2 2 0 003.246 1.617z"
      fill={COLORS.iconDetail}
      fillOpacity=".4"
    />
    <defs>
      <filter id="icon_dropshadow" x="10" y="12" width="34" height="30" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/>
      </filter>
    </defs>
  </svg>
);

const FILE_TYPES = [
  {
    label: "Image Upload",
    message: (
      <>
        <div><strong>Image:</strong> Minimum 800px width recommended</div>
        <div style={{ fontSize: "12px", color: COLORS.subText }}>Max 10MB each. JPEG/JPG/PNG supported.</div>
      </>
    ),
    icon: defaultIcon,
  },
  {
    label: "PDF Upload",
    message: (
      <>
        <div><strong>PDF:</strong> Max 10MB</div>
      </>
    ),
    icon: (
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
        <rect width="54" height="54" rx="12" fill="#EDF5FB" />
        <g filter="url(#icon_pdf_shadow)">
          <rect x="15" y="12" width="24" height="30" rx="4" fill="#E0EDFC"/>
          <rect x="15.5" y="12.5" width="23" height="29" rx="3.5" stroke="#97B9D6"/>
        </g>
        <rect x="19" y="18" width="16" height="2" rx="1" fill="#87B4DC" />
        <rect x="19" y="23" width="10" height="2" rx="1" fill="#A9CCE9" />
        <rect x="19" y="28" width="12" height="2" rx="1" fill="#A9CCE9" />
        <text x="21" y="40" fontSize="7" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#87B4DC">PDF</text>
        <defs>
          <filter id="icon_pdf_shadow" x="13" y="10" width="28" height="34" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/>
          </filter>
        </defs>
      </svg>
    ),
  }
];

type DropImageInfoProps = {
  icon?: React.ReactNode;
  message: React.ReactNode;
  label?: string;
};

const DropImageInfo: React.FC<DropImageInfoProps> = ({ icon = defaultIcon, message, label }) => {
  return (
    <div style={dropImageStyle}>
      <div style={{ marginBottom: 16 }}>{icon}</div>
      {label && (
        <div style={{
          fontWeight: 600,
          fontSize: "15px",
          color: COLORS.text,
          marginBottom: 6,
          textAlign: "center",
        }}>
          {label}
        </div>
      )}
      <div
        style={{
          fontSize: "13px",
          color: COLORS.subText,
          textAlign: "center",
          width: "92%",
          lineHeight: 1.6,
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default function DropImageDual() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "28px",
        width: "100%",
      }}
    >
      {FILE_TYPES.map((info, idx) => (
        <DropImageInfo
          key={info.label}
          icon={info.icon}
          label={info.label}
          message={info.message}
        />
      ))}
    </div>
  );
}
