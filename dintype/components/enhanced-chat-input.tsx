"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ChevronDown, Video, Info } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ImageGenerationPopup } from "./image-generation-popup"

interface EnhancedChatInputProps {
  onSendMessage: (message: string) => Promise<void>
  isLoading?: boolean
  characterName?: string
}

export function EnhancedChatInput({
  onSendMessage,
  isLoading = false,
  characterName = "Character",
}: EnhancedChatInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendMessage = async () => {
    if (inputValue.trim()) {
      await onSendMessage(inputValue)
      setInputValue("")
    }
  }

  const insertSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
    setIsPopoverOpen(false)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleShowMeClick = () => {
    setIsPopoverOpen(false)
    setIsImagePopupOpen(true)
  }

  return (
    <div className="relative">
      {/* Suggestion button */}
      <div className="mb-2">
        <Button
          variant="outline"
          className="rounded-full bg-[#1E1E2E] border-[#2A2A3A] text-white hover:bg-[#2A2A3A] hover:text-white"
          size="sm"
          onClick={() => insertSuggestion("Send me a video of you")}
        >
          <Video className="h-4 w-4 mr-2" />
          Send me a video of you
        </Button>
      </div>

      {/* Chat input */}
      <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-full border border-[#2A2A3A] pl-4 pr-2 py-1">
        <Input
          ref={inputRef}
          placeholder="Write a message..."
          className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-[#1E1E2E] hover:bg-[#2A2A3A] text-white">
              <span className="mr-1">Ask</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0 bg-[#1E1E2E] border-[#2A2A3A] text-white" align="end" sideOffset={5}>
            <div className="flex flex-col">
              <button
                className="px-4 py-3 text-left hover:bg-[#2A2A3A] transition-colors border-b border-[#2A2A3A]"
                onClick={handleShowMeClick}
              >
                Show me...
              </button>
              <button
                className="px-4 py-3 text-left hover:bg-[#2A2A3A] transition-colors border-b border-[#2A2A3A]"
                onClick={() => insertSuggestion("Send me...")}
              >
                Send me...
              </button>
              <button
                className="px-4 py-3 text-left hover:bg-[#2A2A3A] transition-colors border-b border-[#2A2A3A]"
                onClick={() => insertSuggestion("Can I see...")}
              >
                Can I see...
              </button>
              <button
                className="px-4 py-3 text-left hover:bg-[#2A2A3A] transition-colors flex items-center"
                onClick={() => insertSuggestion("How do I use this feature?")}
              >
                <Info className="h-4 w-4 mr-2 text-blue-400" />
                How to Use
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          size="icon"
          className="rounded-full bg-[#FF4D8D] hover:bg-[#FF3D7D] text-white"
          onClick={sendMessage}
          disabled={isLoading || !inputValue.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Image generation popup */}
      <ImageGenerationPopup
        isOpen={isImagePopupOpen}
        onClose={() => setIsImagePopupOpen(false)}
        characterName={characterName}
      />
    </div>
  )
}
