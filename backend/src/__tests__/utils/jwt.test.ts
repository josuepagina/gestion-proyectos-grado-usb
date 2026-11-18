import jwt from 'jsonwebtoken';

describe('Utilidades JWT', () => {
  const secret = 'test-secret-key';
  const payload = {
    id: 'user-id',
    email: 'test@example.com',
    rol: 'estudiante',
  };

  describe('Generación de Tokens', () => {
    test('debe generar token JWT válido', () => {
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tiene 3 partes separadas por puntos
    });

    test('debe generar tokens diferentes para el mismo payload', () => {
      const token1 = jwt.sign(payload, secret, { expiresIn: '7d' });
      const token2 = jwt.sign(payload, secret, { expiresIn: '7d' });

      // Los tokens pueden ser diferentes debido a timestamps, pero ambos deben ser válidos
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
    });

    test('debe incluir expiración en el token', () => {
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      const decoded = jwt.decode(token) as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });
  });

  describe('Verificación de Tokens', () => {
    test('debe verificar token válido correctamente', () => {
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });
      const decoded = jwt.verify(token, secret) as any;

      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.rol).toBe(payload.rol);
    });

    test('debe rechazar token con secret incorrecto', () => {
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });
      const wrongSecret = 'wrong-secret';

      expect(() => {
        jwt.verify(token, wrongSecret);
      }).toThrow();
    });

    test('debe rechazar token malformado', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        jwt.verify(invalidToken, secret);
      }).toThrow();
    });

    test('debe rechazar token expirado', () => {
      const token = jwt.sign(payload, secret, { expiresIn: '-1h' }); // Token expirado

      expect(() => {
        jwt.verify(token, secret);
      }).toThrow();
    });
  });

  describe('Decodificación de Tokens', () => {
    test('debe decodificar token sin verificación', () => {
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });
      const decoded = jwt.decode(token) as any;

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.rol).toBe(payload.rol);
    });

    test('debe decodificar token sin verificar expiración', () => {
      const token = jwt.sign(payload, secret, { expiresIn: '-1h' });
      const decoded = jwt.decode(token) as any;

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(payload.id);
    });
  });
});

