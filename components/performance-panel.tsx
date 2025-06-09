"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useTypingStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Zap, AlertCircle } from "lucide-react"

export function PerformancePanel() {
  const { wpm, accuracy, errors, timeRemaining, timeLimit, isTestActive } = useTypingStore()
  const [wpmHistory, setWpmHistory] = useState<Array<{ time: number; wpm: number }>>([])

  useEffect(() => {
    if (isTestActive) {
      const interval = setInterval(() => {
        const elapsed = timeLimit - timeRemaining
        setWpmHistory((prev) => [...prev.slice(-19), { time: elapsed, wpm }])
      }, 1000)

      return () => clearInterval(interval)
    } else {
      setWpmHistory([])
    }
  }, [isTestActive, wpm, timeRemaining, timeLimit])

  return (
    <div className="h-full p-4 space-y-6 overflow-auto">
      <div className="text-lg font-semibold">Live Performance</div>

      {/* Real-time Stats */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">WPM</span>
            </div>
            <Badge variant="secondary" className="text-lg font-bold">
              {Math.round(wpm)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <Badge variant="secondary" className="text-lg font-bold">
              {Math.round(accuracy)}%
            </Badge>
          </div>
          <Progress value={accuracy} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Errors</span>
            </div>
            <Badge variant={errors > 5 ? "destructive" : "secondary"}>{errors}</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Time Left</span>
            </div>
            <Badge variant="outline">{timeRemaining}s</Badge>
          </div>
          <Progress value={((timeLimit - timeRemaining) / timeLimit) * 100} className="h-2" />
        </div>
      </div>

      {/* WPM Chart */}
      {wpmHistory.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="text-sm font-medium">WPM Over Time</div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wpmHistory}>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip
                  labelFormatter={(value) => `${value}s`}
                  formatter={(value) => [`${Math.round(value as number)} WPM`, "Speed"]}
                />
                <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Performance Indicators */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Performance Indicators</div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Consistency</span>
            <Badge variant={wpm > 40 ? "default" : "secondary"}>{wpm > 40 ? "Good" : "Improving"}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Error Rate</span>
            <Badge variant={accuracy > 95 ? "default" : errors > 10 ? "destructive" : "secondary"}>
              {accuracy > 95 ? "Excellent" : errors > 10 ? "High" : "Moderate"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Speed Level</span>
            <Badge variant={wpm > 60 ? "default" : wpm > 40 ? "secondary" : "outline"}>
              {wpm > 60 ? "Advanced" : wpm > 40 ? "Intermediate" : "Beginner"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
