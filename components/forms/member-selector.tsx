"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock de miembros del equipo. En una app real, esto vendría de una API.
const mockTeamMembers = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", avatar: "/sarah-avatar.png" },
  { id: "2", name: "Mike Chen", email: "mike@example.com", avatar: "/mike-avatar.jpg" },
  { id: "3", name: "Alex Rivera", email: "alex@example.com", avatar: "/diverse-user-avatars.png" },
  { id: "4", name: "Emma Davis", email: "emma@example.com", avatar: "/diverse-user-avatars.png" },
];

interface MemberSelectorProps {
  selectedMembers: string[];
  onSelectMembers: (selectedIds: string[]) => void;
}

export function MemberSelector({ selectedMembers, onSelectMembers }: MemberSelectorProps) {

  const handleToggleMember = (memberId: string) => {
    const isSelected = selectedMembers.includes(memberId);
    let newSelection: string[];

    if (isSelected) {
      // Si ya está seleccionado, lo quitamos
      newSelection = selectedMembers.filter((id) => id !== memberId);
    } else {
      // Si no está seleccionado, lo añadimos
      newSelection = [...selectedMembers, memberId];
    }

    // Informamos al componente padre del cambio
    onSelectMembers(newSelection);
  };

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
      {mockTeamMembers.map((member) => (
        <motion.div
          key={member.id}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
            selectedMembers.includes(member.id)
              ? "border-primary bg-primary/10"
              : "border-border hover:bg-muted"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleToggleMember(member.id)}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
            <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
          </div>
          {selectedMembers.includes(member.id) && (
            <Badge variant="secondary" className="text-xs">
              Selected
            </Badge>
          )}
        </motion.div>
      ))}
    </div>
  );
}