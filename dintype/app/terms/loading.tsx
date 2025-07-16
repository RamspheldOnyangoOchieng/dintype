export default function Loading() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-8 bg-muted rounded w-1/2 mt-8"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-8 bg-muted rounded w-1/2 mt-8"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )
}
