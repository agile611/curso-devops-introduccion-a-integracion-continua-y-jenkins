# Capturando datos en Jenkins

Capturar datos en un pipeline significa obtener valores de distintas fuentes, interpretarlos de forma segura y utilizarlos para decidir qué hacer. Esos datos pueden proceder de parámetros, respuestas interactivas, variables de entorno, comandos, archivos, informes o ejecuciones anteriores. Cada fuente tiene un formato, un alcance y un nivel de confianza diferentes.

Esta página presenta las técnicas habituales para recoger datos en un `Jenkinsfile` declarativo. Incluye ejemplos con `params`, `input`, `env`, `sh(returnStdout: true)`, `readFile`, archivos de propiedades, resultados de comandos e informes. También explica cómo validar, registrar y compartir datos entre etapas sin confundir Groovy con la shell ni exponer secretos.

> **Seguridad:** realiza las sesiones solo en un job de laboratorio autorizado. No captures, imprimas ni archives contraseñas, tokens, claves privadas ni otros secretos. Gestiona las credenciales mediante el almacén aprobado por la instancia de Jenkins. Valida los datos antes de utilizarlos en comandos, rutas o decisiones.

---

## Fundamentos de la captura de datos

Antes de capturar un valor, identifica de dónde procede y qué parte del pipeline lo necesita.

### Qué significa capturar datos

Capturar datos es obtener un valor desde una fuente y guardarlo o utilizarlo dentro de la ejecución.

El proceso suele incluir:

1. Identificar la fuente.
2. Leer el valor.
3. Comprobar su tipo y formato.
4. Validar que sea aceptable.
5. Utilizarlo en una acción acotada.
6. Registrar el resultado necesario.
7. Evitar conservarlo más tiempo del requerido.

Capturar un dato no significa que el dato sea correcto.

Capturar un dato tampoco significa que sea seguro.

### Fuentes de datos habituales

Un pipeline puede recibir datos desde:

- Parámetros definidos en el job.
- Respuestas del paso `input`.
- Variables de entorno de Jenkins.
- Variables de entorno del agente.
- Comandos de shell.
- Archivos del workspace.
- Informes de pruebas.
- Archivos de propiedades.
- Datos del repositorio y del commit.
- Artefactos archivados.
- Plugins o bibliotecas autorizadas.
- Sistemas externos configurados por el administrador.

Cada fuente tiene reglas diferentes.

### Clasificación de fuentes

| Fuente | Ejemplo | Momento de captura | Riesgo que revisar |
|---|---|---|---|
| Parámetro | `params.MODO` | Al iniciar | Entrada inesperada |
| Entrada interactiva | `input` | Durante el pipeline | Espera y permisos |
| Entorno | `env.BUILD_NUMBER` | Durante la ejecución | Alcance y sensibilidad |
| Comando | `returnStdout` | Al ejecutar el comando | Salida y estado |
| Archivo | `readFile` | Cuando se lee | Contenido y tamaño |
| Informe | Archivo de pruebas | Tras una etapa | Formato y procedencia |
| SCM | Commit o rama | Durante checkout | Revisión exacta |
| Credencial | Almacén Jenkins | En el paso autorizado | Exposición y permisos |

### Datos de entrada, resultados y estado

Conviene distinguir tres clases de datos.

- **Entrada:** valor recibido por el pipeline.
- **Resultado:** valor producido por una comprobación o herramienta.
- **Estado:** condición general de Jenkins, como éxito, fallo o inestabilidad.

Ejemplos:

```text
Entrada: MODO = "detallado"
Resultado: código de validación = 0
Estado: ejecución = SUCCESS
```

No confundas un mensaje impreso con un resultado validado.

Un comando puede imprimir `OK` y aun así terminar con código distinto de cero.

### Dato capturado frente a dato validado

Un valor se puede leer correctamente y seguir siendo inválido.

Por ejemplo:

```text
Valor capturado: "../otra-carpeta"
```

Si se esperaba un nombre de práctica, esa ruta no debería aceptarse sin validación.

### Alcance de un dato

El alcance determina dónde está disponible un valor.

Puede ser:

- Una variable local de Groovy.
- Una etapa.
- Todo el pipeline.
- Un bloque `withEnv`.
- Un proceso de shell.
- Un archivo del workspace.
- El registro de una ejecución.

No supongas que un valor local de una shell persiste en otra.

### Ciclo de vida

Un dato puede existir solo durante una operación o durar más tiempo.

Ejemplos:

- Un parámetro está asociado a una ejecución.
- Una variable de shell suele vivir durante ese proceso.
- Un archivo puede permanecer en el workspace hasta que se limpie.
- Un artefacto puede conservarse según la retención configurada.
- Una variable de Groovy puede permanecer viva mientras Jenkins ejecuta su contexto.

Usa la opción de menor alcance y duración que resuelva la necesidad.

### Procedencia

La procedencia es la fuente y el contexto de un valor.

Al investigar un resultado, puede ser necesario saber:

- Quién proporcionó el valor.
- En qué job se recibió.
- En qué ejecución se capturó.
- Qué commit se procesó.
- Qué agente lo produjo.
- Qué comando o archivo lo generó.

La procedencia ayuda a distinguir un valor actual de uno residual o antiguo.

### Confiabilidad de los datos

Un valor puede proceder de:

- Una persona usuaria.
- Una rama revisada.
- Una rama externa.
- Una herramienta.
- Un archivo generado.
- Un servicio externo.
- El sistema operativo del agente.

No atribuyas el mismo nivel de confianza a todas las fuentes.

Valida los datos antes de utilizarlos en una operación importante.

### Datos sensibles y no sensibles

Los datos sensibles pueden incluir:

- Contraseñas.
- Tokens.
- Claves privadas.
- Credenciales de bases de datos.
- URLs secretas de webhooks.
- Datos personales.
- Información interna restringida.

No imprimas ni archives esos valores.

Un valor no es seguro solo porque se llame `VARIABLE`.

### Capturar menos

Captura solo los datos necesarios.

Evita:

- Imprimir todo el entorno.
- Leer archivos completos si solo hace falta una línea.
- Guardar salidas que no se utilizan.
- Copiar informes enteros a una notificación.
- Mantener variables más allá de la etapa que las necesita.

### Formato de los datos

Antes de procesar un valor, averigua si es:

- Cadena.
- Número.
- Booleano.
- Lista.
- Mapa.
- Archivo de texto.
- JSON.
- YAML.
- Código de salida.
- Resultado de una herramienta.

El formato condiciona cómo se valida y se consume.

### Codificación de texto

Los archivos pueden utilizar distintas codificaciones.

Si se conoce la codificación, indícala al leer el archivo cuando el paso lo permita.

Un carácter mal interpretado puede causar errores de comparación o validación.

### Tamaño de la captura

Un informe o salida puede ser grande.

Considera:

- Si hace falta leerlo completo.
- Si puede procesarse en partes.
- Si debe archivarse como artefacto.
- Si contiene datos sensibles.
- Si imprimirlo saturaría la consola.

### Valores ausentes

Decide qué hacer si un dato:

- No existe.
- Está vacío.
- Contiene solo espacios.
- Tiene un formato incorrecto.
- No puede leerse.
- No está disponible en esa clase de job.

El comportamiento debe estar definido y no depender de una suposición accidental.

### Valor predeterminado

Un valor predeterminado puede hacer más sencilla la ejecución.

Debe ser:

- Seguro.
- Válido.
- No sensible.
- Adecuado para laboratorio.
- Descrito con claridad.

Un valor predeterminado no reemplaza la validación.

### Datos obsoletos

Un workspace puede contener archivos de ejecuciones anteriores, según la configuración.

Antes de usar un archivo generado:

- Comprueba que la ejecución actual lo creó.
- Limpia o prepara el directorio de forma segura.
- Verifica fecha o contenido cuando corresponda.
- Evita consumir un artefacto residual como si fuera nuevo.

### Captura y reproducibilidad

Un pipeline reproducible debería dejar claro qué datos influyeron en el resultado.

Conserva, cuando sea apropiado y no sensible:

- Parámetros relevantes.
- Commit.
- Versión de herramientas.
- Agente.
- Resultado de validaciones.
- Nombre de los artefactos.

No guardes credenciales para hacer una ejecución “reproducible”.

### Captura y auditoría

En un proceso formal, la captura puede formar parte de un registro.

Confirma con el administrador:

- Qué valores pueden conservarse.
- Quién puede verlos.
- Cuánto tiempo se guardan.
- Qué información debe excluirse.
- Qué sistema es la fuente oficial.

### Errores de diseño

Evita:

- Capturar un valor sin utilizarlo.
- Utilizar un valor sin validarlo.
- Imprimir un valor solo para “ver qué contiene”.
- Usar datos de un archivo antiguo.
- Tratar una cadena como un booleano.
- Confiar en que un dato de usuario es seguro.

---

## Capturar datos de Jenkins y de una ejecución

Jenkins ofrece parámetros y variables de ejecución que pueden utilizarse desde un pipeline.

### Parámetros con `params`

Los parámetros de pipeline se consultan normalmente mediante `params`.

```groovy
echo "Modo elegido: ${params.MODO}"
```

En un bloque `script`, se puede guardar el valor en una variable local:

```groovy
script {
    def modo = params.MODO
    echo "Modo capturado: ${modo}"
}
```

`params.MODO` representa una entrada asociada a la ejecución.

### Definir parámetros

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona el nivel del resumen'
        )

        booleanParam(
            name: 'REVISAR_README',
            defaultValue: true,
            description: 'Comprueba la presencia de README.md'
        )
    }

    stages {
        stage('Mostrar parámetros') {
            steps {
                echo "Modo: ${params.MODO}"
                echo "Revisar README: ${params.REVISAR_README}"
            }
        }
    }
}
```

Utiliza `choice` cuando las opciones posibles sean conocidas.

Utiliza `booleanParam` cuando solo haya dos estados.

### Tipos de parámetros

Tipos habituales pueden incluir:

- `string`: texto corto.
- `text`: texto multilínea.
- `booleanParam`: verdadero o falso.
- `choice`: valor seleccionado entre opciones.
- Parámetros de archivo u otros tipos proporcionados por plugins.

La disponibilidad depende de la instancia y de los plugins.

### Validar parámetros

Un parámetro puede llegar vacío o no tener el formato esperado.

```groovy
script {
    if (!(params.MODO in ['simple', 'detallado'])) {
        error 'El modo recibido no está permitido.'
    }
}
```

Una lista `choice` reduce la posibilidad de entradas erróneas, pero no sustituye el control de permisos ni la revisión del pipeline.

### Validar texto libre

Define reglas antes de aceptar texto libre:

- Longitud máxima.
- Caracteres permitidos.
- Tratamiento de espacios.
- Valores vacíos.
- Caracteres que no se deben aceptar.
- Uso previsto del valor.

Ejemplo de validación educativa:

```groovy
script {
    if (!(params.IDENTIFICADOR ==~ /^[A-Za-z0-9-]{1,24}$/)) {
        error 'El identificador no tiene el formato permitido.'
    }
}
```

La expresión regular debe ajustarse a la necesidad real.

### No usar texto libre como comando

No ejecutes una cadena recibida como si fuera un comando:

```groovy
// No utilizar este patrón con entradas de usuario.
sh "${params.COMANDO}"
```

Una entrada de texto puede convertirse en ejecución arbitraria de comandos en el agente.

### Variables de entorno con `env`

Las variables de entorno se consultan normalmente mediante `env`.

```groovy
echo "Job: ${env.JOB_NAME}"
echo "Ejecución: ${env.BUILD_NUMBER}"
```

También se pueden leer desde una shell:

```groovy
sh 'echo "$BUILD_NUMBER"'
```

En el primer caso, Groovy accede a `env`.

En el segundo, la shell expande la variable de entorno.

### Variables de entorno declaradas por el pipeline

```groovy
pipeline {
    agent any

    environment {
        NOMBRE_CURSO = 'jenkins-laboratorio'
        DIRECTORIO_SALIDA = 'salida'
    }

    stages {
        stage('Mostrar valores') {
            steps {
                echo "Curso: ${env.NOMBRE_CURSO}"
                sh 'echo "Salida: $DIRECTORIO_SALIDA"'
            }
        }
    }
}
```

No incluyas secretos literales en `environment`.

### Alcance de `environment`

Una declaración a nivel de pipeline suele estar disponible en varias etapas.

Una declaración dentro de una etapa limita el alcance a esa etapa, sujeto a las reglas del contexto.

```groovy
stage('Comprobación') {
    environment {
        MODO_LOCAL = 'solo-esta-etapa'
    }

    steps {
        echo "Modo: ${env.MODO_LOCAL}"
    }
}
```

### `withEnv`

`withEnv` aplica variables de entorno a un bloque de pasos.

```groovy
withEnv(['MODO_TEMPORAL=practica']) {
    sh 'echo "$MODO_TEMPORAL"'
}
```

El bloque ayuda a limitar el alcance de la variable.

No uses `withEnv` como sustituto del almacén de credenciales.

### Variables de entorno de Jenkins

Jenkins puede proporcionar datos como:

- Nombre del job.
- Número de ejecución.
- URL del job.
- Workspace.
- Rama o referencia SCM.
- Nodo o agente.

La disponibilidad depende del job, los plugins y el contexto.

Comprueba la documentación de la instancia.

### `currentBuild`

`currentBuild` puede proporcionar información de la ejecución actual en contextos habituales de Pipeline.

```groovy
script {
    echo "Resultado actual: ${currentBuild.currentResult}"
}
```

El resultado puede estar sin fijar o cambiar durante la ejecución.

No uses este valor para convertir artificialmente un fallo en éxito.

### Parámetro frente a entorno

| Aspecto | Parámetro | Variable de entorno |
|---|---|---|
| Propósito habitual | Entrada de ejecución | Configuración de proceso |
| Acceso en Groovy | `params.NOMBRE` | `env.NOMBRE` |
| Puede variar por build | Sí | Depende de su definición |
| Se pasa a una shell | Puede exponerse según el job | Habitualmente sí |
| Es secreto automáticamente | No | No |

Un parámetro no es seguro por defecto.

Una variable de entorno tampoco es secreta por defecto.

### Datos de SCM

Según el tipo de job y los plugins, pueden estar disponibles datos de SCM como:

- Rama.
- Commit.
- URL del repositorio.
- Mensaje de commit.
- Autor.

No asumas que todas las variables existen en todas las ramas o trabajos.

Registra solo los datos necesarios.

### Identificar el commit procesado

Un commit identificable ayuda a relacionar el resultado con el código evaluado.

Comprueba qué paso o variable ofrece ese dato en la instancia.

No construyas una identificación a partir de una rama únicamente si necesitas saber la revisión exacta.

### Datos del agente

Puede ser útil registrar la etiqueta o el nombre del nodo.

No recopiles todo el entorno del agente para encontrarlo.

Usa variables o mecanismos documentados por Jenkins.

### Capturar una respuesta con `input`

El paso `input` permite solicitar datos durante la ejecución.

```groovy
script {
    def respuesta = input(
        message: 'Selecciona una opción de laboratorio.',
        ok: 'Guardar selección',
        parameters: [
            choice(
                name: 'OPCION',
                choices: ['breve', 'detallado'],
                description: 'Opción no sensible'
            )
        ]
    )

    echo "Opción recibida: ${respuesta}"
}
```

El paso pausa la ejecución hasta obtener una respuesta o una interrupción.

### Respuesta de un parámetro

Cuando `input` solicita un único parámetro, el valor devuelto puede ser directamente ese valor.

Comprueba el comportamiento de la versión de Jenkins y del paso utilizado.

### Respuesta con varios parámetros

Cuando se solicitan varios parámetros, el resultado puede ser una estructura con varios valores.

No asumas que siempre es una cadena.

Para prácticas iniciales, solicita un único valor y prueba su representación.

### Validar la respuesta de `input`

```groovy
script {
    def respuesta = input(
        message: 'Selecciona el formato.',
        ok: 'Confirmar',
        parameters: [
            choice(
                name: 'FORMATO',
                choices: ['breve', 'ampliado'],
                description: 'Formato del resumen'
            )
        ]
    )

    if (!(respuesta in ['breve', 'ampliado'])) {
        error 'La respuesta no está permitida.'
    }
}
```

### Timeout para entradas

Una entrada que espera respuesta puede dejar una ejecución pendiente.

Se puede limitar el tiempo con `timeout`:

```groovy
timeout(time: 5, unit: 'MINUTES') {
    input message: 'Confirma la revisión de laboratorio.',
          ok: 'Continuar'
}
```

El timeout no equivale a una aprobación.

### Quién responde

El comportamiento de autorización puede depender de `submitter`, de los permisos del job y de la configuración global.

No inventes identificadores de grupo.

Consulta al administrador antes de limitar o ampliar aprobadores.

### No capturar contraseñas con `input`

No solicites secretos mediante un formulario interactivo del pipeline.

Usa el almacén de credenciales autorizado.

No registres ni muestres una respuesta que pueda contener información confidencial.

### Datos del resultado actual

El pipeline puede recoger el estado del build para redactar un resumen.

```groovy
post {
    always {
        echo "Resultado registrado: ${currentBuild.currentResult}"
    }
}
```

Un resumen no sustituye la consola ni modifica el estado.

### Variables opcionales

Una variable puede no estar definida en todos los contextos.

Comprueba la disponibilidad antes de construir una decisión que dependa de ella.

No uses un valor ausente como si fuera una respuesta válida.

---

## Capturar datos de comandos y archivos

Los comandos y los archivos pueden producir datos que el pipeline necesita procesar.

### Salida estándar con `returnStdout`

`sh(returnStdout: true, ...)` devuelve la salida estándar de un comando como texto.

```groovy
script {
    def salida = sh(
        returnStdout: true,
        script: 'printf "laboratorio\\n"'
    ).trim()

    echo "Valor capturado: ${salida}"
}
```

`.trim()` elimina espacios y saltos de línea al principio y al final.

### Cuándo usar `returnStdout`

Puede ser útil para capturar:

- Una versión de una herramienta.
- Un identificador no sensible.
- Un resultado de una consulta local.
- Una línea producida por un script.
- Un valor derivado de archivos versionados.

### Salida estándar no es estado de éxito

`returnStdout` captura texto.

No significa que debas ignorar el código de salida.

Si el comando falla, Jenkins normalmente puede generar una excepción del paso.

### Evitar capturar salidas enormes

No captures salidas muy grandes en una variable de Groovy.

Puede:

- Aumentar el uso de memoria.
- Dificultar la lectura.
- Hacer lentas las ejecuciones.
- Exponer datos accidentales.
- Complicar la persistencia del pipeline.

Archiva la salida como archivo cuando corresponda.

### Salida de error

`returnStdout` captura la salida estándar.

La salida de error puede seguir apareciendo en la consola.

No asumas que ambos canales se combinan automáticamente.

### Recortar saltos de línea

Muchos comandos imprimen un salto final.

Sin `.trim()`, una comparación puede fallar por ese carácter.

```groovy
def version = sh(
    returnStdout: true,
    script: 'printf "1.0.0\\n"'
).trim()
```

### Comparar el valor capturado

```groovy
script {
    def version = sh(
        returnStdout: true,
        script: 'printf "1.0.0\\n"'
    ).trim()

    if (version == '1.0.0') {
        echo 'Versión esperada.'
    } else {
        error "Versión inesperada: ${version}"
    }
}
```

No imprimas la salida si pudiera contener datos sensibles.

### Salida de herramienta externa

Una herramienta puede devolver:

- Texto de estado.
- Un identificador.
- Un informe resumido.
- Una versión.
- Un aviso.

Valida la estructura antes de utilizarla.

No confíes en que toda herramienta devuelva siempre el mismo formato.

### `returnStatus`

`returnStatus: true` captura el código de salida en vez de fallar automáticamente el paso por un código no cero.

```groovy
script {
    int codigo = sh(
        returnStatus: true,
        script: 'test -f README.md'
    )

    echo "Código de salida: ${codigo}"
}
```

### Interpretar el código de salida

```groovy
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
```

Si no compruebas el valor, el pipeline puede continuar sin reflejar el fallo.

### `returnStdout` y `returnStatus`

Los dos mecanismos capturan cosas diferentes.

- `returnStdout`: devuelve texto.
- `returnStatus`: devuelve el código del proceso.

No son alternativas idénticas.

Un flujo puede necesitar texto y estado, pero debe diseñarse con cuidado para no perder errores.

### No usar `|| true` como sustituto

`|| true` puede forzar un resultado de shell exitoso.

No es una manera segura de capturar una salida si el comando es obligatorio.

### Obtener una versión

```groovy
script {
    def version = sh(
        returnStdout: true,
        script: 'python3 --version 2>&1'
    ).trim()

    echo "Versión detectada: ${version}"
}
```

La ubicación de la versión puede depender de la herramienta y la plataforma.

Usa comandos compatibles con el agente.

### Comprobar la existencia de un archivo

`fileExists` permite comprobar una ruta relativa al workspace en contextos compatibles.

```groovy
script {
    if (fileExists('README.md')) {
        echo 'README presente.'
    } else {
        error 'Falta README.md.'
    }
}
```

Es una comprobación del workspace, no de cualquier ruta del sistema.

### Leer un archivo con `readFile`

`readFile` permite leer un archivo del workspace como texto.

```groovy
script {
    def contenido = readFile('app/mensaje.txt')
    echo "Longitud capturada: ${contenido.length()}"
}
```

No imprimas el contenido completo si no es necesario.

### Leer con codificación

Cuando se necesita una codificación determinada, el paso puede aceptar una opción como `encoding`, según la versión.

```groovy
script {
    def contenido = readFile(
        file: 'app/mensaje.txt',
        encoding: 'UTF-8'
    )

    echo "Caracteres leídos: ${contenido.length()}"
}
```

Comprueba la sintaxis disponible en la instancia.

### Leer solo información necesaria

Si solo necesitas saber si una palabra aparece, puede ser preferible una comprobación acotada:

```groovy
sh 'grep -q "Jenkins" app/mensaje.txt'
```

Así evitas cargar e imprimir el archivo entero.

La disponibilidad de `grep` depende del agente.

### Archivos ausentes

Comprueba si el archivo existe antes de leerlo:

```groovy
script {
    if (!fileExists('app/mensaje.txt')) {
        error 'No existe app/mensaje.txt.'
    }

    def contenido = readFile('app/mensaje.txt')
    echo "Archivo leído: ${contenido.length()} caracteres."
}
```

### Leer propiedades

El paso `readProperties` suele estar disponible mediante Pipeline Utility Steps.

```groovy
script {
    def propiedades = readProperties file: 'config.properties'
    echo "Modo de validación: ${propiedades.MODO}"
}
```

El plugin y el paso deben estar instalados.

Comprueba la referencia local antes de utilizarlo.

### Archivo de propiedades de ejemplo

```properties
MODO=simple
NIVEL=1
```

Ese archivo no debería contener credenciales.

Las propiedades capturadas siguen necesitando validación.

### Acceder a una propiedad ausente

```groovy
script {
    def propiedades = readProperties file: 'config.properties'
    def modo = propiedades.MODO

    if (!modo) {
        error 'Falta la propiedad MODO.'
    }

    echo "Modo capturado: ${modo}"
}
```

Comprueba si el valor es `null`, vacío o solo espacios.

### Leer JSON

`readJSON` suele depender de Pipeline Utility Steps.

Ejemplo ilustrativo:

```groovy
script {
    def datos = readJSON file: 'salida/resumen.json'
    echo "Estado capturado: ${datos.estado}"
}
```

Confirma el plugin, la versión y la estructura del documento.

### Validar el contenido JSON

Comprueba:

- Que el archivo existe.
- Que el JSON es válido.
- Que contiene las claves necesarias.
- Que cada valor tiene el tipo esperado.
- Que los valores están permitidos.
- Que no contiene datos sensibles.

### JSON con acceso por clave

```groovy
script {
    def datos = readJSON file: 'salida/resumen.json'

    if (!datos.containsKey('estado')) {
        error 'El JSON no contiene la clave estado.'
    }

    echo "Estado: ${datos.estado}"
}
```

La forma de acceder depende del objeto devuelto por el paso.

### Leer YAML

`readYaml` puede estar disponible mediante un plugin.

```groovy
script {
    def configuracion = readYaml file: 'config.yml'
    echo "Entorno de laboratorio: ${configuracion.entorno}"
}
```

Confirma que el plugin existe y que la estructura del YAML es la esperada.

### No evaluar archivos como código

Lee datos con pasos específicos de parseo.

No uses mecanismos que ejecuten como código un archivo de entrada.

Un archivo de configuración debe tratarse como datos, no como una fuente de instrucciones arbitrarias.

### Capturar datos de pruebas

Las pruebas pueden producir:

- JUnit XML.
- Cobertura.
- Informes HTML.
- JSON.
- Archivos de texto.
- Métricas.

Cada formato requiere un paso o plugin apropiado.

### Publicar resultados JUnit

El paso `junit` suele publicar informes XML:

```groovy
junit 'reports/*.xml'
```

La disponibilidad y los patrones dependen del plugin y la configuración.

Una prueba fallida puede afectar el resultado del build según la configuración.

### Publicar cobertura

La publicación de cobertura depende de herramientas y plugins.

No asumas que un número de cobertura, por sí solo, significa que las pruebas pasaron.

Valida el origen y el formato del informe.

### Capturar un resumen de pruebas

Puede ser más claro dejar que el plugin publique el informe y usar el `Jenkinsfile` para registrar un resumen breve.

No analices un XML complejo con operaciones improvisadas si existe un paso de publicación compatible.

### Artefactos

`archiveArtifacts` conserva archivos asociados a una ejecución, sujeto a la retención.

```groovy
archiveArtifacts artifacts: 'salida/resumen.txt',
                 fingerprint: true
```

Comprueba que el patrón solo incluye archivos previstos.

### Artefacto y captura

Archivar un archivo no equivale a leerlo.

Puedes:

- Capturar una pequeña parte para una condición.
- Archivar el archivo completo para consulta.
- Publicar un informe con un plugin.
- Mantener la consola breve.

### Capturar archivos de una etapa a otra

El workspace puede permanecer disponible entre etapas según el agente y el diseño.

No asumas que se comparte cuando:

- Se usan agentes distintos.
- Se cambia de nodo.
- Se ejecutan etapas paralelas.
- La instancia usa workspaces aislados.

### `stash` y `unstash`

`stash` y `unstash` permiten conservar y recuperar archivos dentro de un mismo pipeline, en contextos compatibles.

```groovy
stash name: 'salida-validacion',
      includes: 'salida/resumen.txt'
```

En otra etapa:

```groovy
unstash 'salida-validacion'
```

Un stash no es almacenamiento permanente.

No lo uses para guardar secretos ni grandes cantidades de archivos sin revisar su efecto.

### `archiveArtifacts` frente a `stash`

| Mecanismo | Propósito habitual | Duración |
|---|---|---|
| `stash` | Compartir archivos entre etapas | Dentro del flujo compatible |
| `archiveArtifacts` | Conservar archivos asociados al build | Según retención |
| Workspace | Trabajo temporal del agente | Depende de limpieza |
| SCM | Código versionado | Según política del repositorio |

Elige según el uso previsto.

### Archivar antes de limpiar

Si un archivo debe conservarse:

1. Créalo.
2. Comprueba que existe.
3. Archívalo o publícalo.
4. Limpia el workspace si corresponde.

No limpies antes de guardar la evidencia requerida.

---

## Validación, seguridad y prácticas

Los datos capturados deben validarse, utilizarse con un propósito y manejarse de forma segura.

### Normalizar datos

La normalización transforma un valor a una forma coherente.

Puede incluir:

- Eliminar espacios alrededor.
- Convertir a minúsculas.
- Convertir saltos de línea.
- Canonizar una etiqueta permitida.
- Interpretar números con un formato conocido.

Normalizar no significa aceptar cualquier entrada.

### Ejemplo de normalización

```groovy
script {
    def modo = params.MODO?.trim()?.toLowerCase()

    if (!(modo in ['simple', 'detallado'])) {
        error 'El modo normalizado no está permitido.'
    }

    echo "Modo aceptado: ${modo}"
}
```

### Validar longitud

Un valor demasiado largo puede causar problemas de presentación, rutas o herramientas.

Define una longitud máxima acorde con su propósito.

### Validar formato

Si se espera un identificador, define los caracteres permitidos.

No admitas comandos, rutas o expresiones completas cuando se espera solo un nombre.

### Validar opciones cerradas

```groovy
def permitidos = ['simple', 'detallado']

if (!(params.MODO in permitidos)) {
    error 'Valor no permitido.'
}
```

La lista permitida debe mantenerse sincronizada con la lógica que procesa cada valor.

### Validar el tipo

Comprueba si el dato es realmente:

- Booleano.
- Número.
- Cadena.
- Lista.
- Mapa.

No conviertas silenciosamente valores inesperados.

### Validar datos de archivos

Antes de consumir un archivo:

- Verifica que existe.
- Comprueba el tamaño si procede.
- Valida el formato.
- Comprueba las claves necesarias.
- Limita qué rutas se procesan.
- Considera la procedencia del archivo.
- Evita ejecutar su contenido.

### Validar archivos generados

No asumas que un archivo generado es correcto solo porque existe.

Comprueba:

- Que se creó en esta ejecución.
- Que tiene contenido válido.
- Que su formato se puede leer.
- Que el productor terminó correctamente.
- Que no es un archivo residual.

### Inyección de comandos

Una entrada no validada puede alterar la interpretación de una orden de shell.

Evita construir comandos así:

```groovy
sh "herramienta ${params.OPCION}"
```

si `OPCION` es texto libre o puede contener caracteres especiales.

### Preferir opciones limitadas

Una lista `choice` reduce el conjunto de valores:

```groovy
choice(
    name: 'MODO',
    choices: ['simple', 'detallado'],
    description: 'Modo permitido'
)
```

Aun así, valida el valor antes de una acción importante.

### Comillas y expansión

Estas expresiones pertenecen a intérpretes distintos:

```groovy
echo "Valor Groovy: ${env.MODO}"
```

```groovy
sh 'echo "$MODO"'
```

No mezcles interpolación Groovy y expansión de shell sin comprender el orden.

### No registrar secretos

No uses:

```groovy
echo "${params.TOKEN}"
```

No uses:

```groovy
sh 'env'
```

No muestres la salida de una herramienta que pudiera incluir credenciales.

### Usar credenciales correctamente

Para un secreto:

- Consulta el almacén de credenciales aprobado.
- Limita el acceso al job o a la etapa que lo necesita.
- Utiliza el tipo de credencial correcto.
- Evita imprimirlo.
- No lo guardes en archivos permanentes.
- Sigue las recomendaciones de la instancia.

La sintaxis depende del plugin y de la configuración local.

### Enmascaramiento no es garantía

Un sistema puede intentar enmascarar valores en la consola.

Eso no garantiza protección frente a:

- Procesos que leen el entorno.
- Argumentos visibles.
- Archivos temporales.
- Transformaciones del valor.
- Logs externos.
- Capturas de pantalla.
- Código malicioso en el agente.

### Minimizar la conservación

Conserva solo lo necesario.

Para cada dato, responde:

- ¿Se usa después?
- ¿Debe verse en consola?
- ¿Debe archivarse?
- ¿Cuánto tiempo se necesita?
- ¿Quién puede acceder?
- ¿Contiene datos personales o secretos?

### Evitar datos personales innecesarios

No pidas ni guardes nombres personales si basta con un identificador de grupo.

Sigue la política de protección de datos de la organización.

### Procedencia del dato

Cuando una decisión dependa de un valor, registra su origen si es útil:

```text
Valor: simple
Origen: parámetro MODO
Ejecución: job-laboratorio #12
```

No registres información personal que no se necesita.

### Capturar muchos valores

Si se reciben muchos datos:

- Define un esquema.
- Valida cada campo.
- Documenta valores permitidos.
- Evita nombres ambiguos.
- Mantén una salida resumen.
- Separa datos sensibles y no sensibles.

### Concurrencia y datos compartidos

Si varias ejecuciones comparten una ruta o recurso:

- Usa nombres únicos cuando corresponda.
- Limita concurrencia si es necesario.
- Evita sobrescribir archivos de otra ejecución.
- No guardes estado en un archivo global compartido sin controles.

### Datos en paralelo

Las etapas paralelas pueden escribir simultáneamente.

Si capturan resultados en archivos:

- Usa nombres diferentes por rama.
- Evita escrituras concurrentes al mismo archivo.
- Espera a que las ramas completen antes de agregar resultados.
- No compartas variables mutables sin entender el modelo de Pipeline.

### Errores de lectura

Un error al capturar datos puede indicar:

- Archivo ausente.
- Permisos insuficientes.
- Codificación inesperada.
- JSON o YAML inválido.
- Plugin ausente.
- Workspace equivocado.
- Agente distinto.
- Ruta relativa incorrecta.

Registra qué fuente falló sin exponer su contenido sensible.

### Mensajes de diagnóstico

Un mensaje útil identifica la fuente y la regla:

```text
El archivo config.properties no contiene la propiedad MODO.
```

Evita mensajes vagos:

```text
No funciona.
```

### Captura de datos en `post`

El bloque `post` puede consultar información de la ejecución y publicar un resumen.

No asumas que todos los archivos temporales siguen disponibles en cualquier condición de finalización.

Prueba el comportamiento en el pipeline real.

### Capturar datos de comandos fallidos

Si el comando falla, decide si necesitas:

- Su código de salida.
- Su salida estándar.
- Su salida de error.
- Un archivo de diagnóstico.
- El resultado final de Jenkins.

No ocultes el fallo al capturar sus datos.

### Buenas prácticas de nombres

Prefiere nombres descriptivos:

```text
modoSeleccionado
versionHerramienta
codigoValidacion
resumenPruebas
```

Evita:

```text
x
dato
valor2
salida1
```

### Buenas prácticas de estructura

Separa las responsabilidades:

- Leer.
- Validar.
- Transformar.
- Utilizar.
- Registrar.

Un flujo claro facilita revisar dónde puede introducirse un dato inseguro.

### Buenas prácticas de revisión

Al revisar una captura, pregunta:

- ¿Cuál es la fuente?
- ¿Es confiable?
- ¿Qué tipo tiene?
- ¿Qué pasa si está vacío?
- ¿Se valida?
- ¿Dónde se usa?
- ¿Se imprime?
- ¿Se conserva?
- ¿Puede afectar otra ejecución?

### Diagnóstico de datos vacíos

Comprueba:

- Nombre exacto del parámetro.
- Declaración del parámetro.
- Rama del `Jenkinsfile`.
- Tipo del parámetro.
- Cómo se inició el job.
- Alcance de la variable.
- Si la herramienta produce salida.
- Si `.trim()` eliminó todo el contenido.

### Diagnóstico de dato incorrecto

Comprueba:

- Valor original.
- Normalización aplicada.
- Tipo de dato.
- Espacios y saltos de línea.
- Codificación.
- Ruta o workspace.
- Commit.
- Agente.
- Formato producido por la herramienta.

### Diagnóstico del archivo ausente

Comprueba:

- Que se hizo checkout.
- Que la ruta es relativa al workspace correcto.
- Que la rama contiene el archivo.
- Que otra etapa no lo eliminó.
- Que el agente actual dispone del archivo.
- Que un `stash` o `unstash` se usó correctamente.

### Diagnóstico de `returnStdout`

Comprueba:

- Que el comando produjo salida estándar.
- Que la salida no se escribió a `stderr`.
- Que `.trim()` no dejó una cadena vacía.
- Que el comando terminó correctamente.
- Que la salida no contiene más de una línea.
- Que la codificación es la esperada.

### Diagnóstico de parseo JSON o YAML

Comprueba:

- Que el plugin está instalado.
- Que el archivo es válido.
- Que la ruta es correcta.
- Que la estructura corresponde a la esperada.
- Que las claves existen.
- Que los tipos son compatibles.
- Que no se procesó un archivo parcial.

### Datos de un plugin

Si un paso de plugin no existe:

- Confirma que el plugin está instalado.
- Revisa el nombre del paso.
- Comprueba la versión.
- Consulta la referencia local.
- No instales plugins sin autorización.

### Procedimiento de diagnóstico

1. Anota el job y el número de ejecución.
2. Identifica la fuente del dato.
3. Comprueba si llegó al pipeline.
4. Comprueba el tipo y el formato.
5. Revisa la ruta o el alcance.
6. Valida la salida del productor.
7. Aísla la etapa que falla.
8. Registra una hipótesis.
9. Cambia una sola cosa.
10. Verifica el resultado con una ejecución válida y otra inválida.

---

## Sesiones prácticas

Las prácticas proponen capturar datos de distintas fuentes con valores no sensibles y resultados reproducibles.

### Preparación general

Antes de empezar:

- Utiliza un job de laboratorio.
- Confirma el agente disponible.
- Usa una rama de práctica.
- No configures notificaciones externas.
- No uses credenciales reales.
- No ejecutes comandos destructivos.
- Anota el número de cada ejecución.
- Restaura archivos modificados al terminar.

### Proyecto de laboratorio

Estructura sugerida:

```text
captura-datos/
├── Jenkinsfile
├── README.md
├── config.properties
├── app/
│   └── mensaje.txt
├── scripts/
│   └── validar.sh
└── salida/
```

Crea el contenido inicial:

```bash
mkdir -p app scripts salida
printf 'Captura de datos en Jenkins\n' > README.md
printf 'El pipeline puede leer este archivo.\n' > app/mensaje.txt
```

Crea un script sencillo:

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

test -f app/mensaje.txt
grep -q "pipeline" app/mensaje.txt
echo "VALIDACION=correcta"
EOF
```

Crea un archivo de propiedades no sensible:

```bash
cat > config.properties <<'EOF'
MODO=simple
NIVEL=1
EOF
```

### Sesión 1: capturar un parámetro de selección

**Objetivo:** leer una opción elegida al iniciar el job.

#### Pipeline

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona el nivel del resumen'
        )
    }

    stages {
        stage('Capturar modo') {
            steps {
                script {
                    def modo = params.MODO
                    echo "Modo capturado: ${modo}"
                }
            }
        }
    }
}
```

#### Instrucciones

1. Identifica la declaración del parámetro.
2. Identifica su lectura en Groovy.
3. Ejecuta con `simple`.
4. Anota el mensaje.
5. Ejecuta con `detallado`.
6. Compara ambas ejecuciones.
7. Registra el número de cada build.

#### Preguntas

- ¿En qué momento se proporciona el valor?
- ¿Qué objeto permite consultarlo?
- ¿Qué impide que se escriba una opción no incluida en la lista?
- ¿El parámetro se convierte en secreto por ser parámetro?

### Sesión 2: capturar un booleano

**Objetivo:** leer una opción de dos estados.

#### Pipeline

```groovy
pipeline {
    agent any

    parameters {
        booleanParam(
            name: 'REVISAR_README',
            defaultValue: true,
            description: 'Comprueba que existe README.md'
        )
    }

    stages {
        stage('Capturar opción') {
            steps {
                script {
                    if (params.REVISAR_README) {
                        echo 'La revisión de README está activada.'
                        sh 'test -f README.md'
                    } else {
                        echo 'La revisión de README está desactivada.'
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta con la opción activada.
2. Comprueba si aparece la salida de validación.
3. Ejecuta con la opción desactivada.
4. Compara los mensajes.
5. Explica por qué un booleano es más claro que el texto `"true"` o `"false"`.

### Sesión 3: validar un parámetro de texto

**Objetivo:** limitar el formato de una entrada.

#### Pipeline

```groovy
pipeline {
    agent any

    parameters {
        string(
            name: 'IDENTIFICADOR',
            defaultValue: 'grupo-1',
            description: 'Usa letras, números y guiones'
        )
    }

    stages {
        stage('Validar entrada') {
            steps {
                script {
                    if (!(params.IDENTIFICADOR ==~ /^[A-Za-z0-9-]{1,24}$/)) {
                        error 'El identificador no cumple el formato permitido.'
                    }

                    echo "Identificador aceptado: ${params.IDENTIFICADOR}"
                }
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta con `grupo-1`.
2. Ejecuta con `equipoA`.
3. Prueba un espacio si el formulario lo permite.
4. Prueba un texto más largo que el límite.
5. Registra qué valores se aceptan.
6. No introduzcas datos personales ni comandos.

#### Preguntas

- ¿Qué caracteres permite la expresión?
- ¿Cuál es la longitud máxima?
- ¿Qué sucede con una cadena vacía?
- ¿Por qué se valida antes de utilizar el valor?

### Sesión 4: capturar una respuesta con `input`

**Objetivo:** solicitar un dato durante la ejecución.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Elegir presentación') {
            steps {
                script {
                    def formato = input(
                        message: 'Selecciona el formato del resumen.',
                        ok: 'Guardar selección',
                        parameters: [
                            choice(
                                name: 'FORMATO',
                                choices: ['breve', 'detallado'],
                                description: 'Opción de laboratorio'
                            )
                        ]
                    )

                    echo "Formato capturado: ${formato}"
                }
            }
        }
    }
}
```

#### Instrucciones

1. Inicia el pipeline.
2. Espera a que aparezca la solicitud.
3. Revisa el mensaje.
4. Selecciona `breve`.
5. Registra el valor mostrado.
6. Ejecuta otra vez con `detallado`.
7. Compara las respuestas.

#### Preguntas

- ¿Qué diferencia hay entre esta entrada y un parámetro inicial?
- ¿En qué punto se detiene la ejecución?
- ¿Qué ocurre si nadie responde?
- ¿Por qué no se deben solicitar contraseñas mediante `input`?

### Sesión 5: limitar el tiempo de una entrada

**Objetivo:** observar que una respuesta interactiva necesita un comportamiento definido.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Entrada limitada') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    input message: 'Confirma la revisión de laboratorio.',
                          ok: 'Continuar'
                }
            }
        }

        stage('Después de la entrada') {
            steps {
                echo 'La ejecución continuó después de la respuesta.'
            }
        }
    }
}
```

#### Instrucciones

1. Inicia la ejecución.
2. Responde antes del límite.
3. Comprueba si la etapa posterior se ejecuta.
4. No dejes una ejecución pendiente sin supervisión.
5. Registra el resultado observado.
6. Explica por qué el timeout no equivale a aprobación.

### Sesión 6: capturar la salida estándar

**Objetivo:** recoger una salida breve de un comando.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Capturar salida') {
            steps {
                script {
                    def texto = sh(
                        returnStdout: true,
                        script: 'printf "resultado-laboratorio\\n"'
                    ).trim()

                    echo "Texto capturado: ${texto}"
                }
            }
        }
    }
}
```

#### Instrucciones

1. Identifica el comando que produce la salida.
2. Explica qué hace `returnStdout`.
3. Explica qué elimina `.trim()`.
4. Ejecuta el pipeline.
5. Anota el texto capturado.

### Sesión 7: comparar salida con un valor esperado

**Objetivo:** convertir el dato capturado en una comprobación.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Comparar salida') {
            steps {
                script {
                    def resultado = sh(
                        returnStdout: true,
                        script: 'printf "VALIDACION=correcta\\n"'
                    ).trim()

                    if (resultado == 'VALIDACION=correcta') {
                        echo 'La salida coincide con el valor esperado.'
                    } else {
                        error "Salida inesperada: ${resultado}"
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Predice la rama que se ejecutará.
2. Ejecuta el pipeline.
3. Cambia el texto fijo en una rama de práctica.
4. Vuelve a ejecutar.
5. Comprueba cómo responde la comparación.
6. No imprimas salidas que puedan contener secretos.

### Sesión 8: capturar un código de salida

**Objetivo:** manejar explícitamente el resultado numérico de un comando.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Código de salida') {
            steps {
                script {
                    int codigo = sh(
                        returnStatus: true,
                        script: 'test -f README.md'
                    )

                    echo "Código capturado: ${codigo}"

                    if (codigo != 0) {
                        error 'La comprobación del archivo falló.'
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta con `README.md` presente.
2. Registra el código.
3. Cambia la ruta en una rama de laboratorio.
4. Ejecuta de nuevo.
5. Comprueba que el código se interpreta.
6. Restaura la ruta.

#### Preguntas

- ¿Qué valor suele indicar éxito para este comando?
- ¿Qué hace `returnStatus`?
- ¿Qué ocurriría si se eliminara la condición `if`?

### Sesión 9: leer un archivo con `readFile`

**Objetivo:** capturar texto del workspace.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Leer archivo') {
            steps {
                script {
                    if (!fileExists('app/mensaje.txt')) {
                        error 'No existe app/mensaje.txt.'
                    }

                    def contenido = readFile(
                        file: 'app/mensaje.txt',
                        encoding: 'UTF-8'
                    )

                    echo "Longitud del contenido: ${contenido.length()}"
                }
            }
        }
    }
}
```

#### Instrucciones

1. Comprueba que el archivo existe.
2. Ejecuta el pipeline.
3. Anota la longitud mostrada.
4. Cambia el contenido en la rama de práctica.
5. Ejecuta de nuevo.
6. Evita mostrar contenido completo si no es necesario.

### Sesión 10: validar contenido sin imprimirlo completo

**Objetivo:** comprobar una condición de texto de forma acotada.

#### Variante con Groovy

```groovy
script {
    def contenido = readFile('app/mensaje.txt')

    if (!contenido.contains('pipeline')) {
        error 'El archivo no contiene la palabra requerida.'
    }

    echo 'El archivo contiene el texto esperado.'
}
```

#### Variante con shell

```groovy
sh 'grep -q "pipeline" app/mensaje.txt'
```

#### Actividad

1. Compara qué intérprete procesa cada variante.
2. Ejecuta ambas con el archivo válido.
3. Cambia el contenido de forma controlada.
4. Ejecuta de nuevo.
5. Compara el detalle de la consola.

### Sesión 11: leer propiedades

**Objetivo:** capturar configuración no sensible.

#### Archivo

```properties
MODO=simple
NIVEL=1
```

#### Pipeline ilustrativo

```groovy
pipeline {
    agent any

    stages {
        stage('Leer propiedades') {
            steps {
                script {
                    def propiedades = readProperties(
                        file: 'config.properties'
                    )

                    def modo = propiedades.MODO

                    if (!(modo in ['simple', 'detallado'])) {
                        error 'El modo del archivo no está permitido.'
                    }

                    echo "Modo capturado: ${modo}"
                }
            }
        }
    }
}
```

`readProperties` suele depender de Pipeline Utility Steps.

#### Instrucciones

1. Confirma que el plugin está disponible.
2. Revisa el archivo de propiedades.
3. Ejecuta el pipeline.
4. Cambia `MODO` a un valor permitido.
5. Prueba un valor no permitido en una rama de laboratorio.
6. Explica por qué el archivo no debe contener secretos.

### Sesión 12: leer y validar JSON

**Objetivo:** capturar un campo de un archivo JSON.

#### Archivo de ejemplo

```json
{
  "estado": "correcto",
  "modo": "simple"
}
```

#### Pipeline ilustrativo

```groovy
pipeline {
    agent any

    stages {
        stage('Leer resumen JSON') {
            steps {
                script {
                    def datos = readJSON file: 'salida/resumen.json'

                    if (!datos.containsKey('estado')) {
                        error 'El JSON no contiene el campo estado.'
                    }

                    if (!(datos.estado in ['correcto', 'revisar'])) {
                        error 'El estado JSON no está permitido.'
                    }

                    echo "Estado capturado: ${datos.estado}"
                }
            }
        }
    }
}
```

`readJSON` suele depender de Pipeline Utility Steps.

#### Instrucciones

1. Comprueba que el archivo es JSON válido.
2. Ejecuta el pipeline.
3. Cambia el valor de `estado`.
4. Prueba un valor inesperado.
5. Registra el resultado.
6. No uses JSON para transportar credenciales.

### Sesión 13: capturar y archivar un resultado

**Objetivo:** distinguir lectura de archivo y conservación de artefacto.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Crear resumen') {
            steps {
                sh 'mkdir -p salida'
                sh 'printf "Resultado: correcto\\n" > salida/resumen.txt'
            }
        }

        stage('Capturar y archivar') {
            steps {
                script {
                    if (!fileExists('salida/resumen.txt')) {
                        error 'No se creó el resumen esperado.'
                    }

                    def resumen = readFile('salida/resumen.txt').trim()
                    echo "Resumen capturado: ${resumen}"
                }

                archiveArtifacts artifacts: 'salida/resumen.txt',
                                 fingerprint: true
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta el pipeline.
2. Comprueba la captura en consola.
3. Comprueba el artefacto archivado.
4. Explica la diferencia entre `readFile` y `archiveArtifacts`.
5. No incluyas secretos en el archivo.

### Sesión 14: compartir un archivo con `stash`

**Objetivo:** transferir un archivo entre etapas compatibles.

#### Pipeline ilustrativo

```groovy
pipeline {
    agent any

    stages {
        stage('Crear salida') {
            steps {
                sh 'mkdir -p salida'
                sh 'printf "Compartido entre etapas\\n" > salida/resumen.txt'

                stash name: 'resumen-lab',
                      includes: 'salida/resumen.txt'
            }
        }

        stage('Recuperar salida') {
            steps {
                unstash 'resumen-lab'

                script {
                    def texto = readFile('salida/resumen.txt').trim()
                    echo "Texto recuperado: ${texto}"
                }
            }
        }
    }
}
```

#### Instrucciones

1. Identifica dónde se crea el archivo.
2. Identifica dónde se guarda en el stash.
3. Identifica dónde se recupera.
4. Ejecuta el pipeline.
5. Explica por qué `stash` no es almacenamiento permanente.

### Sesión 15: procesar una lista pequeña

**Objetivo:** comprobar varios archivos requeridos.

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
                        if (!fileExists(archivo)) {
                            error "Falta el archivo: ${archivo}"
                        }

                        echo "Archivo encontrado: ${archivo}"
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Enumera los archivos que se comprueban.
2. Ejecuta con todos presentes.
3. Omite un archivo en una rama de práctica.
4. Observa el mensaje.
5. Restaura el archivo.
6. Explica por qué la lista es fija y no la proporciona un parámetro libre.

### Sesión 16: capturar una versión de herramienta

**Objetivo:** registrar un dato del agente para reproducibilidad.

#### Pipeline Unix ilustrativo

```groovy
pipeline {
    agent any

    stages {
        stage('Identificar herramienta') {
            steps {
                script {
                    def version = sh(
                        returnStdout: true,
                        script: 'python3 --version 2>&1'
                    ).trim()

                    echo "Python detectado: ${version}"
                }
            }
        }
    }
}
```

#### Instrucciones

1. Comprueba si el agente dispone de Python 3.
2. Ejecuta el pipeline.
3. Registra la versión observada.
4. Explica por qué puede variar entre agentes.
5. No asumas que todos los nodos tienen la misma herramienta.

### Sesión 17: capturar metadatos de ejecución

**Objetivo:** construir un resumen con datos de Jenkins.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Resumen de ejecución') {
            steps {
                script {
                    def nombreJob = env.JOB_NAME
                    def numeroBuild = env.BUILD_NUMBER
                    def resumen = "${nombreJob} #${numeroBuild}"

                    echo "Ejecución: ${resumen}"
                }
            }
        }
    }
}
```

#### Instrucciones

1. Identifica qué valores proporciona Jenkins.
2. Identifica qué valor calcula Groovy.
3. Ejecuta el pipeline.
4. Anota el resumen.
5. Indica qué información no debería añadirse a este mensaje.

### Sesión 18: comparar datos actuales con un parámetro

**Objetivo:** combinar dos fuentes de datos.

#### Pipeline

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Modo solicitado'
        )
    }

    environment {
        MODO_PREDETERMINADO = 'simple'
    }

    stages {
        stage('Comparar valores') {
            steps {
                script {
                    def solicitado = params.MODO
                    def predeterminado = env.MODO_PREDETERMINADO

                    echo "Solicitado: ${solicitado}"
                    echo "Predeterminado: ${predeterminado}"

                    if (solicitado == predeterminado) {
                        echo 'La selección coincide con el valor predeterminado.'
                    } else {
                        echo 'La selección difiere del valor predeterminado.'
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Identifica el origen de cada valor.
2. Ejecuta con cada modo.
3. Comprueba la comparación.
4. Explica por qué los dos valores no son la misma clase de dato.

### Sesión 19: investigar una captura vacía

**Objetivo:** diagnosticar una salida de comando vacía.

#### Pipeline de prueba

```groovy
script {
    def valor = sh(
        returnStdout: true,
        script: 'printf ""'
    ).trim()

    if (valor == '') {
        echo 'La salida capturada está vacía.'
    } else {
        echo 'Se capturó un valor.'
    }
}
```

#### Instrucciones

1. Predice el mensaje.
2. Ejecuta el bloque.
3. Cambia el comando para producir texto fijo.
4. Ejecuta de nuevo.
5. Explica la diferencia entre salida vacía y código de salida fallido.

### Sesión 20: revisar una captura insegura

**Objetivo:** detectar exposición e interpolación peligrosa.

#### Fragmento para analizar

```groovy
script {
    echo "Token: ${params.TOKEN}"
    sh "echo ${params.COMANDO}"
}
```

#### Actividad

1. Identifica qué valores se exponen.
2. Identifica qué valor puede convertirse en comando.
3. Explica por qué no es aceptable.
4. Propón un uso de credenciales autorizado.
5. Propón una lista cerrada en lugar de texto libre.
6. No ejecutes el fragmento.

### Sesión 21: construir un resumen seguro

**Objetivo:** imprimir solo datos no sensibles y útiles.

#### Campos permitidos

- Job.
- Número de ejecución.
- Modo seleccionado.
- Resultado final.
- Mensaje de acción recomendada.

#### Campos excluidos

- Contraseñas.
- Tokens.
- Entorno completo.
- Datos personales innecesarios.
- Contenido completo de archivos.

#### Plantilla del resumen

```groovy
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
```

#### Instrucciones

1. Ejecuta con éxito.
2. Ejecuta con un fallo controlado.
3. Compara los resúmenes.
4. Comprueba que el estado corresponde a la ejecución.
5. Revisa que no se imprima información sensible.

### Sesión 22: comparar captura en Groovy y en shell

**Objetivo:** localizar cuándo se transforma cada valor.

#### Variante Groovy

```groovy
script {
    def texto = 'laboratorio'
    echo "Valor: ${texto}"
}
```

#### Variante shell

```groovy
sh 'TEXTO="laboratorio"; echo "$TEXTO"'
```

#### Actividad

1. Indica quién interpreta cada variable.
2. Explica cuánto dura la variable de shell.
3. Añade un segundo paso `sh`.
4. Comprueba si la variable local persiste.
5. Explica por qué un proceso nuevo puede no conocer el valor.

### Sesión 23: capturar resultados de pruebas

**Objetivo:** relacionar archivos de prueba y publicación.

#### Actividad

1. Identifica el formato de informe que produce el proyecto.
2. Comprueba si Jenkins dispone de un paso de publicación.
3. Publica el informe con la herramienta aprobada.
4. Revisa los resultados en la interfaz.
5. Evita analizar formatos complejos con código improvisado.
6. Registra qué plugin o paso se utilizó.

#### Hoja de registro

```text
Formato:
Ruta:
Paso de publicación:
Plugin:
Resultado:
Pruebas fallidas:
Artefactos asociados:
```

### Sesión 24: proyecto integrador

**Objetivo:** capturar, validar, transformar y resumir datos.

#### Requisitos

- Un parámetro `choice`.
- Una variable de entorno no sensible.
- Una salida de comando breve.
- Una lectura de archivo.
- Una validación explícita.
- Un resumen final.
- Ningún secreto.

#### Jenkinsfile de referencia

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona el nivel del resumen'
        )
    }

    environment {
        NOMBRE_PRACTICA = 'captura-datos'
    }

    stages {
        stage('Validar archivos') {
            steps {
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Capturar información') {
            steps {
                script {
                    def contenido = readFile(
                        file: 'app/mensaje.txt',
                        encoding: 'UTF-8'
                    ).trim()

                    def salida = sh(
                        returnStdout: true,
                        script: 'printf "VALIDACION=correcta\\n"'
                    ).trim()

                    if (!contenido) {
                        error 'El archivo de mensaje está vacío.'
                    }

                    if (salida != 'VALIDACION=correcta') {
                        error 'La salida de validación no coincide.'
                    }

                    echo "Práctica: ${env.NOMBRE_PRACTICA}"
                    echo "Resultado capturado: ${salida}"

                    if (params.MODO == 'detallado') {
                        echo "Caracteres en el archivo: ${contenido.length()}"
                        echo "Modo: ${params.MODO}"
                    } else {
                        echo 'Se generó un resumen breve.'
                    }
                }
            }
        }

        stage('Validación del proyecto') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }
    }

    post {
        success {
            echo 'Las capturas y validaciones configuradas terminaron correctamente.'
        }

        failure {
            echo 'Una captura o validación falló. Revisa la primera causa.'
        }

        always {
            echo "Job: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
    }
}
```

#### Pruebas

Ejecuta con:

- `MODO=simple`.
- `MODO=detallado`.
- Archivo válido.
- Archivo vacío en una rama local de práctica.
- Comando de salida controlada.
- Script de validación válido.

#### Registro

```text
Job:
Ejecución:
Commit:
Modo:
Variable de entorno:
Salida capturada:
Archivo leído:
Validaciones:
Resultado:
```

### Sesión 25: revisión por parejas

**Objetivo:** comprobar que otra persona entiende las fuentes de datos.

La persona autora explica:

- Qué datos captura.
- De dónde proceden.
- Qué formato tienen.
- Cómo los valida.
- Dónde los utiliza.
- Qué información registra.

La persona revisora comprueba:

- Nombres.
- Alcance.
- Valores vacíos.
- Interpolación.
- Archivos residuales.
- Datos sensibles.
- Códigos de salida.
- Mensajes de error.
- Dependencia de plugins.

### Sesión 26: documento de diseño de captura

**Objetivo:** documentar antes de ampliar el pipeline.

Completa:

```text
Nombre del dato:
Fuente:
Tipo:
Momento de captura:
Alcance:
Formato esperado:
Valores permitidos:
Tratamiento si falta:
Validación:
Uso posterior:
¿Se imprime?:
¿Se archiva?:
¿Es sensible?:
```

### Sesión 27: informe de una ejecución

**Objetivo:** conservar información útil para repetir el diagnóstico.

```text
Job:
Número de ejecución:
Commit:
Rama:
Agente:
Parámetros no sensibles:
Variables relevantes:
Archivo o comando de origen:
Valor validado:
Resultado final:
Artefactos:
Observaciones:
```

No escribas valores secretos en el informe.

---

## Evaluación, checklist y referencia

El control final verifica que el dato sea válido, útil y seguro.

### Checklist para capturar parámetros

- [ ] El parámetro representa una entrada real.
- [ ] El tipo coincide con el valor esperado.
- [ ] El nombre es claro.
- [ ] La descripción explica sus opciones.
- [ ] El valor predeterminado es seguro.
- [ ] El dato no es una credencial.
- [ ] El valor se valida antes de utilizarse.
- [ ] El comportamiento ante vacío está definido.

### Checklist para capturar variables de entorno

- [ ] Se conoce quién define la variable.
- [ ] Se conoce su alcance.
- [ ] Se consulta con `env` desde Groovy.
- [ ] Se usa la sintaxis adecuada en la shell.
- [ ] No se imprime el entorno completo.
- [ ] No se asume disponibilidad en todos los jobs.
- [ ] El valor no contiene un secreto en texto plano.

### Checklist para capturar salida de comandos

- [ ] Se elige entre `returnStdout` y `returnStatus` según el dato.
- [ ] La salida es pequeña.
- [ ] Se eliminan saltos de línea si procede.
- [ ] Se valida el formato.
- [ ] Se comprueba el código de salida.
- [ ] No se ignora un fallo obligatorio.
- [ ] No se imprime salida sensible.

### Checklist para leer archivos

- [ ] El archivo está en una ruta esperada.
- [ ] La ruta es relativa al workspace.
- [ ] Se comprueba la existencia.
- [ ] Se conoce la codificación.
- [ ] El formato se parsea con un paso adecuado.
- [ ] Se validan claves y tipos.
- [ ] Se evita ejecutar contenido como código.
- [ ] El archivo pertenece a la ejecución actual.

### Checklist para compartir datos

- [ ] Se define dónde se necesita el dato.
- [ ] Se elige entre variable local, entorno, archivo, `stash` o artefacto.
- [ ] El alcance es suficiente, pero no excesivo.
- [ ] Se evita compartir secretos.
- [ ] Se evitan escrituras concurrentes.
- [ ] Se documenta la retención.
- [ ] Se archiva antes de limpiar si hace falta conservar.

### Checklist de seguridad

- [ ] Los parámetros se consideran entradas.
- [ ] Las entradas se validan antes de usarlas.
- [ ] No se construyen comandos con texto libre.
- [ ] No se muestran credenciales.
- [ ] No se guardan secretos en el repositorio.
- [ ] Los mensajes revelan solo información necesaria.
- [ ] Los plugins y permisos están autorizados.
- [ ] El agente es de confianza para los datos que recibe.

### Errores frecuentes

#### Parámetro vacío

Comprueba declaración, nombre, forma de inicio y valor predeterminado.

#### Variable de entorno no disponible

Comprueba el alcance, el contexto y la sintaxis de acceso.

#### Salida capturada con salto de línea

Aplica `.trim()` cuando sea adecuado.

#### Salida vacía

Comprueba si el comando escribió a `stderr`, si produjo salida y si ejecutó el comando esperado.

#### Código de salida ignorado

Revisa si `returnStatus` fue interpretado.