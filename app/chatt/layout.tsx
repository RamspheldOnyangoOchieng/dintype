import type React from "react"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  <div className="flex flex-1 bg-background overflow-hidden relative h-full">
    <div className="flex-1 flex flex-col overflow-hidden h-full w-full">{children}</div>
  </div>
  )
}
