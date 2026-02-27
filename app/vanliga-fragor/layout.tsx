import { getPageMetadata } from '@/lib/page-metadata'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata('/vanliga-fragor')
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
