"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useAppState } from "@/hooks/useAppState";
import IncomeModal from "@/components/IncomeModal";
import ExpenseModal from "@/components/ExpenseModal";
import GoalsModal, { Goal } from "@/components/GoalsModal";
import GoalsSwiper from "@/components/GoalsSwiper";
import SavingsGoalModal from "@/components/SavingsGoalModal";
import InvestmentModal from "@/components/InvestmentModal";
import FloatingActionButton from "@/components/FloatingActionButton";
import NoteModal from "@/components/NoteModal";
import TodoModal, { Todo } from "@/components/TodoModal";
import ChecklistModal, { Checklist } from "@/components/ChecklistModal";
import TransactionDetailModal from "@/components/TransactionDetailModal";
import { Transaction } from "@/components/FinancialDashboard";
import BottomNavigation from "@/components/BottomNavigation";
import WeatherWidget from "@/components/WeatherWidget";
import MusicPlayer from "@/components/MusicPlayer";
import LifeMetrics from "@/components/LifeMetrics";
import FinancialDashboard from "@/components/FinancialDashboard";
import ProjectTasks from "@/components/ProjectTasks";
import MeditationWidget from "@/components/MeditationWidget";

// Mock data
const mockWeatherData = {
  location: "New York",
  temperature: 22,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  icon: "🌤️"
};

const mockPlaylist = [
  { id: 1, title: "Morning Motivation Energy Boost for Productive Day", artist: "Upbeat Mix", duration: "45:30" },
  { id: 2, title: "Focus Flow Deep Concentration", artist: "Lo-Fi Beats", duration: "60:00" },
  { id: 3, title: "Evening Calm & Relaxation", artist: "Ambient Sounds", duration: "30:15" }
];

const mockFinancialData = {
  balance: 12847.32,
  monthlyIncome: 5200.00,
  monthlyExpenses: 3456.78,
  savingsGoal: 15000.00,
  investments: 8935.00,
  recentTransactions: [
    { id: 1, description: "Salary Deposit", amount: 5200.00, type: "income" as const, category: "Salary", date: "Today" },
    { id: 2, description: "Grocery Store", amount: -127.45, type: "expense" as const, category: "Food", date: "Yesterday" },
    { id: 3, description: "Investment Return", amount: 234.67, type: "income" as const, category: "Investment", date: "2 days ago" }
  ]
};

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Lose Weight",
    description: "Get in shape for summer",
    targetValue: 10,
    currentValue: 3,
    unit: "kg",
    category: "Health",
    isFavorite: true,
    color: "bg-green-500",
    createdAt: new Date(),
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    title: "Emergency Fund",
    description: "Build financial security",
    targetValue: 10000,
    currentValue: 4500,
    unit: "$",
    category: "Financial",
    isFavorite: true,
    color: "bg-gold",
    createdAt: new Date(),
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  },
  {
    id: "3",
    title: "Learn TypeScript",
    description: "Master advanced TypeScript concepts",
    targetValue: 40,
    currentValue: 15,
    unit: "hours",
    category: "Learning",
    isFavorite: false,
    color: "bg-blue-500",
    createdAt: new Date(),
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  },
  {
    id: "4",
    title: "Read More Books",
    description: "Expand knowledge and reading habit",
    targetValue: 24,
    currentValue: 8,
    unit: "books",
    category: "Personal",
    isFavorite: true,
    color: "bg-purple-500",
    createdAt: new Date(),
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  }
];

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Daily Reflection",
    content: "Today was productive. Completed the water tracking feature and made good progress on the goals. Need to focus more on consistent sleep schedule.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    title: "Weekend Plans",
    content: "- Visit the farmer's market\n- Complete the hiking trail project\n- Prepare meal prep for next week\n- Read at least 2 chapters of the TypeScript book",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Complete water tracking implementation",
    description: "Finish the water intake tracking feature with animations and persistence",
    completed: true,
    priority: 'high',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    title: "Review financial goals",
    description: "Analyze current savings progress and adjust monthly targets",
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

const mockChecklists: Checklist[] = [
  {
    id: "1",
    title: "Weekend Shopping List",
    items: [
      { id: "1", text: "Milk and eggs", completed: true },
      { id: "2", text: "Fresh vegetables", completed: true },
      { id: "3", text: "Chicken breast", completed: false },
      { id: "4", text: "Brown rice", completed: false },
      { id: "5", text: "Greek yogurt", completed: false }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

const mockProjectTasks = [
  {
    id: 1,
    name: "Life Quality App with Advanced Health Tracking",
    priority: "high" as const,
    color: "gold",
    progress: 75,
    tasks: [
      { id: 1, title: "Design home page UI", status: "completed" as const, dueDate: "Today", priority: "high" as const },
      { id: 2, title: "Implement weather widget", status: "completed" as const, dueDate: "Today", priority: "medium" as const },
      { id: 3, title: "Add music player", status: "in-progress" as const, dueDate: "Tomorrow", priority: "medium" as const },
      { id: 4, title: "Financial dashboard", status: "pending" as const, dueDate: "Dec 8", priority: "high" as const }
    ]
  },
  {
    id: 2,
    name: "E-commerce Platform with Multi-vendor Support",
    priority: "medium" as const,
    color: "blue",
    progress: 45,
    tasks: [
      { id: 6, title: "Product catalog API", status: "completed" as const, dueDate: "Dec 1", priority: "high" as const },
      { id: 7, title: "Shopping cart logic", status: "in-progress" as const, dueDate: "Dec 6", priority: "high" as const }
    ]
  }
];

export default function Home() {
  const { user, logout } = useAuth();
  const appState = useAppState();
  
  // Initialize state with mock data
  const {
    // Music Player
    isPlaying, setIsPlaying, currentTrack, setCurrentTrack, showPlaylistPanel, setShowPlaylistPanel,
    // UI State
    collapsedProjects, setCollapsedProjects, expandingProjects, setExpandingProjects,
    // Life Metrics
    waterIntake, setWaterIntake, waterGoal, setWaterGoal, showWaterEditor, setShowWaterEditor,
    isHoldingWater, setIsHoldingWater, waterDropAnimation, setWaterDropAnimation,
    sleepTime, setSleepTime, wakeTime, setWakeTime, showSleepEditor, setShowSleepEditor, isHoldingSleep, setIsHoldingSleep,
    stepsToday, setStepsToday, stepsGoal, setStepsGoal, showStepsEditor, setShowStepsEditor, isHoldingSteps, setIsHoldingSteps,
    // Financial
    showIncomeModal, setShowIncomeModal, showExpenseModal, setShowExpenseModal,
    savingsGoal, setSavingsGoal, showSavingsGoalModal, setShowSavingsGoalModal, showInvestmentModal, setShowInvestmentModal,
    // Transaction Detail
    showTransactionDetailModal, setShowTransactionDetailModal, selectedTransaction, setSelectedTransaction,
    // Goals, Notes, Todos, Checklists
    goals, setGoals, showGoalsModal, setShowGoalsModal,
    notes, setNotes, showNoteModal, setShowNoteModal, editingNote, setEditingNote,
    todos, setTodos, showTodoModal, setShowTodoModal, editingTodo, setEditingTodo,
    checklists, setChecklists, showChecklistModal, setShowChecklistModal, editingChecklist, setEditingChecklist,
    // Refs and computed
    holdTimerRef, sleepHoldTimerRef, stepsHoldTimerRef, isAnyModalOpen
  } = appState;

  // Initialize with mock data
  React.useEffect(() => {
    setGoals(mockGoals);
    setNotes(mockNotes);
    setTodos(mockTodos);
    setChecklists(mockChecklists);
    setSavingsGoal(mockFinancialData.savingsGoal);
  }, [setGoals, setNotes, setTodos, setChecklists, setSavingsGoal]);

  // Scroll lock
  useScrollLock(isAnyModalOpen);

  // Mock current time
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Transaction handlers
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetailModal(true);
  };

  const handleTransactionSave = (updatedTransaction: Transaction) => {
    // In a real app, this would update the backend
    // For now, we can just update the local mock data
    console.log('Saving transaction:', updatedTransaction);
    setShowTransactionDetailModal(false);
  };

  const handleTransactionDelete = (transactionId: number) => {
    // In a real app, this would delete from the backend
    console.log('Deleting transaction:', transactionId);
    setShowTransactionDetailModal(false);
  };

  // Music Player handlers
  const togglePlayback = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % mockPlaylist.length);
  const previousTrack = () => setCurrentTrack((prev) => (prev - 1 + mockPlaylist.length) % mockPlaylist.length);
  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setShowPlaylistPanel(false);
  };

  // Project Tasks handlers
  const toggleProject = (projectId: number) => {
    const isCurrentlyCollapsed = collapsedProjects.has(projectId);
    
    if (isCurrentlyCollapsed) {
      setExpandingProjects(prev => new Set(prev).add(projectId));
      setTimeout(() => {
        setCollapsedProjects(prev => {
          const newSet = new Set(prev);
          newSet.delete(projectId);
          return newSet;
        });
        setExpandingProjects(prev => {
          const newSet = new Set(prev);
          newSet.delete(projectId);
          return newSet;
        });
      }, 50);
    } else {
      setCollapsedProjects(prev => new Set(prev).add(projectId));
    }
  };

  // Note handlers
  const handleNoteClick = () => {
    setEditingNote(undefined);
    setShowNoteModal(true);
  };

  // Todo handlers  
  const handleTodoClick = () => {
    setEditingTodo(undefined);
    setShowTodoModal(true);
  };

  // Checklist handlers
  const handleChecklistClick = () => {
    setEditingChecklist(undefined);
    setShowChecklistModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with greeting and user info */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 slide-in-from-top-1">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="fade-in-up">
            <h1 className="text-lg font-semibold text-foreground">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-muted-foreground hover:text-gold transition-all duration-300 focus-ring-luxury scale-in hover:scale-110 float"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 pb-20">
        {/* Weather Widget */}
        <WeatherWidget data={mockWeatherData} />
        
        {/* Music Player */}
        <MusicPlayer 
          playlist={mockPlaylist}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          showPlaylistPanel={showPlaylistPanel}
          onPlayPause={togglePlayback}
          onNextTrack={nextTrack}
          onPreviousTrack={previousTrack}
          onTogglePlaylist={() => setShowPlaylistPanel(!showPlaylistPanel)}
          onSelectTrack={selectTrack}
        />

        {/* Life Metrics */}
        <LifeMetrics 
          waterIntake={waterIntake}
          waterGoal={waterGoal}
          showWaterEditor={showWaterEditor}
          isHoldingWater={isHoldingWater}
          waterDropAnimation={waterDropAnimation}
          holdTimerRef={holdTimerRef}
          onWaterIntakeChange={setWaterIntake}
          onWaterGoalChange={setWaterGoal}
          onToggleWaterEditor={() => setShowWaterEditor(!showWaterEditor)}
          onWaterHold={setIsHoldingWater}
          onWaterDropAnimation={setWaterDropAnimation}
          sleepTime={sleepTime}
          wakeTime={wakeTime}
          showSleepEditor={showSleepEditor}
          isHoldingSleep={isHoldingSleep}
          sleepHoldTimerRef={sleepHoldTimerRef}
          onSleepTimeChange={setSleepTime}
          onWakeTimeChange={setWakeTime}
          onToggleSleepEditor={() => setShowSleepEditor(!showSleepEditor)}
          onSleepHold={setIsHoldingSleep}
          stepsToday={stepsToday}
          stepsGoal={stepsGoal}
          showStepsEditor={showStepsEditor}
          isHoldingSteps={isHoldingSteps}
          stepsHoldTimerRef={stepsHoldTimerRef}
          onStepsTodayChange={setStepsToday}
          onStepsGoalChange={setStepsGoal}
          onToggleStepsEditor={() => setShowStepsEditor(!showStepsEditor)}
          onStepsHold={setIsHoldingSteps}
        />

        {/* Financial Dashboard */}
        <FinancialDashboard 
          data={mockFinancialData}
          onIncomeClick={() => setShowIncomeModal(true)}
          onExpenseClick={() => setShowExpenseModal(true)}
          onSavingsGoalClick={() => setShowSavingsGoalModal(true)}
          onInvestmentClick={() => setShowInvestmentModal(true)}
          onTransactionClick={handleTransactionClick}
        />

        {/* Goals Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Your Goals</h3>
            <button
              onClick={() => setShowGoalsModal(true)}
              className="text-sm text-gold hover:text-gold-light transition-colors"
            >
              Manage Goals
            </button>
          </div>
          <GoalsSwiper 
            goals={goals} 
            onUpdateGoal={(updatedGoal) => {
              setGoals(prev => prev.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
            }}
          />
        </div>

        {/* Meditation Widget */}
        <MeditationWidget 
          onSessionStart={(session) => {
            console.log('Meditation session started:', session);
          }}
          onSessionComplete={(session, duration) => {
            console.log('Meditation session completed:', session, 'Duration:', duration);
          }}
        />

        {/* Project Tasks */}
        <ProjectTasks 
          projects={mockProjectTasks}
          collapsedProjects={collapsedProjects}
          expandingProjects={expandingProjects}
          onToggleProject={toggleProject}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Action Button */}
      <FloatingActionButton 
        onNoteClick={handleNoteClick}
        onTodoClick={handleTodoClick}
        onChecklistClick={handleChecklistClick}
      />

      {/* All Modals - Conditionally rendered */}
      {showIncomeModal && (
        <IncomeModal 
          isOpen={showIncomeModal}
          onClose={() => setShowIncomeModal(false)}
          onAddIncome={(income) => {
            console.log("New income added:", income);
            // TODO: Add to income list or update financial data
          }}
        />
      )}

      {showExpenseModal && (
        <ExpenseModal 
          isOpen={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          onAddExpense={(expense) => {
            console.log("New expense added:", expense);
            // TODO: Add to expense list or update financial data
          }}
        />
      )}

      {showGoalsModal && (
        <GoalsModal
          isOpen={showGoalsModal}
          goals={goals}
          onClose={() => setShowGoalsModal(false)}
          onAddGoal={(goalData) => {
            const newGoal = {
              ...goalData,
              id: Date.now().toString(),
              createdAt: new Date()
            };
            setGoals(prev => [...prev, newGoal]);
          }}
          onEditGoal={(updatedGoal) => {
            setGoals(prev => prev.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
          }}
          onToggleFavorite={(goalId) => {
            setGoals(prev => prev.map(goal => 
              goal.id === goalId ? { ...goal, isFavorite: !goal.isFavorite } : goal
            ));
          }}
          onDeleteGoal={(goalId) => {
            setGoals(prev => prev.filter(goal => goal.id !== goalId));
          }}
        />
      )}

      {showSavingsGoalModal && (
        <SavingsGoalModal
          isOpen={showSavingsGoalModal}
          onClose={() => setShowSavingsGoalModal(false)}
          currentBalance={mockFinancialData.balance}
          savingsGoal={savingsGoal}
          onUpdateGoal={setSavingsGoal}
        />
      )}

      {showInvestmentModal && (
        <InvestmentModal 
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)} 
        />
      )}

      {showNoteModal && (
        <NoteModal
          isOpen={showNoteModal}
          existingNote={editingNote}
          onClose={() => {
            setShowNoteModal(false);
            setEditingNote(undefined);
          }}
          onSave={(noteData) => {
            if (editingNote) {
              setNotes(notes.map(n => n.id === editingNote.id ? { 
                ...noteData, 
                id: editingNote.id, 
                updatedAt: new Date(), 
                createdAt: editingNote.createdAt 
              } : n));
            } else {
              setNotes([...notes, { 
                ...noteData, 
                id: Date.now().toString(), 
                createdAt: new Date(), 
                updatedAt: new Date() 
              }]);
            }
            setShowNoteModal(false);
            setEditingNote(undefined);
          }}
        />
      )}

      {showTodoModal && (
        <TodoModal
          isOpen={showTodoModal}
          existingTodo={editingTodo}
          onClose={() => {
            setShowTodoModal(false);
            setEditingTodo(undefined);
          }}
          onSave={(todoData) => {
            if (editingTodo) {
              setTodos(todos.map(t => t.id === editingTodo.id ? { 
                ...todoData, 
                id: editingTodo.id, 
                updatedAt: new Date(), 
                createdAt: editingTodo.createdAt 
              } : t));
            } else {
              setTodos([...todos, { 
                ...todoData, 
                id: Date.now().toString(), 
                createdAt: new Date(), 
                updatedAt: new Date() 
              }]);
            }
            setShowTodoModal(false);
            setEditingTodo(undefined);
          }}
        />
      )}

      {showChecklistModal && (
        <ChecklistModal
          isOpen={showChecklistModal}
          existingChecklist={editingChecklist}
          onClose={() => {
            setShowChecklistModal(false);
            setEditingChecklist(undefined);
          }}
          onSave={(checklistData) => {
            if (editingChecklist) {
              setChecklists(checklists.map(c => c.id === editingChecklist.id ? { 
                ...checklistData, 
                id: editingChecklist.id, 
                updatedAt: new Date(), 
                createdAt: editingChecklist.createdAt 
              } : c));
            } else {
              setChecklists([...checklists, { 
                ...checklistData, 
                id: Date.now().toString(), 
                createdAt: new Date(), 
                updatedAt: new Date() 
              }]);
            }
            setShowChecklistModal(false);
            setEditingChecklist(undefined);
          }}
        />
      )}

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={showTransactionDetailModal}
        onClose={() => {
          setShowTransactionDetailModal(false);
          setSelectedTransaction(null);
        }}
        onSave={handleTransactionSave}
        onDelete={handleTransactionDelete}
      />
    </div>
  );
}