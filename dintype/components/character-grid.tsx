"use client"

import { useState, useEffect } from "react"
import { CharacterCard } from "./character-card"
import { formatDistanceToNow } from "date-fns"
import type { Character } from "@/types/character"

interface CharacterGridProps {
  characters: Character[]
  selectedTab?: string
  showOnlyWithChatHistory?: boolean
}

export function CharacterGrid({
  characters = [],
  selectedTab = "All",
  showOnlyWithChatHistory = false,
}: CharacterGridProps) {
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([])

  // Safe date formatting function
  const formatDate = (dateString?: string) => {
    try {
      if (!dateString) return "Nyligen"

      const date = new Date(dateString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString)
        return "Nyligen"
      }

      return formatDistanceToNow(
        date,
        { addSuffix: true },
        {
          locale: {
            formatDistance: (token, count, options) => {
              options = options || {}
              const result = formatDistanceLocale[token][count < 0 ? "past" : "future"]
              return result.replace("{{count}}", Math.abs(count))
            },
          },
        },
      )
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Nyligen"
    }
  }

  const formatDistanceLocale = {
    lessThanXSeconds: {
      past: "mindre än {{count}} sekunder sedan",
      future: "om mindre än {{count}} sekunder",
    },
    xSeconds: {
      past: "{{count}} sekunder sedan",
      future: "om {{count}} sekunder",
    },
    lessThanXMinutes: {
      past: "mindre än {{count}} minuter sedan",
      future: "om mindre än {{count}} minuter",
    },
    xMinutes: {
      past: "{{count}} minuter sedan",
      future: "om {{count}} minuter",
    },
    lessThanXHours: {
      past: "mindre än {{count}} timmar sedan",
      future: "om mindre än {{count}} timmar",
    },
    xHours: {
      past: "{{count}} timmar sedan",
      future: "om {{count}} timmar",
    },
    lessThanXDays: {
      past: "mindre än {{count}} dagar sedan",
      future: "om mindre än {{count}} dagar",
    },
    xDays: {
      past: "{{count}} dagar sedan",
      future: "om {{count}} dagar",
    },
    lessThanXMonths: {
      past: "mindre än {{count}} månader sedan",
      future: "om mindre än {{count}} månader",
    },
    xMonths: {
      past: "{{count}} månader sedan",
      future: "om {{count}} månader",
    },
    lessThanXYears: {
      past: "mindre än {{count}} år sedan",
      future: "om mindre än {{count}} år",
    },
    xYears: {
      past: "{{count}} år sedan",
      future: "om {{count}} år",
    },
    overXYears: {
      past: "mer än {{count}} år sedan",
      future: "om mer än {{count}} år",
    },
    almostXYears: {
      past: "nästan {{count}} år sedan",
      future: "om nästan {{count}} år",
    },
  }

  useEffect(() => {
    // Filter characters based on selected tab
    let translatedTab = selectedTab
    if (selectedTab === "All") {
      translatedTab = "Alla"
      setFilteredCharacters(characters)
    } else {
      if (selectedTab === "Hero") {
        translatedTab = "Hjälte"
      } else if (selectedTab === "Villain") {
        translatedTab = "Skurk"
      } else if (selectedTab === "AntiHero") {
        translatedTab = "Antihjälte"
      }
      setFilteredCharacters(characters.filter((character) => character.characterType === translatedTab))
    }
  }, [characters, selectedTab])

  useEffect(() => {
    if (showOnlyWithChatHistory) {
      // Filter to only show characters with chat history
      // This is a simplified check - in a real app, you'd check local storage or database
      const charactersWithHistory = characters.filter((character) => {
        try {
          const history = localStorage.getItem(`chat:${character.id}`)
          return history && JSON.parse(history).length > 0
        } catch (error) {
          console.error("Error checking chat history:", error)
          return false
        }
      })
      setFilteredCharacters(charactersWithHistory)
    }
  }, [characters, showOnlyWithChatHistory])

  return (
    <div className="grid grid-cols-2 gap-3 px-2 md:px-6 lg:px-8 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
      {filteredCharacters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  )
}
