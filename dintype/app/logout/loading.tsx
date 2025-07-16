import { LogOut } from "lucide-react"

export default function LogoutLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="text-center p-8 rounded-lg shadow-lg bg-card border max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <LogOut className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Logging Out</h1>

        <p className="mb-6 text-muted-foreground">Please wait while we securely log you out...</p>

        <div className="relative pt-1 mb-6">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
            <div
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary animate-pulse"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
