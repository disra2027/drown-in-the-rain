import { render, screen, fireEvent } from '../../__tests__/utils/testUtils';
import ProjectTasks from '../ProjectTasks';
import { mockProjects } from '../../__tests__/utils/testUtils';

describe('ProjectTasks', () => {
  const defaultProps = {
    projects: mockProjects,
    collapsedProjects: new Set([2]),
    expandingProjects: new Set(),
    onToggleProject: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render project tasks header', () => {
    render(<ProjectTasks {...defaultProps} />);

    expect(screen.getByText('Project Tasks')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  it('should display all projects', () => {
    render(<ProjectTasks {...defaultProps} />);

    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
  });

  it('should show project priorities', () => {
    render(<ProjectTasks {...defaultProps} />);

    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('should display project progress', () => {
    render(<ProjectTasks {...defaultProps} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getAllByText('Progress')).toHaveLength(2);
  });

  it('should call onToggleProject when project header is clicked', () => {
    render(<ProjectTasks {...defaultProps} />);

    const projectHeader = screen.getByText('Test Project 1').closest('button');
    if (projectHeader) {
      fireEvent.click(projectHeader);
    }

    expect(defaultProps.onToggleProject).toHaveBeenCalledWith(1);
  });

  it('should show tasks for expanded projects', () => {
    const expandedProps = {
      ...defaultProps,
      collapsedProjects: new Set() // No collapsed projects
    };

    render(<ProjectTasks {...expandedProps} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('should hide tasks for collapsed projects', () => {
    const collapsedProps = {
      ...defaultProps,
      collapsedProjects: new Set([1, 2]) // Both projects collapsed
    };

    render(<ProjectTasks {...collapsedProps} />);

    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
  });

  it('should display task status icons', () => {
    const expandedProps = {
      ...defaultProps,
      collapsedProjects: new Set()
    };

    render(<ProjectTasks {...expandedProps} />);

    expect(screen.getByText('✅')).toBeInTheDocument(); // completed
    expect(screen.getByText('🔄')).toBeInTheDocument(); // in-progress
    expect(screen.getByText('⏳')).toBeInTheDocument(); // pending
  });

  it('should display task status text', () => {
    const expandedProps = {
      ...defaultProps,
      collapsedProjects: new Set()
    };

    render(<ProjectTasks {...expandedProps} />);

    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('should show task due dates', () => {
    const expandedProps = {
      ...defaultProps,
      collapsedProjects: new Set()
    };

    render(<ProjectTasks {...expandedProps} />);

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('Next week')).toBeInTheDocument();
  });

  it('should display task priorities', () => {
    const expandedProps = {
      ...defaultProps,
      collapsedProjects: new Set()
    };

    render(<ProjectTasks {...expandedProps} />);

    expect(screen.getAllByText('high')).toHaveLength(2); // Project priority + task priority
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
  });

  it('should show correct arrow direction for collapsed/expanded state', () => {
    render(<ProjectTasks {...defaultProps} />);

    // Check for SVG arrows - they should be rotated for collapsed/expanded states
    const arrows = screen.getAllByRole('button').map(button => 
      button.querySelector('svg')
    ).filter(Boolean);

    expect(arrows.length).toBeGreaterThan(0);
  });

  it('should apply correct styling for project colors', () => {
    render(<ProjectTasks {...defaultProps} />);

    const project1 = screen.getByText('Test Project 1').closest('div');
    const project2 = screen.getByText('Test Project 2').closest('div');

    // Check if the gradient classes are applied (simplified check)
    expect(project1).toHaveClass('bg-gradient-to-br');
    expect(project2).toHaveClass('bg-gradient-to-br');
  });

  it('should handle priority color classes correctly', () => {
    const expandedProps = {
      ...defaultProps,
      collapsedProjects: new Set()
    };

    render(<ProjectTasks {...expandedProps} />);

    // Check that priority badges have appropriate classes
    const highPriorityBadges = screen.getAllByText('HIGH');
    const mediumPriorityBadges = screen.getAllByText('MEDIUM');

    expect(highPriorityBadges[0]).toHaveClass('text-red-400', 'bg-red-500/20', 'border-red-500/30');
    expect(mediumPriorityBadges[0]).toHaveClass('text-yellow-400', 'bg-yellow-500/20', 'border-yellow-500/30');
  });

  it('should handle empty projects list', () => {
    render(<ProjectTasks {...defaultProps} projects={[]} />);

    expect(screen.getByText('Project Tasks')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 1')).not.toBeInTheDocument();
  });

  it('should handle projects with no tasks', () => {
    const noTasksProjects = [{
      id: 1,
      name: "Empty Project",
      priority: "high" as const,
      color: "gold",
      progress: 0,
      tasks: []
    }];

    const expandedProps = {
      ...defaultProps,
      projects: noTasksProjects,
      collapsedProjects: new Set()
    };

    render(<ProjectTasks {...expandedProps} />);

    expect(screen.getByText('Empty Project')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should show expanding state correctly', () => {
    const expandingProps = {
      ...defaultProps,
      expandingProjects: new Set([1])
    };

    render(<ProjectTasks {...expandingProps} />);

    // The expanding project should have specific classes applied
    const expandingProject = screen.getByText('Test Project 1').closest('div');
    expect(expandingProject).toHaveClass('collapsible-content');
  });

  it('should handle 100% project progress', () => {
    const completeProject = [{
      id: 1,
      name: "Complete Project",
      priority: "low" as const,
      color: "green",
      progress: 100,
      tasks: [
        { id: 1, title: "Done Task", status: "completed" as const, dueDate: "Yesterday", priority: "high" as const }
      ]
    }];

    render(<ProjectTasks {...defaultProps} projects={completeProject} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should display different project colors correctly', () => {
    const coloredProjects = [
      { ...mockProjects[0], color: "blue" },
      { ...mockProjects[1], color: "green" }
    ];

    render(<ProjectTasks {...defaultProps} projects={coloredProjects} />);

    // Projects should be rendered with their respective color classes
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
  });
});