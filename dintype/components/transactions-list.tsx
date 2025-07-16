import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function TransactionsList({ transactions = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
                <Skeleton className="h-3 w-24 ml-auto" />
              </div>
            </div>
          ))}
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No transactions found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{transaction.payment_method || "Credit Card"}</span>
              <StatusBadge status={transaction.status} />
              {transaction._source === "redirect" && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Redirect
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="font-mono text-xs">
                {transaction.stripe_session_id || transaction.payment_intent_id || "No ID"}
              </span>
              {transaction.created_at && (
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 sm:mt-0 text-right">
            <div className="font-medium">
              {transaction.amount
                ? `${(transaction.amount / 100).toFixed(2)} ${transaction.currency?.toUpperCase() || "SEK"}`
                : "Amount unknown"}
            </div>
            <div className="text-xs text-gray-500">
              {transaction.user_id ? (
                <span className="font-mono">{transaction.user_id.substring(0, 8)}...</span>
              ) : (
                "No user ID"
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }) {
  let variant = "outline"
  const label = status || "unknown"

  switch (status?.toLowerCase()) {
    case "completed":
    case "succeeded":
    case "success":
      variant = "success"
      break
    case "pending":
    case "processing":
      variant = "warning"
      break
    case "failed":
    case "canceled":
    case "cancelled":
      variant = "destructive"
      break
    default:
      variant = "outline"
  }

  return (
    <Badge
      variant={variant}
      className={`text-xs ${
        variant === "success"
          ? "bg-green-50 text-green-700 border-green-200"
          : variant === "warning"
            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : variant === "destructive"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      {label}
    </Badge>
  )
}
