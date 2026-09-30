# Documentación oficial de Jenkins para el curso DevOps: Introducción a Jenkins

La documentación oficial de Jenkins es la referencia principal para comprender cómo instalar, configurar y utilizar el servidor de automatización. Esta guía enseña a orientarse dentro de sus recursos, encontrar la documentación adecuada para cada pregunta y verificar que una instrucción es pertinente para la versión, el sistema y los permisos disponibles en el curso.

El recorrido combina lectura de documentación con ejercicios de laboratorio: consultar Jenkins, revisar la interfaz, crear un primer job y escribir una Pipeline pequeña. Las prácticas están pensadas para una instalación local o un servidor de formación autorizado. No incluyen credenciales reales, despliegues de producción ni acceso a sistemas externos.

> **Regla de consulta:** primero identifica la versión de Jenkins y el contexto del ejemplo; después consulta la fuente oficial, revisa los requisitos y prueba en un entorno aislado. Un ejemplo documentado explica una posibilidad técnica, no constituye por sí solo una autorización para ejecutarlo.

## Objetivos y alcance

Esta página sirve como guía práctica para aprender a consultar la documentación oficial de Jenkins y aplicar lo aprendido en un entorno de curso.

### Resultados de aprendizaje

Al terminar, podrás:

- Identificar las secciones más importantes de la documentación oficial de Jenkins.
- Diferenciar documentación del producto, documentación de plugins y recursos comunitarios.
- Localizar una guía para instalar o administrar Jenkins.
- Encontrar información sobre Pipeline y `Jenkinsfile`.
- Comprobar la versión de Jenkins y elegir documentación pertinente.
- Comprender qué papel desempeña un plugin.
- Identificar compatibilidad, dependencias y requisitos.
- Consultar ayuda desde la interfaz de Jenkins.
- Utilizar Pipeline Syntax para generar ejemplos de pasos.
- Distinguir un ejemplo ilustrativo de una instrucción lista para producción.
- Reconocer riesgos relacionados con credenciales, logs y permisos.
- Investigar un error sin publicar datos internos.
- Registrar fuentes, versión y resultado de una prueba.
- Redactar una nota técnica reproducible y no sensible.

### Qué se aprenderá

La guía cubre:

- Navegación por la documentación de Jenkins.
- Referencia de Pipeline.
- Documentación de plugins.
- Administración del controller y los agents.
- Versión LTS y versiones semanales.
- Ayuda integrada en Jenkins.
- Pipeline Syntax y Snippet Generator.
- Consulta responsable de ejemplos.
- Prácticas locales de introducción.

### Qué queda fuera

Esta página no:

- Instala Jenkins en un servidor de producción.
- Configura credenciales reales.
- Recomienda publicar una instancia en Internet.
- Define una arquitectura de alta disponibilidad.
- Sustituye las políticas de cambios y seguridad de una organización.
- Autoriza a instalar plugins en un servidor compartido.
- Sustituye la documentación oficial, que puede actualizarse.
- Incluye claves, contraseñas, tokens ni endpoints privados.
- Enseña a eludir controles de acceso.

### Entorno previsto

Las sesiones están diseñadas para:

- Una instancia local del curso.
- Un controller de laboratorio administrado por el docente.
- Una máquina virtual de formación.
- Un entorno Jenkins efímero y aislado.

No utilices un Jenkins de producción para aprender la interfaz, probar plugins o modificar configuración.

### Regla del laboratorio

- Usa únicamente jobs de práctica.
- No introduzcas secretos reales.
- No ejecutes comandos que alteren el sistema sin autorización.
- No conectes agentes personales sin permiso.
- No instales plugins por iniciativa propia.
- No compartas capturas con nombres de usuario, direcciones privadas o logs sensibles.
- Consulta al docente ante una duda sobre permisos o alcance.

---

## Por qué consultar la documentación oficial

La documentación oficial ayuda a distinguir el comportamiento de Jenkins de las prácticas particulares de cada organización.

### Referencia primaria

La documentación oficial es el primer lugar para verificar:

- Cómo funciona una característica.
- Qué opciones tiene un paso de Pipeline.
- Qué versión introdujo una función.
- Qué requisitos tiene un plugin.
- Qué comportamiento se espera de un componente.
- Cómo se configura una función soportada.
- Qué advertencias se conocen.

### Documentación y realidad local

Una página puede describir Jenkins en general, pero el servidor del curso podría tener:

- Una versión anterior.
- Plugins deshabilitados.
- Permisos restringidos.
- Agentes limitados.
- Una configuración corporativa.
- Un sistema operativo diferente.
- Restricciones de red.
- Políticas propias.

No supongas que todo lo documentado está habilitado en todas las instancias.

### Los ejemplos necesitan contexto

Un ejemplo puede asumir:

- Que existe un agente con una etiqueta determinada.
- Que está instalado Git.
- Que está disponible un shell específico.
- Que el job puede leer un repositorio.
- Que una credencial ya fue creada.
- Que el usuario tiene permisos para ejecutar el job.
- Que se utilizan plugins concretos.

Antes de adaptarlo, identifica esas condiciones.

### La documentación no autoriza un cambio

Una guía puede explicar cómo instalar un plugin o cambiar una configuración.

Eso no significa que debas hacerlo en un servidor compartido.

La autorización depende del responsable del entorno y del procedimiento de cambios del curso.

### Documentación oficial y comunidad

La comunidad puede aportar soluciones valiosas, pero una respuesta de foro:

- Puede corresponder a otra versión.
- Puede tener supuestos ocultos.
- Puede quedar desactualizada.
- Puede proponer un workaround inseguro.
- Puede no aplicar a los plugins instalados.

Utiliza recursos comunitarios como apoyo y contrasta la solución con la documentación oficial.

---

## Mapa de la documentación de Jenkins

La documentación se organiza en guías, referencias y recursos para diferentes tareas.

### Página principal

La página de documentación de Jenkins enlaza a:

- Guías de usuario.
- Guías de instalación.
- Documentación de Pipeline.
- Administración.
- Seguridad.
- Plugins.
- Recursos de comunidad.
- Código y noticias del proyecto.

Empieza desde el portal oficial cuando un enlace guardado ya no funciona.

### Jenkins User Documentation

La documentación de usuario presenta conceptos y procedimientos habituales.

Puede incluir temas como:

- Crear jobs.
- Configurar builds.
- Trabajar con Pipeline.
- Administrar nodos.
- Usar plugins.
- Gestionar credenciales.
- Configurar seguridad.
- Solucionar problemas.

Es el punto de partida para aprender un flujo completo.

### Guía de instalación

La guía de instalación describe formas de ejecutar Jenkins según plataforma y entorno.

Antes de seguirla, confirma:

- Sistema operativo.
- Java requerido.
- Versión de Jenkins.
- Método de instalación.
- Permisos disponibles.
- Política del entorno.
- Si se trata de una instancia de laboratorio.

No ejecutes comandos de instalación en un equipo compartido sin permiso.

### Documentación de Pipeline

La documentación de Pipeline explica cómo describir procesos de build, test y entrega.

Incluye conceptos como:

- `Jenkinsfile`.
- Declarative Pipeline.
- Scripted Pipeline.
- Stages.
- Steps.
- Agents.
- Parameters.
- Environment variables.
- Post conditions.
- Shared Libraries.

### Documentación de administración

La documentación de administración trata aspectos del controller y los agents.

Puede incluir:

- Configuración del sistema.
- Gestión de nodos.
- Seguridad.
- Backup.
- Logs.
- Actualizaciones.
- Ajustes de ejecución.
- Administración de plugins.

Los cambios administrativos deben limitarse a responsables autorizados.

### Documentación de plugins

Los plugins amplían la funcionalidad de Jenkins.

Cada plugin puede mantener documentación propia sobre:

- Instalación.
- Configuración.
- Pasos de Pipeline.
- Opciones.
- Compatibilidad.
- Limitaciones.
- Cambios de versión.

La referencia del core no siempre describe cada función que añade un plugin.

### Documentación de seguridad

La documentación de seguridad explica controles para proteger Jenkins.

Entre los temas habituales están:

- Autenticación.
- Autorización.
- Protección de controller y agents.
- Gestión de credenciales.
- Seguridad de Pipeline.
- Actualizaciones.
- Permisos de usuarios y jobs.

### Comunidad y proyecto

El proyecto mantiene recursos como:

- Código fuente.
- Notas de versiones.
- Guías para contribuir.
- Seguimiento de incidencias.
- Comunidad de usuarios.
- Documentación de complementos.

Revisa si el recurso es oficial y a qué versión se aplica.

---

## Entender las versiones de Jenkins

La versión instalada determina qué funciones están disponibles y qué documentación resulta pertinente.

### LTS y weekly releases

Jenkins publica líneas de versiones con ritmos distintos.

A grandes rasgos:

- **LTS** prioriza una línea de soporte de largo plazo y actualizaciones seleccionadas.
- **Weekly** recibe cambios con mayor frecuencia.

Las políticas concretas de publicación pueden cambiar. Consulta las notas oficiales y la política de versiones vigente.

### No confundir Jenkins y plugins

Jenkins core y cada plugin tienen su propia versión.

Un plugin puede:

- Requerir una versión mínima de Jenkins.
- Depender de otros plugins.
- No ser compatible con una versión antigua.
- Cambiar comportamiento entre versiones.
- Estar descontinuado o sin mantenimiento reciente.

### Comprobar la versión instalada

La versión puede aparecer en:

- El pie de página de la interfaz.
- La página de información del sistema.
- La salida de la instancia.
- La documentación del administrador.
- La instalación del laboratorio.

La ubicación exacta puede variar según versión y configuración.

### Información del sistema

Un usuario autorizado puede consultar información de Jenkins desde la interfaz administrativa.

Esta información puede revelar:

- Versión de Jenkins.
- Versión de Java.
- Plugins instalados.
- Sistema operativo.
- Rutas y variables.
- Datos de configuración.

No publiques una captura completa sin revisar qué información expone.

### Elegir documentación compatible

Al consultar una página:

1. Comprueba su fecha o estado.
2. Identifica si se refiere a Jenkins core o a un plugin.
3. Anota la versión mínima requerida.
4. Comprueba la versión del servidor del curso.
5. Verifica si la función está instalada.
6. Prueba solo en el job de laboratorio.
7. Consulta al docente si hay diferencias.

### Notas de lanzamiento

Las notas de lanzamiento ayudan a descubrir:

- Funciones añadidas.
- Funciones retiradas.
- Cambios de comportamiento.
- Problemas corregidos.
- Requisitos.
- Avisos de seguridad.

Para una actualización, consulta las notas de cada versión relevante y sigue el procedimiento del administrador.

### Compatibilidad de plugins

Antes de instalar o actualizar un plugin, el responsable del entorno debe revisar:

- Versión mínima de Jenkins.
- Dependencias.
- Compatibilidad con otros plugins.
- Estado de mantenimiento.
- Avisos de seguridad.
- Cambios que afecten a jobs existentes.
- Procedimiento de rollback.

El alumnado no debe instalar plugins en una instancia compartida.

### Jenkins y Java

Jenkins necesita una versión compatible de Java.

Los requisitos cambian según la versión de Jenkins.

Comprueba siempre la documentación de la versión concreta antes de actualizar Java o Jenkins.

---

## Encontrar una respuesta

Una búsqueda precisa permite localizar información útil con menos resultados irrelevantes.

### Definir la pregunta

Antes de buscar, escribe qué quieres averiguar.

Pregunta amplia:

```text
¿Cómo funciona Jenkins?
```

Pregunta más precisa:

```text
¿Cómo se declara un agente en Declarative Pipeline?
```

Otra pregunta concreta:

```text
¿Qué condiciones admite la sección post de un Jenkinsfile?
```

### Identificar el tipo de duda

Clasifica la pregunta:

- Uso de la interfaz.
- Job Freestyle.
- Declarative Pipeline.
- Scripted Pipeline.
- Plugin.
- Agent o node.
- Credenciales.
- Permisos.
- Error de ejecución.
- Versión.
- Administración.
- Integración con Git.

### Buscar por nombre exacto

Si conoces la función, busca su nombre exacto.

Por ejemplo:

- `Jenkinsfile`.
- `Pipeline Syntax`.
- `Credentials Binding`.
- `agent`.
- `post`.
- `timeout`.
- `retry`.

Confirma que el resultado pertenece a la documentación oficial o al plugin correspondiente.

### Buscar por plugin

Cuando una función procede de un plugin:

1. Identifica el nombre del plugin.
2. Abre la página oficial del plugin.
3. Comprueba la versión mínima de Jenkins.
4. Identifica dependencias.
5. Localiza la referencia de sus pasos.
6. Confirma que está instalado en la instancia del curso.
7. No intentes instalarlo sin permiso.

### Leer la página completa

No copies solo el bloque de ejemplo.

Lee también:

- Introducción.
- Requisitos.
- Parámetros.
- Valores predeterminados.
- Advertencias.
- Limitaciones.
- Cambios de versión.
- Compatibilidad.
- Ejemplos asociados.

### Comprobar funciones disponibles

La documentación puede describir un paso que no existe en el servidor del curso.

Comprueba:

- Si el plugin está instalado.
- Si el usuario puede usarlo.
- Si el agent tiene las herramientas requeridas.
- Si el controlador permite esa función.
- Si la versión cumple los requisitos.

### Buscar errores sin exponer datos

Al consultar un error:

- Elimina nombres internos.
- Sustituye URLs privadas por valores ficticios.
- Oculta usuarios y tokens.
- Comparte solo el fragmento necesario.
- Indica la versión sin divulgar detalles sensibles.
- No subas logs completos a sitios públicos.

### Prioridad de fuentes

Orden recomendado:

1. Documentación oficial de Jenkins.
2. Documentación oficial del plugin.
3. Ayuda de la propia instancia.
4. Notas de lanzamiento.
5. Repositorio oficial del componente.
6. Recursos comunitarios como apoyo.
7. Tutoriales de terceros, verificados antes de usarlos.

---

## Leer documentación de Pipeline

Pipeline permite definir un proceso automatizado como código.

### Declarative Pipeline

Declarative Pipeline ofrece una estructura más reglada.

Suele empezar con:

```groovy
pipeline {
    agent any
    stages {
        // stages del pipeline
    }
}
```

La sintaxis exacta depende de las funciones disponibles y de los plugins instalados.

### Scripted Pipeline

Scripted Pipeline ofrece un estilo más flexible basado en Groovy y los pasos de Pipeline.

La flexibilidad también puede aumentar complejidad y riesgo.

Lee las guías oficiales antes de mezclar estilos.

### `Jenkinsfile`

Un `Jenkinsfile` describe la Pipeline y normalmente se almacena junto al código fuente.

Esto facilita:

- Revisiones de cambios.
- Historial en Git.
- Reutilización.
- Ejecución por ramas.
- Trazabilidad.

Un `Jenkinsfile` también es código ejecutable. Debe revisarse como tal.

### Stages

Las etapas agrupan el proceso en fases reconocibles.

Ejemplos habituales:

- Preparación.
- Build.
- Test.
- Análisis.
- Publicación.

Los nombres deben describir el propósito y no ocultar efectos.

### Steps

Los steps son acciones ejecutadas dentro de un stage.

Pueden proceder de:

- Jenkins core.
- Plugins.
- Pasos de Pipeline.
- Código compartido.

Comprueba la documentación del step que vas a utilizar.

### Agentes

Un agente determina dónde se ejecuta el trabajo.

La directiva `agent` puede seleccionar:

- Cualquier agent permitido.
- Un label.
- Un tipo de contenedor u otro entorno, si está configurado.

No supongas que un label concreto existe.

No ejecutes código sobre un agent de producción si el curso no lo autoriza.

### Variables de entorno

Las variables de entorno pueden transmitir configuración no sensible.

No convierten un secreto en seguro automáticamente.

Una variable puede ser visible para procesos o terminar en logs si se imprime.

### Parámetros

Los parámetros permiten variar una ejecución.

Comprueba:

- Tipo.
- Valor predeterminado.
- Validación.
- Posibles valores peligrosos.
- Quién puede iniciar el job.
- Si el parámetro se incorpora a comandos.

No pases secretos en parámetros visibles.

### Condiciones

Las condiciones pueden controlar cuándo se ejecuta una etapa.

Comprueba:

- Cómo se evalúa la condición.
- Qué valores existen.
- Si puede saltarse una validación.
- Si la etapa posterior depende de una anterior.
- Qué ocurre cuando falta una variable.

### Sección `post`

La sección `post` permite definir acciones posteriores a la ejecución.

Las condiciones y los nombres admitidos dependen de la sintaxis de Pipeline.

Consulta la documentación para entender cuándo se ejecuta cada bloque.

### Timeout y retry

Opciones como timeout y retry pueden ayudar a gestionar esperas o errores transitorios.

No uses retry para ocultar una falla permanente.

Comprueba:

- Qué operación se repite.
- Si es segura de repetir.
- Cuántas veces.
- Qué timeout resulta apropiado.
- Qué logs genera.

### Shared Libraries

Las Shared Libraries permiten reutilizar código de Pipeline.

Comprueba:

- Origen.
- Revisión o versión.
- Confianza en el repositorio.
- Configuración del servidor.
- Permisos.
- Compatibilidad.
- Revisión del código compartido.

Una librería compartida puede afectar a muchos jobs.

---

## Jobs, nodos y ejecución

La documentación oficial explica cómo Jenkins coordina jobs y agentes.

### Freestyle jobs

Un Freestyle job se configura principalmente desde la interfaz.

Puede ser útil para:

- Aprender conceptos iniciales.
- Ejecutar pasos simples de laboratorio.
- Observar la configuración de un job.

Los cambios desde la interfaz pueden ser menos visibles en Git que un `Jenkinsfile`.

### Pipelines

Una Pipeline define un proceso automatizado como código.

Puede ofrecer:

- Revisión en Git.
- Historial de cambios.
- Etapas visibles.
- Parámetros.
- Condiciones.
- Reutilización.
- Integración con repositorios.

### Controller

El controller coordina Jenkins y mantiene configuración, jobs y ejecución de Pipeline.

Debe protegerse y administrarse por personal autorizado.

### Agents

Los agents ejecutan trabajos asignados por el controller.

Un agent puede ser:

- Estático.
- Dinámico.
- Local al controller en laboratorios pequeños.
- Una máquina o contenedor dedicado.
- Un entorno gestionado por una plataforma externa.

### Separación controller-agent

Separar controller y agents puede reducir ciertos riesgos y mejorar la distribución de carga.

No significa que los agents sean automáticamente seguros.

Revisa permisos, aislamiento, herramientas instaladas y acceso a credenciales.

### Executors

Un executor representa capacidad de ejecución concurrente en un node.

Un número mayor de executors puede aumentar carga y concurrencia.

La configuración depende del hardware y del tipo de trabajos.

### Workspaces

Los workspaces contienen archivos de trabajo del job.

Pueden incluir:

- Código obtenido del repositorio.
- Resultados de build.
- Archivos temporales.
- Configuraciones.
- Datos generados.

No los trates como almacenamiento seguro permanente.

### Colas

Los jobs pueden esperar en una cola por:

- Falta de executors.
- Restricciones de labels.
- Recursos no disponibles.
- Bloqueos.
- Dependencias.
- Configuración del agent.

### Concurrencia

Dos builds del mismo job pueden correr en paralelo si la configuración lo permite.

Evalúa si el proceso tolera:

- Escrituras simultáneas.
- Uso compartido de workspace.
- Acceso concurrente a recursos.
- Publicación duplicada.
- Cambios simultáneos.

### Etiquetas de agents

Los labels identifican capacidades o grupos de agents.

No deben usarse como una garantía de seguridad sin políticas de acceso y configuración adecuadas.

Comprueba qué agents coinciden con el label.

---

## Plugins y extensiones

Los plugins amplían Jenkins, pero también añaden dependencias y superficie de mantenimiento.

### Qué es un plugin

Un plugin añade o cambia funciones de Jenkins.

Puede proporcionar:

- Integración con un sistema externo.
- Un step de Pipeline.
- Un método de autenticación.
- Un visualizador.
- Un tipo de credencial.
- Un mecanismo de agente.
- Una función administrativa.

### Buscar un plugin

Antes de utilizar un plugin:

1. Localiza su página oficial.
2. Comprueba nombre y mantenedor.
3. Comprueba la última versión.
4. Revisa requisitos de Jenkins.
5. Revisa dependencias.
6. Busca advertencias de seguridad.
7. Comprueba si está instalado en el laboratorio.

### Compatibilidad y mantenimiento

La página del plugin puede mostrar:

- Versión mínima de Jenkins.
- Dependencias.
- Estado de mantenimiento.
- Historial de versiones.
- Cambios importantes.
- Avisos de seguridad.

Interpreta estos datos antes de usarlo.

### Instalación y actualización

La instalación o actualización de plugins es una tarea administrativa.

El alumnado no debe modificar plugins de un controller compartido salvo que la sesión lo indique y el entorno sea aislado.

### Plugin Manager

Jenkins incluye mecanismos de administración de plugins desde la interfaz.

El acceso suele depender de permisos administrativos.

No explores botones de instalación en una instancia compartida.

### CLI y herramientas de administración

Algunas tareas pueden realizarse mediante interfaces o comandos administrativos.

Comprueba:

- Autenticación.
- Autorización.
- Método soportado.
- Versión.
- Riesgos de la operación.
- Registro de la acción.

### Dependencias entre plugins

Un plugin puede requerir otros.

Actualiza un conjunto de plugins con pruebas y planificación.

No actualices dependencias manualmente a mitad de una práctica compartida.

### Plugins abandonados

Un plugin antiguo o sin mantenimiento puede introducir:

- Incompatibilidades.
- Riesgos de seguridad.
- Fallos en actualizaciones.
- Falta de soporte.
- Comportamiento difícil de reproducir.

Consulta la información oficial disponible y las políticas del equipo.

### Alternativas al plugin

Antes de instalar un plugin, pregunta:

- ¿La función ya existe en Jenkins?
- ¿La biblioteca estándar del entorno la ofrece?
- ¿La necesidad puede resolverse de forma más sencilla?
- ¿El plugin está aprobado?
- ¿Existe una alternativa mantenida?
- ¿Qué esfuerzo añade su mantenimiento?

---

## Seguridad al consultar ejemplos

Un ejemplo de Jenkins puede ejecutar comandos, leer código o utilizar credenciales.

### Credenciales

Jenkins puede almacenar credenciales mediante su sistema de credenciales y plugins asociados.

No escribas secretos en:

- Un `Jenkinsfile`.
- Parámetros de job.
- Código fuente.
- Consola.
- Capturas.
- Historial de shell.
- README.
- Archivos versionados.

### No imprimir secretos

El enmascaramiento de Jenkins reduce algunas filtraciones visibles, pero no es una garantía absoluta.

Evita comandos que impriman variables secretas.

No uses `echo` para comprobar un token.

### Credenciales enlazadas

Algunos plugins permiten enlazar credenciales a variables durante una parte del Pipeline.

La sintaxis exacta depende del plugin y de la versión.

Consulta la documentación correspondiente y verifica:

- Alcance.
- Tipo de credencial.
- Duración.
- Enmascaramiento.
- Exposición a procesos.
- Acceso del job.

### Permisos

Jenkins puede aplicar permisos por usuario, grupo, carpeta o job, según la configuración.

No asumas que todos los usuarios tienen las mismas capacidades.

### Builds no confiables

Un job que ejecuta código de una pull request no confiable puede intentar:

- Leer archivos accesibles al workspace.
- Usar variables disponibles.
- Invocar herramientas del agent.
- Consultar recursos de red.
- Acceder a credenciales expuestas al job.

No entregues secretos a builds de código no revisado.

### Código de repositorios

Un `Jenkinsfile` es código que Jenkins ejecuta.

Revisa cambios en:

- Pull requests.
- Branches no protegidas.
- Shared Libraries.
- Scripts de build.
- Dependencias.
- Comandos de shell.

### Console output

La consola puede revelar:

- Errores internos.
- Rutas.
- Variables.
- Nombres de host.
- Configuración.
- Fragmentos de código.
- Datos personales.

Revisa la salida antes de compartirla.

### Backups

Los backups pueden incluir:

- Configuración de Jenkins.
- Jobs.
- Metadatos.
- Credenciales cifradas.
- Plugins.
- Datos de usuario.
- Archivos de soporte.

Solo administradores autorizados deben gestionarlos.

### Cambios administrativos

No cambies en una instancia compartida:

- Configuración global.
- Seguridad.
- Plugins.
- Nodos.
- Credentials store.
- Acceso de usuarios.
- Variables del sistema.

Usa un Jenkins de laboratorio aislado cuando una práctica requiera administración.

---

## Consultar documentación desde Jenkins

Jenkins incluye herramientas que ayudan a generar y entender sintaxis.

### Ayuda en la interfaz

La interfaz puede ofrecer enlaces de ayuda junto a determinados campos.

La ayuda local puede reflejar:

- Versión de Jenkins.
- Plugins instalados.
- Campos disponibles.
- Configuración concreta.

Compara esa información con la documentación web.

### Pipeline Syntax

La sección de Pipeline Syntax permite generar o inspeccionar fragmentos de Pipeline, según los plugins instalados.

Puede ayudar a:

- Explorar pasos disponibles.
- Ver parámetros.
- Generar una estructura inicial.
- Comprobar opciones de un plugin.

El fragmento generado sigue necesitando revisión.

### Snippet Generator

El Snippet Generator ayuda a construir sintaxis para pasos concretos.

Al usarlo:

1. Selecciona el paso.
2. Revisa todos los parámetros.
3. Comprueba valores por defecto.
4. Genera el fragmento.
5. Lee el código resultante.
6. Verifica si el plugin está disponible.
7. No insertes secretos en una demostración compartida.

### Global Variables Reference

La referencia de variables globales describe objetos y funciones disponibles en Pipeline en esa instancia.

Su contenido depende de:

- Jenkins.
- Plugins instalados.
- Versiones.
- Configuración.

No copies una función de una instancia a otra sin comprobar su disponibilidad.

### System Information

La página de información del sistema puede exponer detalles de entorno.

Consulta esos datos solo con autorización.

No publiques una captura completa sin revisar:

- Rutas.
- Variables.
- Propiedades.
- Nombres.
- Versiones.
- Información del host.

### Manage Jenkins

Las páginas administrativas pueden mostrar configuración y permitir cambios.

Si no tienes permisos administrativos, no intentes eludirlos.

En un curso, utiliza las páginas de lectura que indique el docente.

### Ayuda contextual y documentación externa

La ayuda contextual puede enlazar a documentación web.

Comprueba que:

- El enlace corresponde a la versión.
- La página es oficial.
- El plugin es el esperado.
- No estás viendo documentación de una versión posterior.

---

## Método de lectura y verificación

Un procedimiento repetible mejora la calidad de las consultas técnicas.

### Paso 1: identificar el contexto

Registra:

- Versión de Jenkins.
- Versión del plugin, si aplica.
- Tipo de job.
- Sistema del agent.
- Objetivo.
- Error observado.
- Permisos disponibles.

### Paso 2: formular la pregunta

Describe el comportamiento que quieres entender.

Ejemplo:

```text
¿Cómo especifico un timeout para una etapa Declarative Pipeline?
```

Evita empezar por una solución prefijada si todavía no conoces la causa.

### Paso 3: localizar la fuente

Busca la guía o referencia adecuada.

Comprueba si el tema pertenece a:

- Jenkins core.
- Pipeline.
- Un plugin.
- Una herramienta externa.
- Una política local.

### Paso 4: confirmar versión

Comprueba que la página corresponde a la versión relevante.

Para una función de plugin, comprueba también la versión del plugin.

### Paso 5: revisar requisitos

Identifica:

- Agent requerido.
- Plugin requerido.
- Sistema operativo.
- Permisos.
- Variables.
- Herramientas externas.
- Conectividad.
- Credenciales.

### Paso 6: revisar efectos

Antes de ejecutar, identifica si el ejemplo:

- Modifica archivos.
- Usa shell.
- Publica artefactos.
- Se conecta a red.
- Lee credenciales.
- Reinicia servicios.
- Cambia estado global.
- Ejecuta código no confiable.

### Paso 7: probar en pequeño

Empieza con:

- Un job de práctica.
- Un repositorio de laboratorio.
- Un `Jenkinsfile` pequeño.
- Un agent aprobado.
- Datos ficticios.
- Una salida sin secretos.

### Paso 8: comparar lo esperado y lo observado

Registra:

- Resultado esperado.
- Resultado real.
- Diferencia.
- Versión.
- Plugin.
- Condiciones del agent.
- Próxima prueba.

### Paso 9: atribuir la fuente

Incluye:

- Título.
- URL.
- Versión consultada.
- Plugin, si aplica.
- Fecha de consulta, cuando se requiera.
- Resumen con palabras propias.

---

## Sesiones prácticas

Las prácticas enseñan a buscar, comprobar y aplicar documentación en un Jenkins de laboratorio.

### Preparación común

Antes de cada sesión:

- Confirma que la instancia es la de curso.
- Identifica quién administra el controller.
- No cambies configuración global.
- Usa solo jobs de práctica.
- No guardes credenciales reales.
- No publiques capturas sin revisarlas.
- Trabaja con un repositorio de ejemplo.
- Sigue las indicaciones del docente.

### Sesión 1: explorar la documentación oficial

**Objetivo:** ubicar los recursos principales.

Pasos:

1. Abre el sitio oficial de Jenkins.
2. Localiza la documentación de usuario.
3. Localiza la guía de Pipeline.
4. Localiza la guía de instalación.
5. Localiza la sección de seguridad.
6. Localiza la documentación de plugins.
7. Anota los títulos y URLs.
8. No ejecutes comandos durante esta exploración.

Preguntas:

- ¿Dónde buscarías una respuesta sobre Pipeline?
- ¿Dónde buscarías un requisito de un plugin?
- ¿Qué diferencia hay entre una guía y una referencia?

### Sesión 2: identificar la versión de Jenkins

**Objetivo:** relacionar instancia y documentación.

Pasos:

1. Abre la interfaz de la instancia del curso.
2. Identifica la versión mediante el método indicado por el docente.
3. Anota si es LTS o una versión distinta, cuando esté disponible.
4. No abras páginas administrativas restringidas.
5. Busca la documentación de esa versión.
6. Anota una diferencia potencial con `latest`.

Entrega:

```text
Instancia:
Versión:
Fuente de la versión:
Documentación consultada:
Observación:
```

### Sesión 3: diferenciar core y plugin

**Objetivo:** determinar quién documenta una función.

El docente asigna una función, como un step o una integración.

Pasos:

1. Identifica el nombre de la función.
2. Comprueba si pertenece a Jenkins core o a un plugin.
3. Localiza la referencia adecuada.
4. Revisa requisitos.
5. Comprueba la versión instalada del plugin si tienes permiso para verla.
6. Anota qué información falta si no puedes comprobarla.

### Sesión 4: consultar la guía de Pipeline

**Objetivo:** familiarizarse con los conceptos de Pipeline.

Pasos:

1. Localiza la guía de Pipeline.
2. Identifica `Jenkinsfile`.
3. Identifica Declarative Pipeline.
4. Identifica Scripted Pipeline.
5. Localiza la sección sobre `agent`.
6. Lee la sección sobre `stages`.
7. Resume cada término con tus palabras.

### Sesión 5: crear un primer job de laboratorio

**Objetivo:** crear un job sin acceso externo ni secretos.

Pasos:

1. Usa la carpeta o namespace que indique el docente.
2. Crea un Pipeline de práctica.
3. Utiliza una etapa que imprima un mensaje inocuo.
4. No añadas credenciales.
5. No ejecutes scripts de terceros.
6. Guarda el job.
7. Ejecuta una sola vez.
8. Revisa el resultado de consola.

### Sesión 6: escribir un `Jenkinsfile` mínimo

**Objetivo:** relacionar documentación y sintaxis.

Crea este ejemplo:

```groovy
pipeline {
    agent any

    stages {
        stage('Inicio') {
            steps {
                echo 'Pipeline de laboratorio iniciada.'
            }
        }

        stage('Comprobacion') {
            steps {
                echo 'Esta etapa no modifica sistemas externos.'
            }
        }
    }

    post {
        always {
            echo 'La ejecucion del laboratorio ha terminado.'
        }
    }
}
```

Pasos:

1. Lee el archivo completo.
2. Identifica `pipeline`.
3. Identifica `agent`.
4. Identifica `stages`.
5. Identifica cada `stage`.
6. Identifica `steps`.
7. Identifica `post`.
8. Ejecuta solo en el entorno de curso.

### Sesión 7: localizar Pipeline Syntax

**Objetivo:** descubrir ayuda generada por la instancia.

Pasos:

1. Abre la página de Pipeline Syntax indicada por el docente.
2. Busca el Snippet Generator.
3. Selecciona un paso de bajo impacto, si existe.
4. Revisa los parámetros.
5. Genera el fragmento.
6. Compáralo con la documentación oficial.
7. No configures credenciales.
8. No copies valores secretos en la interfaz.

### Sesión 8: investigar una etapa con timeout

**Objetivo:** consultar sintaxis y límites.

Pasos:

1. Busca la documentación oficial de timeout en Pipeline.
2. Comprueba el contexto donde se puede usar.
3. Comprueba las unidades o parámetros.
4. Escribe un ejemplo local o teórico.
5. Valida en el job de práctica.
6. Explica qué evita y qué no evita un timeout.

### Sesión 9: investigar condiciones `post`

**Objetivo:** entender acciones posteriores al Pipeline.

Pasos:

1. Localiza la documentación de la sección `post`.
2. Identifica varias condiciones documentadas.
3. Selecciona una adecuada para un mensaje de laboratorio.
4. Añade la condición a una copia del `Jenkinsfile`.
5. Ejecuta el job.
6. Compara la salida.
7. No uses acciones externas de publicación.

### Sesión 10: consultar parámetros

**Objetivo:** reconocer cómo una entrada puede afectar el proceso.

Pasos:

1. Lee la documentación de parámetros de Pipeline.
2. Identifica tipos de parámetros.
3. Diseña un parámetro de texto no sensible.
4. Valida el valor de forma conceptual o en un job local.
5. No solicites contraseñas.
6. No concatenes entradas sin validación en un comando.

### Sesión 11: distinguir agent y controller

**Objetivo:** entender dónde se ejecuta cada paso.

Pasos:

1. Lee la documentación de nodos y agents.
2. Identifica la diferencia entre controller y agent.
3. Revisa qué agent usa el job de laboratorio.
4. No cambies labels.
5. No conectes una máquina propia.
6. Explica qué herramientas debe tener un agent para ejecutar un build.

### Sesión 12: analizar una consola

**Objetivo:** identificar información útil y datos que deben protegerse.

Pasos:

1. Abre la salida de consola de tu job de laboratorio.
2. Identifica inicio, stages y resultado final.
3. Busca rutas o nombres internos que deban ocultarse.
4. Confirma que no hay secretos.
5. Guarda un resumen de salida, no un log completo, para la entrega.

### Sesión 13: investigar credenciales sin crear secretos

**Objetivo:** comprender la documentación de credenciales de forma segura.

Pasos:

1. Localiza la guía oficial de credenciales.
2. Identifica los tipos de credenciales descritos.
3. Lee cómo se referencian desde Pipeline.
4. Anota los límites del enmascaramiento.
5. No crees una credencial personal.
6. No imprimas valores.
7. Describe un flujo seguro en términos generales.

### Sesión 14: revisar un ejemplo con shell

**Objetivo:** evaluar el riesgo de un step de shell.

El docente entrega un ejemplo inocuo.

Pasos:

1. Localiza el step `sh` o equivalente del entorno.
2. Lee el ejemplo.
3. Identifica si modifica archivos.
4. Identifica si concatena variables.
5. Comprueba el agent y su sistema operativo.
6. Reescribe el ejemplo como una explicación, sin ejecutarlo, si presenta riesgos.

### Sesión 15: investigar un plugin

**Objetivo:** evaluar requisitos y compatibilidad.

Pasos:

1. El docente asigna un plugin.
2. Localiza su página oficial.
3. Anota el propósito.
4. Anota versión mínima de Jenkins.
5. Anota dependencias.
6. Comprueba su estado de mantenimiento.
7. No lo instales.
8. Indica qué tendría que revisar el administrador.

### Sesión 16: diagnosticar una Pipeline que falla

**Objetivo:** usar documentación para investigar un fallo.

El docente proporciona una salida ficticia, sin datos privados.

Pasos:

1. Identifica stage y step fallidos.
2. Identifica versión de Jenkins.
3. Comprueba si el step depende de un plugin.
4. Busca la referencia del step.
5. Compara parámetros y requisitos.
6. Formula una hipótesis.
7. Propón una prueba local segura.
8. No compartas logs externos.

### Sesión 17: revisar un ejemplo de terceros

**Objetivo:** verificar una solución no oficial.

Pasos:

1. Lee el ejemplo proporcionado.
2. Identifica versión y plugins supuestos.
3. Busca cada función en documentación oficial.
4. Identifica credenciales, comandos o efectos.
5. Señala qué parte no ejecutarías.
6. Redacta una versión de laboratorio segura.
7. Atribuye tanto el ejemplo como la referencia oficial.

### Sesión 18: comparar dos versiones de Pipeline

**Objetivo:** identificar cambios de documentación.

Pasos:

1. Abre documentación de dos versiones asignadas.
2. Compara un elemento de sintaxis.
3. Compara requisitos.
4. Busca cambios incompatibles.
5. Describe el riesgo de copiar un ejemplo nuevo en una instancia antigua.
6. No cambies el Jenkinsfile de un proyecto compartido.

### Sesión 19: consultar permisos

**Objetivo:** comprender el modelo de autorización.

Pasos:

1. Lee la documentación de seguridad y autorización.
2. Identifica conceptos de usuario, grupo y permiso.
3. Comprueba el nivel de acceso de tu usuario mediante el método autorizado.
4. No intentes visitar páginas restringidas por fuerza bruta.
5. Anota qué operaciones necesitan permisos administrativos.
6. Explica por qué cada usuario no debería ser administrador.

### Sesión 20: preparar una ficha de documentación

**Objetivo:** guardar la respuesta de forma reutilizable.

Completa:

```text
Pregunta:
Versión de Jenkins:
Plugin:
Fuente oficial:
URL:
Requisitos:
Parámetros:
Ejemplo revisado:
Riesgos:
Prueba:
Resultado:
Limitaciones:
```

No añadas credenciales, URLs privadas ni logs completos.

### Sesión 21: investigar una actualización

**Objetivo:** leer notas de lanzamiento de manera segura.

Pasos:

1. Selecciona una versión de Jenkins indicada por el docente.
2. Abre sus notas de lanzamiento.
3. Identifica cambios relevantes.
4. Busca avisos de seguridad.
5. Anota los plugins que podrían verse afectados, si se especifican.
6. No actualices la instancia.
7. Describe qué pruebas previas exigirías.

### Sesión 22: revisar Shared Libraries

**Objetivo:** entender el papel de código compartido.

Pasos:

1. Lee la documentación oficial de Shared Libraries.
2. Identifica cómo se configura una librería.
3. Explica qué confianza requiere su repositorio.
4. Identifica riesgos de cambios no revisados.
5. No conectes una librería externa a la instancia del curso.
6. Propón un control de revisión.

### Sesión 23: revisar la documentación de seguridad

**Objetivo:** encontrar recomendaciones de protección de Jenkins.

Pasos:

1. Localiza la documentación de seguridad.
2. Identifica recomendaciones sobre controller.
3. Identifica recomendaciones sobre agents.
4. Identifica recomendaciones sobre credenciales.
5. Resume tres controles.
6. Compara con las reglas del laboratorio.
7. No cambies la configuración global.

### Sesión 24: revisión por parejas

**Objetivo:** validar una nota técnica.

La persona autora explica:

- Pregunta.
- Versión.
- Fuente oficial.
- Requisitos.
- Prueba realizada.
- Resultado.
- Riesgo identificado.

La persona revisora comprueba:

- La fuente es pertinente.
- La versión está identificada.
- Los ejemplos son seguros.
- No hay secretos.
- Las afirmaciones se apoyan en documentación.
- Las limitaciones están descritas.

### Sesión 25: proyecto integrador

**Objetivo:** resolver una pregunta de Jenkins con evidencia oficial.

Requisitos:

- Pregunta concreta.
- Versión de Jenkins identificada.
- Fuente oficial enlazada.
- Documentación de plugin consultada, cuando corresponda.
- Requisitos y parámetros registrados.
- Ejemplo de laboratorio no sensible.
- Resultado de una prueba local.
- Riesgos y limitaciones descritos.
- Sin credenciales reales.
- Sin cambios administrativos.
- Sin logs completos.

---

## Buenas prácticas para documentar el curso

Una buena guía permite que otra persona compruebe el procedimiento y lo reproduzca.

### Enlaces y versiones

- Enlaza directamente a la página pertinente.
- Indica la versión consultada.
- Evita usar únicamente un enlace a la página principal.
- Comprueba los enlaces al actualizar el curso.
- Indica si el recurso trata de Jenkins core o de un plugin.
- Evita prometer que una ruta web será permanente.

### Citas y atribución

- Atribuye los ejemplos basados en documentación oficial.
- Resume con tus propias palabras.
- Utiliza fragmentos breves cuando sea necesario.
- Enlaza a la fuente para que el lector consulte el contexto.
- No presentes contenido de terceros como contenido oficial.
- Distingue explicación docente y especificación oficial.

### Ejemplos seguros

Antes de publicar un ejemplo:

- Elimina credenciales.
- Sustituye endpoints reales.
- Revisa comandos.
- Revisa rutas.
- Revisa nombres internos.
- Limita el alcance.
- Indica requisitos.
- Explica qué modifica.
- Ejecuta el ejemplo en el laboratorio.
- Captura solo información no sensible.

### Actualización del material

Al revisar una página del curso:

1. Identifica la versión que utiliza el curso.
2. Abre la documentación oficial correspondiente.
3. Comprueba cambios en sintaxis.
4. Comprueba dependencias de plugins.
5. Prueba los ejemplos.
6. Revisa enlaces.
7. Actualiza fecha o versión.
8. Documenta la revisión.
9. Elimina instrucciones obsoletas.
10. Conserva una forma de volver a una versión anterior del material.

### Notas técnicas

Una nota debería separar:

- Fuente oficial.
- Contexto del curso.
- Pasos observados.
- Resultado esperado.
- Riesgos.
- Decisiones locales.
- Dudas pendientes.

### No convertir ejemplos en recetas universales

Un pipeline de práctica no necesariamente es apto para:

- Otro sistema operativo.
- Otro agent.
- Otro plugin.
- Una instancia de producción.
- Un repositorio con código no confiable.
- Un entorno con controles distintos.

---

## Diagnóstico

Una consulta fallida puede deberse a versión, permisos, plugin o contexto.

### Enlace roto

Comprueba:

- Si la estructura del sitio cambió.
- Si la página se movió.
- Si existe una versión archivada.
- Si el tema pertenece a un plugin.
- Si el enlace redirige a otra versión.

Vuelve al portal oficial y navega desde allí.

### Función que no aparece

Comprueba:

- Versión de Jenkins.
- Plugin asociado.
- Versión del plugin.
- Permisos de usuario.
- Página de ayuda local.
- Compatibilidad con el tipo de job.

No intentes instalar un plugin para hacer aparecer la función.

### Pipeline que no valida

Comprueba:

- Errores de sintaxis.
- Versión de Jenkins.
- Plugins requeridos.
- Agente seleccionado.
- Nombres de steps.
- Indentación y llaves.
- Diferencias entre Declarative y Scripted Pipeline.

Consulta la documentación del step específico.

### Plugin incompatible

Comprueba:

- Versión mínima de Jenkins.
- Dependencias.
- Versión instalada.
- Avisos en la página del plugin.
- Notas de lanzamiento.
- Restricciones del administrador.

No actualices el plugin en un servidor compartido como prueba.

### Error de permisos

Comprueba:

- Qué operación se intentó.
- Qué permiso requiere.
- Qué rol tiene el usuario.
- Si el entorno de curso restringe la operación.
- Quién puede aprobar el cambio.

No busques una forma alternativa de saltarte la autorización.

### Agent no disponible

Comprueba:

- Label solicitado.
- Estado del agent.
- Herramientas requeridas.
- Capacidad de executor.
- Disponibilidad del entorno.
- Restricciones del curso.

No conectes un equipo personal para sustituir un agent.

### Error en shell

Comprueba:

- Sistema operativo del agent.
- Intérprete.
- Ruta de trabajo.
- Código de salida.
- Comillas.
- Caracteres especiales.
- Variables interpoladas.
- Permisos.

Elimina los valores secretos antes de copiar el error.

### Ficha de diagnóstico

```text
Pregunta:
Versión de Jenkins:
Versión de plugin:
Tipo de job:
Agent:
Stage:
Step:
Primer error:
Resultado observado:
Fuente oficial:
Requisito relevante:
Hipótesis:
Prueba siguiente:
Acción autorizada:
```

No incluyas tokens, contraseñas, cookies, URLs privadas ni logs completos.

---

## Checklist

### Antes de consultar

- [ ] La pregunta está formulada con precisión.
- [ ] La versión de Jenkins está identificada.
- [ ] El tipo de job está identificado.
- [ ] El plugin implicado está identificado.
- [ ] No se incluirán secretos en búsquedas.

### Al leer documentación

- [ ] El sitio o mantenedor es confiable.
- [ ] La versión corresponde al entorno.
- [ ] Se revisaron requisitos.
- [ ] Se revisaron parámetros.
- [ ] Se revisaron advertencias.
- [ ] El ejemplo se entiende antes de copiarlo.
- [ ] Se identificaron los efectos posibles.

### Antes de probar

- [ ] El job pertenece al laboratorio.
- [ ] El agent está autorizado.
- [ ] No se usan credenciales reales.
- [ ] No se cambia configuración global.
- [ ] No se instala un plugin.
- [ ] El pipeline no ejecuta código externo sin revisión.
- [ ] La consola no mostrará secretos.

### Al documentar

- [ ] Se indica versión.
- [ ] Se incluye la fuente.
- [ ] Se resumen los hallazgos.
- [ ] Se registran limitaciones.
- [ ] Se atribuye el contenido.
- [ ] Se omiten datos sensibles.
- [ ] La prueba se puede reproducir en el laboratorio.

---

## Evaluación

La evaluación valora búsqueda, interpretación, seguridad y capacidad para documentar una solución.

### Evidencias mínimas

Entrega:

- Pregunta técnica.
- Versión de Jenkins.
- URL oficial.
- Referencia del plugin, si corresponde.
- Requisitos relevantes.
- Parámetros principales.
- Prueba de laboratorio.
- Resultado.
- Limitaciones.
- Riesgos identificados.
- Resumen con palabras propias.

### Rúbrica

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Búsqueda | Consulta amplia sin verificar fuente | Encuentra documentación pertinente | Contrasta guía, plugin y ayuda local |
| Versiones | No registra versión | Identifica versión de Jenkins | Considera core, plugins y compatibilidad |
| Interpretación | Copia un ejemplo | Explica requisitos y parámetros | Analiza efectos, riesgos y limitaciones |
| Seguridad | Prueba en un job compartido | Usa el laboratorio y evita secretos | Evalúa agents, código no confiable y permisos |
| Prueba | No aporta evidencia | Ejecuta una prueba no sensible | Compara resultado con lo esperado |
| Atribución | No enlaza la fuente | Añade enlace y título | Añade versión y contexto reproducible |
| Diagnóstico | Repite una solución externa | Comprueba error y requisitos | Formula hipótesis y valida de manera aislada |

### Preguntas de repaso

1. ¿Por qué conviene consultar documentación oficial?
2. ¿Qué diferencia hay entre documentación de Jenkins y de un plugin?
3. ¿Qué diferencia general existe entre LTS y weekly releases?
4. ¿Por qué hay que comprobar la versión instalada?
5. ¿Qué función tiene un `Jenkinsfile`?
6. ¿Qué diferencia general hay entre Declarative y Scripted Pipeline?
7. ¿Qué es un agent?
8. ¿Qué función tiene Pipeline Syntax?
9. ¿Por qué un ejemplo de Pipeline no es automáticamente seguro?
10. ¿Qué puede revelar el console output?
11. ¿Por qué no se deben imprimir secretos?
12. ¿Qué debe verificarse antes de instalar un plugin?
13. ¿Qué riesgos presenta una build de código no confiable?
14. ¿Qué debe registrarse en una nota técnica?
15. ¿Qué se debe hacer si la documentación usa una versión distinta?
16. ¿Qué diferencia hay entre un recurso oficial y uno comunitario?
17. ¿Por qué los plugins tienen requisitos propios?
18. ¿Qué hacer si una función no aparece en la instancia?
19. ¿Qué significa probar en pequeño?
20. ¿Qué datos se deben retirar antes de publicar un error?

---

## Glosario

- **Jenkins:** servidor de automatización utilizado para ejecutar jobs y Pipelines.
- **Jenkins core:** componente central del producto Jenkins.
- **LTS:** línea de versiones de soporte de largo plazo.
- **Weekly release:** línea de lanzamientos frecuentes.
- **Plugin:** extensión que añade o modifica funciones de Jenkins.
- **Job:** unidad configurada de trabajo en Jenkins.
- **Freestyle job:** job configurado principalmente mediante la interfaz.
- **Pipeline:** proceso automatizado expresado como una serie de etapas y pasos.
- **`Jenkinsfile`:** archivo que describe una Pipeline.
- **Declarative Pipeline:** estilo de Pipeline con estructura declarativa.
- **Scripted Pipeline:** estilo de Pipeline basado en Groovy y pasos de Pipeline.
- **Stage:** etapa que agrupa pasos de un flujo.
- **Step:** acción individual ejecutada por Pipeline.
- **Controller:** componente que coordina Jenkins y administra configuración.
- **Agent:** entorno donde se ejecutan tareas asignadas.
- **Node:** máquina o entorno de ejecución asociado a Jenkins.
- **Executor:** capacidad de ejecución concurrente asignada a un node.
- **Workspace:** directorio de trabajo de un job.
- **Label:** etiqueta que permite seleccionar agents.
- **Credentials:** datos de autenticación administrados por Jenkins o plugins.
- **Pipeline Syntax:** herramienta integrada que ayuda a generar o explorar fragmentos de Pipeline.
- **Snippet Generator:** asistente para producir sintaxis de determinados steps.
- **Shared Library:** código reutilizable compartido entre Pipelines.
- **Console output:** salida registrada durante una build.
- **Build:** ejecución de un job o Pipeline.
- **Artifact:** archivo generado y conservado por un proceso de build.
- **Queue:** cola de trabajos pendientes de ejecución.
- **Plugin dependency:** componente requerido por otro plugin.
- **Código no confiable:** código que no ha recibido la revisión o aprobación suficiente para acceder a recursos sensibles.
- **Documentación primaria:** información publicada por el proyecto o el mantenedor responsable.

---

## Enlaces oficiales

Las páginas y rutas pueden cambiar. Si una dirección no funciona, navega desde el portal oficial de Jenkins y verifica la versión de la documentación.

### Documentación general

- Documentación oficial: https://www.jenkins.io/doc/
- Guía de usuario: https://www.jenkins.io/doc/book/
- Guía de instalación: https://www.jenkins.io/doc/book/installing/
- Tutorial de Jenkins: https://www.jenkins.io/doc/tutorials/

### Pipeline

- Guía de Pipeline: https://www.jenkins.io/doc/book/pipeline/
- Sintaxis de Pipeline: https://www.jenkins.io/doc/book/pipeline/syntax/
- Jenkinsfile: https://www.jenkins.io/doc/book/pipeline/jenkinsfile/
- Shared Libraries: https://www.jenkins.io/doc/book/pipeline/shared-libraries/

### Administración y seguridad

- Administración: https://www.jenkins.io/doc/book/managing/
- Seguridad: https://www.jenkins.io/doc/book/security/
- Credentials: https://www.jenkins.io/doc/book/using/using-credentials/
- Controller y agents: https://www.jenkins.io/doc/book/using/using-agents/

### Plugins y proyecto

- Plugins: https://plugins.jenkins.io/
- Código fuente: https://github.com/jenkinsci/jenkins
- Proyecto Jenkins: https://www.jenkins.io/

Los enlaces son puntos de partida. Comprueba el título, el mantenedor, la versión y el contexto antes de basar una decisión en ellos.

---

## Plantillas de entrega

### Plantilla de consulta

```text
Pregunta:
Fecha de consulta:
Versión de Jenkins:
Versión del plugin:
Tipo de job:
Fuente oficial:
Título de la página:
Requisitos:
Parámetros relevantes:
Ejemplo revisado:
Prueba realizada:
Resultado:
Limitaciones:
Riesgos:
Conclusión:
```

### Plantilla de revisión de Pipeline

```text
Nombre del job:
Repositorio de laboratorio:
Versión de Jenkins:
Agent:
Plugin requerido:
Stages:
Steps:
¿Usa credenciales?:
¿Ejecuta shell?:
¿Accede a red?:
¿Puede publicar artefactos?:
¿Se revisó la salida?:
Decisión:
```

### Plantilla de diagnóstico

```text
Build:
Job:
Stage:
Step:
Versión:
Agent:
Error no sensible:
Fuente consultada:
Requisito detectado:
Hipótesis:
Prueba realizada:
Resultado:
Siguiente acción autorizada:
```

No adjuntes contraseñas, tokens, cookies, claves, datos de usuarios ni logs completos.

---

## Síntesis final

La documentación oficial de Jenkins ayuda a comprender funciones, sintaxis, requisitos y límites; la práctica responsable consiste en contrastarla con la versión y configuración reales del entorno.

- Identifica la versión del controller.
- Comprueba si la función pertenece a Jenkins core o a un plugin.
- Lee los requisitos y los parámetros completos.
- Usa Pipeline Syntax como ayuda, no como sustituto de revisión.
- Trata `Jenkinsfile` y Shared Libraries como código ejecutable.
- Protege credenciales, logs y artefactos.
- No instales plugins ni cambies configuración sin autorización.
- Prueba primero en un job y un agent de laboratorio.
- Registra fuente, versión, prueba y limitaciones.
- No compartas información interna al pedir ayuda.