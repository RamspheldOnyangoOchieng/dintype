import fs from "fs"
import path from "path"

// Define patterns to look for without using the exact syntax
const staticMetaPattern = "export" + " const " + "meta" + "data"
const dynamicMetaPattern = "export" + " function " + "generate" + "Meta" + "data"

function findFilesWithMetadataExports(dir: string): string[] {
  const results: string[] = []

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== "node_modules" && file !== ".next") {
        results.push(...findFilesWithMetadataExports(filePath))
      }
    } else if (stat.isFile() && (file.endsWith(".tsx") || file.endsWith(".ts"))) {
      const content = fs.readFileSync(filePath, "utf8")

      const hasStaticMeta = content.includes(staticMetaPattern)
      const hasDynamicMeta = content.includes(dynamicMetaPattern)

      if (hasStaticMeta && hasDynamicMeta) {
        results.push(`${filePath} (BOTH - CONFLICT!)`)
      } else if (hasStaticMeta) {
        results.push(`${filePath} (static)`)
      } else if (hasDynamicMeta) {
        results.push(`${filePath} (dynamic)`)
      }
    }
  }

  return results
}

const rootDir = process.cwd()
console.log(`Searching for metadata exports in ${rootDir}...`)

const filesWithMetadataExports = findFilesWithMetadataExports(rootDir)

if (filesWithMetadataExports.length > 0) {
  console.log("Files with metadata exports:")
  filesWithMetadataExports.forEach((file) => console.log(`- ${file}`))
} else {
  console.log("No files with metadata exports found.")
}
