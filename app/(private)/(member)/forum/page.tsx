import React from "react";
import Link from "next/link";
import { NaapButton } from "@/components/ui/custom/button.naap";

export default function ForumComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-6 py-12 bg-white">
      <div className="max-w-lg w-full flex flex-col items-center text-center">
        <div className="mb-6">
          <svg width="78" height="78" viewBox="0 0 78 78" fill="none">
            <circle cx="39" cy="39" r="39" fill="#EDF5FB" />
            <path
              d="M24 55c0-2.21 1.79-4 4-4h22a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2v-2Z"
              fill="#B2D7EF"
            />
            <rect x="22" y="20" width="34" height="29" rx="6" fill="#97B9D6" />
            <rect
              x="23.6"
              y="21.6"
              width="30.8"
              height="25.8"
              rx="4.4"
              stroke="#357AA8"
              strokeWidth="1.2"
              fill="none"
            />
            <rect x="30" y="33" width="18" height="3.5" rx="1.5" fill="#EDF5FB" />
            <rect x="30" y="39" width="13" height="2.2" rx="1.1" fill="#EDF5FB" />
            <ellipse cx="32" cy="27.5" rx="2" ry="2" fill="#357AA8" />
            <ellipse cx="39" cy="27.5" rx="2" ry="2" fill="#357AA8" />
            <ellipse cx="46" cy="27.5" rx="2" ry="2" fill="#357AA8" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#16355D] mb-3">Forum Coming Soon!</h1>
        <p className="text-[#6B7B91] mb-6">
          This feature is under active development and will be launching soon. Meanwhile, continue exploring other resources or check out our{" "}
          <Link href="/dashboard" className="text-[#357AA8] underline">
            main dashboard
          </Link>
          .
        </p>
        <NaapButton  variant="primary">
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </NaapButton>
      </div>
    </div>
  );
}
