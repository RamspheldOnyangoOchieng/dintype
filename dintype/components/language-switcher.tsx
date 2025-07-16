"use client"

import { useLanguage } from "./language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { language, changeLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 w-full justify-start px-2">
          <Globe className="h-4 w-4" />
          <span>{language === "en" ? "English" : "Svenska"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          <div className="flex items-center">
            {language === "en" && <span className="mr-2">✓</span>}
            English
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("sv")}>
          <div className="flex items-center">
            {language === "sv" && <span className="mr-2">✓</span>}
            Svenska
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
