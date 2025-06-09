"use client"

import { create } from "zustand"
import type { User } from "@supabase/supabase-js"
import { supabase, type UserProfile } from "./supabase"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"


interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  fetchProfile: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        set({ user: data.user })
        await get().fetchProfile()
      }

      return {}
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  },

  signUp: async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        // Upsert the profile - create if not exists, update if exists
        const { error: profileError } = await supabase.from("user_profiles").upsert({
          id: data.user.id,
          username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          best_wpm: 0,
          avg_wpm: 0,
          total_tests: 0,
          sound_enabled: true
        }, {
          onConflict: 'id'
        })

        if (profileError) {
          console.error("Error upserting profile:", profileError)
        }

        set({ user: data.user })
        await get().fetchProfile()
      }

      return {}
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    set({ user: null, profile: null })
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { user } = get()
    if (!user) return

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
        return
      }

      await get().fetchProfile()
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  },

  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      set({ profile: data })
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  },

  initialize: async () => {
    try {
      if (!supabase) {
        console.error("Supabase client not available")
        set({ loading: false })
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        set({ user: session.user })
        await get().fetchProfile()
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
          if (session?.user) {
            set({ user: session.user })
            await get().fetchProfile()
          } else {
            set({ user: null, profile: null })
          }
        }
      )

      set({ loading: false })
    } catch (error) {
      console.error("Error initializing auth:", error)
      set({ loading: false })
    }
  },
}))
