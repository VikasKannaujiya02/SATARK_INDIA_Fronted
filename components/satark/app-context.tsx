"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

type Language = "en" | "hi"
type Tab = "shield" | "investigator" | "offense" | "network" | "recovery" | "trust"

interface AppContextType {
  isDark: boolean
  toggleDark: () => void
  language: Language
  setLanguage: (lang: Language) => void
  isElderly: boolean
  toggleElderly: () => void
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  isAdmin: boolean
  toggleAdmin: () => void
  showNoInternet: boolean
  setShowNoInternet: (v: boolean) => void
  t: (en: string, hi: string) => string
}

const AppContext = createContext<AppContextType | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  const [language, setLanguage] = useState<Language>("en")
  const [isElderly, setIsElderly] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("shield")
  const [isAdmin, setIsAdmin] = useState(false)
  const [showNoInternet, setShowNoInternet] = useState(false)

  const toggleDark = useCallback(() => setIsDark((p) => !p), [])
  const toggleElderly = useCallback(() => setIsElderly((p) => !p), [])
  const toggleAdmin = useCallback(() => setIsAdmin((p) => !p), [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const setOffline = () => setShowNoInternet(true)
    const setOnline = () => setShowNoInternet(false)
    setShowNoInternet(!navigator.onLine)
    window.addEventListener("offline", setOffline)
    window.addEventListener("online", setOnline)
    return () => {
      window.removeEventListener("offline", setOffline)
      window.removeEventListener("online", setOnline)
    }
  }, [])

  const t = useCallback(
    (en: string, hi: string) => (language === "en" ? en : hi),
    [language]
  )

  return (
    <AppContext.Provider
      value={{
        isDark, toggleDark,
        language, setLanguage,
        isElderly, toggleElderly,
        activeTab, setActiveTab,
        isAdmin, toggleAdmin,
        showNoInternet, setShowNoInternet,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
