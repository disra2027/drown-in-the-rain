import { render, screen, fireEvent, waitFor } from '../../__tests__/utils/testUtils';
import MeditationWidget from '../MeditationWidget';
import { useFakeTimers, useRealTimers, advanceTimersByTime } from '../../__tests__/utils/testUtils';

describe('MeditationWidget', () => {
  const mockProps = {
    onSessionStart: jest.fn(),
    onSessionComplete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useFakeTimers();
  });

  afterEach(() => {
    useRealTimers();
  });

  it('should render session selection initially', () => {
    render(<MeditationWidget {...mockProps} />);

    expect(screen.getByText('Meditation')).toBeInTheDocument();
    expect(screen.getByText('5-Minute Breathing')).toBeInTheDocument();
    expect(screen.getByText('10-Minute Mindfulness')).toBeInTheDocument();
    expect(screen.getByText('15-Minute Body Scan')).toBeInTheDocument();
  });

  it('should display session details in selection view', () => {
    render(<MeditationWidget {...mockProps} />);

    expect(screen.getByText('Simple breathing meditation to center yourself')).toBeInTheDocument();
    expect(screen.getByText('Present moment awareness meditation')).toBeInTheDocument();
    expect(screen.getByText('Progressive relaxation through body awareness')).toBeInTheDocument();
    
    expect(screen.getByText('5 min')).toBeInTheDocument();
    expect(screen.getByText('10 min')).toBeInTheDocument();
    expect(screen.getByText('15 min')).toBeInTheDocument();
  });

  it('should start a meditation session when clicked', () => {
    render(<MeditationWidget {...mockProps} />);

    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    expect(screen.getByText('5-Minute Breathing')).toBeInTheDocument();
    expect(screen.getByText('5:00')).toBeInTheDocument();
    expect(mockProps.onSessionStart).toHaveBeenCalledWith(expect.objectContaining({
      name: '5-Minute Breathing',
      duration: 300,
      type: 'breathing'
    }));
  });

  it('should display timer and controls during active session', () => {
    render(<MeditationWidget {...mockProps} />);

    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    expect(screen.getByText('5:00')).toBeInTheDocument();
    expect(screen.getByText('remaining')).toBeInTheDocument();
    expect(screen.getByText('▶️ Resume')).toBeInTheDocument();
    expect(screen.getByText('🛑 Stop')).toBeInTheDocument();
  });

  it('should show guidance text during session', () => {
    render(<MeditationWidget {...mockProps} />);

    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    expect(screen.getByText('Find a comfortable position and close your eyes')).toBeInTheDocument();
  });

  it('should pause and resume session', () => {
    render(<MeditationWidget {...mockProps} />);

    // Start session
    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    // Should show resume button initially (session auto-starts)
    const resumeButton = screen.getByText('▶️ Resume');
    fireEvent.click(resumeButton);

    // Should show pause button when playing
    expect(screen.getByText('⏸️ Pause')).toBeInTheDocument();

    // Click pause
    const pauseButton = screen.getByText('⏸️ Pause');
    fireEvent.click(pauseButton);

    // Should show resume button again
    expect(screen.getByText('▶️ Resume')).toBeInTheDocument();
  });

  it('should stop session and return to selection', () => {
    render(<MeditationWidget {...mockProps} />);

    // Start session
    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    // Stop session
    const stopButton = screen.getByText('🛑 Stop');
    fireEvent.click(stopButton);

    // Should return to session selection
    expect(screen.getByText('5-Minute Breathing')).toBeInTheDocument();
    expect(screen.getByText('10-Minute Mindfulness')).toBeInTheDocument();
    expect(mockProps.onSessionComplete).toHaveBeenCalled();
  });

  it('should update timer countdown', async () => {
    render(<MeditationWidget {...mockProps} />);

    // Start session
    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    // Resume the session
    const resumeButton = screen.getByText('▶️ Resume');
    fireEvent.click(resumeButton);

    // Fast-forward time
    advanceTimersByTime(60000); // 1 minute

    await waitFor(() => {
      expect(screen.getByText('4:00')).toBeInTheDocument();
    });
  });

  it('should complete session when timer reaches zero', async () => {
    render(<MeditationWidget {...mockProps} />);

    // Start session
    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    // Resume the session
    const resumeButton = screen.getByText('▶️ Resume');
    fireEvent.click(resumeButton);

    // Fast-forward to completion
    advanceTimersByTime(300000); // 5 minutes

    await waitFor(() => {
      expect(screen.getByText('🎉 Session Complete!')).toBeInTheDocument();
      expect(screen.getByText('Well done! You completed your 5-Minute Breathing session.')).toBeInTheDocument();
    });

    expect(mockProps.onSessionComplete).toHaveBeenCalledWith(
      expect.objectContaining({ name: '5-Minute Breathing' }),
      300
    );
  });

  it('should hide and show guidance', () => {
    render(<MeditationWidget {...mockProps} />);

    // Start session
    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    // Hide guidance
    const hideButton = screen.getByText('Hide guidance');
    fireEvent.click(hideButton);

    expect(screen.queryByText('Find a comfortable position and close your eyes')).not.toBeInTheDocument();
    expect(screen.getByText('Show guidance')).toBeInTheDocument();

    // Show guidance again
    const showButton = screen.getByText('Show guidance');
    fireEvent.click(showButton);

    expect(screen.getByText('Find a comfortable position and close your eyes')).toBeInTheDocument();
  });

  it('should update guidance text during session', async () => {
    render(<MeditationWidget {...mockProps} />);

    // Start session
    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    // Resume the session
    const resumeButton = screen.getByText('▶️ Resume');
    fireEvent.click(resumeButton);

    // Initial guidance
    expect(screen.getByText('Find a comfortable position and close your eyes')).toBeInTheDocument();

    // Fast-forward to trigger guidance change
    advanceTimersByTime(60000); // 1 minute

    await waitFor(() => {
      // Should show next guidance step
      expect(screen.queryByText('Find a comfortable position and close your eyes')).not.toBeInTheDocument();
    });
  });

  it('should display different session types with correct icons', () => {
    render(<MeditationWidget {...mockProps} />);

    // Check session type indicators
    expect(screen.getByText('breathing')).toBeInTheDocument();
    expect(screen.getByText('mindfulness')).toBeInTheDocument();
    expect(screen.getByText('body-scan')).toBeInTheDocument();
  });

  it('should show progress circle during active session', () => {
    render(<MeditationWidget {...mockProps} />);

    // Start session
    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
    }

    // Check for SVG progress circle
    const progressCircle = screen.getByRole('img', { hidden: true }) || 
                          document.querySelector('svg circle[stroke-dasharray]');
    
    expect(progressCircle).toBeInTheDocument();
  });

  it('should handle different session types', () => {
    render(<MeditationWidget {...mockProps} />);

    // Test mindfulness session
    const mindfulnessSession = screen.getByText('10-Minute Mindfulness').closest('button');
    if (mindfulnessSession) {
      fireEvent.click(mindfulnessSession);
    }

    expect(screen.getByText('10-Minute Mindfulness')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(mockProps.onSessionStart).toHaveBeenCalledWith(expect.objectContaining({
      name: '10-Minute Mindfulness',
      duration: 600,
      type: 'mindfulness'
    }));
  });
});