"use client";

import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNavigation from "@/components/BottomNavigation";

export default function Timeline() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 slide-in-from-top-1">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-muted-foreground hover:text-gold transition-all duration-300 focus-ring-luxury hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="fade-in-up">
                <h1 className="text-lg font-semibold text-foreground">Project Timeline</h1>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Timeline Page</h2>
            <p className="text-muted-foreground">This page is under construction</p>
          </div>
        </main>

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
}