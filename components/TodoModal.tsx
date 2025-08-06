"use client";

import { useState, useRef, useEffect } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  existingTodo?: Todo;
}

export default function TodoModal({ isOpen, onClose, onSave, existingTodo }: TodoModalProps) {
  const [title, setTitle] = useState(existingTodo?.title || "");
  const [description, setDescription] = useState(existingTodo?.description || "");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(existingTodo?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    existingTodo?.dueDate ? existingTodo.dueDate.toISOString().split('T')[0] : ""
  );
  const [completed, setCompleted] = useState(existingTodo?.completed || false);
  
  const titleRef = useRef<HTMLInputElement>(null);

  useScrollLock(isOpen);

  // Auto-focus title when modal opens
  useEffect(() => {
    if (isOpen && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen && !existingTodo) {
      setTitle("");
      setDescription("");
      setPriority('medium');
      setDueDate("");
      setCompleted(false);
    }
  }, [isOpen, existingTodo]);

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        completed
      });
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-gold bg-gold/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityIcon = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div 
        className="bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-gold bounce-in flex flex-col max-h-[85vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h3 className="text-xl font-semibold text-foreground flex items-center">
            <span className="text-2xl mr-3">✅</span>
            {existingTodo ? 'Edit Task' : 'New Task'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
              ⌘+Enter to save
            </span>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-gold transition-colors hover:scale-110 focus-ring-luxury"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 min-h-0 overflow-y-auto">
          {/* Title Input */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Task Title *
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg outline-none text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Description (optional)
            </label>
            <textarea
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg outline-none text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setPriority(level)}
                  className={`p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${
                    priority === level
                      ? `${getPriorityColor(level)} border-current`
                      : 'bg-muted border-border text-muted-foreground hover:border-gold/30'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>{getPriorityIcon(level)}</span>
                    <span className="text-sm font-medium capitalize">{level}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Due Date (optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg outline-none text-foreground focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
            />
          </div>

          {/* Completion Status (only for editing) */}
          {existingTodo && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCompleted(!completed)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  completed
                    ? 'bg-gold border-gold text-background'
                    : 'border-border hover:border-gold/50'
                }`}
              >
                {completed && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <label className="text-sm text-foreground">
                Mark as {completed ? 'incomplete' : 'completed'}
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="text-gold">💡</span>
              <span>Use ⌘+Enter to quickly save your task</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors focus-ring-luxury"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="px-6 py-2 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors focus-ring-luxury disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform duration-200"
              >
                {existingTodo ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}