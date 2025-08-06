"use client";

import { useState } from "react";
import Modal from "./Modal";
import ExpenseChart from "./ExpenseChart";

interface ExpenseItem {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock expense data sorted by amount (highest first)
const mockExpenseData: ExpenseItem[] = [
  { id: 1, description: "Rent Payment", amount: 1200.00, category: "Housing", date: "2025-01-01" },
  { id: 2, description: "Car Payment", amount: 450.00, category: "Transportation", date: "2025-01-01" },
  { id: 3, description: "Health Insurance", amount: 320.00, category: "Healthcare", date: "2024-12-28" },
  { id: 4, description: "Grocery Shopping", amount: 285.50, category: "Food", date: "2024-12-30" },
  { id: 5, description: "Gas Station", amount: 65.00, category: "Transportation", date: "2024-12-29" },
  { id: 6, description: "Internet Bill", amount: 59.99, category: "Utilities", date: "2024-12-25" },
  { id: 7, description: "Phone Bill", amount: 45.00, category: "Utilities", date: "2024-12-26" },
  { id: 8, description: "Coffee Shop", amount: 24.50, category: "Food", date: "2024-12-31" },
  { id: 9, description: "Netflix Subscription", amount: 15.99, category: "Entertainment", date: "2024-12-20" },
  { id: 10, description: "Spotify Premium", amount: 9.99, category: "Entertainment", date: "2024-12-15" }
].sort((a, b) => b.amount - a.amount);

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Housing": return "🏠";
    case "Transportation": return "🚗";
    case "Food": return "🍽️";
    case "Utilities": return "⚡";
    case "Healthcare": return "🏥";
    case "Entertainment": return "🎬";
    case "Shopping": return "🛒";
    case "Education": return "📚";
    default: return "💸";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Housing": return "bg-blue-500/20 text-blue-400";
    case "Transportation": return "bg-green-500/20 text-green-400";
    case "Food": return "bg-orange-500/20 text-orange-400";
    case "Utilities": return "bg-yellow-500/20 text-yellow-400";
    case "Healthcare": return "bg-red-500/20 text-red-400";
    case "Entertainment": return "bg-purple-500/20 text-purple-400";
    case "Shopping": return "bg-pink-500/20 text-pink-400";
    case "Education": return "bg-indigo-500/20 text-indigo-400";
    default: return "bg-muted/20 text-muted-foreground";
  }
};

export default function ExpenseModal({ isOpen, onClose }: ExpenseModalProps) {
  const [activeTab, setActiveTab] = useState<"list" | "chart">("list");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const totalExpenses = mockExpenseData.reduce((sum, expense) => sum + expense.amount, 0);
  const categories = ["All", ...Array.from(new Set(mockExpenseData.map(expense => expense.category)))];
  
  const filteredExpenses = selectedCategory === "All" 
    ? mockExpenseData 
    : mockExpenseData.filter(expense => expense.category === selectedCategory);

  const categoryTotals = categories.slice(1).map(category => ({
    category,
    total: mockExpenseData
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).sort((a, b) => b.total - a.total);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Expenses"
      icon="💸"
      size="md"
      footer={
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors focus-ring-luxury"
          >
            Close
          </button>
          <button
            onClick={() => {
              // TODO: Implement add expense functionality
              console.log("Add expense clicked");
            }}
            className="flex-1 py-3 px-4 bg-red-500 text-background rounded-lg font-medium hover:bg-red-600 transition-colors focus-ring-luxury"
          >
            + Add Expense
          </button>
        </div>
      }
    >
      {/* Total Expenses */}
      <div className="text-center mb-6">
        <p className="text-3xl font-bold text-red-400">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}</p>
        <p className="text-sm text-muted-foreground">Total Expenses</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-lg bg-muted/30 p-1 mb-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "list"
              ? "bg-red-500 text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          List
        </button>
        <button
          onClick={() => setActiveTab("chart")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "chart"
              ? "bg-red-500 text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Chart
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "list" ? (
        <div>
          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-red-500 text-background"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {category !== "All" && getCategoryIcon(category)} {category}
                </button>
              ))}
            </div>
          </div>

          {/* Category Summary (when "All" is selected) */}
          {selectedCategory === "All" && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Top Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {categoryTotals.slice(0, 4).map(({ category, total }) => (
                  <div key={category} className="bg-muted/30 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{getCategoryIcon(category)}</span>
                        <span className="text-xs font-medium text-foreground">{category}</span>
                      </div>
                      <span className="text-xs font-bold text-red-400">
                        ${total.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1 mt-1">
                      <div 
                        className="bg-red-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(total / totalExpenses) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expense List */}
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            <p className="text-sm font-medium text-foreground mb-2">
              {selectedCategory === "All" ? "All Expenses" : `${selectedCategory} Expenses`}
              <span className="text-muted-foreground font-normal"> ({filteredExpenses.length})</span>
            </p>
            
            {filteredExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-border/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{getCategoryIcon(expense.category)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{expense.description}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{expense.date}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-bold text-red-400 flex-shrink-0 ml-4">
                  -${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
            ))}
            
            {filteredExpenses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No expenses found for {selectedCategory}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <ExpenseChart />
        </div>
      )}
    </Modal>
  );
}