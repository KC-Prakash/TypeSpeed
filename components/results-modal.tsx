"use client"

import React from "react"

import { motion } from "framer-motion"
import { X, Trophy, RotateCcw, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTypingStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function ResultsModal() {
  const { wpm, accuracy, errors, timeLimit, currentText, userInput, setShowResults, resetTest, saveTestResult } =
    useTypingStore()

  const wordsTyped = userInput.trim().split(" ").length
  const charactersTyped = userInput.length
  const cpm = Math.round((charactersTyped / timeLimit) * 60)

  // Calculate corrected words and uncorrected errors
  const userWords = userInput.trim().split(" ")
  const originalWords = currentText.split(" ")
  let correctedWords = 0
  let uncorrectedErrors = 0

  userWords.forEach((word, index) => {
    if (originalWords[index]) {
      if (word === originalWords[index]) {
        correctedWords++
      } else {
        uncorrectedErrors++
      }
    }
  })

  const handleClose = () => {
    setShowResults(false)
  }

  const handleRestart = () => {
    resetTest()
    setShowResults(false)
  }

  const handleShare = () => {
    const results = {
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      errors,
      timeLimit,
      date: new Date().toISOString(),
    }

    const shareText = `I just completed a typing test!\n🚀 Speed: ${results.wpm} WPM\n🎯 Accuracy: ${results.accuracy}%\n⏱️ Time: ${timeLimit}s\n\nTry it yourself!`

    if (navigator.share) {
      navigator.share({
        title: "My Typing Test Results",
        text: shareText,
      })
    } else {
      navigator.clipboard.writeText(shareText)
    }
  }

  // Save result when modal opens
  React.useEffect(() => {
    saveTestResult({
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      errors,
      timeLimit,
      wordsTyped,
      charactersTyped,
      date: new Date().toISOString(),
    })
  }, [])

  const getPerformanceLevel = () => {
    if (wpm >= 70) return { level: "Expert", color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900" }
    if (wpm >= 50) return { level: "Advanced", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900" }
    if (wpm >= 30) return { level: "Intermediate", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900" }
    return { level: "Beginner", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900" }
  }

  const performance = getPerformanceLevel()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Test Complete!</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2">
            <Badge className={cn("text-sm", performance.bg, performance.color)}>{performance.level} Level</Badge>
          </div>
        </div>

        {/* Main Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-3xl font-bold text-blue-600 mb-1">{Math.round(wpm)}</div>
              <div className="text-sm text-muted-foreground">Words per Minute</div>
            </div>

            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-3xl font-bold text-green-600 mb-1">{Math.round(accuracy)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>

            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-3xl font-bold text-orange-600 mb-1">{cpm}</div>
              <div className="text-sm text-muted-foreground">Characters per Minute</div>
            </div>

            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-3xl font-bold text-purple-600 mb-1">{timeLimit}s</div>
              <div className="text-sm text-muted-foreground">Test Duration</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Typing Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words Typed:</span>
                  <span className="font-medium">{wordsTyped}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters Typed:</span>
                  <span className="font-medium">{charactersTyped}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Correct Words:</span>
                  <span className="font-medium text-green-600">{correctedWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Incorrect Words:</span>
                  <span className="font-medium text-red-600">{uncorrectedErrors}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Performance Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Error Rate:</span>
                  <span className="font-medium">{((errors / charactersTyped) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consistency:</span>
                  <Badge variant={accuracy > 95 ? "default" : "secondary"}>
                    {accuracy > 95 ? "Excellent" : accuracy > 85 ? "Good" : "Needs Work"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Speed Rating:</span>
                  <Badge variant={wpm > 50 ? "default" : "secondary"}>
                    {wpm > 70 ? "Very Fast" : wpm > 50 ? "Fast" : wpm > 30 ? "Average" : "Slow"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border flex gap-3 justify-end">
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share Results
          </Button>
          <Button onClick={handleRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
