import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

// Default admin credentials
const DEFAULT_ADMIN_EMAIL = "admin@example.com"
const DEFAULT_ADMIN_PASSWORD = "admin123"
const DEFAULT_ADMIN_USERNAME = "admin"

export async function POST(request: Request) {
  try {
    // Check for authorization - this should be secured in production
    const { searchParams } = new URL(request.url)
    const authKey = searchParams.get("key")

    // Simple security check - in production use a proper secret
    if (authKey !== process.env.ADMIN_SETUP_KEY && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // First, try to sign up the user directly
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      options: {
        data: {
          username: DEFAULT_ADMIN_USERNAME,
          is_admin: true,
        },
      },
    })

    let userId: string | undefined

    // If sign up fails because user exists, try to get the user ID
    if (signUpError && signUpError.message.includes("already exists")) {
      // Try to get the user by email from the users table
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id")
        .eq("email", DEFAULT_ADMIN_EMAIL)
        .single()

      if (usersError) {
        // If that fails, try to sign in to get the user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: DEFAULT_ADMIN_EMAIL,
          password: DEFAULT_ADMIN_PASSWORD,
        })

        if (signInError && !signInError.message.includes("Invalid login credentials")) {
          return NextResponse.json({ error: `Error signing in: ${signInError.message}` }, { status: 500 })
        }

        userId = signInData?.user?.id
      } else {
        userId = users?.id
      }
    } else if (signUpData?.user) {
      userId = signUpData.user.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Could not create or find admin user" }, { status: 500 })
    }

    // Ensure user is in admin_users table
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (adminCheckError && !adminCheckError.message.includes("No rows found")) {
      return NextResponse.json({ error: `Error checking admin status: ${adminCheckError.message}` }, { status: 500 })
    }

    // If not in admin_users table, add them
    if (!existingAdmin) {
      const { error: insertError } = await supabase.from("admin_users").insert([{ user_id: userId }])

      if (insertError) {
        return NextResponse.json(
          { error: `Error adding user to admin_users table: ${insertError.message}` },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Default admin account created successfully",
      credentials: {
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        username: DEFAULT_ADMIN_USERNAME,
      },
    })
  } catch (error) {
    console.error("Unexpected error creating default admin:", error)
    return NextResponse.json(
      {
        error: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
