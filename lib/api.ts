// lib/api.ts
import { UserProfile } from '@/types';

const API_BASE_URL = 'https://jello-backend.onrender.com/api';

// Interfaz para el error de la API
interface ApiErrorData {
  error: string;
  message?: string; // Para mensajes más descriptivos
}


// Función auxiliar para manejar las respuestas de la API
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return {} as T;
  }
  
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    let errorData: ApiErrorData = { error: `Error ${response.status}: ${response.statusText}` };
    if (isJson) {
      // Intentamos parsear el error del cuerpo JSON
      const jsonError = await response.json().catch(() => null);
      if(jsonError && jsonError.error) {
        errorData = jsonError;
      }
    }

    const error = new Error(errorData.error) as any;
    error.response = {
        status: response.status,
        data: errorData
    };
    throw error;
  }

  // Para el caso de registro exitoso (201), el backend solo envía un mensaje.
  if (response.status === 201 && isJson) {
      return response.json() as Promise<T>;
  }

  // Para respuestas OK que no son JSON, devolvemos un objeto vacío.
  if (!isJson) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}


// Función para obtener el token de almacenamiento
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Prioriza sessionStorage para la sesión actual
  return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
}

// Objeto que encapsula todas nuestras llamadas a la API
export const apiClient = {
  // El método login ahora puede lanzar un error 403 que será capturado en el contexto
  login: async (data: any): Promise<{ token: string; user: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // handleResponse se encargará de lanzar el error si no es 200 OK
    return handleResponse<{ token: string; user: UserProfile }>(response);
  },

  // El método register ahora espera un mensaje, no un token.
  register: async (data: any): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(response);
  },
  
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