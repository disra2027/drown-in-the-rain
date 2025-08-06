import Modal from '@/components/Modal';
// import { ProgressBar, CounterControl } from '@/components/ModalComponents';
import { useCallback, useRef, useEffect } from 'react';

interface LifeMetricsProps {
  // Water tracking
  waterIntake: number;
  waterGoal: number;
  showWaterEditor: boolean;
  isHoldingWater: boolean;
  waterDropAnimation: boolean;
  holdTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  onWaterIntakeChange: (value: number) => void;
  onWaterGoalChange: (value: number) => void;
  onToggleWaterEditor: () => void;
  onWaterHold: (holding: boolean) => void;
  onWaterDropAnimation: (animate: boolean) => void;
  
  // Sleep tracking
  sleepTime: string;
  wakeTime: string;
  showSleepEditor: boolean;
  isHoldingSleep: boolean;
  sleepHoldTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  onSleepTimeChange: (time: string) => void;
  onWakeTimeChange: (time: string) => void;
  onToggleSleepEditor: () => void;
  onSleepHold: (holding: boolean) => void;
  
  // Steps tracking
  stepsToday: number;
  stepsGoal: number;
  showStepsEditor: boolean;
  isHoldingSteps: boolean;
  stepsHoldTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  onStepsTodayChange: (steps: number) => void;
  onStepsGoalChange: (goal: number) => void;
  onToggleStepsEditor: () => void;
  onStepsHold: (holding: boolean) => void;
}

export default function LifeMetrics({
  waterIntake,
  waterGoal,
  showWaterEditor,
  isHoldingWater,
  waterDropAnimation,
  holdTimerRef,
  onWaterIntakeChange,
  onWaterGoalChange,
  onToggleWaterEditor,
  onWaterHold,
  onWaterDropAnimation,
  
  sleepTime,
  wakeTime,
  showSleepEditor,
  isHoldingSleep,
  sleepHoldTimerRef,
  onSleepTimeChange,
  onWakeTimeChange,
  onToggleSleepEditor,
  onSleepHold,
  
  stepsToday,
  stepsGoal,
  showStepsEditor,
  isHoldingSteps,
  stepsHoldTimerRef,
  onStepsTodayChange,
  onStepsGoalChange,
  onToggleStepsEditor,
  onStepsHold
}: LifeMetricsProps) {
  
  // Debounce hook for preventing rapid clicks
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const debounce = useCallback((func: () => void, delay: number) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(func, delay);
  }, []);
  
  // Enhanced hold timers with better feedback
  const holdProgressRef = useRef<number>(0);
  const holdProgressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingWaterRef = useRef(false);
  const isHoldingSleepRef = useRef(false);
  const isHoldingStepsRef = useRef(false);
  
  // Water tracking handlers with improved hold detection
  const handleWaterPress = (event: React.MouseEvent | React.TouchEvent) => {
    // Only respond to left mouse button or touch events
    if ('button' in event && event.button !== 0) return;
    
    // Clear any existing timers
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdProgressTimerRef.current) {
      clearTimeout(holdProgressTimerRef.current);
      holdProgressTimerRef.current = null;
    }
    
    isHoldingWaterRef.current = true;
    onWaterHold(true);
    holdProgressRef.current = 0;
    
    // Start hold timer for modal (reduced to 600ms for better UX)
    holdTimerRef.current = setTimeout(() => {
      if (isHoldingWaterRef.current) {
        onToggleWaterEditor();
        onWaterHold(false);
        isHoldingWaterRef.current = false;
      }
    }, 600);
  };

  const handleWaterRelease = () => {
    const wasHolding = isHoldingWaterRef.current;
    const hadTimer = holdTimerRef.current !== null;
    
    // Clear all timers
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdProgressTimerRef.current) {
      clearTimeout(holdProgressTimerRef.current);
      holdProgressTimerRef.current = null;
    }
    
    isHoldingWaterRef.current = false;
    onWaterHold(false);
    
    // Debounced water increment for quick taps
    if (wasHolding && hadTimer && waterIntake < waterGoal) {
      debounce(() => {
        onWaterIntakeChange(waterIntake + 1);
        onWaterDropAnimation(true);
        setTimeout(() => onWaterDropAnimation(false), 600);
      }, 100); // 100ms debounce to prevent double-taps
    }
  };

  // Sleep calculation
  const calculateSleepHours = () => {
    const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    
    const sleepMinutes = sleepHour * 60 + sleepMinute;
    let wakeMinutes = wakeHour * 60 + wakeMinute;
    
    if (wakeMinutes <= sleepMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    const totalMinutes = wakeMinutes - sleepMinutes;
    return (totalMinutes / 60);
  };

  const sleepHours = calculateSleepHours();

  // Sleep tracking handlers with improved hold detection
  const handleSleepPress = (event: React.MouseEvent | React.TouchEvent) => {
    // Only respond to left mouse button or touch events
    if ('button' in event && event.button !== 0) return;
    
    if (sleepHoldTimerRef.current) {
      clearTimeout(sleepHoldTimerRef.current);
      sleepHoldTimerRef.current = null;
    }
    
    isHoldingSleepRef.current = true;
    onSleepHold(true);
    sleepHoldTimerRef.current = setTimeout(() => {
      if (isHoldingSleepRef.current) {
        onToggleSleepEditor();
        onSleepHold(false);
        isHoldingSleepRef.current = false;
      }
    }, 600);
  };

  const handleSleepRelease = () => {
    if (sleepHoldTimerRef.current) {
      clearTimeout(sleepHoldTimerRef.current);
      sleepHoldTimerRef.current = null;
    }
    isHoldingSleepRef.current = false;
    onSleepHold(false);
  };

  // Steps tracking handlers with improved hold detection
  const handleStepsPress = (event: React.MouseEvent | React.TouchEvent) => {
    // Only respond to left mouse button or touch events
    if ('button' in event && event.button !== 0) return;
    
    if (stepsHoldTimerRef.current) {
      clearTimeout(stepsHoldTimerRef.current);
      stepsHoldTimerRef.current = null;
    }
    
    isHoldingStepsRef.current = true;
    onStepsHold(true);
    stepsHoldTimerRef.current = setTimeout(() => {
      if (isHoldingStepsRef.current) {
        onToggleStepsEditor();
        onStepsHold(false);
        isHoldingStepsRef.current = false;
      }
    }, 600);
  };

  const handleStepsRelease = () => {
    if (stepsHoldTimerRef.current) {
      clearTimeout(stepsHoldTimerRef.current);
      stepsHoldTimerRef.current = null;
    }
    isHoldingStepsRef.current = false;
    onStepsHold(false);
  };

  // Cleanup effect to clear all timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (holdProgressTimerRef.current) {
        clearTimeout(holdProgressTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Life Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Water Intake */}
        <button
          onMouseDown={handleWaterPress}
          onMouseUp={handleWaterRelease}
          onMouseLeave={handleWaterRelease}
          onTouchStart={handleWaterPress}
          onTouchEnd={handleWaterRelease}
          onContextMenu={(e) => e.preventDefault()}
          className={`bg-gradient-to-br from-card to-blue-500/10 rounded-xl p-4 border transition-all duration-200 text-left relative overflow-hidden focus-ring-luxury ${
            isHoldingWater
              ? 'border-blue-400 shadow-lg scale-95 bg-blue-500/20 transform'
              : 'border-border hover:border-blue-400/50 hover:shadow-md hover:scale-105'
          } fade-in-up delay-100 no-context-menu`}
        >
          <div className={`absolute inset-0 transition-all duration-600 ${waterDropAnimation ? 'water-drop-animation' : ''}`}>
            <div className="w-full h-full bg-blue-500/5 rounded-xl"></div>
          </div>
          {/* Hold progress indicator */}
          {isHoldingWater && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400/20 rounded-b-xl overflow-hidden">
              <div className="h-full bg-blue-400 animate-pulse rounded-b-xl transition-all duration-600 ease-out"
                   style={{ width: '100%', animation: 'holdProgress 0.6s ease-out forwards' }}
              ></div>
            </div>
          )}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💧</span>
              <span className="text-xs text-muted-foreground">
                {waterIntake}/{waterGoal}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mb-2">
              <div 
                className="bg-blue-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-foreground">Water</p>
            <p className="text-xs text-muted-foreground">{waterIntake} glasses</p>
          </div>
        </button>

        {/* Sleep Tracking */}
        <button
          onMouseDown={handleSleepPress}
          onMouseUp={handleSleepRelease}
          onMouseLeave={handleSleepRelease}
          onTouchStart={handleSleepPress}
          onTouchEnd={handleSleepRelease}
          onContextMenu={(e) => e.preventDefault()}
          className={`bg-gradient-to-br from-card to-purple-500/10 rounded-xl p-4 border transition-all duration-200 text-left relative overflow-hidden focus-ring-luxury ${
            isHoldingSleep
              ? 'border-purple-400 shadow-lg scale-95 bg-purple-500/20 transform'
              : 'border-border hover:border-purple-400/50 hover:shadow-md hover:scale-105'
          } fade-in-up delay-200 no-context-menu`}
        >
          {/* Hold progress indicator */}
          {isHoldingSleep && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-400/20 rounded-b-xl overflow-hidden">
              <div className="h-full bg-purple-400 animate-pulse rounded-b-xl transition-all duration-600 ease-out"
                   style={{ width: '100%', animation: 'holdProgress 0.6s ease-out forwards' }}
              ></div>
            </div>
          )}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">😴</span>
              <span className="text-xs text-muted-foreground">
                {sleepHours.toFixed(1)}h
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mb-2">
              <div 
                className="bg-purple-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((sleepHours / 8) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-foreground">Sleep</p>
            <p className="text-xs text-muted-foreground">{sleepTime} - {wakeTime}</p>
          </div>
        </button>

        {/* Steps */}
        <button
          onMouseDown={handleStepsPress}
          onMouseUp={handleStepsRelease}
          onMouseLeave={handleStepsRelease}
          onTouchStart={handleStepsPress}
          onTouchEnd={handleStepsRelease}
          onContextMenu={(e) => e.preventDefault()}
          className={`bg-gradient-to-br from-card to-green-500/10 rounded-xl p-4 border transition-all duration-200 text-left relative overflow-hidden focus-ring-luxury ${
            isHoldingSteps
              ? 'border-green-400 shadow-lg scale-95 bg-green-500/20 transform'
              : 'border-border hover:border-green-400/50 hover:shadow-md hover:scale-105'
          } fade-in-up delay-300 no-context-menu`}
        >
          {/* Hold progress indicator */}
          {isHoldingSteps && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-400/20 rounded-b-xl overflow-hidden">
              <div className="h-full bg-green-400 animate-pulse rounded-b-xl transition-all duration-600 ease-out"
                   style={{ width: '100%', animation: 'holdProgress 0.6s ease-out forwards' }}
              ></div>
            </div>
          )}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">👟</span>
              <span className="text-xs text-muted-foreground">
                {(stepsToday / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mb-2">
              <div 
                className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stepsToday / stepsGoal) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-foreground">Steps</p>
            <p className="text-xs text-muted-foreground">{stepsToday.toLocaleString()}</p>
          </div>
        </button>
      </div>

      {/* Water Editor Modal */}
      {showWaterEditor && (
        <Modal 
          onClose={onToggleWaterEditor}
          title="Water Intake Tracker"
          footer={
            <div className="flex gap-3">
              <button
                onClick={onToggleWaterEditor}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
              >
                Done
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Progress Display */}
            <div className="text-center">
              <div className="text-4xl mb-2">💧</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {waterIntake} / {waterGoal} glasses
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Simple Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Intake</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={waterIntake}
                  onChange={(e) => onWaterIntakeChange(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Goal</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={waterGoal}
                  onChange={(e) => onWaterGoalChange(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Sleep Editor Modal */}
      {showSleepEditor && (
        <Modal 
          onClose={onToggleSleepEditor}
          title="Sleep Schedule Tracker"
          footer={
            <div className="flex gap-3">
              <button
                onClick={onToggleSleepEditor}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
              >
                Done
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Progress Display */}
            <div className="text-center">
              <div className="text-4xl mb-2">😴</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {sleepHours.toFixed(1)} hours
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((sleepHours / 8) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Simple Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Sleep Time</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => onSleepTimeChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Wake Time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => onWakeTimeChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Steps Editor Modal */}
      {showStepsEditor && (
        <Modal 
          onClose={onToggleStepsEditor}
          title="Daily Steps Tracker"
          footer={
            <div className="flex gap-3">
              <button
                onClick={onToggleStepsEditor}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
              >
                Done
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Progress Display */}
            <div className="text-center">
              <div className="text-4xl mb-2">👟</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {stepsToday.toLocaleString()} / {stepsGoal.toLocaleString()}
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stepsToday / stepsGoal) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Simple Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Today</label>
                <input
                  type="number"
                  min="0"
                  max="50000"
                  step="100"
                  value={stepsToday}
                  onChange={(e) => onStepsTodayChange(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Goal</label>
                <input
                  type="number"
                  min="1000"
                  max="50000"
                  step="500"
                  value={stepsGoal}
                  onChange={(e) => onStepsGoalChange(Number(e.target.value) || 1000)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}