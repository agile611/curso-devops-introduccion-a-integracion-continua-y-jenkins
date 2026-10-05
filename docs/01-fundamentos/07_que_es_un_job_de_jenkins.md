# ¿Qué es un job de Jenkins?

Un **job de Jenkins** es una unidad de trabajo configurada para ejecutar una tarea automatizada. Puede obtener código desde Git, ejecutar comandos, lanzar pruebas, generar archivos, publicar resultados o coordinar un despliegue. Según el tipo de job y su configuración, puede iniciarse manualmente, por un cambio en un repositorio o mediante una programación.

En esta unidad aprenderás qué contiene un job, cómo se ejecuta y cómo interpretar sus resultados. También crearás jobs de práctica, provocarás fallos controlados y compararás un job tradicional con un pipeline definido como código.

!!! note "Entorno de práctica" 
    Utiliza únicamente la instancia de Jenkins asignada por el curso. No crees jobs, modifiques credenciales ni ejecutes comandos en una instancia compartida sin autorización. Los ejemplos están pensados para un laboratorio aislado.

## Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Explicar qué es un job de Jenkins y qué función cumple.
- Diferenciar un job, una ejecución y una etapa de pipeline.
- Identificar los componentes básicos de un job.
- Comprender qué hace un workspace.
- Ejecutar un job manualmente y consultar su historial.
- Leer la consola de una ejecución.
- Reconocer resultados exitosos, fallidos, inestables y abortados.
- Crear un job de tipo *Freestyle*, si la instancia del curso lo permite.
- Entender cómo un pipeline representa un flujo de trabajo.
- Relacionar un job con un repositorio Git.
- Utilizar parámetros de forma segura.
- Reconocer disparadores manuales, programados y basados en cambios.
- Evitar guardar secretos en comandos y archivos.
- Diagnosticar fallos frecuentes.
- Documentar un job para que otra persona pueda entenderlo y mantenerlo.

## Conceptos fundamentales

Antes de crear un job, conviene diferenciar los objetos principales que aparecen en Jenkins.

### Job

Un **job** es una configuración guardada en Jenkins que describe qué trabajo se debe realizar y cómo.

Un job puede especificar:

- De dónde obtiene el código.
- Qué agente debe utilizar.
- Qué comandos debe ejecutar.
- Qué parámetros acepta.
- Qué acciones lo inician.
- Qué archivos conserva.
- Qué hacer después de una ejecución.
- Quién puede ejecutarlo o configurarlo.

El término *job* se utiliza especialmente en la interfaz de Jenkins y en conversaciones sobre tareas configuradas.

### Ejecución o build

Una **ejecución**, también llamada *build*, es una instancia concreta de un job.

Cada ejecución tiene:

- Un número o identificador.
- Una hora de inicio.
- Una duración.
- Un resultado.
- Un log de consola.
- Un conjunto de parámetros, si se usaron.
- Un agente o nodo de ejecución.
- Un workspace asociado, según la configuración.

Un mismo job puede ejecutarse muchas veces. Cada ejecución produce un resultado independiente.

### Pipeline

Un **pipeline** describe una secuencia de pasos para validar, construir, entregar o desplegar software.

Puede contener:

- Etapas.
- Pasos.
- Condiciones.
- Parámetros.
- Acciones posteriores.
- Definiciones de agente.
- Reglas para gestionar errores.

En Jenkins, un pipeline suele definirse mediante un `Jenkinsfile`, aunque Jenkins también admite otras formas de configuración.

### Etapa

Una **etapa** agrupa pasos que tienen un objetivo reconocible.

Ejemplos:

- `Validar`
- `Ejecutar pruebas`
- `Construir`
- `Archivar artefactos`
- `Desplegar en pruebas`

Las etapas facilitan entender en qué parte del pipeline se encuentra una ejecución y dónde ocurrió un fallo.

### Paso

Un **paso** es una acción concreta que se ejecuta dentro de un job o una etapa.

Ejemplos:

- Ejecutar un comando de shell.
- Obtener el código fuente.
- Archivar un archivo.
- Publicar resultados de pruebas.
- Solicitar una aprobación.
- Enviar una notificación.

### Agente o nodo

Un **agente** es el equipo o entorno donde Jenkins ejecuta tareas.

Puede ser:

- La misma máquina que ejecuta el controlador.
- Una máquina virtual.
- Un servidor remoto.
- Un contenedor.
- Un nodo temporal creado para una ejecución.

No supongas que los comandos se ejecutan en tu equipo local. Comprueba qué agente utiliza el job.

!!! note "¿Qué puede ser un agente"
    Para ser un agente solo se necesita la capacidad de ejecutar java y tener conectividad de red hacia el nodo controlador de Jenkins.

### Workspace

El **workspace** es el directorio de trabajo que Jenkins utiliza durante una ejecución.

Puede contener:

- Una copia del repositorio.
- Archivos temporales.
- Resultados de pruebas.
- Archivos de construcción.
- Logs creados por comandos.
- Artefactos que se preparan para conservarse.

El workspace no debe tratarse automáticamente como almacenamiento permanente. Jenkins puede limpiarlo o reutilizarlo según la configuración.

### Artefacto

Un **artefacto** es un archivo generado durante una ejecución y conservado para consulta, distribución o despliegue.

Ejemplos:

- Un paquete `.zip`.
- Una imagen de contenedor.
- Un ejecutable.
- Un informe.
- Un conjunto de archivos estáticos.
- Un paquete compilado.

Archivar un archivo en Jenkins no significa necesariamente que se haya publicado en un registro externo.

## Job frente a ejecución

La relación entre un job y sus ejecuciones se puede resumir así:

```text
Job configurado
    ├── Ejecución 1
    ├── Ejecución 2
    ├── Ejecución 3
    └── Ejecución 4
```

El job describe el procedimiento.

La ejecución registra una instancia concreta del procedimiento.

### Ejemplo

Un job llamado `validar-proyecto` ejecuta una prueba en un repositorio Git.

- En la ejecución 1, la prueba pasa.
- En la ejecución 2, alguien introduce un cambio que rompe la prueba.
- En la ejecución 3, el cambio se corrige y la prueba vuelve a pasar.

La configuración del job puede mantenerse igual mientras los datos, el código o los parámetros de cada ejecución cambian.

### Qué no se debe confundir

- El job no es necesariamente el código fuente.
- La ejecución no es lo mismo que una etapa.
- El workspace no es necesariamente un artefacto permanente.
- Una ejecución exitosa no demuestra que el sistema completo esté libre de errores.
- Un job de Jenkins no equivale automáticamente a un despliegue.

## Qué puede hacer un job

Un job puede automatizar una o varias tareas.

### Obtener código

Puede descargar una revisión concreta desde un repositorio.

La revisión puede identificarse mediante:

- Una rama.
- Un commit.
- Una etiqueta.
- Una revisión solicitada para integración.

### Validar el proyecto

Puede comprobar:

- La sintaxis.
- El formato.
- La presencia de archivos.
- La configuración.
- Las convenciones del proyecto.
- Las dependencias esperadas.

### Ejecutar pruebas

Puede lanzar:

- Pruebas unitarias.
- Pruebas de integración.
- Pruebas de aceptación.
- Comprobaciones de seguridad.
- Análisis estático.
- Pruebas de rendimiento, si el entorno está preparado.

### Construir software

Puede crear:

- Paquetes.
- Ejecutables.
- Imágenes de contenedor.
- Documentación.
- Artefactos de distribución.

### Publicar resultados

Puede conservar o comunicar:

- Logs.
- Informes de pruebas.
- Artefactos.
- Resultados de análisis.
- Resúmenes de ejecución.

### Desplegar software

Un job puede ejecutar pasos de despliegue si cuenta con:

- Un destino autorizado.
- Credenciales adecuadas.
- Un procedimiento revisado.
- Aprobaciones requeridas.
- Controles para detener o recuperar la operación.

No utilices un job de práctica para desplegar en sistemas reales.

## Tipos habituales de job

La interfaz y las opciones disponibles dependen de la versión de Jenkins y de los plugins instalados.

### Freestyle project

Un job *Freestyle* permite configurar tareas desde la interfaz de Jenkins.

Suele ser útil para:

- Aprender los componentes básicos.
- Ejecutar comandos sencillos.
- Configurar un ejercicio corto.
- Entender el flujo de configuración y ejecución.

En un job Freestyle se pueden definir, según la instalación:

- El origen del código.
- Disparadores.
- El agente.
- Parámetros.
- Pasos de construcción.
- Acciones posteriores.
- Retención de ejecuciones.

### Pipeline

Un job de tipo Pipeline ejecuta una definición de flujo de trabajo.

Puede obtener su configuración desde:

- Un `Jenkinsfile` en el repositorio.
- Una definición introducida en Jenkins, en prácticas pequeñas.
- Una biblioteca compartida autorizada.

Un `Jenkinsfile` permite revisar el pipeline como parte del código.

### Multibranch Pipeline

Un job *Multibranch Pipeline* descubre ramas de un repositorio y busca un `Jenkinsfile` en ellas.

Puede resultar útil cuando:

- Hay varias ramas activas.
- Cada rama necesita validar sus cambios.
- El equipo utiliza solicitudes de cambios.
- El repositorio contiene una definición de pipeline por rama.

La configuración requiere integración con el proveedor del repositorio y permisos adecuados.

### Folder o carpeta

Una carpeta organiza jobs relacionados.

Puede servir para:

- Separar proyectos.
- Agrupar trabajos de un curso.
- Aplicar permisos a un conjunto de jobs.
- Facilitar la navegación.

La disponibilidad de carpetas depende de la configuración de Jenkins.

### Job de organización

Algunas instalaciones permiten descubrir repositorios de una organización y crear pipelines automáticamente.

Es una opción más avanzada que no suele ser necesaria en una práctica introductoria.

### Elección del tipo de job

| Tipo | Uso habitual | Configuración como código |
|---|---|---|
| Freestyle | Tareas sencillas desde la interfaz | No necesariamente |
| Pipeline | Flujo con etapas y lógica explícita | Habitualmente mediante `Jenkinsfile` |
| Multibranch Pipeline | Pipelines en varias ramas | Sí, en cada rama o revisión |
| Carpeta | Organización de jobs | No es por sí misma un job de ejecución |
| Job de organización | Descubrimiento de múltiples repositorios | Depende de la configuración |

El tipo adecuado depende del objetivo de la tarea, el mantenimiento esperado y las capacidades de la instancia.

## Partes de un job

Una configuración de job reúne varias decisiones.

### Nombre

El nombre debe explicar el propósito del job.

Ejemplos descriptivos:

```text
validar-documentacion
probar-aplicacion-web
construir-imagen-laboratorio
```

Evita nombres ambiguos como:

```text
prueba
nuevo
final2
test123
```

### Descripción

La descripción debería explicar:

- Qué hace el job.
- Qué repositorio utiliza.
- Qué agente necesita.
- Cómo se inicia.
- Qué resultado produce.
- Quién lo mantiene.
- Qué restricciones tiene.

Una descripción corta puede ahorrar tiempo cuando alguien hereda el job.

### Origen del código

El job puede obtener código desde un proveedor Git.

La configuración puede especificar:

- URL del repositorio.
- Credencial de lectura, si el repositorio la requiere.
- Rama o revisión.
- Ref de integración.
- Comportamiento ante cambios.

No incluyas tokens dentro de la URL ni en texto visible.

### Agente

El agente determina dónde se ejecutan los pasos.

Comprueba:

- Sistema operativo.
- Shell disponible.
- Herramientas instaladas.
- Espacio de disco.
- Permisos.
- Conectividad.
- Acceso a repositorios o servicios necesarios.

### Pasos de ejecución

Los pasos describen las tareas del job.

Pueden ser:

- Comandos de shell.
- Comandos de Windows.
- Bloques de pipeline.
- Pasos proporcionados por plugins.
- Acciones de archivado o publicación.

Cada paso debería tener un propósito claro.

### Disparadores

Los disparadores indican cuándo se inicia el job.

Algunos ejemplos:

- Inicio manual.
- Cambio en un repositorio.
- Ejecución programada.
- Finalización de otro job.
- Evento recibido desde un proveedor externo.

### Parámetros

Los parámetros permiten variar una ejecución sin modificar la configuración del job.

Pueden ser:

- Texto.
- Opción de selección.
- Booleano.
- Rama.
- Archivo, si la instalación admite ese mecanismo.

Los parámetros no deben utilizarse para introducir secretos en texto claro.

### Acciones posteriores

Después de ejecutar los pasos, Jenkins puede:

- Archivar artefactos.
- Publicar resultados.
- Enviar notificaciones.
- Limpiar el workspace.
- Ejecutar acciones condicionadas al resultado.

Las acciones posteriores deben ser útiles y no ocultar fallos.

## Estados de una ejecución

Jenkins presenta un resultado para cada ejecución.

### Success

La ejecución terminó correctamente según las condiciones configuradas.

No significa que:

- Todas las partes de la aplicación hayan sido probadas.
- El código no contenga errores.
- El artefacto esté desplegado.
- El servicio funcione en producción.
- No exista riesgo de seguridad.

Significa que los pasos configurados terminaron de acuerdo con el criterio de éxito definido.

### Failure

La ejecución falló.

Puede deberse a:

- Un comando que terminó con error.
- Una prueba fallida.
- Un archivo ausente.
- Una dependencia que no se pudo descargar.
- Un agente que perdió conectividad.
- Un error en la configuración.
- Un fallo de permisos.

Lee el log antes de cambiar la configuración.

### Unstable

Una ejecución inestable suele indicar que alguna verificación, como una prueba, no pasó aunque el proceso general continuara.

El significado concreto depende del job y de los plugins utilizados.

Consulta los informes de pruebas y la configuración de la tarea.

### Aborted

La ejecución fue cancelada o interrumpida.

Puede ocurrir porque:

- Una persona pulsó cancelar.
- Jenkins se reinició.
- El agente dejó de estar disponible.
- La plataforma interrumpió la tarea.
- Se alcanzó un límite de tiempo configurado.

Un job abortado no equivale necesariamente a un fallo del código.

### En progreso

Una ejecución en curso puede estar:

- Esperando un agente.
- Obteniendo el código.
- Ejecutando un comando.
- Esperando una aprobación.
- Atascada por un recurso externo.

Consulta el log y el estado del agente antes de iniciar ejecuciones duplicadas.

### Colores e iconos

Algunas instalaciones utilizan colores o iconos para representar resultados.

No dependas únicamente del color: consulta el texto de estado, el número de ejecución y la consola. Las convenciones visuales pueden variar según la interfaz o el tema instalado.

## El número de ejecución y el historial

Cada ejecución suele recibir un número secuencial dentro del job.

Por ejemplo:

```text
#1
#2
#3
```

El número ayuda a localizar una ejecución, pero no identifica por sí solo el código utilizado.

Para investigar una ejecución, relaciona:

- Job.
- Número de ejecución.
- Rama o revisión.
- Commit.
- Parámetros.
- Agente.
- Hora.
- Artefactos generados.

### Historial de ejecuciones

El historial permite comparar resultados de un mismo job.

Puedes revisar:

- Qué ejecución pasó.
- Cuál falló.
- Cuándo ocurrió el cambio.
- Qué commit se procesó.
- Cuánto duró.
- Qué archivos se archivaron.

La retención del historial puede estar limitada por una política de almacenamiento.

### Duración

La duración ayuda a observar cambios en el rendimiento del job.

Un aumento puede deberse a:

- Una etapa nueva.
- Dependencias más lentas.
- Saturación del agente.
- Cambios en el tamaño del proyecto.
- Problemas de red.
- Una prueba que tarda más.
- Cambios en la caché.

La duración es un dato para investigar, no una conclusión por sí sola.

## Workspace y archivos de una ejecución

El workspace proporciona un espacio temporal de trabajo al job.

### Contenido posible

Puede incluir:

```text
workspace/
├── código obtenido desde Git
├── archivos temporales
├── dependencias descargadas
├── resultados de pruebas
└── salida generada por los comandos
```

La estructura real depende del proyecto.

### Workspace no significa persistencia

El workspace puede:

- Reutilizarse en otra ejecución.
- Limpiarse antes de iniciar.
- Eliminarse al terminar.
- Permanecer en un agente después de la ejecución.
- Estar aislado en un contenedor temporal.

No guardes información importante allí sin una acción de archivado o publicación explícita.

### Limpieza del workspace

Limpiar el workspace puede ayudar a:

- Evitar que archivos antiguos alteren resultados.
- Reducir el consumo de almacenamiento.
- Facilitar ejecuciones reproducibles.

Pero también puede:

- Eliminar datos útiles para investigar.
- Incrementar tiempos de ejecución.
- Afectar recursos que un ejercicio espera conservar.

Sigue la política del laboratorio.

### Rutas relativas

Los comandos de un job suelen ejecutarse desde el workspace u otro directorio configurado.

Antes de utilizar rutas relativas, comprueba el directorio de trabajo y la estructura del repositorio.

Una ruta como:

```text
app/mensaje.txt
```

solo es correcta si el proceso se ejecuta desde el directorio esperado.

## Disparadores de un job

Un disparador inicia una ejecución cuando ocurre un evento o se cumple una condición.

### Inicio manual

Una persona inicia la ejecución desde Jenkins.

Puede ser útil para:

- Aprendizaje.
- Diagnóstico.
- Validación bajo demanda.
- Pruebas controladas.
- Tareas que requieren una decisión humana.

El inicio manual no garantiza que el job use los parámetros correctos. Revisa el formulario antes de iniciar.

### Cambios en Git

Un job puede iniciar cuando se detectan cambios en un repositorio.

La detección puede realizarse mediante:

- Webhooks.
- Sondeo periódico.
- Integraciones del proveedor.
- Eventos de una solicitud de cambios.

Un webhook suele comunicar cambios al sistema con rapidez, pero requiere configuración y conectividad.

### Ejecución programada

Una programación puede iniciar el job en horarios definidos.

Puede ser útil para:

- Validaciones periódicas.
- Informes.
- Análisis programados.
- Limpiezas aprobadas.
- Sincronizaciones controladas.

Una programación no debería ocultar una tarea que necesita supervisión.

### Dependencia de otro job

Un job puede iniciarse cuando finaliza otro.

Al diseñar dependencias:

- Evita ciclos.
- Documenta el orden.
- Decide qué hacer si el job anterior falla.
- Considera qué ocurre si una ejecución tarda más de lo esperado.

### Inicio por API o automatización externa

Algunas instalaciones permiten iniciar jobs mediante API o integraciones externas.

Este mecanismo requiere:

- Autenticación.
- Permisos adecuados.
- Gestión segura de tokens.
- Validación de parámetros.
- Restricción de acceso de red.

No expongas una interfaz de inicio sin controles.

## Parámetros de un job

Los parámetros permiten personalizar una ejecución.

### Parámetro de texto

Puede utilizarse para un valor no sensible, como un nombre de práctica o una etiqueta de prueba.

Valida el valor antes de incorporarlo a un comando.

No construyas comandos inseguros concatenando texto no validado.

### Parámetro de selección

Una lista de opciones puede limitar los valores permitidos.

Ejemplo conceptual:

```text
entorno:
- pruebas
- laboratorio
```

No incluyas `producción` como opción de un job educativo salvo que exista una necesidad autorizada.

### Parámetro booleano

Un valor verdadero o falso puede activar una opción.

Asegúrate de que la opción esté documentada y de que el valor predeterminado sea seguro.

### Parámetro de rama

Permitir seleccionar una rama puede ser útil para validar código.

Sin embargo:

- Restringe las ramas disponibles cuando sea posible.
- No ejecutes código no confiable con credenciales privilegiadas.
- Comprueba qué revisión se descargó.
- Evita que un parámetro controle un destino real sin validación.

### Parámetros y secretos

No uses un parámetro de texto común para introducir una contraseña o un token.

Los secretos deben gestionarse con las credenciales de Jenkins o con el mecanismo autorizado por la organización.

## Variables de entorno

Un proceso puede recibir variables de entorno desde Jenkins, el agente o el sistema operativo.

Pueden representar:

- El nombre de un entorno.
- Una ruta.
- Un modo de ejecución.
- La versión de una herramienta.
- Identificadores de ejecución.

### Consultar variables de manera segura

Los logs pueden mostrar valores de variables si un comando los imprime.

No ejecutes indiscriminadamente:

```bash
env
```

en un job que use credenciales. La salida puede exponer información sensible.

### Variables para configuración

Utiliza variables para valores que varían entre entornos, pero documenta:

- Nombre.
- Propósito.
- Si es obligatorio.
- Valor esperado.
- Quién puede configurarlo.
- Si contiene información sensible.

### Validar variables

Antes de ejecutar un paso importante, valida que las variables requeridas existan y tengan valores permitidos.

Un error explícito al comienzo suele ser más útil que un fallo posterior difícil de interpretar.

## Credenciales en Jenkins

Las credenciales permiten acceder a recursos externos y deben tratarse con cuidado.

### Almacén de credenciales

Jenkins ofrece mecanismos para registrar credenciales y permitir que jobs autorizados las utilicen.

La interfaz y los detalles dependen de la configuración de la instancia.

### Identificador frente a secreto

El pipeline puede referirse a una credencial mediante un identificador.

El valor secreto no debería escribirse directamente en el `Jenkinsfile`.

### Principio de mínimo privilegio

Una credencial debería:

- Tener solo los permisos requeridos.
- Estar disponible solo para los jobs autorizados.
- Separarse por entorno cuando sea necesario.
- Rotarse según la política de la organización.
- Revocarse cuando ya no se necesite.

### No imprimir secretos

Evita comandos que impriman:

- Contraseñas.
- Tokens.
- Claves privadas.
- Variables de credenciales.
- Respuestas de autenticación.

Jenkins puede enmascarar algunos valores, pero no confíes en el enmascaramiento como único control.

### Credenciales en jobs de práctica

En esta unidad, no necesitas credenciales de producción.

Si un ejercicio requiere una credencial de laboratorio:

- Sigue la instrucción del docente.
- Comprueba su alcance.
- No copies el valor en notas.
- No la incluyas en capturas.
- No la uses en otros servicios.

## Seguridad de los jobs

Los jobs ejecutan acciones. Un job debe considerarse una capacidad para operar sobre los recursos a los que tiene acceso.

### Código de repositorios

El código de un repositorio puede ejecutar comandos durante una compilación.

Antes de ejecutar código desconocido:

- Comprueba la procedencia del repositorio.
- Revisa el `Jenkinsfile` y los scripts.
- Utiliza un agente aislado.
- Limita credenciales y acceso de red.
- Sigue las normas del laboratorio.

### Permisos para configurar jobs

No todas las personas necesitan permiso para:

- Crear jobs.
- Modificar pipelines.
- Administrar plugins.
- Gestionar credenciales.
- Cambiar agentes.
- Acceder a producción.

Los permisos deben ajustarse a la responsabilidad de cada rol.

### Aislamiento de agentes

Un agente puede ejecutar código con los permisos de su proceso.

Reduce riesgos mediante:

- Usuarios no privilegiados.
- Credenciales limitadas.
- Workspaces separados.
- Agentes temporales, cuando sea viable.
- Límites de recursos.
- Restricciones de red.
- Eliminación de recursos temporales según política.

### Jobs que modifican infraestructura

Un job que modifica infraestructura requiere controles adicionales:

- Confirmación del entorno de destino.
- Plan o vista previa del cambio.
- Revisión del código.
- Aprobación, si corresponde.
- Credenciales de alcance limitado.
- Registro de operaciones.
- Procedimiento de recuperación.

No ejecutes comandos de Terraform o Ansible contra recursos reales sin autorización explícita.

## Job Freestyle paso a paso

Un job Freestyle puede servir para una primera práctica. La interfaz varía según la versión de Jenkins y los plugins instalados.

### Antes de crear el job

Confirma:

- Que estás en la instancia de laboratorio.
- Que tu usuario puede crear jobs.
- Que no vas a sobrescribir un job existente.
- Qué agente ejecutará el trabajo.
- Qué comandos están permitidos.
- Cómo limpiarás el job al terminar.

### Crear el job

Desde el panel de Jenkins:

1. Selecciona la acción para crear un elemento nuevo.
2. Escribe un nombre descriptivo.
3. Elige el tipo Freestyle, si está disponible.
4. Confirma la creación.
5. Revisa la configuración antes de guardar.

No uses un nombre reservado para jobs compartidos.

### Añadir una descripción

Incluye:

- Propósito.
- Requisitos.
- Agente esperado.
- Comando principal.
- Resultado esperado.
- Responsable del ejercicio.

### Seleccionar el agente

Si la instancia permite elegir un nodo:

- Utiliza el nodo de laboratorio indicado.
- Comprueba que tiene Bash si usarás comandos Linux.
- Evita seleccionar un agente de producción.
- No cambies etiquetas globales sin permiso.

### Añadir un paso sencillo

Si la práctica usa un agente Linux y el paso de shell está disponible, puedes iniciar con:

```bash
echo "Job de prueba del curso"
```

Este comando solo escribe texto en la consola.

No añadas `sudo`, comandos de borrado o comandos de despliegue a un job introductorio.

### Guardar y ejecutar

Después de guardar:

1. Revisa la configuración.
2. Inicia una ejecución manual.
3. Espera a que termine.
4. Abre el resultado.
5. Consulta la salida de consola.

### Verificar el resultado

Comprueba:

- Que se seleccionó el agente esperado.
- Que el comando aparece en la consola.
- Que la salida coincide con lo esperado.
- Que el estado final es correcto.
- Que la duración es razonable.
- Que no aparecen secretos.

## Ejemplo de job Freestyle con comandos de consulta

Este ejemplo requiere un agente Linux con Bash y Git disponibles.

Los comandos consultan información básica y no modifican la configuración del sistema.

### Comandos de ejemplo

```bash
echo "Sistema operativo:"
uname -s

echo "Directorio de trabajo:"
pwd

echo "Usuario del proceso:"
whoami

echo "Git disponible:"
git --version
```

### Qué aprender del resultado

La salida puede mostrar que:

- El job se ejecuta en un agente, no en tu ordenador.
- El usuario es distinto del usuario que administra Jenkins.
- El workspace tiene una ruta propia.
- Una herramienta puede faltar en el agente.
- El sistema operativo puede diferir del entorno local.

### Preguntas de reflexión

- ¿Qué máquina ejecutó los comandos?
- ¿Qué usuario aparece?
- ¿El agente dispone de Git?
- ¿Qué dato compararías con tu entorno local?
- ¿Qué herramienta sería necesaria para una tarea real?
- ¿Qué comando no convendría añadir sin autorización?

## Pipeline como código

Un pipeline puede definirse en un archivo `Jenkinsfile` guardado con el proyecto.

### Ventajas

Puede facilitar:

- Revisar los cambios del proceso.
- Mantener el pipeline junto al código.
- Reutilizar la definición.
- Comparar versiones.
- Aplicar revisiones al pipeline.
- Ejecutar una definición distinta en ramas distintas.

### Límites

Un `Jenkinsfile`:

- No configura por sí solo todas las credenciales.
- No instala automáticamente las herramientas necesarias en cualquier agente.
- No reemplaza los permisos de Jenkins.
- No garantiza que el proceso sea seguro.
- Puede necesitar plugins o capacidades específicas.

### Ejemplo declarativo mínimo

```groovy
pipeline {
    agent any

    stages {
        stage('Mensaje') {
            steps {
                echo 'El pipeline se ha iniciado'
            }
        }
    }
}
```

Este ejemplo no obtiene código, no realiza pruebas y no publica artefactos.

Sirve para entender la estructura básica.

### Elementos del ejemplo

- `pipeline` contiene la definición declarativa.
- `agent` indica dónde se ejecuta.
- `stages` agrupa etapas.
- `stage` define una etapa.
- `steps` contiene las acciones.
- `echo` escribe un mensaje en la consola de Jenkins.

### Usar un agente específico

En un entorno real, la selección del agente debería responder a requisitos de herramientas y aislamiento.

No elijas una etiqueta de agente al azar. Consulta las etiquetas disponibles y la guía del laboratorio.

## Ejemplo de pipeline con validación

El ejemplo siguiente supone que el repositorio contiene un archivo `app/mensaje.txt`.

El pipeline valida que el archivo exista y que incluya una frase determinada.

### Estructura del proyecto

```text
proyecto/
├── app/
│   └── mensaje.txt
└── Jenkinsfile
```

### Contenido de ejemplo

El archivo `app/mensaje.txt` puede contener:

```text
Práctica de jobs de Jenkins
```

### Jenkinsfile de validación

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar estructura') {
            steps {
                sh 'test -f app/mensaje.txt'
            }
        }

        stage('Validar mensaje') {
            steps {
                sh 'grep -q "Jenkins" app/mensaje.txt'
            }
        }
    }

    post {
        success {
            echo 'La validación ha terminado correctamente.'
        }

        failure {
            echo 'La validación ha fallado. Revisa la consola.'
        }

        always {
            echo 'La ejecución ha finalizado.'
        }
    }
}
```

### Qué comprueba

- Que existe el archivo.
- Que contiene la palabra `Jenkins`.
- Que los comandos terminan con código de salida exitoso.

Si una condición falla, la ejecución puede quedar marcada como fallida.

### Qué no comprueba

El ejemplo no valida:

- El formato de todo el archivo.
- La calidad del contenido.
- La aplicación completa.
- La seguridad del repositorio.
- El despliegue.
- El comportamiento en producción.

## Ejemplo de pipeline con script

Un script permite separar la validación del `Jenkinsfile`.

### Crear la estructura

```text
proyecto/
├── app/
│   └── mensaje.txt
├── scripts/
│   └── validar.sh
└── Jenkinsfile
```

### Script de validación

```bash
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"
TEXTO_ESPERADO="Jenkins"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: no existe $ARCHIVO"
  exit 1
fi

if grep -q "$TEXTO_ESPERADO" "$ARCHIVO"; then
  echo "OK: se encontró el texto esperado"
else
  echo "ERROR: no se encontró el texto esperado"
  exit 1
fi
```

### Dar permiso de ejecución

En Linux:

```bash
chmod +x scripts/validar.sh
```

Confirma que el permiso se conserva en Git y en el sistema de laboratorio.

### Jenkinsfile para ejecutar el script

```groovy
pipeline {
    agent any

    stages {
        stage('Validar archivos') {
            steps {
                sh 'test -f scripts/validar.sh'
                sh 'bash scripts/validar.sh'
            }
        }
    }
}
```

En el ejemplo se utiliza `bash` para ejecutar el script de manera explícita.

La disponibilidad de Bash depende del agente.

## Ejemplo de pipeline que archiva un artefacto

Archivar un archivo permite descargarlo desde la página de una ejecución, según la configuración de Jenkins.

### Jenkinsfile de ejemplo

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'grep -q "Jenkins" app/mensaje.txt'
            }
        }

        stage('Preparar salida') {
            steps {
                sh 'mkdir -p salida'
                sh 'cp app/mensaje.txt salida/mensaje.txt'
                archiveArtifacts artifacts: 'salida/mensaje.txt',
                                 fingerprint: true
            }
        }
    }
}
```

### Qué significa archivar

- Jenkins conserva el archivo asociado a la ejecución.
- El artefacto puede consultarse desde la interfaz, si está disponible.
- La huella puede ayudar a relacionar el archivo con una ejecución.
- La retención depende de la configuración de Jenkins.

### Qué no significa archivar

Archivar un artefacto no significa necesariamente que:

- Se haya publicado en un registro externo.
- Esté desplegado.
- Sea seguro para producción.
- Sea permanente.
- Haya superado todas las pruebas necesarias.

## Código de salida y resultado del job

Muchos comandos indican éxito o error mediante un código de salida.

### Convención habitual

- `0` suele indicar éxito.
- Un valor distinto de `0` suele indicar error.

La convención exacta depende del comando, pero es común en shells Unix.

### Comprobar el código de salida

En Bash, justo después de ejecutar un comando:

```bash
echo $?
```

No ejecutes otro comando entre la acción que quieres comprobar y `echo $?`, porque el valor puede cambiar.

### Código de salida en pipelines

En general, Jenkins interpreta un paso de shell fallido como un error de ejecución.

Si un script oculta los errores o convierte todas las salidas en éxito, el job podría mostrar un resultado engañoso.

No silencies fallos sin una razón documentada.

### Ejemplo de fallo controlado

Una comprobación sencilla puede fallar si el archivo no contiene la frase esperada:

```bash
grep -q "texto inexistente" app/mensaje.txt
```

Consulta el código inmediatamente después:

```bash
echo $?
```

La salida distinta de cero indica que `grep` no encontró el patrón.

## Condiciones y acciones posteriores

Un pipeline puede definir acciones posteriores según el resultado.

### Acciones posteriores comunes

- Mostrar un mensaje de éxito.
- Mostrar un mensaje de fallo.
- Archivar informes.
- Limpiar archivos temporales.
- Notificar a un canal autorizado.
- Guardar resultados de pruebas.
- Ejecutar pasos de recuperación, si están diseñados y aprobados.

### No ocultar el resultado

Una acción posterior no debería cambiar una ejecución fallida a exitosa sin explicar por qué.

Si el pipeline decide tratar una prueba fallida como no bloqueante, documenta:

- La razón.
- El alcance.
- El responsable.
- La fecha de revisión.
- El riesgo aceptado.

### Limpieza

La limpieza puede reducir uso de disco, pero debería conservar la evidencia necesaria para diagnosticar fallos.

Decide qué conservar antes de automatizar la eliminación de archivos.

## Construir un job reproducible

Un job reproducible produce resultados comparables cuando se ejecuta con las mismas entradas y condiciones.

### Controlar entradas

Registra o define:

- Commit.
- Rama.
- Versión de herramientas.
- Parámetros.
- Variables de configuración.
- Identificador del agente.
- Dependencias.
- Imagen de contenedor, si se utiliza.

### Evitar dependencia del estado anterior

Un job puede dar resultados distintos si depende de archivos antiguos del workspace.

Para reducir ese riesgo:

- Limpia solo lo necesario.
- Construye en un directorio conocido.
- Valida las entradas.
- Fija versiones de dependencias cuando corresponda.
- No reutilices datos de otra ejecución sin control.

### Documentar el ambiente

Describe:

- Sistema operativo del agente.
- Herramientas requeridas.
- Comandos ejecutados.
- Directorios usados.
- Salidas esperadas.
- Criterios de éxito.

### Evitar cambios ocultos

No dependas de:

- Alias personales.
- Archivos locales no versionados.
- Paquetes instalados manualmente sin documentar.
- Variables configuradas solo en una cuenta.
- Datos almacenados en el workspace de una ejecución anterior.

## Control de concurrencia

Un job puede tener ejecuciones simultáneas si Jenkins y la configuración lo permiten.

### Riesgos de ejecutar varias instancias

Varias ejecuciones pueden:

- Compartir recursos.
- Modificar el mismo entorno.
- Sobrescribir archivos.
- Usar una base de datos de prueba común.
- Competir por memoria o CPU.
- Generar resultados difíciles de interpretar.

### Cuándo limitar la concurrencia

Puede ser razonable evitar ejecuciones simultáneas cuando:

- El destino es compartido.
- El job modifica datos.
- Un recurso no admite concurrencia.
- Las pruebas dependen de un estado común.
- El agente es limitado.

### Qué documentar

Indica si el job:

- Puede ejecutarse en paralelo.
- Tiene exclusión mutua.
- Usa recursos compartidos.
- Requiere limpieza entre ejecuciones.
- Debe esperar a otro job.

## Programación de jobs

Jenkins puede iniciar jobs según una programación configurada.

### Usos posibles

- Ejecutar un análisis nocturno.
- Revisar periódicamente una dependencia.
- Generar informes.
- Comprobar un servicio de laboratorio.
- Ejecutar una tarea en un horario acordado.

### Aspectos que revisar

Antes de programar un job:

- ¿La tarea puede ejecutarse sin intervención?
- ¿Qué ocurre si falla?
- ¿Quién recibe el aviso?
- ¿Puede ejecutarse más de una vez a la vez?
- ¿Qué zona horaria utiliza Jenkins?
- ¿Qué recursos consume?
- ¿Qué ocurre durante una actualización?

### Evitar ejecuciones innecesarias

Una programación demasiado frecuente puede:

- Saturar los agentes.
- Generar logs y datos excesivos.
- Repetir una tarea que no cambia.
- Competir con trabajos importantes.

El intervalo debe responder a una necesidad concreta.

## Relación entre job y repositorio Git

Jenkins puede obtener el código de un repositorio antes de ejecutar los pasos.

### Información importante

Comprueba:

- La URL.
- El nombre del remoto.
- La rama.
- El commit.
- La credencial de lectura, si se necesita.
- El comportamiento ante ramas o solicitudes de cambios.

### Credenciales de acceso al repositorio

Para un repositorio público, quizá no se requiera credencial de lectura.

Para repositorios privados:

- Utiliza la credencial autorizada.
- Limita el permiso a lectura si es suficiente.
- No copies el token en la URL.
- No lo escribas en un comando visible.
- No lo imprimas en la consola.

### Confirmar qué commit se ejecutó

Relaciona el número de ejecución con:

- La rama.
- El identificador del commit.
- El mensaje del commit.
- La fecha.
- Los cambios incluidos.

Esa información es importante al comparar resultados o investigar una regresión.

### Código de una solicitud de cambios

Un job que valida una solicitud de cambios puede ejecutar código propuesto por otra persona.

Por ello:

- No expongas credenciales privilegiadas.
- Utiliza agentes aislados.
- Limita permisos.
- Revisa el comportamiento de los scripts.
- Sigue la política de seguridad del repositorio.

## Triggers: decisiones de diseño

Elegir el disparador adecuado forma parte del diseño del job.

### Manual

Adecuado cuando:

- El flujo es de aprendizaje.
- La ejecución requiere una decisión.
- El job consume muchos recursos.
- Se está realizando un diagnóstico.

### Al recibir cambios

Adecuado cuando:

- Se necesita feedback temprano.
- El repositorio tiene integración configurada.
- Los cambios deben validarse antes de integrarse.
- La capacidad de agentes es suficiente.

### Programado

Adecuado cuando:

- La tarea necesita ejecutarse periódicamente.
- No hay un evento de cambio que la inicie.
- El equipo puede atender resultados y fallos.

### Después de otro job

Adecuado cuando:

- Hay una dependencia real entre tareas.
- El orden importa.
- Se ha definido qué hacer ante un fallo previo.

No añadas varios disparadores sin entender cómo interactúan. Podrían provocar ejecuciones duplicadas.

## Notificaciones y comunicación

La notificación de un job debe aportar información suficiente sin exponer secretos.

### Información útil

Una notificación puede incluir:

- Nombre del job.
- Número de ejecución.
- Resultado.
- Rama o commit.
- Etapa fallida.
- Enlace a Jenkins.
- Persona o equipo responsable.
- Próximo paso esperado.

### Evitar ruido

Demasiadas notificaciones pueden hacer que las personas ignoren las importantes.

Define:

- Qué resultados generan aviso.
- Qué canal se utiliza.
- A quién se notifica.
- Qué nivel de urgencia corresponde.
- Quién mantiene la integración.

### No incluir información sensible

No incluyas en notificaciones:

- Contraseñas.
- Tokens.
- Claves privadas.
- Datos personales innecesarios.
- Logs completos sin revisión.

## Retención de ejecuciones y artefactos

Jenkins puede conservar ejecuciones y artefactos durante un tiempo limitado.

### Qué afecta la retención

- Número de ejecuciones.
- Tamaño de artefactos.
- Espacio disponible.
- Política de auditoría.
- Necesidad de investigación.
- Coste de almacenamiento.
- Configuración global de Jenkins.

### Política documentada

Una política debería explicar:

- Cuántas ejecuciones se conservan.
- Cuánto tiempo se mantienen.
- Qué artefactos se archivan.
- Qué se elimina automáticamente.
- Qué trabajos requieren retención especial.
- Quién autoriza cambios de política.

### No conservarlo todo indefinidamente

Retener todo puede agotar el almacenamiento y complicar la administración.

Eliminar demasiado pronto puede impedir investigar un problema.

Busca un equilibrio adecuado a la finalidad del job.

## Convenciones para nombrar y documentar jobs

Una convención clara facilita que el equipo entienda la estructura.

### Nombres de jobs

Un nombre puede incluir:

- Proyecto.
- Propósito.
- Rama o entorno, si ayuda.
- Tipo de validación.

Evita incluir datos secretos o nombres personales innecesarios.

### Descripción del job

Una descripción útil puede incluir:

```text
Propósito:
Repositorio:
Agente:
Disparador:
Entradas:
Artefactos:
Responsable:
Restricciones:
```

### Responsabilidad de mantenimiento

Indica qué equipo o rol mantiene:

- El pipeline.
- Las credenciales.
- El agente.
- Las dependencias.
- La documentación.
- Los avisos de fallo.

Un job sin responsable claro tiende a quedar obsoleto.

## Práctica 1: ejecutar un job existente

Esta sesión sirve para explorar sin cambiar la configuración.

### Preparación

- Inicia sesión en Jenkins con la cuenta del laboratorio.
- Confirma que la instancia es la correcta.
- Identifica un job de práctica indicado por el docente.
- No ejecutes jobs de otras personas sin permiso.

### Instrucciones

1. Abre la página del job.
2. Lee su descripción.
3. Identifica el tipo de job.
4. Busca el último resultado.
5. Anota el agente o nodo, si se muestra.
6. Inicia una ejecución solo si el docente lo indica.
7. Abre la consola.
8. Revisa el resultado final.
9. Identifica los pasos que se ejecutaron.
10. Localiza artefactos o informes, si existen.

### Hoja de observación

| Dato | Observación |
|---|---|
| Nombre del job | |
| Descripción | |
| Tipo | |
| Disparador observado | |
| Agente | |
| Número de ejecución | |
| Resultado | |
| Duración | |
| Artefactos | |
| Dudas | |

### Preguntas

- ¿Qué esperaba hacer el job?
- ¿La descripción coincidía con el comportamiento?
- ¿Dónde se ejecutaron los comandos?
- ¿Qué parte del log fue más útil?
- ¿Qué información faltaba para entender mejor el job?

## Práctica 2: crear un job Freestyle de consulta

Realiza esta actividad solo si la instancia permite crear jobs y el docente lo autoriza.

### Preparar el objetivo

El job ejecutará consultas sencillas al agente.

No instalará paquetes ni modificará archivos del sistema.

### Configuración

Crea un job con un nombre acordado, por ejemplo:

```text
practica-job-consulta
```

Añade una descripción que indique:

```text
Job educativo para consultar el agente y validar herramientas básicas.
No ejecuta despliegues ni modifica servicios.
```

Selecciona el agente de laboratorio indicado por el docente.

### Añadir comandos

En el paso de shell, si está disponible, utiliza:

```bash
echo "Inicio de la ejecución"
echo "Sistema:"
uname -s
echo "Usuario:"
whoami
echo "Directorio:"
pwd
echo "Git:"
git --version
echo "Fin de la ejecución"
```

### Ejecutar el job

1. Guarda la configuración.
2. Revisa el nombre y el agente.
3. Inicia el job.
4. Espera a que termine.
5. Abre la salida de consola.
6. Registra el resultado sin copiar información sensible.

### Reflexión

- ¿Qué usuario ejecutó el job?
- ¿Qué ruta apareció como workspace?
- ¿Git está instalado en el agente?
- ¿El resultado coincide con tu equipo local?
- ¿Qué herramienta faltaría para ejecutar pruebas reales?
- ¿Qué permisos necesita este job?

## Práctica 3: crear un job que valide un archivo local

Esta práctica utiliza un job sencillo, sin conectar un repositorio remoto.

### Preparar el contenido

En el workspace de práctica o en el repositorio local indicado, crea:

```text
app/mensaje.txt
```

Con este contenido:

```text
Práctica introductoria de Jenkins
```

No escribas el archivo manualmente dentro de una ruta del sistema que no controles.

### Comando de validación

Utiliza un comando de shell similar a:

```bash
test -f app/mensaje.txt
grep -q "Jenkins" app/mensaje.txt
```

El primer comando verifica que el archivo exista.

El segundo busca la palabra `Jenkins`.

### Interpretar el resultado

Si ambos comandos terminan correctamente, Jenkins puede marcar el paso como exitoso.

Si el archivo falta o el texto no aparece, el job puede fallar.

### Provocar un fallo

Cambia el contenido del archivo para que no incluya `Jenkins`.

Ejecuta el job otra vez y observa:

- Qué comando aparece en la consola.
- Qué código de salida se produce.
- Qué estado final muestra Jenkins.
- Qué información permitiría resolver el fallo.

### Restaurar el resultado correcto

Vuelve a escribir un texto que contenga `Jenkins`.

Ejecuta el job de nuevo y comprueba que pasa.

## Práctica 4: conectar un job con Git

Esta actividad requiere acceso a un repositorio de práctica.

### Requisitos

- La URL del repositorio.
- Una rama conocida.
- Acceso de lectura.
- Un agente con Git instalado.
- Permiso para crear o modificar el job.

### Revisar el repositorio

Antes de configurar Jenkins, comprueba:

- Que la URL es correcta.
- Que la rama existe.
- Que contiene los archivos requeridos.
- Que no incluye secretos.
- Que el `README.md` explica cómo ejecutar la validación.

### Configurar el origen del código

En el job, selecciona el sistema de control de versiones disponible y proporciona:

- La URL del repositorio.
- La rama indicada.
- La credencial autorizada, si hace falta.

No añadas el token directamente a la URL.

### Añadir una validación

Después de obtener el código, ejecuta:

```bash
test -f README.md
```

Si el repositorio contiene un script de validación, ejecútalo siguiendo su documentación.

### Confirmar la revisión

Después de la ejecución, identifica:

- La rama.
- El commit.
- El mensaje del commit, si aparece.
- La ruta del workspace.
- La salida de la validación.

### Preguntas

- ¿Qué revisión del código se obtuvo?
- ¿Cómo podrías confirmar que Jenkins ejecutó el commit esperado?
- ¿Qué diferencia hay entre clonar localmente y obtener código en el job?
- ¿Qué permiso necesita Jenkins sobre el repositorio?
- ¿Qué harías si el repositorio es privado?

## Práctica 5: crear un pipeline en un `Jenkinsfile`

Esta práctica utiliza un repositorio de laboratorio que contiene `Jenkinsfile`.

### Crear estructura local

```bash
mkdir -p "$HOME/practicas-devops/job-pipeline"
cd "$HOME/practicas-devops/job-pipeline"
mkdir -p app scripts
```

Crea un archivo:

```bash
printf 'Ejercicio de pipeline Jenkins\n' > app/mensaje.txt
```

Crea un script:

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: no existe $ARCHIVO"
  exit 1
fi

if grep -q "Jenkins" "$ARCHIVO"; then
  echo "OK: se encontró Jenkins"
else
  echo "ERROR: no se encontró Jenkins"
  exit 1
fi
EOF
```

Hazlo ejecutable:

```bash
chmod +x scripts/validar.sh
```

### Crear el `Jenkinsfile`

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar estructura') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Validar contenido') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }

        stage('Preparar artefacto') {
            steps {
                sh 'mkdir -p salida'
                sh 'cp app/mensaje.txt salida/mensaje.txt'
                archiveArtifacts artifacts: 'salida/mensaje.txt',
                                 fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'El job ha terminado correctamente.'
        }

        failure {
            echo 'El job ha fallado. Consulta la consola.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

### Revisar el pipeline

Identifica:

- Qué agente ejecuta los pasos.
- Qué comprueba la primera etapa.
- Qué hace el script.
- Cuándo se crea el directorio `salida`.
- Qué archivo se archiva.
- Qué mensajes aparecen ante éxito y fallo.

### Guardar en Git

Desde la raíz del proyecto:

```bash
git init
git add app scripts Jenkinsfile
git status
```

Configura la identidad si hace falta:

```bash
git config user.name "Nombre del alumno"
git config user.email "alumno@example.com"
```

Crea un commit:

```bash
git commit -m "Añade pipeline de validación"
```

### Ejecutar desde Jenkins

Sigue la configuración proporcionada por el docente para apuntar al repositorio y al `Jenkinsfile`.

Confirma que el agente tiene Bash y los permisos necesarios para escribir en el workspace.

### Resultado esperado

Una ejecución correcta debería:

- Obtener los archivos.
- Superar las comprobaciones.
- Ejecutar el script.
- Crear `salida/mensaje.txt`.
- Archivar el artefacto.
- Mostrar el resultado final.

## Práctica 6: utilizar parámetros no sensibles

Los parámetros permiten variar una ejecución sin cambiar el pipeline.

Esta práctica debe limitarse a valores de laboratorio no sensibles.

### Ejemplo de parámetros posibles

- `MENSAJE`: texto corto utilizado en una validación.
- `MODO`: opción entre `simple` y `detallado`.
- `EJECUTAR_EXTRA`: opción booleana.

### Diseño seguro

Antes de utilizar un parámetro:

- Define los valores permitidos.
- Valida su contenido.
- Evita insertarlo directamente en comandos sin control.
- No permitas que indique un servidor de producción.
- No aceptes credenciales como texto común.

### Preguntas para diseñar un parámetro

- ¿Qué problema resuelve?
- ¿Cuál es el valor predeterminado?
- ¿Qué valores son válidos?
- ¿Qué debería suceder si llega un valor incorrecto?
- ¿Puede el parámetro provocar una operación destructiva?
- ¿Contiene información sensible?

## Práctica 7: diagnosticar un job fallido

Esta actividad utiliza una ejecución fallida de laboratorio o un ejemplo preparado por el docente.

### Leer la consola de manera ordenada

1. Identifica el número de ejecución.
2. Comprueba la hora y duración.
3. Busca la primera etapa que no terminó.
4. Localiza el comando fallido.
5. Lee las líneas anteriores y posteriores.
6. Comprueba el código de salida.
7. Identifica el agente.
8. Anota la causa probable.
9. Propón una comprobación adicional.
10. Evita volver a ejecutar hasta entender qué ocurrió.

### Plantilla de diagnóstico

```text
Job:
Ejecución:
Resultado:
Agente:
Etapa:
Comando:
Mensaje principal:
Resultado esperado:
Resultado observado:
Hipótesis:
Próxima comprobación:
```

### Causas frecuentes

- Archivo inexistente.
- Herramienta no instalada.
- Permiso de ejecución ausente.
- Directorio incorrecto.
- Error de red.
- Credencial no configurada.
- Rama o commit equivocado.
- Prueba inestable.
- Agente desconectado.
- Espacio de disco insuficiente.

### Comunicar el problema

Al compartir el diagnóstico, elimina:

- Contraseñas.
- Tokens.
- Claves.
- Direcciones privadas innecesarias.
- Datos personales.
- Logs con información sensible.

## Práctica 8: archivar y localizar un artefacto

Esta práctica enseña a diferenciar la salida temporal del workspace de un artefacto archivado.

### Preparar un archivo de salida

El pipeline puede crear un archivo:

```bash
mkdir -p salida
printf 'Resultado de práctica\n' > salida/resultado.txt
```

### Archivar el archivo

En un pipeline, una acción de archivado puede utilizar:

```groovy
archiveArtifacts artifacts: 'salida/resultado.txt',
                 fingerprint: true
```

### Consultar el artefacto

Después de una ejecución exitosa:

1. Abre la página de la ejecución.
2. Busca la sección de artefactos.
3. Comprueba el nombre del archivo.
4. Descárgalo si la práctica lo permite.
5. Compara su contenido con la salida del job.
6. Anota la política de retención, si se conoce.

### Preguntas

- ¿Dónde estaba el archivo antes de archivarse?
- ¿Qué diferencia hay entre el workspace y el artefacto?
- ¿Cuánto tiempo se conserva el artefacto?
- ¿Qué identificador relaciona el artefacto con la ejecución?
- ¿Qué información convendría añadir para identificar su origen?

## Práctica 9: comparar job Freestyle y pipeline

Analiza dos implementaciones de la misma validación.

### Implementación Freestyle

Los pasos se configuran desde la interfaz.

Ventajas posibles:

- Inicio rápido.
- Interfaz sencilla para tareas pequeñas.
- Adecuado para introducir conceptos.

Limitaciones posibles:

- La configuración puede quedar menos visible para el equipo.
- Revisar diferencias puede requerir entrar en Jenkins.
- Reproducir la configuración puede ser más difícil.
- Un cambio de interfaz o plugin puede afectar al job.

### Implementación Pipeline

La definición se conserva en un `Jenkinsfile`.

Ventajas posibles:

- El flujo puede revisarse con Git.
- Los cambios quedan asociados al historial.
- Es más fácil expresar varias etapas.
- Se puede documentar junto al proyecto.

Limitaciones posibles:

- El código también requiere mantenimiento.
- Puede depender de agentes y plugins.
- Un error de sintaxis puede impedir la ejecución.
- Las credenciales siguen requiriendo configuración segura.

### Tabla de comparación

| Aspecto | Freestyle | Pipeline |
|---|---|---|
| Ubicación de configuración | Interfaz de Jenkins | Habitualmente `Jenkinsfile` |
| Facilidad inicial | Alta para tareas simples | Requiere conocer la sintaxis |
| Revisión en Git | Limitada, salvo configuración adicional | Habitual |
| Etapas explícitas | Según configuración | Parte central del flujo |
| Adecuado para | Ejercicios sencillos | Flujos versionados y complejos |
| Requiere credenciales seguras | Sí, cuando corresponda | Sí, cuando corresponda |

### Preguntas

- ¿Cuál elegirías para una práctica de una sola comprobación?
- ¿Cuál elegirías para un flujo de varias etapas que debe revisarse en Git?
- ¿Qué condiciones del equipo influirían en la decisión?
- ¿Qué opción necesita más documentación?
- ¿Qué opción facilita revisar cambios del proceso?

## Problemas frecuentes con jobs

### El job queda esperando un ejecutor

Puede que no haya agentes disponibles.

Comprueba:

- Si el agente está conectado.
- Si la etiqueta requerida existe.
- Si otras tareas ocupan los ejecutores.
- Si el job solicita una capacidad que ningún agente ofrece.
- Si hay un límite de concurrencia.

No cambies la configuración global para resolver una espera sin autorización.

### El job no encuentra el repositorio

Comprueba:

- URL.
- Rama.
- Acceso de red.
- Credenciales.
- Permisos de lectura.
- Configuración del plugin de Git.
- Reglas del proxy o VPN.

### El comando funciona localmente, pero falla en Jenkins

Compara:

- Sistema operativo.
- Shell.
- Versiones de herramientas.
- Directorio actual.
- Permisos.
- Dependencias.
- Variables de entorno.
- Archivos no confirmados localmente.

### No se conserva un archivo

Comprueba:

- Si el job lo genera.
- Si la ruta es correcta.
- Si la ruta coincide con el patrón de archivado.
- Si el paso de archivado se ejecuta.
- Si la ejecución falla antes de llegar a ese paso.
- Si la política de retención lo elimina después.

### El job termina con éxito aunque una comprobación falle

Revisa:

- El código de salida del script.
- Si los errores se ignoran.
- Si se utilizan operadores que ocultan fallos.
- Si el comando de prueba está correctamente escrito.
- Si el pipeline transforma el resultado.
- Si la condición de éxito es demasiado permisiva.

### El job siempre falla en una prueba

Comprueba:

- Que la prueba sea reproducible.
- Que los datos de prueba estén disponibles.
- Que las dependencias respondan.
- Que el agente tenga recursos.
- Que el cambio realmente sea el origen del fallo.
- Que la prueba no dependa de tiempo u orden de ejecución.

### El job falla al archivar artefactos

Comprueba:

- Que el archivo exista.
- Que el patrón de rutas coincida.
- Que el archivo se cree antes del archivado.
- Que Jenkins tenga acceso al workspace.
- Que la ejecución llegue a la etapa correspondiente.
- Que el espacio de almacenamiento no esté agotado.

### El job utiliza una rama inesperada

Comprueba:

- La configuración de la rama.
- Los parámetros de la ejecución.
- El evento que disparó el job.
- La revisión obtenida.
- El historial de cambios.
- La configuración de un pipeline multibranch, si aplica.

## Solución de problemas con criterio

Cuando un job falla, evita cambiar varias cosas a la vez.

### Proceso recomendado

1. Reproduce o localiza la ejecución.
2. Consulta la salida de consola.
3. Identifica la primera causa probable.
4. Compara la ejecución con una anterior que pasó.
5. Comprueba los cambios de código y configuración.
6. Formula una hipótesis.
7. Cambia una variable de forma controlada.
8. Vuelve a ejecutar.
9. Registra el resultado.
10. Documenta la solución.

### Diferenciar síntoma y causa

Ejemplo:

- **Síntoma:** el job no puede generar el artefacto.
- **Causa posible:** el comando de construcción falló antes.
- **Causa anterior:** faltaba una dependencia.
- **Causa de proceso:** la dependencia no estaba documentada ni instalada en el agente.

Resolver el último mensaje visible no siempre resuelve la causa original.

### Pedir ayuda con evidencia

Incluye:

- Nombre del job.
- Número de ejecución.
- Etapa fallida.
- Mensaje relevante.
- Comando ejecutado.
- Agente.
- Resultado esperado.
- Cambios recientes.
- Pasos de reproducción.

Oculta secretos y datos sensibles.

## Buenas prácticas para jobs mantenibles

### Una tarea principal por job

Un job suele ser más fácil de mantener si tiene un propósito definido.

Evita combinar tareas independientes sin una razón clara.

### Entradas explícitas

Documenta:

- Repositorio.
- Rama.
- Parámetros.
- Variables.
- Agente.
- Dependencias.
- Credenciales autorizadas.

### Salidas identificables

Identifica:

- Informes.
- Artefactos.
- Logs.
- Commit de origen.
- Número de ejecución.
- Entorno de destino.

### Fallos visibles

No ignores errores sin documentar por qué.

Una ejecución debería fallar claramente cuando una condición esencial no se cumple.

### Mensajes comprensibles

Prefiere:

```text
ERROR: falta app/mensaje.txt
```

a un fallo que solo muestra un código sin contexto.

### Responsabilidad clara

Indica quién mantiene:

- El job.
- El `Jenkinsfile`.
- El agente.
- Los scripts.
- Las credenciales.
- La documentación.

### Revisiones periódicas

Comprueba:

- Si el job todavía se usa.
- Si la descripción sigue siendo correcta.
- Si las dependencias están vigentes.
- Si las credenciales siguen siendo necesarias.
- Si el consumo de recursos es razonable.
- Si los artefactos se conservan durante el tiempo adecuado.

## Errores de diseño que conviene evitar

### Job con nombre genérico

Un nombre como `test` no explica el propósito ni ayuda a localizarlo.

### Job que mezcla tareas no relacionadas

Dificulta saber qué responsabilidad tiene cada etapa y qué causó el fallo.

### Dependencia de archivos del agente

Si un archivo existe solo en un agente, el job no puede reproducirse en otro.

Incluye el archivo en el repositorio o documenta cómo se proporciona mediante el mecanismo aprobado.

### Uso de rutas personales

Evita rutas que solo existen en una cuenta concreta, como una carpeta de escritorio personal.

Utiliza rutas del workspace o valores configurados de manera explícita.

### Credenciales en comandos

No incluyas contraseñas o tokens en el texto del comando.

Los comandos pueden aparecer en la consola o en el historial.

### Ignorar fallos de pruebas

Un pipeline que marca como exitoso un proceso con pruebas fallidas reduce la confianza del equipo.

Si una prueba es informativa y no bloqueante, deja esa decisión explícita y revisable.

### Acumular plugins sin revisar

Los plugins amplían capacidades, pero también aumentan mantenimiento y superficie de riesgo.

Instala solo los necesarios y sigue la política de la instancia.

## Una ficha para documentar un job

Utiliza esta plantilla en una documentación de proyecto.

```text
Nombre:
Propósito:
Equipo responsable:
Tipo de job:
Repositorio:
Rama o revisión:
Disparador:
Agente:
Herramientas requeridas:
Parámetros:
Credenciales referenciadas:
Etapas:
Artefactos:
Informes:
Retención:
Permisos:
Restricciones:
Procedimiento ante fallo:
Última revisión:
```

### Ejemplo de ficha

```text
Nombre:
validar-mensaje-laboratorio

Propósito:
Comprobar que el archivo de práctica contiene el texto esperado.

Equipo responsable:
Grupo de laboratorio.

Tipo de job:
Pipeline.

Repositorio:
Repositorio de práctica indicado por el docente.

Disparador:
Manual durante la sesión.

Agente:
Agente Linux de laboratorio.

Herramientas requeridas:
Bash, grep y Git.

Artefactos:
Copia del archivo validado.

Permisos:
Lectura del repositorio y escritura en el workspace.

Restricciones:
No despliega ni utiliza credenciales.

Procedimiento ante fallo:
Consultar consola, verificar contenido y volver a ejecutar tras corregir.
```

La ficha evita depender de la memoria de quien creó el job.

## Evaluación de un job

Al revisar un job, considera cuatro dimensiones.

### Propósito

- ¿Resuelve un problema identificable?
- ¿El nombre representa la tarea?
- ¿La descripción está actualizada?
- ¿El resultado sirve a alguien?

### Reproducibilidad

- ¿Se conoce el commit?
- ¿Se conocen las herramientas requeridas?
- ¿Las entradas están definidas?
- ¿El agente está identificado?
- ¿El workspace parte de un estado conocido?

### Seguridad

- ¿Los permisos son mínimos?
- ¿Hay secretos expuestos?
- ¿El agente está aislado?
- ¿Los comandos pueden afectar sistemas externos?
- ¿El job está limitado al entorno previsto?

### Mantenimiento

- ¿Hay una persona o equipo responsable?
- ¿Las dependencias se revisan?
- ¿Los fallos se entienden?
- ¿Los artefactos se gestionan?
- ¿La documentación coincide con la configuración?

## Preguntas de repaso

1. ¿Qué diferencia hay entre un job y una ejecución?
2. ¿Qué es un workspace?
3. ¿Qué diferencia hay entre un workspace y un artefacto?
4. ¿Qué función tiene un agente?
5. ¿Qué información puede incluir el historial de un job?
6. ¿Qué puede hacer que una ejecución quede inestable?
7. ¿Qué significa que un job quede abortado?
8. ¿Qué diferencia hay entre iniciar un job manualmente y utilizar un disparador?
9. ¿Por qué un job debe tener un nombre descriptivo?
10. ¿Por qué no conviene usar parámetros de texto para contraseñas?
11. ¿Qué información permite relacionar una ejecución con el código utilizado?
12. ¿Qué diferencia hay entre Freestyle y Pipeline?
13. ¿Por qué un `Jenkinsfile` debe revisarse como código?
14. ¿Qué debería comprobarse si Jenkins no encuentra el repositorio?
15. ¿Qué información se debe ocultar al compartir un log?
16. ¿Por qué no se debe asumir que el workspace es persistente?
17. ¿Qué permisos necesita un agente para validar un archivo?
18. ¿Por qué un job exitoso no garantiza que la aplicación sea perfecta?
19. ¿Qué debe ocurrir si una comprobación esencial falla?
20. ¿Cómo se documenta una ejecución para que otra persona pueda reproducirla?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Un job es una configuración; una ejecución es una instancia concreta de ese trabajo».

### Afirmación 2

«El workspace es siempre un almacenamiento permanente».

### Afirmación 3

«Un job puede ejecutarse en un agente diferente del controlador».

### Afirmación 4

«Si un job termina en verde, sabemos que todas las funciones del producto funcionan».

### Afirmación 5

«Un parámetro de texto es una forma adecuada de introducir una contraseña».

### Afirmación 6

«Un pipeline puede estar definido en un `Jenkinsfile` versionado con el proyecto».

### Afirmación 7

«Un job programado debe tener una razón, un responsable y un resultado esperado».

### Afirmación 8

«Archivar un artefacto significa que ya se desplegó a producción».

### Afirmación 9

«Un agente debe tener los permisos necesarios para su tarea, pero no más».

### Afirmación 10

«Un código de salida distinto de cero suele indicar que un comando falló».

### Afirmación 11

«Un job que valida código externo debería tratarse con precaución».

### Afirmación 12

«Si Jenkins no encuentra un archivo, se puede resolver ejecutando el job desde una ruta personal».

### Afirmación 13

«El resultado de una ejecución debe relacionarse con la revisión de código que procesó».

### Afirmación 14

«Una notificación útil debe evitar incluir secretos».

### Afirmación 15

«Los logs de consola sirven para investigar fallos, pero pueden contener datos sensibles».

## Respuestas orientativas del ejercicio

### Afirmación 1

**Correcta.** El job describe la configuración y la ejecución representa una instancia.

### Afirmación 2

**Incorrecta.** El workspace puede limpiarse o reutilizarse.

### Afirmación 3

**Correcta.** Jenkins puede distribuir tareas entre agentes.

### Afirmación 4

**Incorrecta.** Solo sabemos que las comprobaciones configuradas terminaron según sus reglas.

### Afirmación 5

**Incorrecta.** Las contraseñas deben utilizar un mecanismo seguro de credenciales.

### Afirmación 6

**Correcta.** Es una forma habitual de definir un pipeline como código.

### Afirmación 7

**Correcta.** Una programación no debe producir ejecuciones sin propósito o seguimiento.

### Afirmación 8

**Incorrecta.** Archivar conserva un archivo; el despliegue es una acción diferente.

### Afirmación 9

**Correcta.** Es el principio de mínimo privilegio.

### Afirmación 10

**Correcta.** Es una convención común en comandos y shells.

### Afirmación 11

**Correcta.** El código ejecutado puede modificar el agente o acceder a recursos disponibles.

### Afirmación 12

**Incorrecta.** Las rutas personales dificultan la reproducibilidad. Usa el workspace y documenta las entradas.

### Afirmación 13

**Correcta.** La trazabilidad ayuda a investigar y reproducir resultados.

### Afirmación 14

**Correcta.** Las notificaciones deben aportar contexto sin exponer credenciales.

### Afirmación 15

**Correcta.** Los logs son útiles, pero deben revisarse antes de compartirlos.

## Glosario

- **Agente:** nodo donde Jenkins ejecuta pasos.
- **Artefacto:** archivo generado y conservado por una ejecución.
- **Build:** término habitual para una ejecución o construcción en Jenkins.
- **Disparador:** evento o condición que inicia un job.
- **Ejecutor:** capacidad de un nodo para ejecutar tareas.
- **Ejecución:** instancia concreta de un job.
- **Freestyle:** tipo de job cuya configuración suele realizarse desde la interfaz.
- **Job:** configuración guardada que describe una tarea automatizada.
- **Jenkinsfile:** archivo que define un pipeline de Jenkins como código.
- **Log de consola:** salida de los comandos y pasos de una ejecución.
- **Parámetro:** valor que se proporciona al iniciar una ejecución.
- **Pipeline:** secuencia de etapas y pasos automatizados.
- **Post:** conjunto de acciones que pueden ejecutarse según el resultado del pipeline.
- **Resultado:** estado final de una ejecución, como éxito, fallo o cancelación.
- **Stage o etapa:** grupo lógico de pasos de un pipeline.
- **Step o paso:** acción concreta dentro de un job o una etapa.
- **Workspace:** directorio de trabajo usado por una ejecución.
- **Multibranch Pipeline:** job que descubre ramas y ejecuta pipelines asociados a ellas.

## Resumen

- Un **job** es una configuración que describe una tarea automatizada.
- Una **ejecución** es una instancia concreta de ese job.
- Un **pipeline** organiza tareas en etapas y pasos.
- Un **agente** ejecuta los comandos; no tiene por qué ser el controlador.
- El **workspace** contiene archivos temporales y no debe asumirse como almacenamiento permanente.
- Los **artefactos** se conservan mediante acciones explícitas y no equivalen a un despliegue.
- Los disparadores pueden ser manuales, programados o estar relacionados con cambios en Git.
- Los parámetros deben validarse y no deben utilizarse para exponer secretos.
- El job y sus logs deben permitir relacionar el resultado con el código y el agente usados.
- Todo job debe tener un propósito claro, permisos limitados y una persona o equipo responsable.