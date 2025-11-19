import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface LegacyStatCardProps {
    icon?: React.ReactNode;
    value: string;
    label: React.ReactNode;
    className?: string;
}

export function LegacyStatCard({
    icon,
    value,
    label,
    className = "",
}: LegacyStatCardProps) {
    return (
        <Card className={`w-full bg-white max-w-full h-auto border-[#D3D7DF] shadow-none ${className}`}>
            <CardContent className="px-8 flex items-center gap-7">
                <div className="w-12 h-12 flex rounded items-center p-2 justify-center bg-[#F0F2F6]">
                    {icon ? (
                        icon
                    ) : (
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            stroke="#A5A7B0"
                            fill="none"
                            strokeWidth="1.5"
                        >
                            <circle cx="12" cy="12" r="10" stroke="#A5A7B0" strokeWidth="1.5" />
                            <circle cx="12" cy="10.5" r="2" fill="#A5A7B0" />
                            <rect x="9.5" y="14" width="5" height="1.2" rx=".6" fill="#A5A7B0" />
                        </svg>
                    )}
                </div>
                <div className="flex justify-start text-start flex-col">
                    <div className="text-[2rem] leading-9 font-bold text-[#232835] mb-0">
                        {value}
                    </div>
                    <div className="text-[#4B4B55] text-base font-medium">{label}</div>
                </div>
            </CardContent>
        </Card>
    );
}
