"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
]

export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("en")

  return (
    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
      <SelectTrigger className="w-auto">
          <Globe className="h-4 w-4 mr-1" />
          <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <span className="flex items-center gap-2">
              <span>{language.code}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}