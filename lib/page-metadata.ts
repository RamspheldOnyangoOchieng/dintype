import { createAdminClient } from './supabase-admin'
import { Metadata } from 'next'

interface PageMeta {
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  og_type: string
  twitter_card: string
  canonical_url: string | null
  robots: string
  language: string
}

/**
 * Get SEO metadata for a specific page path
 * @param pagePath - The page path like '/', '/premium', '/blogg'
 * @returns Metadata object for Next.js
 */
export async function getPageMetadata(pagePath: string): Promise<Metadata> {
  try {
    const supabase = await createAdminClient()

    const { data: pageMeta } = await supabase
      .from('page_meta')
      .select('*')
      .eq('page_path', pagePath)
      .single()

    if (!pageMeta) {
      // Return default metadata if page not found
      return getDefaultMetadata()
    }

    const meta: PageMeta = pageMeta as PageMeta

    return {
      title: meta.meta_title || 'Pocketlove',
      description: meta.meta_description || 'Create and chat with AI characters',
      keywords: meta.meta_keywords?.split(',').map((k) => k.trim()),
      robots: meta.robots || 'index,follow',
      openGraph: {
        title: meta.og_title || meta.meta_title || 'Pocketlove',
        description: meta.og_description || meta.meta_description || '',
        images: meta.og_image ? [{ url: meta.og_image }] : [],
        type: (meta.og_type as any) || 'website',
        locale: meta.language === 'sv' ? 'sv_SE' : 'en_US',
      },
      twitter: {
        card: (meta.twitter_card as any) || 'summary_large_image',
        title: meta.og_title || meta.meta_title || 'Pocketlove',
        description: meta.og_description || meta.meta_description || '',
        images: meta.og_image ? [meta.og_image] : [],
      },
      alternates: {
        canonical: meta.canonical_url || undefined,
      },
    }
  } catch (error) {
    console.error('Error fetching page metadata:', error)
    return getDefaultMetadata()
  }
}

/**
 * Get default metadata fallback
 */
function getDefaultMetadata(): Metadata {
  return {
    title: 'Pocketlove',
    description: 'Create and chat with personal AI companions',
    keywords: ['ai partner', 'ai chat', 'virtual companion'],
    robots: 'index,follow',
    openGraph: {
      title: 'Pocketlove',
      description: 'Create and chat with personal AI companions',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Pocketlove',
      description: 'Create and chat with personal AI companions',
    },
  }
}

/**
 * Get all registered pages for sitemap
 */
export async function getAllPages(): Promise<string[]> {
  try {
    const supabase = await createAdminClient()

    const { data } = await supabase.from('page_meta').select('page_path').order('page_path')

    return data?.map((p) => p.page_path) || []
  } catch (error) {
    console.error('Error fetching pages:', error)
    return ['/']
  }
}
