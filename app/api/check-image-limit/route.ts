import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { checkImageGenerationLimit, getUserPlanInfo } from "@/lib/subscription-limits"

export async function GET(request: NextRequest) {
  // Try token-based authentication first
  const authHeader = request.headers.get('authorization')
  const userIdHeader = request.headers.get('x-user-id')

  let userId: string | null = null

  // Create supabase client
  const supabase = await createClient()

  // Method 1: Try Authorization header (JWT token)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)

      if (!authError && user) {
        userId = user.id
      }
    } catch (error) {
      console.error("Token authentication failed:", error)
    }
  }

  // Method 2: Try session-based authentication
  if (!userId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (!authError && user) {
        userId = user.id
      }
    } catch (error) {
      console.error("Session authentication failed:", error)
    }
  }

  // Method 3: Fallback to User ID header
  if (!userId && userIdHeader) {
    userId = userIdHeader
  }

  if (!userId) {
    return NextResponse.json({ 
      success: false, 
      error: "Unauthorized",
      allowed: false 
    }, { status: 401 })
  }

  try {
    // Get user plan info
    const planInfo = await getUserPlanInfo(userId)
    
    // If premium or admin, always allow
    if (planInfo.planType === 'premium') {
      return NextResponse.json({
        success: true,
        allowed: true,
        isPremium: true,
        currentUsage: 0,
        limit: null,
        message: "Premium users have unlimited generations with tokens"
      })
    }

    // For free users, check the weekly limit
    const limitCheck = await checkImageGenerationLimit(userId)

    return NextResponse.json({
      success: true,
      allowed: limitCheck.allowed,
      isPremium: false,
      currentUsage: limitCheck.currentUsage,
      limit: limitCheck.limit,
      message: limitCheck.message
    })
  } catch (error) {
    console.error("Error checking image limit:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to check limit",
      allowed: true // Default to allowing on error
    }, { status: 500 })
  }
}
