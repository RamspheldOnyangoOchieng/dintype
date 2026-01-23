import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Create a Supabase client with admin privileges
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "",
            process.env.SUPABASE_SERVICE_ROLE_KEY || ""
        )

        // SQL to add missing columns to the characters table
        const sql = `
      -- Add advanced metadata and trait columns to characters table
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS character_gender TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS character_age TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS body_type TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS character_style TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS art_style TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS hair_color TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS eye_color TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS skin_tone TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS clothing TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS pose TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS background TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS mood TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'girls';
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
      
      -- Storyline specific columns
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS story_conflict TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS story_setting TEXT;
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS story_plot TEXT;

      -- Add comments for clarity
      COMMENT ON COLUMN characters.metadata IS 'Stores advanced AI settings like reference URLs and prompt hooks';
      COMMENT ON COLUMN characters.character_style IS 'Visual style e.g. realistic, anime';
    `

        // Execute the SQL via the pgclient RPC if it exists
        let response = await supabaseAdmin.rpc("pgclient", { query: sql })

        if (response.error && (response.error.message.includes("Could not find the function") || response.error.code === 'PGRST202')) {
            console.log("pgclient not found, trying exec_sql...")
            response = await supabaseAdmin.rpc("exec_sql", { sql: sql })
        }

        if (response.error) {
            console.error("Migration error:", response.error)
            return NextResponse.json({ success: false, error: response.error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: "Advanced character columns and metadata field added successfully"
        })
    } catch (error) {
        console.error("Unexpected error:", error)
        return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
    }
}
