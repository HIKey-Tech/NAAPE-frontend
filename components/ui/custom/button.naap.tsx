import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type NaapButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    loading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
    variant?: "default" | "primary" | "ghost";
    tooltip?: string;
};

export const NaapButton = React.forwardRef<HTMLButtonElement, NaapButtonProps>(
    (
        {
            className,
            children,
            icon,
            iconPosition = "left",
            loading = false,
            loadingText = "Loading...",
            disabled,
            fullWidth = false,
            variant = "default",
            tooltip,
            ...props
        },
        ref
    ) => {
        const iconEl =
            icon && (
                <span className="flex items-center" aria-hidden={loading}>
                    {icon}
                </span>
            );

        const buttonContent = (
            <>
                {icon && iconPosition === "left" && iconEl}
                {loading ? (
                    <span className="flex items-center">
                        <svg
                            className="animate-spin h-4 w-4 mr-2 text-current"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                        <span className="sr-only">{loadingText}</span>
                        <span>{loadingText}</span>
                    </span>
                ) : (
                    children
                )}
                {icon && iconPosition === "right" && iconEl}
            </>
        );

        const extraClasses = [
            "gap-2",
            "rounded", "h-full", // ensure buttons are  rounded at all
            fullWidth ? "w-full" : "",
            variant === "primary"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : variant === "ghost"
                    ? "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100"
                    : "", // default stays unstyled
        ].join(" ");

        return (
            <Button
                ref={ref}
                className={cn(extraClasses, className)}
                disabled={disabled || loading}
                aria-disabled={disabled || loading}
                aria-busy={loading}
                aria-label={typeof children === "string" ? children : undefined}
                tabIndex={0}
                data-testid="naap-button"
                {...(tooltip && { title: tooltip })}
                {...props}
            >
                {buttonContent}
            </Button>
        );
    }
);

NaapButton.displayName = "NaapButton";
