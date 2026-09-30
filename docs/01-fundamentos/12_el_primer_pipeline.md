# El primer pipeline de Jenkins

Un pipeline de Jenkins define una secuencia de pasos que Jenkins ejecuta para validar, construir o empaquetar un proyecto. Su definición puede guardarse en un archivo llamado `Jenkinsfile`, dentro del repositorio. Así, el flujo de trabajo queda versionado junto al código y puede revisarse como cualquier otro cambio.

En esta unidad construirás tu primer pipeline declarativo. Empezarás con un mensaje sencillo, añadirás comprobaciones, ejecutarás una validación local y terminarás con un artefacto de práctica. También provocarás fallos controlados para aprender a leer los resultados.

> **Entorno de práctica:** trabaja solo en la instancia, el repositorio y los agentes autorizados por el curso. Estos ejemplos no despliegan a producción ni necesitan credenciales. No añadas contraseñas, tokens o claves a un `Jenkinsfile`, un script o un log.

## Esquema de la página

- ## Conceptos fundamentales
  - ### Qué es un pipeline
  - ### Job, pipeline, ejecución, etapa y paso
  - ### Por qué guardar el pipeline como código
  - ### Pipeline declarativo y Scripted
- ## Estructura de un Jenkinsfile
  - ### `pipeline`
  - ### `agent`
  - ### `stages`, `stage` y `steps`
  - ### Comandos y resultados
  - ### `post`
- ## Preparar el proyecto
  - ### Crear el directorio
  - ### Crear la aplicación de ejemplo
  - ### Crear una validación
  - ### Probar localmente
- ## Prácticas guiadas
  - ### Pipeline mínimo
  - ### Pipeline con validaciones
  - ### Pipeline con artefacto
  - ### Conectar el repositorio
  - ### Provocar y corregir fallos
- ## Diagnóstico y buenas prácticas
  - ### Leer la consola
  - ### Errores frecuentes
  - ### Seguridad y mantenimiento
  - ### Sesiones de práctica
  - ### Repaso y glosario

## Conceptos fundamentales

Un pipeline permite describir un flujo de trabajo y ejecutar sus pasos de forma ordenada.

### Qué es un pipeline

Un pipeline es una definición ejecutable de un proceso de automatización.

Puede indicar:

- Qué agente utiliza Jenkins.
- Qué etapas forman el flujo.
- Qué comandos se ejecutan.
- Qué archivos se validan.
- Qué resultados se archivan.
- Qué hacer cuando una etapa falla.
- Qué acciones realizar al terminar.

El pipeline puede ser pequeño, como un único comando, o formar parte de un proceso de entrega más amplio.

### Para qué sirve

Un pipeline puede automatizar tareas como:

- Obtener código desde un repositorio.
- Validar la estructura de un proyecto.
- Ejecutar pruebas.
- Construir una aplicación.
- Generar documentación.
- Crear un paquete.
- Archivar informes.
- Publicar un artefacto.
- Desplegar a un entorno autorizado.

La automatización debe corresponder a una necesidad concreta. Añadir etapas sin propósito aumenta la complejidad.

### Qué no garantiza un pipeline

Un pipeline no garantiza automáticamente que:

- La aplicación esté libre de defectos.
- Se hayan ejecutado todas las pruebas necesarias.
- El artefacto sea seguro.
- El código cumpla todos los requisitos.
- El despliegue sea reversible.
- El entorno de destino sea el esperado.
- Los secretos estén protegidos.

El pipeline ejecuta las comprobaciones que se han definido. El equipo debe decidir si esas comprobaciones son suficientes para el riesgo del cambio.

### Job, pipeline y ejecución

Los términos describen partes distintas de Jenkins.

- **Job:** configuración que Jenkins administra y puede ejecutar.
- **Pipeline:** flujo automatizado que contiene etapas y pasos.
- **Ejecución:** instancia concreta de un job o pipeline.
- **Etapa:** grupo lógico de acciones.
- **Paso:** acción concreta dentro de una etapa.
- **Agente:** sistema donde se ejecutan los pasos.

Un job Pipeline puede iniciarse muchas veces.

Cada ejecución puede procesar una rama, un commit o unos parámetros diferentes.

### Ejemplo de varias ejecuciones

```text
Job: primer-pipeline
    ├── Ejecución #1: prueba correcta
    ├── Ejecución #2: validación fallida
    └── Ejecución #3: cambio corregido
```

El job contiene la configuración.

Cada ejecución tiene su propio estado, consola, duración y artefactos.

### Etapa y paso

Una etapa describe una parte del proceso.

Un paso realiza una acción específica.

Por ejemplo:

```text
Etapa: Validar proyecto
    Paso: comprobar que existe README.md
    Paso: ejecutar el script de validación
```

Las etapas ayudan a localizar dónde ocurrió un fallo.

Los pasos explican qué hizo Jenkins dentro de cada etapa.

### Pipeline declarativo y Scripted

Jenkins admite más de un estilo de pipeline.

- **Declarativo:** utiliza una estructura explícita y predecible.
- **Scripted:** permite escribir lógica con más libertad en Groovy.

Esta unidad usa el estilo declarativo.

Es una buena opción para aprender las partes principales del flujo.

### Por qué empezar con Declarative Pipeline

La estructura declarativa facilita reconocer:

- Dónde comienza la definición.
- Qué agente se utiliza.
- Cuáles son las etapas.
- Qué pasos se ejecutan.
- Qué ocurre después de la ejecución.

Un ejemplo inicial:

```groovy
pipeline {
    agent any

    stages {
        stage('Hola') {
            steps {
                echo 'Hola desde Jenkins'
            }
        }
    }
}
```

No es necesario aprender Groovy a fondo para entender este primer ejemplo.

### Qué es un `Jenkinsfile`

Un `Jenkinsfile` es un archivo de texto que contiene una definición de pipeline.

Normalmente se guarda en la raíz del repositorio.

Una estructura habitual es:

```text
proyecto/
├── Jenkinsfile
├── README.md
├── app/
└── scripts/
```

Jenkins puede obtener este archivo desde Git y utilizarlo para ejecutar el pipeline.

### Ventajas de versionar el pipeline

Guardar el `Jenkinsfile` en Git puede ayudar a:

- Revisar cambios del proceso.
- Mantener historial.
- Relacionar el flujo con el código.
- Compartir la definición con el equipo.
- Recuperar una versión anterior.
- Aplicar revisiones al pipeline.

### El pipeline también es código

Un `Jenkinsfile` puede ejecutar comandos y utilizar permisos.

Por eso debe revisarse antes de ejecutarlo.

Comprueba:

- Qué agente solicita.
- Qué comandos ejecuta.
- Qué archivos modifica.
- Qué credenciales utiliza.
- A qué servicios se conecta.
- Qué artefactos conserva.
- Si incluye operaciones destructivas.

## Estructura de un Jenkinsfile

Un pipeline declarativo utiliza bloques con propósitos definidos.

### Bloque `pipeline`

`pipeline` contiene la definición del flujo.

Dentro puede haber elementos como:

- `agent`
- `stages`
- `environment`
- `parameters`
- `options`
- `triggers`
- `post`

No todos los pipelines necesitan todos esos bloques.

### Bloque `agent`

`agent` especifica dónde se ejecutará el pipeline o una etapa.

Una opción habitual es:

```groovy
agent any
```

Jenkins buscará un agente disponible que pueda ejecutar el trabajo según la configuración de la instancia.

`any` no significa que Jenkins utilice cualquier equipo conectado a Internet.

### Agente con etiqueta

Un pipeline puede solicitar una etiqueta concreta:

```groovy
agent {
    label 'laboratorio'
}
```

La etiqueta debe existir en la instancia y estar asignada a un agente autorizado.

Si no existe un agente compatible o está desconectado, la ejecución puede quedarse en cola.

### Agente por etapa

Es posible definir un agente para una etapa específica, según la estructura del pipeline.

Esto resulta útil si distintas tareas necesitan entornos distintos.

Antes de repartir etapas entre agentes, decide:

- Qué archivos necesita cada etapa.
- Cómo se transfieren esos archivos.
- Qué workspace utiliza cada agente.
- Qué herramientas requiere cada nodo.
- Qué ocurre si un agente no está disponible.

### Bloque `stages`

`stages` agrupa las etapas principales del pipeline.

Por ejemplo:

```groovy
stages {
    stage('Validar') {
        steps {
            echo 'Validación'
        }
    }

    stage('Construir') {
        steps {
            echo 'Construcción'
        }
    }
}
```

Las etapas se ejecutan en orden, salvo que se configure una forma explícita de paralelismo.

### Bloque `stage`

`stage` define una etapa del proceso.

El nombre debería describir el objetivo de la etapa.

Nombres claros:

- `Comprobar estructura`
- `Ejecutar pruebas`
- `Preparar artefacto`
- `Archivar salida`

Nombres poco claros:

- `Paso 1`
- `Cosas`
- `Prueba nueva`
- `Final final`

### Bloque `steps`

`steps` contiene las acciones concretas de una etapa.

Algunos ejemplos son:

- `echo`
- `sh`
- `bat`
- `archiveArtifacts`
- `junit`
- `input`

La disponibilidad de algunos pasos depende de la versión de Jenkins y de los plugins instalados.

### Paso `echo`

`echo` imprime un mensaje en la salida de la ejecución.

```groovy
echo 'Comienza la validación'
```

Un mensaje útil indica qué tarea empieza o cuál ha sido su resultado.

No uses `echo` para imprimir secretos.

### Paso `sh`

`sh` solicita a Jenkins que ejecute un comando de shell Unix en el agente.

```groovy
sh 'pwd'
```

El agente debe disponer de una shell compatible.

Un comando Unix no funcionará necesariamente en un agente Windows.

### Paso `bat`

`bat` ejecuta comandos de Windows en un agente compatible.

La disponibilidad y sintaxis dependen del agente y de su configuración.

Si la práctica usa Windows, utiliza los ejemplos proporcionados por el docente.

### Bloque `post`

`post` define acciones que se ejecutan al terminar el pipeline, según la condición indicada.

Puede incluir condiciones como:

- `success`
- `failure`
- `always`
- `unstable`
- `aborted`
- `changed`

La lista disponible y su comportamiento dependen de la versión de Jenkins.

### Ejemplo de `post`

```groovy
post {
    success {
        echo 'El pipeline terminó correctamente.'
    }

    failure {
        echo 'El pipeline falló. Revisa la consola.'
    }

    always {
        echo 'La ejecución ha finalizado.'
    }
}
```

No utilices `post` para ocultar errores o marcar como correcto un proceso que no superó sus validaciones.

## Preparar el proyecto de práctica

Antes de crear el pipeline en Jenkins, prepara archivos que puedas validar.

### Crear el directorio de práctica

En una terminal propia:

```bash
mkdir -p "$HOME/practicas-devops/primer-pipeline"
cd "$HOME/practicas-devops/primer-pipeline"
```

Comprueba que estás en el directorio esperado:

```bash
pwd
```

No trabajes en una carpeta compartida o ajena sin autorización.

### Crear la estructura del proyecto

```bash
mkdir -p app scripts
```

El proyecto tendrá esta estructura:

```text
primer-pipeline/
├── app/
└── scripts/
```

### Crear el archivo de aplicación

```bash
printf 'Proyecto inicial de Jenkins\n' > app/mensaje.txt
```

Comprueba el contenido:

```bash
cat app/mensaje.txt
```

El archivo contiene la palabra que verificará el pipeline.

### Crear un README

```bash
cat > README.md <<'EOF'
# Proyecto de práctica

Este proyecto se utiliza para aprender pipelines de Jenkins.

## Validación local

Ejecuta:

```bash
bash scripts/validar.sh
```

La validación comprueba que app/mensaje.txt contiene la palabra Jenkins.
EOF
```

El contenido anterior es para un archivo del proyecto.

La documentación de este capítulo mantiene un único título principal.

### Crear el script de validación

Crea el archivo `scripts/validar.sh`:

```bash
cat > scripts/validar.sh <<'EOF'
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
EOF
```

### Dar permiso de ejecución

En Linux o macOS:

```bash
chmod +x scripts/validar.sh
```

La práctica también puede ejecutar el archivo explícitamente con `bash`, aunque no se marque como ejecutable.

### Revisar el script

Abre el archivo y comprueba:

- Que la ruta es correcta.
- Que la frase esperada está escrita como se pretende.
- Que el mensaje de éxito es claro.
- Que los errores terminan con un código distinto de cero.
- Que no hay contraseñas o tokens.

## Probar la validación localmente

Ejecutar el script localmente ayuda a separar errores del script de errores de Jenkins.

### Ejecutar el script

Desde la raíz del proyecto:

```bash
bash scripts/validar.sh
```

El resultado esperado es:

```text
OK: se encontró el texto esperado
```

### Comprobar el código de salida

Justo después de ejecutar el script:

```bash
echo $?
```

Un resultado `0` suele indicar que terminó correctamente.

Un número distinto de cero suele indicar que hubo un error.

### Por qué probar localmente primero

La prueba local puede confirmar que:

- La ruta existe.
- La condición funciona.
- El script está escrito correctamente.
- El resultado esperado es claro.

No demuestra que el agente de Jenkins tenga las mismas herramientas o archivos.

### Comparar los entornos

El ordenador local y el agente pueden diferir en:

- Sistema operativo.
- Versión de Bash.
- Permisos.
- Directorio de trabajo.
- Herramientas instaladas.
- Contenido del repositorio.
- Variables configuradas.

Jenkins ejecutará los comandos en el agente asignado, no necesariamente en tu ordenador.

## El primer pipeline: mostrar un mensaje

La primera versión debe ser pequeña y fácil de interpretar.

### Crear el archivo `Jenkinsfile`

En la raíz del proyecto, crea un archivo llamado exactamente:

```text
Jenkinsfile
```

No añadas una extensión como `.txt` si Jenkins espera el nombre estándar.

### Pipeline mínimo

```groovy
pipeline {
    agent any

    stages {
        stage('Hola') {
            steps {
                echo 'Hola desde mi primer pipeline'
            }
        }
    }
}
```

### Leer el ejemplo

- `pipeline` contiene la definición.
- `agent any` solicita un agente disponible.
- `stages` agrupa las etapas.
- `stage('Hola')` define una etapa.
- `steps` contiene las acciones.
- `echo` imprime un mensaje.

### Qué no hace este ejemplo

Este pipeline no:

- Obtiene código desde Git.
- Ejecuta pruebas.
- Construye una aplicación.
- Archiva un artefacto.
- Despliega software.
- Utiliza credenciales.

### Revisar la sintaxis

Antes de ejecutarlo, comprueba:

- Que cada llave `{` tiene su correspondiente `}`.
- Que las comillas están cerradas.
- Que los nombres de los bloques están escritos correctamente.
- Que `stages` está dentro de `pipeline`.
- Que `steps` está dentro de `stage`.

### Guardar y ejecutar

Guarda el archivo siguiendo las instrucciones de la práctica.

Inicia una ejecución manual desde Jenkins.

Consulta:

- El estado final.
- La vista de etapas.
- La salida de consola.
- El nombre del agente.
- La duración.

### Resultado esperado

La consola debería mostrar:

```text
Hola desde mi primer pipeline
```

La ejecución debería terminar correctamente si Jenkins pudo asignar un agente y ejecutar el paso.

## Conectar Jenkins con el `Jenkinsfile`

Para ejecutar el archivo desde Git, Jenkins necesita conocer el repositorio y la ubicación del pipeline.

### Requisitos

Necesitas:

- Un repositorio de práctica autorizado.
- Un `Jenkinsfile` en una ruta conocida.
- Un agente adecuado.
- Acceso de lectura al repositorio.
- Permiso para crear o configurar el job.

### Elegir el tipo de job

Según la instancia, puedes utilizar:

- Un job Pipeline.
- Un job Multibranch Pipeline.
- Otro tipo configurado por el docente.

Para la primera práctica, sigue el tipo indicado por el curso.

### Pipeline en la interfaz

Algunas prácticas permiten escribir el pipeline directamente en la configuración del job.

Es útil para un ejemplo breve.

No ofrece por sí solo el mismo historial de cambios que un `Jenkinsfile` versionado en Git.

### Pipeline desde el repositorio

Una configuración de tipo Pipeline puede obtener el `Jenkinsfile` desde un repositorio.

La interfaz puede solicitar:

- Tipo de control de versiones.
- URL.
- Credencial.
- Rama.
- Ruta del script de pipeline.

Las opciones exactas dependen de Jenkins y de sus plugins.

### No incluir tokens en la URL

No pegues un token dentro de la URL del repositorio.

Los tokens en URLs pueden aparecer en:

- La configuración del job.
- Los logs.
- Los mensajes de error.
- Las herramientas de diagnóstico.

Utiliza una credencial gestionada por Jenkins cuando sea necesaria.

### Rama y revisión

Confirma qué rama se utilizará.

Una ejecución debería poder relacionarse con:

- Rama.
- Commit.
- Número de ejecución.
- Resultado.

No supongas que Jenkins usa la misma rama que tu terminal local.

## Pipeline con validaciones

La segunda versión valida la estructura y el contenido del proyecto.

### Etapa para comprobar archivos

```groovy
stage('Comprobar estructura') {
    steps {
        sh 'test -f README.md'
        sh 'test -f app/mensaje.txt'
        sh 'test -f scripts/validar.sh'
    }
}
```

`test -f` comprueba que una ruta existe y es un archivo regular.

Si una comprobación falla, el paso suele devolver un código distinto de cero.

### Etapa para ejecutar el script

```groovy
stage('Ejecutar validación') {
    steps {
        sh 'bash scripts/validar.sh'
    }
}
```

El comando ejecuta la validación desde el directorio de trabajo.

El agente debe tener Bash y los archivos requeridos.

### Pipeline completo de validación

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar estructura') {
            steps {
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Ejecutar validación') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }
    }

    post {
        success {
            echo 'El proyecto ha superado la validación.'
        }

        failure {
            echo 'La validación ha fallado. Revisa la etapa correspondiente.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

### Orden de las etapas

Primero se comprueba la estructura.

Después se ejecuta el script.

Si la estructura no es válida, el pipeline puede detenerse antes de intentar ejecutar el script.

Este orden produce un error más temprano y más fácil de diagnosticar.

### Fallar pronto

Las comprobaciones rápidas suelen colocarse antes de las operaciones costosas.

Ejemplos:

- Comprobar archivos antes de descargar dependencias.
- Validar configuración antes de construir.
- Ejecutar pruebas rápidas antes de pruebas largas.
- Comprobar parámetros antes de modificar un entorno.

### Mensajes de etapa

Un mensaje claro puede indicar:

- Qué etapa empieza.
- Qué archivo se está comprobando.
- Qué criterio se espera.
- Qué hacer si falla.

No hace falta imprimir cada detalle si no ayuda al diagnóstico.

## Pipeline con salida y artefacto

Un pipeline puede generar y archivar un archivo de salida.

### Crear un directorio de salida

```groovy
sh 'mkdir -p salida'
```

El directorio se crea dentro del workspace actual.

### Copiar el mensaje

```groovy
sh 'cp app/mensaje.txt salida/mensaje.txt'
```

El comando presupone que el archivo de entrada existe.

Por eso la validación debe ejecutarse antes.

### Archivar el archivo

```groovy
archiveArtifacts artifacts: 'salida/mensaje.txt',
                 fingerprint: true
```

El archivo se asocia a la ejecución según la configuración de Jenkins.

### Pipeline con artefacto

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'bash scripts/validar.sh'
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

    post {
        success {
            echo 'Validación y archivado completados.'
        }

        failure {
            echo 'El pipeline no completó todas las etapas.'
        }
    }
}
```

### Qué significa archivar

Archivar permite conservar un archivo asociado a una ejecución.

Puede facilitar:

- Descargar un resultado.
- Inspeccionar la salida.
- Relacionar un archivo con un build.
- Compartir evidencia del ejercicio.

### Qué no significa archivar

Archivar no significa necesariamente que el archivo:

- Se haya publicado en un registro externo.
- Se haya desplegado.
- Sea permanente.
- Sea seguro para producción.
- Haya superado todas las comprobaciones posibles.

### Ruta de archivado

El patrón de archivo debe coincidir con una ruta existente dentro del workspace.

Comprueba:

- Mayúsculas y minúsculas.
- Directorio actual.
- Nombre del archivo.
- Que la etapa anterior haya creado la salida.
- Que la ejecución no haya fallado antes.

## Fallos y códigos de salida

El pipeline utiliza los resultados de sus pasos para decidir si continúa.

### Código de salida de un comando

Muchos comandos de shell utilizan esta convención:

- `0`: ejecución correcta.
- Distinto de `0`: error o condición no satisfecha.

La convención concreta depende del comando.

### Fallo de un paso

Si un paso de shell devuelve un código de error, Jenkins suele marcarlo como fallido.

El comportamiento exacto puede cambiar si el script captura errores o transforma el código de salida.

### No ocultar fallos

Evita ignorar una comprobación esencial solo para que el pipeline termine en verde.

Si una prueba es informativa y no bloqueante, documenta:

- Por qué no bloquea.
- Qué riesgo implica.
- Quién aprobó la decisión.
- Cuándo se revisará.

### Uso de `set -e` y `set -u`

En Bash:

- `set -e` hace que el script salga ante ciertos errores no gestionados.
- `set -u` trata variables no definidas como error en muchos contextos.

Estas opciones pueden ayudar, pero deben probarse y entenderse.

### Mostrar mensajes de error útiles

Un mensaje de error debería indicar:

- Qué condición no se cumplió.
- Qué archivo o paso está implicado.
- Qué se esperaba.
- Qué se debería revisar.

Ejemplo:

```text
ERROR: no se encontró Jenkins en app/mensaje.txt
```

Es más útil que un fallo sin contexto.

## Gestionar el resultado con `post`

El bloque `post` permite definir acciones posteriores a las etapas.

### Condición `success`

Se ejecuta cuando el pipeline termina correctamente según las reglas configuradas.

```groovy
success {
    echo 'Todas las etapas terminaron correctamente.'
}
```

### Condición `failure`

Se ejecuta cuando el pipeline falla.

```groovy
failure {
    echo 'Revisa el primer paso que devolvió un error.'
}
```

### Condición `always`

Se ejecuta al terminar, independientemente del resultado, dentro de las condiciones normales de ejecución.

```groovy
always {
    echo 'La ejecución ha terminado.'
}
```

### Bloque `post` completo

```groovy
post {
    success {
        echo 'Resultado: correcto.'
    }

    failure {
        echo 'Resultado: fallido.'
    }

    always {
        echo 'Fin del pipeline.'
    }
}
```

### No alterar el significado del resultado

Un mensaje en `post` no debería dar a entender que todo fue correcto si una validación falló.

La consola y el estado final deben comunicar resultados coherentes.

### Acciones de limpieza

Una limpieza puede eliminar archivos temporales.

Antes de añadirla:

- Comprueba qué se borra.
- Conserva informes necesarios.
- Confirma el workspace.
- Evita afectar a otros jobs.
- Sigue la política del laboratorio.

## Variables y entorno

Un pipeline puede definir valores para pasos posteriores.

### Variable `environment`

Ejemplo:

```groovy
environment {
    MODO = 'laboratorio'
}
```

El valor anterior no es secreto.

### Utilizar una variable en Groovy

```groovy
echo "Modo: ${env.MODO}"
```

La interpolación depende de Groovy.

### Utilizar una variable en shell

Dentro de una shell Unix, la forma habitual de referirse a una variable de entorno es:

```bash
echo "$MODO"
```

La expansión la realiza el shell.

### Evitar confundir sintaxis

Un `Jenkinsfile` combina elementos de Groovy y pasos de shell.

Comprueba qué lenguaje procesa cada parte:

- El texto dentro de `echo` del pipeline.
- El comando pasado a `sh`.
- El contenido de un script ejecutado por Bash.

### No imprimir todas las variables

Un comando como `env` puede mostrar información sensible si existen credenciales o valores privados.

Imprime solo los valores no sensibles que necesites para la práctica.

## Parámetros

Los parámetros permiten adaptar una ejecución.

### Parámetro de selección

Una selección puede restringir valores permitidos.

Ejemplo conceptual:

```groovy
parameters {
    choice(
        name: 'MODO',
        choices: ['simple', 'detallado'],
        description: 'Selecciona el modo de práctica'
    )
}
```

La sintaxis y las opciones disponibles dependen de la versión y configuración de Jenkins.

### Utilizar el parámetro

```groovy
echo "Modo seleccionado: ${params.MODO}"
```

### Revisar el valor

Antes de usarlo:

- Confirma que está en la lista permitida.
- No lo utilices sin validación en comandos.
- No permitas que elija cualquier destino.
- No lo uses como contraseña.
- Considera un valor predeterminado seguro.

### Parámetros de texto

Un parámetro de texto puede servir para valores no sensibles.

No es un almacén de credenciales.

No pases un secreto como argumento de texto visible.

### Parámetros y acciones importantes

Un parámetro no debería habilitar un despliegue real sin controles adicionales.

Para tareas de alto impacto se requieren:

- Autorización.
- Revisión.
- Credenciales limitadas.
- Confirmación del destino.
- Registro de la operación.
- Procedimiento de recuperación.

## Triggers y ejecuciones

Un pipeline puede iniciarse de varias maneras.

### Inicio manual

Es la forma recomendada para el primer ejercicio.

Permite:

- Controlar el momento de la ejecución.
- Ver cada paso.
- Practicar el diagnóstico.
- Evitar ejecuciones inesperadas.
- No sobrecargar agentes compartidos.

### Cambios en Git

Un pipeline puede iniciarse cuando cambian archivos del repositorio.

Puede utilizar:

- Webhooks.
- Sondeo periódico.
- Integración con el proveedor Git.
- Eventos de solicitud de cambios.

El mecanismo debe configurarse de manera autorizada.

### Programación

Un pipeline puede ejecutarse en un horario.

Antes de programarlo, define:

- Propósito.
- Frecuencia.
- Responsable.
- Recursos.
- Tratamiento de fallos.
- Zona horaria.
- Política de notificaciones.

### Ejecución por otro job

Un pipeline puede depender de otro trabajo.

Documenta:

- La dependencia.
- El orden.
- El comportamiento si el job anterior falla.
- Qué ocurre si hay ejecuciones duplicadas.
- Qué datos se transfieren.

### Evitar duplicados

Varios triggers pueden iniciar más de una ejecución para el mismo cambio.

Comprueba cómo interactúan antes de activar varios métodos.

## Agentes y requisitos del entorno

El pipeline se ejecuta en el agente que Jenkins selecciona.

### Comprobar el agente

Registra, si la práctica lo permite:

- Nombre del agente.
- Sistema operativo.
- Usuario del proceso.
- Directorio de trabajo.
- Herramientas disponibles.
- Etiqueta utilizada.

### Herramientas necesarias

El agente debe tener las herramientas que requiere el pipeline.

Por ejemplo:

- Bash.
- Git.
- Un intérprete.
- Un compilador.
- Un gestor de paquetes.
- Herramientas de prueba.

No des por hecho que están disponibles porque funcionen en tu ordenador.

### Comprobar una herramienta

Un comando de consulta puede ser:

```bash
git --version
```

Ejecuta la comprobación en el agente indicado por la práctica.

### Agentes Windows

Un agente Windows puede requerir pasos `bat` o PowerShell en lugar de `sh`.

Confirma qué shell ejecuta el job y utiliza el ejemplo correcto para el sistema.

### Agentes etiquetados

Si el job solicita una etiqueta:

- Confirma que existe.
- Comprueba el nodo asociado.
- Verifica que tiene las herramientas necesarias.
- Revisa que esté conectado.
- No cambies la etiqueta global sin permiso.

## Integrar con Git

Conectar el pipeline a Git permite validar cambios del repositorio.

### Repositorio de práctica

Utiliza un repositorio autorizado por el docente.

Confirma:

- URL.
- Rama.
- Acceso de lectura.
- Presencia del `Jenkinsfile`.
- Presencia de los archivos que valida.
- Ausencia de secretos.

### Credenciales de repositorio

Un repositorio público puede no requerir credenciales de lectura.

Para un repositorio privado, utiliza solo el mecanismo autorizado.

No incluyas tokens en la URL.

No guardes credenciales en el `Jenkinsfile`.

### Confirmar el commit

Después de la ejecución, registra:

- Rama.
- Commit.
- Mensaje del commit.
- Número de ejecución.
- Resultado.

Esta información ayuda a reproducir una validación.

### Cambios en el `Jenkinsfile`

El propio pipeline forma parte del código que Jenkins obtiene.

Un cambio en el `Jenkinsfile` puede cambiar qué comandos se ejecutan.

Revísalo como cualquier otro cambio de código ejecutable.

## Sesión práctica 1: crear el primer pipeline

Esta práctica se realiza en Jenkins en un entorno de laboratorio.

### Duración orientativa

- Lectura del ejemplo: 5 minutos.
- Creación del job: 10 minutos.
- Ejecución y observación: 10 minutos.
- Reflexión: 10 minutos.

### Requisitos

- Cuenta de laboratorio.
- Permiso para crear un job Pipeline o un job preparado.
- Agente disponible.
- Sin credenciales externas.

### Crear el job

Crea un job con un nombre descriptivo:

```text
curso-primer-pipeline
```

Añade una descripción breve:

```text
Pipeline de laboratorio para aprender etapas y pasos.
No realiza despliegues ni utiliza credenciales.
```

### Pegar la definición

Si el curso permite definir el pipeline desde la interfaz, utiliza:

```groovy
pipeline {
    agent any

    stages {
        stage('Hola') {
            steps {
                echo 'Hola desde Jenkins'
            }
        }
    }
}
```

Si la práctica requiere un `Jenkinsfile` en Git, guarda el archivo allí y configura el job según las instrucciones.

### Ejecutar

1. Guarda la configuración.
2. Inicia una ejecución manual.
3. Espera a que termine.
4. Abre el número de ejecución.
5. Consulta la vista de etapas.
6. Abre la consola.
7. Registra el resultado.
8. Comprueba que no se imprimió información sensible.

### Registro de ejecución

```text
Nombre del job:
Número de ejecución:
Agente:
Resultado:
Duración aproximada:
Mensaje observado:
Duda:
```

### Preguntas

- ¿Qué indica el estado final?
- ¿Qué muestra la vista de etapas?
- ¿Qué aporta la consola?
- ¿Qué parte del ejemplo define el agente?
- ¿Qué cambiarías para añadir una segunda etapa?

## Sesión práctica 2: crear un proyecto desde cero

Esta práctica prepara los archivos que utilizará el pipeline.

### Crear el directorio

```bash
mkdir -p "$HOME/practicas-devops/pipeline-inicial"
cd "$HOME/practicas-devops/pipeline-inicial"
```

### Crear carpetas

```bash
mkdir -p app scripts
```

### Crear el archivo de aplicación

```bash
printf 'Curso de pipelines Jenkins\n' > app/mensaje.txt
```

### Crear el script

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"
TEXTO_ESPERADO="Jenkins"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: falta $ARCHIVO"
  exit 1
fi

if grep -q "$TEXTO_ESPERADO" "$ARCHIVO"; then
  echo "OK: contenido validado"
else
  echo "ERROR: falta la palabra Jenkins"
  exit 1
fi
EOF
```

### Revisar los archivos

```bash
find . -maxdepth 3 -type f -print | sort
```

```bash
cat app/mensaje.txt
```

```bash
cat scripts/validar.sh
```

### Ejecutar localmente

```bash
bash scripts/validar.sh
```

El resultado esperado es que la validación pase.

## Sesión práctica 3: añadir el pipeline al proyecto

Esta sesión guarda el flujo en un archivo versionable.

### Crear el `Jenkinsfile`

```bash
cat > Jenkinsfile <<'EOF'
pipeline {
    agent any

    stages {
        stage('Comprobar estructura') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Ejecutar validación') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }
    }

    post {
        success {
            echo 'Validación completada correctamente.'
        }

        failure {
            echo 'La validación ha fallado.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
EOF
```

### Revisar el archivo

```bash
cat Jenkinsfile
```

Comprueba:

- Llaves.
- Nombres de bloques.
- Orden de etapas.
- Rutas.
- Ausencia de secretos.
- Agente indicado.

### Interpretar el pipeline

Completa esta tabla:

| Sección | Qué hace |
|---|---|
| `agent` | |
| `Comprobar estructura` | |
| `Ejecutar validación` | |
| `success` | |
| `failure` | |
| `always` | |

### Subirlo a Git

Si el curso utiliza un repositorio remoto:

1. Comprueba la URL.
2. Confirma que es el repositorio de práctica.
3. Revisa la rama.
4. Comprueba que no hay secretos.
5. Confirma el `Jenkinsfile` y los archivos necesarios.

No añadas un remoto sin saber a qué repositorio apunta.

## Sesión práctica 4: conectar un job con Git

Esta sesión configura Jenkins para obtener el proyecto.

### Antes de configurar

Comprueba:

- Que el repositorio existe.
- Que la rama indicada existe.
- Que el `Jenkinsfile` está en la ruta esperada.
- Que el agente tiene Git.
- Que Jenkins puede acceder al repositorio.
- Que las credenciales son de laboratorio, si hacen falta.

### Configuración del job

La interfaz puede solicitar:

- Tipo de job.
- URL del repositorio.
- Credencial.
- Rama.
- Ruta del `Jenkinsfile`.

Sigue la guía actual del curso.

### Ejecutar y comprobar

Después de iniciar el job, revisa:

- Que el checkout terminó.
- Que Jenkins obtuvo la rama esperada.
- Qué commit se procesó.
- Que el `Jenkinsfile` se encontró.
- Que el agente ejecutó los pasos.
- Que la validación pasó.

### Si el checkout falla

Comprueba:

- URL.
- Rama.
- Red.
- Acceso de lectura.
- Credencial autorizada.
- Certificados.
- Proxy, si existe.
- Mensaje de la consola.

No copies una contraseña en la URL para resolver el problema.

## Sesión práctica 5: provocar y corregir un fallo

Aprender a diagnosticar un fallo es parte de la práctica.

### Preparar una ejecución correcta

1. Confirma que `app/mensaje.txt` contiene `Jenkins`.
2. Ejecuta `bash scripts/validar.sh` localmente.
3. Confirma el contenido del `Jenkinsfile`.
4. Inicia una ejecución en Jenkins.
5. Revisa todas las etapas.
6. Anota el resultado.

### Provocar un fallo

Cambia el contenido:

```bash
printf 'Curso de automatización\n' > app/mensaje.txt
```

Ejecuta localmente la validación:

```bash
bash scripts/validar.sh
```

El script debería fallar porque ya no encuentra la palabra esperada.

### Ejecutar el pipeline fallido

Guarda el cambio según el flujo de Git de la práctica.

Ejecuta el pipeline y anota:

- La etapa fallida.
- El comando que falló.
- El mensaje del script.
- El resultado final.
- Si se ejecutaron las etapas posteriores.

### Corregir

Restaura un contenido válido:

```bash
printf 'Curso de pipelines Jenkins\n' > app/mensaje.txt
```

Ejecuta de nuevo la validación local.

Después ejecuta el pipeline y confirma que termina correctamente.

### Registro de resultados

| Ejecución | Cambio | Resultado | Etapa relevante |
|---|---|---|---|
| #1 | Archivo válido | | |
| #2 | Texto sin Jenkins | | |
| #3 | Archivo corregido | | |

### Reflexión

- ¿Qué comprobación encontró el error?
- ¿Qué información ayudó a diagnosticarlo?
- ¿Por qué el pipeline debe fallar ante una condición esencial?
- ¿Qué habría pasado si el script siempre terminara con código `0`?

## Sesión práctica 6: preparar un artefacto

Esta actividad genera un archivo y lo conserva en Jenkins.

### Añadir la etapa

Añade al pipeline:

```groovy
stage('Preparar artefacto') {
    steps {
        sh 'mkdir -p salida'
        sh 'cp app/mensaje.txt salida/mensaje.txt'
        archiveArtifacts artifacts: 'salida/mensaje.txt',
                         fingerprint: true
    }
}
```

La etapa debe ejecutarse después de la validación.

### Ejecutar

1. Confirma que el contenido es válido.
2. Guarda los cambios.
3. Ejecuta el pipeline.
4. Comprueba que la etapa de preparación termina.
5. Busca el artefacto en la ejecución.
6. Descárgalo solo si el curso lo permite.
7. Comprueba que el contenido es el esperado.

### Si el artefacto no aparece

Comprueba:

- Que la copia se ejecutó.
- Que el archivo existe en `salida/`.
- Que el patrón coincide.
- Que la ejecución llegó a esa etapa.
- Que la política de Jenkins conserva artefactos.

### Preguntas

- ¿Qué archivo se archivó?
- ¿Dónde se creó antes de archivarse?
- ¿Qué diferencia hay entre artefacto y workspace?
- ¿Qué información relaciona el artefacto con la ejecución?
- ¿El archivado implica despliegue?

## Sesión práctica 7: seleccionar un agente por etiqueta

Esta práctica requiere una etiqueta autorizada.

### Obtener la etiqueta

El docente indicará la etiqueta válida.

Anótala sin modificar:

```text
Etiqueta:
```

No utilices una etiqueta de producción.

### Modificar el agente del pipeline

```groovy
agent {
    label 'ETIQUETA_AUTORIZADA'
}
```

Sustituye el marcador únicamente por la etiqueta proporcionada.

### Ejecutar

1. Guarda el cambio.
2. Revisa la etiqueta.
3. Inicia el pipeline.
4. Comprueba si Jenkins encuentra un agente.
5. Identifica el sistema operativo en la consola.
6. Registra el estado.

### Si el job queda en cola

Comprueba con el docente:

- La escritura exacta de la etiqueta.
- Si existe un agente asociado.
- Si está conectado.
- Si hay un ejecutor disponible.
- Si el agente tiene las herramientas requeridas.

No cambies la configuración de los nodos.

## Sesión práctica 8: añadir un parámetro de modo

Esta actividad utiliza un parámetro no sensible.

### Definir el propósito

El parámetro `MODO` permite elegir:

- `simple`
- `detallado`

En este ejercicio, el modo detallado añadirá un mensaje informativo.

### Ejemplo

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona el nivel de salida'
        )
    }

    stages {
        stage('Mostrar configuración') {
            steps {
                echo "Modo: ${params.MODO}"

                script {
                    if (params.MODO == 'detallado') {
                        echo 'Modo detallado seleccionado.'
                    }
                }
            }
        }
    }
}
```

La sintaxis puede depender de la versión instalada.

Consulta al docente si la instancia no admite el ejemplo.

### Probar el parámetro

Ejecuta el pipeline con cada opción.

Registra:

- Valor elegido.
- Mensajes mostrados.
- Resultado.
- Diferencia entre modos.

### Consideraciones

- El parámetro no debe contener un secreto.
- Los valores deben estar limitados.
- El valor predeterminado debería ser seguro.
- Un parámetro no debe escoger libremente un destino de despliegue.
- Comprueba cualquier valor antes de usarlo en un comando.

## Sesión práctica 9: revisar una etapa condicional

Las condiciones pueden permitir que algunas etapas se ejecuten solo en determinadas circunstancias.

### Ejemplo conceptual

```groovy
stage('Mensaje para rama principal') {
    when {
        branch 'main'
    }

    steps {
        echo 'La condición de rama se ha cumplido.'
    }
}
```

La evaluación de la rama depende del tipo de job y de cómo Jenkins obtiene el código.

### Actividad

1. Lee la condición.
2. Identifica qué rama espera.
3. Ejecuta en el contexto indicado por el docente.
4. Observa si la etapa se ejecutó o se omitió.
5. Consulta los logs y la vista de etapas.
6. Explica la diferencia entre una etapa omitida y una etapa exitosa.

### Precaución

No asumas que una ejecución iniciada manualmente dispone de toda la información de rama.

Confirma el contexto de la ejecución.

## Sesión práctica 10: revisar dos pipelines

El propósito es comparar legibilidad, no contar líneas.

### Pipeline A

```groovy
pipeline {
    agent any

    stages {
        stage('A') {
            steps {
                sh 'test -f app/mensaje.txt'
            }
        }

        stage('B') {
            steps {
                sh 'grep -q "Jenkins" app/mensaje.txt'
            }
        }
    }
}
```

### Pipeline B

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar que existe el mensaje') {
            steps {
                sh 'test -f app/mensaje.txt'
            }
        }

        stage('Comprobar el contenido esperado') {
            steps {
                sh 'grep -q "Jenkins" app/mensaje.txt'
            }
        }
    }
}
```

### Comparación

Responde:

- ¿Cuál indica mejor el propósito de cada etapa?
- ¿Qué nombres serían útiles para el equipo?
- ¿Qué mensajes ayudarían a diagnosticar un fallo?
- ¿Qué documentación añadirías?
- ¿Qué detalle no cambia entre ambos ejemplos?

## Sesión práctica 11: diagnóstico de una ejecución

Utiliza una ejecución fallida preparada por el docente o una que hayas provocado.

### Proceso de revisión

1. Abre la página del job correcto.
2. Identifica el número de ejecución.
3. Confirma el agente utilizado.
4. Localiza la primera etapa fallida.
5. Identifica el comando relacionado.
6. Lee el mensaje completo.
7. Comprueba qué commit se procesó.
8. Formula una hipótesis.
9. Propón una comprobación.
10. No cambies varias opciones a la vez.

### Plantilla de informe

```text
Job:
Ejecución:
Rama:
Commit:
Agente:
Etapa fallida:
Comando:
Mensaje relevante:
Resultado esperado:
Resultado observado:
Hipótesis:
Próxima comprobación:
```

### Compartir el informe

Antes de compartirlo:

- Oculta tokens y contraseñas.
- Elimina datos personales innecesarios.
- Revisa direcciones internas.
- Incluye solo las líneas relevantes.
- No compartas secretos de agente.

## Sesión práctica 12: añadir un informe simple

Un pipeline puede generar un informe de texto para la práctica.

### Crear el informe

Añade una etapa:

```groovy
stage('Crear informe') {
    steps {
        sh 'mkdir -p informes'
        sh 'printf "Validación completada\\n" > informes/resumen.txt'
        sh 'test -s informes/resumen.txt'
    }
}
```

El informe no debe incluir credenciales ni variables sensibles.

### Archivar el informe

```groovy
archiveArtifacts artifacts: 'informes/resumen.txt',
                 fingerprint: true
```

### Revisar

Comprueba:

- Que la carpeta se creó.
- Que el archivo no está vacío.
- Que el artefacto aparece.
- Que se asocia al número correcto.
- Que la ejecución pasa solo cuando corresponde.

## Sesión práctica 13: añadir límite de tiempo

Un pipeline puede beneficiarse de un límite de tiempo si existe riesgo de quedar esperando indefinidamente.

### Propósito del límite

Un límite de tiempo puede:

- Interrumpir una tarea atascada.
- Evitar consumir recursos sin control.
- Hacer visibles procesos que no terminan.
- Reducir la acumulación de ejecuciones activas.

### Consideraciones

El límite debe ser suficiente para una ejecución válida.

Un valor demasiado corto puede interrumpir pruebas correctas.

El comportamiento y la sintaxis dependen de la versión y configuración.

### Actividad de análisis

Sin cambiar la instancia compartida, responde:

- ¿Qué etapa podría tardar más?
- ¿Qué duración sería razonable para el ejercicio?
- ¿Qué información registra Jenkins al interrumpir una ejecución?
- ¿Quién debería decidir el límite?

## Sesión práctica 14: proteger información sensible

Esta actividad revisa un `Jenkinsfile` en busca de secretos.

### Ejemplo inseguro

```groovy
echo 'TOKEN=valor-secreto'
```

No ejecutes ni confirmes este ejemplo con un secreto real.

### Revisar archivos

Busca en el proyecto:

- Contraseñas.
- Tokens.
- Claves privadas.
- Direcciones con credenciales.
- Variables sensibles impresas.
- Archivos de configuración local.
- Logs guardados accidentalmente.

### Preguntas

- ¿Qué mecanismos pueden almacenar credenciales de forma segura?
- ¿Por qué un repositorio privado no hace seguro el texto claro?
- ¿Qué harías si una credencial aparece en un commit?
- ¿Qué datos quitarías de una captura?
- ¿Por qué el enmascaramiento de logs no es suficiente como única defensa?

## Diagnóstico y mantenimiento

Un pipeline útil comunica qué hizo y dónde falló.

### Leer la consola

Revisa:

- Mensajes de inicio.
- Checkout de código.
- Agente asignado.
- Inicio de etapas.
- Comandos ejecutados.
- Primer fallo.
- Mensaje final.
- Artefactos generados.

### Leer desde el primer error

El último mensaje puede ser un resumen.

Busca la primera acción que no terminó correctamente.

Lee también las líneas anteriores para identificar el contexto.

### Distinguir fallo del pipeline y fallo del entorno

El problema puede estar en:

- El código.
- La sintaxis del `Jenkinsfile`.
- El agente.
- Las herramientas.
- La red.
- Los permisos.
- Un servicio externo.
- La configuración del job.

### Comprobar el commit

Confirma qué revisión se procesó.

Una ejecución que valida un commit distinto del esperado puede dar una falsa impresión de éxito o fallo.

### Comprobar el agente

Verifica:

- Nombre o etiqueta.
- Estado.
- Sistema operativo.
- Ejecutores.
- Herramientas.
- Workspace.

### Comprobar rutas

Las rutas relativas se interpretan desde el directorio de trabajo.

Un archivo presente en tu equipo local puede no estar en el workspace del agente.

### Comprobar herramientas

Si un comando funciona localmente, pero falla en Jenkins, compara:

- Herramienta instalada.
- Versión.
- Shell.
- Sistema operativo.
- `PATH`.
- Usuario.
- Permisos.
- Directorio.
- Archivos del checkout.

### Cambiar una cosa cada vez

Evita cambiar simultáneamente:

- Agente.
- Etiqueta.
- Comando.
- Rama.
- Permisos.
- Variables.

Un cambio controlado facilita encontrar la causa.

## Errores frecuentes

### Error de sintaxis

Puede deberse a:

- Llaves sin pareja.
- Comillas sin cerrar.
- Bloques mal anidados.
- Paso escrito incorrectamente.
- Sintaxis no compatible.

Compara el archivo con un ejemplo válido para la versión de Jenkins usada.

### No se encuentra un agente

Comprueba:

- La etiqueta.
- El estado del nodo.
- Los ejecutores disponibles.
- Las restricciones del job.
- La existencia del agente.
- El método de asignación.

### No se encuentra el archivo

Comprueba:

- Checkout.
- Rama.
- Commit.
- Ruta.
- Mayúsculas y minúsculas.
- Directorio de trabajo.
- Estado del archivo en Git.

### El paso `sh` no funciona

Comprueba si el agente es compatible con comandos Unix.

En Windows quizá debas usar `bat` o PowerShell, según la configuración aprobada.

### Bash no está disponible

El agente podría tener otra shell o no disponer de Bash.

Comprueba la herramienta y solicita la variante indicada por el docente.

### El pipeline queda en cola

Puede faltar:

- Agente compatible.
- Etiqueta.
- Ejecutor disponible.
- Capacidad.
- Disponibilidad de nodo.

Una ejecución en cola no es necesariamente un error de código.

### El artefacto no aparece

Comprueba:

- Que la etapa llegó a ejecutarse.
- Que el archivo se creó.
- Que la ruta coincide.
- Que el patrón de archivado es correcto.
- Que la ejecución no falló antes.
- Que la política de retención lo conserva.

### Una etapa se omite

Revisa las condiciones y el contexto del job.

Una etapa omitida no equivale automáticamente a una comprobación superada.

### El pipeline imprime datos sensibles

Detén el flujo de compartir logs.

Informa al responsable.

La organización puede necesitar revocar o rotar la credencial expuesta, según el caso.

No copies la salida sensible a otros canales.

## Buenas prácticas para el primer pipeline

### Mantener el alcance pequeño

Empieza por una validación que se pueda explicar y repetir.

Añade etapas cuando aporten una comprobación o resultado útil.

### Usar nombres claros

Nombra las etapas por su objetivo.

### Fallar de forma explícita

Una comprobación esencial debe producir un resultado de error si no se cumple.

### Probar localmente

Cuando sea posible, valida un script localmente antes de ejecutarlo en Jenkins.

### Comprobar el agente

Asegúrate de que el agente tiene las herramientas requeridas.

### Revisar logs

La consola forma parte del proceso de diagnóstico.

### Versionar el `Jenkinsfile`

Si el curso lo permite, guarda el pipeline en Git.

### Mantener credenciales fuera del código

Utiliza el sistema de credenciales autorizado.

### Archivar solo lo necesario

No conserves todo el workspace sin motivo.

### Documentar el propósito

Explica qué valida el pipeline y qué no valida.

## Práctica integradora: pipeline de laboratorio

Esta práctica combina Git, validación, agente y artefacto.

### Propósito

Crear un pipeline que:

- Comprueba la estructura.
- Ejecuta una validación.
- Prepara un archivo de salida.
- Archiva el resultado.
- Comunica el estado.

### Requisitos

- Git, si se usa repositorio remoto.
- Jenkins de laboratorio.
- Agente con shell compatible.
- Permiso para ejecutar el job.
- Sin credenciales de producción.
- Sin destino de despliegue.

### Estructura final

```text
proyecto-final/
├── Jenkinsfile
├── README.md
├── app/
│   └── mensaje.txt
├── scripts/
│   └── validar.sh
└── salida/
```

La carpeta `salida` puede crearse durante la ejecución.

### Crear el proyecto

```bash
mkdir -p "$HOME/practicas-devops/proyecto-final"
cd "$HOME/practicas-devops/proyecto-final"
mkdir -p app scripts
```

Crea el archivo:

```bash
printf 'Proyecto integrador de Jenkins\n' > app/mensaje.txt
```

Crea el script:

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"
TEXTO_ESPERADO="Jenkins"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: falta $ARCHIVO"
  exit 1
fi

if grep -q "$TEXTO_ESPERADO" "$ARCHIVO"; then
  echo "OK: se encontró el texto esperado"
else
  echo "ERROR: no se encontró el texto esperado"
  exit 1
fi
EOF
```

### Crear el `README.md`

```bash
cat > README.md <<'EOF'
# Proyecto integrador

Proyecto de práctica para aprender pipelines de Jenkins.

## Validación local

Ejecuta:

```bash
bash scripts/validar.sh
```

El archivo app/mensaje.txt debe contener la palabra Jenkins.
EOF
```

### Crear el pipeline integrador

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar estructura') {
            steps {
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Validar contenido') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }

        stage('Preparar salida') {
            steps {
                sh 'mkdir -p salida'
                sh 'cp app/mensaje.txt salida/mensaje.txt'
            }
        }

        stage('Archivar resultado') {
            steps {
                archiveArtifacts artifacts: 'salida/mensaje.txt',
                                 fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'El pipeline terminó correctamente.'
        }

        failure {
            echo 'El pipeline falló. Consulta la consola.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

### Probar localmente

```bash
bash scripts/validar.sh
```

La validación debe terminar correctamente si el archivo contiene la palabra esperada.

### Revisar con Git

```bash
git status
```

```bash
git diff
```

Prepara los archivos:

```bash
git add Jenkinsfile README.md app scripts
```

Revisa el área de preparación:

```bash
git diff --cached
```

Crea un commit descriptivo:

```bash
git commit -m "Añade pipeline integrador de Jenkins"
```

### Ejecutar el pipeline

Sigue la configuración indicada por el docente.

Después de ejecutar:

- Confirma el commit.
- Comprueba el agente.
- Revisa todas las etapas.
- Localiza el artefacto.
- Consulta la consola.
- Registra el resultado.

### Provocar un fallo controlado

Cambia el texto:

```bash
printf 'Proyecto integrador de automatización\n' > app/mensaje.txt
```

Ejecuta localmente la validación.

Después ejecuta el pipeline con el cambio según el flujo de Git de la práctica.

Comprueba:

- Qué etapa falla.
- Qué mensaje aparece.
- Si se crea el artefacto.
- Qué commit se ejecutó.
- Si el agente siguió conectado.

### Corregir el fallo

Restaura un mensaje válido:

```bash
printf 'Proyecto integrador de Jenkins\n' > app/mensaje.txt
```

Crea o guarda la revisión de práctica y vuelve a ejecutar.

Comprueba que:

- La validación pasa.
- La salida se prepara.
- El artefacto aparece.
- El resultado final coincide con el comportamiento.

### Informe de práctica

```text
Nombre del job:
Número de ejecución correcta:
Número de ejecución fallida:
Agente:
Commit validado:
Etapa de fallo:
Causa del fallo:
Corrección:
Artefacto:
Mejora propuesta:
```

## Rúbrica orientativa

La rúbrica evalúa comportamiento y comprensión, no la cantidad de comandos.

### Estructura

- El proyecto tiene una estructura clara.
- El `Jenkinsfile` está en la ruta esperada.
- El script de validación es legible.
- El README explica la prueba.

### Pipeline

- El agente está definido.
- Las etapas tienen nombres claros.
- Las comprobaciones se ejecutan en orden.
- Un fallo importante detiene el proceso.
- El artefacto se archiva después de generarse.

### Diagnóstico

- El alumno identifica la etapa fallida.
- El alumno encuentra el comando relevante.
- El alumno relaciona el resultado con el commit.
- El alumno diferencia el error del agente y el error del código.

### Seguridad

- No hay secretos en el repositorio.
- El agente tiene permisos limitados.
- El pipeline no despliega a producción.
- Los logs se revisan antes de compartirlos.

### Comunicación

- El alumno explica qué valida el flujo.
- El alumno describe sus límites.
- El alumno documenta la causa del fallo controlado.
- El alumno propone una mejora concreta.

## Checklist antes de ejecutar

- [ ] Estoy en la instancia de laboratorio correcta.
- [ ] Tengo permiso para ejecutar el job.
- [ ] He leído el `Jenkinsfile`.
- [ ] El agente es el autorizado.
- [ ] La etiqueta, si existe, está confirmada.
- [ ] Los comandos son apropiados para el agente.
- [ ] Las rutas son correctas.
- [ ] No hay credenciales en el código.
- [ ] El repositorio y la rama son los esperados.
- [ ] No se configura un destino de producción.
- [ ] Sé dónde consultar la consola.

## Checklist después de ejecutar

- [ ] Anoté el número de ejecución.
- [ ] Comprobé el resultado final.
- [ ] Revisé la vista de etapas.
- [ ] Revisé la consola.
- [ ] Confirmé el agente.
- [ ] Confirmé el commit.
- [ ] Localicé el artefacto, si se generó.
- [ ] Oculté datos sensibles antes de compartir información.
- [ ] Registré cualquier fallo.
- [ ] Sé qué cambiar para repetir la práctica.

## Preguntas de repaso

1. ¿Qué es un pipeline de Jenkins?
2. ¿Qué diferencia hay entre job, pipeline y ejecución?
3. ¿Qué función cumple `agent`?
4. ¿Qué significa `agent any`?
5. ¿Para qué sirve `stages`?
6. ¿Qué diferencia hay entre una etapa y un paso?
7. ¿Qué hace `echo`?
8. ¿Qué agente necesita un paso `sh`?
9. ¿Qué ocurre si un comando devuelve un error?
10. ¿Para qué se utiliza `post`?
11. ¿Qué diferencia hay entre `success`, `failure` y `always`?
12. ¿Qué significa archivar un artefacto?
13. ¿Qué no significa archivar?
14. ¿Por qué se guarda un `Jenkinsfile` en Git?
15. ¿Qué información permite relacionar una ejecución con el código?
16. ¿Por qué no se debe imprimir `env` en un job con credenciales?
17. ¿Qué revisarías si Jenkins no encuentra un archivo?
18. ¿Qué puede hacer que un pipeline quede en cola?
19. ¿Qué diferencia hay entre una etapa omitida y una etapa superada?
20. ¿Qué parte del pipeline de práctica mejorarías?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Un pipeline define un flujo automatizado de pasos».

### Afirmación 2

«Una etapa es lo mismo que una ejecución completa».

### Afirmación 3

«Un `Jenkinsfile` puede versionarse junto con el código».

### Afirmación 4

«`agent any` significa que Jenkins utiliza cualquier equipo conectado a Internet».

### Afirmación 5

«Un paso de shell puede hacer fallar la ejecución».

### Afirmación 6

«Un pipeline exitoso demuestra que no existen defectos».

### Afirmación 7

«El agente debe tener las herramientas requeridas por los pasos».

### Afirmación 8

«Un parámetro de texto normal es un almacén seguro de contraseñas».

### Afirmación 9

«Archivar un archivo significa desplegarlo a producción».

### Afirmación 10

«La consola puede ayudar a identificar la primera etapa que falló».

### Afirmación 11

«Una etapa omitida por una condición ha superado sus pruebas».

### Afirmación 12

«Un artefacto puede relacionarse con una ejecución».

### Afirmación 13

«Un job de laboratorio debe usar credenciales de producción para ser realista».

### Afirmación 14

«El código de salida de un comando puede influir en el resultado del pipeline».

### Afirmación 15

«El `Jenkinsfile` debe revisarse porque puede ejecutar comandos».

## Respuestas orientativas

### Afirmación 1

**Correcta.** Esa es la función básica de un pipeline.

### Afirmación 2

**Incorrecta.** Una etapa es una parte lógica del flujo.

### Afirmación 3

**Correcta.** Versionarlo facilita revisar cambios.

### Afirmación 4

**Incorrecta.** Jenkins elige entre agentes configurados y disponibles.

### Afirmación 5

**Correcta.** Un código de salida de error puede fallar el paso.

### Afirmación 6

**Incorrecta.** Solo se han superado las comprobaciones configuradas.

### Afirmación 7

**Correcta.** Las herramientas deben estar disponibles en el entorno de ejecución.

### Afirmación 8

**Incorrecta.** Los secretos requieren un mecanismo de credenciales protegido.

### Afirmación 9

**Incorrecta.** Archivar y desplegar son acciones diferentes.

### Afirmación 10

**Correcta.** La consola contiene la salida de los pasos.

### Afirmación 11

**Incorrecta.** Una etapa omitida no necesariamente se ejecutó ni superó pruebas.

### Afirmación 12

**Correcta.** Jenkins puede asociar artefactos con ejecuciones.

### Afirmación 13

**Incorrecta.** Utiliza credenciales de laboratorio autorizadas y limitadas.

### Afirmación 14

**Correcta.** Jenkins suele interpretar los resultados de los pasos.

### Afirmación 15

**Correcta.** Es código ejecutable y debe revisarse.

## Glosario

- **Agente:** sistema o entorno donde se ejecutan los pasos.
- **Artefacto:** archivo generado y conservado por una ejecución.
- **CI:** integración continua; validación frecuente de cambios.
- **Código de salida:** valor que comunica el resultado de un comando.
- **Declarativo:** estilo de pipeline con estructura explícita.
- **Ejecución:** instancia concreta de un job o pipeline.
- **Etapa:** agrupación lógica de pasos.
- **Job:** configuración de Jenkins que permite ejecutar una tarea.
- **Jenkinsfile:** archivo que contiene la definición del pipeline.
- **Parámetro:** valor proporcionado a una ejecución.
- **Pipeline:** secuencia automatizada de etapas y pasos.
- **Scripted:** estilo de pipeline con mayor libertad de lógica en Groovy.
- **Paso:** acción concreta dentro de una etapa.
- **Trigger:** evento o programación que inicia un pipeline.
- **Workspace:** directorio de trabajo de una ejecución.
- **Checkout:** obtención de una revisión desde un repositorio.
- **Commit:** registro de cambios en Git.
- **Agente etiquetado:** nodo seleccionado mediante una etiqueta.
- **Post:** acciones configuradas para ejecutarse después de las etapas.
- **Trazabilidad:** capacidad de relacionar código, ejecución y artefacto.

## Síntesis final

El primer pipeline debe ser pequeño, legible y seguro.

- `pipeline` contiene la definición.
- `agent` selecciona el entorno.
- `stages` agrupa las etapas.
- `steps` contiene las acciones.
- `post` permite comunicar resultados.
- El `Jenkinsfile` puede guardarse y revisarse en Git.
- Una validación debe fallar cuando una condición esencial no se cumple.
- Un artefacto debe generarse y archivarse de forma explícita.
- La consola ayuda a diagnosticar, pero puede contener información sensible.
- El pipeline valida solo lo que se ha configurado.