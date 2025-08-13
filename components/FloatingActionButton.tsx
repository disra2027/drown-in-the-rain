"use client";

import { useState, useRef, useEffect } from "react";

interface FloatingActionButtonProps {
  onNoteClick: () => void;
  onTodoClick: () => void;
  onChecklistClick: () => void;
  onIncomeClick?: () => void;
  onExpenseClick?: () => void;
  onGoalClick?: () => void;
  onSavingsClick?: () => void;
  onInvestmentClick?: () => void;
  onNavigate?: (path: string) => void;
  onScrollToWeather?: () => void;
  onScrollToProjects?: () => void;
  onScrollToGoals?: () => void;
}

export default function FloatingActionButton({ 
  onNoteClick, 
  onTodoClick, 
  onChecklistClick, 
  onIncomeClick,
  onExpenseClick,
  onGoalClick,
  onSavingsClick,
  onInvestmentClick,
  onNavigate,
  onScrollToWeather,
  onScrollToProjects,
  onScrollToGoals
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Menu categories based on actual app features and functionality
  const menuCategories = [
    {
      id: 'productivity',
      label: 'Productivity',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      items: [
        { label: 'Quick Note', action: onNoteClick, icon: '📝' },
        { label: 'New Task', action: onTodoClick, icon: '✅' },
        { label: 'Checklist', action: onChecklistClick, icon: '📋' },
      ]
    },
    {
      id: 'financial',
      label: 'Financial',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      items: [
        { label: 'Add Income', action: onIncomeClick, icon: '💰' },
        { label: 'Add Expense', action: onExpenseClick, icon: '💸' },
        { label: 'Set Goal', action: onGoalClick, icon: '🎯' },
        { label: 'Savings Goal', action: onSavingsClick, icon: '🏦' },
        { label: 'Investment', action: onInvestmentClick, icon: '📈' },
        { label: 'Financial Dashboard', action: () => onNavigate?.('/financial'), icon: '📊' },
      ]
    },
    {
      id: 'wellness',
      label: 'Life & Wellness',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'from-pink-500 to-pink-600',
      items: [
        { label: 'Start Meditation', action: () => console.log('Start meditation session'), icon: '🧘' },
        { label: 'Water Tracker', action: () => console.log('Update water intake'), icon: '💧' },
        { label: 'Sleep Tracker', action: () => console.log('Log sleep data'), icon: '😴' },
        { label: 'Steps Counter', action: () => console.log('Update steps'), icon: '👟' },
      ]
    },
    {
      id: 'entertainment',
      label: 'Media & Music',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      color: 'from-cyan-500 to-cyan-600',
      items: [
        { label: 'Music Player', action: () => console.log('Control music playback'), icon: '🎵' },
        { label: 'Next Track', action: () => console.log('Play next track'), icon: '⏭️' },
        { label: 'Playlist', action: () => console.log('Show playlist'), icon: '📋' },
      ]
    },
    {
      id: 'navigation',
      label: 'Pages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      items: [
        { label: 'Timeline', action: () => onNavigate?.('/timeline'), icon: '📅' },
        { label: 'Wishlist', action: () => onNavigate?.('/wishlist'), icon: '💝' },
        { label: 'Notes', action: () => onNavigate?.('/notes'), icon: '📚' },
        { label: 'Financial', action: () => onNavigate?.('/financial'), icon: '💰' },
        { label: 'Settings', action: () => onNavigate?.('/settings'), icon: '⚙️' },
      ]
    },
    {
      id: 'widgets',
      label: 'Home Widgets',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      items: [
        { label: 'Weather Widget', action: onScrollToWeather, icon: '🌤️' },
        { label: 'Project Tasks', action: onScrollToProjects, icon: '📋' },
        { label: 'Goals Swiper', action: onScrollToGoals, icon: '🎯' },
      ]
    }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setActiveCategory(null);
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
    setActiveCategory(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleItemClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setIsExpanded(false);
    setActiveCategory(null);
  };



  // Responsive spacing for vertical menu items
  const getResponsiveSpacing = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 75; // sm screens - increased spacing
      if (window.innerWidth < 768) return 80; // md screens
      return 85; // lg screens and up
    }
    return 85;
  };

  const getResponsiveItemSpacing = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 50; // sm screens
      return 55; // md screens and up
    }
    return 55;
  };

  return (
    <>
      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 animate-in fade-in" />
      )}

      {/* Instruction Bar - At Bottom of Screen */}
      {isExpanded && (
        <div className="fixed bottom-4 left-0 sm:left-1/2 sm:-translate-x-1/2 right-0 sm:right-auto z-50 px-4 sm:px-0 sm:max-w-none">
          <div className="bg-card/95 backdrop-blur-lg text-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-full shadow-xl border border-border/50 animate-in slide-in-from-bottom-2 fade-in duration-500 mx-4 sm:mx-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse flex-shrink-0 ${
                activeCategory ? 'bg-green-400' : 'bg-gold'
              }`}></div>
              <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">
                {activeCategory 
                  ? `Select from ${menuCategories.find(cat => cat.id === activeCategory)?.label}`
                  : 'Choose a category'
                }
              </span>
              {activeCategory && (
                <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>•</span>
                  <span>{menuCategories.find(cat => cat.id === activeCategory)?.items.length} actions</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAB Container */}
      <div 
        ref={menuRef} 
        className="fixed right-6 z-50"
        style={{
          transition: 'all 0.5s ease-out',
          bottom: isExpanded ? '16px' : '80px'
        }}
      >
        {/* Main FAB */}
        <button
          onClick={toggleMenu}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="
            relative
            w-16 h-16 rounded-full
            bg-gradient-to-r from-gold to-gold-light
            text-background
            shadow-lg hover:shadow-2xl
            focus:outline-none focus:ring-4 focus:ring-gold/30
            pulse-glow
            flex items-center justify-center
            z-10
          "
          style={{
            transition: 'all 0.5s ease-in-out',
            transform: isExpanded 
              ? 'rotate(45deg) scale(1.1)' 
              : isHovered 
                ? 'rotate(0deg) scale(1.05)'
                : 'rotate(0deg) scale(1)',
            boxShadow: isHovered 
              ? '0 15px 40px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.3)'
              : '0 8px 25px rgba(212, 175, 55, 0.4)'
          }}
        >
          <svg 
            className="w-7 h-7"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </button>

        {/* Vertical Menu Categories */}
        <div className="absolute pointer-events-none">
            {menuCategories.slice(0, 5).map((category, index) => {
              const isActive = activeCategory === category.id;
              
              return (
                <div
                  key={category.id}
                  className={`absolute transition-all duration-500 ease-out ${
                    isExpanded 
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 scale-75 translate-y-8 pointer-events-none'
                  }`}
                  style={{
                    left: '50%',
                    bottom: `${80 + (index * getResponsiveSpacing())}px`,
                    transitionDelay: isExpanded 
                      ? `${0.3 + (index * 0.05)}s` 
                      : `${(menuCategories.slice(0, 5).length - index - 1) * 0.03}s`
                  }}
                >
                  {/* Category Button */}
                  <div className="relative">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`
                        w-14 h-14 rounded-full
                        bg-gradient-to-r ${category.color}
                        text-white
                        shadow-lg hover:shadow-xl
                        transition-all duration-500
                        hover:scale-125 active:scale-110
                        focus:outline-none focus:ring-4 ${
                          category.color.includes('blue') ? 'focus:ring-blue-500/30' : 
                          category.color.includes('green') ? 'focus:ring-green-500/30' :
                          category.color.includes('purple') ? 'focus:ring-purple-500/30' : 
                          category.color.includes('pink') ? 'focus:ring-pink-500/30' :
                          category.color.includes('orange') ? 'focus:ring-orange-500/30' :
                          category.color.includes('gray') ? 'focus:ring-gray-500/30' :
                          category.color.includes('cyan') ? 'focus:ring-cyan-500/30' : 'focus:ring-gray-500/30'
                        }
                        flex items-center justify-center
                        animate-in slide-in-from-bottom-10 fade-in
                        ${isActive ? 'ring-4 ring-white/40 scale-125' : 'scale-100'}
                      `}
                      style={{
                        animationDelay: `${0.3 + (index * 0.05)}s`,
                        animationFillMode: 'both',
                        animationDuration: '0.4s'
                      }}
                    >
                      <div className="relative">
                        {category.icon}
                        {isActive && (
                          <div className="absolute -inset-2 rounded-full border-2 border-white/60 animate-pulse" />
                        )}
                      </div>
                    </button>

                    {/* Sub-menu Items - Positioned lower for better thumb reach */}
                    <div 
                      className="absolute right-full mr-6 pointer-events-none"
                      style={{
                        bottom: `${(40 - (index * getResponsiveSpacing()))}px`,
                        top: 'auto'
                      }}
                    >
                      {category.items.map((item, itemIndex) => {
                        const y = itemIndex * getResponsiveItemSpacing();
                        return (
                          <div
                            key={itemIndex}
                            className={`absolute group transition-all duration-500 ease-in-out ${
                              isActive 
                                ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto' 
                                : 'opacity-0 scale-50 translate-x-4 pointer-events-none'
                            }`}
                            style={{
                              right: '0px',
                              bottom: `${y}px`,
                              transitionDelay: isActive 
                                ? `${0.1 + (itemIndex * 0.03)}s` 
                                : `${(category.items.length - itemIndex - 1) * 0.02}s`,
                              transform: isActive 
                                ? 'translateX(0) scale(1)' 
                                : 'translateX(16px) scale(0.75)'
                            }}
                          >
                              {/* Label aligned to the left of button */}
                              <div className="flex items-center gap-3">
                                <div className={`
                                  text-foreground text-sm font-medium
                                  bg-background/95 backdrop-blur-sm
                                  px-3 py-1.5 rounded-lg
                                  shadow-lg border border-border/50
                                  whitespace-nowrap
                                  transition-all duration-300
                                  ${isActive ? 'opacity-90' : 'opacity-0'}
                                `}
                                style={{
                                  transitionDelay: isActive 
                                    ? `${0.15 + (itemIndex * 0.03)}s` 
                                    : '0s'
                                }}
                                >
                                  {item.label}
                                </div>
                                
                                <button
                                  onClick={() => handleItemClick(item.action)}
                                  className={`
                                    relative w-11 h-11 rounded-full 
                                    bg-gradient-to-br ${category.color}
                                    text-white
                                    shadow-lg hover:shadow-xl
                                    transition-all duration-300
                                    hover:scale-125 active:scale-110
                                    focus:outline-none focus:ring-2 focus:ring-white/40
                                    flex items-center justify-center
                                    animate-in slide-in-from-bottom-4 fade-in
                                    opacity-90 hover:opacity-100
                                  `}
                                  style={{
                                    animationDelay: `${0.1 + (itemIndex * 0.03)}s`,
                                    animationFillMode: 'both',
                                    animationDuration: '0.2s'
                                  }}
                                >
                                  <span className="text-base filter drop-shadow-sm">{item.icon}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>


      </div>
    </>
  );
}