import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200",
    red: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200",
    green: "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-200",
    blue: "bg-gradient-to-r from-blue-100 to-sky-200 text-blue-800 border border-blue-200",
    yellow: "bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border border-yellow-200",
    error: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
  };

  return (
    <span
className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;