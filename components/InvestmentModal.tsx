"use client";

import { useState } from "react";
import Modal from "./Modal";
import { ModalSection, StatusCard, ProgressBar } from "./ModalComponents";

interface Investment {
  id: string;
  name: string;
  symbol: string;
  currentValue: number;
  purchasePrice: number;
  shares: number;
  percentChange: number;
  dayChange: number;
  category: string;
}

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockInvestments: Investment[] = [
  {
    id: "1",
    name: "Apple Inc.",
    symbol: "AAPL",
    currentValue: 2500.00,
    purchasePrice: 2200.00,
    shares: 10,
    percentChange: 13.64,
    dayChange: 1.24,
    category: "Technology"
  },
  {
    id: "2",
    name: "S&P 500 ETF",
    symbol: "SPY",
    currentValue: 3200.00,
    purchasePrice: 3000.00,
    shares: 8,
    percentChange: 6.67,
    dayChange: -0.45,
    category: "ETF"
  },
  {
    id: "3",
    name: "Tesla Inc.",
    symbol: "TSLA",
    currentValue: 1800.00,
    purchasePrice: 2000.00,
    shares: 5,
    percentChange: -10.00,
    dayChange: 2.15,
    category: "Technology"
  },
  {
    id: "4",
    name: "Microsoft Corp.",
    symbol: "MSFT",
    currentValue: 1434.50,
    purchasePrice: 1300.00,
    shares: 4,
    percentChange: 10.35,
    dayChange: -0.78,
    category: "Technology"
  }
];

export default function InvestmentModal({ 
  isOpen, 
  onClose
}: InvestmentModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Calculate portfolio metrics
  const totalCurrentValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalPurchaseValue = mockInvestments.reduce((sum, inv) => sum + inv.purchasePrice, 0);
  const totalGainLoss = totalCurrentValue - totalPurchaseValue;
  const totalPercentChange = ((totalCurrentValue - totalPurchaseValue) / totalPurchaseValue) * 100;
  
  // Get unique categories
  const categories = ["All", ...Array.from(new Set(mockInvestments.map(inv => inv.category)))];
  
  // Filter investments by category
  const filteredInvestments = selectedCategory === "All" 
    ? mockInvestments 
    : mockInvestments.filter(inv => inv.category === selectedCategory);
  
  // Calculate category breakdown
  const categoryBreakdown = mockInvestments.reduce((acc, inv) => {
    if (!acc[inv.category]) {
      acc[inv.category] = 0;
    }
    acc[inv.category] += inv.currentValue;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Investment Portfolio"
      icon="📊"
      size="lg"
    >
      <ModalSection
        icon="📈"
        description="Track your investment performance and portfolio allocation"
      />

      {/* Portfolio Overview */}
      <StatusCard>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold text-foreground">
              ${totalCurrentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
            <div>
              <p className={`text-lg font-bold ${totalGainLoss >= 0 ? 'text-gold' : 'text-red-400'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">Total Gain/Loss</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${totalPercentChange >= 0 ? 'text-gold' : 'text-red-400'}`}>
                {totalPercentChange >= 0 ? '+' : ''}{totalPercentChange.toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground">Overall Change</p>
            </div>
          </div>
        </div>
      </StatusCard>

      {/* Category Breakdown */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Portfolio Allocation</h4>
        <div className="space-y-2">
          {Object.entries(categoryBreakdown).map(([category, value]) => {
            const percentage = (value / totalCurrentValue) * 100;
            return (
              <div key={category}>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-foreground font-medium">{category}</span>
                  <span className="text-muted-foreground">
                    {percentage.toFixed(1)}% • ${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <ProgressBar 
                  value={percentage} 
                  max={100}
                  colorClass={category === "Technology" ? "bg-gold" : category === "ETF" ? "bg-gold-light" : "bg-gold-dark"}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-gold text-background shadow-lg'
                : 'bg-muted hover:bg-gold/20 text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Individual Investments */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Holdings</h4>
        
        {filteredInvestments.map((investment) => {
          const gainLoss = investment.currentValue - investment.purchasePrice;
          const isPositive = gainLoss >= 0;
          
          return (
            <div 
              key={investment.id}
              className="bg-card rounded-lg p-4 border border-border hover:border-gold/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-foreground">{investment.name}</h5>
                  <p className="text-sm text-muted-foreground">{investment.symbol} • {investment.shares} shares</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    ${investment.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className={`text-sm font-medium ${investment.dayChange >= 0 ? 'text-gold' : 'text-red-400'}`}>
                    {investment.dayChange >= 0 ? '+' : ''}{investment.dayChange}% today
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Purchase Price</p>
                  <p className="font-medium">${investment.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Gain/Loss</p>
                  <p className={`font-medium ${isPositive ? 'text-gold' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}${Math.abs(gainLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">% Change</p>
                  <p className={`font-medium ${investment.percentChange >= 0 ? 'text-gold' : 'text-red-400'}`}>
                    {investment.percentChange >= 0 ? '+' : ''}{investment.percentChange.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              {/* Visual performance indicator */}
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      investment.percentChange >= 10 ? 'bg-gold shimmer' : 
                      investment.percentChange >= 0 ? 'bg-gold-light' : 
                      'bg-red-400'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs(investment.percentChange) * 5, 100)}%`,
                      minWidth: '4px'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investment Tips */}
      <div className="bg-gold/5 border border-gold/30 rounded-lg p-4 mt-6">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Investment Tips
        </h4>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li className="flex items-start">
            <span className="text-gold mr-2">•</span>
            <span>Diversify across different sectors and asset classes</span>
          </li>
          <li className="flex items-start">
            <span className="text-gold mr-2">•</span>
            <span>Review and rebalance your portfolio quarterly</span>
          </li>
          <li className="flex items-start">
            <span className="text-gold mr-2">•</span>
            <span>Consider dollar-cost averaging for long-term growth</span>
          </li>
          <li className="flex items-start">
            <span className="text-gold mr-2">•</span>
            <span>Keep emotions in check during market volatility</span>
          </li>
        </ul>
      </div>
    </Modal>
  );
}