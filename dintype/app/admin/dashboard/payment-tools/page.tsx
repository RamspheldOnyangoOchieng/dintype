"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CreditCard,
  Search,
  FolderSyncIcon as Sync,
  AlertTriangle,
  CheckCircle,
  Settings,
  ArrowRight,
  FileText,
} from "lucide-react"

export default function PaymentToolsPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Tools</h1>
          <p className="text-muted-foreground">Manage payments, transactions, and premium status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stripe Sync Tool */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-50">
                <Sync className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle>Stripe Sync</CardTitle>
            </div>
            <CardDescription>Sync payments from Stripe to your database</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-gray-500 mb-4">
              View recent payments from Stripe and sync them to your database. Useful for finding missing payments or
              fixing payment issues.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Fetch recent Stripe payments</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Sync missing payments to database</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Update premium status automatically</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/stripe-sync">
                Open Stripe Sync
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Payment Debug Tool */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-amber-50">
                <Search className="h-5 w-5 text-amber-500" />
              </div>
              <CardTitle>Payment Debug</CardTitle>
            </div>
            <CardDescription>Debug payment issues and check premium status</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-gray-500 mb-4">
              Investigate payment issues by checking transaction history, premium status, and payment redirects for
              specific users.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Check user's payment history</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Verify premium status</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>View payment redirects</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/dashboard/payment-debug">
                Open Payment Debug
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Status Fix */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-green-50">
                <AlertTriangle className="h-5 w-5 text-green-500" />
              </div>
              <CardTitle>Premium Status Fix</CardTitle>
            </div>
            <CardDescription>Fix premium status issues for users</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-gray-500 mb-4">
              Manually update premium status for users who have payment issues or need their status corrected.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Update premium status manually</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Fix inconsistent premium status</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Set premium expiration date</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/dashboard/payment-fix">
                Open Premium Status Fix
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Transactions Dashboard */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-purple-50">
                <CreditCard className="h-5 w-5 text-purple-500" />
              </div>
              <CardTitle>Transactions Dashboard</CardTitle>
            </div>
            <CardDescription>View and manage all payment transactions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-gray-500 mb-4">
              View all payment transactions in your database, filter by status, and export transaction data.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>View all transactions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Filter by status and date</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Export transaction data</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/dashboard/transactions">
                Open Transactions Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Payment Settings */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gray-100">
                <Settings className="h-5 w-5 text-gray-500" />
              </div>
              <CardTitle>Payment Settings</CardTitle>
            </div>
            <CardDescription>Configure payment and Stripe settings</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-gray-500 mb-4">
              Configure Stripe API keys, webhook secrets, and other payment-related settings.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Configure Stripe API keys</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Set webhook secrets</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Toggle live/test mode</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/payment-methods">
                Open Payment Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Subscription Plans */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-pink-50">
                <FileText className="h-5 w-5 text-pink-500" />
              </div>
              <CardTitle>Subscription Plans</CardTitle>
            </div>
            <CardDescription>Manage subscription plans and pricing</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-gray-500 mb-4">
              Create, edit, and manage subscription plans, pricing, and features.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Manage subscription plans</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Set pricing and discounts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Configure plan features</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/dashboard/subscriptions">
                Open Subscription Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
