import type React from "react"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen max-h-screen bg-background overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden h-full">{children}</div>
    </div>
  )
}
