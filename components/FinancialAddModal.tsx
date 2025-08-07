"use client";

import { useState } from "react";
import Modal from "./Modal";
import { ModalSection, ModalActions } from "./ModalComponents";

interface FinancialEntry {
  description: string;
  amount: string;
  category: string;
  date: string;
  type?: string;
  source?: string;
  goalName?: string;
  targetAmount?: string;
  currentAmount?: string;
  priority?: string;
  apr?: string;
  monthlyPayment?: string;
  frequency?: string;
  taxDeductible?: boolean;
  notes?: string;
  tags?: string[];
}

type FinancialEntryType = 'income' | 'expense' | 'investment' | 'debt' | 'goal' | 'transfer' | 'budget' | 'tax';

// Comprehensive financial entry data types
interface BaseFinancialEntry {
  id?: string;
  entryType: FinancialEntryType;
  description: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface IncomeEntry extends BaseFinancialEntry {
  entryType: 'income';
  incomeType: string;
  frequency: string;
  taxDeductible: boolean;
  source?: string;
  isRecurring?: boolean;
  nextOccurrence?: string;
}

interface ExpenseEntry extends BaseFinancialEntry {
  entryType: 'expense';
  expenseCategory: string;
  frequency: string;
  taxDeductible: boolean;
  isRecurring?: boolean;
  vendor?: string;
  paymentMethod?: string;
  isBusinessExpense?: boolean;
}

interface InvestmentEntry extends BaseFinancialEntry {
  entryType: 'investment';
  investmentType: string;
  riskLevel: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  accountType?: string;
  ticker?: string;
  shares?: number;
  pricePerShare?: number;
  expectedReturn?: number;
  maturityDate?: string;
}

interface DebtEntry extends BaseFinancialEntry {
  entryType: 'debt';
  debtType: string;
  apr: number;
  monthlyPayment?: number;
  remainingBalance: number;
  originalBalance?: number;
  minimumPayment?: number;
  isSecured: boolean;
  collateral?: string;
  lender?: string;
  maturityDate?: string;
}

interface GoalEntry extends BaseFinancialEntry {
  entryType: 'goal';
  goalType: string;
  targetAmount: number;
  currentAmount: number;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'someday';
  targetDate?: string;
  monthlyContribution?: number;
  isCompleted?: boolean;
  completedDate?: string;
  goalCategory: string;
}

export type ComprehensiveFinancialEntry = 
  | IncomeEntry 
  | ExpenseEntry 
  | InvestmentEntry 
  | DebtEntry 
  | GoalEntry;

interface FinancialAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry?: (entry: ComprehensiveFinancialEntry) => void;
}

const EXPENSE_CATEGORIES = [
  // Housing & Utilities
  { value: "rent", label: "Rent/Mortgage", icon: "🏠", type: "housing", taxDeductible: false },
  { value: "utilities", label: "Utilities", icon: "⚡", type: "housing", taxDeductible: false },
  { value: "maintenance", label: "Home Maintenance", icon: "🔧", type: "housing", taxDeductible: false },
  { value: "property-tax", label: "Property Tax", icon: "🏛️", type: "housing", taxDeductible: true },
  
  // Transportation
  { value: "gas", label: "Gas/Fuel", icon: "⛽", type: "transportation", taxDeductible: false },
  { value: "car-payment", label: "Car Payment", icon: "🚗", type: "transportation", taxDeductible: false },
  { value: "car-insurance", label: "Car Insurance", icon: "🚙", type: "transportation", taxDeductible: false },
  { value: "car-maintenance", label: "Car Maintenance", icon: "🔧", type: "transportation", taxDeductible: false },
  { value: "public-transport", label: "Public Transport", icon: "🚌", type: "transportation", taxDeductible: false },
  { value: "parking", label: "Parking/Tolls", icon: "🅿️", type: "transportation", taxDeductible: false },
  
  // Food & Dining
  { value: "groceries", label: "Groceries", icon: "🛒", type: "food", taxDeductible: false },
  { value: "restaurants", label: "Restaurants", icon: "🍽️", type: "food", taxDeductible: false },
  { value: "coffee", label: "Coffee/Drinks", icon: "☕", type: "food", taxDeductible: false },
  { value: "takeout", label: "Takeout/Delivery", icon: "🥡", type: "food", taxDeductible: false },
  
  // Healthcare
  { value: "medical", label: "Medical/Doctor", icon: "🏥", type: "healthcare", taxDeductible: true },
  { value: "dental", label: "Dental", icon: "🦷", type: "healthcare", taxDeductible: true },
  { value: "pharmacy", label: "Pharmacy/Medicine", icon: "💊", type: "healthcare", taxDeductible: true },
  { value: "health-insurance", label: "Health Insurance", icon: "🛡️", type: "healthcare", taxDeductible: true },
  
  // Personal Care
  { value: "clothing", label: "Clothing", icon: "👕", type: "personal", taxDeductible: false },
  { value: "haircare", label: "Hair/Beauty", icon: "💇", type: "personal", taxDeductible: false },
  { value: "fitness", label: "Fitness/Gym", icon: "🏋️", type: "personal", taxDeductible: false },
  
  // Entertainment & Lifestyle
  { value: "entertainment", label: "Entertainment", icon: "🎬", type: "lifestyle", taxDeductible: false },
  { value: "subscriptions", label: "Subscriptions", icon: "📱", type: "lifestyle", taxDeductible: false },
  { value: "hobbies", label: "Hobbies", icon: "🎨", type: "lifestyle", taxDeductible: false },
  { value: "travel", label: "Travel/Vacation", icon: "✈️", type: "lifestyle", taxDeductible: false },
  
  // Financial
  { value: "debt-payment", label: "Debt Payment", icon: "💳", type: "financial", taxDeductible: false },
  { value: "bank-fees", label: "Bank Fees", icon: "🏦", type: "financial", taxDeductible: false },
  { value: "taxes", label: "Taxes", icon: "📋", type: "financial", taxDeductible: false },
  { value: "insurance", label: "Insurance", icon: "🛡️", type: "financial", taxDeductible: true },
  
  // Business/Work
  { value: "office-supplies", label: "Office Supplies", icon: "📎", type: "business", taxDeductible: true },
  { value: "business-meals", label: "Business Meals", icon: "🍽️", type: "business", taxDeductible: true },
  { value: "professional-dev", label: "Professional Development", icon: "📚", type: "business", taxDeductible: true },
  
  // Other
  { value: "gifts", label: "Gifts/Donations", icon: "🎁", type: "other", taxDeductible: true },
  { value: "miscellaneous", label: "Miscellaneous", icon: "💸", type: "other", taxDeductible: false }
];

const INCOME_TYPES = [
  { value: "salary", label: "Salary/Wages", icon: "💼", frequency: "monthly" },
  { value: "freelance", label: "Freelance/Consulting", icon: "👨‍💻", frequency: "project" },
  { value: "business", label: "Business Income", icon: "🏢", frequency: "monthly" },
  { value: "investment", label: "Investment Returns", icon: "📈", frequency: "quarterly" },
  { value: "rental", label: "Rental Income", icon: "🏘️", frequency: "monthly" },
  { value: "dividends", label: "Dividends", icon: "💎", frequency: "quarterly" },
  { value: "royalties", label: "Royalties", icon: "🎵", frequency: "monthly" },
  { value: "pension", label: "Pension/Retirement", icon: "👴", frequency: "monthly" },
  { value: "bonus", label: "Bonus", icon: "🎁", frequency: "annual" },
  { value: "commission", label: "Commission", icon: "🤝", frequency: "monthly" },
  { value: "tips", label: "Tips/Gratuity", icon: "💸", frequency: "daily" },
  { value: "gifts", label: "Gifts/Inheritance", icon: "🎀", frequency: "one-time" },
  { value: "refunds", label: "Tax Refunds", icon: "🧾", frequency: "annual" },
  { value: "cashback", label: "Cashback/Rewards", icon: "💳", frequency: "monthly" },
  { value: "side-hustle", label: "Side Hustle", icon: "🚀", frequency: "weekly" },
  { value: "other", label: "Other Income", icon: "💵", frequency: "monthly" }
];

const INVESTMENT_CATEGORIES = [
  // Stocks & Equity
  { value: "individual-stocks", label: "Individual Stocks", icon: "📊", riskLevel: "high" },
  { value: "dividend-stocks", label: "Dividend Stocks", icon: "💎", riskLevel: "medium" },
  { value: "growth-stocks", label: "Growth Stocks", icon: "🚀", riskLevel: "high" },
  { value: "value-stocks", label: "Value Stocks", icon: "💰", riskLevel: "medium" },
  
  // Funds
  { value: "etf", label: "ETF", icon: "📈", riskLevel: "medium" },
  { value: "mutual-funds", label: "Mutual Funds", icon: "💼", riskLevel: "medium" },
  { value: "index-funds", label: "Index Funds", icon: "📉", riskLevel: "low" },
  { value: "target-date-funds", label: "Target Date Funds", icon: "🎯", riskLevel: "low" },
  
  // Fixed Income
  { value: "government-bonds", label: "Government Bonds", icon: "🏛️", riskLevel: "low" },
  { value: "corporate-bonds", label: "Corporate Bonds", icon: "🏢", riskLevel: "medium" },
  { value: "municipal-bonds", label: "Municipal Bonds", icon: "🏙️", riskLevel: "low" },
  { value: "treasury-bills", label: "Treasury Bills", icon: "📋", riskLevel: "low" },
  
  // Alternative Investments
  { value: "real-estate", label: "Real Estate", icon: "🏘️", riskLevel: "medium" },
  { value: "reits", label: "REITs", icon: "🏗️", riskLevel: "medium" },
  { value: "commodities", label: "Commodities", icon: "🥇", riskLevel: "high" },
  { value: "precious-metals", label: "Precious Metals", icon: "🪙", riskLevel: "medium" },
  
  // Cryptocurrency
  { value: "bitcoin", label: "Bitcoin", icon: "₿", riskLevel: "very-high" },
  { value: "ethereum", label: "Ethereum", icon: "💎", riskLevel: "very-high" },
  { value: "crypto-other", label: "Other Crypto", icon: "🪙", riskLevel: "very-high" },
  
  // Retirement Accounts
  { value: "401k", label: "401(k)", icon: "🏦", riskLevel: "medium" },
  { value: "ira", label: "Traditional IRA", icon: "🏛️", riskLevel: "medium" },
  { value: "roth-ira", label: "Roth IRA", icon: "💰", riskLevel: "medium" },
  { value: "pension", label: "Pension", icon: "👴", riskLevel: "low" },
  
  // Cash & Equivalents
  { value: "savings-account", label: "High-Yield Savings", icon: "🏦", riskLevel: "very-low" },
  { value: "cd", label: "Certificate of Deposit", icon: "📜", riskLevel: "very-low" },
  { value: "money-market", label: "Money Market", icon: "💵", riskLevel: "very-low" },
  
  // Other
  { value: "education", label: "529 Education", icon: "🎓", riskLevel: "medium" },
  { value: "health-savings", label: "HSA", icon: "🏥", riskLevel: "medium" },
  { value: "other", label: "Other Investment", icon: "📊", riskLevel: "medium" }
];

const DEBT_TYPES = [
  // Credit & Cards
  { value: "credit-card", label: "Credit Card", icon: "💳", typical_apr: "19.9", secured: false },
  { value: "store-card", label: "Store Credit Card", icon: "🏪", typical_apr: "24.9", secured: false },
  { value: "secured-card", label: "Secured Credit Card", icon: "🔒", typical_apr: "15.9", secured: true },
  
  // Loans - Secured
  { value: "mortgage", label: "Mortgage", icon: "🏠", typical_apr: "3.5", secured: true },
  { value: "home-equity", label: "Home Equity Loan", icon: "🏘️", typical_apr: "4.2", secured: true },
  { value: "heloc", label: "HELOC", icon: "🏗️", typical_apr: "4.8", secured: true },
  { value: "car-loan", label: "Auto Loan", icon: "🚗", typical_apr: "6.8", secured: true },
  { value: "boat-loan", label: "Boat/RV Loan", icon: "⛵", typical_apr: "8.5", secured: true },
  
  // Loans - Unsecured
  { value: "personal-loan", label: "Personal Loan", icon: "🏦", typical_apr: "12.5", secured: false },
  { value: "student-loan-federal", label: "Federal Student Loan", icon: "🎓", typical_apr: "4.5", secured: false },
  { value: "student-loan-private", label: "Private Student Loan", icon: "📚", typical_apr: "8.2", secured: false },
  { value: "medical", label: "Medical Debt", icon: "🏥", typical_apr: "0.0", secured: false },
  { value: "dental", label: "Dental Financing", icon: "🦷", typical_apr: "12.0", secured: false },
  
  // Business & Professional
  { value: "business-loan", label: "Business Loan", icon: "🏢", typical_apr: "9.5", secured: false },
  { value: "sba-loan", label: "SBA Loan", icon: "🏛️", typical_apr: "7.2", secured: true },
  { value: "equipment-loan", label: "Equipment Financing", icon: "⚙️", typical_apr: "8.8", secured: true },
  
  // Alternative & High-Interest
  { value: "payday-loan", label: "Payday Loan", icon: "💸", typical_apr: "400.0", secured: false },
  { value: "title-loan", label: "Title Loan", icon: "🔑", typical_apr: "300.0", secured: true },
  { value: "pawn-shop", label: "Pawn Shop Loan", icon: "💍", typical_apr: "200.0", secured: true },
  
  // Family & Personal
  { value: "family-loan", label: "Family/Friend Loan", icon: "👨‍👩‍👧‍👦", typical_apr: "0.0", secured: false },
  { value: "irs-debt", label: "IRS/Tax Debt", icon: "📋", typical_apr: "6.0", secured: false },
  { value: "other", label: "Other Debt", icon: "📝", typical_apr: "10.0", secured: false }
];

const GOAL_TYPES = [
  // Emergency & Safety
  { value: "emergency-fund", label: "Emergency Fund", icon: "🚨", category: "safety", typical_target: "6_months_expenses" },
  { value: "insurance", label: "Insurance Coverage", icon: "🛡️", category: "safety", typical_target: "policy_amount" },
  
  // Retirement & Long-term
  { value: "retirement", label: "Retirement Savings", icon: "👴", category: "retirement", typical_target: "25x_annual_expenses" },
  { value: "401k", label: "401(k) Goal", icon: "🏦", category: "retirement", typical_target: "employer_match" },
  { value: "roth-ira", label: "Roth IRA Goal", icon: "💰", category: "retirement", typical_target: "annual_limit" },
  
  // Major Purchases
  { value: "house-down-payment", label: "House Down Payment", icon: "🏠", category: "purchase", typical_target: "20_percent_home_value" },
  { value: "car-purchase", label: "Car Purchase", icon: "🚗", category: "purchase", typical_target: "vehicle_price" },
  { value: "home-renovation", label: "Home Renovation", icon: "🔨", category: "purchase", typical_target: "project_cost" },
  
  // Education & Career
  { value: "education", label: "Education Fund", icon: "🎓", category: "education", typical_target: "tuition_costs" },
  { value: "child-education", label: "Child's Education", icon: "👶", category: "education", typical_target: "529_plan" },
  { value: "professional-development", label: "Career Development", icon: "📈", category: "education", typical_target: "course_costs" },
  
  // Lifestyle & Travel
  { value: "vacation", label: "Vacation Fund", icon: "✈️", category: "lifestyle", typical_target: "trip_budget" },
  { value: "wedding", label: "Wedding Fund", icon: "💒", category: "lifestyle", typical_target: "ceremony_budget" },
  { value: "hobby", label: "Hobby Fund", icon: "🎨", category: "lifestyle", typical_target: "equipment_cost" },
  
  // Health & Wellness
  { value: "health-savings", label: "Health Savings (HSA)", icon: "🏥", category: "health", typical_target: "hsa_limit" },
  { value: "medical-procedures", label: "Medical Procedures", icon: "⚕️", category: "health", typical_target: "procedure_cost" },
  { value: "fitness-goals", label: "Fitness Goals", icon: "🏋️", category: "health", typical_target: "gym_equipment" },
  
  // Debt & Financial Freedom
  { value: "debt-payoff", label: "Debt Payoff", icon: "💳", category: "debt", typical_target: "total_debt_amount" },
  { value: "mortgage-payoff", label: "Mortgage Payoff", icon: "🏘️", category: "debt", typical_target: "remaining_balance" },
  { value: "financial-independence", label: "Financial Independence", icon: "🗽", category: "freedom", typical_target: "fire_number" },
  
  // Business & Entrepreneurship
  { value: "business-startup", label: "Business Startup", icon: "🚀", category: "business", typical_target: "startup_capital" },
  { value: "equipment-purchase", label: "Business Equipment", icon: "⚙️", category: "business", typical_target: "equipment_cost" },
  { value: "business-expansion", label: "Business Expansion", icon: "📊", category: "business", typical_target: "expansion_budget" },
  
  // Family & Legacy
  { value: "family-support", label: "Family Support", icon: "👨‍👩‍👧‍👦", category: "family", typical_target: "support_amount" },
  { value: "estate-planning", label: "Estate Planning", icon: "📜", category: "family", typical_target: "legal_fees" },
  { value: "charity", label: "Charitable Giving", icon: "❤️", category: "giving", typical_target: "annual_donation" },
  
  // Other
  { value: "other", label: "Other Goal", icon: "🎯", category: "other", typical_target: "custom_amount" }
];

const GOAL_PRIORITIES = [
  { value: "critical", label: "Critical", icon: "🚨", description: "Must achieve ASAP" },
  { value: "high", label: "High Priority", icon: "🔴", description: "Very important" },
  { value: "medium", label: "Medium Priority", icon: "🟡", description: "Moderate importance" },
  { value: "low", label: "Low Priority", icon: "🟢", description: "Nice to have" },
  { value: "someday", label: "Someday/Maybe", icon: "💭", description: "Future consideration" }
];


export default function FinancialAddModal({ isOpen, onClose, onAddEntry }: FinancialAddModalProps) {
  const [activeTab, setActiveTab] = useState<"income" | "expense" | "investment" | "debt" | "goal">("income");
  const [formData, setFormData] = useState<FinancialEntry>({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    type: "",
    source: "",
    goalName: "",
    targetAmount: "",
    currentAmount: "",
    priority: "medium",
    apr: "",
    monthlyPayment: "",
    frequency: "monthly",
    taxDeductible: false,
    notes: "",
    tags: []
  });

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      type: "",
      source: "",
      goalName: "",
      targetAmount: "",
      currentAmount: "",
      priority: "medium",
      apr: "",
      monthlyPayment: "",
      frequency: "monthly",
      taxDeductible: false,
      notes: "",
      tags: []
    });
  };

  const handleSubmit = () => {
    const isFormValid = () => {
      switch (activeTab) {
        case "income":
          return formData.description && formData.amount && formData.type;
        case "expense":
          return formData.description && formData.amount && formData.category;
        case "investment":
          return formData.description && formData.amount && formData.category;
        case "debt":
          return formData.description && formData.amount && formData.category && formData.apr;
        case "goal":
          return formData.goalName && formData.targetAmount && formData.priority;
        default:
          return false;
      }
    };

    if (isFormValid()) {
      const baseEntry = {
        id: crypto.randomUUID(),
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        notes: formData.notes,
        tags: formData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      let comprehensiveEntry: ComprehensiveFinancialEntry;

      switch (activeTab) {
        case 'income':
          comprehensiveEntry = {
            ...baseEntry,
            entryType: 'income',
            incomeType: formData.type || '',
            frequency: formData.frequency || 'monthly',
            taxDeductible: formData.taxDeductible || false,
            source: formData.source,
            isRecurring: formData.frequency !== 'one-time'
          } as IncomeEntry;
          break;

        case 'expense':
          const expenseCategory = EXPENSE_CATEGORIES.find(cat => cat.value === formData.category);
          comprehensiveEntry = {
            ...baseEntry,
            entryType: 'expense',
            expenseCategory: formData.category,
            frequency: formData.frequency || 'monthly',
            taxDeductible: expenseCategory?.taxDeductible || false,
            isRecurring: formData.frequency !== 'one-time',
            isBusinessExpense: expenseCategory?.type === 'business'
          } as ExpenseEntry;
          break;

        case 'investment':
          const investmentCategory = INVESTMENT_CATEGORIES.find(cat => cat.value === formData.category);
          comprehensiveEntry = {
            ...baseEntry,
            entryType: 'investment',
            investmentType: formData.category,
            riskLevel: investmentCategory?.riskLevel || 'medium'
          } as InvestmentEntry;
          break;

        case 'debt':
          const debtCategory = DEBT_TYPES.find(debt => debt.value === formData.category);
          comprehensiveEntry = {
            ...baseEntry,
            entryType: 'debt',
            debtType: formData.category,
            apr: parseFloat(formData.apr || '0'),
            monthlyPayment: formData.monthlyPayment ? parseFloat(formData.monthlyPayment) : undefined,
            remainingBalance: parseFloat(formData.amount),
            originalBalance: parseFloat(formData.amount),
            isSecured: debtCategory?.secured || false
          } as DebtEntry;
          break;

        case 'goal':
          const goalType = GOAL_TYPES.find(goal => goal.value === formData.category);
          comprehensiveEntry = {
            ...baseEntry,
            entryType: 'goal',
            goalType: formData.category,
            targetAmount: parseFloat(formData.targetAmount || '0'),
            currentAmount: parseFloat(formData.currentAmount || '0'),
            priority: formData.priority as GoalEntry['priority'],
            targetDate: formData.date,
            isCompleted: false,
            goalCategory: goalType?.category || 'other'
          } as GoalEntry;
          break;

        default:
          return;
      }

      onAddEntry?.(comprehensiveEntry);
      resetForm();
      onClose();
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "income": return "💰";
      case "expense": return "💸";
      case "investment": return "📈";
      case "debt": return "💳";
      case "goal": return "🎯";
      default: return "💰";
    }
  };

  const getTabColor = (tab: string, isActive: boolean) => {
    const baseClasses = "hover:scale-110 transform";
    
    if (isActive) {
      switch (tab) {
        case "income": return `bg-green-500 text-white border-2 border-green-400 shadow-lg shadow-green-500/30 ${baseClasses}`;
        case "expense": return `bg-red-500 text-white border-2 border-red-400 shadow-lg shadow-red-500/30 ${baseClasses}`;
        case "investment": return `bg-blue-500 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/30 ${baseClasses}`;
        case "debt": return `bg-orange-500 text-white border-2 border-orange-400 shadow-lg shadow-orange-500/30 ${baseClasses}`;
        case "goal": return `bg-purple-500 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/30 ${baseClasses}`;
        default: return `bg-gold text-background border-2 border-gold-light shadow-lg shadow-gold/30 ${baseClasses}`;
      }
    }
    
    // Inactive state
    switch (tab) {
      case "income": return `bg-green-500/10 text-green-400 border-2 border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40 ${baseClasses}`;
      case "expense": return `bg-red-500/10 text-red-400 border-2 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 ${baseClasses}`;
      case "investment": return `bg-blue-500/10 text-blue-400 border-2 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 ${baseClasses}`;
      case "debt": return `bg-orange-500/10 text-orange-400 border-2 border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40 ${baseClasses}`;
      case "goal": return `bg-purple-500/10 text-purple-400 border-2 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 ${baseClasses}`;
      default: return `bg-muted text-muted-foreground border-2 border-border hover:bg-muted/80 hover:text-foreground ${baseClasses}`;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Financial Entry"
      icon="💰"
      size="lg"
      className="mx-2 sm:mx-4"
      footer={
        <ModalActions
          onCancel={handleCancel}
          onConfirm={handleSubmit}
          cancelLabel="Cancel"
          confirmLabel={`Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        />
      }
    >
      {/* Tab Navigation */}
      <div className="flex justify-center space-x-3 mb-4">
        {["income", "expense", "investment", "debt", "goal"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${getTabColor(tab, activeTab === tab)}`}
          >
            <span>{getTabIcon(tab)}</span>
          </button>
        ))}
      </div>

      {/* Income Tab */}
      {activeTab === "income" && (
        <div className="space-y-3">
          <ModalSection 
            icon="💰"
            title="Add Income"
            description="Track your income sources and earnings"
          />
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Income Source</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Salary, Freelance Project, Bonus"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Income Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {INCOME_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-3 sm:p-3 rounded-lg border text-left transition-all duration-200 min-h-[44px] flex items-center ${
                      formData.type === type.value
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : "bg-muted/30 border-border hover:border-green-500/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="financial-icon-circle income">
                        <span className="text-sm">{type.icon}</span>
                      </div>
                      <span className="text-sm font-medium flex-1">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Tab */}
      {activeTab === "expense" && (
        <div className="space-y-3">
          <ModalSection 
            icon="💸"
            title="Add Expense"
            description="Track your spending and categorize expenses"
          />
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Expense Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Grocery Shopping, Gas, Rent"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {EXPENSE_CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    className={`p-3 sm:p-3 rounded-lg border text-left transition-all duration-200 min-h-[44px] flex items-center ${
                      formData.category === category.value
                        ? "bg-red-500/20 border-red-500 text-red-400"
                        : "bg-muted/30 border-border hover:border-red-500/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Tab */}
      {activeTab === "investment" && (
        <div className="space-y-3">
          <ModalSection 
            icon="📈"
            title="Add Investment"
            description="Track your investments and portfolio"
          />
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Investment Name</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Apple Stock, Bitcoin, Real Estate"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amount Invested</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Investment Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {INVESTMENT_CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    className={`p-3 sm:p-3 rounded-lg border text-left transition-all duration-200 min-h-[44px] flex items-center ${
                      formData.category === category.value
                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                        : "bg-muted/30 border-border hover:border-blue-500/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debt Tab */}
      {activeTab === "debt" && (
        <div className="space-y-3">
          <ModalSection 
            icon="💳"
            title="Add Debt"
            description="Track your debts and liabilities"
          />
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Debt Name</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Credit Card, Student Loan, Car Loan"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Total Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">APR (%)</label>
                <input
                  type="number"
                  value={formData.apr}
                  onChange={(e) => setFormData(prev => ({ ...prev, apr: e.target.value }))}
                  placeholder="19.9"
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Monthly Payment</label>
                <input
                  type="number"
                  value={formData.monthlyPayment}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                  placeholder="250.00"
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Debt Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {DEBT_TYPES.map((debt) => (
                  <button
                    key={debt.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: debt.value }))}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 min-h-[44px] flex items-center ${
                      formData.category === debt.value
                        ? "bg-orange-500/20 border-orange-500 text-orange-400"
                        : "bg-muted/30 border-border hover:border-orange-500/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{debt.icon}</span>
                      <span className="text-sm font-medium">{debt.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Goal Tab */}
      {activeTab === "goal" && (
        <div className="space-y-3">
          <ModalSection 
            icon="🎯"
            title="Add Financial Goal"
            description="Set and track your financial objectives"
          />
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Goal Name</label>
              <input
                type="text"
                value={formData.goalName}
                onChange={(e) => setFormData(prev => ({ ...prev, goalName: e.target.value }))}
                placeholder="e.g., Emergency Fund, Vacation, Car Down Payment"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Goal Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {GOAL_TYPES.map((goalType) => (
                  <button
                    key={goalType.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      category: goalType.value,
                      goalName: prev.goalName || goalType.label 
                    }))}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 min-h-[44px] flex items-center ${
                      formData.category === goalType.value
                        ? "bg-purple-500/20 border-purple-500 text-purple-400"
                        : "bg-muted/30 border-border hover:border-purple-500/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{goalType.icon}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium block">{goalType.label}</span>
                        <span className="text-xs text-muted-foreground capitalize">{goalType.category}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Target Amount</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  placeholder="10,000.00"
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Amount</label>
                <input
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Priority Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {GOAL_PRIORITIES.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 min-h-[60px] flex flex-col items-center justify-center ${
                      formData.priority === priority.value
                        ? "bg-purple-500/20 border-purple-500 text-purple-400"
                        : "bg-muted/30 border-border hover:border-purple-500/50"
                    }`}
                  >
                    <span className="text-lg mb-1">{priority.icon}</span>
                    <span className="text-xs font-medium text-center">{priority.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Target Date (Optional)</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details about this goal..."
                className="w-full px-3 py-2 bg-muted rounded-lg border border-muted-foreground/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}