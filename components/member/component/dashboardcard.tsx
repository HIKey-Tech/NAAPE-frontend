import React from "react";

type DashboardCardProps = {
    icon: React.ReactNode;
    value: number | string;
    label: string;
    className?: string;
};

// Optionally provides gentle shadow effect if not "shadow-none"
const DashboardCard: React.FC<DashboardCardProps> = ({
    icon,
    value,
    label,
    className = "",
}) => {
    return (
        <div
            className={`rounded-2xl border border-[#E5EAF2] bg-white shadow-md p-6 w-full min-w-[210px] flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-lg duration-200 ${className}`}
            style={{ boxShadow: "0 2px 8px rgba(48, 71, 107, 0.09)" }}
        >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EFF3FE] to-[#F5F8FF] flex items-center justify-center mb-2 shadow">
                {icon}
            </div>
            <div>
                <div className="text-[32px] leading-8 font-bold text-[#1A253C]">
                    {typeof value === "number"
                        ? value.toLocaleString("en-US")
                        : value}
                </div>
                <div className="text-[15px] font-medium text-[#748095] mt-1 tracking-tight capitalize">
                    {label}
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;
