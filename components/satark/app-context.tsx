﻿"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { api } from "@/lib/api"

type Language = "en" | "hi"
type Tab = "shield" | "investigator" | "offense" | "network" | "recovery" | "trust"

interface AppContextType {
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
  socket: Socket | null
}

const AppContext = createContext<AppContextType | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isElderly, setIsElderly] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("shield")
  const [isAdmin, setIsAdmin] = useState(false)
  const [showNoInternet, setShowNoInternet] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("https://satark-india-backend.onrender.com");
      setSocket(socketRef.current);

      socketRef.current.on("receive_security_ping", (data) => {
        const name = data.name || "Family Member";
        window.dispatchEvent(new CustomEvent("satark_security_ping", { detail: data }));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  const toggleElderly = useCallback(() => setIsElderly((p) => !p), [])
  const toggleAdmin = useCallback(() => setIsAdmin((p) => !p), [])

  useEffect(() => {
    if (typeof window === "undefined") return
    
    const fetchSettings = async () => {
      try {
        const res = await api.get("/api/user/settings")
        if (res.data) {
          if (res.data.language) setLanguage(res.data.language)
        }
      } catch (e) {
        // Fallback to local storage
        const savedLang = localStorage.getItem("satark_language") as Language
        if (savedLang) setLanguage(savedLang)
      }
    }
    fetchSettings()

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

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("satark_language", lang)
  }, [])

  const t = useCallback(
    (en: string, hi: string) => (language === "en" ? en : hi),
    [language]
  )

  return (
    <AppContext.Provider
      value={{
        language, setLanguage: handleSetLanguage,
        isElderly, toggleElderly,
        activeTab, setActiveTab,
        isAdmin, toggleAdmin,
        showNoInternet, setShowNoInternet,
        t,
        socket
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
