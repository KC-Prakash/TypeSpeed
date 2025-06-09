"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Edit2, Save, Trophy, Target, Clock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTypingStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import React from "react"

export function Profile() {
  const { testHistory } = useTypingStore()
  const { user, profile, updateProfile, signOut } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [tempUsername, setTempUsername] = useState(profile?.username || "")

  // Update temp username when profile changes
  React.useEffect(() => {
    setTempUsername(profile?.username || "")
  }, [profile])

  const handleSave = async () => {
    if (profile && tempUsername !== profile.username) {
      await updateProfile({ username: tempUsername })
    }
    setIsEditing(false)
  }

  // Use profile data from Supabase if available, otherwise fall back to local data
  const totalTests = profile?.total_tests || testHistory.length
  const avgWpm =
    profile?.avg_wpm ||
    (testHistory.length > 0 ? Math.round(testHistory.reduce((sum, test) => sum + test.wpm, 0) / testHistory.length) : 0)
  const avgAccuracy =
    testHistory.length > 0
      ? Math.round(testHistory.reduce((sum, test) => sum + test.accuracy, 0) / testHistory.length)
      : 0
  const bestWpm = profile?.best_wpm || Math.max(...testHistory.map((test) => test.wpm), 0)
  const totalWordsTyped = testHistory.reduce((sum, test) => sum + test.wordsTyped, 0)

  const getSkillLevel = () => {
    if (avgWpm >= 70) return { level: "Expert", color: "text-purple-600", description: "Outstanding typing skills!" }
    if (avgWpm >= 50) return { level: "Advanced", color: "text-blue-600", description: "Excellent typing proficiency" }
    if (avgWpm >= 30) return { level: "Intermediate", color: "text-green-600", description: "Good typing skills" }
    return { level: "Beginner", color: "text-orange-600", description: "Keep practicing to improve!" }
  }

  const skillLevel = getSkillLevel()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your profile and view your typing achievements</p>
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 transition-all duration-300"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="max-w-xs"
                    />
                    <Button onClick={handleSave} size="sm" className="gap-1">
                      <Save className="w-3 h-3" />
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setTempUsername(profile?.username || "")
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      {profile?.username || user?.email?.split("@")[0] || "Anonymous User"}
                    </h2>
                    <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm" className="gap-1">
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={skillLevel.color}>{skillLevel.level}</Badge>
                  <span className="text-sm text-muted-foreground">{skillLevel.description}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-xs text-muted-foreground">Total typing tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average WPM</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgWpm}</div>
              <p className="text-xs text-muted-foreground">Words per minute</p>
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
              <p className="text-xs text-muted-foreground">Typing accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-lg border ${totalTests >= 10 ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" : "bg-muted/50"}`}
              >
                <div className="text-2xl mb-2">{totalTests >= 10 ? "🏆" : "🔒"}</div>
                <div className="font-medium">Dedicated Typist</div>
                <div className="text-sm text-muted-foreground">Complete 10 tests</div>
                <div className="text-xs mt-1">{totalTests}/10</div>
              </div>

              <div
                className={`p-4 rounded-lg border ${bestWpm >= 50 ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-muted/50"}`}
              >
                <div className="text-2xl mb-2">{bestWpm >= 50 ? "🚀" : "🔒"}</div>
                <div className="font-medium">Speed Demon</div>
                <div className="text-sm text-muted-foreground">Reach 50 WPM</div>
                <div className="text-xs mt-1">{bestWpm}/50</div>
              </div>

              <div
                className={`p-4 rounded-lg border ${avgAccuracy >= 95 ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-muted/50"}`}
              >
                <div className="text-2xl mb-2">{avgAccuracy >= 95 ? "🎯" : "🔒"}</div>
                <div className="font-medium">Precision Master</div>
                <div className="text-sm text-muted-foreground">95% average accuracy</div>
                <div className="text-xs mt-1">{avgAccuracy}/95%</div>
              </div>

              <div
                className={`p-4 rounded-lg border ${totalWordsTyped >= 1000 ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" : "bg-muted/50"}`}
              >
                <div className="text-2xl mb-2">{totalWordsTyped >= 1000 ? "📚" : "🔒"}</div>
                <div className="font-medium">Word Warrior</div>
                <div className="text-sm text-muted-foreground">Type 1000 words</div>
                <div className="text-xs mt-1">{totalWordsTyped}/1000</div>
              </div>

              <div
                className={`p-4 rounded-lg border ${bestWpm >= 70 ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : "bg-muted/50"}`}
              >
                <div className="text-2xl mb-2">{bestWpm >= 70 ? "⚡" : "🔒"}</div>
                <div className="font-medium">Lightning Fingers</div>
                <div className="text-sm text-muted-foreground">Reach 70 WPM</div>
                <div className="text-xs mt-1">{bestWpm}/70</div>
              </div>

              <div
                className={`p-4 rounded-lg border ${totalTests >= 50 ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800" : "bg-muted/50"}`}
              >
                <div className="text-2xl mb-2">{totalTests >= 50 ? "🎖️" : "🔒"}</div>
                <div className="font-medium">Typing Veteran</div>
                <div className="text-sm text-muted-foreground">Complete 50 tests</div>
                <div className="text-xs mt-1">{totalTests}/50</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        {totalTests > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Progress Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total Words Typed</span>
                    <span className="font-medium">{totalWordsTyped.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tests This Month</span>
                    <span className="font-medium">
                      {
                        testHistory.filter((test) => {
                          const testDate = new Date(test.date)
                          const now = new Date()
                          return testDate.getMonth() === now.getMonth() && testDate.getFullYear() === now.getFullYear()
                        }).length
                      }
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Improvement Trend</span>
                    <Badge variant={avgWpm > 30 ? "default" : "secondary"}>
                      {avgWpm > 30 ? "Improving" : "Getting Started"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
