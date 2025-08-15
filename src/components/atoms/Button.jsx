import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
const variants = {
    primary: "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white hover:from-red-600 hover:via-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30",
    secondary: "bg-white text-red-600 border-2 border-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 focus:ring-red-500 shadow-md hover:shadow-lg",
    outline: "bg-transparent text-gray-700 border-2 border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-100 focus:ring-gray-500 shadow-sm hover:shadow-md",
    ghost: "bg-transparent text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 focus:ring-gray-500"
  };

const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button
      className={cn(
"inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-0.5",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;