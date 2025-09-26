"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SearchResultCard } from "@/components/search/SearchResultCard"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
      <div className="max-w-4xl mx-auto space-y-8 p-6">
        {/* ... (Header y filtros se mantienen igual) ... */}
        
        {isLoading ? (
          <div className="text-center py-16"><Spinner size="lg" /></div>
        ) : (
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
        
        {results.length === 0 && query && !isLoading && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No results found for "{query}"</h3>
            <p className="text-muted-foreground mt-2">Try a different search or filter.</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
