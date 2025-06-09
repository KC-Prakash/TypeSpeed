"use client"

import { motion } from "framer-motion"
import { X, Palette, Volume2, VolumeX, Monitor, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTypingStore } from "@/lib/store"
import { useTheme } from "@/lib/theme-context"

export function SettingsModal() {
  const { setShowSettings, soundEnabled, setSoundEnabled } = useTypingStore()
  const { theme, setTheme } = useTheme()

  const handleClose = () => {
    setShowSettings(false)
  }

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
        className="bg-background rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Settings</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <h3 className="font-medium">Appearance</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <h3 className="font-medium">Audio</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Keystroke Sounds</span>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </div>

          {/* Test Settings */}
          <div className="space-y-3">
            <h3 className="font-medium">Test Preferences</h3>
            <div className="text-sm text-muted-foreground">
              Additional test settings can be configured from the main test interface.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <Button onClick={handleClose} className="w-full">
            Save Settings
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
