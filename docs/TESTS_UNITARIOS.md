# Tests Unitarios - Sistema de Gestión de Proyectos de Grado

Este documento contiene la documentación completa de todos los tests unitarios implementados en el sistema.

---

## 📊 Resumen Ejecutivo

| Métrica | Backend | Frontend | Total |
|---------|---------|----------|-------|
| **Total de Tests** | 41 | 10 | 51 |
| **Tests Pasados** | 41 | 10 | 51 |
| **Tests Fallidos** | 0 | 0 | 0 |
| **Cobertura** | En desarrollo | En desarrollo | En desarrollo |
| **Framework** | Jest | Jest | Jest |

---

## 🧪 Tests del Backend

### Middleware de Autenticación (`src/__tests__/middleware/auth.test.ts`)

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 1 | `authenticate - debe retornar error 401 si no se proporciona token` | Verifica que el middleware rechace peticiones sin token | ✅ Pasado |
| 2 | `authenticate - debe retornar error 401 si el token es inválido` | Verifica que el middleware rechace tokens malformados o inválidos | ✅ Pasado |
| 3 | `authenticate - debe retornar error 401 si el usuario no existe en la base de datos` | Verifica que el middleware rechace tokens de usuarios inexistentes | ✅ Pasado |
| 4 | `authenticate - debe retornar error 401 si el usuario está inactivo` | Verifica que el middleware rechace tokens de usuarios inactivos | ✅ Pasado |
| 5 | `authenticate - debe autenticar correctamente con token válido y usuario activo` | Verifica que el middleware permita acceso con credenciales válidas | ✅ Pasado |
| 6 | `authorize - debe retornar error 401 si no hay usuario autenticado` | Verifica que el middleware de autorización requiera autenticación previa | ✅ Pasado |
| 7 | `authorize - debe retornar error 403 si el rol del usuario no está autorizado` | Verifica que el middleware rechace acceso a roles no autorizados | ✅ Pasado |
| 8 | `authorize - debe permitir acceso si el rol del usuario está autorizado` | Verifica que el middleware permita acceso a roles autorizados | ✅ Pasado |
| 9 | `authorize - debe permitir acceso con múltiples roles autorizados` | Verifica que el middleware funcione con múltiples roles permitidos | ✅ Pasado |

**Total de Tests en auth.test.ts:** 9 ✅

---

### Manejo de Errores (`src/__tests__/middleware/errorHandler.test.ts`)

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 1 | `debe manejar errores de validación con código 400` | Verifica que los errores de validación retornen código 400 | ✅ Pasado |
| 2 | `debe manejar errores no autorizados con código 401` | Verifica que los errores de autorización retornen código 401 | ✅ Pasado |
| 3 | `debe manejar errores genéricos con código 500 en desarrollo` | Verifica que en desarrollo se muestren detalles del error | ✅ Pasado |
| 4 | `debe ocultar detalles del error en producción` | Verifica que en producción se oculte información sensible | ✅ Pasado |

**Total de Tests en errorHandler.test.ts:** 4 ✅

---

### Validaciones con Zod (`src/__tests__/utils/validation.test.ts`)

#### Esquema de Registro de Usuario

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 1 | `debe validar datos correctos de registro` | Verifica que datos válidos pasen la validación | ✅ Pasado |
| 2 | `debe rechazar nombre muy corto` | Verifica validación de longitud mínima de nombre | ✅ Pasado |
| 3 | `debe rechazar email inválido` | Verifica validación de formato de email | ✅ Pasado |
| 4 | `debe rechazar contraseña muy corta` | Verifica validación de longitud mínima de contraseña | ✅ Pasado |
| 5 | `debe rechazar rol inválido` | Verifica validación de valores permitidos para rol | ✅ Pasado |

#### Esquema de Proyecto

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 6 | `debe validar proyecto con todos los campos` | Verifica validación completa de proyecto | ✅ Pasado |
| 7 | `debe validar proyecto solo con título requerido` | Verifica que campos opcionales no sean requeridos | ✅ Pasado |
| 8 | `debe rechazar título muy corto` | Verifica validación de longitud mínima de título | ✅ Pasado |
| 9 | `debe rechazar título muy largo` | Verifica validación de longitud máxima de título | ✅ Pasado |

#### Esquema de Observación

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 10 | `debe validar observación completa` | Verifica validación completa de observación | ✅ Pasado |
| 11 | `debe rechazar UUID inválido` | Verifica validación de formato UUID | ✅ Pasado |
| 12 | `debe rechazar comentario vacío` | Verifica que comentario no pueda estar vacío | ✅ Pasado |
| 13 | `debe usar tipo por defecto si no se especifica` | Verifica que se asigne valor por defecto al tipo | ✅ Pasado |

**Total de Tests en validation.test.ts:** 13 ✅

---

### Utilidades de Contraseñas (`src/__tests__/utils/password.test.ts`)

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 1 | `debe generar hash de contraseña correctamente` | Verifica generación de hash con bcrypt | ✅ Pasado |
| 2 | `debe generar hashes diferentes para la misma contraseña` | Verifica que cada hash sea único (sal aleatorio) | ✅ Pasado |
| 3 | `debe verificar contraseña correcta` | Verifica comparación exitosa de contraseña correcta | ✅ Pasado |
| 4 | `debe rechazar contraseña incorrecta` | Verifica rechazo de contraseña incorrecta | ✅ Pasado |
| 5 | `debe manejar contraseñas con caracteres especiales` | Verifica soporte de caracteres especiales | ✅ Pasado |
| 6 | `debe manejar contraseñas largas` | Verifica soporte de contraseñas de hasta 100 caracteres | ✅ Pasado |

**Total de Tests en password.test.ts:** 6 ✅

---

### Utilidades JWT (`src/__tests__/utils/jwt.test.ts`)

#### Generación de Tokens

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 1 | `debe generar token JWT válido` | Verifica generación correcta de token JWT | ✅ Pasado |
| 2 | `debe generar tokens diferentes para el mismo payload` | Verifica que cada token sea único | ✅ Pasado |
| 3 | `debe incluir expiración en el token` | Verifica que el token incluya campo de expiración | ✅ Pasado |

#### Verificación de Tokens

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 4 | `debe verificar token válido correctamente` | Verifica decodificación exitosa de token válido | ✅ Pasado |
| 5 | `debe rechazar token con secret incorrecto` | Verifica rechazo de token con secret incorrecto | ✅ Pasado |
| 6 | `debe rechazar token malformado` | Verifica rechazo de tokens con formato inválido | ✅ Pasado |
| 7 | `debe rechazar token expirado` | Verifica rechazo de tokens expirados | ✅ Pasado |

#### Decodificación de Tokens

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 8 | `debe decodificar token sin verificación` | Verifica decodificación sin validar expiración | ✅ Pasado |
| 9 | `debe decodificar token sin verificar expiración` | Verifica decodificación de tokens expirados | ✅ Pasado |

**Total de Tests en jwt.test.ts:** 9 ✅

---

## 🎨 Tests del Frontend

### Store de Autenticación (`src/__tests__/store/authStore.test.ts`)

#### Login

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 1 | `debe iniciar sesión correctamente y guardar token` | Verifica login exitoso y almacenamiento de token | ✅ Pasado |
| 2 | `debe manejar error en login` | Verifica manejo de errores en login | ✅ Pasado |

#### Register

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 3 | `debe registrar usuario correctamente` | Verifica registro exitoso de nuevo usuario | ✅ Pasado |

#### Logout

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 4 | `debe cerrar sesión y limpiar datos` | Verifica limpieza completa al cerrar sesión | ✅ Pasado |

#### CheckAuth

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 5 | `debe verificar autenticación con token válido` | Verifica verificación exitosa de autenticación | ✅ Pasado |
| 6 | `debe limpiar datos si el token es inválido` | Verifica limpieza cuando el token es inválido | ✅ Pasado |
| 7 | `no debe hacer nada si no hay token` | Verifica que no se hagan peticiones sin token | ✅ Pasado |

**Total de Tests en authStore.test.ts:** 7 ✅

---

### Cliente API (`src/__tests__/lib/api.test.ts`)

| # | Test | Descripción | Estado |
|---|------|-------------|--------|
| 1 | `debe configurar baseURL correctamente` | Verifica configuración de URL base del API | ✅ Pasado |
| 2 | `debe configurar Content-Type como application/json` | Verifica configuración de headers por defecto | ✅ Pasado |
| 3 | `debe tener configuración de axios correcta` | Verifica que la instancia de axios esté configurada | ✅ Pasado |

**Total de Tests en api.test.ts:** 3 ✅

---

## 📈 Estadísticas por Categoría

### Backend

| Categoría | Cantidad de Tests | Estado |
|-----------|-------------------|--------|
| Middleware de Autenticación | 9 | ✅ Todos pasados |
| Manejo de Errores | 4 | ✅ Todos pasados |
| Validaciones (Zod) | 13 | ✅ Todos pasados |
| Utilidades de Contraseñas | 6 | ✅ Todos pasados |
| Utilidades JWT | 9 | ✅ Todos pasados |
| **TOTAL BACKEND** | **41** | ✅ **100% Pasados** |

### Frontend

| Categoría | Cantidad de Tests | Estado |
|-----------|-------------------|--------|
| Store de Autenticación | 7 | ✅ Todos pasados |
| Cliente API | 3 | ✅ Todos pasados |
| **TOTAL FRONTEND** | **10** | ✅ **100% Pasados** |

---

## 🎯 Cobertura de Funcionalidades

### Funcionalidades Probadas

| Funcionalidad | Tests Backend | Tests Frontend | Estado |
|---------------|---------------|----------------|--------|
| Autenticación JWT | 9 | 7 | ✅ Completo |
| Validación de Datos | 13 | - | ✅ Completo |
| Manejo de Errores | 4 | - | ✅ Completo |
| Hash de Contraseñas | 6 | - | ✅ Completo |
| Cliente HTTP | - | 3 | ✅ Completo |

---

## 🚀 Ejecución de Tests

### Backend

```bash
cd backend
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch (ejecuta tests al cambiar archivos)
npm run test:coverage # Con reporte de cobertura
```

### Frontend

```bash
cd frontend
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch (ejecuta tests al cambiar archivos)
npm run test:coverage # Con reporte de cobertura
```

---

## 📝 Notas de Implementación

### Backend

- **Framework:** Jest con ts-jest para TypeScript
- **Mocking:** Jest mocks para base de datos y dependencias externas
- **Configuración:** `jest.config.js` con preset ts-jest
- **Setup:** Archivo `src/__tests__/setup.ts` para configuración global

### Frontend

- **Framework:** Jest con ts-jest para TypeScript
- **Entorno:** jsdom para simular DOM del navegador
- **Mocking:** Jest mocks para axios y localStorage
- **Configuración:** `jest.config.cjs` (CommonJS por type: "module")
- **Setup:** Archivo `src/__tests__/setup.ts` con @testing-library/jest-dom

---

## ✅ Criterios de Aceptación

Todos los tests cumplen con los siguientes criterios:

- ✅ **Nombres descriptivos en español** - Todos los tests tienen nombres claros que describen qué prueban
- ✅ **Cobertura de casos exitosos** - Se prueban flujos normales de funcionamiento
- ✅ **Cobertura de casos de error** - Se prueban escenarios de error y validación
- ✅ **Aislamiento** - Cada test es independiente y no afecta a otros
- ✅ **Limpieza** - Cada test limpia su estado después de ejecutarse
- ✅ **Mocking apropiado** - Se usan mocks para dependencias externas

---

## 🔄 Mantenimiento

### Agregar Nuevos Tests

1. Crear archivo de test en la carpeta `__tests__` correspondiente
2. Seguir la convención de nombres: `*.test.ts` o `*.test.tsx`
3. Usar nombres descriptivos en español para los tests
4. Asegurar que todos los tests pasen antes de hacer commit

### Ejecutar Tests Antes de Commit

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

**Última actualización:** 2025  
**Total de Tests:** 51 ✅  
**Tasa de Éxito:** 100%

