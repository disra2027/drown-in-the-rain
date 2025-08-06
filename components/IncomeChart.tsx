"use client";

import { useEffect, useRef } from "react";
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

// Mock data for the chart
const mockChartData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  income: [4800, 5200, 4900, 5100, 5300, 4750, 5400, 5000, 5200, 5500, 5100, 5200],
  normalExpenses: [3200, 3400, 3100, 3300, 3500, 3200, 3600, 3400, 3300, 3700, 3400, 3500],
  monthlyExpenses: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450],
  yearlyExpenseAverage: [2800, 2850, 2900, 2950, 3000, 3050, 3100, 3150, 3200, 3250, 3300, 3350]
};

export default function IncomeChart() {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const data: ChartData<'bar' | 'line'> = {
    labels: mockChartData.months,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Monthly Income',
        data: mockChartData.income,
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        type: 'line' as const,
        label: 'Normal Expenses',
        data: mockChartData.normalExpenses,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'rgb(239, 68, 68)',
        pointRadius: 4
      },
      {
        type: 'line' as const,
        label: 'Monthly + Yearly Average',
        data: mockChartData.monthlyExpenses.map((monthly, index) => 
          monthly + mockChartData.yearlyExpenseAverage[index]
        ),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointBorderColor: 'rgb(147, 51, 234)',
        pointRadius: 3
      }
    ]
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Income vs Expenses Analysis',
        color: 'rgb(156, 163, 175)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: 'rgb(251, 191, 36)',
        bodyColor: 'rgb(229, 231, 235)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
          },
          afterBody: function(tooltipItems) {
            // const month = tooltipItems[0].label;
            const income = tooltipItems.find(item => item.dataset.label === 'Monthly Income')?.parsed.y || 0;
            const normalExpenses = tooltipItems.find(item => item.dataset.label === 'Normal Expenses')?.parsed.y || 0;
            const netIncome = income - normalExpenses;
            
            return [
              '',
              `Net Income: $${netIncome.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
              `Savings Rate: ${((netIncome / income) * 100).toFixed(1)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11
          },
          callback: function(value) {
            return '$' + (value as number).toLocaleString('en-US', { minimumFractionDigits: 0 });
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4
      },
      point: {
        hoverRadius: 6
      }
    }
  };

  // Calculate summary statistics
  const totalIncome = mockChartData.income.reduce((sum, val) => sum + val, 0);
  const totalNormalExpenses = mockChartData.normalExpenses.reduce((sum, val) => sum + val, 0);
  const avgMonthlyIncome = totalIncome / 12;
  const avgMonthlyExpenses = totalNormalExpenses / 12;
  const avgSavingsRate = ((avgMonthlyIncome - avgMonthlyExpenses) / avgMonthlyIncome) * 100;

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Chart Container */}
      <div className="bg-muted/20 rounded-lg p-3" style={{ height: '250px' }}>
        <Chart 
          ref={chartRef}
          type="bar" 
          data={data} 
          options={options} 
        />
      </div>

      {/* Simple Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-sm font-bold text-gold">
            ${avgMonthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground">Avg Income</p>
        </div>
        <div>
          <p className="text-sm font-bold text-red-400">
            ${avgMonthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground">Avg Expenses</p>
        </div>
        <div>
          <p className="text-sm font-bold text-green-400">
            {avgSavingsRate.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Savings Rate</p>
        </div>
      </div>
    </div>
  );
}