"use client";

import React, { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import FinancialOverviewChart from "@/components/FinancialOverviewChart";
import DebtAnalyticsChart from "@/components/DebtAnalyticsChart";
import CalendarDueDates from "@/components/CalendarDueDates";
import IncomingDueDates from "@/components/IncomingDueDates";
import FinancialAddModal, { type ComprehensiveFinancialEntry } from "@/components/FinancialAddModal";
import DailyIncomeExpenseChart from "@/components/DailyIncomeExpenseChart";
import { useScrollLock } from "@/hooks/useScrollLock";

export default function FinancialPage() {
  const [currentTab, setCurrentTab] = useState<'overall' | 'daily'>('overall');
  const [currentDebtPage, setCurrentDebtPage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Prevent body scroll when modal is open
  useScrollLock(isAddModalOpen);
  
  // Mock debt data - expanded for pagination
  const allDebts = [
    { id: 1, icon: "💳", name: "Credit Card", apr: "19.9%", amount: 3250, monthly: 156 },
    { id: 2, icon: "🎓", name: "Student Loan", apr: "4.5%", amount: 4200, monthly: 245 },
    { id: 3, icon: "🏦", name: "Personal Loan", apr: "8.2%", amount: 1300, monthly: 123 },
    { id: 4, icon: "🚗", name: "Car Loan", apr: "6.8%", amount: 12500, monthly: 385 },
    { id: 5, icon: "🏠", name: "Mortgage", apr: "3.2%", amount: 185000, monthly: 1250 },
    { id: 6, icon: "💍", name: "Wedding Loan", apr: "11.5%", amount: 8500, monthly: 425 },
  ];
  
  const debtsPerPage = 3;
  const totalPages = Math.ceil(allDebts.length / debtsPerPage);
  const currentDebts = allDebts.slice(
    currentDebtPage * debtsPerPage, 
    (currentDebtPage + 1) * debtsPerPage
  );
  
  const totalDebt = allDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalMonthly = allDebts.reduce((sum, debt) => sum + debt.monthly, 0);

  // Mock daily transactions data
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'amount' | 'category'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  const dailyTransactions: Array<{
    id: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    amount: number;
    time: string;
  }> = [
    { id: 1, type: 'expense', category: 'Food', description: 'Lunch at cafe', amount: 15.50, time: '12:30' },
    { id: 2, type: 'expense', category: 'Transport', description: 'Bus fare', amount: 3.25, time: '09:15' },
    { id: 3, type: 'income', category: 'Freelance', description: 'Client payment', amount: 250.00, time: '14:45' },
    { id: 4, type: 'expense', category: 'Entertainment', description: 'Movie tickets', amount: 28.00, time: '19:20' },
    { id: 5, type: 'income', category: 'Salary', description: 'Morning bonus', amount: 120.00, time: '10:00' },
    { id: 6, type: 'expense', category: 'Shopping', description: 'Groceries', amount: 45.80, time: '16:30' },
    { id: 7, type: 'income', category: 'Investment', description: 'Dividend', amount: 75.25, time: '11:15' },
    { id: 8, type: 'expense', category: 'Food', description: 'Coffee', amount: 4.50, time: '08:30' },
    { id: 9, type: 'expense', category: 'Transport', description: 'Uber', amount: 12.75, time: '21:45' },
    { id: 10, type: 'income', category: 'Side gig', description: 'Tutoring', amount: 60.00, time: '18:00' },
    { id: 11, type: 'expense', category: 'Food', description: 'Second coffee', amount: 5.25, time: '08:30' },
    { id: 12, type: 'expense', category: 'Transport', description: 'Parking fee', amount: 8.00, time: '12:30' },
    { id: 13, type: 'income', category: 'Tips', description: 'Cash tips', amount: 25.50, time: '18:00' },
    { id: 14, type: 'expense', category: 'Food', description: 'Snack', amount: 3.75, time: '14:45' },
    { id: 15, type: 'income', category: 'Refund', description: 'Store refund', amount: 15.00, time: '10:00' },
    { id: 16, type: 'expense', category: 'Food', description: 'Late night snack', amount: 8.75, time: '23:30' },
    { id: 17, type: 'expense', category: 'Transport', description: 'Late taxi home', amount: 15.50, time: '01:15' },
    { id: 18, type: 'expense', category: 'Food', description: 'Early breakfast', amount: 12.25, time: '06:45' },
    { id: 19, type: 'income', category: 'Gig work', description: 'Early delivery', amount: 35.00, time: '07:30' },
    { id: 20, type: 'expense', category: 'Food', description: 'Night coffee', amount: 4.25, time: '02:30' },
  ];

  // Get unique categories for filter dropdown
  const allCategories = Array.from(new Set(dailyTransactions.map(t => t.category))).sort();

  // Filter and sort transactions
  const filteredAndSortedTransactions = dailyTransactions
    .filter(transaction => {
      // Type filter
      if (transactionFilter !== 'all' && transaction.type !== transactionFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'all' && transaction.category !== categoryFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'time':
          comparison = a.time.localeCompare(b.time);
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Handler for adding new financial entries
  const handleAddFinancialEntry = (entry: ComprehensiveFinancialEntry) => {
    console.log("New comprehensive financial entry:", entry);
    console.log("Entry type:", entry.entryType);
    console.log("Entry details:", {
      id: entry.id,
      description: entry.description,
      amount: entry.amount,
      category: entry.category,
      date: entry.date,
      createdAt: entry.createdAt
    });
    
    // Type-specific logging
    switch (entry.entryType) {
      case 'income':
        console.log("Income details:", {
          incomeType: entry.incomeType,
          frequency: entry.frequency,
          taxDeductible: entry.taxDeductible,
          isRecurring: entry.isRecurring
        });
        break;
      case 'expense':
        console.log("Expense details:", {
          expenseCategory: entry.expenseCategory,
          taxDeductible: entry.taxDeductible,
          isBusinessExpense: entry.isBusinessExpense
        });
        break;
      case 'investment':
        console.log("Investment details:", {
          investmentType: entry.investmentType,
          riskLevel: entry.riskLevel
        });
        break;
      case 'debt':
        console.log("Debt details:", {
          debtType: entry.debtType,
          apr: entry.apr,
          monthlyPayment: entry.monthlyPayment,
          isSecured: entry.isSecured,
          remainingBalance: entry.remainingBalance
        });
        break;
      case 'goal':
        console.log("Goal details:", {
          goalType: entry.goalType,
          targetAmount: entry.targetAmount,
          currentAmount: entry.currentAmount,
          priority: entry.priority,
          goalCategory: entry.goalCategory
        });
        break;
    }
    
    // Here you would typically save to your data store/database
    // Example: saveFinancialEntry(entry);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/50 slide-in-from-top-1">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="financial-icon-circle-lg gold mr-3">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Financial</h1>
                <p className="text-xs text-muted-foreground">
                  Manage your finances
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 bg-gold text-background rounded-lg text-sm font-medium hover:bg-gold-light transition-all duration-300 focus-ring-luxury hover:scale-105 transform"
            >
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-4 py-2 bg-card/50 border-b border-border/30">
        <div className="flex space-x-1 bg-secondary/30 rounded-lg p-1 relative">
          {/* Active Tab Indicator */}
          <div 
            className={`absolute top-1 bottom-1 bg-card rounded-md shadow-sm transition-all duration-500 ease-out ${
              currentTab === 'overall' ? 'left-1 right-1/2 mr-0.5' : 'left-1/2 right-1 ml-0.5'
            }`}
          />
          
          <button
            onClick={() => setCurrentTab('overall')}
            className={`relative flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
              currentTab === 'overall'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="relative z-10">Overall</span>
          </button>
          <button
            onClick={() => setCurrentTab('daily')}
            className={`relative flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
              currentTab === 'daily'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="relative z-10">Daily Tracking</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 pb-28 relative overflow-hidden">
        {currentTab === 'overall' ? (
          <div 
            key="overall-tab"
            className="space-y-4 animate-in slide-in-from-right-6 fade-in duration-500"
          >
            <FinancialOverviewChart />
          
          {/* Current Month Financial Metrics - Ratio Line */}
          <div className="bg-card rounded-xl p-4 border border-border">
            {/* Ratio Line Visualization */}
            <div className="space-y-3">
              {/* Progress Bar Container */}
              <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                {/* Income (Green) - 54.4% */}
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-1000 ease-in-out transform hover:scale-y-110"
                  style={{ width: '54.4%' }}
                ></div>
                {/* Incoming Expenses (Yellow) - 9.3% */}
                <div 
                  className="absolute top-0 h-full bg-yellow-500 transition-all duration-1000 ease-in-out transform hover:scale-y-110"
                  style={{ left: '54.4%', width: '9.3%' }}
                ></div>
                {/* Expenses (Red) - 36.3% */}
                <div 
                  className="absolute top-0 h-full bg-red-500 transition-all duration-1000 ease-in-out transform hover:scale-y-110"
                  style={{ left: '63.7%', width: '36.3%' }}
                ></div>
              </div>
              
              {/* Values Below */}
              <div className="flex justify-between items-end text-xs">
                {/* Income */}
                <div className="flex flex-col items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mb-1"></div>
                  <span className="text-green-400 font-semibold">$5,200</span>
                  <span className="text-muted-foreground">Income</span>
                </div>
                
                {/* Incoming Expenses */}
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mb-1"></div>
                  <span className="text-yellow-400 font-semibold">$890</span>
                  <span className="text-muted-foreground">Incoming</span>
                </div>
                
                {/* Expenses */}
                <div className="flex flex-col items-end">
                  <div className="w-2 h-2 bg-red-500 rounded-full mb-1"></div>
                  <span className="text-red-400 font-semibold">$3,456</span>
                  <span className="text-muted-foreground">Expenses</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <div className="financial-icon-circle goal mr-3">
                <span className="text-lg">🎯</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Goals</h2>
            </div>
            
            {/* Financial Goals Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Goal 1: Emergency Fund */}
              <div className="bg-gradient-to-br from-card to-green-500/10 rounded-xl p-4 border border-border hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="financial-icon-circle income">
                    <span className="text-sm">💰</span>
                  </div>
                  <span className="text-xs text-green-400 font-medium">75%</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Emergency Fund</h3>
                <p className="text-xs text-muted-foreground mb-2">$7,500 / $10,000</p>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Goal 2: Vacation Savings */}
              <div className="bg-gradient-to-br from-card to-blue-500/10 rounded-xl p-4 border border-border hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="financial-icon-circle investment">
                    <span className="text-sm">✈️</span>
                  </div>
                  <span className="text-xs text-blue-400 font-medium">45%</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Vacation Fund</h3>
                <p className="text-xs text-muted-foreground mb-2">$2,250 / $5,000</p>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                </div>
              </div>

              {/* Goal 3: Car Down Payment */}
              <div className="bg-gradient-to-br from-card to-orange-500/10 rounded-xl p-4 border border-border hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="financial-icon-circle debt">
                    <span className="text-sm">🚗</span>
                  </div>
                  <span className="text-xs text-orange-400 font-medium">20%</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Car Payment</h3>
                <p className="text-xs text-muted-foreground mb-2">$3,000 / $15,000</p>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '20%' }}></div>
                </div>
              </div>

              {/* Goal 4: Investment Portfolio */}
              <div className="bg-gradient-to-br from-card to-purple-500/10 rounded-xl p-4 border border-border hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="financial-icon-circle goal">
                    <span className="text-sm">📈</span>
                  </div>
                  <span className="text-xs text-purple-400 font-medium">60%</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Investment</h3>
                <p className="text-xs text-muted-foreground mb-2">$12,000 / $20,000</p>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Debt Section */}
          <div>
            <div className="flex items-center mb-3">
              <div className="financial-icon-circle expense mr-3">
                <span className="text-lg">💳</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Overall Debt</h2>
            </div>
            
            {/* Debt Overview Card */}
            <div className="bg-gradient-to-br from-card to-red-500/10 rounded-xl p-4 border border-border mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Total Debt</h3>
                  <p className="text-2xl font-bold text-red-400">${totalDebt.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-lg font-semibold text-red-400">${totalMonthly.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Pagination Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">
                  Showing {currentDebtPage * debtsPerPage + 1}-{Math.min((currentDebtPage + 1) * debtsPerPage, allDebts.length)} of {allDebts.length} debts
                </p>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentDebtPage(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentDebtPage ? 'bg-red-400' : 'bg-secondary'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Debt Breakdown - Paginated */}
              <div className="space-y-3 min-h-[180px]">
                {currentDebts.map((debt, index) => (
                  <div 
                    key={debt.id} 
                    className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg transition-all duration-300 opacity-0 animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{debt.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{debt.name}</p>
                        <p className="text-xs text-muted-foreground">{debt.apr} APR</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-400">${debt.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">${debt.monthly}/mo</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                <button
                  onClick={() => setCurrentDebtPage(Math.max(0, currentDebtPage - 1))}
                  disabled={currentDebtPage === 0}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentDebtPage === 0 
                      ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed' 
                      : 'bg-secondary hover:bg-secondary/80 text-foreground hover:scale-105'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
                
                <span className="text-sm text-muted-foreground">
                  Page {currentDebtPage + 1} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentDebtPage(Math.min(totalPages - 1, currentDebtPage + 1))}
                  disabled={currentDebtPage === totalPages - 1}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentDebtPage === totalPages - 1 
                      ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed' 
                      : 'bg-secondary hover:bg-secondary/80 text-foreground hover:scale-105'
                  }`}
                >
                  <span>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Debt Progress */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Debt Payoff Progress</span>
                  <span className="text-sm font-medium text-green-400">-$15,250 this year</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: '8.5%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">8.5% reduction from initial ${(totalDebt + 15250).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Debt Analytics Chart */}
          <DebtAnalyticsChart 
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            height={260}
          />

          {/* Calendar Due Dates Component */}
          <CalendarDueDates />

          {/* Incoming Due Dates Component */}
          <IncomingDueDates />
          </div>
        ) : (
          <div 
            key="daily-tab"
            className="space-y-4 animate-in slide-in-from-left-6 fade-in duration-500 pb-16"
          >
            {/* Daily Financial Tracking */}
            
            {/* Daily Summary Cards */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Daily Summary</h2>
              
              {/* Daily Summary Cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-3 border border-green-500/20">
                  <div className="text-center">
                    <p className="text-xs text-green-400 font-medium mb-1">Income</p>
                    <p className="text-lg font-bold text-green-400">
                      +${filteredAndSortedTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-lg p-3 border border-red-500/20">
                  <div className="text-center">
                    <p className="text-xs text-red-400 font-medium mb-1">Expenses</p>
                    <p className="text-lg font-bold text-red-400">
                      -${filteredAndSortedTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-3 border border-blue-500/20">
                  <div className="text-center">
                    <p className="text-xs text-blue-400 font-medium mb-1">Net</p>
                    <p className="text-lg font-bold text-blue-400">
                      ${(filteredAndSortedTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
                         filteredAndSortedTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Income/Expense Chart */}
            <DailyIncomeExpenseChart 
              transactions={dailyTransactions}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />

            {/* Transaction List */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-md font-semibold text-foreground">Today&apos;s Transactions</h3>
                  <span className="text-xs text-muted-foreground">
                    {filteredAndSortedTransactions.length} transactions
                  </span>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary/30 hover:bg-secondary/50 text-muted-foreground hover:text-foreground rounded transition-all duration-200"
                >
                  <svg 
                    className={`w-3 h-3 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>
                    {showFilters ? 'Hide' : 'Filter'}
                  </span>
                </button>
              </div>

              {/* Filter and Sort Controls */}
              {showFilters && (
                <div className="space-y-3 mb-4 p-3 bg-secondary/20 rounded-lg animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex flex-wrap gap-3">
                  {/* Type Filter */}
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs text-muted-foreground mb-1">Type</label>
                    <select
                      value={transactionFilter}
                      onChange={(e) => setTransactionFilter(e.target.value as 'all' | 'income' | 'expense')}
                      className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="all">All Types</option>
                      <option value="income">Income Only</option>
                      <option value="expense">Expenses Only</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs text-muted-foreground mb-1">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="all">All Categories</option>
                      {allCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Sort By */}
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs text-muted-foreground mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'time' | 'amount' | 'category')}
                      className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="time">Time</option>
                      <option value="amount">Amount</option>
                      <option value="category">Category</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs text-muted-foreground mb-1">Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="desc">
                        {sortBy === 'time' ? 'Latest First' : sortBy === 'amount' ? 'Highest First' : 'Z to A'}
                      </option>
                      <option value="asc">
                        {sortBy === 'time' ? 'Earliest First' : sortBy === 'amount' ? 'Lowest First' : 'A to Z'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setTransactionFilter('all');
                      setCategoryFilter('all');
                      setSortBy('time');
                      setSortOrder('desc');
                    }}
                    className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 text-muted-foreground rounded transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => {
                      setTransactionFilter('income');
                      setSortBy('amount');
                      setSortOrder('desc');
                    }}
                    className="px-3 py-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded transition-colors"
                  >
                    Top Income
                  </button>
                  <button
                    onClick={() => {
                      setTransactionFilter('expense');
                      setSortBy('amount');
                      setSortOrder('desc');
                    }}
                    className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded transition-colors"
                  >
                    Top Expenses
                  </button>
                </div>
              </div>
              )}
              
              {filteredAndSortedTransactions.length > 0 ? (
                <div className="space-y-3">
                  {filteredAndSortedTransactions
                    .map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg transition-all duration-300 hover:bg-secondary/30"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '↗' : '↙'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-sm">
                    {transactionFilter === 'all' && categoryFilter === 'all' 
                      ? 'No transactions for this date' 
                      : 'No transactions match your filters'}
                  </p>
                  {(transactionFilter !== 'all' || categoryFilter !== 'all') && (
                    <button 
                      onClick={() => {
                        setTransactionFilter('all');
                        setCategoryFilter('all');
                      }}
                      className="mt-2 px-3 py-1 text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      <BottomNavigation />

      {/* Sticky Quick Add - Only for Daily Tab */}
      {currentTab === 'daily' && (
        <div className="fixed bottom-16 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-lg z-30 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="px-4 py-2.5">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Balance:</span>
              </div>
              <span className={`text-sm font-bold ${
                (dailyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
                 dailyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)) >= 0
                  ? 'text-green-400' : 'text-red-400'
              }`}>
                ${(dailyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
                   dailyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
              </span>
            </div>

            {/* Compact Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="group flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-green-500/15 to-green-500/10 hover:from-green-500/25 hover:to-green-500/20 rounded-lg border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <svg className="w-4 h-4 text-green-400 group-hover:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-green-400 font-medium text-sm group-hover:text-green-300">Income</span>
              </button>

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="group flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-red-500/15 to-red-500/10 hover:from-red-500/25 hover:to-red-500/20 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                  <svg className="w-4 h-4 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <span className="text-red-400 font-medium text-sm group-hover:text-red-300">Expense</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Financial Add Modal */}
      <FinancialAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEntry={handleAddFinancialEntry}
      />
    </div>
  );
}