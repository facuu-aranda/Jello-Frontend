import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './login-form';
import { useAuth } from '../contexts/auth-context';

// Simulamos ("mockeamos") el hook useAuth. Esto nos permite controlar
// lo que devuelve y espiar sus funciones, aislando nuestro componente.
jest.mock('../contexts/auth-context', () => ({
  // Mantenemos las exportaciones originales del módulo que no queremos cambiar
  ...jest.requireActual('../contexts/auth-context'),
  // Pero sobrescribimos el hook useAuth con una función simulada de Jest
  useAuth: jest.fn(),
}));

// Creamos un alias tipado para nuestro mock para facilitar su uso
const useAuthMock = useAuth as jest.Mock;

describe('Componente LoginForm', () => {
  // Creamos una función "espía" para la función de login
  const mockLogin = jest.fn();

  beforeEach(() => {
    // Antes de cada prueba, reseteamos todos los mocks
    jest.clearAllMocks();
    // Y definimos el valor que devolverá nuestro hook simulado
    useAuthMock.mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });
  });

  it('debería renderizar el formulario con campos de email, contraseña y botón', () => {
    render(<LoginForm />);

    // Buscamos los elementos como lo haría un usuario, por su etiqueta de accesibilidad
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('debería permitir al usuario escribir en los campos de email y contraseña', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulamos la escritura del usuario en los campos
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Verificamos que los campos tienen el valor correcto
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('debería llamar a la función de login con los datos correctos al hacer clic en el botón', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Arrange: Preparamos el escenario llenando el formulario
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Act: El usuario hace clic en el botón
    await user.click(submitButton);

    // Assert: Verificamos que nuestra función de login simulada fue llamada correctamente
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false, // El checkbox no fue presionado
    });
  });
});