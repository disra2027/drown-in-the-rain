"use client";

import { useState } from "react";
import Modal from "./Modal";
import { ModalSection, ModalActions } from "./ModalComponents";
import IncomeChart from "./IncomeChart";

interface IncomeTrack {
  id: number;
  source: string;
  amount: number;
  type: string;
  date: string;
  description?: string;
}

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncome?: (income: Omit<IncomeTrack, 'id'>) => void;
}

// Mock income data
const mockIncomeData: IncomeTrack[] = [
  { id: 1, source: "Salary", amount: 5200.00, type: "monthly", date: "2025-01-01", description: "Full-time job" },
  { id: 2, source: "Freelance", amount: 1200.00, type: "project", date: "2024-12-28", description: "Web development project" },
  { id: 3, source: "Investment Returns", amount: 234.67, type: "passive", date: "2024-12-25", description: "Stock dividends" },
  { id: 4, source: "Side Business", amount: 890.00, type: "business", date: "2024-12-20", description: "Consulting services" },
  { id: 5, source: "Bonus", amount: 1500.00, type: "one-time", date: "2024-12-15", description: "Performance bonus" },
  { id: 6, source: "Rental Income", amount: 800.00, type: "monthly", date: "2024-12-01", description: "Property rental" },
  { id: 7, source: "Affiliate Marketing", amount: 156.34, type: "passive", date: "2024-11-28", description: "Commission earnings" },
  { id: 8, source: "Course Sales", amount: 450.00, type: "digital", date: "2024-11-25", description: "Online course revenue" }
];

export default function IncomeModal({ isOpen, onClose, onAddIncome }: IncomeModalProps) {
  const [activeTab, setActiveTab] = useState<"list" | "chart" | "add">("list");
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    type: "monthly",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const totalIncome = mockIncomeData.reduce((sum, income) => sum + income.amount, 0);

  const handleSubmit = () => {
    if (formData.source && formData.amount) {
      const newIncome: Omit<IncomeTrack, 'id'> = {
        source: formData.source,
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description,
        date: formData.date
      };
      onAddIncome?.(newIncome);
      setFormData({
        source: "",
        amount: "",
        type: "monthly",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      setActiveTab("list");
    }
  };

  const resetForm = () => {
    setFormData({
      source: "",
      amount: "",
      type: "monthly", 
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Income"
      icon="💰"
      size="md"
      footer={
        activeTab === "add" ? (
          <ModalActions
            onCancel={() => {
              resetForm();
              setActiveTab("list");
            }}
            onConfirm={handleSubmit}
            cancelLabel="Cancel"
            confirmLabel="Add Income"
          />
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors focus-ring-luxury"
            >
              Close
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className="flex-1 py-3 px-4 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors focus-ring-luxury"
            >
              + Add Income
            </button>
          </div>
        )
      }
    >
      {/* Total Income */}
      <div className="text-center mb-6">
        <p className="text-3xl font-bold text-gold">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 0 })}</p>
        <p className="text-sm text-muted-foreground">Total Income</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-lg bg-muted/30 p-1 mb-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "list"
              ? "bg-gold text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          List
        </button>
        <button
          onClick={() => setActiveTab("chart")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "chart"
              ? "bg-gold text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Chart
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "add"
              ? "bg-gold text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Add
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "list" ? (
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {mockIncomeData.slice(0, 6).map((income) => (
            <div 
              key={income.id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div>
                <p className="font-medium text-foreground">{income.source}</p>
                <p className="text-xs text-muted-foreground">{income.date}</p>
              </div>
              <p className="font-bold text-gold">
                +${income.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </p>
            </div>
          ))}
        </div>
      ) : activeTab === "chart" ? (
        <div>
          <IncomeChart />
        </div>
      ) : (
        <div className="space-y-4">
          <ModalSection 
            icon="💰"
            title="Add New Income"
            description="Track your income sources and amounts"
          />
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Income Source</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., Salary, Freelance, Investment"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Income Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="one-time">One-time</option>
                <option value="passive">Passive</option>
                <option value="project">Project</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details about this income"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}