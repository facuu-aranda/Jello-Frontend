"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { UserSummary } from '@/types'
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AssigneeSelectorProps {
  projectMembers: UserSummary[];
  selectedAssignees: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function AssigneeSelector({ projectMembers, selectedAssignees, onSelectionChange }: AssigneeSelectorProps) {
  
  // Usamos useCallback para asegurar que la función no se recree en cada render,
  // lo cual es una de las causas comunes de los bucles infinitos.
  const handleToggleMember = React.useCallback((memberId: string) => {
    const isSelected = selectedAssignees.includes(memberId);
    if (isSelected) {
      onSelectionChange(selectedAssignees.filter(id => id !== memberId));
    } else {
      onSelectionChange([...selectedAssignees, memberId]);
    }
  }, [selectedAssignees, onSelectionChange]); // Dependencias de la función

  return (
    <ScrollArea className="h-fit">
      <div className="space-y-2 pr-4">
        {projectMembers.map((member) => (
          <motion.div
            key={member.id}
            onClick={() => handleToggleMember(member.id)}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg border-1 cursor-pointer transition-all relative",
              selectedAssignees.includes(member.id)
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-muted" // Borde visible en estado no seleccionado
            )}
            whileHover={{ scale: 1.02 }}
          >
            {selectedAssignees.includes(member.id) && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                // Centrado del check
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 p-0.5" />
              </motion.div>
            )}
            <Avatar className="w-8 h-8">
              <AvatarImage src={member.avatarUrl || ''} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">{member.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
}