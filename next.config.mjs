/** @type {import('next').NextConfig} */
const nextConfig = {
  // Statically inject critical public envs so they work in middleware/edge too
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    NOVITA_API_KEY: process.env.NOVITA_API_KEY,
    NEXT_PUBLIC_NOVITA_API_KEY: process.env.NEXT_PUBLIC_NOVITA_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'faas-output-image.s3.ap-southeast-1.amazonaws.com',
        pathname: '/prod/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    domains: ['faas-output-image.s3.ap-southeast-1.amazonaws.com', 'qfjptqdkthmejxpwbmvq.supabase.co', 'res.cloudinary.com'],
  },
  async redirects() {
    return [
      { source: '/about-us', destination: '/om-oss', permanent: true },
      { source: '/about', destination: '/om-oss', permanent: true },
      { source: '/affiliate', destination: '/partner', permanent: true },
      { source: '/blog', destination: '/blogg', permanent: true },
      { source: '/characters', destination: '/karaktarer', permanent: true },
      { source: '/chat', destination: '/chatt', permanent: true },
      { source: '/chat/:path*', destination: '/chatt/:path*', permanent: true },
      { source: '/collections', destination: '/samlingar', permanent: true },
      { source: '/contact', destination: '/kontakta', permanent: true },
      { source: '/cookies', destination: '/cookies', permanent: true },
      { source: '/create-character', destination: '/skapa-karaktar', permanent: true },
      { source: '/faq', destination: '/faq', permanent: true },
      { source: '/kakor', destination: '/cookies', permanent: true },
      { source: '/vanliga-fragor', destination: '/faq', permanent: true },
      { source: '/kontakt', destination: '/kontakta', permanent: true },
      { source: '/favorites', destination: '/favoriter', permanent: true },
      { source: '/generate', destination: '/generera', permanent: true },
      { source: '/generate-character', destination: '/generera-karaktar', permanent: true },
      { source: '/guidelines', destination: '/riktlinjer', permanent: true },
      { source: '/how-it-works', destination: '/hur-det-fungerar', permanent: true },
      { source: '/invoices', destination: '/fakturor', permanent: true },
      { source: '/login', destination: '/logga-in', permanent: true },
      { source: '/signup', destination: '/registrera', permanent: true },
      { source: '/monetization', destination: '/monetisering', permanent: true },
      { source: '/my-ai', destination: '/min-ai', permanent: true },
      { source: '/privacy', destination: '/integritet', permanent: true },
      { source: '/privacy-policy', destination: '/integritetspolicy', permanent: true },
      { source: '/profile', destination: '/profil', permanent: true },
      { source: '/prompts', destination: '/prompter', permanent: true },
      { source: '/report', destination: '/rapportera', permanent: true },
      { source: '/reset-password', destination: '/aterstall-losenord', permanent: true },
      { source: '/roadmap', destination: '/fardplan', permanent: true },
      { source: '/settings', destination: '/installningar', permanent: true },
      { source: '/terms', destination: '/villkor', permanent: true },
      { source: '/unsubscribe', destination: '/avsluta-prenumeration', permanent: true },
      { source: '/admin/login', destination: '/admin/logga-in', permanent: true },
      { source: '/admin/signup', destination: '/admin/registrera', permanent: true },
    ]
  },
}

export default nextConfig
