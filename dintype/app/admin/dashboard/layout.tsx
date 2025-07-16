import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1">
      <div className="p-4 md:p-8">{children}</div>
    </div>
  )
}
