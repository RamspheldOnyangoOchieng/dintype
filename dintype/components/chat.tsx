"use client"
import { useState } from "react"
import { EnhancedChatInput } from "@/components/enhanced-chat-input"

interface ChatProps {
  character: {
    id: string
    name: string
    image: string
    description: string
    personality: string
    occupation: string
    hobbies: string
    body: string
    ethnicity: string
    language: string
    relationship: string
    isNew: boolean
    createdAt: string
    systemPrompt: string
  }
  messages: {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    timestamp: string
  }[]
  onSendMessage: (message: string) => Promise<void>
}

export function Chat({ character, messages, onSendMessage }: ChatProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (message: string) => {
    setIsLoading(true)
    try {
      await onSendMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] rounded-2xl p-3 ${message.role === "user" ? "bg-[#FF4D8D]" : "bg-[#252525]"}`}>
              <p className="text-white">{message.content}</p>
              <span className="text-xs text-gray-400 mt-1 block">{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[#252525]">
        <EnhancedChatInput onSendMessage={handleSendMessage} isLoading={isLoading} characterName={character.name} />
      </div>
    </div>
  )
}
