DESARROLLO DE UNA APLICACIÓN WEB PARA LA GESTIÓN Y SEGUIMIENTO DE PROYECTOS DE GRADO EN LA UNIVERSIDAD SALESIANA DE BOLIVIA, SEDE COCHABAMBA
Postulante: Josue Valentino Torrez Parra
Docente Guía: Lic. Elizabeth Delgadillo Camacho

COCHABAMBA – BOLIVIA
2025


DEDICATORIA

A mis padres, quienes con su esfuerzo y dedicación me han brindado las oportunidades para alcanzar mis metas académicas. Su apoyo incondicional ha sido el pilar fundamental en mi formación profesional.

A mi familia, por su comprensión y paciencia durante todos estos años de estudio, especialmente en los momentos más desafiantes de este proceso académico.

A todos aquellos que creyeron en mí y me motivaron a seguir adelante, incluso cuando las dificultades parecían insuperables.


AGRADECIMIENTOS

Expreso mi sincero agradecimiento a la Lic. Elizabeth Delgadillo Camacho, mi docente guía, por su valiosa orientación, paciencia y dedicación durante el desarrollo de este proyecto. Su experiencia y retroalimentación constante fueron fundamentales para la culminación de este trabajo.

A la Universidad Salesiana de Bolivia, Sede Cochabamba, por brindarme la oportunidad de formarme como profesional y por proporcionar los recursos necesarios para el desarrollo de este proyecto.

A los estudiantes, docentes tutores, revisores y personal administrativo de la Carrera de Ingeniería de Sistemas, quienes participaron activamente en las entrevistas y grupos focales, compartiendo sus experiencias y necesidades que permitieron identificar los requerimientos del sistema.

A mis compañeros de carrera, con quienes compartí conocimientos y experiencias durante estos años de formación universitaria.

Finalmente, agradezco a todos aquellos que de alguna manera contribuyeron al desarrollo de este proyecto de grado.


RESUMEN EJECUTIVO

El presente proyecto tiene como objetivo desarrollar una aplicación web para la gestión y seguimiento de proyectos de grado en la Universidad Salesiana de Bolivia, Sede Cochabamba. El sistema surge como respuesta a las limitaciones del proceso actual, caracterizado por métodos tradicionales y descentralizados que generan retrasos en la retroalimentación, pérdida de registros de observaciones y dificultades de coordinación entre tutores y estudiantes.

La solución propuesta se desarrollará utilizando tecnologías modernas de código abierto: React.js para el frontend y Neon como servicio de base de datos PostgreSQL serverless, que proporciona una base de datos escalable y de alto rendimiento. La metodología de desarrollo seleccionada es RAD (Rapid Application Development), que permite la construcción iterativa de prototipos y la validación continua con los usuarios finales.

El sistema contempla cuatro roles principales: estudiantes, tutores, revisores y administradores. Entre sus funcionalidades destacan el registro y asignación de proyectos, control de versiones de documentos, sistema de retroalimentación centralizado, notificaciones automáticas y generación de reportes. La implementación de esta plataforma digitalizará y optimizará el proceso de gestión de proyectos de grado, mejorando la eficiencia, transparencia y experiencia educativa de todos los actores involucrados.

El proyecto tiene un alcance temporal de 4 meses y se implementará específicamente en la Universidad Salesiana de Bolivia, Sede Cochabamba. Se espera que la solución contribuya significativamente a la modernización de los procesos académicos institucionales y sirva como base para futuras mejoras en la gestión educativa.


GLOSARIO Y LISTA DE ABREVIATURAS

API: Application Programming Interface (Interfaz de Programación de Aplicaciones)
Backend: Capa del servidor que maneja la lógica de negocio y el acceso a datos
Base de Datos: Conjunto organizado de datos almacenados de manera estructurada
DBMS: Database Management System (Sistema Gestor de Base de Datos)
Frontend: Capa de presentación e interacción con el usuario
HTTP: HyperText Transfer Protocol (Protocolo de Transferencia de Hipertexto)
IDE: Integrated Development Environment (Entorno de Desarrollo Integrado)
JWT: JSON Web Token (Token Web JSON)
LMS: Learning Management System (Sistema de Gestión del Aprendizaje)
PostgreSQL: Sistema gestor de bases de datos relacional de código abierto
Neon: Servicio de base de datos PostgreSQL serverless que proporciona una base de datos escalable, con branching automático y alta disponibilidad
Node.js: Entorno de ejecución de JavaScript del lado del servidor
RAD: Rapid Application Development (Desarrollo Rápido de Aplicaciones)
REST: Representational State Transfer (Transferencia de Estado Representacional)
SPA: Single Page Application (Aplicación de Página Única)
SQL: Structured Query Language (Lenguaje de Consulta Estructurado)
TIC: Tecnologías de la Información y la Comunicación
UI: User Interface (Interfaz de Usuario)
UX: User Experience (Experiencia de Usuario)
USB: Universidad Salesiana de Bolivia


















 


 
ÍNDICE DE CONTENIDO
Contenido                                                                                                      Pág.

1.	CAPÍTULO I	1
MARCO REFERENCIAL - INTRODUCCIÓN	1
1.1	INTRODUCCIÓN	2
1.2	ANTECEDENTES DE LA INVESTIGACIÓN	2
1.2.1	Antecedentes Generales	2
1.2.2	Antecedentes Específicos	3
1.3	ANTECEDENTES INSTITUCIONALES	4
1.4	CONCEPTOS ESPECÍFICOS DEL CASO DE ESTUDIO	4
1.5	MAPEO DE PROCESOS	5
1.6	DOCUMENTACIÓN E INFORMACIÓN DISPONIBLE	6
1.7	IDENTIFICACIÓN DEL PROBLEMA	8
1.7.1	PLANTEAMIENTO DEL PROBLEMA	8
1.7.1.1	Problemáticas Enfocadas por Actor	8
1.7.2	ÁRBOL DE PROBLEMAS	10
1.7.3	FORMULACIÓN DEL PROBLEMA	11
1.8	OBJETIVOS	11
1.8.1	Objetivo General	11
1.8.2	Objetivos Específicos	11
1.9	JUSTIFICACIÓN	12
1.9.1	Justificación Técnica	12
1.9.2	Justificación Económica	13
1.9.3	Justificación Social	13
1.10	METODOLOGÍA DE LA INVESTIGACIÓN	14
1.10.1	Enfoque	14
1.10.2	Tipo de Estudio y Método	15
1.11	Población y Muestra	16
1.11.1	Técnicas de Recolección de Información	17
1.11.1.1	Entrevistas	17
1.11.1.2	Observación Directa	18
1.11.1.3	Revisión Documental	18
1.11.1.4	Grupos Focales	19
1.12	Alcance	19
1.12.1	Alcance Temático	19
1.12.2	Alcance Geográfico	20
1.12.3	Alcance Temporal	20
1.13	Cronograma	21
2.	CAPÍTULO II	22
MARCO TEÓRICO	22
2.1	ÁREA DE CONOCIMIENTO DEL PROYECTO	23
2.1.1	Ingeniería de Software	23
2.1.2	Gestión de Proyectos	24
2.2	MARCO CONCEPTUAL	26
2.2.1	Aplicación Web	26
2.2.2	Desarrollo de Aplicación Web	27
2.2.3	Tecnologías Educativas	28
2.3	METODOLOGÍA DE DESARROLLO DE SOFTWARE	30
2.3.1	Concepto	30
2.3.2	Características	30
2.3.3	Ventajas	31
2.3.4	Fases	32
2.4	INGENIERÍA DE SOFTWARE	33
2.5	PLATAFORMA DE DESARROLLO	33
2.5.1	Arquitectura Cliente-Servidor	34
2.5.2	Características Técnicas	34
2.6	ADMINISTRADOR DE BASE DE DATOS	34
2.6.1	Base de Datos - Estructura	34
2.6.2	Tipos de Bases de Datos	35
2.6.3	Bases de Datos Relacional	35
2.6.4	PostgreSQL y Neon	36
2.7	Herramientas	36
2.7.1	Frontend	36
2.7.1.1	React.js	37
2.7.2	Backend	38
2.7.2.1	Neon - Características Principales	38
2.7.2.2	Neon - Ventajas	39
2.7.3	Control de Versiones: Git + GitHub	39
2.7.4	Pruebas y Calidad	40
2.7.4.1	Postman	40
2.7.5	Despliegue	41
3.	CAPÍTULO III	43
INGENIERÍA DEL PROYECTO – DESARROLLO DEL PROYECTO	43
3.1	METODOLOGÍA DE DESARROLLO	44
3.2	INSTRUMENTOS Y PROTOCOLOS DE RECOLECCIÓN DE INFORMACIÓN	44
4.	CAPÍTULO IV	45
CONCLUSIONES Y RECOMENDACIONES	45
4.1	Conclusiones	46
4.2	Recomendaciones	46




ÍNDICE DE TABLAS
Tabla 1 Tabla de Historias de Usuario para el proyecto……………………59









ÍNDICE DE FIGURAS
Figura 1 Árbol de Problemas…………….………………………….……………..5


 




1.	CAPÍTULO I
MARCO REFERENCIAL - INTRODUCCIÓN



	
1.1	INTRODUCCIÓN
La elaboración y seguimiento de los proyectos de grado constituye una de las etapas más cruciales en la formación profesional universitaria, ya que representa la culminación académica del estudiante y su primer aporte formal al campo del conocimiento. Este proceso sintetiza las competencias, conocimientos y habilidades adquiridos a lo largo de la carrera, funcionando como el puente esencial entre la vida estudiantil y el ejercicio profesional.
En la Universidad Salesiana de Bolivia, Sede Cochabamba, este proceso terminal se gestiona mediante métodos tradicionales y descentralizados, basados en comunicación por correo electrónico, mensajería instantánea y entrega física de documentos. Esta realidad genera una serie de obstáculos significativos, como retrasos en la retroalimentación, pérdida de registros de observaciones, dificultades de coordinación entre tutores y estudiantes, y una limitada trazabilidad documental.
Frente a esta problemática, el presente proyecto propone el desarrollo e implementación de una aplicación web centralizada que permita digitalizar, optimizar y dar seguimiento a la gestión de proyectos de grado. La solución tecnológica no solo busca resolver las ineficiencias actuales, sino también alinearse con las tendencias de transformación digital en la educación superior, mejorando la transparencia, la eficiencia y la experiencia educativa de todos los actores involucrados: estudiantes, tutores, revisores y la jefatura de carrera.
1.2	ANTECEDENTES DE LA INVESTIGACIÓN
1.2.1	Antecedentes Generales
La transformación digital en la educación superior a nivel global y regional ha evidenciado el impacto positivo de las aplicaciones web en la gestión académica. Estudios recientes en Latinoamérica señalan que la implementación de este tipo de soluciones incrementa hasta en un 65% la eficiencia en los procesos de investigación, mejora la transparencia institucional y reduce significativamente el margen de error humano en el control de documentos (Gómez & Vargas, 2022).
La UNESCO (2023) destaca que la digitalización de procesos universitarios es un factor determinante para incrementar la eficiencia, la equidad en el acceso y la calidad formativa. Asimismo, se ha demostrado que las plataformas web de gestión de proyectos de investigación y tesis permiten una comunicación más fluida entre estudiantes y tutores, garantizando un seguimiento cercano y efectivo. Esta tendencia hacia la digitalización y centralización de los procesos académicos se consolida como una respuesta necesaria para las instituciones que buscan mantenerse competitivas y ofrecer un servicio educativo de calidad.
1.2.2	Antecedentes Específicos
A nivel internacional, universidades como la Universidad de Chile y la Pontificia Universidad Javeriana de Colombia han implementado exitosamente plataformas web para el seguimiento de tesis y trabajos de titulación. Estos sistemas incluyen funciones avanzadas como control de versiones de documentos, registro de entregas y retroalimentación en línea, reportando una disminución significativa en los tiempos de revisión y un aumento notable en la satisfacción de estudiantes y docentes (Paredes & Ruiz, 2021).
En el contexto nacional boliviano, instituciones como la Universidad Católica Boliviana (UCB) y la Universidad Mayor de San Simón (UMSS) —esta última a través de su plataforma DICYT dependiente del Vicerrectorado de Investigación y Desarrollo— han iniciado procesos similares, incorporando módulos digitales para la gestión de proyectos de grado y posgrado. La adopción de estas herramientas tecnológicas especializadas evidencia una tendencia nacional creciente hacia la modernización de los procesos académicos, orientada a mejorar la eficiencia, la transparencia y la calidad de la investigación universitaria.
El rezago tecnológico en instituciones que mantienen sistemas manuales de gestión representa una desventaja frente a estos estándares actuales. Por lo tanto, el desarrollo de una aplicación web integral para la Universidad Salesiana de Bolivia no solo responde a una necesidad institucional urgente, sino que se alinea con las mejores prácticas y experiencias documentadas en el ámbito de la educación superior.
1.3	ANTECEDENTES INSTITUCIONALES
La Universidad Salesiana de Bolivia (USB), sede Cochabamba, es una institución de educación superior comprometida con la formación integral de profesionales, basándose en los principios del Sistema Preventivo de Don Bosco. La Carrera de Ingeniería de Sistemas, dentro de esta casa de estudios, tiene como misión formar ingenieros con capacidad de innovación, liderazgo y responsabilidad social.
Sin embargo, en el proceso específico de gestión y seguimiento de proyectos de grado, la institución opera con metodologías tradicionales que no se condicen con su visión de formar profesionales competitivos y adaptados a las exigencias tecnológicas actuales. La falta de una plataforma unificada ha generado una dependencia de procesos manuales que impactan directamente en la eficiencia del proceso de titulación, afectando a estudiantes, docentes y a la gestión administrativa de la carrera. Este proyecto busca, por tanto, ser un catalizador para la modernización de un proceso académico crítico dentro de la USB, fortaleciendo su misión institucional a través de la innovación tecnológica.
1.4	CONCEPTOS ESPECÍFICOS DEL CASO DE ESTUDIO
Para una comprensión precisa del ámbito de aplicación del presente proyecto, se definen los siguientes conceptos fundamentales que constituyen el vocabulario base del sistema:
Proyecto de Grado: Trabajo de investigación o desarrollo que realiza el estudiante como requisito final para optar al título profesional. Constituye la aplicación integrada de los conocimientos adquiridos durante la formación universitaria y es supervisado por un tutor asignado.
Tutor/Docente Guía: Docente responsable de orientar, asesorar y realizar el seguimiento continuo del estudiante durante el desarrollo de su proyecto de grado. Su función principal es garantizar la calidad académica y metodológica del trabajo.
Revisor: Docente especializado designado para evaluar el proyecto de grado en sus diferentes etapas, emitiendo observaciones y conceptos sobre el cumplimiento de los requisitos establecidos.
Etapas del Proyecto de Grado: Fases secuenciales definidas en el reglamento institucional para el desarrollo de los proyectos. Generalmente incluyen: anteproyecto, entrega parciales, versión final y sustentación.
Retroalimentación: Conjunto de observaciones, correcciones y sugerencias realizadas por tutores y revisores sobre los documentos entregados por los estudiantes, con el fin de mejorar la calidad del trabajo.
Control de Versiones: Mecanismo sistemático para registrar y gestionar los cambios realizados en los documentos del proyecto, permitiendo mantener un historial de modificaciones y recuperar estados anteriores.
Seguimiento: Proceso de monitoreo continuo del avance del proyecto de grado, que incluye la verificación del cumplimiento de cronogramas, entregas y la calidad de los contenidos.
1.5	MAPEO DE PROCESOS
El análisis del proceso actual de gestión de proyectos de grado en la Universidad Salesiana de Bolivia permite identificar el siguiente flujo, caracterizado por su descentralización y dependencia de herramientas no integradas:
Proceso Actual Identificado:
1.	Inscripción del Proyecto: El estudiante presenta formalmente su propuesta de proyecto mediante formato físico en la jefatura de carrera.
2.	Asignación de Tutor: La jefatura de carrera asigna un tutor al proyecto, notificando al estudiante y docente involucrados.
3.	Desarrollo con Tutorías: El estudiante desarrolla su proyecto manteniendo comunicación principalmente a través de:
o	Correo electrónico para envío de avances
o	Mensajería instantánea (WhatsApp) para consultas rápidas
o	Reuniones presenciales esporádicas
4.	Entregas Parciales: El estudiante envía versiones preliminares del documento a su tutor por correo electrónico, recibiendo observaciones por el mismo medio o en documentos adjuntos.
5.	Revisión por Pares: Una vez el tutor considera el documento listo, se asigna uno o más revisores, quienes reciben el documento por correo electrónico y devuelven sus observaciones por medios diversos.
6.	Correcciones y Reenvíos: El estudiante integra las observaciones y envía nuevas versiones, generándose múltiples archivos con nombres diferentes (ej: "Proyecto_v1.docx", "Proyecto_v2_corregido.docx", "Proyecto_FINAL.docx").
7.	Aprobación Final: Cuando todas las observaciones han sido atendidas, el proyecto se aprueba para sustentación.
8.	Sustentación y Archivado: El estudiante sustenta su trabajo y el documento final se archiva en formato físico.
Problemas Identificados en el Mapeo:
•	Falta de un canal unificado de comunicación
•	Pérdida del historial de observaciones y versiones
•	Dificultad para identificar el estado actual de cada proyecto
•	Duplicidad de esfuerzos en la gestión documental
•	Ausencia de notificaciones automatizadas de recordatorio
1.6	DOCUMENTACIÓN E INFORMACIÓN DISPONIBLE
Para el desarrollo del presente proyecto se ha recopilado y analizado la siguiente documentación e información:
Documentación Institucional Formal:
•	Reglamento de Proyectos de Grado de la Universidad Salesiana de Bolivia, Sede Cochabamba
•	Manual de Procedimientos Académicos de la USB
•	Formatos oficiales para presentación de anteproyectos y proyectos de grado
•	Cronogramas académicos de la carrera de Ingeniería de Sistemas
Fuentes de Información Primaria:
•	Entrevistas semiestructuradas con:
o	Estudiantes de la carrera de Ingeniería de Sistemas en fase de proyecto de grado
o	Docentes tutores con experiencia en dirección de proyectos de grado
o	Jefatura de carrera de Ingeniería de Sistemas
•	Observación directa del proceso actual de gestión
•	Registros de comunicación (ejemplos de hilos de correo electrónico, mensajes)
Repositorio de Datos:
•	Base de datos de proyectos de grado de cohortes anteriores (en formato físico)
•	Estadísticas de tiempos promedio de titulación
•	Registros de asignación de tutores y revisores
Esta documentación ha permitido comprender a profundidad el contexto operativo, las necesidades específicas de los usuarios y los requisitos funcionales y no funcionales que debe satisfacer el sistema propuesto.
1.7	IDENTIFICACIÓN DEL PROBLEMA
1.7.1	PLANTEAMIENTO DEL PROBLEMA
El sistema actual de gestión de proyectos de grado en la Universidad Salesiana de Bolivia presenta dificultades que afectan tanto a los estudiantes como a los tutores y revisores. El proceso de seguimiento se basa en correos electrónicos, mensajería instantánea y entregas físicas, lo cual genera retrasos en la retroalimentación, pérdida de registros de observaciones y falta de control sobre los avances realizados. Esto dificulta que los tutores realicen un seguimiento ordenado de cada estudiante y que los revisores identifiquen los cambios realizados en cada versión del trabajo. Como consecuencia, los estudiantes experimentan retrasos en la validación de sus avances, lo que prolonga innecesariamente el proceso de titulación. 
1.7.1.1	Problemáticas Enfocadas por Actor
	Desde el punto de vista del ESTUDIANTE
•	Falta de claridad en el proceso:
No existe un flujo definido y visible para la entrega, revisión y corrección de los proyectos de grado, lo que genera confusión y retrasos.
•	Dificultad para recibir retroalimentación oportuna:
La comunicación con tutores y revisores se realiza principalmente por correo electrónico o mensajería instantánea, lo que ocasiona demoras en las respuestas y pérdida de observaciones.
•	Pérdida del historial de revisiones:
No hay un registro centralizado de las versiones anteriores del documento, lo que dificulta seguir el progreso y recuperar observaciones pasadas.
•	Falta de trazabilidad en el avance:
No se cuenta con un sistema que muestre de manera clara en qué etapa del proyecto se encuentra, qué entregas están pendientes y cuáles han sido aprobadas.
•	Comunicación fragmentada:
La interacción con tutores, revisores y coordinación se da en diferentes canales (correo, WhatsApp, reuniones presenciales), lo que dificulta la organización y seguimiento.
	Desde el punto de vista del DOCENTE (Tutor/Revisor)
•	Sobrecarga administrativa:
La gestión manual de proyectos (recepción, revisión, registro de observaciones) consume tiempo que podría dedicarse a la asesoría académica.
•	Falta de estandarización en el proceso:
Cada tutor o revisor lleva su propio método de revisión y comunicación, lo que genera inconsistencias en la evaluación y seguimiento.
•	Dificultad para gestionar varios proyectos simultáneamente:
No existe una herramienta que permita visualizar de manera organizada el estado de todos los proyectos asignados.
•	Pérdida de observaciones y retroalimentación:
Al no contar con un registro centralizado, las correcciones y comentarios realizados en diferentes versiones del documento se pierden o duplican.
•	Falta de notificaciones automatizadas:
No se reciben alertas sobre nuevas entregas, plazos vencidos o recordatorios de revisión, lo que afecta la oportunidad de la retroalimentación.
	Desde el punto de vista de la JEFA DE CARRERA
•	Falta de visibilidad del estado general de los proyectos:
No se cuenta con reportes que permitan monitorear el avance de todos los proyectos de grado en tiempo real.
•	Dificultad para la toma de decisiones:
La falta de datos consolidados (estadísticas de avance, tiempos promedio de titulación, tasa de retrasos) impide implementar mejoras en el proceso.
•	Ineficiencia en la asignación de tutores y revisores:
La asignación de tutores y revisores presenta desafíos por la descoordinación entre la disponibilidad de los docentes y sus especialidades, lo que impacta negativamente en la calidad del acompañamiento académico.
•	Falta de trazabilidad institucional:
No hay un registro histórico digital de los proyectos de grado, lo que dificulta la auditoría académica y la generación de informes para acreditación.
•	Comunicación no formalizada con estudiantes y docentes:
La comunicación con estudiantes y docentes carece de formalización, lo que dificulta la coordinación general y la efectividad en la transmisión de notificaciones y recordatorios institucionales.





1.7.2	ÁRBOL DE PROBLEMAS
Figura 1
Árbol de Problemas
 
Nota: Diagrama de árbol de problemas con sus causas y efectos.
1.7.3	FORMULACIÓN DEL PROBLEMA
¿Cómo desarrollar una aplicación web que permita digitalizar, centralizar y optimizar la gestión, el seguimiento y la revisión de proyectos de grado en la Universidad Salesiana de Bolivia, sede Cochabamba?
1.8	OBJETIVOS
1.8.1	Objetivo General
Desarrollar una aplicación web para la gestión y seguimiento de proyectos de grado en la Universidad Salesiana de Bolivia, sede Cochabamba, que centralice entregas, registre avances, detecte cambios en documentos y facilite la comunicación entre estudiantes, tutores y revisores, optimizando el proceso de titulación.
1.8.2	Objetivos Específicos
•	Diseñar la arquitectura del sistema integral, considerando base de datos, interfaz de usuario y roles de acceso (estudiante, tutor, revisor, administrador).
•	Desarrollar un módulo para el registro de proyectos de grado, asignación de tutores y control de avances.
•	Implementar un sistema de control de versiones que permita identificar y comparar los cambios realizados en los documentos entregados por los estudiantes.
•	Desarrollar un módulo de retroalimentación que registre las observaciones realizadas por tutores y revisores, garantizando trazabilidad en el proceso.
•	Integrar notificaciones y reportes automáticos para estudiantes y docentes sobre las tareas pendientes y cumplidas.
•	Realizar pruebas de validación del sistema con estudiantes, tutores y administrativos para garantizar su correcto funcionamiento antes de la implementación final.
1.9	JUSTIFICACIÓN
1.9.1	Justificación Técnica
El desarrollo de la aplicación web se sustenta en la selección de un stack tecnológico moderno, robusto y de código abierto, que garantiza la viabilidad técnica del proyecto y su sostenibilidad a largo plazo. La arquitectura propuesta se basa en el modelo cliente-servidor, separando claramente las responsabilidades entre el frontend y el backend para facilitar el desarrollo, el mantenimiento y la escalabilidad futura del sistema.
Para el frontend, se empleó React.js 18 con TypeScript, una biblioteca de JavaScript mantenida por Meta (Facebook) que permite construir interfaces de usuario dinámicas, reactivas y de alta usabilidad mediante componentes reutilizables. La implementación utiliza TypeScript para proporcionar tipado estático, mejorando la detección de errores en tiempo de desarrollo y facilitando el mantenimiento del código. React.js, junto con Vite como herramienta de construcción, HTML5 y CSS3, asegura una experiencia de usuario (UX) fluida y un diseño adaptable (responsive design), permitiendo el acceso a la plataforma desde cualquier dispositivo con navegador web, ya sea computadoras de escritorio, tablets o smartphones.
Para el backend, se implementó Node.js con Express.js y TypeScript, proporcionando una API REST robusta y escalable. La base de datos se gestiona mediante Neon como servicio de base de datos PostgreSQL serverless, que proporciona una solución escalable y de alto rendimiento. Neon ofrece una base de datos PostgreSQL robusta con escalado automático, branching de base de datos para desarrollo y pruebas, backups automáticos y connection pooling integrado. Esta solución simplifica la gestión de la base de datos y acelera el tiempo de desarrollo al eliminar la necesidad de configurar y mantener la infraestructura de base de datos. El uso de TypeScript en el backend proporciona los mismos beneficios de tipado estático que en el frontend, mejorando la calidad y mantenibilidad del código del servidor.

La gestión de datos se realizará mediante PostgreSQL, un sistema de gestión de bases de datos relacional (RDBMS) de código abierto reconocido por su robustez, cumplimiento con estándares SQL y excelente rendimiento. PostgreSQL, alojado y gestionado por Neon, garantiza la integridad y consistencia de la información de los proyectos de grado, tutores, estudiantes y revisiones, mientras que las APIs REST permiten una integración fluida con el frontend React.
Una justificación técnica clave es la implementación de un sistema de control de versiones integrado con bitácoras detalladas, que permite rastrear automáticamente los cambios realizados en los documentos entregados por los estudiantes. Esta funcionalidad, combinada con un módulo de retroalimentación centralizado y un sistema de comparación de versiones, resuelve uno de los problemas principales identificados: la pérdida del historial de revisiones y la falta de trazabilidad. El sistema de bitácoras implementado registra todas las acciones realizadas con información detallada almacenada en formato JSONB, proporcionando trazabilidad completa del proceso.
Al tratarse de tecnologías open source, no se requerirá la adquisición de costosas licencias comerciales, lo que reduce significativamente los costos de implementación y garantiza la libertad de uso, modificación y distribución. Además, la amplia documentación y comunidad activa detrás de cada una de estas herramientas proporciona un sólido respaldo técnico, facilitando la resolución de problemas y la capacitación del personal que dará mantenimiento al sistema en el futuro. La combinación de estos elementos técnicos constituye una base sólida para el desarrollo de una aplicación web segura, eficiente y alineada con los estándares actuales de desarrollo de software.
1.9.2	Justificación Económica
La implementación del sistema no representará gastos, ya que se desarrollará con tecnologías open source que reducen significativamente los costos de licenciamiento. Asimismo, la digitalización de los procesos permitirá disminuir el uso de papel y optimizar los tiempos de revisión, lo que se traduce en ahorro de recursos para la universidad y los estudiantes. Además, la automatización de tareas reducirá la carga administrativa, evitando costos adicionales en personal de apoyo para el seguimiento manual de proyectos de grado.
1.9.3	Justificación Social
La implementación de esta aplicación web responde a necesidades sociales concretas dentro de la comunidad universitaria de la Universidad Salesiana de Bolivia, sede Cochabamba, al abordar problemáticas que afectan directamente la experiencia educativa de estudiantes, docentes y autoridades.
Para los estudiantes, la aplicación representa una herramienta de equidad y acompañamiento continuo. Al contar con un sistema centralizado que clarifica las etapas del proyecto de grado, establece plazos definidos y mantiene un historial permanente de revisiones, se reduce la ansiedad e incertidumbre que caracterizan este proceso académico. Los estudiantes de contextos más vulnerables, quienes a menudo tienen limitaciones de tiempo por actividades laborales o familiares, se benefician particularmente de un sistema que les permite gestionar su proyecto de grado de manera organizada y con retroalimentación previsible, igualando sus oportunidades frente a compañeros con mayor disponibilidad horaria.
Para los docentes tutores y revisores, la aplicación reduce la sobrecarga laboral asociada a la gestión manual de proyectos. Al eliminar la necesidad de coordinar por múltiples canales informales y revisar versiones desorganizadas de documentos, los docentes pueden dedicar más tiempo a la asesoría de fondo, mejorando la calidad de la orientación pedagógica. Esto revaloriza su labor tutorial y contribuye a un clima laboral más satisfactorio.
Para la jefatura de carrera, el sistema ofrece transparencia y capacidad de acción. Al disponer de datos consolidados sobre el estado de todos los proyectos de grado, se pueden identificar cuellos de botella, apoyar a estudiantes en riesgo de retraso y distribuir de manera más equitativa la carga de trabajo entre los docentes. Esto se traduce en una gestión académica más humana y eficiente.
Finalmente, al formalizar y digitalizar un proceso académico crítico, la Universidad fortalece su compromiso con una educación de calidad y se adapta a las expectativas de una generación de nativos digitales, fomentando una cultura institucional de orden, transparencia y innovación que beneficia a toda la comunidad salesiana. 
1.9.4	Justificación Académica/Científica
El desarrollo de este proyecto de grado representa una contribución significativa al campo de la Ingeniería de Sistemas y las Tecnologías Educativas, al abordar un problema real y relevante mediante la aplicación sistemática de conocimientos teóricos y prácticos adquiridos durante la formación universitaria.

Desde la perspectiva académica, este trabajo integra múltiples áreas de conocimiento: ingeniería de software, bases de datos, desarrollo web, gestión de proyectos y diseño de interfaces de usuario. La aplicación de estos conocimientos en un contexto real fortalece las competencias profesionales del estudiante y demuestra la capacidad de resolver problemas complejos mediante soluciones tecnológicas innovadoras.

Científicamente, el proyecto aporta al conocimiento existente sobre la digitalización de procesos académicos en instituciones de educación superior bolivianas. Aunque existen experiencias documentadas en universidades de otros países latinoamericanos, la implementación específica en el contexto de la Universidad Salesiana de Bolivia permite generar conocimiento local sobre los desafíos, oportunidades y resultados de la transformación digital en procesos de gestión de proyectos de grado.

El proyecto sigue una metodología estructurada de investigación aplicada, que incluye la identificación sistemática de problemas, el análisis de requerimientos mediante técnicas cualitativas y cuantitativas, el diseño de arquitectura basado en mejores prácticas de la industria, y la validación con usuarios finales. Este enfoque metodológico riguroso garantiza que el producto desarrollado no solo sea funcional, sino que también cumpla con estándares de calidad y se alinee con las necesidades reales de los usuarios.

Adicionalmente, el proyecto genera documentación técnica valiosa que puede servir como referencia para futuros desarrollos similares, contribuyendo así al acervo de conocimiento en el área de sistemas de gestión académica. La experiencia adquirida durante el desarrollo y los resultados obtenidos pueden ser compartidos con la comunidad académica a través de publicaciones o presentaciones, ampliando el impacto del trabajo más allá del ámbito institucional inmediato.
1.10	METODOLOGÍA DE LA INVESTIGACIÓN 
1.10.1	Enfoque
El presente proyecto se enfoca exclusivamente en el desarrollo de una aplicación web para la gestión y seguimiento de proyectos de grado en la Carrera de Ingeniería de Sistemas de la Universidad Salesiana de Bolivia, Sede Cochabamba. El alcance se limita a esta institución y carrera específica, sin considerar otras carreras o sedes de la universidad en esta fase inicial.

El enfoque del proyecto es práctico y aplicado, orientado a resolver un problema concreto identificado en el proceso actual de gestión de proyectos de grado. No se contempla la integración con otros sistemas institucionales existentes (como sistemas de matrícula o plataformas de gestión académica general), sino que se desarrollará como una solución independiente y autónoma que puede ser integrada en el futuro si se considera necesario.

El proyecto se centra en los procesos de gestión documental, comunicación y seguimiento entre estudiantes, tutores y revisores, sin abordar aspectos relacionados con la evaluación académica formal, la asignación de calificaciones o la gestión de sustentaciones, los cuales permanecen bajo la responsabilidad de los procesos administrativos tradicionales de la universidad.
1.10.2	Tipo de Estudio y Método
Tipo de Estudio:
El presente proyecto se enmarca como una investigación aplicada de tipo descriptivo-explicativa y con un diseño de estudio de caso, centrado en el proceso de gestión de proyectos de grado de la Carrera de Ingeniería de Sistemas de la Universidad Salesiana de Bolivia, Sede Cochabamba.
•	Aplicada: Porque busca resolver un problema concreto mediante el desarrollo de un producto tecnológico (la aplicación web).
•	Descriptiva-Explicativa: Ya que no solo identifica y describe las características del proceso actual, sino que también analiza las causas y efectos de las problemáticas detectadas.
•	Estudio de caso: Al concentrarse en una institución y proceso específicos, permitiendo un análisis en profundidad.
Método:
Se adopta un enfoque mixto (cualitativo y cuantitativo), combinando:
•	Método cualitativo: Para comprender las experiencias, percepciones y necesidades de los actores mediante entrevistas y observación directa.
•	Método cuantitativo: Para el análisis de datos estadísticos sobre tiempos de titulación, número de proyectos y eficiencia del proceso.
La metodología de desarrollo de software seleccionada es RAD (Rapid Application Development), la cual se alinea con el tipo de investigación al permitir la construcción iterativa de prototipos y la validación continua con los usuarios finales, integrando así el feedback cualitativo en el proceso de desarrollo cuantificable.
1.11	Población y Muestra
Población:
La población objetivo está constituida por todos los actores involucrados directa o indirectamente en el proceso de gestión de proyectos de grado en la Carrera de Ingeniería de Sistemas de la Universidad Salesiana de Bolivia, Sede Cochabamba, lo que incluye:
•	Estudiantes: 85 estudiantes activos de la carrera que están en fase de proyecto de grado o la iniciarán próximamente.
•	Docentes Tutores: 15 docentes de la carrera con experiencia en dirección de proyectos de grado.
•	Revisores: 10 docentes adicionales que participan en comisiones de evaluación.
•	Personal Administrativo: 3 personas de la jefatura de carrera y coordinación académica.
Total población: 113 personas.
Muestra:
Dada la naturaleza del proyecto y la necesidad de contar con representantes de todos los perfiles de usuario para la validación del sistema, se empleará un muestreo no probabilístico intencional por criterios, seleccionando actores clave que representen las diferentes perspectivas del proceso.
La muestra estará compuesta por:
Perfil	Tamaño Muestra	Criterios de Selección
Estudiantes	15	Que estén desarrollando actualmente su proyecto de grado
Tutores	8	Con al menos 2 años de experiencia en dirección de proyectos
Revisores	5	Que hayan participado en comisiones de evaluación recientemente
Jefatura de Carrera	2	Responsables directos del proceso
Total muestra	30	
Justificación de la Muestra:
El tamaño y composición de la muestra permitirá:
•	Obtener información representativa de todos los actores del proceso
•	Validar los diferentes módulos del sistema según los roles de usuario
•	Garantizar la diversidad de experiencias y perspectivas
•	Realizar pruebas de usabilidad con usuarios reales durante el desarrollo iterativo
La participación de esta muestra será fundamental durante las fases de recolección de requisitos, pruebas de prototipos y validación final del sistema desarrollado.
1.11.1	Técnicas de Recolección de Información
Para comprender las necesidades del sistema, se emplearán las siguientes técnicas:
1.11.1.1	Entrevistas
•	Definición: 
Las entrevistas son una técnica de investigación cualitativa que consiste en una interacción dialogada entre un entrevistador y uno o varios entrevistados, con el propósito de recopilar información, experiencias, opiniones y percepciones sobre un tema específico. Se caracterizan por seguir un protocolo preestablecido que puede variar en su grado de estructuración, desde formatos totalmente estandarizados hasta aproximaciones flexibles que permiten profundizar en aspectos emergentes durante la conversación.
•	Momento de uso: 
Esta técnica es particularmente adecuada cuando se requiere obtener información detallada y en profundidad sobre experiencias individuales, perspectivas personales o procesos complejos que necesitan ser explorados mediante el diálogo directo. Es óptima para investigar temas sensibles, recoger narrativas personales o acceder a conocimiento especializado que solo poseen ciertos informantes clave.
1.11.1.2	Observación Directa
•	Definición: 
La observación directa es una técnica de recolección de datos que implica el registro sistemático y objetivo de comportamientos, fenómenos, procesos y interacciones tal como ocurren en su contexto natural, sin manipulación por parte del investigador. Esta metodología permite capturar la realidad en su manifestación espontánea, proporcionando insights sobre prácticas, rutinas y dinámicas que pueden no ser evidentes mediante otras técnicas de investigación.
•	Momento de uso: 
Esta técnica resulta especialmente valiosa cuando existe discrepancia potencial entre lo que las personas dicen hacer y lo que realmente practican, o cuando se necesita comprender procesos en su contexto real de ejecución. Es ideal para estudiar comportamientos no verbales, interacciones grupales naturales, secuencias de actividades y aspectos del entorno que influyen en el fenómeno estudiado.
1.11.1.3	Revisión Documental
•	Definición: 
La revisión documental es una técnica de investigación que consiste en el análisis sistemático, crítico y exhaustivo de documentos existentes relacionados con el objeto de estudio. Comprende el examen de materiales escritos, audiovisuales o digitales que contienen información relevante, con el fin de extraer datos, identificar patrones, contextualizar el problema y fundamentar teóricamente la investigación. Esta técnica aprovecha fuentes secundarias para construir conocimiento sin necesidad de generar datos primarios.
•	Momento de uso: 
Esta metodología es particularmente útil en las etapas iniciales de una investigación, cuando se requiere contextualizar el problema dentro de un marco teórico y normativo existente. Es indispensable cuando se necesita comprender la evolución histórica de un fenómeno, acceder a información institucional formal, o identificar experiencias previas documentadas sobre temas similares.


1.11.1.4	Grupos Focales
•	Definición: 
Los grupos focales son una técnica de investigación cualitativa que reúne a un conjunto de participantes seleccionados bajo criterios específicos, guiados por un moderador en una discusión grupal estructurada alrededor de temas predeterminados. La dinámica interactiva del grupo permite explorar actitudes, percepciones, experiencias y reacciones colectivas, generando datos a través del intercambio de ideas, el debate y la construcción conjunta de significados entre los participantes.
•	Momento de uso: 
Esta técnica es especialmente efectiva cuando se busca comprender perspectivas colectivas, explorar la diversidad de opiniones sobre un tema, o generar ideas a través de la interacción grupal. Es óptima para investigar cómo se construyen socialmente las percepciones, identificar consensos y disensos, o validar conceptos y propuestas mediante la retroalimentación grupal.
1.12	Alcance
1.12.1	Alcance Temático
El proyecto se enfoca en el desarrollo de una aplicación web para gestionar los proyectos de grado en la Universidad Salesiana de Bolivia. El sistema permitirá:
•	Registrar proyectos de grado y asignar tutores y revisores.
•	Gestionar entregas y avances de las etapas.
•	Detectar y comparar cambios realizados en los documentos enviados.
•	Centralizar la retroalimentación de tutores y revisores.
•	Mostrar reportes de tareas cumplidas y pendientes.


1.12.2	Alcance Geográfico
El sistema será implementado en la Universidad Salesiana de Bolivia, sede Cochabamba, ubicada en Colcapirhua, barrio Kami.
 
Nota: La ubicación de la Universidad Salesiana de Bolivia, sede Cochabamba. 
1.12.3	Alcance Temporal 
El proyecto tiene una delimitación temporal específica de 4 meses, que abarca desde el inicio de la fase del análisis de requerimientos y desarrollo hasta la finalización de la etapa de pruebas de validación del prototipo.





1.13	Cronograma

El desarrollo del proyecto se ha planificado en un período de 4 meses, estructurado en fases que permiten la construcción iterativa del sistema y la validación continua con los usuarios. El cronograma se presenta a continuación:

Fase 1: Análisis y Diseño (Semanas 1-4)
•	Recolección de requerimientos mediante entrevistas y grupos focales
•	Análisis de procesos actuales y definición de procesos mejorados
•	Diseño de la arquitectura del sistema
•	Diseño del modelo de base de datos
•	Diseño de interfaces de usuario (wireframes y mockups)
•	Definición de casos de uso y flujos de trabajo

Fase 2: Desarrollo Backend (Semanas 5-8)
•	Configuración del entorno de desarrollo
•	Configuración del proyecto en Neon
•	Diseño e implementación del esquema de base de datos PostgreSQL
•	Configuración de autenticación y políticas de seguridad (RLS)
•	Configuración de almacenamiento de archivos para documentos
•	Desarrollo de módulos de gestión de proyectos, usuarios y entregas
•	Implementación del sistema de control de versiones
•	Pruebas unitarias del backend

Fase 3: Desarrollo Frontend (Semanas 9-12)
•	Configuración del proyecto React.js
•	Desarrollo de componentes de interfaz de usuario
•	Implementación de rutas y navegación
•	Integración con APIs del backend
•	Desarrollo de módulos por rol (estudiante, tutor, revisor, administrador)
•	Implementación de notificaciones y reportes
•	Optimización de rendimiento y diseño responsive

Fase 4: Pruebas e Implementación (Semanas 13-16)
•	Pruebas de integración frontend-backend
•	Pruebas de usabilidad con usuarios finales
•	Corrección de errores y ajustes basados en feedback
•	Documentación técnica y de usuario
•	Despliegue en entorno de producción
•	Capacitación a usuarios finales
•	Entrega final del proyecto

El cronograma contempla hitos de revisión cada 4 semanas, donde se presentan avances al docente guía y se recibe retroalimentación para ajustar el desarrollo según sea necesario. Esta estructura permite mantener el proyecto dentro del plazo establecido y garantizar la calidad del producto final.




 




2.	CAPÍTULO II
MARCO TEÓRICO











2.1	ÁREA DE CONOCIMIENTO DEL PROYECTO
El presente proyecto se encuentra en el área de conocimiento del desarrollo web dentro del campo de la Ingeniería de Sistemas. Este enfoque permite aplicar principios de ingeniería de software, bases de datos, diseño de interfaces y gestión de proyectos para construir soluciones tecnológicas que optimicen procesos académico-administrativos.
2.1.1	Ingeniería de Software
La Ingeniería de Software es una disciplina que aplica principios, métodos, herramientas y técnicas de la ingeniería para el desarrollo sistemático de software de calidad, considerando restricciones de tiempo, costo y recursos (Pressman, 2010). Se distingue de la simple programación por su enfoque estructurado y metódico, orientado a la producción de sistemas confiables, eficientes y mantenibles.
Para este proyecto, la Ingeniería de Software constituye el pilar fundamental, ya que provee el marco para transformar el problema identificado la gestión descentralizada de proyectos de grado en una solución software efectiva. Su aplicación se manifiesta en varias dimensiones:
•	Ciclo de Vida del Software: 
El desarrollo sigue un proceso estructurado que comprende las siguientes fases:
o	Análisis de Requisitos: Identificación y documentación detallada de las necesidades de todos los actores (estudiantes, tutores, revisores, jefatura de carrera).
o	Diseño del Sistema: Definición de la arquitectura cliente-servidor, el modelo de datos relacional, los flujos de interacción (UX) y las interfaces de usuario (UI).
o	Implementación o Desarrollo: Construcción del sistema mediante la codificación de los componentes frontend y backend utilizando las tecnologías seleccionadas.
o	Pruebas: Ejecución de pruebas unitarias, de integración y de aceptación con usuarios finales para validar el correcto funcionamiento y la usabilidad.
o	Implementación y Despliegue: Puesta en producción de la aplicación en un entorno accesible para la universidad.
o	Mantenimiento: Fase posterior al despliegue que incluye la corrección de errores, la adaptación a nuevos requisitos y las mejoras evolutivas.
•	Metodologías de Desarrollo:
Se ha seleccionado la metodología RAD (Rapid Application Development) por su adecuación a proyectos con plazos acotados y su énfasis en la retroalimentación continua del usuario. RAD permite, mediante prototipos iterativos, asegurar que el producto final se ajuste con precisión a las expectativas y procesos reales de la universidad.
•	Calidad del Software:
La calidad será un atributo perseguido a lo largo de todo el desarrollo. Se tomará como referencia el modelo de calidad establecido en la norma ISO/IEC 25010, el cual evalúa características como la funcionalidad (idoneidad, exactitud), fiabilidad (tolerancia a fallos), usabilidad (facilidad de aprendizaje, operación), rendimiento (tiempo de respuesta), mantenibilidad (modularidad, reutilización) y seguridad (protección de la información).
2.1.2	Gestión de Proyectos
La Gestión de Proyectos es la aplicación de conocimientos, habilidades, herramientas y técnicas a las actividades de un proyecto para satisfacer sus requisitos (PMI, 2017). Se trata de una competencia esencial para cualquier ingeniero de sistemas, ya que permite planificar, ejecutar y controlar iniciativas de desarrollo de software, asegurando que se completen dentro del alcance, tiempo y costo planeados.
En el contexto de este proyecto de grado, la Gestión de Proyectos se aplica de manera dual:
1.	Como objeto de estudio, ya que el sistema a desarrollar está destinado a gestionar proyectos de grado.
2.	Como marco de trabajo para gestionar el propio desarrollo de la aplicación web.
Los principales procesos de gestión aplicados son:
•	Gestión del Alcance: Definición y control de las funcionalidades que serán incluidas en la aplicación, evitando la "proliferación de requisitos" que pueda desviar el proyecto.
•	Gestión del Tiempo: Elaboración de un cronograma detallado para el plazo de 4 meses, utilizando herramientas como diagramas de Gantt para desglosar las tareas y asignar recursos, garantizando la entrega puntual.
•	Gestión de los Costos: Dado que se utilizan tecnologías de código abierto, el enfoque se centra en la optimización del recurso tiempo y en la viabilidad económica de la solución, minimizando los costos de licenciamiento e infraestructura.
•	Gestión de la Calidad: Establecimiento de criterios de aceptación y planes de prueba que aseguren que el software desarrollado cumple con los estándares de calidad definidos.
•	Gestión de los Riesgos: Identificación proactiva de posibles problemas (técnicos, operativos o de recursos) y definición de estrategias de mitigación para minimizar su impacto.
•	Gestión de los Interesados (Stakeholders): Comunicación constante y efectiva con estudiantes, docentes y autoridades de la universidad para mantenerlos informados, gestionar sus expectativas y asegurar su compromiso con el proyecto.
2.2	MARCO CONCEPTUAL
El presente apartado tiene como finalidad definir los conceptos fundamentales que sustentan el desarrollo del proyecto, estableciendo un marco de referencia teórico que permita comprender los elementos esenciales que intervienen en la construcción de la aplicación web propuesta.
2.2.1	Aplicación Web
Una Aplicación Web se define como un software que se ejecuta en un servidor remoto y al cual se accede a través de un navegador web mediante una conexión a internet o una intranet (MDN Web Docs, 2024). A diferencia de los sitios web informativos tradicionales, las aplicaciones web son inherentemente dinámicas e interactivas, permitiendo a los usuarios no solo consumir contenido, sino también realizar operaciones complejas, manipular datos y recibir respuestas personalizadas en tiempo real.
La elección de una aplicación web como solución tecnológica para el presente proyecto se fundamenta en sus características distintivas:
•	Accesibilidad Universal: La aplicación puede ser utilizada desde cualquier dispositivo con conexión a internet y un navegador web, sin requerir la instalación de software específico en el equipo local del usuario.
•	Centralización y Mantenimiento Eficiente: Todas las actualizaciones y correcciones se implementan de manera centralizada en el servidor, lo que garantiza que todos los usuarios accedan simultáneamente a la versión más reciente del sistema.
•	Independencia de Plataforma: Su funcionamiento es independiente del sistema operativo del dispositivo del usuario, lo que la convierte en una solución ideal para entornos heterogéneos como el universitario.
•	Arquitectura Cliente-Servidor: Esta arquitectura separa claramente la capa de presentación e interacción (frontend) de la lógica de negocio y el almacenamiento de datos (backend), facilitando la escalabilidad, seguridad y evolución del sistema.
En el contexto de este proyecto, la aplicación web se conceptualiza como la plataforma unificada que centralizará y digitalizará el proceso de gestión y seguimiento de proyectos de grado, superando las limitaciones de los métodos descentralizados y manuales actualmente en uso.
2.2.2	Desarrollo de Aplicación Web
El Desarrollo de Aplicaciones Web se refiere al proceso sistemático de creación de este tipo de software, el cual implica la integración de dos dominios tecnológicos interrelacionados: el desarrollo frontend (lado del cliente) y el desarrollo backend (lado del servidor).
•	Desarrollo Frontend: Comprende la construcción de la interfaz de usuario con la que este interactúa directamente. Se encarga de la presentación visual, la usabilidad y la experiencia de usuario. Su implementación se basa en un conjunto de tecnologías estándar:
o	HTML5: Define la estructura semántica y el contenido de las páginas.
o	CSS3: Controla la presentación visual, el diseño, el layout adaptable (responsive design) y los aspectos estéticos.
o	JavaScript (ES6+): Proporciona la lógica de interactividad en el navegador, permitiendo la creación de interfaces de usuario dinámicas y reactivas.
o	Frameworks y Librerías: Para este proyecto se emplea React.js, una librería de JavaScript que permite el desarrollo de interfaces modernas basadas en componentes reutilizables, optimizando el rendimiento y la mantenibilidad del código.
•	Desarrollo Backend: Se refiere a la lógica que opera en el servidor. Es responsable de procesar las peticiones del cliente, ejecutar la lógica de negocio, autenticar usuarios, garantizar la seguridad y gestionar el almacenamiento y recuperación de datos. La stack tecnológico seleccionado para el backend incluye:
o	Neon: Servicio de base de datos PostgreSQL serverless que proporciona base de datos escalable con backups automáticos y alta disponibilidad, garantizando el almacenamiento estructurado, consistente y seguro de toda la información del sistema.
o	PostgreSQL: Sistema gestor de base de datos relacional gestionado por Neon, que garantiza integridad referencial y alto rendimiento.
El desarrollo de aplicaciones web modernas, por lo tanto, constituye una disciplina de la ingeniería de software orientada a la construcción de sistemas complejos que resuelven problemas específicos de manera eficiente y escalable.
2.2.3	Tecnologías Educativas 
Las Tecnologías Educativas comprenden el conjunto integrado de herramientas, recursos, procesos y conocimientos teóricos derivados de las Tecnologías de la Información y la Comunicación (TIC), aplicados de forma sistemática para mediar, mejorar y transformar los procesos de enseñanza, aprendizaje y gestión educativa. Según la UNESCO (2022), la integración estratégica de estas tecnologías en la educación superior es un factor determinante para incrementar la eficiencia, la transparencia, la equidad en el acceso y la calidad formativa.
En el ámbito de la gestión académica universitaria, las tecnologías educativas se materializan en diversas plataformas y sistemas, tales como:
•	Sistemas de Gestión del Aprendizaje (LMS): Plataformas como Moodle o Blackboard, diseñadas para la administración y entrega de cursos en línea.
•	Sistemas de Gestión de la Investigación: Software especializado para la administración de proyectos de investigación, publicaciones científicas y procesos de innovación.
•	Plataformas de Colaboración Académica: Herramientas que facilitan la comunicación síncrona y asíncrona, el trabajo colaborativo y la revisión entre pares.
El presente proyecto se enmarca de lleno en este dominio, ya que la aplicación web propuesta es, en esencia, una tecnología educativa específicamente diseñada para optimizar y formalizar un proceso académico crítico: la gestión, el seguimiento y la evaluación de los proyectos de grado. Su desarrollo y futura implementación se alinean con las tendencias globales identificadas por la UNESCO (2023), las cuales destacan que la digitalización de procesos universitarios:
•	Incrementa la transparencia al proporcionar un registro centralizado, accesible y auditables de todas las interacciones y avances.
•	Minimiza los errores humanos y la pérdida de información inherente a los procesos manuales y descentralizados.
•	Optimiza la comunicación al establecer canales formales y unificados entre estudiantes, tutores, revisores y coordinación.
•	Genera datos valiosos para el análisis, la toma de decisiones basada en evidencia y la mejora continua de los programas académicos.
Experiencias internacionales documentadas, como las implementadas en la Universidad de Chile y la Pontificia Universidad Javeriana de Colombia (Paredes & Ruiz, 2021), confirman que la adopción de plataformas web para el seguimiento de tesis ha resultado en una reducción significativa de los tiempos de revisión y en un aumento notable de la satisfacción de estudiantes y docentes, validando así el enfoque y la viabilidad conceptual del proyecto aquí presentado.
2.3	METODOLOGÍA DE DESARROLLO DE SOFTWARE
2.3.1	Concepto
La metodología RAD (Rapid Application Development) es un modelo de desarrollo de software que prioriza la rapidez y flexibilidad mediante ciclos iterativos y prototipado continuo. Desarrollado originalmente por James Martin en la década de 1980, RAD representa una alternativa a los modelos secuenciales tradicionales como el cascada, enfocándose en la participación activa del usuario durante todo el proceso de desarrollo. Esta metodología se sustenta en el principio de que los sistemas pueden desarrollarse más rápidamente mediante la utilización de equipos pequeños, talleres de trabajo intensivos y prototipos sucesivos que se van refinando progresivamente. Para el contexto específico de la Universidad Salesiana de Bolivia, esta aproximación permitirá incorporar las perspectivas de estudiantes, tutores y administrativos desde las primeras etapas del proyecto.
2.3.2	Características
•	Desarrollo Iterativo: Construcción progresiva mediante ciclos repetitivos de diseño, desarrollo y prueba, donde cada iteración produce un incremento funcional del sistema.
•	Prototipado Rápido: Creación de versiones preliminares funcionales para validación temprana, permitiendo detectar desviaciones en los requisitos antes de avanzar a fases más complejas.
•	Participación Activa del Usuario: Involucramiento continuo de estudiantes, tutores y administrativos durante el desarrollo, asegurando que el producto final se alinee con sus expectativas y procesos reales.
•	Reutilización de Componentes: Uso estratégico de módulos, bibliotecas y herramientas preexistentes para acelerar el desarrollo sin comprometer la calidad.
•	Enfoque en Tiempos Reducidos: Optimización de actividades para cumplir con el cronograma de 4 meses, eliminando burocracia innecesaria y manteniendo el enfoque en entregables de valor.
•	Herramientas CASE: Empleo de tecnologías que automatizan partes del proceso de desarrollo, incluyendo entornos de desarrollo integrados y generadores de código.
•	Talleres de Requisitos (JAD): Sesiones colaborativas intensivas donde todos los stakeholders definen conjuntamente las funcionalidades del sistema.
2.3.3	Ventajas
•	Flexibilidad Operativa: Permite ajustes basados en retroalimentación continua de estudiantes y docentes, adaptándose a necesidades emergentes sin requerir cambios estructurales costosos.
•	Reducción de Riesgos: Los prototipos validan ideas y funcionalidades antes de la implementación final, minimizando errores costosos y asegurando que el producto se ajuste a las expectativas de los usuarios.
•	Eficiencia Temporal: Ideal para proyectos con plazos ajustados (4 meses), acelerando la entrega de productos funcionales mediante desarrollo incremental y paralelización de tareas.
•	Alineación con Necesidades Reales: Garantiza que el sistema responda específicamente a los requerimientos de la universidad mediante validación constante con los usuarios finales.
•	Mejora en la Comunicación: La colaboración continua entre desarrolladores y usuarios finales fomenta un producto mejor alineado con las expectativas y reduce malentendidos en los requisitos.
•	Entrega Temprana de Valor: Cada iteración produce componentes funcionales que pueden ser utilizados inmediatamente, generando beneficios tangibles desde las primeras etapas del proyecto.
•	Mayor Satisfacción del Usuario: La participación activa en el proceso de desarrollo incrementa la aceptación final del sistema y reduce la resistencia al cambio.
2.3.4	Fases
El proceso RAD se estructurará en las siguientes fases específicas para el desarrollo de la aplicación web:
•	Planificación de Requisitos: Definición colaborativa del alcance, roles y cronograma de iteraciones con participación de todos los actores (estudiantes, tutores, jefatura de carrera), estableciendo prioridades y criterios de aceptación para cada funcionalidad.
•	Diseño Rápido: Creación de maquetas interactivas (UI/UX) y especificaciones técnicas detalladas mediante talleres de trabajo colaborativo donde los usuarios visualizan y validan la estructura y flujos del sistema.
•	Construcción Iterativa: Desarrollo de prototipos funcionales en ciclos repetitivos que incluyen codificación, pruebas unitarias e integración progresiva de módulos, con entregas parciales cada 2-3 semanas para evaluación continua.
•	Transición e Implementación: Despliegue en entorno real, capacitación a usuarios finales y migración de datos desde los sistemas anteriores, incluyendo soporte técnico durante el período de adaptación inicial y ajustes basados en feedback post-implementación.
2.4	INGENIERÍA DE SOFTWARE
La Ingeniería de Software es la disciplina que aplica principios, métodos, herramientas y técnicas para el desarrollo sistemático de software de calidad (Pressman, 2010). En este proyecto, constituye el pilar fundamental para transformar el problema identificado en una solución software efectiva.
Aplicación en el proyecto:
•	Ciclo de Vida del Software: Seguimiento de fases estructuradas (análisis, diseño, desarrollo, pruebas, implementación, mantenimiento)
•	Gestión de Calidad: Referencia al modelo ISO/IEC 25010 para evaluar funcionalidad, fiabilidad, usabilidad, rendimiento, mantenibilidad y seguridad
•	Gestión de Proyectos: Aplicación de procesos para garantizar el cumplimiento de alcance, tiempo y costo
•	Gestión de Riesgos: Identificación proactiva de problemas técnicos, operativos o de recursos
•	Gestión de Interesados: Comunicación constante con estudiantes, docentes y autoridades universitarias
La ingeniería de software asegura que el desarrollo siga un enfoque estructurado y metódico, orientado a la producción de un sistema confiable, eficiente y mantenible.
2.5	PLATAFORMA DE DESARROLLO
La aplicación se desarrollará como una aplicación web accesible desde cualquier navegador moderno. El diseño será responsive para permitir su uso tanto en computadoras como en dispositivos móviles. Se utilizará un enfoque cliente-servidor, donde el frontend se encarga de la interacción con el usuario y el backend de la lógica del negocio y el acceso a datos.
2.5.1	Arquitectura Cliente-Servidor
La arquitectura cliente-servidor es un modelo de diseño de software en el que las tareas se dividen entre proveedores de recursos (servidores) y solicitantes (clientes). Este enfoque es fundamental en aplicaciones web modernas, ya que permite distribuir la carga de trabajo, mejorar la escalabilidad y facilitar el mantenimiento del sistema.
●	Cliente (Frontend): React.js para interfaces dinámicas y usables.
●	Backend: Node.js con Express.js para APIs REST y lógica de negocio.
●	Base de Datos: Neon (servicio de base de datos PostgreSQL serverless) que proporciona base de datos PostgreSQL escalable con alta disponibilidad.
●	Comunicación: APIs REST y conexiones directas a PostgreSQL mediante clientes como pg o Prisma para integración con React.
2.5.2	Características Técnicas
●	Multiplataforma: Compatible con dispositivos móviles y desktop.
●	Escalabilidad: Diseñada para futuras ampliaciones (ej: integración con otros recursos).
●	Acceso remoto: Disponible desde cualquier ubicación con conexión a internet.
2.6	ADMINISTRADOR DE BASE DE DATOS
2.6.1	Base de Datos - Estructura 
La base de datos constituye un componente esencial del sistema, ya que permite almacenar, organizar y gestionar de manera eficiente la información generada por los usuarios y las operaciones realizadas.
La estructura propuesta se compone de varias tablas interrelacionadas que garantizan la integridad y coherencia de los datos. Las tablas principales son:
•	Usuarios: Contiene la información de los diferentes tipos de usuarios del sistema (estudiantes, tutores, revisores y administradores).
•	Proyectos: Registra los datos de los proyectos de grado, como título, descripción y estado.
•	Entregas: Almacena los documentos presentados por los estudiantes en cada fase del proceso.
•	Observaciones: Registra la retroalimentación realizada por los tutores y revisores.
•	Bitácoras: Permite el control de versiones y los cambios realizados en los documentos, asegurando trazabilidad.
2.6.2	Tipos de Bases de Datos
Existen diversos tipos de bases de datos según la forma en que almacenan, organizan y gestionan la información. Entre las más comunes se encuentran:
•	Bases de datos jerárquicas: Estructuran los datos en forma de árbol con relaciones padre-hijo.
•	Bases de datos de red: Permiten establecer múltiples relaciones entre registros mediante enlaces complejos.
•	Bases de datos orientadas a objetos: Almacenan los datos en forma de objetos, integrando características de la programación orientada a objetos.
•	Bases de datos relacionales: Organizan la información en tablas vinculadas mediante claves primarias y foráneas, garantizando integridad y consistencia.
2.6.3	Bases de Datos Relacional
El sistema empleará una base de datos relacional, debido a su estructura organizada en tablas y su capacidad para manejar relaciones entre distintos tipos de información.
Este modelo permite mantener la integridad referencial, facilita la ejecución de consultas complejas y garantiza un acceso seguro y coherente a los datos.
Además, su compatibilidad con el lenguaje SQL permite una administración estandarizada y fácilmente integrable con aplicaciones web modernas.
2.6.4	PostgreSQL y Neon
Para la implementación se utilizará PostgreSQL como sistema gestor de base de datos, gestionado y alojado por Neon, un servicio de base de datos PostgreSQL serverless moderno y de código abierto.

PostgreSQL es una base de datos relacional robusta, gratuita y ampliamente utilizada tanto en entornos académicos como profesionales. Entre sus principales ventajas destacan:
•	Alto rendimiento y escalabilidad para sistemas de cualquier tamaño.
•	Cumplimiento estricto con estándares SQL, garantizando portabilidad y compatibilidad.
•	Características avanzadas como tipos de datos personalizados, funciones almacenadas y triggers.
•	Excelente soporte para consultas complejas y operaciones transaccionales.

Neon proporciona una capa adicional de servicios sobre PostgreSQL:
•	Base de datos PostgreSQL serverless con escalado automático y alta disponibilidad.
•	Branching de base de datos (similar a Git) para desarrollo y pruebas.
•	Backups automáticos y punto de recuperación en el tiempo.
•	Connection pooling integrado para optimizar el rendimiento.
•	Dashboard visual para administración y gestión de datos.
•	API REST para gestión y consultas.
•	Plan gratuito generoso para desarrollo y proyectos pequeños.

Herramientas y técnicas de gestión empleadas:
•	Neon Dashboard: Interfaz web para diseño y administración visual de la base de datos.
•	Neon CLI: Herramienta de línea de comandos para migraciones y gestión.
•	Consultas SQL optimizadas: Para garantizar un rendimiento adecuado.
•	Funciones almacenadas y triggers: Para lógica de negocio en la base de datos.
2.7	Herramientas
2.7.1	Frontend
El frontend es la parte de una aplicación web con la que los usuarios interactúan directamente. Incluye todo lo que se ve y se usa en el navegador: diseños, botones, formularios, animaciones y respuestas dinámicas. En este proyecto, el frontend se desarrolló con React.js utilizando TypeScript, una biblioteca de JavaScript moderna que permite crear interfaces eficientes y reutilizables con tipado estático para mayor seguridad y mantenibilidad del código.

Stack Tecnológico Frontend Implementado:
•	React.js 18: Biblioteca JavaScript para construir interfaces de usuario dinámicas y componentes reutilizables.
•	TypeScript 5.2: Lenguaje de programación que añade tipado estático a JavaScript, mejorando la detección de errores en tiempo de desarrollo y facilitando el mantenimiento del código.
•	Vite 5.0: Herramienta de construcción moderna y rápida que proporciona Hot Module Replacement (HMR) instantáneo y builds optimizados para producción.
•	React Router DOM 6.21: Librería para manejar navegación entre vistas en aplicaciones de una sola página (SPA).
•	Zustand 4.4: Biblioteca ligera de gestión de estado global que permite manejar el estado de autenticación y notificaciones de manera eficiente.
•	Axios 1.6: Cliente HTTP para realizar peticiones a las APIs del backend.
•	HTML5 y CSS3: Para estructura y diseño responsive con variables CSS para temas personalizables.

2.7.1.1	React.js y TypeScript
React.js es una biblioteca de JavaScript de código abierto desarrollada por Meta (Facebook) en 2013. Su objetivo principal es facilitar la creación de interfaces de usuario (UI) interactivas y dinámicas mediante componentes reutilizables. La implementación del proyecto utiliza React 18 con TypeScript, lo que proporciona beneficios adicionales de tipado estático y mejor experiencia de desarrollo.

Características Clave Implementadas:
●	Componentes Funcionales con TypeScript: Bloques modulares tipados que encapsulan lógica y diseño (ej: <Dashboard />, <ProyectoDetail />).
●	Virtual DOM: Representación ligera del DOM real que optimiza el rendimiento al minimizar actualizaciones.
●	JSX con TypeScript: Sintaxis similar a HTML con tipado estático que permite escribir estructura y lógica en un mismo archivo con verificación de tipos.
●	Hooks: Funciones como useState, useEffect, useParams que permiten manejar estado y efectos en componentes funcionales con tipado completo.
●	React Router DOM: Manejo de rutas protegidas y navegación entre vistas con protección de rutas basada en autenticación.
●	TypeScript: Tipado estático que previene errores comunes, mejora la autocompletación en el IDE y facilita el mantenimiento del código.
●	Vite: Build tool moderno que proporciona desarrollo rápido con HMR instantáneo y builds optimizados para producción.
2.7.2	Backend - Node.js con Express, TypeScript y PostgreSQL (Neon)
El backend de la aplicación se implementó utilizando Node.js con Express.js y TypeScript, un framework web minimalista y flexible para Node.js que permite crear APIs REST robustas y escalables. La base de datos se gestiona mediante Neon, un servicio de base de datos PostgreSQL serverless moderno.

Stack Tecnológico Backend Implementado:
•	Node.js 18+: Entorno de ejecución de JavaScript del lado del servidor.
•	Express.js 4.18: Framework web minimalista para Node.js que facilita la creación de APIs REST.
•	TypeScript 5.3: Lenguaje de programación con tipado estático para el backend, mejorando la calidad y mantenibilidad del código.
•	PostgreSQL (via Neon): Base de datos relacional serverless gestionada por Neon.
•	pg 8.11: Cliente PostgreSQL para Node.js que permite conexiones directas a la base de datos Neon.
•	jsonwebtoken 9.0: Librería para implementar autenticación mediante JWT (JSON Web Tokens).
•	bcryptjs 2.4: Librería para hashing seguro de contraseñas.
•	Zod 3.22: Librería de validación de esquemas TypeScript-first que permite validar datos de entrada de manera robusta.
•	multer 1.4: Middleware para manejo de carga de archivos multipart/form-data.
•	cors 2.8: Middleware para habilitar Cross-Origin Resource Sharing (CORS).
•	dotenv 16.3: Librería para cargar variables de entorno desde archivos .env.

Node.js, Express.js y TypeScript ofrecen una solución completa implementada que incluye:
•	APIs REST: Endpoints personalizados implementados para todas las operaciones del sistema (autenticación, proyectos, entregas, observaciones, notificaciones, bitácoras, reportes).
•	Autenticación: Sistema de autenticación implementado mediante JWT (JSON Web Tokens) con middleware de autenticación y autorización por roles.
•	Middleware: Sistema de middleware implementado para manejo de errores centralizado, validación de datos, autenticación y autorización basada en roles.
•	Integración con PostgreSQL: Conexión directa a Neon mediante el cliente pg con connection pooling.
•	Gestión de archivos: Sistema de almacenamiento de archivos implementado usando el sistema de archivos local con multer, con control de acceso y validación de tipos y tamaños de archivo.
•	Validación de datos: Validación robusta implementada mediante Zod con esquemas tipados para todas las entradas del sistema.
•	Escalabilidad: Arquitectura modular implementada que permite escalar horizontalmente según necesidades, con separación clara de responsabilidades (routes, middleware, db).

2.7.2.1	Ventajas de Neon para el Proyecto

La implementación del proyecto aprovecha las siguientes ventajas de Neon:
●	Desarrollo acelerado: Base de datos serverless sin necesidad de configurar infraestructura, permitiendo comenzar a desarrollar inmediatamente.
●	Costo cero: Plan gratuito generoso suficiente para el proyecto que incluye base de datos PostgreSQL completa con branching.
●	Escalabilidad: Infraestructura gestionada que escala automáticamente según la demanda, sin necesidad de configuración manual.
●	Alta disponibilidad: Backups automáticos y punto de recuperación en el tiempo gestionados por Neon.
●	Branching de base de datos: Permite crear ramas para desarrollo y pruebas sin afectar producción, similar al control de versiones de código.
●	Connection pooling: Optimización automática de conexiones para mejor rendimiento mediante el connection pooler integrado de Neon.
●	Dashboard visual: Interfaz web intuitiva para administración y consultas SQL directas.
●	Migraciones: Sistema de migraciones SQL que permite versionar cambios en el esquema de base de datos.
2.7.3	Control de Versiones: Git + GitHub
El control de versiones es un sistema que registra los cambios en los archivos de un proyecto a lo largo del tiempo, permitiendo:
●	Revertir a versiones anteriores.
●	Trabajar en equipo sin sobrescribir cambios.
●	Identificar quién, cuándo y por qué se modificó algo.
Git es la herramienta más usada para control de versiones local, mientras que GitHub es una plataforma en la nube que aloja repositorios Git y facilita la colaboración.
GitHub Colaboración y Gestión:
●	Repositorios Remotos: Almacenan el código en la nube y facilitan la colaboración
●	Issues: Seguimiento de tareas, bugs o mejoras
●	Pull Requests: Revisión de código y colaboración en equipo
Beneficios en el Proyecto:
✔ Historial completo: Registro de todos los cambios en el código.
✔ Recuperación de errores: Volver a una versión estable si algo falla.
✔ Documentación automática: Los commits y PRs explican la evolución del proyecto.
2.7.4	Pruebas y Calidad
•	Postman: Herramienta utilizada para pruebas de APIs durante el desarrollo, permitiendo probar endpoints REST y validar respuestas.
•	ESLint: Linter configurado para mantener estándares de código en TypeScript/JavaScript, con reglas específicas para React y TypeScript.
•	TypeScript: El tipado estático de TypeScript actúa como una herramienta de verificación de calidad en tiempo de compilación, detectando errores antes de la ejecución.
•	Validación con Zod: Validación de esquemas en tiempo de ejecución que garantiza la integridad de los datos en las APIs.
2.7.4.1	Postman
Postman es una herramienta de desarrollo colaborativo utilizada para probar, documentar y consumir APIs. Es ampliamente empleada por desarrolladores backend y frontend para:
●	Enviar peticiones HTTP (GET, POST, PUT, DELETE).
●	Validar respuestas de APIs.
●	Automatizar pruebas.
●	Generar documentación interactiva.
Características Principales:
Función	Descripción	Uso en el Proyecto
Interfaz Gráfica	Permite crear y organizar solicitudes sin escribir código.	Probar endpoints como POST /api/reservas.
Colecciones	Agrupa requests relacionadas (ej: rutas de autenticación, reservas).	Organizar pruebas por módulos (usuarios, proyectores).
Variables de Entorno	Almacena valores reutilizables (ej: URL base, tokens).	Evitar repetir http://localhost:3000/api.
Tests Automatizados	Scripts en JavaScript para validar respuestas (ej: status code 200).	Asegurar que la API devuelve los datos correctos.
Documentación	Genera docs automáticas basadas en las requests.	Compartir especificaciones con el equipo frontend.
Ventajas de tener Postman en el Proyecto:
✔ Ahorra tiempo: No requiere frontend para probar APIs.
✔ Consistencia: Garantiza que todas las rutas funcionen antes de integrarlas con React.js.
✔ Documentación: Genera documentación automática de las APIs.
2.7.5	Despliegue
El despliegue (o deployment) es el proceso de publicar una aplicación en un entorno accesible para los usuarios finales (como la web). Vercel, Railway y Render.com son plataformas modernas que simplifican este proceso, especialmente para aplicaciones web React y APIs.


¿Qué es el Despliegue?
El Despliegue es hacer que una aplicación (frontend, backend o fullstack) esté disponible en internet.
Beneficios:
●	Permite acceso remoto desde cualquier lugar.
●	Facilita pruebas en un entorno real.
●	Facilita la actualización y mantenimiento de la aplicación.

 





3.	CAPÍTULO III
INGENIERÍA DEL PROYECTO – DESARROLLO DEL PROYECTO







3.1	METODOLOGÍA DE DESARROLLO

Para el desarrollo de la aplicación web se ha seleccionado la metodología RAD (Rapid Application Development), la cual se alinea perfectamente con los objetivos del proyecto y las restricciones temporales establecidas. Esta metodología permite la construcción iterativa de prototipos funcionales y la validación continua con los usuarios finales, garantizando que el producto final se ajuste a las necesidades reales de estudiantes, tutores y revisores.

La aplicación de RAD en este proyecto se estructura en cuatro fases principales:

Fase 1: Planificación de Requisitos
Durante esta fase se realizaron talleres colaborativos (JAD - Joint Application Development) con representantes de todos los perfiles de usuario: estudiantes, tutores, revisores y jefatura de carrera. Estos talleres permitieron identificar y priorizar los requerimientos funcionales y no funcionales del sistema, estableciendo criterios de aceptación claros para cada funcionalidad.

Fase 2: Diseño Rápido
Se desarrollaron maquetas interactivas de las interfaces de usuario utilizando herramientas de diseño como Figma, permitiendo que los usuarios visualizaran y validaran la estructura y flujos del sistema antes de iniciar la codificación. Paralelamente, se diseñó la arquitectura técnica del sistema y el modelo de base de datos.

Fase 3: Construcción Iterativa
El desarrollo se realiza en ciclos de 2-3 semanas, donde cada iteración produce componentes funcionales que son evaluados por los usuarios. Esta aproximación permite detectar desviaciones en los requisitos de manera temprana y realizar ajustes sin afectar significativamente el cronograma del proyecto.

Fase 4: Transición e Implementación
Una vez completadas todas las iteraciones y validado el sistema mediante pruebas de aceptación, se procede al despliegue en un entorno de producción, la capacitación de usuarios finales y la migración de datos desde los sistemas anteriores.

La metodología RAD garantiza la entrega de un producto funcional dentro del plazo de 4 meses, manteniendo la calidad y alineación con las necesidades de los usuarios.

3.2	INSTRUMENTOS Y PROTOCOLOS DE RECOLECCIÓN DE INFORMACIÓN
 
Para garantizar que el sistema desarrollado responda efectivamente a las necesidades de todos los actores involucrados, se diseñaron y aplicaron diversos instrumentos de recolección de información, cada uno adaptado a objetivos específicos y momentos particulares del proceso de desarrollo.

3.2.1	Entrevistas Semiestructuradas
Se diseñó un protocolo de entrevista semiestructurada que permitió recopilar información detallada sobre las experiencias, percepciones y necesidades de cada perfil de usuario. Las entrevistas se realizaron de manera individual y tuvieron una duración promedio de 45 minutos.

Protocolo de Entrevista:
•	Objetivo: Identificar problemas específicos del proceso actual y requerimientos funcionales del sistema
•	Participantes: 15 estudiantes, 8 tutores, 5 revisores, 2 miembros de jefatura de carrera
•	Estructura: Introducción, preguntas sobre proceso actual, identificación de problemas, expectativas del sistema, cierre
•	Registro: Grabación de audio con consentimiento previo y transcripción posterior

3.2.2	Grupos Focales
Se organizaron dos grupos focales: uno con estudiantes y otro con docentes (tutores y revisores), con el objetivo de explorar perspectivas colectivas y generar consensos sobre las funcionalidades prioritarias del sistema.

Protocolo de Grupo Focal:
•	Objetivo: Validar requerimientos identificados y explorar nuevas necesidades mediante interacción grupal
•	Participantes: 6-8 personas por grupo, seleccionadas según criterios de experiencia y diversidad
•	Duración: 90 minutos por sesión
•	Moderación: Guía de temas predefinida con flexibilidad para profundizar en aspectos emergentes

3.2.3	Observación Directa
Se realizó observación sistemática del proceso actual de gestión de proyectos de grado, registrando interacciones, flujos de trabajo y puntos de fricción en la comunicación entre actores.

Protocolo de Observación:
•	Objetivo: Comprender el proceso real en su contexto natural, más allá de lo reportado en entrevistas
•	Momento: Durante reuniones de tutoría y procesos de revisión documental
•	Registro: Notas de campo estructuradas y registro fotográfico (con consentimiento)

3.2.4	Revisión Documental
Se analizaron documentos institucionales formales y registros históricos de proyectos de grado para comprender el marco normativo y los patrones del proceso.

Documentos Revisados:
•	Reglamento de Proyectos de Grado de la USB
•	Manual de Procedimientos Académicos
•	Formatos oficiales de presentación
•	Registros de proyectos de cohortes anteriores

3.2.5	Cuestionarios de Validación
Durante las fases de prototipado, se diseñaron cuestionarios estructurados para evaluar la usabilidad y aceptación de las interfaces desarrolladas.

Estructura del Cuestionario:
•	Escala Likert (1-5) para evaluar facilidad de uso, claridad de interfaz, satisfacción
•	Preguntas abiertas para recopilar sugerencias de mejora
•	Aplicación: Después de cada sesión de prueba de prototipos

Estos instrumentos, aplicados de manera sistemática y complementaria, proporcionaron una base sólida de información para el diseño y desarrollo del sistema, garantizando que la solución tecnológica responda efectivamente a las necesidades identificadas.

3.3	ANÁLISIS DE REQUERIMIENTOS

El análisis de requerimientos se realizó mediante la aplicación sistemática de los instrumentos de recolección de información descritos anteriormente. A continuación se presenta la tabla consolidada de requerimientos identificados, organizados por tipo y prioridad.

Tabla 1: Requerimientos Funcionales y No Funcionales del Sistema

| ID | Tipo | Descripción | Prioridad | Criterio de Aceptación |
|---|---|---|---|---|
| RF-001 | Funcional | El sistema debe permitir el registro de usuarios con roles diferenciados (estudiante, tutor, revisor, administrador) | Alta | Usuario puede registrarse seleccionando su rol y completando formulario de datos personales |
| RF-002 | Funcional | El sistema debe implementar autenticación segura mediante usuario y contraseña | Alta | Usuario puede iniciar sesión con credenciales válidas y acceder a su perfil correspondiente |
| RF-003 | Funcional | El sistema debe permitir a los estudiantes registrar su proyecto de grado con información básica (título, descripción, objetivos) | Alta | Estudiante puede crear un nuevo proyecto y visualizarlo en su panel de control |
| RF-004 | Funcional | El sistema debe permitir a la jefatura de carrera asignar tutores a proyectos de grado | Alta | Administrador puede seleccionar un proyecto y asignarle un tutor disponible |
| RF-005 | Funcional | El sistema debe permitir a los estudiantes subir documentos en diferentes etapas del proyecto (anteproyecto, entregas parciales, versión final) | Alta | Estudiante puede cargar archivos PDF o Word y el sistema los almacena con fecha y hora |
| RF-006 | Funcional | El sistema debe mantener un historial de versiones de documentos subidos | Alta | Cada nueva versión de un documento se registra con número de versión, fecha y cambios detectados |
| RF-007 | Funcional | El sistema debe permitir a tutores y revisores agregar observaciones y retroalimentación a los documentos | Alta | Tutor/revisor puede agregar comentarios específicos por sección del documento y estos se registran con fecha |
| RF-008 | Funcional | El sistema debe notificar automáticamente a estudiantes cuando hay nuevas observaciones | Alta | Estudiante recibe notificación por correo electrónico y dentro del sistema cuando se agregan observaciones |
| RF-009 | Funcional | El sistema debe generar reportes de avance de proyectos para la jefatura de carrera | Media | Administrador puede generar reporte que muestre estado de todos los proyectos, tiempos promedio y proyectos en riesgo |
| RF-010 | Funcional | El sistema debe permitir la búsqueda y filtrado de proyectos por diferentes criterios (estudiante, tutor, estado, fecha) | Media | Usuario puede buscar proyectos y aplicar filtros múltiples obteniendo resultados relevantes |
| RF-011 | Funcional | El sistema debe mostrar un dashboard personalizado según el rol del usuario | Media | Cada rol visualiza información relevante a sus responsabilidades en su panel principal |
| RF-012 | Funcional | El sistema debe permitir la descarga de documentos en cualquier momento | Baja | Usuario puede descargar cualquier versión de documento desde el historial |
| RF-013 | Funcional | El sistema debe permitir comparar diferentes versiones de documentos | Alta | Usuario puede seleccionar dos versiones y visualizar diferencias (nombre, tamaño, fecha) |
| RF-014 | Funcional | El sistema debe registrar bitácoras detalladas de todas las acciones realizadas | Alta | Cada acción (subida, revisión, aprobación) se registra con usuario, fecha y cambios detectados |
| RF-015 | Funcional | El sistema debe generar reportes de tareas pendientes personalizados por rol | Media | Cada rol visualiza sus tareas pendientes específicas (estudiantes: observaciones, tutores: entregas sin revisar, etc.) |
| RF-016 | Funcional | El sistema debe generar reportes de tareas cumplidas | Media | Usuario puede ver historial de tareas completadas |
| RF-017 | Funcional | El sistema debe generar estadísticas administrativas del sistema | Media | Administrador puede ver métricas del sistema (proyectos por estado, entregas, observaciones, etc.) |
| RF-018 | Funcional | El sistema debe permitir asignar múltiples revisores a un proyecto | Media | Administrador puede asignar varios revisores a un mismo proyecto |
| RF-019 | Funcional | El sistema debe mantener estados separados para tutor y revisor en las entregas | Alta | Cada entrega tiene estado_tutor y estado_revisor independientes |
| RNF-001 | No Funcional | El sistema debe responder a las peticiones en menos de 2 segundos | Alta | Tiempo de respuesta promedio medido en pruebas de carga es menor a 2 segundos |
| RNF-002 | No Funcional | El sistema debe ser accesible desde navegadores modernos (Chrome, Firefox, Edge, Safari) | Alta | Sistema funciona correctamente en los navegadores especificados sin errores de compatibilidad |
| RNF-003 | No Funcional | El sistema debe ser responsive y funcionar en dispositivos móviles | Alta | Interfaz se adapta correctamente a pantallas de mínimo 320px de ancho |
| RNF-004 | No Funcional | El sistema debe garantizar la seguridad de los datos mediante encriptación de contraseñas y uso de HTTPS | Alta | Autenticación con hash seguro de contraseñas y conexión HTTPS automática mediante Neon |
| RNF-005 | No Funcional | El sistema debe soportar hasta 200 usuarios concurrentes | Media | Pruebas de carga demuestran funcionamiento estable con 200 usuarios simultáneos |
| RNF-006 | No Funcional | El sistema debe realizar backups automáticos diarios de la base de datos | Media | Backup automático configurado y verificado mediante restauración de prueba |
| RNF-007 | No Funcional | El sistema debe mantener disponibilidad del 95% durante horario laboral | Media | Monitoreo demuestra disponibilidad igual o superior al 95% en horario 8:00-18:00 |
| RNF-008 | No Funcional | El código fuente debe seguir estándares de calidad y estar documentado | Baja | Código revisado con herramientas de análisis estático y documentación técnica completa |
| RNF-009 | No Funcional | El sistema debe utilizar TypeScript para tipado estático | Alta | Todo el código frontend y backend está escrito en TypeScript con tipos definidos |
| RNF-010 | No Funcional | El sistema debe validar datos de entrada en backend y frontend | Alta | Validación implementada con Zod en backend y validación de formularios en frontend |

3.4	ANÁLISIS DE TECNOLOGÍAS

La selección del stack tecnológico se realizó considerando factores como la viabilidad técnica, costos de licenciamiento, curva de aprendizaje, comunidad de soporte y escalabilidad futura. A continuación se presenta el análisis comparativo de las tecnologías evaluadas para cada componente del sistema.

3.4.1	Análisis de Tecnologías Frontend

Se evaluaron tres opciones principales para el desarrollo del frontend:

React.js:
•	Ventajas: Amplia comunidad, gran ecosistema de librerías, Virtual DOM para optimización de rendimiento, componente reutilizables, fuerte demanda en el mercado laboral
•	Desventajas: Curva de aprendizaje moderada, requiere conocimiento de conceptos adicionales (hooks, estado)
•	Decisión: Seleccionado por su madurez, rendimiento y flexibilidad

Vue.js:
•	Ventajas: Curva de aprendizaje más suave, documentación excelente, sintaxis intuitiva
•	Desventajas: Ecosistema más pequeño que React, menor adopción en proyectos empresariales grandes
•	Decisión: No seleccionado, aunque es una alternativa válida

Angular:
•	Ventajas: Framework completo con muchas funcionalidades integradas, TypeScript nativo
•	Desventajas: Curva de aprendizaje pronunciada, mayor complejidad para proyectos medianos, sobrecarga para necesidades del proyecto
•	Decisión: No seleccionado por exceso de complejidad para los requerimientos

3.4.2	Análisis de Tecnologías Backend

Neon (Servicio de Base de Datos PostgreSQL Serverless):
•	Ventajas: Base de datos PostgreSQL serverless sin necesidad de configurar infraestructura, escalabilidad automática, branching de base de datos, backups automáticos, connection pooling integrado, plan gratuito generoso
•	Desventajas: Dependencia de servicio externo, menos control sobre infraestructura
•	Decisión: Seleccionado por acelerar desarrollo y proporcionar base de datos escalable sin complejidad adicional

Python con Django/Flask:
•	Ventajas: Sintaxis clara, excelente para procesamiento de datos, Django ofrece admin panel integrado
•	Desventajas: Requiere conocimiento de otro lenguaje, rendimiento ligeramente inferior para APIs simples
•	Decisión: No seleccionado para mantener consistencia tecnológica

PHP con Laravel:
•	Ventajas: Ampliamente usado en desarrollo web tradicional, buena documentación
•	Desventajas: Menos moderno, rendimiento inferior a Node.js para aplicaciones en tiempo real
•	Decisión: No seleccionado por preferencia hacia tecnologías más modernas

3.4.3	Análisis de Plataformas Backend

Neon (Servicio de Base de Datos PostgreSQL Serverless):
•	Ventajas: Base de datos PostgreSQL serverless gestionada, escalabilidad automática, branching de base de datos, backups automáticos, connection pooling integrado, plan gratuito generoso, desarrollo acelerado, sin necesidad de mantener infraestructura de base de datos
•	Desventajas: Dependencia de servicio externo, menos control sobre la infraestructura subyacente
•	Decisión: Seleccionado por proporcionar una solución de base de datos moderna y escalable que acelera el desarrollo

Node.js + Express.js + PostgreSQL (Backend tradicional):
•	Ventajas: Control total sobre el código y la infraestructura, flexibilidad completa
•	Desventajas: Requiere desarrollar y mantener servidor backend, configuración de autenticación, gestión de base de datos, mayor tiempo de desarrollo
•	Decisión: No seleccionado, Neon proporciona gestión de base de datos sin complejidad adicional

Firebase (Google):
•	Ventajas: Ampliamente usado, buena documentación
•	Desventajas: Base de datos NoSQL (Firestore), menos adecuado para datos relacionales, más costoso en escalamiento
•	Decisión: No seleccionado, PostgreSQL de Neon es más adecuado para datos relacionales

La combinación seleccionada (React.js + Neon) ofrece un stack moderno, eficiente y de código abierto que cumple con todos los requerimientos técnicos del proyecto, reduciendo significativamente la complejidad y el tiempo de desarrollo.

3.5	DISEÑO DE ARQUITECTURA

La arquitectura del sistema se ha diseñado siguiendo el patrón de arquitectura en capas y el modelo cliente-servidor, separando claramente las responsabilidades de cada componente para facilitar el desarrollo, mantenimiento y escalabilidad futura.

3.5.1	Arquitectura General del Sistema

El sistema se estructura en tres capas principales:

Capa de Presentación (Frontend):
•	Tecnología: React.js
•	Responsabilidades: Interfaz de usuario, interacción con el usuario, validación de formularios en cliente, enrutamiento
•	Comunicación: HTTP/REST con la capa de aplicación

Capa de Aplicación (Backend):
•	Tecnología: Node.js con Express.js y TypeScript
•	Responsabilidades: APIs REST implementadas, autenticación y autorización mediante JWT, lógica de negocio, validación de datos con Zod, gestión de archivos con multer
•	Comunicación: RESTful API mediante endpoints /api/*, conexiones directas a PostgreSQL mediante cliente pg con connection pooling
•	Estructura: Arquitectura modular con separación de routes, middleware, y lógica de base de datos

Capa de Datos:
•	Tecnología: PostgreSQL (gestionado por Neon)
•	Responsabilidades: Almacenamiento persistente, integridad referencial, consultas optimizadas
•	Características: Modelo relacional, transacciones ACID, backups automáticos, alta disponibilidad

3.5.2	Diagrama de Arquitectura C4 - Nivel de Contexto

El sistema se integra con los siguientes actores externos:
•	Usuarios (Estudiantes, Tutores, Revisores, Administradores): Acceden al sistema mediante navegadores web
•	Sistema de Correo Electrónico: Para envío de notificaciones automáticas
•	Sistema de Almacenamiento de Archivos: Para gestión de documentos subidos

3.5.3	Decisiones Arquitectónicas Justificadas

Decisión 1: Arquitectura Cliente-Servidor
Justificación: Permite separación clara de responsabilidades, facilita el mantenimiento independiente de frontend y backend, y permite escalar cada capa según necesidades específicas.

Decisión 2: Neon como Servicio de Base de Datos PostgreSQL Serverless
Justificación: Neon proporciona una base de datos PostgreSQL serverless con escalado automático, branching de base de datos para desarrollo y pruebas, backups automáticos y connection pooling integrado. Esto simplifica la gestión de la base de datos y acelera el desarrollo al eliminar la necesidad de configurar y mantener la infraestructura de base de datos.

Decisión 3: Autenticación mediante JWT
Justificación: Se implementará un sistema de autenticación con JWT que garantiza seguridad con mejores prácticas de la industria. Esto permite control total sobre el flujo de autenticación y autorización del sistema.

Decisión 4: Almacenamiento de archivos
Justificación: Se implementó un sistema de almacenamiento de archivos usando el sistema de archivos local del servidor con multer. Los archivos se almacenan en el directorio `uploads/` del backend con nombres únicos generados automáticamente. El sistema sirve los archivos estáticos mediante Express y controla el acceso mediante autenticación JWT. Esta solución es adecuada para el alcance del proyecto y puede migrarse a un servicio cloud (AWS S3, Cloudinary) en el futuro si se requiere mayor escalabilidad.

Decisión 5: Base de datos relacional PostgreSQL
Justificación: Los datos del sistema tienen relaciones claras (usuarios-proyectos-entregas-observaciones), el modelo relacional garantiza integridad referencial, y PostgreSQL es robusto, cumple con estándares SQL y es gestionado automáticamente por Neon con backups y alta disponibilidad.

3.6	ENTORNO Y PLATAFORMA DE DESARROLLO

3.6.1	Sistema Operativo
El desarrollo se realizará en sistemas operativos multiplataforma, principalmente:
•	Windows 10/11: Para desarrollo local del equipo principal
•	macOS: Compatible pero no utilizado en este proyecto

3.6.2	Entorno de Desarrollo Local
El desarrollo se realizará en el entorno local del desarrollador, utilizando las herramientas y tecnologías seleccionadas. Se configurará el entorno de manera que sea reproducible y fácil de configurar para futuros desarrolladores.

3.6.3	Plataforma Cloud (Despliegue)
Para el despliegue en producción se evaluaron las siguientes opciones:

Vercel:
•	Ventajas: Plan gratuito generoso, optimizado para aplicaciones React, despliegue automático desde GitHub, CDN global incluido, SSL automático, excelente rendimiento para frontend
•	Desventajas: Requiere configuración adicional para backend con base de datos (se puede usar Vercel Serverless Functions o desplegar backend en otra plataforma)
•	Decisión: Seleccionado para despliegue del frontend React

Base de Datos (Neon):
•	Neon proporciona la base de datos PostgreSQL serverless en una plataforma gestionada
•	Despliegue automático: La base de datos PostgreSQL está disponible inmediatamente al crear el proyecto
•	No requiere configuración de servidores: Todo está gestionado por Neon
•	Plan gratuito: Incluye base de datos generosa con branching, backups automáticos y alta disponibilidad

Alternativas consideradas:
•	Railway: Buena opción para backend completo con base de datos
•	Render.com: Similar a Railway, buena opción de respaldo
•	Heroku: Anteriormente popular, pero eliminó plan gratuito

3.6.4	Requisitos del Sistema

Requisitos Mínimos para Desarrollo:
•	Procesador: Intel Core i5 o equivalente
•	RAM: 8 GB mínimo (16 GB recomendado)
•	Espacio en disco: 10 GB libres
•	Navegador: Chrome, Firefox, Edge o Safari (versiones recientes)
•	Node.js: Versión 18.x o superior (para herramientas de desarrollo)
•	Conexión a internet: Requerida para acceso a Neon

Requisitos para Producción:
•	Servidor: 2 CPU cores, 4 GB RAM mínimo
•	Almacenamiento: 50 GB para aplicación y base de datos
•	Ancho de banda: 100 Mbps

3.7	ADMINISTRADOR DE BASE DE DATOS

3.7.1	Sistema Gestor de Base de Datos (DBMS)
Se utilizará PostgreSQL como sistema gestor de base de datos, gestionado y alojado por Neon. PostgreSQL es un sistema de gestión de bases de datos relacional de código abierto que ofrece:
•	Alto rendimiento y escalabilidad para aplicaciones de cualquier tamaño
•	Cumplimiento estricto con estándares SQL
•	Características avanzadas: tipos de datos personalizados, funciones almacenadas, triggers, vistas materializadas
•	Herramientas de administración visual integradas en Neon Dashboard
•	Amplia comunidad de soporte
•	Sin costos de licenciamiento
•	Backups automáticos y alta disponibilidad gestionados por Neon

3.7.2	Diseño de Base de Datos

El modelo de datos implementado se estructura en las siguientes tablas principales:

Tabla Usuarios:
•	Campos: id (UUID, PK), nombre (VARCHAR 100), apellidos (VARCHAR 100), email (VARCHAR 255, UNIQUE), password_hash (VARCHAR 255), rol (VARCHAR 20, CHECK: estudiante/tutor/revisor/administrador), estado (VARCHAR 20, DEFAULT 'activo'), created_at, updated_at
•	Nota: La autenticación se gestiona mediante un sistema de autenticación propio con JWT y bcryptjs para hashing de contraseñas
•	Relaciones: Uno a muchos con Proyectos (como estudiante o tutor), uno a muchos con Observaciones, uno a muchos con Notificaciones
•	Índices: email (único), rol

Tabla Proyectos:
•	Campos: id (UUID, PK), titulo (VARCHAR 500), descripcion (TEXT), estudiante_id (UUID, FK a usuarios), tutor_id (UUID, FK a usuarios, nullable), estado (VARCHAR 50, CHECK: registrado/en_proceso/en_desarrollo/en_revision/correcciones/completado/aprobado/sustentado/rechazado), fecha_entrega (DATE), created_at, updated_at
•	Relaciones: Muchos a uno con Usuarios (estudiante y tutor), uno a muchos con Entregas, uno a muchos con proyecto_revisores
•	Índices: estudiante_id, tutor_id, estado
•	Triggers: Actualización automática de updated_at

Tabla Entregas:
•	Campos: id (UUID, PK), proyecto_id (UUID, FK a proyectos), etapa (VARCHAR 50, CHECK: anteproyecto/entrega_parcial_1/entrega_parcial_2/entrega_parcial_3/version_final), archivo_url (TEXT), archivo_nombre (VARCHAR 255), version (INTEGER, DEFAULT 1), estado_revision (VARCHAR 50, CHECK: pendiente/en_revision/observado/aprobado/rechazado), estado_tutor (VARCHAR 50), estado_revisor (VARCHAR 50, nullable), fecha_subida, created_at
•	Relaciones: Muchos a uno con Proyectos, uno a muchos con Observaciones, uno a muchos con Bitácoras
•	Índices: proyecto_id, etapa
•	Características: Control de versiones automático mediante campo version, estados separados para tutor y revisor

Tabla Observaciones:
•	Campos: id (UUID, PK), entrega_id (UUID, FK a entregas), usuario_id (UUID, FK a usuarios), comentario (TEXT), seccion_documento (VARCHAR 200), tipo (VARCHAR 50, CHECK: observacion/aprobacion/rechazo), estado_resuelto (BOOLEAN, DEFAULT false), fecha, created_at
•	Relaciones: Muchos a uno con Entregas y Usuarios
•	Índices: entrega_id, usuario_id
•	Triggers: Creación automática de notificaciones cuando se inserta una observación

Tabla Notificaciones:
•	Campos: id (UUID, PK), usuario_id (UUID, FK a usuarios), tipo (VARCHAR 50, CHECK: nueva_observacion/nueva_entrega/proyecto_asignado/entrega_aprobada/entrega_rechazada/proyecto_completado/recordatorio), mensaje (TEXT), relacion_id (UUID, nullable), relacion_tipo (VARCHAR 50, nullable), leida (BOOLEAN, DEFAULT false), fecha_creacion, created_at
•	Relaciones: Muchos a uno con Usuarios
•	Índices: usuario_id, leida
•	Características: Sistema de notificaciones con tipos específicos y relación con entidades del sistema

Tabla proyecto_revisores:
•	Campos: id (UUID, PK), proyecto_id (UUID, FK a proyectos), revisor_id (UUID, FK a usuarios), asignado_por (UUID, FK a usuarios, nullable), fecha_asignacion
•	Relaciones: Muchos a uno con Proyectos y Usuarios (revisor)
•	Restricción: UNIQUE(proyecto_id, revisor_id) para evitar asignaciones duplicadas
•	Características: Permite asignar múltiples revisores a un proyecto

Tabla Bitácoras:
•	Campos: id (UUID, PK), entrega_id (UUID, FK a entregas), usuario_id (UUID, FK a usuarios), accion (VARCHAR 50, CHECK: creacion/modificacion/subida/descarga/revision/aprobacion/rechazo), descripcion (TEXT), cambios_detectados (JSONB), version_anterior (INTEGER), version_actual (INTEGER), fecha, created_at
•	Relaciones: Muchos a uno con Entregas y Usuarios
•	Índices: entrega_id, usuario_id, fecha
•	Características: Sistema de trazabilidad completo que registra todas las acciones realizadas sobre los documentos, incluyendo cambios detectados entre versiones almacenados en formato JSONB

3.7.3	Políticas de Backup y Triggers Implementados

Neon proporciona backups automáticos gestionados:
•	Backup automático continuo: Neon realiza backups automáticos de la base de datos PostgreSQL
•	Punto de recuperación: Capacidad de restaurar a cualquier punto en el tiempo (según plan)
•	Retención: Backups gestionados automáticamente por Neon según el plan seleccionado
•	Almacenamiento: Backups almacenados de forma segura en la infraestructura de Neon
•	Pruebas de restauración: Posibilidad de restaurar backups desde el dashboard de Neon

Funciones y Triggers Implementados en PostgreSQL:
•	Función update_updated_at_column(): Actualiza automáticamente el campo updated_at en las tablas usuarios y proyectos cuando se modifica un registro
•	Trigger trigger_notificacion_entrega: Crea automáticamente una notificación para el tutor cuando se inserta una nueva entrega
•	Trigger trigger_notificacion_observacion: Crea automáticamente una notificación para el estudiante cuando se inserta una nueva observación
•	Extensiones PostgreSQL: uuid-ossp para generación de UUIDs y pgcrypto para funciones criptográficas

3.7.4	Versionado y Migraciones

El sistema implementa un sistema de migraciones SQL para gestionar cambios en el esquema de base de datos:
•	Control de versiones del esquema mediante archivos SQL numerados (001_, 002_, 003_)
•	Archivo schema.sql principal: Contiene el esquema completo de la base de datos con todas las tablas, índices, funciones y triggers
•	Migraciones incrementales: Archivos en backend/migrations/ para cambios específicos (ej: 001_update_proyectos_fecha_entrega.sql, 002_add_estados_proyecto.sql, 003_add_estados_tutor_revisor.sql)
•	Rollback: Migraciones de rollback disponibles (ej: 001_rollback_proyectos_fecha.sql) para revertir cambios
•	Reproducibilidad: El esquema puede reproducirse en diferentes entornos ejecutando schema.sql o aplicando migraciones secuencialmente
•	Herramientas: Neon Dashboard SQL Editor para ejecutar migraciones, script de migración TypeScript (src/db/migrate.ts) para automatización
•	Branching de base de datos: Neon permite crear ramas de base de datos para desarrollo y pruebas sin afectar producción

3.8	HERRAMIENTAS Y SERVICIOS

3.8.1	Entorno de Desarrollo Integrado (IDE)
•	Visual Studio Code: Editor principal utilizado con extensiones para React, TypeScript y desarrollo full-stack
•	Extensiones clave implementadas: ESLint, TypeScript, React snippets, PostgreSQL (extensión para VS Code), GitLens
•	TypeScript: Configuración de tsconfig.json para frontend y backend con reglas estrictas de tipado

3.8.2	Repositorio de Código
•	GitHub: Plataforma utilizada para control de versiones
•	Estructura de ramas: main (producción), develop (desarrollo), feature/* (nuevas funcionalidades)
•	Política de commits: Mensajes descriptivos siguiendo convenciones (feat:, fix:, docs:)
•	Estructura del proyecto: Separación clara entre frontend/ y backend/ con configuración independiente

3.8.3	Despliegue
El despliegue se realiza de manera manual o automática:
•	Backend: Compilación con TypeScript (npm run build) y ejecución con Node.js (npm start)
•	Frontend: Build con Vite (npm run build) generando carpeta dist/ para despliegue estático
•	Base de datos: Migraciones ejecutadas mediante Neon Dashboard SQL Editor o script de migración
•	Archivos estáticos: Servidos directamente por Express en desarrollo, configurables para CDN en producción
•	Variables de entorno: Configuración mediante archivos .env en desarrollo y variables de entorno en producción

3.8.4	Frameworks de Testing y Validación
•	Postman: Herramienta principal utilizada para pruebas de APIs durante el desarrollo
•	TypeScript: Tipado estático actúa como verificación de tipos en tiempo de compilación
•	Zod: Validación de esquemas en tiempo de ejecución para todas las entradas de API
•	ESLint: Linter configurado para mantener calidad de código en TypeScript/JavaScript
•	Pruebas manuales: Pruebas de integración y usabilidad realizadas con usuarios finales

3.8.5	Herramientas de Calidad de Código
•	ESLint: Linter configurado para TypeScript/JavaScript con reglas para React y TypeScript
•	TypeScript: Compilador TypeScript con configuración estricta que detecta errores en tiempo de desarrollo
•	Zod: Validación de esquemas que garantiza integridad de datos en runtime
•	Git: Control de versiones con commits descriptivos y estructura de ramas organizada

3.8.6	Herramientas de Diseño
•	Figma: Para diseño de interfaces de usuario y prototipado
•	Herramientas de diagramación: Draw.io para diagramas de arquitectura y flujos

3.8.7	Monitoreo y Logging
•	Logging básico mediante console.log y manejo de errores estándar de Node.js
•	Niveles de log: error, warn, info, debug

3.9	PRUEBAS DEL SOFTWARE

Las pruebas del software se realizarán en múltiples niveles para garantizar la calidad, funcionalidad y confiabilidad del sistema desarrollado.

3.9.1	Tipos de Pruebas

Pruebas Unitarias:
•	Objetivo: Verificar el funcionamiento correcto de funciones y métodos individuales
•	Alcance: Lógica de negocio, utilidades, validaciones
•	Herramienta: Jest
•	Cobertura objetivo: 80% del código backend

Pruebas de Integración:
•	Objetivo: Verificar la interacción correcta entre componentes del sistema
•	Alcance: Comunicación frontend-backend, integración con base de datos, APIs REST
•	Herramienta: Jest
•	Escenarios: Flujos completos de usuario (registro, login, creación de proyecto, etc.)

Pruebas de Componentes (Frontend):
•	Objetivo: Verificar el comportamiento y renderizado de componentes React
•	Alcance: Componentes individuales, hooks personalizados, formularios
•	Herramienta: Jest
•	Cobertura objetivo: 70% de componentes críticos

Pruebas de Usabilidad:
•	Objetivo: Evaluar la experiencia de usuario y facilidad de uso
•	Metodología: Sesiones de prueba con usuarios reales (estudiantes, tutores)
•	Métricas: Tiempo para completar tareas, tasa de error, satisfacción subjetiva
•	Participantes: Mínimo 10 usuarios por perfil

Pruebas de Carga:
•	Objetivo: Verificar el rendimiento bajo condiciones de uso normal y pico
•	Metodología: Pruebas manuales con múltiples usuarios y herramientas básicas de navegador
•	Escenarios: 50, 100, 200 usuarios concurrentes
•	Métricas: Tiempo de respuesta, throughput, tasa de error

Pruebas de Seguridad:
•	Objetivo: Identificar vulnerabilidades de seguridad
•	Alcance: Autenticación, autorización, validación de entrada, protección contra SQL injection, XSS
•	Metodología: Análisis manual de código y pruebas de penetración básicas

3.9.2	Plan de Pruebas

Fase de Pruebas Unitarias (Semanas 9-12):
•	Desarrollo paralelo de código y pruebas unitarias
•	Ejecución manual de pruebas durante el desarrollo

Fase de Pruebas de Integración (Semanas 13-14):
•	Pruebas de flujos completos de usuario
•	Validación de integración frontend-backend-base de datos

Fase de Pruebas de Aceptación (Semanas 15-16):
•	Pruebas con usuarios finales en entorno de staging
•	Recolección de feedback y corrección de problemas identificados
•	Validación de cumplimiento de criterios de aceptación definidos

3.9.3	Criterios de Aceptación de Pruebas

El sistema será considerado listo para producción cuando:
•	Todas las pruebas unitarias y de integración pasen exitosamente
•	Al menos 90% de los usuarios de prueba completen las tareas principales sin asistencia
•	El tiempo de respuesta promedio sea menor a 2 segundos bajo carga normal
•	No se identifiquen vulnerabilidades críticas de seguridad
•	Todos los requerimientos de alta prioridad cumplan sus criterios de aceptación

3.10	ESTIMACIÓN DE COSTOS DE SOFTWARE

La estimación de costos del proyecto considera únicamente los recursos de software, ya que el desarrollo será realizado por el estudiante como parte de su proyecto de grado y no contempla costos de personal.

3.10.1	Costos de Licenciamiento

Todas las tecnologías seleccionadas son de código abierto y gratuitas:
•	React.js: Gratuito (licencia MIT)
•	PostgreSQL: Gratuito (licencia PostgreSQL)
•	Neon: Plan gratuito disponible (base de datos generosa con branching, backups automáticos y alta disponibilidad)
•	Herramientas de desarrollo: Visual Studio Code (gratuito), Git (gratuito)

Total costos de licenciamiento: $0.00

3.10.2	Costos de Infraestructura y Hosting

Fase de Desarrollo:
•	Desarrollo local: $0.00 (equipos propios)
•	Repositorio GitHub: $0.00 (plan gratuito suficiente)

Fase de Producción (estimación anual):
•	Vercel (plan gratuito): $0.00 (suficiente para frontend React)
•	Neon (plan gratuito): $0.00 (base de datos generosa con branching, backups automáticos y alta disponibilidad)
•	Alternativa: Si se requiere más capacidad, plan Pro de Neon: $19.00/mes
•	Dominio (opcional): $10.00 - $15.00/año

Total estimado infraestructura: $0.00 - $315.00/año (con plan gratuito: $0.00 - $15.00/año solo dominio)

3.10.3	Costos de Herramientas Adicionales

•	Figma: $0.00 (plan gratuito suficiente para el proyecto)
•	Postman: $0.00 (plan gratuito)
•	Herramientas de testing: $0.00 (todas open source)

Total costos adicionales: $0.00

3.10.4	Resumen de Costos

| Concepto | Costo |
|---|---|
| Licenciamiento de software | $0.00 |
| Infraestructura desarrollo | $0.00 |
| Infraestructura producción (año 1) | $0.00 - $15.00 |
| Herramientas adicionales | $0.00 |
| **TOTAL ESTIMADO** | **$0.00 - $15.00** |

Nota: El costo total del proyecto es mínimo debido al uso exclusivo de tecnologías de código abierto. Los únicos costos potenciales son opcionales y relacionados con hosting en la nube, aunque existe la posibilidad de utilizar infraestructura propia de la universidad sin costo adicional.

3.11	DOCUMENTACIÓN ENTREGABLE

Como parte de la entrega final del proyecto, se proporcionará la siguiente documentación completa:

3.11.1	Manual de Usuario

El manual de usuario estará dirigido a los usuarios finales del sistema (estudiantes, tutores, revisores y administradores) y contendrá:
•	Introducción al sistema y objetivos
•	Requisitos del sistema para acceso
•	Guía de inicio de sesión y recuperación de contraseña
•	Instrucciones detalladas por rol de usuario:
  - Estudiantes: Cómo registrar proyectos, subir documentos, revisar observaciones
  - Tutores: Cómo revisar proyectos, agregar observaciones, aprobar entregas
  - Revisores: Cómo acceder a proyectos asignados, realizar revisiones
  - Administradores: Cómo gestionar usuarios, asignar tutores, generar reportes
•	Capturas de pantalla ilustrativas
•	Preguntas frecuentes (FAQ)
•	Información de contacto para soporte técnico

3.11.2	Guía de Instalación

Documentación técnica dirigida a administradores de sistemas, incluyendo:
•	Requisitos del sistema (hardware y software)
•	Configuración del proyecto Neon:
  - Creación de cuenta y proyecto en Neon
  - Configuración de variables de entorno (URL de conexión a la base de datos)
  - Configuración de autenticación mediante JWT
•	Configuración de base de datos:
  - Ejecución de migraciones mediante Neon CLI o Dashboard
  - Configuración de triggers y funciones almacenadas
  - Configuración de branching para desarrollo y producción
•	Configuración de almacenamiento:
  - Configuración de servicio de almacenamiento de archivos (AWS S3, Cloudinary o similar)
  - Configuración de políticas de acceso a archivos
•	Despliegue del frontend en Vercel:
  - Conexión del repositorio GitHub con Vercel
  - Configuración de variables de entorno
  - Configuración de dominio personalizado (opcional)
•	Solución de problemas comunes
•	Procedimientos de actualización y migración de esquema

3.11.3	Documentación de API

Especificación completa de las APIs RESTful implementadas:
•	Base URL: URL del backend (ej: http://localhost:3001/api o https://api.[dominio].com/api)
•	Autenticación: JWT tokens obtenidos mediante el sistema de autenticación propio, enviados en header Authorization: Bearer <token>
•	Formato de respuesta: JSON para todas las respuestas
•	Manejo de errores: Middleware centralizado que retorna errores en formato JSON con código de estado HTTP apropiado

Endpoints REST Implementados:

APIs de Autenticación (/api/auth):
  - POST /api/auth/register - Registro de usuarios (nombre, apellidos, email, password, rol)
  - POST /api/auth/login - Inicio de sesión (email, password) - Retorna JWT token
  - GET /api/auth/me - Obtener usuario actual autenticado

APIs de Proyectos (/api/proyectos):
  - GET /api/proyectos - Listar proyectos (filtrado automático por rol del usuario)
  - GET /api/proyectos/:id - Obtener proyecto específico
  - POST /api/proyectos - Crear proyecto (solo estudiantes)
  - PUT /api/proyectos/:id - Actualizar proyecto
  - POST /api/proyectos/:id/assign-tutor - Asignar tutor a proyecto (solo administrador)
  - POST /api/proyectos/:id/assign-reviewer - Asignar revisor a proyecto (solo administrador)

APIs de Entregas (/api/entregas):
  - GET /api/entregas/proyecto/:proyectoId - Listar entregas de un proyecto
  - GET /api/entregas/:id - Obtener entrega específica
  - POST /api/entregas - Subir nueva entrega con archivo (multipart/form-data, solo estudiantes)
  - PUT /api/entregas/:id/status - Actualizar estado de entrega (tutor/revisor)
  - GET /api/entregas/:id1/compare/:id2 - Comparar dos versiones de entregas

APIs de Observaciones (/api/observaciones):
  - GET /api/observaciones/entrega/:entregaId - Listar observaciones de una entrega
  - POST /api/observaciones - Crear observación (tutor/revisor)
  - PUT /api/observaciones/:id/resolve - Marcar observación como resuelta (estudiante)

APIs de Notificaciones (/api/notificaciones):
  - GET /api/notificaciones - Listar notificaciones del usuario autenticado
  - GET /api/notificaciones/unread - Contar notificaciones no leídas
  - PUT /api/notificaciones/:id/read - Marcar notificación como leída
  - PUT /api/notificaciones/read-all - Marcar todas las notificaciones como leídas

APIs de Bitácoras (/api/bitacoras):
  - GET /api/bitacoras/entrega/:entregaId - Obtener bitácoras de una entrega
  - POST /api/bitacoras - Crear entrada de bitácora (automático en la mayoría de casos)

APIs de Reportes (/api/reportes):
  - GET /api/reportes/tareas-pendientes - Obtener tareas pendientes del usuario (personalizado por rol)
  - GET /api/reportes/tareas-cumplidas - Obtener tareas cumplidas del usuario
  - GET /api/reportes/avance/:proyectoId - Obtener avance de un proyecto específico
  - GET /api/reportes/tiempos-plazos - Obtener reporte de tiempos y plazos
  - GET /api/reportes/estadisticas - Obtener estadísticas del sistema (solo administrador)

APIs de Usuarios (/api/usuarios):
  - GET /api/usuarios - Listar usuarios (solo administrador)
  - GET /api/usuarios/tutores - Listar tutores disponibles
  - GET /api/usuarios/revisores - Listar revisores disponibles

APIs de Archivos:
  - GET /uploads/:filename - Descargar archivo subido (protegido por autenticación)

Características Implementadas:
  - Validación de datos: Todas las entradas validadas con esquemas Zod antes de procesarse
  - Autenticación y autorización: Middleware de autenticación JWT y autorización por roles
  - Manejo de archivos: Upload de archivos con multer, validación de tipo y tamaño
  - Control de acceso: Verificación de permisos según rol del usuario en cada endpoint
  - Notificaciones automáticas: Triggers en base de datos crean notificaciones automáticamente
  - Bitácoras automáticas: Registro automático de acciones importantes en el sistema

Ejemplos de uso disponibles en el código fuente y documentación del README.md del proyecto.

3.11.4	Informe de Pruebas

Documento que resume los resultados de todas las pruebas realizadas:
•	Resumen ejecutivo de resultados
•	Detalle de pruebas por tipo (unitarias, integración, usabilidad, carga, seguridad)
•	Métricas obtenidas (cobertura de código, tiempos de respuesta, tasa de éxito)
•	Problemas identificados y resueltos
•	Problemas conocidos y planes de resolución futura
•	Recomendaciones para mejoras continuas

3.11.5	Repositorio de Código

Repositorio GitHub público o privado (según decisión institucional) que incluye:
•	Código fuente completo del frontend y backend
•	Scripts de base de datos (migraciones, seeds)
•	Archivo README con descripción del proyecto, instrucciones de instalación y uso
•	Archivo LICENSE con la licencia seleccionada
•	Archivo .gitignore configurado apropiadamente
•	Historial de commits organizado y documentado

3.11.6	Documentación Técnica Adicional

•	Diagramas de arquitectura (C4, despliegue, secuencia)
•	Modelo de base de datos (diagrama ER)
•	Documentación de decisiones arquitectónicas (ADR - Architecture Decision Records)
•	Guía de contribución para futuros desarrolladores
•	Changelog del proyecto

Esta documentación completa garantiza la mantenibilidad del sistema a largo plazo y facilita su adopción por parte de los usuarios finales.
 









 




4.	CAPÍTULO IV
CONCLUSIONES Y RECOMENDACIONES




4.1	CONCLUSIONES

El desarrollo del presente proyecto de grado ha permitido alcanzar los objetivos planteados y generar una solución tecnológica viable para la gestión y seguimiento de proyectos de grado en la Universidad Salesiana de Bolivia, Sede Cochabamba. A continuación se presentan las conclusiones principales, alineadas con cada uno de los objetivos específicos establecidos:

En relación al objetivo de diseñar la arquitectura del sistema integral, se concluye que la arquitectura implementada, basada en React.js 18 con TypeScript y Vite para el frontend, Node.js con Express.js y TypeScript para el backend, y Neon como servicio de base de datos PostgreSQL serverless, constituye una solución técnica sólida, moderna y escalable. La separación en capas (presentación, aplicación, datos) permite un desarrollo modular y facilita el mantenimiento futuro del sistema. El diseño de roles de acceso (estudiante, tutor, revisor y administrador) con autenticación JWT garantiza la seguridad y el control adecuado de las funcionalidades según el perfil de cada usuario. El uso de TypeScript en todo el stack proporciona mayor seguridad de tipos y facilita la detección temprana de errores.

Respecto al desarrollo del módulo de registro de proyectos y asignación de tutores y revisores, se concluye que la implementación de esta funcionalidad centraliza efectivamente la información de los proyectos de grado y permite a los administradores realizar asignaciones de manera más eficiente y transparente. El sistema implementado permite asignar tutores y múltiples revisores a cada proyecto, con estados independientes para tutor y revisor en las entregas. El sistema de control de avances integrado proporciona visibilidad en tiempo real del estado de cada proyecto mediante dashboards personalizados por rol, facilitando la toma de decisiones administrativas.

En cuanto a la implementación del sistema de control de versiones y bitácoras, se concluye que esta funcionalidad resuelve uno de los problemas principales identificados: la pérdida del historial de revisiones. El sistema implementado permite identificar y comparar cambios realizados en los documentos mediante una funcionalidad de comparación que muestra diferencias en nombre de archivo, tamaño y fecha entre versiones. Además, se implementó un sistema completo de bitácoras que registra todas las acciones realizadas (creación, modificación, subida, descarga, revisión, aprobación, rechazo) con información detallada de usuario, fecha y cambios detectados almacenados en formato JSONB. Esto mejora significativamente la trazabilidad del proceso y facilita el seguimiento del avance de cada proyecto.

Sobre el desarrollo del módulo de retroalimentación, se concluye que la centralización de las observaciones realizadas por tutores y revisores elimina la fragmentación de la comunicación que caracterizaba el proceso anterior. El registro estructurado de retroalimentación por sección del documento permite a los estudiantes identificar claramente las áreas que requieren corrección, mejorando la eficiencia del proceso de revisión y corrección.

En relación a la integración de notificaciones y reportes automáticos, se concluye que estas funcionalidades mejoran la comunicación proactiva entre los actores del sistema y reducen los tiempos de respuesta. Las notificaciones automáticas implementadas mediante triggers de base de datos aseguran que los estudiantes sean informados oportunamente sobre nuevas observaciones y entregas, y que los tutores reciban notificaciones cuando hay nuevas entregas. El sistema de reportes implementado incluye tres tipos principales: (1) reportes de tareas pendientes personalizados por rol (estudiantes ven observaciones no resueltas y entregas pendientes, tutores ven entregas sin revisar, revisores ven proyectos asignados, administradores ven proyectos sin tutor), (2) reportes de tareas cumplidas con historial de trabajo realizado, y (3) estadísticas administrativas completas con métricas del sistema (proyectos por estado, entregas por etapa y estado, observaciones totales y pendientes, distribución de usuarios por rol). Estos reportes proporcionan información consolidada para la gestión académica y facilitan la toma de decisiones basada en datos.

Finalmente, respecto a las pruebas de validación realizadas con usuarios finales y el desarrollo técnico del sistema, se concluye que el sistema desarrollado cumple con los criterios de aceptación establecidos y es funcionalmente adecuado para su implementación. La implementación técnica incluye validación robusta de datos con Zod, autenticación segura con JWT y bcryptjs, manejo de archivos con multer, y un sistema completo de base de datos con triggers automáticos para notificaciones. El uso de TypeScript en todo el stack proporciona mayor seguridad y mantenibilidad del código. La retroalimentación recibida durante las pruebas de usabilidad permitió realizar ajustes que mejoraron significativamente la experiencia de usuario. El sistema está completamente funcional y listo para su despliegue en producción.

En términos generales, se concluye que el proyecto ha logrado su objetivo principal de desarrollar una aplicación web que digitaliza, centraliza y optimiza la gestión de proyectos de grado. La solución tecnológica propuesta representa un avance significativo hacia la modernización de los procesos académicos de la Universidad Salesiana de Bolivia y se alinea con las tendencias actuales de transformación digital en la educación superior.

4.2	RECOMENDACIONES

Con base en el desarrollo del proyecto y las experiencias obtenidas durante el proceso, se presentan las siguientes recomendaciones organizadas en tres categorías: operativas, mejoras inmediatas y líneas futuras de desarrollo.

4.2.1	Recomendaciones Operativas

Para la implementación exitosa del sistema en producción, se recomienda:

•	Capacitación sistemática de usuarios: Implementar un programa de capacitación estructurado para todos los perfiles de usuario antes del lanzamiento oficial. Se sugiere realizar sesiones diferenciadas por rol, incluyendo material de apoyo visual y ejercicios prácticos que permitan a los usuarios familiarizarse con las funcionalidades del sistema.

•	Migración gradual de datos: Realizar una migración piloto con un grupo reducido de proyectos (10-15 proyectos) durante el primer mes de implementación, antes de migrar todos los proyectos activos. Esto permitirá identificar y resolver problemas operativos sin afectar a toda la población de usuarios.

•	Establecimiento de soporte técnico: Designar un responsable técnico o equipo de soporte que pueda atender consultas y resolver problemas durante las primeras semanas de implementación. Se recomienda establecer canales de comunicación claros (correo electrónico, sistema de tickets) y horarios de atención definidos.

•	Monitoreo continuo: Implementar un sistema de monitoreo que permita identificar problemas de rendimiento, errores y patrones de uso durante los primeros tres meses de operación. Esta información será valiosa para realizar ajustes y optimizaciones.

4.2.2	Mejoras Inmediatas

Para optimizar el funcionamiento del sistema en el corto plazo, se recomienda:

•	Implementación de búsqueda avanzada: Mejorar las funcionalidades de búsqueda y filtrado para permitir consultas más complejas y específicas, facilitando la localización de proyectos y documentos.

•	Optimización de rendimiento: Realizar análisis de rendimiento y optimización de consultas a la base de datos, especialmente en módulos que manejan grandes volúmenes de datos como los reportes administrativos.

•	Mejora de la interfaz móvil: Aunque el sistema es responsive, se recomienda realizar ajustes específicos para mejorar la experiencia en dispositivos móviles, considerando que muchos usuarios accederán desde smartphones o tablets.

•	Implementación de recordatorios automáticos: Expandir el sistema de notificaciones para incluir recordatorios automáticos de fechas límite de entrega, basados en los cronogramas establecidos para cada proyecto.

4.2.3	Líneas Futuras de Desarrollo

Para la evolución y mejora continua del sistema, se recomienda considerar las siguientes líneas de desarrollo:

•	Integración con sistemas institucionales: Evaluar la posibilidad de integrar el sistema con otros sistemas de la universidad, como el sistema de matrícula o la plataforma de gestión académica general, para automatizar la sincronización de datos de estudiantes y docentes.

•	Implementación de análisis predictivo: Desarrollar módulos de análisis que utilicen los datos históricos para identificar patrones y predecir proyectos en riesgo de retraso, permitiendo intervenciones tempranas.

•	Expansión a otras carreras: Una vez validada la efectividad del sistema en la Carrera de Ingeniería de Sistemas, considerar su expansión a otras carreras de la universidad, adaptando los procesos según las particularidades de cada programa académico.

•	Implementación de funcionalidades colaborativas: Agregar características que permitan la colaboración entre estudiantes en proyectos grupales, incluyendo herramientas de comunicación en tiempo real y gestión de tareas compartidas.

•	Desarrollo de aplicación móvil nativa: Considerar el desarrollo de aplicaciones móviles nativas (iOS y Android) para mejorar la accesibilidad y experiencia de usuario en dispositivos móviles, especialmente para estudiantes que requieren acceso frecuente al sistema.

•	Implementación de inteligencia artificial: Explorar la posibilidad de incorporar herramientas de IA para asistir en la revisión de documentos, detectar posibles plagios, o generar sugerencias automáticas de mejora en la estructura y contenido de los proyectos.

•	Mejora de la accesibilidad: Realizar una auditoría completa de accesibilidad web (WCAG 2.1) e implementar mejoras para garantizar que el sistema sea accesible para usuarios con discapacidades.

Estas recomendaciones, implementadas de manera progresiva y priorizada, contribuirán a la evolución continua del sistema y al fortalecimiento de su impacto en la mejora de los procesos académicos de la Universidad Salesiana de Bolivia.


 
BIBLIOGRAFÍA
●	GitHub Docs. (2024). GitHub Documentation. Recuperado de: https://docs.github.com/
●	Gómez, L., & Vargas, C. (2022). Transformación digital en universidades de América Latina: retos y oportunidades. Revista Iberoamericana de Tecnología Educativa, 18(1), 45-60.
●	ISO/IEC 25010:2011. (2011). Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models.
●	Ley Nº 164. (2012). Ley de Protección de Datos Personales. Estado Plurinacional de Bolivia.
●	MDN Web Docs. (2024). Web technology references. Recuperado de: https://developer.mozilla.org/
●	MongoDB Documentation. (2024). MongoDB Manual. Recuperado de: https://www.mongodb.com/docs/
●	PostgreSQL Documentation. (2024). PostgreSQL Documentation. Recuperado de: https://www.postgresql.org/docs/
●	Neon Documentation. (2024). Neon Docs. Recuperado de: https://neon.tech/docs
●	Node.js Documentation. (2024). Node.js Official Documentation. Recuperado de: https://nodejs.org/en/docs/
●	Paredes, R., & Ruiz, M. (2020). Sistemas de gestión de recursos audiovisuales en educación superior: Caso Universidad Católica de Chile. Revista Latinoamericana de Tecnología Educativa, 15(2), 112-125.
●	Paredes, R., & Ruiz, M. (2021). Plataformas digitales para el seguimiento de tesis en universidades latinoamericanas. Revista de Innovación Educativa, 29(3), 77-89.
●	Postman Documentation. (2024). Postman Learning Center. Recuperado de: https://learning.postman.com/
●	Pressman, R. S. (2010). Ingeniería del Software: Un enfoque práctico (7.ª ed.). McGraw-Hill.
●	Railway Documentation. (2024). Railway Documentation. Recuperado de: https://docs.railway.app/
●	React.js Documentation. (2024). React -- A JavaScript library for building user interfaces. Recuperado de: https://reactjs.org/
●	Vercel Documentation. (2024). Vercel Docs. Recuperado de: https://vercel.com/docs
●	Sommerville, I. (2011). Ingeniería de Software (9.ª ed.). Pearson Educación.
●	Stack Overflow. (2024). Developer Community. Recuperado de: https://stackoverflow.com/
●	Torrez Parra, J. V. (2024). Entrevistas con docentes tutores de proyectos de grado [Registros de campo]. Universidad Salesiana de Bolivia.
●	Torrez Parra, J. V. (2024). Entrevistas con estudiantes de la Carrera de Ingeniería de Sistemas [Registros de campo]. Universidad Salesiana de Bolivia.
●	Torrez Parra, J. V. (2024). Entrevista con Jefa de Carrera de Ingeniería de Sistemas [Registro de campo]. Universidad Salesiana de Bolivia.
●	UNESCO. (2022). Informe sobre implementación de sistemas digitales en universidades peruanas. Recuperado de: https://unesdoc.unesco.org/
●	UNESCO. (2023). Digitalización de la Educación Superior en América Latina: Informe Regional. Recuperado de: https://unesdoc.unesco.org/
●	Universidad Salesiana de Bolivia. (2023). Manual de Procedimientos Académicos. Cochabamba, Bolivia.
●	Universidad Salesiana de Bolivia. (2023). Reglamento de Proyectos de Grado. Cochabamba, Bolivia.
●	Vercel Documentation. (2024). Vercel Docs. Recuperado de: https://vercel.com/docs
●	W3Schools. (2024). HTML, CSS, JavaScript Tutorials. Recuperado de: https://www.w3schools.com/























ANEXOS



 
ANEXO 1.  
TRANSCRIPCIÓN DE ENTREVISTA

**ENTREVISTA REALIZADA A ESTUDIANTE DE LA CARRERA DE INGENIERÍA DE SISTEMAS**

**Fecha:** 15 de marzo de 2024
**Lugar:** Universidad Salesiana de Bolivia, Sede Cochabamba
**Entrevistador:** Josue Valentino Torrez Parra (Estudiante investigador)
**Entrevistado:** Estudiante de Ingeniería de Sistemas (nombre reservado por confidencialidad)
**Duración:** 42 minutos
**Modalidad:** Presencial, grabación de audio con consentimiento previo

---

**ENTREVISTADOR:** Buenos días, gracias por aceptar participar en esta entrevista. Como te expliqué previamente, estoy desarrollando un proyecto de grado que busca crear una aplicación web para mejorar la gestión de proyectos de grado en nuestra universidad. Tus respuestas serán confidenciales y solo se usarán con fines académicos. ¿Tienes alguna pregunta antes de comenzar?

**ENTREVISTADO:** No, está bien, podemos comenzar.

**ENTREVISTADOR:** Perfecto. Primero, ¿podrías contarme un poco sobre tu experiencia actual con el proceso de proyecto de grado? ¿En qué etapa te encuentras?

**ENTREVISTADO:** Sí, claro. Estoy en mi último año, ya tengo mi anteproyecto aprobado y estoy trabajando en las entregas parciales. Llevo aproximadamente tres meses desarrollando el proyecto con mi tutor.

**ENTREVISTADOR:** Entiendo. ¿Cómo es actualmente tu comunicación con tu tutor? ¿Qué medios utilizas?

**ENTREVISTADO:** Principalmente por correo electrónico y WhatsApp. Le envío los avances por correo y a veces me contesta rápido, pero otras veces tarda varios días. Por WhatsApp le escribo cuando tengo dudas urgentes, pero no siempre está disponible. También tenemos reuniones presenciales, pero son esporádicas, como cada dos o tres semanas.

**ENTREVISTADOR:** ¿Has experimentado algún problema con este método de comunicación?

**ENTREVISTADO:** Sí, varios. Por ejemplo, una vez envié una versión del documento y mi tutor me respondió con observaciones, pero después cuando quise revisar qué me había dicho exactamente, tuve que buscar en todo el historial de correos. A veces se pierden los mensajes o las observaciones están en diferentes correos y es difícil seguir el hilo. También me pasó que envié una versión corregida pero mi tutor tenía abierta la versión anterior y me hizo observaciones sobre cosas que ya había corregido.

**ENTREVISTADOR:** Eso suena frustrante. ¿Cómo manejas las diferentes versiones de tu documento?

**ENTREVISTADO:** Es un caos, la verdad. Tengo archivos con nombres como "Proyecto_v1.docx", "Proyecto_v2_corregido.docx", "Proyecto_v3_final.docx", y después "Proyecto_v3_final_REAL.docx" porque pensé que era la final pero tuve que hacer más cambios. A veces no recuerdo cuál es la versión más reciente o qué cambios hice en cada una. Me gustaría tener un sistema que guarde todas las versiones y me muestre qué cambié.

**ENTREVISTADOR:** ¿Qué opinas sobre el proceso de recibir observaciones de tu tutor o revisores?

**ENTREVISTADO:** Las observaciones son útiles, pero el problema es que a veces vienen por correo, otras veces en un documento Word con comentarios, y otras veces en WhatsApp. No tengo un lugar centralizado donde ver todas las observaciones juntas. Además, cuando tengo que corregir algo, no siempre recuerdo si ya lo resolví o no, porque no hay un seguimiento claro.

**ENTREVISTADOR:** ¿Te gustaría tener alguna funcionalidad específica en un sistema digital para gestionar tu proyecto?

**ENTREVISTADO:** Sí, varias cosas. Primero, me gustaría poder subir mi documento y que el sistema guarde todas las versiones automáticamente, así sé cuál es la más reciente. También querría un lugar donde pueda ver todas las observaciones que me han hecho, organizadas por fecha o por sección del documento. Y sería genial recibir notificaciones cuando mi tutor revise algo o cuando haya nuevas observaciones, así no tengo que estar revisando el correo constantemente.

**ENTREVISTADOR:** ¿Has tenido problemas para saber en qué etapa del proceso te encuentras o qué sigue?

**ENTREVISTADO:** Sí, a veces no estoy seguro si ya cumplí con todos los requisitos de una etapa o si puedo pasar a la siguiente. Me gustaría tener un panel o algo así que me muestre claramente en qué etapa estoy, qué entregas he hecho, cuáles están aprobadas y cuáles pendientes.

**ENTREVISTADOR:** ¿Qué opinas sobre el tiempo que toma el proceso de revisión?

**ENTREVISTADO:** A veces es muy lento. Envío algo y espero días o hasta una semana para recibir retroalimentación. Eso retrasa mi avance porque no sé si voy bien o si necesito cambiar algo. Si hubiera un sistema que notifique a mi tutor cuando subo algo nuevo, tal vez sería más rápido.

**ENTREVISTADOR:** ¿Has trabajado con revisores además de tu tutor?

**ENTREVISTADO:** Todavía no, pero sé que cuando llegue ese momento será similar. Me han contado compañeros que es complicado porque los revisores también envían observaciones por correo y a veces se contradicen o se pierden mensajes.

**ENTREVISTADOR:** Para finalizar, si tuvieras que describir el problema principal del proceso actual, ¿qué dirías?

**ENTREVISTADO:** Creo que el problema principal es que todo está muy disperso. No hay un lugar centralizado donde esté toda la información de mi proyecto. Las comunicaciones están en diferentes lugares, las versiones de documentos están en mi computadora con nombres confusos, y no tengo claridad sobre el estado real de mi proyecto. Un sistema que centralice todo esto haría el proceso mucho más fácil y menos estresante.

**ENTREVISTADOR:** Perfecto, esas son todas mis preguntas. ¿Hay algo más que quieras agregar sobre tu experiencia con el proceso de proyecto de grado?

**ENTREVISTADO:** Solo agregar que creo que un sistema digital sería muy beneficioso, especialmente para estudiantes como yo que trabajan y estudian al mismo tiempo. Tener acceso desde cualquier lugar y en cualquier momento facilitaría mucho las cosas.

**ENTREVISTADOR:** Excelente, muchas gracias por tu tiempo y por compartir tu experiencia. Tu información será muy valiosa para el desarrollo del proyecto.

**ENTREVISTADO:** De nada, espero que el proyecto salga bien y que realmente se implemente porque sería muy útil.

---

**FIN DE LA ENTREVISTA**

---

**ANEXO 2.  
TRANSCRIPCIÓN DE ENTREVISTA CON DOCENTE TUTOR**

**Fecha:** 18 de marzo de 2024
**Lugar:** Universidad Salesiana de Bolivia, Sede Cochabamba
**Entrevistador:** Josue Valentino Torrez Parra (Estudiante investigador)
**Entrevistado:** Docente Tutor de la Carrera de Ingeniería de Sistemas (nombre reservado por confidencialidad)
**Duración:** 38 minutos
**Modalidad:** Presencial, grabación de audio con consentimiento previo

---

**ENTREVISTADOR:** Buenas tardes, profesor. Muchas gracias por aceptar participar en esta entrevista. Como le mencioné, estoy desarrollando un proyecto de grado sobre gestión de proyectos de grado y su perspectiva como tutor es muy valiosa. ¿Podemos comenzar?

**ENTREVISTADO:** Sí, claro, adelante.

**ENTREVISTADOR:** Primero, ¿cuántos años de experiencia tiene como tutor de proyectos de grado?

**ENTREVISTADO:** Tengo aproximadamente ocho años de experiencia dirigiendo proyectos de grado en la carrera. He acompañado alrededor de veinte estudiantes en total durante este tiempo.

**ENTREVISTADOR:** ¿Cuántos proyectos está dirigiendo actualmente?

**ENTREVISTADO:** En este momento tengo cinco proyectos activos, todos en diferentes etapas. Algunos están en anteproyecto, otros en desarrollo y uno casi listo para sustentación.

**ENTREVISTADOR:** ¿Cómo maneja actualmente la comunicación y seguimiento con sus estudiantes?

**ENTREVISTADO:** Principalmente por correo electrónico. Los estudiantes me envían sus avances y yo les devuelvo observaciones por el mismo medio. También uso WhatsApp para consultas rápidas, pero trato de mantener lo formal en el correo. Tengo reuniones presenciales cuando es necesario, pero no siempre es posible coordinar horarios.

**ENTREVISTADO:** ¿Qué dificultades encuentra en este proceso?

**ENTREVISTADO:** Varias. La principal es que cuando tengo varios proyectos, es difícil llevar un control de qué estudiante está en qué etapa, qué entregó y qué falta. A veces recibo un correo y no recuerdo inmediatamente qué versión del documento está revisando el estudiante. También me pasa que hago observaciones en un documento y después el estudiante envía una nueva versión, pero no sé exactamente qué cambió, así que tengo que revisar todo de nuevo.

**ENTREVISTADOR:** ¿Le gustaría tener alguna herramienta que le facilitara este trabajo?

**ENTREVISTADO:** Definitivamente. Me gustaría tener un panel donde pueda ver todos mis proyectos en un solo lugar, con el estado de cada uno claramente visible. También sería útil poder ver el historial de versiones de cada documento y comparar versiones para identificar cambios rápidamente. Y un sistema de notificaciones me ayudaría a no perder de vista cuando un estudiante sube algo nuevo.

**ENTREVISTADOR:** ¿Cómo maneja las observaciones que hace a los estudiantes?

**ENTREVISTADO:** Las escribo en el correo o en comentarios del Word. El problema es que después no tengo un registro centralizado de qué observaciones hice y cuáles fueron resueltas. A veces un estudiante me pregunta sobre una observación anterior y tengo que buscar en el historial de correos, lo cual toma tiempo.

**ENTREVISTADO:** ¿Qué opina sobre el tiempo que toma el proceso de revisión?

**ENTREVISTADO:** A veces es difícil responder rápido porque tengo que revisar el documento completo, hacer observaciones detalladas, y eso toma tiempo. Si hubiera un sistema que me notifique cuando hay una nueva entrega y me permita hacer observaciones de manera más organizada, podría ser más eficiente. También me ayudaría poder ver qué observaciones anteriores ya fueron atendidas.

**ENTREVISTADOR:** ¿Ha trabajado como revisor además de tutor?

**ENTREVISTADO:** Sí, también he sido revisor en varias oportunidades. Ahí el problema es similar: recibo el documento por correo, lo reviso, envío observaciones, pero después no sé si el estudiante las atendió o no, porque la comunicación es indirecta a través del tutor.

**ENTREVISTADOR:** Si pudiera diseñar un sistema ideal para gestionar proyectos de grado, ¿qué funcionalidades incluiría?

**ENTREVISTADO:** Primero, un dashboard donde pueda ver todos mis proyectos con su estado actual. Segundo, un sistema de control de versiones que me muestre claramente los cambios entre versiones. Tercero, un lugar centralizado para hacer observaciones que queden registradas y organizadas. Cuarto, notificaciones cuando hay nuevas entregas o cuando un estudiante responde a mis observaciones. Y finalmente, reportes que me permitan ver el avance general de todos mis proyectos.

**ENTREVISTADOR:** ¿Cree que un sistema digital mejoraría la calidad del acompañamiento a los estudiantes?

**ENTREVISTADO:** Sin duda. Al tener mejor organización y visibilidad del proceso, puedo dedicar más tiempo a la asesoría de fondo en lugar de perder tiempo buscando información o coordinando por múltiples canales. También me permitiría dar retroalimentación más oportuna, lo cual es crucial para que los estudiantes avancen adecuadamente.

**ENTREVISTADOR:** ¿Tiene alguna preocupación sobre la implementación de un sistema digital?

**ENTREVISTADO:** La única preocupación sería que sea fácil de usar. Si el sistema es muy complicado, los docentes y estudiantes no lo usarán. Debe ser intuitivo y no agregar trabajo adicional, sino simplificar el proceso actual.

**ENTREVISTADOR:** Perfecto, esas son todas mis preguntas. ¿Algo más que quiera agregar?

**ENTREVISTADO:** Solo que creo que este tipo de sistema es necesario y que la universidad debería modernizar estos procesos. Estamos formando ingenieros de sistemas pero seguimos usando métodos muy tradicionales para gestionar nuestros propios proyectos académicos. Sería una buena señal de coherencia implementar tecnología en nuestros procesos.

**ENTREVISTADOR:** Excelente punto. Muchas gracias por su tiempo y sus valiosos aportes.

**ENTREVISTADO:** De nada, éxito con el proyecto.

---

**FIN DE LA ENTREVISTA**
