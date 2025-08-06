import { useState, useEffect, useRef } from 'react';
import { Goal } from '@/components/GoalsModal';
import { Todo } from '@/components/TodoModal';
import { Checklist } from '@/components/ChecklistModal';
import { Transaction } from '@/components/FinancialDashboard';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useAppState = () => {
  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showPlaylistPanel, setShowPlaylistPanel] = useState(false);

  // UI State
  const [gestureActive, setGestureActive] = useState(false);
  const [collapsedProjects, setCollapsedProjects] = useState<Set<number>>(new Set([2, 3]));
  const [expandingProjects, setExpandingProjects] = useState<Set<number>>(new Set());

  // Life Metrics State
  const [waterIntake, setWaterIntake] = useState(6);
  const [waterGoal, setWaterGoal] = useState(8);
  const [showWaterEditor, setShowWaterEditor] = useState(false);
  const [isHoldingWater, setIsHoldingWater] = useState(false);
  const [waterDropAnimation, setWaterDropAnimation] = useState(false);
  
  const [sleepTime, setSleepTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:12");
  const [showSleepEditor, setShowSleepEditor] = useState(false);
  const [isHoldingSleep, setIsHoldingSleep] = useState(false);
  
  const [stepsToday, setStepsToday] = useState(8432);
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [showStepsEditor, setShowStepsEditor] = useState(false);
  const [isHoldingSteps, setIsHoldingSteps] = useState(false);

  // Financial State
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState(15000.00);
  const [showSavingsGoalModal, setShowSavingsGoalModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  
  // Transaction Detail State
  const [showTransactionDetailModal, setShowTransactionDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Goals State
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  // Notes State
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  // Todos State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);

  // Checklists State
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<Checklist | undefined>(undefined);

  // Refs for timers
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sleepHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepsHoldTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (sleepHoldTimerRef.current) clearTimeout(sleepHoldTimerRef.current);
      if (stepsHoldTimerRef.current) clearTimeout(stepsHoldTimerRef.current);
    };
  }, []);

  // Helper to check if any modal is open
  const isAnyModalOpen = showWaterEditor || showSleepEditor || showStepsEditor || 
    showPlaylistPanel || showIncomeModal || showExpenseModal || showGoalsModal || 
    showSavingsGoalModal || showInvestmentModal || showNoteModal || showTodoModal || 
    showChecklistModal || showTransactionDetailModal;

  return {
    // Music Player
    isPlaying, setIsPlaying,
    currentTrack, setCurrentTrack,
    showPlaylistPanel, setShowPlaylistPanel,
    
    // UI State
    gestureActive, setGestureActive,
    collapsedProjects, setCollapsedProjects,
    expandingProjects, setExpandingProjects,
    
    // Life Metrics
    waterIntake, setWaterIntake,
    waterGoal, setWaterGoal,
    showWaterEditor, setShowWaterEditor,
    isHoldingWater, setIsHoldingWater,
    waterDropAnimation, setWaterDropAnimation,
    sleepTime, setSleepTime,
    wakeTime, setWakeTime,
    showSleepEditor, setShowSleepEditor,
    isHoldingSleep, setIsHoldingSleep,
    stepsToday, setStepsToday,
    stepsGoal, setStepsGoal,
    showStepsEditor, setShowStepsEditor,
    isHoldingSteps, setIsHoldingSteps,
    
    // Financial
    showIncomeModal, setShowIncomeModal,
    showExpenseModal, setShowExpenseModal,
    savingsGoal, setSavingsGoal,
    showSavingsGoalModal, setShowSavingsGoalModal,
    showInvestmentModal, setShowInvestmentModal,
    
    // Transaction Detail
    showTransactionDetailModal, setShowTransactionDetailModal,
    selectedTransaction, setSelectedTransaction,
    
    // Goals
    goals, setGoals,
    showGoalsModal, setShowGoalsModal,
    
    // Notes
    notes, setNotes,
    showNoteModal, setShowNoteModal,
    editingNote, setEditingNote,
    
    // Todos
    todos, setTodos,
    showTodoModal, setShowTodoModal,
    editingTodo, setEditingTodo,
    
    // Checklists
    checklists, setChecklists,
    showChecklistModal, setShowChecklistModal,
    editingChecklist, setEditingChecklist,
    
    // Refs
    holdTimerRef,
    sleepHoldTimerRef,
    stepsHoldTimerRef,
    
    // Computed
    isAnyModalOpen
  };
};