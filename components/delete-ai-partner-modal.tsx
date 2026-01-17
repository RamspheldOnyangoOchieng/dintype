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
import { Trash2, AlertTriangle } from "lucide-react"

interface DeleteAIPartnerModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    characterName: string
}

export function DeleteAIPartnerModal({ isOpen, onClose, onConfirm, characterName }: DeleteAIPartnerModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[#0f172a] border-blue-500/20 text-white overflow-hidden p-8 shadow-2xl shadow-blue-900/20">
                {/* Glow effect */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                    <div className="absolute -top-[20%] -right-[10%] w-[100%] h-[100%] bg-primary/10 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] bg-blue-600/5 rounded-full blur-[80px]" />
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-2 ring-8 ring-red-500/5 border border-red-500/20">
                        <Trash2 className="h-10 w-10 text-red-500" />
                    </div>

                    <DialogHeader className="p-0 space-y-2">
                        <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-white">
                            DELETE <span className="text-primary">{characterName}</span>?
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-lg leading-relaxed px-2">
                            Are you sure you want to remove your AI Life Partner? This connection will be lost forever.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-4 mt-10 w-full sm:justify-stretch">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 rounded-2xl h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-sm tracking-widest transition-all"
                    >
                        NO, KEEP THEM
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 rounded-2xl h-14 bg-[#e949ad] hover:bg-[#d8389c] text-white font-black text-sm tracking-widest shadow-xl shadow-[#e949ad]/40 border border-[#f062be] transition-all active:scale-95"
                    >
                        YES, DELETE
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
