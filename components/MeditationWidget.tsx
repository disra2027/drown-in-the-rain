"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface MeditationSession {
  id: string;
  name: string;
  duration: number; // in seconds
  description: string;
  type: 'breathing' | 'mindfulness' | 'body-scan' | 'loving-kindness';
  guidance?: string[];
}

const meditationSessions: MeditationSession[] = [
  {
    id: 'breathing-5min',
    name: '5-Minute Breathing',
    duration: 300,
    description: 'Simple breathing meditation to center yourself',
    type: 'breathing',
    guidance: [
      'Find a comfortable position and close your eyes',
      'Begin by taking three deep breaths',
      'Now breathe naturally, focusing on your breath',
      'When your mind wanders, gently return to your breath',
      'Continue breathing mindfully'
    ]
  },
  {
    id: 'mindfulness-10min',
    name: '10-Minute Mindfulness',
    duration: 600,
    description: 'Present moment awareness meditation',
    type: 'mindfulness',
    guidance: [
      'Sit comfortably with your eyes closed',
      'Notice the sensations in your body',
      'Observe your thoughts without judgment',
      'Bring attention to the present moment',
      'Continue observing with gentle awareness'
    ]
  },
  {
    id: 'body-scan-15min',
    name: '15-Minute Body Scan',
    duration: 900,
    description: 'Progressive relaxation through body awareness',
    type: 'body-scan',
    guidance: [
      'Lie down or sit comfortably',
      'Start by focusing on your toes',
      'Slowly move attention up through your body',
      'Notice each part without trying to change anything',
      'Complete the scan from toes to head'
    ]
  }
];

interface MeditationWidgetProps {
  onSessionStart?: (session: MeditationSession) => void;
  onSessionComplete?: (session: MeditationSession, duration: number) => void;
}

export default function MeditationWidget({ onSessionStart, onSessionComplete }: MeditationWidgetProps) {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentGuidanceIndex, setCurrentGuidanceIndex] = useState(0);
  const [showGuidance, setShowGuidance] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleSessionComplete = useCallback(() => {
    if (selectedSession) {
      onSessionComplete?.(selectedSession, selectedSession.duration);
    }
    setIsActive(false);
    // Show completion message briefly before reset
    setTimeout(() => {
      resetSession();
    }, 3000);
  }, [selectedSession, onSessionComplete]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeRemaining, handleSessionComplete]);

  // Update guidance every minute during active session
  useEffect(() => {
    if (isActive && selectedSession?.guidance && timeRemaining > 0) {
      const totalDuration = selectedSession.duration;
      const elapsed = totalDuration - timeRemaining;
      const guidanceInterval = Math.floor(totalDuration / selectedSession.guidance.length);
      const newIndex = Math.floor(elapsed / guidanceInterval);
      
      if (newIndex !== currentGuidanceIndex && newIndex < selectedSession.guidance.length) {
        setCurrentGuidanceIndex(newIndex);
      }
    }
  }, [timeRemaining, isActive, selectedSession, currentGuidanceIndex]);

  const startSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration);
    setCurrentGuidanceIndex(0);
    setIsActive(true);
    startTimeRef.current = Date.now();
    onSessionStart?.(session);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const stopSession = () => {
    setIsActive(false);
    if (selectedSession) {
      const elapsedTime = selectedSession.duration - timeRemaining;
      onSessionComplete?.(selectedSession, elapsedTime);
    }
    resetSession();
  };


  const resetSession = () => {
    setSelectedSession(null);
    setTimeRemaining(0);
    setCurrentGuidanceIndex(0);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionIcon = (type: MeditationSession['type']) => {
    const icons = {
      breathing: '🧘‍♀️',
      mindfulness: '🎯',
      'body-scan': '💆‍♀️',
      'loving-kindness': '💗'
    };
    return icons[type] || '🧘‍♀️';
  };

  const progress = selectedSession ? ((selectedSession.duration - timeRemaining) / selectedSession.duration) * 100 : 0;

  if (!selectedSession) {
    // Session Selection View
    return (
      <div className="bg-gradient-to-br from-card to-purple-500/5 rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Meditation</h3>
          <span className="text-2xl">🧘‍♀️</span>
        </div>
        
        <div className="space-y-3">
          {meditationSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => startSession(session)}
              className="w-full text-left p-4 bg-gradient-to-r from-secondary/20 to-purple-500/10 rounded-lg border border-border hover:border-purple-400/50 transition-all duration-200 focus-ring-luxury"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getSessionIcon(session.type)}</span>
                  <div>
                    <h4 className="font-medium text-foreground">{session.name}</h4>
                    <p className="text-xs text-muted-foreground">{session.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-400">{Math.floor(session.duration / 60)} min</p>
                  <p className="text-xs text-muted-foreground">{session.type}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-300 text-center">
            ✨ Find a quiet space and choose a session to begin your meditation practice
          </p>
        </div>
      </div>
    );
  }

  // Active Session View
  return (
    <div className="bg-gradient-to-br from-card to-purple-500/5 rounded-xl p-6 border border-border">
      <div className="text-center space-y-6">
        {/* Session Header */}
        <div>
          <span className="text-4xl mb-2 block">{getSessionIcon(selectedSession.type)}</span>
          <h3 className="text-xl font-semibold text-foreground">{selectedSession.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedSession.description}</p>
        </div>

        {/* Timer Display */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Progress Circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-secondary"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-purple-400 transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-foreground">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-muted-foreground">remaining</div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidance Text */}
        {showGuidance && selectedSession.guidance && timeRemaining > 0 && (
          <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
            <p className="text-sm text-purple-300 leading-relaxed">
              {selectedSession.guidance[currentGuidanceIndex]}
            </p>
            <button
              onClick={() => setShowGuidance(!showGuidance)}
              className="text-xs text-purple-400 hover:text-purple-300 mt-2 transition-colors"
            >
              Hide guidance
            </button>
          </div>
        )}

        {!showGuidance && (
          <button
            onClick={() => setShowGuidance(true)}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            Show guidance
          </button>
        )}

        {/* Session Complete Message */}
        {timeRemaining === 0 && (
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <p className="text-lg text-green-400 mb-2">🎉 Session Complete!</p>
            <p className="text-sm text-green-300">
              Well done! You completed your {selectedSession.name} session.
            </p>
          </div>
        )}

        {/* Control Buttons */}
        {timeRemaining > 0 && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={isActive ? pauseSession : resumeSession}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus-ring-luxury ${
                isActive
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
              }`}
            >
              {isActive ? '⏸️ Pause' : '▶️ Resume'}
            </button>
            
            <button
              onClick={stopSession}
              className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-medium hover:bg-red-500/30 transition-all duration-200 focus-ring-luxury"
            >
              🛑 Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}