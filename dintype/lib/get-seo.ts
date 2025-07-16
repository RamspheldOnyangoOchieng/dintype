import { getAllSeoData, getPageSeo as getSeoForPage, PageSeo, GlobalSeo, SeoData } from "./seo-actions"

export { getAllSeoData, PageSeo, GlobalSeo, SeoData }

export async function getPageSeo(pagePath: string) {
  // Add console logging for debugging
  console.log(`[SEO Client] Fetching SEO data for page: ${pagePath}`)

  // Add a cache-busting parameter to ensure we get fresh data
  const timestamp = new Date().getTime()
  const seoData = await getSeoForPage(`${pagePath}?t=${timestamp}`)

  console.log(`[SEO Client] SEO data received:`, seoData)
  return seoData
}
