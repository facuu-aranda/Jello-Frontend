"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const ALL_SKILLS = {
  "Programming Languages": ["JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust", "PHP", "Ruby"],
  "Frontend Frameworks": ["React", "Next.js", "Vue.js", "Angular", "Svelte", "SolidJS"],
  "Backend Frameworks": ["Node.js", "Express", "Django", "Flask", "Spring Boot", "ASP.NET", "Laravel"],
  "Styling & UI": ["CSS", "Sass", "Tailwind CSS", "Styled Components", "Framer Motion", "Shadcn/UI"],
  "Databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase"],
  "Tools & Platforms": ["Git", "GitHub", "Docker", "Kubernetes", "AWS", "Google Cloud", "Vercel", "Figma", "Jira"],
  "Soft Skills": ["Teamwork", "Communication", "Problem Solving", "Leadership", "Adaptability", "Creativity", "Time Management"],
}

interface SkillsEditorProps {
  selectedSkills: string[]
  setSelectedSkills: (skills: string[]) => void
  isEditing: boolean
}

export function SkillsEditor({ selectedSkills, setSelectedSkills, isEditing }: SkillsEditorProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
    setOpen(false)
  }

  const handleRemove = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill))
  }

  const availableSkills = Object.values(ALL_SKILLS).flat().filter(skill => !selectedSkills.includes(skill));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map(skill => (
          <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
            {skill}
            {isEditing && (
              <button onClick={() => handleRemove(skill)} className="ml-2 rounded-full hover:bg-destructive/20 p-0.5">
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      {isEditing && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">Add Skill +</Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[250px]">
            <Command>
              <CommandInput placeholder="Search skills..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {Object.entries(ALL_SKILLS).map(([group, skills]) => {
                  const filteredSkills = skills.filter(s => !selectedSkills.includes(s));
                  if (filteredSkills.length === 0) return null;
                  return (
                    <CommandGroup key={group} heading={group}>
                      {filteredSkills.map(skill => (
                        <CommandItem key={skill} onSelect={() => handleSelect(skill)}>
                          {skill}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )
                })}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}