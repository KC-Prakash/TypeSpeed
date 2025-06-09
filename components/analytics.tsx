"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts"
import { useTypingStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Clock, Trophy } from "lucide-react"

export function Analytics() {
  const { testHistory } = useTypingStore()

  // Calculate analytics from test history
  const recentTests = testHistory.slice(-10)
  const avgWpm =
    recentTests.length > 0 ? Math.round(recentTests.reduce((sum, test) => sum + test.wpm, 0) / recentTests.length) : 0
  const avgAccuracy =
    recentTests.length > 0
      ? Math.round(recentTests.reduce((sum, test) => sum + test.accuracy, 0) / recentTests.length)
      : 0
  const bestWpm = Math.max(...testHistory.map((test) => test.wpm), 0)
  const totalTests = testHistory.length

  // Prepare chart data
  const chartData = recentTests.map((test, index) => ({
    test: index + 1,
    wpm: test.wpm,
    accuracy: test.accuracy,
    date: new Date(test.date).toLocaleDateString(),
  }))

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your typing progress and performance over time</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average WPM</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgWpm}</div>
              <p className="text-xs text-muted-foreground">Last 10 tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best WPM</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bestWpm}</div>
              <p className="text-xs text-muted-foreground">Personal record</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgAccuracy}%</div>
              <p className="text-xs text-muted-foreground">Last 10 tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-xs text-muted-foreground">Tests completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {recentTests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WPM Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>WPM Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="test" />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => `Test ${value}`}
                        formatter={(value) => [`${value} WPM`, "Speed"]}
                      />
                      <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Accuracy Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Accuracy Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="test" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        labelFormatter={(value) => `Test ${value}`}
                        formatter={(value) => [`${value}%`, "Accuracy"]}
                      />
                      <Bar dataKey="accuracy" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Data Yet</h3>
                <p className="text-muted-foreground">Complete some typing tests to see your analytics</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Insights */}
        {recentTests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {avgWpm > 40 ? "🚀" : avgWpm > 25 ? "📈" : "🌱"}
                  </div>
                  <div className="text-sm font-medium">Speed Level</div>
                  <Badge variant={avgWpm > 40 ? "default" : "secondary"}>
                    {avgWpm > 60 ? "Expert" : avgWpm > 40 ? "Advanced" : avgWpm > 25 ? "Intermediate" : "Beginner"}
                  </Badge>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {avgAccuracy > 95 ? "🎯" : avgAccuracy > 85 ? "✅" : "⚠️"}
                  </div>
                  <div className="text-sm font-medium">Accuracy Level</div>
                  <Badge variant={avgAccuracy > 95 ? "default" : "secondary"}>
                    {avgAccuracy > 95 ? "Excellent" : avgAccuracy > 85 ? "Good" : "Needs Work"}
                  </Badge>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {totalTests > 20 ? "🏆" : totalTests > 10 ? "💪" : "🎯"}
                  </div>
                  <div className="text-sm font-medium">Experience</div>
                  <Badge variant={totalTests > 10 ? "default" : "secondary"}>
                    {totalTests > 20 ? "Veteran" : totalTests > 10 ? "Regular" : "Newcomer"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
