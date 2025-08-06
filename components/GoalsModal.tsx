"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { ModalActions } from "./ModalComponents";

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: string;
  isFavorite: boolean;
  color: string;
  createdAt: Date;
  targetDate?: Date;
}

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onEditGoal: (goal: Goal) => void;
  onToggleFavorite: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSave: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

const goalCategories = [
  { label: "Health", icon: "💪", color: "bg-green-500" },
  { label: "Financial", icon: "💰", color: "bg-gold" },
  { label: "Learning", icon: "📚", color: "bg-blue-500" },
  { label: "Personal", icon: "🌟", color: "bg-purple-500" },
  { label: "Career", icon: "🚀", color: "bg-orange-500" },
  { label: "Other", icon: "🎯", color: "bg-gray-500" }
];

const goalColors = [
  "bg-gold", "bg-blue-500", "bg-green-500", "bg-purple-500", 
  "bg-orange-500", "bg-pink-500", "bg-indigo-500", "bg-red-500"
];

function EditGoalModal({ isOpen, onClose, goal, onSave, onDelete }: EditGoalModalProps) {
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: "",
    description: "",
    targetValue: 100,
    currentValue: 0,
    unit: "",
    category: "Personal",
    color: "bg-gold",
    isFavorite: false,
    targetDate: undefined
  });

  // Update form data when goal changes
  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        unit: goal.unit,
        category: goal.category,
        color: goal.color,
        isFavorite: goal.isFavorite,
        targetDate: goal.targetDate
      });
    }
  }, [goal]);

  const handleSave = () => {
    if (!goal || !formData.title?.trim()) return;
    
    const updatedGoal: Goal = {
      ...goal,
      title: formData.title!,
      description: formData.description || "",
      targetValue: formData.targetValue || 100,
      currentValue: formData.currentValue || 0,
      unit: formData.unit || "",
      category: formData.category || "Personal",
      color: formData.color || "bg-gold",
      isFavorite: formData.isFavorite ?? false,
      targetDate: formData.targetDate
    };
    
    onSave(updatedGoal);
    onClose();
  };

  const handleDelete = () => {
    if (!goal) return;
    if (confirm("Are you sure you want to delete this goal?")) {
      onDelete(goal.id);
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!goal) return null;

  return (
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 ${isOpen ? 'block' : 'hidden'}`}>
      <div 
        className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] shadow-2xl border border-gold bounce-in overflow-hidden flex flex-col"
        onClick={handleModalClick}
      >
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h3 className="text-lg font-semibold text-foreground">✏️ Edit Goal</h3>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-gold transition-colors hover:scale-110 focus-ring-luxury"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Goal Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="Enter goal title..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 h-20 resize-none"
              placeholder="Describe your goal..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Target Value</label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Current Value</label>
              <input
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="e.g., kg, $, hours, books..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {goalCategories.map((category) => (
                <button
                  key={category.label}
                  onClick={() => setFormData({ ...formData, category: category.label })}
                  className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    formData.category === category.label
                      ? 'bg-gold text-background shadow-lg'
                      : 'bg-muted hover:bg-gold/20 text-foreground'
                  }`}
                >
                  <span className="block text-lg mb-1">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Color</label>
            <div className="flex space-x-2">
              {goalColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full ${color} transition-all duration-200 hover:scale-110 ${
                    formData.color === color ? 'ring-2 ring-gold ring-offset-2 ring-offset-card' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Target Date (Optional)</label>
            <input
              type="date"
              value={formData.targetDate ? formData.targetDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                targetDate: e.target.value ? new Date(e.target.value) : undefined 
              })}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>

        <div className="border-t border-border p-6 flex-shrink-0">
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-background rounded-lg font-medium transition-colors focus-ring-luxury"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors focus-ring-luxury"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors focus-ring-luxury"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoalsModal({ 
  isOpen, 
  onClose, 
  goals, 
  onAddGoal, 
  onEditGoal,
  onToggleFavorite,
  onDeleteGoal 
}: GoalsModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetValue: 100,
    currentValue: 0,
    unit: "",
    category: "Personal",
    color: "bg-gold",
    isFavorite: false,
    targetDate: undefined as Date | undefined
  });

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;
    
    onAddGoal({
      ...newGoal,
      title: newGoal.title.trim(),
      description: newGoal.description.trim()
    });
    
    setNewGoal({
      title: "",
      description: "",
      targetValue: 100,
      currentValue: 0,
      unit: "",
      category: "Personal",
      color: "bg-gold",
      isFavorite: false,
      targetDate: undefined
    });
    setShowAddForm(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleSaveEditedGoal = (updatedGoal: Goal) => {
    onEditGoal(updatedGoal);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    onDeleteGoal(goalId);
    setEditingGoal(null);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    const cat = goalCategories.find(c => c.label === category);
    return cat ? cat.icon : "🎯";
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="🎯 My Goals"
        footer={
          <ModalActions
            onCancel={onClose}
            onConfirm={onClose}
            confirmLabel="Close"
            hideCancel
          />
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-muted/30 rounded-lg p-4 border border-border hover:border-gold/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => handleEditGoal(goal)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 ${goal.color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {getCategoryIcon(goal.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{goal.description}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(goal.id);
                  }}
                  className={`p-1 rounded-full transition-all duration-200 hover:scale-110 ${
                    goal.isFavorite 
                      ? 'text-gold hover:text-gold-light' 
                      : 'text-muted-foreground hover:text-gold'
                  }`}
                >
                  <svg className="w-5 h-5" fill={goal.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${goal.color}`}
                    style={{ width: `${getProgressPercentage(goal.currentValue, goal.targetValue)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{goal.category}</span>
                  <span>{Math.round(getProgressPercentage(goal.currentValue, goal.targetValue))}% complete</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Goal Card */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-gold/10 border-2 border-dashed border-gold/30 rounded-lg p-8 text-center hover:bg-gold/20 hover:border-gold/50 transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">➕</div>
              <p className="font-semibold text-gold">Add New Goal</p>
              <p className="text-sm text-muted-foreground mt-1">Create a new goal to track</p>
            </button>
          ) : (
            <div className="bg-gold/5 border border-gold/30 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">✨ New Goal</h4>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Goal title..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
                
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Describe your goal..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 h-16 resize-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                    placeholder="Target value"
                    className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    placeholder="Unit (kg, $, etc.)"
                    className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {goalCategories.slice(0, 6).map((category) => (
                    <button
                      key={category.label}
                      onClick={() => setNewGoal({ ...newGoal, category: category.label })}
                      className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        newGoal.category === category.label
                          ? 'bg-gold text-background'
                          : 'bg-muted hover:bg-gold/20 text-foreground'
                      }`}
                    >
                      <span className="block text-sm mb-1">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddGoal}
                    className="flex-1 py-2 px-4 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <EditGoalModal
        isOpen={editingGoal !== null}
        onClose={() => setEditingGoal(null)}
        goal={editingGoal}
        onSave={handleSaveEditedGoal}
        onDelete={handleDeleteGoal}
      />
    </>
  );
}