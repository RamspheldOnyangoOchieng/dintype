export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-5 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded w-full"></div>
          <div className="h-5 bg-muted rounded w-1/2"></div>
          <div className="flex justify-end">
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="h-6 bg-muted rounded w-1/6 mb-4"></div>
        <div className="bg-card rounded-lg shadow p-6 h-96 bg-muted/20"></div>
      </div>
    </div>
  )
}
