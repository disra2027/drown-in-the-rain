# Reusable Modal Component System

This project includes a comprehensive modal system that makes it easy to create consistent, accessible, and beautiful modals throughout the application.

## Components Overview

### 1. `Modal` - Base Modal Component
The main modal wrapper that handles the overlay, positioning, scroll lock, and base structure.

```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  icon="🎯"
  size="md"
  footer={<ModalActions onCancel={handleCancel} onConfirm={handleConfirm} />}
>
  {/* Modal content */}
</Modal>
```

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal should close
- `title: string` - Modal title text
- `icon?: string` - Optional emoji icon for title
- `size?: "sm" | "md" | "lg"` - Modal width (default: "sm")
- `children: ReactNode` - Modal content
- `footer?: ReactNode` - Optional footer content
- `className?: string` - Additional CSS classes

### 2. `ModalSection` - Animated Icon Section
Creates the common animated icon + description section at the top of modals.

```tsx
<ModalSection
  icon="💧"
  title="Optional Title"
  description="Set your daily water intake goal"
/>
```

### 3. `StatusCard` - Status Display Card
A styled card for displaying current status, progress, or summary information.

```tsx
<StatusCard>
  <p className="text-2xl font-bold">8 / 10</p>
  <p className="text-sm text-muted-foreground">glasses today</p>
  <ProgressBar value={8} max={10} />
</StatusCard>
```

### 4. `ProgressBar` - Animated Progress Bar
Shows progress with smooth animations and customizable colors.

```tsx
<ProgressBar 
  value={currentValue} 
  max={goalValue}
  colorClass="bg-gold" // Optional custom color
/>
```

### 5. `CounterControl` - +/- Counter Widget
Interactive counter with decrease/increase buttons.

```tsx
<CounterControl
  value={count}
  onDecrease={() => setCount(count - 1)}
  onIncrease={() => setCount(count + 1)}
  decreaseLabel="-1K" // or "svg" for icon
  increaseLabel="+1K" // or "svg" for icon
  displayValue="8 glasses" // Optional custom display
/>
```

### 6. `PresetButtons` - Preset Selection Grid
Grid of preset buttons for quick value selection.

```tsx
<PresetButtons
  presets={[
    { label: "Light", value: 6000, subtitle: "6K steps" },
    { label: "Moderate", value: 8000, subtitle: "8K steps" },
    { label: "Active", value: 10000, subtitle: "10K steps" }
  ]}
  currentValue={selectedValue}
  onSelect={handleSelect}
  columns={3} // Optional: 2, 3, or 4 columns
/>
```

### 7. `ModalActions` - Standard Action Buttons
Consistent Cancel/Confirm button pair for modal footers.

```tsx
<ModalActions
  onCancel={() => setShowModal(false)}
  onConfirm={handleSave}
  cancelLabel="Cancel" // Optional custom text
  confirmLabel="Save Changes" // Optional custom text
/>
```

## Hooks

### `useScrollLock(isLocked: boolean)`
Prevents body scrolling when modals are open. Automatically preserves scroll position.

```tsx
const isModalOpen = showModal1 || showModal2 || showModal3;
useScrollLock(isModalOpen);
```

## Key Features

### 🎨 **Consistent Design**
- Luxury dark theme with gold accents
- Smooth animations and transitions
- Responsive design for all screen sizes
- Consistent typography and spacing

### 📱 **Mobile-First**
- Touch-friendly interactions
- Proper scroll behavior on mobile
- Responsive layouts and sizing
- Optimized for both desktop and mobile

### ♿ **Accessibility**
- Proper ARIA labels and semantics
- Keyboard navigation support
- Focus management
- Screen reader friendly

### 🔧 **Developer Experience**
- TypeScript support with full type safety
- Reusable components reduce code duplication
- Consistent API across all components
- Easy to customize and extend

### 🚀 **Performance**
- Efficient scroll locking mechanism
- Optimized animations and transitions
- Minimal re-renders
- Lazy loading friendly

## Usage Examples

### Basic Modal
```tsx
const [showModal, setShowModal] = useState(false);

return (
  <Modal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    title="Simple Modal"
    icon="✨"
  >
    <p>This is a simple modal with just content.</p>
  </Modal>
);
```

### Settings Modal
```tsx
<Modal
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
  title="Settings"
  icon="⚙️"
  size="md"
  footer={
    <ModalActions
      onCancel={() => setShowSettings(false)}
      onConfirm={handleSaveSettings}
      confirmLabel="Save Settings"
    />
  }
>
  <ModalSection
    icon="⚙️"
    description="Customize your app experience"
  />
  
  <div className="space-y-6">
    <CounterControl
      value={fontSize}
      onDecrease={() => setFontSize(fontSize - 1)}
      onIncrease={() => setFontSize(fontSize + 1)}
      displayValue={`${fontSize}px`}
    />
    
    <PresetButtons
      presets={[
        { label: "Small", value: 14 },
        { label: "Medium", value: 16 },
        { label: "Large", value: 18 }
      ]}
      currentValue={fontSize}
      onSelect={setFontSize}
    />
  </div>
</Modal>
```

### Progress Modal
```tsx
<Modal
  isOpen={showProgress}
  onClose={() => setShowProgress(false)}
  title="Upload Progress"
  icon="📤"
>
  <StatusCard>
    <p className="text-2xl font-bold">{progress}%</p>
    <p className="text-sm text-muted-foreground">Uploading files...</p>
    <ProgressBar value={progress} max={100} />
  </StatusCard>
</Modal>
```

## Best Practices

### 1. **Modal Structure**
Always follow this structure for consistency:
```tsx
<Modal title="..." icon="..." footer={<ModalActions />}>
  <ModalSection icon="..." description="..." />
  <StatusCard>{/* current state */}</StatusCard>
  {/* interactive controls */}
  <PresetButtons />
</Modal>
```

### 2. **State Management**
Keep modal state close to where it's used:
```tsx
const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState(initialData);
```

### 3. **Scroll Lock**
Use the hook for any combination of modals:
```tsx
const anyModalOpen = modal1 || modal2 || modal3;
useScrollLock(anyModalOpen);
```

### 4. **Accessibility**
- Always provide meaningful titles and descriptions
- Use semantic HTML elements
- Test with keyboard navigation
- Consider screen reader users

### 5. **Performance**
- Don't render modal content when closed (use conditional rendering)
- Keep state updates minimal during animations
- Use React.memo for complex modal content if needed

## Customization

### Custom Styling
```tsx
<Modal
  className="border-2 border-blue-500"
  title="Custom Modal"
>
  {/* content */}
</Modal>
```

### Custom Footer
```tsx
<Modal
  footer={
    <div className="flex justify-between">
      <button onClick={handleDelete}>Delete</button>
      <ModalActions onCancel={onCancel} onConfirm={onConfirm} />
    </div>
  }
>
  {/* content */}
</Modal>
```

### Custom Components
Extend the system by creating your own components that use the base Modal:

```tsx
export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      icon="🗑️"
      footer={
        <ModalActions
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel="Delete"
          cancelLabel="Keep"
        />
      }
    >
      <ModalSection
        icon="⚠️"
        description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      />
    </Modal>
  );
}
```

This modal system provides a powerful, flexible foundation for creating any type of modal in your application while maintaining design consistency and excellent user experience.