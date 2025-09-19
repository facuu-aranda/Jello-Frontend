import { AuthContextType } from '@/contexts/AuthContext';

const BASE_URL = 'https://jello-backend.onrender.com/api';

// Función auxiliar para manejar las respuestas de la API
async function handleResponse(response: Response) {
  if (!response.ok) {
    // Si el token es inválido o ha expirado, el servidor debería devolver 401
    if (response.status === 401) {
      // Disparamos un evento personalizado para que el AuthContext pueda reaccionar
      window.dispatchEvent(new Event('auth-error'));
    }
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  // Para respuestas vacías (como 204 No Content), devolvemos un objeto vacío
  return response.status === 204 ? {} : response.json();
}

// Creamos nuestro objeto `api` con los métodos que necesitamos
export const api = {
  get: async (endpoint: string, token: string | null) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, body: any, token?: string | null) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint: string, body: any, token: string | null) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string, token: string | null) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // DELETE puede no devolver un body, así que lo manejamos diferente
    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new Event('auth-error'));
      }
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.status === 204 ? {} : response.json();
  },

  upload: async (file: File, token: string | null) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response); 
  },
};