export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface FinancialData {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  investments: number;
  recentTransactions: Transaction[];
}

interface FinancialDashboardProps {
  data: FinancialData;
  onIncomeClick: () => void;
  onExpenseClick: () => void;
  onSavingsGoalClick: () => void;
  onInvestmentClick: () => void;
  onTransactionClick?: (transaction: Transaction) => void;
}

export default function FinancialDashboard({
  data,
  onIncomeClick,
  onExpenseClick,
  onSavingsGoalClick,
  onInvestmentClick,
  onTransactionClick
}: FinancialDashboardProps) {
  const savingsProgress = (data.balance / data.savingsGoal) * 100;
  
  // Currency formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  };
  
  return (
    <div className="space-y-4">
      {/* Financial Summary */}
      <div className="bg-gradient-to-br from-card to-gold/5 rounded-xl p-6 border border-border slide-in-from-left-1 delay-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Financial Overview</h3>
          <span className="text-2xl">💰</span>
        </div>
        
        {/* Balance */}
        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-gold">${data.balance.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Current Balance</p>
        </div>

        {/* Savings Goal Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Savings Goal</span>
            <span className="text-xs text-muted-foreground">
              ${data.balance.toLocaleString()} / ${data.savingsGoal.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(savingsProgress, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {savingsProgress.toFixed(1)}% complete
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onIncomeClick}
            className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg p-3 transition-all duration-200 focus-ring-luxury"
          >
            <div className="text-center">
              <div className="text-lg mb-1">📈</div>
              <p className="text-sm font-medium text-green-400">Add Income</p>
              <p className="text-xs text-muted-foreground">${data.monthlyIncome.toLocaleString()}/mo</p>
            </div>
          </button>
          
          <button
            onClick={onExpenseClick}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg p-3 transition-all duration-200 focus-ring-luxury"
          >
            <div className="text-center">
              <div className="text-lg mb-1">📉</div>
              <p className="text-sm font-medium text-red-400">Add Expense</p>
              <p className="text-xs text-muted-foreground">${data.monthlyExpenses.toLocaleString()}/mo</p>
            </div>
          </button>
        </div>
      </div>

      {/* Investment & Savings Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onSavingsGoalClick}
          className="bg-gradient-to-br from-card to-gold/10 rounded-xl p-4 border border-border hover:border-gold/50 transition-all duration-200 focus-ring-luxury text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🎯</span>
            <span className="text-xs text-muted-foreground">
              {savingsProgress.toFixed(0)}%
            </span>
          </div>
          <p className="text-sm font-medium text-foreground">Savings Goal</p>
          <p className="text-xs text-muted-foreground">${data.savingsGoal.toLocaleString()}</p>
        </button>

        <button
          onClick={onInvestmentClick}
          className="bg-gradient-to-br from-card to-blue-500/10 rounded-xl p-4 border border-border hover:border-blue-500/50 transition-all duration-200 focus-ring-luxury text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">📊</span>
            <span className="text-xs text-green-400">+5.2%</span>
          </div>
          <p className="text-sm font-medium text-foreground">Investments</p>
          <p className="text-xs text-muted-foreground">${data.investments.toLocaleString()}</p>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gradient-to-br from-card to-muted/10 rounded-xl p-4 border border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Recent Transactions
        </h4>
        <div className="space-y-2">
          {data.recentTransactions.slice(0, 3).map((transaction) => (
            <button
              key={transaction.id}
              onClick={() => onTransactionClick?.(transaction)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 text-left"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {transaction.type === 'income' ? '💵' : '💳'}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${
                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}