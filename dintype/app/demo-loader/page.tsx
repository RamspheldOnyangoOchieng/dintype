import { CuteLoader } from "@/components/cute-loader"

export default function DemoLoaderPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">Loader Demos</h1>

      <div>
        <h2 className="text-xl font-semibold mb-4">Small Loader</h2>
        <CuteLoader size="small" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Medium Loader (Default)</h2>
        <CuteLoader />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Large Loader</h2>
        <CuteLoader size="large" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Custom Message</h2>
        <CuteLoader message="Bearbetar din begäran..." />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Without Tips</h2>
        <CuteLoader showTips={false} />
      </div>
    </div>
  )
}
