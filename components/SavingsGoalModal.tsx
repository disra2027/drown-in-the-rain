"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { ModalSection, StatusCard, ProgressBar, CounterControl, PresetButtons, ModalActions } from "./ModalComponents";

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  savingsGoal: number;
  onUpdateGoal: (newGoal: number) => void;
}

export default function SavingsGoalModal({ 
  isOpen, 
  onClose, 
  currentBalance,
  savingsGoal,
  onUpdateGoal 
}: SavingsGoalModalProps) {
  const [goal, setGoal] = useState(savingsGoal);
  const [monthlyTarget, setMonthlyTarget] = useState(500);
  
  // Calculate progress and other metrics
  const progress = Math.min((currentBalance / goal) * 100, 100);
  const remaining = Math.max(goal - currentBalance, 0);
  const monthsToGoal = monthlyTarget > 0 ? Math.ceil(remaining / monthlyTarget) : 0;
  
  // Reset goal when modal opens
  useEffect(() => {
    setGoal(savingsGoal);
  }, [isOpen, savingsGoal]);

  const handleSave = () => {
    onUpdateGoal(goal);
    onClose();
  };

  const calculateSuggestedMonthly = (targetMonths: number) => {
    return Math.ceil(remaining / targetMonths);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Savings Goal"
      icon="💰"
      footer={
        <ModalActions
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel="Save Goal"
        />
      }
    >
      <ModalSection
        icon="🎯"
        description="Set your savings target and track your progress"
      />

      {/* Current Progress */}
      <StatusCard>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-foreground">
              ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">Current savings</p>
          </div>
          
          <ProgressBar 
            value={currentBalance} 
            max={goal}
            colorClass={progress >= 100 ? 'bg-gold' : progress >= 75 ? 'bg-gold-light' : 'bg-gold-dark'}
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {progress.toFixed(1)}% of goal
            </span>
            <span className="text-gold font-medium">
              ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })} to go
            </span>
          </div>
        </div>
      </StatusCard>

      {/* Goal Amount */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground block">
          Savings Goal Amount
        </label>
        
        <CounterControl
          value={goal}
          onDecrease={() => setGoal(Math.max(1000, goal - 1000))}
          onIncrease={() => setGoal(Math.min(1000000, goal + 1000))}
          decreaseLabel="-$1K"
          increaseLabel="+$1K"
        />
        
        <div className="text-center">
          <p className="text-2xl font-bold text-gold">
            ${goal.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Target amount
          </p>
        </div>
      </div>

      {/* Quick Presets */}
      <PresetButtons
        presets={[
          { label: "Emergency Fund", value: 10000, subtitle: "$10,000" },
          { label: "Car Down Payment", value: 5000, subtitle: "$5,000" },
          { label: "House Deposit", value: 50000, subtitle: "$50,000" },
          { label: "Vacation Fund", value: 3000, subtitle: "$3,000" }
        ]}
        currentValue={goal}
        onSelect={setGoal}
      />

      {/* Monthly Contribution Calculator */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-foreground flex items-center">
          <span className="mr-2">📅</span>
          Monthly Contribution Plan
        </h4>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-2">
              I want to save this amount monthly:
            </label>
            <CounterControl
              value={monthlyTarget}
              onDecrease={() => setMonthlyTarget(Math.max(50, monthlyTarget - 50))}
              onIncrease={() => setMonthlyTarget(Math.min(10000, monthlyTarget + 50))}
              decreaseLabel="-$50"
              increaseLabel="+$50"
            />
          </div>
          
          <div className="text-center bg-gold/10 rounded-lg p-3">
            <p className="text-sm text-foreground">
              Saving <span className="font-bold text-gold">${monthlyTarget}</span> monthly
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll reach your goal in approximately
            </p>
            <p className="text-2xl font-bold text-gold mt-1">
              {monthsToGoal} months
            </p>
            {monthsToGoal > 12 && (
              <p className="text-xs text-muted-foreground mt-1">
                ({Math.floor(monthsToGoal / 12)} years and {monthsToGoal % 12} months)
              </p>
            )}
          </div>
        </div>

        {/* Suggested Monthly Amounts */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Quick timeline options:</p>
          <div className="grid grid-cols-3 gap-2">
            {[6, 12, 24].map((months) => {
              const suggested = calculateSuggestedMonthly(months);
              return (
                <button
                  key={months}
                  onClick={() => setMonthlyTarget(suggested)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    monthlyTarget === suggested
                      ? 'bg-gold text-background shadow-lg'
                      : 'bg-muted hover:bg-gold/20 text-foreground'
                  }`}
                >
                  <span className="block font-bold">{months} months</span>
                  <span className="text-[10px]">${suggested}/mo</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Motivational Tips */}
      <div className="bg-gold/5 border border-gold/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Savings Tips
        </h4>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li className="flex items-start">
            <span className="text-gold mr-2">•</span>
            <span>Set up automatic transfers on payday</span>
          </li>
          <li className="flex items-start">
            <span className="text-gold mr-2">•</span>
            <span>Start small and increase gradually</span>
          </li>
          <li className="flex items-start">
            <span className="text-gold mr-2">•</span>
            <span>Track your progress weekly</span>
          </li>
          <li className="flex items-start">
            <span className="text-gold mr-2">•</span>
            <span>Celebrate milestones along the way</span>
          </li>
        </ul>
      </div>
    </Modal>
  );
}