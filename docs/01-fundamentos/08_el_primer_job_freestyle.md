# El primer job Freestyle de Jenkins

Un job **Freestyle** es una tarea de Jenkins que se configura principalmente desde la interfaz web. Permite seleccionar un agente, obtener código, ejecutar pasos de construcción y definir qué resultados conservar. Es una forma práctica de conocer los elementos básicos de Jenkins antes de describir flujos más complejos mediante un `Jenkinsfile`.

En esta unidad crearás un job de laboratorio que ejecuta comandos seguros, validará un archivo de ejemplo y revisará el resultado desde la consola de Jenkins. También practicarás cómo provocar un fallo controlado, diagnosticarlo y corregirlo.

> **Aviso para el laboratorio:** utiliza únicamente la instancia y los agentes autorizados por el curso. No instales plugins, cambies permisos globales, gestiones credenciales ni ejecutes comandos de despliegue sin autorización. Los nombres y las opciones de la interfaz pueden variar según la versión de Jenkins y los plugins instalados.

## Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Explicar qué es un job Freestyle.
- Distinguir entre un job y una ejecución.
- Crear un job con un nombre y una descripción claros.
- Seleccionar un agente de laboratorio.
- Añadir un paso de ejecución de shell.
- Iniciar un job manualmente.
- Consultar el resultado y la consola de una ejecución.
- Crear una validación sencilla con comandos de Bash.
- Interpretar códigos de salida comunes.
- Provocar un fallo controlado y corregirlo.
- Reconocer límites de los jobs Freestyle.
- Evitar exponer secretos en la configuración o los logs.
- Documentar un job para facilitar su mantenimiento.
- Comparar un job Freestyle con un pipeline definido como código.

## Qué es un job Freestyle

Un job Freestyle es una configuración de Jenkins que agrupa opciones y acciones para realizar una tarea automatizada.

Desde la interfaz web se pueden definir, según la instalación:

- Un nombre y una descripción.
- El agente donde se ejecutará.
- El origen del código.
- Los disparadores.
- Los parámetros.
- Los pasos de construcción.
- Las acciones posteriores.
- La conservación de ejecuciones y artefactos.

El job define el procedimiento. Cada vez que se ejecuta, Jenkins crea una **ejecución** independiente con su resultado, su consola y sus datos asociados.

### Cuándo resulta útil

Un job Freestyle puede ser apropiado para:

- Aprender los componentes básicos de Jenkins.
- Ejecutar una comprobación sencilla.
- Automatizar una tarea pequeña.
- Explorar cómo se relacionan un agente y un workspace.
- Realizar una actividad guiada desde la interfaz.
- Mantener una tarea heredada que todavía no se ha trasladado a pipeline.

### Cuándo puede dejar de ser adecuado

Un job Freestyle puede resultar difícil de mantener cuando:

- Tiene muchos pasos y condiciones.
- El flujo requiere ramas complejas.
- La configuración necesita revisión frecuente.
- Se quiere versionar el proceso junto al código.
- Existen varios jobs casi idénticos.
- La lógica depende de muchos parámetros.
- El equipo necesita reproducir la configuración en distintas instancias.

Para flujos más amplios, un pipeline en un `Jenkinsfile` puede ser más fácil de revisar y versionar. La elección depende del contexto; Freestyle sigue siendo útil para aprender conceptos y automatizar tareas acotadas.

## Job, ejecución, paso y agente

Conviene separar los conceptos que aparecen durante la práctica.

### Job

El **job** es la configuración guardada en Jenkins. Por ejemplo:

```text
curso-freestyle-validar-mensaje
```

El job puede definir el agente, el comando y las condiciones de ejecución.

### Ejecución

Una **ejecución** es una instancia concreta del job. Jenkins suele asignar a cada ejecución un número:

```text
#1
#2
#3
```

Una ejecución tiene un resultado propio, aunque utilice la misma configuración que otras.

### Paso de construcción

Un **paso de construcción** es una acción que Jenkins ejecuta dentro del job. Puede ser un comando de shell o una acción proporcionada por un plugin.

### Agente

El **agente** es el nodo donde se ejecutan los pasos. Puede ser distinto del controlador de Jenkins y puede tener otro sistema operativo, usuario, shell y conjunto de herramientas.

### Workspace

El **workspace** es el directorio de trabajo asociado a la ejecución. Puede contener el código obtenido desde un repositorio y los archivos generados por los pasos.

No asumas que el workspace es permanente. Jenkins puede limpiarlo o reutilizarlo según la configuración.

## Preparación del entorno

La práctica se realizará en una instancia de Jenkins proporcionada por el curso.

### Requisitos

Antes de empezar, confirma que dispones de:

- Acceso a la URL de la instancia de laboratorio.
- Una cuenta de usuario autorizada.
- Permiso para crear un job de práctica.
- Un agente adecuado para los comandos indicados.
- Acceso a una terminal local para preparar los archivos.
- Git, si la práctica incluye un repositorio.
- Las instrucciones actuales del docente o del laboratorio.

### Restricciones

Durante esta unidad:

- No utilices credenciales de producción.
- No ejecutes comandos con `sudo`.
- No modifiques servicios del sistema.
- No borres jobs ajenos.
- No cambies la configuración global de Jenkins.
- No instales plugins en una instancia compartida.
- No ejecutes comandos de despliegue.
- No guardes contraseñas o tokens en los scripts.
- No publiques la interfaz de Jenkins en una red abierta.

### Consultar el estado de Jenkins

Abre la URL indicada por el curso y comprueba que se trata de la instancia correcta.

Confirma:

- El nombre o descripción del entorno.
- La cuenta con la que has iniciado sesión.
- Si el entorno es compartido.
- Qué acciones tienes autorizadas.
- Qué agente debes utilizar.
- Dónde pedir ayuda si aparece un error.

### Registrar información de la instancia

Anota esta información sin incluir secretos:

```text
Nombre del laboratorio:
URL autorizada:
Usuario o identificador de alumno:
Agente indicado:
Sistema operativo del agente, si se conoce:
Restricciones:
Contacto de soporte:
```

No incluyas la contraseña de Jenkins en tus notas.

## Conocer la interfaz antes de crear el job

La interfaz de Jenkins puede cambiar ligeramente entre versiones.

### Página principal

En el panel principal identifica:

- El nombre de Jenkins.
- La lista de jobs visibles.
- El estado de las ejecuciones recientes.
- El menú principal.
- La opción para crear un elemento nuevo, si está disponible.
- Los avisos visibles.
- La cuenta con la que has iniciado sesión.

No modifiques jobs existentes durante la exploración.

### Jobs compartidos

Una instancia de laboratorio puede contener jobs de otros alumnos o del equipo docente.

Antes de seleccionar o modificar un job:

- Lee su nombre.
- Revisa su descripción.
- Comprueba quién parece mantenerlo.
- Evita cambiar su configuración si no te pertenece.
- No ejecutes jobs que puedan afectar a otros participantes.
- Pregunta antes de borrar o renombrar cualquier elemento.

### Opciones de administración

La interfaz puede mostrar una sección de administración. En esta unidad no es necesario cambiar la configuración global.

No instales plugins ni cambies permisos para completar una práctica introductoria.

## Plan de la primera práctica

El job de esta unidad seguirá un recorrido simple:

1. Iniciará manualmente.
2. Ejecutará comandos de consulta.
3. Validará la presencia de un archivo.
4. Revisará el contenido esperado.
5. Mostrará mensajes claros en la consola.
6. Marcará la ejecución como exitosa o fallida según la validación.

La primera versión no necesita conexión con Git ni credenciales.

En una segunda actividad, el job podrá obtener código desde un repositorio de práctica, si el curso lo permite.

## Elegir un nombre claro

Un nombre claro ayuda a entender la finalidad del job sin abrir su configuración.

### Ejemplos recomendados

```text
curso-freestyle-consulta-agente
curso-freestyle-validar-mensaje
practica-01-comprobar-archivo
```

### Ejemplos que conviene evitar

```text
test
prueba
nuevo
job-final
test2
```

Un nombre demasiado genérico se vuelve difícil de distinguir cuando hay muchos jobs.

### Convenciones de nombres

Al proponer un nombre:

- Utiliza el propósito principal.
- Mantén un formato consistente.
- Evita datos personales innecesarios.
- No incluyas contraseñas, tokens o información sensible.
- Sigue la convención indicada por el docente.
- Evita nombres que puedan confundirse con producción.

## Crear el job desde la interfaz

Realiza estos pasos únicamente si tienes permiso para crear jobs en la instancia de laboratorio.

### Abrir la opción de creación

Desde el panel de Jenkins:

1. Localiza la opción para crear un elemento nuevo.
2. Selecciónala.
3. Introduce el nombre acordado.
4. Escoge el tipo **Freestyle project**, si aparece.
5. Confirma la creación.

Si la opción no está disponible, puede que tu usuario no tenga permisos para crear jobs.

No intentes cambiar permisos para evitar esa limitación. Solicita al docente que cree el job o habilite el acceso previsto.

### Confirmar el tipo

Revisa que el tipo elegido sea Freestyle y que el nombre esté escrito correctamente.

Antes de guardar, comprueba que no estás abriendo un job existente con un nombre parecido.

### Guardar solo después de revisar

Antes de guardar la configuración:

- Revisa el nombre.
- Añade una descripción.
- Confirma el agente.
- Comprueba que los comandos son inocuos.
- Verifica que no hay secretos.
- Asegúrate de no haber seleccionado una opción de despliegue.

## Escribir una descripción útil

La descripción explica a otras personas qué hace el job y cuáles son sus límites.

### Plantilla sugerida

```text
Propósito:
Agente:
Comandos o validaciones:
Cómo se inicia:
Resultado esperado:
Restricciones:
Responsable:
```

### Ejemplo

```text
Propósito:
Validar un archivo de mensaje en un ejercicio introductorio.

Agente:
Agente Linux de laboratorio indicado por el docente.

Comandos o validaciones:
Comprobar que app/mensaje.txt existe y contiene la palabra Jenkins.

Cómo se inicia:
Manual durante la sesión práctica.

Resultado esperado:
La ejecución termina correctamente cuando se cumplen las validaciones.

Restricciones:
No instala paquetes, no utiliza credenciales y no despliega software.
```

### Por qué importa la descripción

Una buena descripción ayuda a:

- Entender el objetivo del job.
- Evitar ejecutar una tarea equivocada.
- Recordar las restricciones.
- Diagnosticar resultados.
- Transferir el mantenimiento.
- Distinguir el job de otros similares.

## Seleccionar el agente

El agente determina dónde se ejecutan los pasos.

### Comprobar qué agente está disponible

La instancia puede mostrar etiquetas, nodos o agentes con distintos nombres.

Utiliza el agente indicado por el curso. No elijas un agente de producción ni cambies su configuración.

### Herramientas necesarias

Para los ejemplos de esta unidad, el agente debería disponer de:

- Una shell compatible.
- `echo`.
- `test`.
- `grep`.
- Acceso al workspace.
- Permisos para leer los archivos de la práctica.

Si el ejercicio usa un repositorio Git, también se necesita Git y acceso de red al repositorio.

### Agente no especificado

Algunas configuraciones utilizan un agente predeterminado. No asumas que ejecutará el job en tu ordenador.

Si no sabes dónde se ejecutará:

- Consulta al docente.
- Revisa las etiquetas disponibles.
- Comprueba la descripción del job.
- Evita comandos que modifiquen el sistema.

### Capacidad del agente

Un agente puede estar:

- Conectado y disponible.
- Desconectado.
- Ocupado.
- Esperando una conexión.
- Sin la etiqueta requerida.
- Limitado por recursos.

Si el job queda esperando, consulta su estado y pide ayuda antes de cambiar la configuración global.

## Añadir un primer paso de construcción

La práctica empieza con un comando que solo escribe texto en la consola.

### Comando inicial

```bash
sleep 10
echo "Primer job Freestyle del curso"
sleep 10
```

Este comando no instala nada ni modifica archivos.

### Qué comprobar

Antes de añadirlo:

- Confirma que el paso corresponde a una shell Linux.
- Utiliza el agente indicado.
- No añadas `sudo`.
- No incluyas credenciales.
- Mantén el primer paso pequeño.
- Guarda una copia de la configuración si el curso lo solicita.

### Guardar y ejecutar

1. Guarda la configuración.
2. Revisa la página del job.
3. Inicia una ejecución manual.
4. Espera a que termine.
5. Abre la consola.
6. Comprueba el mensaje.
7. Registra el resultado.

### Resultado esperado

La consola debería incluir:

```text
Primer job Freestyle del curso
```

La ejecución debería terminar correctamente si el agente pudo ejecutar el comando.

## Iniciar una ejecución manual

La forma de iniciar una ejecución puede variar según la interfaz y los permisos de la instancia.

### Antes de iniciar

Comprueba:

- Que estás en la página del job correcto.
- Que no hay una ejecución anterior que debas revisar.
- Que los parámetros tienen valores adecuados, si existen.
- Que el agente de laboratorio está disponible.
- Que el job no realiza una operación no autorizada.

### Iniciar el job

Selecciona la acción de inicio manual indicada en la interfaz, por ejemplo, la opción equivalente a **Build Now** o **Construir ahora**.

Jenkins crea una nueva ejecución y muestra su estado.

### Esperar sin duplicar ejecuciones

No pulses varias veces el botón de inicio si la primera ejecución todavía está en curso.

Las ejecuciones duplicadas pueden:

- Ocupar agentes.
- Crear resultados repetidos.
- Modificar los mismos archivos.
- Confundir el diagnóstico.
- Consumir recursos innecesariamente.

### Consultar la ejecución

Al finalizar:

- Abre el número de ejecución.
- Revisa el resultado.
- Consulta la consola.
- Comprueba la duración.
- Anota el agente utilizado.
- Verifica si se generaron archivos.

## Leer la salida de consola

La consola contiene la salida de los pasos ejecutados y mensajes de Jenkins.

### Qué buscar

Al revisar la consola, identifica:

- El inicio de la ejecución.
- La revisión de código, si se obtuvo.
- El agente o nodo.
- El directorio de trabajo, si se imprime.
- Los comandos.
- Los mensajes de validación.
- El primer error relevante.
- El resultado final.

### Leer el fallo desde su origen

Cuando una ejecución falla:

1. Localiza la primera etapa o comando que no terminó.
2. Lee las líneas anteriores.
3. Comprueba las líneas posteriores.
4. Distingue entre el mensaje del comando y el resumen de Jenkins.
5. Anota el código de salida, si aparece.
6. Evita empezar por el último mensaje si solo resume un fallo anterior.

### Logs y datos sensibles

La consola puede mostrar información del sistema y del entorno.

Antes de compartir un fragmento:

- Comprueba si contiene credenciales.
- Oculta nombres de usuario innecesarios.
- Elimina tokens y contraseñas.
- Evita publicar rutas privadas.
- Comparte solo las líneas pertinentes.

## Códigos de salida

Muchos comandos de shell comunican el resultado mediante un código de salida.

### Convención común

- `0` suele representar éxito.
- Un número distinto de `0` suele representar error o condición no cumplida.

Algunos comandos utilizan códigos distintos para diferentes situaciones. Consulta su documentación si el detalle importa.

### Ejemplo con `grep`

El comando:

```bash
grep -q "Jenkins" app/mensaje.txt
```

puede devolver un código exitoso cuando encuentra la palabra.

Si no encuentra la palabra, puede devolver un código distinto de cero.

### Comprobar el código en una terminal local

Ejecuta el comando que quieres probar:

```bash
grep -q "Jenkins" app/mensaje.txt
```

Inmediatamente después, consulta:

```bash
echo $?
```

No ejecutes otro comando entre ambos si quieres leer el código de salida del primero.

### Códigos y estado de Jenkins

Un paso de shell que termina con un código distinto de cero puede hacer que Jenkins marque la ejecución como fallida.

Si un script ignora errores o fuerza un código exitoso, la interfaz puede mostrar un resultado engañoso.

No ocultes un fallo sin documentar por qué.

## Preparar un directorio de práctica

Para validar un archivo, primero crea los archivos en un proyecto local.

### Crear el directorio

En una terminal propia:

```bash
mkdir -p "$HOME/practicas-devops/job-freestyle"
cd "$HOME/practicas-devops/job-freestyle"
```

Comprueba la ruta:

```bash
pwd
```

### Crear la estructura

```bash
mkdir -p app
```

Crea el archivo de mensaje:

```bash
printf 'Práctica inicial de Jenkins\n' > app/mensaje.txt
```

Comprueba el contenido:

```bash
cat app/mensaje.txt
```

### Mantener la ruta conocida

La ruta `app/mensaje.txt` es relativa al directorio desde el que se ejecuta el comando.

En Jenkins, los pasos suelen ejecutarse desde el workspace o desde otro directorio configurado.

Asegúrate de que el job se ejecuta desde la raíz del proyecto.

## Preparar una validación sencilla

El job comprobará dos condiciones:

- Que el archivo exista.
- Que contenga la palabra `Jenkins`.

### Validar que el archivo existe

En una terminal:

```bash
test -f app/mensaje.txt
```

Si el archivo existe, el comando termina correctamente.

Si no existe, devuelve un código de salida distinto de cero.

### Validar el contenido

Ejecuta:

```bash
grep -q "Jenkins" app/mensaje.txt
```

La opción `-q` solicita que `grep` no muestre el contenido coincidente; solo comunica el resultado mediante el código de salida.

### Validar ambas condiciones

```bash
test -f app/mensaje.txt && grep -q "Jenkins" app/mensaje.txt
```

El segundo comando se ejecuta si el primero termina correctamente.

### Mostrar un mensaje legible

```bash
if test -f app/mensaje.txt && grep -q "Jenkins" app/mensaje.txt; then
  echo "OK: el archivo existe y contiene Jenkins"
else
  echo "ERROR: revisa el archivo y su contenido"
  exit 1
fi
```

Este ejemplo distingue el resultado y termina con un código de error si no se cumple la condición.

## Añadir la validación al job

Después de confirmar que tu configuración Freestyle se ejecuta correctamente, sustituye el paso inicial o añade el paso de validación autorizado.

### Contenido del paso de shell

```bash
echo "Comprobando el archivo de práctica"

if test -f app/mensaje.txt && grep -q "Jenkins" app/mensaje.txt; then
  echo "OK: el archivo existe y contiene Jenkins"
else
  echo "ERROR: revisa app/mensaje.txt"
  exit 1
fi
```

### Condiciones para que funcione

El agente debe encontrar `app/mensaje.txt` en el directorio de trabajo del job.

Si el archivo solo existe en tu ordenador local, Jenkins no lo encontrará automáticamente.

El archivo debe formar parte del repositorio que Jenkins obtiene o de la preparación autorizada del workspace.

### Confirmar la ruta de ejecución

Para diagnosticar rutas, puedes añadir:

```bash
echo "Directorio del job:"
pwd
```

No imprimas todas las variables de entorno. Algunas pueden contener datos sensibles.

## Crear el proyecto como repositorio Git

La opción recomendada para una validación reproducible es incluir los archivos en un repositorio de práctica.

### Inicializar Git

Desde la raíz del proyecto:

```bash
git init
```

### Configurar la identidad local

Si Git lo solicita, configura los datos indicados por el curso:

```bash
git config user.name "Nombre del alumno"
git config user.email "alumno@example.com"
```

En un equipo compartido, evita cambiar la configuración global sin autorización.

### Revisar los archivos

```bash
git status
```

```bash
git diff
```

Los archivos nuevos pueden no aparecer en la salida de `git diff` hasta que se preparen.

### Añadir los archivos

```bash
git add app/mensaje.txt
```

Comprueba el área de preparación:

```bash
git diff --cached
```

### Crear el commit

```bash
git commit -m "Añade mensaje para práctica Freestyle"
```

El mensaje debería describir lo que se añadió.

### Confirmar el estado

```bash
git status
```

El repositorio debería mostrar un estado limpio si no hay otros cambios pendientes.

## Conectar el job a un repositorio Git

Esta actividad requiere un repositorio de práctica autorizado.

### Requisitos

Necesitas:

- La URL correcta del repositorio.
- Una rama existente.
- Acceso de lectura para Jenkins.
- Un agente con Git.
- Autorización para editar el job.

### Configurar el repositorio

En la sección de gestión del código fuente del job:

- Selecciona Git, si está disponible.
- Escribe la URL del repositorio.
- Indica la rama que debe utilizarse.
- Selecciona una credencial de lectura si el repositorio es privado.
- Comprueba que no haya un token incluido en la URL.

La interfaz exacta depende de Jenkins y de sus plugins.

### Elegir una rama

Utiliza la rama indicada por el docente.

No escribas un nombre de rama suponiendo que existe. Confírmalo en el repositorio.

### Ejecutar y verificar

Después de iniciar el job, comprueba:

- Que Jenkins pudo obtener el código.
- Que se muestra la rama o commit correcto.
- Que existe `app/mensaje.txt` en el workspace.
- Que la validación encuentra el texto esperado.
- Que no se imprimen credenciales.

### Si el repositorio es público

Un repositorio público puede permitir lectura sin credenciales. No agregues una credencial innecesaria.

### Si el repositorio es privado

Solicita al docente la credencial o el método de acceso autorizado.

No utilices tu token personal en texto claro dentro de la configuración visible.

## Freestyle con checkout y validación

Esta secuencia conceptual muestra el orden de un job conectado a Git.

### Orden lógico

1. Jenkins obtiene el código.
2. Jenkins prepara el workspace.
3. Jenkins ejecuta el paso de validación.
4. Jenkins presenta el resultado.

### Comandos de validación

```bash
test -f app/mensaje.txt
grep -q "Jenkins" app/mensaje.txt
echo "OK: validación superada"
```

Si alguna comprobación falla, el job debería indicarlo.

### No duplicar el checkout

Si Jenkins ya obtiene el repositorio mediante la configuración del job, no es necesario ejecutar `git clone` desde el paso de shell.

Un segundo clon puede:

- Descargar el repositorio en una ruta diferente.
- Ocultar qué revisión se está validando.
- Añadir credenciales al comando.
- Hacer más difícil reproducir el resultado.

### Confirmar la revisión

Consulta la salida de checkout del job.

Registra:

- Rama.
- Commit.
- Mensaje asociado.
- Hora de ejecución.
- Resultado.

## Acciones posteriores a la construcción

Un job Freestyle puede ofrecer acciones que se ejecutan después de los pasos principales.

La disponibilidad depende de la versión y los plugins.

### Archivar artefactos

Puedes archivar archivos generados durante la ejecución.

Un patrón de archivo debe coincidir con una ruta que exista dentro del workspace.

Ejemplo conceptual de ruta:

```text
salida/mensaje.txt
```

No archives todo el workspace sin necesidad. Podrías conservar archivos temporales o información sensible.

### Publicar resultados de pruebas

Si las pruebas producen un informe en un formato compatible, Jenkins puede mostrar tendencias o resúmenes mediante una acción o plugin.

Comprueba:

- El formato del informe.
- La ruta.
- Que el informe se genere antes de publicarlo.
- Qué ocurre si el informe no existe.
- Si el plugin está autorizado.

### Limpiar el workspace

La limpieza puede configurarse antes o después de una ejecución.

Antes de activarla:

- Confirma qué archivos elimina.
- Comprueba si afecta a otros jobs.
- Considera el impacto en el tiempo de ejecución.
- Conserva los artefactos e informes necesarios.

### Notificaciones

Una notificación puede informar del resultado, pero no debe incluir secretos ni ruido innecesario.

Define:

- Qué resultados notifican.
- A quién se notifica.
- Qué canal está aprobado.
- Qué información se incluye.
- Quién mantiene la integración.

## Crear un job con un archivo de salida

Esta práctica amplía la validación y genera un archivo que Jenkins puede conservar.

### Preparar el mensaje

Comprueba que existe:

```text
app/mensaje.txt
```

Y que contiene una referencia a Jenkins.

### Crear el archivo de salida

En un paso de shell autorizado:

```bash
mkdir -p salida
cp app/mensaje.txt salida/mensaje.txt
```

### Comprobar el resultado

```bash
test -f salida/mensaje.txt
cat salida/mensaje.txt
```

### Archivar el archivo

Utiliza la acción de archivado disponible en la instancia, si el docente lo permite.

El patrón debe apuntar al archivo generado:

```text
salida/mensaje.txt
```

### Interpretación

El archivo archivado queda asociado a una ejecución según la configuración de Jenkins.

Archivar no equivale a desplegar, publicar en un registro externo ni conservar para siempre.

## Introducir parámetros de forma segura

Un job puede aceptar valores que cambian entre ejecuciones.

### Parámetros apropiados para este ejercicio

Pueden resultar adecuados:

- Una palabra que se validará.
- Un modo `simple` o `detallado`.
- Una opción booleana para mostrar información adicional.

No utilices valores de producción ni datos personales.

### Validar los valores

Antes de usarlos:

- Define qué valores son permitidos.
- Rechaza valores inesperados.
- Evita interpolar texto no validado en un comando.
- No permitas que el parámetro controle cualquier ruta o URL.
- No uses un parámetro común para una contraseña.

### Ejemplo conceptual de uso

Si el job valida un texto configurable, debería limitarse a una lista de valores o validar que el texto no contenga caracteres que alteren el comando.

Para un ejercicio inicial, es más seguro utilizar una lista de opciones que aceptar cualquier texto.

### Parámetros no son credenciales

Una contraseña no debería introducirse como un parámetro de texto común.

Utiliza el mecanismo de credenciales autorizado por Jenkins y limita qué job puede acceder a él.

## Disparadores del job Freestyle

Los disparadores controlan cuándo comienza una ejecución.

### Inicio manual

Es la opción recomendada para la primera práctica.

Permite:

- Ejecutar cuando el alumno esté preparado.
- Observar el resultado paso a paso.
- Evitar ejecuciones inesperadas.
- Practicar el diagnóstico sin automatizar eventos externos.

### Disparador basado en cambios

Un job puede iniciarse al detectar cambios en Git.

La configuración puede depender de:

- Webhooks.
- Sondeo del repositorio.
- Integración con la plataforma Git.
- Configuración de permisos y red.

No habilites un disparador global en una instancia compartida sin autorización.

### Programación

Un job puede iniciarse según un horario.

Para este ejercicio no es necesario programarlo.

Antes de crear una programación, define:

- La necesidad.
- La frecuencia.
- Quién atenderá los fallos.
- Qué recursos consume.
- Qué zona horaria utiliza la instancia.

### Disparadores duplicados

Configurar varios disparadores puede iniciar más de una ejecución para el mismo cambio.

Comprueba cómo interactúan antes de activar varios métodos.

## Parámetros y desencadenadores: actividad de análisis

Antes de guardar configuraciones, analiza estas situaciones.

### Situación A

Una persona inicia manualmente un job de validación durante una clase.

**Ventaja:** la ejecución se produce cuando el alumno está preparado.

**Riesgo:** alguien puede olvidar iniciar la validación.

### Situación B

El job se ejecuta cada vez que cambia la rama de práctica.

**Ventaja:** se obtiene feedback con rapidez.

**Riesgo:** puede haber muchas ejecuciones o ejecutarse código que aún no ha sido revisado.

### Situación C

El job se ejecuta todas las noches.

**Ventaja:** puede detectar problemas que aparecen con cambios externos o dependencias.

**Riesgo:** requiere seguimiento de resultados y puede consumir recursos sin necesidad.

### Preguntas

- ¿Qué disparador encaja con la práctica?
- ¿Qué datos necesita cada método?
- ¿Qué permisos requiere?
- ¿Cómo se evita ejecutar el job en el agente equivocado?
- ¿Quién revisa los fallos?

## Primera sesión guiada: job de consulta

Esta sesión enseña a crear, ejecutar y observar un job sin conectar un repositorio.

### Duración orientativa

- Exploración: 5 minutos.
- Configuración: 10 minutos.
- Ejecución: 10 minutos.
- Reflexión: 10 minutos.

### Paso 1: verificar el permiso

Comprueba que puedes crear jobs en la instancia de laboratorio.

Si no puedes, solicita el job preparado por el docente.

### Paso 2: crear el job

Crea un Freestyle con el nombre:

```text
curso-freestyle-consulta-agente
```

Añade una descripción que indique que es un job de consulta, de solo laboratorio y sin cambios del sistema.

### Paso 3: seleccionar el agente

Selecciona el agente indicado por el docente.

Si no hay un agente asignado, detente y pregunta antes de continuar.

### Paso 4: añadir comandos

Utiliza estos comandos si el agente es Linux:

```bash
echo "Inicio del job"
echo "Sistema:"
uname -s
echo "Usuario:"
whoami
echo "Directorio:"
pwd
echo "Fin del job"
```

### Paso 5: guardar y ejecutar

Guarda el job.

Inicia una única ejecución manual.

Espera a que termine antes de volver a ejecutarlo.

### Paso 6: revisar la consola

Anota:

- Sistema operativo.
- Usuario.
- Directorio.
- Resultado.
- Duración aproximada.
- Agente seleccionado.

### Preguntas de cierre

- ¿El job se ejecutó en tu ordenador?
- ¿Qué indica el usuario que apareció?
- ¿Qué información sería inseguro imprimir?
- ¿Qué comandos de la actividad son de solo consulta?

## Segunda sesión guiada: validar un archivo

Esta sesión introduce una condición de éxito y un fallo controlado.

### Paso 1: crear el archivo

Prepara el archivo en un repositorio de práctica o en el entorno que haya configurado el docente:

```text
app/mensaje.txt
```

Contenido inicial:

```text
Práctica de Jenkins Freestyle
```

### Paso 2: añadir el paso de validación

Utiliza:

```bash
echo "Validando app/mensaje.txt"

if test -f app/mensaje.txt && grep -q "Jenkins" app/mensaje.txt; then
  echo "OK: archivo y contenido correctos"
else
  echo "ERROR: revisa el archivo y el texto esperado"
  exit 1
fi
```

### Paso 3: ejecutar en estado válido

Inicia el job.

El resultado esperado es una ejecución exitosa.

La consola debería incluir el mensaje `OK`.

### Paso 4: provocar un fallo

Cambia el contenido para que no incluya `Jenkins`.

Ejecuta el job de nuevo.

El resultado esperado es una ejecución fallida con un mensaje comprensible.

### Paso 5: corregir

Restaura el contenido válido.

Vuelve a ejecutar el job.

Comprueba que el resultado cambia de fallo a éxito.

### Registro de resultados

| Ejecución | Contenido | Resultado | Primera causa visible |
|---|---|---|---|
| 1 | Válido | | |
| 2 | Inválido | | |
| 3 | Corregido | | |

### Preguntas

- ¿Qué condición provocó el fallo?
- ¿En qué línea de la consola se ve?
- ¿Qué código de salida se produjo?
- ¿Qué diferencia hay entre un fallo de prueba y un error de configuración?
- ¿Qué información ayudó a corregirlo?

## Tercera sesión guiada: añadir un paso de preparación

En esta sesión, el job creará un archivo de salida después de validar el contenido.

### Objetivo

El job debe:

1. Validar `app/mensaje.txt`.
2. Detenerse si la validación falla.
3. Crear `salida/`.
4. Copiar el archivo validado.
5. Mostrar un mensaje al terminar.

### Secuencia de shell

```bash
set -eu

echo "Etapa 1: comprobar entrada"
test -f app/mensaje.txt
grep -q "Jenkins" app/mensaje.txt

echo "Etapa 2: preparar salida"
mkdir -p salida
cp app/mensaje.txt salida/mensaje.txt

echo "Etapa 3: comprobar salida"
test -f salida/mensaje.txt

echo "OK: salida preparada"
```

### Por qué usar `set -eu`

`set -e` hace que un script de Bash salga ante ciertos errores no gestionados.

`set -u` hace que el script trate algunas variables no definidas como error.

Estas opciones pueden ayudar a evitar que el script continúe después de un fallo, pero hay que entender su comportamiento y probarlo.

### Revisar los archivos creados

En la consola, comprueba:

- Que se creó el directorio.
- Que se copió el archivo.
- Que se validó la salida.
- Que el mensaje final aparece solo después de las comprobaciones.

### Archivar la salida

Si el curso lo permite, configura una acción posterior para conservar:

```text
salida/mensaje.txt
```

Después de una ejecución exitosa, localiza el artefacto desde la página de la ejecución.

## Cuarta sesión guiada: job conectado a Git

Esta sesión requiere un repositorio de práctica y el permiso correspondiente.

### Preparar el repositorio

El repositorio debería incluir:

```text
app/
└── mensaje.txt
```

Comprueba que el archivo contiene la palabra `Jenkins`.

Registra el commit que se utilizará.

### Configurar el origen

En el job Freestyle:

- Selecciona la opción de control de versiones Git.
- Escribe la URL del repositorio.
- Selecciona la rama autorizada.
- Añade credenciales de lectura solo si son necesarias.
- Evita escribir tokens en la URL.
- No configures un remoto de producción.

### Añadir el paso de validación

Después del checkout, ejecuta:

```bash
test -f app/mensaje.txt
grep -q "Jenkins" app/mensaje.txt
echo "OK: revisión validada"
```

### Ejecutar y confirmar

Después de la ejecución, comprueba:

- El checkout del repositorio.
- La rama.
- El commit.
- La presencia del archivo.
- El resultado del paso.
- El estado final.

### Provocar un cambio en Git

En una rama de práctica:

1. Modifica el archivo.
2. Elimina la palabra `Jenkins`.
3. Guarda el cambio.
4. Crea un commit.
5. Ejecuta el job.
6. Identifica la etapa o comando que falla.

### Corregir el cambio

Restaura la palabra esperada.

Crea otro commit y vuelve a ejecutar el job.

Comprueba que Jenkins procesa la revisión corregida.

## Práctica opcional: conservar un informe

Un informe ayuda a comunicar resultados y a diagnosticar problemas.

### Crear un resumen durante la ejecución

Un paso autorizado puede crear un archivo de texto:

```bash
mkdir -p informes
{
  echo "Resultado de validación"
  date
  echo "Archivo: app/mensaje.txt"
} > informes/resumen.txt
```

No incluyas variables de entorno ni datos sensibles en el informe.

### Comprobar el archivo

```bash
test -s informes/resumen.txt
cat informes/resumen.txt
```

La opción `-s` comprueba que el archivo existe y no está vacío.

### Archivar el informe

Utiliza la acción de archivado disponible, si el docente la ha habilitado.

El patrón debería apuntar a:

```text
informes/resumen.txt
```

### Preguntas

- ¿Qué información aporta el informe?
- ¿Qué datos conviene excluir?
- ¿En qué se diferencia de la consola?
- ¿Cuánto tiempo debería conservarse?
- ¿Qué ejecución permitiría identificar su origen?

## Introducción a los parámetros

Una vez que el job básico funciona, se puede practicar con parámetros no sensibles.

### Propósito de un parámetro

Un parámetro permite variar la ejecución sin cambiar todos los pasos del job.

Puede representar:

- Un modo de validación.
- Un texto esperado.
- Una opción para generar un informe.
- Una rama, si el curso lo permite.

### Diseñar parámetros con límites

Antes de crear uno:

- Define valores permitidos.
- Proporciona un valor predeterminado seguro.
- Valida el valor.
- Evita que el parámetro controle una operación destructiva.
- No uses texto libre si bastan opciones predefinidas.

### Actividad de análisis

Diseña un parámetro llamado `MODO` que solo acepte:

```text
simple
detallado
```

Responde:

- ¿Qué hará cada modo?
- ¿Qué valor predeterminado utilizará?
- ¿Qué ocurre con un valor distinto?
- ¿Qué información mostrará el modo detallado?
- ¿Cómo evitarás imprimir datos sensibles?

## Disparadores en la primera práctica

El job inicial debería ejecutarse manualmente.

### Por qué empezar manualmente

El inicio manual permite:

- Ver cuándo se ejecuta el trabajo.
- Comprender cada ejecución.
- Evitar automatizaciones inesperadas.
- Controlar el consumo de un agente compartido.
- Practicar la lectura de resultados.

### Cuándo considerar un disparador por cambios

Un disparador basado en cambios puede ser útil cuando:

- El repositorio está configurado.
- La integración de red está autorizada.
- Las pruebas ofrecen feedback rápido.
- El agente puede atender ejecuciones.
- Los cambios tienen un flujo de revisión definido.

### Cuándo considerar una programación

Un horario puede ser útil para una tarea periódica, pero debe existir:

- Una necesidad concreta.
- Un responsable del resultado.
- Una política de recursos.
- Un procedimiento ante fallos.
- Un criterio para dejar de ejecutar la tarea.

## Resultados: éxito, fallo, inestable y abortado

Jenkins muestra un estado para cada ejecución.

### Éxito

La ejecución terminó correctamente según las condiciones del job.

Comprueba qué validaciones se ejecutaron realmente.

### Fallo

Una etapa o comando terminó con error.

Localiza el primer fallo útil, no solo el resumen final.

### Inestable

El job puede marcarse como inestable si una prueba o acción secundaria no se considera completamente exitosa.

La definición depende de las herramientas y plugins utilizados.

### Abortado

Una persona o una condición interrumpió la ejecución.

El estado abortado no indica automáticamente que el código esté mal.

### Esperando agente

El job puede estar en cola hasta que un agente adecuado esté disponible.

No inicies varias ejecuciones iguales sin comprobar la capacidad del agente.

## Diagnosticar fallos comunes

### El job no encuentra el archivo

Comprueba:

- El directorio de trabajo.
- La ruta relativa.
- El checkout del repositorio.
- Las mayúsculas y minúsculas.
- El commit utilizado.
- Que el archivo esté confirmado en Git.

### `grep` no encuentra el texto

Comprueba:

- La palabra esperada.
- El contenido del archivo.
- La rama y commit ejecutados.
- Si el archivo correcto está en el workspace.
- Si el patrón distingue mayúsculas y minúsculas.

### El agente no tiene Bash

Comprueba qué sistema operativo utiliza el agente.

En un agente Windows, un paso de Bash puede no estar disponible o requerir otra configuración.

No cambies el agente sin consultar al docente.

### El job queda en cola

Comprueba:

- Si hay ejecutores disponibles.
- Si el agente está conectado.
- Si la etiqueta requerida existe.
- Si el job está limitado a un agente.
- Si otra ejecución ocupa los recursos.

### El job obtiene una rama inesperada

Comprueba:

- La configuración de rama.
- Los parámetros.
- El evento que inició el job.
- La revisión mostrada en la consola.
- Si el job sigue la rama predeterminada.

### El comando funciona localmente, pero falla en Jenkins

Compara:

- Sistema operativo.
- Shell.
- Usuario.
- Herramientas.
- Directorio.
- Permisos.
- Variables necesarias.
- Archivos confirmados.
- Conectividad.

### El job no archiva el archivo

Comprueba:

- Que el archivo se haya generado.
- Que la ruta sea correcta.
- Que la acción de archivado esté configurada.
- Que el patrón coincida.
- Que el job haya alcanzado esa acción.
- Que el almacenamiento de Jenkins esté disponible.

## Método de diagnóstico paso a paso

Cuando un job falle, no cambies varias opciones al azar.

### Recopilar información

Registra:

- Nombre del job.
- Número de ejecución.
- Resultado.
- Agente.
- Paso fallido.
- Comando relevante.
- Mensaje exacto.
- Rama o commit.
- Cambios recientes.

### Formular una hipótesis

Una hipótesis debería explicar una evidencia.

Ejemplo:

```text
Hipótesis:
El job no encuentra el archivo porque el workspace no contiene el
directorio app en la revisión obtenida.
```

### Comprobar la hipótesis

Busca una comprobación que distinga la causa propuesta de otras posibilidades.

Por ejemplo:

```bash
pwd
find . -maxdepth 3 -type f -print
```

Evita listar datos sensibles o archivos ajenos al proyecto.

### Cambiar una sola cosa

Haz un cambio controlado y vuelve a ejecutar.

Si modificas muchas opciones a la vez, puede ser difícil saber cuál resolvió o empeoró el problema.

### Documentar la solución

Anota:

- La causa confirmada.
- El cambio aplicado.
- El resultado nuevo.
- La prevención propuesta.
- Si hay que actualizar la documentación del job.

## Seguridad y permisos

Un job puede ejecutar código en un agente. Por tanto, sus permisos y entradas importan.

### Mínimo privilegio

El job de esta unidad solo necesita:

- Leer los archivos de práctica.
- Ejecutar comandos de consulta.
- Escribir dentro del workspace.
- Archivar el archivo autorizado, si corresponde.

No necesita:

- Acceso de administrador.
- Credenciales de producción.
- Permiso para modificar servicios.
- Acceso a repositorios no relacionados.
- Acceso irrestricto a la red.

### Código externo

Antes de ejecutar un repositorio que no conoces:

- Comprueba su procedencia.
- Lee el `Jenkinsfile`.
- Inspecciona scripts.
- Evita proporcionar credenciales privilegiadas.
- Utiliza un agente aislado.
- Sigue la política del laboratorio.

### Comandos destructivos

No añadas comandos de borrado o limpieza a un job sin entender:

- Qué ruta se modifica.
- Si el recurso es compartido.
- Quién es propietario.
- Qué datos se perderán.
- Cómo se recupera el estado.

### Credenciales

No incluyas credenciales en:

- La descripción.
- Los parámetros de texto.
- Los comandos visibles.
- Los logs.
- El repositorio.
- Las capturas.

## Buenas prácticas para mantener un Freestyle

### Mantenerlo pequeño

Agrupa pasos relacionados, pero evita un job que haga tareas independientes sin una razón clara.

### Describir el propósito

Explica qué hace el job y qué no hace.

### Separar configuración y secretos

Utiliza mecanismos seguros para las credenciales.

No codifiques contraseñas en comandos.

### Nombrar los pasos con claridad

Cuando la interfaz permita nombrar pasos, utiliza títulos que indiquen su finalidad.

### Fallar de forma visible

Una condición esencial que no se cumple debería reflejarse en el estado del job.

No transformes un error real en éxito para que el historial parezca limpio.

### Guardar solo resultados útiles

Archiva los archivos que ayudan a consultar o reproducir la ejecución.

Evita guardar directorios completos sin necesidad.

### Revisar el job periódicamente

Comprueba:

- Que el job sigue siendo necesario.
- Que la descripción es correcta.
- Que sus dependencias están disponibles.
- Que las credenciales siguen autorizadas.
- Que sus artefactos se conservan según la política.
- Que el agente asignado sigue siendo apropiado.

## Comparación con un pipeline

Un job Freestyle se configura principalmente en la interfaz. Un pipeline define un flujo de pasos, con frecuencia en un `Jenkinsfile`.

### Freestyle

Puede ser una buena opción para:

- Una primera explicación práctica.
- Un comando sencillo.
- Un job pequeño.
- Una tarea heredada.
- Una prueba inicial de la instancia.

### Pipeline

Puede ser más adecuado cuando:

- Hay varias etapas.
- El flujo cambia junto con el código.
- Se necesitan condiciones y paralelismo.
- El equipo quiere revisar la definición con Git.
- Se necesita reproducir el proceso.

### Diferencias resumidas

| Aspecto | Freestyle | Pipeline |
|---|---|---|
| Configuración habitual | Interfaz de Jenkins | `Jenkinsfile` o definición de pipeline |
| Inicio para principiantes | Sencillo en tareas pequeñas | Requiere conocer la estructura del pipeline |
| Revisión de cambios | Puede ser menos visible en Git | Puede revisarse con el código |
| Varias etapas | Posibles, pero pueden crecer en la interfaz | Representación explícita del flujo |
| Uso didáctico | Introducción a jobs y ejecuciones | Automatización versionada |

### Una opción no invalida la otra

No es necesario migrar todos los jobs a pipelines de inmediato.

La decisión debe considerar:

- Complejidad.
- Mantenimiento.
- Necesidad de revisión.
- Reutilización.
- Conocimientos del equipo.
- Capacidades de la instancia.

## Ficha de documentación de un job

Completa una ficha antes de considerar el job terminado.

```text
Nombre del job:
Propósito:
Descripción:
Tipo:
Responsable:
Repositorio:
Rama:
Agente:
Herramientas:
Disparador:
Parámetros:
Pasos:
Resultado esperado:
Artefactos:
Permisos:
Credenciales:
Restricciones:
Procedimiento de diagnóstico:
Última revisión:
```

### Ejemplo de ficha cumplimentada

```text
Nombre del job:
curso-freestyle-validar-mensaje

Propósito:
Validar que el archivo app/mensaje.txt existe y contiene Jenkins.

Tipo:
Freestyle.

Responsable:
Grupo de laboratorio.

Repositorio:
Repositorio local de práctica indicado por el docente.

Rama:
Rama de práctica.

Agente:
Agente Linux de laboratorio.

Herramientas:
Bash, test y grep.

Disparador:
Manual durante la sesión.

Resultado esperado:
Éxito si existe el archivo y contiene la palabra Jenkins.

Artefactos:
Copia del mensaje, si la práctica activa el archivado.

Permisos:
Lectura del repositorio y escritura en el workspace.

Restricciones:
Sin credenciales y sin despliegues.

Procedimiento de diagnóstico:
Revisar checkout, directorio de trabajo, archivo y consola.
```

## Checklist antes de guardar

Antes de guardar el job, comprueba:

- [ ] El nombre describe el propósito.
- [ ] La descripción explica lo que hace.
- [ ] El agente es el autorizado.
- [ ] Los comandos son seguros para el laboratorio.
- [ ] No hay contraseñas en la configuración.
- [ ] No se han añadido permisos innecesarios.
- [ ] El directorio de trabajo está claro.
- [ ] Los fallos se mostrarán como fallos.
- [ ] No se ha configurado un despliegue accidental.
- [ ] El job no modifica trabajos de otras personas.
- [ ] Los parámetros tienen límites definidos.
- [ ] Los artefactos, si los hay, son intencionados.

## Checklist después de una ejecución

Después de cada ejecución de la práctica, comprueba:

- [ ] El número de ejecución.
- [ ] El resultado final.
- [ ] El agente utilizado.
- [ ] La consola.
- [ ] El primer error relevante.
- [ ] La rama o commit, si se usa Git.
- [ ] Los archivos generados.
- [ ] Que no se imprimieron secretos.
- [ ] Que no se ejecutaron comandos inesperados.
- [ ] Que sabes cuál es el siguiente paso.

## Actividad de cierre de la práctica

Escribe en tus notas:

- El nombre del job.
- Su propósito.
- El agente que utilizó.
- El comando principal.
- El resultado de la ejecución correcta.
- El resultado del fallo controlado.
- La causa del fallo.
- La corrección aplicada.
- Una limitación del job.
- Una mejora que propondrías.

No incluyas la contraseña de Jenkins ni credenciales en esas notas.

## Preguntas de repaso

1. ¿Qué diferencia hay entre un job Freestyle y una ejecución?
2. ¿Qué función cumple el agente?
3. ¿Qué contiene un workspace?
4. ¿Por qué no debe asumirse que el workspace es permanente?
5. ¿Qué hace que una ejecución termine como fallida?
6. ¿Qué diferencia hay entre un artefacto y un archivo temporal?
7. ¿Qué información debería incluir la descripción de un job?
8. ¿Por qué conviene empezar con un disparador manual?
9. ¿Qué dato indica qué revisión de Git se validó?
10. ¿Por qué no se deben escribir secretos en los comandos?
11. ¿Qué comprobarías si Jenkins no encuentra `app/mensaje.txt`?
12. ¿Qué significa un código de salida distinto de cero?
13. ¿Qué información de la consola ayuda a diagnosticar un fallo?
14. ¿Qué diferencia hay entre archivar un artefacto y desplegarlo?
15. ¿En qué situación podría convenir convertir un Freestyle en un pipeline?
16. ¿Qué permisos necesita el job de validación?
17. ¿Qué riesgos introduce un agente con permisos excesivos?
18. ¿Por qué un resultado exitoso no demuestra que la aplicación sea perfecta?
19. ¿Qué información incluirías en un informe de fallo?
20. ¿Qué pasos seguirías antes de borrar un job de laboratorio?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Un job es una configuración de trabajo y una ejecución es una instancia de esa configuración».

### Afirmación 2

«El job Freestyle se ejecuta siempre en el ordenador del alumno».

### Afirmación 3

«Un comando de shell puede provocar que Jenkins marque una ejecución como fallida».

### Afirmación 4

«Si el job pasa, todas las funcionalidades de la aplicación están verificadas».

### Afirmación 5

«El workspace debe tratarse como almacenamiento permanente».

### Afirmación 6

«Un job puede obtener código desde un repositorio Git».

### Afirmación 7

«Es aceptable escribir un token de GitHub en la URL del repositorio para ahorrar configuración».

### Afirmación 8

«Una descripción clara ayuda a mantener un job».

### Afirmación 9

«Una acción de archivado y una acción de despliegue hacen lo mismo».

### Afirmación 10

«Un job de práctica debe utilizar credenciales de producción para parecer realista».

### Afirmación 11

«Un fallo controlado puede ayudar a comprobar que el job informa de los errores».

### Afirmación 12

«Un job en cola puede estar esperando un agente disponible».

### Afirmación 13

«Es útil asociar la ejecución con la rama y el commit que procesó».

### Afirmación 14

«Una ejecución abortada demuestra que el código es incorrecto».

### Afirmación 15

«Un pipeline puede ser más apropiado que Freestyle cuando el flujo necesita varias etapas versionadas».

## Respuestas orientativas del ejercicio

### Afirmación 1

**Correcta.** El job define el trabajo y cada ejecución representa una instancia.

### Afirmación 2

**Incorrecta.** El job se ejecuta en el agente configurado, que puede ser remoto.

### Afirmación 3

**Correcta.** Un código de salida de error puede hacer fallar el paso.

### Afirmación 4

**Incorrecta.** Solo se han comprobado las condiciones configuradas.

### Afirmación 5

**Incorrecta.** El workspace puede limpiarse o reutilizarse.

### Afirmación 6

**Correcta.** Jenkins puede obtener código desde Git.

### Afirmación 7

**Incorrecta.** Un token en la URL puede quedar expuesto en la configuración o los logs.

### Afirmación 8

**Correcta.** La descripción aporta propósito, contexto y restricciones.

### Afirmación 9

**Incorrecta.** Archivar conserva un archivo; desplegar instala o activa una versión en un entorno.

### Afirmación 10

**Incorrecta.** Utiliza solo credenciales de laboratorio autorizadas.

### Afirmación 11

**Correcta.** El fallo controlado permite comprobar la respuesta del job.

### Afirmación 12

**Correcta.** Puede no haber un ejecutor disponible.

### Afirmación 13

**Correcta.** Esa relación facilita la trazabilidad.

### Afirmación 14

**Incorrecta.** Una ejecución puede abortarse por razones externas al código.

### Afirmación 15

**Correcta.** Un `Jenkinsfile` permite versionar y revisar el flujo.

## Glosario

- **Agente:** nodo que ejecuta los pasos de Jenkins.
- **Artefacto:** archivo generado y conservado por una ejecución.
- **Build:** término usado habitualmente para una ejecución o construcción.
- **Código de salida:** valor devuelto por un comando para indicar su resultado.
- **Disparador:** evento o condición que inicia un job.
- **Ejecución:** instancia concreta de un job.
- **Freestyle:** tipo de job configurado principalmente desde la interfaz.
- **Job:** configuración guardada que describe una tarea automatizada.
- **Jenkinsfile:** archivo que define un pipeline como código.
- **Log de consola:** salida de los pasos ejecutados por Jenkins.
- **Parámetro:** valor proporcionado al iniciar una ejecución.
- **Pipeline:** secuencia de etapas y pasos automatizados.
- **Workspace:** directorio de trabajo utilizado por una ejecución.
- **Checkout:** obtención de una revisión de código desde un repositorio.
- **Agente compartido:** nodo utilizado por varios jobs o participantes.
- **Retención:** periodo o cantidad de ejecuciones y artefactos que Jenkins conserva.

## Resumen

- Un job Freestyle es una tarea configurada principalmente desde la interfaz de Jenkins.
- Una ejecución es una instancia concreta del job, con su número, resultado y consola.
- El agente ejecuta los comandos; no tiene por qué ser el ordenador del alumno.
- El workspace contiene archivos de trabajo, pero no debe considerarse almacenamiento permanente.
- Una validación puede comprobar archivos, contenido y condiciones mediante comandos sencillos.
- Un código de salida distinto de cero suele indicar que un comando no terminó correctamente.
- La consola ayuda a diagnosticar fallos, pero debe revisarse antes de compartirla.
- Los jobs pueden obtener código de Git, iniciar tareas, archivar artefactos y publicar resultados.
- Las credenciales deben gestionarse con mecanismos seguros y permisos limitados.
- Freestyle es útil para aprender y para tareas sencillas; un pipeline puede ser más adecuado para flujos versionados y con varias etapas.