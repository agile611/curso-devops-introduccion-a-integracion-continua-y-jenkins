# 02_recursos_utiles.md — Recursos útiles para el curso DevOps: Introducción a Jenkins

Jenkins forma parte de un ecosistema: automatiza procesos, pero trabaja junto con control de versiones, agentes de ejecución, herramientas de build, pruebas, artefactos, seguridad y observabilidad. Esta página reúne recursos para aprender cada pieza, saber dónde buscar respuestas y practicar de forma gradual en un entorno de curso.

La lista prioriza documentación oficial y proyectos reconocidos. Los enlaces, versiones y funciones pueden cambiar; comprueba que la documentación corresponde a la versión instalada y a las herramientas disponibles en el laboratorio. Las prácticas propuestas son locales o de análisis: no requieren credenciales reales, despliegues externos ni cambios en sistemas de producción.

> **Límite del curso:** utiliza solo la instancia Jenkins, los repositorios y los agents autorizados por el docente. No instales plugins, no conectes equipos personales, no publiques logs completos y no guardes secretos en código. Antes de seguir un tutorial, revisa qué ejecuta, sobre qué agente y con qué permisos.

---

## Objetivos y alcance

Esta página es una guía de navegación para encontrar material fiable y aprovecharlo durante el curso.

### Resultados de aprendizaje

Al terminar, podrás:

- Encontrar la documentación oficial de Jenkins.
- Reconocer la documentación de plugins y de herramientas externas.
- Elegir recursos apropiados según tu pregunta.
- Comprobar la versión y la vigencia de un tutorial.
- Utilizar recursos de Git junto con Jenkins.
- Identificar documentación de build, test y artefactos.
- Encontrar guías de seguridad pertinentes.
- Leer ejemplos sin ejecutarlos a ciegas.
- Probar un Pipeline simple en el laboratorio.
- Registrar fuentes técnicas y versiones.
- Detectar supuestos ocultos en un tutorial.
- Evitar publicar credenciales y datos del entorno.
- Explicar qué recurso usarías para investigar un problema concreto.

### Qué cubre esta guía

La página reúne recursos relacionados con:

- Jenkins core.
- Pipeline.
- Plugins.
- Git y repositorios.
- Maven, Gradle, npm y Make.
- Pruebas y reportes.
- Contenedores.
- Kubernetes.
- Seguridad de aplicaciones.
- Cadena de suministro de software.
- Agentes de ejecución.
- Logs y diagnóstico.

### Qué queda fuera

Esta página no:

- Garantiza que cada enlace siga exactamente igual.
- Sustituye las instrucciones del docente.
- Autoriza a instalar software en máquinas compartidas.
- Sustituye la documentación de una versión concreta.
- Incluye instrucciones para desplegar una aplicación real.
- Proporciona credenciales, tokens o direcciones privadas.
- Da por sentado que cada herramienta está instalada en el laboratorio.
- Recomienda utilizar tutoriales de terceros sin verificación.
- Define los controles de producción de una organización.

### Público destinatario

El material está pensado para alumnado que:

- Conoce operaciones básicas de terminal.
- Ha utilizado Git o está aprendiendo a hacerlo.
- Está empezando con Jenkins.
- Quiere comprender cómo se conectan las etapas de CI.
- Necesita aprender a consultar documentación técnica.

---

## Cómo utilizar este catálogo

La lista no está pensada para leerse entera de principio a fin antes de practicar.

### Elegir recursos según la pregunta

Empieza por identificar la pregunta:

- **¿Cómo escribo un Pipeline?** Consulta la documentación de Jenkins Pipeline.
- **¿Cómo clono un repositorio?** Consulta Git y la documentación del sistema de repositorios.
- **¿Cómo ejecuto pruebas Java?** Consulta Maven, Gradle y JUnit.
- **¿Cómo paso un secreto a un job?** Consulta la documentación oficial de credenciales y la política del laboratorio.
- **¿Cómo funciona un plugin?** Consulta la página oficial de ese plugin.
- **¿Por qué falla un agent?** Consulta Jenkins, el sistema operativo y las herramientas del agent.
- **¿Cómo interpreto un informe de test?** Consulta la herramienta de pruebas y el formato del informe.
- **¿Cómo se almacena una imagen?** Consulta la documentación del registro de contenedores utilizado.

### Evaluar vigencia y autoridad

Antes de seguir un recurso:

- Comprueba quién lo mantiene.
- Comprueba la fecha de actualización, si se muestra.
- Comprueba la versión de la herramienta.
- Comprueba si el recurso corresponde a tu sistema.
- Comprueba si el ejemplo depende de un plugin.
- Comprueba si el ejemplo requiere permisos.
- Busca una referencia oficial equivalente.
- Lee las advertencias y los requisitos.

### Registrar fuentes

En los apuntes, conserva:

- Título del recurso.
- URL.
- Producto o herramienta.
- Versión consultada.
- Fecha de consulta, si se requiere.
- Pregunta a la que responde.
- Resultado de la práctica.
- Limitaciones observadas.

### Priorizar documentación primaria

Orden recomendado:

1. Documentación oficial del proyecto.
2. Referencia oficial de la versión instalada.
3. Documentación oficial del plugin o herramienta.
4. Código o notas de lanzamiento del proyecto.
5. Recursos de la comunidad como apoyo.
6. Tutoriales de terceros que se hayan verificado.

### No confundir popularidad con autoridad

Un tutorial con muchas visitas puede:

- Estar desactualizado.
- Usar una versión antigua.
- Recomendar permisos excesivos.
- Instalar herramientas globalmente.
- Incluir credenciales de ejemplo peligrosas.
- No reflejar la configuración del curso.

La popularidad ayuda a encontrar ideas; no sustituye la verificación.

---

## Recursos oficiales de Jenkins

La documentación del propio proyecto es la primera referencia para aprender Jenkins.

### Documentación general

- [Jenkins — documentación](https://www.jenkins.io/doc/)
- [Jenkins — libro de usuario](https://www.jenkins.io/doc/book/)
- [Jenkins — tutoriales](https://www.jenkins.io/doc/tutorials/)
- [Jenkins — comunidad](https://www.jenkins.io/participate/)
- [Jenkins — página principal](https://www.jenkins.io/)

La documentación del libro de usuario cubre conceptos y procedimientos comunes.

### Guías de usuario

El libro de usuario de Jenkins ofrece material sobre:

- Instalación.
- Primeros pasos.
- Jobs.
- Pipelines.
- Controller y agents.
- Administración.
- Seguridad.
- Integraciones.
- Extensiones.

Empieza por una guía relacionada con la tarea concreta, en lugar de buscar una solución genérica para todo Jenkins.

### Instalación

- [Instalar Jenkins](https://www.jenkins.io/doc/book/installing/)
- [Instalación en plataformas](https://www.jenkins.io/doc/book/installing/)

La guía de instalación puede contener instrucciones para varios sistemas.

Antes de ejecutar instrucciones:

- Confirma el sistema operativo.
- Comprueba la versión de Java necesaria.
- Comprueba si se usa LTS o weekly.
- Comprueba el método de instalación.
- Confirma que tienes autorización.
- Evita cambiar una máquina compartida.

### Primeros pasos

- [Tutoriales de Jenkins](https://www.jenkins.io/doc/tutorials/)
- [Pipeline con Docker](https://www.jenkins.io/doc/tutorials/build-a-java-app-with-maven/)

Los tutoriales de Jenkins suelen presentar una secuencia práctica.

Adapta cada tutorial a:

- La versión instalada.
- Los plugins del curso.
- El sistema operativo del agent.
- El repositorio permitido.
- Los límites de red y credenciales.

### Administración

- [Administración de Jenkins](https://www.jenkins.io/doc/book/managing/)
- [Controller y agents](https://www.jenkins.io/doc/book/using/using-agents/)

Estos recursos son relevantes para comprender el servidor, aunque el alumnado no necesariamente tenga permiso para administrarlo.

### Seguridad

- [Seguridad de Jenkins](https://www.jenkins.io/doc/book/security/)
- [Uso de credenciales](https://www.jenkins.io/doc/book/using/using-credentials/)

Consulta estos recursos antes de diseñar jobs que utilicen credenciales o procesen código de repositorios.

### Versiones

- [Descargas de Jenkins](https://www.jenkins.io/download/)
- [Notas de lanzamiento de Jenkins](https://www.jenkins.io/changelog/)

Las notas de lanzamiento permiten investigar cambios y posibles incompatibilidades.

No actualices la instancia del curso para probar una función.

### Código fuente

- [Repositorio de Jenkins](https://github.com/jenkinsci/jenkins)

El repositorio es útil para investigar detalles avanzados y problemas reportados.

No es necesario leer el código fuente para completar las primeras prácticas.

---

## Recursos para aprender Pipeline

Pipeline describe un proceso automatizado mediante un archivo `Jenkinsfile` o mediante configuración equivalente.

### Declarative Pipeline

- [Sintaxis de Declarative Pipeline](https://www.jenkins.io/doc/book/pipeline/syntax/)

Consulta esta referencia para entender:

- `pipeline`.
- `agent`.
- `stages`.
- `stage`.
- `steps`.
- `environment`.
- `parameters`.
- `options`.
- `when`.
- `post`.

Los bloques disponibles pueden depender de la versión y de los plugins instalados.

### Scripted Pipeline

- [Guía de Pipeline](https://www.jenkins.io/doc/book/pipeline/)

La documentación de Pipeline también explica el estilo Scripted.

Antes de mezclar Declarative y Scripted, entiende la estructura y las diferencias de cada estilo.

### `Jenkinsfile`

- [Uso de un Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)

Un `Jenkinsfile` versionado junto al código permite:

- Revisar cambios.
- Registrar historial.
- Asociar Pipeline y repositorio.
- Reutilizar procesos.
- Probar cambios en ramas controladas.

Un `Jenkinsfile` es código ejecutable y debe revisarse con cuidado.

### Pipeline Syntax

La documentación explica herramientas de sintaxis disponibles desde Jenkins.

En la instancia del curso, el docente puede mostrar:

- Pipeline Syntax.
- Snippet Generator.
- Global Variables Reference.

Los fragmentos generados son una ayuda, no una aprobación automática del código.

### Shared Libraries

- [Pipeline Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)

Las bibliotecas compartidas permiten reutilizar código de Pipeline.

Antes de utilizar una biblioteca, revisa:

- Repositorio de origen.
- Rama o versión.
- Quién mantiene el código.
- Quién puede modificarlo.
- Cómo se revisan los cambios.
- Qué permisos hereda el job.
- Cómo se prueba una actualización.

### Ejemplo mínimo de Pipeline

Este ejemplo imprime mensajes inocuos y no accede a sistemas externos:

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
                echo 'Esta etapa no despliega ni publica nada.'
            }
        }
    }

    post {
        always {
            echo 'Fin de la ejecucion del laboratorio.'
        }
    }
}
```

### Cómo estudiar un ejemplo de Pipeline

Al leer un `Jenkinsfile`, identifica:

- Dónde se ejecuta.
- Qué stages tiene.
- Qué steps ejecuta.
- Qué herramientas necesita.
- Qué archivos modifica.
- Si utiliza credenciales.
- Si accede a red.
- Qué hace si una etapa falla.
- Qué información imprime.

### Recursos de Pipeline que se deben revisar

- Referencia de sintaxis.
- Documentación de los steps.
- Documentación de plugins usados por esos steps.
- Configuración de agents.
- Ayuda de la instancia del curso.
- Notas de versión cuando exista una diferencia.

---

## Recursos de control de versiones

Jenkins suele obtener código desde un sistema de control de versiones.

### Git

- [Documentación oficial de Git](https://git-scm.com/doc)
- [Libro Pro Git](https://git-scm.com/book/en/v2)

Recursos útiles para:

- Crear y revisar commits.
- Trabajar con ramas.
- Inspeccionar diferencias.
- Resolver conflictos.
- Entender tags.
- Revisar el historial.

Comandos que se pueden estudiar en un repositorio de práctica:

```bash
git status
```

```bash
git diff
```

```bash
git log --oneline
```

No ejecutes operaciones de reescritura de historial en un repositorio compartido sin autorización.

### GitHub

- [Documentación de GitHub](https://docs.github.com/)
- [GitHub Actions](https://docs.github.com/actions)

Aunque el curso se centre en Jenkins, la documentación de GitHub puede ayudar a comprender:

- Repositorios.
- Pull requests.
- Webhooks.
- Permisos.
- Protección de ramas.
- Eventos de integración.

GitHub Actions es un sistema de automatización distinto de Jenkins. Sus ejemplos no se pueden copiar directamente como `Jenkinsfile`.

### GitLab

- [Documentación de GitLab](https://docs.gitlab.com/)

Los recursos de GitLab pueden ayudar a comprender:

- Repositorios.
- Merge requests.
- Runners.
- Webhooks.
- Reglas de ramas.
- Integración continua de GitLab.

GitLab CI y Jenkins tienen modelos diferentes, aunque compartan conceptos de CI.

### Bitbucket

- [Documentación de Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/)

Consulta la documentación correspondiente al producto y versión utilizados por el curso.

No asumas que Bitbucket Cloud y Bitbucket Data Center tienen las mismas funciones.

### Webhooks y eventos

Un webhook puede avisar a Jenkins de un cambio en un repositorio.

Antes de configurar o probar webhooks:

- Comprueba que el endpoint es del laboratorio.
- No expongas Jenkins sin autorización.
- No pegues tokens en la documentación.
- Comprueba qué evento activa el job.
- Evita builds duplicadas.
- Revisa la política del repositorio.

### Recursos para aprender Git con Jenkins

Prueba a relacionar:

- Commit.
- Rama.
- Pull request.
- Webhook.
- Build.
- Commit que se probó.
- Resultado de la Pipeline.

Una build útil debe permitir identificar qué código se ejecutó.

---

## Recursos de build y dependencias

La herramienta de build depende del lenguaje y del proyecto.

### Maven

- [Guía oficial de Maven](https://maven.apache.org/guides/)
- [Referencia de plugins de Maven](https://maven.apache.org/plugins/)

Maven se utiliza con frecuencia en proyectos Java.

Consulta documentación para entender:

- Estructura del proyecto.
- Ciclo de vida.
- Dependencias.
- Plugins.
- Pruebas.
- Empaquetado.

### Gradle

- [Documentación oficial de Gradle](https://docs.gradle.org/current/userguide/userguide.html)

Gradle ofrece documentación para:

- Builds.
- Plugins.
- Dependencias.
- Tareas.
- Wrapper.
- Pruebas.
- Cachés.

Comprueba la versión de Gradle Wrapper del repositorio antes de usar la versión global del agent.

### npm

- [Documentación de npm](https://docs.npmjs.com/)
- [Documentación de Node.js](https://nodejs.org/docs/latest/api/)

Los proyectos JavaScript pueden utilizar npm para:

- Instalar dependencias.
- Ejecutar scripts.
- Probar.
- Compilar.
- Empaquetar.

No ejecutes scripts de un repositorio desconocido sin revisión.

### Make

- [GNU Make — documentación](https://www.gnu.org/software/make/manual/)

Make puede coordinar tareas mediante un `Makefile`.

Lee las recetas antes de ejecutarlas: una línea de Make puede invocar comandos arbitrarios.

### Wrappers

Un wrapper permite que el proyecto declare o descargue una versión concreta de una herramienta.

Ejemplos habituales:

- Maven Wrapper.
- Gradle Wrapper.
- Scripts de proyecto.

Comprueba que los archivos del wrapper sean los esperados y que el entorno permita su uso.

### Dependencias

Consulta la documentación del gestor correspondiente para comprender:

- Cómo se resuelven dependencias.
- Qué repositorios se utilizan.
- Cómo se fijan versiones.
- Cómo se verifica integridad.
- Cómo se gestionan vulnerabilidades.
- Qué archivos deben versionarse.

### Builds reproducibles

Una build reproducible busca obtener resultados coherentes a partir del mismo código y las mismas dependencias.

Revisa:

- Versiones de herramientas.
- Dependencias.
- Configuración del agent.
- Variables de entorno.
- Fechas o datos no deterministas.
- Cachés.
- Repositorios externos.

---

## Recursos de pruebas

Jenkins puede coordinar pruebas, pero el formato y la ejecución dependen del proyecto.

### Pruebas unitarias

Consulta la documentación del framework de pruebas del lenguaje.

Ejemplos:

- JUnit para Java.
- pytest para Python.
- Jest o Vitest para JavaScript.
- Go testing para Go.

No ejecutes las pruebas de un repositorio desconocido fuera del sandbox.

### JUnit

- [JUnit 5 — guía de usuario](https://junit.org/junit5/docs/current/user-guide/)

JUnit es una referencia útil para proyectos Java que escriben resultados en formatos compatibles con herramientas de CI.

### Cobertura

Herramientas de cobertura pueden producir informes sobre qué partes del código ejecutan las pruebas.

Entre los recursos que pueden resultar pertinentes:

- [JaCoCo](https://www.jacoco.org/jacoco/)
- [coverage.py](https://coverage.readthedocs.io/)

Comprueba:

- Versión.
- Formato del reporte.
- Configuración.
- Límites de interpretación.

Una cobertura alta no demuestra por sí sola la calidad de las pruebas.

### Informes de pruebas

Jenkins puede integrar informes de pruebas mediante funciones del core o plugins.

Antes de publicar un reporte, comprueba:

- Formato de entrada.
- Plugin requerido.
- Ruta del archivo.
- Retención.
- Visibilidad.
- Datos expuestos.

No publiques resultados de proyectos privados en jobs visibles para todo el curso.

### Pruebas de integración

Las pruebas de integración pueden requerir:

- Servicios auxiliares.
- Datos de prueba.
- Red.
- Puertos.
- Bases de datos.
- Tiempo de ejecución.
- Limpieza.

Durante el curso, utiliza solo los servicios efímeros preparados por el docente.

### Fallos de pruebas

Distingue entre:

- Error al compilar.
- Error al descubrir tests.
- Test fallido.
- Test omitido.
- Timeout.
- Error de infraestructura.

El código de salida por sí solo puede no explicar la causa.

---

## Recursos de artefactos y registros

Un artefacto es un archivo producido o conservado por un proceso de build.

### Artefactos de Jenkins

La documentación de Jenkins explica cómo registrar artefactos desde una Pipeline.

Un artefacto de laboratorio puede ser:

- Un archivo de texto.
- Un paquete de ejemplo.
- Un informe de prueba ficticio.
- Un resultado generado localmente.

### Retención

Antes de conservar artefactos, decide:

- Qué archivos hacen falta.
- Cuánto tiempo se conservan.
- Quién puede descargarlos.
- Si contienen datos internos.
- Si deben eliminarse al terminar el curso.

### Repositorios de artefactos

Algunas organizaciones utilizan repositorios especializados para paquetes e imágenes.

Ejemplos de proyectos y productos incluyen:

- Sonatype Nexus Repository.
- JFrog Artifactory.
- GitHub Packages.
- GitLab Package Registry.

Consulta siempre la documentación de la versión y del producto utilizados.

No publiques paquetes en un repositorio externo sin autorización.

### Imágenes de contenedor

Una imagen puede almacenarse en un registro.

Antes de publicar una imagen de laboratorio, comprueba:

- Nombre y etiqueta.
- Registry de destino.
- Contenido.
- Secretos incluidos en capas.
- Arquitectura.
- Política de retención.
- Permisos de descarga.

### Versionado

Evita depender solo de una etiqueta mutable como `latest` en procesos que deban ser reproducibles.

Documenta cómo se identifica la versión o el digest de una imagen cuando sea pertinente.

### Logs y artefactos

Una consola y un artefacto tienen distintos usos:

- El log ayuda a comprender la ejecución.
- El artefacto contiene una salida generada.
- Ambos pueden contener información sensible.
- Ninguno debe conservarse más de lo necesario sin motivo.

---

## Recursos de contenedores y entornos

Los contenedores pueden aportar entornos de ejecución, pero no eliminan los riesgos de acceso y configuración.

### Docker

- [Documentación de Docker](https://docs.docker.com/)

Consulta recursos sobre:

- Imágenes.
- Contenedores.
- Dockerfile.
- Volúmenes.
- Redes.
- Compose.
- Seguridad.
- Registros.

No montes rutas sensibles del host en un contenedor de práctica.

### Podman

- [Documentación de Podman](https://docs.podman.io/)

Podman ofrece documentación para ejecutar contenedores y administrar imágenes.

Comprueba compatibilidad del agent antes de adaptar un ejemplo de Docker.

### Kubernetes

- [Documentación oficial de Kubernetes](https://kubernetes.io/docs/home/)

Kubernetes es un sistema de orquestación de contenedores, distinto de Jenkins.

Jenkins puede invocar herramientas de Kubernetes mediante agentes, plugins o scripts, según la arquitectura.

No ejecutes comandos de administración contra un cluster real durante la introducción.

### Entornos efímeros

Un entorno efímero puede ser:

- Un contenedor temporal.
- Una máquina virtual de curso.
- Un agent desechable.
- Un workspace aislado.
- Un namespace de laboratorio.

Comprueba qué se conserva después de una ejecución y qué se elimina.

### Imágenes base

Al utilizar imágenes:

- Comprueba el origen.
- Comprueba quién las mantiene.
- Comprueba la versión.
- Revisa las capas.
- Evita incluir secretos.
- Actualiza de forma controlada.
- No uses una imagen no confiable en un agent con credenciales.

### Docker-in-Docker

Algunos tutoriales utilizan Docker-in-Docker.

Ese patrón cambia el modelo de seguridad del agent.

No lo configures como ejercicio sin un entorno aislado y la autorización del docente.

---

## Recursos de calidad, seguridad y cadena de suministro

La automatización es también una oportunidad para incorporar controles de calidad y seguridad.

### Análisis estático

El análisis estático examina código sin ejecutarlo como una aplicación completa.

Herramientas frecuentes incluyen:

- SonarQube.
- Semgrep.
- linters del lenguaje.
- analizadores propios del proyecto.

Consulta la documentación oficial de la herramienta concreta y del plugin Jenkins que la integra.

### SonarQube

- [Documentación de SonarQube](https://docs.sonarsource.com/sonarqube-server/)

Antes de integrar un análisis:

- Comprueba versión.
- Comprueba licencia y edición, si aplica.
- Comprueba plugin o scanner.
- Comprueba endpoint del laboratorio.
- Evita enviar código a un servicio externo sin autorización.

### Análisis de dependencias

Los gestores de dependencias pueden ofrecer auditoría o integración con herramientas de seguridad.

Comprueba:

- Fuente de datos.
- Umbral de severidad.
- Política de fallo.
- Falsos positivos.
- Frecuencia de actualización.
- Destino de los informes.

### Secretos

La detección de secretos puede ayudar a encontrar credenciales expuestas.

No subas un repositorio con credenciales reales para “probar” un detector.

Utiliza muestras ficticias preparadas por el docente.

### OWASP

- [OWASP — documentación y proyectos](https://owasp.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

OWASP ofrece recursos para aprender riesgos de seguridad de aplicaciones.

Sus listas son material de referencia, no una garantía de que una aplicación sea segura si pasa un análisis.

### OWASP Dependency-Check

- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)

Consulta la documentación del proyecto antes de integrarlo.

Comprueba:

- Requisitos.
- Fuentes de vulnerabilidades.
- Frecuencia de actualización.
- Formato de salida.
- Umbral de fallo.
- Tiempo de análisis.

### SBOM

Una SBOM es una lista estructurada de componentes de software.

Recursos de referencia:

- [CycloneDX](https://cyclonedx.org/)
- [SPDX](https://spdx.dev/)

Comprueba el formato, la herramienta generadora y el uso previsto antes de incorporar una SBOM a un job.

### Procedencia y firma

Recursos de cadena de suministro incluyen:

- [SLSA](https://slsa.dev/)
- [Sigstore](https://www.sigstore.dev/)

Estos proyectos describen conceptos y herramientas para mejorar procedencia, firma y verificación.

No supongas que una firma por sí sola demuestra que un artefacto es seguro.

### Seguridad de Jenkins

Antes de diseñar integraciones, revisa:

- Cómo se almacenan credenciales.
- Qué jobs pueden acceder a ellas.
- Qué agentes ejecutan el código.
- Quién puede cambiar el `Jenkinsfile`.
- Qué logs se conservan.
- Qué plugins se mantienen.
- Cómo se actualiza Jenkins.

---

## Recursos para agents e infraestructura de ejecución

El agent determina el entorno donde se ejecutan muchas instrucciones de Pipeline.

### Sistemas operativos

Consulta documentación del sistema operativo utilizado por el agent.

Recursos comunes:

- [Ubuntu Server](https://ubuntu.com/server/docs)
- [Debian Administrator’s Handbook](https://www.debian.org/doc/)
- [Red Hat Enterprise Linux documentation](https://docs.redhat.com/)
- [Microsoft Learn](https://learn.microsoft.com/)

No asumas que un comando de Linux funciona igual en Windows o macOS.

### Java

- [Documentación de Java](https://docs.oracle.com/en/java/)
- [OpenJDK](https://openjdk.org/)

La versión de Java necesaria depende de Jenkins, del plugin y del proyecto.

Comprueba por separado:

- Java del controller.
- Java del agent.
- Java usado por la aplicación.
- Java requerido por la herramienta de build.

### SSH

- [OpenSSH](https://www.openssh.com/manual.html)

SSH puede utilizarse para conexiones entre sistemas.

En el curso, no configures claves personales ni permitas accesos no autorizados.

### Labels y executors

Consulta la documentación de Jenkins sobre nodes y agents para entender:

- Labels.
- Executors.
- Nodos.
- Workspaces.
- Canales de conexión.
- Disponibilidad.

### Aislamiento de agentes

Un agent debe contar con:

- Herramientas necesarias.
- Permisos mínimos.
- Acceso limitado a credenciales.
- Workspace controlado.
- Red adecuada.
- Procedimiento de actualización.

Un agent compartido puede ejecutar jobs de usuarios distintos. El aislamiento y la autorización son esenciales.

### Herramientas instaladas

Antes de utilizar `mvn`, `gradle`, `node`, `docker` o `kubectl`, comprueba:

- Que la herramienta existe en el agent.
- Qué versión tiene.
- Si el curso permite su uso.
- Si el job puede acceder al servicio requerido.
- Qué datos puede modificar.

### Variables del sistema

Las variables de entorno pueden contener configuración interna.

No imprimas todas las variables del agent en la consola.

---

## Recursos de observabilidad y diagnóstico

Para resolver un fallo, recopila información suficiente sin divulgar información sensible.

### Console output

La consola de una build muestra la salida de los steps.

Úsala para identificar:

- Stage activo.
- Step fallido.
- Comando ejecutado.
- Código de salida.
- Mensajes de error.
- Tiempo de ejecución.

No compartas la consola completa sin revisión.

### Logs de Jenkins

Los logs del controller pueden ayudar a diagnosticar problemas administrativos.

Su acceso suele estar limitado.

El alumnado debe utilizar solo los logs que el docente autorice.

### Métricas

Las métricas pueden ayudar a observar:

- Uso de executors.
- Colas.
- Duración de builds.
- Estado de agents.
- Recursos del controller.

La disponibilidad depende de la configuración y de los plugins instalados.

### Alertas

Una alerta puede señalar problemas de:

- Disponibilidad.
- Saturación.
- Errores repetidos.
- Fallos de agentes.
- Capacidad de disco.

No cambies reglas de alertas en el laboratorio salvo instrucción expresa.

### Diagnóstico de Pipeline

Al diagnosticar, registra:

- Job.
- Build number.
- Stage.
- Step.
- Agent.
- Versión.
- Error relevante.
- Resultado esperado.
- Resultado observado.

Evita registrar tokens, cookies, claves, rutas privadas o variables completas.

### Separar error de aplicación y error de CI

Una Pipeline puede fallar por:

- Un bug del código.
- Un test fallido.
- Una dependencia no disponible.
- Un agent desconectado.
- Un permiso insuficiente.
- Una herramienta ausente.
- Un error de configuración del job.
- Un problema del controller.

Identificar la categoría evita cambiar la parte equivocada.

---

## Recursos de aprendizaje y comunidad

Los recursos de comunidad complementan la documentación oficial.

### Tutoriales

Los tutoriales son útiles para seguir un proceso guiado.

Antes de usar uno:

- Comprueba fecha y versión.
- Identifica qué plugins requiere.
- Revisa los comandos.
- Comprueba dónde se ejecuta.
- Busca la referencia oficial de cada step.
- Utiliza un repositorio de práctica.

### Comunidad Jenkins

- [Participar en la comunidad Jenkins](https://www.jenkins.io/participate/)
- [Jenkins en GitHub](https://github.com/jenkinsci)

La comunidad puede ayudar a aclarar conceptos y descubrir problemas conocidos.

No publiques información confidencial al solicitar ayuda.

### Repositorios de ejemplo

Los repositorios de ejemplo pueden enseñar estructura y convenciones.

Comprueba:

- Mantenedor.
- Licencia.
- Actividad.
- Requisitos.
- Historial.
- Dependencias.
- Uso de credenciales.
- Scripts descargados.

### Cursos y ejercicios

Un curso bien diseñado incluye:

- Objetivos claros.
- Entorno aislado.
- Versiones registradas.
- Ejemplos reproducibles.
- Datos ficticios.
- Ejercicios de diagnóstico.
- Reglas de seguridad.
- Criterios de evaluación.

### Preguntar en comunidad

Al preparar una pregunta:

- Describe el objetivo.
- Indica versiones pertinentes.
- Incluye un ejemplo mínimo.
- Elimina secretos.
- Elimina URLs privadas.
- No publiques configuraciones completas.
- Indica qué documentación ya consultaste.
- Formula una pregunta concreta.

---

## Cómo evaluar un recurso externo

No todos los tutoriales son igualmente fiables o seguros.

### Autoridad

Comprueba:

- Quién escribió el recurso.
- Si es documentación oficial.
- Si el autor mantiene el proyecto.
- Si la página enlaza a fuentes primarias.
- Si el contenido está respaldado por notas de versión.

### Versión

Comprueba:

- Fecha de publicación.
- Fecha de actualización.
- Versión de Jenkins.
- Versión de plugins.
- Sistema operativo.
- Herramientas externas.
- Sintaxis vigente.

### Supuestos ocultos

Busca requisitos que el tutorial podría dar por sentados:

- Permisos administrativos.
- Credenciales.
- Plugins.
- Red abierta.
- Herramientas globales.
- Privilegios del agent.
- Un repositorio público.
- Un servicio externo.

### Comandos

Antes de ejecutar un comando:

- Lee cada argumento.
- Comprueba si descarga contenido.
- Comprueba si borra archivos.
- Comprueba si modifica configuración.
- Comprueba si usa `sudo` o equivalente.
- Comprueba si envía datos fuera del equipo.
- Prueba en el entorno autorizado.

### Código de Pipeline

Revisa:

- `sh` y `bat`.
- Lectura de credenciales.
- Variables interpoladas.
- Rutas de workspace.
- Publicación de artefactos.
- Acceso a red.
- Agent seleccionado.
- Acciones de `post`.

### Probar con datos ficticios

Utiliza:

- Repositorio de ejemplo del curso.
- Mensajes inocuos.
- Archivos temporales.
- Credenciales ficticias, si el ejercicio las simula.
- Entorno sin acceso a producción.

### Decidir si el recurso es adecuado

Un recurso es más confiable cuando:

- Es oficial o está respaldado por el proyecto.
- Está actualizado.
- Identifica sus versiones.
- Explica requisitos.
- Incluye advertencias.
- Se puede verificar.
- No pide secretos innecesarios.
- No oculta el efecto de los comandos.

---

## Sesiones prácticas

Las prácticas convierten el catálogo en una herramienta de aprendizaje y consulta.

### Preparación común

Antes de cada sesión:

- Confirma que trabajas en el entorno del curso.
- Anota la versión de Jenkins cuando corresponda.
- Usa repositorios y jobs de práctica.
- No añadas credenciales reales.
- No instales plugins sin autorización.
- Revisa los comandos antes de ejecutarlos.
- Guarda referencias y resultados no sensibles.
- Pregunta al docente si un recurso requiere permisos administrativos.

### Sesión 1: crear un mapa de recursos

**Objetivo:** relacionar preguntas comunes con fuentes adecuadas.

Pasos:

1. Copia los títulos principales del catálogo.
2. Asocia cada tema con un enlace.
3. Identifica si el enlace es documentación de Jenkins o de otra herramienta.
4. Marca qué recursos son oficiales.
5. Anota qué páginas dependen de versión.
6. Presenta un mapa de consulta breve.

Preguntas:

- ¿Dónde buscarías la sintaxis de `Jenkinsfile`?
- ¿Dónde buscarías un parámetro de Maven?
- ¿Dónde buscarías la compatibilidad de un plugin?
- ¿Dónde buscarías un riesgo de credenciales?

### Sesión 2: investigar una pregunta de Pipeline

**Objetivo:** responder usando una fuente primaria.

El docente propone una pregunta, por ejemplo:

```text
¿Cómo se define una etapa en Declarative Pipeline?
```

Pasos:

1. Escribe la pregunta con precisión.
2. Abre la referencia de Pipeline.
3. Identifica la sección pertinente.
4. Anota la sintaxis relevante.
5. Comprueba si el ejemplo utiliza plugins.
6. Resume con tus palabras.
7. Añade el enlace y la versión consultada.

### Sesión 3: practicar Git y Jenkins

**Objetivo:** entender la relación entre cambios de código y una build.

Pasos:

1. Usa un repositorio de curso.
2. Ejecuta `git status`.
3. Revisa `git diff`.
4. Identifica el commit actual.
5. Abre el job de práctica.
6. Ejecuta el Pipeline que indique el docente.
7. Comprueba qué revisión del repositorio se utilizó.
8. No cambies remotos ni ramas protegidas.

### Sesión 4: ejecutar una build local de laboratorio

**Objetivo:** observar stages sin publicar ni desplegar.

Usa el siguiente Pipeline si el entorno está preparado:

```groovy
pipeline {
    agent any

    stages {
        stage('Preparar') {
            steps {
                echo 'Preparacion de laboratorio.'
            }
        }

        stage('Construir') {
            steps {
                echo 'Build simulada; no se publica ningun artefacto.'
            }
        }

        stage('Verificar') {
            steps {
                echo 'Verificacion local completada.'
            }
        }
    }
}
```

Pasos:

1. Lee el archivo.
2. Identifica el agent.
3. Identifica las etapas.
4. Ejecuta en el job de curso.
5. Revisa el console output.
6. Anota duración y resultado.
7. Comprueba que no hubo acceso externo.

### Sesión 5: investigar Maven o Gradle

**Objetivo:** identificar qué parte corresponde a Jenkins y cuál al build tool.

Pasos:

1. El docente asigna Maven o Gradle.
2. Abre su documentación oficial.
3. Localiza el comando de test recomendado.
4. Identifica versión y wrapper del proyecto.
5. Compara con los pasos del `Jenkinsfile`.
6. No ejecutes descargas o builds fuera del laboratorio.
7. Describe las responsabilidades de cada herramienta.

### Sesión 6: publicar un informe de pruebas de ejemplo

**Objetivo:** reconocer la relación entre una salida de test y Jenkins.

Pasos:

1. Usa un proyecto de ejemplo preparado por el docente.
2. Identifica el archivo de reporte.
3. Consulta la documentación del formato.
4. Consulta la función o plugin de Jenkins indicado.
5. Ejecuta el job en el entorno autorizado.
6. Comprueba el resultado visible.
7. No subas informes con datos de proyectos reales.

### Sesión 7: revisar dependencias

**Objetivo:** encontrar la documentación del gestor de paquetes.

Pasos:

1. Identifica el gestor del proyecto.
2. Localiza su documentación oficial.
3. Identifica cómo se declara una dependencia.
4. Comprueba cómo se fija una versión.
5. Investiga el formato del archivo lock, si aplica.
6. Describe qué riesgo existe con dependencias no verificadas.
7. No actualices dependencias en un proyecto compartido.

### Sesión 8: analizar un fallo de build

**Objetivo:** separar fallo de código y fallo de infraestructura.

El docente proporciona un log ficticio.

Pasos:

1. Identifica el stage.
2. Identifica el step.
3. Encuentra el primer error relevante.
4. Comprueba la herramienta implicada.
5. Consulta su documentación oficial.
6. Formula una hipótesis.
7. Propón una comprobación segura.
8. No pegues el log completo en una web pública.

### Sesión 9: evaluar un plugin

**Objetivo:** practicar revisión de dependencias.

Pasos:

1. Selecciona un plugin indicado por el docente.
2. Abre su página oficial.
3. Anota la versión disponible.
4. Anota la versión mínima de Jenkins.
5. Revisa dependencias.
6. Revisa estado de mantenimiento.
7. Busca avisos de seguridad.
8. No instales ni actualices el plugin.

Entrega una recomendación razonada para el administrador.

### Sesión 10: investigar un agent

**Objetivo:** descubrir qué entorno ejecutó una tarea.

Pasos:

1. Revisa la guía de nodes y agents.
2. Identifica el label del job de práctica.
3. Pregunta al docente qué herramientas tiene el agent.
4. Identifica sistema operativo y arquitectura, si es necesario.
5. No consultes datos administrativos restringidos.
6. Describe por qué el entorno del agent importa.

### Sesión 11: analizar credenciales de forma teórica

**Objetivo:** comprender el sistema sin crear secretos.

Pasos:

1. Lee la guía oficial de credenciales.
2. Identifica los tipos de credencial.
3. Lee cómo se referencian desde Pipeline.
4. Anota qué riesgos tiene imprimir una variable.
5. Explica el alcance mínimo de una credencial.
6. No crees una credencial personal.
7. No imprimas valores en consola.

### Sesión 12: buscar una función de seguridad

**Objetivo:** aplicar el catálogo a un tema de seguridad.

El docente asigna un tema:

- Permisos de job.
- Builds de pull requests.
- Protección de agentes.
- Gestión de plugins.
- Protección de credenciales.
- Actualizaciones de Jenkins.

Pasos:

1. Localiza la documentación oficial.
2. Identifica el riesgo que aborda.
3. Resume una recomendación.
4. Comprueba si depende de versión o configuración.
5. Compara con las reglas del curso.
6. No cambies la configuración del controller.

### Sesión 13: revisar el console output

**Objetivo:** compartir evidencia sin divulgar información.

Pasos:

1. Abre la salida de una build propia.
2. Identifica una línea útil para el diagnóstico.
3. Identifica una ruta o dato que convendría ocultar.
4. Redacta un resumen mínimo.
5. Comprueba que no aparecen secretos.
6. Presenta el resumen, no el log completo.

### Sesión 14: comparar tutorial y documentación oficial

**Objetivo:** reconocer diferencias de contexto.

Pasos:

1. El docente proporciona un tutorial de terceros.
2. Comprueba fecha y versión.
3. Identifica plugins y herramientas requeridos.
4. Busca la referencia oficial equivalente.
5. Compara sintaxis y requisitos.
6. Identifica un supuesto oculto.
7. Explica si ejecutarías el ejemplo tal como aparece.

### Sesión 15: crear una ficha de recurso

**Objetivo:** preparar una referencia útil para otra persona.

Completa:

```text
Tema:
Pregunta:
Recurso:
Autor o mantenedor:
URL:
Versión:
Requisitos:
Resumen:
Ejemplo relevante:
Precauciones:
Prueba realizada:
Resultado:
Fecha de consulta:
```

### Sesión 16: comprobar una versión de plugin

**Objetivo:** vincular Jenkins core y plugin.

Pasos:

1. Identifica el plugin de laboratorio.
2. Consulta la versión instalada mediante el método autorizado.
3. Abre la página oficial del plugin.
4. Comprueba requisitos.
5. Comprueba si el step del Pipeline depende del plugin.
6. Anota posibles incompatibilidades.
7. No cambies la versión instalada.

### Sesión 17: analizar un Pipeline sospechoso

**Objetivo:** identificar efectos antes de ejecutar.

El docente proporciona un `Jenkinsfile` de análisis.

Busca:

- Descargas externas.
- Comandos shell.
- Uso de credenciales.
- Publicación de archivos.
- Selección de agent.
- Variables interpoladas.
- Operaciones de limpieza.
- Acceso a red.
- `post` actions.

Clasifica las acciones por riesgo y justifica tu evaluación.

No ejecutes el archivo.

### Sesión 18: construir un Pipeline de diagnóstico

**Objetivo:** crear una build simple y segura.

Requisitos:

- Un agent de laboratorio.
- Dos stages.
- Mensajes inocuos.
- Sin credenciales.
- Sin shell.
- Sin publicación.
- Sin acceso a red.
- Nombres de etapas descriptivos.

Después:

1. Ejecuta en el job de práctica.
2. Revisa el gráfico de stages.
3. Revisa la consola.
4. Registra la versión.
5. Entrega el `Jenkinsfile`.

### Sesión 19: investigar una build lenta

**Objetivo:** formular hipótesis a partir de evidencias.

Pasos:

1. El docente proporciona datos ficticios de duración.
2. Separa tiempo en cola de tiempo de ejecución.
3. Identifica stages lentos.
4. Consulta qué información registra Jenkins.
5. Propón una métrica que ayudaría a investigar.
6. No alteres el número de executors.
7. No cambies la configuración del controller.

### Sesión 20: revisar artefactos

**Objetivo:** valorar contenido y retención.

Pasos:

1. Inspecciona artefactos ficticios de una build de curso.
2. Identifica su propósito.
3. Comprueba si contienen información sensible.
4. Identifica quién puede descargarlos.
5. Propón un periodo de retención para el ejercicio.
6. No publiques artefactos en un registry externo.

### Sesión 21: examinar una dependencia vulnerable ficticia

**Objetivo:** entender cómo se consume un informe de seguridad.

Pasos:

1. El docente entrega un informe ficticio.
2. Identifica dependencia y versión.
3. Consulta la documentación de la herramienta.
4. Distingue hallazgo, severidad y política de fallo.
5. Propón una verificación.
6. No descargues muestras de malware ni repositorios ajenos.

### Sesión 22: preparar una pregunta para la comunidad

**Objetivo:** aprender a solicitar ayuda sin filtrar información.

Redacta una consulta ficticia que incluya:

- Objetivo.
- Versión.
- Tipo de job.
- Step que falla.
- Error mínimo.
- Prueba realizada.
- Documentación consultada.

Asegúrate de eliminar:

- Hostnames internos.
- URLs privadas.
- Usuarios.
- Tokens.
- Cookies.
- Rutas personales.
- Logs completos.

### Sesión 23: comparar Jenkins con otra herramienta CI

**Objetivo:** reconocer similitudes y diferencias sin mezclar sintaxis.

El docente asigna una plataforma.

Compara:

- Archivo de configuración.
- Modelo de agentes.
- Plugins o extensiones.
- Gestión de secretos.
- Ejecución de stages.
- Trazabilidad.
- Gestión de artefactos.

Utiliza documentación oficial de ambas herramientas.

No copies YAML de una plataforma a un `Jenkinsfile` sin adaptación.

### Sesión 24: revisión por parejas

**Objetivo:** revisar las fuentes y la prueba de otra persona.

La persona autora explica:

- Qué pregunta investigó.
- Qué versión utilizó.
- Qué documentación consultó.
- Qué ejemplo probó.
- Qué resultado observó.
- Qué riesgos identificó.

La persona revisora comprueba:

- La fuente es adecuada.
- La versión está registrada.
- Los requisitos se han leído.
- La prueba se realizó en el entorno correcto.
- No hay credenciales.
- La conclusión no excede la evidencia.
- Los enlaces permiten reproducir la consulta.

### Sesión 25: proyecto integrador

**Objetivo:** producir un mapa de recursos para un flujo CI sencillo.

El proyecto debe contener:

- Un diagrama de flujo.
- Un `Jenkinsfile` de laboratorio.
- Una referencia oficial de Jenkins.
- Una referencia de Git.
- Una referencia del build tool, si se usa.
- Una referencia del framework de pruebas.
- Una referencia de seguridad.
- Versiones anotadas.
- Resultado de una build local.
- Precauciones.
- Instrucciones para repetir la práctica.
- Una nota sobre qué no debe usarse en producción.

---

## Buenas prácticas de estudio

Los recursos son más útiles cuando se relacionan con una pregunta y una prueba.

### Aprendizaje progresivo

Avanza en este orden:

1. Entender qué es un job.
2. Identificar controller y agent.
3. Leer un `Jenkinsfile`.
4. Ejecutar un Pipeline inocuo.
5. Consultar herramientas de build.
6. Publicar resultados de test.
7. Investigar plugins.
8. Estudiar credenciales y seguridad.
9. Analizar integración con artefactos.
10. Diseñar controles para un flujo más complejo.

### Notas reproducibles

Al tomar notas:

- Registra la versión.
- Incluye el comando exacto, si es seguro.
- Indica el agent usado.
- Indica el resultado esperado.
- Indica el resultado observado.
- Añade el enlace de referencia.
- Explica qué cambiaste.
- Aclara qué datos omitiste por seguridad.

### Evitar riesgos comunes

Evita:

- Ejecutar tutoriales completos sin revisión.
- Copiar scripts de Internet en un agent compartido.
- Imprimir todas las variables de entorno.
- Guardar contraseñas en el repositorio.
- Instalar plugins durante una sesión.
- Utilizar una credencial real para una demo.
- Compartir consolas completas.
- Confundir ejemplo de GitHub Actions con Jenkins Pipeline.
- Modificar agents para resolver un ejercicio.
- Publicar artefactos fuera del laboratorio.

### Preguntar con precisión

Una pregunta útil incluye:

- Objetivo.
- Herramienta.
- Versión.
- Contexto.
- Error mínimo.
- Pruebas realizadas.
- Fuente consultada.
- Resultado esperado.

### Mantener un índice personal

Puedes organizar notas así:

```text
notas/
├── jenkins/
├── pipeline/
├── git/
├── maven/
├── pruebas/
├── plugins/
└── seguridad/
```

No almacenes en las notas:

- Credenciales.
- Cookies.
- Tokens.
- Claves.
- Inventarios internos.
- URLs privadas.
- Datos de usuarios.

---

## Diagnóstico

Cuando un recurso no resuelve la duda, comprueba la fuente y el contexto.

### Enlace roto

Comprueba:

- Si el sitio cambió de ruta.
- Si la página se movió.
- Si el enlace apunta a una versión antigua.
- Si el tema pertenece a un plugin.
- Si existe una página nueva equivalente.

Navega desde el portal oficial antes de buscar copias de terceros.

### Documentación incompatible

Comprueba:

- Versión de Jenkins.
- Versión del plugin.
- Sistema operativo del agent.
- Versión de Java.
- Tipo de Pipeline.
- Plugins instalados.
- Permisos disponibles.

### Recurso sin mantenimiento

Busca:

- Fecha de actualización.
- Actividad del proyecto.
- Historial de cambios.
- Compatibilidad actual.
- Avisos de seguridad.
- Alternativas recomendadas.

### Tutorial que no funciona

Revisa:

- Supuestos.
- Plugins requeridos.
- Variables.
- Herramientas del agent.
- Permisos.
- Rutas.
- Versión.
- Sistema operativo.
- Códigos de salida.
- Acceso a red.

No añadas permisos o credenciales para forzar que un tutorial funcione.

### El job no encuentra una herramienta

Comprueba:

- Qué agent ejecuta el job.
- Si la herramienta está instalada.
- Qué versión está disponible.
- Si el Pipeline selecciona el label correcto.
- Si el entorno del curso permite usar esa herramienta.

### El plugin no aparece

Comprueba:

- Si está instalado.
- Si la interfaz oculta la función por permisos.
- Si el plugin es compatible.
- Si la función se llama de otra forma.
- Si Pipeline Syntax está mostrando contenido de esa instancia.

### Ficha de diagnóstico

```text
Pregunta:
Instancia:
Versión de Jenkins:
Plugin:
Versión del plugin:
Agent:
Recurso consultado:
Versión documentada:
Error no sensible:
Hipótesis:
Prueba realizada:
Resultado:
Acción siguiente autorizada:
```

No incluyas tokens, contraseñas, cookies, URLs privadas ni logs completos.

---

## Checklist

### Para elegir un recurso

- [ ] Sé qué pregunta intento resolver.
- [ ] Identifiqué qué producto o componente está implicado.
- [ ] Comprobé quién mantiene el recurso.
- [ ] Comprobé versión y requisitos.
- [ ] Encontré una referencia oficial equivalente.
- [ ] Identifiqué las dependencias.

### Para probar un ejemplo

- [ ] El job pertenece al laboratorio.
- [ ] El agent está autorizado.
- [ ] El código está leído y entendido.
- [ ] No hay credenciales reales.
- [ ] No hay operaciones no autorizadas.
- [ ] No se modifica configuración global.
- [ ] Los comandos son apropiados para el sistema del agent.
- [ ] La salida no contiene secretos.

### Para documentar

- [ ] La URL está registrada.
- [ ] La versión está anotada.
- [ ] La prueba está descrita.
- [ ] El resultado es reproducible.
- [ ] Las limitaciones están explicadas.
- [ ] La conclusión se basa en evidencia.
- [ ] Los datos internos están omitidos.

---

## Evaluación

La evaluación comprueba que el alumnado puede encontrar recursos y convertirlos en prácticas seguras.

### Evidencias mínimas

Entrega:

- Mapa de recursos oficiales.
- Versión de Jenkins del laboratorio.
- `Jenkinsfile` de práctica.
- Referencia de Pipeline.
- Referencia de Git o del sistema de repositorios.
- Referencia del build tool o framework, cuando se utilice.
- Resultado de una build inocua.
- Ficha de un recurso externo evaluado.
- Riesgos identificados.
- Instrucciones para repetir la práctica.

### Rúbrica

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Selección de fuentes | Usa una búsqueda genérica | Elige documentación pertinente | Contrasta fuentes y versiones |
| Comprensión | Copia ejemplos | Explica propósito y requisitos | Identifica supuestos y límites |
| Práctica | Ejecuta sin comprobar contexto | Usa el laboratorio de curso | Diseña una prueba aislada y reproducible |
| Seguridad | Expone datos o usa credenciales | Evita secretos y cambios globales | Analiza agents, plugins y builds no confiables |
| Diagnóstico | Repite tutoriales | Usa error y versión para investigar | Formula hipótesis y prueba con evidencia |
| Documentación | No registra fuentes | Incluye enlaces y resultados | Mantiene notas versionadas y verificables |
| Comunicación | Presenta logs completos | Comparte un resumen pertinente | Reduce la información y preserva el contexto |

### Preguntas de repaso

1. ¿Qué recurso consultarías para aprender Declarative Pipeline?
2. ¿Dónde buscarías la sintaxis de un plugin?
3. ¿Por qué Jenkins core y los plugins tienen versiones independientes?
4. ¿Qué debes revisar antes de seguir un tutorial?
5. ¿Qué diferencia hay entre un recurso oficial y uno comunitario?
6. ¿Por qué un ejemplo de GitHub Actions no se copia directamente a Jenkins?
7. ¿Qué papel tiene un agent?
8. ¿Qué datos puede revelar el console output?
9. ¿Por qué no se deben imprimir variables de entorno?
10. ¿Qué información debería incluir una pregunta técnica?
11. ¿Qué es un artefacto?
12. ¿Qué revisarías antes de usar una imagen de contenedor?
13. ¿Por qué una build reproducible requiere controlar versiones?
14. ¿Qué puede indicar un informe de pruebas?
15. ¿Qué debe comprobarse antes de instalar un plugin?
16. ¿Qué riesgos tiene un `Jenkinsfile` de una rama no confiable?
17. ¿Qué fuentes usarías para investigar una dependencia vulnerable?
18. ¿Qué diferencia hay entre una prueba de laboratorio y un despliegue real?
19. ¿Qué elementos registrarías para reproducir una build?
20. ¿Qué harías si el tutorial utiliza una versión distinta de Jenkins?

---

## Glosario

- **Jenkins:** servidor de automatización para coordinar builds, pruebas y otros jobs.
- **Jenkins core:** componente central de Jenkins.
- **Plugin:** extensión que añade funciones al servidor.
- **Job:** unidad de trabajo configurada en Jenkins.
- **Pipeline:** proceso automatizado compuesto por etapas y pasos.
- **`Jenkinsfile`:** archivo que describe una Pipeline.
- **Stage:** etapa que agrupa acciones relacionadas.
- **Step:** acción ejecutada dentro de una etapa.
- **Controller:** componente que coordina Jenkins y administra su configuración.
- **Agent:** entorno donde se ejecutan tareas.
- **Node:** máquina o entorno de ejecución asociado a Jenkins.
- **Executor:** capacidad de ejecución concurrente en un node.
- **Workspace:** directorio de trabajo asociado a una build.
- **Label:** etiqueta que permite seleccionar agents.
- **Build:** ejecución de un job o Pipeline.
- **Artefacto:** archivo generado o conservado por un proceso.
- **Repositorio:** sistema para almacenar y versionar código o paquetes.
- **Commit:** cambio registrado en Git.
- **Webhook:** notificación que un sistema envía a otro al ocurrir un evento.
- **Maven:** herramienta de build y gestión de dependencias para proyectos, comúnmente Java.
- **Gradle:** herramienta de automatización de build y gestión de dependencias.
- **npm:** herramienta de gestión de paquetes y scripts para el ecosistema Node.js.
- **JUnit:** framework de pruebas para Java.
- **Cobertura:** medida de qué partes del código ejecutan las pruebas.
- **SBOM:** lista estructurada de componentes de software.
- **Pipeline Shared Library:** biblioteca reutilizable para código de Pipeline.
- **Cadena de suministro de software:** procesos y componentes que intervienen en producir y distribuir software.
- **Reproducibilidad:** propiedad por la que el proceso puede repetirse con resultados consistentes.
- **Documentación primaria:** documentación publicada por el proyecto o mantenedor responsable.
- **Agent efímero:** agent temporal que se crea para una ejecución o un periodo limitado.

---

## Índice de enlaces

Los enlaces siguientes son puntos de partida. Confirma la ubicación, vigencia y versión antes de citarlos en material del curso.

### Jenkins

- [Documentación de Jenkins](https://www.jenkins.io/doc/)
- [Libro de usuario](https://www.jenkins.io/doc/book/)
- [Tutoriales](https://www.jenkins.io/doc/tutorials/)
- [Instalación](https://www.jenkins.io/doc/book/installing/)
- [Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [Sintaxis de Pipeline](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)
- [Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)
- [Administración](https://www.jenkins.io/doc/book/managing/)
- [Seguridad](https://www.jenkins.io/doc/book/security/)
- [Credenciales](https://www.jenkins.io/doc/book/using/using-credentials/)
- [Agents](https://www.jenkins.io/doc/book/using/using-agents/)
- [Plugins](https://plugins.jenkins.io/)
- [Descargas](https://www.jenkins.io/download/)
- [Notas de lanzamiento](https://www.jenkins.io/changelog/)
- [Comunidad](https://www.jenkins.io/participate/)

### Git y repositorios

- [Git](https://git-scm.com/doc)
- [Pro Git](https://git-scm.com/book/en/v2)
- [GitHub Docs](https://docs.github.com/)
- [GitLab Docs](https://docs.gitlab.com/)
- [Bitbucket Cloud Docs](https://support.atlassian.com/bitbucket-cloud/docs/)

### Build y lenguaje

- [Maven Guides](https://maven.apache.org/guides/)
- [Maven Plugins](https://maven.apache.org/plugins/)
- [Gradle User Manual](https://docs.gradle.org/current/userguide/userguide.html)
- [npm Docs](https://docs.npmjs.com/)
- [Node.js Docs](https://nodejs.org/docs/latest/api/)
- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [Java Documentation](https://docs.oracle.com/en/java/)
- [OpenJDK](https://openjdk.org/)

### Pruebas y calidad

- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [JaCoCo](https://www.jacoco.org/jacoco/)
- [coverage.py](https://coverage.readthedocs.io/)
- [SonarQube Documentation](https://docs.sonarsource.com/sonarqube-server/)
- [Semgrep Docs](https://semgrep.dev/docs/)

### Contenedores y plataformas

- [Docker Docs](https://docs.docker.com/)
- [Podman Docs](https://docs.podman.io/)
- [Kubernetes Docs](https://kubernetes.io/docs/home/)

### Seguridad y cadena de suministro

- [OWASP](https://owasp.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [CycloneDX](https://cyclonedx.org/)
- [SPDX](https://spdx.dev/)
- [SLSA](https://slsa.dev/)
- [Sigstore](https://www.sigstore.dev/)

---

## Plantillas de entrega

### Ficha de un recurso

```text
Tema:
Pregunta:
Herramienta:
Versión:
Título del recurso:
URL:
Autor o mantenedor:
Requisitos:
Resumen:
Ejemplo revisado:
Riesgos:
Prueba de laboratorio:
Resultado:
Fecha de consulta:
```

### Ficha de una build

```text
Job:
Build:
Repositorio de laboratorio:
Commit:
Versión de Jenkins:
Agent:
Stages:
Resultado:
Artefactos:
Referencia consultada:
Error no sensible:
Observaciones:
```

### Ficha de evaluación de tutorial

```text
Título:
Autor:
URL:
Fecha:
Versión de Jenkins:
Plugins:
Herramientas:
Permisos:
Credenciales:
Comandos con efectos:
Fuentes oficiales contrastadas:
Decisión:
Motivo:
```

### Plantilla de pregunta técnica

```text
Objetivo:
Versión:
Tipo de job:
Agent:
Stage o step:
Resultado esperado:
Resultado observado:
Fuente consultada:
Pruebas realizadas:
Error no sensible:
Pregunta concreta:
```

No adjuntes credenciales, cookies, tokens, claves, URLs privadas ni logs completos.

---

## Síntesis final

Los recursos útiles no son únicamente enlaces: son referencias que ayudan a comprender el contexto, verificar una versión y probar una solución con seguridad.

- Empieza por la documentación oficial de Jenkins.
- Consulta la documentación del plugin cuando una función proceda de un plugin.
- Usa la documentación del build tool para entender compilación y dependencias.
- Usa las referencias de pruebas para interpretar resultados.
- Comprueba el entorno del agent antes de ejecutar comandos.
- Evalúa tutoriales externos antes de seguirlos.
- Protege credenciales, logs, artefactos y repositorios.
- Prueba en un job de laboratorio.
- Registra versión, fuente y resultado.
- No confundas una build exitosa con una autorización para desplegar.