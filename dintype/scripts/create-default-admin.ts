#!/usr/bin/env ts-node
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Default admin credentials
const DEFAULT_ADMIN_EMAIL = "admin@example.com"
const DEFAULT_ADMIN_PASSWORD = "admin123"
const DEFAULT_ADMIN_USERNAME = "admin"

async function createDefaultAdmin() {
  // Ensure environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    console.log("Creating default admin account...")

    // Try to sign up the user
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
      console.log("User already exists, retrieving user ID...")

      // Try to get the user by email from the users table
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id")
        .eq("email", DEFAULT_ADMIN_EMAIL)
        .single()

      if (usersError) {
        console.log("Could not find user in users table, trying to sign in...")

        // If that fails, try to sign in to get the user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: DEFAULT_ADMIN_EMAIL,
          password: DEFAULT_ADMIN_PASSWORD,
        })

        if (signInError) {
          console.error("Error signing in:", signInError.message)
          process.exit(1)
        }

        userId = signInData?.user?.id
      } else {
        userId = users?.id
      }
    } else if (signUpData?.user) {
      userId = signUpData.user.id
      console.log("Created new user with ID:", userId)
    }

    if (!userId) {
      console.error("Could not create or find admin user")
      process.exit(1)
    }

    // Ensure user is in admin_users table
    console.log("Checking if user is in admin_users table...")
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (adminCheckError && !adminCheckError.message.includes("No rows found")) {
      console.error("Error checking admin status:", adminCheckError.message)
      process.exit(1)
    }

    // If not in admin_users table, add them
    if (!existingAdmin) {
      console.log("Adding user to admin_users table...")
      const { error: insertError } = await supabase.from("admin_users").insert([{ user_id: userId }])

      if (insertError) {
        console.error("Error adding user to admin_users table:", insertError.message)
        process.exit(1)
      }
    } else {
      console.log("User already in admin_users table")
    }

    console.log("\n✅ Default admin account created successfully!")
    console.log("\nAdmin Credentials:")
    console.log(`Email: ${DEFAULT_ADMIN_EMAIL}`)
    console.log(`Password: ${DEFAULT_ADMIN_PASSWORD}`)
    console.log(`Username: ${DEFAULT_ADMIN_USERNAME}`)
    console.log("\nPlease save these credentials in a secure location.")
    console.log("In production, you should change these credentials immediately after creation.")
  } catch (error) {
    console.error("Unexpected error:", error)
    process.exit(1)
  }
}

// Run the function
createDefaultAdmin()
