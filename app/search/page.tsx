// app/search/page.tsx

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SearchResultCard } from "@/components/search/SearchResultCard"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api"
import { SearchResult } from "@/types"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export default function SearchPage() {
  const [query, setQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<"all" | "project" | "user">("all")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const typeParam = typeFilter === 'all' ? '' : typeFilter;
        const data = await apiClient.get<SearchResult[]>(`/search?q=${query}&type=${typeParam}`);
        setResults(data);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, typeFilter]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Buscar</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Encuentra proyectos, usuarios y más.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-11"
                autoFocus
              />
            </div>
            <Tabs value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="project">Projects</TabsTrigger>
                <TabsTrigger value="user">Users</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Sección de Resultados */}
        {isLoading ? (
          <div className="text-center py-24"><Spinner size="lg" /></div>
        ) : (
          <>
            {!query && (
              <div className="text-center py-24 text-muted-foreground">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-bold">Search Jello</h2>
                <p>Find what you're looking for by typing in the search bar above.</p>
              </div>
            )}

            {query && results.length === 0 && (
              <div className="text-center py-24 text-muted-foreground">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-bold">No results found for "{query}"</h2>
                <p>Try searching for something else or adjust your filters.</p>
              </div>
            )}
            
            {results.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                {results.map((result, index) => (
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
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}