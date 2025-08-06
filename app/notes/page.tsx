"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNavigation from "@/components/BottomNavigation";
import { useScrollLock } from "@/hooks/useScrollLock";
import NoteModal from "@/components/NoteModal";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  color?: string;
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Daily Reflection",
    content: "Today was productive. Completed the water tracking feature and made good progress on the goals. Need to focus more on consistent sleep schedule. The meditation session this morning really helped center my thoughts for the day.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: "Personal",
    tags: ["reflection", "productivity", "health"],
    isPinned: true,
    color: "bg-gold/10"
  },
  {
    id: "2", 
    title: "Weekend Plans",
    content: "- Visit the farmer's market early morning\n- Complete the hiking trail project documentation\n- Prepare healthy meal prep for the entire week\n- Read at least 2-3 chapters of the TypeScript advanced patterns book\n- Schedule dentist appointment\n- Call mom for her birthday",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: "Planning",
    tags: ["weekend", "tasks", "health", "family"],
    isPinned: false,
    color: "bg-blue-500/10"
  },
  {
    id: "3",
    title: "Project Ideas",
    content: "1. Habit tracking app with AI insights\n2. Personal finance dashboard with investment tracking\n3. Mood journal with weather correlation\n4. Recipe organizer with nutritional analysis\n5. Book recommendation system based on reading history\n6. Travel planning app with budget optimization",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: "Ideas",
    tags: ["projects", "apps", "innovation"],
    isPinned: false,
    color: "bg-purple-500/10"
  },
  {
    id: "4",
    title: "Learning Notes: TypeScript Advanced Types",
    content: "Key concepts covered today:\n\n• Conditional Types: T extends U ? X : Y\n• Mapped Types: { [K in keyof T]: T[K] }\n• Template Literal Types: `prefix-${string}`\n• Utility Types: Pick, Omit, Exclude, Extract\n• Discriminated Unions for better type safety\n\nNext: Practice building complex type utilities and explore branded types for domain modeling.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    category: "Learning",
    tags: ["typescript", "programming", "study"],
    isPinned: true,
    color: "bg-green-500/10"
  },
  {
    id: "5",
    title: "Book Review: Atomic Habits",
    content: "Fascinating insights on habit formation:\n\n📖 The 1% rule - small improvements compound over time\n📖 Identity-based habits work better than outcome-based\n📖 Environment design is crucial for success\n📖 The 4 laws: Make it obvious, attractive, easy, satisfying\n\nPersonal takeaway: Focus on systems, not goals. Start with 2-minute versions of desired habits.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    category: "Books",
    tags: ["habits", "productivity", "self-improvement"],
    isPinned: false,
    color: "bg-orange-500/10"
  },
  {
    id: "6",
    title: "Meditation Insights",
    content: "Week 3 of daily meditation practice:\n\n✨ Mind feels more settled in the mornings\n✨ Better at catching negative thought spirals\n✨ Improved focus during work sessions\n✨ Sleep quality has noticeably improved\n\nGoal: Increase session length from 10 to 15 minutes next week. Consider trying loving-kindness meditation.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: "Wellness",
    tags: ["meditation", "mindfulness", "health"],
    isPinned: false,
    color: "bg-cyan-500/10"
  }
];

const categories = ["All", "Personal", "Planning", "Ideas", "Learning", "Books", "Wellness"];

function NotesContent() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [sortBy, setSortBy] = useState<"updated" | "created" | "title">("updated");

  useScrollLock(showNoteModal);

  // Initialize with mock data
  useEffect(() => {
    setNotes(mockNotes);
  }, []);

  // Filter and sort notes
  useEffect(() => {
    let filtered = notes;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort notes
    filtered = [...filtered].sort((a, b) => {
      // Pinned notes always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then sort by selected criteria
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updated":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    setFilteredNotes(filtered);
  }, [notes, selectedCategory, searchQuery, sortBy]);

  const handleNoteClick = (note: Note) => {
    setEditingNote(note);
    setShowNoteModal(true);
  };

  const handleNewNote = () => {
    setEditingNote(undefined);
    setShowNoteModal(true);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(n => n.id === editingNote.id ? {
        ...noteData,
        id: editingNote.id,
        updatedAt: new Date(),
        createdAt: editingNote.createdAt
      } : n));
    } else {
      // Create new note
      const newNote: Note = {
        ...noteData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: noteData.category || "Personal",
        tags: noteData.tags || [],
        isPinned: false,
        color: "bg-card"
      };
      setNotes(prev => [newNote, ...prev]);
    }
  };

  const handlePinNote = (noteId: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPreviewText = (content: string, maxLength: number = 150) => {
    const cleanContent = content.replace(/[•✨📖\n]/g, ' ').trim();
    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + "..."
      : cleanContent;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/50 slide-in-from-top-1">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-2">📝</span>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Notes</h1>
                <p className="text-xs text-muted-foreground">
                  {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={handleNewNote}
              className="px-3 py-1.5 bg-gold text-background rounded-lg text-sm font-medium hover:bg-gold-light transition-all duration-300 focus-ring-luxury hover:scale-105 transform"
            >
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="px-4 py-4 bg-background border-b border-border/50">
        {/* Search and Filter Bar */}
        <div className="flex gap-3 items-center mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search notes, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "updated" | "created" | "title")}
            className="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all whitespace-nowrap"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                selectedCategory === category
                  ? "bg-gold text-background shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <main className="px-4 py-6 pb-20">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 fade-in-up">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No notes match "${searchQuery}". Try adjusting your search or browse by category.`
                : "Start capturing your thoughts, ideas, and insights. Your first note is just a click away."
              }
            </p>
            <button
              onClick={handleNewNote}
              className="px-6 py-3 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-all duration-300 focus-ring-luxury hover:scale-105 transform"
            >
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => (
              <div
                key={note.id}
                onClick={() => handleNoteClick(note)}
                className={`${note.color || 'bg-card'} rounded-2xl p-5 border border-border/50 hover:border-gold/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 scale-in group`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-gold transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {note.category && (
                        <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          {note.category}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(note.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-3">
                    {note.isPinned && (
                      <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
                      </svg>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinNote(note.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-gold transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Note Preview */}
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-3">
                  {getPreviewText(note.content)}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-muted/50 rounded-full text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{note.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />

      {/* Note Modal */}
      {showNoteModal && (
        <NoteModal
          isOpen={showNoteModal}
          existingNote={editingNote}
          onClose={() => {
            setShowNoteModal(false);
            setEditingNote(undefined);
          }}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <NotesContent />
    </ProtectedRoute>
  );
}