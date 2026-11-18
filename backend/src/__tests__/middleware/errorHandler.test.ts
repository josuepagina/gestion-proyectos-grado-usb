import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middleware/errorHandler';

describe('Manejo de Errores', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    process.env.NODE_ENV = 'test';
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  test('debe manejar errores de validación con código 400', () => {
    const error = new Error('Validation error');
    error.name = 'ValidationError';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Validation error' });
  });

  test('debe manejar errores no autorizados con código 401', () => {
    const error = new Error('Unauthorized');
    error.name = 'UnauthorizedError';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  test('debe manejar errores genéricos con código 500 en desarrollo', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Database connection failed');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database connection failed' });
  });

  test('debe ocultar detalles del error en producción', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Database connection failed');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

