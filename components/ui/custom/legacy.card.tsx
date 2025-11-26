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
                // Format the value as string, e.g. 1,200 or 39.5, etc
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
                        {countedValue}
                    </div>
                    <div className="text-[#4B4B55] text-base font-medium">{label}</div>
                </div>
            </CardContent>
        </Card>
    );
}
