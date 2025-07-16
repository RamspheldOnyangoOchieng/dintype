import fs from "fs"
import path from "path"

const layoutPath = path.join(process.cwd(), "app", "layout.tsx")

// Define patterns to look for without using the exact syntax
const staticMetaPattern = "export" + " const " + "meta" + "data"
const dynamicMetaPattern = "export" + " function " + "generate" + "Meta" + "data"

if (fs.existsSync(layoutPath)) {
  const content = fs.readFileSync(layoutPath, "utf8")
  console.log("Layout file content:")
  console.log("-------------------")
  console.log(content)
  console.log("-------------------")

  // Check for problematic patterns
  const hasStaticMeta = content.includes(staticMetaPattern)
  const hasDynamicMeta = content.includes(dynamicMetaPattern)

  if (hasStaticMeta && hasDynamicMeta) {
    console.log("WARNING: File contains both static and dynamic metadata exports! Please remove one of them.")
  } else if (hasStaticMeta) {
    console.log("File contains static metadata export")
  } else if (hasDynamicMeta) {
    console.log("File contains dynamic metadata export")
  } else {
    console.log("No metadata exports found in the file")
  }
} else {
  console.log("Layout file does not exist!")
}
