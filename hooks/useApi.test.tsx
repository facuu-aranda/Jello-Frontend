import { renderHook, waitFor, act } from '@testing-library/react'; // Importamos 'act'
import { useApi } from './useApi';
import { apiClient } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('Hook useApi', () => {
  beforeEach(() => {
    mockedApiClient.get.mockClear();
  });

  it('debería empezar en estado de carga y luego devolver los datos correctamente', async () => {
    const mockData = [{ id: '1', name: 'Test Project' }];
    mockedApiClient.get.mockResolvedValue(mockData);
    const { result } = renderHook(() => useApi('/test-endpoint'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });
  });

  it('debería manejar los errores de la API correctamente', async () => {
    const mockError = new Error('Network Error');
    mockedApiClient.get.mockRejectedValue(mockError);
    const { result } = renderHook(() => useApi('/error-endpoint'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      // --- CORRECCIÓN: Comparamos el mensaje del error, no el objeto completo ---
      expect(result.current.error).toBe(mockError.message);
    });
  });

  it('debería volver a obtener los datos cuando se llama a refetch', async () => {
    mockedApiClient.get
      .mockResolvedValueOnce([{ id: '1', name: 'Initial' }])
      .mockResolvedValueOnce([{ id: '2', name: 'Refreshed' }]);

    const { result } = renderHook(() => useApi('/refetch-endpoint'));

    await waitFor(() => expect(result.current.data).not.toBeNull());
    expect(result.current.data).toEqual([{ id: '1', name: 'Initial' }]);

    // --- CORRECCIÓN: Envolvemos la actualización de estado en act() ---
    await act(async () => {
      result.current.refetch();
    });

    expect(result.current.data).toEqual([{ id: '2', name: 'Refreshed' }]);
    expect(mockedApiClient.get).toHaveBeenCalledTimes(2);
  });
});