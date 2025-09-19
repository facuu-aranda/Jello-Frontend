"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SearchResultCard } from "@/components/search/SearchResultCard"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useDebounce } from "@/hooks/useDebounce"
import { api } from "@/lib/api/client"
import { useAuth } from "@/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchResult } from "@/components/search/DetailModal"

export default function SearchPage() {
  const { token } = useAuth();
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300); // 300ms de espera

  const [typeFilter, setTypeFilter] = React.useState("all")
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim() || !token) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await api.get(`/search?q=${debouncedQuery}`, token);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setResults([]); // Limpiar resultados en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, token]);

  const filteredResults = results.filter(item => {
    return typeFilter === 'all' || item.type === typeFilter;
  });

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

        {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
            </div>
        ) : (
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
        )}

        {filteredResults.length === 0 && debouncedQuery && !isLoading && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No results found for "{debouncedQuery}"</h3>
            <p className="text-muted-foreground mt-2">Try a different search or filter.</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}