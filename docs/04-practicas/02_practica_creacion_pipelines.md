# Práctica de creación de pipelines en Jenkins

Esta práctica enseña a crear pipelines de Jenkins desde cero, primero desde la interfaz y después como código versionado en un `Jenkinsfile`. El alumnado construirá flujos pequeños y verificables, añadirá etapas de forma incremental y practicará las opciones habituales de un pipeline declarativo: agente, parámetros, variables de entorno, condiciones, captura de resultados, publicación de artefactos y acciones posteriores.

La práctica utiliza comandos inocuos y un proyecto de laboratorio. No configura despliegues ni requiere credenciales reales. La interfaz, las opciones disponibles y algunos pasos pueden variar según la versión de Jenkins y los plugins instalados.

> **Seguridad:** trabaja únicamente en la instancia, carpeta y repositorio autorizados. No incluyas contraseñas, tokens, claves privadas ni datos personales en el `Jenkinsfile`, los parámetros, la consola o los artefactos. No cambies ajustes globales ni ejecutes comandos destructivos.

---

## Objetivos y alcance

Un pipeline define una secuencia de trabajo que Jenkins puede ejecutar, mostrar y repetir.

### Resultados de aprendizaje

Al terminar esta práctica podrás:

- Crear un job de tipo Pipeline.
- Explicar qué hace un `Jenkinsfile`.
- Construir una estructura declarativa válida.
- Dividir el trabajo en etapas.
- Distinguir las etapas de los pasos.
- Elegir un agente disponible.
- Ejecutar comandos en el agente.
- Recibir parámetros de forma controlada.
- Definir variables de entorno no sensibles.
- Capturar y comprobar resultados.
- Usar condiciones para ejecutar etapas opcionales.
- Crear y archivar un artefacto de laboratorio.
- Comunicar éxito, fallo e interrupción.
- Revisar una ejecución desde la interfaz y la consola.
- Versionar el pipeline junto con el proyecto.
- Probar tanto el camino exitoso como el camino fallido.

### Qué se construirá

El proyecto de práctica incluirá:

- Un `Jenkinsfile`.
- Un archivo de texto de ejemplo.
- Un script pequeño de validación.
- Parámetros para elegir un modo.
- Etapas con nombres descriptivos.
- Una salida de resumen no sensible.
- Un artefacto archivado.
- Acciones posteriores según el resultado.

### Qué no se construirá

Esta práctica no:

- Despliega aplicaciones.
- Publica paquetes en un servicio externo.
- Modifica servidores.
- Envía notificaciones reales.
- Solicita credenciales de producción.
- Cambia la configuración global de Jenkins.
- Instala plugins sin autorización.
- Ejecuta comandos destructivos.
- Presenta el pipeline como una configuración de producción lista para usar.

### Requisitos previos

Necesitarás:

- Una cuenta de laboratorio autorizada.
- Acceso a una carpeta de Jenkins preparada para el curso.
- Permiso para crear o ejecutar jobs en esa carpeta.
- Un agente compatible con los comandos del ejercicio.
- Un repositorio de práctica o permiso para usar el campo de script del job.
- Conocimientos básicos de shell y control de versiones.
- Una forma autorizada de registrar los resultados de la práctica.

### Entorno Unix y entorno Windows

Los ejemplos con `sh` presuponen un agente Unix o compatible.

En un agente Windows, los comandos deben adaptarse a `bat` o PowerShell.

No mezcles sintaxis Unix y Windows sin comprobar el sistema operativo del agente.

### Alcance de los ejemplos

Los ejemplos usan rutas relativas al workspace.

No dependen de una ruta local fija, como `/home/alumno/proyecto`.

Las herramientas deben existir en el agente que ejecuta los pasos.

---

## Conceptos de Pipeline

Comprender las piezas facilita crear pipelines pequeños y mantenerlos legibles.

### Job

Un job es una definición de trabajo en Jenkins.

Puede contener:

- Configuración de SCM.
- Parámetros.
- Definición del pipeline.
- Reglas de ejecución.
- Historial de builds.
- Permisos y restricciones.

### Build

Un build es una ejecución concreta del job.

Cada build puede tener:

- Número.
- Resultado.
- Duración.
- Consola.
- Etapas.
- Artefactos.
- Revisión de código, si se obtuvo desde SCM.

### Agente

Un agente es el lugar donde se ejecutan los pasos.

Puede ser:

- Un nodo estático.
- Una máquina virtual.
- Un contenedor.
- Un agente efímero.
- El controlador, si la política de la instancia lo permite.

No asumas que todos los jobs usan el mismo sistema operativo o las mismas herramientas.

### Workspace

El workspace es el directorio de trabajo que Jenkins asigna al job en el agente.

Puede contener:

- Código descargado.
- Archivos creados durante el build.
- Resultados temporales.
- Informes.

No debe tratarse como almacenamiento permanente.

### Pipeline

Un pipeline es el flujo de trabajo automatizado.

Un pipeline declarativo se escribe con una estructura reconocible:

```groovy
pipeline {
    agent any

    stages {
        stage('Ejemplo') {
            steps {
                echo 'Pipeline de práctica.'
            }
        }
    }
}
```

### Pipeline declarativo

El modelo declarativo organiza el flujo con bloques como:

- `pipeline`
- `agent`
- `options`
- `parameters`
- `environment`
- `stages`
- `stage`
- `steps`
- `post`

La estructura ayuda a validar y comprender el pipeline.

### Pipeline Scripted

Jenkins también admite pipelines con estilo Scripted, basados en Groovy.

Esta práctica se centra en Pipeline declarativo.

No mezcles ambos estilos sin una razón clara.

### `Jenkinsfile`

El `Jenkinsfile` es un archivo de texto que contiene la definición del pipeline.

Se suele guardar en el repositorio del proyecto.

El archivo puede revisarse junto con el código de la aplicación.

### Pipeline como código

Guardar la definición en Git permite:

- Revisar cambios.
- Comparar versiones.
- Relacionar una ejecución con un commit.
- Reutilizar la configuración.
- Recuperar una versión anterior.
- Evitar que la configuración exista solo en una interfaz.

### Freestyle frente a Pipeline

| Aspecto | Freestyle | Pipeline |
|---|---|---|
| Configuración | Principalmente desde la interfaz | Código o interfaz |
| Flujo por etapas | Puede configurarse con herramientas adicionales | Parte central del modelo |
| Revisión en Git | Depende de cómo se configure | Natural mediante `Jenkinsfile` |
| Uso en esta práctica | Comparación inicial | Construcción principal |

Freestyle sigue siendo útil en algunos escenarios.

La práctica usa Pipeline para mostrar flujo como código.

### Etapas y pasos

Una etapa representa una fase visible.

Un paso realiza una acción concreta.

Ejemplo:

```groovy
stage('Validar') {
    steps {
        sh 'test -f README.md'
    }
}
```

Aquí:

- `Validar` es la etapa.
- `sh` es el paso.
- `test -f README.md` es el comando ejecutado por la shell.

### Resultado del build

Jenkins muestra estados como:

- `SUCCESS`
- `FAILURE`
- `UNSTABLE`
- `ABORTED`

Un mensaje de consola no cambia por sí solo el resultado.

Una etapa omitida no significa que sus comprobaciones hayan pasado.

---

## Preparación del proyecto

El proyecto de práctica debe ser pequeño, controlado y fácil de verificar.

### Estructura del repositorio

Utiliza una estructura como esta:

```text
pipeline-practica/
├── Jenkinsfile
├── README.md
├── app/
│   └── mensaje.txt
├── scripts/
│   └── validar.sh
└── salida/
```

La carpeta `salida` puede crearse durante el pipeline.

No es obligatorio versionar directorios vacíos.

### Crear el directorio de trabajo

En un entorno local autorizado:

```bash
mkdir -p app scripts salida
```

### Crear `README.md`

```text
Proyecto de práctica para crear pipelines de Jenkins.
```

### Crear el archivo de texto de ejemplo

```bash
printf 'Este proyecto contiene una práctica de Jenkins.\n' > app/mensaje.txt
```

### Crear el script de validación

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"
TEXTO_ESPERADO="Jenkins"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: falta el archivo $ARCHIVO"
  exit 1
fi

if grep -q "$TEXTO_ESPERADO" "$ARCHIVO"; then
  echo "VALIDACION=correcta"
else
  echo "ERROR: no se encontró el texto esperado"
  exit 1
fi
EOF
```

### Probar el script localmente

```bash
bash scripts/validar.sh
```

La salida esperada es:

```text
VALIDACION=correcta
```

### Probar un fallo local controlado

En una rama o copia de práctica:

1. Cambia el contenido de `app/mensaje.txt`.
2. Elimina temporalmente la palabra `Jenkins`.
3. Ejecuta de nuevo el script.
4. Comprueba que devuelve un código distinto de cero.
5. Restaura el archivo válido.

No hagas esta prueba en una rama compartida sin autorización.

### Añadir el proyecto a Git

Si el curso utiliza Git:

```bash
git status
```

Comprueba los archivos antes de añadirlos.

Una secuencia de trabajo típica puede ser:

```bash
git add Jenkinsfile README.md app scripts
git commit -m "Añade pipeline de práctica"
```

Sigue el flujo de ramas y revisiones indicado por el curso.

### No añadir archivos sensibles

Antes de confirmar cambios, comprueba que no incluyes:

- Contraseñas.
- Tokens.
- Claves privadas.
- Archivos `.env` con secretos.
- Credenciales descargadas.
- Logs con información restringida.

---

## Crear un Pipeline desde Jenkins

Se puede crear una primera ejecución desde la interfaz, si el curso lo permite.

### Crear un job

1. Abre la carpeta asignada.
2. Selecciona la opción para crear un nuevo item.
3. Escribe un nombre descriptivo.
4. Selecciona el tipo **Pipeline**.
5. Guarda.
6. Revisa la configuración del job.

La interfaz puede utilizar nombres diferentes según la versión.

### Nombre sugerido

```text
practica-creacion-pipelines
```

El nombre debería describir el objetivo del job.

Evita incluir datos personales innecesarios.

### Pipeline script

Algunos jobs permiten pegar un pipeline directamente en un campo de texto.

Para una práctica inicial, utiliza este ejemplo:

```groovy
pipeline {
    agent any

    stages {
        stage('Inicio') {
            steps {
                echo 'Pipeline de práctica iniciado.'
            }
        }

        stage('Comprobación') {
            steps {
                echo 'La primera comprobación terminó.'
            }
        }
    }
}
```

### Guardar el job

Antes de ejecutar:

- Revisa la carpeta.
- Revisa el tipo de job.
- Comprueba que el script tiene llaves equilibradas.
- Asegúrate de no incluir secretos.
- Guarda la configuración.

### Ejecutar el pipeline

1. Selecciona **Build Now** o el botón equivalente.
2. Espera a que comience el build.
3. Abre la ejecución.
4. Revisa la vista de etapas.
5. Abre **Console Output**.
6. Anota el resultado.

### Interpretar la consola

Busca:

- Inicio del pipeline.
- Nombre de las etapas.
- Mensajes de `echo`.
- Pasos de shell, si los hay.
- Primera línea de error.
- Resultado final.

No te limites a mirar el icono de color.

### Cambiar el mensaje

Modifica el mensaje de la primera etapa:

```groovy
echo 'Ejecución iniciada por el grupo de práctica.'
```

Guarda el cambio y ejecuta de nuevo.

Compara los números de build y la consola.

### Límite de este método

Un pipeline pegado en la interfaz puede ser rápido para aprender.

Sin embargo, puede no quedar versionado junto con el proyecto.

Para trabajo compartido, utiliza un `Jenkinsfile` en SCM cuando sea posible.

---

## Crear un pipeline desde SCM

En esta modalidad, Jenkins lee el `Jenkinsfile` desde un repositorio.

### Preparar el `Jenkinsfile`

Crea un archivo llamado exactamente:

```text
Jenkinsfile
```

La ruta más habitual es la raíz del repositorio.

No añadas extensión `.txt`.

### Pipeline mínimo versionado

```groovy
pipeline {
    agent any

    stages {
        stage('Inicio') {
            steps {
                echo 'Pipeline obtenido desde el repositorio.'
            }
        }

        stage('Verificar proyecto') {
            steps {
                sh 'test -f README.md'
            }
        }
    }
}
```

### Revisar el archivo

Antes de guardar en Git:

- Comprueba llaves.
- Comprueba comillas.
- Comprueba nombres de etapas.
- Comprueba comandos.
- Comprueba que no hay secretos.
- Comprueba la rama de trabajo.

### Configurar el job

1. Crea o abre un job de Pipeline.
2. Selecciona **Pipeline script from SCM** o equivalente.
3. Selecciona Git si el repositorio usa Git.
4. Introduce la URL autorizada.
5. Selecciona la credencial aprobada, si hace falta.
6. Indica la rama.
7. Indica la ruta del `Jenkinsfile`.
8. Guarda.

### URL del repositorio

Utiliza la URL proporcionada por el curso.

No añadas una contraseña o token directamente en la URL.

### Credenciales de SCM

Si el repositorio es privado:

- Selecciona una credencial gestionada por Jenkins.
- Usa solo la credencial autorizada.
- No copies su valor en el `Jenkinsfile`.
- No imprimas la credencial.
- No reutilices la credencial personal de otra persona.

### Rama

Indica la rama que contiene el `Jenkinsfile`.

No asumas que todos los repositorios usan `main`.

Comprueba las instrucciones del curso.

### Ruta del `Jenkinsfile`

Usa la ruta acordada.

Ejemplos:

```text
Jenkinsfile
```

```text
ci/Jenkinsfile
```

Si el archivo está en una subcarpeta, la configuración debe reflejarlo.

### Ejecutar desde SCM

Al iniciar el job, Jenkins debe:

1. Obtener el repositorio.
2. Seleccionar la revisión.
3. Leer el `Jenkinsfile`.
4. Ejecutar las etapas.
5. Registrar el resultado.

Revisa la consola para comprobar el checkout.

### Confirmar el commit

Cuando sea posible, registra el commit procesado.

Esto permite relacionar el build con una versión específica del código.

Una rama puede cambiar entre ejecuciones; el commit identifica la revisión exacta.

### Pipeline Multibranch

Un job Multibranch puede descubrir ramas que contienen un `Jenkinsfile`.

La configuración y permisos dependen del plugin y de la instancia.

No lo crees en una carpeta compartida sin autorización.

### Pull requests

Un `Jenkinsfile` de una rama o pull request puede contener código ejecutable.

Sigue las políticas de confianza antes de entregar credenciales o asignar agentes privilegiados.

---

## Construir el pipeline por partes

Añadir una capacidad cada vez facilita entender y depurar el flujo.

### Agente

El agente indica dónde se ejecuta el pipeline.

Ejemplo sencillo:

```groovy
agent any
```

Si el curso ha configurado una etiqueta concreta, se puede solicitar así:

```groovy
agent {
    label 'linux-lab'
}
```

La etiqueta debe existir en la instancia.

### No cambiar de agente sin motivo

El agente determina:

- Sistema operativo.
- Herramientas disponibles.
- Permisos.
- Workspace.
- Acceso a recursos.

No cambies la etiqueta solo para evitar un error de herramienta.

### Opciones del pipeline

Las opciones pueden definir comportamientos generales.

```groovy
options {
    timestamps()
    timeout(time: 10, unit: 'MINUTES')
}
```

`timestamps()` puede facilitar la lectura temporal de los logs, si está disponible.

`timeout` limita el tiempo de ejecución.

### Timeout razonable

El límite debe considerar:

- Duración normal del trabajo.
- Tiempo para asignar un agente.
- Descargas.
- Tiempo de pruebas.
- Carga del entorno.

Un timeout no transforma una tarea incompleta en éxito.

### Parámetros

Los parámetros permiten variar una ejecución.

```groovy
parameters {
    choice(
        name: 'MODO',
        choices: ['simple', 'detallado'],
        description: 'Elige el formato del resumen'
    )
}
```

Los parámetros son entradas y deben validarse cuando afecten decisiones importantes.

### Acceder a parámetros

Desde Groovy:

```groovy
params.MODO
```

Ejemplo:

```groovy
echo "Modo seleccionado: ${params.MODO}"
```

No imprimas parámetros que puedan contener secretos.

### Validar parámetros

```groovy
script {
    if (!(params.MODO in ['simple', 'detallado'])) {
        error 'El modo seleccionado no está permitido.'
    }
}
```

Una lista cerrada reduce valores inesperados.

### Variables de entorno

Las variables de entorno contienen configuración no sensible.

```groovy
environment {
    NOMBRE_PRACTICA = 'creacion-pipelines'
}
```

Desde Groovy:

```groovy
env.NOMBRE_PRACTICA
```

No escribas contraseñas o tokens literales en `environment`.

### Usar variables en shell

```groovy
sh 'echo "$BUILD_NUMBER"'
```

La shell expande `$BUILD_NUMBER`.

Groovy y la shell son intérpretes distintos.

### Etapas con nombres descriptivos

Ejemplo:

```groovy
stages {
    stage('Validar estructura') {
        steps {
            echo 'Comprobando los archivos del proyecto.'
        }
    }

    stage('Ejecutar validación') {
        steps {
            echo 'Ejecutando las comprobaciones.'
        }
    }
}
```

Un nombre de etapa debería describir el trabajo.

Evita nombres como `Paso 1` o `Cosas`.

### Comandos de shell

El paso `sh` ejecuta comandos en un agente Unix o compatible.

```groovy
sh 'pwd'
```

El paso no se ejecuta necesariamente en el controlador.

### Comandos Windows

En agentes Windows se puede utilizar `bat`:

```groovy
bat 'echo Pipeline de laboratorio'
```

La sintaxis debe corresponder al agente.

### Validar archivos

```groovy
sh 'test -f README.md'
```

Si el archivo no existe, el comando suele devolver un código distinto de cero.

### Usar `fileExists`

En contextos compatibles, Jenkins proporciona el paso `fileExists`:

```groovy
script {
    if (!fileExists('README.md')) {
        error 'No se encontró README.md en el workspace.'
    }
}
```

La ruta suele ser relativa al workspace.

### Ejecutar un script del repositorio

```groovy
sh 'bash scripts/validar.sh'
```

Es preferible mantener lógica de shell extensa en un archivo versionado y probado localmente.

### Capturar salida estándar

`returnStdout` devuelve salida estándar como texto:

```groovy
script {
    def salida = sh(
        returnStdout: true,
        script: 'printf "resultado\\n"'
    ).trim()

    echo "Valor capturado: ${salida}"
}
```

`.trim()` elimina espacios y saltos de línea alrededor del texto.

### Comparar salida capturada

```groovy
script {
    def resultado = sh(
        returnStdout: true,
        script: 'printf "VALIDACION=correcta\\n"'
    ).trim()

    if (resultado != 'VALIDACION=correcta') {
        error 'La salida no coincide con el valor esperado.'
    }
}
```

La salida capturada debe validarse antes de utilizarla.

### Capturar código de salida

`returnStatus` devuelve el código de salida:

```groovy
script {
    int codigo = sh(
        returnStatus: true,
        script: 'test -f README.md'
    )

    if (codigo != 0) {
        error "La comprobación falló con código ${codigo}."
    }
}
```

No ignores el valor devuelto.

### Condiciones dentro de una etapa

`if` puede seleccionar pasos dentro de una etapa:

```groovy
script {
    if (params.MODO == 'detallado') {
        echo 'Se mostrará un resumen detallado.'
    } else {
        echo 'Se mostrará un resumen simple.'
    }
}
```

### Condiciones de etapa con `when`

Si toda una etapa es opcional, puede ser más claro usar `when`:

```groovy
stage('Resumen detallado') {
    when {
        expression {
            return params.MODO == 'detallado'
        }
    }

    steps {
        echo 'Etapa ejecutada en modo detallado.'
    }
}
```

Una etapa omitida no significa que se haya superado una prueba.

### Etapas opcionales

Antes de omitir una etapa, define:

- Por qué es opcional.
- Qué pasa si no se ejecuta.
- Si una etapa posterior depende de ella.
- Cómo se comunica la omisión.

### Ejecución paralela

`parallel` permite ejecutar ramas concurrentes en contextos compatibles.

Ejemplo ilustrativo:

```groovy
stage('Comprobaciones paralelas') {
    parallel {
        stage('Comprobar README') {
            steps {
                sh 'test -f README.md'
            }
        }

        stage('Comprobar script') {
            steps {
                sh 'test -f scripts/validar.sh'
            }
        }
    }
}
```

La ejecución paralela consume agentes y recursos.

No la uses si las ramas comparten archivos que pueden sobrescribirse.

### Entrada interactiva

`input` puede pausar un pipeline para solicitar una respuesta autorizada:

```groovy
input message: 'Confirma la revisión del laboratorio.',
      ok: 'Continuar'
```

Puede dejar una ejecución pendiente.

No solicites contraseñas con `input`.

### Crear directorios y archivos

Ejemplo seguro para un archivo de salida:

```groovy
sh 'mkdir -p salida'
```

No uses parámetros libres para elegir directorios de borrado o escritura.

### Leer un archivo

```groovy
script {
    if (!fileExists('app/mensaje.txt')) {
        error 'Falta app/mensaje.txt.'
    }

    def contenido = readFile('app/mensaje.txt')
    echo "Caracteres leídos: ${contenido.length()}"
}
```

Evita imprimir archivos completos si contienen datos sensibles o no son necesarios.

### Crear un archivo

```groovy
writeFile(
    file: 'salida/resumen.txt',
    text: 'Resultado: correcto\n'
)
```

El paso debe ejecutarse en un contexto de Pipeline compatible.

### Archivar artefactos

```groovy
archiveArtifacts(
    artifacts: 'salida/resumen.txt',
    fingerprint: true
)
```

Limita el patrón a los archivos que se deben conservar.

### No archivar todo el workspace

Archivar directorios completos puede incluir archivos temporales, cachés o información sensible.

Especifica el patrón de forma deliberada.

### Acciones posteriores

`post` define acciones según el resultado del pipeline:

```groovy
post {
    success {
        echo 'Las comprobaciones terminaron correctamente.'
    }

    failure {
        echo 'El pipeline falló. Revisa la primera causa.'
    }

    always {
        echo 'Fin de la ejecución.'
    }
}
```

### Errores obligatorios

Si una comprobación es obligatoria, deja que su fallo se propague o utiliza `error`.

No uses `catchError` únicamente para mantener el build verde.

### Errores opcionales

Una tarea opcional puede tratarse de forma distinta si la política lo especifica.

El fallo debe quedar visible y no crear una impresión falsa de éxito.

---

## Pipeline mínimo

Este ejemplo establece la estructura declarativa básica.

```groovy
pipeline {
    agent any

    stages {
        stage('Inicio') {
            steps {
                echo 'Pipeline iniciado.'
            }
        }

        stage('Final') {
            steps {
                echo 'Pipeline finalizado.'
            }
        }
    }
}
```

### Qué comprobar

- ¿Existe un único bloque `pipeline`?
- ¿Se ha definido un agente?
- ¿Cada etapa tiene un nombre?
- ¿Los pasos están dentro de `steps`?
- ¿Las llaves están equilibradas?
- ¿El pipeline termina como se espera?

### Errores habituales

- Olvidar una llave.
- Escribir `stage` fuera de `stages`.
- Escribir `echo` fuera de `steps`.
- Usar un agente que no existe.
- Copiar una opción de plugin ausente.

---

## Pipeline de validación

Este patrón comprueba que los archivos requeridos están presentes y ejecuta un script de validación.

```groovy
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 10, unit: 'MINUTES')
    }

    stages {
        stage('Validar estructura') {
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
    }

    post {
        success {
            echo 'La validación terminó correctamente.'
        }

        failure {
            echo 'Falló una validación obligatoria.'
        }
    }
}
```

### Qué garantiza

- La estructura esperada está presente.
- El script se ejecuta.
- Un código de salida no cero puede fallar el paso.
- Jenkins muestra el resultado final.

### Qué no garantiza

- Que el script compruebe todos los requisitos.
- Que el agente tenga siempre las mismas herramientas.
- Que no haya archivos residuales.
- Que la aplicación esté lista para producción.

---

## Pipeline con parámetros

Este patrón selecciona un modo de salida sin modificar las comprobaciones obligatorias.

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
        stage('Validar parámetro') {
            steps {
                script {
                    if (!(params.MODO in ['simple', 'detallado'])) {
                        error 'El modo no está permitido.'
                    }
                }
            }
        }

        stage('Comprobación principal') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }

        stage('Resumen') {
            steps {
                script {
                    if (params.MODO == 'detallado') {
                        echo "Job: ${env.JOB_NAME}"
                        echo "Ejecución: ${env.BUILD_NUMBER}"
                        echo 'Modo detallado seleccionado.'
                    } else {
                        echo 'Validación completada.'
                    }
                }
            }
        }
    }
}
```

### Parámetros y seguridad

Los parámetros son entradas.

Valida cualquier parámetro que afecte a:

- Comandos.
- Rutas.
- Nombres de artefactos.
- Destinos.
- Selección de credenciales.
- Acciones externas.

No conviertas texto libre en un comando.

---

## Pipeline con pruebas y publicación

Este ejemplo crea y archiva un resumen no sensible.

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
            description: 'Modo del resumen'
        )
    }

    environment {
        NOMBRE_PRACTICA = 'creacion-pipelines'
    }

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

        stage('Crear resumen') {
            steps {
                script {
                    sh 'mkdir -p salida'

                    def resumen = """\
Práctica: ${env.NOMBRE_PRACTICA}
Job: ${env.JOB_NAME}
Ejecución: ${env.BUILD_NUMBER}
Modo: ${params.MODO}
Resultado de validación: correcto
"""

                    writeFile(
                        file: 'salida/resumen.txt',
                        text: resumen
                    )
                }
            }
        }

        stage('Archivar resumen') {
            steps {
                archiveArtifacts(
                    artifacts: 'salida/resumen.txt',
                    fingerprint: true
                )
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

### Revisar el ejemplo antes de usarlo

Comprueba:

- Que el agente admite `sh`.
- Que el repositorio contiene los archivos indicados.
- Que `scripts/validar.sh` existe.
- Que `writeFile` está disponible.
- Que solo se archiva el archivo previsto.
- Que el resumen no contiene datos sensibles.
- Que los parámetros siguen una lista cerrada.

---

## Sesiones prácticas

Las sesiones construyen el pipeline de forma progresiva y permiten comprobar cada cambio.

### Preparación común

Antes de cada sesión:

- Usa la carpeta asignada.
- Anota el nombre del job.
- Comprueba la rama.
- Evita cambiar configuración global.
- Utiliza solo datos no sensibles.
- Restaura los cambios de fallo controlado.
- Registra el número del build.

### Sesión 1: planificar antes de escribir

**Objetivo:** decidir qué debe hacer el pipeline.

#### Actividad

Completa el flujo:

```text
Entrada:
Validación:
Trabajo principal:
Salida:
Artefacto:
Resultado:
```

#### Preguntas

- ¿Qué datos recibe el job?
- ¿Qué archivos necesita?
- ¿Qué comprobación es obligatoria?
- ¿Qué resultado debe considerarse fallo?
- ¿Qué información se conserva?

### Sesión 2: crear un Pipeline Job

**Objetivo:** crear el primer job.

#### Instrucciones

1. Abre la carpeta del laboratorio.
2. Crea un item de tipo Pipeline.
3. Usa el nombre `pipeline-sesion-1`.
4. Pega el pipeline mínimo.
5. Guarda.
6. Ejecuta.
7. Revisa etapas y consola.
8. Registra el resultado.

#### Resultado esperado

El pipeline termina como `SUCCESS`.

### Sesión 3: añadir una segunda etapa

**Objetivo:** entender el orden de ejecución.

Añade:

```groovy
stage('Comprobación') {
    steps {
        echo 'Segunda etapa ejecutada.'
    }
}
```

#### Instrucciones

1. Guarda el cambio.
2. Ejecuta de nuevo.
3. Confirma el orden de las etapas.
4. Comprueba la vista de etapas.
5. Anota el nuevo número de build.

### Sesión 4: crear el `Jenkinsfile`

**Objetivo:** trasladar el pipeline desde la interfaz al repositorio.

#### Instrucciones

1. Crea `Jenkinsfile` en la raíz del proyecto.
2. Copia el pipeline mínimo.
3. Revisa sintaxis.
4. Confirma el archivo en una rama de práctica.
5. Configura el job como Pipeline from SCM.
6. Ejecuta.
7. Comprueba el commit procesado.

### Sesión 5: añadir una etapa de estructura

**Objetivo:** comprobar archivos requeridos antes del trabajo principal.

Añade:

```groovy
stage('Validar estructura') {
    steps {
        sh 'test -f README.md'
        sh 'test -f app/mensaje.txt'
        sh 'test -f scripts/validar.sh'
    }
}
```

#### Instrucciones

1. Confirma que las rutas existen.
2. Ejecuta.
3. Revisa el resultado.
4. En una rama temporal, renombra un archivo.
5. Ejecuta una vez y observa el fallo.
6. Restaura el archivo.

### Sesión 6: ejecutar el script de validación

**Objetivo:** invocar un script versionado.

Añade:

```groovy
stage('Validar contenido') {
    steps {
        sh 'bash scripts/validar.sh'
    }
}
```

#### Instrucciones

1. Prueba el script localmente.
2. Confirma que el archivo está en Git.
3. Ejecuta el pipeline.
4. Localiza `VALIDACION=correcta`.
5. Comprueba el estado del build.

### Sesión 7: provocar un fallo controlado

**Objetivo:** ver cómo se propaga el error.

#### Instrucciones

1. En una rama aislada, modifica el contenido para que falte la palabra esperada.
2. Ejecuta el pipeline.
3. Registra la primera etapa fallida.
4. Comprueba si se ejecuta el resumen.
5. Restaura el contenido.
6. Ejecuta una ruta exitosa.

#### Preguntas

- ¿Qué comando devolvió el error?
- ¿Cuál fue el código de salida?
- ¿Qué etapas dejaron de ejecutarse?
- ¿El `post` de fallo apareció?

### Sesión 8: añadir parámetros

**Objetivo:** permitir una elección controlada.

Añade:

```groovy
parameters {
    choice(
        name: 'MODO',
        choices: ['simple', 'detallado'],
        description: 'Modo de salida'
    )
}
```

#### Instrucciones

1. Guarda el `Jenkinsfile`.
2. Ejecuta con `simple`.
3. Anota la salida.
4. Ejecuta con `detallado`.
5. Compara los resultados.
6. Explica qué representa `params.MODO`.

### Sesión 9: validar el parámetro

**Objetivo:** dejar explícitas las opciones permitidas.

Añade una etapa con:

```groovy
script {
    if (!(params.MODO in ['simple', 'detallado'])) {
        error 'El modo seleccionado no está permitido.'
    }
}
```

#### Instrucciones

1. Comprueba la sintaxis.
2. Ejecuta con un valor permitido.
3. Prueba un valor inválido solo si el job y el curso lo permiten.
4. Registra el resultado.
5. Explica por qué la lista cerrada ayuda a controlar la entrada.

### Sesión 10: usar `when`

**Objetivo:** omitir una etapa completa con una condición.

```groovy
stage('Detalle adicional') {
    when {
        expression {
            return params.MODO == 'detallado'
        }
    }

    steps {
        echo 'La etapa detallada se ejecuta.'
    }
}
```

#### Instrucciones

1. Ejecuta en modo simple.
2. Comprueba que la etapa se omite.
3. Ejecuta en modo detallado.
4. Comprueba que la etapa se ejecuta.
5. Explica por qué una etapa omitida no equivale a una prueba superada.

### Sesión 11: añadir timestamps y timeout

**Objetivo:** facilitar lectura y limitar una ejecución.

Añade:

```groovy
options {
    timestamps()
    timeout(time: 5, unit: 'MINUTES')
}
```

#### Instrucciones

1. Guarda.
2. Ejecuta una ruta normal.
3. Comprueba si aparecen timestamps.
4. Registra el tiempo de ejecución.
5. Explica qué debe pasar si se supera el límite.
6. No uses una espera larga para provocar el timeout.

### Sesión 12: capturar salida estándar

**Objetivo:** guardar una salida breve para validarla.

```groovy
script {
    def resultado = sh(
        returnStdout: true,
        script: 'printf "resultado-correcto\\n"'
    ).trim()

    echo "Resultado capturado: ${resultado}"
}
```

#### Instrucciones

1. Identifica qué devuelve `returnStdout`.
2. Explica qué hace `.trim()`.
3. Ejecuta.
4. Cambia la cadena fija en una rama de práctica.
5. Compara los resultados.
6. No imprimas datos sensibles.

### Sesión 13: capturar un código de salida

**Objetivo:** distinguir salida textual de código de proceso.

```groovy
script {
    int codigo = sh(
        returnStatus: true,
        script: 'test -f README.md'
    )

    if (codigo != 0) {
        error "Falló la comprobación con código ${codigo}."
    }
}
```

#### Instrucciones

1. Ejecuta con un archivo presente.
2. Registra el código.
3. Cambia la ruta en una rama de práctica.
4. Ejecuta con el archivo ausente.
5. Comprueba que el valor se interpreta.
6. Restaura la ruta.

### Sesión 14: crear un resumen

**Objetivo:** generar un archivo no sensible desde el pipeline.

Añade una etapa que:

1. Cree `salida`.
2. Escriba el modo.
3. Escriba el número del build.
4. Compruebe que el archivo existe.
5. No incluya contraseñas ni entorno completo.

#### Ejemplo de creación

```groovy
script {
    sh 'mkdir -p salida'

    writeFile(
        file: 'salida/resumen.txt',
        text: """\
Job: ${env.JOB_NAME}
Build: ${env.BUILD_NUMBER}
Modo: ${params.MODO}
"""
    )
}
```

### Sesión 15: archivar el resumen

**Objetivo:** conservar un archivo de la ejecución.

Añade:

```groovy
archiveArtifacts(
    artifacts: 'salida/resumen.txt',
    fingerprint: true
)
```

#### Instrucciones

1. Ejecuta el pipeline.
2. Abre la ejecución.
3. Localiza el artefacto.
4. Comprueba el contenido.
5. Verifica que no se archivaron archivos adicionales.
6. Anota la política de retención indicada por el curso.

### Sesión 16: configurar `post`

**Objetivo:** diferenciar los resultados finales.

Añade:

```groovy
post {
    success {
        echo 'Validaciones completadas.'
    }

    failure {
        echo 'Se produjo un fallo.'
    }

    aborted {
        echo 'La ejecución fue interrumpida.'
    }

    always {
        echo "Resultado: ${currentBuild.currentResult}"
    }
}
```

#### Instrucciones

1. Ejecuta un caso exitoso.
2. Ejecuta un fallo controlado.
3. Cancela una ejecución de laboratorio solo con autorización.
4. Compara los mensajes.
5. Explica qué condición corresponde a cada resultado.

### Sesión 17: comparar Pipeline en interfaz y SCM

**Objetivo:** evaluar dos formas de mantener el pipeline.

#### Actividad

1. Guarda una versión en el campo de texto del job.
2. Guarda otra versión como `Jenkinsfile`.
3. Ejecuta ambas en jobs de práctica.
4. Compara cómo se revisan los cambios.
5. Identifica qué versión está en Git.
6. Explica qué usarías para un proyecto compartido.

### Sesión 18: probar un checkout incorrecto

**Objetivo:** distinguir errores de SCM y errores de pipeline.

#### Instrucciones

1. No cambies la configuración compartida.
2. En un job aislado, usa una rama de práctica inexistente si el docente lo autoriza.
3. Ejecuta.
4. Identifica si Jenkins llegó a leer el `Jenkinsfile`.
5. Registra el error de checkout.
6. Restaura la rama válida.

### Sesión 19: diagnosticar un agente no disponible

**Objetivo:** entender la espera en cola.

#### Instrucciones

1. Usa únicamente una etiqueta de práctica autorizada.
2. Ejecuta el job.
3. Observa el mensaje de espera.
4. Comprueba si el agente está desconectado.
5. No cambies la etiqueta a un nodo no autorizado.
6. Cancela la ejecución según las instrucciones.
7. Registra la causa probable.

### Sesión 20: revisión de seguridad del `Jenkinsfile`

**Objetivo:** detectar riesgos antes de entregar.

Busca:

- Contraseñas literales.
- Tokens.
- Claves privadas.
- Parámetros insertados directamente en comandos.
- `sh "${params.COMANDO}"`.
- `echo` de variables sensibles.
- `env` impreso completo.
- `|| true` en validaciones obligatorias.
- `catchError` que oculta fallos.
- Patrones de artefactos demasiado amplios.

#### Entregable

Escribe:

- Un riesgo observado.
- Una mejora concreta.
- Una prueba para comprobar la mejora.

### Sesión 21: revisar por parejas

**Objetivo:** comprobar legibilidad y comportamiento.

La persona autora explica:

- Qué entradas recibe.
- Qué etapas ejecuta.
- Qué agente usa.
- Qué errores son obligatorios.
- Qué archivos archiva.

La persona revisora comprueba:

- Estructura declarativa.
- Nombres de etapas.
- Validaciones.
- Mensajes.
- Seguridad.
- Pruebas de éxito y fallo.

### Sesión 22: proyecto integrador

**Objetivo:** entregar un pipeline pequeño y reproducible.

#### Requisitos

- Un `Jenkinsfile`.
- Un parámetro `choice`.
- Al menos cuatro etapas.
- Una validación de estructura.
- Un script de comprobación.
- Una salida de resumen.
- Un artefacto archivado.
- Bloques `post` para éxito y fallo.
- Pruebas positivas y negativas.
- Ningún secreto en el repositorio.

#### Entrega

Incluye:

- URL o identificador del repositorio, según la política.
- Rama y commit.
- Número de una ejecución exitosa.
- Número de una ejecución fallida controlada.
- Artefacto de resumen.
- Breve explicación del flujo.
- Una observación de seguridad.

---

## Pipeline integrador de referencia

Este ejemplo combina los elementos principales de la práctica.

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
    }

    environment {
        NOMBRE_PRACTICA = 'creacion-pipelines'
        DIRECTORIO_SALIDA = 'salida'
    }

    stages {
        stage('Preparar') {
            steps {
                echo "Práctica: ${env.NOMBRE_PRACTICA}"
                echo "Modo seleccionado: ${params.MODO}"
            }
        }

        stage('Validar estructura') {
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
                }
            }
        }

        stage('Validar contenido') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }

        stage('Crear resumen') {
            steps {
                script {
                    sh "mkdir -p '${env.DIRECTORIO_SALIDA}'"

                    def resumen = """\
Práctica: ${env.NOMBRE_PRACTICA}
Job: ${env.JOB_NAME}
Ejecución: ${env.BUILD_NUMBER}
Modo: ${params.MODO}
Resultado de validación: correcto
"""

                    writeFile(
                        file: "${env.DIRECTORIO_SALIDA}/resumen.txt",
                        text: resumen
                    )

                    if (!fileExists("${env.DIRECTORIO_SALIDA}/resumen.txt")) {
                        error 'No se pudo crear el resumen.'
                    }
                }
            }
        }

        stage('Archivar resultado') {
            steps {
                archiveArtifacts(
                    artifacts: 'salida/resumen.txt',
                    fingerprint: true
                )
            }
        }

        stage('Detalle opcional') {
            when {
                expression {
                    return params.MODO == 'detallado'
                }
            }

            steps {
                echo "Job: ${env.JOB_NAME}"
                echo "Ejecución: ${env.BUILD_NUMBER}"
                echo 'Se ejecutó el resumen detallado.'
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
            echo 'La ejecución fue interrumpida.'
        }

        always {
            echo "Resultado final: ${currentBuild.currentResult}"
        }
    }
}
```

### Revisar el pipeline integrador

Antes de ejecutarlo, verifica:

- Que el agente admite `sh`.
- Que el repositorio contiene los archivos.
- Que el script de validación está versionado.
- Que la carpeta de salida se crea dentro del workspace.
- Que el patrón de archivado es específico.
- Que la etapa opcional no sustituye ninguna validación obligatoria.
- Que los parámetros no contienen datos sensibles.

### Limitaciones del ejemplo

El pipeline de referencia:

- No compila una aplicación completa.
- No publica en un registro externo.
- No despliega.
- No envía notificaciones.
- No configura credenciales.
- Presupone que hay un agente Unix.
- Presupone que `bash` está instalado.
- No define una política de retención.

---

## Diagnóstico de errores frecuentes

### El job no aparece en la carpeta

Comprueba:

- Carpeta seleccionada.
- Permisos de creación.
- Nombre introducido.
- Tipo de job.
- Filtros o vistas de Jenkins.

### No se inicia la ejecución

Comprueba:

- Que el job se guardó.
- Que el usuario puede ejecutar.
- Que no hay una política de espera.
- Que el job no está deshabilitado.
- Que la cola no contiene un error.

### El job queda en cola

Comprueba:

- Agentes disponibles.
- Etiquetas.
- Ejecutores ocupados.
- Restricciones del job.
- Estado de los nodos.

### Error de sintaxis del `Jenkinsfile`

Comprueba:

- Llaves.
- Comillas.
- Comas.
- Nombres de bloques.
- Ubicación de `steps`.
- Sintaxis de `parameters`.
- Llaves de `when`.
- Versión de Jenkins y plugins.

### `sh` no está disponible

Comprueba:

- Sistema operativo del agente.
- Tipo de paso.
- Compatibilidad del nodo.
- Si se debe utilizar `bat` o PowerShell.

### El archivo no aparece

Comprueba:

- Checkout de SCM.
- Rama.
- Commit.
- Ruta relativa.
- Nombre exacto.
- Mayúsculas y minúsculas.
- Workspace y agente.

### El script no se ejecuta

Comprueba:

- Ruta.
- Existencia del archivo.
- Bash instalado.
- Sintaxis.
- Permisos, si se ejecuta directamente.
- Contenido del script.
- Salida anterior al fallo.

### El parámetro no aparece

Comprueba:

- Declaración dentro de `parameters`.
- Nombre usado en `params`.
- Guardado de configuración.
- Primera ejecución después del cambio.
- Permisos para lanzar con parámetros.

### La etapa opcional está omitida

Comprueba:

- Valor real del parámetro.
- Expresión `when`.
- Mayúsculas.
- Tipo del valor.
- Resultado esperado.
- Si la etapa debía ser opcional.

### No aparece el artefacto

Comprueba:

- Que el archivo existe.
- Ruta relativa.
- Orden entre escritura y archivado.
- Patrón de `archiveArtifacts`.
- Resultado de la ejecución.
- Errores de permisos.

### El build es `SUCCESS` pese a una validación fallida

Busca:

- `returnStatus` no comprobado.
- `catchError`.
- `try/catch` que continúa.
- `|| true`.
- Script que devuelve siempre cero.
- Condición que omitió la etapa.

### El build es `FAILURE` aunque se imprimió un mensaje de éxito

Busca el código de salida final del comando.

Un script puede imprimir `OK` y terminar con código no cero.

### `post` muestra un mensaje inesperado

Comprueba:

- Resultado global.
- Condición seleccionada.
- Etapas fallidas.
- Cancelación o timeout.
- Nivel del bloque `post`.
- Errores ocurridos durante una acción posterior.

### Informe de diagnóstico

```text
Job:
Build:
Rama:
Commit:
Agente:
Etapa:
Primer error relevante:
Comando:
Código de salida:
Resultado:
Observación:
Hipótesis:
Comprobación siguiente:
```

---

## Checklist de revisión del pipeline

### Estructura

- [ ] El pipeline tiene un único bloque `pipeline`.
- [ ] El agente está definido.
- [ ] Las etapas tienen nombres claros.
- [ ] Los pasos están dentro de `steps`.
- [ ] Las llaves están equilibradas.
- [ ] El `Jenkinsfile` se encuentra en la ruta configurada.

### Entradas

- [ ] Los parámetros tienen tipo apropiado.
- [ ] Las opciones posibles están limitadas.
- [ ] Las entradas se validan antes de usarse.
- [ ] No se piden secretos como texto normal.
- [ ] No se construyen comandos con texto libre.

### Ejecución

- [ ] El agente tiene las herramientas necesarias.
- [ ] Los comandos corresponden al sistema operativo.
- [ ] El timeout es razonable.
- [ ] Los pasos son reproducibles.
- [ ] Los errores obligatorios se propagan.

### Artefactos

- [ ] Solo se archivan archivos necesarios.
- [ ] El archivo se crea durante esta ejecución.
- [ ] No contiene secretos.
- [ ] El patrón no incluye archivos temporales inesperados.
- [ ] La retención sigue la política del curso.

### Seguridad

- [ ] No hay credenciales en el código.
- [ ] No se imprime el entorno completo.
- [ ] No hay comandos destructivos.
- [ ] Los permisos son los mínimos necesarios.
- [ ] Los cambios globales fueron aprobados.

### Pruebas

- [ ] Se ejecutó un caso válido.
- [ ] Se probó un fallo controlado.
- [ ] Se comprobó el resultado final.
- [ ] Se revisó la consola.
- [ ] Se restauró el estado de práctica.

---

## Rúbrica de evaluación

La evaluación valora el comportamiento, la legibilidad y la seguridad.

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Estructura | Pipeline incompleto | Estructura declarativa válida | Estructura clara y consistente |
| Etapas | Nombres ambiguos | Fases diferenciadas | Dependencias bien explicadas |
| Entradas | Sin validación | Parámetros limitados | Casos límite documentados |
| Errores | Fallos ocultos | Fallos visibles | Diagnóstico y recuperación claros |
| Artefactos | No se controlan | Patrón específico | Retención y contenido revisados |
| Seguridad | Hay datos sensibles | No hay secretos expuestos | Riesgos y permisos documentados |
| Pruebas | Solo se prueba éxito | Éxito y fallo controlado | Casos de borde y diagnóstico |
| Documentación | Insuficiente | Instrucciones reproducibles | Decisiones y limitaciones explicadas |

### Evidencias de entrega

La entrega puede incluir:

- `Jenkinsfile`.
- Script de validación.
- README del proyecto.
- Identificador de un build exitoso.
- Identificador de un fallo controlado.
- Artefacto de resumen.
- Informe de diagnóstico.
- Revisión de seguridad.
- Descripción de decisiones de diseño.

No incluyas capturas con contraseñas, tokens o datos de sesión.

---

## Glosario

- **Agente:** nodo donde Jenkins ejecuta los pasos.
- **Build:** ejecución concreta de un job.
- **Etapa:** fase visible de un pipeline.
- **Freestyle:** tipo de job configurado principalmente desde la interfaz.
- **Job:** unidad de trabajo de Jenkins.
- **Jenkinsfile:** archivo con la definición del pipeline.
- **Pipeline:** secuencia automatizada de etapas y pasos.
- **Pipeline declarativo:** forma estructurada de definir un pipeline.
- **Paso:** acción ejecutada dentro de una etapa.
- **Plugin:** extensión que añade funciones a Jenkins.
- **SCM:** sistema de control de versiones.
- **Workspace:** directorio de trabajo de una ejecución.
- **Parámetro:** entrada que puede variar entre builds.
- **Variable de entorno:** valor disponible para procesos en un contexto.
- **`agent`:** directiva que selecciona dónde ejecutar.
- **`stages`:** bloque que contiene las etapas.
- **`steps`:** bloque que contiene los pasos de una etapa.
- **`when`:** directiva que condiciona la ejecución de una etapa.
- **`post`:** bloque para acciones relacionadas con el resultado.
- **`returnStatus`:** opción que captura el código de salida de un comando.
- **`returnStdout`:** opción que captura salida estándar.
- **Artefacto:** archivo asociado a una ejecución y conservado por Jenkins.
- **Checkout:** descarga de una revisión desde SCM.
- **`SUCCESS`:** resultado exitoso de las acciones configuradas.
- **`FAILURE`:** resultado de fallo.
- **`UNSTABLE`:** resultado que requiere atención.
- **`ABORTED`:** ejecución interrumpida.
- **Etapa omitida:** etapa que no se ejecutó.
- **Mínimo privilegio:** principio de conceder solo los permisos necesarios.

---

## Síntesis

Crear un pipeline consiste en definir qué entradas recibe, dónde se ejecuta, qué etapas realiza y cómo comunica sus resultados.

- Empieza por un flujo pequeño.
- Usa nombres de etapas que expliquen el trabajo.
- Guarda el `Jenkinsfile` en SCM cuando sea posible.
- Valida parámetros antes de utilizarlos.
- Comprueba el código de salida de comandos.
- Mantén separada la lógica de Groovy y la de shell.
- Archiva solo los resultados necesarios.
- Conserva visibles los fallos importantes.
- Prueba tanto el éxito como el fallo controlado.
- Revisa agente, rama y commit al diagnosticar.
- Protege credenciales y datos sensibles.
- No cambies la configuración global sin autorización.