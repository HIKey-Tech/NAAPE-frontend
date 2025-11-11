import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type NaapButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
};

export const NaapButton = React.forwardRef<HTMLButtonElement, NaapButtonProps>(
  (
    {
      className,
      children,
      icon,
      iconPosition = "left",
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => (
    <Button
      ref={ref}
      // Ensure buttons are NOT rounded
      className={cn("gap-2 rounded-none", className)}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="flex items-center">{icon}</span>
      )}
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin h-4 w-4 mr-2 text-current"
            viewBox="0 0 24 24"
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
          Loading...
        </span>
      ) : (
        children
      )}
      {icon && iconPosition === "right" && (
        <span className="flex items-center">{icon}</span>
      )}
    </Button>
  )
);

NaapButton.displayName = "NaapButton";
