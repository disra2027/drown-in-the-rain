"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNavigation from "@/components/BottomNavigation";

// Type definitions
type TaskStatus = 'completed' | 'in-progress' | 'pending';
type ChartColor = 'bg-chart-1' | 'bg-chart-2' | 'bg-chart-3' | 'bg-chart-4' | 'bg-chart-5';
type FilterStatus = 'all' | TaskStatus;
type SortBy = 'title' | 'status' | 'startCol' | 'duration';

interface Task {
  title: string;
  status: TaskStatus;
  startCol: number;
  duration: number;
  color: ChartColor;
}

interface Project {
  id: number;
  name: string;
  description: string;
  dateRange: string;
  tasks: Task[];
  completed: number;
  inProgress: number;
  pending: number;
}

const projects: Project[] = [
  { 
    id: 1, 
    name: "Drown in the Rain", 
    description: "Personal productivity and life management app",
    dateRange: "Jan 2024 - Apr 2024",
    tasks: [
      { title: "Project Kickoff", status: "completed", startCol: 0, duration: 1, color: "bg-chart-2" },
      { title: "User Research", status: "completed", startCol: 0, duration: 2, color: "bg-chart-1" },
      { title: "Design System", status: "completed", startCol: 1, duration: 2, color: "bg-chart-3" },
      { title: "Authentication", status: "completed", startCol: 2, duration: 2, color: "bg-chart-4" },
      { title: "Dashboard UI", status: "in-progress", startCol: 3, duration: 3, color: "bg-chart-5" },
      { title: "Data Integration", status: "in-progress", startCol: 4, duration: 2, color: "bg-chart-1" },
      { title: "Testing & QA", status: "pending", startCol: 5, duration: 2, color: "bg-chart-2" },
      { title: "Deployment", status: "pending", startCol: 6, duration: 1, color: "bg-chart-3" }
    ],
    completed: 4,
    inProgress: 2,
    pending: 2
  },
  { 
    id: 2, 
    name: "E-commerce Platform", 
    description: "Online shopping platform with React",
    dateRange: "Feb 2024 - Jun 2024",
    tasks: [
      { title: "Market Analysis", status: "completed", startCol: 0, duration: 2, color: "bg-chart-1" },
      { title: "Architecture Design", status: "completed", startCol: 1, duration: 2, color: "bg-chart-2" },
      { title: "Product Catalog", status: "completed", startCol: 2, duration: 3, color: "bg-chart-3" },
      { title: "Shopping Cart", status: "in-progress", startCol: 3, duration: 2, color: "bg-chart-4" },
      { title: "Payment Gateway", status: "in-progress", startCol: 4, duration: 3, color: "bg-chart-5" },
      { title: "Order Management", status: "pending", startCol: 5, duration: 2, color: "bg-chart-1" },
      { title: "Mobile Optimization", status: "pending", startCol: 6, duration: 2, color: "bg-chart-2" },
      { title: "Launch Preparation", status: "pending", startCol: 7, duration: 1, color: "bg-chart-3" }
    ],
    completed: 3,
    inProgress: 2,
    pending: 3
  },
  { 
    id: 3, 
    name: "Task Manager Pro", 
    description: "Advanced project management tool",
    dateRange: "Mar 2024 - Aug 2024",
    tasks: [
      { title: "Competitive Analysis", status: "completed", startCol: 0, duration: 1, color: "bg-chart-2" },
      { title: "Feature Planning", status: "completed", startCol: 1, duration: 2, color: "bg-chart-1" },
      { title: "Database Design", status: "completed", startCol: 2, duration: 2, color: "bg-chart-3" },
      { title: "User Management", status: "completed", startCol: 3, duration: 2, color: "bg-chart-4" },
      { title: "Authentication System", status: "completed", startCol: 2, duration: 2, color: "bg-chart-5" },
      { title: "Task Creation UI", status: "in-progress", startCol: 4, duration: 3, color: "bg-chart-1" },
      { title: "Task Assignment Logic", status: "in-progress", startCol: 4, duration: 2, color: "bg-chart-2" },
      { title: "Team Collaboration", status: "pending", startCol: 5, duration: 3, color: "bg-chart-3" },
      { title: "Real-time Notifications", status: "pending", startCol: 5, duration: 2, color: "bg-chart-4" },
      { title: "File Attachments", status: "pending", startCol: 6, duration: 2, color: "bg-chart-5" },
      { title: "Time Tracking", status: "pending", startCol: 6, duration: 2, color: "bg-chart-1" },
      { title: "Reporting Dashboard", status: "pending", startCol: 6, duration: 2, color: "bg-chart-2" },
      { title: "Analytics Engine", status: "pending", startCol: 7, duration: 1, color: "bg-chart-3" },
      { title: "Mobile App", status: "pending", startCol: 7, duration: 1, color: "bg-chart-4" },
      { title: "Performance Testing", status: "pending", startCol: 7, duration: 1, color: "bg-chart-5" },
      { title: "Security Audit", status: "pending", startCol: 7, duration: 1, color: "bg-chart-1" },
      { title: "Beta Launch", status: "pending", startCol: 7, duration: 1, color: "bg-chart-2" },
      { title: "User Onboarding", status: "pending", startCol: 7, duration: 1, color: "bg-chart-3" }
    ],
    completed: 5,
    inProgress: 2,
    pending: 11
  },
  { 
    id: 4, 
    name: "Weather Dashboard", 
    description: "Real-time weather monitoring system",
    dateRange: "Apr 2024 - Jul 2024",
    tasks: [
      { title: "API Research", status: "completed", startCol: 0, duration: 1, color: "bg-chart-1" },
      { title: "UI Wireframes", status: "completed", startCol: 1, duration: 2, color: "bg-chart-2" },
      { title: "Data Visualization", status: "in-progress", startCol: 2, duration: 3, color: "bg-chart-3" },
      { title: "Location Services", status: "in-progress", startCol: 3, duration: 2, color: "bg-chart-4" },
      { title: "Weather Alerts", status: "pending", startCol: 4, duration: 2, color: "bg-chart-5" },
      { title: "Historical Data", status: "pending", startCol: 5, duration: 3, color: "bg-chart-1" },
      { title: "Mobile App", status: "pending", startCol: 6, duration: 2, color: "bg-chart-2" },
      { title: "Production Deploy", status: "pending", startCol: 7, duration: 1, color: "bg-chart-3" }
    ],
    completed: 2,
    inProgress: 2,
    pending: 4
  }
];

export default function Timeline() {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projectTasks, setProjectTasks] = useState<Task[]>(projects[0].tasks);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('startCol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Ensure projectTasks stay in sync with selectedProject
  useEffect(() => {
    setProjectTasks(selectedProject.tasks);
  }, [selectedProject]);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleProjectSelect = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsDropdownOpen(false);
  };

  const handleTaskStatusChange = (taskIndex: number, newStatus: string) => {
    const updatedTasks = [...projectTasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: newStatus as "completed" | "in-progress" | "pending" };
    setProjectTasks(updatedTasks);
  };

  const handleTaskTitleChange = (taskIndex: number, newTitle: string) => {
    const updatedTasks = [...projectTasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], title: newTitle };
    setProjectTasks(updatedTasks);
  };

  const handleTaskDateChange = (taskIndex: number, field: 'startCol' | 'duration', value: number) => {
    const updatedTasks = [...projectTasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], [field]: value };
    setProjectTasks(updatedTasks);
  };

  const moveTask = (fromIndex: number, toIndex: number) => {
    const updatedTasks = [...projectTasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setProjectTasks(updatedTasks);
  };

  const addNewTask = () => {
    const newTask: Task = {
      title: "New Task",
      status: "pending",
      startCol: 0,
      duration: 1,
      color: "bg-chart-1"
    };
    setProjectTasks([...projectTasks, newTask]);
    // Automatically start editing the new task
    setEditingTask(projectTasks.length);
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = projectTasks
    .filter(task => {
      // Filter by status
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      
      // Filter by search term
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          // Custom order: completed, in-progress, pending
          const statusOrder: Record<string, number> = { 'completed': 0, 'in-progress': 1, 'pending': 2 };
          aValue = statusOrder[a.status] ?? 3;
          bValue = statusOrder[b.status] ?? 3;
          break;
        case 'startCol':
          aValue = a.startCol;
          bValue = b.startCol;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Calculate dynamic task counts
  const completedCount = projectTasks.filter(task => task.status === 'completed').length;
  const inProgressCount = projectTasks.filter(task => task.status === 'in-progress').length;
  const pendingCount = projectTasks.filter(task => task.status === 'pending').length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 slide-in-from-top-1">
          <div className="px-4 py-3">
            {/* Project Selector */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-muted/50 hover:bg-muted/70 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-chart-1 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {selectedProject.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{selectedProject.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedProject.description}</div>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        selectedProject.id === project.id ? 'bg-muted/30' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-chart-2 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{project.name}</div>
                        <div className="text-xs text-muted-foreground">{project.description}</div>
                      </div>
                      {selectedProject.id === project.id && (
                        <svg className="w-4 h-4 text-chart-1 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-3">
          {/* Progress Summary */}
          <div className="grid grid-cols-3 gap-3 text-sm mb-4">
            <div className="bg-muted/30 rounded-lg p-3 transition-all duration-300 hover:bg-muted/40">
              <div className="text-muted-foreground">Completed</div>
              <div className="font-medium text-chart-2 transition-all duration-500">{completedCount} Tasks</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 transition-all duration-300 hover:bg-muted/40">
              <div className="text-muted-foreground">In Progress</div>
              <div className="font-medium text-chart-3 transition-all duration-500">{inProgressCount} Tasks</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 transition-all duration-300 hover:bg-muted/40">
              <div className="text-muted-foreground">Pending</div>
              <div className="font-medium text-muted-foreground transition-all duration-500">{pendingCount} Tasks</div>
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground break-words">{selectedProject.name}</h2>
              <div className="text-sm text-muted-foreground whitespace-nowrap">{selectedProject.dateRange}</div>
            </div>
            
            {/* Gantt Chart Container */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Header */}
                <div className="grid grid-cols-12 gap-1 mb-2 text-xs text-muted-foreground">
                  <div className="col-span-4 min-w-[160px]"></div>
                  <div className="text-center">Week 1</div>
                  <div className="text-center">Week 2</div>
                  <div className="text-center">Week 3</div>
                  <div className="text-center">Week 4</div>
                  <div className="text-center">Week 5</div>
                  <div className="text-center">Week 6</div>
                  <div className="text-center">Week 7</div>
                  <div className="text-center">Week 8</div>
                </div>

                {/* Gantt Chart Tasks */}
                <div className="max-h-64 overflow-y-auto pr-2 space-y-1 pb-2">
                  {projectTasks.map((task, index) => (
                    <div key={index} className="grid grid-cols-12 gap-1 items-center min-h-[28px] py-0.5 px-1 rounded hover:bg-muted/20 transition-colors">
                      {/* Task Name */}
                      <div className="col-span-4 min-w-[160px] text-xs font-medium text-foreground pr-2">
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            task.status === 'completed' ? 'bg-chart-2' : 
                            task.status === 'in-progress' ? 'bg-chart-3' : 'bg-muted'
                          }`} />
                          <span className="truncate min-w-0" title={task.title}>{task.title}</span>
                        </div>
                      </div>
                      
                      {/* Gantt Bar */}
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="h-4 relative min-w-[40px] px-0.5">
                          {i >= task.startCol && i < task.startCol + task.duration && (
                            <div 
                              className={`h-full rounded-sm ${task.color} ${
                                task.status === 'pending' ? 'opacity-50' : 
                                task.status === 'in-progress' ? 'opacity-75' : 'opacity-100'
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Task List - Editable */}
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="flex flex-col gap-3 mb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Task Details</h3>
                <button 
                  onClick={addNewTask}
                  className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors"
                >
                  + Add Task
                </button>
              </div>
              
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
                  />
                </div>
                
                {/* Filter and Sort Controls */}
                <div className="flex items-center gap-2">
                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                    className="bg-background border border-border rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="bg-background border border-border rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                  >
                    <option value="startCol">Sort by Start</option>
                    <option value="title">Sort by Name</option>
                    <option value="status">Sort by Status</option>
                    <option value="duration">Sort by Duration</option>
                  </select>
                  
                  {/* Sort Order */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 bg-background border border-border rounded-lg hover:bg-muted/20 transition-all duration-200 hover:border-primary/50 active:scale-95"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className={`transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>
                      <path d="M6 0L10 4H8V8H4V4H2L6 0Z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Results Count */}
              {(searchTerm || filterStatus !== 'all') && (
                <div className="text-xs text-muted-foreground animate-in fade-in-50 slide-in-from-top-2 duration-300">
                  Showing <span className="font-medium text-primary transition-all duration-500">{filteredAndSortedTasks.length}</span> of <span className="font-medium">{projectTasks.length}</span> tasks
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {filteredAndSortedTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground animate-in fade-in-50 duration-300">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 opacity-50 animate-in zoom-in-95 duration-500 delay-100">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="21 21l-4.35-4.35"/>
                  </svg>
                  <p className="animate-in slide-in-from-bottom-2 duration-300 delay-200">No tasks found</p>
                  <p className="text-xs mt-1 animate-in slide-in-from-bottom-2 duration-300 delay-300">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredAndSortedTasks.map((task, index) => {
                  // Find the original index for editing functionality
                  const originalIndex = projectTasks.findIndex(t => t === task);
                  
                  return (
                <div 
                  key={`${task.title}-${originalIndex}`}
                  draggable={!isMobile}
                  onDragStart={(e) => {
                    if (isMobile) {
                      e.preventDefault();
                      return;
                    }
                    e.dataTransfer.setData('text/plain', index.toString());
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    if (isMobile) return;
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    if (fromIndex !== index) moveTask(fromIndex, index);
                  }}
                  className={`group relative p-3 rounded-lg border transition-all duration-300 transform ${!isMobile ? 'cursor-move' : ''}
                    ${task.status === 'completed' ? 'border-chart-2/30 bg-chart-2/5 hover:border-chart-2/50' : 
                      task.status === 'in-progress' ? 'border-chart-3/30 bg-chart-3/5 hover:border-chart-3/50' : 
                      'border-border/50 bg-card/50 hover:border-border'} 
                    hover:shadow-md hover:-translate-y-0.5 animate-in fade-in-0 slide-in-from-bottom-4`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationDuration: '400ms'
                  }}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-medium
                    ${task.status === 'completed' ? 'bg-chart-2/20 text-chart-2 border border-chart-2/30' : 
                      task.status === 'in-progress' ? 'bg-chart-3/20 text-chart-3 border border-chart-3/30' : 
                      'bg-muted/50 text-muted-foreground border border-muted'}`}
                  >
                    {task.status === 'completed' ? '✓' : 
                     task.status === 'in-progress' ? '⟳' : '○'}
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Header Row */}
                    <div className="flex items-center gap-2 pr-12">
                      {/* Drag Handle - Desktop Only */}
                      <div className="hidden sm:block text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing transition-colors">
                        <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
                          <circle cx="2" cy="3" r="1"/>
                          <circle cx="7" cy="3" r="1"/>
                          <circle cx="2" cy="8" r="1"/>
                          <circle cx="7" cy="8" r="1"/>
                          <circle cx="2" cy="13" r="1"/>
                          <circle cx="7" cy="13" r="1"/>
                        </svg>
                      </div>

                      {/* Mobile Reorder Controls */}
                      <div className="sm:hidden flex flex-col gap-0.5">
                        <button
                          onClick={() => originalIndex > 0 && moveTask(originalIndex, originalIndex - 1)}
                          disabled={originalIndex === 0}
                          className={`p-0.5 rounded text-xs transition-colors ${
                            originalIndex === 0 
                              ? 'text-muted-foreground/30 cursor-not-allowed' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                          }`}
                        >
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                            <path d="M5 0L0 5h10L5 0z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => originalIndex < projectTasks.length - 1 && moveTask(originalIndex, originalIndex + 1)}
                          disabled={originalIndex === projectTasks.length - 1}
                          className={`p-0.5 rounded text-xs transition-colors ${
                            originalIndex === projectTasks.length - 1 
                              ? 'text-muted-foreground/30 cursor-not-allowed' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                          }`}
                        >
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                            <path d="M5 6L10 1H0l5 5z"/>
                          </svg>
                        </button>
                      </div>

                      {/* Status Dot */}
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center border
                        ${task.status === 'completed' ? 'bg-chart-2 border-chart-2' : 
                          task.status === 'in-progress' ? 'bg-chart-3 border-chart-3' : 
                          'bg-transparent border-muted'}`}
                      >
                        {task.status === 'completed' && <span className="text-white text-xs">✓</span>}
                        {task.status === 'in-progress' && <span className="text-white text-xs">•</span>}
                      </div>
                      
                      {/* Title */}
                      <div className="flex-1 min-w-0 flex items-center">
                        {editingTask === originalIndex ? (
                          <input 
                            type="text" 
                            value={task.title || ""}
                            onChange={(e) => handleTaskTitleChange(originalIndex, e.target.value)}
                            onBlur={() => setEditingTask(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingTask(null)}
                            className="w-full bg-background/80 text-sm font-medium text-foreground border border-primary rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/20"
                            autoFocus
                          />
                        ) : (
                          <h4 
                            onClick={() => setEditingTask(originalIndex)}
                            className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors leading-tight truncate"
                            title={task.title || "Untitled Task"}
                          >
                            {task.title || "Untitled Task"}
                          </h4>
                        )}
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      {/* Action Controls */}
                      <div className="flex items-center gap-2 ml-auto">
                        <select 
                          value={task.startCol}
                          onChange={(e) => handleTaskDateChange(originalIndex, 'startCol', parseInt(e.target.value))}
                          className="bg-background border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
                        >
                          {[...Array(8)].map((_, i) => (
                            <option key={i} value={i}>W{i + 1}</option>
                          ))}
                        </select>
                        
                        <select 
                          value={task.duration}
                          onChange={(e) => handleTaskDateChange(originalIndex, 'duration', parseInt(e.target.value))}
                          className="bg-background border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((weeks) => (
                            <option key={weeks} value={weeks}>{weeks}w</option>
                          ))}
                        </select>
                        
                        <select 
                          value={task.status || "pending"}
                          onChange={(e) => handleTaskStatusChange(originalIndex, e.target.value)}
                          className={`border rounded px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 transition-colors
                            ${task.status === 'completed' ? 'bg-chart-2/10 text-chart-2 border-chart-2/30 focus:ring-chart-2/20' : 
                              task.status === 'in-progress' ? 'bg-chart-3/10 text-chart-3 border-chart-3/30 focus:ring-chart-3/20' : 
                              'bg-background text-foreground border-border focus:ring-primary/20'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        
                        <button 
                          onClick={() => setEditingTask(editingTask === originalIndex ? null : originalIndex)}
                          className="flex items-center justify-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                        >
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M8.5 1a.5.5 0 00-.354.146L2.5 6.793V9.5a.5.5 0 00.5.5h2.707l5.647-5.647a.5.5 0 000-.707L8.5 1z"/>
                          </svg>
                          {editingTask === originalIndex ? 'Save' : 'Edit'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                  )
                })
              )}
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
}