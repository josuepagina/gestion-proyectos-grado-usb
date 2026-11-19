# Diagramas UML - Sistema de Gestión de Proyectos de Grado

Este documento contiene todos los diagramas UML del sistema en formato Mermaid, que pueden ser visualizados directamente en GitHub, editores Markdown compatibles o en [Mermaid Live Editor](https://mermaid.live).

---

## 📊 Diagrama de Casos de Uso

Este diagrama muestra todos los casos de uso del sistema organizados por actor (rol).

```mermaid
graph TB
    subgraph "Actores"
        Estudiante[👨‍🎓 Estudiante]
        Tutor[👨‍🏫 Tutor]
        Revisor[👨‍⚖️ Revisor]
        Administrador[👨‍💼 Administrador]
    end

    subgraph "Casos de Uso - Autenticación"
        UC1[Registrarse]
        UC2[Iniciar Sesión]
        UC3[Cerrar Sesión]
        UC4[Ver Perfil]
    end

    subgraph "Casos de Uso - Estudiante"
        UC5[Crear Proyecto]
        UC6[Subir Documento]
        UC7[Ver Observaciones]
        UC8[Comparar Versiones]
        UC9[Ver Bitácoras]
        UC10[Ver Reportes]
        UC11[Descargar Documentos]
        UC12[Marcar Observación Resuelta]
    end

    subgraph "Casos de Uso - Tutor"
        UC13[Ver Proyectos Asignados]
        UC14[Revisar Documento]
        UC15[Agregar Observación]
        UC16[Aprobar Entrega]
        UC17[Rechazar Entrega]
        UC18[Comparar Versiones]
        UC19[Ver Bitácoras]
        UC20[Ver Reportes]
    end

    subgraph "Casos de Uso - Revisor"
        UC21[Ver Proyectos Asignados]
        UC22[Revisar Documento]
        UC23[Agregar Observación]
        UC24[Evaluar Entrega]
        UC25[Comparar Versiones]
        UC26[Ver Bitácoras]
        UC27[Ver Reportes]
    end

    subgraph "Casos de Uso - Administrador"
        UC28[Gestionar Usuarios]
        UC29[Asignar Tutor]
        UC30[Asignar Revisor]
        UC31[Ver Todos los Proyectos]
        UC32[Ver Estadísticas]
        UC33[Ver Todas las Bitácoras]
    end

    subgraph "Casos de Uso - Sistema"
        UC34[Generar Notificaciones]
        UC35[Registrar Bitácora]
        UC36[Comparar Documentos]
    end

    %% Relaciones Estudiante
    Estudiante --> UC1
    Estudiante --> UC2
    Estudiante --> UC3
    Estudiante --> UC4
    Estudiante --> UC5
    Estudiante --> UC6
    Estudiante --> UC7
    Estudiante --> UC8
    Estudiante --> UC9
    Estudiante --> UC10
    Estudiante --> UC11
    Estudiante --> UC12

    %% Relaciones Tutor
    Tutor --> UC2
    Tutor --> UC3
    Tutor --> UC4
    Tutor --> UC13
    Tutor --> UC14
    Tutor --> UC15
    Tutor --> UC16
    Tutor --> UC17
    Tutor --> UC18
    Tutor --> UC19
    Tutor --> UC20

    %% Relaciones Revisor
    Revisor --> UC2
    Revisor --> UC3
    Revisor --> UC4
    Revisor --> UC21
    Revisor --> UC22
    Revisor --> UC23
    Revisor --> UC24
    Revisor --> UC25
    Revisor --> UC26
    Revisor --> UC27

    %% Relaciones Administrador
    Administrador --> UC2
    Administrador --> UC3
    Administrador --> UC4
    Administrador --> UC28
    Administrador --> UC29
    Administrador --> UC30
    Administrador --> UC31
    Administrador --> UC32
    Administrador --> UC33

    %% Relaciones Sistema (automáticas)
    UC6 -.-> UC34
    UC15 -.-> UC34
    UC23 -.-> UC34
    UC6 -.-> UC35
    UC14 -.-> UC35
    UC22 -.-> UC35
    UC8 -.-> UC36
    UC18 -.-> UC36
    UC25 -.-> UC36

    style Estudiante fill:#e1f5ff
    style Tutor fill:#fff4e1
    style Revisor fill:#ffe1f5
    style Administrador fill:#e1ffe1
```

---

## 🗄️ Diagrama Entidad-Relación (Modelo de Base de Datos)

Este diagrama muestra el modelo completo de la base de datos con todas las relaciones entre entidades.

```mermaid
erDiagram
    USUARIOS ||--o{ PROYECTOS : crea
    USUARIOS ||--o{ PROYECTOS : tutorea
    USUARIOS ||--o{ PROYECTOS_REVISORES : revisa
    USUARIOS ||--o{ OBSERVACIONES : realiza
    USUARIOS ||--o{ NOTIFICACIONES : recibe
    USUARIOS ||--o{ BITACORAS : registra
    
    PROYECTOS ||--o{ ENTREGAS : contiene
    PROYECTOS ||--o{ PROYECTOS_REVISORES : tiene
    
    ENTREGAS ||--o{ OBSERVACIONES : tiene
    ENTREGAS ||--o{ BITACORAS : registra
    
    USUARIOS {
        string id PK
        string nombre
        string apellidos
        string email UK
        string password_hash
        string rol
        string estado
        date created_at
        date updated_at
    }
    
    PROYECTOS {
        string id PK
        string titulo
        string descripcion
        string estudiante_id FK
        string tutor_id FK
        string estado
        date fecha_entrega
        date created_at
        date updated_at
    }
    
    ENTREGAS {
        string id PK
        string proyecto_id FK
        string etapa
        string archivo_url
        string archivo_nombre
        int version
        string estado_revision
        string estado_tutor
        string estado_revisor
        date fecha_subida
        date created_at
    }
    
    OBSERVACIONES {
        string id PK
        string entrega_id FK
        string usuario_id FK
        string comentario
        string seccion_documento
        string tipo
        boolean estado_resuelto
        date fecha
        date created_at
    }
    
    NOTIFICACIONES {
        string id PK
        string usuario_id FK
        string tipo
        string mensaje
        string relacion_id
        string relacion_tipo
        boolean leida
        date fecha_creacion
        date created_at
    }
    
    PROYECTOS_REVISORES {
        string id PK
        string proyecto_id FK
        string revisor_id FK
        string asignado_por FK
        date fecha_asignacion
    }
    
    BITACORAS {
        string id PK
        string entrega_id FK
        string usuario_id FK
        string accion
        string descripcion
        string cambios_detectados
        int version_anterior
        int version_actual
        date fecha
        date created_at
    }
```

**Nota:** Si el diagrama no se muestra en tu editor, puedes:
1. Copiarlo y pegarlo en [Mermaid Live Editor](https://mermaid.live) - Funciona mejor para diagramas ER
2. Usar un editor que soporte Mermaid como VS Code con la extensión "Markdown Preview Mermaid Support"
3. Verlo directamente en GitHub donde se renderiza automáticamente

**Alternativa:** Si el diagrama ER no funciona, puedes usar el Diagrama de Clases más abajo que muestra la misma información de forma más compatible.

---

## 🔄 Diagrama de Secuencia - Flujo de Subida y Revisión de Documento

Este diagrama muestra el flujo completo cuando un estudiante sube un documento y recibe retroalimentación.

```mermaid
sequenceDiagram
    participant E as Estudiante
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Datos
    participant T as Tutor
    participant N as Sistema Notificaciones

    E->>F: Subir documento (etapa, archivo)
    F->>B: POST /api/entregas
    B->>B: Validar autenticación
    B->>B: Validar datos (Zod)
    B->>B: Guardar archivo (multer)
    B->>DB: INSERT INTO entregas
    DB->>DB: Trigger: crear_notificacion_entrega()
    DB->>N: Crear notificación para tutor
    DB-->>B: Entrega creada
    B-->>F: 201 Created (entrega)
    F-->>E: Documento subido exitosamente
    
    Note over N,T: Notificación automática
    N->>T: Notificación: "Nueva entrega"
    
    T->>F: Ver proyecto asignado
    F->>B: GET /api/proyectos/:id
    B->>DB: SELECT proyecto + entregas
    DB-->>B: Datos del proyecto
    B-->>F: Proyecto con entregas
    F-->>T: Ver documento subido
    
    T->>F: Agregar observación
    F->>B: POST /api/observaciones
    B->>B: Validar autenticación
    B->>B: Validar datos (Zod)
    B->>DB: INSERT INTO observaciones
    DB->>DB: Trigger: crear_notificacion_observacion()
    DB->>N: Crear notificación para estudiante
    DB-->>B: Observación creada
    B-->>F: 201 Created (observación)
    F-->>T: Observación agregada
    
    Note over N,E: Notificación automática
    N->>E: Notificación: "Nueva observación"
    
    E->>F: Ver observaciones
    F->>B: GET /api/observaciones/entrega/:id
    B->>DB: SELECT observaciones
    DB-->>B: Lista de observaciones
    B-->>F: Observaciones
    F-->>E: Ver retroalimentación
```

---

## 🏗️ Diagrama de Componentes - Arquitectura del Sistema

Este diagrama muestra la arquitectura de componentes del sistema.

```mermaid
graph TB
    subgraph "Frontend - React Application"
        UI[Interfaz de Usuario<br/>React Components]
        Router[React Router<br/>Navegación]
        Store[Zustand Store<br/>Estado Global]
        API_Client[Axios Client<br/>Cliente HTTP]
    end

    subgraph "Backend - Express API"
        Routes[Express Routes<br/>Endpoints REST]
        Middleware[Middleware<br/>Auth, Validation, Errors]
        Controllers[Controllers<br/>Lógica de Negocio]
        Services[Services<br/>Servicios]
    end

    subgraph "Base de Datos"
        PostgreSQL[(PostgreSQL<br/>Neon)]
        Triggers[Triggers<br/>Notificaciones Automáticas]
        Functions[Functions<br/>Funciones PL/pgSQL]
    end

    subgraph "Almacenamiento"
        FileSystem[File System<br/>Uploads/]
    end

    subgraph "Autenticación"
        JWT[JWT Tokens<br/>jsonwebtoken]
        Bcrypt[Bcrypt<br/>Hash Passwords]
    end

    subgraph "Validación"
        Zod[Zod<br/>Schema Validation]
    end

    UI --> Router
    Router --> Store
    Store --> API_Client
    API_Client --> Routes
    
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> PostgreSQL
    Services --> FileSystem
    
    Middleware --> JWT
    Middleware --> Zod
    Controllers --> Bcrypt
    
    PostgreSQL --> Triggers
    PostgreSQL --> Functions
    
    Triggers -.->|Notificaciones| PostgreSQL

    style UI fill:#61dafb
    style Routes fill:#83cd29
    style PostgreSQL fill:#336791
    style JWT fill:#f7df1e
```

---

## 🔐 Diagrama de Secuencia - Autenticación y Autorización

Este diagrama muestra el flujo completo de autenticación y autorización con JWT.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Datos
    participant JWT as JWT Service

    Note over U,JWT: Proceso de Login
    U->>F: Ingresar email y contraseña
    F->>B: POST /api/auth/login
    B->>DB: SELECT usuario WHERE email
    DB-->>B: Usuario encontrado
    B->>B: Verificar contraseña (bcrypt.compare)
    alt Contraseña válida
        B->>JWT: Generar token (sign)
        JWT-->>B: Token JWT
        B-->>F: 200 OK (token + user)
        F->>F: Guardar token en localStorage
        F->>F: Guardar user en Zustand store
        F-->>U: Redirigir a Dashboard
    else Contraseña inválida
        B-->>F: 401 Unauthorized
        F-->>U: Error: Credenciales inválidas
    end

    Note over U,JWT: Proceso de Autorización
    U->>F: Acceder a ruta protegida
    F->>B: GET /api/proyectos (con token)
    B->>B: Middleware authenticate()
    B->>JWT: Verificar token (verify)
    alt Token válido
        JWT-->>B: Payload decodificado
        B->>DB: SELECT usuario WHERE id
        DB-->>B: Usuario activo
        B->>B: Middleware authorize()
        alt Rol autorizado
            B->>DB: SELECT proyectos
            DB-->>B: Proyectos filtrados por rol
            B-->>F: 200 OK (proyectos)
            F-->>U: Mostrar proyectos
        else Rol no autorizado
            B-->>F: 403 Forbidden
            F-->>U: Error: Acceso denegado
        end
    else Token inválido/expirado
        B-->>F: 401 Unauthorized
        F->>F: Limpiar localStorage
        F-->>U: Redirigir a Login
    end
```

---

## 📈 Diagrama de Estados - Ciclo de Vida de un Proyecto

Este diagrama muestra los estados posibles de un proyecto y las transiciones entre ellos.

```mermaid
stateDiagram-v2
    [*] --> Registrado: Estudiante crea proyecto
    
    Registrado --> EnProceso: Administrador asigna tutor
    Registrado --> EnDesarrollo: Tutor inicia seguimiento
    
    EnProceso --> EnDesarrollo: Tutor acepta proyecto
    EnDesarrollo --> EnRevision: Estudiante sube versión final
    
    EnRevision --> Correcciones: Tutor/Revisor observa
    EnRevision --> Aprobado: Tutor/Revisor aprueba
    EnRevision --> Rechazado: Tutor/Revisor rechaza
    
    Correcciones --> EnDesarrollo: Estudiante corrige
    Correcciones --> EnRevision: Estudiante reenvía
    
    Aprobado --> Completado: Proyecto finalizado
    Aprobado --> Sustentado: Estudiante sustenta
    
    Rechazado --> [*]: Proyecto cancelado
    Sustentado --> [*]: Proyecto completado
    Completado --> [*]: Proyecto archivado
    
    note right of Registrado
        Estado inicial
        Sin tutor asignado
    end note
    
    note right of EnRevision
        Múltiples revisores
        pueden evaluar
    end note
    
    note right of Aprobado
        Requiere aprobación
        de tutor y revisores
    end note
```

---

## 📦 Diagrama de Clases - Modelo de Datos (Backend)

Este diagrama muestra las clases principales del backend y sus relaciones.

```mermaid
classDiagram
    class Usuario {
        +UUID id
        +string nombre
        +string apellidos
        +string email
        +string password_hash
        +Rol rol
        +Estado estado
        +DateTime created_at
        +DateTime updated_at
        +login()
        +register()
    }
    
    class Proyecto {
        +UUID id
        +string titulo
        +string descripcion
        +UUID estudiante_id
        +UUID tutor_id
        +EstadoProyecto estado
        +Date fecha_entrega
        +DateTime created_at
        +DateTime updated_at
        +crear()
        +actualizar()
        +asignarTutor()
        +asignarRevisor()
    }
    
    class Entrega {
        +UUID id
        +UUID proyecto_id
        +Etapa etapa
        +string archivo_url
        +string archivo_nombre
        +int version
        +EstadoRevision estado_revision
        +EstadoTutor estado_tutor
        +EstadoRevisor estado_revisor
        +DateTime fecha_subida
        +subir()
        +compararVersiones()
        +actualizarEstado()
    }
    
    class Observacion {
        +UUID id
        +UUID entrega_id
        +UUID usuario_id
        +string comentario
        +string seccion_documento
        +TipoObservacion tipo
        +bool estado_resuelto
        +DateTime fecha
        +crear()
        +marcarResuelta()
    }
    
    class Notificacion {
        +UUID id
        +UUID usuario_id
        +TipoNotificacion tipo
        +string mensaje
        +UUID relacion_id
        +string relacion_tipo
        +bool leida
        +DateTime fecha_creacion
        +crear()
        +marcarLeida()
    }
    
    class Bitacora {
        +UUID id
        +UUID entrega_id
        +UUID usuario_id
        +Accion accion
        +string descripcion
        +JSONB cambios_detectados
        +int version_anterior
        +int version_actual
        +DateTime fecha
        +registrar()
    }
    
    class ProyectoRevisor {
        +UUID id
        +UUID proyecto_id
        +UUID revisor_id
        +UUID asignado_por
        +DateTime fecha_asignacion
        +asignar()
    }
    
    Usuario "1" --> "*" Proyecto : crea
    Usuario "1" --> "*" Proyecto : tutorea
    Usuario "*" --> "*" Proyecto : revisa (via ProyectoRevisor)
    Usuario "1" --> "*" Observacion : realiza
    Usuario "1" --> "*" Notificacion : recibe
    Usuario "1" --> "*" Bitacora : registra
    
    Proyecto "1" --> "*" Entrega : contiene
    Proyecto "1" --> "*" ProyectoRevisor : tiene revisores
    
    Entrega "1" --> "*" Observacion : tiene
    Entrega "1" --> "*" Bitacora : registra cambios
```

---

## 🔄 Diagrama de Flujo - Proceso de Revisión de Documento

Este diagrama muestra el flujo completo del proceso de revisión de un documento.

```mermaid
flowchart TD
    Start([Estudiante sube documento]) --> Validar{Validar<br/>autenticación}
    Validar -->|No autenticado| Error1[Error 401]
    Validar -->|Autenticado| ValidarDatos{Validar datos<br/>Zod}
    
    ValidarDatos -->|Datos inválidos| Error2[Error 400]
    ValidarDatos -->|Datos válidos| GuardarArchivo[Guardar archivo<br/>en sistema]
    
    GuardarArchivo --> CrearEntrega[Crear registro<br/>en tabla entregas]
    CrearEntrega --> NotificarTutor[Trigger: Notificar<br/>al tutor]
    NotificarTutor --> RegistrarBitacora[Registrar en<br/>bitácora]
    RegistrarBitacora --> Success1[Éxito: Documento<br/>subido]
    
    Success1 --> TutorVe[Tutor ve notificación]
    TutorVe --> TutorRevisa{Tutor revisa<br/>documento}
    
    TutorRevisa -->|Agrega observación| CrearObservacion[Crear observación]
    CrearObservacion --> NotificarEstudiante[Trigger: Notificar<br/>al estudiante]
    NotificarEstudiante --> Success2[Éxito: Observación<br/>creada]
    
    TutorRevisa -->|Aprueba| AprobarTutor[Tutor aprueba]
    TutorRevisa -->|Rechaza| RechazarTutor[Tutor rechaza]
    
    AprobarTutor --> AsignarRevisores{¿Hay revisores<br/>asignados?}
    RechazarTutor --> NotificarEstudiante
    
    AsignarRevisores -->|Sí| NotificarRevisores[Notificar revisores]
    AsignarRevisores -->|No| EsperarAsignacion[Esperar asignación<br/>de revisores]
    
    NotificarRevisores --> RevisorRevisa{Revisor revisa<br/>documento}
    
    RevisorRevisa -->|Agrega observación| CrearObservacion
    RevisorRevisa -->|Aprueba| AprobarRevisor[Revisor aprueba]
    RevisorRevisa -->|Rechaza| RechazarRevisor[Revisor rechaza]
    
    AprobarRevisor --> TodasAprobadas{¿Todas las<br/>revisiones aprobadas?}
    RechazarRevisor --> NotificarEstudiante
    
    TodasAprobadas -->|Sí| ProyectoAprobado[Proyecto aprobado]
    TodasAprobadas -->|No| EsperarRevisiones[Esperar otras<br/>revisiones]
    
    ProyectoAprobado --> End([Proceso completado])
    Success2 --> EstudianteCorrige[Estudiante corrige]
    EstudianteCorrige --> Start
    
    style Start fill:#e1f5ff
    style End fill:#e1ffe1
    style Error1 fill:#ffe1e1
    style Error2 fill:#ffe1e1
```

---

## 📱 Diagrama de Despliegue

Este diagrama muestra la arquitectura de despliegue del sistema.

```mermaid
graph TB
    subgraph "Cliente"
        Browser[Navegador Web<br/>React App]
    end
    
    subgraph "Frontend - Vercel"
        Vercel[Vercel<br/>Hosting Estático]
        CDN[CDN Global<br/>Distribución]
    end
    
    subgraph "Backend - Servidor Node.js"
        Express[Express Server<br/>API REST]
        Multer[Multer<br/>File Upload]
        JWT[JWT Auth<br/>Middleware]
    end
    
    subgraph "Base de Datos - Neon"
        Neon[Neon PostgreSQL<br/>Serverless]
        Backup[Backups<br/>Automáticos]
    end
    
    subgraph "Almacenamiento"
        FileStorage[File System<br/>Uploads/]
    end
    
    Browser -->|HTTPS| CDN
    CDN --> Vercel
    Vercel --> Browser
    
    Browser -->|API Calls| Express
    Express --> JWT
    Express --> Multer
    Multer --> FileStorage
    Express -->|SQL Queries| Neon
    Neon --> Backup
    
    style Browser fill:#61dafb
    style Vercel fill:#000000,color:#fff
    style Express fill:#83cd29
    style Neon fill:#00d9ff
```

---

## 📝 Notas sobre los Diagramas

### Cómo Visualizar los Diagramas

1. **En GitHub**: Los diagramas Mermaid se renderizan automáticamente en archivos `.md`
2. **En VS Code**: Instala la extensión "Markdown Preview Mermaid Support" o "Mermaid Preview"
3. **En línea**: Copia y pega el código en [Mermaid Live Editor](https://mermaid.live) - **Recomendado para diagramas ER**
4. **En documentación**: Muchos editores Markdown modernos soportan Mermaid

**⚠️ Nota Importante sobre Diagramas ER:** 
Algunos editores tienen problemas con los diagramas ER de Mermaid. Si el diagrama ER no se muestra en tu editor:
- **Solución recomendada**: Copia el código del diagrama ER y pégalo en [Mermaid Live Editor](https://mermaid.live) - tiene el mejor soporte
- **Alternativa**: Usa el Diagrama de Clases más abajo que muestra la misma información de forma más compatible con todos los editores
- **En GitHub**: Los diagramas ER se renderizan correctamente cuando ves el archivo en GitHub

### Convenciones Utilizadas

- **Actores**: Representados con iconos y colores distintivos
- **Entidades**: Nombres en mayúsculas en diagramas ER
- **Relaciones**: Líneas sólidas para relaciones directas, punteadas para automáticas
- **Estados**: Colores diferentes para estados iniciales, intermedios y finales
- **Flujos**: Flechas indican dirección del flujo de datos/control

---

## 🔄 Diagrama de Estados - Gestión de Etapas

Este diagrama muestra los estados posibles de una etapa y sus transiciones válidas.

```mermaid
graph TD
    A[Planificada] -->|Admin: Abrir| B[Abierta]
    B -->|Admin: Cerrar| C[Cerrada]
    A -->|Admin: Archivar| D[Archivada]
    B -->|Admin: Archivar| D
    C -->|Admin: Archivar| D
    
    style A fill:#FFC107,stroke:#FF8F00,stroke-width:2px,color:#000
    style B fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style C fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff
    style D fill:#9E9E9E,stroke:#424242,stroke-width:2px,color:#fff
```

---

## 📅 Diagrama de Flujo - Ciclo de Vida de Etapa

```mermaid
graph TD
    A[Administrador crea Etapa] --> B{Etapa creada}
    B --> C["Estado: Planificada<br/>Los estudiantes no ven"]
    
    C --> D[Llega la fecha de apertura<br/>o Admin abre manualmente]
    D --> E["Estado: Abierta<br/>✅ Los estudiantes pueden entregar"]
    
    E --> F{¿Entregas<br/>en tiempo?}
    F -->|Sí| G[Los estudiantes entregan<br/>documentos normalmente]
    F -->|No| H{¿Permitir<br/>fuera de tiempo?}
    H -->|Sí| G
    H -->|No| I["❌ Rechazo de entrega<br/>Límite excedido"]
    
    G --> J[Llega la fecha de cierre<br/>o Admin cierra manualmente]
    J --> K["Estado: Cerrada<br/>❌ No se aceptan entregas"]
    
    K --> L[Tutor/Revisor inician<br/>revisiones]
    
    L --> M[Fin del semestre<br/>Admin archiva]
    M --> N["Estado: Archivada<br/>Se mantiene en historial"]
```

---

## 🏗️ Diagrama de Clases - Entidades de Etapas

```mermaid
classDiagram
    class Etapa {
        id: UUID
        nombre: string
        descripcion: string
        numero_orden: int
        tipo: enum
        estado: enum
        fecha_apertura: timestamp
        fecha_cierre: timestamp
        fecha_limite_entrega: timestamp
        permitir_entregas_fuera_tiempo: boolean
        descripcion_entrega: text
        criterios_evaluacion: JSONB
        archivos_plantilla: JSONB
        requerimientos: JSONB
        created_by: UUID
        created_at: timestamp
        updated_at: timestamp
        --
        crear()
        actualizar()
        cambiarEstado()
        archivar()
    }
    
    class EtapaProyecto {
        id: UUID
        etapa_id: UUID
        proyecto_id: UUID
        fecha_apertura_proyecto: timestamp
        fecha_cierre_proyecto: timestamp
        fecha_limite_entrega_proyecto: timestamp
        activa: boolean
        --
        asignarAProyecto()
        sobreescribirFechas()
    }
    
    class EtapasHistorial {
        id: UUID
        etapa_id: UUID
        accion: enum
        datos_antiguos: JSONB
        datos_nuevos: JSONB
        razon_cambio: text
        realizado_por: UUID
        fecha: timestamp
        --
        registrarCambio()
    }
    
    class Entrega {
        id: UUID
        proyecto_id: UUID
        etapa: string
        archivo_url: string
        archivo_nombre: string
        version: int
        estado_revision: enum
        fecha_subida: timestamp
        --
        validarEtapa()
        validarFechas()
        subir()
    }
    
    class Proyecto {
        id: UUID
        titulo: string
        estudiante_id: UUID
        tutor_id: UUID
        estado: enum
        fecha_entrega: date
        --
        crearProyecto()
        actualizarEstado()
    }
    
    Etapa "1" -- "*" EtapaProyecto : define
    Proyecto "1" -- "*" EtapaProyecto : tiene
    Etapa "1" -- "*" EtapasHistorial : registra cambios
    Proyecto "1" -- "*" Entrega : contiene
    Etapa "1" -- "*" Entrega : pertenece a
```

---

## 🔀 Diagrama de Secuencia - Flujo de Entrega con Validación de Etapa

```mermaid
sequenceDiagram
    participant Est as Estudiante
    participant FE as Frontend
    participant BE as Backend
    participant BD as Base de Datos
    
    Est->>FE: Intenta subir documento
    FE->>BE: POST /entregas (proyecto_id, etapa)
    
    BE->>BD: SELECT etapa WHERE nombre = etapa
    BD-->>BE: Datos de etapa
    
    BE->>BE: Validar estado etapa == 'abierta'
    alt Estado NO es 'abierta'
        BE-->>FE: ❌ Error: Etapa no abierta
        FE-->>Est: Mostrar error
    else Estado es 'abierta'
        BE->>BE: Validar fecha_actual >= fecha_apertura
        alt Fecha aún no abierta
            BE-->>FE: ❌ Error: Etapa no ha abierto
            FE-->>Est: Mostrar error
        else Fecha dentro de período
            BE->>BE: Validar fecha_actual <= fecha_cierre
            alt Fecha ya cerrada
                BE-->>FE: ❌ Error: Etapa cerrada
                FE-->>Est: Mostrar error
            else Fecha dentro de período
                BE->>BE: Validar fecha_actual <= fecha_limite
                alt Fuera de tiempo
                    alt permitir_entregas_fuera_tiempo == true
                        BE->>BD: INSERT entrega (FUERA DE TIEMPO)
                        BD-->>BE: ✅ Entrega creada
                        BE-->>FE: Entrega aceptada (advertencia)
                        FE-->>Est: ✅ Subido (fuera de límite)
                    else no permitir
                        BE-->>FE: ❌ Error: Límite excedido
                        FE-->>Est: Mostrar error
                    end
                else Dentro de límite
                    BE->>BD: INSERT entrega
                    BD-->>BE: ✅ Entrega creada
                    BE->>BD: INSERT bitacora
                    BD-->>BE: ✅ Bitácora registrada
                    BE-->>FE: ✅ Éxito
                    FE-->>Est: Documento subido correctamente
                end
            end
        end
    end
```

---

## 📊 Diagrama de Casos de Uso - Gestión de Etapas

```mermaid
graph TB
    Administrador[👨‍💼 Administrador]
    
    subgraph Casos["Casos de Uso - Gestión de Etapas"]
        UC1[Crear Etapa]
        UC2[Ver Etapas]
        UC3[Editar Etapa]
        UC4[Cambiar Estado Etapa]
        UC5[Archivar Etapa]
        UC6[Ver Historial Cambios]
        UC7[Asignar Etapa a Proyecto]
    end
    
    subgraph Automatico["Casos de Uso - Sistema"]
        UC8[Validar Entrega vs Etapa]
        UC9[Registrar en Historial]
        UC10[Bloquear/Permitir Entregas]
    end
    
    Administrador -->|Solo Admin| UC1
    Administrador -->|Solo Admin| UC2
    Administrador -->|Solo Admin| UC3
    Administrador -->|Solo Admin| UC4
    Administrador -->|Solo Admin| UC5
    Administrador -->|Solo Admin| UC6
    Administrador -->|Solo Admin| UC7
    
    UC2 -.->|Consulta| UC8
    UC3 -.->|Trigger| UC9
    UC4 -.->|Trigger| UC9
    UC8 -.->|Afecta| UC10
    
    style Administrador fill:#4CAF50,color:#fff
    style Casos fill:#E3F2FD
    style Automatico fill:#FFF3E0
```

---

### Actualización de Diagramas

Los diagramas deben actualizarse cuando:
- Se agreguen nuevas funcionalidades
- Se modifique el esquema de base de datos
- Se cambien los flujos de usuario
- Se actualice la arquitectura del sistema

---

**Última actualización:** 7 de enero de 2026  
**Versión del Sistema:** 1.1.0  
**Nuevo:** Sistema de Gestión de Etapas

