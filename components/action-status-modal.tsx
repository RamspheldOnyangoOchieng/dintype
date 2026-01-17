"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface ActionStatusModalProps {
    isOpen: boolean
    onClose: () => void
    type: "success" | "error"
    title: string
    description: string
}

export function ActionStatusModal({ isOpen, onClose, type, title, description }: ActionStatusModalProps) {
    const isSuccess = type === "success"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[#0f172a] border-blue-500/20 text-white overflow-hidden p-8 shadow-2xl">
                {/* Glow effect */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                    <div className={`absolute -top-[20%] -right-[10%] w-[100%] h-[100%] ${isSuccess ? 'bg-primary/10' : 'bg-red-500/10'} rounded-full blur-[100px]`} />
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-20 h-20 ${isSuccess ? 'bg-primary/10 ring-primary/5 border-primary/20' : 'bg-red-500/10 ring-red-500/5 border-red-500/20'} rounded-full flex items-center justify-center mb-2 ring-8 border`}>
                        {isSuccess ? (
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                        ) : (
                            <XCircle className="h-10 w-10 text-red-500" />
                        )}
                    </div>

                    <DialogHeader className="p-0 space-y-2">
                        <DialogTitle className={`text-3xl font-black italic uppercase tracking-tighter ${isSuccess ? 'text-primary' : 'text-red-400'}`}>
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-lg leading-relaxed px-2">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="mt-8">
                    <Button
                        type="button"
                        onClick={onClose}
                        className={`w-full rounded-2xl h-14 ${isSuccess ? 'bg-[#e949ad] hover:bg-[#d8389c] shadow-[#e949ad]/40 border border-[#f062be]' : 'bg-red-600 hover:bg-red-700 shadow-red-900/40'} text-white font-black text-sm tracking-widest shadow-xl transition-all active:scale-95`}
                    >
                        CONTINUE
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
