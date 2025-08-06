import { render, screen, fireEvent } from '../../__tests__/utils/testUtils';
import FinancialDashboard from '../FinancialDashboard';
import { mockFinancialData } from '../../__tests__/utils/testUtils';

describe('FinancialDashboard', () => {
  const defaultProps = {
    data: mockFinancialData,
    onIncomeClick: jest.fn(),
    onExpenseClick: jest.fn(),
    onSavingsGoalClick: jest.fn(),
    onInvestmentClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render financial overview', () => {
    render(<FinancialDashboard {...defaultProps} />);

    expect(screen.getByText('Financial Overview')).toBeInTheDocument();
    expect(screen.getByText('💰')).toBeInTheDocument();
  });

  it('should display current balance', () => {
    render(<FinancialDashboard {...defaultProps} />);

    expect(screen.getByText('$12,847.32')).toBeInTheDocument();
    expect(screen.getByText('Current Balance')).toBeInTheDocument();
  });

  it('should show savings goal progress', () => {
    render(<FinancialDashboard {...defaultProps} />);

    expect(screen.getByText('Savings Goal')).toBeInTheDocument();
    expect(screen.getByText('$12,847.32 / $15,000')).toBeInTheDocument();
    
    // Calculate expected percentage: (12847.32 / 15000) * 100 = 85.65%
    expect(screen.getByText('85.6% complete')).toBeInTheDocument();
  });

  it('should display income and expense actions', () => {
    render(<FinancialDashboard {...defaultProps} />);

    expect(screen.getByText('Add Income')).toBeInTheDocument();
    expect(screen.getByText('Add Expense')).toBeInTheDocument();
    expect(screen.getByText('$5,200/mo')).toBeInTheDocument();
    expect(screen.getByText('$3,456.78/mo')).toBeInTheDocument();
  });

  it('should call onIncomeClick when income button is clicked', () => {
    render(<FinancialDashboard {...defaultProps} />);

    const incomeButton = screen.getByText('Add Income').closest('button');
    if (incomeButton) {
      fireEvent.click(incomeButton);
    }

    expect(defaultProps.onIncomeClick).toHaveBeenCalledTimes(1);
  });

  it('should call onExpenseClick when expense button is clicked', () => {
    render(<FinancialDashboard {...defaultProps} />);

    const expenseButton = screen.getByText('Add Expense').closest('button');
    if (expenseButton) {
      fireEvent.click(expenseButton);
    }

    expect(defaultProps.onExpenseClick).toHaveBeenCalledTimes(1);
  });

  it('should call onSavingsGoalClick when savings goal is clicked', () => {
    render(<FinancialDashboard {...defaultProps} />);

    const savingsButton = screen.getByText('Savings Goal').closest('button');
    if (savingsButton) {
      fireEvent.click(savingsButton);
    }

    expect(defaultProps.onSavingsGoalClick).toHaveBeenCalledTimes(1);
  });

  it('should call onInvestmentClick when investment button is clicked', () => {
    render(<FinancialDashboard {...defaultProps} />);

    const investmentButton = screen.getByText('Investments').closest('button');
    if (investmentButton) {
      fireEvent.click(investmentButton);
    }

    expect(defaultProps.onInvestmentClick).toHaveBeenCalledTimes(1);
  });

  it('should display investment information', () => {
    render(<FinancialDashboard {...defaultProps} />);

    expect(screen.getByText('Investments')).toBeInTheDocument();
    expect(screen.getByText('$8,934.50')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
  });

  it('should show recent transactions', () => {
    render(<FinancialDashboard {...defaultProps} />);

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('Test Income')).toBeInTheDocument();
    expect(screen.getByText('Test Expense')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.getByText('+$1000.00')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('should calculate savings progress correctly for different values', () => {
    const customData = {
      ...mockFinancialData,
      balance: 7500,
      savingsGoal: 10000
    };

    render(<FinancialDashboard {...defaultProps} data={customData} />);

    expect(screen.getByText('75.0% complete')).toBeInTheDocument();
    expect(screen.getByText('$7,500 / $10,000')).toBeInTheDocument();
  });

  it('should handle zero balance', () => {
    const zeroBalanceData = {
      ...mockFinancialData,
      balance: 0
    };

    render(<FinancialDashboard {...defaultProps} data={zeroBalanceData} />);

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('0.0% complete')).toBeInTheDocument();
  });

  it('should handle progress over 100%', () => {
    const overGoalData = {
      ...mockFinancialData,
      balance: 20000,
      savingsGoal: 15000
    };

    render(<FinancialDashboard {...defaultProps} data={overGoalData} />);

    expect(screen.getByText('133.3% complete')).toBeInTheDocument();
    expect(screen.getByText('$20,000 / $15,000')).toBeInTheDocument();
  });

  it('should display transaction amounts with correct styling', () => {
    render(<FinancialDashboard {...defaultProps} />);

    // Income should be green/positive
    const incomeAmount = screen.getByText('+$1000.00');
    expect(incomeAmount).toHaveClass('text-green-400');

    // Expense should be red/negative  
    const expenseAmount = screen.getByText('$100.00');
    expect(expenseAmount).toHaveClass('text-red-400');
  });

  it('should show transaction icons', () => {
    render(<FinancialDashboard {...defaultProps} />);

    expect(screen.getByText('💵')).toBeInTheDocument(); // Income icon
    expect(screen.getByText('💳')).toBeInTheDocument(); // Expense icon
  });

  it('should limit transactions display to 3 items', () => {
    const manyTransactionsData = {
      ...mockFinancialData,
      recentTransactions: [
        { id: 1, description: "Transaction 1", amount: 100.00, type: "income" as const, date: "Day 1" },
        { id: 2, description: "Transaction 2", amount: -50.00, type: "expense" as const, date: "Day 2" },
        { id: 3, description: "Transaction 3", amount: 200.00, type: "income" as const, date: "Day 3" },
        { id: 4, description: "Transaction 4", amount: -75.00, type: "expense" as const, date: "Day 4" },
        { id: 5, description: "Transaction 5", amount: 300.00, type: "income" as const, date: "Day 5" }
      ]
    };

    render(<FinancialDashboard {...defaultProps} data={manyTransactionsData} />);

    // Should only show first 3 transactions
    expect(screen.getByText('Transaction 1')).toBeInTheDocument();
    expect(screen.getByText('Transaction 2')).toBeInTheDocument();
    expect(screen.getByText('Transaction 3')).toBeInTheDocument();
    expect(screen.queryByText('Transaction 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Transaction 5')).not.toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    const largeNumberData = {
      ...mockFinancialData,
      balance: 1250000,
      monthlyIncome: 25000,
      monthlyExpenses: 15000,
      investments: 500000
    };

    render(<FinancialDashboard {...defaultProps} data={largeNumberData} />);

    expect(screen.getByText('$1,250,000')).toBeInTheDocument();
    expect(screen.getByText('$25,000/mo')).toBeInTheDocument();
    expect(screen.getByText('$15,000/mo')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();
  });
});