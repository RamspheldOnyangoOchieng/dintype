import type React from "react"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[100svh] max-h-[100svh] md:h-[100dvh] md:max-h-[100dvh] bg-background overflow-hidden fixed inset-0 md:relative md:inset-auto">
      <div className="flex-1 flex flex-col overflow-hidden h-full w-full">{children}</div>
    </div>
  )
}
