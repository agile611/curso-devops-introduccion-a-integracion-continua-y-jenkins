# SCM y Jenkinsfile

SCM (*Source Code Management*) es el sistema que registra y permite obtener las versiones del código fuente. Git es uno de los sistemas SCM más utilizados con Jenkins. Cuando el `Jenkinsfile` se guarda en un repositorio, Jenkins puede obtenerlo junto con el código y ejecutar las instrucciones asociadas a una rama o revisión.

Esta unidad explica cómo se relacionan SCM, Git, jobs de Jenkins y pipelines. Incluye prácticas para crear un repositorio de laboratorio, guardar un `Jenkinsfile`, configurar un job para obtenerlo desde SCM, revisar ramas y commits, y diagnosticar errores de checkout.

> **Uso seguro:** trabaja únicamente con repositorios, credenciales y servicios autorizados por el curso. Los ejemplos no despliegan software. No incluyas contraseñas, tokens ni claves privadas en el `Jenkinsfile`, las URLs, los scripts, los commits o los logs.

## Esquema de la página

- ## Conceptos fundamentales
  - ### Qué significa SCM
  - ### Git, repositorio, commit y rama
  - ### Relación entre SCM y Jenkins
  - ### Qué es un `Jenkinsfile`
- ## Formas de definir un pipeline
  - ### Pipeline escrito en la interfaz
  - ### Pipeline almacenado en SCM
  - ### Pipeline multibranch
  - ### Cuándo elegir cada opción
- ## Configurar el acceso a SCM
  - ### URL, ramas y rutas
  - ### Credenciales
  - ### Checkout y `checkout scm`
  - ### Webhooks y sondeo
- ## Ramas, cambios y revisiones
  - ### Rama principal y ramas de trabajo
  - ### Pull requests y solicitudes de cambios
  - ### Commit que ejecuta Jenkins
  - ### Changelog y checkout reproducible
- ## Seguridad y mantenimiento
  - ### Código no confiable
  - ### Protección de secretos
  - ### Acceso de lectura y escritura
  - ### Revisión del `Jenkinsfile`
- ## Sesiones prácticas
  - ### Crear el repositorio
  - ### Versionar el primer `Jenkinsfile`
  - ### Configurar un job desde SCM
  - ### Probar cambios de rama
  - ### Diagnosticar problemas
- ## Evaluación y referencia
  - ### Checklist de configuración
  - ### Preguntas de repaso
  - ### Ejercicios
  - ### Glosario y síntesis

## Conceptos fundamentales

SCM guarda el historial del código y permite recuperar una revisión concreta para construirla, probarla o revisarla.

### Qué significa SCM

SCM significa *Source Code Management* o gestión del código fuente.

Un sistema SCM permite:

- Guardar archivos del proyecto.
- Registrar cambios.
- Comparar versiones.
- Crear ramas.
- Combinar cambios.
- Revisar quién hizo cada cambio.
- Recuperar una revisión anterior.
- Compartir el trabajo entre personas y herramientas.

Git es un sistema de control de versiones distribuido muy común.

### SCM y Jenkins

Jenkins puede obtener código desde un sistema SCM para:

- Leer un `Jenkinsfile`.
- Descargar los archivos del proyecto.
- Ejecutar pruebas.
- Construir un paquete.
- Validar una rama.
- Comparar cambios.
- Asociar una ejecución a un commit.

SCM conserva el código y su historial.

Jenkins automatiza tareas sobre las revisiones que obtiene.

### Repositorio

Un repositorio contiene los archivos y el historial de un proyecto.

Puede alojarse:

- En un servicio de Git administrado.
- En un servidor interno.
- En una instancia educativa.
- En un equipo local para una práctica.
- En otro sistema compatible con Jenkins.

La URL y los permisos dependen de la plataforma.

### Commit

Un commit es un registro de cambios en Git.

Suele incluir:

- Un identificador único.
- Autoría.
- Fecha.
- Mensaje.
- Relación con commits anteriores.
- Cambios en archivos.

Jenkins debería permitir identificar qué commit procesó una ejecución.

### Rama

Una rama es una línea de desarrollo.

Se puede utilizar para:

- Desarrollar una funcionalidad.
- Corregir un defecto.
- Probar una modificación.
- Revisar una solicitud de cambios.
- Mantener versiones diferentes del proyecto.

La rama principal puede llamarse `main`, `master` u otro nombre definido por el repositorio.

No presupongas un nombre sin comprobarlo.

### Etiqueta Git

Una etiqueta Git puede señalar una versión o punto concreto del historial.

Las etiquetas suelen utilizarse para identificar:

- Versiones publicadas.
- Hitos.
- Candidatos de lanzamiento.
- Revisiones de referencia.

Una etiqueta Git no es lo mismo que una etiqueta de agente de Jenkins.

### Working tree y repositorio local

En Git, el *working tree* contiene los archivos que se editan.

El repositorio local contiene el historial y los metadatos de Git.

Un cambio puede estar:

- Sin guardar en el archivo.
- Modificado en el *working tree*.
- Preparado en el *staging area*.
- Registrado en un commit.
- Enviado al repositorio remoto.

Jenkins solo obtiene lo que está disponible en la revisión que descarga.

### Repositorio remoto

Un remoto es una referencia a otro repositorio Git.

Puede tener un nombre como `origin`, pero ese nombre es una convención.

El remoto puede apuntar a:

- Un servicio de Git.
- Un servidor interno.
- Un repositorio de laboratorio.
- Un repositorio espejo.

Comprueba siempre el remoto antes de enviar cambios.

### Relación entre commit y ejecución

Una ejecución de Jenkins debería asociarse a una revisión concreta.

La relación puede representarse así:

```text
Repositorio
    |
    +--> Rama: main
            |
            +--> Commit A
                    |
                    +--> Ejecución Jenkins #12
```

La rama indica la línea de desarrollo.

El commit identifica la revisión exacta procesada.

### Qué es un `Jenkinsfile`

Un `Jenkinsfile` es un archivo que contiene la definición de un pipeline.

Normalmente se guarda en la raíz del repositorio, aunque Jenkins puede configurarse para buscarlo en otra ruta.

Su nombre habitual es:

```text
Jenkinsfile
```

No suele llevar una extensión como `.txt`.

### El `Jenkinsfile` es parte del proyecto

Guardar el `Jenkinsfile` en SCM permite:

- Revisar sus cambios.
- Mantener un historial.
- Relacionar el pipeline con el código.
- Reutilizar el flujo en otras ramas.
- Recuperar una definición anterior.
- Revisar quién modificó una etapa.
- Someter la automatización a revisión de cambios.

### El `Jenkinsfile` es código ejecutable

Un `Jenkinsfile` puede indicar a Jenkins que:

- Ejecute comandos.
- Obtenga código.
- Lea o escriba archivos.
- Use herramientas del agente.
- Acceda a servicios autorizados.
- Consulte credenciales.
- Genere artefactos.

Revísalo antes de ejecutarlo, especialmente si procede de una rama o repositorio que no conoces.

### SCM no equivale a copia de seguridad completa

Git conserva versiones del código, pero no necesariamente:

- La configuración global de Jenkins.
- Las credenciales.
- La configuración de agentes.
- Los logs de cada ejecución.
- Los artefactos archivados.
- Los datos de otros sistemas.

Gestiona esos elementos de acuerdo con la política de la organización.

### SCM tampoco garantiza reproducibilidad

Tener un commit fijo ayuda, pero una ejecución puede depender de:

- Versiones de herramientas del agente.
- Dependencias externas.
- Imágenes que cambian.
- Servicios disponibles.
- Variables de entorno.
- Configuración de plugins.
- Datos externos.

Documenta las dependencias relevantes.

## Formas de definir un pipeline

Jenkins puede obtener la definición desde una interfaz o desde SCM.

### Pipeline escrito en la interfaz

Un job Pipeline puede permitir escribir el código directamente en Jenkins.

Ventajas:

- Es rápido para una demostración.
- No necesita un repositorio adicional.
- Puede ser útil para aprender la sintaxis básica.

Limitaciones:

- El cambio no queda necesariamente versionado con el proyecto.
- La revisión puede ser menos visible para el equipo.
- Es más difícil comparar versiones.
- Puede ser menos reproducible entre instancias.

### Pipeline desde SCM

Un job puede obtener un `Jenkinsfile` desde un repositorio.

Ventajas:

- El pipeline se versiona.
- Sus cambios se revisan con el código.
- El historial permite conocer quién cambió la automatización.
- Jenkins puede ejecutar una revisión concreta.
- El equipo puede proponer mejoras mediante cambios normales del repositorio.

### Diferencia entre código del job y pipeline desde SCM

En un job configurado para cargar desde SCM, Jenkins utiliza una configuración externa para encontrar el repositorio y el archivo del pipeline.

Esa configuración suele indicar:

- Tipo de SCM.
- URL.
- Credencial.
- Rama o especificación de ramas.
- Ruta del `Jenkinsfile`.

El pipeline obtenido puede realizar después su propio checkout de código, según la configuración y el tipo de job.

### Pipeline multibranch

Un job Multibranch Pipeline puede descubrir ramas que contienen un `Jenkinsfile`.

Jenkins puede crear una subejecución asociada a cada rama descubierta.

Según la integración y los plugins, también puede detectar solicitudes de cambios o pull requests.

### Cuándo elegir un pipeline normal

Un job Pipeline normal puede ser adecuado cuando:

- La rama a procesar está fijada.
- El flujo es sencillo.
- Se quiere configurar manualmente el repositorio.
- No se necesita descubrir muchas ramas automáticamente.
- El curso utiliza una configuración guiada.

### Cuándo elegir Multibranch Pipeline

Multibranch puede ser adecuado cuando:

- Varias ramas tienen un `Jenkinsfile`.
- Cada rama necesita validarse.
- Se desea descubrir ramas automáticamente.
- El repositorio utiliza solicitudes de cambios.
- Jenkins debe ejecutar el pipeline definido en cada rama.

La disponibilidad exacta depende de la versión, plugins y plataforma SCM.

### Job Pipeline normal frente a Multibranch

| Aspecto | Pipeline normal | Multibranch Pipeline |
|---|---|---|
| Selección de rama | Suele configurarse en el job | Jenkins descubre ramas elegibles |
| Job por rama | Normalmente se configura de forma manual | Jenkins puede crear subjobs de rama |
| `Jenkinsfile` | Ruta indicada en la configuración | Descubierto en las ramas |
| Uso habitual | Flujo fijo o sencillo | Varias ramas y cambios continuos |

La tabla es una orientación. La configuración real depende de la instancia.

### Recomendación para el laboratorio

Para las primeras sesiones, utiliza el tipo de job que indique el docente.

No cambies a Multibranch solo para experimentar en una instancia compartida.

Antes de crear un job, comprueba si ya existe uno preparado para el curso.

## Configurar el acceso a SCM

Jenkins necesita localizar el repositorio y tener permiso para leer los archivos requeridos.

### Datos de conexión

Una configuración SCM puede solicitar:

- Tipo de repositorio.
- URL.
- Credencial.
- Rama.
- Ruta del `Jenkinsfile`.
- Opciones de checkout.
- Extensiones o comportamientos adicionales.

Los nombres de los campos dependen de Jenkins y de los plugins instalados.

### URL del repositorio

La URL debe corresponder al repositorio autorizado.

Puede usar distintos protocolos o formatos, según la plataforma y la configuración.

Antes de guardar, comprueba:

- Que la URL apunta al proyecto correcto.
- Que no contiene credenciales.
- Que la rama existe.
- Que el agente puede acceder al servicio.
- Que estás utilizando la instancia adecuada.

### Nunca incrustar una credencial en la URL

Evita URLs con usuario y token embebidos.

Una credencial en una URL puede quedar expuesta en:

- La configuración del job.
- Logs.
- Mensajes de error.
- Historial de terminal.
- Capturas de pantalla.
- Exportaciones de configuración.

Utiliza el almacén de credenciales de Jenkins cuando sea necesario.

### Credenciales de lectura

Para obtener código de un repositorio privado, Jenkins puede necesitar una credencial de lectura.

Aplica el mínimo privilegio:

- Limita la credencial al repositorio necesario.
- Prefiere permisos de solo lectura para checkout.
- No reutilices una credencial personal sin autorización.
- No compartas la credencial entre jobs que no la necesitan.

### Credenciales SSH

Una credencial SSH puede utilizarse para acceder a un repositorio mediante SSH.

La clave privada debe guardarse en el mecanismo autorizado.

No la:

- Subas al repositorio.
- Pegues en el `Jenkinsfile`.
- Guardes en una descripción del job.
- Imprimas en la consola.
- Envías en un canal público.
- Reutilices para otros propósitos sin aprobación.

### Credenciales HTTPS

Una conexión HTTPS a un repositorio privado puede requerir un token o credencial gestionada.

No introduzcas el token:

- En la URL.
- En una línea de shell.
- En el `Jenkinsfile`.
- En un parámetro de texto.
- En un archivo versionado.

### Repositorio público

Un repositorio público puede permitir la lectura sin credenciales.

No supongas que el resto del entorno es público.

La escritura, las ramas protegidas y otros servicios pueden tener permisos distintos.

### Agente y conectividad a SCM

El controlador puede obtener el `Jenkinsfile`, mientras un agente puede realizar el checkout del proyecto, dependiendo de la configuración del job.

Comprueba qué componente realiza cada operación.

El agente puede necesitar conectividad propia al repositorio.

### Certificados y proxy

Un checkout puede fallar por:

- Certificado no confiable.
- Proxy incorrecto.
- DNS.
- VPN.
- Restricciones de red.
- URL incorrecta.
- Servicio remoto no disponible.

No desactives la validación de certificados para evitar el error.

Consulta al administrador del laboratorio.

### Rama configurada

La configuración puede incluir una rama específica o una expresión de ramas.

Comprueba:

- El nombre real de la rama.
- La sintaxis aceptada por el job.
- Si se trata de un job normal o Multibranch.
- Si Jenkins utiliza una referencia o un commit.
- Si la rama tiene el `Jenkinsfile`.

### Ruta del `Jenkinsfile`

El archivo suele llamarse `Jenkinsfile` y estar en la raíz.

Si se encuentra en otra carpeta, Jenkins debe tener configurada la ruta correcta.

Comprueba:

- Mayúsculas y minúsculas.
- Directorio del repositorio.
- Ruta relativa.
- Nombre exacto.
- Commit que se está procesando.

### Monorepositorio

En un monorepositorio, varios proyectos pueden compartir un solo repositorio.

Los pipelines pueden estar en rutas como:

```text
servicios/api/Jenkinsfile
```

```text
apps/web/Jenkinsfile
```

La ruta debe apuntar al pipeline del proyecto correcto.

### `checkout scm`

En un pipeline multibranch o en ciertos jobs, `checkout scm` permite obtener la revisión asociada a la ejecución.

Ejemplo:

```groovy
checkout scm
```

El contexto `scm` es proporcionado por Jenkins en los tipos de job compatibles.

En otros tipos de job, puede ser necesario configurar el checkout de forma explícita.

### No duplicar checkout sin motivo

Si Jenkins ya obtiene el código para cargar el `Jenkinsfile`, un paso posterior puede necesitar o no un checkout separado del workspace del agente.

El comportamiento depende del tipo de job y su configuración.

Comprueba qué operación está ocurriendo antes de añadir otro checkout.

### Checkout explícito

Un checkout explícito puede indicar la configuración SCM dentro del pipeline, pero su sintaxis depende del plugin y la configuración.

Para prácticas introductorias, utiliza la forma recomendada por el docente.

### Workspace después del checkout

Después de un checkout, el código aparece en el workspace del agente donde se realizó.

Si una etapa posterior usa otro agente, no asumas que verá los mismos archivos.

Usa una estrategia explícita:

- Repetir el checkout de la misma revisión.
- Transferir archivos con `stash` y `unstash`.
- Archivar el resultado.
- Utilizar un almacenamiento aprobado.

## Ramas, cambios y revisiones

Las ramas permiten validar cambios sin modificar directamente la rama principal.

### Rama principal

La rama principal es la referencia que el equipo considera central para el desarrollo.

Su nombre depende del repositorio.

Debe tener:

- Una política de cambios.
- Revisiones apropiadas.
- Validaciones adecuadas.
- Protección de acceso, si la plataforma lo permite.

### Rama de trabajo

Una rama de trabajo puede contener cambios en desarrollo.

Un pipeline puede validar esa rama antes de que se integre.

La ejecución debería identificar:

- El nombre de la rama.
- El commit.
- El resultado.
- Los artefactos producidos.

### Pull request o solicitud de cambios

Una pull request, merge request o solicitud de cambios propone integrar una rama en otra.

La integración con Jenkins depende de la plataforma SCM y de sus plugins.

El pipeline puede validar:

- La rama propuesta.
- La comparación con la rama destino.
- El código resultante de una combinación temporal.
- Los metadatos de la solicitud.

Comprueba qué revisión exacta ejecuta Jenkins.

### Código no revisado

Una rama externa puede modificar el `Jenkinsfile` o los scripts.

Jenkins puede ejecutar esos cambios con los permisos disponibles para el job.

No expongas credenciales sensibles a código no revisado.

### Validación de ramas

Un pipeline de validación puede comprobar:

- Estructura.
- Formato.
- Pruebas.
- Compatibilidad.
- Reglas de calidad.
- Resultado de una construcción.

Una validación correcta no implica que el cambio deba publicarse automáticamente.

### Commit exacto

La rama puede cambiar entre la configuración y la ejecución.

El commit identifica la revisión exacta.

Registra el identificador de commit que aparece en la ejecución.

### Checkout reproducible

Para reproducir un resultado, se necesita conocer, como mínimo:

- Commit.
- Jenkinsfile utilizado.
- Agente.
- Versiones de herramientas.
- Dependencias.
- Parámetros.
- Configuración relevante.

La rama por sí sola puede no ser suficiente porque puede avanzar con el tiempo.

### Changelog

Jenkins o un plugin pueden mostrar cambios asociados a la ejecución.

El changelog puede ayudar a identificar:

- Commits nuevos.
- Autoría.
- Mensajes.
- Archivos modificados.

El detalle disponible depende de SCM, plugin y configuración.

### Tag de versión

Una etiqueta Git puede señalar una revisión que se desea conservar o identificar.

Un pipeline puede procesar etiquetas si está configurado para hacerlo.

No confundas un tag de Git con una etiqueta de agente.

### Branch specifier

Algunos tipos de job permiten configurar una especificación de rama.

La sintaxis depende del plugin SCM utilizado.

Comprueba la documentación de la versión y la configuración del job.

No uses expresiones copiadas de otro proveedor sin validar su significado.

## Disparadores desde SCM

Jenkins puede iniciar un pipeline cuando cambian los archivos del repositorio.

### Inicio manual

El inicio manual es adecuado para las primeras prácticas.

Permite controlar cuándo se ejecuta el job y revisar el resultado paso a paso.

### Webhook

Un webhook permite que el servicio Git notifique a Jenkins cuando ocurre un evento.

Puede informar de:

- Push.
- Creación de rama.
- Pull request.
- Actualización de solicitud de cambios.
- Otros eventos configurados.

La integración exacta depende del proveedor y los plugins.

### Sondeo de SCM

El sondeo consulta el repositorio de forma periódica para detectar cambios.

Puede ser más sencillo de comprender, pero genera consultas repetidas.

La frecuencia debe evitar carga innecesaria.

### Webhook frente a sondeo

| Aspecto | Webhook | Sondeo |
|---|---|---|
| Inicio | El servicio notifica el evento | Jenkins consulta periódicamente |
| Latencia | Suele ser baja | Depende de la frecuencia |
| Configuración | Requiere integración en el servicio | Requiere programación en Jenkins |
| Carga | Puede ser menor si está bien configurado | Puede generar consultas repetidas |
| Uso | Integraciones con eventos | Entornos donde webhook no está disponible |

La opción adecuada depende de la plataforma y de las reglas del entorno.

### Trigger y rama

Un evento puede iniciar una ejecución en una rama específica.

Comprueba:

- Qué ramas se consideran.
- Si las ramas están excluidas o incluidas.
- Si una solicitud de cambios crea una ejecución distinta.
- Qué commit se obtiene.
- Si se pueden iniciar ejecuciones duplicadas.

### Evitar ejecuciones duplicadas

Un push puede activar varios mecanismos de inicio si se configuran a la vez.

Revisa cómo interactúan:

- Webhook.
- Sondeo.
- Inicio manual.
- Trigger programado.
- Job que inicia otro job.

### Triggers en prácticas

No habilites webhooks en servicios compartidos sin autorización.

Para el laboratorio, utiliza el método preparado por el docente.

## Seguridad y mantenimiento

SCM y Jenkins comparten código, historial y permisos. La seguridad depende de cómo se conceden y utilizan esos accesos.

### Código no confiable

Un cambio de SCM puede modificar:

- `Jenkinsfile`.
- Scripts de shell.
- Dependencias.
- Configuración de pruebas.
- Archivos de construcción.

Ese cambio podría ejecutar instrucciones nuevas en el agente.

Inspecciona los cambios antes de darles acceso a credenciales o agentes privilegiados.

### Separar confianza y permisos

Considera separar:

- Código revisado.
- Cambios pendientes de revisión.
- Ramas de personas externas.
- Jobs con credenciales.
- Agentes de despliegue.
- Validaciones sin credenciales.

La separación reduce el impacto de un error o un cambio malicioso.

### Credenciales con alcance mínimo

Una credencial de checkout normalmente necesita permiso de lectura, no de administración.

Una credencial de escritura debe limitarse al job y repositorio que la requieran.

No otorgues acceso a producción por conveniencia.

### Protección de secretos en el pipeline

No guardes secretos en:

- `Jenkinsfile`.
- Variables versionadas.
- Scripts.
- Mensajes de consola.
- Archivos de configuración del proyecto.
- Commits.
- Tags.
- Parámetros de texto comunes.

Utiliza el almacén de credenciales aprobado.

### Secretos en el historial Git

Borrar un secreto del último commit no necesariamente lo elimina de todo el historial.

Si una credencial se confirma por error:

- Deja de compartir el repositorio o el commit afectado.
- Informa al responsable.
- Solicita revocar o rotar la credencial.
- Sigue el procedimiento de respuesta del entorno.
- No asumas que borrar el archivo resuelve la exposición.

### Acceso de lectura y escritura

Diferencia entre:

- Leer el repositorio.
- Escribir en una rama.
- Crear ramas.
- Crear etiquetas.
- Aprobar cambios.
- Administrar repositorios.

Un pipeline de validación normalmente no necesita escribir en el repositorio.

### `Jenkinsfile` de una rama

Un pipeline multibranch puede cargar el `Jenkinsfile` desde la misma rama que valida.

Esto permite que una rama proponga cambios al propio pipeline.

También significa que Jenkins puede ejecutar una definición modificada por esa rama.

### Revisión del `Jenkinsfile`

Revisa:

- Comandos.
- Agentes.
- Etiquetas.
- Credenciales.
- Rutas.
- Destinos.
- Condiciones.
- Operaciones destructivas.
- Cambios en el checkout.
- Scripts invocados.

### Permisos del job

Los usuarios que pueden modificar la configuración del job podrían cambiar:

- URL SCM.
- Rama.
- Credencial.
- Ruta del `Jenkinsfile`.
- Agente.
- Scripts.
- Triggers.

Limita esos permisos según la política del equipo.

### Protección de ramas

Las ramas protegidas pueden requerir revisión antes de aceptar cambios.

La política se configura en el proveedor SCM, no únicamente en el `Jenkinsfile`.

Jenkins puede aportar validación, pero no sustituye el control de acceso del repositorio.

### Red y certificados

El acceso a SCM puede requerir:

- DNS.
- Proxy.
- VPN.
- Certificados.
- Reglas de cortafuegos.
- Conectividad desde el controlador o agente.

No desactives TLS ni la verificación de certificados para resolver un fallo.

### Mantenimiento del repositorio

Mantén ordenados:

- El `Jenkinsfile`.
- Los scripts de apoyo.
- La documentación.
- Los archivos de configuración.
- Los recursos de prueba.
- Las exclusiones de Git.

Elimina archivos temporales y secretos accidentales mediante el procedimiento establecido.

## Sesiones prácticas para alumnos

Las sesiones utilizan un repositorio de laboratorio y no requieren credenciales de producción.

### Organización de las sesiones

Las actividades pueden realizarse individualmente o en parejas.

En parejas:

- Una persona ejecuta los comandos.
- Otra revisa el estado de Git.
- Ambas verifican el commit.
- Intercambian los roles en la actividad siguiente.

No compartas credenciales privadas con tu pareja.

El docente debe proporcionar el repositorio remoto y el método de autenticación, si hacen falta.

### Sesión 1: identificar estados de Git

**Objetivo:** distinguir archivos nuevos, cambios preparados y commits.

#### Crear un directorio

```bash
mkdir -p "$HOME/practicas-devops/scm-jenkinsfile"
cd "$HOME/practicas-devops/scm-jenkinsfile"
```

#### Crear archivos

```bash
mkdir -p app
printf 'Práctica SCM y Jenkinsfile\n' > app/mensaje.txt
```

#### Inicializar el repositorio local

```bash
git init
```

La configuración exacta puede variar según la versión de Git.

#### Consultar el estado

```bash
git status
```

#### Actividad

1. Identifica el archivo sin seguimiento.
2. Añádelo al área de preparación.
3. Vuelve a consultar el estado.
4. Crea un commit.
5. Vuelve a consultar el estado.
6. Registra el identificador corto del commit.

#### Comandos de ejemplo

```bash
git add app/mensaje.txt
```

```bash
git status
```

```bash
git commit -m "Añade mensaje de práctica"
```

```bash
git log -1 --oneline
```

#### Preguntas

- ¿Qué significa que un archivo esté sin seguimiento?
- ¿Qué cambia después de `git add`?
- ¿Qué registra el commit?
- ¿Qué identificador debe anotarse para una ejecución reproducible?

### Sesión 2: crear el primer `Jenkinsfile`

**Objetivo:** guardar un pipeline simple en el repositorio.

#### Crear el archivo

```bash
cat > Jenkinsfile <<'EOF'
pipeline {
    agent any

    stages {
        stage('Mensaje') {
            steps {
                echo 'Pipeline obtenido desde SCM'
            }
        }
    }
}
EOF
```

#### Revisar el archivo

```bash
cat Jenkinsfile
```

Comprueba:

- Nombre exacto.
- Llaves.
- Agente.
- Nombre de etapa.
- Mensaje.
- Ausencia de secretos.

#### Añadir el archivo a Git

```bash
git add Jenkinsfile
```

Consulta el cambio preparado:

```bash
git diff --cached
```

Crea un commit:

```bash
git commit -m "Añade Jenkinsfile inicial"
```

#### Entregable

Anota:

```text
Nombre del archivo:
Commit:
Mensaje del commit:
Etapa:
Mensaje de consola esperado:
```

### Sesión 3: configurar un job para obtener el pipeline desde SCM

**Objetivo:** comprender la relación entre un job y el repositorio.

#### Requisitos

- Repositorio remoto de laboratorio.
- Acceso de lectura.
- Job de práctica o permiso para crear uno.
- Agente disponible.

#### Antes de abrir la configuración

Confirma:

- URL exacta.
- Rama que se debe usar.
- Ruta del `Jenkinsfile`.
- Credencial aprobada, si aplica.
- Tipo de job indicado por el docente.

#### Configuración conceptual

La interfaz puede solicitar:

- Tipo de SCM.
- URL del repositorio.
- Credencial.
- Rama o especificación de ramas.
- Ruta del `Jenkinsfile`.

Los nombres de campos pueden variar.

No pegues un token en la URL.

#### Ejecutar

1. Guarda la configuración del job.
2. Inicia una ejecución manual.
3. Comprueba el checkout.
4. Comprueba qué revisión se obtuvo.
5. Confirma que se encontró el `Jenkinsfile`.
6. Abre la consola.
7. Registra el resultado.

#### Registro de la ejecución

```text
Job:
Ejecución:
Repositorio:
Rama configurada:
Commit obtenido:
Ruta del Jenkinsfile:
Agente:
Resultado:
```

#### Preguntas

- ¿Qué componente le indica a Jenkins dónde encontrar el pipeline?
- ¿Qué permisos necesitó el checkout?
- ¿Qué commit se ejecutó?
- ¿Qué evidencia confirma que Jenkins encontró el archivo?

### Sesión 4: modificar el `Jenkinsfile` y observar el commit

**Objetivo:** relacionar cambios versionados con ejecuciones.

#### Modificar el mensaje

Cambia el paso `echo` por:

```groovy
echo 'Segunda versión del pipeline'
```

#### Revisar la diferencia

```bash
git diff
```

Comprueba que solo aparece el cambio esperado.

#### Crear un commit

```bash
git add Jenkinsfile
```

```bash
git commit -m "Actualiza mensaje del pipeline"
```

#### Enviar el cambio

Usa únicamente el remoto autorizado y el comando indicado por el docente.

Antes de enviar, revisa:

```bash
git remote -v
```

No envíes cambios a un remoto desconocido.

#### Ejecutar otra vez

Comprueba:

- Que el job obtiene el nuevo commit.
- Que aparece el mensaje actualizado.
- Que el número de ejecución cambió.
- Que el commit procesado corresponde al cambio.

#### Preguntas

- ¿Qué diferencia hay entre editar y hacer commit?
- ¿Qué diferencia hay entre commit local y envío al remoto?
- ¿Qué mensaje apareció en la consola?
- ¿Qué dato demuestra que Jenkins ejecutó la nueva revisión?

### Sesión 5: localizar el `Jenkinsfile` en una subcarpeta

**Objetivo:** reconocer que Jenkins puede buscar el archivo en una ruta distinta de la raíz.

#### Estructura

```text
repositorio/
├── app/
└── ci/
    └── Jenkinsfile
```

#### Actividad

1. Crea una carpeta `ci`.
2. Mueve el `Jenkinsfile` a esa ruta.
3. Revisa el cambio con Git.
4. Comprueba la configuración del job.
5. Actualiza la ruta solo si el docente lo indica.
6. Ejecuta el pipeline.
7. Registra si Jenkins encuentra la definición.

#### Preguntas

- ¿Qué pasa si Jenkins busca `Jenkinsfile` en la raíz y no está allí?
- ¿Qué ruta utiliza la configuración?
- ¿La ruta se expresa desde tu equipo o desde el repositorio?
- ¿Qué información debe actualizarse en la documentación?

### Sesión 6: crear una rama de trabajo

**Objetivo:** comprender cómo una rama puede contener su propio `Jenkinsfile`.

#### Crear una rama

```bash
git switch -c practica/modificar-pipeline
```

Si la versión de Git no admite `git switch`, utiliza el procedimiento indicado por el docente.

#### Cambiar el pipeline

Modifica el nombre de la etapa:

```groovy
stage('Validación en rama de práctica') {
```

#### Revisar la rama y el cambio

```bash
git branch --show-current
```

```bash
git diff
```

#### Crear un commit

```bash
git add Jenkinsfile
```

```bash
git commit -m "Actualiza etapa en rama de práctica"
```

#### Actividad

Si el curso tiene un job Multibranch:

1. Espera al descubrimiento de la rama según el procedimiento.
2. Localiza el job asociado.
3. Confirma qué commit procesa.
4. Abre la consola.
5. Compara el nombre de la etapa.

Si el curso no tiene Multibranch, utiliza el mecanismo alternativo indicado por el docente.

### Sesión 7: comparar rama principal y rama de trabajo

**Objetivo:** observar cómo dos ramas pueden definir pipelines diferentes.

#### Comparar referencias

```bash
git log --oneline --graph --decorate --all
```

```bash
git diff main..practica/modificar-pipeline -- Jenkinsfile
```

El nombre `main` es ilustrativo; confirma la rama principal del repositorio.

#### Completar la tabla

| Dato | Rama principal | Rama de práctica |
|---|---|---|
| Commit | | |
| Nombre de etapa | | |
| Mensaje de consola | | |
| Resultado | | |
| Cambio respecto a la otra rama | | |

#### Preguntas

- ¿Qué versión del `Jenkinsfile` ejecuta cada job?
- ¿La rama de práctica cambia solo el mensaje o cambia la lógica?
- ¿Qué riesgos tiene ejecutar una definición no revisada?
- ¿Qué controles aplicarías antes de proporcionar credenciales?

### Sesión 8: revisar un checkout fallido

**Objetivo:** distinguir errores de SCM de errores del pipeline.

#### Escenario

El job falla antes de que aparezca la primera etapa.

El log muestra un error durante el checkout o al localizar el `Jenkinsfile`.

#### Revisar

- URL del repositorio.
- Credencial seleccionada.
- Rama configurada.
- Ruta del `Jenkinsfile`.
- Estado del servicio Git.
- Permiso de lectura.
- Conectividad.
- Certificados.
- Nombre exacto del archivo.

#### Informe

```text
Job:
Ejecución:
Etapa alcanzada:
URL revisada:
Rama revisada:
Ruta del Jenkinsfile:
Mensaje principal:
Hipótesis:
Comprobación siguiente:
```

No incluyas valores de credenciales.

### Sesión 9: revisar un checkout exitoso

**Objetivo:** identificar el commit y los cambios procesados.

#### Actividad

1. Abre una ejecución correcta.
2. Localiza los mensajes de checkout.
3. Anota rama y commit.
4. Revisa el changelog, si está disponible.
5. Compara el commit con Git.
6. Confirma que la consola corresponde al job esperado.

#### Preguntas

- ¿Qué identificador representa la revisión exacta?
- ¿Por qué el nombre de rama no es suficiente?
- ¿Qué información puede aportar el changelog?
- ¿Qué harías si la revisión no coincide con la esperada?

### Sesión 10: configurar un Multibranch Pipeline

Esta sesión solo se realiza si el docente ha preparado un repositorio de práctica y habilitado el tipo de job.

#### Requisitos

- Repositorio con más de una rama.
- `Jenkinsfile` en cada rama que se desea descubrir.
- Plugin o integración SCM disponible.
- Permiso para crear el job.

#### Actividad conceptual

1. Indica el repositorio.
2. Define la fuente de ramas según las instrucciones.
3. Revisa la ruta del `Jenkinsfile`.
4. Ejecuta el descubrimiento de ramas si está autorizado.
5. Comprueba los subjobs detectados.
6. Ejecuta una rama de práctica.
7. Relaciona la ejecución con el commit.

#### Preguntas

- ¿Qué condición puede impedir que una rama se descubra?
- ¿Qué ocurre si una rama no contiene un `Jenkinsfile`?
- ¿Cómo se relaciona cada subjob con una rama?
- ¿Qué consideración de seguridad aplica a ramas externas?

### Sesión 11: analizar una solicitud de cambios

**Objetivo:** comprender la validación de un cambio pendiente de integración.

Esta sesión puede realizarse con una simulación, captura o repositorio preparado por el docente.

#### Actividad

Identifica:

- Rama de origen.
- Rama destino.
- Commit probado.
- Job que ejecutó Jenkins.
- Resultado.
- Revisión humana requerida.
- Credenciales disponibles durante la ejecución.

#### Preguntas

- ¿Jenkins probó la rama de origen o una combinación temporal?
- ¿Qué revisión exacta se validó?
- ¿Puede el `Jenkinsfile` provenir de la rama propuesta?
- ¿Qué permisos deberían tener los jobs de cambios externos?

### Sesión 12: añadir una validación dependiente de SCM

**Objetivo:** verificar que el pipeline valida archivos del commit obtenido.

#### Crear el archivo

```bash
mkdir -p app
printf 'SCM y Jenkinsfile\n' > app/mensaje.txt
```

#### Crear el pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar checkout') {
            steps {
                sh 'test -f app/mensaje.txt'
            }
        }

        stage('Validar contenido') {
            steps {
                sh 'grep -q "Jenkinsfile" app/mensaje.txt'
            }
        }
    }

    post {
        success {
            echo 'La revisión obtenida pasó las comprobaciones.'
        }

        failure {
            echo 'La revisión obtenida no pasó las comprobaciones.'
        }
    }
}
```

#### Actividad

1. Confirma que el archivo está en el repositorio.
2. Confirma que el cambio está en un commit.
3. Envía el cambio al remoto de práctica.
4. Ejecuta Jenkins.
5. Comprueba el commit.
6. Revisa las dos etapas.
7. Registra el resultado.

#### Fallo controlado

Cambia el contenido para quitar `Jenkinsfile`.

Crea una revisión de práctica y ejecuta el pipeline.

Comprueba qué etapa falla y qué revisión procesó Jenkins.

### Sesión 13: detectar secretos antes del commit

**Objetivo:** revisar archivos antes de enviarlos a SCM.

#### Revisar el estado

```bash
git status
```

#### Revisar cambios

```bash
git diff
```

#### Revisar archivos preparados

```bash
git diff --cached
```

#### Buscar contenido sensible

Antes de confirmar, revisa manualmente:

- `Jenkinsfile`.
- Scripts.
- Archivos de configuración.
- Logs.
- Archivos temporales.
- Capturas.
- Parámetros de ejemplo.

No utilices credenciales reales en la práctica.

#### Si detectas un secreto

No lo envíes al remoto.

Si ya fue confirmado o compartido:

- Informa al responsable.
- Sigue el procedimiento de exposición de credenciales.
- No supongas que borrar el archivo elimina el secreto del historial.
- Solicita revocación o rotación cuando corresponda.

### Sesión 14: preparar un informe de ejecución

**Objetivo:** documentar una ejecución con suficiente detalle para reproducirla.

#### Plantilla

```text
Job:
Ejecución:
Repositorio:
Rama:
Commit:
Ruta del Jenkinsfile:
Agente:
Etapas:
Resultado:
Artefactos:
Mensaje de error, si aplica:
Cambios recientes:
```

#### Revisión de seguridad

Antes de entregar el informe:

- Elimina tokens.
- Oculta URLs internas no autorizadas.
- Evita datos personales innecesarios.
- Revisa capturas.
- Comparte solo fragmentos pertinentes de logs.

## Ejemplos de Jenkinsfile con SCM

Los ejemplos siguientes son orientativos y requieren una instancia correctamente configurada.

### Pipeline que usa el checkout del contexto SCM

```groovy
pipeline {
    agent any

    stages {
        stage('Obtener código') {
            steps {
                checkout scm
            }
        }

        stage('Comprobar archivos') {
            steps {
                sh 'test -f README.md'
                sh 'test -f Jenkinsfile'
            }
        }
    }
}
```

`checkout scm` funciona en contextos donde Jenkins proporciona la configuración SCM del job.

### Pipeline multibranch mínimo

```groovy
pipeline {
    agent any

    stages {
        stage('Identificar revisión') {
            steps {
                checkout scm
                sh 'git rev-parse --short HEAD'
                sh 'git status --short'
            }
        }
    }
}
```

Las operaciones de Git deben estar disponibles en el agente.

Evita imprimir configuraciones remotas que puedan contener información sensible.

### Pipeline con validación del contenido

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validar archivo') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'grep -q "Jenkins" app/mensaje.txt'
            }
        }
    }

    post {
        success {
            echo 'La revisión pasó la validación.'
        }

        failure {
            echo 'La revisión falló.'
        }
    }
}
```

### Pipeline con agente etiquetado

```groovy
pipeline {
    agent {
        label 'linux-scm-laboratorio'
    }

    stages {
        stage('Obtener código') {
            steps {
                checkout scm
            }
        }

        stage('Validar') {
            steps {
                sh 'test -f README.md'
            }
        }
    }
}
```

La etiqueta es un ejemplo.

Utiliza la etiqueta proporcionada por el docente.

### Pipeline con dos agentes y mismo código

```groovy
pipeline {
    agent none

    stages {
        stage('Validar en Linux') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                checkout scm
                sh 'test -f README.md'
            }
        }

        stage('Validar en otro agente') {
            agent {
                label 'linux-pruebas'
            }

            steps {
                checkout scm
                sh 'test -f README.md'
            }
        }
    }
}
```

Comprueba que ambas etapas obtienen la revisión asociada a la misma ejecución.

### Pipeline con `stash`

```groovy
pipeline {
    agent none

    stages {
        stage('Checkout y stash') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                checkout scm
                stash name: 'codigo-practica',
                      includes: 'README.md,app/**'
            }
        }

        stage('Recuperar y validar') {
            agent {
                label 'linux-pruebas'
            }

            steps {
                unstash 'codigo-practica'
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
            }
        }
    }
}
```

### Pipeline con `post` y commit visible

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Registrar revisión') {
            steps {
                sh 'git rev-parse --short HEAD'
            }
        }

        stage('Validar') {
            steps {
                sh 'test -f README.md'
            }
        }
    }

    post {
        success {
            echo 'La revisión ha pasado la validación.'
        }

        failure {
            echo 'La ejecución necesita revisión.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

El ejemplo muestra el identificador corto del commit.

No imprime credenciales ni URLs remotas.

## Diagnóstico de problemas SCM

Los fallos de SCM suelen ocurrir antes de que empiecen las etapas del pipeline.

### Jenkins no encuentra el repositorio

Comprueba:

- URL.
- Protocolo.
- Nombre de repositorio.
- Instancia SCM correcta.
- Red desde el componente que hace el checkout.
- Estado del servicio remoto.

No cambies permisos de red sin autorización.

### Error de autenticación

Comprueba:

- Credencial seleccionada.
- Permisos de lectura.
- Caducidad o revocación.
- Usuario o identidad.
- Repositorio asociado.
- Método de autenticación.

No pegues una contraseña en un comando para probarla.

### Error de autorización

La autenticación puede funcionar mientras el usuario o la credencial no tiene permisos suficientes.

Comprueba si el acceso debe ser:

- De lectura.
- De escritura.
- A una rama protegida.
- A un repositorio específico.

Un job de checkout suele necesitar lectura.

### Jenkins no encuentra el `Jenkinsfile`

Comprueba:

- Nombre exacto.
- Mayúsculas y minúsculas.
- Ruta.
- Rama.
- Commit.
- Subdirectorio.
- Configuración del job.

El mensaje puede aparecer antes de ejecutar cualquier etapa.

### Jenkins encuentra un `Jenkinsfile` antiguo

Comprueba:

- Qué rama se configuró.
- Qué commit se obtuvo.
- Si el cambio fue enviado al remoto.
- Si el job utiliza la ruta correcta.
- Si la ejecución pertenece a otro subjob.
- Si se ejecutó una revisión anterior.

### Checkout de la rama incorrecta

Comprueba:

- Rama configurada en el job.
- Especificación de ramas.
- Configuración Multibranch.
- Evento que inició la ejecución.
- Commit mostrado en consola.
- Rama por defecto del repositorio.

### Confusión entre rama local y remota

Una rama local puede no haberse enviado al servidor remoto.

Comprueba con Git:

```bash
git status
```

```bash
git branch --all
```

```bash
git log --oneline --decorate -5
```

Sigue el procedimiento del curso antes de ejecutar un `push`.

### Fallo de certificado

No desactives la validación TLS.

Comprueba con el administrador:

- Certificado del servicio.
- Autoridad certificadora.
- Proxy.
- Inspección de tráfico.
- Fecha del sistema.
- URL utilizada.

### Fallo de DNS o conectividad

El error puede originarse en:

- Resolución DNS.
- Ruta de red.
- VPN.
- Proxy.
- Cortafuegos.
- Servicio remoto detenido.
- Configuración del agente.

Recoge el mensaje y consulta al responsable.

### Checkout correcto, pero archivo ausente

Comprueba:

- Que el archivo está en el commit.
- Que la ruta coincide.
- Que el archivo no está ignorado por Git.
- Que el job ejecutó la rama esperada.
- Que la etapa se ejecuta en el agente correcto.
- Que un cambio de agente no requiere transferir el archivo.

### Diferencia entre checkout de Jenkinsfile y checkout del workspace

En algunas configuraciones, Jenkins obtiene el `Jenkinsfile` antes de ejecutar sus etapas.

Eso no siempre significa que el workspace del agente ya contenga todos los archivos del proyecto.

Revisa el tipo de job y la configuración del checkout.

### Job en cola después de un checkout

Un job puede haber obtenido la definición y aun así esperar un agente para ejecutar sus pasos.

Distingue:

- Obtener el `Jenkinsfile`.
- Reservar un agente.
- Ejecutar comandos.
- Obtener el código dentro del workspace.

### Changelog vacío

Puede deberse a:

- Primera ejecución.
- Checkout sin historial previo.
- Configuración del plugin.
- Historial limitado.
- Tipo de job.
- Falta de metadatos.

Un changelog vacío no demuestra que no hubiera cambios.

## Checklist de configuración

Antes de configurar SCM:

- [ ] El repositorio es el autorizado.
- [ ] La URL es correcta.
- [ ] La rama existe.
- [ ] La ruta del `Jenkinsfile` es correcta.
- [ ] La credencial tiene permisos mínimos.
- [ ] No hay secretos en la URL.
- [ ] El agente puede acceder al repositorio si realiza el checkout.
- [ ] Se identifica qué revisión se ejecutará.
- [ ] Los cambios externos se tratan como código no confiable.

Antes de ejecutar:

- [ ] He revisado el `Jenkinsfile`.
- [ ] He revisado los scripts asociados.
- [ ] Sé qué agente se utilizará.
- [ ] Sé qué commit se procesará.
- [ ] No se requieren credenciales de producción.
- [ ] El job no hace operaciones destructivas.
- [ ] Los logs no expondrán secretos.

Después de ejecutar:

- [ ] Anoté el job y el número de ejecución.
- [ ] Registré rama y commit.
- [ ] Revisé checkout y etapas.
- [ ] Identifiqué el agente.
- [ ] Revisé los artefactos.
- [ ] Oculté información sensible antes de compartir logs.

## Buenas prácticas

### Mantener el `Jenkinsfile` en SCM

Versionar el pipeline facilita las revisiones y permite conocer su evolución.

### Revisar cambios al pipeline

Un cambio en el `Jenkinsfile` puede alterar los comandos y los permisos utilizados.

Inclúyelo en las revisiones del proyecto.

### Usar rutas claras

Documenta dónde está el `Jenkinsfile`.

Evita que la ubicación dependa de una suposición.

### Registrar commit y rama

Relaciona cada ejecución con la revisión exacta.

### Limitar credenciales

Un checkout suele requerir lectura.

No uses una credencial de escritura o administración si no es necesaria.

### Evitar duplicar configuración

Si el job ya proporciona el contexto SCM, comprueba si se necesita otro checkout.

### Tratar ramas externas con cuidado

Una rama puede cambiar el pipeline.

No le concedas automáticamente credenciales o agentes privilegiados.

### Mantener ramas limpias

Elimina ramas temporales según la política del repositorio.

No borres ramas compartidas sin autorización.

### Documentar triggers

Registra cómo se inicia el job:

- Manual.
- Webhook.
- Sondeo.
- Programación.
- Otro job.

### Conservar una forma de reproducir

Anota:

- Commit.
- Herramientas relevantes.
- Agente.
- Parámetros no sensibles.
- Resultado.
- Dependencias externas relevantes.

## Ejercicios de repaso

1. ¿Qué significa SCM?
2. ¿Qué diferencia hay entre rama y commit?
3. ¿Qué es un repositorio remoto?
4. ¿Qué es un `Jenkinsfile`?
5. ¿Qué ventaja tiene guardar el pipeline en Git?
6. ¿Qué información necesita un job para encontrar el `Jenkinsfile`?
7. ¿Qué diferencia hay entre un job Pipeline normal y Multibranch?
8. ¿Qué permisos suele necesitar el checkout de un repositorio privado?
9. ¿Por qué no se debe incluir un token en la URL?
10. ¿Qué función cumple `checkout scm` en contextos compatibles?
11. ¿Por qué un cambio local no aparece necesariamente en Jenkins?
12. ¿Qué dato identifica exactamente la revisión procesada?
13. ¿Qué puede hacer que Jenkins encuentre un `Jenkinsfile` antiguo?
14. ¿Qué riesgos tiene ejecutar el `Jenkinsfile` de una rama externa?
15. ¿Qué diferencia hay entre webhook y sondeo?
16. ¿Por qué no se debe desactivar TLS para resolver un error?
17. ¿Qué revisarías si falla el checkout?
18. ¿Por qué una credencial de lectura es preferible para un checkout?
19. ¿Qué relación hay entre código del pipeline y permisos del agente?
20. ¿Qué información debería incluir un informe de ejecución?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«SCM permite registrar y recuperar versiones del código».

### Afirmación 2

«Una rama identifica siempre una revisión inmutable».

### Afirmación 3

«Un commit identifica una revisión concreta del historial».

### Afirmación 4

«Un `Jenkinsfile` puede guardarse en el mismo repositorio que el proyecto».

### Afirmación 5

«Un token puede incluirse en la URL si el repositorio es privado».

### Afirmación 6

«Un pipeline multibranch puede descubrir ramas que contienen un `Jenkinsfile`».

### Afirmación 7

«Borrar del último commit un secreto expuesto garantiza que desaparece del historial».

### Afirmación 8

«Un checkout puede fallar por red, autenticación o una URL incorrecta».

### Afirmación 9

«Un agente puede necesitar conectividad a SCM para obtener el código».

### Afirmación 10

«Una ejecución debería poder asociarse a un commit».

### Afirmación 11

«La protección de ramas se configura únicamente en el `Jenkinsfile`».

### Afirmación 12

«Webhook y sondeo son dos mecanismos que pueden iniciar ejecuciones tras cambios».

### Afirmación 13

«`checkout scm` está disponible de la misma forma en cualquier tipo de job y configuración».

### Afirmación 14

«Un cambio en el `Jenkinsfile` puede cambiar los comandos que Jenkins ejecuta».

### Afirmación 15

«Una credencial de checkout debería tener solo los permisos necesarios».

## Respuestas orientativas

### Afirmación 1

**Correcta.** SCM administra versiones e historial.

### Afirmación 2

**Incorrecta.** Una rama puede avanzar a otro commit.

### Afirmación 3

**Correcta.** El commit representa una revisión concreta.

### Afirmación 4

**Correcta.** Es una práctica habitual.

### Afirmación 5

**Incorrecta.** No incrustes credenciales en una URL.

### Afirmación 6

**Correcta.** Es una función habitual de Multibranch, según la integración configurada.

### Afirmación 7

**Incorrecta.** El secreto puede permanecer en el historial.

### Afirmación 8

**Correcta.** Esas son causas comunes de fallo.

### Afirmación 9

**Correcta.** Depende de qué componente realice el checkout.

### Afirmación 10

**Correcta.** El commit facilita reproducibilidad y diagnóstico.

### Afirmación 11

**Incorrecta.** La protección suele configurarse en el proveedor SCM y puede complementarse con Jenkins.

### Afirmación 12

**Correcta.** Son mecanismos de disparo habituales.

### Afirmación 13

**Incorrecta.** Depende del tipo de job y de la configuración.

### Afirmación 14

**Correcta.** El archivo puede definir comandos ejecutables.

### Afirmación 15

**Correcta.** Aplica el principio de mínimo privilegio.

## Plantilla de documentación para un job SCM

Utiliza esta ficha en el laboratorio:

```text
Nombre del job:
Tipo de job:
Repositorio:
Rama o estrategia de ramas:
Ruta del Jenkinsfile:
Credencial referenciada:
Permiso de credencial:
Agente:
Método de checkout:
Trigger:
Commit de una ejecución de referencia:
Artefactos:
Responsable:
Restricciones:
Fecha de revisión:
```

No escribas en la ficha:

- Contraseñas.
- Tokens.
- Claves privadas.
- Valores secretos.
- Direcciones internas no autorizadas.

Haz referencia al identificador de una credencial, no a su contenido.

## Glosario

- **SCM:** gestión del código fuente y sus versiones.
- **Git:** sistema distribuido de control de versiones.
- **Repositorio:** conjunto de archivos e historial de un proyecto.
- **Commit:** registro de una revisión de cambios.
- **Rama:** línea de desarrollo dentro del repositorio.
- **Tag Git:** referencia que identifica un punto del historial.
- **Remoto:** referencia a otro repositorio.
- **Checkout:** operación que obtiene una revisión para trabajar con ella.
- **Jenkinsfile:** archivo que define un pipeline.
- **Pipeline:** flujo automatizado de etapas y pasos.
- **Pipeline multibranch:** job que puede descubrir y procesar varias ramas.
- **Credencial SCM:** identidad o secreto gestionado para acceder a un repositorio.
- **Webhook:** notificación de un evento enviada a Jenkins.
- **Sondeo:** consulta periódica para detectar cambios.
- **Changelog:** lista de cambios asociados a una ejecución.
- **Pull request:** propuesta de integración de una rama en otra.
- **Workspace:** directorio de trabajo de una ejecución en un agente.
- **Mínimo privilegio:** principio de conceder solo el acceso necesario.
- **Reproducibilidad:** capacidad de reconstruir o comprender una ejecución a partir de sus datos.
- **Multibranch:** forma de job que relaciona ejecuciones con ramas del repositorio.

## Síntesis final

SCM conserva el historial del código; Jenkins automatiza tareas sobre las revisiones que obtiene.

- El `Jenkinsfile` puede vivir junto al proyecto y evolucionar mediante commits.
- La URL, la rama y la ruta del archivo determinan qué definición obtiene Jenkins.
- El commit identifica la revisión concreta de una ejecución.
- Un job normal y un Multibranch Pipeline gestionan SCM de forma distinta.
- El checkout necesita red y permisos adecuados.
- Las credenciales no deben aparecer en URLs, código o logs.
- El código de una rama puede modificar el propio pipeline.
- Los cambios externos deben tratarse según su nivel de confianza.
- Los artefactos, workspaces y configuración de Jenkins no son lo mismo que el historial SCM.
- Un diagnóstico útil registra job, rama, commit, agente, etapa y mensaje relevante.