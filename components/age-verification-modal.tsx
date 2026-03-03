"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ShieldCheck, ShieldX, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/use-translations"

const STORAGE_KEY = "age_verified_dob"
const DENIED_KEY = "age_verification_denied"
const MIN_AGE = 18

interface AgeVerificationModalProps {
  onVerified?: () => void
  onDenied?: () => void
}

export function AgeVerificationModal({ onVerified, onDenied }: AgeVerificationModalProps) {
  const { t, language } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isDenied, setIsDenied] = useState(false)

  // Check if user has already verified or been denied
  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY)
    const denied = localStorage.getItem(DENIED_KEY)
    
    if (denied) {
      setIsDenied(true)
      setIsOpen(true)
      return
    }
    
    if (!verified) {
      // Small delay to let page load first
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const calculateAge = useCallback((birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }, [])

  const validateDate = useCallback((m: string, y: string): Date | null => {
    const monthNum = parseInt(m, 10)
    const yearNum = parseInt(y, 10)
    
    // Basic validation
    if (isNaN(monthNum) || isNaN(yearNum)) return null
    if (monthNum < 1 || monthNum > 12) return null
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) return null
    
    // Create date using the 1st of the month
    const date = new Date(yearNum, monthNum - 1, 1)
    
    // Check if date is in the future
    if (date > new Date()) return null
    
    return date
  }, [])

  const handleVerify = useCallback(() => {
    setError(null)
    
    // Validate all fields are filled
    if (!month || !year) {
      setError(language === 'sv' 
        ? "Vänligen fyll i alla fält" 
        : "Please fill in all fields")
      return
    }
    
    // Validate date
    const birthDate = validateDate(month, year)
    if (!birthDate) {
      setError(language === 'sv' 
        ? "Ogiltig månad eller år. Vänligen kontrollera." 
        : "Invalid month or year. Please check.")
      return
    }
    
    // Calculate age
    const age = calculateAge(birthDate)
    
    if (age >= MIN_AGE) {
      // Store verification with timestamp
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        verified: true,
        timestamp: new Date().toISOString(),
        age: age
      }))
      localStorage.removeItem(DENIED_KEY)
      setIsOpen(false)
      onVerified?.()
    } else {
      // User is underage - deny access
      localStorage.setItem(DENIED_KEY, JSON.stringify({
        denied: true,
        timestamp: new Date().toISOString()
      }))
      setIsDenied(true)
      onDenied?.()
    }
  }, [month, year, validateDate, calculateAge, language, onVerified, onDenied])

  const handleInputChange = (
    value: string, 
    setter: (v: string) => void, 
    maxLength: number,
    nextRef?: HTMLInputElement | null
  ) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, "")
    if (numericValue.length <= maxLength) {
      setter(numericValue)
      // Auto-focus next field when current is filled
      if (numericValue.length === maxLength && nextRef) {
        nextRef.focus()
      }
    }
  }

  // If denied, show blocked message
  if (isDenied) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md mx-4 p-8 bg-gradient-to-b from-red-950/90 to-black/90 rounded-3xl border border-red-500/30 shadow-2xl text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <ShieldX className="w-10 h-10 text-red-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                {language === 'sv' ? 'Åtkomst nekad' : 'Access Denied'}
              </h2>
              
              <p className="text-red-200/80 mb-6">
                {language === 'sv' 
                  ? 'Du måste vara minst 18 år för att använda denna tjänst. Vänligen lämna denna sida.'
                  : 'You must be at least 18 years old to use this service. Please leave this page.'}
              </p>
              
              <Button
                onClick={() => window.location.href = 'https://www.google.com'}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {language === 'sv' ? 'Lämna sidan' : 'Leave Site'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md p-6 sm:p-8 bg-gradient-to-b from-zinc-900/95 to-black/95 rounded-3xl border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'sv' ? 'Åldersverifiering' : 'Age Verification'}
              </h2>
              
              <p className="text-white/60 text-sm">
                {language === 'sv' 
                  ? 'Denna webbplats innehåller vuxet material. Du måste vara minst 18 år gammal för att fortsätta.'
                  : 'This website contains adult content. You must be at least 18 years old to continue.'}
              </p>
            </div>

            {/* Warning Badge */}
            <div className="flex items-center gap-3 p-3 mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-amber-200/80 text-xs">
                {language === 'sv' 
                  ? 'Ange din riktiga födelsemånad och år. Falsk information kan leda till avstängning.'
                  : 'Enter your real birth month and year. False information may result in account suspension.'}
              </p>
            </div>

            {/* Date of Birth Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {language === 'sv' ? 'Födelsemånad & år' : 'Birth Month & Year'}
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Month */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 text-center">
                    {language === 'sv' ? 'Månad' : 'Month'}
                  </label>
                  <input
                    id="dob-month"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    value={month}
                    onChange={(e) => handleInputChange(
                      e.target.value, 
                      setMonth, 
                      2, 
                      document.getElementById('dob-year') as HTMLInputElement
                    )}
                    className="w-full h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    maxLength={2}
                  />
                </div>
                
                {/* Year */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 text-center">
                    {language === 'sv' ? 'År' : 'Year'}
                  </label>
                  <input
                    id="dob-year"
                    type="text"
                    inputMode="numeric"
                    placeholder="YYYY"
                    value={year}
                    onChange={(e) => handleInputChange(e.target.value, setYear, 4, null)}
                    className="w-full h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all"
            >
              {language === 'sv' ? 'Verifiera min ålder' : 'Verify My Age'}
            </Button>

            {/* Legal Text */}
            <p className="mt-4 text-[10px] text-white/40 text-center leading-relaxed">
              {language === 'sv' 
                ? 'Genom att fortsätta bekräftar du att du är minst 18 år gammal och samtycker till våra användarvillkor och integritetspolicy.'
                : 'By continuing, you confirm that you are at least 18 years old and agree to our terms of service and privacy policy.'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
