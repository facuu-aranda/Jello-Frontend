import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './register-form';
import { useAuth } from '../contexts/auth-context';

jest.mock('../contexts/auth-context', () => ({
  ...jest.requireActual('../contexts/auth-context'),
  useAuth: jest.fn(),
}));

const useAuthMock = useAuth as jest.Mock;

describe('Componente RegisterForm', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthMock.mockReturnValue({
      register: mockRegister,
      isLoading: false,
    });
  });

  it('debería renderizar todos los campos de registro y el botón', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to the/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument();
  });

  it('debería permitir al usuario rellenar el formulario', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    const firstNameInput = screen.getByLabelText(/First name/i);
    const lastNameInput = screen.getByLabelText(/Last name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const termsCheckbox = screen.getByLabelText(/I agree to the/i);

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(passwordInput, 'securePassword123');
    await user.click(termsCheckbox);

    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(passwordInput).toHaveValue('securePassword123');
    expect(termsCheckbox).toBeChecked();
  });

  it('debería llamar a la función de registro con los datos correctos al enviar el formulario', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.type(screen.getByLabelText(/First name/i), 'Jane');
    await user.type(screen.getByLabelText(/Last name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'jane.doe@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'aVerySecurePassword');
    await user.click(screen.getByLabelText(/I agree to the/i));
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'aVerySecurePassword',
    });
  });

  it('no debería llamar a la función de registro si no se aceptan los términos', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.type(screen.getByLabelText(/First name/i), 'Jane');
    await user.type(screen.getByLabelText(/Last name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'jane.doe@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'aVerySecurePassword');
    await user.click(screen.getByRole('button', { name: /Create account/i }));
    expect(mockRegister).not.toHaveBeenCalled();
  });
});