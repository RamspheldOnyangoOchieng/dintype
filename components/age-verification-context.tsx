"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "age_verified_dob"
const DENIED_KEY = "age_verification_denied"

interface AgeVerificationContextType {
  isAgeVerified: boolean
  isAgeDenied: boolean
  isCheckingAge: boolean
  setAgeVerified: (verified: boolean) => void
  setAgeDenied: (denied: boolean) => void
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined)

export function AgeVerificationProvider({ children }: { children: React.ReactNode }) {
  const [isAgeVerified, setIsAgeVerified] = useState(false)
  const [isAgeDenied, setIsAgeDenied] = useState(false)
  const [isCheckingAge, setIsCheckingAge] = useState(true)

  // Check localStorage on mount
  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY)
    const denied = localStorage.getItem(DENIED_KEY)

    if (denied) {
      setIsAgeDenied(true)
      setIsAgeVerified(false)
    } else if (verified) {
      setIsAgeVerified(true)
      setIsAgeDenied(false)
    }
    
    setIsCheckingAge(false)
  }, [])

  const setAgeVerified = useCallback((verified: boolean) => {
    setIsAgeVerified(verified)
    if (verified) {
      setIsAgeDenied(false)
    }
  }, [])

  const setAgeDenied = useCallback((denied: boolean) => {
    setIsAgeDenied(denied)
    if (denied) {
      setIsAgeVerified(false)
    }
  }, [])

  return (
    <AgeVerificationContext.Provider
      value={{
        isAgeVerified,
        isAgeDenied,
        isCheckingAge,
        setAgeVerified,
        setAgeDenied,
      }}
    >
      {children}
    </AgeVerificationContext.Provider>
  )
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext)
  if (context === undefined) {
    throw new Error("useAgeVerification must be used within an AgeVerificationProvider")
  }
  return context
}
