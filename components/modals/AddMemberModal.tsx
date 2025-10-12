"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Send, UserCheck } from "lucide-react"
import { apiClient } from "@/lib/api"
import { SearchResult } from "@/types"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/useDebounce" 
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onInviteSent: () => void 
  currentMembers: string[] 
}

export function AddMemberModal({ isOpen, onClose, projectId, onInviteSent, currentMembers }: AddMemberModalProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [invitedUserIds, setInvitedUserIds] = React.useState<Set<string>>(new Set());

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
        const filteredData = data.filter(user => !currentMembers.includes(user.id));
        setResults(filteredData);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if(isOpen) {
      fetchResults();
    }
  }, [debouncedQuery, currentMembers, isOpen]);

  const handleInvite = async (userId: string) => {
    toast.info("Sending invitation...");
    try {
      await apiClient.post(`/projects/${projectId}/invitations`, { userIdToInvite: userId });
      toast.success("Invitation sent successfully!");
      setInvitedUserIds(prev => new Set(prev).add(userId)); 
      onInviteSent(); 
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setInvitedUserIds(new Set());
    onClose();
  }

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="max-w-lg">
        <ModalHeader>
          <ModalTitle>Add Members to Project</ModalTitle>
          <ModalDescription>Search for users to invite and add them to the project.</ModalDescription>
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
              const isInvited = invitedUserIds.has(user.id);
              return (
                <motion.div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleInvite(user.id)}
                    disabled={isInvited}
                  >
                    {isInvited ? <UserCheck className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    {isInvited ? 'Invited' : 'Invite'}
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
      </ModalContent>
    </Modal>
  );
}