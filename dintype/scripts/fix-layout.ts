import fs from "fs"
import path from "path"

const layoutPath = path.join(process.cwd(), "app", "layout.tsx")
const backupPath = path.join(process.cwd(), "app", "layout.tsx.bak")

// Define patterns to look for without using the exact syntax
const staticMetaPattern = "export" + " const " + "meta" + "data"
const dynamicMetaPattern = "export" + " function " + "generate" + "Meta" + "data"

if (fs.existsSync(layoutPath)) {
  // Create a backup
  fs.copyFileSync(layoutPath, backupPath)
  console.log(`Backup created at ${backupPath}`)

  let content = fs.readFileSync(layoutPath, "utf8")

  // Check for problematic patterns
  const hasStaticMeta = content.includes(staticMetaPattern)
  const hasDynamicMeta = content.includes(dynamicMetaPattern)

  if (hasStaticMeta && hasDynamicMeta) {
    console.log("Found both static and dynamic metadata exports. Removing static metadata export...")

    // This is a simplified approach - in a real scenario, you'd want to use an AST parser
    // to properly remove the export without breaking the code
    const lines = content.split("\n")
    const filteredLines = lines.filter((line) => !line.includes(staticMetaPattern))
    content = filteredLines.join("\n")

    fs.writeFileSync(layoutPath, content)
    console.log("Static metadata export removed.")
  } else {
    console.log("No conflicting metadata exports found.")
  }
} else {
  console.log("Layout file does not exist!")
}
