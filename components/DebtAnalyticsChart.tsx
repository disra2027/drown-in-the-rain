"use client";

import { useRef, useEffect } from "react";
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

// Mock debt analytics data by year - showing downward trends
const debtAnalyticsDataByYear: Record<number, {
  principal: number[];
  interest: number[];
  expenseAvg: number[];
}> = {
  2023: {
    principal: [2100, 2080, 2060, 2040, 2020, 2000, 1980, 1960, 1940, 1920, 1900, 1880],
    interest: [1100, 1080, 1060, 1040, 1020, 1000, 980, 960, 940, 920, 900, 880],
    expenseAvg: [3800, 3750, 3700, 3650, 3600, 3550, 3500, 3450, 3400, 3350, 3300, 3250]
  },
  2024: {
    principal: [1950, 1920, 1890, 1860, 1830, 1800, 1770, 1740, 1710, 1680, 1650, 1620],
    interest: [1050, 1020, 990, 960, 930, 900, 870, 840, 810, 780, 750, 720],
    expenseAvg: [3600, 3550, 3500, 3450, 3400, 3350, 3300, 3250, 3200, 3150, 3100, 3050]
  },
  2025: {
    principal: [1850, 1820, 1790, 1760, 1730, 1700, 1670, 1640, 1610, 1580, 1550, 1520],
    interest: [980, 950, 920, 890, 860, 830, 800, 770, 740, 710, 680, 650],
    expenseAvg: [3400, 3350, 3300, 3250, 3200, 3150, 3100, 3050, 3000, 2950, 2900, 2850]
  }
};

interface DebtAnalyticsChartProps {
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  height?: number;
}

export default function DebtAnalyticsChart({ 
  selectedYear = 2025, 
  onYearChange,
  height = 260 
}: DebtAnalyticsChartProps) {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  // Get current year's data
  const debtAnalyticsData = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ...debtAnalyticsDataByYear[selectedYear]
  };

  // Calculate averages
  const avgPrincipal = Math.round(debtAnalyticsData.principal.reduce((a, b) => a + b, 0) / 12);
  const avgInterest = Math.round(debtAnalyticsData.interest.reduce((a, b) => a + b, 0) / 12);
  const avgExpenses = Math.round(debtAnalyticsData.expenseAvg.reduce((a, b) => a + b, 0) / 12);

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
        backgroundColor: (context: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 2,
        cornerRadius: 12,
        caretPadding: 6,
        caretSize: 8,
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12,
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
            if (label.includes('Principal')) icon = '💰';
            else if (label.includes('Interest')) icon = '📈';
            else if (label.includes('Expense')) icon = '💸';
            
            // Handle null values
            if (value === null || value === undefined) {
              return `${icon} ${label}: No data`;
            }
            
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
            weight: 500
          }
        }
      },
      y: {
        stacked: true,
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

  // Cleanup on unmount or year change
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
  }, [selectedYear]);

  return (
    <div>
      {/* Header with Year Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-xl mr-2">📊</span>
          <h2 className="text-lg font-semibold text-foreground">Debt & Expense Analytics</h2>
        </div>
        {onYearChange && (
          <div className="flex items-center space-x-2">
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
            >
              <option value={2025}>2025 (Current)</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Chart Container */}
      <div className="bg-card rounded-xl p-3 border border-border">
        <div style={{ height: `${height}px` }} className="relative mb-3">
          <Chart 
            key={`debt-chart-${selectedYear}`}
            ref={chartRef}
            type="bar" 
            data={chartData} 
            options={chartOptions} 
          />
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-400">
              ${avgPrincipal.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Avg Principal</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-red-400">
              ${avgInterest.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Avg Interest</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-yellow-400">
              ${avgExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Avg Expenses</p>
          </div>
        </div>
      </div>
    </div>
  );
}