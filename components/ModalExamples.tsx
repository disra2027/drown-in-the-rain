// Example usage of the reusable Modal components
// This file shows how to create different types of modals quickly

import { useState } from "react";
import Modal from "./Modal";
import { ModalSection, StatusCard, ProgressBar, CounterControl, PresetButtons, ModalActions } from "./ModalComponents";

// Example 1: Simple confirmation modal
export function SimpleConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Confirm Action"
      icon="⚠️"
      size="sm"
      footer={
        <ModalActions
          onCancel={() => setIsOpen(false)}
          onConfirm={() => {
            // Handle confirm action
            setIsOpen(false);
          }}
          cancelLabel="Cancel"
          confirmLabel="Confirm"
        />
      }
    >
      <ModalSection
        icon="⚠️"
        description="Are you sure you want to perform this action? This cannot be undone."
      />
    </Modal>
  );
}

// Example 2: Settings modal with presets
export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState(16);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Settings"
      icon="⚙️"
      size="md"
      footer={
        <ModalActions
          onCancel={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
          confirmLabel="Save Settings"
        />
      }
    >
      <ModalSection
        icon="⚙️"
        description="Customize your app experience"
      />

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">
            Font Size
          </label>
          <CounterControl
            value={fontSize}
            onDecrease={() => setFontSize(Math.max(12, fontSize - 1))}
            onIncrease={() => setFontSize(Math.min(24, fontSize + 1))}
            displayValue={`${fontSize}px`}
            decreaseLabel="svg"
            increaseLabel="svg"
          />
        </div>

        <PresetButtons
          presets={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "Auto", value: "auto" }
          ]}
          currentValue={theme}
          onSelect={setTheme}
          columns={3}
        />
      </div>
    </Modal>
  );
}

// Example 3: Progress modal
export function ProgressModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(65);
  const maxProgress = 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Task Progress"
      icon="📊"
      size="sm"
      footer={
        <ModalActions
          onCancel={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
          cancelLabel="Close"
          confirmLabel="Continue"
        />
      }
    >
      <ModalSection
        icon="📊"
        description="Track your current task progress"
      />

      <StatusCard>
        <p className="text-2xl font-bold text-foreground mb-2">
          {progress}% Complete
        </p>
        <ProgressBar 
          value={progress} 
          max={maxProgress}
          colorClass="bg-gold"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Keep going! You&apos;re doing great.
        </p>
      </StatusCard>

      <div className="text-center">
        <button
          onClick={() => setProgress(Math.min(100, progress + 10))}
          className="px-4 py-2 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors"
        >
          Add 10% Progress
        </button>
      </div>
    </Modal>
  );
}

// Example 4: Information modal (no footer)
export function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="App Information"
      icon="ℹ️"
      size="md"
    >
      <ModalSection
        icon="ℹ️"
        description="Learn more about this application"
      />

      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          This is a life quality tracking application built with Next.js 15 and Tailwind CSS.
        </p>
        <p>
          Features include water intake tracking, sleep schedule management, 
          step counting, and music playlist controls.
        </p>
        <p>
          The app uses a luxury dark theme with gold accents for a premium experience.
        </p>
      </div>
    </Modal>
  );
}

// Example 5: Custom styled modal
export function CustomModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Custom Styled Modal"
      icon="🎨"
      size="lg"
      className="border-2 border-gold-light"
      footer={
        <div className="flex justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-gradient-to-r from-gold to-gold-light text-background rounded-lg font-medium hover:scale-105 transition-all"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="text-center space-y-4">
        <div className="text-6xl">🎨</div>
        <h4 className="text-xl font-bold text-gold">Custom Styling Example</h4>
        <p className="text-muted-foreground">
          This modal shows how you can customize the appearance using the className prop
          and create custom footer layouts.
        </p>
        <div className="bg-gradient-to-r from-gold/10 to-gold-light/10 rounded-lg p-4">
          <p className="text-gold font-medium">
            The modal system is highly flexible and customizable!
          </p>
        </div>
      </div>
    </Modal>
  );
}