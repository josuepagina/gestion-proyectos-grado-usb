import bcrypt from 'bcryptjs';

describe('Utilidades de Contraseñas', () => {
  describe('Hash de Contraseñas', () => {
    test('debe generar hash de contraseña correctamente', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash(password, 10);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    test('debe generar hashes diferentes para la misma contraseña', async () => {
      const password = 'password123';
      const hash1 = await bcrypt.hash(password, 10);
      const hash2 = await bcrypt.hash(password, 10);

      expect(hash1).not.toBe(hash2);
    });

    test('debe verificar contraseña correcta', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
    });

    test('debe rechazar contraseña incorrecta', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hash = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    test('debe manejar contraseñas con caracteres especiales', async () => {
      const password = 'P@ssw0rd!#$%';
      const hash = await bcrypt.hash(password, 10);
      const isValid = await bcrypt.compare(password, hash);

      expect(isValid).toBe(true);
    });

    test('debe manejar contraseñas largas', async () => {
      const password = 'a'.repeat(100);
      const hash = await bcrypt.hash(password, 10);
      const isValid = await bcrypt.compare(password, hash);

      expect(isValid).toBe(true);
    });
  });
});

