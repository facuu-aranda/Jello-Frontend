import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskModal } from './task-modal';
import { TaskDetails } from '@/types';
import { apiClient } from '@/lib/api';

jest.mock('./subtask-list', () => ({ SubtaskList: () => <div data-testid="mock-subtask-list" /> }));
jest.mock('./comment-section', () => ({ CommentSection: ({ onCommentAdd }: any) => <button data-testid="mock-comment-section" onClick={() => onCommentAdd(new FormData())}>Add Comment</button> }));
jest.mock('./attachment-list', () => ({ AttachmentList: () => <div data-testid="mock-attachment-list" /> }));

jest.mock('@/lib/api', () => ({
  apiClient: {
    post: jest.fn(),
    del: jest.fn(), // Añadimos 'del' por si se usa en el futuro
  },
}));
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockTaskDetails: TaskDetails = {
  id: 'task-001',
  title: 'Refactor Authentication Service',
  description: 'The current service is slow and needs an update.',
  status: 'review',
  priority: 'critical',
  labels: [{ id: 'lbl-1', name: 'Refactor', color: '#8b5cf6' }],
  assignees: [],
  dueDate: '2026-01-15',
  projectId: 'proj-123',
  subtasks: [], comments: [], attachments: []
};

describe('Componente TaskModal', () => {
  const mockOnClose = jest.fn();
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no debería renderizarse si isOpen es false', () => {
    render(<TaskModal isOpen={false} onClose={mockOnClose} task={mockTaskDetails} />);
    expect(screen.queryByText('Refactor Authentication Service')).not.toBeInTheDocument();
  });

  it('debería mostrar todos los detalles de la tarea cuando está abierto', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} task={mockTaskDetails} />);

    expect(screen.getByText('Refactor Authentication Service')).toBeInTheDocument();
    expect(screen.getByText('The current service is slow and needs an update.')).toBeInTheDocument();
    expect(screen.getByText('Refactor')).toBeInTheDocument();

    const expectedDate = new Date(mockTaskDetails.dueDate!).toLocaleDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it('debería cambiar a modo de edición al hacer clic en el botón "Edit"', async () => {
    const user = userEvent.setup();
    render(<TaskModal isOpen={true} onClose={mockOnClose} task={mockTaskDetails} />);
    
    await user.click(screen.getByRole('button', { name: /Edit/i }));

    const titleInput = screen.getByLabelText('Task Title');
    expect(titleInput).toHaveValue('Refactor Authentication Service');

    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('debería llamar a onDataChange después de añadir un comentario', async () => {
    const user = userEvent.setup();
    mockedApiClient.post.mockResolvedValue({});
    
    render(<TaskModal isOpen={true} onClose={mockOnClose} task={mockTaskDetails} onDataChange={mockOnDataChange} />);

    await user.click(screen.getByTestId('mock-comment-section'));

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalledTimes(1);
    });
  });
});