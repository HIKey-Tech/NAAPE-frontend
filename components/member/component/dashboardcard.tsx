import React, { useRef } from "react";

/**
 * 🎉 Engaging Dashboard Card Component 🎉
 * Bursting with energy, animations, and extra feedback.
 * Now with micro animations!
 */
const CARD_BG = "bg-white";
const CARD_BORDER = "border-[#E5EAF2]";
const CARD_RADIUS = "rounded-2xl";
const TEXT_PRIMARY = "text-[#1A253C]";
const TEXT_SECONDARY = "text-[#486190]";
const ICON_BG = "bg-gradient-to-tr from-[#EFF3FE] to-[#F5F8FF]";
const TRANSITIONS = "transition-all duration-200";

const SPARKLE = (
  <svg
    className="absolute top-1 right-1 w-5 h-5 text-[#DFE7F7] opacity-80 pointer-events-none z-10 sparkle"
    fill="none"
    viewBox="0 0 24 24"
    style={{ filter: "blur(.5px)" }}
  >
    <path d="M12 2l2.5 7.5h7.9l-6.4 4.7 2.5 7.5L12 17l-6.4 4.7 2.5-7.5-6.4-4.7h7.9z"
      fill="currentColor" />
  </svg>
);

type DashboardCardProps = {
  icon: React.ReactNode;
  value: number | string | null | undefined;
  label: string | null | undefined;
  className?: string;
};

function getDisplayValue(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    if (isNaN(value)) return "—";
    return value.toLocaleString("en-US");
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : "—";
  }
  return "—";
}

function getDisplayLabel(label: string | null | undefined): string {
  if (!label) return "";
  const str = String(label).trim();
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const fallbackIcon = (
  <span
    className="block text-[#C7D0DF] select-none"
    aria-label="No icon"
    title="No icon"
    style={{
      fontSize: "2.18rem",
      lineHeight: 1.13,
      userSelect: "none",
      filter: "grayscale(.7)",
      opacity: 0.7,
    }}
  >
    <svg width="34" height="34" fill="none" viewBox="0 0 34 34">
      <rect width="34" height="34" rx="17" fill="#E8EAF0" />
      <path d="M9 25l16-16M25 25L9 9" stroke="#B9C5D8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </span>
);

// Micro animations: keyframes for sparkle, shadow pulse and value pop
const microAnimations = `
@keyframes sparkle {
  10% { opacity: 1;}
  50% { transform: scale(1.14) rotate(18deg);}
  80% { opacity: 0; transform: scale(.92) rotate(-6deg);}
}
.group-hover\\:animate-sparkle:hover .sparkle { animation: sparkle .85s ease-in; opacity: 1;}

@keyframes dashboard-shadow-pop {
  0% { box-shadow: 0 2px 8px 0 rgba(66,103,231,0.04), 0 1.5px 0 0 #f3f6ff; }
  50% { box-shadow: 0 6px 36px 0 rgba(96,160,255,0.16), 0 1.5px 0 0 #dde8fd;}
  100% { box-shadow: 0 2px 8px 0 rgba(66,103,231,0.04), 0 1.5px 0 0 #f3f6ff;}
}
.group-hover\\:animate-shadow-pop:hover {
  animation: dashboard-shadow-pop 0.38s cubic-bezier(.38,.6,.38,1.1);
}

@keyframes dashboard-value-pop {
  0%   { transform: scale(1); }
  38%  { transform: scale(1.13,0.94);}
  74%  { transform: scale(0.98,1.09);}
  100% { transform: scale(1); }
}
.group-hover\\:animate-value-pop:hover .dashboard-value {
  animation: dashboard-value-pop 0.41s cubic-bezier(.21,1.05,.39,.99);
}

@keyframes dashboard-label-slide {
  0% { opacity: 0; transform: translateY(12px);}
  55% { opacity: 1; transform: translateY(-2.5px);}
  100% { opacity: 1; transform: translateY(0);}
}
.group-hover\\:animate-label-slide:hover .dashboard-label {
  animation: dashboard-label-slide 0.52s cubic-bezier(.23,1.05,.32,.97);
}
`;

if (typeof window !== "undefined") {
  if (!document.getElementById("dashboardcard-animations")) {
    const style = document.createElement("style");
    style.id = "dashboardcard-animations";
    style.innerHTML = microAnimations;
    document.head.appendChild(style);
  }
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  value,
  label,
  className = "",
}) => {
  let showIcon: React.ReactNode;
  if (React.isValidElement(icon)) {
    showIcon = React.cloneElement(
      icon as React.ReactElement<any>,
      {
        ...((icon as React.ReactElement<any>).props || {}),
        className: [
          (icon as React.ReactElement<any>).props?.className ?? "",
          "text-[2.2rem] sm:text-[2.45rem]",
          "drop-shadow-[0_2px_2px_rgba(140,171,241,0.11)]",
          "text-[#4074e6]",
        ]
          .filter(Boolean)
          .join(" "),
        "aria-hidden": true,
      }
    );
  } else if (typeof icon === "string" && icon.trim() !== "") {
    showIcon = (
      <span
        dangerouslySetInnerHTML={{ __html: icon }}
        aria-hidden="true"
      />
    );
  } else {
    showIcon = fallbackIcon;
  }

  const sparkle = (
    <span className="absolute top-0 right-0 sm:top-1 sm:right-1 pointer-events-none select-none">
      {SPARKLE}
    </span>
  );

  const displayValue = getDisplayValue(value);
  const isHappy = typeof value === "number" && value > 0;
  const highlightClass = isHappy
    ? "text-[#3bb872] glow-effect"
    : displayValue === "—"
    ? "text-[#b0bacc] italic"
    : TEXT_PRIMARY;

  // Add extra animation classes: shadow pop for card, value pop for value, and label slide in
  return (
    <div
      className={`
        group group-hover:animate-shadow-pop relative ${CARD_RADIUS} border ${CARD_BORDER} ${CARD_BG} w-full min-w-[210px]
        px-6 py-7 sm:px-8 flex flex-col ${TRANSITIONS}
        scale-100 hover:scale-[1.018] active:scale-[0.98] focus:ring-2 focus:ring-[#c7e7fa]
        cursor-pointer
        ${className}
      `}
      tabIndex={0}
      role="region"
      aria-label={getDisplayLabel(label) || "Statistic card"}
      style={{
        minHeight: 118,
        justifyContent: "center",
      }}
    >
      <div className="flex items-center gap-5">
        <div
          className={`
            relative flex-shrink-0 w-[3.4rem] h-[3.4rem]
            sm:w-[3.7rem] sm:h-[3.7rem]
            ${ICON_BG} rounded-full flex items-center justify-center 
            border border-[#e7eaf3] transition-transform duration-200 group-hover:scale-[1.045]
          `}
          aria-hidden={showIcon === fallbackIcon}
        >
          {showIcon}
          {sparkle}
        </div>
        <div className="flex flex-col flex-1 justify-center min-w-0">
          <span
            className={`
              dashboard-value text-[2.09rem] sm:text-[2.27rem] leading-tight font-extrabold
              ${highlightClass} truncate transition-colors duration-150
              group-hover:tracking-wide group-hover:animate-value-pop
            `}
            title={displayValue}
            style={{
              letterSpacing: "-0.008em",
              marginBottom: "2.5px",
              filter: isHappy ? "drop-shadow(0 0 4.5px #bcf3c2aa)" : undefined,
              transition: "filter .22s, color .21s",
            }}
          >
            {displayValue}
            {isHappy && (
              <span
                className="ml-1 text-[1.4rem] animate-pulse"
                title="Great job!"
                role="img"
                aria-label="Celebration"
              >🎉</span>
            )}
          </span>
          <span
            className={`
              dashboard-label text-[15.5px] sm:text-[16.5px] font-semibold ${TEXT_SECONDARY} mt-[0.35rem]
              tracking-tight break-words transition-colors duration-200
              group-hover:text-[#286be6] group-hover:animate-label-slide
            `}
            style={{
              lineHeight: 1.27,
              letterSpacing: "-0.007em",
            }}
            title={getDisplayLabel(label)}
          >
            {
              getDisplayLabel(label)
                ? getDisplayLabel(label)
                : <span className="text-[#c9d5e6] italic opacity-90">Awaiting label…</span>
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
