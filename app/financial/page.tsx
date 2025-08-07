"use client";

import React, { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import FinancialOverviewChart from "@/components/FinancialOverviewChart";
import DebtAnalyticsChart from "@/components/DebtAnalyticsChart";
import CalendarDueDates from "@/components/CalendarDueDates";
import IncomingDueDates from "@/components/IncomingDueDates";
import FinancialAddModal, { type ComprehensiveFinancialEntry } from "@/components/FinancialAddModal";

export default function FinancialPage() {
  const [currentDebtPage, setCurrentDebtPage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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

      {/* Main Content */}
      <main className="px-4 py-6 pb-20">
        <div className="space-y-4">
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
      </main>

      <BottomNavigation />
      
      {/* Financial Add Modal */}
      <FinancialAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEntry={handleAddFinancialEntry}
      />
    </div>
  );
}