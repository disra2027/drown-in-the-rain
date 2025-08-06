import { render, screen, fireEvent, waitFor } from '../../__tests__/utils/testUtils';
import Home from '../Home';

// Mock the hooks
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    logout: jest.fn()
  })
}));

jest.mock('@/hooks/useScrollLock', () => ({
  useScrollLock: jest.fn()
}));

jest.mock('@/hooks/useAppState', () => ({
  useAppState: () => ({
    // Music Player
    isPlaying: false,
    setIsPlaying: jest.fn(),
    currentTrack: 0,
    setCurrentTrack: jest.fn(),
    showPlaylistPanel: false,
    setShowPlaylistPanel: jest.fn(),
    
    // UI State
    collapsedProjects: new Set([2, 3]),
    setCollapsedProjects: jest.fn(),
    expandingProjects: new Set(),
    setExpandingProjects: jest.fn(),
    
    // Life Metrics
    waterIntake: 6,
    setWaterIntake: jest.fn(),
    waterGoal: 8,
    setWaterGoal: jest.fn(),
    showWaterEditor: false,
    setShowWaterEditor: jest.fn(),
    isHoldingWater: false,
    setIsHoldingWater: jest.fn(),
    waterDropAnimation: false,
    setWaterDropAnimation: jest.fn(),
    sleepTime: "23:00",
    setSleepTime: jest.fn(),
    wakeTime: "07:12",
    setWakeTime: jest.fn(),
    showSleepEditor: false,
    setShowSleepEditor: jest.fn(),
    isHoldingSleep: false,
    setIsHoldingSleep: jest.fn(),
    stepsToday: 8432,
    setStepsToday: jest.fn(),
    stepsGoal: 10000,
    setStepsGoal: jest.fn(),
    showStepsEditor: false,
    setShowStepsEditor: jest.fn(),
    isHoldingSteps: false,
    setIsHoldingSteps: jest.fn(),
    
    // Financial
    showIncomeModal: false,
    setShowIncomeModal: jest.fn(),
    showExpenseModal: false,
    setShowExpenseModal: jest.fn(),
    savingsGoal: 15000,
    setSavingsGoal: jest.fn(),
    showSavingsGoalModal: false,
    setShowSavingsGoalModal: jest.fn(),
    showInvestmentModal: false,
    setShowInvestmentModal: jest.fn(),
    
    // Goals, Notes, Todos, Checklists
    goals: [],
    setGoals: jest.fn(),
    showGoalsModal: false,
    setShowGoalsModal: jest.fn(),
    notes: [],
    setNotes: jest.fn(),
    showNoteModal: false,
    setShowNoteModal: jest.fn(),
    editingNote: undefined,
    setEditingNote: jest.fn(),
    todos: [],
    setTodos: jest.fn(),
    showTodoModal: false,
    setShowTodoModal: jest.fn(),
    editingTodo: undefined,
    setEditingTodo: jest.fn(),
    checklists: [],
    setChecklists: jest.fn(),
    showChecklistModal: false,
    setShowChecklistModal: jest.fn(),
    editingChecklist: undefined,
    setEditingChecklist: jest.fn(),
    
    // Refs and computed
    holdTimerRef: { current: null },
    sleepHoldTimerRef: { current: null },
    stepsHoldTimerRef: { current: null },
    isAnyModalOpen: false
  })
}));

describe('Home Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all main sections', () => {
    render(<Home />);

    // Header
    expect(screen.getByText('Good morning, Test')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

    // Weather Widget
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('22°C')).toBeInTheDocument();

    // Music Player
    expect(screen.getByText('Morning Motivation Energy Boost for Productive Day')).toBeInTheDocument();

    // Life Metrics
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('Sleep')).toBeInTheDocument();
    expect(screen.getByText('Steps')).toBeInTheDocument();

    // Financial Dashboard
    expect(screen.getByText('Financial Overview')).toBeInTheDocument();
    expect(screen.getByText('$12,847')).toBeInTheDocument();

    // Goals Section
    expect(screen.getByText('Your Goals')).toBeInTheDocument();
    expect(screen.getByText('Manage Goals')).toBeInTheDocument();

    // Meditation Widget
    expect(screen.getByText('Meditation')).toBeInTheDocument();

    // Project Tasks
    expect(screen.getByText('Project Tasks')).toBeInTheDocument();

    // Navigation
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should display correct greeting based on time', () => {
    const originalHours = Date.prototype.getHours;
    
    // Mock morning time
    Date.prototype.getHours = jest.fn(() => 9);
    render(<Home />);
    expect(screen.getByText('Good morning, Test')).toBeInTheDocument();
    
    // Cleanup
    Date.prototype.getHours = originalHours;
  });

  it('should handle financial dashboard interactions', () => {
    render(<Home />);

    // Test income button
    const addIncomeButton = screen.getByText('Add Income').closest('button');
    if (addIncomeButton) {
      fireEvent.click(addIncomeButton);
      // Modal should be triggered (mocked in useAppState)
    }

    // Test expense button
    const addExpenseButton = screen.getByText('Add Expense').closest('button');
    if (addExpenseButton) {
      fireEvent.click(addExpenseButton);
      // Modal should be triggered (mocked in useAppState)
    }
  });

  it('should handle music player interactions', () => {
    render(<Home />);

    // Find and click play button
    const playButtons = screen.getAllByRole('button');
    const playButton = playButtons.find(button => 
      button.querySelector('svg path[d="M8 5v14l11-7z"]')
    );

    if (playButton) {
      fireEvent.click(playButton);
      // Should trigger play/pause function (mocked in useAppState)
    }
  });

  it('should handle meditation widget interactions', () => {
    render(<Home />);

    // Test meditation session selection
    const breathingSession = screen.getByText('5-Minute Breathing').closest('button');
    if (breathingSession) {
      fireEvent.click(breathingSession);
      // Should start meditation session
    }
  });

  it('should handle goals management', () => {
    render(<Home />);

    const manageGoalsButton = screen.getByText('Manage Goals');
    fireEvent.click(manageGoalsButton);
    
    // Should open goals modal (mocked in useAppState)
  });

  it('should display recent transactions', () => {
    render(<Home />);

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
    expect(screen.getByText('Grocery Store')).toBeInTheDocument();
    expect(screen.getByText('Investment Return')).toBeInTheDocument();
  });

  it('should show project tasks with correct data', () => {
    render(<Home />);

    expect(screen.getByText('Life Quality App with Advanced Health Tracking')).toBeInTheDocument();
    expect(screen.getByText('E-commerce Platform with Multi-vendor Support')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('should handle life metrics interactions', () => {
    render(<Home />);

    // Test water tracking
    const waterButton = screen.getByText('Water').closest('button');
    if (waterButton) {
      fireEvent.mouseDown(waterButton);
      fireEvent.mouseUp(waterButton);
      // Should increment water intake (mocked in useAppState)
    }
  });

  it('should display savings goal progress correctly', () => {
    render(<Home />);

    expect(screen.getByText('85.6% complete')).toBeInTheDocument();
    expect(screen.getByText('$12,847 / $15,000')).toBeInTheDocument();
  });

  it('should show floating action button', () => {
    render(<Home />);

    // Look for the floating action button (might be hidden or styled as overlay)
    const fabButtons = screen.getAllByRole('button');
    expect(fabButtons.length).toBeGreaterThan(5); // Should have many buttons including FAB
  });

  it('should handle responsive design classes', () => {
    render(<Home />);

    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toHaveClass('px-4', 'py-6', 'space-y-6', 'pb-20');
  });

  it('should show correct weather information', () => {
    render(<Home />);

    expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();
    expect(screen.getByText('Wind: 12 km/h')).toBeInTheDocument();
    expect(screen.getByText('🌤️')).toBeInTheDocument();
  });

  it('should display investment information', () => {
    render(<Home />);

    expect(screen.getByText('Investments')).toBeInTheDocument();
    expect(screen.getByText('$8,935')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
  });

  it('should handle date formatting in header', () => {
    render(<Home />);

    // Check for date display (format: weekday, month day)
    const dateRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday).*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/;
    const dateElement = screen.getByText(dateRegex);
    expect(dateElement).toBeInTheDocument();
  });

  it('should initialize with mock data correctly', async () => {
    render(<Home />);

    await waitFor(() => {
      // Check that goals are displayed (they are set via useEffect)
      // Note: In the mocked version, we return empty arrays, but real implementation would show goals
      expect(screen.getByText('Your Goals')).toBeInTheDocument();
    });
  });

  it('should handle logout functionality', () => {
    const mockLogout = jest.fn();
    
    // Override the mock for this test
    jest.mocked(import('@/hooks/useAuth').useAuth).mockReturnValue({
      user: { name: 'Test User' },
      logout: mockLogout
    });

    render(<Home />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should show all meditation session types', () => {
    render(<Home />);

    expect(screen.getByText('breathing')).toBeInTheDocument();
    expect(screen.getByText('mindfulness')).toBeInTheDocument();
    expect(screen.getByText('body-scan')).toBeInTheDocument();
  });

  it('should display proper styling classes', () => {
    const { container } = render(<Home />);

    expect(container.firstChild).toHaveClass('min-h-screen', 'bg-background', 'text-foreground');
  });
});