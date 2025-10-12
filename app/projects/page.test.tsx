import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectsPage from './page';
import { useApi } from '@/hooks/useApi';
import { ProjectSummary } from '@/types';

jest.mock('@/hooks/useApi');

// --- CORRECCIÓN CLAVE ---
// Simulamos el AppLayout completo. Le decimos que simplemente renderice a sus hijos.
// Esto evita la necesidad de los contextos de Tema y Autenticación.
jest.mock('@/components/layout/app-layout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mantenemos los otros mocks como estaban
jest.mock('@/components/modals/create-project-modal', () => ({ CreateProjectModal: () => <div data-testid="mock-create-modal" /> }));
jest.mock('@/components/modals/edit-project-modal', () => ({ EditProjectModal: () => <div data-testid="mock-edit-modal" /> }));
jest.mock('@/components/project-card', () => ({
    ProjectCard: ({ project }: { project: ProjectSummary }) => <div data-testid="project-card">{project.name}</div>,
}));

const useApiMock = useApi as jest.Mock;

describe('Página de Proyectos', () => {
  const mockRefetch = jest.fn();

  beforeEach(() => { jest.clearAllMocks(); });

  it('debería mostrar los esqueletos de carga', () => {
    useApiMock.mockReturnValue({ data: null, isLoading: true, refetch: mockRefetch });
    render(<ProjectsPage />);
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('debería mostrar la lista de proyectos', () => {
    const mockProjects: Partial<ProjectSummary>[] = [{ id: '1', name: 'Project Alpha' }, { id: '2', name: 'Project Beta' }];
    useApiMock.mockReturnValue({ data: mockProjects, isLoading: false, refetch: mockRefetch });
    render(<ProjectsPage />);
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
  });

  it('debería llamar a refetch al escribir en la búsqueda', async () => {
    const user = userEvent.setup();
    useApiMock.mockReturnValue({ data: [], isLoading: false, refetch: mockRefetch });
    render(<ProjectsPage />);
    await user.type(screen.getByPlaceholderText(/Search projects/i), 'testing');
    await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
    });
  });
});