import { renderHook, act } from '@testing-library/react';
import { useAppState } from '../useAppState';

describe('useAppState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAppState());

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrack).toBe(0);
    expect(result.current.showPlaylistPanel).toBe(false);
    expect(result.current.waterIntake).toBe(6);
    expect(result.current.waterGoal).toBe(8);
    expect(result.current.sleepTime).toBe("23:00");
    expect(result.current.wakeTime).toBe("07:12");
    expect(result.current.stepsToday).toBe(8432);
    expect(result.current.stepsGoal).toBe(10000);
    expect(result.current.showIncomeModal).toBe(false);
    expect(result.current.goals).toEqual([]);
    expect(result.current.notes).toEqual([]);
    expect(result.current.todos).toEqual([]);
    expect(result.current.checklists).toEqual([]);
  });

  describe('Music Player State', () => {
    it('should toggle music playback state', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.isPlaying).toBe(false);

      act(() => {
        result.current.setIsPlaying(true);
      });

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.setIsPlaying(false);
      });

      expect(result.current.isPlaying).toBe(false);
    });

    it('should change current track', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.currentTrack).toBe(0);

      act(() => {
        result.current.setCurrentTrack(2);
      });

      expect(result.current.currentTrack).toBe(2);
    });

    it('should toggle playlist panel', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.showPlaylistPanel).toBe(false);

      act(() => {
        result.current.setShowPlaylistPanel(true);
      });

      expect(result.current.showPlaylistPanel).toBe(true);
    });
  });

  describe('Life Metrics State', () => {
    it('should update water intake and goal', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setWaterIntake(7);
        result.current.setWaterGoal(10);
      });

      expect(result.current.waterIntake).toBe(7);
      expect(result.current.waterGoal).toBe(10);
    });

    it('should toggle water editor modal', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.showWaterEditor).toBe(false);

      act(() => {
        result.current.setShowWaterEditor(true);
      });

      expect(result.current.showWaterEditor).toBe(true);
    });

    it('should update sleep times', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setSleepTime("22:30");
        result.current.setWakeTime("06:30");
      });

      expect(result.current.sleepTime).toBe("22:30");
      expect(result.current.wakeTime).toBe("06:30");
    });

    it('should update steps data', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setStepsToday(5000);
        result.current.setStepsGoal(8000);
      });

      expect(result.current.stepsToday).toBe(5000);
      expect(result.current.stepsGoal).toBe(8000);
    });
  });

  describe('Modal States', () => {
    it('should handle income modal state', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setShowIncomeModal(true);
      });

      expect(result.current.showIncomeModal).toBe(true);
      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it('should handle expense modal state', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setShowExpenseModal(true);
      });

      expect(result.current.showExpenseModal).toBe(true);
      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it('should handle goals modal state', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setShowGoalsModal(true);
      });

      expect(result.current.showGoalsModal).toBe(true);
      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it('should handle note modal state', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setShowNoteModal(true);
      });

      expect(result.current.showNoteModal).toBe(true);
      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it('should calculate isAnyModalOpen correctly', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.isAnyModalOpen).toBe(false);

      act(() => {
        result.current.setShowIncomeModal(true);
      });

      expect(result.current.isAnyModalOpen).toBe(true);

      act(() => {
        result.current.setShowIncomeModal(false);
        result.current.setShowExpenseModal(true);
      });

      expect(result.current.isAnyModalOpen).toBe(true);

      act(() => {
        result.current.setShowExpenseModal(false);
      });

      expect(result.current.isAnyModalOpen).toBe(false);
    });
  });

  describe('Data Collections State', () => {
    it('should update goals array', () => {
      const { result } = renderHook(() => useAppState());
      const mockGoals = [
        {
          id: "1",
          title: "Test Goal",
          description: "Test description",
          targetValue: 100,
          currentValue: 50,
          unit: "points",
          category: "Test",
          isFavorite: false,
          color: "bg-blue-500",
          createdAt: new Date(),
          targetDate: new Date()
        }
      ];

      act(() => {
        result.current.setGoals(mockGoals);
      });

      expect(result.current.goals).toEqual(mockGoals);
    });

    it('should update notes array', () => {
      const { result } = renderHook(() => useAppState());
      const mockNotes = [
        {
          id: "1",
          title: "Test Note",
          content: "Test content",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      act(() => {
        result.current.setNotes(mockNotes);
      });

      expect(result.current.notes).toEqual(mockNotes);
    });

    it('should update todos array', () => {
      const { result } = renderHook(() => useAppState());
      const mockTodos = [
        {
          id: "1",
          title: "Test Todo",
          description: "Test description",
          completed: false,
          priority: 'high' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      act(() => {
        result.current.setTodos(mockTodos);
      });

      expect(result.current.todos).toEqual(mockTodos);
    });
  });

  describe('Timer Refs', () => {
    it('should provide timer refs', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.holdTimerRef).toBeDefined();
      expect(result.current.sleepHoldTimerRef).toBeDefined();
      expect(result.current.stepsHoldTimerRef).toBeDefined();
    });

    it('should cleanup timers on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      const { result, unmount } = renderHook(() => useAppState());

      // Set some timers
      act(() => {
        result.current.holdTimerRef.current = setTimeout(() => {}, 1000);
        result.current.sleepHoldTimerRef.current = setTimeout(() => {}, 1000);
        result.current.stepsHoldTimerRef.current = setTimeout(() => {}, 1000);
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalledTimes(3);
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('UI State', () => {
    it('should handle collapsed projects state', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.collapsedProjects).toEqual(new Set([2, 3]));

      act(() => {
        result.current.setCollapsedProjects(new Set([1, 4]));
      });

      expect(result.current.collapsedProjects).toEqual(new Set([1, 4]));
    });

    it('should handle expanding projects state', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.expandingProjects).toEqual(new Set());

      act(() => {
        result.current.setExpandingProjects(new Set([1, 2]));
      });

      expect(result.current.expandingProjects).toEqual(new Set([1, 2]));
    });
  });
});