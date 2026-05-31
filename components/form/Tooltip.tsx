"use client";

import { useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip({
  text,
  children,
  className = "",
}: TooltipProps) {
  const [showTooltip, setShowTooltip] =
    useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() =>
        setShowTooltip(true)
      }
      onMouseLeave={() =>
        setShowTooltip(false)
      }
    >
      {children}

      <div
        className={`absolute top-[-52px] left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap shadow-xl border transition-all duration-200
        ${
          showTooltip
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }
        bg-white text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700`}
      >
        {text}

        <div
          className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 rotate-45 w-[10px] h-[10px]
          bg-white border-r border-b border-gray-200
          dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
    </div>
  );
}