import { UserProfile } from '@/types';

const API_BASE_URL = 'https://jello-backend.onrender.com/api';

// Función auxiliar para manejar las respuestas de la API
async function handleResponse<T>(response: Response): Promise<T> {
  // Maneja correctamente respuestas sin contenido (ej. DELETE exitoso)
  if (response.status === 204) {
    return {} as T;
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error inesperado', details: {} }));
    throw new Error(errorData.error || 'Ocurrió un error en la solicitud');
  }

  // Para respuestas con contenido (ej. GET, POST, PUT)
  return response.json() as Promise<T>;
}

// Función para obtener el token de localStorage
function getAuthToken(): string | null {
  // Asegura que solo se ejecute en el cliente
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

// Objeto que encapsula todas nuestras llamadas a la API
export const apiClient = {
  // --- Métodos de Autenticación ---
  login: async (data: any): Promise<{ token: string; user: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ token: string; user: UserProfile }>(response);
  },

  register: async (data: any): Promise<{ token: string; user: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ token: string; user: UserProfile }>(response);
  },
  
  // --- Métodos para Peticiones Autenticadas ---
  get: async <T>(endpoint: string): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const token = getAuthToken();
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = { 'Authorization': `Bearer ${token}` };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const token = getAuthToken();
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = { 'Authorization': `Bearer ${token}` };
     if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  del: async <T>(endpoint: string): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse<T>(response);
  },
};

