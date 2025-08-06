"use client";

import { useState, useRef, useEffect } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (checklist: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  existingChecklist?: Checklist;
}

export default function ChecklistModal({ isOpen, onClose, onSave, existingChecklist }: ChecklistModalProps) {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const newItemRef = useRef<HTMLInputElement>(null);

  useScrollLock(isOpen);

  // Update state when existingChecklist changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (existingChecklist) {
        setTitle(existingChecklist.title);
        setItems(existingChecklist.items);
      } else {
        setTitle("");
        setItems([]);
      }
      setNewItemText("");
    }
  }, [isOpen, existingChecklist]);

  // Auto-focus title when modal opens
  useEffect(() => {
    if (isOpen && titleRef.current && !existingChecklist) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, existingChecklist]);

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false
      };
      setItems([...items, newItem]);
      setNewItemText("");
      newItemRef.current?.focus();
    }
  };

  const handleToggleItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleEditItem = (itemId: string, newText: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, text: newText } : item
    ));
  };

  const handleSave = () => {
    if (title.trim() || items.length > 0) {
      onSave({
        title: title.trim() || "Untitled Checklist",
        items
      });
      onClose();
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setTitle("");
    setItems([]);
    setNewItemText("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  const handleNewItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
            <span className="text-2xl mr-3">📋</span>
            {existingChecklist ? 'Edit Checklist' : 'New Checklist'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
              ⌘+Enter to save
            </span>
            <button
              onClick={handleClose}
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
              Checklist Title *
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="e.g., Packing List, Shopping Items, Daily Tasks..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg outline-none text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              maxLength={200}
            />
          </div>

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm text-gold">{completedCount}/{totalCount} completed</span>
              </div>
              <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 rounded-full transition-all duration-500 bg-gold shimmer"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Add New Item */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Add Items
            </label>
            <div className="flex space-x-2">
              <input
                ref={newItemRef}
                type="text"
                placeholder="Add a new item..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={handleNewItemKeyDown}
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg outline-none text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              />
              <button
                onClick={handleAddItem}
                disabled={!newItemText.trim()}
                className="px-4 py-2 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors focus-ring-luxury disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Checklist Items */}
          {items.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Items</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      item.completed 
                        ? 'bg-muted/30 border-border/50' 
                        : 'bg-muted/50 border-border hover:border-gold/30'
                    }`}
                    style={{
                      animation: 'slideInFromLeft 0.3s ease-out',
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    <button
                      onClick={() => handleToggleItem(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                        item.completed
                          ? 'bg-gold border-gold text-background'
                          : 'border-border hover:border-gold/50'
                      }`}
                    >
                      {item.completed && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleEditItem(item.id, e.target.value)}
                      className={`flex-1 bg-transparent border-none outline-none text-foreground ${
                        item.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    />
                    
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-muted-foreground hover:text-red-400 transition-colors hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <span className="text-4xl block mb-2">📝</span>
              <p className="text-sm">No items yet. Add your first item above!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="text-gold">💡</span>
              <span>Press Enter to quickly add items</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors focus-ring-luxury"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim() && items.length === 0}
                className="px-6 py-2 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors focus-ring-luxury disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform duration-200"
              >
                {existingChecklist ? 'Update Checklist' : 'Create Checklist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}