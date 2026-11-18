import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth';
import { pool } from '../../db/connection';

// Mock de la conexión a la base de datos
jest.mock('../../db/connection', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Middleware de Autenticación', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    test('debe retornar error 401 si no se proporciona token', async () => {
      await authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debe retornar error 401 si el token es inválido', async () => {
      mockRequest.headers = {
        authorization: 'Bearer token-invalido',
      };

      await authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debe retornar error 401 si el usuario no existe en la base de datos', async () => {
      const token = jwt.sign(
        { id: 'user-id', email: 'test@test.com', rol: 'estudiante' },
        process.env.JWT_SECRET!
      );

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      await authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debe retornar error 401 si el usuario está inactivo', async () => {
      const token = jwt.sign(
        { id: 'user-id', email: 'test@test.com', rol: 'estudiante' },
        process.env.JWT_SECRET!
      );

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 'user-id', email: 'test@test.com', rol: 'estudiante', estado: 'inactivo' }],
      });

      await authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User is inactive' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debe autenticar correctamente con token válido y usuario activo', async () => {
      const token = jwt.sign(
        { id: 'user-id', email: 'test@test.com', rol: 'estudiante' },
        process.env.JWT_SECRET!
      );

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 'user-id', email: 'test@test.com', rol: 'estudiante', estado: 'activo' }],
      });

      await authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockRequest.user).toEqual({
        id: 'user-id',
        email: 'test@test.com',
        rol: 'estudiante',
      });
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    test('debe retornar error 401 si no hay usuario autenticado', () => {
      const authorizeMiddleware = authorize('administrador');
      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Unauthorized - No user in request',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debe retornar error 403 si el rol del usuario no está autorizado', () => {
      mockRequest.user = {
        id: 'user-id',
        email: 'test@test.com',
        rol: 'estudiante',
        es_tutor: false,
        es_revisor: false,
      };

      const authorizeMiddleware = authorize('administrador');
      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Forbidden - User role 'estudiante' not allowed. Required: administrador",
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debe permitir acceso si el rol del usuario está autorizado', () => {
      mockRequest.user = {
        id: 'user-id',
        email: 'admin@test.com',
        rol: 'administrador',
        es_tutor: false,
        es_revisor: false,
      };

      const authorizeMiddleware = authorize('administrador');
      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    test('debe permitir acceso con múltiples roles autorizados', () => {
      mockRequest.user = {
        id: 'user-id',
        email: 'tutor@test.com',
        rol: 'tutor',
        es_tutor: true,
        es_revisor: false,
      };

      const authorizeMiddleware = authorize('tutor', 'revisor');
      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});

