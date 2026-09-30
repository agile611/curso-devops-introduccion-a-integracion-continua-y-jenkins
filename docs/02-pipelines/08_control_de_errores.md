# Control de errores en Jenkins

El control de errores determina cómo responde un pipeline cuando falla un comando, una prueba, una herramienta o una etapa. Un buen pipeline detecta el problema, conserva información útil, comunica el resultado verdadero y evita continuar con acciones que dependen de una validación fallida.

Esta unidad explica cómo fallan los pasos, cómo Jenkins propaga los errores y qué mecanismos declarativos pueden usarse para gestionarlos. Incluye ejemplos con `error`, `catchError`, `warnError`, `retry`, `timeout`, `returnStatus` y `post`, además de sesiones para provocar fallos controlados y practicar el diagnóstico.

> **Uso seguro:** realiza las prácticas únicamente en un job y agentes de laboratorio autorizados. No utilices comandos destructivos, credenciales reales ni sistemas de producción. Un pipeline debe dejar visible un fallo importante; no fuerces un resultado exitoso para silenciarlo.

## Esquema de la página

- ## Fundamentos del control de errores
  - ### Qué es un error en un pipeline
  - ### Fallo, inestabilidad, aborto y etapa omitida
  - ### Propagación del error
  - ### Por qué no se deben ocultar fallos
- ## Pasos y códigos de salida
  - ### Códigos de salida de shell
  - ### `sh` y `bat`
  - ### `returnStatus`
  - ### Mensajes y trazas
- ## Herramientas declarativas de manejo
  - ### `error`
  - ### `catchError`
  - ### `warnError`
  - ### `retry`
  - ### `timeout`
  - ### `unstable`
- ## Manejo en Groovy y condiciones posteriores
  - ### `try` y `catch`
  - ### Interrupciones y cancelaciones
  - ### `post`
  - ### Fallos de notificación o limpieza
- ## Diseño y diagnóstico
  - ### Errores recuperables y no recuperables
  - ### Reintentos con criterio
  - ### Registro útil
  - ### Seguridad
- ## Sesiones prácticas
  - ### Provocar un fallo controlado
  - ### Capturar un código de salida
  - ### Reintentar y limitar el tiempo
  - ### Gestionar errores con `catchError`
  - ### Diagnosticar y documentar
- ## Evaluación y referencia
  - ### Checklist
  - ### Preguntas y ejercicios
  - ### Glosario y síntesis

## Fundamentos del control de errores

Un pipeline debe diferenciar entre una tarea que terminó correctamente, una que falló y una que no llegó a ejecutarse.

### Qué es un error en un pipeline

Un error es una condición que impide que un paso o una etapa realice su trabajo como se esperaba.

Puede originarse en:

- Una comprobación que no se cumple.
- Un comando que devuelve un código de error.
- Una herramienta ausente.
- Un archivo que no existe.
- Un checkout fallido.
- Un agente desconectado.
- Un error de sintaxis.
- Un servicio externo no disponible.
- Un timeout.
- Una interrupción manual.
- Una configuración incorrecta.

### Error del código y error del entorno

No todos los fallos indican un defecto del código.

Un pipeline puede fallar por:

- Código con un defecto.
- Pruebas que detectan una regresión.
- Falta de recursos.
- Error de autenticación.
- Problema de red.
- Herramienta no instalada.
- Permisos insuficientes.
- Configuración del job.
- Error de Jenkins o de un plugin.

El diagnóstico debe identificar cuál de estas categorías se ajusta a la evidencia.

### Resultado de una ejecución

Jenkins puede mostrar resultados como:

- `SUCCESS`: la ejecución terminó correctamente.
- `FAILURE`: una acción falló.
- `UNSTABLE`: la ejecución terminó con problemas que no siempre se tratan como un fallo completo.
- `ABORTED`: la ejecución se interrumpió.
- `NOT_BUILT`: la ejecución no se construyó o no llegó a ejecutarse de la forma prevista.

La interfaz y los plugins pueden mostrar estados adicionales o presentarlos de otro modo.

### Fallo

Un resultado `FAILURE` indica que una acción relevante falló.

Ejemplos:

- Una prueba devolvió un código no cero.
- Se llamó al paso `error`.
- Una herramienta terminó con una excepción.
- Una etapa requerida no pudo completarse.

### Inestabilidad

`UNSTABLE` suele indicar que la ejecución terminó, pero hay un resultado que requiere atención.

Puede deberse a:

- Pruebas fallidas tratadas como inestables.
- Informes que marcan advertencias.
- Un paso que cambia explícitamente el resultado.
- Reglas definidas por un plugin.

Comprueba qué acción produce el estado en el pipeline concreto.

### Aborto

`ABORTED` suele indicar que la ejecución se detuvo antes de terminar normalmente.

Puede deberse a:

- Cancelación manual.
- Timeout.
- Interrupción.
- Cancelación de un proceso.
- Una política del job.

Un aborto no demuestra que el código haya fallado una prueba.

### Etapa omitida

Una etapa puede omitirse por una condición, por ejemplo un `when`.

Una etapa omitida:

- No necesariamente se ejecutó.
- No demuestra que su prueba pasara.
- Puede ser una decisión válida del flujo.
- Debe distinguirse de éxito y fallo.

### Diferenciar los estados

| Situación | ¿Se ejecutó la acción? | Interpretación general |
|---|---:|---|
| Éxito | Sí | La acción terminó como se esperaba |
| Fallo | Sí o intento iniciado | La acción no se completó correctamente |
| Inestable | Sí | Hay un resultado que requiere atención |
| Aborto | Puede ser parcial | La ejecución se interrumpió |
| Omitida | No | Una condición evitó ejecutar la etapa |

La tabla es orientativa. Consulta el estado y el log reales de Jenkins.

### Por qué importa el resultado verdadero

El resultado del pipeline puede alimentar:

- Una revisión de cambios.
- Una decisión de aprobación.
- Un job posterior.
- Una notificación.
- Una publicación de artefactos.
- Un informe de calidad.
- Una decisión de despliegue.

Si el pipeline oculta un fallo, los sistemas y las personas que dependen de él pueden tomar decisiones incorrectas.

### Evitar el «verde falso»

Un pipeline verde debería significar que las comprobaciones configuradas pasaron.

Un falso éxito puede aparecer si:

- Se ignora un código de salida.
- Se captura una excepción y no se vuelve a propagar.
- Una prueba se ejecuta, pero su resultado no afecta el estado.
- Una etapa requerida se omite accidentalmente.
- Un script siempre termina con `0`.
- Se imprime un mensaje de éxito después de un fallo.
- Se usa `returnStatus` sin comprobar el valor.

### No convertir cada advertencia en fallo

No todos los mensajes de advertencia deben detener el pipeline.

Define la diferencia entre:

- Error que bloquea el flujo.
- Advertencia informativa.
- Resultado inestable.
- Tarea no esencial.
- Fallo temporal que puede reintentarse.

La decisión debería corresponder al propósito del job.

### Controlar no significa ocultar

Gestionar un error consiste en:

- Detectarlo.
- Clasificarlo.
- Registrar evidencia útil.
- Decidir si es recuperable.
- Cambiar el resultado cuando corresponde.
- Detener pasos dependientes.
- Comunicar qué debe revisarse.

No consiste en capturarlo y fingir que nunca ocurrió.

## Propagación de errores

Jenkins recibe el resultado de los pasos y decide si las etapas siguientes pueden continuar.

### Flujo normal

En condiciones normales, una etapa se ejecuta paso a paso.

Si un paso falla, Jenkins suele marcar la etapa o la ejecución como fallida y detener los pasos que dependen de ese punto.

### Ejemplo de propagación

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                sh 'test -f README.md'
                sh 'bash scripts/validar.sh'
                echo 'Este mensaje aparece si los pasos anteriores pasan.'
            }
        }

        stage('Continuar') {
            steps {
                echo 'Esta etapa depende del resultado de Validar.'
            }
        }
    }
}
```

Si un paso de shell falla, los pasos posteriores de la etapa normalmente no se ejecutan.

Las etapas posteriores pueden no ejecutarse según el flujo y la configuración.

### Primer error frente a errores posteriores

El primer error relevante suele explicar por qué falló el flujo.

Los mensajes posteriores pueden ser consecuencias, no causas.

Por ejemplo:

```text
Archivo de entrada ausente
    |
    +--> script de validación falla
            |
            +--> artefacto no se crea
                    |
                    +--> archivado no encuentra archivos
```

Localiza primero el punto inicial.

### El resultado final no siempre muestra la causa

La interfaz puede resumir la ejecución como `FAILURE`.

Para encontrar la causa, revisa:

- La primera etapa fallida.
- El primer código de salida inesperado.
- El mensaje de excepción.
- La disponibilidad del agente.
- El checkout.
- El paso anterior al fallo.

### Fallos en pasos posteriores

Una acción `post` también puede fallar.

Por ejemplo:

- La notificación no se envía.
- El informe no se publica.
- La limpieza devuelve un error.
- El archivado no encuentra el archivo esperado.

Distingue el fallo original del fallo que ocurrió durante el tratamiento posterior.

### Fallos de infraestructura

Una etapa puede fallar antes de ejecutar los comandos del proyecto.

Comprueba si el fallo sucedió en:

- Lectura del `Jenkinsfile`.
- Checkout de SCM.
- Asignación de agente.
- Inicialización del workspace.
- Descarga de herramientas.
- Comando del proyecto.
- Acción posterior.

### Fallo y dependencia

Si una etapa produce una salida necesaria para otra, la segunda no debería continuar como si la salida existiera.

Haz explícita la dependencia:

```text
Preparar archivo
      |
      v
Validar archivo
      |
      v
Archivar archivo
```

No permitas que el pipeline archive un archivo obsoleto de una ejecución anterior.

## Pasos y códigos de salida

La shell comunica el resultado de un comando mediante un código de salida.

### Código de salida

En muchos comandos Unix:

- `0` significa éxito.
- Un valor distinto de `0` indica un fallo o una condición no satisfecha.

El significado concreto depende del comando.

### Paso `sh`

`sh` ejecuta comandos de shell Unix en el agente.

```groovy
sh 'test -f README.md'
```

Si el archivo existe, `test` suele devolver `0`.

Si no existe, suele devolver un código distinto de `0`.

Jenkins normalmente interpreta ese código distinto de cero como fallo del paso.

### Paso `bat`

`bat` ejecuta comandos de Windows en un agente compatible.

Su comportamiento y los códigos dependen de los comandos de Windows utilizados.

No ejecutes comandos `sh` en un agente Windows salvo que el entorno lo admita.

### Un comando por paso

Los comandos separados facilitan localizar qué instrucción falló:

```groovy
steps {
    sh 'test -f README.md'
    sh 'test -f app/mensaje.txt'
    sh 'bash scripts/validar.sh'
}
```

Si falla una línea, la consola suele identificar el paso correspondiente.

### Varios comandos en una shell

Varios comandos pueden agruparse en una cadena multilínea:

```groovy
sh '''
    echo "Inicio de validación"
    test -f README.md
    bash scripts/validar.sh
'''
```

La shell puede seguir o detenerse según el comportamiento de la shell, las opciones activadas y la forma de invocación.

Comprueba el comportamiento del agente.

### `set -e`

En un script Bash, `set -e` suele hacer que el script termine ante muchos errores.

```bash
set -e
```

La semántica tiene excepciones, sobre todo en condiciones y construcciones de shell.

No lo trates como sustituto de comprender los códigos de salida.

### `set -u`

`set -u` puede hacer que el script falle cuando utiliza variables no definidas.

```bash
set -u
```

Úsalo solo si las variables requeridas están definidas y el script maneja correctamente los casos opcionales.

### `set -o pipefail`

En Bash, `set -o pipefail` hace que una tubería de comandos pueda devolver un fallo si falla uno de sus componentes.

Sin esta opción, una tubería puede reflejar solo el resultado del último comando, según la shell.

Confirma qué shell ejecuta el agente.

### Ejemplo de script robusto

```bash
#!/usr/bin/env bash
set -euo pipefail

test -f README.md
grep -q "Jenkins" README.md
echo "Validación completada."
```

El comportamiento debe probarse localmente y en el agente.

### Usar `returnStatus`

`sh(returnStatus: true, script: 'comando')` devuelve el código de salida en lugar de fallar automáticamente el paso por un código no cero.

Ejemplo:

```groovy
script {
    int codigo = sh(
        returnStatus: true,
        script: 'test -f README.md'
    )

    echo "Código de salida: ${codigo}"
}
```

### Comprobar `returnStatus`

Capturar el código no basta.

Debes decidir qué significa cada resultado:

```groovy
script {
    int codigo = sh(
        returnStatus: true,
        script: 'test -f README.md'
    )

    if (codigo == 0) {
        echo 'README presente.'
    } else {
        error 'No se encontró README.md.'
    }
}
```

Si no compruebas el valor, Jenkins puede terminar la etapa como exitosa aunque el comando haya fallado.

### `returnStdout`

`returnStdout: true` devuelve la salida estándar del comando como texto.

Ejemplo:

```groovy
script {
    def resultado = sh(
        returnStdout: true,
        script: 'printf "laboratorio"'
    ).trim()

    echo "Resultado: ${resultado}"
}
```

Un fallo del comando sigue necesitando tratamiento.

No imprimas la salida si puede contener secretos.

### `returnStdout` y código de salida

`returnStdout` captura la salida estándar.

No significa automáticamente que debas ignorar el código de salida.

Combínalo con un manejo explícito cuando el comando pueda fallar.

### Separar salida estándar y error

Los comandos pueden escribir en:

- Salida estándar.
- Salida de error.
- Ambas.

La consola puede mostrar una mezcla de esos canales.

El diagnóstico debería considerar el mensaje y el código de salida.

### Comando que falla de manera intencional

Para una práctica, puede usarse un código de salida controlado:

```groovy
sh 'exit 1'
```

Utilízalo solo en un job de laboratorio y con una etapa claramente marcada como prueba de fallo.

### No ignorar códigos con `|| true`

Este patrón fuerza que la shell termine con éxito en muchos casos:

```bash
comando || true
```

Puede ser válido para una acción opcional muy concreta.

No lo uses para ocultar fallos de validaciones obligatorias.

Si lo utilizas, registra la razón y controla el error de manera explícita.

### Tuberías de shell

Una tubería como:

```bash
comando_a | comando_b
```

puede ocultar un fallo en `comando_a` si la shell solo comunica el estado del último comando.

En Bash, considera `pipefail` cuando el resultado dependa de todos los componentes.

### Nombres y mensajes de error

Un mensaje debería ayudar a identificar:

- Qué comprobación falló.
- Qué archivo o condición estaba implicado.
- Qué dato seguro revisar.
- Qué paso del pipeline produjo el error.

Evita mensajes que impriman valores sensibles.

## El paso `error`

`error` detiene el pipeline con un mensaje y un resultado de fallo.

### Uso básico

```groovy
error 'Falta el archivo de configuración requerido.'
```

Es apropiado cuando la ejecución no puede continuar de forma segura o útil.

### Validación explícita

```groovy
script {
    if (!fileExists('README.md')) {
        error 'No se encontró README.md en el workspace.'
    }
}
```

`fileExists` comprueba la existencia de un archivo en contextos de Pipeline compatibles.

### Mensaje preciso

Un buen mensaje identifica el problema sin revelar secretos:

```groovy
error 'La validación de estructura falló: falta app/mensaje.txt.'
```

Evita mensajes vagos:

```groovy
error 'Algo salió mal.'
```

### No usar `error` para toda advertencia

Si el problema no bloquea el trabajo, quizá corresponda:

- Registrar una advertencia.
- Marcar la ejecución como inestable.
- Continuar con una etapa independiente.
- Crear un informe de no bloqueo.

La elección debe estar documentada.

## `catchError`

`catchError` permite capturar un fallo dentro de un bloque y configurar cómo afecta al estado del build y de la etapa.

### Uso básico

```groovy
catchError {
    sh 'bash scripts/validar-opcional.sh'
}
```

Si el bloque falla, `catchError` puede permitir que el pipeline continúe y marcar el resultado según sus opciones predeterminadas.

Comprueba el comportamiento en la versión utilizada.

### Configurar el resultado

Ejemplo ilustrativo:

```groovy
catchError(
    buildResult: 'UNSTABLE',
    stageResult: 'FAILURE',
    message: 'Falló una comprobación no bloqueante'
) {
    sh 'bash scripts/validar-opcional.sh'
}
```

Las opciones disponibles y sus efectos dependen de la versión de Pipeline.

### Resultado del build y de la etapa

- `buildResult` afecta al resultado global de la ejecución.
- `stageResult` afecta al resultado asociado a la etapa, cuando la instancia y la visualización lo admiten.
- `message` puede ayudar a explicar la captura.

No configures `SUCCESS` para ocultar un fallo de una comprobación obligatoria.

### Continuar después de una comprobación no bloqueante

```groovy
stage('Comprobación opcional') {
    steps {
        catchError(
            buildResult: 'UNSTABLE',
            stageResult: 'UNSTABLE',
            message: 'La comprobación opcional no pasó'
        ) {
            sh 'bash scripts/comprobacion-opcional.sh'
        }
    }
}
```

La ejecución puede continuar, pero el estado señala que hay un problema.

### Cuándo usar `catchError`

Puede convenir cuando:

- Un análisis es informativo.
- Se quiere ejecutar etapas independientes aunque una falle.
- El equipo acepta continuar con resultado inestable.
- El pipeline necesita recopilar varios resultados.
- El tratamiento del error está definido.

### Cuándo no usar `catchError`

Evítalo si:

- La etapa es un control obligatorio.
- La siguiente acción depende de su salida.
- No se conserva la información del fallo.
- El build termina como exitoso pese a una condición crítica.
- Se usa para evitar investigar un problema.

### `catchError` no es una recuperación automática

Capturar un error no corrige:

- El código.
- La herramienta.
- El archivo.
- La configuración.
- El agente.
- La causa de una prueba fallida.

Debe decidirse qué significa continuar.

## `warnError`

`warnError` permite ejecutar un bloque y tratar un fallo como advertencia, con el comportamiento de resultado que establece el paso en el contexto disponible.

### Uso conceptual

```groovy
warnError('La comprobación informativa falló') {
    sh 'bash scripts/comprobacion-informativa.sh'
}
```

La disponibilidad y el resultado exacto dependen de la versión de Pipeline.

### Cuándo usarlo

Puede ser adecuado si:

- La comprobación no es bloqueante.
- El equipo quiere registrar el fallo.
- El pipeline debe seguir con trabajo independiente.
- El resultado debe mostrar que hay una advertencia.

### Cuándo no usarlo

No lo uses para pruebas obligatorias solo para mantener el pipeline en verde.

Un warning debe seguir siendo visible para quien revisa el resultado.

### Diferencia con un mensaje de consola

Imprimir:

```groovy
echo 'ADVERTENCIA: comprobación pendiente.'
```

no cambia necesariamente el estado del build.

`warnError` tiene un efecto de control de resultado además del mensaje.

Comprueba qué resultado produce en la versión de Jenkins utilizada.

## `retry`

`retry` vuelve a ejecutar un bloque un número limitado de veces si falla.

### Uso básico

```groovy
retry(3) {
    sh 'comando-transitorio'
}
```

La cifra indica el número máximo de intentos del bloque, según la semántica del paso.

Confirma la interpretación exacta de intentos en la versión local.

### Reintentar un fallo temporal

Un reintento puede ser útil para errores transitorios, como:

- Una descarga temporalmente interrumpida.
- Un servicio de prueba momentáneamente ocupado.
- Una conexión inestable.
- Un proceso que puede fallar por una condición temporal conocida.

### No reintentar todo

No reintentes a ciegas:

- Pruebas deterministas fallidas.
- Errores de sintaxis.
- Falta de permisos.
- Configuración incorrecta.
- Credenciales inválidas.
- Operaciones no idempotentes.
- Acciones que pueden duplicarse.

### Reintentos y operaciones no idempotentes

Una operación idempotente puede repetirse sin causar efectos adicionales no deseados.

Si una operación crea recursos o modifica datos, un reintento podría duplicar o corromper efectos.

Antes de añadir `retry`, identifica qué ocurre si el primer intento tuvo éxito parcial.

### Registrar los intentos

Los mensajes deben permitir saber que se está reintentando.

```groovy
retry(3) {
    echo 'Intentando comprobar el servicio de laboratorio.'
    sh 'bash scripts/comprobar-servicio.sh'
}
```

No escribas el mismo mensaje sin contexto si eso dificulta distinguir los intentos.

### Reintentos sin espera

Un reintento inmediato puede repetir el fallo antes de que cambie la condición externa.

El mecanismo de espera y retroceso debe diseñarse de acuerdo con la necesidad y las herramientas disponibles.

No añadas esperas largas en agentes compartidos para una práctica.

### Fallo después del último intento

Si todos los intentos fallan, el bloque normalmente termina fallido.

Registra el número de intentos y el error relevante.

No conviertas el agotamiento de intentos en éxito.

## `timeout`

`timeout` interrumpe un bloque si supera el límite temporal.

### Timeout a nivel de pipeline

```groovy
pipeline {
    agent any

    options {
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {
        stage('Validar') {
            steps {
                echo 'Validación de ejemplo.'
            }
        }
    }
}
```

El alcance incluye el pipeline según las reglas de Jenkins y la asignación de agente.

### Timeout local

```groovy
timeout(time: 2, unit: 'MINUTES') {
    sh 'bash scripts/validar.sh'
}
```

Limita solo el bloque que contiene.

### Timeout y cancelación

Un timeout suele interrumpir la ejecución como una interrupción controlada.

No lo confundas con una prueba que devuelve un fallo normal.

### Manejar un timeout

El pipeline debería:

- Registrar que venció el tiempo.
- Dejar visible el estado real.
- No continuar como si hubiese completado la tarea.
- Liberar recursos de forma segura.
- Notificar solo si el evento requiere acción.

### Límite de tiempo de etapa

Una opción de etapa puede limitar una tarea concreta.

```groovy
stage('Pruebas') {
    options {
        timeout(time: 5, unit: 'MINUTES')
    }

    steps {
        sh 'bash scripts/pruebas.sh'
    }
}
```

Comprueba la sintaxis y el orden en la versión local.

### Timeout demasiado corto

Un límite breve puede:

- Interrumpir una prueba válida.
- Fallar por carga temporal.
- Crear resultados inestables.
- Generar ruido en notificaciones.

### Timeout demasiado largo

Un límite excesivo puede:

- Mantener agentes ocupados.
- Retrasar tareas posteriores.
- Acumular ejecuciones pendientes.
- Demorar el diagnóstico de un proceso bloqueado.

## `unstable`

El paso `unstable` marca el resultado como inestable en contextos de Pipeline compatibles.

### Uso básico

```groovy
unstable 'La comprobación terminó con advertencias.'
```

El resultado no debería describirse como un éxito completo.

### Marcar un resultado inestable después de una condición

```groovy
script {
    if (params.RESULTADO_ESPERADO != 'valido') {
        unstable 'El resultado requiere revisión.'
    }
}
```

Este ejemplo usa un parámetro educativo; valida cualquier entrada externa antes de depender de ella.

### Inestable frente a fallo

Usa `UNSTABLE` cuando el proceso terminó y el resultado debe llamar la atención, pero la política no exige que se detenga como un fallo completo.

Usa `FAILURE` cuando la condición impide aceptar el resultado.

### Criterio de equipo

Documenta qué estados permiten:

- Combinar un cambio.
- Archivar un paquete.
- Iniciar una etapa posterior.
- Enviar una notificación.
- Solicitar una revisión.

No dejes que cada job defina una interpretación distinta sin motivo.

## Manejo en Groovy

El pipeline declarativo permite bloques `script` para lógica que necesita Groovy.

### `try` y `catch`

Un bloque Groovy puede capturar una excepción.

```groovy
script {
    try {
        sh 'bash scripts/comprobacion.sh'
    } catch (err) {
        echo 'La comprobación produjo una excepción.'
        throw err
    }
}
```

Volver a lanzar la excepción conserva el fallo.

### Capturar y continuar

```groovy
script {
    try {
        sh 'bash scripts/comprobacion-opcional.sh'
    } catch (err) {
        echo 'La comprobación opcional falló; se registrará para revisión.'
    }
}
```

Este patrón puede hacer que Jenkins continúe.

Si no se cambia el resultado, la ejecución podría parecer exitosa.

Solo úsalo si el fallo realmente no es bloqueante y se conserva una señal visible.

### Capturar y marcar inestable

```groovy
script {
    try {
        sh 'bash scripts/comprobacion-opcional.sh'
    } catch (err) {
        unstable 'La comprobación opcional no pasó.'
    }
}
```

La disponibilidad y el efecto exacto dependen del contexto.

Comprueba el resultado final del job.

### No capturar indiscriminadamente

Capturar todas las excepciones puede ocultar:

- Fallo de agente.
- Cancelación.
- Timeout.
- Error de infraestructura.
- Fallo que debería detener el pipeline.

Captura solo lo que el flujo puede manejar de forma segura.

### Excepción y mensaje

Un objeto de excepción puede incluir detalles internos.

No imprimas automáticamente todo su contenido en una notificación externa.

Los logs técnicos de Jenkins pueden ser el lugar apropiado, según la política.

### Pipeline CPS

Los pipelines de Jenkins utilizan mecanismos de ejecución reanudable y transformaciones CPS en Groovy.

Eso introduce restricciones para ciertos tipos de código, objetos y llamadas.

Mantén los bloques `script` pequeños y utiliza pasos de Pipeline compatibles.

### No guardar objetos complejos innecesarios

Los datos que deben persistir durante pausas o reinicios pueden necesitar ser serializables.

Evita mantener objetos no serializables en variables que vivan mucho tiempo dentro del pipeline.

Para ejercicios iniciales, utiliza cadenas, números y estructuras simples.

## Interrupciones y cancelaciones

No toda excepción debería capturarse y silenciarse.

### Interrupción de una ejecución

Un timeout o una cancelación puede producir una interrupción.

El pipeline debe respetar la intención de detenerse.

### No ignorar cancelaciones

Evita capturar una excepción de interrupción y continuar como si nada hubiera ocurrido.

Esto puede anular una cancelación intencional o continuar después de un timeout.

### Excepciones de Pipeline

Algunas excepciones de Jenkins representan una interrupción del flujo.

Si un `catch` amplio captura cualquier error, considera si debe volver a propagarse.

### Ejemplo prudente

```groovy
script {
    try {
        sh 'bash scripts/tarea-opcional.sh'
    } catch (err) {
        echo 'La tarea opcional falló; se conserva la información para revisión.'
        throw err
    }
}
```

El ejemplo conserva el fallo.

Si el objetivo es continuar, selecciona explícitamente qué tipos de error se pueden recuperar.

### Cancelación manual

La cancelación manual debería permanecer visible como aborto.

No la conviertas en éxito para que el build se vea verde.

### Reintentos y cancelación

Un bloque de reintento no debería continuar repitiendo una tarea cuando la ejecución ha sido cancelada.

Comprueba que el diseño respeta la interrupción.

## Condiciones `post`

`post` permite gestionar el resultado una vez terminan etapas o el pipeline.

### `success`

```groovy
post {
    success {
        echo 'Las validaciones configuradas pasaron.'
    }
}
```

Usa un mensaje preciso y no más amplio que la evidencia.

### `failure`

```groovy
post {
    failure {
        echo 'El pipeline falló. Consulta la primera etapa fallida.'
    }
}
```

El mensaje debe dirigir al diagnóstico.

### `unstable`

```groovy
post {
    unstable {
        echo 'El resultado es inestable y requiere revisión.'
    }
}
```

No lo presentes como un éxito completo.

### `aborted`

```groovy
post {
    aborted {
        echo 'La ejecución se interrumpió antes de terminar.'
    }
}
```

Un aborto puede deberse a una persona o a un timeout.

### `always`

```groovy
post {
    always {
        echo 'Fin de la ejecución.'
    }
}
```

No supone que se ejecutará frente a cualquier caída abrupta del sistema.

### `unsuccessful`

```groovy
post {
    unsuccessful {
        echo 'La ejecución no terminó con resultado exitoso.'
    }
}
```

Comprueba la disponibilidad y semántica de la condición en la versión instalada.

### Condiciones de cambio

`changed`, `fixed` y `regression` comparan el resultado actual con el historial del job, según la disponibilidad de Jenkins.

Pueden ser útiles para limitar notificaciones repetidas.

No son una comparación directa de cambios de código.

### `cleanup`

`cleanup` puede utilizarse para acciones finales de limpieza en contextos compatibles.

Comprueba el orden y las limitaciones de la versión.

### `post` de etapa

Un `post` dentro de una etapa responde al resultado local de esa etapa.

No significa que el pipeline completo haya terminado con el mismo resultado.

### `post` global

Un `post` a nivel de pipeline resume el resultado final global.

Puede utilizarse para:

- Notificar.
- Registrar una conclusión.
- Publicar resultados generales.
- Hacer una limpieza común.

## Diagnóstico y tratamiento posterior

Un pipeline debe registrar suficiente información para entender qué falló y qué acción se tomó.

### Localizar la primera causa

Empieza por:

1. Identificar el job.
2. Anotar el número de ejecución.
3. Localizar la primera etapa fallida.
4. Leer el comando que falló.
5. Revisar su código de salida.
6. Comprobar el agente.
7. Confirmar los archivos de entrada.
8. Separar fallos de prueba y de infraestructura.

### Primer error relevante

El primer mensaje de error relevante suele ser más útil que el resumen del final.

Busca también mensajes inmediatamente anteriores, que pueden identificar el contexto.

### No interpretar un mensaje aislado

Un mensaje como:

```text
script returned exit code 1
```

indica que el comando devolvió un código no cero.

No explica por sí solo por qué ocurrió.

Revisa la salida del comando y sus entradas.

### Registrar el contexto no sensible

Puede ser útil registrar:

- Nombre de etapa.
- Nombre del job.
- Número de ejecución.
- Rama.
- Commit.
- Agente.
- Ruta relativa.
- Código de salida.
- Duración aproximada.

No registres credenciales ni el entorno completo.

### Informe de diagnóstico

```text
Job:
Ejecución:
Rama:
Commit:
Etapa:
Agente:
Comando o paso:
Código de salida:
Primer mensaje relevante:
Resultado final:
Hipótesis:
Comprobación siguiente:
```

### Diferenciar hipótesis y hechos

Escribe por separado:

- **Observación:** qué muestra la consola.
- **Hipótesis:** qué podría explicar la observación.
- **Próxima comprobación:** qué dato confirmará o descartará la hipótesis.

### Probar en el entorno adecuado

Reproducir localmente puede ayudar, pero no sustituye comprobar:

- Agente.
- Herramientas.
- Permisos.
- Variables.
- Workspace.
- Commit.
- Sistema operativo.

### Cambios controlados

Modifica una sola cosa por prueba, cuando sea posible.

Así se puede asociar la mejora con una causa comprobable.

### No borrar evidencia

No elimines logs o artefactos necesarios para diagnosticar sin autorización.

Conserva la evidencia de acuerdo con la política del curso.

## Fallos recuperables y no recuperables

Un error solo es recuperable si hay una forma segura y verificable de continuar.

### Posibles errores recuperables

Puede ser razonable reintentar si:

- El fallo es conocido como temporal.
- La operación se puede repetir sin efectos dañinos.
- Hay un número máximo de intentos.
- El error queda registrado.
- El resultado final no es falsamente exitoso.

### Posibles errores no recuperables

Normalmente no conviene continuar si:

- Falta un archivo obligatorio.
- Una prueba esencial falla.
- Una credencial es inválida.
- La sintaxis del pipeline es incorrecta.
- No se puede confirmar la revisión de código.
- La operación podría afectar datos incorrectos.
- El agente no es confiable o no está autorizado.

### Dependencias críticas

Si una etapa posterior depende de una salida, una etapa productora fallida debería detenerla o impedir que consuma un archivo obsoleto.

### Acciones opcionales

Si una acción es opcional, documenta:

- Por qué no bloquea.
- Qué resultado se registra.
- Cómo se informa.
- Qué etapas pueden continuar.
- Qué personas revisan la advertencia.

### Recuperación con evidencia

Un pipeline recuperado debería registrar:

- Que hubo un fallo.
- Qué se reintentó.
- Cuántas veces.
- Qué intento tuvo éxito.
- Qué resultado final se obtuvo.

No presentes una recuperación como si nunca hubiera existido un problema.

## Seguridad del manejo de errores

Los mensajes de error pueden revelar datos y las capturas pueden afectar decisiones.

### No exponer secretos

No incluyas en errores:

- Contraseñas.
- Tokens.
- Claves privadas.
- Contenido de archivos de credenciales.
- Variables de entorno completas.
- Valores sensibles de parámetros.

### Mensajes para personas

Un mensaje dirigido al equipo debería orientar la acción.

Ejemplo:

```text
No se encontró app/mensaje.txt en la revisión procesada. Comprueba el commit y la ruta.
```

### Mensajes técnicos

El log técnico puede contener detalles necesarios para diagnóstico.

Aun así, revisa qué datos imprime el comando.

### Entradas no confiables

No incorpores texto de usuario sin validarlo en:

- Comandos.
- Rutas.
- Consultas.
- Mensajes de notificación.
- Nombres de archivos.
- Destinos externos.

### Comandos de limpieza

No utilices un error como excusa para ejecutar una limpieza amplia.

Limita cualquier acción a una ruta conocida y autorizada.

### Credenciales durante una recuperación

Un reintento no debería exponer una credencial a más etapas o más agentes de los necesarios.

Limita el alcance al paso que la necesita.

### Fallo en notificación

Una notificación fallida puede ser un problema secundario.

No muestres credenciales de correo o chat para investigarlo.

Consulta la configuración autorizada.

## Buenas prácticas

### Fallar de forma explícita

Si una condición es esencial, marca el pipeline como fallido cuando no se cumple.

### Mantener un mensaje preciso

Indica la comprobación y la entrada, no una conclusión más amplia que la evidencia.

### Evitar capturas amplias

No captures todas las excepciones solo para seguir con el pipeline.

### Reintentar con criterio

Limita intentos y usa reintentos solo para fallos transitorios conocidos.

### Definir una política de `UNSTABLE`

Alinea el uso de inestabilidad con la política del equipo.

### Distinguir aborto y fallo

Una ejecución cancelada no es necesariamente un defecto del código.

### Probar tanto éxito como fallo

Un pipeline que nunca se prueba con una condición fallida puede reportar éxito por una ruta mal diseñada.

### Conservar la causa original

Una acción `post` no debería reemplazar la causa inicial por un error secundario menos informativo.

### Evitar los falsos éxitos

Comprueba códigos de salida, resultados de pruebas y condiciones de etapas.

### Usar logs con moderación

Los mensajes deben ser útiles y seguros.

### Definir los resultados esperados

Documenta qué significan:

- `SUCCESS`.
- `FAILURE`.
- `UNSTABLE`.
- `ABORTED`.
- Etapa omitida.

### Revisar los cambios del pipeline

Un cambio en el control de errores puede alterar la política de aceptación del proyecto.

Trátalo como una modificación funcional.

## Sesiones prácticas para alumnos

Las sesiones siguientes utilizan fallos controlados en un proyecto de laboratorio.

### Preparación general

Antes de practicar:

- Utiliza el job autorizado.
- Confirma el agente.
- No uses credenciales.
- Asegúrate de que el fallo sea reversible.
- No provoques errores en jobs de otras personas.
- Anota número de ejecución y resultado.
- Restaura los archivos modificados al acabar.

### Proyecto de práctica

Estructura sugerida:

```text
control-errores/
├── Jenkinsfile
├── README.md
├── app/
│   └── mensaje.txt
└── scripts/
    └── validar.sh
```

### Crear el archivo de entrada

```bash
mkdir -p app scripts
printf 'Práctica de control de errores en Jenkins\n' > app/mensaje.txt
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
  echo "OK: se encontró el texto esperado"
else
  echo "ERROR: no se encontró el texto esperado"
  exit 1
fi
EOF
```

### Prueba local inicial

```bash
bash scripts/validar.sh
```

La salida esperada indica que se encontró el texto.

### Sesión 1: leer un fallo en la consola

**Objetivo:** relacionar un mensaje, un comando y un resultado.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobación controlada') {
            steps {
                sh 'exit 1'
            }
        }

        stage('No debería ejecutarse') {
            steps {
                echo 'Este mensaje no debería aparecer en el flujo normal.'
            }
        }
    }
}
```

#### Instrucciones

1. Revisa que `exit 1` sea intencional.
2. Ejecuta solo en el job de laboratorio.
3. Abre la consola.
4. Localiza el paso fallido.
5. Registra el estado final.
6. Comprueba si la segunda etapa se ejecutó.
7. No uses este patrón en un pipeline real como validación de éxito.

#### Registro

```text
Job:
Ejecución:
Etapa que falla:
Comando:
Código de salida esperado:
Resultado final:
¿Se ejecutó la segunda etapa?:
```

#### Preguntas

- ¿Qué indica `exit 1`?
- ¿El fallo demuestra un defecto de Jenkins?
- ¿Cuál es el primer mensaje útil de la consola?

### Sesión 2: comprobar una ruta inexistente

**Objetivo:** observar cómo una validación de archivos falla.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar archivo') {
            steps {
                sh 'test -f archivo-que-no-existe.txt'
                echo 'Esta línea solo aparece si la comprobación pasa.'
            }
        }
    }

    post {
        failure {
            echo 'No se encontró el archivo esperado.'
        }
    }
}
```

#### Instrucciones

1. Predice el resultado.
2. Ejecuta el pipeline.
3. Comprueba si aparece el `echo` posterior a `test`.
4. Revisa la condición `failure`.
5. Anota el mensaje exacto del log.

### Sesión 3: provocar y corregir un fallo de script

**Objetivo:** distinguir fallo del contenido y fallo del pipeline.

#### Paso A: estado válido

Ejecuta:

```bash
bash scripts/validar.sh
```

Confirma el mensaje de éxito.

#### Paso B: contenido inválido

```bash
printf 'Práctica sin texto esperado\n' > app/mensaje.txt
```

Ejecuta otra vez:

```bash
bash scripts/validar.sh
```

Registra:

- El mensaje.
- El código de salida.
- La condición que falló.

#### Paso C: restaurar

```bash
printf 'Práctica de control de errores en Jenkins\n' > app/mensaje.txt
```

Vuelve a ejecutar y comprueba el éxito.

### Sesión 4: capturar el código con `returnStatus`

**Objetivo:** comprobar el resultado sin fallar inmediatamente el paso.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar con returnStatus') {
            steps {
                script {
                    int codigo = sh(
                        returnStatus: true,
                        script: 'test -f archivo-que-no-existe.txt'
                    )

                    echo "Código observado: ${codigo}"

                    if (codigo != 0) {
                        error 'La validación de archivo falló.'
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Predice el código devuelto.
2. Ejecuta el pipeline.
3. Comprueba el mensaje `Código observado`.
4. Identifica dónde se convierte el resultado en fallo.
5. Cambia la ruta a un archivo existente.
6. Ejecuta de nuevo.
7. Compara los resultados.

#### Preguntas

- ¿Qué cambiaría si se eliminara el `if`?
- ¿Por qué `returnStatus` requiere revisar el valor?
- ¿Qué resultado final debe tener la ruta con archivo ausente?

### Sesión 5: diferenciar salida y código de salida

**Objetivo:** entender que un mensaje de consola no demuestra éxito.

#### Pipeline para revisar

```groovy
pipeline {
    agent any

    stages {
        stage('Salida engañosa') {
            steps {
                sh 'echo "El comando terminó bien"; exit 1'
            }
        }
    }
}
```

#### Instrucciones

1. Lee el comando completo antes de ejecutarlo.
2. Predice qué texto se imprimirá.
3. Predice el código final.
4. Ejecuta en el job de laboratorio.
5. Compara mensaje y resultado.

#### Reflexión

Un comando puede imprimir un mensaje optimista y terminar con error.

El código de salida y el resultado de Jenkins también deben revisarse.

### Sesión 6: usar `error` para una regla explícita

**Objetivo:** detener el pipeline con un mensaje claro.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Validar configuración') {
            steps {
                script {
                    def archivo = 'app/mensaje.txt'

                    if (!fileExists(archivo)) {
                        error "Falta el archivo requerido: ${archivo}"
                    }

                    echo 'El archivo requerido está presente.'
                }
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta con el archivo presente.
2. Mueve temporalmente el archivo en el proyecto de práctica.
3. Ejecuta de nuevo.
4. Identifica el mensaje de `error`.
5. Restaura el archivo.
6. Evita borrar archivos del repositorio compartido.

### Sesión 7: manejar una tarea opcional con `catchError`

**Objetivo:** continuar con resultado visible después de una comprobación no bloqueante.

#### Pipeline ilustrativo

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobación opcional') {
            steps {
                catchError(
                    buildResult: 'UNSTABLE',
                    stageResult: 'UNSTABLE',
                    message: 'Falló una comprobación informativa'
                ) {
                    sh 'test -f informe-opcional.txt'
                }

                echo 'El flujo llega después de la comprobación opcional.'
            }
        }

        stage('Resumen') {
            steps {
                echo 'Etapa de resumen.'
            }
        }
    }
}
```

#### Instrucciones

1. Comprueba que el archivo opcional no existe.
2. Predice si el pipeline continuará.
3. Ejecuta el ejemplo.
4. Revisa el estado global.
5. Comprueba si la etapa se marcó como inestable.
6. Explica por qué esta práctica no debe copiarse a una prueba obligatoria.

### Sesión 8: comparar `catchError` y fallo normal

**Objetivo:** comprender la diferencia entre dejar propagar un error y capturarlo.

#### Caso A

```groovy
sh 'test -f informe-opcional.txt'
```

#### Caso B

```groovy
catchError(buildResult: 'UNSTABLE') {
    sh 'test -f informe-opcional.txt'
}
```

#### Actividad

1. Ejecuta cada caso en una ejecución separada.
2. Registra el resultado.
3. Observa las etapas posteriores.
4. Determina qué información se conserva.
5. Explica qué caso sería apropiado para un archivo obligatorio.

### Sesión 9: experimentar con `warnError`

**Objetivo:** observar el tratamiento de una comprobación informativa.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Advertencia de práctica') {
            steps {
                warnError('Falló una comprobación no bloqueante') {
                    sh 'test -f comprobacion-opcional.txt'
                }

                echo 'La etapa continúa para completar el resumen.'
            }
        }
    }
}
```

#### Instrucciones

1. Confirma que el archivo opcional no existe.
2. Ejecuta la práctica.
3. Revisa el mensaje.
4. Revisa el estado final.
5. Comprueba la disponibilidad del paso en la instancia.
6. No lo uses para silenciar una prueba obligatoria.

### Sesión 10: reintentar una comprobación controlada

**Objetivo:** observar el límite de intentos sin usar servicios externos.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Reintento de práctica') {
            steps {
                retry(2) {
                    echo 'Se ejecuta el bloque de práctica.'
                    sh 'test -f README.md'
                }
            }
        }
    }
}
```

El ejemplo debería pasar si existe `README.md`.

#### Instrucciones

1. Ejecuta con el archivo presente.
2. Comprueba cuántas veces se ejecutó el bloque.
3. Revisa la consola.
4. Explica cuándo se repetiría.
5. No añadas un fallo aleatorio al pipeline compartido.

### Sesión 11: reintento fallido de forma segura

**Objetivo:** reconocer qué ocurre cuando se agotan los intentos.

#### Preparación

Utiliza una ruta inexistente en un job aislado de laboratorio.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Reintento fallido') {
            steps {
                retry(2) {
                    sh 'test -f archivo-inexistente.txt'
                }
            }
        }
    }
}
```

#### Instrucciones

1. Lee el bloque.
2. Predice el resultado.
3. Ejecuta una vez.
4. Cuenta los intentos que muestra Jenkins.
5. Registra el resultado final.
6. Explica por qué el pipeline no debería tratarlo como éxito.

### Sesión 12: limitar una operación con `timeout`

**Objetivo:** usar un límite breve y seguro.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Bloque con límite') {
            steps {
                timeout(time: 15, unit: 'SECONDS') {
                    echo 'La tarea comienza.'
                    sleep time: 2, unit: 'SECONDS'
                    echo 'La tarea terminó antes del límite.'
                }
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta el ejemplo.
2. Confirma que termina normalmente.
3. Anota el resultado.
4. No aumentes el tiempo para bloquear un agente.
5. Explica qué tipo de problema puede detectar un timeout.

### Sesión 13: registrar un fallo en `post`

**Objetivo:** comunicar el resultado sin ocultarlo.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Validación') {
            steps {
                sh 'test -f archivo-inexistente.txt'
            }
        }
    }

    post {
        success {
            echo 'Las validaciones configuradas pasaron.'
        }

        failure {
            echo 'La validación falló. Revisa la primera causa en consola.'
        }

        aborted {
            echo 'La ejecución fue interrumpida.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

#### Instrucciones

1. Ejecuta el ejemplo con el archivo ausente.
2. Registra los mensajes.
3. Cancela otra ejecución de laboratorio, si el docente lo autoriza.
4. Compara `failure` y `aborted`.
5. Explica por qué `always` no indica éxito.

### Sesión 14: diferenciar fallo original y fallo posterior

**Objetivo:** localizar el primer error y los errores de `post`.

#### Escenario

Una validación falla y el archivado posterior no encuentra archivos.

#### Actividad

1. Identifica el fallo inicial.
2. Localiza el fallo del archivado.
3. Determina si el segundo fallo es consecuencia del primero.
4. Propón una condición para archivar solo si el archivo existe.
5. No cambies el resultado a éxito para silenciar mensajes.

### Sesión 15: construir un resumen de diagnóstico

**Objetivo:** registrar información útil y no sensible.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar') {
            steps {
                sh 'test -f README.md'
            }
        }
    }

    post {
        always {
            echo "Job: ${env.JOB_NAME}"
            echo "Ejecución: ${env.BUILD_NUMBER}"
            echo "Resultado: ${currentBuild.currentResult}"
        }

        failure {
            echo 'Acción: revisar la primera etapa fallida.'
        }
    }
}
```

#### Instrucciones

1. Ejecuta con un archivo presente.
2. Ejecuta con una comprobación que falle.
3. Registra job, número y resultado.
4. Comprueba que no se imprimen credenciales.
5. Explica qué otros datos serían útiles.

### Sesión 16: clasificar errores por causa

**Objetivo:** diferenciar código, configuración e infraestructura.

#### Casos

- El script encuentra contenido incorrecto.
- El agente no tiene Bash.
- La URL SCM es incorrecta.
- Una etiqueta no existe.
- El archivo no está en el commit.
- Una prueba devuelve código no cero.
- El controlador pierde conexión con un agente.
- El tiempo límite vence.

#### Actividad

Clasifica cada caso:

```text
Código:
Configuración:
SCM:
Agente o infraestructura:
Interrupción:
Timeout:
```

Puede haber más de una categoría relevante en un mismo incidente.

### Sesión 17: diagnosticar una ejecución fallida

**Objetivo:** aplicar un proceso ordenado.

#### Pasos

1. Anota job y número.
2. Localiza la primera etapa fallida.
3. Copia el mensaje relevante sin secretos.
4. Identifica el comando.
5. Comprueba el código de salida.
6. Verifica rama y commit.
7. Comprueba el agente.
8. Formula una hipótesis.
9. Propón una comprobación siguiente.
10. Registra la solución tras verificarla.

#### Informe

```text
Job:
Ejecución:
Rama:
Commit:
Etapa:
Agente:
Mensaje:
Código de salida:
Observación:
Hipótesis:
Comprobación:
Resultado:
```

### Sesión 18: revisar un pipeline que oculta fallos

**Objetivo:** detectar patrones que pueden producir un falso éxito.

#### Fragmento A

```groovy
sh 'bash scripts/validar.sh || true'
```

#### Fragmento B

```groovy
script {
    try {
        sh 'bash scripts/validar.sh'
    } catch (err) {
        echo 'Se ignora el error.'
    }
}
```

#### Fragmento C

```groovy
script {
    int codigo = sh(
        returnStatus: true,
        script: 'bash scripts/validar.sh'
    )

    echo "Código: ${codigo}"
}
```

#### Actividad

Para cada fragmento:

1. Indica si el fallo se conserva.
2. Explica qué resultado podría mostrar Jenkins.
3. Propón una forma de mantener visible el problema.
4. Señala si el patrón es aceptable para una comprobación obligatoria.

### Sesión 19: revisar manejo de errores por parejas

**Objetivo:** identificar controles excesivos y controles insuficientes.

#### Revisión

Comprueba:

- ¿Se capturan excepciones sin repropagarlas?
- ¿Se reintentan operaciones no idempotentes?
- ¿Los timeouts son razonables?
- ¿Una etapa esencial puede convertirse en inestable?
- ¿Hay mensajes de éxito después de errores?
- ¿Se detectan códigos no cero?
- ¿Los errores de `post` ocultan la causa original?
- ¿Se comparten datos sensibles?

#### Resultado

Entrega:

- Una práctica correcta.
- Un riesgo.
- Una mejora.
- Una prueba que añadirías.

### Sesión 20: construir un pipeline integrador

**Objetivo:** validar un archivo y tratar una comprobación opcional de manera visible.

#### Jenkinsfile

```groovy
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 10, unit: 'MINUTES')
    }

    stages {
        stage('Comprobar estructura') {
            steps {
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Validación obligatoria') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }

        stage('Comprobación opcional') {
            steps {
                catchError(
                    buildResult: 'UNSTABLE',
                    stageResult: 'UNSTABLE',
                    message: 'No se encontró el informe opcional'
                ) {
                    sh 'test -f salida/informe.txt'
                }

                echo 'El resumen se ejecutó después de la comprobación opcional.'
            }
        }
    }

    post {
        success {
            echo 'Las comprobaciones obligatorias terminaron correctamente.'
        }

        unstable {
            echo 'La ejecución requiere revisar una comprobación opcional.'
        }

        failure {
            echo 'Falló una condición obligatoria o una etapa crítica.'
        }

        aborted {
            echo 'La ejecución se interrumpió.'
        }

        always {
            echo 'Fin del pipeline integrador.'
        }
    }
}
```

#### Antes de ejecutarlo

Comprueba:

- Que las rutas corresponden al proyecto.
- Que el agente admite `sh`.
- Que `catchError` está disponible.
- Que se comprende la diferencia entre fallo e inestabilidad.
- Que el archivo opcional es realmente no bloqueante.
- Que la ejecución se hace en el job de laboratorio.

#### Pruebas

Ejecuta con:

- Entradas obligatorias presentes.
- Una entrada obligatoria ausente, en una rama de práctica.
- Informe opcional ausente.
- Informe opcional presente, si el curso lo permite.

#### Registro

```text
Caso:
Etapa afectada:
Resultado de etapa:
Resultado global:
Mensajes de post:
Comportamiento esperado:
Comportamiento observado:
```

## Plantillas de diagnóstico

Las plantillas ayudan a investigar sin compartir datos innecesarios.

### Informe de fallo

```text
Job:
Número de ejecución:
Rama:
Commit:
Agente:
Etapa:
Primer error:
Código de salida:
Resultado final:
Hipótesis:
Próxima comprobación:
```

### Informe de timeout

```text
Job:
Ejecución:
Etapa o bloque:
Límite configurado:
Duración observada:
Agente:
Último mensaje:
Resultado:
Recursos posiblemente retenidos:
Acción segura:
```

### Informe de reintentos

```text
Job:
Ejecución:
Operación reintentada:
Número máximo de intentos:
Intentos observados:
Causa temporal esperada:
Resultado del último intento:
¿La operación es idempotente?:
```

### Informe de fallo en `post`

```text
Resultado principal:
Fallo inicial:
Acción post que falló:
Mensaje de la acción post:
¿El error post ocultó la causa?:
Notificación afectada:
Próxima comprobación:
```

## Checklist de control de errores

### Diseño

- [ ] Las validaciones obligatorias fallan si no se cumplen.
- [ ] Las comprobaciones opcionales están identificadas.
- [ ] Los resultados inestables tienen una política.
- [ ] Los errores recuperables están definidos.
- [ ] Las dependencias entre etapas son explícitas.

### Códigos de salida

- [ ] Se comprueba el resultado de cada comando relevante.
- [ ] `returnStatus` tiene una decisión explícita.
- [ ] Las tuberías de shell no ocultan errores.
- [ ] No se usa `|| true` en controles obligatorios.
- [ ] Los scripts devuelven códigos adecuados.

### Reintentos y límites

- [ ] `retry` tiene un número limitado de intentos.
- [ ] La operación puede repetirse sin daño.
- [ ] Se registran los intentos.
- [ ] El timeout es razonable.
- [ ] Un timeout no se trata como éxito.
- [ ] La cancelación se respeta.

### Captura de excepciones

- [ ] Los bloques `catch` tienen un propósito.
- [ ] No se capturan interrupciones de forma indiscriminada.
- [ ] Los fallos críticos se vuelven a propagar.
- [ ] Una continuación queda marcada como inestable si corresponde.
- [ ] No se imprime información sensible.

### Acciones posteriores

- [ ] `post` distingue éxito, fallo, aborto e inestabilidad.
- [ ] Los mensajes describen el alcance correcto.
- [ ] Una acción `post` fallida no esconde el error original.
- [ ] La limpieza está limitada al workspace.
- [ ] Los artefactos se archivan antes de limpiar.

### Seguridad

- [ ] No se registran credenciales.
- [ ] Los parámetros se validan.
- [ ] Las rutas se limitan al entorno autorizado.
- [ ] Los fallos no desencadenan comandos destructivos.
- [ ] Las notificaciones no incluyen datos sensibles.
- [ ] Los logs se revisan antes de compartirlos.

## Errores de diseño frecuentes

### Forzar éxito con `|| true`

Puede ocultar un error que debería detener el pipeline.

### Usar `returnStatus` sin revisar el valor

El código de salida queda disponible, pero nadie decide qué significa.

### Capturar todas las excepciones

Puede tragarse errores de agente, timeout o cancelación.

### Reintentar una operación que duplica efectos

Un reintento puede crear recursos duplicados o repetir una acción irreversible.

### Reintentar una prueba determinista

Si el mismo código y entradas producen el mismo fallo, repetirlo no resuelve la causa.

### Timeout arbitrario

Un límite demasiado corto genera falsos fallos; uno demasiado largo mantiene recursos bloqueados.

### Convertir fallos obligatorios en advertencias

El pipeline puede mostrar una apariencia de éxito mientras una condición esencial no pasó.

### Mensajes genéricos

Un `Algo falló` no identifica qué revisar.

### Confundir `post always` con garantía absoluta

Una caída externa puede impedir que se ejecuten acciones posteriores.

### Ocultar el primer error

Un mensaje posterior puede distraer del fallo que inició la cadena.

### Archivar salidas incompletas

Un artefacto residual puede parecer válido si no se comprueba que pertenece a la ejecución actual.

### Limpiar antes de preservar evidencia

Borrar archivos antes de archivarlos puede eliminar resultados necesarios para el diagnóstico.

## Ejercicios de repaso

1. ¿Qué representa un código de salida no cero?
2. ¿Qué hace `sh(returnStatus: true, ...)`?
3. ¿Por qué debe comprobarse el valor que devuelve `returnStatus`?
4. ¿Qué diferencia hay entre `FAILURE` y `UNSTABLE`?
5. ¿Qué puede causar `ABORTED`?
6. ¿Qué hace `error`?
7. ¿Qué comportamiento permite `catchError`?
8. ¿Qué diferencia hay entre `catchError` y un `try/catch` Groovy?
9. ¿Cuándo puede ser apropiado `warnError`?
10. ¿Qué hace `retry`?
11. ¿Qué significa que una operación sea idempotente?
12. ¿Qué controla `timeout`?
13. ¿Por qué no se debe considerar el timeout como éxito?
14. ¿Qué riesgos tiene capturar todas las excepciones?
15. ¿Qué indica `post { failure { ... } }`?
16. ¿Por qué un paso de `post` puede fallar?
17. ¿Qué información incluirías en un diagnóstico?
18. ¿Por qué no se deben imprimir variables de entorno completas?
19. ¿Qué problema puede causar `|| true`?
20. ¿Cómo comprobarías que un fallo controlado realmente afecta el resultado del pipeline?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Un código de salida `0` suele indicar éxito para muchos comandos».

### Afirmación 2

«`returnStatus` hace que el pipeline falle automáticamente con cualquier código distinto de cero».

### Afirmación 3

«Un `returnStatus` capturado debe comprobarse explícitamente».

### Afirmación 4

«`error` puede detener el pipeline con un mensaje».

### Afirmación 5

«`catchError` puede permitir que el flujo continúe y cambiar el resultado del build».

### Afirmación 6

«Capturar una excepción significa que el problema ya está corregido».

### Afirmación 7

«`retry` es apropiado para cualquier operación fallida».

### Afirmación 8

«Un timeout puede interrumpir una ejecución».

### Afirmación 9

«Una cancelación manual siempre equivale a un fallo del código».

### Afirmación 10

«`post` puede comunicar el estado final».

### Afirmación 11

«Un mensaje de éxito puede ser incorrecto aunque Jenkins marque el build como exitoso».

### Afirmación 12

«Una tubería de shell puede ocultar un fallo de un comando anterior».

### Afirmación 13

«Una operación no idempotente puede producir efectos adicionales si se reintenta».

### Afirmación 14

«Un fallo de notificación puede ser distinto del fallo original del pipeline».

### Afirmación 15

«Una etapa omitida demuestra que sus pruebas pasaron».

## Respuestas orientativas

### Afirmación 1

**Correcta.** Es una convención común, aunque depende del comando.

### Afirmación 2

**Incorrecta.** Devuelve el código; el pipeline debe gestionarlo.

### Afirmación 3

**Correcta.** Sin comprobarlo, podría ocultarse el fallo.

### Afirmación 4

**Correcta.** `error` genera un fallo con un mensaje.

### Afirmación 5

**Correcta.** El efecto depende de las opciones utilizadas.

### Afirmación 6

**Incorrecta.** Capturar un error solo cambia cómo se propaga; no corrige la causa.

### Afirmación 7

**Incorrecta.** Reintentar indiscriminadamente puede ocultar causas o duplicar efectos.

### Afirmación 8

**Correcta.** Limita el tiempo permitido para un bloque o ejecución.

### Afirmación 9

**Incorrecta.** Una cancelación es una interrupción, no necesariamente un defecto del código.

### Afirmación 10

**Correcta.** `post` puede reaccionar al resultado.

### Afirmación 11

**Correcta.** Un texto puede ser engañoso si no describe el resultado real.

### Afirmación 12

**Correcta.** El estado de una tubería depende de la shell y su configuración.

### Afirmación 13

**Correcta.** Repetir una operación puede duplicar efectos.

### Afirmación 14

**Correcta.** Por ejemplo, una prueba puede fallar y además fallar el correo.

### Afirmación 15

**Incorrecta.** Una etapa omitida no se ejecutó necesariamente.

## Glosario

- **Aborto:** interrupción de una ejecución antes de finalizar normalmente.
- **Código de salida:** valor devuelto por un comando para indicar su resultado.
- **Error:** condición que impide completar una acción como se esperaba.
- **Excepción:** evento que interrumpe el flujo normal de ejecución.
- **Fallo recuperable:** problema que puede volver a intentarse de forma segura.
- **Fallo no recuperable:** problema que requiere detener el flujo.
- **Inestable:** resultado que terminó, pero requiere atención.
- **Idempotente:** operación que puede repetirse sin añadir efectos no deseados.
- **`catchError`:** paso que captura errores y permite configurar su impacto en el resultado.
- **`error`:** paso que detiene el pipeline con un mensaje.
- **`returnStatus`:** opción de `sh` que devuelve el código de salida en lugar de fallar automáticamente el paso.
- **`retry`:** paso que repite un bloque un número limitado de veces.
- **`timeout`:** límite temporal para una ejecución o bloque.
- **`unstable`:** paso que puede marcar el resultado como inestable.
- **`warnError`:** paso para tratar un fallo como advertencia, según el contexto y la versión.
- **`post`:** bloque de acciones posteriores condicionado por el resultado.
- **Propagación:** transmisión de un fallo desde un paso hacia las etapas o la ejecución.
- **Falso éxito:** resultado exitoso que oculta una comprobación fallida o no ejecutada.
- **Etapa omitida:** etapa que no se ejecutó, por ejemplo por una condición.
- **Trazabilidad:** capacidad de relacionar resultado, etapa, agente, revisión y evidencia.

## Síntesis final

El control de errores permite que Jenkins distinga entre éxito, fallo, inestabilidad, aborto y etapas omitidas.

- Comprueba códigos de salida y resultados de pruebas.
- Usa `error` para detener el flujo ante una condición esencial.
- Usa `returnStatus` solo si vas a interpretar el código.
- Usa `catchError` o `warnError` únicamente cuando continuar sea una decisión consciente.
- Reintenta solo fallos transitorios y operaciones seguras para repetir.
- Limita procesos con `timeout`, pero no conviertas el timeout en éxito.
- Respeta cancelaciones e interrupciones.
- Utiliza `post` para comunicar el resultado real.
- Conserva la causa original cuando una acción posterior también falla.
- Registra evidencia suficiente sin exponer secretos.