import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateProjectModal } from './create-project-modal';

// --- CORRECCIÓN: Añadimos type="button" a los botones simulados ---
jest.mock('@/components/forms/member-selector', () => ({
  MemberSelector: ({ onSelectMembers }: { onSelectMembers: (ids: string[]) => void }) => (
    <button type="button" data-testid="mock-member-selector" onClick={() => onSelectMembers(['user-123'])}>
      Select Members
    </button>
  ),
}));

jest.mock('@/components/forms/image-upload-field', () => ({
    ImageUploadField: ({ onChange }: { onChange: (file: File | null) => void }) => {
        const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
        return <button type="button" data-testid="mock-image-upload" onClick={() => onChange(mockFile)} />;
    }
}));


describe('Componente CreateProjectModal', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no debería renderizarse si isOpen es false', () => {
    render(<CreateProjectModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
  });

  it('debería renderizar el formulario completo cuando isOpen es true', () => {
    render(<CreateProjectModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Create New Project')).toBeInTheDocument();
    expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Project/i })).toBeInTheDocument();
  });

  it('debería llamar a onSubmit con los datos correctos del formulario', async () => {
    const user = userEvent.setup();
    render(<CreateProjectModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText('Project Name'), 'My New Awesome Project');
    await user.type(screen.getByLabelText('Description'), 'This is a test description.');
    
    await user.click(screen.getByTestId('mock-member-selector'));
    const imageUploads = screen.getAllByTestId('mock-image-upload');
    await user.click(imageUploads[0]);
    await user.click(imageUploads[1]);

    // Solo el botón de tipo "submit" debería enviar el formulario
    await user.click(screen.getByRole('button', { name: /Create Project/i }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1); // Ahora solo debería llamarse una vez
    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'My New Awesome Project',
      description: 'This is a test description.',
      members: ['user-123'],
      projectImage: expect.any(File),
      bannerImage: expect.any(File),
    }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});