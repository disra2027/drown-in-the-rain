"use client";

import { useState, useRef, useEffect } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  existingNote?: Note;
}

export default function NoteModal({ isOpen, onClose, onSave, existingNote }: NoteModalProps) {
  const [title, setTitle] = useState(existingNote?.title || "");
  const [content, setContent] = useState(existingNote?.content || "");
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useScrollLock(isOpen);

  // Auto-focus title when modal opens
  useEffect(() => {
    if (isOpen && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (!existingNote) {
        setTitle("");
        setContent("");
      }
    }
  }, [isOpen, existingNote]);

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave({
        title: title.trim() || "Untitled Note",
        content: content.trim()
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div 
        className="bg-card rounded-2xl w-full max-w-2xl shadow-2xl border border-gold bounce-in flex flex-col max-h-[85vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h3 className="text-xl font-semibold text-foreground flex items-center">
            <span className="text-2xl mr-3">📝</span>
            {existingNote ? 'Edit Note' : 'New Note'}
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
        <div className="flex-1 p-6 space-y-4 min-h-0">
          {/* Title Input */}
          <div>
            <input
              ref={titleRef}
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-semibold bg-transparent border-none outline-none text-foreground placeholder-muted-foreground focus:ring-0"
              maxLength={200}
            />
            <div className="h-px bg-border mt-2"></div>
          </div>

          {/* Content Textarea */}
          <div className="flex-1 min-h-0 flex flex-col">
            <textarea
              ref={contentRef}
              placeholder="Write your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 min-h-[300px] w-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground resize-none focus:ring-0 leading-relaxed"
              style={{ 
                minHeight: '300px',
                maxHeight: '400px'
              }}
            />
          </div>

          {/* Character count */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>
              {content.length} characters
            </span>
            <span>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="text-gold">💡</span>
              <span>Pro tip: Use ⌘+Enter to quickly save your note</span>
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
                disabled={!title.trim() && !content.trim()}
                className="px-6 py-2 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors focus-ring-luxury disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform duration-200"
              >
                {existingNote ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}