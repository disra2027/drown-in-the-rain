"use client";

import React, { useState, useMemo } from "react";

interface DueDate {
  id: string;
  name: string;
  amount: number;
  date: Date;
  category: "bill" | "payment" | "subscription" | "loan" | "other";
  priority: "low" | "medium" | "high" | "critical";
  icon: string;
  recurring?: boolean;
}

interface CalendarDueDatesProps {
  dueDates?: DueDate[];
}

export default function CalendarDueDates({ dueDates: propDueDates }: CalendarDueDatesProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Utility function for safe amount formatting
  const formatAmount = (amount: number | null | undefined, useCompactFormat = false): string => {
    // Handle null, undefined, or NaN values
    if (amount == null || isNaN(amount)) {
      return "0";
    }

    // Ensure it's a number and round to avoid floating point issues
    const safeAmount = Math.round(Number(amount));

    // Use compact format for large amounts in small spaces
    if (useCompactFormat && safeAmount > 999) {
      return `${(safeAmount / 1000).toFixed(1)}k`;
    }

    // Use locale string formatting with no decimal places
    return safeAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcuts
      if (e.key === 'w' || e.key === 'W') {
        setViewMode(viewMode === "month" ? "week" : "month");
        e.preventDefault();
        return;
      }
      
      if (viewMode === "week") {
        switch (e.key) {
          case 'ArrowLeft':
            changeWeek(-1);
            e.preventDefault();
            break;
          case 'ArrowRight':
            changeWeek(1);
            e.preventDefault();
            break;
          case 'Home':
            setCurrentWeekOffset(0);
            e.preventDefault();
            break;
        }
      }
      
      if (!selectedDate) return;
      
      let newDate = new Date(selectedDate);
      
      switch (e.key) {
        case 'ArrowLeft':
          if (viewMode === "month") {
            newDate.setDate(selectedDate.getDate() - 1);
            setSelectedDate(newDate);
            e.preventDefault();
          }
          break;
        case 'ArrowRight':
          if (viewMode === "month") {
            newDate.setDate(selectedDate.getDate() + 1);
            setSelectedDate(newDate);
            e.preventDefault();
          }
          break;
        case 'ArrowUp':
          if (viewMode === "month") {
            newDate.setDate(selectedDate.getDate() - 7);
            setSelectedDate(newDate);
            e.preventDefault();
          }
          break;
        case 'ArrowDown':
          if (viewMode === "month") {
            newDate.setDate(selectedDate.getDate() + 7);
            setSelectedDate(newDate);
            e.preventDefault();
          }
          break;
        case 'Escape':
          setSelectedDate(null);
          e.preventDefault();
          break;
        case 'Enter':
          const dayDueDates = getDueDatesForDay(selectedDate.getDate());
          if (dayDueDates.length > 0) {
            handleQuickPay(dayDueDates[0]);
          }
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate, viewMode, currentWeekOffset]);

  // Mock data
  const mockDueDates: DueDate[] = [
    { id: "1", name: "Electricity Bill", amount: 125.50, date: new Date(2025, 0, 5), category: "bill", priority: "high", icon: "⚡", recurring: true },
    { id: "2", name: "Netflix", amount: 19.99, date: new Date(2025, 0, 10), category: "subscription", priority: "low", icon: "📺", recurring: true },
    { id: "3", name: "Car Loan", amount: 385.00, date: new Date(2025, 0, 15), category: "loan", priority: "critical", icon: "🚗", recurring: true },
    { id: "4", name: "Internet", amount: 79.99, date: new Date(2025, 0, 6), category: "bill", priority: "high", icon: "🌐", recurring: true },
    { id: "5", name: "Credit Card", amount: 156.00, date: new Date(2025, 0, 20), category: "payment", priority: "high", icon: "💳", recurring: true },
    { id: "6", name: "Spotify", amount: 15.99, date: new Date(2025, 0, 12), category: "subscription", priority: "low", icon: "🎵", recurring: true },
    { id: "7", name: "Water Bill", amount: 45.00, date: new Date(2025, 0, 25), category: "bill", priority: "medium", icon: "💧", recurring: false },
    { id: "8", name: "Student Loan", amount: 245.00, date: new Date(2025, 0, 28), category: "loan", priority: "high", icon: "🎓", recurring: true },
    { id: "9", name: "Gym", amount: 49.99, date: new Date(2025, 0, 1), category: "other", priority: "low", icon: "💪", recurring: true },
    { id: "10", name: "Phone Bill", amount: 65.00, date: new Date(2025, 0, 8), category: "bill", priority: "medium", icon: "📱", recurring: true },
    { id: "11", name: "Insurance", amount: 180.00, date: new Date(2025, 0, 18), category: "payment", priority: "critical", icon: "🛡️", recurring: true },
    { id: "12", name: "Rent", amount: 1500.00, date: new Date(2025, 0, 1), category: "payment", priority: "critical", icon: "🏠", recurring: true },
  ];

  const dueDates = propDueDates || mockDueDates;

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
    setCurrentWeekOffset(0);
  };

  const changeWeek = (increment: number) => {
    setCurrentWeekOffset(prev => prev + increment);
  };

  const getWeekRange = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Get due dates for a specific day
  const getDueDatesForDay = (day: number) => {
    return dueDates.filter(d => {
      const dueDate = new Date(d.date);
      return (
        dueDate.getDate() === day &&
        dueDate.getMonth() === currentDate.getMonth() &&
        dueDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  // Get total amount for a specific day
  const getDayTotal = (day: number) => {
    const dayDueDates = getDueDatesForDay(day);
    return dayDueDates.reduce((sum, d) => sum + d.amount, 0);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-green-500";
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "bill": return "text-blue-400";
      case "payment": return "text-purple-400";
      case "subscription": return "text-green-400";
      case "loan": return "text-orange-400";
      default: return "text-gray-400";
    }
  };

  // Calculate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentDate]);

  // Get selected date's due dates
  const selectedDateDueDates = useMemo(() => {
    if (!selectedDate) return [];
    return dueDates.filter(d => {
      const dueDate = new Date(d.date);
      return (
        dueDate.getDate() === selectedDate.getDate() &&
        dueDate.getMonth() === selectedDate.getMonth() &&
        dueDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [selectedDate, dueDates]);

  // Check if date is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Multiple weeks calculation for scrollable view
  const weekRanges = useMemo(() => {
    if (viewMode !== "week") return [];
    
    const ranges = [];
    // Show 3 weeks: previous, current, next (based on offset)
    for (let i = -1; i <= 1; i++) {
      ranges.push(getWeekRange(currentWeekOffset + i));
    }
    return ranges;
  }, [viewMode, currentWeekOffset]);

  const getCurrentWeekLabel = () => {
    const currentWeek = getWeekRange(currentWeekOffset);
    const start = currentWeek[0];
    const end = currentWeek[6];
    
    if (currentWeekOffset === 0) return "This Week";
    if (currentWeekOffset === -1) return "Last Week";
    if (currentWeekOffset === 1) return "Next Week";
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString("en-US", { month: "short" })} ${start.getDate()}-${end.getDate()}`;
    } else {
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    }
  };

  // Check if current week contains today's date
  const currentWeekContainsToday = () => {
    const today = new Date();
    const currentWeek = getWeekRange(currentWeekOffset);
    return currentWeek.some(date => date.toDateString() === today.toDateString());
  };

  const handleQuickPay = (dueDate: DueDate) => {
    // Quick pay action - could integrate with payment system
    console.log("Quick pay:", dueDate.name);
  };

  const handleSnooze = (dueDate: DueDate) => {
    // Snooze reminder action
    console.log("Snooze:", dueDate.name);
  };

  return (
    <div className="space-y-2">
      <div className="bg-card rounded-lg p-2 border border-border relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-lg mr-2">📆</span>
            <h2 className="text-base font-semibold text-foreground">Payment Calendar</h2>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex bg-secondary/50 rounded-md p-0.5">
              <button
                onClick={() => setViewMode("month")}
                className={`px-2 py-1 rounded text-xs font-medium transition-all hover:scale-110 ${
                  viewMode === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-2 py-1 rounded text-xs font-medium transition-all hover:scale-110 ${
                  viewMode === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {viewMode === "month" ? (
          <>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 hover:bg-secondary rounded-md transition-all hover:scale-110 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-1">
                <h3 className="text-sm font-medium">{getMonthYear(currentDate)}</h3>
                <button
                  onClick={goToToday}
                  className="px-2 py-1 text-xs bg-secondary/70 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-all hover:scale-105"
                >
                  Today
                </button>
              </div>
              
              <button
                onClick={() => changeMonth(1)}
                className="p-1 hover:bg-secondary rounded-md transition-all hover:scale-110 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-px mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div key={index} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Ultra Compact Calendar Grid */}
            <div className="grid grid-cols-7 gap-px">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="aspect-square" />;
                }

                const dayDueDates = getDueDatesForDay(day);
                const dayTotal = getDayTotal(day);
                const hasPayments = dayDueDates.length > 0;
                const highestPriority = dayDueDates.reduce((highest, d) => {
                  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                  return priorityOrder[d.priority] > priorityOrder[highest] ? d.priority : highest;
                }, "low" as DueDate["priority"]);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    onMouseEnter={() => {
                      setHoveredDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                      hasPayments && setShowPreview(true);
                    }}
                    onMouseLeave={() => {
                      setHoveredDate(null);
                      setShowPreview(false);
                    }}
                    onDoubleClick={() => hasPayments && handleQuickPay(dayDueDates[0])}
                    className={`aspect-square p-0.5 rounded border transition-all duration-150 hover:scale-125 hover:z-20 hover:shadow-lg active:scale-90 group relative ${
                      isToday(day)
                        ? "border-primary bg-primary/20 ring-1 ring-primary/50"
                        : isSelected(day)
                        ? "border-primary bg-primary/30 ring-1 ring-primary/70"
                        : hasPayments
                        ? "border-border bg-secondary/40 hover:bg-secondary/70"
                        : "border-border/20 hover:border-border/50 hover:bg-secondary/30"
                    }`}
                  >
                    <div className="h-full flex flex-col justify-center items-center">
                      <div className={`text-xs font-medium ${
                        isToday(day) ? "text-primary" : hasPayments ? "text-foreground" : "text-muted-foreground"
                      }`}>{day}</div>
                      {hasPayments && (
                        <div className="flex justify-center items-center mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(highestPriority)} animate-pulse`} />
                          {dayDueDates.length > 1 && (
                            <span className="text-[8px] text-muted-foreground ml-0.5 font-bold">+</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Hover Preview Tooltip */}
                    {showPreview && hoveredDate?.getDate() === day && hasPayments && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-30 bg-popover border border-border rounded-md p-2 shadow-lg animate-in fade-in zoom-in-95 min-w-28">
                        <div className="text-xs font-medium text-popover-foreground mb-1">
                          ${formatAmount(dayTotal)}
                        </div>
                        <div className="space-y-1">
                          {dayDueDates.slice(0, 3).map(dd => (
                            <div key={dd.id} className="flex items-center justify-between text-[10px]">
                              <span>{dd.icon} {dd.name.substring(0, 8)}...</span>
                              <span className="font-medium">${formatAmount(dd.amount, true)}</span>
                            </div>
                          ))}
                          {dayDueDates.length > 3 && (
                            <div className="text-[9px] text-muted-foreground text-center">+{dayDueDates.length - 3} more</div>
                          )}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Redesigned Week View - Horizontal Cards */
          <div className="space-y-2">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => changeWeek(-1)}
                className="flex items-center space-x-1 px-2 py-1 hover:bg-secondary rounded-md transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs text-muted-foreground">Prev</span>
              </button>
              
              <div className="flex items-center space-x-1">
                <h3 className="text-sm font-medium">{getCurrentWeekLabel()}</h3>
                {!currentWeekContainsToday() && (
                  <button
                    onClick={() => setCurrentWeekOffset(0)}
                    className="px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 rounded text-primary transition-all hover:scale-105"
                  >
                    Today
                  </button>
                )}
              </div>
              
              <button
                onClick={() => changeWeek(1)}
                className="flex items-center space-x-1 px-2 py-1 hover:bg-secondary rounded-md transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-xs text-muted-foreground">Next</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Horizontal Week Cards Container */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 pb-2">
                {getWeekRange(currentWeekOffset).map((date, dayIndex) => {
                  const dayDueDates = dueDates.filter(d => {
                    const dueDate = new Date(d.date);
                    return (
                      dueDate.getDate() === date.getDate() &&
                      dueDate.getMonth() === date.getMonth() &&
                      dueDate.getFullYear() === date.getFullYear()
                    );
                  });
                  const dayTotal = dayDueDates.reduce((sum, d) => sum + d.amount, 0);
                  const today = new Date();
                  const isToday = currentWeekOffset === 0 && date.toDateString() === today.toDateString();

                  return (
                    <button
                      key={`${currentWeekOffset}-${dayIndex}`}
                      onClick={() => setSelectedDate(date)}
                      onDoubleClick={() => dayDueDates.length > 0 && handleQuickPay(dayDueDates[0])}
                      className={`flex-shrink-0 w-20 p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg animate-in fade-in zoom-in-95 flex flex-col items-center justify-start ${
                        isToday 
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20" 
                          : selectedDate?.toDateString() === date.toDateString()
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-secondary/30 hover:border-border/80"
                      }`}
                      style={{ animationDelay: `${dayIndex * 100}ms`, animationFillMode: "forwards" }}
                    >
                      {/* Day Header */}
                      <div className="text-center mb-2 pb-2 border-b border-white">
                        <div className={`text-sm font-medium ${
                          isToday ? "text-primary" : "text-muted-foreground"
                        }`}>
                          {date.toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className={`text-xl font-bold ${
                          isToday ? "text-primary" : "text-foreground"
                        }`}>
                          {date.getDate()}
                        </div>
                      </div>

                      {/* Payment Summary */}
                      {dayDueDates.length > 0 ? (
                        <div className="space-y-1.5">
                          <div className={`text-base font-bold text-center ${
                            isToday ? "text-primary" : "text-foreground"
                          }`}>
                            ${formatAmount(dayTotal, true)}
                          </div>
                          <div className="flex justify-center space-x-1">
                            {dayDueDates.slice(0, 3).map((dd) => (
                              <span key={dd.id} className="text-base">{dd.icon}</span>
                            ))}
                            {dayDueDates.length > 3 && (
                              <span className="text-sm text-muted-foreground font-bold">+{dayDueDates.length - 3}</span>
                            )}
                          </div>
                          <div className="text-sm text-center text-muted-foreground">
                            {dayDueDates.length} payment{dayDueDates.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">No payments</div>
                          <div className="mt-2">
                            <div className="w-8 h-1 bg-secondary rounded-full mx-auto"></div>
                          </div>
                        </div>
                      )}

                      {/* Quick Action Hint */}
                      {dayDueDates.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <div className="text-[9px] text-muted-foreground text-center">
                            Double-tap to pay
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Week Summary */}
            <div className="bg-secondary/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Week Total</div>
                <div className="text-base font-bold text-foreground">
                  ${formatAmount(getWeekRange(currentWeekOffset).reduce((total, date) => {
                    return total + dueDates.filter(d => {
                      const dueDate = new Date(d.date);
                      return (
                        dueDate.getDate() === date.getDate() &&
                        dueDate.getMonth() === date.getMonth() &&
                        dueDate.getFullYear() === date.getFullYear()
                      );
                    }).reduce((sum, d) => sum + d.amount, 0);
                  }, 0))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Date Details */}
        {selectedDate && selectedDateDueDates.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </h4>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold text-foreground">
                  ${formatAmount(selectedDateDueDates.reduce((sum, d) => sum + d.amount, 0))}
                </span>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-1 hover:bg-secondary rounded transition-all hover:scale-110"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {selectedDateDueDates.map((dd, index) => (
                <div
                  key={dd.id}
                  className={`group flex items-center justify-between p-1.5 rounded-md border border-border/30 bg-secondary/10 hover:bg-secondary/30 transition-all animate-in fade-in slide-in-from-left-2`}
                  style={{ animationDelay: `${index * 20}ms`, animationFillMode: "forwards" }}
                >
                  <div className="flex items-start space-x-1.5 min-w-0">
                    <span className="text-sm flex-shrink-0 mt-0.5">{dd.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate max-w-20">{dd.name}</p>
                      <div className="flex items-center space-x-1">
                        <div className={`w-1 h-1 rounded-full ${getPriorityColor(dd.priority)}`} />
                        <span className="text-[10px] text-muted-foreground capitalize">{dd.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-1">
                    <span className="text-xs font-bold text-foreground">
                      ${formatAmount(dd.amount, true)}
                    </span>
                    {/* Quick Actions */}
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleQuickPay(dd)}
                        className="p-1 bg-green-500/20 hover:bg-green-500/40 rounded text-green-400 transition-all hover:scale-110"
                        title="Pay"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleSnooze(dd)}
                        className="p-1 bg-yellow-500/20 hover:bg-yellow-500/40 rounded text-yellow-400 transition-all hover:scale-110"
                        title="Snooze"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Actions Bar */}
            {selectedDateDueDates.length > 1 && (
              <div className="flex space-x-1 mt-1.5 pt-1.5 border-t border-border/20">
                <button
                  onClick={() => selectedDateDueDates.forEach(handleQuickPay)}
                  className="flex-1 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-md text-xs text-green-400 font-medium transition-all hover:scale-105 flex items-center justify-center space-x-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pay All</span>
                </button>
                <button
                  onClick={() => selectedDateDueDates.forEach(handleSnooze)}
                  className="flex-1 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-md text-xs text-yellow-400 font-medium transition-all hover:scale-105 flex items-center justify-center space-x-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Snooze All</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ultra Compact Legend & Controls */}
        <div className="mt-1 pt-1 border-t border-border/20 flex items-center justify-between text-[8px]">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-0.5">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
              <span className="text-muted-foreground">Crit</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <div className="w-1 h-1 bg-orange-500 rounded-full" />
              <span className="text-muted-foreground">High</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <div className="w-1 h-1 bg-yellow-500 rounded-full" />
              <span className="text-muted-foreground">Med</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <div className="w-1 h-1 bg-green-500 rounded-full" />
              <span className="text-muted-foreground">Low</span>
            </div>
          </div>
          
          {/* Quick Tips */}
          <div className="text-muted-foreground">
            {viewMode === "week" ? (
              selectedDate ? (
                <span>W Toggle • ←→ Week • Enter Pay • Esc Close</span>
              ) : (
                <span>W Toggle • ←→ Weeks • Home This Week</span>
              )
            ) : selectedDate ? (
              <span>W Toggle • ↑↓←→ Navigate • Enter Pay • Esc Close</span>
            ) : (
              <span>W Toggle • Hover Preview • Double-click Quick Pay</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}