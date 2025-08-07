"use client";

import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  Title,
  Tooltip,
  Legend
);

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  time: string;
}

interface DailyIncomeExpenseChartProps {
  transactions: Transaction[];
  selectedDate: string;
  onDateChange?: (date: string) => void;
}

export default function DailyIncomeExpenseChart({ transactions, selectedDate, onDateChange }: DailyIncomeExpenseChartProps) {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  // Generate hourly data for 24 hours from 8 AM today to 8 AM next day
  const generateHourlyData = () => {
    const labels: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];
    
    // Create 24-hour sequence starting from 8 AM
    for (let i = 0; i < 24; i++) {
      const actualHour = (8 + i) % 24; // Start from 8 AM, wrap to next day
      const isNextDay = (8 + i) >= 24;
      
      let displayHour: number;
      let period: string;
      
      if (actualHour === 0) {
        displayHour = 12;
        period = 'AM';
      } else if (actualHour < 12) {
        displayHour = actualHour;
        period = 'AM';
      } else if (actualHour === 12) {
        displayHour = 12;
        period = 'PM';
      } else {
        displayHour = actualHour - 12;
        period = 'PM';
      }
      
      // Add day indicator for next day hours
      const dayIndicator = isNextDay ? '+1' : '';
      labels.push(`${displayHour}${period}${dayIndicator}`);
      incomeData.push(0);
      expenseData.push(0);
    }

    // Process transactions into hourly buckets
    transactions.forEach(transaction => {
      const [timeStr] = transaction.time.split(':');
      const transactionHour = parseInt(timeStr);
      
      // Find the index in our 8 AM to 8 AM sequence
      let bucketIndex = -1;
      
      if (transactionHour >= 8) {
        // Same day: 8 AM to 11 PM
        bucketIndex = transactionHour - 8;
      } else if (transactionHour >= 0 && transactionHour < 8) {
        // Next day: 12 AM to 7 AM
        bucketIndex = 16 + transactionHour; // 16 hours after 8 AM start
      }
      
      if (bucketIndex >= 0 && bucketIndex < 24) {
        if (transaction.type === 'income') {
          incomeData[bucketIndex] += transaction.amount;
        } else {
          expenseData[bucketIndex] += transaction.amount;
        }
      }
    });

    return { labels, income: incomeData, expenses: expenseData };
  };

  const currentData = generateHourlyData();
  const hasAnyData = currentData.income.some(val => val > 0) || currentData.expenses.some(val => val > 0);

  // Create gradient backgrounds for bars - same as FinancialOverviewChart
  const createGradient = (ctx: CanvasRenderingContext2D, startColor: string, endColor: string) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
  };

  const data: ChartData<'bar'> = {
    labels: currentData.labels,
    datasets: [
      {
        label: 'Income',
        data: currentData.income,
        backgroundColor: (context: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const canvas = context.chart.canvas;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            return createGradient(ctx, 'rgba(34, 197, 94, 0.8)', 'rgba(34, 197, 94, 0.2)');
          }
          return 'rgba(34, 197, 94, 0.6)';
        },
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 20,
      },
      {
        label: 'Expenses',
        data: currentData.expenses,
        backgroundColor: (context: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const canvas = context.chart.canvas;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            return createGradient(ctx, 'rgba(239, 68, 68, 0.8)', 'rgba(239, 68, 68, 0.2)');
          }
          return 'rgba(239, 68, 68, 0.6)';
        },
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 20,
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend to match your request
      },
      title: {
        display: false, // Hide title to match your request
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            const label = context[0].label;
            const isNextDay = label?.includes('+1');
            if (isNextDay) {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(nextDate.getDate() + 1);
              return `${label} - ${nextDate.toISOString().split('T')[0]}`;
            }
            return `${label} - ${selectedDate}`;
          },
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.8)',
          font: {
            size: 10,
            family: 'system-ui, -apple-system, sans-serif'
          },
          callback: function(value, index) {
            // Show every 2nd label since we have horizontal scroll space
            return index % 2 === 0 ? this.getLabelForValue(Number(value)) : '';
          }
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
          lineWidth: 1,
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.7)',
          font: {
            size: 11,
            family: 'system-ui, -apple-system, sans-serif'
          },
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    }
  };

  // Cleanup effect similar to FinancialOverviewChart
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch (error) {
          console.warn('Chart cleanup error:', error);
        }
        chartRef.current = null;
      }
    };
  }, [selectedDate]);

  // Update effect similar to FinancialOverviewChart
  useEffect(() => {
    if (chartRef.current) {
      try {
        chartRef.current.update('none');
      } catch (error) {
        console.warn('Chart update error:', error);
      }
    }
  }, [currentData]);


  return (
    <div>
      {/* Header with Date Selector - same structure as FinancialOverviewChart */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-xl mr-2">📊</span>
          <h2 className="text-lg font-semibold text-foreground">Daily Chart</h2>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          />
        </div>
      </div>

      {/* Chart Container - scrollable version */}
      <div className="relative overflow-x-auto">
        <div style={{ height: '250px', minWidth: '800px', width: '800px' }} className="relative">
          {!hasAnyData ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                  No Data Available
                </h3>
                <p className="text-sm text-muted-foreground">
                  No transactions found for {selectedDate}
                </p>
              </div>
            </div>
          ) : (
            <Chart
              ref={chartRef}
              type="bar"
              data={data}
              options={options}
            />
          )}
        </div>
      </div>
    </div>
  );
}