import { render, screen, fireEvent, act } from '../../__tests__/utils/testUtils';
import LifeMetrics from '../LifeMetrics';
import { createMockRef, useFakeTimers, useRealTimers } from '../../__tests__/utils/testUtils';

describe('LifeMetrics', () => {
  const defaultProps = {
    // Water tracking
    waterIntake: 6,
    waterGoal: 8,
    showWaterEditor: false,
    isHoldingWater: false,
    waterDropAnimation: false,
    holdTimerRef: createMockRef(null),
    onWaterIntakeChange: jest.fn(),
    onWaterGoalChange: jest.fn(),
    onToggleWaterEditor: jest.fn(),
    onWaterHold: jest.fn(),
    onWaterDropAnimation: jest.fn(),
    
    // Sleep tracking
    sleepTime: "23:00",
    wakeTime: "07:12",
    showSleepEditor: false,
    isHoldingSleep: false,
    sleepHoldTimerRef: createMockRef(null),
    onSleepTimeChange: jest.fn(),
    onWakeTimeChange: jest.fn(),
    onToggleSleepEditor: jest.fn(),
    onSleepHold: jest.fn(),
    
    // Steps tracking
    stepsToday: 8432,
    stepsGoal: 10000,
    showStepsEditor: false,
    isHoldingSteps: false,
    stepsHoldTimerRef: createMockRef(null),
    onStepsTodayChange: jest.fn(),
    onStepsGoalChange: jest.fn(),
    onToggleStepsEditor: jest.fn(),
    onStepsHold: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'clearTimeout');
  });

  afterEach(() => {
    useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Water Tracking', () => {
    it('should display water intake information', () => {
      render(<LifeMetrics {...defaultProps} />);

      expect(screen.getByText('💧')).toBeInTheDocument();
      expect(screen.getByText('Water')).toBeInTheDocument();
      expect(screen.getByText('6 glasses')).toBeInTheDocument();
      expect(screen.getByText('6/8')).toBeInTheDocument();
    });

    it('should show correct water progress bar', () => {
      render(<LifeMetrics {...defaultProps} />);

      // Progress should be (6/8) * 100 = 75%
      const progressBar = screen.getByText('Water').closest('button')?.querySelector('.bg-blue-400');
      expect(progressBar).toHaveStyle({ width: '75%' });
    });

    it('should handle water button press and release', () => {
      render(<LifeMetrics {...defaultProps} />);

      const waterButton = screen.getByText('Water').closest('button');
      if (waterButton) {
        fireEvent.mouseDown(waterButton);
        expect(defaultProps.onWaterHold).toHaveBeenCalledWith(true);

        fireEvent.mouseUp(waterButton);
        expect(defaultProps.onWaterIntakeChange).toHaveBeenCalledWith(7);
        expect(defaultProps.onWaterDropAnimation).toHaveBeenCalledWith(true);
      }
    });

    it('should open editor on long press', () => {
      render(<LifeMetrics {...defaultProps} />);

      const waterButton = screen.getByText('Water').closest('button');
      if (waterButton) {
        fireEvent.mouseDown(waterButton);
        
        act(() => {
          jest.advanceTimersByTime(800);
        });

        expect(defaultProps.onToggleWaterEditor).toHaveBeenCalled();
        expect(defaultProps.onWaterHold).toHaveBeenCalledWith(false);
      }
    });

    it('should not increase water if at goal', () => {
      const atGoalProps = { ...defaultProps, waterIntake: 8 };
      render(<LifeMetrics {...atGoalProps} />);

      const waterButton = screen.getByText('Water').closest('button');
      if (waterButton) {
        fireEvent.mouseDown(waterButton);
        fireEvent.mouseUp(waterButton);
        
        expect(defaultProps.onWaterIntakeChange).not.toHaveBeenCalled();
      }
    });

    it('should show water editor modal when open', () => {
      const editorProps = { ...defaultProps, showWaterEditor: true };
      render(<LifeMetrics {...editorProps} />);

      expect(screen.getByText('Water Intake Tracker')).toBeInTheDocument();
      expect(screen.getByText('Daily Water Goal')).toBeInTheDocument();
      expect(screen.getByText('Stay hydrated for better health and energy')).toBeInTheDocument();
    });
  });

  describe('Sleep Tracking', () => {
    it('should display sleep information', () => {
      render(<LifeMetrics {...defaultProps} />);

      expect(screen.getByText('😴')).toBeInTheDocument();
      expect(screen.getByText('Sleep')).toBeInTheDocument();
      expect(screen.getByText('23:00 - 07:12')).toBeInTheDocument();
      expect(screen.getByText('8.2h')).toBeInTheDocument(); // (7:12 + 24:00) - 23:00 = 8.2h
    });

    it('should calculate sleep hours correctly', () => {
      const customSleepProps = {
        ...defaultProps,
        sleepTime: "22:30",
        wakeTime: "06:30"
      };
      render(<LifeMetrics {...customSleepProps} />);

      expect(screen.getByText('8.0h')).toBeInTheDocument(); // 8 hours exactly
    });

    it('should handle overnight sleep calculation', () => {
      const overnightProps = {
        ...defaultProps,
        sleepTime: "23:30",
        wakeTime: "07:30"
      };
      render(<LifeMetrics {...overnightProps} />);

      expect(screen.getByText('8.0h')).toBeInTheDocument();
    });

    it('should show sleep editor modal when open', () => {
      const editorProps = { ...defaultProps, showSleepEditor: true };
      render(<LifeMetrics {...editorProps} />);

      expect(screen.getByText('Sleep Schedule Tracker')).toBeInTheDocument();
      expect(screen.getByText('Sleep Quality')).toBeInTheDocument();
    });

    it('should handle sleep button interactions', () => {
      render(<LifeMetrics {...defaultProps} />);

      const sleepButton = screen.getByText('Sleep').closest('button');
      if (sleepButton) {
        fireEvent.mouseDown(sleepButton);
        expect(defaultProps.onSleepHold).toHaveBeenCalledWith(true);

        fireEvent.mouseUp(sleepButton);
        expect(defaultProps.onSleepHold).toHaveBeenCalledWith(false);
      }
    });
  });

  describe('Steps Tracking', () => {
    it('should display steps information', () => {
      render(<LifeMetrics {...defaultProps} />);

      expect(screen.getByText('👟')).toBeInTheDocument();
      expect(screen.getByText('Steps')).toBeInTheDocument();
      expect(screen.getByText('8,432')).toBeInTheDocument();
      expect(screen.getByText('8.4k')).toBeInTheDocument();
    });

    it('should show correct steps progress', () => {
      render(<LifeMetrics {...defaultProps} />);

      // Progress should be (8432/10000) * 100 = 84.32%
      const progressBar = screen.getByText('Steps').closest('button')?.querySelector('.bg-green-400');
      expect(progressBar).toHaveStyle({ width: '84.32%' });
    });

    it('should show steps editor modal when open', () => {
      const editorProps = { ...defaultProps, showStepsEditor: true };
      render(<LifeMetrics {...editorProps} />);

      expect(screen.getByText('Daily Steps Tracker')).toBeInTheDocument();
      expect(screen.getByText('Step Goal Progress')).toBeInTheDocument();
      expect(screen.getByText('Every step counts towards a healthier you')).toBeInTheDocument();
    });

    it('should handle steps over goal correctly', () => {
      const overGoalProps = { ...defaultProps, stepsToday: 12000 };
      render(<LifeMetrics {...overGoalProps} />);

      // Progress should be capped at 100%
      const progressBar = screen.getByText('Steps').closest('button')?.querySelector('.bg-green-400');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });
  });

  describe('Modal Interactions', () => {
    it('should handle water editor preset buttons', () => {
      const editorProps = { ...defaultProps, showWaterEditor: true };
      render(<LifeMetrics {...editorProps} />);

      const addOneButton = screen.getByText('+1 Glass');
      fireEvent.click(addOneButton);
      
      expect(defaultProps.onWaterIntakeChange).toHaveBeenCalledWith(7);
    });

    it('should handle water editor reset button', () => {
      const editorProps = { ...defaultProps, showWaterEditor: true };
      render(<LifeMetrics {...editorProps} />);

      const resetButton = screen.getByText('Reset Today');
      fireEvent.click(resetButton);
      
      expect(defaultProps.onWaterIntakeChange).toHaveBeenCalledWith(0);
    });

    it('should handle steps editor preset buttons', () => {
      const editorProps = { ...defaultProps, showStepsEditor: true };
      render(<LifeMetrics {...editorProps} />);

      const add1000Button = screen.getByText('+1000 Steps');
      fireEvent.click(add1000Button);
      
      expect(defaultProps.onStepsTodayChange).toHaveBeenCalledWith(9432);
    });
  });

  describe('Styling and Visual States', () => {
    it('should show holding state for water', () => {
      const holdingProps = { ...defaultProps, isHoldingWater: true };
      render(<LifeMetrics {...holdingProps} />);

      const waterButton = screen.getByText('Water').closest('button');
      expect(waterButton).toHaveClass('border-blue-400', 'shadow-lg', 'scale-95', 'bg-blue-500/20');
    });

    it('should show water drop animation', () => {
      const animationProps = { ...defaultProps, waterDropAnimation: true };
      render(<LifeMetrics {...animationProps} />);

      const animationElement = screen.getByText('Water').closest('button')?.querySelector('.water-drop-animation');
      expect(animationElement).toBeInTheDocument();
    });

    it('should handle timer cleanup properly', () => {
      render(<LifeMetrics {...defaultProps} />);

      const waterButton = screen.getByText('Water').closest('button');
      if (waterButton) {
        fireEvent.mouseDown(waterButton);
        fireEvent.mouseLeave(waterButton);
        
        expect(global.clearTimeout).toHaveBeenCalled();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      const zeroProps = {
        ...defaultProps,
        waterIntake: 0,
        stepsToday: 0
      };
      render(<LifeMetrics {...zeroProps} />);

      expect(screen.getByText('0 glasses')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle very large step counts', () => {
      const largeProps = { ...defaultProps, stepsToday: 50000 };
      render(<LifeMetrics {...largeProps} />);

      expect(screen.getByText('50,000')).toBeInTheDocument();
      expect(screen.getByText('50.0k')).toBeInTheDocument();
    });

    it('should handle same sleep and wake time', () => {
      const sameTimeProps = {
        ...defaultProps,
        sleepTime: "08:00",
        wakeTime: "08:00"
      };
      render(<LifeMetrics {...sameTimeProps} />);

      expect(screen.getByText('24.0h')).toBeInTheDocument(); // Full day
    });
  });
});