"use client"

import { useDynamicTranslation } from "@/lib/use-dynamic-translation"

interface TranslatedTextProps {
  text: string
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export function TranslatedText({ text, as: Component = "span", className }: TranslatedTextProps) {
  const { translatedText, isLoading } = useDynamicTranslation(text)

  return <Component className={className}>{isLoading ? text : translatedText}</Component>
}
