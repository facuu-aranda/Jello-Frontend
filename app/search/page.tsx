"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SearchResultCard } from "@/components/search/SearchResultCard"

// Mock de resultados de búsqueda
const mockResults = [
  { type: 'user' as const, id: 'user-1', name: 'Sarah Chen', description: 'Product Manager @ Jello', avatar: '/sarah-avatar.png' },
  { type: 'project' as const, id: 'proj-1', name: 'Website Redesign', description: 'Complete overhaul of the company website with modern design.', avatar: '/placeholder.svg' },
  { type: 'user' as const, id: 'user-2', name: 'Mike Johnson', description: 'Lead Developer | React & Node.js Expert', avatar: '/mike-avatar.jpg' },
  { type: 'project' as const, id: 'proj-2', name: 'Mobile App Q3 Sprint', description: 'Native mobile application for iOS and Android platforms.', avatar: '/placeholder.svg' },
]

export default function SearchPage() {
  const [query, setQuery] = React.useState("")

  const filteredResults = mockResults.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Search</h1>
          <p className="text-muted-foreground">Find projects, tasks, and people across your workspace.</p>
        </motion.div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Type here to search..."
            className="pl-12 h-12 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
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
            <p className="text-muted-foreground mt-2">Try searching for something else.</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}