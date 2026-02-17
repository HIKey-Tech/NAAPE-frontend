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
            className={`w-full bg-card max-w-full h-auto border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl ${className}`}
        >
            <CardContent className="px-7 py-8 flex items-center gap-5">
                {/* Icon Section */}
                <div className="flex flex-col items-center justify-center shrink-0">
                    <div
                        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20"
                    >
                        {icon ? (
                            React.cloneElement(icon as React.ReactElement<any>, {
                                className: "w-8 h-8 text-primary"
                            })
                        ) : (
                            <div className="w-8 h-8 bg-muted rounded-full" />
                        )}
                    </div>
                </div>
                {/* Text Section */}
                <div className="flex flex-col flex-1 min-w-0 justify-center text-start space-y-1">
                    <div className="flex items-baseline gap-x-2 flex-wrap">
                        <span className="text-4xl font-extrabold text-foreground tracking-tight leading-none">
                            {countedValue}
                        </span>
                    </div>
                    <span
                        className="block text-sm font-semibold text-muted-foreground uppercase tracking-wide opacity-80"
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