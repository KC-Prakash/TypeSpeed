"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { useTypingStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Trophy, Calendar } from "lucide-react"

export function History() {
  const { testHistory, clearHistory } = useTypingStore()

  const sortedHistory = [...testHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getPerformanceBadge = (wpm: number, accuracy: number) => {
    if (wpm >= 60 && accuracy >= 95) return { label: "Excellent", variant: "default" as const }
    if (wpm >= 40 && accuracy >= 90) return { label: "Good", variant: "secondary" as const }
    if (wpm >= 25 && accuracy >= 85) return { label: "Average", variant: "outline" as const }
    return { label: "Needs Work", variant: "destructive" as const }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Test History</h1>
            <p className="text-muted-foreground">Review your past typing test performances</p>
          </div>
          {testHistory.length > 0 && (
            <Button variant="outline" onClick={clearHistory} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear History
            </Button>
          )}
        </div>

        {testHistory.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Tests ({testHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>WPM</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Errors</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Words</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedHistory.map((test, index) => {
                      const performance = getPerformanceBadge(test.wpm, test.accuracy)
                      return (
                        <TableRow key={index}>
                          <TableCell>{format(new Date(test.date), "MMM dd, yyyy HH:mm")}</TableCell>
                          <TableCell>
                            <span className="font-medium text-blue-600">{test.wpm}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-green-600">{test.accuracy}%</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-red-600">{test.errors}</span>
                          </TableCell>
                          <TableCell>{test.timeLimit}s</TableCell>
                          <TableCell>{test.wordsTyped}</TableCell>
                          <TableCell>
                            <Badge variant={performance.variant}>{performance.label}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Test History</h3>
                <p className="text-muted-foreground">Complete some typing tests to see your history here</p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
