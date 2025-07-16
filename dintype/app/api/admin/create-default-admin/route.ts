import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

// Default admin credentials
const DEFAULT_ADMIN_EMAIL = "admin@example.com"
const DEFAULT_ADMIN_PASSWORD = "admin123"
const DEFAULT_ADMIN_USERNAME = "admin"

export async function POST(request: Request) {
  try {
    // Check for authorization - this should be secured in production
    // For example, require a special token or only allow in development
    const { searchParams } = new URL(request.url)
    const authKey = searchParams.get("key")

    // Simple security check - in production use a proper secret
    if (authKey !== process.env.ADMIN_SETUP_KEY && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // Check if the admin user already exists
    const { data: existingUsers, error: userCheckError } = await supabase
      .from("auth.users")
      .select("id, email")
      .eq("email", DEFAULT_ADMIN_EMAIL)
      .single()

    if (userCheckError && !userCheckError.message.includes("No rows found")) {
      return NextResponse.json(
        { error: `Error checking for existing user: ${userCheckError.message}` },
        { status: 500 },
      )
    }

    let userId = existingUsers?.id

    // If user doesn't exist, create them
    if (!userId) {
      // Create user with auth.sign_up
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

      if (signUpError) {
        return NextResponse.json({ error: `Error creating admin user: ${signUpError.message}` }, { status: 500 })
      }

      userId = signUpData.user?.id

      if (!userId) {
        return NextResponse.json({ error: "Failed to create user - no user ID returned" }, { status: 500 })
      }

      // Confirm the user's email (since we're creating an admin)
      // This is a workaround since we don't have direct access to confirm email
      const { error: updateError } = await supabase
        .from("auth.users")
        .update({ email_confirmed_at: new Date().toISOString() })
        .eq("id", userId)

      if (updateError) {
        console.warn("Could not auto-confirm email:", updateError)
        // Continue anyway - the user is created
      }
    } else {
      // Update the existing user's password
      // We'll use auth.admin.updateUserById if available, otherwise fall back
      try {
        // Try to use resetPasswordForEmail as a workaround
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(DEFAULT_ADMIN_EMAIL, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/login`,
        })

        if (resetError) {
          console.warn("Could not reset password:", resetError)
          // Continue anyway - we'll just use the existing user
        }
      } catch (err) {
        console.warn("Error updating user password:", err)
        // Continue anyway - we'll just use the existing user
      }
    }

    // Ensure user is in admin_users table
    // First check if they're already there
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

    // Also update the user's metadata to ensure they have admin flag
    const { error: updateMetadataError } = await supabase
      .from("auth.users")
      .update({
        raw_user_meta_data: {
          username: DEFAULT_ADMIN_USERNAME,
          is_admin: true,
        },
      })
      .eq("id", userId)

    if (updateMetadataError) {
      console.warn("Could not update user metadata:", updateMetadataError)
      // Continue anyway - the user is in the admin_users table
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
