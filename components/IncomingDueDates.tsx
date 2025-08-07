"use client";

import React, { useState, useMemo } from "react";

interface DueDate {
  id: string;
  category: "bill" | "payment" | "subscription" | "loan" | "other";
  name: string;
  amount: number;
  dueDate: Date;
  recurring: boolean;
  frequency?: "monthly" | "weekly" | "yearly" | "quarterly";
  status: "pending" | "paid" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  icon: string;
  notes?: string;
}

interface IncomingDueDatesProps {
  dueDates?: DueDate[];
}

export default function IncomingDueDates({ dueDates: propDueDates }: IncomingDueDatesProps) {
  const [filter, setFilter] = useState<"all" | "week" | "month" | "overdue">("week");
  const [categoryFilter, setCategoryFilter] = useState<"all" | DueDate["category"]>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "priority">("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Mock data if no props provided
  const mockDueDates: DueDate[] = [
    {
      id: "1",
      category: "bill",
      name: "Electricity Bill",
      amount: 125.50,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      recurring: true,
      frequency: "monthly",
      status: "pending",
      priority: "high",
      icon: "⚡",
      notes: "Summer rate applied"
    },
    {
      id: "2",
      category: "subscription",
      name: "Netflix Premium",
      amount: 19.99,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      recurring: true,
      frequency: "monthly",
      status: "pending",
      priority: "low",
      icon: "📺"
    },
    {
      id: "3",
      category: "loan",
      name: "Car Loan Payment",
      amount: 385.00,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      recurring: true,
      frequency: "monthly",
      status: "pending",
      priority: "critical",
      icon: "🚗"
    },
    {
      id: "4",
      category: "bill",
      name: "Internet Service",
      amount: 79.99,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day overdue
      recurring: true,
      frequency: "monthly",
      status: "overdue",
      priority: "critical",
      icon: "🌐"
    },
    {
      id: "5",
      category: "payment",
      name: "Credit Card Minimum",
      amount: 156.00,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      recurring: true,
      frequency: "monthly",
      status: "pending",
      priority: "high",
      icon: "💳"
    },
    {
      id: "6",
      category: "subscription",
      name: "Spotify Family",
      amount: 15.99,
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      recurring: true,
      frequency: "monthly",
      status: "pending",
      priority: "low",
      icon: "🎵"
    },
    {
      id: "7",
      category: "bill",
      name: "Water Bill",
      amount: 45.00,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      recurring: true,
      frequency: "quarterly",
      status: "pending",
      priority: "medium",
      icon: "💧"
    },
    {
      id: "8",
      category: "loan",
      name: "Student Loan",
      amount: 245.00,
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      recurring: true,
      frequency: "monthly",
      status: "pending",
      priority: "high",
      icon: "🎓"
    },
    {
      id: "9",
      category: "other",
      name: "Gym Membership",
      amount: 49.99,
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      recurring: true,
      frequency: "monthly",
      status: "pending",
      priority: "low",
      icon: "💪"
    },
    {
      id: "10",
      category: "bill",
      name: "Phone Bill",
      amount: 65.00,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      recurring: true,
      frequency: "monthly",
      status: "pending",
      priority: "medium",
      icon: "📱"
    }
  ];

  const dueDates = propDueDates || mockDueDates;

  // Calculate days until due
  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get urgency color based on days until due
  const getUrgencyColor = (daysUntilDue: number, priority: DueDate["priority"]) => {
    if (daysUntilDue < 0) return "text-red-500 bg-red-500/10 border-red-500/30";
    if (daysUntilDue <= 2 || priority === "critical") return "text-orange-500 bg-orange-500/10 border-orange-500/30";
    if (daysUntilDue <= 7 || priority === "high") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
    if (priority === "medium") return "text-blue-500 bg-blue-500/10 border-blue-500/30";
    return "text-green-500 bg-green-500/10 border-green-500/30";
  };

  // Get status badge color
  const getStatusColor = (status: DueDate["status"]) => {
    switch (status) {
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "paid": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  // Filter and sort due dates
  const filteredAndSortedDueDates = useMemo(() => {
    let filtered = [...dueDates];

    // Apply time filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "week":
        filtered = filtered.filter(d => {
          const days = getDaysUntilDue(d.dueDate);
          return days >= -1 && days <= 7;
        });
        break;
      case "month":
        filtered = filtered.filter(d => {
          const days = getDaysUntilDue(d.dueDate);
          return days >= -1 && days <= 30;
        });
        break;
      case "overdue":
        filtered = filtered.filter(d => d.status === "overdue");
        break;
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(d => d.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.amount - a.amount;
        case "priority":
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default: // date
          return a.dueDate.getTime() - b.dueDate.getTime();
      }
    });

    return filtered;
  }, [dueDates, filter, categoryFilter, sortBy]);

  // Calculate totals
  const totals = useMemo(() => {
    const total = filteredAndSortedDueDates.reduce((sum, d) => sum + d.amount, 0);
    const overdue = filteredAndSortedDueDates.filter(d => d.status === "overdue").reduce((sum, d) => sum + d.amount, 0);
    const upcoming = filteredAndSortedDueDates.filter(d => d.status === "pending").reduce((sum, d) => sum + d.amount, 0);
    return { total, overdue, upcoming };
  }, [filteredAndSortedDueDates]);

  // Format date
  const formatDate = (date: Date) => {
    const days = getDaysUntilDue(date);
    const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    if (days < 0) return `${formatted} (${Math.abs(days)} days overdue)`;
    if (days === 0) return `${formatted} (Today)`;
    if (days === 1) return `${formatted} (Tomorrow)`;
    return `${formatted} (in ${days} days)`;
  };

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-xl mr-2">📅</span>
            <h2 className="text-lg font-semibold text-foreground">Upcoming Due Dates</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortBy(sortBy === "date" ? "amount" : sortBy === "amount" ? "priority" : "date")}
              className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              title={`Sort by ${sortBy}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V8" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex space-x-1 bg-secondary rounded-lg p-1">
            {(["all", "week", "month", "overdue"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filter === f 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : f === "week" ? "7 Days" : f === "month" ? "30 Days" : "Overdue"}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
            className="px-3 py-1 bg-secondary rounded-lg text-xs font-medium border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            <option value="bill">Bills</option>
            <option value="payment">Payments</option>
            <option value="subscription">Subscriptions</option>
            <option value="loan">Loans</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-secondary/50 rounded-lg p-2 border border-border">
            <p className="text-xs text-muted-foreground">Total Due</p>
            <p className="text-lg font-bold text-foreground">${totals.total.toFixed(2)}</p>
          </div>
          <div className="bg-red-500/10 rounded-lg p-2 border border-red-500/30">
            <p className="text-xs text-red-400">Overdue</p>
            <p className="text-lg font-bold text-red-400">${totals.overdue.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-500/30">
            <p className="text-xs text-yellow-400">Upcoming</p>
            <p className="text-lg font-bold text-yellow-400">${totals.upcoming.toFixed(2)}</p>
          </div>
        </div>

        {/* Due Dates List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredAndSortedDueDates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No due dates found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredAndSortedDueDates.map((item, index) => {
              const daysUntilDue = getDaysUntilDue(item.dueDate);
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-lg border p-3 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                    getUrgencyColor(daysUntilDue, item.priority)
                  } opacity-0 animate-in fade-in slide-in-from-left-2`}
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-foreground">{item.name}</p>
                          {item.recurring && (
                            <span className="text-xs px-1.5 py-0.5 bg-secondary rounded-full text-muted-foreground">
                              {item.frequency}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(item.dueDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${item.amount.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <svg 
                        className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border/30 space-y-2 animate-in slide-in-from-top-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="capitalize">{item.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Priority:</span>
                        <span className="capitalize">{item.priority}</span>
                      </div>
                      {item.notes && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Notes:</span>
                          <p className="mt-1 text-xs">{item.notes}</p>
                        </div>
                      )}
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors">
                          Mark Paid
                        </button>
                        <button className="flex-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}