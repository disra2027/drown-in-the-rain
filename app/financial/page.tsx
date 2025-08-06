"use client";

import React, { useState, useRef } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import FinancialOverviewChart from "@/components/FinancialOverviewChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from "chart.js";
import { Chart } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function FinancialPage() {
  const [currentDebtPage, setCurrentDebtPage] = useState(0);
  const chartRef = useRef<ChartJS<'bar'>>(null);
  
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

  // Mock debt analytics data - showing downward trends
  const debtAnalyticsData = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    principal: [1850, 1820, 1790, 1760, 1730, 1700, 1670, 1640, 1610, 1580, 1550, 1520],
    interest: [980, 950, 920, 890, 860, 830, 800, 770, 740, 710, 680, 650],
    expenseAvg: [3400, 3350, 3300, 3250, 3200, 3150, 3100, 3050, 3000, 2950, 2900, 2850]
  };

  // Create gradient backgrounds for bars
  const createGradient = (ctx: CanvasRenderingContext2D, startColor: string, endColor: string) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
  };

  const chartData: ChartData<'bar' | 'line'> = {
    labels: debtAnalyticsData.months,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Principal Payment',
        data: debtAnalyticsData.principal,
        backgroundColor: (context) => {
          const canvas = context.chart.canvas;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            return createGradient(ctx, 'rgba(59, 130, 246, 0.9)', 'rgba(59, 130, 246, 0.3)');
          }
          return 'rgba(59, 130, 246, 0.8)';
        },
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        hoverBorderColor: 'rgb(37, 99, 235)',
        hoverBorderWidth: 3,
        order: 2
      },
      {
        type: 'bar' as const,
        label: 'Interest Payment',
        data: debtAnalyticsData.interest,
        backgroundColor: (context) => {
          const canvas = context.chart.canvas;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            return createGradient(ctx, 'rgba(239, 68, 68, 0.9)', 'rgba(239, 68, 68, 0.3)');
          }
          return 'rgba(239, 68, 68, 0.8)';
        },
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(239, 68, 68, 1)',
        hoverBorderColor: 'rgb(220, 38, 38)',
        hoverBorderWidth: 3,
        order: 3
      },
      {
        type: 'line' as const,
        label: 'Expense Average',
        data: debtAnalyticsData.expenseAvg,
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderWidth: 4,
        fill: {
          target: 'origin',
          above: 'rgba(251, 191, 36, 0.05)',
        },
        tension: 0.4,
        pointBackgroundColor: 'rgb(251, 191, 36)',
        pointBorderColor: 'rgb(245, 158, 11)',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(245, 158, 11)',
        pointHoverBorderColor: 'rgb(217, 119, 6)',
        pointHoverBorderWidth: 3,
        order: 1
      }
    ]
  };

  const chartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      delay: (context) => {
        return context.dataIndex * 100;
      }
    },
    hover: {
      animationDuration: 400,
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgb(251, 191, 36)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyColor: 'rgb(248, 250, 252)',
        bodyFont: {
          size: 13,
          weight: '500'
        },
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 2,
        cornerRadius: 12,
        caretPadding: 6,
        caretSize: 8,
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
        padding: {
          top: 12,
          right: 16,
          bottom: 12,
          left: 16
        },
        callbacks: {
          title: function(tooltipItems) {
            return `📅 ${tooltipItems[0].label}`;
          },
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            let icon = '';
            if (label.includes('Principal')) icon = '💰';
            else if (label.includes('Interest')) icon = '📈';
            else if (label.includes('Expense')) icon = '💸';
            
            return `${icon} ${label}: $${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
          },
          afterBody: function(tooltipItems) {
            const principal = tooltipItems.find(item => item.dataset.label === 'Principal Payment')?.parsed.y || 0;
            const interest = tooltipItems.find(item => item.dataset.label === 'Interest Payment')?.parsed.y || 0;
            const totalPayment = principal + interest;
            const principalRatio = principal > 0 ? ((principal / totalPayment) * 100).toFixed(1) : 0;
            
            return [
              '',
              `💳 Total Payment: $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
              `📊 Principal Ratio: ${principalRatio}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.08)',
          lineWidth: 1,
          drawBorder: false,
          drawTicks: false,
        },
        border: {
          display: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          padding: 12,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
          lineWidth: 1,
          drawBorder: false,
          drawTicks: false
        },
        border: {
          display: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          padding: 15,
          font: {
            size: 12,
            weight: '500'
          },
          callback: function(value) {
            const num = value as number;
            if (num >= 1000) {
              return '$' + (num / 1000).toFixed(1) + 'k';
            }
            return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0 });
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false,
        borderWidth: 2,
        hoverBorderWidth: 3
      },
      point: {
        radius: 6,
        hoverRadius: 8,
        borderWidth: 2,
        hoverBorderWidth: 3,
        hitRadius: 15,
        pointStyle: 'circle'
      },
      line: {
        borderJoinStyle: 'round',
        borderCapStyle: 'round',
        cubicInterpolationMode: 'monotone'
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/50 slide-in-from-top-1">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Financial</h1>
                <p className="text-xs text-muted-foreground">
                  Manage your finances
                </p>
              </div>
            </div>
            <button
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
              <span className="text-xl mr-2">🎯</span>
              <h2 className="text-lg font-semibold text-foreground">Goals</h2>
            </div>
            
            {/* Financial Goals Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Goal 1: Emergency Fund */}
              <div className="bg-gradient-to-br from-card to-green-500/10 rounded-xl p-4 border border-border hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">💰</span>
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
                  <span className="text-lg">✈️</span>
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
                  <span className="text-lg">🚗</span>
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
                  <span className="text-lg">📈</span>
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
              <span className="text-xl mr-2">💳</span>
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
          <div>
            {/* Header with Year Filter */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">📊</span>
                <h2 className="text-lg font-semibold text-foreground">Debt & Expense Analytics</h2>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  className="px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                >
                  <option value="2025">2025 (Current)</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="bg-card rounded-xl p-3 border border-border">
              <div style={{ height: '260px' }} className="relative mb-3">
                <Chart 
                  ref={chartRef}
                  type="bar" 
                  data={chartData} 
                  options={chartOptions} 
                />
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
                <div className="text-center">
                  <p className="text-sm font-semibold text-blue-400">$1,685</p>
                  <p className="text-xs text-muted-foreground">Avg Principal</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-red-400">$815</p>
                  <p className="text-xs text-muted-foreground">Avg Interest</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-yellow-400">$3,125</p>
                  <p className="text-xs text-muted-foreground">Avg Expenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}