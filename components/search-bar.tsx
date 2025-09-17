"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter()

  const handleSearchClick = () => {
    router.push("/search") 
  }

  return (
    <Button
      variant="outline"
      className={cn(
        "flex items-center justify-start gap-2 w-full text-muted-foreground",
        className
      )}
      onClick={handleSearchClick}
    >
      <Search className="h-4 w-4" />
      <span className="flex-grow text-left">Search...</span>
    </Button>
  )
}