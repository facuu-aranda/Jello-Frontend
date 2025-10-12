"use client"

import * as React from 'react';
// CORRECTION: Import the necessary components and types from the library
import {
  Draggable,
  Droppable,
  type DroppableProvided,
  type DroppableStateSnapshot,
  type DraggableProvided
} from '@hello-pangea/dnd';
import { TaskSummary } from '@/types';
import { TaskCard } from '@/components/tasks/task-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: TaskSummary[];
  onAddTask: () => void;
  onTaskClick: (task: TaskSummary) => void;
}

const statusColorMap: { [key: string]: string } = {
  todo: 'bg-blue-500',
  'in-progress': 'bg-yellow-500',
  review: 'bg-purple-500',
  done: 'bg-green-500',
};

export function KanbanColumn({ id, title, tasks, onAddTask, onTaskClick }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-full sm:w-80 md:w-96 bg-card/50 rounded-2xl flex-shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full", statusColorMap[id] || 'bg-gray-400')} />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <span className="text-sm font-medium text-muted-foreground">{tasks.length}</span>
      </div>

      <Droppable droppableId={id}>
        {/* CORRECTION: Add explicit types for the render prop arguments */}
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
    "p-4 space-y-3 transition-colors duration-200 min-h-[300px] flex-grow", // <-- LÍNEA MODIFICADA
    snapshot.isDraggingOver ? 'bg-primary/10' : ''
            )}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {/* CORRECTION: Add explicit type for the render prop argument */}
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onTaskClick(task)}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-4 pt-0">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={onAddTask}>
          <Plus className="w-4 h-4" />
          Add new task
        </Button>
      </div>
    </div>
  );
}