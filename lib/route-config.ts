/**
 * Public route configuration
 * These routes are explicitly accessible without authentication
 */

export const PUBLIC_ROUTES = [
    '/',
    '/chatt',
    '/karaktarer',
    '/modeller',
    '/om-oss',
    '/integritetspolicy',
    '/villkor',
    '/aterstall-losenord',
    '/generera',
    '/min-ai',
    '/samlingar',
    '/skapa-karaktar',
    '/favoriter',
    '/kontakt',
    '/kakor',
    '/vanliga-fragor',
    '/hur-det-fungerar',
    '/blogg',
    '/guide',
    '/fardplan',
    '/premium',
    '/partner',
    '/rapportera',
    '/riktlinjer',
    '/monetisering',
    '/prompter',
    '/fakturor',
    '/avsluta-prenumeration',
]

export const AUTH_ROUTES = [
    '/logga-in',
    '/registrera',
]

export const PROTECTED_ROUTES = [
    '/admin',
    '/profil',
    '/installningar',
    '/favoriter',
]

export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

export function isAuthRoute(pathname: string): boolean {
    return AUTH_ROUTES.some(route => pathname.startsWith(route))
}

export function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}
