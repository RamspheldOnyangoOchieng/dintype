// This file is used to store and retrieve SEO data from localStorage
// It's a temporary solution until we can get the database working

// Define the types for our SEO data
export type GlobalSeo = {
  siteName: string
  siteUrl: string
  titleTemplate: string
  description: string
  keywords: string
  ogImage: string
  twitterHandle: string
}

export type PageSeo = {
  title: string
  description: string
  keywords: string
  ogImage: string
}

export type SeoData = {
  global: GlobalSeo
  pages: Record<string, PageSeo>
}

// Define the localStorage keys
const GLOBAL_SEO_KEY = "ai-character-explorer-global-seo"
const PAGE_SEO_KEY = "ai-character-explorer-page-seo"

// Get default SEO data
export function getDefaultSeoData(): SeoData {
  return {
    global: {
      siteName: "AI Character Explorer",
      siteUrl: "https://ai-character-explorer.vercel.app",
      titleTemplate: "%s | AI Character Explorer",
      description: "Explore and chat with AI characters in a fun and interactive way.",
      keywords: "AI, characters, chat, virtual companions, artificial intelligence",
      ogImage: "/og-image.jpg",
      twitterHandle: "@aicharacterexplorer",
    },
    pages: {
      "/": {
        title: "AI Character Explorer",
        description: "Explore and chat with AI characters in a fun and interactive way.",
        keywords: "AI, characters, chat, virtual companions, artificial intelligence",
        ogImage: "/og-image.jpg",
      },
      "/characters": {
        title: "Browse Characters",
        description: "Browse our collection of AI characters and find your perfect virtual companion.",
        keywords: "AI characters, virtual companions, character gallery, browse characters",
        ogImage: "/og-image.jpg",
      },
      "/chat": {
        title: "Chat with Characters",
        description: "Chat with your favorite AI characters in real-time.",
        keywords: "AI chat, character chat, virtual companions, conversation",
        ogImage: "/og-image.jpg",
      },
    },
  }
}

// Get global SEO data from localStorage
export function getGlobalSeoFromLocalStorage(): GlobalSeo | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const data = localStorage.getItem(GLOBAL_SEO_KEY)
    if (!data) {
      return null
    }

    return JSON.parse(data)
  } catch (error) {
    console.error("Error getting global SEO data from localStorage:", error)
    return null
  }
}

// Save global SEO data to localStorage
export function saveGlobalSeoToLocalStorage(data: GlobalSeo): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(GLOBAL_SEO_KEY, JSON.stringify(data))
    console.log("Global SEO data saved to localStorage:", data)
  } catch (error) {
    console.error("Error saving global SEO data to localStorage:", error)
  }
}

// Get page SEO data from localStorage
export function getPageSeoFromLocalStorage(): Record<string, PageSeo> | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const data = localStorage.getItem(PAGE_SEO_KEY)
    if (!data) {
      return null
    }

    return JSON.parse(data)
  } catch (error) {
    console.error("Error getting page SEO data from localStorage:", error)
    return null
  }
}

// Save page SEO data to localStorage
export function savePageSeoToLocalStorage(data: Record<string, PageSeo>): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(PAGE_SEO_KEY, JSON.stringify(data))
    console.log("Page SEO data saved to localStorage:", data)
  } catch (error) {
    console.error("Error saving page SEO data to localStorage:", error)
  }
}

// Save specific page SEO data to localStorage
export function saveSpecificPageSeoToLocalStorage(path: string, data: PageSeo): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const existingData = getPageSeoFromLocalStorage() || {}
    const newData = {
      ...existingData,
      [path]: data,
    }
    savePageSeoToLocalStorage(newData)
    console.log(`Page SEO data for ${path} saved to localStorage:`, data)
  } catch (error) {
    console.error(`Error saving page SEO data for ${path} to localStorage:`, error)
  }
}

// Delete page SEO data from localStorage
export function deletePageSeoFromLocalStorage(path: string): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const existingData = getPageSeoFromLocalStorage() || {}
    if (!existingData[path]) {
      console.log(`No page SEO data found for ${path}`)
      return
    }

    delete existingData[path]
    savePageSeoToLocalStorage(existingData)
    console.log(`Page SEO data for ${path} deleted from localStorage`)
  } catch (error) {
    console.error(`Error deleting page SEO data for ${path} from localStorage:`, error)
  }
}

// Clear all SEO data from localStorage
export function clearAllSeoDataFromLocalStorage(): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.removeItem(GLOBAL_SEO_KEY)
    localStorage.removeItem(PAGE_SEO_KEY)
    console.log("All SEO data cleared from localStorage")
  } catch (error) {
    console.error("Error clearing all SEO data from localStorage:", error)
  }
}
