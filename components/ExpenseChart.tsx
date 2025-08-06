"use client";

import { useEffect, useRef } from "react";
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

// Mock data for monthly expenses by category (stacked bars)
const mockMonthlyExpenseData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  categories: {
    Housing: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200],
    Transportation: [450, 520, 480, 510, 530, 465, 540, 495, 515, 550, 485, 520],
    Food: [280, 320, 290, 340, 350, 300, 370, 315, 310, 390, 325, 350],
    Utilities: [95, 110, 100, 105, 120, 140, 160, 150, 125, 110, 100, 105],
    Healthcare: [320, 80, 150, 200, 85, 300, 120, 180, 250, 100, 320, 180],
    Entertainment: [45, 30, 80, 65, 90, 120, 140, 110, 75, 85, 50, 40]
  }
};

export default function ExpenseChart() {
  const chartRef = useRef<ChartJS>(null);

  const data: ChartData<'bar'> = {
    labels: mockMonthlyExpenseData.months,
    datasets: [
      {
        label: 'Housing',
        data: mockMonthlyExpenseData.categories.Housing,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Transportation',
        data: mockMonthlyExpenseData.categories.Transportation,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Food',
        data: mockMonthlyExpenseData.categories.Food,
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
        borderColor: 'rgb(251, 146, 60)',
        borderWidth: 1
      },
      {
        label: 'Utilities',
        data: mockMonthlyExpenseData.categories.Utilities,
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
        borderColor: 'rgb(234, 179, 8)',
        borderWidth: 1
      },
      {
        label: 'Healthcare',
        data: mockMonthlyExpenseData.categories.Healthcare,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      },
      {
        label: 'Entertainment',
        data: mockMonthlyExpenseData.categories.Entertainment,
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 10
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 10
          },
          callback: function(value) {
            return '$' + (value as number).toLocaleString('en-US', { minimumFractionDigits: 0 });
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Monthly Expenses by Category',
        color: 'rgb(156, 163, 175)',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
          padding: 15,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: 'rgb(239, 68, 68)',
        bodyColor: 'rgb(229, 231, 235)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(tooltipItems) {
            return `${tooltipItems[0].label} Expenses`;
          },
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
          },
          afterBody: function(tooltipItems) {
            const monthIndex = tooltipItems[0].dataIndex;
            const monthTotal = Object.values(mockMonthlyExpenseData.categories)
              .reduce((sum, categoryData) => sum + categoryData[monthIndex], 0);
            
            return [``, `Monthly Total: $${monthTotal.toLocaleString('en-US', { minimumFractionDigits: 0 })}`];
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4
      }
    }
  };

  // Calculate totals from monthly data
  const categoryTotals = Object.entries(mockMonthlyExpenseData.categories).map(([category, amounts]) => ({
    category,
    total: amounts.reduce((sum, amount) => sum + amount, 0)
  }));
  
  const totalExpenses = categoryTotals.reduce((sum, { total }) => sum + total, 0);
  const highestCategory = categoryTotals.reduce((max, current) => 
    current.total > max.total ? current : max
  );
  
  // Calculate average monthly total
  const monthlyTotals = mockMonthlyExpenseData.months.map((_, monthIndex) => 
    Object.values(mockMonthlyExpenseData.categories).reduce((sum, categoryData) => sum + categoryData[monthIndex], 0)
  );
  const avgMonthlyExpense = monthlyTotals.reduce((sum, total) => sum + total, 0) / 12;

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
          <p className="text-sm font-bold text-red-400">
            ${avgMonthlyExpense.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground">Avg Monthly</p>
        </div>
        <div>
          <p className="text-sm font-bold text-red-400">
            {highestCategory.category}
          </p>
          <p className="text-xs text-muted-foreground">Top Category</p>
        </div>
        <div>
          <p className="text-sm font-bold text-red-400">
            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground">Year Total</p>
        </div>
      </div>
    </div>
  );
}