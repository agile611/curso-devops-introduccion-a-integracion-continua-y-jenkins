# El bloque `script` en Jenkins

El bloque `script` permite incluir lógica Groovy con estilo Scripted dentro de un pipeline declarativo. Sirve para casos en los que la estructura declarativa no basta: calcular un valor, tomar una decisión, procesar una respuesta o construir una lógica pequeña con condiciones y bucles.

`script` no es una shell ni un lugar para poner todo el pipeline. El código que contiene se ejecuta en el contexto de Pipeline de Jenkins, con sus reglas de seguridad, persistencia y reanudación. Para comandos del sistema se utilizan pasos como `sh` o `bat`; para lógica de flujo se usa Groovy. Esta unidad explica esa diferencia, muestra patrones habituales y propone sesiones de laboratorio progresivas.

> **Uso seguro:** practica en un job de laboratorio. Revisa cualquier código Groovy antes de ejecutarlo, especialmente si procede de una rama que no controlas. No guardes secretos en variables normales ni los imprimas en consola. Mantén los bloques `script` pequeños y prefiere la sintaxis declarativa cuando sea suficiente.

## Fundamentos de `script`

El bloque `script` es una frontera explícita entre la estructura declarativa y la lógica Groovy más flexible.

### Pipeline declarativo y Groovy

Un `Jenkinsfile` declarativo utiliza una estructura reconocible:

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                echo 'Validación de laboratorio.'
            }
        }
    }
}
```

Dentro de esta estructura se usan directivas y pasos de Pipeline.

Groovy es el lenguaje en el que se basa Jenkins Pipeline.

Algunos pasos declarativos permiten utilizar Groovy directamente.

### Para qué sirve `script`

`script` permite escribir lógica Groovy dentro de una sección declarativa que contiene pasos.

Puede ser útil para:

- Evaluar una condición calculada.
- Elegir entre acciones.
- Construir una cadena sencilla.
- Recorrer una lista pequeña.
- Interpretar el resultado de un paso.
- Consultar parámetros.
- Guardar un valor temporal.
- Llamar a pasos de Pipeline desde una estructura Groovy.

### Qué no hace `script`

`script` no:

- Convierte el pipeline declarativo en una aplicación Groovy independiente.
- Ejecuta un comando de shell por sí mismo.
- Elimina las reglas de seguridad de Jenkins.
- Evita la necesidad de validar entradas.
- Convierte un pipeline en una ejecución más rápida.
- Sustituye automáticamente a `steps`.
- Hace persistentes todas las variables.
- Permite llamar sin límites a cualquier biblioteca Java o Groovy.

### `script` no es `sh`

Este bloque ejecuta Groovy:

```groovy
script {
    def saludo = 'Hola desde Groovy'
    echo saludo
}
```

Este bloque ejecuta una shell Unix:

```groovy
sh 'echo "Hola desde la shell"'
```

Ambos pueden aparecer dentro de `steps`, pero los interpreta un componente distinto.

### Qué interpreta cada línea

En:

```groovy
echo "Resultado: ${env.BUILD_NUMBER}"
```

Groovy evalúa la expresión y el paso `echo` muestra el resultado.

En:

```groovy
sh 'echo "$BUILD_NUMBER"'
```

Groovy entrega la cadena al paso `sh`.

La shell del agente interpreta `$BUILD_NUMBER`.

La diferencia es importante al manejar comillas y datos de usuario.

### Ejemplo mínimo con `script`

```groovy
pipeline {
    agent any

    stages {
        stage('Lógica Groovy') {
            steps {
                script {
                    def resultado = 'correcto'
                    echo "Resultado calculado: ${resultado}"
                }
            }
        }
    }
}
```

`def` declara una variable local de Groovy en ese ámbito.

`echo` es un paso de Jenkins Pipeline.

### Un `script` no necesita ser largo

Un uso puntual puede quedar así:

```groovy
script {
    if (params.MODO == 'detallado') {
        echo 'Se seleccionó el modo detallado.'
    }
}
```

Si el bloque crece mucho, conviene revisar si se puede simplificar, dividir o mover a un script o biblioteca compartida.

## Cuándo utilizar `script`

La decisión de usar `script` debería basarse en una necesidad real.

### Lógica que puede necesitar `script`

Puede ser razonable cuando se necesita:

- Una decisión basada en varios valores.
- Una variable calculada en tiempo de ejecución.
- Una iteración pequeña sobre una lista.
- Procesamiento de una respuesta de `input`.
- Lectura de un código de salida y selección de una acción.
- Una llamada condicional a un paso de Pipeline.
- Un bloque `try/catch` limitado y justificado.

### Lógica que no suele necesitar `script`

No suele ser necesario para:

- Mostrar un mensaje fijo.
- Ejecutar un comando con `sh`.
- Archivar un archivo.
- Definir una variable de entorno.
- Declarar una etapa.
- Aplicar una condición simple con `when`.
- Definir una opción normal del pipeline.
- Ejecutar un único paso de Pipeline.

### Ejemplo sin `script`

```groovy
steps {
    echo 'Iniciando validación.'
    sh 'test -f README.md'
}
```

No hace falta envolver estos pasos en `script`.

### Ejemplo con `script`

```groovy
steps {
    script {
        if (params.MODO == 'detallado') {
            echo 'Se realizarán comprobaciones adicionales.'
        } else {
            echo 'Se utilizará el modo normal.'
        }
    }
}
```

La condición se expresa como lógica Groovy.

### Preferir `when` para condiciones de etapa

Si la decisión consiste en ejecutar o no una etapa, `when` puede ser más claro.

```groovy
stage('Comprobación detallada') {
    when {
        expression {
            return params.MODO == 'detallado'
        }
    }

    steps {
        echo 'Etapa detallada ejecutada.'
    }
}
```

Un `script` dentro de `steps` puede tomar una decisión dentro de la etapa.

`when` expresa que la etapa completa es condicional.

### Preferir directivas declarativas

Antes de usar Groovy, comprueba si existe una forma declarativa para el propósito:

- `environment` para variables de entorno.
- `parameters` para entradas iniciales.
- `when` para condiciones de etapa.
- `post` para acciones posteriores.
- `options` para opciones del pipeline.
- `parallel` para etapas paralelas.
- `tools` para herramientas configuradas.

La sintaxis declarativa suele ser más fácil de revisar y validar.

## Ubicación y estructura

`script` aparece dentro de una sección que admite pasos.

### Forma habitual

```groovy
stage('Decisión') {
    steps {
        script {
            // Lógica Groovy
        }
    }
}
```

La jerarquía es:

```text
pipeline
  stages
    stage
      steps
        script
```

### No usar `script` como bloque raíz

Un pipeline declarativo debe conservar su estructura declarativa.

No escribas un `script` directamente dentro de `pipeline` como si reemplazara a `stages`.

### Bloque `script` y pasos

Dentro de `script`, se pueden llamar pasos de Pipeline en contextos compatibles.

Ejemplo:

```groovy
script {
    echo 'Mensaje desde un bloque Groovy.'
    sh 'pwd'
}
```

`echo` y `sh` siguen siendo pasos de Jenkins, no métodos arbitrarios del sistema operativo.

### Delimitación de llaves

Cada bloque requiere las llaves correspondientes.

```groovy
script {
    if (condicion) {
        echo 'La condición se cumple.'
    }
}
```

Las llaves de `if` se cierran antes que la llave de `script`.

### Sangría

La sangría no reemplaza las llaves, pero ayuda a leer el anidamiento.

Usa una convención consistente.

Alinea bloques relacionados.

Revisa especialmente los cierres después de `if`, `else`, bucles y `try/catch`.

### Comentarios

Un comentario puede explicar por qué hace falta lógica Groovy:

```groovy
// Se normaliza el valor antes de seleccionar la validación.
```

No uses comentarios para describir cada línea de forma redundante.

### Bloques `script` pequeños

Prefiere varios bloques pequeños con responsabilidades claras frente a un bloque que:

- Decide todas las etapas.
- Ejecuta decenas de comandos.
- Procesa muchas entradas.
- Implementa lógica de negocio extensa.
- Captura todos los errores.
- Controla notificaciones, artefactos y despliegues a la vez.

## Sintaxis y lógica Groovy básica

Dentro de `script`, se pueden utilizar construcciones Groovy habituales, dentro de las restricciones de Jenkins Pipeline.

### Declarar una variable

```groovy
script {
    def mensaje = 'Validación de práctica'
    echo mensaje
}
```

`def` permite que Groovy infiera el tipo.

Para ejemplos iniciales, `def` suele ser suficiente.

### Tipo explícito

```groovy
script {
    String mensaje = 'Validación de práctica'
    echo mensaje
}
```

Los tipos explícitos pueden hacer el código más claro cuando aportan información.

No son necesarios en todos los ejemplos.

### Variables locales

Una variable declarada dentro de `script` tiene un ámbito ligado a la estructura Groovy donde se define.

```groovy
script {
    def estado = 'listo'
    echo estado
}
```

No supongas que la variable existe en cualquier etapa del pipeline.

### No confundir variable Groovy y variable de entorno

Esta es una variable Groovy:

```groovy
def modo = 'laboratorio'
```

Esta es una variable de entorno:

```groovy
environment {
    MODO = 'laboratorio'
}
```

Para leer la variable de entorno desde Groovy:

```groovy
echo env.MODO
```

### Cadena de una sola línea

```groovy
def mensaje = 'Texto de laboratorio'
```

Las cadenas simples son adecuadas si no necesitas interpolar expresiones Groovy.

### Cadena interpolada

```groovy
def mensaje = "Ejecución ${env.BUILD_NUMBER}"
```

Las cadenas con comillas dobles pueden interpolar expresiones Groovy.

No insertes datos no confiables en comandos sin validación.

### Concatenación

```groovy
def mensaje = 'Job: ' + env.JOB_NAME
```

La interpolación suele ser más fácil de leer:

```groovy
def mensaje = "Job: ${env.JOB_NAME}"
```

### Comparaciones

```groovy
if (params.MODO == 'detallado') {
    echo 'Modo detallado.'
}
```

La comparación con `==` comprueba igualdad de valores en Groovy.

Asegúrate de comparar valores del mismo tipo.

### `if` y `else`

```groovy
script {
    if (params.MODO == 'simple') {
        echo 'Validación simple.'
    } else {
        echo 'Validación detallada.'
    }
}
```

La rama `else` se ejecuta si la condición no se cumple.

No uses `else` como sustituto de validar una entrada arbitraria si solo hay unas opciones permitidas.

### `else if`

```groovy
script {
    if (params.MODO == 'simple') {
        echo 'Se eligió el modo simple.'
    } else if (params.MODO == 'detallado') {
        echo 'Se eligió el modo detallado.'
    } else {
        error 'El modo recibido no está permitido.'
    }
}
```

El último caso explícito detecta valores inesperados.

### Operadores booleanos

Groovy admite operadores lógicos como:

- `&&` para conjunción.
- `||` para disyunción.
- `!` para negación.

Ejemplo:

```groovy
if (params.MODO == 'detallado' && fileExists('README.md')) {
    echo 'Modo detallado y README presente.'
}
```

Mantén las condiciones legibles.

Si una expresión se vuelve larga, divídela en variables booleanas con nombres claros.

### Operador de comparación

Los operadores habituales incluyen:

- `==`
- `!=`
- `<`
- `<=`
- `>`
- `>=`

Comprueba el tipo de los valores antes de compararlos.

Un número guardado como texto no siempre se comporta como un número.

### Booleanos

Un parámetro booleano debe consultarse como un valor booleano:

```groovy
if (params.MOSTRAR_DETALLES) {
    echo 'Detalles activados.'
}
```

No compares un booleano con la cadena `'true'` sin una razón explícita.

### Nulos

Una variable puede no tener valor en ciertos contextos.

Comprueba su existencia antes de llamar a métodos o construir mensajes con ella.

```groovy
if (params.NOMBRE != null && params.NOMBRE != '') {
    echo 'Se proporcionó un nombre.'
}
```

La forma de manejar valores ausentes debe corresponder a la definición del parámetro.

### Cadenas vacías

Una cadena vacía no equivale necesariamente a `null`.

Decide qué comportamiento tiene un parámetro vacío.

Valida antes de utilizarlo en rutas, comandos o nombres.

## Acceso a datos de Jenkins

Dentro de `script`, es habitual consultar parámetros y variables de entorno.

### Parámetros con `params`

```groovy
script {
    echo "Modo: ${params.MODO}"
}
```

`params` proporciona acceso a parámetros de la ejecución en contextos de Pipeline compatibles.

### Variables de entorno con `env`

```groovy
script {
    echo "Job: ${env.JOB_NAME}"
}
```

`env` permite consultar variables de entorno proporcionadas por Jenkins o definidas en el pipeline.

La disponibilidad concreta depende del contexto.

### Parámetros y entorno no son equivalentes

Un parámetro se recibe como entrada de la ejecución.

Una variable de entorno configura un proceso o contexto.

Un parámetro puede aparecer también en el entorno según el job, pero utiliza `params` para expresar claramente que estás consultando un parámetro.

### Datos del build

Jenkins puede proporcionar datos del build, como:

- Número de ejecución.
- Nombre del job.
- Resultado actual.
- URL del job.
- Rama, si el tipo de job la define.

Comprueba la variable o propiedad antes de depender de ella.

### `currentBuild`

`currentBuild` proporciona información relacionada con la ejecución actual en contextos habituales.

Ejemplo:

```groovy
script {
    echo "Resultado actual: ${currentBuild.currentResult}"
}
```

No uses su valor para hacer pasar como exitoso un pipeline fallido.

### Resultado aún no fijado

En distintas fases, el resultado puede estar sin fijar o cambiar durante la ejecución.

Comprueba el valor concreto y considera el momento en que se consulta.

### No imprimir todo el entorno

Evita:

```groovy
sh 'env'
```

El entorno puede contener información sensible.

Imprime solo valores no sensibles que necesites para el diagnóstico.

## Condiciones con `script`

Una condición dentro de `script` sirve para decidir qué lógica se ejecuta en una etapa.

### Seleccionar un mensaje

```groovy
script {
    if (params.MODO == 'detallado') {
        echo 'Se ejecutará el modo detallado.'
    } else {
        echo 'Se ejecutará el modo normal.'
    }
}
```

Este ejemplo no omite una etapa.

Solo selecciona qué bloque ejecutar dentro de ella.

### Seleccionar un paso

```groovy
script {
    if (params.CHECK_EXTRA) {
        sh 'test -f docs/extra.txt'
    } else {
        echo 'La comprobación adicional no se solicitó.'
    }
}
```

La lógica debe explicar qué significa que la comprobación no se ejecute.

### Condición de etapa con `when`

Cuando toda la etapa depende de una condición, puede ser preferible `when`.

```groovy
stage('Validación adicional') {
    when {
        expression {
            return params.CHECK_EXTRA
        }
    }

    steps {
        sh 'test -f docs/extra.txt'
    }
}
```

La etapa aparecerá como omitida cuando la condición no se cumpla.

### Diferencia entre `if` y `when`

- `if` decide dentro de un bloque `script`.
- `when` determina si Jenkins ejecuta una etapa.
- `if` puede controlar pasos dentro de una etapa.
- `when` puede comunicar mejor que la etapa completa se omitió.

### Validar antes de actuar

```groovy
script {
    if (!(params.MODO in ['simple', 'detallado'])) {
        error 'Modo no válido.'
    }

    echo "Modo aceptado: ${params.MODO}"
}
```

Una opción de selección restringida ayuda, pero la validación puede hacer explícita la regla del pipeline.

## Bucles y colecciones

Groovy permite recorrer listas. En Jenkins Pipeline, mantén las colecciones pequeñas y el flujo fácil de revisar.

### Lista literal

```groovy
script {
    def archivos = ['README.md', 'Jenkinsfile']
    echo "Número de archivos: ${archivos.size()}"
}
```

### Recorrer una lista con `each`

```groovy
script {
    def archivos = ['README.md', 'Jenkinsfile']

    archivos.each { archivo ->
        echo "Comprobando ${archivo}"
        sh "test -f '${archivo}'"
    }
}
```

Este ejemplo construye un comando con valores de la lista.

En un entorno real, asegúrate de que esos valores están controlados y no provienen de texto no confiable.

### Bucle con `for`

```groovy
script {
    for (archivo in ['README.md', 'Jenkinsfile']) {
        echo "Archivo: ${archivo}"
    }
}
```

Para listas pequeñas y fijas, `for` puede ser fácil de leer.

### Evitar listas arbitrarias de usuario

No permitas que una persona introduzca una lista libre de comandos o rutas y la recorras directamente.

Valida los valores y limita las operaciones al proyecto.

### Bucle grande

Un bucle con muchas iteraciones puede:

- Prolongar la ejecución.
- Producir logs difíciles de revisar.
- Aumentar el estado que Jenkins debe guardar.
- Complicar una reanudación.

Si hay muchas tareas independientes, considera etapas paralelas o un mecanismo apropiado, con revisión del diseño.

### No usar bucles para ocultar etapas

Si cada elemento representa un trabajo importante, puede ser más claro mostrarlo como una etapa separada.

La interfaz debe permitir entender qué se ejecutó.

## Cálculos sencillos

Groovy puede calcular valores para decisiones dentro de un pipeline.

### Concatenar un identificador

```groovy
script {
    def etiqueta = "${env.JOB_NAME}-${env.BUILD_NUMBER}"
    echo "Identificador de ejecución: ${etiqueta}"
}
```

No uses el valor como destino de una operación peligrosa sin validarlo.

### Operaciones numéricas

```groovy
script {
    int intentos = 2
    int total = intentos + 1
    echo "Intentos permitidos: ${total}"
}
```

Mantén los cálculos sencillos y comprensibles.

### Normalizar texto

```groovy
script {
    def modo = params.MODO?.trim()?.toLowerCase()
    echo "Modo normalizado: ${modo}"
}
```

La normalización no sustituye la validación.

Comprueba que el valor sigue perteneciendo a las opciones permitidas.

### Construir una ruta relativa

```groovy
script {
    def ruta = 'salida/resultado.txt'
    echo "Ruta de salida: ${ruta}"
}
```

Prefiere rutas relativas al workspace.

No aceptes una ruta absoluta arbitraria desde un parámetro.

### Datos derivados

Un valor derivado debería ser:

- Predecible.
- No sensible.
- Validado.
- Utilizado dentro de un ámbito limitado.
- Registrado solo si es seguro.

### No calcular decisiones de seguridad desde texto libre

No uses una cadena introducida por una persona para decidir, sin validación:

- Qué credencial cargar.
- Qué nodo usar.
- Qué carpeta borrar.
- Qué servidor modificar.
- Qué destino publicar.

## Invocar pasos de Jenkins desde `script`

Un bloque `script` puede llamar pasos de Pipeline en contextos compatibles.

### `echo`

```groovy
script {
    echo 'Mensaje de diagnóstico.'
}
```

`echo` es un paso de Pipeline.

### `sh`

```groovy
script {
    sh 'test -f README.md'
}
```

La shell se ejecuta en el agente asignado.

El bloque `script` no convierte la shell en local.

### `fileExists`

```groovy
script {
    if (fileExists('README.md')) {
        echo 'README presente.'
    } else {
        error 'README ausente.'
    }
}
```

`fileExists` trabaja con el workspace de la ejecución en contextos compatibles.

### `archiveArtifacts`

```groovy
script {
    archiveArtifacts artifacts: 'salida/resultado.txt',
                     fingerprint: true
}
```

El patrón debe corresponder a archivos existentes.

### `input`

```groovy
script {
    def respuesta = input(
        message: 'Confirme una práctica de laboratorio.',
        ok: 'Continuar'
    )

    echo 'La respuesta fue recibida.'
}
```

La entrada puede pausar el pipeline.

Considera el efecto sobre agentes y recursos.

### `error`

```groovy
script {
    error 'No se puede continuar con esta entrada.'
}
```

Detiene el flujo con un resultado de fallo.

### `retry`

```groovy
script {
    retry(2) {
        sh 'test -f README.md'
    }
}
```

Utiliza reintentos solo cuando la repetición sea segura y tenga sentido.

### `timeout`

```groovy
script {
    timeout(time: 1, unit: 'MINUTES') {
        sh 'bash scripts/validar.sh'
    }
}
```

El bloque queda limitado al tiempo configurado.

### No llamar cualquier método Java

Jenkins aplica controles a las operaciones que el pipeline puede ejecutar.

No supongas que cualquier clase, paquete o método está autorizado.

Utiliza pasos de Pipeline documentados y consulta al administrador si necesitas una integración.

## `script` y comandos de shell

Comprender las comillas evita errores y riesgos de interpretación.

### Groovy evalúa antes de la shell

En una cadena Groovy con interpolación, Groovy sustituye expresiones antes de que el comando llegue al agente.

```groovy
sh "echo ${params.MENSAJE}"
```

Este patrón puede ser inseguro si `MENSAJE` contiene caracteres especiales.

### La shell evalúa variables de entorno

```groovy
sh 'echo "$MODO"'
```

La shell del agente expande `$MODO`.

### Preferir valores limitados

Si se necesita pasar una opción a la shell:

- Usa `choice` cuando sea posible.
- Valida el valor.
- Evita comandos construidos con texto libre.
- Cita correctamente los argumentos.
- No imprimas secretos.
- Comprueba la shell real del agente.

### Argumentos en listas

Construir comandos con parámetros puede requerir cuidado con espacios, comillas y caracteres de control.

Un ejemplo simple no cubre todos los casos de escape.

Para entradas complejas, utiliza una herramienta o script revisado que reciba argumentos de forma segura.

### Script versionado

Cuando la lógica de shell crece, muévela a un script versionado.

El `Jenkinsfile` puede coordinar su ejecución:

```groovy
steps {
    sh 'bash scripts/validar.sh'
}
```

Así es más sencillo probar el script localmente.

### Evitar comandos construidos desde una entrada arbitraria

No hagas:

```groovy
sh "${params.COMANDO}"
```

Una entrada así permite ejecutar instrucciones arbitrarias con los permisos del agente.

## Jenkins Pipeline, CPS y reanudación

Jenkins Pipeline no ejecuta todo Groovy exactamente como un programa local corriente.

### Qué significa CPS

Jenkins transforma parte del código del pipeline para poder suspender y reanudar una ejecución.

Este mecanismo se relaciona con la persistencia del estado y la continuidad después de ciertas pausas o reinicios.

### Pasos que pueden suspenderse

Pasos como `input`, `sleep` y operaciones de agente pueden suspender el flujo.

El estado que Jenkins necesita puede guardarse para continuar más adelante.

### Variables que sobreviven a pausas

Una variable que permanece viva durante una pausa puede necesitar ser serializable para que Jenkins conserve el estado.

Para el trabajo normal de alumnado:

- Prefiere cadenas simples.
- Prefiere números.
- Prefiere listas pequeñas de tipos simples.
- Evita guardar objetos complejos.
- Evita conservar resultados de bibliotecas no serializables.

### Ejemplo de variable sencilla

```groovy
script {
    def modo = params.MODO
    echo "Modo actual: ${modo}"
}
```

Las cadenas simples suelen ser adecuadas para ejemplos básicos.

### Objeto complejo

Un objeto de una biblioteca externa puede no poder serializarse.

Si una variable de ese tipo permanece activa durante una pausa, el pipeline podría fallar al guardar o reanudar el estado.

### Reducir el tiempo de vida

Mantén las variables necesarias solo durante el bloque que las utiliza.

Evita conservar objetos grandes o complejos en el estado del pipeline.

### Llamadas que no son pasos de Pipeline

Groovy puede llamar métodos que no son pasos de Jenkins.

No todos son compatibles con CPS o con el sandbox.

Prefiere los pasos soportados por la instancia y prueba el pipeline con la versión real.

### No usar una API local como si fuera un paso

Una llamada a un método Groovy o Java no ejecuta automáticamente código en el agente.

Para interactuar con el sistema de archivos del agente, normalmente se usan pasos de Pipeline como `sh`, `bat` o `fileExists`, según el propósito.

## `@NonCPS` y sus límites

`@NonCPS` es una anotación para ciertos métodos Groovy que no deben ejecutarse bajo CPS.

No es una solución general para errores de pipeline.

### Cuándo se considera

Puede ser útil cuando:

- Una función hace procesamiento local y acotado.
- Una API de Groovy no es compatible con CPS.
- El método no llama pasos de Pipeline.
- El resultado es serializable y se devuelve rápidamente.

### Restricción principal

Un método marcado `@NonCPS` no debería llamar pasos de Pipeline como:

- `sh`
- `echo`
- `input`
- `sleep`
- `archiveArtifacts`
- `error`

La llamada a un paso desde un método `@NonCPS` puede producir fallos o comportamientos inesperados.

### Ejemplo conceptual seguro de cálculo

```groovy
@NonCPS
def normalizarTexto(String valor) {
    return valor == null ? '' : valor.trim().toLowerCase()
}
```

Este método calcula y devuelve una cadena.

No llama pasos de Jenkins.

### Ejemplo que se debe evitar

```groovy
@NonCPS
def tareaNoAdecuada() {
    echo 'No llamar pasos de Pipeline desde @NonCPS'
}
```

`echo` es un paso de Pipeline.

No debería invocarse desde un método marcado `@NonCPS`.

### Evitar añadir la anotación prematuramente

Antes de usar `@NonCPS`:

- Simplifica el código.
- Utiliza un paso de Pipeline.
- Reduce el tamaño del bloque.
- Comprueba el mensaje exacto.
- Revisa la documentación de Jenkins.
- Consulta al responsable de la instancia.

### `@NonCPS` no elimina el sandbox

La anotación no autoriza operaciones bloqueadas por seguridad.

Tampoco transforma una operación en segura ni evita la validación de entradas.

### Métodos fuera del contexto esperado

La ubicación del método y la estructura del `Jenkinsfile` afectan a cómo se compila.

Los ejemplos avanzados deben probarse en la versión real de Jenkins.

Para una práctica inicial, evita métodos personalizados complejos.

## Sandbox y aprobaciones de seguridad

Jenkins puede ejecutar Groovy con restricciones de sandbox.

### Qué hace el sandbox

El sandbox limita qué métodos y APIs puede utilizar el pipeline.

Su objetivo es reducir el riesgo de ejecutar código arbitrario con permisos amplios.

### Operación rechazada

Si una operación no está permitida, Jenkins puede:

- Interrumpir el pipeline.
- Mostrar un mensaje de seguridad.
- Registrar una solicitud de aprobación.
- Requerir intervención de un administrador.

### No buscar atajos

No desactives el sandbox para resolver un error de forma rápida.

No cambies la seguridad global de la instancia.

Consulta al administrador y busca un paso de Pipeline soportado.

### Aprobación de scripts

En algunos entornos, administradores pueden revisar y aprobar firmas de scripts.

Esa revisión tiene implicaciones de seguridad.

No pidas aprobar una operación sin explicar:

- Qué hace.
- Por qué es necesaria.
- Qué permisos usa.
- Quién ejecutará el pipeline.
- Qué datos puede modificar.

### Código de ramas no confiables

Un `Jenkinsfile` puede cambiar entre ramas.

Una rama externa podría intentar ejecutar código Groovy diferente.

No concedas privilegios o credenciales a código no revisado.

### Revisión de cambios Groovy

Revisa especialmente:

- Llamadas a APIs.
- Métodos no habituales.
- Reflexión.
- Acceso a archivos.
- Acceso a red.
- Uso de credenciales.
- Ejecución de comandos.
- Cambios en el sandbox.
- Lógica que altera el resultado.

## Seguridad y mantenimiento

La flexibilidad de `script` requiere límites claros.

### Tratar `script` como código ejecutable

El contenido puede influir en comandos, archivos, resultados y credenciales.

Revisa el bloque antes de ejecutarlo.

### Validar parámetros

No confíes en un valor solo porque llega desde Jenkins.

Valida:

- Tipo.
- Longitud.
- Formato.
- Opciones permitidas.
- Uso previsto.
- Efectos de valores vacíos.

### No interpolar texto sin control

Una cadena interpolada puede convertirse en parte de un comando.

Evita usar entradas no confiables como líneas de shell.

### Mínimo privilegio

El bloque `script` se ejecuta con el contexto del job y del agente.

Limita los permisos del agente y del job.

### Secretos

No guardes secretos en:

- Variables `def`.
- Strings.
- Parámetros normales.
- Archivos temporales sin control.
- Mensajes de error.
- Consola.
- Código versionado.

Utiliza el almacén de credenciales aprobado para la instancia.

### Logs seguros

Registra información necesaria para diagnosticar.

No imprimas:

- El entorno completo.
- Contraseñas.
- Tokens.
- Claves privadas.
- Contenido de credenciales.
- Datos personales no necesarios.

### Bloques pequeños

Un `script` pequeño es más sencillo de:

- Leer.
- Probar.
- Revisar.
- Asegurar.
- Diagnosticar.
- Cambiar.

### Nombres significativos

Utiliza nombres que expliquen el propósito:

```groovy
def codigoValidacion
def modoSeleccionado
def archivosRequeridos
```

Evita nombres ambiguos:

```groovy
def x
def tmp
def cosa
```

### Evitar duplicar lógica

Si varios pipelines comparten una lógica, considera un script versionado o una biblioteca compartida aprobada.

No copies el mismo bloque complejo en muchos jobs.

### No crear una biblioteca compartida por cualquier línea

Las bibliotecas compartidas tienen implicaciones de administración y confianza.

Para una sola condición sencilla, `script` puede ser suficiente.

### Mantener la lógica cerca de su uso

Una variable o condición local suele ser más clara cerca de la etapa que la necesita.

No muevas toda la lógica a un lugar lejano sin documentar su propósito.

### Evitar lógica de negocio extensa

Si el `Jenkinsfile` contiene gran parte de la lógica de una aplicación, separa responsabilidades.

Jenkins debería coordinar tareas y no convertirse necesariamente en el lugar donde vive toda la aplicación.

## Sesiones prácticas para alumnos

Las prácticas usan lógica sencilla, valores no sensibles y acciones limitadas al laboratorio.

### Preparación de la práctica

Estructura sugerida:

```text
script-lab/
├── Jenkinsfile
├── README.md
├── app/
│   └── mensaje.txt
└── scripts/
    └── validar.sh
```

El docente proporciona:

- Job de laboratorio.
- Agente adecuado.
- Rama autorizada.
- Repositorio, si se usa SCM.
- Convenciones de entrega.

### Crear los archivos

```bash
mkdir -p app scripts
printf 'Práctica del bloque script en Jenkins\n' > app/mensaje.txt
```

Crea un script simple:

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

test -f app/mensaje.txt
grep -q "Jenkins" app/mensaje.txt
echo "Contenido válido."
EOF
```

Prueba en local:

```bash
bash scripts/validar.sh
```

### Sesión 1: distinguir Groovy y shell

**Objetivo:** identificar qué intérprete procesa cada línea.

#### Código para analizar

```groovy
pipeline {
    agent any

    environment {
        MODO = 'laboratorio'
    }

    stages {
        stage('Comparar intérpretes') {
            steps {
                script {
                    def mensaje = "Modo Groovy: ${env.MODO}"
                    echo mensaje
                }

                sh 'echo "Modo shell: $MODO"'
            }
        }
    }
}
```

#### Instrucciones

1. Marca las expresiones Groovy.
2. Marca el comando de shell.
3. Indica dónde se define `MODO`.
4. Predice la salida.
5. Ejecuta en el job autorizado.
6. Compara la salida observada.

#### Preguntas

- ¿Qué interpreta `${env.MODO}`?
- ¿Qué interpreta `$MODO`?
- ¿`script` ejecuta una shell?
- ¿Qué paso ejecuta `echo` del sistema operativo?

### Sesión 2: declarar una variable local

**Objetivo:** usar `def` dentro de un bloque `script`.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Variable local') {
            steps {
                script {
                    def mensaje = 'Variable creada en Groovy'
                    echo mensaje
                }
            }
        }
    }
}
```

#### Instrucciones

1. Identifica la declaración.
2. Identifica el uso.
3. Predice qué ocurre fuera del bloque.
4. Ejecuta el pipeline.
5. Describe el alcance de `mensaje`.

### Sesión 3: añadir una condición `if`

**Objetivo:** seleccionar una salida según un parámetro.

#### Pipeline

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona un modo de laboratorio'
        )
    }

    stages {
        stage('Seleccionar salida') {
            steps {
                script {
                    if (params.MODO == 'simple') {
                        echo 'Se seleccionó la salida simple.'
                    } else {
                        echo 'Se seleccionó la salida detallada.'
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta con `simple`.
2. Registra el mensaje.
3. Ejecuta con `detallado`.
4. Compara resultados.
5. Explica qué parte se ejecuta en cada caso.

### Sesión 4: validar explícitamente opciones

**Objetivo:** rechazar valores no permitidos.

#### Pipeline

```groovy
pipeline {
    agent any

    parameters {
        string(
            name: 'MODO',
            defaultValue: 'simple',
            description: 'Usa simple o detallado'
        )
    }

    stages {
        stage('Validar parámetro') {
            steps {
                script {
                    if (!(params.MODO in ['simple', 'detallado'])) {
                        error 'El modo no está permitido.'
                    }

                    echo "Modo aceptado: ${params.MODO}"
                }
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta con `simple`.
2. Ejecuta con `detallado`.
3. Prueba un valor no permitido, si la interfaz lo permite.
4. Comprueba el resultado.
5. Explica por qué una lista `choice` reduce errores, pero no sustituye siempre la validación.

### Sesión 5: comparar `if` con `when`

**Objetivo:** decidir si conviene controlar una acción o una etapa completa.

#### Variante A: condición dentro de `script`

```groovy
stage('Control interno') {
    steps {
        script {
            if (params.MODO == 'detallado') {
                echo 'Ejecutando detalle.'
            }
        }
    }
}
```

#### Variante B: condición declarativa

```groovy
stage('Etapa detallada') {
    when {
        expression {
            return params.MODO == 'detallado'
        }
    }

    steps {
        echo 'La etapa completa se ejecuta en modo detallado.'
    }
}
```

#### Actividad

1. Describe qué se ejecuta en cada variante.
2. Indica cómo aparece una etapa omitida.
3. Explica cuál es más clara cuando la etapa completa es opcional.
4. Prueba ambas variantes en una rama de laboratorio.

### Sesión 6: guardar y comprobar un código de salida

**Objetivo:** usar `returnStatus` desde `script`.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Interpretar código') {
            steps {
                script {
                    int codigo = sh(
                        returnStatus: true,
                        script: 'test -f README.md'
                    )

                    if (codigo == 0) {
                        echo 'README presente.'
                    } else {
                        error "La comprobación falló con código ${codigo}."
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta con el archivo presente.
2. Cambia la ruta en una rama de práctica.
3. Ejecuta con la ruta ausente.
4. Localiza el código.
5. Restaura la ruta correcta.
6. Explica por qué la llamada a `error` es importante.

### Sesión 7: recorrer una lista pequeña

**Objetivo:** usar una colección fija y controlada.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar archivos') {
            steps {
                script {
                    def archivos = [
                        'README.md',
                        'Jenkinsfile',
                        'app/mensaje.txt'
                    ]

                    archivos.each { archivo ->
                        echo "Comprobando ${archivo}"

                        if (!fileExists(archivo)) {
                            error "Falta el archivo requerido: ${archivo}"
                        }
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Identifica la lista.
2. Predice cuántas comprobaciones se ejecutan.
3. Ejecuta con todos los archivos presentes.
4. Omite un archivo en una rama local de práctica.
5. Comprueba dónde se detiene.
6. Restaura el repositorio.

#### Preguntas

- ¿Por qué la lista es controlada?
- ¿Qué mensaje aparece ante un archivo ausente?
- ¿Qué problema tendría recorrer rutas introducidas libremente por un usuario?

### Sesión 8: crear una variable de entorno temporal

**Objetivo:** diferenciar variable Groovy y variable de shell.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Entorno temporal') {
            steps {
                script {
                    withEnv(['MODO_TEMPORAL=practica']) {
                        sh 'echo "$MODO_TEMPORAL"'
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Localiza la variable.
2. Identifica el bloque que limita su alcance.
3. Ejecuta la práctica.
4. Explica qué proceso expande `$MODO_TEMPORAL`.
5. No utilices datos sensibles.

### Sesión 9: manejar un fallo con `try/catch`

**Objetivo:** distinguir captura y recuperación.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Captura con propagación') {
            steps {
                script {
                    try {
                        sh 'test -f archivo-que-no-existe.txt'
                    } catch (err) {
                        echo 'La comprobación produjo una excepción.'
                        throw err
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Predice si el pipeline quedará exitoso o fallido.
2. Ejecuta el ejemplo.
3. Comprueba si `throw err` conserva el fallo.
4. Revisa la consola.
5. Explica qué cambiaría si se eliminara `throw err`.

### Sesión 10: capturar una comprobación no bloqueante

**Objetivo:** continuar de forma consciente después de una comprobación opcional.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobación opcional') {
            steps {
                script {
                    try {
                        sh 'test -f informe-opcional.txt'
                    } catch (err) {
                        unstable 'No se encontró el informe opcional.'
                    }
                }

                echo 'El pipeline continúa para completar el resumen.'
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

1. Confirma que la comprobación es opcional en esta práctica.
2. Ejecuta con el archivo ausente.
3. Revisa el resultado global.
4. Comprueba que el resumen se ejecutó.
5. Explica por qué la misma técnica no debería ocultar un test obligatorio.

### Sesión 11: comparar `catchError` y `try/catch`

**Objetivo:** observar dos formas distintas de gestionar un paso fallido.

#### Variante A

```groovy
catchError(buildResult: 'UNSTABLE') {
    sh 'test -f informe-opcional.txt'
}
```

#### Variante B

```groovy
script {
    try {
        sh 'test -f informe-opcional.txt'
    } catch (err) {
        unstable 'La comprobación opcional falló.'
    }
}
```

#### Actividad

1. Ejecuta las variantes por separado.
2. Compara los mensajes.
3. Compara el estado final.
4. Identifica dónde se expresa la política de resultado.
5. Comprueba qué sintaxis admite la instancia.

### Sesión 12: usar `retry` con una tarea idempotente

**Objetivo:** comprender los límites de un reintento.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Repetir comprobación segura') {
            steps {
                retry(2) {
                    sh 'test -f README.md'
                }
            }
        }
    }
}
```

#### Instrucciones

1. Comprueba que la operación solo consulta un archivo.
2. Ejecuta el ejemplo.
3. Explica por qué repetir `test` no crea recursos duplicados.
4. Propón un ejemplo de operación que no debería reintentarse a ciegas.
5. No pruebes operaciones destructivas.

### Sesión 13: aplicar un timeout breve

**Objetivo:** limitar una operación de práctica.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Tarea con límite') {
            steps {
                timeout(time: 20, unit: 'SECONDS') {
                    echo 'La tarea está limitada en el tiempo.'
                    sleep time: 2, unit: 'SECONDS'
                    echo 'La tarea terminó.'
                }
            }
        }
    }
}
```

#### Instrucciones

1. Revisa el límite.
2. Ejecuta una vez.
3. Comprueba el resultado.
4. No aumentes el tiempo de espera.
5. Describe qué debería ocurrir si la tarea no termina.

### Sesión 14: calcular un resumen sencillo

**Objetivo:** crear texto de resumen en Groovy sin leer datos sensibles.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Resumen') {
            steps {
                script {
                    def nombre = env.JOB_NAME
                    def numero = env.BUILD_NUMBER
                    def resumen = "Ejecución ${nombre} #${numero}"

                    echo resumen
                }
            }
        }
    }
}
```

#### Instrucciones

1. Identifica qué valores vienen de Jenkins.
2. Identifica qué valor calcula Groovy.
3. Ejecuta el job.
4. Registra el resumen.
5. Explica por qué no se deben imprimir todas las variables de entorno.

### Sesión 15: mover la lógica de shell a un script

**Objetivo:** reducir la complejidad de `script`.

#### Antes

```groovy
script {
    sh '''
        test -f app/mensaje.txt
        grep -q "Jenkins" app/mensaje.txt
        echo "Validación completada"
    '''
}
```

#### Después

```groovy
steps {
    sh 'bash scripts/validar.sh'
}
```

#### Actividad

1. Compara ambas versiones.
2. Ejecuta el script localmente.
3. Ejecuta el pipeline.
4. Determina qué opción es más fácil de probar fuera de Jenkins.
5. Documenta por qué.

### Sesión 16: revisar un `script` demasiado grande

**Objetivo:** dividir responsabilidades.

#### Caso de análisis

Un único bloque `script`:

- Lee varios parámetros.
- Elige un agente.
- Construye comandos.
- Captura cualquier excepción.
- Archiva archivos.
- Envía notificaciones.
- Cambia el resultado final.

#### Actividad

1. Identifica cada responsabilidad.
2. Separa tareas que pertenecen a `parameters`.
3. Separa condiciones que podrían ser `when`.
4. Separa acciones de `post`.
5. Separa shell y Groovy.
6. Escribe una estructura más pequeña.

### Sesión 17: detectar interpolación peligrosa

**Objetivo:** reconocer el riesgo de construir comandos con entrada externa.

#### Fragmento para revisar

```groovy
sh "echo ${params.MENSAJE}"
```

#### Preguntas

- ¿Quién evalúa `${params.MENSAJE}`?
- ¿Qué ocurre si el texto contiene caracteres especiales?
- ¿Se trata de una entrada controlada?
- ¿Se podría limitar a una lista de opciones?
- ¿Qué alternativa sería más segura?

No pruebes cargas maliciosas en un agente compartido.

### Sesión 18: revisar el uso de `@NonCPS`

**Objetivo:** distinguir cálculo Groovy de pasos de Pipeline.

#### Ejemplo de cálculo

```groovy
@NonCPS
String normalizar(String valor) {
    return valor == null ? '' : valor.trim().toLowerCase()
}
```

#### Ejemplo que se debe evitar

```groovy
@NonCPS
def metodoIncorrecto() {
    echo 'Paso de Pipeline dentro de @NonCPS'
}
```

#### Actividad

1. Indica qué hace el primer método.
2. Explica por qué el segundo mezcla contextos.
3. Determina si una transformación simple necesita realmente `@NonCPS`.
4. Consulta al docente antes de añadir métodos avanzados.

### Sesión 19: error de sandbox

**Objetivo:** aprender a responder a una operación rechazada por seguridad.

#### Escenario

Jenkins informa de que una firma o método no está permitido.

#### Procedimiento

1. No desactives el sandbox.
2. Anota el mensaje sin incluir secretos.
3. Identifica el método solicitado.
4. Explica qué intentaba hacer el código.
5. Busca un paso de Pipeline documentado que ofrezca la misma función.
6. Consulta al administrador.
7. No solicites una aprobación sin justificarla.

### Sesión 20: pipeline integrador

**Objetivo:** combinar parámetros, lógica condicional, validación y resultado claro.

#### Jenkinsfile

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona un modo de validación'
        )
    }

    stages {
        stage('Comprobar estructura') {
            steps {
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Validación principal') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }

        stage('Resumen según modo') {
            steps {
                script {
                    if (params.MODO == 'detallado') {
                        echo "Job: ${env.JOB_NAME}"
                        echo "Ejecución: ${env.BUILD_NUMBER}"
                        echo 'Se completó la validación detallada.'
                    } else if (params.MODO == 'simple') {
                        echo 'Validación completada.'
                    } else {
                        error 'El modo recibido no está permitido.'
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
            echo 'Una comprobación falló. Revisa la primera etapa fallida.'
        }

        aborted {
            echo 'La ejecución se interrumpió.'
        }

        always {
            echo 'Fin del pipeline.'
        }
    }
}
```

#### Pruebas

Ejecuta el pipeline con:

- `MODO=simple` y el proyecto válido.
- `MODO=detallado` y el proyecto válido.
- Una entrada inválida en una rama de práctica, si el job lo permite.
- El archivo de contenido ausente, en un entorno aislado.
- El archivo restaurado después de la prueba.

#### Registro

```text
Job:
Ejecución:
Modo:
Commit:
Agente:
Etapa fallida, si aplica:
Resultado final:
Mensaje de post:
```

### Sesión 21: revisión por parejas

**Objetivo:** revisar seguridad y legibilidad de un bloque `script`.

#### Una persona explica

- Qué valores se leen.
- Qué condiciones se evalúan.
- Qué pasos se ejecutan.
- Qué ocurre ante un valor inválido.
- Qué resultado se produce ante un error.

#### La otra persona revisa

- Variables sin usar.
- Tipos confusos.
- Condiciones duplicadas.
- Interpolación de texto libre.
- Capturas amplias.
- Mensajes engañosos.
- Bloques demasiado largos.
- Acceso innecesario a variables de entorno.

#### Entregable

Entrega:

- Una fortaleza.
- Un riesgo.
- Una mejora concreta.
- Una prueba que añadirías.

### Sesión 22: documentar un patrón reutilizable

**Objetivo:** explicar cuándo el equipo permite usar `script`.

#### Completa

```text
Patrón:
Necesidad:
Por qué no basta con sintaxis declarativa:
Valores de entrada:
Validaciones:
Pasos de Pipeline llamados:
Errores posibles:
Comportamiento ante fallo:
Datos que se registran:
Datos que no se imprimen:
```

La plantilla ayuda a justificar la complejidad introducida.

## Errores frecuentes

Los fallos de `script` suelen relacionarse con sintaxis, contexto, tipos, interpolación o CPS.

### Falta una llave

Comprueba la correspondencia entre:

- `pipeline`.
- `stages`.
- `stage`.
- `steps`.
- `script`.
- `if`.
- `else`.
- `try`.
- `catch`.
- Bucles.

### `script` en una ubicación incorrecta

Comprueba que el bloque se encuentra dentro de una sección que admite pasos, normalmente `steps`.

### Ejecutar shell como Groovy

Esto no ejecuta un comando del sistema:

```groovy
script {
    echo "pwd"
}
```

`echo` es un paso de Jenkins que muestra texto.

Para ejecutar el comando del sistema, utiliza un paso adecuado:

```groovy
sh 'pwd'
```

### Usar una variable antes de definirla

Comprueba:

- Nombre.
- Alcance.
- Rama de ejecución.
- Orden de las instrucciones.
- Diferencia entre `env.NOMBRE` y una variable local.

### Usar una variable local como entorno

Una variable Groovy `def modo` no aparece automáticamente como `$MODO` en una shell.

Usa `environment` o `withEnv` cuando un proceso hijo necesite el valor.

### Variable de shell no disponible en otro paso

Cada paso `sh` puede ejecutarse en un proceso separado.

Una variable local de una shell no necesariamente persiste.

### Comparación entre tipos distintos

Comprueba si comparas:

- Booleano con cadena.
- Número con texto.
- `null` con una cadena.
- Valor normalizado con uno sin normalizar.

### Resultado ignorado

Si se usa `returnStatus`, revisa el código.

No te limites a imprimirlo si el resultado debe influir en el estado del pipeline.

### `try/catch` que esconde un fallo

Si se captura una excepción y no se cambia el resultado ni se vuelve a lanzar, el pipeline puede continuar.

Decide y documenta si ese comportamiento es aceptable.

### Capturar un timeout o cancelación

Un bloque `catch` amplio puede capturar una interrupción.

No continúes automáticamente después de una cancelación que debía detener la ejecución.

### Interpolación insegura

Una cadena Groovy puede insertar valores antes de que el comando llegue a la shell.

Valida entradas y evita comandos construidos con texto libre.

### Llamada bloqueada por sandbox

No desactives la seguridad.

Utiliza un paso aprobado o consulta al administrador.

### Error de CPS o serialización

Comprueba si:

- Se conserva un objeto complejo durante una pausa.
- Un método externo es compatible con Pipeline.
- Se mezclan llamadas CPS y `@NonCPS`.
- Se mantienen datos innecesarios entre etapas.

### Paso de Pipeline dentro de `@NonCPS`

No llames pasos como `sh`, `echo` o `input` desde un método `@NonCPS`.

### Salida diferente de la esperada

Comprueba:

- Valor real del parámetro.
- Espacios.
- Mayúsculas.
- Tipo.
- Rama del `if`.
- Rama y commit del `Jenkinsfile`.
- Agente asignado.

### Stage exitosa pese a un error

Busca:

- `catchError`.
- `warnError`.
- `returnStatus`.
- `try/catch`.
- `|| true`.
- Código que modifica el resultado.
- Etapas omitidas.
- Mensajes impresos sin validación.

## Método de diagnóstico

Utiliza un proceso ordenado para evitar cambios a ciegas.

### Paso 1: registrar la ejecución

Anota:

- Job.
- Número de ejecución.
- Rama.
- Commit.
- Agente.
- Resultado global.

### Paso 2: localizar el primer error

Busca la primera etapa que falla y el primer mensaje que explica el problema.

### Paso 3: identificar el intérprete

Determina si la línea la procesa:

- Groovy.
- Jenkins Pipeline.
- Shell Unix.
- Windows Batch.
- PowerShell.
- Un plugin o herramienta externa.

### Paso 4: comprobar el tipo de dato

Verifica si el valor es:

- Texto.
- Booleano.
- Número.
- `null`.
- Código de salida.
- Resultado de un paso.

### Paso 5: comprobar el flujo

Comprueba:

- Qué rama del `if` se ejecutó.
- Si la etapa fue omitida.
- Si la excepción se capturó.
- Si se reintentó.
- Si hubo timeout.
- Si se continuó después del fallo.

### Paso 6: comprobar el agente

Anota:

- Sistema operativo.
- Herramienta disponible.
- Workspace.
- Permisos.
- Etiqueta.

No imprimas todo el entorno.

### Paso 7: formular una hipótesis

Ejemplo:

```text
Observación:
La validación no encuentra app/mensaje.txt.

Hipótesis:
El agente obtuvo un commit que no contiene el archivo.

Comprobación:
Revisar el commit y el checkout mostrado en consola.
```

### Paso 8: cambiar una sola cosa

Prueba una corrección cada vez.

Así se puede asociar el resultado con el cambio.

### Paso 9: verificar éxito y fallo

Comprueba que el pipeline:

- Pasa con entradas válidas.
- Falla con entradas inválidas.
- No muestra éxito después de un fallo obligatorio.
- Maneja errores opcionales de forma visible.

### Paso 10: documentar

Anota la causa, el cambio y la comprobación que confirmó la solución.

## Checklist de revisión de `script`

Antes de guardar un cambio:

- [ ] ¿La lógica necesita realmente `script`?
- [ ] ¿Podría expresarse con `when` o una directiva declarativa?
- [ ] ¿El bloque es pequeño?
- [ ] ¿Las variables tienen nombres claros?
- [ ] ¿Los tipos son coherentes?
- [ ] ¿Los parámetros se validan?
- [ ] ¿Se distingue Groovy de shell?
- [ ] ¿La interpolación es segura?
- [ ] ¿Se comprueban códigos de salida?
- [ ] ¿Los errores críticos se propagan?
- [ ] ¿Las cancelaciones se respetan?
- [ ] ¿Se evitan objetos complejos durante pausas?
- [ ] ¿No hay llamadas de Pipeline desde `@NonCPS`?
- [ ] ¿El sandbox sigue activo?
- [ ] ¿No se imprimen secretos?
- [ ] ¿Se probaron caminos de éxito y de fallo?
- [ ] ¿El agente es el autorizado?
- [ ] ¿El `Jenkinsfile` se revisó como código?

## Preguntas de repaso

1. ¿Qué permite hacer el bloque `script`?
2. ¿Por qué `script` no es lo mismo que `sh`?
3. ¿Dónde se coloca habitualmente `script` en un pipeline declarativo?
4. ¿Qué diferencia hay entre una variable Groovy y una variable de entorno?
5. ¿Cuándo puede ser más claro usar `when` que un `if` dentro de `script`?
6. ¿Qué hace `params`?
7. ¿Qué hace `env`?
8. ¿Qué significa capturar un código con `returnStatus`?
9. ¿Qué debe hacerse con el código devuelto por `returnStatus`?
10. ¿Por qué `try/catch` puede ocultar un error?
11. ¿Qué tipo de fallo puede ser adecuado para `retry`?
12. ¿Qué es una operación idempotente?
13. ¿Por qué no se deben reintentar a ciegas operaciones con efectos secundarios?
14. ¿Qué controla `timeout`?
15. ¿Qué limitación tiene `@NonCPS`?
16. ¿Qué puede bloquear una operación Groovy?
17. ¿Por qué no conviene desactivar el sandbox?
18. ¿Qué riesgo tiene interpolar un parámetro en una shell?
19. ¿Por qué debe mantenerse pequeño un bloque `script`?
20. ¿Qué evidencia registrarías para diagnosticar una decisión incorrecta?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«El bloque `script` permite escribir lógica Groovy en un pipeline declarativo».

### Afirmación 2

«Todo comando que aparece dentro de `script` se ejecuta automáticamente en una shell».

### Afirmación 3

«`sh` ejecuta un comando en un agente compatible».

### Afirmación 4

«Una variable `def` se convierte automáticamente en variable de entorno».

### Afirmación 5

«`when` puede ser más claro que un `if` cuando toda una etapa es condicional».

### Afirmación 6

«Capturar una excepción demuestra que la causa fue corregida».

### Afirmación 7

«`returnStatus` requiere decidir qué hacer con el código devuelto».

### Afirmación 8

«Una cadena interpolada puede insertar un parámetro en un comando».

### Afirmación 9

«El sandbox puede limitar operaciones Groovy».

### Afirmación 10

«`@NonCPS` permite llamar cualquier paso de Jenkins desde un método».

### Afirmación 11

«Una lista fija y pequeña suele ser más sencilla de revisar que una lista arbitraria de usuario».

### Afirmación 12

«Un objeto complejo puede causar problemas si Jenkins necesita conservarlo durante una pausa».

### Afirmación 13

«Un bloque `script` más largo siempre es más flexible y fácil de mantener».

### Afirmación 14

«Un `try/catch` amplio puede capturar una interrupción que debería detener el flujo».

### Afirmación 15

«Un pipeline debe probar tanto caminos válidos como inválidos».

## Respuestas orientativas

### Afirmación 1

**Correcta.** Esa es su función principal en declarativo.

### Afirmación 2

**Incorrecta.** Groovy se ejecuta en el bloque; un comando de shell requiere un paso como `sh` o `bat`.

### Afirmación 3

**Correcta.** El agente debe ser compatible con el paso.

### Afirmación 4

**Incorrecta.** Una variable Groovy no se convierte automáticamente en variable de entorno.

### Afirmación 5

**Correcta.** `when` expresa que la etapa completa depende de una condición.

### Afirmación 6

**Incorrecta.** Capturar cambia la propagación del error, pero no corrige su causa.

### Afirmación 7

**Correcta.** Si no se comprueba, el fallo puede quedar oculto.

### Afirmación 8

**Correcta.** Por eso hay que validar y manejar las entradas con cuidado.

### Afirmación 9

**Correcta.** El sandbox restringe operaciones potencialmente sensibles.

### Afirmación 10

**Incorrecta.** No se deberían llamar pasos de Pipeline desde métodos `@NonCPS`.

### Afirmación 11

**Correcta.** Es más fácil controlar y revisar una lista cerrada.

### Afirmación 12

**Correcta.** La persistencia CPS puede requerir datos serializables.

### Afirmación 13

**Incorrecta.** Un bloque grande suele ser más difícil de leer, revisar y depurar.

### Afirmación 14

**Correcta.** Una captura demasiado amplia puede impedir que una cancelación se respete.

### Afirmación 15

**Correcta.** Las dos rutas permiten verificar el control de errores.

## Glosario

- **`script`:** bloque que permite lógica Groovy dentro de una estructura declarativa.
- **Groovy:** lenguaje utilizado para definir y controlar partes de Jenkins Pipeline.
- **Paso de Pipeline:** acción que Jenkins ejecuta dentro del flujo, como `sh` o `echo`.
- **Shell:** intérprete de comandos del agente.
- **`params`:** objeto para consultar parámetros de una ejecución.
- **`env`:** objeto para consultar variables de entorno.
- **`currentBuild`:** objeto que ofrece información de la ejecución actual en contextos compatibles.
- **CPS:** mecanismo de Jenkins Pipeline relacionado con la suspensión y reanudación del flujo.
- **Serialización:** conversión del estado a una forma que Jenkins puede conservar y recuperar.
- **Sandbox:** mecanismo que limita operaciones Groovy permitidas.
- **`@NonCPS`:** anotación para ciertos métodos que no deben ejecutarse bajo el mecanismo CPS.
- **`returnStatus`:** opción que devuelve el código de salida de un comando.
- **`fileExists`:** paso que comprueba la presencia de un archivo en el workspace.
- **`when`:** directiva que controla si una etapa se ejecuta.
- **`retry`:** paso que repite un bloque un número limitado de veces.
- **`timeout`:** límite temporal de un paso, bloque o pipeline.
- **Idempotente:** operación que puede repetirse sin producir efectos adicionales no deseados.
- **Interpolación:** sustitución de una expresión por su valor dentro de una cadena.
- **Falso éxito:** estado aparentemente exitoso que oculta una validación fallida o no ejecutada.

## Síntesis final

`script` ofrece flexibilidad Groovy dentro de un pipeline declarativo, pero esa flexibilidad requiere cuidado.

- Úsalo cuando una directiva declarativa no exprese con claridad la lógica necesaria.
- Mantén el bloque pequeño, legible y con una responsabilidad concreta.
- Distingue Groovy de los comandos ejecutados por shell.
- Valida parámetros antes de utilizarlos en comandos o rutas.
- Interpreta los códigos devueltos por `returnStatus`.
- Captura errores solo cuando exista una política clara para continuar.
- Reintenta únicamente operaciones seguras y susceptibles de recuperarse.
- Respeta timeouts, cancelaciones y restricciones del sandbox.
- No llames pasos de Pipeline desde métodos `@NonCPS`.
- No imprimas secretos ni el entorno completo.
- Prueba tanto el éxito como el fallo.