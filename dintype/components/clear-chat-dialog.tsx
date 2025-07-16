"use client"

import { useState } from "react"
// Import our custom Button component
import { Button } from "@/components/ui/custom-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

// Add translation import
import { useTranslations } from "@/lib/use-translations"

interface ClearChatDialogProps {
  onConfirm: () => Promise<void>
  isClearing: boolean
}

// Inside the ClearChatDialog component:
export function ClearChatDialog({ onConfirm, isClearing }: ClearChatDialogProps) {
  const [open, setOpen] = useState(false)
  // Inside the ClearChatDialog component:
  const { t } = useTranslations()

  const handleConfirm = async () => {
    await onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-700"
          title="Clear chat history"
          aria-label="Clear chat history"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#1A1A1A] border-[#252525] text-white">
        <DialogHeader>
          <DialogTitle>{t("chat.clearHistory")}</DialogTitle>
          <DialogDescription className="text-gray-400">{t("chat.clearConfirmation")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start gap-2">
          <Button
            variant="destructive"
            onClick={handleConfirm}
            isLoading={isClearing}
            loadingText={t("chat.clearing")}
            className="bg-red-600 hover:bg-red-700 text-white"
            fullWidth
          >
            {t("chat.clearButton")}
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-[#252525] text-white hover:bg-[#353535]"
            fullWidth
          >
            {t("chat.cancelButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
