"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen = true,
  onClose,
  title,
  icon,
  size = "sm",
  children,
  footer,
  className = ""
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg"
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-card rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] shadow-2xl border border-gold bounce-in my-auto flex flex-col ${className}`}>
        {/* Fixed Header */}
        {(title || icon) && (
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0 rounded-t-2xl">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {icon && <span className="text-xl">{icon}</span>}
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-gold transition-colors hover:scale-110 focus-ring-luxury"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {children}
        </div>

        {/* Fixed Footer */}
        {footer && (
          <div className="border-t border-border p-6 flex-shrink-0 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}