import { z } from 'zod';

describe('Validaciones con Zod', () => {
  describe('Esquema de Registro de Usuario', () => {
    const registerSchema = z.object({
      nombre: z.string().min(2).max(100),
      apellidos: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(6),
      rol: z.enum(['estudiante', 'tutor', 'revisor', 'administrador']),
    });

    test('debe validar datos correctos de registro', () => {
      const validData = {
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: 'juan@example.com',
        password: 'password123',
        rol: 'estudiante' as const,
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('debe rechazar nombre muy corto', () => {
      const invalidData = {
        nombre: 'J',
        apellidos: 'Pérez',
        email: 'juan@example.com',
        password: 'password123',
        rol: 'estudiante' as const,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debe rechazar email inválido', () => {
      const invalidData = {
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: 'email-invalido',
        password: 'password123',
        rol: 'estudiante' as const,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debe rechazar contraseña muy corta', () => {
      const invalidData = {
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: 'juan@example.com',
        password: '12345',
        rol: 'estudiante' as const,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debe rechazar rol inválido', () => {
      const invalidData = {
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: 'juan@example.com',
        password: 'password123',
        rol: 'rol-invalido' as any,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Esquema de Proyecto', () => {
    const proyectoSchema = z.object({
      titulo: z.string().min(5).max(500),
      descripcion: z.string().optional(),
      fecha_entrega: z.string().optional(),
    });

    test('debe validar proyecto con todos los campos', () => {
      const validData = {
        titulo: 'Sistema de Gestión de Proyectos',
        descripcion: 'Descripción del proyecto',
        fecha_entrega: '2025-12-31',
      };

      const result = proyectoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('debe validar proyecto solo con título requerido', () => {
      const validData = {
        titulo: 'Sistema de Gestión de Proyectos',
      };

      const result = proyectoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('debe rechazar título muy corto', () => {
      const invalidData = {
        titulo: 'Sis',
        descripcion: 'Descripción',
      };

      const result = proyectoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debe rechazar título muy largo', () => {
      const invalidData = {
        titulo: 'A'.repeat(501),
        descripcion: 'Descripción',
      };

      const result = proyectoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Esquema de Observación', () => {
    const observacionSchema = z.object({
      entrega_id: z.string().uuid(),
      comentario: z.string().min(1),
      seccion_documento: z.string().optional(),
      tipo: z.enum(['observacion', 'aprobacion', 'rechazo']).default('observacion'),
    });

    test('debe validar observación completa', () => {
      const validData = {
        entrega_id: '123e4567-e89b-12d3-a456-426614174000',
        comentario: 'Revisar la sección de metodología',
        seccion_documento: 'Capítulo 3',
        tipo: 'observacion' as const,
      };

      const result = observacionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('debe rechazar UUID inválido', () => {
      const invalidData = {
        entrega_id: 'uuid-invalido',
        comentario: 'Comentario',
      };

      const result = observacionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debe rechazar comentario vacío', () => {
      const invalidData = {
        entrega_id: '123e4567-e89b-12d3-a456-426614174000',
        comentario: '',
      };

      const result = observacionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debe usar tipo por defecto si no se especifica', () => {
      const validData = {
        entrega_id: '123e4567-e89b-12d3-a456-426614174000',
        comentario: 'Comentario',
      };

      const result = observacionSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tipo).toBe('observacion');
      }
    });
  });
});

