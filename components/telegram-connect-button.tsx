'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Send, Link2, Unlink, ExternalLink, Loader2 } from 'lucide-react'
import { generateTelegramLinkCode, checkTelegramLink, unlinkTelegram } from '@/lib/telegram-actions'
import { toast } from 'sonner'

interface TelegramConnectButtonProps {
    userId: string
    characterId: string
    characterName: string
}

export function TelegramConnectButton({
    userId,
    characterId,
    characterName,
}: TelegramConnectButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isLinked, setIsLinked] = useState(false)
    const [linkedUsername, setLinkedUsername] = useState<string>('')
    const [linkUrl, setLinkUrl] = useState<string>('')

    useEffect(() => {
        if (isOpen) {
            checkLinkStatus()
        }
    }, [isOpen])

    const checkLinkStatus = async () => {
        const result = await checkTelegramLink(userId, characterId)
        setIsLinked(result.isLinked)
        setLinkedUsername(result.telegramUsername || '')
    }

    const handleGenerateLink = async () => {
        setIsLoading(true)
        try {
            const result = await generateTelegramLinkCode(userId, characterId, characterName)

            if (result.isAlreadyLinked) {
                setIsLinked(true)
                setLinkedUsername(result.linkedTelegramUsername || '')
                toast.info('Already linked to Telegram!')
                return
            }

            if (result.success && result.linkUrl) {
                setLinkUrl(result.linkUrl)
            } else {
                toast.error(result.error || 'Failed to generate link')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnlink = async () => {
        setIsLoading(true)
        try {
            const result = await unlinkTelegram(userId, characterId)
            if (result.success) {
                setIsLinked(false)
                setLinkedUsername('')
                setLinkUrl('')
                toast.success('Telegram disconnected')
            } else {
                toast.error(result.error || 'Failed to unlink')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const openTelegramLink = () => {
        if (linkUrl) {
            window.open(linkUrl, '_blank')
            toast.success('Opening Telegram... Complete the link there!')
            setIsOpen(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px]"
                    title="Connect Telegram"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-primary" />
                        Telegram Chat
                    </DialogTitle>
                    <DialogDescription>
                        Chat with {characterName} on Telegram! Your conversations will sync between the app and Telegram.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {isLinked ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <Link2 className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-green-400">Connected!</p>
                                    <p className="text-sm text-muted-foreground">
                                        Linked to @{linkedUsername}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground text-center">
                                You can now chat with {characterName} at{' '}
                                <a
                                    href="https://t.me/pocketloveaibot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    @pocketloveaibot
                                </a>
                            </p>

                            <Button
                                variant="outline"
                                className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={handleUnlink}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Unlink className="h-4 w-4 mr-2" />
                                )}
                                Disconnect Telegram
                            </Button>
                        </div>
                    ) : linkUrl ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
                                <p className="font-medium mb-2">Click here to connect:</p>
                                <Button
                                    onClick={openTelegramLink}
                                    className="gap-2"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Open in Telegram
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground text-center">
                                This link expires in 15 minutes. After clicking, press "Start" in Telegram to complete the connection.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <Send className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Connect your Telegram to chat with {characterName} anytime, anywhere. Your messages will sync automatically.
                                </p>
                            </div>

                            <Button
                                onClick={handleGenerateLink}
                                disabled={isLoading}
                                className="w-full gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Link2 className="h-4 w-4" />
                                )}
                                Connect to @pocketloveaibot
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                Free users: 50 messages/day • Premium: Unlimited
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
