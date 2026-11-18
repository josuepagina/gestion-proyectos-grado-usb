import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

// Mock de axios
jest.mock('../../lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    defaults: {
      headers: {
        common: {} as Record<string, string>,
      },
    },
  },
}));

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Store de Autenticación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    useAuthStore.setState({ user: null, token: null });
  });

  describe('login', () => {
    test('debe iniciar sesión correctamente y guardar token', async () => {
      const mockUser = {
        id: 'user-id',
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: 'juan@example.com',
        rol: 'estudiante' as const,
      };

      const mockToken = 'mock-jwt-token';

      (api.post as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      await useAuthStore.getState().login('juan@example.com', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'juan@example.com',
        password: 'password123',
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      // Zustand puede usar su propio sistema de persistencia, verificamos el estado directamente
      expect(api.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
    });

    test('debe manejar error en login', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        useAuthStore.getState().login('juan@example.com', 'wrong-password')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    test('debe registrar usuario correctamente', async () => {
      const mockUser = {
        id: 'user-id',
        nombre: 'María',
        apellidos: 'González',
        email: 'maria@example.com',
        rol: 'estudiante' as const,
      };

      const mockToken = 'mock-jwt-token';

      (api.post as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      await useAuthStore.getState().register({
        nombre: 'María',
        apellidos: 'González',
        email: 'maria@example.com',
        password: 'password123',
        rol: 'estudiante',
      });

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        nombre: 'María',
        apellidos: 'González',
        email: 'maria@example.com',
        password: 'password123',
        rol: 'estudiante',
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
    });
  });

  describe('logout', () => {
    test('debe cerrar sesión y limpiar datos', () => {
      useAuthStore.setState({
        user: {
          id: 'user-id',
          nombre: 'Juan',
          apellidos: 'Pérez',
          email: 'juan@example.com',
          rol: 'estudiante',
        },
        token: 'mock-token',
      });

      // Configurar el header antes de logout
      api.defaults.headers.common['Authorization'] = 'Bearer mock-token';

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      // Verificamos que el header se haya eliminado
      expect(api.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('checkAuth', () => {
    test('debe verificar autenticación con token válido', async () => {
      const mockUser = {
        id: 'user-id',
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: 'juan@example.com',
        rol: 'estudiante' as const,
      };

      useAuthStore.setState({ token: 'mock-token' });

      (api.get as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      await useAuthStore.getState().checkAuth();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
    });

    test('debe limpiar datos si el token es inválido', async () => {
      useAuthStore.setState({ token: 'invalid-token' });
      api.defaults.headers.common['Authorization'] = 'Bearer invalid-token';

      (api.get as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      // Verificamos que el header se haya eliminado
      expect(api.defaults.headers.common['Authorization']).toBeUndefined();
    });

    test('no debe hacer nada si no hay token', async () => {
      useAuthStore.setState({ token: null });

      await useAuthStore.getState().checkAuth();

      expect(api.get).not.toHaveBeenCalled();
    });
  });
});

