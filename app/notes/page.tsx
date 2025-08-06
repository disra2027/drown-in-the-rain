"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNavigation from "@/components/BottomNavigation";

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/50">
          <div className="px-4 py-3">
            <h1 className="text-xl font-semibold text-foreground">📝 Notes</h1>
          </div>
        </header>

        <main className="px-4 py-6">
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">📝</span>
            <h3 className="text-xl font-semibold text-foreground">Notes</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </main>

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
}