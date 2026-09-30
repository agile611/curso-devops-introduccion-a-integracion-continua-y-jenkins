# Práctica de configuración básica de Jenkins

Esta práctica guía la puesta en marcha inicial de Jenkins en un entorno de laboratorio. El alumnado revisará la instalación, completará la configuración inicial, creará una cuenta administrativa, instalará los plugins necesarios y comprobará que Jenkins puede ejecutar un primer job sencillo.

El objetivo no es configurar una instancia de producción desde cero ni modificar un servidor compartido sin autorización. Se trabajará con un entorno aislado, valores de prueba y permisos limitados. La interfaz, los nombres de menús y algunas opciones pueden variar según la versión y el método de instalación.

> **Seguridad:** no compartas contraseñas, tokens ni archivos de credenciales en el repositorio, el `Jenkinsfile`, la consola o las capturas. No desactives la autenticación ni abras Jenkins a Internet para facilitar la práctica. Los cambios en instancias compartidas requieren autorización del administrador.

## Esquema de la página

- ## Objetivos y alcance
  - ### Resultados de aprendizaje
  - ### Qué se configurará
  - ### Qué no se hará
- ## Conceptos básicos
  - ### Jenkins y sus componentes
  - ### Controlador, agente y job
  - ### Interfaz, consola e historial
- ## Preparación del laboratorio
  - ### Requisitos
  - ### Datos de la instancia
  - ### Reglas de seguridad
- ## Primer acceso
  - ### Asistente de configuración inicial
  - ### Cuenta administrativa
  - ### URL de Jenkins
  - ### Comprobaciones iniciales
- ## Configuración básica de la instancia
  - ### Plugins
  - ### Herramientas globales
  - ### Nodos y agentes
  - ### Credenciales de laboratorio
  - ### Seguridad de acceso
  - ### Ubicación y zona horaria
- ## Primer job
  - ### Crear un job Freestyle
  - ### Ejecutar una comprobación
  - ### Revisar consola e historial
  - ### Modificar y volver a ejecutar
- ## Primer pipeline
  - ### Crear un `Jenkinsfile`
  - ### Etapas, pasos y resultado
  - ### Pipeline desde SCM
- ## Sesiones prácticas
  - ### Exploración guiada
  - ### Crear un job
  - ### Configurar un pipeline
  - ### Diagnosticar fallos
  - ### Revisar seguridad
- ## Mantenimiento y diagnóstico
  - ### Logs y errores habituales
  - ### Copias de seguridad y actualizaciones
  - ### Checklist y evaluación
  - ### Glosario y síntesis

---

## Objetivos y alcance

La configuración básica establece una base funcional para practicar jobs y pipelines sin alterar una instalación compartida.

### Resultados de aprendizaje

Al completar la práctica, podrás:

- Explicar para qué sirve Jenkins en un flujo de integración continua.
- Diferenciar controlador, agente, job, build y workspace.
- Acceder a la interfaz web de Jenkins.
- Completar la configuración inicial de una instancia de laboratorio.
- Reconocer la función de los plugins.
- Identificar dónde se configuran herramientas y nodos.
- Crear un job de prueba.
- Ejecutar una comprobación simple.
- Leer la salida de consola.
- Reconocer estados de ejecución habituales.
- Crear un pipeline declarativo básico.
- Identificar credenciales y datos que no se deben publicar.
- Comunicar un fallo con información útil y segura.

### Qué se configurará

La práctica se divide en etapas:

1. Revisar el acceso y la versión.
2. Completar, si corresponde, el asistente inicial.
3. Crear o verificar una cuenta administrativa de laboratorio.
4. Revisar la URL configurada.
5. Comprobar plugins y herramientas.
6. Identificar el agente disponible.
7. Crear un job Freestyle sencillo.
8. Crear un pipeline mínimo.
9. Revisar los logs y resultados.
10. Entregar evidencias no sensibles.

### Qué no se hará

En esta práctica no:

- Se configurará Jenkins para producción.
- Se abrirá el servidor a Internet.
- Se desactivará la autenticación.
- Se instalarán plugins sin autorización.
- Se cambiarán permisos globales.
- Se crearán cuentas administrativas en un servidor compartido.
- Se guardarán secretos en el `Jenkinsfile`.
- Se desplegarán aplicaciones.
- Se modificarán servidores externos.
- Se ejecutarán comandos destructivos.
- Se realizarán copias de seguridad del controlador sin un procedimiento aprobado.

### Alcance de los ejemplos

Los ejemplos están pensados para un Jenkins de laboratorio.

Algunas instrucciones usan comandos Unix mediante `sh`.

En un agente Windows, puede ser necesario usar `bat` o PowerShell.

Los nombres de menús y pantallas pueden cambiar según la versión de Jenkins y los plugins instalados.

### Configuración básica y configuración de producción

Una instancia de laboratorio puede ser sencilla, pero no debe confundirse con una instalación lista para producción.

Un entorno de producción puede requerir:

- Autenticación corporativa.
- Autorización basada en roles.
- TLS y certificados.
- Agentes aislados.
- Políticas de credenciales.
- Copias de seguridad verificadas.
- Monitorización.
- Gestión de actualizaciones.
- Registro de auditoría.
- Procedimientos de recuperación.

La práctica presenta los conceptos sin sustituir las políticas de la organización.

---

## Conceptos básicos

Antes de cambiar ajustes, conviene saber qué componentes se están configurando.

### Jenkins

Jenkins es una plataforma de automatización.

Permite definir y ejecutar trabajos como:

- Compilaciones.
- Pruebas.
- Análisis.
- Creación de artefactos.
- Publicaciones autorizadas.
- Tareas programadas.

Jenkins coordina estos pasos mediante jobs y pipelines.

### Controlador

El controlador de Jenkins administra:

- La interfaz web.
- La configuración de la instancia.
- Las colas de tareas.
- La definición de jobs.
- El historial de builds.
- La coordinación de agentes.

El controlador no siempre ejecuta directamente todos los pasos del proyecto.

### Agente

Un agente es un nodo que ejecuta los pasos asignados por Jenkins.

Puede ser:

- El propio controlador, en un laboratorio pequeño.
- Una máquina dedicada.
- Una máquina virtual.
- Un contenedor.
- Un nodo efímero configurado por un plugin.

Los agentes pueden tener herramientas, sistemas operativos y permisos distintos.

### No usar el controlador como agente sin criterio

En instalaciones pequeñas puede estar permitido ejecutar tareas en el controlador.

En entornos compartidos o de producción, ejecutar código de jobs en el controlador puede aumentar el riesgo y afectar su estabilidad.

Sigue la política de la instancia.

### Job

Un job es una unidad de trabajo configurada en Jenkins.

Puede ser:

- Un job Freestyle.
- Un Pipeline.
- Un job Multibranch.
- Otro tipo proporcionado por un plugin.

Cada tipo tiene capacidades y formas de configuración distintas.

### Build o ejecución

Un build es una ejecución concreta de un job.

Una misma configuración puede tener muchas ejecuciones:

```text
Job: practica-basica
Build: #1
Build: #2
Build: #3
```

Cada ejecución puede tener su resultado, log y artefactos asociados.

### Workspace

El workspace es el directorio de trabajo de una ejecución en un agente.

Puede contener:

- Código obtenido del repositorio.
- Archivos generados.
- Informes.
- Archivos temporales.

No lo consideres almacenamiento permanente.

### Consola de un build

La consola muestra mensajes de los pasos ejecutados.

Se utiliza para:

- Revisar comandos.
- Encontrar errores.
- Identificar el primer paso fallido.
- Confirmar la secuencia del pipeline.

La consola puede contener datos sensibles si los scripts los imprimen.

Revisa el contenido antes de compartirlo.

### Estados de ejecución

Jenkins suele presentar estados como:

- `SUCCESS`: el flujo configurado terminó correctamente.
- `FAILURE`: una acción relevante falló.
- `UNSTABLE`: el resultado requiere atención, aunque el flujo haya continuado.
- `ABORTED`: la ejecución se interrumpió.
- Etapa omitida: la etapa no se ejecutó, por ejemplo por una condición.

El significado concreto puede depender de plugins y políticas.

### Plugins

Los plugins amplían Jenkins.

Pueden añadir:

- Tipos de jobs.
- Integraciones con sistemas de control de versiones.
- Publicación de informes.
- Herramientas.
- Notificaciones.
- Agentes en contenedores.
- Credenciales.

Cada plugin añade código, dependencias y posibles necesidades de mantenimiento.

Instala solo los plugins aprobados.

### Configuración global y configuración de job

La configuración global afecta a la instancia o a muchos jobs.

La configuración de un job afecta a una unidad de trabajo concreta.

Antes de modificar una opción, identifica su alcance.

### Jenkins como servicio

Jenkins puede ejecutarse como un servicio del sistema, en un contenedor o mediante otro método.

La instalación condiciona:

- Dónde se guardan los datos.
- Cómo se reinicia.
- Cómo se consultan los logs.
- Quién actualiza el servicio.
- Qué procedimiento de copia se aplica.

No asumas que todas las instancias se administran igual.

---

## Preparación del laboratorio

Antes del primer acceso, reúne la información necesaria y confirma que el entorno es el correcto.

### Requisitos

Necesitarás:

- Una instancia Jenkins autorizada para el curso.
- Una URL o dirección de acceso proporcionada por el docente.
- Una cuenta de laboratorio, si el administrador ya la creó.
- Un navegador compatible.
- Acceso al repositorio de práctica, si se usará.
- Un agente disponible para el job.
- Permiso para crear jobs en la carpeta de laboratorio.

### No crear cuentas en una instancia compartida

Si Jenkins solicita el asistente inicial en una instancia que se supone compartida:

- Detente.
- No inventes una cuenta.
- No sobrescribas configuraciones.
- Confirma con el docente o administrador que estás en el servidor correcto.

El asistente inicial debería aparecer solo en una instalación que aún no se ha configurado.

### Datos de la instancia

Registra solo información no sensible:

```text
Nombre o identificador del laboratorio:
Versión aproximada de Jenkins:
URL de acceso autorizada:
Carpeta de trabajo:
Agente disponible:
Job de práctica:
Responsable de soporte:
```

No publiques en la entrega:

- Contraseñas.
- Tokens.
- Claves privadas.
- Datos de sesión.
- Direcciones internas restringidas.
- Información personal innecesaria.

### Reglas de seguridad

Antes de cambiar ajustes:

- Confirma que el job es de práctica.
- Comprueba el nombre de la carpeta.
- Revisa la rama del repositorio.
- No guardes credenciales en texto.
- No abras permisos para todo el mundo.
- No cambies la configuración global sin autorización.
- No ejecutes comandos destructivos.
- No instales plugins por tu cuenta.
- No compartas sesiones ni cookies.

### Navegador y conexión

Accede usando la dirección entregada por el curso.

Comprueba:

- Que el dominio o la dirección coinciden con la documentación.
- Que el navegador muestra la conexión esperada.
- Que no estás en una página falsa o desconocida.
- Que el certificado y el protocolo corresponden al entorno indicado.

Si aparece un aviso de certificado inesperado, no lo ignores automáticamente.

Consulta al responsable del laboratorio.

### Anotar el contexto

Para que un diagnóstico sea útil, conserva:

- Nombre del job.
- Número del build.
- Rama.
- Commit, si existe.
- Agente.
- Primera etapa fallida.
- Mensaje de error no sensible.
- Resultado final.

---

## Primer acceso

La configuración inicial se realiza una sola vez en una instalación nueva y debe gestionarla una persona autorizada.

### Asistente de configuración inicial

En una instalación recién iniciada, Jenkins puede presentar un asistente de configuración.

El asistente puede solicitar:

- La ruta al archivo de desbloqueo.
- Instalación de plugins sugeridos.
- Creación de una cuenta administrativa.
- Configuración de la URL de Jenkins.

La pantalla y el orden varían según la versión.

### Archivo de desbloqueo

El archivo de desbloqueo contiene un secreto inicial de instalación.

Debe obtenerlo solo la persona autorizada, directamente en el servidor o mediante el procedimiento aprobado.

No lo copies a:

- Un repositorio.
- Un documento de clase compartido.
- Un chat público.
- Una captura.
- Un archivo de entrega.

### Si no tienes acceso al archivo

No intentes adivinar su contenido.

No busques el archivo en otra máquina.

Pide al administrador que complete el asistente o que proporcione el acceso correspondiente.

### Instalar plugins sugeridos

El asistente puede ofrecer plugins recomendados.

En un laboratorio preparado, puede ser adecuado aceptar el conjunto aprobado.

Si el administrador ya creó la instancia, no vuelvas a ejecutar el proceso inicial.

### Plugins sugeridos y selección manual

La selección automática puede ayudar a empezar.

La instalación manual permite limitar las funciones a lo necesario.

En ambos casos, verifica:

- Qué plugin se instalará.
- Quién lo mantiene.
- Si es compatible con la versión.
- Qué permisos requiere.
- Si la instancia lo necesita.

### Crear una cuenta administrativa

La cuenta de administración debe tener:

- Un nombre de usuario no compartido.
- Una contraseña fuerte o un método de autenticación aprobado.
- Acceso limitado a la instancia correspondiente.
- Autenticación multifactor, si la organización la admite.

No uses contraseñas como:

```text
admin
password
jenkins
123456
```

No reutilices una contraseña personal.

### Contraseña de laboratorio

Si el curso proporciona una cuenta, utiliza solo el método de acceso indicado.

No reemplaces la contraseña de una cuenta compartida sin autorización.

No compartas credenciales entre estudiantes.

### Guardar credenciales de forma segura

Utiliza un gestor de contraseñas aprobado o el mecanismo indicado por el centro.

No guardes una contraseña en:

- El `Jenkinsfile`.
- Un archivo `.txt`.
- Un formulario del repositorio.
- Un comentario de código.
- Una captura de pantalla.
- Un mensaje de consola.

### URL de Jenkins

La URL configurada se usa en enlaces, notificaciones y otras funciones.

Puede adoptar una forma como:

```text
https://jenkins.laboratorio.example/
```

La dirección real la proporciona el administrador.

No inventes un dominio ni cambies la URL global en una instancia compartida.

### Comprobar la URL

Verifica que:

- La URL coincide con la del navegador.
- El protocolo es el esperado.
- El nombre resuelve correctamente.
- No aparecen redirecciones desconocidas.
- Los enlaces generados por Jenkins apuntan al dominio correcto.

### Terminar el asistente

Cuando la cuenta y la configuración inicial estén completas:

- Comprueba que puedes iniciar sesión.
- Revisa la página principal.
- Confirma que la carpeta de laboratorio está disponible.
- Anota la versión visible, si la política permite compartirla.
- Cierra sesión si usas un equipo compartido.

### Cambiar de usuario con cuidado

Si el navegador conserva una sesión anterior:

- Comprueba el usuario que aparece.
- No ejecutes cambios administrativos bajo una cuenta que no te corresponde.
- Cierra sesión antes de iniciar con otra cuenta.
- No compartas el perfil del navegador con otros estudiantes.

---

## Comprobaciones iniciales

Antes de crear un job, verifica que Jenkins está listo para el laboratorio.

### Revisar la página principal

Comprueba:

- Que el acceso funciona.
- Que aparece el usuario esperado.
- Que puedes ver la carpeta asignada.
- Que no aparece un mensaje de mantenimiento o avería.
- Que el menú de creación de jobs está disponible para tu rol.

### Revisar la versión

La versión puede encontrarse en páginas de administración o información del sistema, según la configuración.

Si no tienes permisos, pregunta al docente.

La versión ayuda a interpretar diferencias en menús y sintaxis.

### Revisar la hora

La hora de Jenkins puede ser distinta a la del navegador.

Los logs pueden usar la zona horaria de la instancia o del agente.

Anota la zona horaria indicada por el curso antes de comparar timestamps.

### Revisar salud del agente

Comprueba si hay un agente disponible para las prácticas.

Si el controlador aparece como el único nodo, sigue la política del laboratorio.

No cambies ejecutores ni etiquetas globales.

### Permisos del estudiante

El rol de estudiante puede permitir:

- Crear jobs en una carpeta concreta.
- Iniciar ejecuciones.
- Ver logs.
- Consultar artefactos.

Puede no permitir:

- Gestionar plugins.
- Crear cuentas.
- Cambiar herramientas globales.
- Modificar nodos.
- Administrar credenciales.

Una opción que no aparece puede deberse a permisos, no a un fallo de Jenkins.

---

## Plugins

Los plugins deben instalarse de forma selectiva y administrada.

### Revisar plugins instalados

En versiones habituales, la lista aparece en la sección de plugins de administración.

La ubicación y los nombres pueden cambiar.

Busca información de:

- Nombre.
- Versión.
- Estado.
- Dependencias.
- Compatibilidad.
- Fecha de actualización, si está disponible.

### Plugins habituales para una práctica básica

Una instancia puede incluir integraciones como:

- Git.
- Pipeline.
- Credentials.
- JUnit.
- SSH, si se utiliza.
- Docker, si el curso trabaja con agentes Docker.

La práctica básica no requiere necesariamente todos estos plugins.

### No instalar por si acaso

Evita instalar plugins que no se usan.

Cada plugin:

- Puede añadir endpoints y funciones.
- Puede requerir permisos.
- Puede tener dependencias.
- Puede generar actualizaciones.
- Puede introducir riesgos o incompatibilidades.

### Quién administra los plugins

En un laboratorio compartido, el administrador o docente debe gestionar las instalaciones.

El alumnado puede documentar una necesidad y solicitarla.

No actualices plugins desde una sesión de práctica sin autorización.

### Plugin ausente

Si un tipo de job o un paso no aparece:

1. Comprueba la versión.
2. Comprueba si el plugin está instalado.
3. Revisa los permisos.
4. Consulta al docente.
5. No descargues un archivo de plugin de una fuente no aprobada.

### Plugin incompatible

Un plugin puede requerir una versión de Jenkins superior o entrar en conflicto con otra dependencia.

No fuerces la instalación ignorando advertencias.

Pide al administrador que evalúe el cambio.

### Reinicios

Algunos plugins requieren reiniciar Jenkins o recargar componentes.

Ese proceso puede interrumpir jobs y usuarios.

No reinicies una instancia compartida desde la práctica.

### Registro de cambios

Si el curso permite instalar plugins en una instancia aislada, registra:

```text
Plugin:
Versión:
Motivo:
Compatibilidad revisada:
Responsable:
Fecha:
Prueba realizada:
```

---

## Herramientas globales

Las herramientas globales ayudan a que los jobs encuentren programas de compilación y control de versiones.

### Qué se puede configurar

Según la instalación, Jenkins puede gestionar o localizar:

- Git.
- JDK.
- Maven.
- Gradle.
- Otras herramientas de plugins.

### Abrir Tools

En distintas versiones puede encontrarse bajo una opción parecida a:

```text
Manage Jenkins → Tools
```

En versiones anteriores puede aparecer como **Global Tool Configuration**.

### Comprobar antes de añadir

Antes de crear una instalación:

- Comprueba si ya existe.
- Consulta qué agentes la utilizan.
- Identifica si la herramienta se instala automáticamente.
- Comprueba si el agente ya incluye el programa.
- No dupliques nombres globales.

### Configurar Git

Git puede usarse para obtener el código desde un repositorio.

Comprueba:

- Que el plugin de Git está instalado.
- Que el ejecutable existe en el agente.
- Que la ruta configurada es correcta.
- Que la versión es compatible.
- Que el checkout no requiere una credencial que no tengas.

En muchos sistemas Unix, Git se encuentra en:

```text
/usr/bin/git
```

La ruta debe comprobarse en el agente real.

### Comprobar Git en el agente

En un agente Unix:

```groovy
sh 'git --version'
```

Si el agente es Windows, utiliza el comando compatible con esa configuración.

### Configurar JDK

La ubicación y disponibilidad del JDK dependen del agente y de la política del curso.

Comprueba:

- Versión necesaria para el proyecto.
- Versión necesaria para ejecutar herramientas.
- Compatibilidad con Jenkins.
- Si Jenkins instala la herramienta o la imagen ya la contiene.

No confundas el Java del controlador con el Java del agente.

### Java del controlador y Java del agente

El controlador puede ejecutarse con una versión distinta de Java a la que usa el agente.

Un pipeline debe comprobar las herramientas en el nodo donde realmente ejecuta.

### Configurar Maven

Un nombre de instalación puede usarse desde el pipeline.

Por ejemplo:

```text
Maven 3
```

El nombre debe coincidir con lo que se declara en el `Jenkinsfile`.

La ruta de Maven varía entre imágenes y métodos de instalación.

### Verificar Maven

En el agente:

```groovy
sh 'mvn --version'
```

La salida puede mostrar la versión de Maven y el JDK utilizado.

Si el comando no existe, no instales paquetes en un nodo compartido sin permiso.

### Ruta de Maven

Una ruta como:

```text
/usr/share/maven
```

es solo un ejemplo.

Comprueba la ruta de la imagen o del agente real.

### Herramientas declaradas en un pipeline

En un pipeline declarativo se puede declarar una herramienta configurada en Jenkins:

```groovy
tools {
    maven 'Maven 3'
}
```

El nombre tiene que existir en la configuración global.

La sintaxis y disponibilidad dependen del tipo de pipeline y de la instalación.

### No cambiar configuración global para una sola práctica

Una modificación global puede afectar otros jobs.

Si necesitas una herramienta que no está configurada:

- Registra la versión requerida.
- Explica el motivo.
- Consulta al docente.
- Utiliza el agente preparado por el curso.

---

## Nodos y agentes

Jenkins necesita un lugar donde ejecutar cada paso.

### Revisar los nodos disponibles

En la sección de nodos o agentes, comprueba:

- Nombre.
- Estado.
- Etiquetas.
- Número de ejecutores.
- Sistema operativo.
- Espacio disponible, si la instancia lo muestra.
- Mensajes de desconexión.

### Nodo integrado

Algunas instalaciones muestran un nodo integrado o de controlador.

No asumas que debe ejecutar todos los jobs.

Sigue la política del laboratorio.

### Etiquetas

Las etiquetas describen capacidades o clases de agentes.

Un pipeline puede solicitar una etiqueta:

```groovy
agent {
    label 'linux-lab'
}
```

La etiqueta tiene que estar asignada a un agente disponible.

### Agente desconectado

Si un agente aparece fuera de línea:

- Revisa su estado.
- Revisa el mensaje de desconexión.
- Comprueba si hay otro agente autorizado.
- No cambies etiquetas para forzar una ejecución en otro entorno.
- Informa al administrador si persiste.

### Ejecutores

Los ejecutores permiten ejecutar tareas en un nodo.

Cambiar su número puede afectar recursos y concurrencia.

No modifiques ejecutores globales durante la práctica.

### Workspace del agente

El workspace puede encontrarse en rutas distintas según el agente.

El `Jenkinsfile` debería usar rutas relativas al workspace siempre que sea posible.

No escribas rutas absolutas específicas de una máquina salvo que exista una necesidad documentada.

---

## Credenciales

Las credenciales de Jenkins permiten usar secretos sin escribirlos directamente en el pipeline.

### Qué puede ser una credencial

Una credencial puede representar:

- Usuario y contraseña.
- Token.
- Clave SSH.
- Certificado.
- Secreto de texto.
- Otra identidad soportada por un plugin.

### Almacén de credenciales

Jenkins puede gestionar credenciales en almacenes con distintos ámbitos.

El alcance y la visibilidad dependen de la configuración.

No intentes consultar credenciales a las que no tienes permiso.

### Nunca usar texto literal en el `Jenkinsfile`

No escribas:

```groovy
def token = 'secreto-de-ejemplo'
```

Tampoco lo guardes en:

- Un archivo versionado.
- Una variable de entorno fija.
- Un parámetro de texto.
- Un comentario.
- La salida de consola.

### Ejemplo conceptual con credenciales

La forma exacta depende del tipo de credencial y del plugin.

En esta práctica no es necesario acceder a credenciales.

Si un ejercicio posterior lo requiere, utiliza el identificador y el mecanismo aprobado por el docente.

### Principio de mínimo privilegio

Una credencial debe tener solo los permisos necesarios para el job.

No uses una credencial administrativa global para una tarea sencilla.

### Evitar imprimir credenciales

No hagas:

```groovy
echo "${env.TOKEN}"
```

No ejecutes:

```groovy
sh 'env'
```

No confíes en que Jenkins ocultará siempre un secreto en todos los formatos.

### Revisar credenciales disponibles

La presencia de una credencial no significa que debas usarla.

Pregunta:

- ¿Qué servicio la necesita?
- ¿Qué permisos tiene?
- ¿Quién puede usarla?
- ¿Dónde queda accesible?
- ¿Qué proceso permite revocarla?

### Credenciales de SCM

Un checkout privado puede requerir una credencial.

Selecciona solo la credencial asignada al job o a la carpeta por el administrador.

No copies la clave SSH de otra persona.

---

## Seguridad de acceso

La configuración de acceso protege jobs, credenciales y sistemas externos.

### Autenticación

La autenticación determina quién inicia sesión.

Puede gestionarse mediante:

- Cuentas locales.
- Directorio corporativo.
- Proveedor de identidad.
- SSO.
- Otro mecanismo configurado por la organización.

No cambies el realm de seguridad en una instancia compartida.

### Autorización

La autorización determina qué puede hacer cada usuario.

Puede basarse en:

- Matriz de permisos.
- Roles.
- Carpetas.
- Proyectos.
- Plugins de autorización.

Utiliza solo los permisos necesarios para la práctica.

### No habilitar acceso anónimo por comodidad

No concedas permisos de administración o ejecución a usuarios anónimos.

Si un job debe ser visible públicamente, el administrador debe definir el alcance de lectura de forma deliberada.

### Cuenta compartida

Las cuentas compartidas dificultan:

- Saber quién hizo un cambio.
- Revocar acceso individual.
- Revisar auditorías.
- Proteger credenciales.

Utiliza una cuenta individual si el curso la proporciona.

### Cerrar sesión en equipos compartidos

Al terminar:

- Cierra la sesión.
- Cierra pestañas sensibles.
- No guardes contraseñas en un navegador compartido.
- No dejes archivos de credenciales en el equipo.
- No fotografíes códigos de acceso.

### Protección de sesiones

No compartas:

- Cookies.
- Tokens de sesión.
- Enlaces de restablecimiento.
- Códigos temporales.
- Capturas con datos de autenticación.

### Cambios administrativos

Para cambiar:

- Usuarios.
- Permisos.
- Plugins.
- Credenciales.
- Nodos.
- URL global.
- Seguridad de Jenkins.

se necesita permiso administrativo y un plan de cambio.

La práctica de alumnado debe limitarse a la carpeta y job asignados.

---

## Crear un job Freestyle

Un job Freestyle sirve para aprender la relación entre una configuración, una ejecución y su consola.

### Crear el job

1. Abre la carpeta del laboratorio.
2. Selecciona crear un nuevo item o job.
3. Introduce un nombre claro.
4. Selecciona Freestyle, si está disponible.
5. Guarda.
6. Revisa la página de configuración antes de ejecutar.

La interfaz puede cambiar entre versiones.

### Nombre sugerido

```text
practica-configuracion-basica
```

Usa un nombre que no contenga datos personales innecesarios.

### Descripción

Puedes describir el propósito:

```text
Job de laboratorio para verificar acceso y ejecución básica en Jenkins.
```

No incluyas secretos ni datos internos restringidos.

### Configurar SCM

Si la práctica usa un repositorio:

- Selecciona Git.
- Introduce la URL autorizada.
- Elige la rama correcta.
- Asocia la credencial aprobada si el repositorio es privado.
- No copies tokens en la URL.
- Guarda y comprueba el checkout.

Si la práctica no requiere SCM, omite esta sección.

### Rama

La rama puede ser, por ejemplo:

```text
main
```

Usa la rama que indique el curso.

No supongas que todos los repositorios usan el mismo nombre.

### Build Steps

En un agente Unix, puede aparecer un paso **Execute shell**.

En un agente Windows puede aparecer **Execute Windows batch command**.

Elige el paso que corresponda al agente.

### Comprobación inocua

En Unix:

```bash
echo "Jenkins ejecutó el job de laboratorio."
pwd
```

Este ejemplo no modifica datos.

### Añadir un paso de validación

Si el repositorio incluye `README.md`:

```bash
test -f README.md
```

El comando devuelve un código distinto de cero si el archivo no existe.

### Guardar y ejecutar

1. Guarda la configuración.
2. Selecciona **Build Now** o el botón equivalente.
3. Espera a que termine.
4. Abre el número del build.
5. Revisa **Console Output**.
6. Registra el resultado.

### Ejecutar de nuevo

Puedes iniciar otra ejecución para comparar el historial.

Comprueba:

- Número de build.
- Duración.
- Resultado.
- Salida de consola.

### Modificar el comando de forma controlada

Cambia solo el texto del `echo`.

Guarda y vuelve a ejecutar.

No sustituyas el comando por una operación destructiva.

### Añadir un fallo controlado

En un job aislado, puedes ejecutar:

```bash
false
```

El comando normalmente devuelve un estado de error en Unix.

Usa este paso solo para entender cómo Jenkins muestra un fallo.

Después, restaura el job a la versión válida.

### Comparar resultados

Comprueba cómo la interfaz distingue:

- Ejecución exitosa.
- Ejecución fallida.
- Ejecución cancelada.

Los iconos y colores pueden variar según tema y plugins.

---

## Crear un pipeline básico

Un pipeline define etapas y pasos como código.

### Ventajas de Pipeline as Code

Un `Jenkinsfile` permite:

- Revisar cambios en Git.
- Versionar la configuración.
- Repetir el flujo.
- Compartir la estructura.
- Mostrar etapas en la interfaz.
- Revisar los cambios junto al código del proyecto.

### Pipeline mínimo declarativo

```groovy
pipeline {
    agent any

    stages {
        stage('Inicio') {
            steps {
                echo 'Pipeline de laboratorio iniciado.'
            }
        }

        stage('Comprobación') {
            steps {
                echo 'Comprobación básica completada.'
            }
        }
    }
}
```

### `pipeline`

Contiene la estructura declarativa.

### `agent`

Indica dónde se ejecutan los pasos.

`agent any` utiliza cualquier agente disponible que cumpla la configuración.

En un entorno administrado, puede ser preferible una etiqueta autorizada.

### `stages`

Agrupa las etapas del pipeline.

### `stage`

Da un nombre visible a una fase.

Un nombre debería describir el trabajo que ocurre.

### `steps`

Contiene los pasos de la etapa.

Ejemplos:

- `echo`.
- `sh`.
- `bat`.
- `checkout`.
- `archiveArtifacts`.
- `script`.

La disponibilidad depende del contexto y los plugins.

### Crear un Pipeline Job

1. Abre la carpeta del laboratorio.
2. Crea un nuevo item.
3. Selecciona Pipeline.
4. Asigna un nombre descriptivo.
5. Guarda.
6. Busca la sección de definición del pipeline.
7. Selecciona la opción apropiada para la práctica.

### Pipeline escrito en la interfaz

Para un primer ejemplo, puede existir un campo **Pipeline script**.

Pega el ejemplo mínimo y guárdalo.

En trabajos compartidos, es preferible usar un `Jenkinsfile` versionado cuando el curso lo permita.

### Pipeline desde SCM

Para usar un repositorio:

1. Selecciona Pipeline script from SCM.
2. Selecciona Git.
3. Introduce la URL autorizada.
4. Selecciona la credencial correspondiente si se requiere.
5. Indica la rama.
6. Indica la ruta del `Jenkinsfile`.
7. Guarda.
8. Ejecuta el job.
9. Confirma que Jenkins obtuvo la revisión esperada.

### Ruta del `Jenkinsfile`

La ruta común es:

```text
Jenkinsfile
```

Si está en una subcarpeta, indica la ruta acordada.

No cambies la ruta sin actualizar la configuración del job.

### Añadir timestamps y timeout

Un pipeline puede incluir opciones:

```groovy
options {
    timestamps()
    timeout(time: 10, unit: 'MINUTES')
}
```

Usa un límite acorde a la práctica.

No configures un timeout excesivamente corto para forzar fallos.

### Variables de entorno de laboratorio

```groovy
environment {
    NOMBRE_PRACTICA = 'configuracion-basica'
}
```

Acceso desde Groovy:

```groovy
echo "Práctica: ${env.NOMBRE_PRACTICA}"
```

No almacenes secretos en este bloque.

### Parámetros simples

```groovy
parameters {
    choice(
        name: 'MODO',
        choices: ['simple', 'detallado'],
        description: 'Selecciona un modo de práctica'
    )
}
```

Los parámetros se consultan desde Groovy con `params`.

### Pipeline con parámetro

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona un modo de práctica'
        )
    }

    stages {
        stage('Mostrar selección') {
            steps {
                echo "Modo: ${params.MODO}"
            }
        }
    }
}
```

### Revisar sintaxis

Si el pipeline no arranca:

- Comprueba las llaves.
- Comprueba los nombres de etapas.
- Comprueba la sintaxis declarativa.
- Revisa el log de compilación del pipeline.
- Confirma que los plugins requeridos están disponibles.

### Ejecutar el pipeline

1. Guarda el `Jenkinsfile` o la configuración.
2. Inicia el job.
3. Abre la vista de etapas.
4. Abre la consola.
5. Comprueba el resultado.
6. Registra la primera causa si falla.

---

## Diagnóstico de fallos de configuración

Un fallo puede originarse en la cuenta, el job, el agente, el repositorio o la sintaxis.

### No puedo iniciar sesión

Comprueba:

- URL.
- Nombre de usuario.
- Método de autenticación.
- Teclado y mayúsculas.
- Estado del proveedor de identidad.
- Mensaje exacto de la página.

No solicites contraseñas a otros estudiantes.

Usa el procedimiento oficial de restablecimiento.

### No veo un menú

Puede deberse a:

- Permisos insuficientes.
- Cambio de interfaz.
- Plugin ausente.
- Carpeta o vista distinta.
- Configuración restringida.

No intentes sortear permisos.

Consulta al docente.

### No puedo crear un job

Comprueba:

- Que estás en la carpeta correcta.
- Que tu rol permite crear jobs.
- Que el nombre no está ocupado.
- Que el tipo de job está disponible.
- Que no estás en una carpeta de solo lectura.

### El job queda en cola

Comprueba:

- Agentes disponibles.
- Etiquetas requeridas.
- Ejecutores ocupados.
- Restricciones del job.
- Estado de los nodos.

No cambies la etiqueta a una máquina distinta sin autorización.

### Error de comando `sh`

Comprueba:

- Sistema operativo del agente.
- Disponibilidad de shell.
- Sintaxis del comando.
- Ruta de trabajo.
- Código de salida.
- Mensajes anteriores a la línea final.

### Error de comando `bat`

Comprueba:

- Que el agente sea Windows.
- Sintaxis de Batch.
- Nombre del ejecutable.
- Código de salida.
- Configuración del agente.

### Error de checkout

Comprueba:

- URL del repositorio.
- Rama.
- Permiso de lectura.
- Credencial asociada.
- Disponibilidad de Git.
- Acceso de red.
- Certificados del repositorio.

No pegues un token en la URL.

### Error de credenciales

Comprueba:

- Identificador de credencial.
- Ámbito.
- Permiso de uso.
- Tipo requerido por el plugin.
- Vigencia.

No muestres el valor de la credencial para comprobarla.

### Error de plugin

Comprueba:

- Si el plugin está instalado.
- Si es compatible.
- Si el paso está disponible.
- Si falta una dependencia.
- Si el usuario tiene permiso.

Pide al administrador que revise cualquier actualización.

### Pipeline con error de sintaxis

Comprueba:

- Llaves abiertas y cerradas.
- Comillas.
- Comas.
- Sangría.
- Nombre de directivas.
- Bloques dentro del nivel correcto.
- Uso de pasos en `steps`.

### Pipeline en rojo aunque el mensaje parezca correcto

Busca:

- Código de salida no cero.
- Una excepción.
- Una etapa fallida.
- Un timeout.
- Una etapa `post` fallida.
- Un plugin que cambió el resultado.

El texto impreso no es siempre el resultado del build.

### Build exitoso con una comprobación fallida

Busca:

- `returnStatus` no comprobado.
- `catchError`.
- `try/catch` que continúa.
- `|| true`.
- Scripts que terminan siempre con cero.
- Etapas omitidas.

No modifiques el resultado para ocultar el problema.

### Diagnóstico con una ficha

```text
Job:
Número de build:
Rama:
Commit:
Agente:
Etapa:
Primer mensaje útil:
Comando o paso:
Código de salida:
Resultado final:
Observación:
Hipótesis:
Próxima comprobación:
```

### Observación e hipótesis

Ejemplo:

```text
Observación:
El job está esperando un agente con la etiqueta linux-lab.

Hipótesis:
No hay un agente disponible con esa etiqueta.

Próxima comprobación:
Revisar la lista de nodos y la configuración del job.
```

Mantén separadas las evidencias y las suposiciones.

---

## Sesiones prácticas

Las sesiones permiten practicar desde la navegación hasta la revisión de un pipeline completo.

### Preparación de las sesiones

Antes de empezar:

- Utiliza la instancia asignada.
- Confirma la carpeta de trabajo.
- No cambies configuración global.
- No uses credenciales reales.
- Usa comandos inocuos.
- Anota número de build y resultado.
- Restaura cualquier cambio de prueba.
- Informa de fallos sin compartir secretos.

### Sesión 1: explorar la interfaz

**Objetivo:** reconocer los elementos principales de Jenkins.

#### Instrucciones

1. Inicia sesión con tu cuenta de laboratorio.
2. Localiza la página principal.
3. Localiza la carpeta del curso.
4. Identifica un job de ejemplo.
5. Abre una ejecución existente.
6. Localiza la consola.
7. Vuelve a la página del job.
8. Localiza el historial de builds.
9. Registra los nombres de los elementos encontrados.
10. No cambies ajustes todavía.

#### Registro

```text
Usuario de laboratorio:
Carpeta:
Job observado:
Build observado:
Resultado:
Dónde aparece la consola:
```

### Sesión 2: identificar permisos

**Objetivo:** diferenciar opciones visibles y capacidades administrativas.

#### Instrucciones

1. Revisa las opciones que aparecen en el menú.
2. Identifica si puedes crear un job.
3. Identifica si puedes configurar el job.
4. No intentes abrir menús con enlaces adivinados.
5. Anota qué permisos necesitas para la práctica.
6. Pregunta al docente si falta una opción.

#### Preguntas

- ¿Qué acciones son de usuario?
- ¿Qué acciones son administrativas?
- ¿Por qué no conviene conceder permisos globales a todos?

### Sesión 3: revisar una ejecución existente

**Objetivo:** aprender a leer un build antes de crear uno nuevo.

#### Instrucciones

1. Abre un build de ejemplo.
2. Revisa resultado.
3. Revisa duración.
4. Abre la consola.
5. Localiza inicio y fin del pipeline.
6. Identifica un paso ejecutado.
7. Anota un mensaje informativo.
8. No copies líneas con datos sensibles.

### Sesión 4: crear un job Freestyle

**Objetivo:** crear una tarea sencilla en una carpeta de laboratorio.

#### Instrucciones

1. Selecciona crear un item.
2. Usa el nombre `practica-basica-freestyle`.
3. Selecciona Freestyle.
4. Añade una descripción breve.
5. No configures SCM todavía.
6. Añade un paso de shell si el agente es Unix.
7. Usa `echo` y `pwd`.
8. Guarda.
9. Ejecuta.
10. Revisa la consola.

#### Comandos

```bash
echo "Job de laboratorio iniciado."
pwd
```

#### Resultado esperado

La consola muestra el mensaje y el directorio de trabajo.

El build termina correctamente si el agente ejecutó ambos comandos.

### Sesión 5: comprobar un archivo

**Objetivo:** agregar una validación simple.

Añade este comando:

```bash
test -f README.md
```

#### Instrucciones

1. Comprueba que el archivo está en el workspace.
2. Ejecuta el job.
3. Revisa el resultado.
4. Si el job no hace checkout, explica por qué puede faltar el archivo.
5. No crees una falsa conclusión basada en un workspace vacío.

### Sesión 6: activar checkout de SCM

**Objetivo:** obtener el proyecto desde un repositorio autorizado.

#### Instrucciones

1. Selecciona Git como SCM, si el plugin está disponible.
2. Introduce la URL proporcionada por el curso.
3. Indica la rama correcta.
4. Usa una credencial aprobada solo si se requiere.
5. Guarda el job.
6. Ejecuta.
7. Revisa la consola de checkout.
8. Confirma el commit procesado.

#### Preguntas

- ¿Qué diferencia hay entre un error de checkout y un error de compilación?
- ¿Qué dato identifica la revisión exacta?
- ¿Por qué no se debe insertar un token en la URL?

### Sesión 7: observar un fallo controlado

**Objetivo:** reconocer cómo se muestra un comando fallido.

#### Instrucciones

1. En una copia de práctica, añade `false` como último comando.
2. Ejecuta el job.
3. Revisa el código de salida.
4. Identifica el estado final.
5. Registra el mensaje más útil.
6. Elimina `false`.
7. Vuelve a ejecutar para restaurar el caso exitoso.

No añadas este comando a un job compartido sin indicarlo como práctica de fallo.

### Sesión 8: crear un Pipeline Job

**Objetivo:** ejecutar un pipeline mínimo.

#### Código

```groovy
pipeline {
    agent any

    stages {
        stage('Inicio') {
            steps {
                echo 'Primera etapa de pipeline.'
            }
        }

        stage('Comprobación') {
            steps {
                echo 'Segunda etapa de pipeline.'
            }
        }
    }
}
```

#### Instrucciones

1. Crea un job de tipo Pipeline.
2. Pega el código en el campo de pipeline, si es el método del curso.
3. Guarda.
4. Ejecuta.
5. Revisa las etapas.
6. Abre la consola.
7. Anota el resultado.

### Sesión 9: añadir un `Jenkinsfile` al repositorio

**Objetivo:** versionar el pipeline.

#### Instrucciones

1. Crea un archivo llamado `Jenkinsfile`.
2. Añade el pipeline mínimo.
3. Guárdalo en la raíz del repositorio.
4. Confirma el cambio en la rama de práctica.
5. Configura el job como Pipeline from SCM.
6. Indica la ruta del `Jenkinsfile`.
7. Ejecuta el job.
8. Confirma la rama y el commit.

### Sesión 10: añadir una variable de entorno

**Objetivo:** mostrar configuración no sensible.

Añade:

```groovy
environment {
    NOMBRE_PRACTICA = 'configuracion-basica'
}
```

En un paso:

```groovy
echo "Práctica: ${env.NOMBRE_PRACTICA}"
```

#### Instrucciones

1. Guarda el cambio.
2. Ejecuta el pipeline.
3. Revisa la salida.
4. Explica por qué una variable de entorno no se convierte automáticamente en secreto.

### Sesión 11: añadir un parámetro `choice`

**Objetivo:** recibir una entrada controlada.

Añade:

```groovy
parameters {
    choice(
        name: 'MODO',
        choices: ['simple', 'detallado'],
        description: 'Modo de laboratorio'
    )
}
```

Muestra el valor:

```groovy
echo "Modo: ${params.MODO}"
```

#### Instrucciones

1. Guarda el cambio.
2. Abre la ejecución con parámetros.
3. Selecciona `simple`.
4. Ejecuta y registra el mensaje.
5. Ejecuta con `detallado`.
6. Compara los mensajes.
7. No añadas una contraseña como parámetro de texto.

### Sesión 12: añadir una condición

**Objetivo:** ejecutar una salida diferente según el modo.

```groovy
script {
    if (params.MODO == 'detallado') {
        echo 'Se eligió el modo detallado.'
    } else {
        echo 'Se eligió el modo simple.'
    }
}
```

#### Instrucciones

1. Añade el bloque dentro de `steps`.
2. Ejecuta los dos modos.
3. Comprueba qué rama aparece.
4. Explica por qué la condición no debe saltarse validaciones esenciales.

### Sesión 13: añadir timeout

**Objetivo:** limitar una ejecución de laboratorio.

Añade:

```groovy
options {
    timeout(time: 5, unit: 'MINUTES')
}
```

#### Instrucciones

1. Revisa que el valor coincide con la duración de la práctica.
2. Ejecuta una ruta normal.
3. Registra el resultado.
4. Explica qué tipo de problema ayuda a limitar.
5. No añadas una espera larga para probarlo en un agente compartido.

### Sesión 14: utilizar `post`

**Objetivo:** informar del resultado final.

```groovy
post {
    success {
        echo 'Las comprobaciones configuradas terminaron correctamente.'
    }

    failure {
        echo 'El pipeline falló. Revisa la primera causa.'
    }

    always {
        echo 'Fin de la ejecución.'
    }
}
```

#### Instrucciones

1. Ejecuta una ruta exitosa.
2. Registra el mensaje `success`.
3. Provoca un fallo controlado en una rama temporal.
4. Comprueba `failure`.
5. Comprueba `always`.
6. Restaura el pipeline.

### Sesión 15: identificar agente y workspace

**Objetivo:** conocer dónde se ejecuta el trabajo.

En un agente Unix, añade:

```groovy
sh 'whoami'
sh 'pwd'
hostname
```

El tercer comando debe ejecutarse mediante un paso de shell:

```groovy
sh 'hostname'
```

#### Instrucciones

1. Ejecuta el pipeline.
2. Registra el usuario.
3. Registra la ruta de trabajo.
4. Registra el hostname.
5. Compara con otro agente si el docente lo autoriza.
6. No publiques rutas restringidas.

### Sesión 16: diagnosticar una etiqueta sin agente

**Objetivo:** comprender el bloqueo en cola.

En un pipeline aislado, solicita una etiqueta que el curso haya confirmado que no existe.

#### Instrucciones

1. Confirma con el docente que la prueba está autorizada.
2. Ejecuta el pipeline.
3. Observa el mensaje de espera.
4. Registra la etiqueta solicitada.
5. Cancela la ejecución según las instrucciones del curso.
6. Restaura la etiqueta correcta.

No inventes etiquetas en jobs compartidos.

### Sesión 17: comparar Freestyle y Pipeline

**Objetivo:** reconocer diferencias de configuración.

| Característica | Freestyle | Pipeline |
|---|---|---|
| Configuración habitual | Interfaz | `Jenkinsfile` o interfaz |
| Etapas explícitas | Limitadas por configuración | Declaradas en código |
| Revisión en Git | Depende del diseño | Natural con `Jenkinsfile` |
| Uso principal de la práctica | Primer job | Flujo como código |

#### Actividad

1. Ejecuta el mismo mensaje desde ambos tipos.
2. Compara la consola.
3. Compara la vista de etapas.
4. Explica qué configuración queda versionada.

### Sesión 18: revisar plugins

**Objetivo:** identificar la necesidad de un plugin sin instalarlo.

#### Instrucciones

1. Anota qué tipo de tarea intentas realizar.
2. Comprueba si ya existe un paso o job adecuado.
3. Identifica si depende de un plugin.
4. Revisa si el plugin está aprobado.
5. Solicita su instalación al administrador si corresponde.
6. No instales archivos manuales de plugin.

### Sesión 19: crear un informe de ejecución

**Objetivo:** documentar un build sin compartir información sensible.

Completa:

```text
Job:
Número:
Rama:
Commit:
Agente:
Resultado:
Etapa principal:
Primera causa, si falló:
Artefactos:
Acción siguiente:
```

#### Instrucciones

1. Usa una ejecución exitosa.
2. Usa una ejecución fallida controlada.
3. Completa una ficha para cada caso.
4. Revisa que no incluya secretos.
5. Entrega las fichas según el formato del curso.

### Sesión 20: revisión por parejas

**Objetivo:** revisar una configuración básica.

La persona autora explica:

- Qué hace el job.
- Qué agente usa.
- Qué entradas acepta.
- Qué pasos ejecuta.
- Cómo se sabe si falló.

La persona revisora comprueba:

- Nombre y descripción.
- SCM y rama.
- Comandos inocuos.
- Variables no sensibles.
- Estado final.
- Mensajes de diagnóstico.
- Ausencia de secretos.

### Sesión 21: restaurar el laboratorio

**Objetivo:** dejar el entorno en un estado conocido.

#### Instrucciones

1. Elimina el comando de fallo.
2. Restaura el parámetro predeterminado.
3. Comprueba que la rama tiene el `Jenkinsfile` final.
4. Conserva solo los artefactos requeridos.
5. No borres builds de otras personas.
6. Informa al docente si se creó un job temporal que debe retirarse.

---

## Ejemplo de pipeline básico completo

El siguiente ejemplo reúne parámetros, opciones, etapas y acciones posteriores sin usar credenciales.

### Jenkinsfile

```groovy
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 5, unit: 'MINUTES')
    }

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona el modo de la práctica'
        )
    }

    environment {
        NOMBRE_PRACTICA = 'configuracion-basica'
    }

    stages {
        stage('Preparar') {
            steps {
                echo "Práctica: ${env.NOMBRE_PRACTICA}"
                echo "Modo: ${params.MODO}"
            }
        }

        stage('Comprobar entorno') {
            steps {
                sh 'whoami'
                sh 'pwd'
            }
        }

        stage('Comprobar modo') {
            steps {
                script {
                    if (!(params.MODO in ['simple', 'detallado'])) {
                        error 'El modo no está permitido.'
                    }

                    if (params.MODO == 'detallado') {
                        echo 'Comprobación detallada seleccionada.'
                    } else {
                        echo 'Comprobación simple seleccionada.'
                    }
                }
            }
        }

        stage('Validación básica') {
            steps {
                sh 'echo "La validación de laboratorio se ejecutó."'
            }
        }
    }

    post {
        success {
            echo 'El pipeline terminó correctamente.'
        }

        failure {
            echo 'El pipeline falló. Revisa la primera etapa fallida.'
        }

        aborted {
            echo 'La ejecución se interrumpió.'
        }

        always {
            echo "Resultado final: ${currentBuild.currentResult}"
        }
    }
}
```

### Antes de ejecutarlo

Comprueba:

- Que el agente asignado es compatible con `sh`.
- Que el `Jenkinsfile` está en la rama correcta.
- Que el timeout es razonable para la práctica.
- Que el parámetro tiene las opciones previstas.
- Que no hay credenciales en el código.
- Que tienes permiso para ejecutar el job.

### Qué debería ocurrir

En una ejecución normal:

1. Jenkins asigna un agente.
2. Aparece el mensaje de preparación.
3. Se muestran usuario y directorio.
4. Se selecciona un modo.
5. La etapa de validación termina.
6. `post` muestra el resultado de éxito.
7. El build termina como `SUCCESS`.

### Adaptación a Windows

En un agente Windows, reemplaza `sh` por el paso adecuado, por ejemplo `bat`, y adapta los comandos.

No ejecutes comandos Unix en un agente Windows esperando el mismo comportamiento.

### Adaptación a SCM

Para usar un `Jenkinsfile` versionado:

- Guarda el archivo en el repositorio.
- Configura el job como Pipeline from SCM.
- Indica repositorio y rama.
- Indica la ruta del `Jenkinsfile`.
- Asocia una credencial aprobada si se requiere.
- Verifica el commit descargado.

---

## Mantenimiento y administración responsable

La configuración básica requiere cuidados posteriores, incluso en un laboratorio.

### Actualizaciones de Jenkins

Las actualizaciones pueden incluir:

- Correcciones de seguridad.
- Cambios de compatibilidad.
- Cambios en plugins.
- Requisitos de Java.
- Cambios de interfaz.

El administrador debe probarlas y planificarlas.

No actualices la instancia desde una sesión de práctica.

### Actualizaciones de plugins

Antes de actualizar:

- Revisa dependencias.
- Revisa compatibilidad.
- Identifica jobs afectados.
- Comprueba notas de versión.
- Prepara reversión.
- Programa la intervención.

### Copia de seguridad

La configuración de Jenkins puede incluir jobs, credenciales y otros datos sensibles.

Una copia debe:

- Seguir la política de la organización.
- Protegerse con controles de acceso.
- Cifrarse si corresponde.
- Probarse mediante una restauración planificada.
- Guardarse fuera del host cuando la política lo requiera.

El alumnado no debe copiar el directorio de Jenkins para entregarlo.

### No copiar el directorio de datos a Git

El directorio de datos de Jenkins puede contener información sensible.

No lo añadas a un repositorio ni lo adjuntes a una tarea.

### Logs del servicio

Si la interfaz no está disponible, el administrador puede revisar los logs del servicio o del contenedor.

El acceso depende de cómo se instaló Jenkins.

Los logs pueden incluir datos de infraestructura; compártelos solo con autorización.

### Reiniciar Jenkins

Un reinicio puede interrumpir jobs y sesiones.

No reinicies una instancia compartida para resolver un problema de práctica.

Consulta al administrador.

### Limpieza de trabajos de prueba

Antes de retirar un job temporal:

- Comprueba que es tu job de laboratorio.
- Asegúrate de que no lo utiliza otra persona.
- Conserva las evidencias solicitadas.
- Sigue el procedimiento del curso.
- No borres carpetas o builds ajenos.

### Retención de builds

La retención afecta:

- Historial.
- Logs.
- Artefactos.
- Espacio de almacenamiento.

No cambies políticas de retención globales sin autorización.

### Revisión periódica

Una instancia mantenida debería revisar:

- Plugins sin uso.
- Cuentas y permisos.
- Credenciales.
- Agentes obsoletos.
- Versiones de herramientas.
- Espacio en disco.
- Copias de seguridad.
- Logs.
- Configuración de URL y certificados.

---

## Checklist de configuración básica

### Acceso

- [ ] Estoy en la instancia correcta.
- [ ] Uso una cuenta individual autorizada.
- [ ] La URL coincide con la entregada por el curso.
- [ ] No comparto sesiones ni credenciales.
- [ ] Cierro la sesión en equipos compartidos.

### Instancia

- [ ] Conozco la versión aproximada.
- [ ] Sé quién administra Jenkins.
- [ ] No ejecuté el asistente inicial en una instancia ya configurada.
- [ ] No cambié la URL global.
- [ ] No modifiqué seguridad global.

### Plugins y herramientas

- [ ] Revisé los plugins disponibles.
- [ ] No instalé plugins sin autorización.
- [ ] Comprobé qué herramientas existen en el agente.
- [ ] No cambié Global Tools en una instancia compartida.
- [ ] Anoté cualquier dependencia ausente.

### Job

- [ ] El job está en la carpeta asignada.
- [ ] Tiene un nombre claro.
- [ ] Usa la rama correcta.
- [ ] Ejecuta comandos inocuos.
- [ ] Tiene una descripción útil.
- [ ] La configuración corresponde al propósito de la práctica.

### Pipeline

- [ ] El `Jenkinsfile` tiene estructura válida.
- [ ] Las etapas tienen nombres descriptivos.
- [ ] Los parámetros están limitados.
- [ ] No se imprimen secretos.
- [ ] Los errores obligatorios se propagan.
- [ ] Se revisó el resultado final.

### Diagnóstico y entrega

- [ ] Anoté job y número de build.
- [ ] Identifiqué el agente.
- [ ] Revisé la primera causa si falló.
- [ ] Evité compartir datos sensibles.
- [ ] Restauré los cambios de fallo controlado.
- [ ] Entregué evidencias no sensibles.

---

## Errores comunes y cómo evitarlos

### Crear el job en la carpeta equivocada

Comprueba la ruta en la interfaz antes de guardarlo.

### Confundir una cuenta con un rol

Iniciar sesión correctamente no significa tener permisos de administración.

### Instalar plugins sin necesidad

Comprueba primero si el plugin ya está instalado y aprobado.

### Seleccionar el agente incorrecto

Revisa etiqueta y sistema operativo antes de ejecutar comandos.

### Usar `sh` en Windows

El paso y la sintaxis deben corresponder al agente.

### Usar rutas absolutas del controlador

Los comandos se ejecutan en el agente asignado, no necesariamente en el controlador.

### Creer que `echo` valida una tarea

Un mensaje informa; una comprobación debe validar una condición o salida.

### Interpretar mal un build rojo

Localiza la primera etapa fallida y el primer error relevante.

### Ignorar códigos de salida

Un mensaje que parece correcto no garantiza que el comando haya terminado con código cero.

### Imprimir el entorno para depurar

El entorno puede contener secretos. Registra solo las variables necesarias y autorizadas.

### Guardar secretos como parámetros normales

Un parámetro de texto no es un mecanismo de gestión de credenciales.

### Cambiar permisos globales para resolver un problema local

Solicita el permiso específico y limitado que requiere la práctica.

### Suponer que el workspace persiste

El workspace puede limpiarse o pertenecer a otro agente.

Archiva los resultados requeridos mediante el mecanismo aprobado.

### Cambiar la configuración del controlador

Una práctica de job no debe necesitar cambios globales.

### Copiar una configuración de otra instancia

La versión, los plugins y los agentes pueden ser distintos.

Verifica el entorno real.

---

## Preguntas de repaso

1. ¿Qué diferencia hay entre controlador y agente?
2. ¿Qué es un job?
3. ¿Qué identifica un número de build?
4. ¿Qué propósito tiene el workspace?
5. ¿Qué es un plugin?
6. ¿Por qué no conviene instalar plugins sin autorización?
7. ¿Qué diferencia hay entre una configuración global y una configuración de job?
8. ¿Qué papel tiene un parámetro?
9. ¿Dónde se consulta un parámetro en un Pipeline?
10. ¿Qué diferencia hay entre `sh` y `bat`?
11. ¿Qué significa `SUCCESS`?
12. ¿Qué significa `FAILURE`?
13. ¿Qué puede provocar `ABORTED`?
14. ¿Por qué una etapa omitida no demuestra que sus comprobaciones hayan pasado?
15. ¿Qué datos debe incluir un informe de diagnóstico?
16. ¿Qué datos no deberían aparecer en una captura?
17. ¿Por qué no se debe almacenar una contraseña en el `Jenkinsfile`?
18. ¿Qué revisarías si el job queda en cola?
19. ¿Cómo comprobarías que un job utilizó la rama esperada?
20. ¿Qué diferencia hay entre una salida de consola y un resultado de build?

---

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«El controlador coordina jobs y agentes».

### Afirmación 2

«Todos los pasos de Jenkins se ejecutan necesariamente en el controlador».

### Afirmación 3

«Un plugin puede añadir funcionalidades a Jenkins».

### Afirmación 4

«El alumnado debería instalar cualquier plugin que falte».

### Afirmación 5

«Un workspace puede limpiarse y no debe tratarse como almacenamiento permanente».

### Afirmación 6

«Un mensaje de `echo` demuestra que una compilación terminó correctamente».

### Afirmación 7

«Un código de salida distinto de cero puede hacer fallar un paso `sh`».

### Afirmación 8

«Una contraseña puede incluirse en una variable del `Jenkinsfile` si el repositorio es privado».

### Afirmación 9

«Un job puede tener varias ejecuciones con resultados diferentes».

### Afirmación 10

«La configuración global puede afectar a muchos jobs».

### Afirmación 11

«Una etiqueta selecciona agentes que coinciden con el criterio solicitado».

### Afirmación 12

«Una ejecución `ABORTED` demuestra siempre un defecto del código».

### Afirmación 13

«La rama y el commit ayudan a identificar qué código se ejecutó».

### Afirmación 14

«Se deben compartir capturas completas de consola aunque contengan credenciales».

### Afirmación 15

«Un fallo debe diagnosticarse desde la primera causa relevante».

### Respuestas orientativas

#### Afirmación 1

**Correcta.** Es una función central del controlador.

#### Afirmación 2

**Incorrecta.** Los pasos pueden ejecutarse en agentes.

#### Afirmación 3

**Correcta.** Los plugins amplían capacidades.

#### Afirmación 4

**Incorrecta.** Las instalaciones deben seguir la política administrativa.

#### Afirmación 5

**Correcta.** Su duración depende del agente y de la configuración.

#### Afirmación 6

**Incorrecta.** Un mensaje no demuestra por sí solo que todas las validaciones hayan pasado.

#### Afirmación 7

**Correcta.** Jenkins suele tratar un código no cero como fallo del paso.

#### Afirmación 8

**Incorrecta.** Los secretos no deben guardarse en el código fuente.

#### Afirmación 9

**Correcta.** Cada build tiene su propio resultado e historial.

#### Afirmación 10

**Correcta.** Puede afectar a múltiples jobs.

#### Afirmación 11

**Correcta.** La etiqueta participa en la selección del agente.

#### Afirmación 12

**Incorrecta.** Puede deberse a cancelación, timeout u otra interrupción.

#### Afirmación 13

**Correcta.** Permite identificar la revisión procesada.

#### Afirmación 14

**Incorrecta.** Hay que revisar y eliminar datos sensibles antes de compartir.

#### Afirmación 15

**Correcta.** El primer error relevante suele ayudar a localizar el origen.

---

## Glosario

- **Agente:** nodo donde Jenkins ejecuta pasos.
- **Build:** ejecución concreta de un job.
- **Build history:** historial de ejecuciones de un job.
- **Controlador:** componente que coordina Jenkins.
- **Credencial:** secreto o identidad gestionada para que un job acceda a un sistema.
- **Ejecutor:** capacidad de un nodo para ejecutar tareas.
- **Freestyle:** tipo de job configurado principalmente desde la interfaz.
- **Job:** unidad de trabajo definida en Jenkins.
- **Jenkinsfile:** archivo que define un pipeline como código.
- **Pipeline:** secuencia organizada de etapas y pasos.
- **Plugin:** extensión que añade funciones a Jenkins.
- **SCM:** sistema de control de versiones, como Git.
- **Etapa:** fase visible de un pipeline.
- **Paso:** acción ejecutada dentro de una etapa.
- **Workspace:** directorio de trabajo temporal asociado a una ejecución.
- **Artefacto:** archivo generado y conservado como salida del build.
- **Parámetro:** entrada que puede variar entre ejecuciones.
- **`SUCCESS`:** resultado exitoso según las condiciones ejecutadas.
- **`FAILURE`:** resultado de fallo.
- **`UNSTABLE`:** resultado que requiere atención.
- **`ABORTED`:** ejecución interrumpida.
- **Etiqueta:** selector para pedir agentes con una capacidad o característica.
- **Autenticación:** comprobación de identidad.
- **Autorización:** decisión sobre qué acciones puede realizar una identidad.
- **Mínimo privilegio:** principio de conceder solo los permisos necesarios.
- **Console Output:** log de los pasos de un build.
- **SCM checkout:** obtención del código desde un repositorio.
- **Global Tools:** configuración de herramientas disponibles para jobs.
- **Zona horaria:** referencia utilizada para interpretar horas de logs y ejecuciones.

---

## Plantillas de entrega

Usa estas plantillas para documentar la práctica sin incluir secretos.

### Ficha del job

```text
Nombre del job:
Carpeta:
Tipo de job:
Repositorio, si aplica:
Rama:
Agente:
Propósito:
```

### Ficha del build

```text
Job:
Número de build:
Commit:
Agente:
Fecha y zona horaria:
Resultado:
Duración:
Primera etapa fallida:
```

### Ficha de diagnóstico

```text
Observación:
Hipótesis:
Comprobación realizada:
Resultado de la comprobación:
Próximo paso:
```

### Ficha de seguridad

```text
¿Se usan credenciales?:
¿Dónde se gestionan?:
¿Se imprimen datos sensibles?:
¿Qué permisos necesita el job?:
¿Qué cambios requieren autorización?:
```

### Ficha de entrega

```text
Jenkinsfile:
Tipo de job:
Resultado exitoso:
Resultado fallido controlado:
Evidencia de consola:
Riesgo identificado:
Mejora propuesta:
```

---

## Síntesis final

La configuración básica de Jenkins consiste en preparar un acceso fiable, reconocer los componentes, usar las herramientas disponibles y ejecutar un primer job con resultados comprensibles.

- El controlador coordina; los agentes ejecutan.
- Los jobs tienen builds, logs y workspaces asociados.
- Los plugins amplían Jenkins y deben administrarse con cuidado.
- Las herramientas globales deben coincidir con las instaladas en los agentes.
- Los permisos deben ser limitados al propósito de la práctica.
- Los secretos pertenecen al almacén de credenciales, no al `Jenkinsfile`.
- Los mensajes de consola no sustituyen la comprobación del resultado.
- Un diagnóstico útil identifica job, build, agente, etapa y primera causa.
- Los cambios globales requieren autorización.
- Una configuración de laboratorio no debe presentarse como configuración de producción.