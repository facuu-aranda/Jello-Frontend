"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SearchResultCard } from "@/components/search/SearchResultCard"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Mock de resultados de búsqueda ahora con más datos
const mockResults = [
  { type: 'user' as const, id: 'user-1', name: 'Sarah Chen', description: 'Product Manager @ Jello', avatar: '/sarah-avatar.png', skills: ['Teamwork', 'Jira', 'Problem Solving'] },
  { type: 'project' as const, id: 'proj-1', name: 'Website Redesign', description: 'Complete overhaul of the company website.', avatar: '/placeholder.svg' },
  { type: 'user' as const, id: 'user-2', name: 'Mike Johnson', description: 'Lead Developer | React & Node.js Expert', avatar: '/mike-avatar.jpg', skills: ['React', 'Next.js', 'TypeScript', 'Node.js'] },
  { type: 'project' as const, id: 'proj-2', name: 'Mobile App Q3 Sprint', description: 'Native mobile application for iOS and Android platforms.', avatar: '/placeholder.svg' },
]

export default function SearchPage() {
  const [query, setQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("all") // 'all', 'user', 'project'

  const filteredResults = mockResults.filter(item => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesQuery = 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      (item.type === 'user' && item.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())));
    
    return matchesType && matchesQuery;
  })

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Search</h1>
          <p className="text-muted-foreground">Find projects and people across your workspace.</p>
        </motion.div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name, description or skill..."
              className="pl-12 h-12 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by:</span>
            <ToggleGroup type="single" value={typeFilter} onValueChange={(value) => value && setTypeFilter(value)} defaultValue="all">
              <ToggleGroupItem className="p-4" value="all">All</ToggleGroupItem>
              <ToggleGroupItem className="p-4" value="project">Projects</ToggleGroupItem>
              <ToggleGroupItem className="p-4" value="user">Users</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SearchResultCard result={result} />
            </motion.div>
          ))}
        </div>
        
        {filteredResults.length === 0 && query && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No results found for "{query}"</h3>
            <p className="text-muted-foreground mt-2">Try a different search or filter.</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}