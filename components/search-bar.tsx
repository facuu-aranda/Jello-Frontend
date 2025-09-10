"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function SearchBar() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <motion.div
        className="relative"
        whileFocus={{ scale: 1.004 }}
      >
        <Button
          variant="outline"
          className="relative w-full justify-start text-sm text-muted-foreground bg-transparent"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          Search projects, tasks...
          
        </Button>
      </motion.div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search projects, tasks, and more..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Projects">
            <CommandItem>
              <span>Website Redesign</span>
            </CommandItem>
            <CommandItem>
              <span>Mobile App</span>
            </CommandItem>
            <CommandItem>
              <span>Marketing Campaign</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Tasks">
            <CommandItem>
              <span>Update homepage design</span>
            </CommandItem>
            <CommandItem>
              <span>Fix login bug</span>
            </CommandItem>
            <CommandItem>
              <span>Write documentation</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
