import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock data for tests
export const mockWeatherData = {
  location: "New York",
  temperature: 22,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  icon: "🌤️"
};

export const mockPlaylist = [
  { id: 1, title: "Test Song 1", artist: "Test Artist 1", duration: "3:30" },
  { id: 2, title: "Test Song 2", artist: "Test Artist 2", duration: "4:15" },
  { id: 3, title: "Test Song 3", artist: "Test Artist 3", duration: "2:45" }
];

export const mockFinancialData = {
  balance: 12847.32,
  monthlyIncome: 5200.00,
  monthlyExpenses: 3456.78,
  savingsGoal: 15000.00,
  investments: 8935.00,
  recentTransactions: [
    { id: 1, description: "Test Income", amount: 1000.00, type: "income" as const, date: "Today" },
    { id: 2, description: "Test Expense", amount: -100.00, type: "expense" as const, date: "Yesterday" }
  ]
};

export const mockProjects = [
  {
    id: 1,
    name: "Test Project 1",
    priority: "high" as const,
    color: "gold",
    progress: 75,
    tasks: [
      { id: 1, title: "Task 1", status: "completed" as const, dueDate: "Today", priority: "high" as const },
      { id: 2, title: "Task 2", status: "in-progress" as const, dueDate: "Tomorrow", priority: "medium" as const }
    ]
  },
  {
    id: 2,
    name: "Test Project 2", 
    priority: "medium" as const,
    color: "blue",
    progress: 45,
    tasks: [
      { id: 3, title: "Task 3", status: "pending" as const, dueDate: "Next week", priority: "low" as const }
    ]
  }
];

// Custom render function for tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock timers helper
export const advanceTimersByTime = (ms: number) => {
  jest.advanceTimersByTime(ms);
};

export const useFakeTimers = () => {
  jest.useFakeTimers();
};

export const useRealTimers = () => {
  jest.useRealTimers();
};

// Mock refs
export const createMockRef = <T = any>(current: T | null = null) => ({
  current
});

// Wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));