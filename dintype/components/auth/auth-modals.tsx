"use client"

import { useState } from "react"
import { LoginModal } from "./login-modal"
import { SignupModal } from "./signup-modal"

interface AuthModalsProps {
  isLoginOpen: boolean
  isSignupOpen: boolean
  onCloseLogin: () => void
  onCloseSignup: () => void
}

export function AuthModals({ isLoginOpen, isSignupOpen, onCloseLogin, onCloseSignup }: AuthModalsProps) {
  const [currentModal, setCurrentModal] = useState<"login" | "signup">("login")

  const handleSwitchToSignup = () => {
    setCurrentModal("signup")
    onCloseLogin()
  }

  const handleSwitchToLogin = () => {
    setCurrentModal("login")
    onCloseSignup()
  }

  return (
    <>
      <LoginModal isOpen={isLoginOpen} onClose={onCloseLogin} onSwitchToSignup={handleSwitchToSignup} />
      <SignupModal isOpen={isSignupOpen} onClose={onCloseSignup} onSwitchToLogin={handleSwitchToLogin} />
    </>
  )
}
