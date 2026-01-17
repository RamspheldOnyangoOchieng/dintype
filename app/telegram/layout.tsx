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
                CRITICAL: No height constraints. 
                The content should flow naturally so Telegram opens in "compact" mode.
                Adding overflow-hidden to prevent any scroll bounce from expanding.
            */}
            <div
                className="text-white overflow-hidden"
                style={{
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    minHeight: 'auto',
                    height: 'auto'
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    html, body { 
                        background: transparent !important; 
                        background-color: transparent !important;
                        min-height: auto !important;
                        height: auto !important;
                        overflow: hidden !important;
                    }
                    #__next {
                        background: transparent !important;
                        min-height: auto !important;
                    }
                ` }} />
                {children}
            </div>
        </>
    )
}
