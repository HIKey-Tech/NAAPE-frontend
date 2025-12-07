"use client"

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface LegacyStatCardProps {
    icon?: React.ReactNode;
    value: string;
    label: React.ReactNode;
    className?: string;
}

// Utility to extract a leading number and any suffix (like 'K+', '+', '%', etc).
function parseNumberAndSuffix(str: string): { number: number; suffix: string } {
    const match = str.match(/^([\d,.]+)(.*)$/);
    if (!match) return { number: 0, suffix: str };
    const numPart = match[1].replace(/,/g, '');
    const number = parseFloat(numPart);
    const suffix = match[2] ?? "";
    return { number, suffix };
}

// Custom hook for counting effect
function useCountUp(targetValue: string, duration = 1300) {
    const { number: target, suffix } = parseNumberAndSuffix(targetValue);
    const [display, setDisplay] = useState(targetValue);
    const rafRef = useRef<number>(0);
    const startTime = useRef<number>(0);

    useEffect(() => {
        let isPercent = suffix.trim() === "%";
        let decimals = (target % 1 !== 0 || isPercent) ? 1 : 0;

        function animate(ts: number) {
            if (!startTime.current) startTime.current = ts;
            const progress = Math.min((ts - startTime.current) / duration, 1);
            const valueNow = Math.round(target * progress * (decimals ? 10 : 1)) / (decimals ? 10 : 1);

            if (progress < 1) {
                let formatted = valueNow.toLocaleString(undefined, {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });
                setDisplay(formatted + suffix);
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setDisplay(targetValue);
            }
        }

        setDisplay(
            (0).toLocaleString(undefined, {
                minimumFractionDigits: (target % 1 !== 0 || suffix.trim() === "%") ? 1 : 0,
                maximumFractionDigits: (target % 1 !== 0 || suffix.trim() === "%") ? 1 : 0,
            }) +
            suffix
        );
        startTime.current = 0;
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // Only animate when value changes
        // eslint-disable-next-line
    }, [targetValue]);

    return display;
}

export function LegacyStatCard({
    icon,
    value,
    label,
    className = "",
}: LegacyStatCardProps) {
    const countedValue = useCountUp(value);

    // Enhanced: Improved hierarchy, bolder value, prominent icon, and more visual separation/structure.
    return (
        <Card
            className={`w-full bg-white max-w-full h-auto border-[#D3D7DF] shadow-none ${className}`}
            style={{ borderRadius: "1.1rem", borderWidth: 1, borderStyle: "solid" }}
        >
            <CardContent className="px-7 py-6 flex items-center gap-6">
                {/* Icon Section */}
                <div className="flex flex-col items-center justify-center">
                    <div
                        className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ECF0FA] to-[#FCFBFF]"
                        style={{ boxShadow: "0 2px 9px 0 rgba(54,83,164,0.10)" }}
                    >
                        {icon ? (
                            React.cloneElement(icon as React.ReactElement, {
                            })
                        ) : (
                            <svg
                                width="34"
                                height="34"
                                viewBox="0 0 24 24"
                                stroke="#A5A7B0"
                                fill="none"
                                strokeWidth="1.5"
                                className="drop-shadow-sm"
                            >
                                <circle cx="12" cy="12" r="10" stroke="#A5A7B0" strokeWidth="1.5" />
                                <circle cx="12" cy="10.5" r="2" fill="#A5A7B0" />
                                <rect x="9.5" y="14" width="5" height="1.2" rx=".6" fill="#A5A7B0" />
                            </svg>
                        )}
                    </div>
                </div>
                {/* Text Section */}
                <div className="flex flex-col flex-1 min-w-0 justify-center text-start space-y-0.5">
                    <div className="flex items-baseline gap-x-2 flex-wrap max-w-[28rem]">
                        <span className="text-[2.4rem] leading-[2.7rem] font-extrabold text-[#192040] drop-shadow-sm tracking-tight">
                            {countedValue}
                        </span>
                    </div>
                    <span
                        className="block text-[1.10rem] leading-[1.45rem] font-semibold text-[#51609C] mt-1 tracking-normal max-w-[22rem] overflow-hidden text-ellipsis"
                        style={{
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            display: "-webkit-box",
                        } as React.CSSProperties}
                    >
                        {label}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}