# 03_glosario_de_terminos.md — Glosario de términos DevOps e introducción a Jenkins

Este glosario reúne conceptos necesarios para entender Jenkins y su papel en un flujo DevOps. Incluye términos de integración continua, Pipelines, control de versiones, agentes, builds, pruebas, artefactos y seguridad. Cada entrada explica el concepto, lo relaciona con Jenkins y, cuando conviene, ofrece una pregunta o un ejemplo para practicar.

El objetivo no es memorizar una lista de definiciones, sino aprender a usar los términos con precisión al leer un `Jenkinsfile`, investigar un fallo o explicar una decisión técnica. Las sesiones prácticas se realizan en la instancia y los repositorios de laboratorio autorizados por el curso.

> **Límite del laboratorio:** utiliza solo jobs, agents y repositorios aprobados por el docente. No guardes credenciales en código, no instales plugins en una instancia compartida y no ejecutes comandos contra sistemas de producción.

---

## Objetivos y alcance

El glosario ayuda a construir un vocabulario común para explicar prácticas de Jenkins y DevOps.

### Resultados de aprendizaje

Al terminar, podrás:

- Definir conceptos fundamentales de DevOps.
- Diferenciar integración, entrega y despliegue continuos.
- Explicar los componentes básicos de Jenkins.
- Distinguir controller, node, agent y executor.
- Leer la estructura de un Pipeline.
- Interpretar términos comunes de Git y de los sistemas de repositorios.
- Diferenciar una build de un artefacto.
- Explicar cómo se relacionan pruebas, reportes y stages.
- Reconocer términos esenciales de seguridad.
- Interpretar estados de una ejecución.
- Usar vocabulario preciso al pedir ayuda.
- Documentar una build sin exponer información sensible.

### Cómo utilizar el glosario

- Lee la definición del término.
- Observa su relación con Jenkins.
- Revisa el ejemplo o la pregunta asociada.
- Busca términos relacionados cuando una definición los mencione.
- Comprueba versiones y comportamiento en la documentación oficial.
- Utiliza el término en una explicación propia.
- Evita tratar el glosario como una especificación completa del producto.

### Qué queda fuera

Este documento no:

- Sustituye la documentación oficial de Jenkins.
- Describe toda opción de configuración.
- Garantiza que cada término se utilice igual en todas las organizaciones.
- Autoriza cambios administrativos.
- Proporciona credenciales.
- Define un proceso de producción.
- Reemplaza las instrucciones del entorno del curso.

---

## Conceptos DevOps

Estos términos describen prácticas y objetivos generales que suelen relacionarse con Jenkins.

### DevOps

**DevOps** es un conjunto de prácticas y formas de colaboración que ayudan a integrar el desarrollo de software con su operación.

- No es un producto único.
- No es únicamente una herramienta de CI.
- No equivale a “automatizarlo todo”.
- Busca mejorar el flujo, la calidad y la colaboración.
- Incluye personas, procesos y tecnología.
- Puede incorporar Jenkins como una de sus herramientas.
- Su aplicación concreta depende de cada organización.

**Ejemplo:** desarrollo y operaciones colaboran para crear un proceso de build y pruebas automatizado.

**Pregunta de práctica:** ¿qué parte del proceso de software se automatiza y qué parte sigue necesitando revisión humana?

### Integración continua

La **integración continua**, o CI, consiste en integrar cambios frecuentes en una base de código compartida y validar esos cambios mediante procesos automatizados.

- Un commit puede activar una build.
- La build puede compilar y ejecutar pruebas.
- El resultado proporciona feedback al equipo.
- Jenkins puede coordinar estas tareas.
- CI no significa que cada cambio se despliegue automáticamente.
- La calidad de CI depende de las pruebas y del proceso.

**Ejemplo:** cada cambio de una rama de práctica inicia una Pipeline que ejecuta pruebas unitarias.

### Entrega continua

La **entrega continua** mantiene el software en un estado potencialmente listo para desplegarse.

- Automatiza pasos de build, pruebas y preparación.
- Puede producir artefactos verificables.
- El despliegue final puede requerir aprobación.
- No significa necesariamente que cada cambio llegue automáticamente a producción.
- Jenkins puede coordinar stages de validación y empaquetado.

### Despliegue continuo

El **despliegue continuo** automatiza la publicación de cada cambio que supera los controles establecidos.

- Es una decisión de proceso, no solo una opción de Jenkins.
- Requiere pruebas y controles adecuados.
- Requiere gestión de riesgos y recuperación.
- No se practica contra producción en este curso.
- La automatización de un despliegue no implica que el cambio sea seguro por sí solo.

### Automatización

La **automatización** consiste en ejecutar una tarea mediante instrucciones y herramientas, en lugar de realizarla manualmente cada vez.

- Puede reducir errores repetitivos.
- Puede hacer los pasos reproducibles.
- Puede amplificar un error si el proceso está mal diseñado.
- Debe revisarse, probarse y mantenerse.
- Jenkins puede automatizar builds, pruebas y otras tareas autorizadas.

### Feedback

El **feedback** es la información que recibe el equipo sobre el resultado de una acción.

- Una build puede informar si compiló correctamente.
- Un reporte de pruebas puede mostrar casos fallidos.
- Un análisis estático puede señalar problemas potenciales.
- Un feedback rápido ayuda a investigar cambios recientes.
- Un resultado de CI necesita interpretación; no sustituye el criterio técnico.

### Ciclo de vida del software

El **ciclo de vida del software** incluye actividades como planificación, desarrollo, pruebas, empaquetado, despliegue y mantenimiento.

Jenkins puede participar en varias etapas, pero no administra necesariamente todo el ciclo de vida.

### Flujo de trabajo

Un **flujo de trabajo** es una secuencia de tareas relacionadas.

En Jenkins, un Pipeline representa un flujo de trabajo automatizado, con etapas, pasos, condiciones y resultados.

---

## Conceptos de Jenkins

Jenkins coordina ejecuciones y extensiones para automatizar tareas.

### Jenkins

**Jenkins** es un servidor de automatización extensible utilizado para coordinar jobs, builds y Pipelines.

- Puede conectarse a sistemas de control de versiones.
- Puede ejecutar tareas en agents.
- Puede integrar herramientas mediante plugins.
- Puede producir registros e informes.
- Su comportamiento depende de versión, configuración y plugins.
- Debe protegerse como un componente importante de la infraestructura.

### Controller

El **controller** es el componente central de Jenkins.

- Coordina jobs y Pipelines.
- Gestiona la cola.
- Mantiene configuración.
- Asigna trabajo a agents.
- Expone la interfaz.
- Puede almacenar información sensible.
- Debe administrarse con controles adecuados.
- No se debe tratar como un agent desechable sin entender la arquitectura.

El término histórico “master” aparece en documentación antigua; la terminología moderna usa “controller”.

### Agent

Un **agent** es un entorno donde Jenkins ejecuta trabajo asignado.

- Puede ser una máquina física.
- Puede ser una máquina virtual.
- Puede ser un contenedor.
- Puede ser efímero.
- Puede tener un sistema operativo y herramientas específicos.
- Puede poseer acceso a red o credenciales.
- No debe suponerse que todos los agents tienen las mismas capacidades.

**Pregunta de práctica:** ¿qué herramientas necesita un agent para ejecutar la build del curso?

### Node

Un **node** es una máquina o entorno de ejecución asociado a Jenkins.

- El controller puede actuar también como node en ciertas configuraciones.
- Un agent suele corresponder a un node de ejecución.
- La terminología puede variar entre interfaces y versiones.
- Comprueba la documentación de la versión instalada.

### Executor

Un **executor** representa capacidad de ejecutar un job en un node.

- Un node puede tener uno o varios executors.
- Más executors pueden aumentar concurrencia.
- La concurrencia puede elevar la carga.
- El número adecuado depende del hardware y de los trabajos.
- El alumnado no debe cambiar este valor en una instancia compartida.

### Job

Un **job** es una configuración ejecutable de Jenkins.

Puede ser:

- Un Freestyle job.
- Un Pipeline.
- Un job de carpeta u otra modalidad disponible.
- Una configuración asociada a un repositorio.

Un job puede tener parámetros, triggers, agentes y acciones.

### Build

Una **build** es una ejecución concreta de un job o Pipeline.

- Tiene un número o identificador.
- Puede tener un resultado.
- Puede producir logs y artefactos.
- Puede estar asociada a un commit.
- Su resultado debe interpretarse en contexto.

### Queue

La **queue**, o cola, contiene trabajos pendientes de asignación o ejecución.

Un job puede esperar porque:

- No hay executor disponible.
- No hay agent compatible.
- Un recurso está ocupado.
- La configuración limita la concurrencia.
- Hay otro requisito pendiente.

### Workspace

El **workspace** es el directorio donde un job trabaja con archivos.

Puede contener:

- Código descargado.
- Archivos compilados.
- Resultados de pruebas.
- Archivos temporales.
- Datos de una build.

No debe considerarse almacenamiento permanente ni automáticamente seguro.

### Folder

Una **folder** organiza jobs y puede ayudar a gestionar permisos o configuración común.

Las carpetas no sustituyen el control de acceso bien diseñado.

### Trigger

Un **trigger** es un evento o mecanismo que inicia una build.

Puede ser:

- Manual.
- Un webhook.
- Una programación.
- Una notificación del sistema de repositorios.
- La finalización de otro job.

Comprueba qué eventos activan una ejecución para evitar builds inesperadas.

---

## Pipeline

Pipeline es el modelo de Jenkins para describir procesos automatizados.

### Pipeline

Una **Pipeline** es una secuencia de etapas y pasos que representa un proceso de build, pruebas u otras tareas.

- Puede escribirse como código.
- Puede guardarse en un `Jenkinsfile`.
- Puede incluir condiciones.
- Puede usar distintos agents.
- Puede fallar en una etapa y dejar registros.
- Debe revisarse como código ejecutable.

### Jenkinsfile

Un **`Jenkinsfile`** es un archivo que contiene la definición de una Pipeline.

- Normalmente se almacena en el repositorio del proyecto.
- Puede revisarse mediante Git.
- Puede cambiar junto al código de la aplicación.
- Puede invocar comandos y plugins.
- Puede acceder a credenciales según permisos.
- No debe contener secretos.

### Declarative Pipeline

**Declarative Pipeline** es un estilo de sintaxis estructurado para definir Pipelines.

Suele incluir:

- `pipeline`
- `agent`
- `stages`
- `stage`
- `steps`
- `post`

La estructura facilita ciertas validaciones y hace visible la organización del proceso.

### Scripted Pipeline

**Scripted Pipeline** es un estilo más flexible que utiliza construcciones de Groovy y pasos de Pipeline.

- Permite lógica más libre.
- Puede aumentar la complejidad.
- Requiere comprender su contexto de ejecución.
- Debe revisarse con cuidado.
- No conviene mezclar estilos sin una razón clara.

### Stage

Un **stage** es una etapa lógica dentro de una Pipeline.

Ejemplos:

- Preparar.
- Construir.
- Probar.
- Analizar.
- Empaquetar.

Una etapa debería tener un nombre que describa su propósito.

### Step

Un **step** es una acción que se ejecuta dentro de una etapa.

Ejemplos:

- `echo`.
- `checkout`.
- Un paso de plugin.
- Una llamada a una herramienta de build.
- Un comando de shell, si el entorno lo permite.

Un step puede modificar archivos o acceder a recursos.

### Agent directive

La directiva `agent` indica dónde se ejecutará un Pipeline o una parte de él.

Puede seleccionar:

- Un agent disponible.
- Un label.
- Un entorno configurado por plugins.

No utilices `agent any` en un sistema sensible sin entender qué agents puede seleccionar.

### Label

Un **label** es una etiqueta utilizada para seleccionar nodes o agents con determinadas características.

Ejemplos conceptuales:

```text
linux
jdk
laboratorio
```

Un label no es por sí mismo un control de seguridad.

### Environment directive

La sección `environment` define variables disponibles en parte de la Pipeline.

- Puede establecer configuración no sensible.
- No debe usarse para almacenar secretos en texto claro.
- Las variables pueden terminar en procesos o logs.
- Comprueba su alcance y exposición.

### Parameter

Un **parameter** permite que quien inicia una build proporcione un valor de entrada.

- Puede ser texto, elección u otro tipo disponible.
- Debe validarse.
- No debe transportar un secreto visible.
- Puede alterar el comportamiento de una Pipeline.
- Evita concatenar entradas no confiables en comandos.

### `when`

La directiva `when` permite condicionar la ejecución de una etapa.

- Puede depender de rama, parámetro u otras condiciones.
- Una condición mal planteada puede omitir controles.
- Comprueba la semántica y la versión.
- Documenta qué etapas se saltan y por qué.

### `post`

La sección `post` define acciones que se ejecutan según el resultado o la finalización de una Pipeline.

- Puede incluir acciones de finalización.
- Puede informar resultados.
- Puede conservar o publicar salidas.
- Comprueba las condiciones disponibles.
- Evita incluir secretos en sus mensajes.

### Shared Library

Una **Shared Library** es código reutilizable para Pipelines.

- Puede reducir duplicación.
- Puede centralizar lógica común.
- Puede afectar a muchos jobs.
- Debe tener control de versiones.
- Debe revisarse como código de alto impacto.
- Su origen y permisos importan.

---

## Control de versiones y colaboración

El control de versiones permite seguir los cambios que Jenkins valida.

### Git

**Git** es un sistema distribuido de control de versiones.

- Registra cambios.
- Permite ramas.
- Facilita la colaboración.
- Permite revisar diferencias.
- Jenkins puede obtener código desde un repositorio Git.
- Git no garantiza que el código sea correcto o seguro.

### Repository

Un **repository**, o repositorio, almacena código y su historial de versiones.

Puede ser:

- Local.
- Hospedado en un servicio.
- Público.
- Privado.
- Compartido por un equipo.

No publiques archivos sensibles en un repositorio público.

### Commit

Un **commit** registra un conjunto de cambios en Git.

Una build debería poder relacionarse con el commit que probó.

Esto mejora la trazabilidad y el diagnóstico.

### Branch

Una **branch**, o rama, es una línea de desarrollo independiente.

- Puede representar una tarea.
- Puede usarse para preparar una integración.
- Puede tener políticas de protección.
- Jenkins puede ejecutar Pipelines distintas según la rama.
- Los cambios de una rama no son automáticamente confiables.

### Merge

Un **merge** integra cambios de una rama en otra.

Los conflictos y las reglas de revisión dependen del equipo y del sistema de repositorios.

### Pull request y merge request

Una **pull request** o **merge request** propone integrar cambios.

Puede iniciar builds de validación.

Antes de exponer un job a código de una solicitud, revisa qué agentes y credenciales quedan disponibles.

### Webhook

Un **webhook** es una notificación que un sistema envía a Jenkins cuando ocurre un evento.

- Puede iniciar builds.
- Puede asociarse a commits o solicitudes.
- Requiere configuración y conectividad.
- No se debe exponer un endpoint sin autorización.
- Un webhook no garantiza por sí solo que el código sea confiable.

### Checkout

**Checkout** significa obtener una revisión del repositorio para trabajar con ella.

La revisión debe identificar:

- Repositorio.
- Rama o commit.
- Credenciales necesarias.
- Submódulos, si existen.
- Estado del workspace.

### SCM

**SCM** significa *Source Code Management* o gestión del código fuente.

En Jenkins, puede hacer referencia a la integración con sistemas de control de versiones.

### Tag

Un **tag** es una referencia con nombre a una revisión de Git.

Puede utilizarse para marcar una versión, pero no garantiza la autenticidad de una publicación.

### Commit hash

El **commit hash** identifica una revisión concreta.

Registrar el hash ayuda a asociar una build con el contenido exacto que se ejecutó.

---

## Build, pruebas y resultados

Una Pipeline puede coordinar la compilación, la ejecución de pruebas y el almacenamiento de salidas.

### Build tool

Una **build tool** es una herramienta que automatiza tareas como compilar, probar y empaquetar.

Ejemplos:

- Maven.
- Gradle.
- npm.
- Make.

Jenkins coordina la ejecución; la build tool realiza las operaciones que le corresponden.

### Dependency

Una **dependency**, o dependencia, es un componente que necesita un proyecto.

- Puede ser una biblioteca.
- Puede ser una herramienta.
- Puede ser un plugin.
- Puede proceder de un repositorio externo.
- Debe versionarse y revisarse según la política del proyecto.

### Compile

**Compile** significa traducir o preparar código para su ejecución o empaquetado, según el lenguaje y la herramienta.

Una compilación correcta no demuestra que el programa funcione correctamente.

### Unit test

Una **prueba unitaria** comprueba una parte pequeña y delimitada del código.

- Suele ejecutarse rápidamente.
- Puede localizar fallos de componentes concretos.
- No sustituye pruebas de integración.
- Sus resultados pueden publicarse en un informe.

### Integration test

Una **prueba de integración** comprueba la interacción entre varios componentes.

Puede requerir servicios o recursos adicionales.

En el curso, utiliza únicamente entornos preparados para estas pruebas.

### Test suite

Una **suite de pruebas** es un conjunto de pruebas que se ejecuta como unidad o grupo.

La suite puede tener filtros, etiquetas o configuraciones propias del framework.

### Test report

Un **test report** es un informe de resultados de pruebas.

Puede incluir:

- Pruebas ejecutadas.
- Pruebas aprobadas.
- Pruebas fallidas.
- Pruebas omitidas.
- Errores y duraciones.

Revisa el informe antes de compartirlo.

### Coverage

**Coverage**, o cobertura, es una medida de qué parte del código se ejecutó durante las pruebas.

- No mide directamente la calidad.
- No demuestra que los casos sean adecuados.
- Depende de la herramienta y de la configuración.
- Debe interpretarse junto con otros resultados.

### Artifact

Un **artifact**, o artefacto, es un archivo generado o conservado por una build.

Ejemplos:

- Un paquete.
- Un archivo de reporte.
- Un binario.
- Un archivo de diagnóstico.

Un artefacto puede contener datos internos y debe protegerse.

### Artifact repository

Un **artifact repository** es un sistema para almacenar y distribuir paquetes o artefactos.

Debe definirse:

- Quién publica.
- Quién descarga.
- Cómo se identifican las versiones.
- Cuánto tiempo se conserva.
- Qué verificaciones se realizan.

### Build status

El estado de una build resume su resultado.

Puede incluir estados como:

- Success.
- Failure.
- Unstable.
- Aborted.

El significado exacto depende de Jenkins, el job y los plugins.

---

## Plugins y extensiones

Los plugins permiten ampliar Jenkins.

### Plugin

Un **plugin** es un componente que añade o modifica funciones de Jenkins.

Puede ofrecer:

- Integraciones.
- Steps de Pipeline.
- Tipos de credencial.
- Interfaces.
- Herramientas administrativas.

Cada plugin tiene su propia versión y requisitos.

### Plugin Manager

El **Plugin Manager** es la interfaz administrativa para gestionar plugins.

Su uso requiere permisos adecuados.

El alumnado no debe instalar ni actualizar plugins en el controller compartido.

### Pipeline step

Un **Pipeline step** es una acción disponible desde la sintaxis de Pipeline.

Puede proceder de:

- Jenkins core.
- Un plugin.
- Una librería compartida.
- Una extensión del entorno.

Consulta la documentación de la función que lo proporciona.

### Plugin dependency

Una **plugin dependency** es otro plugin requerido por un plugin determinado.

Actualizar uno puede afectar al conjunto de dependencias.

### Compatibility

La **compatibilidad** describe si un plugin, herramienta o Pipeline puede funcionar con determinadas versiones.

Comprueba:

- Versión de Jenkins.
- Versión del plugin.
- Dependencias.
- Sistema operativo.
- Java.
- Otras herramientas.

### Deprecation

Una función **deprecated** está marcada para desaconsejar su uso o anunciar un cambio futuro.

- Puede seguir funcionando temporalmente.
- Puede desaparecer en una versión posterior.
- Busca la alternativa recomendada.
- No inicies un proyecto nuevo con una función obsoleta sin justificarlo.

### Plugin maintenance

El **mantenimiento de un plugin** incluye correcciones, compatibilidad y actualizaciones.

Antes de usar un plugin, revisa su mantenimiento y los avisos de seguridad disponibles.

---

## Seguridad

Jenkins puede acceder a código, herramientas, credenciales y recursos.

### Credential

Una **credential**, o credencial, es información de autenticación gestionada para acceder a un recurso.

Ejemplos:

- Clave.
- Token.
- Certificado.
- Usuario y contraseña.
- Clave SSH.

No guardes credenciales en un `Jenkinsfile`.

### Secret

Un **secret** es un valor que debe protegerse frente a lectura o divulgación.

Ejemplos:

- Contraseña.
- Token.
- Clave privada.
- Cookie de sesión.
- Credencial de una API.

No lo imprimas en logs ni lo añadas a capturas.

### Credentials store

El **credentials store** es el mecanismo de Jenkins o de una integración para guardar credenciales.

El acceso debe estar limitado a los jobs y usuarios que realmente lo necesitan.

### Credentials Binding

**Credentials Binding** es una función, normalmente proporcionada por un plugin, que expone credenciales a una parte de un Pipeline.

- La sintaxis concreta depende de la versión y del plugin.
- El alcance debe ser breve.
- El valor no debe imprimirse.
- El enmascaramiento no garantiza que ningún secreto pueda filtrarse.
- No se usa con credenciales reales en este curso.

### Authorization

La **autorización** define qué acciones puede realizar una identidad ya autenticada.

Ejemplos:

- Leer un job.
- Ejecutar un job.
- Configurar un Pipeline.
- Administrar plugins.
- Gestionar credenciales.

### Authentication

La **autenticación** comprueba quién es una identidad.

No es lo mismo que autorización.

### Least privilege

**Least privilege**, o privilegio mínimo, significa conceder solo los permisos necesarios para una tarea.

Aplicado a Jenkins:

- Limita permisos de usuarios.
- Limita acceso a credenciales.
- Limita capabilities de agents.
- Evita administrar el controller desde jobs comunes.

### Untrusted code

**Untrusted code** es código que no ha recibido suficiente revisión o aprobación.

Una build de una rama no confiable no debería acceder a secretos o agents privilegiados.

### Agent isolation

El **aislamiento del agent** limita la influencia de un job sobre otros jobs o sobre el host.

Puede depender de:

- Contenedores.
- Máquinas efímeras.
- Permisos.
- Workspaces separados.
- Restricciones de red.
- Configuración del entorno.

### Audit log

Un **audit log** registra acciones para su revisión.

Puede ayudar a saber quién cambió configuración o inició una operación, según la configuración disponible.

Los logs también pueden contener datos sensibles.

### Secret masking

El **secret masking** oculta ciertos valores en algunas salidas.

No lo trates como garantía completa:

- El secreto podría transformarse.
- Podría aparecer en otro formato.
- Un proceso podría escribirlo.
- Un plugin podría gestionarlo de forma distinta.

---

## Entornos y despliegue

Estos términos describen dónde se ejecuta una aplicación y cómo se entrega.

### Environment

Un **environment**, o entorno, es un conjunto de sistemas y configuración destinado a un propósito.

Ejemplos:

- Desarrollo.
- Pruebas.
- Preproducción.
- Producción.

Los nombres de entorno deben usarse de forma clara; no son controles de acceso por sí mismos.

### Environment variable

Una **environment variable** es un valor disponible para procesos de un entorno de ejecución.

- Puede configurar una herramienta.
- Puede contener información sensible.
- Puede acabar en logs.
- No es un almacén de secretos automáticamente.
- Debe gestionarse con cuidado.

### Container

Un **container** es una instancia aislada que utiliza una imagen y comparte recursos del host de acuerdo con la plataforma.

Un contenedor no es automáticamente seguro ni plenamente aislado.

### Image

Una **image** es una plantilla utilizada para crear contenedores.

Comprueba su origen, versión y contenido.

No incluyas secretos en capas de una imagen.

### Registry

Un **registry** almacena y distribuye imágenes de contenedor.

Revisa:

- Dirección.
- Permisos.
- Etiquetas.
- Retención.
- Firma o procedencia, cuando aplique.

### Deployment

Un **deployment**, o despliegue, publica una versión de software en un entorno objetivo.

Puede requerir:

- Aprobación.
- Ventana de cambio.
- Verificaciones.
- Plan de recuperación.
- Protección de credenciales.

Las prácticas de este glosario no despliegan a producción.

### Rollback

Un **rollback** es la vuelta a una versión o estado anterior.

Debe planificarse y probarse; no todas las operaciones pueden revertirse automáticamente.

### Infrastructure as Code

**Infrastructure as Code**, o IaC, describe y administra infraestructura mediante código.

Jenkins puede ejecutar validaciones o tareas de IaC, pero no sustituye la herramienta especializada.

### Configuration as Code

**Configuration as Code** describe configuración en archivos revisables.

Puede ayudar a reproducir Jenkins y otros componentes, sujeto a plugins y políticas.

---

## Calidad y operación

Estos conceptos ayudan a evaluar cómo funciona un proceso de CI.

### Observability

La **observabilidad** es la capacidad de entender el estado interno de un sistema a partir de señales como logs, métricas y trazas.

Jenkins puede producir información de ejecución, pero no sustituye automáticamente una plataforma de observabilidad completa.

### Log

Un **log** es un registro de eventos o mensajes.

El console output de una build es un tipo de registro.

Revisa los logs antes de compartirlos.

### Metric

Una **métrica** es una medición numérica en un periodo o contexto.

Ejemplos:

- Duración de build.
- Número de builds fallidas.
- Tiempo en cola.
- Uso de executors.

### Alert

Una **alerta** señala una condición que requiere revisión.

Una alerta debe tener contexto, responsable y una acción razonable.

### Idempotency

La **idempotencia** describe una operación que puede repetirse sin causar cambios adicionales no deseados cuando el estado ya es el esperado.

No todas las tareas de Jenkins son idempotentes.

Comprueba qué modifica un step antes de habilitar reintentos.

### Reproducible build

Una **reproducible build** busca obtener resultados consistentes a partir del mismo código y condiciones controladas.

Puede requerir fijar:

- Versiones de herramientas.
- Dependencias.
- Imagen de agent.
- Variables.
- Fuentes de descarga.
- Parámetros de build.

### Pipeline as Code

**Pipeline as Code** significa mantener la definición del Pipeline en código versionado.

Ventajas posibles:

- Revisión.
- Historial.
- Reutilización.
- Trazabilidad.
- Cambios junto al proyecto.

El código de Pipeline debe recibir las mismas revisiones de seguridad que otros scripts.

### Traceability

La **trazabilidad** relaciona una build con:

- Commit.
- Job.
- Agent.
- Herramientas.
- Resultados.
- Artefactos.
- Aprobaciones.

### Retention

La **retención** determina cuánto tiempo se conservan builds, logs y artefactos.

Debe equilibrar necesidades de diagnóstico, coste y protección de datos.

---

## Estados, fallos y diagnóstico

Los estados describen cómo terminó una ejecución, pero no siempre explican por qué.

### Success

**Success** indica que Jenkins considera que el job o Pipeline terminó correctamente.

No demuestra por sí solo:

- Que la aplicación no tenga defectos.
- Que todas las pruebas sean suficientes.
- Que el cambio esté autorizado.
- Que un despliegue sea seguro.

### Failure

**Failure** indica que una ejecución terminó con error según las condiciones del job.

Identifica la etapa y el step causantes antes de repetirla.

### Unstable

**Unstable** indica que la ejecución no se considera plenamente correcta, aunque no siempre haya ocurrido un fallo fatal.

Puede depender de tests, plugins o resultados de análisis.

### Aborted

**Aborted** indica que una ejecución se detuvo, por ejemplo, por una acción manual o por determinadas condiciones.

Comprueba si se completaron pasos antes de la interrupción.

### Skipped

**Skipped** indica que una etapa o un paso no se ejecutó por una condición o configuración.

Comprueba que no se haya omitido una validación necesaria.

### Timeout

Un **timeout** limita el tiempo disponible para una operación.

No resuelve la causa de una operación lenta.

Investiga si el origen es:

- Agent ocupado.
- Dependencia externa.
- Build bloqueada.
- Herramienta defectuosa.
- Configuración de timeout inadecuada.

### Retry

**Retry** repite una operación después de ciertos fallos.

No es apropiado para toda tarea:

- Una operación no idempotente podría duplicar efectos.
- Un error permanente seguirá ocurriendo.
- Reintentos excesivos pueden aumentar carga.

### Flaky test

Un **flaky test** produce resultados diferentes sin cambios intencionales en el código.

Puede deberse a:

- Tiempo.
- Orden de ejecución.
- Datos compartidos.
- Red.
- Concurrencia.
- Dependencia del entorno.

No ignores tests inestables sin investigar.

### Root cause

La **root cause**, o causa raíz, es el factor subyacente que produjo un fallo.

Un mensaje final de error puede ser solo un síntoma.

Busca el primer error relevante y reconstruye el contexto.

### Regression

Una **regression** es un problema que aparece después de un cambio y rompe un comportamiento que funcionaba.

Relaciona el fallo con el commit y los resultados anteriores.

### Exit code

El **exit code**, o código de salida, es el valor que devuelve un proceso al terminar.

Normalmente, cero indica éxito y un valor distinto puede indicar fallo, aunque cada herramienta define su propio comportamiento.

---

## Siglas y abreviaturas

Las siglas se utilizan con frecuencia en documentación, pipelines y conversaciones de equipo.

### CI

**CI** significa *Continuous Integration*, o integración continua.

Describe la integración frecuente de cambios y su validación automatizada.

### CD

**CD** puede significar *Continuous Delivery* o *Continuous Deployment*, según el contexto.

Pregunta cuál de los dos significados se utiliza en una conversación o documento.

### SCM

**SCM** significa *Source Code Management*.

Se refiere a sistemas y procesos de gestión del código fuente.

### SCA

**SCA** significa *Software Composition Analysis*.

Analiza dependencias y componentes de terceros.

El resultado debe interpretarse según la política y el contexto del proyecto.

### SAST

**SAST** significa *Static Application Security Testing*.

Analiza código sin ejecutar la aplicación completa.

### DAST

**DAST** significa *Dynamic Application Security Testing*.

Analiza una aplicación en ejecución desde una perspectiva dinámica.

No se ejecuta contra sistemas reales sin autorización.

### SBOM

**SBOM** significa *Software Bill of Materials*.

Es una lista estructurada de componentes de software presentes en un producto.

### SLA

**SLA** significa *Service Level Agreement*.

Es un acuerdo de nivel de servicio, normalmente entre partes.

### SLO

**SLO** significa *Service Level Objective*.

Es un objetivo de nivel de servicio medible.

### MTTR

**MTTR** puede referirse a tiempo medio de reparación o recuperación, según el contexto de la organización.

Comprueba la definición local antes de usarlo en un informe.

### PR

**PR** suele significar *Pull Request*.

Es una propuesta de integración de cambios en ciertos sistemas de repositorios.

### MR

**MR** suele significar *Merge Request*.

Es una propuesta de integración utilizada por algunas plataformas.

### JVM

**JVM** significa *Java Virtual Machine*.

Jenkins y muchas herramientas del ecosistema Java pueden depender de una JVM compatible.

### API

**API** significa *Application Programming Interface*.

Una API permite que sistemas intercambien solicitudes y respuestas de forma definida.

---

## Relaciones entre conceptos

Los términos adquieren más sentido al ver cómo se conectan en un flujo.

### Del commit a la build

Un flujo habitual puede ser:

```text
Cambio de código
      |
      v
Commit en Git
      |
      v
Webhook o activación
      |
      v
Job de Jenkins
      |
      v
Checkout del código
      |
      v
Build y pruebas
      |
      v
Resultado de Pipeline
```

La build debe poder relacionarse con el commit que validó.

### Del test al artefacto

```text
Código
  |
  v
Compilación
  |
  v
Pruebas
  |
  v
Empaquetado
  |
  v
Artefacto
```

Un artefacto debería conservar información suficiente para identificar su origen.

### De Pipeline a despliegue

```text
Validación
    |
    v
Build
    |
    v
Pruebas
    |
    v
Aprobación, si corresponde
    |
    v
Despliegue autorizado
    |
    v
Verificación
```

El despliegue y la aprobación dependen del proceso de la organización.

### Controller y agents

```text
Usuario o trigger
        |
        v
Jenkins controller
        |
        +--> Queue
        |
        +--> Agent de laboratorio
                 |
                 +--> Workspace
                 +--> Build
                 +--> Tests
```

El controller coordina; el agent ejecuta tareas asignadas.

### Plugin y Pipeline step

```text
Plugin instalado
       |
       v
Step disponible
       |
       v
Jenkinsfile lo invoca
       |
       v
Build lo ejecuta
```

Si el plugin falta o es incompatible, el step puede no estar disponible.

### Job, build y artifact

- El **job** define o configura el proceso.
- La **build** es una ejecución particular.
- El **artifact** es una salida que puede producir esa ejecución.

### Log, métrica y alerta

- El **log** registra eventos.
- La **métrica** resume un valor medible.
- La **alerta** informa de una condición que requiere atención.

Son señales diferentes y se complementan.

---

## Sesiones prácticas

Las sesiones permiten practicar el vocabulario con ejemplos de Jenkins y DevOps.

### Preparación común

Antes de cada sesión:

- Utiliza solo la instancia del curso.
- Utiliza jobs de laboratorio.
- No modifiques configuración global.
- No emplees credenciales reales.
- No instales plugins.
- Revisa los comandos antes de ejecutarlos.
- Evita compartir logs completos.
- Anota versiones y condiciones del entorno.

### Sesión 1: crear un mapa de términos

**Objetivo:** conectar conceptos relacionados.

Pasos:

1. Selecciona diez términos del glosario.
2. Escribe una definición breve para cada uno.
3. Dibuja relaciones entre ellos.
4. Incluye al menos un término de Jenkins.
5. Incluye al menos un término de Git.
6. Incluye al menos un término de seguridad.
7. Explica una relación al grupo.

Ejemplo de relación:

```text
Commit -> activa -> Job -> ejecuta -> Pipeline
```

### Sesión 2: leer un Jenkinsfile

**Objetivo:** reconocer los términos dentro del código.

Analiza:

```groovy
pipeline {
    agent any

    stages {
        stage('Preparar') {
            steps {
                echo 'Preparacion de laboratorio.'
            }
        }

        stage('Verificar') {
            steps {
                echo 'Verificacion sin cambios externos.'
            }
        }
    }
}
```

Pasos:

1. Identifica Pipeline.
2. Identifica agent.
3. Identifica stages.
4. Identifica steps.
5. Indica qué no aparece en el ejemplo.
6. Explica por qué no se usan credenciales.
7. Relaciona el código con los términos del glosario.

### Sesión 3: seguir el recorrido de un commit

**Objetivo:** explicar el flujo entre Git y Jenkins.

El docente proporciona un commit ficticio.

Pasos:

1. Identifica el repositorio.
2. Identifica la rama.
3. Identifica el commit.
4. Describe cómo podría activarse un job.
5. Explica qué hace checkout.
6. Describe qué etapas podrían ejecutarse.
7. Indica cómo se registraría el resultado.

### Sesión 4: clasificar estados de build

**Objetivo:** distinguir resultados de Jenkins.

El docente entrega cinco salidas ficticias.

Clasifica cada una como:

- Success.
- Failure.
- Unstable.
- Aborted.
- Skipped.

Para cada caso:

1. Identifica la evidencia.
2. No infieras una causa que no aparece.
3. Propón la siguiente comprobación.
4. Indica si hubo tareas previas completadas.
5. Resume en una frase.

### Sesión 5: reconocer artifacts y reportes

**Objetivo:** diferenciar salidas de build.

Clasifica estos elementos:

- Un paquete generado.
- Un informe de pruebas.
- El console output.
- Un archivo temporal del workspace.
- Un informe de cobertura.
- Una imagen de contenedor.

Explica:

1. Cuál es un artifact.
2. Cuál es un log.
3. Cuál es un reporte.
4. Qué información podría ser sensible.
5. Cuánto tiempo tendría sentido conservar cada salida en un laboratorio.

### Sesión 6: identificar riesgos de seguridad

**Objetivo:** reconocer conceptos de seguridad en un ejemplo.

El docente entrega un `Jenkinsfile` ficticio con:

- Un parámetro.
- Un comando shell.
- Una variable de entorno.
- Una credencial simulada.
- Un agent compartido.

Pasos:

1. Identifica los términos del glosario.
2. Señala posibles rutas de exposición.
3. Describe el privilegio mínimo.
4. Propón una versión de laboratorio segura.
5. No ejecutes el ejemplo recibido.

### Sesión 7: analizar un fallo

**Objetivo:** diferenciar síntoma y causa.

El docente proporciona una salida ficticia:

```text
Stage: Build
Step: ejecutar herramienta
Resultado: Failure
Mensaje final: proceso terminado con código distinto de cero
```

Pasos:

1. Identifica el síntoma.
2. Busca el primer error relevante.
3. Propón causas posibles sin presentarlas como hechos.
4. Identifica qué recurso consultarías.
5. Escribe una pregunta técnica precisa.
6. Indica qué información no compartirías públicamente.

### Sesión 8: explicar un Pipeline a una persona nueva

**Objetivo:** utilizar vocabulario de forma clara.

Explica, sin leer el código palabra por palabra:

- Qué es el job.
- Qué revisión del repositorio se utiliza.
- Qué agent ejecuta el trabajo.
- Qué etapas tiene.
- Qué pruebas realiza.
- Qué artifact genera.
- Cómo se informa el resultado.

Evita usar siglas sin definirlas la primera vez.

### Sesión 9: clasificar siglas

**Objetivo:** distinguir siglas relacionadas.

Relaciona:

- CI.
- CD.
- SCM.
- SAST.
- SCA.
- DAST.
- SBOM.
- SLO.

Pasos:

1. Escribe el significado.
2. Describe un uso posible.
3. Indica si Jenkins realiza esa función por sí solo.
4. Añade una herramienta o proceso que pueda participar.
5. Señala cualquier ambigüedad.

### Sesión 10: revisar un plugin de forma conceptual

**Objetivo:** aplicar vocabulario sobre extensiones.

El docente asigna un plugin ficticio o una página de plugin aprobada.

Completa:

```text
Plugin:
Función:
Versión de Jenkins requerida:
Dependencias:
Pipeline steps:
Credenciales involucradas:
Estado de mantenimiento:
Riesgos:
Decisión:
```

No instales ni actualices el plugin.

### Sesión 11: comparar agent y controller

**Objetivo:** explicar la separación de responsabilidades.

Dibuja una arquitectura que incluya:

- Usuario.
- Controller.
- Queue.
- Agent.
- Workspace.
- Job.
- Build.

Después responde:

- ¿Qué componente coordina?
- ¿Qué componente ejecuta?
- ¿Dónde pueden aparecer credenciales?
- ¿Qué aislarías y por qué?

### Sesión 12: identificar una build reproducible

**Objetivo:** determinar qué información hace falta para repetir una ejecución.

Incluye:

- Commit.
- Versión de Jenkins.
- Versión de plugin.
- Agent.
- Herramienta de build.
- Dependencias.
- Variables no sensibles.
- Resultado de pruebas.
- Identificador del artifact.

Explica qué dato es más difícil de controlar y por qué.

### Sesión 13: revisar un tutorial externo

**Objetivo:** utilizar el vocabulario para evaluar una guía.

Pasos:

1. Lee un tutorial asignado por el docente.
2. Identifica versión.
3. Identifica plugins.
4. Identifica agents.
5. Identifica credenciales.
6. Identifica comandos.
7. Clasifica cada supuesto.
8. Explica qué modificarías antes de practicarlo.

### Sesión 14: construir un glosario de equipo

**Objetivo:** crear definiciones compartidas.

En grupos:

1. Seleccionad quince términos.
2. Escribid definiciones de una o dos frases.
3. Añadid un ejemplo de Jenkins.
4. Identificad términos con varios significados.
5. Comparad con la documentación oficial.
6. Acordad una redacción común.
7. Evitad copiar párrafos extensos de fuentes externas.

### Sesión 15: practicar una pregunta técnica

**Objetivo:** pedir ayuda con contexto y precisión.

Redacta una pregunta con:

- Objetivo.
- Job.
- Build.
- Stage.
- Step.
- Versión.
- Agent.
- Error no sensible.
- Prueba realizada.
- Fuente consultada.

Elimina:

- Tokens.
- Contraseñas.
- URLs privadas.
- Cookies.
- Nombres internos.
- Logs completos.

### Sesión 16: revisar un reporte de pruebas

**Objetivo:** relacionar resultados de pruebas con estados Jenkins.

El docente proporciona un informe ficticio.

Pasos:

1. Identifica pruebas ejecutadas.
2. Identifica fallos y omisiones.
3. Explica si el resultado puede afectar el estado de la build.
4. Distingue test report de console output.
5. Indica qué evidencia falta para diagnosticar.
6. Resume el resultado sin divulgar datos internos.

### Sesión 17: mapear CI y CD

**Objetivo:** diferenciar integración, entrega y despliegue.

Dibuja un flujo con:

- Commit.
- Build.
- Test.
- Artefacto.
- Aprobación.
- Despliegue.
- Verificación.

Marca:

- Qué pasos son CI.
- Qué pasos preparan entrega.
- Qué paso constituye un despliegue.
- Qué controles deberían aparecer.
- Qué parte no se practica en el curso.

### Sesión 18: analizar un caso de concurrencia

**Objetivo:** comprender queue y executors.

Caso ficticio:

- Cuatro builds están esperando.
- Un agent tiene un executor.
- Dos jobs requieren un label no disponible.
- Una build ejecuta pruebas largas.

Responde:

1. ¿Qué es la queue?
2. ¿Qué es un executor?
3. ¿Qué puede explicar la espera?
4. ¿Qué dato adicional necesitas?
5. ¿Por qué no aumentarías ejecutors sin autorización?

### Sesión 19: construir tarjetas de términos

**Objetivo:** repasar conceptos mediante definiciones breves.

Cada tarjeta incluye:

- Término.
- Definición.
- Ejemplo.
- Término relacionado.
- Error común.

Intercambiad tarjetas y explicadlas sin leer la definición literal.

### Sesión 20: proyecto integrador

**Objetivo:** explicar un flujo sencillo de CI utilizando el vocabulario del curso.

Entrega:

- Un diagrama del flujo.
- Un Jenkinsfile de laboratorio.
- Un commit ficticio o de práctica.
- Una build ejecutada en el entorno autorizado.
- Una descripción de stages y steps.
- Identificación del controller y del agent.
- Resultado de pruebas o simulación.
- Descripción de artifacts, si los hay.
- Riesgos de seguridad identificados.
- Glosario breve de términos utilizados.
- Una nota sobre qué se requeriría antes de producción.

---

## Evaluación y referencia

La evaluación comprueba comprensión y uso correcto de los términos.

### Checklist

- [ ] Distingo DevOps de una herramienta concreta.
- [ ] Diferencio CI, entrega continua y despliegue continuo.
- [ ] Distingo controller, agent y executor.
- [ ] Sé explicar job, build y Pipeline.
- [ ] Identifico stages y steps.
- [ ] Relaciono un commit con una build.
- [ ] Distingo reportes, logs y artifacts.
- [ ] Comprendo por qué los plugins tienen versiones y dependencias.
- [ ] Reconozco credenciales y secretos.
- [ ] Puedo describir un fallo sin divulgar datos sensibles.
- [ ] Utilizo siglas después de explicar su significado.
- [ ] Puedo explicar un Pipeline con palabras propias.

### Preguntas de repaso

1. ¿Qué es DevOps y por qué no es solo una herramienta?
2. ¿Qué diferencia hay entre CI y despliegue continuo?
3. ¿Qué hace el controller?
4. ¿Qué diferencia hay entre agent y executor?
5. ¿Qué representa un job?
6. ¿Qué diferencia hay entre job y build?
7. ¿Qué contiene un `Jenkinsfile`?
8. ¿Qué diferencia hay entre stage y step?
9. ¿Qué es un webhook?
10. ¿Qué representa un commit hash?
11. ¿Qué diferencia hay entre test report y artifact?
12. ¿Qué problema resuelve un plugin?
13. ¿Por qué se deben comprobar las dependencias de un plugin?
14. ¿Qué significa privilegio mínimo?
15. ¿Por qué no se imprimen secretos en consola?
16. ¿Qué significa un build inestable?
17. ¿Qué es un flaky test?
18. ¿Qué diferencia hay entre log y métrica?
19. ¿Qué significa una build reproducible?
20. ¿Qué relación hay entre una Shared Library y un `Jenkinsfile`?
21. ¿Qué información ayuda a localizar la causa raíz?
22. ¿Qué debería asociarse a un artifact?
23. ¿Por qué un label no es un control de seguridad por sí mismo?
24. ¿Qué datos deben eliminarse antes de pedir ayuda públicamente?
25. ¿Qué controles añadirías antes de desplegar una aplicación?

### Rúbrica

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Terminología | Confunde conceptos básicos | Usa términos con corrección | Explica relaciones y excepciones |
| Jenkins | Confunde controller, agent y job | Describe componentes principales | Relaciona arquitectura y seguridad |
| Pipeline | Enumera bloques sin explicarlos | Explica stages y steps | Analiza condiciones, agents y fallos |
| CI/CD | Trata CI y despliegue como equivalentes | Distingue sus objetivos | Describe controles y transiciones |
| Seguridad | Incluye datos sensibles en ejemplos | Identifica secretos y permisos | Evalúa código no confiable y aislamiento |
| Diagnóstico | Repite el error sin contexto | Localiza stage y step | Distingue causa, síntoma e hipótesis |
| Comunicación | Usa siglas sin explicar | Redacta una explicación clara | Presenta evidencia mínima y reproducible |

### Glosario rápido

- **Agent:** entorno que ejecuta tareas.
- **Artifact:** archivo producido o conservado por una build.
- **Build:** ejecución concreta de un job.
- **CI:** integración continua.
- **Controller:** componente central de Jenkins.
- **Credential:** información de autenticación protegida.
- **Executor:** capacidad de ejecución en un node.
- **Job:** unidad de trabajo configurada.
- **Jenkinsfile:** archivo de definición de Pipeline.
- **Pipeline:** proceso automatizado de stages y steps.
- **Plugin:** extensión de Jenkins.
- **SCM:** gestión del código fuente.
- **Stage:** etapa lógica de Pipeline.
- **Step:** acción dentro de una etapa.
- **Workspace:** directorio de trabajo de un job.

### Recursos oficiales

- [Documentación de Jenkins](https://www.jenkins.io/doc/)
- [Jenkins User Handbook](https://www.jenkins.io/doc/book/)
- [Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [Sintaxis de Pipeline](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)
- [Seguridad](https://www.jenkins.io/doc/book/security/)
- [Credenciales](https://www.jenkins.io/doc/book/using/using-credentials/)
- [Agents](https://www.jenkins.io/doc/book/using/using-agents/)
- [Git Documentation](https://git-scm.com/doc)
- [Maven Guides](https://maven.apache.org/guides/)
- [Gradle User Manual](https://docs.gradle.org/current/userguide/userguide.html)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)

Los enlaces pueden cambiar. Comprueba la versión y el contexto antes de seguir una instrucción.

### Plantilla de entrega

```text
Término:
Definición propia:
Ejemplo relacionado con Jenkins:
Término relacionado:
Fuente consultada:
Versión o contexto:
Error común:
Pregunta pendiente:
```

No incluyas contraseñas, tokens, nombres internos ni datos de producción.

### Síntesis final

Un vocabulario común ayuda a explicar Pipelines, interpretar builds y diagnosticar fallos sin confundir componentes.

- Jenkins coordina jobs y Pipelines.
- El controller organiza; los agents ejecutan.
- Un job puede producir varias builds.
- Un Pipeline se organiza con stages y steps.
- Git relaciona cambios con revisiones de código.
- Las build tools compilan y gestionan tareas del proyecto.
- Los tests aportan evidencia, no una garantía absoluta.
- Los artifacts y logs pueden contener información sensible.
- Los plugins amplían Jenkins y añaden dependencias.
- Las credenciales necesitan alcance mínimo y protección.
- CI, entrega continua y despliegue continuo son conceptos relacionados, pero distintos.
- Una explicación técnica clara identifica versión, contexto, evidencia y límites.

## Actividad de cierre

Explica oralmente o por escrito el recorrido de un cambio desde un commit hasta el resultado de una build. Utiliza, como mínimo, estos términos:

- Repository.
- Commit.
- Webhook o trigger.
- Job.
- Controller.
- Agent.
- Workspace.
- Pipeline.
- Stage.
- Step.
- Test report.
- Artifact.
- Build status.

Cierra con una precaución de seguridad y una comprobación que realizarías antes de usar un flujo parecido en un entorno real.