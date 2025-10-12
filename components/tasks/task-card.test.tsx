import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaskCard } from './task-card';
import { TaskSummary } from '@/types';

const mockTask: TaskSummary = {
  id: 'task-001',
  title: 'Implement User Authentication',
  status: 'in-progress',
  priority: 'high',
  labels: [
    { _id: 'lbl-1', name: 'Backend', color: '#14b8a6' },
    { _id: 'lbl-2', name: 'Feature', color: '#00a3e0' },
  ],
  assignees: [
    { id: 'user-1', name: 'Alice', avatarUrl: '/avatars/alice.png' },
    { id: 'user-2', name: 'Bob', avatarUrl: '/avatars/bob.png' },
  ],
  dueDate: '2025-10-26',
  subtasks: { total: 4, completed: 1 },
  commentCount: 5,
  attachmentCount: 2,
  projectId: 'proj-123',
};

describe('Componente TaskCard', () => {
  it('debería renderizar el título y las etiquetas de la tarea', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Implement User Authentication')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Feature')).toBeInTheDocument();
  });

  it('debería mostrar los contadores de subtareas, comentarios y adjuntos', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('1/4')).toBeInTheDocument();
    
    // CORRECCIÓN: Hacemos el selector más específico.
    // Buscamos el número '5' que sea un hermano del icono de comentarios.
    const commentCount = screen.getByText('5');
    expect(commentCount.previousSibling?.nodeName).toBe('svg');

    const attachmentCount = screen.getByText('2');
    expect(attachmentCount.previousSibling?.nodeName).toBe('svg');
  });

  it('debería renderizar las iniciales de los usuarios asignados', () => {
    render(<TaskCard task={mockTask} />);
    // CORRECCIÓN: En JSDOM, la imagen no carga, por lo que Radix renderiza el AvatarFallback.
    // Buscamos las iniciales, lo cual es más robusto.
    expect(screen.getByText('A')).toBeInTheDocument(); // Alice
    expect(screen.getByText('B')).toBeInTheDocument(); // Bob
  });

  it('debería mostrar la fecha de vencimiento en un formato localizado', () => {
    render(<TaskCard task={mockTask} />);
    // CORRECCIÓN: Comparamos con el resultado de toLocaleDateString() para que el test
    // no dependa del formato específico del navegador o del sistema operativo.
    const expectedDate = new Date(mockTask.dueDate!).toLocaleDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});