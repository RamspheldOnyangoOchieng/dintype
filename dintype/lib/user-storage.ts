// Store and retrieve user information in local storage

export function storeUserId(userId: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("userId", userId)
      sessionStorage.setItem("userId", userId)
    }
  } catch (error) {
    console.error("Error storing user ID:", error)
  }
}

export function getUserId(): string | null {
  try {
    if (typeof window !== "undefined") {
      // Try localStorage first
      const localId = localStorage.getItem("userId")
      if (localId) return localId

      // Then try sessionStorage
      const sessionId = sessionStorage.getItem("userId")
      if (sessionId) return sessionId
    }
    return null
  } catch (error) {
    console.error("Error retrieving user ID:", error)
    return null
  }
}

export function storeUserEmail(email: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("userEmail", email)
    }
  } catch (error) {
    console.error("Error storing user email:", error)
  }
}

export function getUserEmail(): string | null {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userEmail")
    }
    return null
  } catch (error) {
    console.error("Error retrieving user email:", error)
    return null
  }
}

export function storeUserInfo(userId: string, email: string | null): void {
  storeUserId(userId)
  if (email) {
    storeUserEmail(email)
  }
}

export function clearUserInfo(): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userId")
      localStorage.removeItem("userEmail")
      sessionStorage.removeItem("userId")
    }
  } catch (error) {
    console.error("Error clearing user info:", error)
  }
}
