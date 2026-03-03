"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

const AGE_STORAGE_KEY = "age_verified_dob"

interface AuthModalContextType {
    isLoginModalOpen: boolean
    isSignupModalOpen: boolean
    isLogoutModalOpen: boolean
    openLoginModal: () => void
    closeLoginModal: () => void
    openSignupModal: () => void
    closeSignupModal: () => void
    openLogoutModal: () => void
    closeLogoutModal: () => void
    switchToSignup: () => void
    switchToLogin: () => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [pendingModal, setPendingModal] = useState<'login' | 'signup' | null>(null)

    // Check if age is verified before opening auth modals
    const isAgeVerified = useCallback(() => {
        if (typeof window === 'undefined') return false
        return !!localStorage.getItem(AGE_STORAGE_KEY)
    }, [])

    // Watch for age verification completion to open pending modal
    useEffect(() => {
        if (!pendingModal) return

        const checkAgeVerification = () => {
            if (isAgeVerified()) {
                if (pendingModal === 'login') {
                    setIsLoginModalOpen(true)
                } else if (pendingModal === 'signup') {
                    setIsSignupModalOpen(true)
                }
                setPendingModal(null)
            }
        }

        // Check immediately and set up interval to check periodically
        checkAgeVerification()
        const interval = setInterval(checkAgeVerification, 500)
        
        return () => clearInterval(interval)
    }, [pendingModal, isAgeVerified])

    const openLoginModal = useCallback(() => {
        if (isAgeVerified()) {
            setIsLoginModalOpen(true)
        } else {
            // Queue the modal to open after age verification
            setPendingModal('login')
        }
    }, [isAgeVerified])

    const closeLoginModal = useCallback(() => {
        setIsLoginModalOpen(false)
        setPendingModal(null)
    }, [])

    const openSignupModal = useCallback(() => {
        if (isAgeVerified()) {
            setIsSignupModalOpen(true)
        } else {
            // Queue the modal to open after age verification
            setPendingModal('signup')
        }
    }, [isAgeVerified])

    const closeSignupModal = useCallback(() => {
        setIsSignupModalOpen(false)
        setPendingModal(null)
    }, [])

    const openLogoutModal = useCallback(() => setIsLogoutModalOpen(true), [])
    const closeLogoutModal = useCallback(() => setIsLogoutModalOpen(false), [])

    const switchToSignup = useCallback(() => {
        closeLoginModal()
        setIsSignupModalOpen(true)
    }, [closeLoginModal])

    const switchToLogin = useCallback(() => {
        closeSignupModal()
        setIsLoginModalOpen(true)
    }, [closeSignupModal])

    return (
        <AuthModalContext.Provider
            value={{
                isLoginModalOpen,
                isSignupModalOpen,
                isLogoutModalOpen,
                openLoginModal,
                closeLoginModal,
                openSignupModal,
                closeSignupModal,
                openLogoutModal,
                closeLogoutModal,
                switchToSignup,
                switchToLogin,
            }}
        >
            {children}
        </AuthModalContext.Provider>
    )
}

export function useAuthModal() {
    const context = useContext(AuthModalContext)
    if (context === undefined) {
        throw new Error("useAuthModal must be used within an AuthModalProvider")
    }
    return context
}