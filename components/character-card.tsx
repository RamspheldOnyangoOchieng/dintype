"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import type { Character } from "@/types/character"
import { useTranslations } from "@/lib/use-translations"

interface CharacterCardProps {
  character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isHoveringRef = useRef(false)
  const { t, t_db } = useTranslations()

  const handleMouseEnter = () => {
    setIsHovering(true)
    isHoveringRef.current = true

    if (videoRef.current && videoRef.current.src && videoRef.current.src !== "about:blank") {
      setTimeout(() => {
        if (isHoveringRef.current) {
          videoRef.current?.play().catch((err) => {
            if (!err.message.includes("interrupted")) {
              console.error("Video play failed:", err)
            }
          })
        }
      }, 50)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    isHoveringRef.current = false

    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const age = character.age || ""
  const isNew = character.isNew || false

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [])

  return (
    <Link
      href={`/chatt/${character.id}`}
      className="block relative overflow-hidden rounded-2xl md:rounded-3xl aspect-[4/5] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-zinc-900 text-card-foreground border border-white/5 ring-1 ring-white/5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Character Image */}
      <img
        src={
          imageError
            ? "/placeholder.svg?height=500&width=400"
            : character.image || character.imageUrl || "/placeholder.svg?height=500&width=400"
        }
        alt={character.name}
        className={`w-full h-full object-cover transition-all duration-700 ${isHovering && character.videoUrl ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100"}`}
        onError={() => setImageError(true)}
      />

      {/* Character Video (shown on hover) */}
      {character.videoUrl ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
          src={character.videoUrl}
          muted
          loop
          playsInline
        />
      ) : null}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none"></div>

      {/* NEW Badge */}
      {isNew && (
        <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm z-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t("characterCard.new")}
        </div>
      )}

      {/* Character Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-card-foreground z-20">
        <div className="flex items-baseline gap-1.5">
          <h3 className="font-semibold text-lg">{character.name}</h3>
          {age && <span className="text-sm text-muted-foreground">{age}</span>}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{t_db(character.description)}</p>
      </div>
    </Link>
  )
}
