"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from '@/utils/supabase/client'

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const supabase = createClient()

  const calculateAge = (dobString: string) => {
    const today = new Date()
    const birthDate = new Date(dobString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!dateOfBirth) {
      setError("Please enter your date of birth.")
      return
    }

    const age = calculateAge(dateOfBirth)
    if (age < 18) {
      setError("You must be 18 years or older to create an account.")
      return
    }

    if (!username || !email || !password || !confirmPassword) {
      setError(t("signup.allFieldsRequired"))
      return
    }

    if (password !== confirmPassword) {
      setError(t("signup.passwordsDoNotMatch"))
      return
    }

    if (password.length < 6) {
      setError(t("signup.passwordMinLength"))
      return
    }

    setIsLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: username,
            date_of_birth: dateOfBirth,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        console.error("Signup error:", signUpError)
        setError(signUpError.message || t("signup.errorOccurred"))
        return
      }

      setSuccess(t("signup.accountCreatedSuccessfully"))
    } catch (err) {
      console.error("Unexpected error during signup:", err)
      setError(t("signup.errorOccurred"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl p-8 shadow-lg border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">{t("signup.createAccount")}</h1>
            <p className="text-muted-foreground">{t("signup.joinCommunity")}</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-lg mb-6 flex items-center">
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                {t("signup.username")}
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background border-input text-foreground"
                placeholder="johndoe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                {t("signup.email")}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-input text-foreground"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                {t("signup.password")}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-input text-foreground"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                {t("signup.confirmPassword")}
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background border-input text-foreground"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-foreground">
                {t("signup.dateOfBirth")}
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
                className="bg-background border-input text-foreground"
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-[#FF4D8D] hover:bg-[#FF3D7D] text-white py-5"
                disabled={isLoading}
              >
                {isLoading ? t("signup.creatingAccount") : t("signup.createAccountButton")}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {t("signup.alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-[#FF4D8D] hover:underline">
                {t("auth.login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
