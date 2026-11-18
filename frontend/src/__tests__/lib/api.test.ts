import api from '../../lib/api';

describe('Cliente API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Limpiar headers
    delete api.defaults.headers.common['Authorization'];
  });

  test('debe configurar baseURL correctamente', () => {
    expect(api.defaults.baseURL).toBe('/api');
  });

  test('debe configurar Content-Type como application/json', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  test('debe tener configuración de axios correcta', () => {
    expect(api.defaults).toBeDefined();
    expect(api.defaults.baseURL).toBe('/api');
  });
});

