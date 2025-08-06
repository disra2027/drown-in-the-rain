"use client";

import { useState, useRef, useEffect } from "react";

interface FloatingActionButtonProps {
  onNoteClick: () => void;
  onTodoClick: () => void;
  onChecklistClick: () => void;
}

export default function FloatingActionButton({ onNoteClick, onTodoClick, onChecklistClick }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNoteClick = () => {
    onNoteClick();
    setIsExpanded(false);
  };

  const handleTodoClick = () => {
    onTodoClick();
    setIsExpanded(false);
  };

  const handleChecklistClick = () => {
    onChecklistClick();
    setIsExpanded(false);
  };

  return (
    <div ref={menuRef} className="fixed bottom-24 right-6 z-50">
      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity duration-300" />
      )}

      {/* Menu Items */}
      <div className={`absolute bottom-16 right-0 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="flex flex-col items-end space-y-3">
          {/* Note Button with Label */}
          <div className="flex items-center justify-end space-x-3">
            <div 
              className={`bg-card text-foreground px-3 py-1 rounded-lg shadow-lg text-sm font-medium border border-border bounce-in transition-all duration-300 whitespace-nowrap ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
              style={{ animationDelay: '0.1s' }}
            >
              Note
            </div>
            <button
              onClick={handleNoteClick}
              className={`
                w-12 h-12 rounded-full
                bg-gradient-to-r from-blue-500 to-blue-600
                text-white
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:scale-110 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-blue-500/30
                flex items-center justify-center
                bounce-in
                flex-shrink-0
              `}
              style={{
                animationDelay: '0.1s'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          {/* Todo Button with Label */}
          <div className="flex items-center justify-end space-x-3">
            <div 
              className={`bg-card text-foreground px-3 py-1 rounded-lg shadow-lg text-sm font-medium border border-border bounce-in transition-all duration-300 whitespace-nowrap ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
              style={{ animationDelay: '0.2s' }}
            >
              Task
            </div>
            <button
              onClick={handleTodoClick}
              className={`
                w-12 h-12 rounded-full
                bg-gradient-to-r from-green-500 to-green-600
                text-white
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:scale-110 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-green-500/30
                flex items-center justify-center
                bounce-in
                flex-shrink-0
              `}
              style={{
                animationDelay: '0.2s'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </button>
          </div>

          {/* Checklist Button with Label */}
          <div className="flex items-center justify-end space-x-3">
            <div 
              className={`bg-card text-foreground px-3 py-1 rounded-lg shadow-lg text-sm font-medium border border-border bounce-in transition-all duration-300 whitespace-nowrap ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
              style={{ animationDelay: '0.3s' }}
            >
              Checklist
            </div>
            <button
              onClick={handleChecklistClick}
              className={`
                w-12 h-12 rounded-full
                bg-gradient-to-r from-purple-500 to-purple-600
                text-white
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:scale-110 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-purple-500/30
                flex items-center justify-center
                bounce-in
                flex-shrink-0
              `}
              style={{
                animationDelay: '0.3s'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-14 h-14 rounded-full
          bg-gradient-to-r from-gold to-gold-light
          text-background
          shadow-lg hover:shadow-2xl
          transition-all duration-300
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-gold/30
          pulse-glow
          flex items-center justify-center
          ${isHovered ? 'transform-gpu' : ''}
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
        style={{
          boxShadow: isHovered 
            ? '0 10px 30px rgba(212, 175, 55, 0.4), 0 0 50px rgba(212, 175, 55, 0.2)'
            : '0 4px 20px rgba(212, 175, 55, 0.3)'
        }}
      >
        <svg 
          className={`w-6 h-6 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </button>
    </div>
  );
}