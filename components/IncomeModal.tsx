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

export default function IncomeModal({ isOpen, onClose }: IncomeModalProps) {
  const [activeTab, setActiveTab] = useState<"list" | "chart">("list");

  const totalIncome = mockIncomeData.reduce((sum, income) => sum + income.amount, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Income"
      icon="💰"
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
              // TODO: Implement add income functionality
              console.log("Add income clicked");
            }}
            className="flex-1 py-3 px-4 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors focus-ring-luxury"
          >
            + Add Income
          </button>
        </div>
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
      ) : (
        <div>
          <IncomeChart />
        </div>
      )}
    </Modal>
  );
}