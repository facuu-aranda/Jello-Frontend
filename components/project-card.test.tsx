import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectCard } from './project-card';
import { ProjectSummary } from '../types';

const mockProject: ProjectSummary = {
  id: 'proj-123',
  name: 'Website Redesign',
  description: 'A complete overhaul of the company website.',
  color: 'bg-primary',
  progress: 75,
  members: [
    { id: 'user-1', name: 'Alice', avatarUrl: '/avatar1.png' },
    { id: 'user-2', name: 'Bob', avatarUrl: '/avatar2.png' },
  ],
  isOwner: true,
  dueDate: '2025-12-31',
  totalTasks: 20,
  completedTasks: 15,
};

jest.mock('next/link', () => {
    return ({ children, ...props }: { children: React.ReactNode;[key: string]: any }) => {
        return <div {...props}>{children}</div>;
    }
});

describe('Componente ProjectCard', () => {
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar todos los datos del proyecto correctamente', () => {
    render(<ProjectCard project={mockProject} onEdit={mockOnEdit} />);

    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('A complete overhaul of the company website.')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('15/20')).toBeInTheDocument();
    
    // Verificamos las iniciales de los miembros en el fallback del Avatar
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('debería mostrar el badge de "Owner" si isOwner es true', () => {
    render(<ProjectCard project={mockProject} onEdit={mockOnEdit} />);
    expect(screen.getByText('Owner')).toBeInTheDocument();
  });

  it('NO debería mostrar el badge de "Owner" si isOwner es false', () => {
    const nonOwnerProject = { ...mockProject, isOwner: false };
    render(<ProjectCard project={nonOwnerProject} onEdit={mockOnEdit} />);
    expect(screen.queryByText('Owner')).not.toBeInTheDocument();
  });

  it('debería llamar a la función onEdit al hacer clic en el botón de editar', async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={mockProject} onEdit={mockOnEdit} />);

    // CORRECCIÓN: Buscamos el botón por su aria-label, que ahora está directamente en el botón.
    const editButton = screen.getByRole('button', { name: /edit project/i });
    
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
});