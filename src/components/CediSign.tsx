import React from 'react';
import { LucideProps } from 'lucide-react';

export function CediSign({ size = 24, strokeWidth = 2, className, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 17a6 6 0 1 1 0-10" />
      <path d="M12 3v18" />
    </svg>
  );
}
