"use client"

import { TypingTest } from "@/components/typing-test"
import { Analytics } from "@/components/analytics"
import { History } from "@/components/history"
import { Profile } from "@/components/profile"
import { useTypingStore } from "@/lib/store"

export function MainPanel() {
  const { currentView } = useTypingStore()

  const renderContent = () => {
    switch (currentView) {
      case "test":
        return <TypingTest />
      case "analytics":
        return <Analytics />
      case "history":
        return <History />
      case "profile":
        return <Profile />
      default:
        return <TypingTest />
    }
  }

  return <div className="flex-1 overflow-auto">{renderContent()}</div>
}
