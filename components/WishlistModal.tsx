"use client";

import { ReactNode } from "react";

interface WishlistModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function WishlistModal({
  isOpen = true,
  onClose,
  title,
  icon,
  size = "md",
  children,
  footer,
  className = ""
}: WishlistModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-xs",
    md: "max-w-sm", 
    lg: "max-w-md"
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-0 duration-300">
      <div 
        className={`bg-gradient-to-br from-card via-card to-gold/5 rounded-3xl w-full ${sizeClasses[size]} max-h-[90vh] shadow-2xl border-2 border-gold/30 wishlist-entrance my-auto flex flex-col backdrop-blur-sm ${className}`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Fixed Header */}
        {(title || icon) && (
          <div className="flex items-center justify-between p-4 border-b border-gold/20 flex-shrink-0 rounded-t-3xl wishlist-header-gradient">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              {icon && <span className="text-xl wishlist-sparkle wishlist-float">{icon}</span>}
              <span className="bg-gradient-to-r from-gold to-gold/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-gold transition-all duration-300 hover:scale-110 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:ring-offset-2 focus:ring-offset-card rounded-full"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-3">
            {children}
          </div>
        </div>

        {/* Fixed Footer */}
        {footer && (
          <div className="border-t border-gold/20 p-4 flex-shrink-0 rounded-b-3xl bg-gradient-to-r from-transparent to-gold/5">
            {footer}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-gold/30 rounded-full wishlist-sparkle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-gold/20 rounded-full wishlist-sparkle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-6 left-4 w-1 h-1 bg-gold/40 rounded-full wishlist-sparkle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-4 right-8 w-1.5 h-1.5 bg-gold/25 rounded-full wishlist-sparkle" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
}