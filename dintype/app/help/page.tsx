import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get help and support for your account",
}

export default function HelpPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">How do I change my password?</h3>
            <p className="text-gray-600">
              You can change your password in your{" "}
              <Link href="/profile" className="text-primary hover:underline">
                profile settings
              </Link>
              .
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">How do I upgrade to premium?</h3>
            <p className="text-gray-600">
              Visit the{" "}
              <Link href="/premium" className="text-primary hover:underline">
                premium page
              </Link>{" "}
              to see available subscription options.
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">How do I contact support?</h3>
            <p className="text-gray-600">
              For any issues or questions, please email us at{" "}
              <a href="mailto:support@example.com" className="text-primary hover:underline">
                support@example.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
