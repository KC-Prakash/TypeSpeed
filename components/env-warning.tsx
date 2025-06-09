"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { validateEnv } from "@/lib/env"
import { useState, useEffect } from "react"

export function EnvWarning() {
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    setIsValid(validateEnv())
  }, [])

  if (isValid) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Missing Environment Variables</AlertTitle>
      <AlertDescription>
        Supabase environment variables are missing. Authentication and data persistence features will not work. Please
        make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
      </AlertDescription>
    </Alert>
  )
}
