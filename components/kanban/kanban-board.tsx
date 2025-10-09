"use client"

import * as React from 'react';
// ✨ CORRECCIÓN: Importamos el tipo DropResult
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './kanban-column';
import { ProjectDetails, TaskSummary } from '@/types';

interface KanbanBoardProps {
  project: ProjectDetails;
  // ✨ CORRECCIÓN: La prop ahora espera el objeto 'result' completo
  onTaskStatusChange: (result: DropResult) => void;
  onTaskClick?: (task: TaskSummary) => void;
  onAddTask?: (columnId: string) => void;
}

export function KanbanBoard({ project, onTaskStatusChange, onTaskClick, onAddTask }: KanbanBoardProps) {

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // Si no hay destino, o si se soltó en el mismo lugar, no hacemos nada.
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    // ✨ CORRECCIÓN: Pasamos el objeto 'result' completo al handler de la página.
    onTaskStatusChange(result);
  };

  const handleTaskClick = (task: TaskSummary) => {
    onTaskClick?.(task);
  }

  const handleAddTask = (columnId: string) => {
    onAddTask?.(columnId);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 p-4 overflow-x-auto h-full items-stretch">
        <KanbanColumn id="todo" title="To Do" tasks={project.tasksByStatus.todo} onAddTask={() => handleAddTask('todo')} onTaskClick={handleTaskClick} />
        <KanbanColumn id="in-progress" title="In Progress" tasks={project.tasksByStatus['in-progress']} onAddTask={() => handleAddTask('in-progress')} onTaskClick={handleTaskClick} />
        <KanbanColumn id="review" title="In Review" tasks={project.tasksByStatus.review} onAddTask={() => handleAddTask('review')} onTaskClick={handleTaskClick} />
        <KanbanColumn id="done" title="Done" tasks={project.tasksByStatus.done} onAddTask={() => handleAddTask('done')} onTaskClick={handleTaskClick} />
      </div>
    </DragDropContext>
  );
}
