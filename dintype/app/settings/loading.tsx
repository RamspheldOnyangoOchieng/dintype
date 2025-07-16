export default function SettingsLoading() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-white min-h-screen">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>

            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 ml-2"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 ml-2"></div>
            </div>

            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 ml-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
