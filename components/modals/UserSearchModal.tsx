// components/modals/UserSearchModal.tsx
"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, UserCheck, Plus } from "lucide-react"
import { apiClient } from "@/lib/api"
import { SearchResult, UserSummary } from "@/types"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/useDebounce" 
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUsers: (users: UserSummary[]) => void
  excludedUserIds?: string[] 
}

export function UserSearchModal({ isOpen, onClose, onSelectUsers, excludedUserIds = [] }: UserSearchModalProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<UserSummary[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedUsers, setSelectedUsers] = React.useState<UserSummary[]>([]);

  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await apiClient.get<SearchResult[]>(`/search?q=${debouncedQuery}&type=user`);
        const newResults = data
          .filter(user => !excludedUserIds.includes(user.id)) // Excluir usuarios ya en el proyecto/lista
          .map(user => ({ // Mapear a UserSummary
            id: user.id,
            name: user.name,
            avatarUrl: user.avatar
          }));
        setResults(newResults);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if(isOpen) {
      fetchResults();
    }
  }, [debouncedQuery, excludedUserIds, isOpen]);

  const handleToggleUser = (user: UserSummary) => {
    setSelectedUsers(prev => 
      prev.some(u => u.id === user.id) 
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    )
  }

  const handleConfirmSelection = () => {
    onSelectUsers(selectedUsers);
    handleClose();
  }

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setSelectedUsers([]);
    onClose();
  }

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="max-w-lg">
        <ModalHeader>
          <ModalTitle>Add Members</ModalTitle>
          <ModalDescription>Search for users to add to the project.</ModalDescription>
        </ModalHeader>
        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {isLoading && <Skeleton className="h-16 w-full" />}
            {!isLoading && results.map((user) => {
              const isSelected = selectedUsers.some(u => u.id === user.id);
              return (
                <motion.div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleToggleUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                  >
                    {isSelected ? <UserCheck className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                </motion.div>
              );
            })}
            {!isLoading && debouncedQuery.length > 1 && results.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <p>No users found matching "{debouncedQuery}".</p>
              </div>
            )}
          </div>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmSelection} disabled={selectedUsers.length === 0}>
            Add {selectedUsers.length} member(s)
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}