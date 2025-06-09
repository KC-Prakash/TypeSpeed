"use client"

import React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { MainPanel } from "@/components/main-panel"
import { PerformancePanel } from "@/components/performance-panel"
import { ResultsModal } from "@/components/results-modal"
import { SettingsModal } from "@/components/settings-modal"
import { useTypingStore } from "@/lib/store"
import { ThemeProvider } from "@/lib/theme-context"
import { useAuthStore } from "@/lib/auth-store"
import { EnvWarning } from "@/components/env-warning"

function TypingTestAppContent() {
  const { isTestActive, isTestComplete, showResults, showSettings, setShowSettings, resetTest, loadTestHistory } =
    useTypingStore()
  const { initialize, loading, user } = useAuthStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Initialize auth and load data
  React.useEffect(() => {
    initialize()
  }, [initialize])

  // Load test history when user signs in
  React.useEffect(() => {
    if (user) {
      loadTestHistory()
    }
  }, [user, loadTestHistory])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <EnvWarning />
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Panel */}
          <div className="flex-1 flex flex-col">
            <MainPanel />
          </div>

          {/* Performance Panel */}
          <AnimatePresence>
            {(isTestActive || isTestComplete) && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block border-l border-border bg-card"
              >
                <PerformancePanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showResults && <ResultsModal />}
        {showSettings && <SettingsModal />}
      </AnimatePresence>
    </div>
  )
}

export function TypingTestApp() {
  return (
    <ThemeProvider>
      <TypingTestAppContent />
    </ThemeProvider>
  )
}
