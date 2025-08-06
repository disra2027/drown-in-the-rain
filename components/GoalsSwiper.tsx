"use client";

import { useState, useEffect, useRef } from "react";
import { Goal } from "./GoalsModal";

interface GoalsSwiperProps {
  goals: Goal[];
  onGoalClick?: (goal: Goal) => void;
}

export default function GoalsSwiper({ goals, onGoalClick }: GoalsSwiperProps) {
  const favoriteGoals = goals.filter(goal => goal.isFavorite);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto');

  // Reset index when goals change
  useEffect(() => {
    if (currentIndex >= favoriteGoals.length && favoriteGoals.length > 0) {
      setCurrentIndex(0);
    }
  }, [favoriteGoals.length, currentIndex]);

  // Update container height when content changes
  useEffect(() => {
    if (!isTransitioning && containerRef.current) {
      const updateHeight = () => {
        const height = containerRef.current?.scrollHeight;
        if (height && containerHeight === 'auto') {
          // Let the browser calculate the natural height
          requestAnimationFrame(() => {
            setContainerHeight('auto');
          });
        }
      };
      
      // Small delay to ensure content is rendered
      const timeoutId = setTimeout(updateHeight, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, isTransitioning, containerHeight]);

  const nextGoal = () => {
    if (isTransitioning) return;
    
    // Capture current height before transition
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
    
    setSlideDirection('left');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % favoriteGoals.length);
    }, 250);
    setTimeout(() => {
      setIsTransitioning(false);
      setSlideDirection(null);
      // Reset to auto after transition completes
      setTimeout(() => setContainerHeight('auto'), 50);
    }, 500);
  };

  const prevGoal = () => {
    if (isTransitioning) return;
    
    // Capture current height before transition
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
    
    setSlideDirection('right');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + favoriteGoals.length) % favoriteGoals.length);
    }, 250);
    setTimeout(() => {
      setIsTransitioning(false);
      setSlideDirection(null);
      // Reset to auto after transition completes
      setTimeout(() => setContainerHeight('auto'), 50);
    }, 500);
  };

  const goToGoal = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    // Capture current height before transition
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
    
    const direction = index > currentIndex ? 'left' : 'right';
    setSlideDirection(direction);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
    }, 250);
    setTimeout(() => {
      setIsTransitioning(false);
      setSlideDirection(null);
      // Reset to auto after transition completes
      setTimeout(() => setContainerHeight('auto'), 50);
    }, 500);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextGoal();
    } else if (isRightSwipe) {
      prevGoal();
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      "Health": "💪",
      "Financial": "💰",
      "Learning": "📚",
      "Personal": "🌟",
      "Career": "🚀",
      "Other": "🎯"
    };
    return icons[category] || "🎯";
  };

  if (favoriteGoals.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border text-center fade-in-up">
        <div className="text-4xl mb-3">⭐</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Favorite Goals</h3>
        <p className="text-sm text-muted-foreground">
          Star your important goals to see them here
        </p>
      </div>
    );
  }

  const currentGoal = favoriteGoals[currentIndex];

  return (
    <div className="relative fade-in-up delay-100 px-8">
      {/* Card Container with 3D flip effect */}
      <div 
        ref={containerRef}
        className="relative preserve-3d overflow-hidden rounded-xl transition-[height] duration-500 ease-out"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          height: containerHeight
        }}
      >
        {/* Main Goal Card */}
        <div
          className={`bg-gradient-to-br from-card via-card to-muted/50 rounded-xl p-4 sm:p-5 shadow-2xl border border-border cursor-pointer relative overflow-hidden transition-all duration-500 ease-out transform-gpu ${
            isTransitioning && slideDirection === 'left' 
              ? 'animate-[slideOutLeft_0.5s_ease-in-out] opacity-0 -translate-x-full rotate-y-90' 
              : isTransitioning && slideDirection === 'right'
              ? 'animate-[slideOutRight_0.5s_ease-in-out] opacity-0 translate-x-full rotate-y-90'
              : 'animate-[slideInCenter_0.5s_ease-in-out] opacity-100 translate-x-0 rotate-y-0 hover:scale-[1.02] hover:shadow-3xl'
          }`}
          onClick={() => onGoalClick?.(currentGoal)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            backfaceVisibility: 'hidden',
            transformOrigin: 'center center',
          }}
        >
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${currentGoal.color.replace('bg-', 'from-')} to-transparent opacity-10 rounded-xl transition-all duration-1000 ${
            isTransitioning ? 'scale-150 opacity-5' : 'scale-100 opacity-10'
          }`} />
          
          {/* Glowing border effect */}
          <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
            isTransitioning 
              ? 'shadow-none' 
              : `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/5`
          }`} />
          {/* Header Section */}
          <div className={`relative z-10 flex items-start justify-between mb-4 transition-all duration-700 ease-out ${
            isTransitioning 
              ? slideDirection === 'left' 
                ? 'transform -translate-x-8 -translate-y-2 opacity-0 blur-sm scale-95' 
                : 'transform translate-x-8 -translate-y-2 opacity-0 blur-sm scale-95'
              : 'transform translate-x-0 translate-y-0 opacity-100 blur-none scale-100'
          }`}>
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* Animated Category Icon */}
              <div className={`relative w-12 h-12 ${currentGoal.color} rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg transition-all duration-700 ease-out ${
                isTransitioning 
                  ? 'scale-75 rotate-180 shadow-none' 
                  : 'scale-100 rotate-0 shadow-lg hover:scale-110 hover:rotate-6'
              }`}>
                {/* Pulsing background */}
                <div className={`absolute inset-0 ${currentGoal.color} rounded-xl animate-pulse opacity-30 ${
                  isTransitioning ? 'scale-150' : 'scale-100'
                }`} />
                <span className="relative z-10 transition-transform duration-500">
                  {getCategoryIcon(currentGoal.category)}
                </span>
              </div>
              
              {/* Title and Description */}
              <div className="flex-1 min-w-0 pr-2">
                <h3 className={`text-base sm:text-lg font-bold text-foreground mb-1 transition-all duration-500 leading-tight ${
                  isTransitioning ? 'blur-sm' : 'blur-none'
                } ${currentGoal.title.length > 25 ? 'text-base sm:text-lg' : ''}`}>
                  <span className="line-clamp-2" title={currentGoal.title}>
                    {currentGoal.title}
                  </span>
                </h3>
                <p className={`text-xs sm:text-sm text-muted-foreground transition-all duration-500 delay-100 leading-relaxed ${
                  isTransitioning ? 'blur-sm opacity-50' : 'blur-none opacity-100'
                }`}>
                  <span className="line-clamp-2" title={currentGoal.description}>
                    {currentGoal.description}
                  </span>
                </p>
              </div>
            </div>
            
            {/* Favorite Star and Category */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
              <div className={`text-gold transition-all duration-500 ${
                isTransitioning ? 'scale-75 rotate-90 opacity-50' : 'scale-100 rotate-0 opacity-100 animate-pulse hover:scale-125'
              }`}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className={`text-xs font-medium text-muted-foreground bg-muted/50 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border/50 transition-all duration-500 whitespace-nowrap ${
                isTransitioning ? 'scale-90 opacity-50' : 'scale-100 opacity-100'
              }`}>
                {currentGoal.category}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div className={`relative z-10 space-y-3 transition-all duration-700 ease-out delay-200 ${
            isTransitioning 
              ? slideDirection === 'left'
                ? 'transform translate-x-6 translate-y-4 opacity-0 blur-sm scale-95'
                : 'transform -translate-x-6 translate-y-4 opacity-0 blur-sm scale-95'
              : 'transform translate-x-0 translate-y-0 opacity-100 blur-none scale-100'
          }`}>
            {/* Progress Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <div className={`text-right transition-all duration-500 ${
                isTransitioning ? 'scale-90 blur-sm' : 'scale-100 blur-none'
              }`}>
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  {currentGoal.currentValue}
                </span>
                <span className="text-sm sm:text-base text-muted-foreground">
                  /{currentGoal.targetValue} {currentGoal.unit}
                </span>
              </div>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="relative">
              {/* Background track */}
              <div className="w-full bg-muted/50 rounded-full h-3 sm:h-4 backdrop-blur-sm border border-border/30 overflow-hidden">
                {/* Animated shimmer background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                
                {/* Progress fill */}
                <div 
                  className={`h-3 sm:h-4 rounded-full relative overflow-hidden transition-all ease-out ${currentGoal.color} ${
                    isTransitioning 
                      ? 'duration-200 scale-x-0 opacity-50' 
                      : 'duration-1500 scale-x-100 opacity-100'
                  }`}
                  style={{ 
                    width: isTransitioning 
                      ? '0%' 
                      : `${getProgressPercentage(currentGoal.currentValue, currentGoal.targetValue)}%`,
                    transformOrigin: 'left center'
                  }}
                >
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 animate-pulse" />
                  
                  {/* Moving shine effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform translate-x-[-100%] transition-transform duration-2000 ${
                    !isTransitioning ? 'animate-[shimmer_2s_ease-in-out_infinite]' : ''
                  }`} />
                </div>
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-1 sm:space-y-0 text-sm">
              <div className={`flex items-center space-x-2 transition-all duration-500 delay-300 ${
                isTransitioning ? 'opacity-50 blur-sm' : 'opacity-100 blur-none'
              }`}>
                <div className={`w-2 h-2 ${currentGoal.color} rounded-full animate-pulse flex-shrink-0`} />
                <span className="font-semibold text-foreground">
                  {Math.round(getProgressPercentage(currentGoal.currentValue, currentGoal.targetValue))}% complete
                </span>
              </div>
              
              {currentGoal.targetDate && (
                <span className={`text-xs sm:text-sm text-muted-foreground transition-all duration-500 delay-400 ${
                  isTransitioning ? 'opacity-50 blur-sm' : 'opacity-100 blur-none'
                }`}>
                  Due: {new Date(currentGoal.targetDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
      
      {/* Navigation Controls - Outside overflow container */}
      {favoriteGoals.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevGoal();
            }}
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-10 h-16 bg-card/90 backdrop-blur-sm border border-border rounded-r-full flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-all duration-200 hover:scale-110 focus-ring-luxury shadow-lg z-20 pl-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextGoal();
            }}
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-10 h-16 bg-card/90 backdrop-blur-sm border border-border rounded-l-full flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-all duration-200 hover:scale-110 focus-ring-luxury shadow-lg z-20 pr-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {favoriteGoals.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {favoriteGoals.map((_, index) => (
            <button
              key={index}
              onClick={() => goToGoal(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-150 ${
                index === currentIndex 
                  ? 'bg-gold shadow-lg' 
                  : 'bg-muted-foreground hover:bg-gold/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}