"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

// Import and re-export Transaction type from FinancialDashboard to maintain consistency
import type { Transaction } from "./FinancialDashboard";
export type { Transaction };

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
  onDelete?: (transactionId: number) => void;
}

export default function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
  onSave,
  onDelete
}: TransactionDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(null);

  // Reset editing state when transaction changes
  useEffect(() => {
    if (transaction) {
      setIsEditing(false);
      setEditedTransaction(null);
    }
  }, [transaction]);

  if (!transaction || !isOpen) return null;

  const handleEdit = () => {
    setEditedTransaction({ ...transaction });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTransaction) {
      onSave(editedTransaction);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTransaction(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(transaction.id);
      onClose();
    }
  };

  const currentTransaction = editedTransaction || transaction;
  const isIncome = currentTransaction.type === 'income';

  // Currency formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  // Category options
  const incomeCategories = [
    'Salary', 'Business', 'Investment', 'Freelance', 'Bonus', 'Gift', 'Other Income'
  ];

  const expenseCategories = [
    'Food', 'Transportation', 'Housing', 'Utilities', 'Healthcare', 'Entertainment', 
    'Shopping', 'Education', 'Insurance', 'Subscription', 'Other Expense'
  ];

  const getCategoryOptions = () => {
    return currentTransaction.type === 'income' ? incomeCategories : expenseCategories;
  };

  return (
    <Modal 
      onClose={onClose}
      title={isEditing ? "Edit Transaction" : "Transaction Details"}
      footer={
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-muted-foreground rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  Delete
                </button>
              )}
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
              >
                Edit Transaction
              </button>
            </>
          )}
        </div>
      }
    >
      {/* Amount and Type Display */}
      <div className="text-center mb-6">
        <div className={`text-3xl font-bold mb-2 ${
          isIncome ? 'text-green-400' : 'text-red-400'
        }`}>
          {isIncome ? '+' : ''}{formatCurrency(currentTransaction.amount)}
        </div>
        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
          isIncome 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isIncome ? 'Income' : 'Expense'}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Description
          </label>
          {isEditing ? (
            <input
              type="text"
              value={currentTransaction.description}
              onChange={(e) => setEditedTransaction(prev => prev ? {
                ...prev,
                description: e.target.value
              } : null)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              placeholder="Transaction description"
            />
          ) : (
            <div className="px-3 py-2 text-foreground">
              {currentTransaction.description}
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Category
          </label>
          {isEditing ? (
            <select
              value={currentTransaction.category}
              onChange={(e) => setEditedTransaction(prev => prev ? {
                ...prev,
                category: e.target.value
              } : null)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            >
              {getCategoryOptions().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-2 text-foreground">
              {currentTransaction.category}
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Amount
          </label>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              min="0"
              value={Math.abs(currentTransaction.amount)}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setEditedTransaction(prev => prev ? {
                  ...prev,
                  amount: currentTransaction.type === 'income' ? value : -value
                } : null);
              }}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              placeholder="0.00"
            />
          ) : (
            <div className="px-3 py-2 text-foreground">
              {formatCurrency(currentTransaction.amount)}
            </div>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Type
          </label>
          {isEditing ? (
            <select
              value={currentTransaction.type}
              onChange={(e) => {
                const newType = e.target.value as 'income' | 'expense';
                const newCategories = newType === 'income' ? incomeCategories : expenseCategories;
                setEditedTransaction(prev => prev ? {
                  ...prev,
                  type: newType,
                  category: newCategories[0], // Reset to first category of new type
                  amount: newType === 'income' 
                    ? Math.abs(prev.amount) 
                    : -Math.abs(prev.amount)
                } : null);
              }}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          ) : (
            <div className="px-3 py-2 text-foreground capitalize">
              {currentTransaction.type}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Date
          </label>
          {isEditing ? (
            <input
              type="date"
              value={currentTransaction.date.includes('/') 
                ? new Date().toISOString().split('T')[0] 
                : currentTransaction.date}
              onChange={(e) => setEditedTransaction(prev => prev ? {
                ...prev,
                date: e.target.value
              } : null)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            />
          ) : (
            <div className="px-3 py-2 text-foreground">
              {currentTransaction.date}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}