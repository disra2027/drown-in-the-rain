"use client";

import { ReactNode } from "react";

// Modal Section with animated icon and description
interface ModalSectionProps {
  icon: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function ModalSection({ icon, title, description, children, className = "" }: ModalSectionProps) {
  return (
    <div className={`text-center mb-6 ${className}`}>
      <div className="text-6xl mb-2 animate-bounce">{icon}</div>
      {title && <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>}
      {description && (
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
      )}
      {children}
    </div>
  );
}

// Status display card
interface StatusCardProps {
  children: ReactNode;
  className?: string;
}

export function StatusCard({ children, className = "" }: StatusCardProps) {
  return (
    <div className={`bg-muted/30 rounded-lg p-4 mb-6 text-center ${className}`}>
      {children}
    </div>
  );
}

// Progress bar component
interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  colorClass?: string;
}

export function ProgressBar({ value, max, className = "", colorClass = "bg-gold" }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`w-full bg-background rounded-full h-2 mt-3 ${className}`}>
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
        style={{ 
          width: `${percentage}%`,
          minWidth: value > 0 ? '8px' : '0px'
        }}
      />
    </div>
  );
}

// Counter control with +/- buttons
interface CounterControlProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel?: string;
  increaseLabel?: string;
  displayValue?: string;
  className?: string;
}

export function CounterControl({
  value,
  onDecrease,
  onIncrease,
  decreaseLabel = "-",
  increaseLabel = "+",
  displayValue,
  className = ""
}: CounterControlProps) {
  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      <button
        onClick={onDecrease}
        className="w-12 h-12 rounded-full bg-muted hover:bg-gold hover:text-background transition-all duration-200 flex items-center justify-center hover:scale-110 focus-ring-luxury"
      >
        {decreaseLabel.includes("svg") ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        ) : (
          <span className="font-bold">{decreaseLabel}</span>
        )}
      </button>
      
      <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 min-w-[120px] text-center">
        <span className="text-xl font-bold text-gold">
          {displayValue || value.toLocaleString()}
        </span>
      </div>
      
      <button
        onClick={onIncrease}
        className="w-12 h-12 rounded-full bg-muted hover:bg-gold hover:text-background transition-all duration-200 flex items-center justify-center hover:scale-110 focus-ring-luxury"
      >
        {increaseLabel.includes("svg") ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <span className="font-bold">{increaseLabel}</span>
        )}
      </button>
    </div>
  );
}

// Preset buttons grid
interface PresetButtonsProps<T = string | number> {
  presets: Array<{
    label: string;
    value: T;
    subtitle?: string;
  }>;
  currentValue: T;
  onSelect: (value: T) => void;
  className?: string;
  columns?: number;
}

export function PresetButtons<T = string | number>({
  presets,
  currentValue,
  onSelect,
  className = "",
  columns = 2
}: PresetButtonsProps<T>) {
  const gridClass = columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : "grid-cols-4";
  
  return (
    <div className={`mt-6 ${className}`}>
      <p className="text-sm font-medium text-foreground mb-3">Quick presets:</p>
      <div className={`grid ${gridClass} gap-2`}>
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onSelect(preset.value)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
              JSON.stringify(currentValue) === JSON.stringify(preset.value)
                ? 'bg-gold text-background shadow-lg'
                : 'bg-muted hover:bg-gold/20 text-foreground'
            }`}
          >
            {preset.label}
            {preset.subtitle && (
              <div className="text-xs opacity-75">{preset.subtitle}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Modal action buttons
interface ModalActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  className?: string;
  hideCancel?: boolean;
}

export function ModalActions({
  onCancel,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Save",
  className = "",
  hideCancel = false
}: ModalActionsProps) {
  return (
    <div className={`flex space-x-3 ${className}`}>
      {!hideCancel && (
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors focus-ring-luxury"
        >
          {cancelLabel}
        </button>
      )}
      <button
        onClick={onConfirm}
        className="flex-1 py-3 px-4 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors focus-ring-luxury"
      >
        {confirmLabel}
      </button>
    </div>
  );
}