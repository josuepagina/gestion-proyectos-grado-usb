// Configuración global para los tests
import dotenv from 'dotenv';

// Cargar variables de entorno para tests
dotenv.config({ path: '.env.test' });

// Configurar variables de entorno por defecto para tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-jest-testing-only';
process.env.NODE_ENV = 'test';

