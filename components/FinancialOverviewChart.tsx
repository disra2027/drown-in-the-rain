"use client";

import { useEffect, useRef, useState } from "react";
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

// Mock data for different years
const mockFinancialDataByYear: Record<number, {
  months: string[];
  income: (number | null)[];
  expenses: (number | null)[];
}> = {
  2022: {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    income: [4200, 4400, 4600, 4700, 4900, 5000, 5200, 5300, 5500, 5600, 5800, 5900],
    expenses: [2400, 4200, 2200, 4800, 2800, 6200, 2600, 5400, 3000, 6800, 3200, 6000]
  },
  2023: {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    income: [4800, 5000, 5200, 5300, 5500, 5600, 5800, 5900, 6100, 6200, 6400, 6500],
    expenses: [2800, 4800, 2500, 5200, 3100, 6800, 2900, 5900, 3400, 7200, 3600, 6500]
  },
  2024: {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    income: [5200, 5400, 5600, 5700, 5900, 6000, 6200, 6300, 6500, 6600, 6800, 6900],
    expenses: [3200, 5200, 2900, 5600, 3500, 7200, 3300, 5800, 3400, 7000, 3500, 6400]
  },
  2025: {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    income: [5800, 6000, 6200, 6300, 6500, 6600, 6800, 6900, null, null, null, null],
    expenses: [3600, 5600, 3200, 6000, 3800, 7600, 3600, 6300, null, null, null, null]
  },
  2026: {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    income: [null, null, null, null, null, null, null, null, null, null, null, null],
    expenses: [null, null, null, null, null, null, null, null, null, null, null, null]
  }
};

// Get current month (0-indexed) - Currently August 2025 (month 7)
const getCurrentMonth = () => 7; // August (0-indexed)
const getCurrentYear = () => 2025;

// Calculate 3-month moving average for expenses (handling null values)
const calculateMovingAverage = (data: (number | null)[], windowSize: number = 3): (number | null)[] => {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    // Skip null values
    if (data[i] === null) {
      result.push(null);
      continue;
    }
    
    const validValues = [];
    for (let j = Math.max(0, i - windowSize + 1); j <= i; j++) {
      if (data[j] !== null) {
        validValues.push(data[j] as number);
      }
    }
    
    if (validValues.length > 0) {
      result.push(validValues.reduce((sum, val) => sum + val, 0) / validValues.length);
    } else {
      result.push(null);
    }
  }
  return result;
};

export default function FinancialOverviewChart() {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  
  // Get available years
  const availableYears = Object.keys(mockFinancialDataByYear).map(Number).sort((a, b) => b - a);
  
  // Get data for selected year
  const getDataForYear = (year: number) => {
    const yearData = mockFinancialDataByYear[year];
    if (!yearData) return mockFinancialDataByYear[2024]; // fallback
    
    // For current year, show data up to current month, null for future months
    if (year === getCurrentYear()) {
      const currentMonth = getCurrentMonth();
      const income = yearData.income.map((value, index) => 
        index <= currentMonth ? value : null
      );
      const expenses = yearData.expenses.map((value, index) => 
        index <= currentMonth ? value : null
      );
      return { ...yearData, income, expenses };
    }
    
    return yearData;
  };
  
  const currentData = getDataForYear(selectedYear);
  const expenseMovingAverage = calculateMovingAverage(currentData.expenses, 3);
  
  // Check if data is empty or all null
  const hasAnyData = currentData.income.some(val => val !== null) || 
                     currentData.expenses.some(val => val !== null);
  
  // Count non-null data points
  const dataPointsCount = currentData.income.filter(val => val !== null).length;

  // Create gradient backgrounds for bars
  const createGradient = (ctx: CanvasRenderingContext2D, startColor: string, endColor: string) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
  };

  const data: ChartData<'bar' | 'line'> = {
    labels: currentData.months,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Income',
        data: currentData.income,
        backgroundColor: (context: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const canvas = context.chart.canvas;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            return createGradient(ctx, 'rgba(34, 197, 94, 0.9)', 'rgba(34, 197, 94, 0.3)');
          }
          return 'rgba(34, 197, 94, 0.8)';
        },
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        hoverBorderColor: 'rgb(22, 163, 74)',
        hoverBorderWidth: 3,
        order: 2
      },
      {
        type: 'bar' as const,
        label: 'Expenses',
        data: currentData.expenses,
        backgroundColor: (context: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
        label: 'Expense Moving Average (3M)',
        data: expenseMovingAverage,
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderWidth: 4,
        fill: {
          target: 'origin',
          above: 'rgba(251, 191, 36, 0.05)',
        },
        tension: 0.4,
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHoverBackgroundColor: 'transparent',
        pointHoverBorderColor: 'transparent',
        pointHoverBorderWidth: 0,
        order: 1,
      }
    ]
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 0,
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
    animations: {
      y: {
        easing: 'easeInOutElastic',
        from: (ctx: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          if (ctx.type === 'data' && ctx.mode === 'default') {
            const chart = ctx.chart;
            const {chartArea} = chart;
            if (!chartArea) {
              return null;
            }
            return chartArea.bottom;
          }
          return null;
        }
      }
    },
    hover: {
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
          weight: 500
        },
        footerColor: 'rgb(156, 163, 175)',
        footerFont: {
          size: 11,
          weight: 400
        },
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 2,
        cornerRadius: 12,
        caretPadding: 6,
        caretSize: 8,
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12,
        boxPadding: 3,
        usePointStyle: false,
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
            if (label.includes('Income')) icon = '💰';
            else if (label.includes('Expense')) icon = '💸';
            else if (label.includes('Moving')) icon = '📈';
            
            // Handle null values
            if (value === null || value === undefined) {
              return `${icon} ${label}: No data`;
            }
            
            return `${icon} ${label}: $${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
          },
          afterBody: function(tooltipItems) {
            const incomeItem = tooltipItems.find(item => item.dataset.label === 'Income');
            const expenseItem = tooltipItems.find(item => item.dataset.label === 'Expenses');
            const movingAvgItem = tooltipItems.find(item => item.dataset.label === 'Expense Moving Average (3M)');
            
            const income = incomeItem?.parsed?.y ?? 0;
            const expenses = expenseItem?.parsed?.y ?? 0;
            const movingAvg = movingAvgItem?.parsed?.y ?? 0;
            
            // Only show calculations if we have valid data
            if (income === null && expenses === null) {
              return ['', '📊 No data available for this period'];
            }
            
            const netIncome = (income || 0) - (expenses || 0);
            const savingsRate = income > 0 ? ((netIncome / income) * 100).toFixed(1) : 0;
            
            const result = [''];
            
            if (income !== null && expenses !== null) {
              result.push(`💵 Net Income: $${netIncome.toLocaleString('en-US', { minimumFractionDigits: 0 })}`);
              result.push(`📊 Savings Rate: ${savingsRate}%`);
            }
            
            if (movingAvg !== null && movingAvg > 0) {
              result.push(`📉 3M Avg: $${movingAvg.toLocaleString('en-US', { minimumFractionDigits: 0 })}`);
            }
            
            return result;
          },
          footer: function() {
            return 'Click to view details';
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.08)',
          lineWidth: 1,
          drawTicks: false,
          tickLength: 0
        },
        border: {
          display: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          padding: 12,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
          lineWidth: 1,
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
            weight: 500
          },
          callback: function(value) {
            const num = value as number;
            if (num === null || num === undefined || isNaN(num)) {
              return '';
            }
            if (num >= 1000) {
              return '$' + (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
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
        hoverRadius: 10,
        borderWidth: 3,
        hoverBorderWidth: 4,
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


  useEffect(() => {
    // Cleanup function to properly destroy chart when component unmounts or year changes
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
  }, [selectedYear]);

  // Additional effect to handle chart updates when data changes
  useEffect(() => {
    if (chartRef.current) {
      try {
        chartRef.current.update('none'); // Update without animation to prevent issues
      } catch (error) {
        console.warn('Chart update error:', error);
      }
    }
  }, [currentData]);

  return (
    <div>
      {/* Header with Year Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-xl mr-2">📊</span>
          <h2 className="text-lg font-semibold text-foreground">Financial Overview</h2>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year} {year === getCurrentYear() ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div style={{ height: '200px' }} className="relative">
        {!hasAnyData ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                No Data Available
              </h3>
              <p className="text-sm text-muted-foreground">
                No financial data found for {selectedYear}
              </p>
            </div>
          </div>
        ) : dataPointsCount === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">⏳</div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground">
                Data for {selectedYear} will be available as months progress
              </p>
            </div>
          </div>
        ) : (
          <Chart 
            key={`chart-${selectedYear}`}
            ref={chartRef}
            type="bar" 
            data={data} 
            options={options} 
          />
        )}
      </div>
    </div>
  );
}