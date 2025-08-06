interface ProjectTask {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface Project {
  id: number;
  name: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
  progress: number;
  tasks: ProjectTask[];
}

interface ProjectTasksProps {
  projects: Project[];
  collapsedProjects: Set<number>;
  expandingProjects: Set<number>;
  onToggleProject: (projectId: number) => void;
}

export default function ProjectTasks({
  projects,
  collapsedProjects,
  expandingProjects,
  onToggleProject
}: ProjectTasksProps) {
  
  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'pending': return '⏳';
      default: return '📝';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-yellow-400';
      case 'pending': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-muted-foreground bg-secondary/20 border-border';
    }
  };

  const getProjectColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'gold': 'from-gold/20 to-gold/5 border-gold/30',
      'blue': 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
      'green': 'from-green-500/20 to-green-500/5 border-green-500/30',
      'purple': 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
      'red': 'from-red-500/20 to-red-500/5 border-red-500/30'
    };
    return colorMap[color] || 'from-card to-muted/10 border-border';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground slide-in-from-left-1 delay-500">
          Project Tasks
        </h3>
        <span className="text-2xl slide-in-from-right delay-500">🚀</span>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => {
          const isCollapsed = collapsedProjects.has(project.id);
          const isExpanding = expandingProjects.has(project.id);
          
          return (
            <div key={project.id} className={`task-item delay-${(index + 1) * 100}`}>
              <div className={`bg-gradient-to-br ${getProjectColorClass(project.color)} rounded-xl border transition-all duration-300 overflow-hidden`}>
                {/* Project Header */}
                <button
                  onClick={() => onToggleProject(project.id)}
                  className="w-full p-4 text-left hover:bg-white/5 transition-colors duration-200 focus-ring-luxury"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                          {project.priority.toUpperCase()}
                        </div>
                        <h4 className="font-semibold text-foreground">{project.name}</h4>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium text-foreground">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary/50 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              project.color === 'gold' ? 'bg-gold' :
                              project.color === 'blue' ? 'bg-blue-500' :
                              project.color === 'green' ? 'bg-green-500' :
                              project.color === 'purple' ? 'bg-purple-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <svg 
                      className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ml-4 ${
                        isCollapsed ? 'rotate-0' : 'rotate-180'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Tasks List */}
                <div className={`transition-all duration-400 ease-in-out ${
                  isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
                } ${isExpanding ? 'collapsible-content expanded' : isCollapsed ? 'collapsible-content collapsed' : 'collapsible-content expanded'}`}>
                  <div className="px-4 pb-4 space-y-2 border-t border-border/50">
                    {project.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm">{getTaskIcon(task.status)}</span>
                          <div>
                            <p className="text-sm font-medium text-foreground">{task.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                                {task.status.replace('-', ' ').toUpperCase()}
                              </span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}