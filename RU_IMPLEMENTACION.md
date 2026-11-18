# Script SQL para agregar campo RU a los estudiantes

Ejecuta el siguiente comando en tu base de datos PostgreSQL para agregar el campo RU:

```sql
-- Agregar campo RU (número único del carnet estudiantil) a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN ru VARCHAR(50) UNIQUE;

-- Crear un índice para búsquedas rápidas por RU
CREATE INDEX idx_usuarios_ru ON usuarios(ru);
```

## Detalles del campo RU:

- **Nombre del campo**: `ru`
- **Tipo**: `VARCHAR(50)`
- **Restricción**: UNIQUE (cada RU debe ser único en la base de datos)
- **Índice**: Se creó un índice para optimizar búsquedas por RU

## Integración en la aplicación:

### Backend:
- ✅ Actualizado `auth.ts`: Ahora acepta RU en registro y lo devuelve en login
- ✅ Actualizado `usuarios.ts`: Soporta RU en creación y actualización de usuarios
- ✅ Los endpoints GET devuelven el RU en las respuestas

### Frontend:
- ✅ Actualizada interfaz `User` en `authStore.ts` para incluir RU
- ✅ Actualizada interfaz `Usuario` en `Usuarios.tsx` para incluir RU
- ✅ El campo `ru` es opcional en RegisterData

## Cómo usar el campo RU:

### Registrarse con RU:
```json
POST /api/auth/register
{
  "nombre": "Juan",
  "apellidos": "Pérez",
  "email": "juan@example.com",
  "password": "contraseña123",
  "rol": "estudiante",
  "ru": "20180001234"  // Opcional
}
```

### Actualizar usuario con RU:
```json
PUT /api/usuarios/:id
{
  "ru": "20180001234"
}
```

### Crear usuario como administrador con RU:
```json
POST /api/usuarios
{
  "nombre": "María",
  "apellidos": "García",
  "email": "maria@example.com",
  "password": "contraseña456",
  "rol": "estudiante",
  "ru": "20190002345"
}
```

## Respuestas de la API:

Los endpoints ahora incluyen el campo `ru` en la respuesta:

```json
{
  "id": "uuid-string",
  "nombre": "Juan",
  "apellidos": "Pérez",
  "email": "juan@example.com",
  "rol": "estudiante",
  "estado": "activo",
  "ru": "20180001234",
  "created_at": "2026-01-08T10:30:00Z"
}
```
