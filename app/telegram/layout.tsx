import type React from "react"
import Script from "next/script"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
    title: "PocketLove AI - Telegram Mini App",
    description: "Chat with AI companions on Telegram",
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
}

export default function TelegramLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
            />
            {/* 
                The container doesn't use 100vh/min-h-screen so the Telegram header 
                remains visible at the top. The WebApp API provides viewport height 
                which the child components use.
            */}
            <div className="text-white overflow-hidden bg-transparent">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    html, body { 
                        background: transparent !important; 
                        background-color: transparent !important;
                    }
                ` }} />
                {children}
            </div>
        </>
    )
}
