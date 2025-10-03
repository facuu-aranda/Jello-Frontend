"use client"

import * as React from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './kanban-column';
import { ProjectDetails, TaskSummary } from '@/types';

interface KanbanBoardProps {
  project: ProjectDetails;
  onTaskStatusChange: (taskId: string, newStatus: string) => void;
  onTaskClick?: (task: TaskSummary) => void;
  onAddTask?: (columnId: string) => void;
}

export function KanbanBoard({ project, onTaskStatusChange, onTaskClick, onAddTask }: KanbanBoardProps) {

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    onTaskStatusChange(draggableId, destination.droppableId);
  };

  const handleTaskClick = (task: TaskSummary) => {
    onTaskClick?.(task);
  }

  const handleAddTask = (columnId: string) => {
    onAddTask?.(columnId);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 p-4 overflow-x-auto h-full">
        <KanbanColumn id="todo" title="To Do" tasks={project.tasksByStatus.todo} onAddTask={() => handleAddTask('todo')} onTaskClick={handleTaskClick} />
        <KanbanColumn id="in-progress" title="In Progress" tasks={project.tasksByStatus['in-progress']} onAddTask={() => handleAddTask('in-progress')} onTaskClick={handleTaskClick} />
        <KanbanColumn id="review" title="In Review" tasks={project.tasksByStatus.review} onAddTask={() => handleAddTask('review')} onTaskClick={handleTaskClick} />
        <KanbanColumn id="done" title="Done" tasks={project.tasksByStatus.done} onAddTask={() => handleAddTask('done')} onTaskClick={handleTaskClick} />
      </div>
    </DragDropContext>
  );
}