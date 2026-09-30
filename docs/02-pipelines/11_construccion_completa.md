# Construcción completa de un pipeline en Jenkins

Esta unidad reúne los elementos de un pipeline declarativo en un flujo coherente, seguro y fácil de mantener. El objetivo es construir un `Jenkinsfile` paso a paso: definir el agente, configurar opciones, validar parámetros, ejecutar comprobaciones, capturar datos, gestionar errores, archivar resultados y comunicar el estado final.

El ejemplo principal es un proyecto de laboratorio inocuo. No realiza despliegues ni requiere credenciales. Cada sección explica una parte del pipeline y muestra cómo probarla. Al final se incluye un pipeline integrador, sesiones prácticas, una guía de diagnóstico y una rúbrica de revisión.

> **Seguridad:** utiliza únicamente una instancia y un job autorizados. No añadas credenciales reales a los ejemplos, parámetros, archivos, consola o notificaciones. No ejecutes comandos destructivos ni uses estos patrones para modificar sistemas de producción sin revisión y autorización.

---

## Objetivos y alcance

Una construcción completa combina componentes que ya se han estudiado por separado.

### Resultados de aprendizaje

Al terminar esta unidad, el alumnado podrá:

- Explicar la estructura básica de un pipeline declarativo.
- Crear un `Jenkinsfile` pequeño y legible.
- Separar parámetros, variables de entorno y datos capturados.
- Validar entradas antes de utilizarlas.
- Ejecutar comandos de forma controlada en un agente.
- Reconocer códigos de salida y estados de Jenkins.
- Aplicar validaciones obligatorias y opcionales.
- Añadir un tiempo límite razonable.
- Registrar errores con mensajes útiles.
- Publicar un artefacto no sensible.
- Definir acciones posteriores según el resultado.
- Revisar el pipeline con una lista de comprobación.
- Diagnosticar un fallo desde la primera causa relevante.

### Qué se construirá

El proyecto de laboratorio tendrá estas etapas:

1. Comprobar que el workspace contiene los archivos esperados.
2. Validar los parámetros recibidos.
3. Ejecutar una comprobación principal.
4. Capturar un valor no sensible.
5. Crear un resumen de texto.
6. Archivar el resumen.
7. Informar del resultado final.

### Qué no se construirá

Este laboratorio no:

- Despliega aplicaciones.
- Publica paquetes en registros externos.
- Modifica servidores.
- Borra datos de sistemas compartidos.
- Utiliza contraseñas reales.
- Almacena tokens.
- Envía correo o mensajes reales.
- Cambia la configuración global de Jenkins.

### Qué significa «completo»

«Completo» no significa que el pipeline haga todo lo imaginable.

Significa que el flujo tiene:

- Un propósito claro.
- Entradas conocidas.
- Validaciones.
- Pasos verificables.
- Un tratamiento de fallos.
- Resultados visibles.
- Una política de artefactos.
- Una salida comprensible.
- Límites y controles proporcionales.

### Alcance del ejemplo

Los comandos con `sh` presuponen un agente Unix o compatible.

En un agente Windows, adapta los pasos a `bat` o PowerShell, según el entorno del curso.

No mezcles sintaxis Unix y Windows sin comprobar el sistema operativo del agente.

---

## Planificación del pipeline

Antes de escribir el `Jenkinsfile`, conviene definir qué entra, qué ocurre y qué resultado se espera.

### Requisitos del proyecto

El proyecto de ejemplo valida un archivo con una frase esperada.

El resultado final será un archivo de texto con:

- Identificador de la práctica.
- Modo seleccionado.
- Número de ejecución.
- Resultado de las comprobaciones.

Los datos del resumen son no sensibles.

### Requisitos funcionales

El pipeline deberá:

- Ejecutarse en un agente autorizado.
- Aceptar un modo `simple` o `detallado`.
- Aceptar un identificador educativo limitado.
- Comprobar los archivos necesarios.
- Ejecutar un script de validación.
- Capturar la versión de una herramienta disponible.
- Crear un resumen.
- Archivar el resumen.
- Mostrar mensajes distintos para éxito y fallo.

### Requisitos no funcionales

El pipeline deberá:

- Limitar su duración.
- Evitar entradas arbitrarias.
- No imprimir todo el entorno.
- No incluir secretos en el código.
- Usar rutas relativas al workspace.
- Mantener una separación clara entre Groovy y shell.
- Mostrar qué validación falló.
- No tratar una etapa omitida como prueba superada.

### Dibujar el flujo

Antes de programar, representa las dependencias:

```text
Inicio
  |
  v
Validar parámetros
  |
  v
Comprobar estructura
  |
  v
Ejecutar validación principal
  |
  v
Capturar información
  |
  v
Crear resumen
  |
  v
Archivar resultado
  |
  v
Acciones post
```

Una etapa posterior no debería ejecutarse si necesita una salida que no se generó correctamente.

### Definir las entradas

El ejemplo utiliza:

- `MODO`: una opción cerrada.
- `IDENTIFICADOR`: texto no sensible con formato restringido.

No solicita credenciales.

### Definir las salidas

El ejemplo genera:

```text
salida/resumen.txt
```

El archivo se archivará como artefacto del build.

### Definir criterios de éxito

El pipeline puede considerarse exitoso si:

- Los archivos obligatorios existen.
- El parámetro tiene un valor permitido.
- El script principal termina con código cero.
- La salida capturada cumple el formato esperado.
- El resumen se crea y se archiva.

### Definir criterios de fallo

El pipeline debe fallar si:

- Falta un archivo obligatorio.
- El identificador no cumple la regla.
- El modo no está permitido.
- El script principal termina con código no cero.
- La salida capturada no coincide con el formato esperado.
- No puede crearse o archivarse el resumen obligatorio.

### Definir las comprobaciones opcionales

Una comprobación opcional debe estar identificada como tal.

No conviertas una comprobación obligatoria en opcional para mantener el build en verde.

Si una comprobación opcional falla, el pipeline puede continuar con resultado inestable, siempre que la política del curso lo indique.

### Definir el agente

El agente debe:

- Estar autorizado para el job.
- Disponer de shell compatible.
- Tener el workspace asignado por Jenkins.
- Contar con las herramientas requeridas.
- No recibir credenciales innecesarias.

### Decidir si limitar la concurrencia

Limita la concurrencia si dos ejecuciones podrían sobrescribir archivos o compartir recursos incompatibles.

Si cada ejecución usa su propio workspace y el proyecto es independiente, puede no ser necesario.

### Decidir la retención

La política de conservación del historial debe seguir la configuración del curso.

No adoptes una retención arbitraria en un job compartido.

### Contrato de entrada y salida

Documenta las reglas antes de codificar.

| Dato | Fuente | Formato esperado | Sensible |
|---|---|---|---|
| `MODO` | Parámetro `choice` | `simple` o `detallado` | No |
| `IDENTIFICADOR` | Parámetro `string` | Letras, números y guiones | No |
| Nombre del job | Jenkins | Texto de entorno | No, según política |
| Número de build | Jenkins | Identificador numérico | No |
| Versión de herramienta | Comando | Texto breve | No |
| Resumen | Workspace | Archivo de texto | No |

### Decisiones de diseño

Antes de comenzar, responde:

- ¿Qué agente ejecutará el job?
- ¿Qué shell estará disponible?
- ¿Qué datos introduce la persona?
- ¿Qué datos produce el pipeline?
- ¿Qué errores deben detenerlo?
- ¿Qué archivos se conservan?
- ¿Qué información puede mostrarse en consola?
- ¿Qué permisos requiere la ejecución?
- ¿Qué pasos dependen de plugins?

---

## Preparación del proyecto

Un proyecto pequeño permite practicar el flujo completo sin servicios externos.

### Crear la estructura

En el repositorio de laboratorio, crea:

```text
pipeline-completo/
├── Jenkinsfile
├── README.md
├── app/
│   └── mensaje.txt
├── scripts/
│   └── validar.sh
└── salida/
```

La carpeta `salida` puede crearse durante la ejecución en vez de guardarse en Git.

### Crear `README.md`

```text
Proyecto de laboratorio para construir un pipeline completo en Jenkins.
```

### Crear `app/mensaje.txt`

```text
Este archivo contiene una frase de prueba para Jenkins.
```

### Crear `scripts/validar.sh`

```bash
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"
TEXTO_ESPERADO="Jenkins"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: falta el archivo requerido: $ARCHIVO"
  exit 1
fi

if grep -q "$TEXTO_ESPERADO" "$ARCHIVO"; then
  echo "VALIDACION=correcta"
else
  echo "ERROR: falta el texto esperado en $ARCHIVO"
  exit 1
fi
```

### Permisos del script

En sistemas Unix, el archivo puede necesitar permiso de ejecución si se invoca directamente.

Una forma sencilla para el laboratorio es ejecutarlo explícitamente con Bash:

```bash
bash scripts/validar.sh
```

Así no dependemos únicamente del bit ejecutable del archivo.

### Probar el script localmente

```bash
bash scripts/validar.sh
```

Resultado esperado:

```text
VALIDACION=correcta
```

### Probar un fallo local controlado

En una copia de práctica, cambia temporalmente el contenido de `app/mensaje.txt` para eliminar la palabra esperada.

Ejecuta de nuevo el script.

Debe devolver un código distinto de cero.

Restaura el archivo antes de continuar.

### Revisar herramientas

En un agente Unix, las herramientas podrían incluir:

- Bash.
- `grep`.
- `test`.
- `mkdir`.
- `printf`.
- Una herramienta de versión, como `python3`.

No asumas que todas están disponibles.

Confirma la imagen y las herramientas autorizadas con el docente o administrador.

### No instalar herramientas globalmente

El alumnado no debe instalar paquetes en agentes compartidos sin autorización.

Si falta una herramienta:

- Registra el nombre y la versión necesaria.
- Consulta al administrador.
- Usa el agente designado por el curso.
- No cambies la configuración global.

### Confirmar el SCM

Antes de ejecutar:

- Comprueba la rama.
- Confirma que el `Jenkinsfile` está versionado.
- Confirma que los archivos del proyecto están en el commit.
- Revisa que el job apunta al repositorio correcto.

### Confirmar el job

Comprueba:

- Job de laboratorio.
- Repositorio autorizado.
- Rama prevista.
- Agente de laboratorio.
- Permisos adecuados.
- Ausencia de credenciales innecesarias.

---

## Estructura declarativa

Un pipeline declarativo organiza la ejecución en bloques explícitos.

### Esqueleto mínimo

```groovy
pipeline {
    agent any

    stages {
        stage('Ejemplo') {
            steps {
                echo 'Pipeline preparado.'
            }
        }
    }
}
```

### `pipeline`

El bloque `pipeline` contiene la configuración principal.

### `agent`

`agent` determina dónde se ejecutan las etapas.

`agent any` selecciona un agente disponible según la configuración.

En un entorno real suele ser preferible una etiqueta o un agente configurado por el equipo.

### `stages`

`stages` contiene las etapas principales del flujo.

Cada etapa debe tener un nombre descriptivo.

### `stage`

`stage` representa una fase visible de la ejecución.

Los nombres deberían describir el trabajo, no el resultado que se desea obtener.

### `steps`

`steps` contiene las acciones de una etapa.

Algunos ejemplos:

- `echo`.
- `sh`.
- `bat`.
- `archiveArtifacts`.
- `checkout`.
- `input`.
- `script`.

La disponibilidad depende de la configuración y los plugins.

### Convenciones del `Jenkinsfile`

Usa:

- Sangría coherente.
- Nombres descriptivos.
- Mensajes breves.
- Rutas relativas.
- Comentarios que expliquen decisiones.
- Una responsabilidad clara por etapa.

Evita:

- Bloques gigantes.
- Variables con nombres ambiguos.
- Comandos destructivos.
- Secretos codificados en texto.
- Lógica duplicada.

### Comentarios útiles

Un comentario debería explicar por qué existe una decisión.

```groovy
// El identificador solo admite caracteres seguros para el resumen.
```

Un comentario no reemplaza la validación real.

### Nombres de etapas

Prefiere:

```text
Validar parámetros
Comprobar estructura
Ejecutar validación
Crear resumen
Archivar resultado
```

Evita nombres como:

```text
Paso 1
Cosas
Prueba
Final
```

### Variables de entorno

Un bloque `environment` declara configuración no sensible.

```groovy
environment {
    NOMBRE_PRACTICA = 'pipeline-completo'
    DIRECTORIO_SALIDA = 'salida'
}
```

Para Groovy, las variables de entorno se consultan normalmente mediante `env`.

Para shell, se suelen usar como `$NOMBRE`.

### Evitar valores sensibles en `environment`

No incluyas en `environment`:

- Contraseñas.
- Tokens.
- Claves privadas.
- Credenciales permanentes.
- Secretos de webhooks.

Utiliza el almacén de credenciales autorizado si la actividad lo requiere.

### Parámetros

Los parámetros definen entradas que varían entre ejecuciones.

```groovy
parameters {
    choice(
        name: 'MODO',
        choices: ['simple', 'detallado'],
        description: 'Nivel del resumen'
    )

    string(
        name: 'IDENTIFICADOR',
        defaultValue: 'grupo-1',
        description: 'Código de práctica no sensible'
    )
}
```

El tipo de parámetro debe corresponder con el dato.

### `params`

Accede a los parámetros desde Groovy mediante `params`.

```groovy
echo "Modo: ${params.MODO}"
```

No asumas que cualquier parámetro es seguro.

### Diferencias entre `params` y `env`

- `params` expresa una entrada de la ejecución.
- `env` expresa una variable del entorno.
- Una variable de entorno no es secreta por defecto.
- Un parámetro no es secreto por defecto.
- Cada fuente se debe validar según su uso.

### Opciones del pipeline

`options` configura comportamientos comunes.

Ejemplo de opciones de laboratorio:

```groovy
options {
    timestamps()
    timeout(time: 10, unit: 'MINUTES')
}
```

Comprueba si las opciones están disponibles en la versión utilizada.

### Marcas de tiempo

`timestamps()` puede facilitar el análisis temporal de la consola.

No cambia el resultado de las validaciones.

### Límite de tiempo

`timeout` limita la duración.

El límite debe ser razonable para las pruebas y el agente.

Un timeout no equivale a éxito.

### Concurrencia

`disableConcurrentBuilds()` puede impedir ejecuciones simultáneas del mismo pipeline.

Añádelo si hay una razón concreta.

No lo añadas por costumbre: puede incrementar la cola.

### Retención

`buildDiscarder` puede limitar historial y artefactos.

Respeta la política del laboratorio.

No modifiques la retención de un job compartido sin autorización.

---

## Construcción etapa por etapa

Construir paso a paso facilita localizar errores y validar cada decisión.

### Etapa 1: validar parámetros

El pipeline debe comprobar que la entrada tiene un formato permitido.

```groovy
stage('Validar parámetros') {
    steps {
        script {
            if (!(params.MODO in ['simple', 'detallado'])) {
                error 'El modo no está permitido.'
            }

            if (!(params.IDENTIFICADOR ==~ /^[A-Za-z0-9-]{1,24}$/)) {
                error 'El identificador no cumple el formato esperado.'
            }

            echo 'Los parámetros tienen formato válido.'
        }
    }
}
```

La lista de modos debe mantenerse sincronizada con la lógica posterior.

### Por qué validar una opción `choice`

La lista `choice` limita las opciones en la interfaz.

Validar en el pipeline:

- Hace explícito el contrato.
- Detecta entradas no esperadas de otras fuentes.
- Evita que una modificación accidental abra una ruta desconocida.
- Documenta qué valores acepta la lógica.

### Por qué validar el identificador

El identificador puede aparecer en un archivo o mensaje.

Limitarlo evita caracteres inesperados y simplifica su uso.

No se debe convertir en un comando arbitrario.

### Etapa 2: comprobar la estructura

Comprueba que los archivos requeridos están presentes.

```groovy
stage('Comprobar estructura') {
    steps {
        sh 'test -f README.md'
        sh 'test -f app/mensaje.txt'
        sh 'test -f scripts/validar.sh'
    }
}
```

Cada `test` devuelve un código de salida.

Si un archivo falta, la etapa debe fallar.

### Mensaje de estructura más claro

Puedes comprobar los archivos desde Groovy:

```groovy
stage('Comprobar estructura') {
    steps {
        script {
            def requeridos = [
                'README.md',
                'app/mensaje.txt',
                'scripts/validar.sh'
            ]

            requeridos.each { ruta ->
                if (!fileExists(ruta)) {
                    error "Falta el archivo requerido: ${ruta}"
                }
            }

            echo 'La estructura requerida está presente.'
        }
    }
}
```

Elige una sola estrategia si duplicar la comprobación no añade valor.

### Etapa 3: ejecutar la validación principal

```groovy
stage('Validar contenido') {
    steps {
        sh 'bash scripts/validar.sh'
    }
}
```

Si el script falla, el paso `sh` normalmente falla.

No captures el error si la validación es obligatoria.

### Mensajes del script

Los mensajes deben identificar la comprobación sin incluir secretos.

Ejemplo:

```text
ERROR: falta el texto esperado en app/mensaje.txt
```

Un mensaje como `falló` aporta poca información.

### Etapa 4: capturar una salida

El script puede devolver una salida breve.

```groovy
script {
    def resultado = sh(
        returnStdout: true,
        script: 'bash scripts/validar.sh'
    ).trim()

    echo "Resultado capturado: ${resultado}"
}
```

Si el script ya se ejecutó en la etapa anterior, no lo ejecutes otra vez solo para obtener la misma salida salvo que exista una razón.

Una alternativa es guardar la salida en un archivo de resultado y leerlo después.

### Capturar salida y evitar doble ejecución

Una forma sencilla para el ejemplo es ejecutar el script una sola vez y capturar su salida:

```groovy
script {
    def resultado = sh(
        returnStdout: true,
        script: 'bash scripts/validar.sh'
    ).trim()

    if (resultado != 'VALIDACION=correcta') {
        error 'La salida no coincide con el valor esperado.'
    }

    echo 'La validación principal pasó.'
}
```

Este bloque combina ejecución y comprobación.

Úsalo solo si la salida es breve y controlada.

### Comando, salida estándar y estado

`returnStdout` devuelve texto.

No significa que se deba ignorar el código de salida.

Un comando que falla puede hacer que el paso lance un error.

`returnStatus` devuelve el código para que el pipeline lo interprete explícitamente.

### Capturar código de salida

```groovy
script {
    int codigo = sh(
        returnStatus: true,
        script: 'bash scripts/validar.sh'
    )

    if (codigo != 0) {
        error "La validación terminó con código ${codigo}."
    }
}
```

Usa esta forma si necesitas clasificar distintos códigos.

### Etapa 5: obtener una versión

La versión de una herramienta puede ayudar a entender diferencias entre agentes.

```groovy
stage('Identificar herramienta') {
    steps {
        script {
            def version = sh(
                returnStdout: true,
                script: 'python3 --version 2>&1'
            ).trim()

            echo "Herramienta detectada: ${version}"
        }
    }
}
```

El ejemplo presupone `python3` instalado.

Si no está disponible, consulta al responsable en lugar de instalarlo en un agente compartido.

### Salida de versión variable

El texto de versión puede cambiar entre sistemas.

No compares la salida completa a menos que el formato esté definido.

Si solo necesitas información diagnóstica, regístrala sin bloquear la ejecución.

### Etapa 6: crear el resumen

El resumen combina datos validados con datos de Jenkins.

```groovy
stage('Crear resumen') {
    steps {
        script {
            def nombreJob = env.JOB_NAME ?: 'job-desconocido'
            def numeroBuild = env.BUILD_NUMBER ?: 'sin-numero'
            def modo = params.MODO
            def identificador = params.IDENTIFICADOR

            sh 'mkdir -p salida'

            writeFile(
                file: 'salida/resumen.txt',
                text: """\
Práctica: pipeline-completo
Job: ${nombreJob}
Ejecución: ${numeroBuild}
Identificador: ${identificador}
Modo: ${modo}
Resultado de validación: correcto
""".stripIndent()
            )

            echo 'Se creó el resumen de laboratorio.'
        }
    }
}
```

`writeFile` es un paso de Pipeline disponible en contextos habituales.

Comprueba la referencia local si la instancia difiere.

### Verificar el resumen

```groovy
script {
    if (!fileExists('salida/resumen.txt')) {
        error 'No se creó salida/resumen.txt.'
    }

    echo 'El archivo de resumen existe.'
}
```

No es necesario imprimir el contenido completo si basta con confirmar que se creó.

### Etapa 7: archivar el resultado

```groovy
stage('Archivar resultado') {
    steps {
        archiveArtifacts(
            artifacts: 'salida/resumen.txt',
            fingerprint: true
        )
    }
}
```

Comprueba que el patrón no incluya archivos no previstos.

### Artefacto y workspace

El workspace es un área de trabajo.

Un artefacto archivado se asocia a una ejecución y se conserva según la política de Jenkins.

No trates el workspace como almacenamiento permanente.

### Artefactos con datos sensibles

No archives:

- Tokens.
- Contraseñas.
- Archivos de credenciales.
- Dumps no revisados.
- Informes con datos personales innecesarios.

Revisa el contenido antes de archivarlo.

### Etapa 8: resumen de consola

Un mensaje final puede indicar qué ocurrió.

```groovy
stage('Resumen') {
    steps {
        echo "Práctica: ${env.NOMBRE_PRACTICA}"
        echo "Modo: ${params.MODO}"
        echo 'El pipeline llegó al resumen.'
    }
}
```

El mensaje no debe afirmar más de lo que se ha validado.

---

## Errores y resultados

El tratamiento de errores debe conservar el significado del resultado.

### Códigos de salida

En muchos comandos Unix:

- `0` suele indicar éxito.
- Otro valor suele indicar error o una condición no satisfecha.

El significado depende del comando.

### Fallo de un paso `sh`

Si un comando devuelve un código no cero, el paso `sh` suele marcarse como fallido.

No uses mensajes impresos como única fuente de verdad.

### Validación obligatoria

Una comprobación obligatoria debe detener el flujo si no pasa.

Ejemplos:

- Falta un archivo necesario.
- El contenido no cumple el requisito.
- El parámetro no es válido.
- La herramienta de validación no se ejecuta.

### Validación opcional

Una comprobación opcional puede permitir continuar si:

- El equipo definió que no bloquea.
- El fallo queda visible.
- El resultado refleja la advertencia.
- No hay una etapa posterior que dependa del resultado.

### `catchError` con propósito limitado

```groovy
catchError(
    buildResult: 'UNSTABLE',
    stageResult: 'UNSTABLE',
    message: 'Falló una comprobación informativa'
) {
    sh 'test -f salida/informe-opcional.txt'
}
```

No uses `catchError` para ocultar un control obligatorio.

### Resultado inestable

`UNSTABLE` puede expresar que la ejecución continuó, pero necesita revisión.

Define qué política tiene el curso para ese estado.

### Timeout

Un timeout protege frente a tareas que no terminan.

```groovy
options {
    timeout(time: 10, unit: 'MINUTES')
}
```

El límite debe adecuarse a la duración normal de la ejecución.

### Reintentos

`retry` puede ser apropiado para un error temporal y una operación segura de repetir.

No reintentes a ciegas:

- Una publicación.
- Una operación de escritura externa.
- Una tarea no idempotente.
- Una validación determinista con el mismo error.
- Una operación que podría duplicar recursos.

### Captura de errores con Groovy

Un `try/catch` puede cambiar la propagación del error.

```groovy
script {
    try {
        sh 'bash scripts/validar.sh'
    } catch (err) {
        echo 'La validación produjo una excepción.'
        throw err
    }
}
```

Volver a lanzar la excepción conserva el fallo.

### Evitar capturas amplias

No captures cualquier error solo para continuar.

Una captura amplia puede ocultar:

- Fallos de agente.
- Timeouts.
- Cancelaciones.
- Errores de infraestructura.
- Errores de una comprobación obligatoria.

### Condición de error explícita

```groovy
if (!fileExists('salida/resumen.txt')) {
    error 'Falta el resumen que debe archivarse.'
}
```

La función `error` detiene el flujo con un mensaje claro.

### Acciones `post`

El `post` global puede responder al resultado de la ejecución:

```groovy
post {
    success {
        echo 'Las validaciones configuradas terminaron correctamente.'
    }

    failure {
        echo 'El pipeline falló. Revisa la primera causa.'
    }

    unstable {
        echo 'El resultado requiere revisión.'
    }

    aborted {
        echo 'La ejecución se interrumpió.'
    }

    always {
        echo 'Fin de la ejecución.'
    }
}
```

### `always` no garantiza ejecución ante cualquier caída

`always` cubre la finalización normal del pipeline según el ciclo de vida de Jenkins.

Una caída abrupta del controlador o de la infraestructura puede impedir acciones posteriores.

### Distinguir los resultados

- `SUCCESS`: las acciones configuradas terminaron correctamente.
- `FAILURE`: una acción falló.
- `UNSTABLE`: el resultado requiere atención.
- `ABORTED`: la ejecución se interrumpió.
- Etapa omitida: la etapa no se ejecutó necesariamente.

No presentes una etapa omitida como una prueba superada.

### No cambiar el resultado para que parezca exitoso

No modifiques el resultado de Jenkins para ocultar una validación fallida.

Si una comprobación es opcional, documenta esa decisión y conserva una señal visible.

---

## Seguridad y mantenibilidad

Un pipeline completo debe ser seguro de revisar, ejecutar y modificar.

### Parámetros como entradas no confiables

Aunque un parámetro aparezca en una interfaz de Jenkins, sigue siendo una entrada que debe validarse.

Valida antes de utilizarlo en:

- Comandos.
- Rutas.
- Nombres de archivos.
- Selección de recursos.
- Mensajes externos.
- Consultas.

### Evitar comandos construidos con texto libre

No hagas:

```groovy
sh "bash ${params.SCRIPT}"
```

No permitas que un parámetro determine cualquier script que el agente ejecutará.

### Limitar rutas

Utiliza rutas relativas al workspace y rutas conocidas.

No permitas que un parámetro elija una ruta de borrado arbitraria.

### Inyección de comandos

Una entrada con caracteres especiales puede alterar la interpretación de una shell.

Usa:

- Opciones limitadas.
- Validación.
- Scripts versionados y revisados.
- Argumentos gestionados con cuidado.
- Agentes con permisos mínimos.

### Secretos y credenciales

Los secretos deben gestionarse mediante el almacén de credenciales aprobado.

La sintaxis depende del tipo de credencial y de la configuración.

No incluyas secretos en:

- El `Jenkinsfile`.
- Parámetros de texto.
- Archivos versionados.
- `echo`.
- Resúmenes.
- Artefactos.
- Mensajes de error.

### Enmascaramiento

El enmascaramiento de consola puede ayudar, pero no garantiza que un secreto no se exponga.

No uses el enmascaramiento como permiso para imprimir un secreto.

### Agentes de confianza

El código ejecutado en un agente puede acceder a los recursos disponibles para el job.

No entregues credenciales a:

- Código no revisado.
- Ramas de confianza menor.
- Jobs con permisos excesivos.
- Agentes compartidos sin aislamiento adecuado.

### Uso de credenciales por etapa

Limita las credenciales al menor ámbito posible.

Una etapa que no las necesita no debería recibirlas.

El ejemplo integrador de esta página no utiliza credenciales.

### Logs

Registra datos que ayuden a diagnosticar:

- Nombre de la etapa.
- Resultado de una comprobación.
- Ruta relativa no sensible.
- Código de salida.
- Identificador de ejecución.

Evita imprimir el entorno completo.

### Archivos temporales

Si se crean archivos temporales:

- Limita la ruta al workspace.
- No incluyas secretos.
- Conserva solo lo necesario.
- Define cuándo se limpian.
- Evita que una ejecución use archivos de otra.

### Concurrencia

Si varias ejecuciones escriben en el mismo recurso:

- Considera limitar concurrencia.
- Utiliza nombres únicos cuando corresponda.
- Evita archivos compartidos sin sincronización.
- Comprueba el alcance del workspace.

### Retención

La retención debe seguir la política del curso o de la organización.

Evalúa:

- Tamaño de los artefactos.
- Necesidad de diagnóstico.
- Requisitos de auditoría.
- Datos incluidos.
- Acceso al historial.

### Plugins

Los pasos de plugins pueden no existir en todas las instancias.

Antes de usarlos:

- Comprueba si el plugin está instalado.
- Revisa su versión.
- Consulta la documentación local.
- Confirma permisos.
- Evita instalar plugins sin autorización.

### Cambios como código

El `Jenkinsfile` define comportamiento ejecutable.

Revisa como mínimo:

- Cambios de agente.
- Nuevos comandos.
- Cambios de parámetros.
- Cambios de resultado.
- Nuevas credenciales.
- Nuevos destinatarios.
- Operaciones de archivo.
- `retry`, `timeout` y `catchError`.

### Bloques pequeños

Separa una lógica extensa en:

- Etapas con nombres claros.
- Scripts de proyecto versionados.
- Funciones simples cuando corresponda.
- Bibliotecas compartidas aprobadas, si existe una necesidad real.

### Comentarios y documentación

Documenta:

- Qué se considera válido.
- Qué errores detienen el pipeline.
- Qué archivos se archivan.
- Qué agentes se requieren.
- Qué plugins se utilizan.
- Qué limitaciones tiene el flujo.

---

## Pipeline integrador

El siguiente ejemplo reúne parámetros, variables, validación, captura, artefactos y resultados.

### Antes de usar el ejemplo

Asegúrate de que el repositorio contiene:

```text
README.md
app/mensaje.txt
scripts/validar.sh
```

Comprueba que el agente es Unix o compatible con el comando `sh`.

El ejemplo no incluye credenciales.

### Jenkinsfile completo

```groovy
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 10, unit: 'MINUTES')
    }

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona el nivel del resumen'
        )

        string(
            name: 'IDENTIFICADOR',
            defaultValue: 'grupo-1',
            description: 'Código de práctica: letras, números y guiones'
        )
    }

    environment {
        NOMBRE_PRACTICA = 'pipeline-completo'
        DIRECTORIO_SALIDA = 'salida'
    }

    stages {
        stage('Validar parámetros') {
            steps {
                script {
                    if (!(params.MODO in ['simple', 'detallado'])) {
                        error 'El modo seleccionado no está permitido.'
                    }

                    if (!(params.IDENTIFICADOR ==~ /^[A-Za-z0-9-]{1,24}$/)) {
                        error 'El identificador no cumple el formato permitido.'
                    }

                    echo 'Los parámetros tienen formato válido.'
                }
            }
        }

        stage('Comprobar estructura') {
            steps {
                script {
                    def requeridos = [
                        'README.md',
                        'app/mensaje.txt',
                        'scripts/validar.sh'
                    ]

                    requeridos.each { ruta ->
                        if (!fileExists(ruta)) {
                            error "Falta el archivo requerido: ${ruta}"
                        }
                    }

                    echo 'La estructura requerida está presente.'
                }
            }
        }

        stage('Validar contenido') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }

        stage('Capturar versión') {
            steps {
                script {
                    def versionPython = sh(
                        returnStdout: true,
                        script: 'python3 --version 2>&1'
                    ).trim()

                    echo "Herramienta detectada: ${versionPython}"
                }
            }
        }

        stage('Crear resumen') {
            steps {
                script {
                    def identificador = params.IDENTIFICADOR
                    def modo = params.MODO
                    def numeroBuild = env.BUILD_NUMBER ?: 'sin-numero'
                    def nombreJob = env.JOB_NAME ?: 'job-desconocido'

                    sh "mkdir -p '${env.DIRECTORIO_SALIDA}'"

                    def textoResumen = """\
Práctica: ${env.NOMBRE_PRACTICA}
Job: ${nombreJob}
Ejecución: ${numeroBuild}
Identificador: ${identificador}
Modo: ${modo}
Resultado de validación: correcto
"""

                    writeFile(
                        file: "${env.DIRECTORIO_SALIDA}/resumen.txt",
                        text: textoResumen
                    )

                    if (!fileExists("${env.DIRECTORIO_SALIDA}/resumen.txt")) {
                        error 'No se pudo crear el resumen.'
                    }

                    echo 'Se creó el resumen de laboratorio.'
                }
            }
        }

        stage('Publicar resultado') {
            steps {
                archiveArtifacts(
                    artifacts: 'salida/resumen.txt',
                    fingerprint: true
                )
            }
        }

        stage('Resumen final') {
            steps {
                script {
                    if (params.MODO == 'detallado') {
                        echo "Práctica: ${env.NOMBRE_PRACTICA}"
                        echo "Identificador: ${params.IDENTIFICADOR}"
                        echo "Ejecución: ${env.BUILD_NUMBER}"
                        echo 'Se ejecutó el modo detallado.'
                    } else {
                        echo 'Se ejecutó el modo simple.'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Las comprobaciones configuradas terminaron correctamente.'
        }

        failure {
            echo 'El pipeline falló. Revisa la primera etapa fallida.'
        }

        unstable {
            echo 'El resultado requiere revisión.'
        }

        aborted {
            echo 'La ejecución se interrumpió.'
        }

        always {
            echo "Job: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            echo "Resultado: ${currentBuild.currentResult}"
            echo 'Fin de la ejecución.'
        }
    }
}
```

### Revisión de interpolación en el ejemplo

El ejemplo usa una ruta de salida definida por el propio pipeline.

No acepta esa ruta como parámetro.

El identificador se valida antes de escribirse en el resumen.

Para entornos con entradas más complejas, revisa el manejo de argumentos y rutas con especial cuidado.

### Disponibilidad de `python3`

La etapa de versión presupone que `python3` existe en el agente.

Si no existe:

- El pipeline puede fallar en esa etapa.
- El docente puede proporcionar otro agente.
- Se puede retirar la etapa si no es un requisito del curso.
- No se debe instalar software en un agente compartido sin autorización.

### Recorrido de ejecución

#### Inicio

Jenkins prepara la ejecución y asigna un agente disponible.

#### Parámetros

La persona selecciona:

- `MODO`.
- `IDENTIFICADOR`.

#### Validación de parámetros

Groovy comprueba la lista permitida y el patrón del identificador.

Un valor inválido detiene el flujo con `error`.

#### Comprobación de estructura

El pipeline verifica que cada archivo requerido existe en el workspace.

#### Validación de contenido

El script de shell comprueba el contenido de `app/mensaje.txt`.

Un código de salida no cero detiene la etapa.

#### Captura de versión

El comando produce una línea de texto que se captura con `returnStdout`.

#### Creación del resumen

Groovy combina datos validados y variables de Jenkins para crear un archivo.

#### Publicación

`archiveArtifacts` conserva el resumen asociado a la ejecución, según la retención.

#### Resumen final

El modo determina cuánto detalle se imprime.

#### `post`

Jenkins ejecuta la condición correspondiente al resultado final y muestra información de cierre.

### Interpretar el resultado

Si el pipeline termina como `SUCCESS`, significa que las acciones configuradas terminaron correctamente.

No significa que se hayan probado todas las propiedades posibles del proyecto.

Si termina como `FAILURE`, identifica la primera etapa fallida.

Si termina como `ABORTED`, comprueba si se canceló manualmente o venció un límite.

### Limitaciones del ejemplo

El pipeline:

- No compila una aplicación.
- No ejecuta una suite completa de pruebas.
- No publica en un registro.
- No despliega.
- No envía notificaciones externas.
- No configura credenciales.
- No garantiza que todos los agentes tengan las mismas herramientas.

### Mejora posible: separar versión informativa

Si la versión de Python no es requisito obligatorio, se puede tratar como información opcional, siempre que quede claro que no valida el proyecto.

No ocultes un fallo de una herramienta que sí sea obligatoria.

---

## Recorrido de ejecución y evidencias

La interfaz de Jenkins permite revisar qué ocurrió en cada fase.

### Revisar el inicio

Comprueba:

- Job.
- Número de ejecución.
- Parámetros recibidos.
- Rama y commit.
- Agente asignado.

No compartas capturas con datos sensibles.

### Revisar etapas

Comprueba:

- Orden.
- Duración.
- Estado.
- Etapas fallidas.
- Etapas omitidas.
- Mensajes de diagnóstico.

### Revisar consola

Busca la primera causa relevante, no solo el resumen final.

Comprueba:

- Comando ejecutado.
- Código de salida.
- Archivos presentes.
- Mensaje del script.
- Agente.
- Ruta de trabajo.

### Revisar artefactos

Abre el resumen desde la sección de artefactos de la ejecución.

Comprueba:

- Nombre correcto.
- Contenido esperado.
- Ausencia de secretos.
- Asociación con la ejecución actual.

### Revisar historial

Compara ejecuciones cuando se esté diagnosticando:

- Un cambio de resultado.
- Una variación de herramienta.
- Un cambio de rama.
- Una regresión.
- Una recuperación.

El historial disponible depende de la retención.

---

## Casos de prueba del pipeline

Un pipeline se debe comprobar con más de un camino de ejecución.

### Caso válido: modo simple

Entradas:

```text
MODO=simple
IDENTIFICADOR=grupo-1
```

Resultado esperado:

- Los parámetros pasan la validación.
- La estructura existe.
- El script principal pasa.
- Se crea y archiva el resumen.
- La salida final indica modo simple.
- Jenkins registra `SUCCESS`.

### Caso válido: modo detallado

Entradas:

```text
MODO=detallado
IDENTIFICADOR=equipoA
```

Resultado esperado:

- Las validaciones pasan.
- El resumen contiene el identificador.
- Se muestran mensajes adicionales.
- Jenkins registra `SUCCESS`.

### Caso inválido: identificador con espacios

Entrada:

```text
IDENTIFICADOR=grupo de práctica
```

Resultado esperado:

- La validación rechaza el valor.
- No se utiliza en una ruta ni un comando.
- Jenkins registra un fallo claro.
- La etapa de validación principal no se ejecuta.

### Caso inválido: contenido ausente

Modifica el archivo en una rama de laboratorio para que no contenga `Jenkins`.

Resultado esperado:

- El script imprime un error útil.
- El comando devuelve un código no cero.
- El flujo no archiva un resumen que afirma una validación correcta.
- Jenkins registra un fallo.

### Caso de archivo requerido ausente

Quita un archivo solo en una rama temporal de práctica.

Resultado esperado:

- La etapa de estructura identifica la ruta.
- La ejecución se detiene antes de usarla.
- El mensaje indica qué falta.
- El archivo se restaura después de la sesión.

### Caso de agente sin herramienta

Si `python3` no está instalado:

- La etapa de versión puede fallar.
- El log debe identificar el comando.
- Se debe decidir si esa herramienta es obligatoria.
- No se debe ocultar el fallo sin documentarlo.
- No se debe instalar software sin autorización.

### Caso de timeout

Si la ejecución supera el límite:

- Jenkins interrumpe el flujo según la configuración.
- No se debe interpretar el resultado como éxito.
- Se debe identificar el paso que no terminó.
- La duración debería ajustarse con evidencia, no por intuición.

### Caso de cancelación

Si una persona cancela la ejecución:

- El resultado puede ser `ABORTED`.
- No se debe informar como una validación fallida.
- No se debe informar como una aprobación.
- Se debe revisar si el artefacto llegó a crearse.

### Matriz de pruebas

| Caso | Entrada o condición | Resultado esperado |
|---|---|---|
| Válido simple | Modo simple y archivos presentes | `SUCCESS` |
| Válido detallado | Modo detallado y archivos presentes | `SUCCESS` |
| Identificador inválido | Formato no permitido | `FAILURE` |
| Archivo obligatorio ausente | Ruta no presente | `FAILURE` |
| Contenido incorrecto | Frase esperada ausente | `FAILURE` |
| Herramienta ausente | Ejecutable no disponible | Fallo o política documentada |
| Timeout | Tarea supera el límite | Interrumpida, no éxito |
| Cancelación | Ejecución cancelada | `ABORTED` o estado equivalente |

### Registrar resultados

Usa una ficha por caso:

```text
Caso:
Job:
Número de ejecución:
Rama:
Commit:
Parámetros no sensibles:
Etapa principal:
Resultado esperado:
Resultado observado:
Primera causa:
Artefactos:
Observaciones:
```

---

## Sesiones prácticas

Las prácticas construyen el pipeline de forma incremental.

### Preparación general

Antes de cada sesión:

- Confirma el job autorizado.
- Confirma el agente.
- Revisa la rama.
- Comprueba los archivos.
- No uses credenciales.
- No envíes notificaciones reales.
- Anota el número de ejecución.
- Restaura los cambios de prueba.

### Sesión 1: dibujar el flujo

**Objetivo:** planificar las etapas antes de escribir el código.

#### Actividad

Dibuja:

```text
Parámetros
   |
   v
Validación
   |
   v
Estructura
   |
   v
Script de comprobación
   |
   v
Captura
   |
   v
Resumen
   |
   v
Artefacto
   |
   v
Post
```

#### Preguntas

- ¿Qué etapa depende de la anterior?
- ¿Qué información se captura?
- ¿Qué se conserva?
- ¿Qué debe detener el pipeline?
- ¿Qué datos no deberían imprimirse?

### Sesión 2: crear el esqueleto

**Objetivo:** iniciar con la estructura mínima declarativa.

#### Jenkinsfile

```groovy
pipeline {
    agent any

    stages {
        stage('Preparar') {
            steps {
                echo 'Comienza el pipeline de laboratorio.'
            }
        }
    }
}
```

#### Instrucciones

1. Guarda el archivo.
2. Ejecuta el job.
3. Localiza la etapa.
4. Revisa la consola.
5. Anota el resultado.
6. Comprueba que el `Jenkinsfile` procede de la rama esperada.

### Sesión 3: añadir una variable de entorno

**Objetivo:** registrar configuración no sensible.

Añade:

```groovy
environment {
    NOMBRE_PRACTICA = 'pipeline-completo'
}
```

Imprime el valor con:

```groovy
echo "Práctica: ${env.NOMBRE_PRACTICA}"
```

#### Instrucciones

1. Coloca `environment` en el nivel del pipeline.
2. Añade el mensaje a una etapa.
3. Ejecuta.
4. Comprueba el valor.
5. Explica por qué no se debe almacenar aquí una contraseña.

### Sesión 4: añadir parámetros

**Objetivo:** permitir variación controlada entre ejecuciones.

Añade:

```groovy
parameters {
    choice(
        name: 'MODO',
        choices: ['simple', 'detallado'],
        description: 'Modo de resumen'
    )

    string(
        name: 'IDENTIFICADOR',
        defaultValue: 'grupo-1',
        description: 'Código no sensible de práctica'
    )
}
```

#### Instrucciones

1. Guarda el `Jenkinsfile`.
2. Inicia una ejecución con los valores predeterminados.
3. Cambia el modo.
4. Registra los mensajes.
5. Explica qué valor se puede variar por ejecución.

### Sesión 5: validar entradas

**Objetivo:** rechazar valores no permitidos.

Añade una etapa `Validar parámetros`.

#### Requisitos

- Aceptar solo `simple` o `detallado`.
- Aceptar identificadores con letras, números y guiones.
- Limitar el identificador a 24 caracteres.
- Detener el pipeline con `error` si un valor no es válido.

#### Preguntas

- ¿Qué ocurre con una cadena vacía?
- ¿Qué ocurre con espacios?
- ¿Por qué se valida antes de ejecutar comandos?

### Sesión 6: validar la estructura del repositorio

**Objetivo:** detectar archivos ausentes antes de usar el script.

Comprueba:

```text
README.md
app/mensaje.txt
scripts/validar.sh
```

Utiliza `fileExists` o comandos `test -f`.

#### Instrucciones

1. Ejecuta con todos los archivos.
2. Quita uno en una rama de práctica.
3. Ejecuta otra vez.
4. Confirma que el mensaje identifica la ruta.
5. Restaura el archivo.

### Sesión 7: ejecutar el script principal

**Objetivo:** conectar Jenkins con una validación versionada.

Añade:

```groovy
sh 'bash scripts/validar.sh'
```

#### Instrucciones

1. Comprueba que el script local funciona.
2. Confirma que el archivo está en el commit.
3. Ejecuta Jenkins.
4. Localiza el mensaje del script.
5. Comprueba el estado del paso.

### Sesión 8: provocar un error de validación

**Objetivo:** comprobar que un fallo se propaga.

#### Instrucciones

1. En una rama temporal, cambia el contenido esperado.
2. Ejecuta el pipeline.
3. Registra el código y la etapa.
4. Comprueba si el resumen se creó.
5. Restaura el contenido.
6. Ejecuta una validación exitosa.

#### Preguntas

- ¿Cuál fue el primer error?
- ¿Qué etapa no llegó a ejecutarse?
- ¿El mensaje final decía éxito?
- ¿Qué evidencia conserva Jenkins?

### Sesión 9: capturar una salida

**Objetivo:** recuperar un valor breve de un comando.

Utiliza `returnStdout: true` con un comando seguro que imprima un texto fijo.

#### Instrucciones

1. Captura el texto.
2. Elimina el salto de línea con `.trim()`.
3. Imprime un resumen no sensible.
4. Compara el texto con un valor esperado.
5. Comprueba cómo falla si el valor cambia.

### Sesión 10: capturar un código de salida

**Objetivo:** aprender a interpretar `returnStatus`.

#### Instrucciones

1. Comprueba un archivo que existe.
2. Captura el código.
3. Comprueba que el valor es cero.
4. Comprueba una ruta inexistente en una rama de práctica.
5. Convierte el código no cero en `error`.
6. No omitas la condición que interpreta el valor.

### Sesión 11: crear un resumen

**Objetivo:** generar un archivo no sensible.

El resumen debe incluir:

- Nombre de práctica.
- Número de ejecución.
- Identificador.
- Modo.
- Mensaje de resultado validado.

No incluyas:

- Entorno completo.
- Credenciales.
- Tokens.
- Datos personales innecesarios.

### Sesión 12: archivar el resumen

**Objetivo:** relacionar el artefacto con la ejecución.

#### Instrucciones

1. Confirma que el archivo existe.
2. Archívalo con `archiveArtifacts`.
3. Abre la ejecución.
4. Descarga el artefacto si la política lo permite.
5. Comprueba el contenido.
6. Registra el nombre del archivo.

### Sesión 13: añadir `post`

**Objetivo:** mostrar el resultado global.

Incluye:

- `success`.
- `failure`.
- `always`.
- `aborted`, si el curso lo desea.

#### Instrucciones

1. Ejecuta una ruta exitosa.
2. Ejecuta una ruta fallida.
3. Compara los mensajes.
4. Cancela una ejecución de práctica solo con autorización.
5. Explica por qué `always` no significa éxito.

### Sesión 14: añadir timeout

**Objetivo:** limitar una ejecución atascada.

#### Instrucciones

1. Usa el límite breve indicado por el docente.
2. No crees esperas largas.
3. Ejecuta una ruta normal.
4. Registra el resultado.
5. Explica qué debe ocurrir si se supera el límite.

### Sesión 15: revisar opciones

**Objetivo:** identificar el propósito de cada opción configurada.

Completa:

| Opción | Alcance | Motivo | Efecto si se activa |
|---|---|---|---|
| `timestamps()` | | | |
| `timeout(...)` | | | |
| `disableConcurrentBuilds()` | | | |
| `buildDiscarder(...)` | | | |

No añadas una opción sin explicar por qué se necesita.

### Sesión 16: comparar modo simple y detallado

**Objetivo:** aplicar la selección a una salida.

#### Instrucciones

1. Ejecuta con modo simple.
2. Ejecuta con modo detallado.
3. Compara la consola.
4. Comprueba que ambas rutas realizan las validaciones obligatorias.
5. Explica qué diferencia debe ser solo de presentación.

### Sesión 17: revisar artefactos

**Objetivo:** verificar qué se conserva.

#### Instrucciones

1. Comprueba el artefacto del build actual.
2. Comprueba que no hay artefactos de una ejecución anterior.
3. Revisa la política de retención.
4. No archives la carpeta completa sin filtrar.
5. Comprueba que el resumen no contiene datos sensibles.

### Sesión 18: revisión de seguridad

**Objetivo:** auditar el pipeline antes de compartirlo.

Busca:

- Interpolaciones de parámetros.
- Comandos construidos con texto libre.
- Variables sensibles.
- Impresión de entorno.
- Rutas absolutas.
- Comandos destructivos.
- `catchError` amplio.
- `|| true`.
- Notificaciones reales.
- Plugins no autorizados.

Entrega una observación por cada riesgo encontrado.

### Sesión 19: diagnóstico en parejas

**Objetivo:** explicar un fallo a otra persona.

La persona que presenta debe indicar:

- Job.
- Número de ejecución.
- Rama.
- Commit.
- Agente.
- Etapa fallida.
- Primera causa.
- Comprobación siguiente.

La persona revisora debe:

- Distinguir observación de hipótesis.
- Confirmar si el error es de código o entorno.
- Proponer una comprobación acotada.
- Evitar cambios aleatorios.

### Sesión 20: documentar el pipeline

**Objetivo:** crear una guía breve de operación.

Incluye:

- Propósito.
- Parámetros.
- Agente.
- Herramientas.
- Etapas.
- Artefactos.
- Errores esperados.
- Resultados.
- Limitaciones.
- Contacto de soporte del curso.

No incluyas contraseñas, tokens o direcciones privadas.

### Sesión 21: revisión por pares

**Objetivo:** comprobar mantenibilidad.

Revisa:

- ¿Las etapas tienen nombres claros?
- ¿Cada etapa tiene una responsabilidad?
- ¿Los valores se validan?
- ¿Los mensajes son útiles?
- ¿Los comandos se pueden probar localmente?
- ¿Los errores obligatorios se propagan?
- ¿Los artefactos son necesarios?
- ¿Se evita la duplicación?
- ¿El pipeline puede leerse sin conocer a su autor?

### Sesión 22: entrega final

**Objetivo:** presentar una ejecución reproducible.

Entrega:

- `Jenkinsfile`.
- Script de validación.
- README del proyecto.
- Número de una ejecución exitosa.
- Número de una ejecución fallida controlada.
- Captura o transcripción no sensible del resultado.
- Breve explicación de decisiones de diseño.

---

## Diagnóstico y evaluación

Un pipeline completo requiere comprobar tanto el código como las condiciones del agente y Jenkins.

### Diagnóstico ordenado

1. Anota job y número de build.
2. Confirma rama y commit.
3. Localiza la primera etapa fallida.
4. Identifica el comando que falló.
5. Comprueba el código de salida.
6. Confirma los archivos en el workspace.
7. Revisa agente y herramientas.
8. Distingue fallo de código, configuración e infraestructura.
9. Formula una hipótesis comprobable.
10. Cambia una cosa cada vez.
11. Ejecuta una prueba válida y otra inválida.
12. Documenta el resultado.

### La etapa de estructura falla

Comprueba:

- Ruta relativa.
- Checkout.
- Rama.
- Commit.
- Mayúsculas y minúsculas.
- Nombre exacto del archivo.
- Agente y workspace.

### El script principal no arranca

Comprueba:

- Que Bash está disponible.
- Que la ruta es correcta.
- Que el archivo está en el commit.
- Que el comando de invocación es compatible con el agente.
- Que el log muestra la ruta del workspace.

### El texto esperado no se encuentra

Comprueba:

- Contenido real.
- Codificación.
- Mayúsculas.
- Espacios.
- Rama procesada.
- Herramienta `grep`.
- Mensaje del script.

### `python3` no está disponible

Comprueba:

- Etiqueta de agente.
- Imagen del agente.
- Sistema operativo.
- Herramientas proporcionadas por el curso.
- Si la etapa es obligatoria o informativa.

No instales software en un agente compartido sin autorización.

### El parámetro aparece vacío

Comprueba:

- Nombre en `parameters`.
- Nombre usado en `params`.
- Tipo del parámetro.
- Rama del `Jenkinsfile`.
- Forma de iniciar el job.
- Valor predeterminado.
- Cambios guardados.

### Un `if` toma la rama incorrecta

Comprueba:

- Valor real.
- Mayúsculas.
- Espacios.
- Tipo.
- Normalización.
- Comparación exacta.
- Nombre del parámetro.

### Salida capturada con valor inesperado

Comprueba:

- Salida del comando.
- Canal estándar o error.
- Saltos de línea.
- Codificación.
- Comando ejecutado.
- Agente.
- Si el script se ejecutó más de una vez.

### Código de salida capturado pero build exitoso

Comprueba si se utilizó `returnStatus` sin interpretar el valor.

Añade una condición explícita que falle o marque el resultado según la política.

### Resumen no creado

Comprueba:

- Directorio.
- Permisos del workspace.
- Orden de etapas.
- Escritura del archivo.
- Errores anteriores.
- Nombre y ruta del archivo.

### Artefacto no aparece

Comprueba:

- Patrón de `archiveArtifacts`.
- Ruta relativa.
- Existencia del archivo.
- Orden de pasos.
- Agente y workspace.
- Mensajes del paso de archivado.

### `post` no muestra el mensaje esperado

Comprueba:

- Resultado final.
- Condición elegida.
- Si el pipeline terminó normalmente.
- Si la ejecución fue interrumpida.
- Si se está mirando el build correcto.
- Si el bloque está al nivel adecuado.

### Timeout inesperado

Comprueba:

- Límite global.
- Límites de etapa.
- Espera por agente.
- Duración normal de pruebas.
- Carga del nodo.
- Comando bloqueado.
- Interrupción externa.

### Resultado exitoso con una prueba fallida

Busca:

- `returnStatus` no comprobado.
- `catchError`.
- `try/catch` que continúa.
- `|| true`.
- Script que termina siempre en cero.
- Etapa omitida por condición.
- Mensaje de éxito no relacionado con el estado real.

### Plugin ausente

Si un paso no existe:

- Revisa si depende de un plugin.
- Comprueba la versión.
- Consulta la documentación local.
- No instales ni actualices plugins sin autorización.
- Sustituye el paso por una alternativa aprobada, si procede.

### Agente equivocado

Comprueba:

- Etiqueta seleccionada.
- Configuración del job.
- Disponibilidad de nodo.
- Sistema operativo.
- Herramientas requeridas.
- Política de agentes del laboratorio.

### Pipeline lento

Revisa:

- Tiempo de checkout.
- Espera por agente.
- Descargas.
- Duración de pruebas.
- Reintentos.
- Paralelismo.
- Pausas interactivas.
- Acciones externas.

No elimines validaciones obligatorias para acelerar una ejecución.

### Pipeline difícil de leer

Busca:

- Bloques `script` extensos.
- Comandos duplicados.
- Variables con nombres confusos.
- Etapas que hacen demasiadas cosas.
- Condiciones anidadas.
- Mensajes ambiguos.
- Lógica que podría estar en un script versionado.

### Informe de incidente

```text
Job:
Número de ejecución:
Rama:
Commit:
Agente:
Resultado:
Primera etapa fallida:
Primer mensaje útil:
Comando:
Código de salida:
Observación:
Hipótesis:
Comprobación realizada:
Resultado de la comprobación:
Cambio aplicado:
```

### Observación frente a hipótesis

Ejemplo:

```text
Observación:
Jenkins informa que no encuentra app/mensaje.txt.

Hipótesis:
La rama ejecutada no contiene el archivo.

Comprobación:
Revisar commit y lista de archivos del checkout.
```

Evita escribir una hipótesis como si ya fuera un hecho.

---

## Errores de diseño que conviene evitar

### Un `Jenkinsfile` que hace demasiado

El pipeline debería coordinar el trabajo.

La lógica de aplicación extensa suele pertenecer a scripts o herramientas del proyecto.

### Etapas con varias responsabilidades

Una etapa llamada `Todo` dificulta localizar errores.

Divide las tareas por propósito.

### Variables sin contrato

Cada valor debería tener origen, tipo y regla de uso.

### Parámetros demasiado libres

Un parámetro de texto no debería decidir comandos, credenciales o destinos sin controles.

### Éxito basado solo en un mensaje

Un `echo` no valida por sí mismo que un comando haya pasado.

### Excepciones silenciadas

Capturar una excepción y continuar puede producir falsos éxitos.

### Reintentos indiscriminados

Repetir una acción no idempotente puede generar efectos duplicados.

### Capturar demasiada salida

Una salida extensa puede hacer lenta la ejecución y exponer datos.

### Archivar todo el workspace

Limita el patrón de artefactos a los archivos necesarios.

### Limpiar antes de archivar

Conserva primero la evidencia requerida.

### Entorno completo en consola

No uses `env` como forma rutinaria de depuración.

### Credenciales codificadas

No guardes secretos en el repositorio ni en parámetros normales.

### Mensajes sin alcance

`Todo correcto` puede describir más de lo que el pipeline verificó.

### Notificaciones ruidosas

Simula primero, define destinatarios y evita enviar cada mensaje sin propósito.

### Agentes con permisos excesivos

Usa el agente adecuado y el menor privilegio necesario.

### Falta de prueba negativa

Comprueba que las entradas inválidas realmente detienen el flujo.

### Falta de restauración

Después de una prueba fallida, restaura archivos y parámetros de práctica.

---

## Checklist de revisión final

### Propósito

- [ ] El objetivo del pipeline está escrito.
- [ ] Las etapas siguen un orden comprensible.
- [ ] Cada etapa tiene una responsabilidad principal.
- [ ] Las dependencias entre etapas están claras.

### Entradas

- [ ] Los parámetros tienen nombres y descripciones claros.
- [ ] Los tipos coinciden con los valores.
- [ ] Los valores predeterminados son seguros.
- [ ] Las entradas se validan antes de usarse.
- [ ] Los secretos no se solicitan como texto normal.

### Ejecución

- [ ] El agente es el autorizado.
- [ ] Las herramientas requeridas están disponibles.
- [ ] Los comandos son compatibles con el sistema operativo.
- [ ] Se ha definido un límite de tiempo razonable.
- [ ] La concurrencia está justificada.

### Datos y archivos

- [ ] Las rutas son relativas al workspace.
- [ ] Los archivos se comprueban antes de leerlos.
- [ ] Las salidas se validan.
- [ ] No se procesan archivos residuales sin control.
- [ ] Los artefactos son necesarios y seguros.
- [ ] El contenido se archiva antes de limpiar.

### Errores

- [ ] Los errores obligatorios detienen el pipeline.
- [ ] Los códigos de salida se interpretan.
- [ ] Las comprobaciones opcionales quedan visibles.
- [ ] Los reintentos son limitados y seguros.
- [ ] Los timeouts no se tratan como éxito.
- [ ] Las cancelaciones no se convierten en falsos éxitos.

### Resultado y comunicación

- [ ] `post` distingue éxito, fallo, inestabilidad y aborto.
- [ ] Los mensajes son precisos.
- [ ] No hay notificaciones externas sin autorización.
- [ ] No se imprimen secretos.
- [ ] El resumen identifica job y ejecución.

### Mantenimiento

- [ ] El código está sangrado de forma consistente.
- [ ] Las variables tienen nombres descriptivos.
- [ ] Los bloques `script` son pequeños.
- [ ] Los plugins están documentados.
- [ ] El `Jenkinsfile` fue revisado.
- [ ] Hay pruebas de éxito y fallo controlado.

---

## Rúbrica de evaluación

La rúbrica permite valorar tanto el resultado como el diseño.

| Criterio | Inicial | En progreso | Satisfactorio | Avanzado |
|---|---|---|---|---|
| Estructura | No sigue declarativo | Estructura parcial | Estructura válida | Clara y consistente |
| Entradas | Sin validación | Validación incompleta | Tipos y reglas correctas | Casos límite documentados |
| Etapas | Mezcladas o ambiguas | Algunas responsabilidades claras | Orden lógico | Dependencias muy claras |
| Errores | Fallos ocultos | Errores poco claros | Fallos visibles | Diagnóstico preciso |
| Datos | Sin validar | Captura parcial | Captura y validación correctas | Procedencia y alcance documentados |
| Artefactos | No esperados | Patrón demasiado amplio | Artefacto correcto | Retención y contenido revisados |
| Seguridad | Riesgos evidentes | Controles parciales | Sin secretos y entradas validadas | Mínimo privilegio y revisión completa |
| Mensajes | Ambiguos | Parcialmente útiles | Describen resultados | Accionables y proporcionados |
| Pruebas | Solo camino exitoso | Algunas pruebas | Éxito y fallo controlado | Casos de borde y diagnóstico |
| Documentación | Insuficiente | Parcial | Comprensible | Reproducible y mantenible |

### Evidencias para la evaluación

El alumnado puede entregar:

- Repositorio de laboratorio.
- `Jenkinsfile`.
- Script de validación.
- Ejecución exitosa.
- Ejecución fallida controlada.
- Resumen archivado.
- Informe de diagnóstico.
- Lista de decisiones de seguridad.
- Revisión por pares.

---

## Preguntas de repaso

1. ¿Qué significa construir un pipeline completo?
2. ¿Qué diferencia hay entre parámetro y variable de entorno?
3. ¿Cómo se accede a parámetros desde Groovy?
4. ¿Cómo se accede a variables de entorno desde Groovy?
5. ¿Qué diferencia hay entre Groovy y shell?
6. ¿Qué hace `fileExists`?
7. ¿Qué hace `readFile`?
8. ¿Qué devuelve `returnStdout`?
9. ¿Qué devuelve `returnStatus`?
10. ¿Por qué hay que validar una salida capturada?
11. ¿Qué diferencia hay entre un error obligatorio y una advertencia opcional?
12. ¿Cuándo se puede usar `catchError`?
13. ¿Por qué se limita el uso de `retry`?
14. ¿Qué protege `timeout`?
15. ¿Qué hace `archiveArtifacts`?
16. ¿Qué diferencia hay entre workspace y artefacto?
17. ¿Por qué no se deben imprimir todas las variables?
18. ¿Qué significa que un pipeline termine como `ABORTED`?
19. ¿Por qué una etapa omitida no demuestra que sus pruebas pasaron?
20. ¿Qué debe hacer el bloque `post` ante un fallo?
21. ¿Qué riesgos tiene interpolar texto de usuario en una shell?
22. ¿Por qué se revisa la rama y el commit?
23. ¿Qué datos incluirías en un resumen de ejecución?
24. ¿Qué datos excluirías?
25. ¿Qué pruebas de éxito y fallo realizarías antes de entregar?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Un pipeline completo debería tener un propósito y criterios de resultado definidos».

### Afirmación 2

«Un parámetro `choice` debe reemplazar todos los controles de seguridad».

### Afirmación 3

«Una variable de entorno es secreta por el hecho de estar en `environment`».

### Afirmación 4

«Una entrada debe validarse antes de utilizarse en un comando».

### Afirmación 5

«`returnStdout` devuelve texto del comando».

### Afirmación 6

«`returnStatus` interpreta automáticamente cualquier código distinto de cero».

### Afirmación 7

«`archiveArtifacts` conserva archivos asociados a una ejecución según la política de Jenkins».

### Afirmación 8

«Un workspace es almacenamiento permanente de artefactos».

### Afirmación 9

«Una validación obligatoria puede convertirse en `UNSTABLE` para mantener el pipeline verde».

### Afirmación 10

«Una etapa omitida es distinta de una etapa que pasó».

### Afirmación 11

«Un bloque `post` puede imprimir un resumen del resultado».

### Afirmación 12

«El mensaje `Todo correcto` siempre es adecuado si una etapa pasa».

### Afirmación 13

«Una operación puede ser peligrosa de reintentar si no es idempotente».

### Afirmación 14

«Los agentes pueden tener distintas herramientas».

### Afirmación 15

«Los secretos pueden escribirse en el resumen si el archivo se archiva de forma privada».

### Respuestas orientativas

#### Afirmación 1

**Correcta.** Sin propósito y criterios, es difícil evaluar el resultado.

#### Afirmación 2

**Incorrecta.** Limitar opciones no sustituye autorización, validación ni revisión.

#### Afirmación 3

**Incorrecta.** Una variable de entorno no es secreta por defecto.

#### Afirmación 4

**Correcta.** La validación reduce errores y riesgos de inyección.

#### Afirmación 5

**Correcta.** `returnStdout` captura salida estándar como texto.

#### Afirmación 6

**Incorrecta.** El pipeline debe interpretar el código devuelto.

#### Afirmación 7

**Correcta.** La retención depende de la configuración.

#### Afirmación 8

**Incorrecta.** El workspace es un área de trabajo; la retención no está garantizada.

#### Afirmación 9

**Incorrecta.** Una condición obligatoria no debería ocultarse para mantener un estado verde.

#### Afirmación 10

**Correcta.** Una etapa omitida no se ejecutó necesariamente.

#### Afirmación 11

**Correcta.** Puede utilizarse para acciones posteriores y resúmenes.

#### Afirmación 12

**Incorrecta.** El mensaje debe describir el alcance real de la validación.

#### Afirmación 13

**Correcta.** Repetirla puede duplicar efectos o modificar datos varias veces.

#### Afirmación 14

**Correcta.** La disponibilidad de herramientas depende del agente.

#### Afirmación 15

**Incorrecta.** Los secretos no deben incluirse en artefactos sin un mecanismo aprobado y una necesidad explícita.