# ¿Qué es un pipeline de Jenkins?

Un **pipeline de Jenkins** es una definición automatizada de los pasos que permiten validar, construir, probar, empaquetar o desplegar software. Describe qué trabajo se debe realizar, en qué orden, dónde se ejecuta y qué hacer cuando cada paso tiene éxito o falla.

En esta unidad aprenderás a leer y escribir pipelines declarativos, a entender sus componentes y a probarlos en un entorno de laboratorio. Las sesiones prácticas avanzan desde un pipeline de un solo paso hasta un flujo con validaciones, artefactos, parámetros y gestión de resultados.

> **Uso seguro:** realiza las prácticas únicamente en una instancia de laboratorio autorizada. Los ejemplos no despliegan en producción ni requieren credenciales. No incluyas secretos en archivos `Jenkinsfile`, parámetros, comandos o logs.

## Conceptos fundamentales

Un pipeline transforma una secuencia de tareas en un proceso explícito, revisable y repetible.

### Qué es un pipeline

Un pipeline es una definición de trabajo que Jenkins puede ejecutar.

Puede especificar:

- En qué agente se ejecutan los pasos.
- Qué etapas forman el proceso.
- Qué comandos se ejecutan.
- Qué condiciones permiten continuar.
- Qué resultados se conservan.
- Qué acciones se realizan al terminar.
- Qué hacer si una etapa falla.

Una definición de pipeline puede guardarse en un archivo llamado `Jenkinsfile`.

### Para qué sirve

Un pipeline puede automatizar tareas como:

- Obtener código desde Git.
- Validar la estructura de un proyecto.
- Revisar formato o sintaxis.
- Ejecutar pruebas.
- Construir una aplicación.
- Crear un paquete.
- Archivar informes.
- Publicar un artefacto.
- Desplegar a un entorno autorizado.

La lista de tareas depende del proyecto y de la política del equipo.

### Qué no garantiza

Un pipeline no garantiza por sí mismo que:

- El software esté libre de errores.
- Se hayan ejecutado todas las pruebas necesarias.
- El entorno de destino sea correcto.
- El artefacto esté listo para producción.
- Los secretos estén protegidos.
- El despliegue se pueda revertir.
- El proceso sea seguro.

Jenkins ejecuta las reglas configuradas. La calidad de esas reglas importa.

### Pipeline, job y ejecución

Estos conceptos están relacionados, pero no son idénticos.

- **Pipeline:** flujo automatizado de etapas y pasos.
- **Job:** configuración de Jenkins que inicia o administra un trabajo.
- **Ejecución:** instancia concreta de un job o pipeline.
- **Etapa:** parte lógica del flujo.
- **Paso:** acción concreta dentro de una etapa.
- **Agente:** entorno donde se ejecutan los pasos.

Un mismo job puede tener muchas ejecuciones.

Cada ejecución puede procesar una rama, un commit o unos parámetros distintos.

### Ejemplo de relación

```text
Job: validar-aplicacion
    ├── Ejecución 1: commit abc123, resultado correcto
    ├── Ejecución 2: commit def456, prueba fallida
    └── Ejecución 3: commit ghi789, resultado correcto
```

El job describe qué hacer.

Cada ejecución registra una ocasión en la que Jenkins hizo ese trabajo.

### Declarativo y Scripted

Jenkins admite dos estilos de pipeline.

- **Declarativo:** utiliza una estructura estable y visible.
- **Scripted:** se escribe con más libertad usando Groovy.

En esta unidad se prioriza el estilo declarativo porque ayuda a reconocer las partes principales.

### Pipeline declarativo

Un pipeline declarativo suele tener esta forma:

```groovy
pipeline {
    agent any

    stages {
        stage('Ejemplo') {
            steps {
                echo 'Hola desde Jenkins'
            }
        }
    }
}
```

El formato hace visibles:

- El agente.
- Las etapas.
- Los pasos.
- La secuencia de ejecución.

### Pipeline Scripted

El estilo Scripted ofrece más flexibilidad y control mediante Groovy.

También puede ser más difícil de leer y mantener para quien empieza.

No lo utilices solo porque parezca más breve.

Elige el estilo que el equipo pueda entender, probar y mantener.

### `Jenkinsfile`

Un `Jenkinsfile` es un archivo de texto que contiene la definición del pipeline.

Normalmente se guarda en la raíz del repositorio, aunque la ubicación puede configurarse.

Puede ayudar a:

- Revisar cambios del proceso junto al código.
- Mantener historial en Git.
- Compartir la definición con el equipo.
- Relacionar una ejecución con una versión del pipeline.
- Reproducir el flujo en otras ramas o entornos.

### Pipeline en Jenkins o en Git

Jenkins puede permitir escribir un pipeline directamente en la interfaz.

También puede obtenerlo desde un `Jenkinsfile` de un repositorio.

Definirlo en la interfaz puede resultar útil para una demostración breve.

Guardar el pipeline en Git suele facilitar su revisión y mantenimiento.

## Estructura del pipeline declarativo

Un pipeline declarativo utiliza bloques con funciones definidas.

### Bloque `pipeline`

`pipeline` contiene la definición declarativa.

Los componentes más habituales aparecen dentro de este bloque:

- `agent`
- `stages`
- `environment`
- `parameters`
- `options`
- `triggers`
- `post`

No todos los pipelines necesitan todas estas opciones.

### Bloque `agent`

`agent` indica dónde se ejecutará el pipeline o una etapa.

Una configuración básica es:

```groovy
agent any
```

Esto solicita a Jenkins un agente disponible que cumpla las condiciones de la instancia.

No significa que Jenkins pueda utilizar cualquier equipo del mundo.

### Agente etiquetado

Un pipeline puede solicitar una etiqueta:

```groovy
agent {
    label 'laboratorio'
}
```

Utiliza una etiqueta que exista y haya sido aprobada para la práctica.

Si no hay nodos con esa etiqueta, el pipeline puede quedar en cola.

!!! note "Referencia de la sintaxis del bloque agent"
    La mejor fuente de sintaxis para `agent` es esta [url](https://www.jenkins.io/doc/book/pipeline/syntax/#agent)
     
### Agente por etapa

Un pipeline también puede asignar agentes en distintas etapas.

Esta opción puede servir si una etapa necesita un sistema diferente.

Cuando se utilizan varios agentes, hay que planificar:

- Qué archivos necesita cada etapa.
- Cómo se transfieren o conservan.
- Qué workspace usa cada agente.
- Qué herramientas necesita cada uno.
- Qué pasa si una etapa falla.

### Bloque `stages`

`stages` contiene las etapas principales del pipeline.

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

Las etapas se ejecutan en orden, salvo que se configure paralelismo.

### Bloque `stage`

`stage` representa una unidad lógica del flujo.

Los nombres deberían explicar qué se hace.

Nombres claros:

- `Validar estructura`
- `Ejecutar pruebas`
- `Construir paquete`
- `Archivar informe`

Nombres poco informativos:

- `Paso 1`
- `Cosas`
- `Final`
- `Prueba nueva`

### Bloque `steps`

`steps` contiene las acciones concretas de una etapa.

Ejemplos:

- `echo`
- `sh`
- `bat`
- `archiveArtifacts`
- `junit`
- `input`

La disponibilidad y el comportamiento pueden depender de la versión o los plugins.

### Paso `echo`

`echo` escribe un mensaje en la salida de la ejecución.

Ejemplo:

```groovy
echo 'Comienza la validación'
```

Utiliza mensajes breves que expliquen el propósito del paso.

No uses `echo` para imprimir secretos.

### Paso `sh`

`sh` ejecuta comandos de shell Unix en el agente.

Ejemplo:

```groovy
sh 'pwd'
```

Este paso requiere un agente compatible con el shell utilizado.

No supongas que un comando Linux funcionará en un agente Windows.

### Paso `bat`

`bat` ejecuta comandos de Windows en entornos compatibles.

La sintaxis y las herramientas disponibles dependen del agente.

Consulta las instrucciones del curso si la práctica utiliza Windows.

### Bloque `post`

`post` define acciones que se ejecutan después de las etapas, según el resultado.

Puede incluir condiciones como:

- `success`
- `failure`
- `always`
- `unstable`
- `aborted`
- `changed`

La disponibilidad y los detalles pueden depender de la versión de Jenkins.

### Ejemplo con `post`

```groovy
post {
    success {
        echo 'El pipeline terminó correctamente.'
    }

    failure {
        echo 'El pipeline falló. Revisa la consola.'
    }

    always {
        echo 'La ejecución ha terminado.'
    }
}
```

`post` no debería ocultar un fallo ni convertir un error real en éxito sin una razón explícita.

## Variables y entorno

Las variables ayudan a configurar pasos y reutilizar valores.

### Variables de entorno

Un pipeline puede definir valores de entorno con `environment`.

Ejemplo:

```groovy
environment {
    MODO = 'laboratorio'
}
```

Después, un paso de shell puede utilizar la variable según el sistema operativo y el shell.

### Ejemplo de uso

```groovy
pipeline {
    agent any

    environment {
        MODO = 'laboratorio'
    }

    stages {
        stage('Mostrar modo') {
            steps {
                echo "Modo configurado: ${env.MODO}"
            }
        }
    }
}
```

Utiliza valores no sensibles en ejemplos y prácticas.

### Variables sensibles

No imprimas variables que puedan contener:

- Contraseñas.
- Tokens.
- Claves privadas.
- Datos personales.
- Información interna no autorizada.

Evita imprimir todas las variables de entorno con comandos como `env` si hay credenciales disponibles.

### Variables definidas en el sistema

Jenkins, los plugins y el agente pueden definir variables adicionales.

Su existencia depende de la instalación y del tipo de ejecución.

No bases un pipeline en una variable que no esté documentada o comprobada.

### Variables y sistema operativo

La sintaxis para acceder a variables puede variar entre:

- Groovy.
- Bash.
- PowerShell.
- `cmd.exe`.

Comprueba qué lenguaje interpreta cada paso.

Un error común es confundir la interpolación de Groovy con la expansión de variables del shell.

## Parámetros

Los parámetros permiten modificar una ejecución sin cambiar la definición del pipeline.

### Tipos habituales

Según la versión y los plugins, puede haber parámetros de:

- Texto.
- Booleano.
- Selección.
- Rama.
- Archivo.
- Contraseña o secreto.

Los parámetros disponibles dependen de la instalación.

### Parámetro de texto

Puede servir para un valor no sensible.

Ejemplos:

- Nombre de una práctica.
- Mensaje de prueba.
- Número de versión de laboratorio.
- Identificador no confidencial.

Valida el contenido antes de utilizarlo en comandos.

### Parámetro de selección

Una lista de opciones limita los valores admitidos.

Ejemplo conceptual:

```text
MODO:
- simple
- detallado
```

Una lista de opciones puede reducir errores tipográficos y limitar entradas inesperadas.

### Parámetro booleano

Un valor booleano puede activar o desactivar una opción.

Documenta:

- Qué significa `true`.
- Qué significa `false`.
- Cuál es el valor predeterminado.
- Qué recursos o acciones cambia.

### No usar parámetros comunes para secretos

No introduzcas contraseñas o tokens en un parámetro de texto común.

Utiliza el almacén de credenciales de Jenkins o el mecanismo autorizado.

### Validar parámetros

Antes de utilizar un valor:

- Define el conjunto de valores válido.
- Rechaza entradas inesperadas.
- Evita construir comandos inseguros.
- No permitas que controle un destino real sin controles.
- No aceptes rutas arbitrarias para operaciones destructivas.

!!! note "Referencia de la sintaxis del bloque parameters"
    La mejor fuente de sintaxis para `parameters` es esta [url](https://www.jenkins.io/doc/book/pipeline/syntax/#parameters)

## Condiciones y flujo de control

Las condiciones permiten decidir si una etapa se ejecuta.

### Condición `when`

En un pipeline declarativo, `when` puede controlar la ejecución de una etapa.

Ejemplo conceptual:

```groovy
stage('Solo en rama principal') {
    when {
        branch 'main'
    }

    steps {
        echo 'Esta etapa se ejecuta en main.'
    }
}
```

La condición exacta depende de la configuración del job y del tipo de pipeline.

### Verificar el nombre de rama

El comportamiento de `branch` puede variar según se trate de un pipeline normal o multibranch.

Comprueba cómo Jenkins representa la rama en la instancia del curso.

Aquí hay un ejemplo para ver exactamente el comportamiento de when:

```groovy
pipeline {
    agent any
    stages {
        stage('Checkout'){
            steps{
                git branch: 'production', url: 'https://github.com/Gromenaware/simple-maven-spring-boot-example.git'
            }
        }
        stage('Example Build') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Example Deploy') {
            when {
                expression { return env.BRANCH_NAME == 'production' || true } // O evaluar una variable/parámetro custom
            }
            steps {
                echo 'Deploying'
            }
        }
    }
}
```

### Condiciones por parámetros

Una etapa puede ejecutarse solo si un parámetro tiene un valor específico.

Limita las opciones para que un parámetro no habilite accidentalmente una operación peligrosa.

### Saltar etapas no equivale a validar

Si una etapa no se ejecuta por una condición, eso no significa que haya pasado.

La consola y la vista de etapas deben aclarar si se ejecutó, se omitió o falló.

### Errores y condiciones

Define qué errores detienen el flujo y cuáles son informativos.

Para una comprobación esencial, un fallo debería detener las etapas posteriores.

No marques automáticamente como éxito una etapa que no completó la validación.

## Herramientas y opciones

Jenkins puede proporcionar opciones para limitar tiempo, conservar historial o seleccionar herramientas.

### Bloque `tools`

`tools` puede utilizar herramientas configuradas en Jenkins, si la instancia y los plugins correspondientes las ofrecen.

La sintaxis depende de la instalación.

Antes de utilizar una herramienta:

- Comprueba que está configurada.
- Confirma su versión.
- Identifica el agente.
- Revisa el comportamiento en el workspace.

### Herramientas del agente

La herramienta debe estar disponible en el entorno donde se ejecuta el paso.

Que esté instalada en el controlador no garantiza que exista en el agente.

### Bloque `options`

`options` puede configurar aspectos del pipeline, como:

- Límites de tiempo.
- Retención de ejecuciones.
- Prevención de ejecuciones concurrentes.
- Configuración del checkout.

La lista exacta depende de Jenkins y sus plugins.

### Límite de tiempo

Un límite puede evitar que un job quede ejecutándose indefinidamente.

Selecciona el valor con el contexto del trabajo.

Un límite demasiado corto puede interrumpir procesos válidos.

### No permitir concurrencia

Un pipeline puede configurarse para evitar ejecuciones simultáneas cuando existe riesgo de conflicto.

Puede ser útil si los jobs modifican un recurso compartido.

No sustituye una revisión completa de la concurrencia.

### Retención del historial

La retención puede ayudar a controlar el espacio ocupado por ejecuciones y artefactos.

Define qué datos conservar según:

- Necesidad de diagnóstico.
- Coste de almacenamiento.
- Requisitos de auditoría.
- Duración de las prácticas.
- Política de la instancia.

### Triggers

Los disparadores pueden iniciar el pipeline por:

- Acción manual.
- Cambios en Git.
- Programación.
- Finalización de otro job.
- Evento externo.

Para las prácticas iniciales, el inicio manual reduce sorpresas.

### Programación

Una programación debe tener:

- Un propósito.
- Un responsable.
- Una frecuencia apropiada.
- Recursos disponibles.
- Una forma de tratar los fallos.

No programes una tarea en una instancia compartida sin autorización.

## Paralelismo y matriz

Jenkins puede ejecutar trabajo en paralelo si la definición y el entorno lo permiten.

### Etapas paralelas

El paralelismo puede reducir la duración total cuando las tareas son independientes.

Antes de usarlo, comprueba:

- Que las etapas no modifican los mismos archivos.
- Que los servicios externos soportan concurrencia.
- Que hay suficientes recursos.
- Que los agentes están disponibles.
- Que los resultados se identifican correctamente.

### Ejemplo conceptual de paralelismo

```groovy
pipeline {
    agent any

    stages {
        stage('Validaciones') {
            parallel {
                stage('Revisar archivo') {
                    steps {
                        sh 'test -f README.md'
                    }
                }

                stage('Consultar Git') {
                    steps {
                        sh 'git --version'
                    }
                }
            }
        }
    }
}
```

Este ejemplo presupone un agente compatible con shell Unix.

### Riesgo de compartir workspace

Las ramas paralelas pueden compartir o utilizar workspaces según la configuración.

Si dos pasos modifican los mismos archivos, pueden interferir.

Comprueba las reglas de workspace antes de paralelizar.

### Matriz

Una matriz permite repetir tareas con distintas combinaciones de valores, cuando la versión y configuración lo admiten.

Puede servir para probar combinaciones de:

- Sistema operativo.
- Versión de lenguaje.
- Configuración.
- Variante de compilación.

Una matriz puede multiplicar el número de ejecuciones y el consumo de recursos.

Úsala solo si la cobertura adicional es necesaria.

## Artifacts, informes y resultados

Un pipeline puede producir archivos que Jenkins conserva o presenta.

### Artefacto

Un artefacto es un archivo generado por la ejecución.

Puede ser:

- Un paquete.
- Un informe.
- Una imagen exportada.
- Un archivo de salida.
- Un conjunto de recursos.

### Archivar un artefacto

El paso `archiveArtifacts` puede conservar archivos asociados a una ejecución, si está disponible.

Ejemplo:

```groovy
archiveArtifacts artifacts: 'salida/mensaje.txt',
                 fingerprint: true
```

El patrón debe corresponder a un archivo que exista en el workspace.

### Qué no significa archivar

Archivar un archivo no significa que:

- Se haya desplegado.
- Se haya publicado en un registro externo.
- Se conserve para siempre.
- Sea seguro para producción.
- Haya superado todas las pruebas.

### Informes de pruebas

Un pipeline puede publicar informes si el proyecto genera un formato compatible y la instancia tiene la acción o plugin correspondiente.

Comprueba:

- Que el informe se genera.
- Que la ruta es correcta.
- Que el formato es compatible.
- Qué ocurre si no hay resultados.
- Qué información se expone.

### Fingerprints y trazabilidad

Una huella puede ayudar a relacionar un artefacto con ejecuciones.

La disponibilidad depende de la configuración de Jenkins.

La trazabilidad también puede incluir:

- Commit.
- Rama.
- Número de ejecución.
- Versión.
- Identificador del artefacto.
- Entorno donde se probó.

## Pipeline y Git

Guardar el `Jenkinsfile` en Git permite revisar el pipeline junto con el código.

### Estructura habitual

```text
proyecto/
├── Jenkinsfile
├── README.md
├── app/
└── scripts/
```

La ubicación puede ser diferente si Jenkins se configura para buscar el archivo en otra ruta.

### Revisar el archivo antes de ejecutarlo

Antes de iniciar un pipeline:

- Lee el `Jenkinsfile`.
- Revisa scripts llamados por el pipeline.
- Comprueba comandos destructivos.
- Confirma el agente.
- Identifica credenciales referenciadas.
- Revisa destinos y rutas.

Un pipeline es código ejecutable.

### Commit y ejecución

Anota qué commit procesa Jenkins.

Si una ejecución falla, el identificador del commit ayuda a relacionar el resultado con el cambio correspondiente.

### Ramas y solicitudes de cambios

Un pipeline puede validar ramas o solicitudes de cambios.

El código de una rama no revisada podría ejecutar comandos.

Por eso:

- No proporciones credenciales privilegiadas a código no confiable.
- Utiliza agentes aislados.
- Limita el acceso a red.
- Aplica la política de revisión del repositorio.

## Seguridad del pipeline

El pipeline puede ejecutar comandos y acceder a credenciales. La seguridad forma parte de su diseño.

### Credenciales

No escribas secretos en:

- `Jenkinsfile`.
- Scripts versionados.
- Mensajes de `echo`.
- Parámetros de texto.
- Logs.
- Capturas.
- Documentación pública.

Utiliza el almacén de credenciales aprobado.

### Mínimo privilegio

Un pipeline debería tener solo:

- Permisos del repositorio que necesita.
- Acceso a los agentes requeridos.
- Credenciales necesarias para su tarea.
- Conectividad a los servicios autorizados.

Un pipeline de pruebas no necesita acceso a producción por defecto.

### Comandos y entradas

Valida los valores proporcionados por parámetros o eventos externos.

No construyas comandos con texto no confiable sin comprender cómo lo interpreta el shell.

### Código externo

Un `Jenkinsfile` puede ejecutar comandos arbitrarios.

Antes de ejecutar código de origen desconocido:

- Inspecciona el archivo.
- Comprueba scripts asociados.
- Limita credenciales.
- Usa un agente aislado.
- Restringe la red.
- Consulta al responsable del repositorio.

### Evitar información sensible en logs

No imprimas:

- Variables de entorno completas.
- Tokens.
- Contraseñas.
- Claves.
- Datos personales.
- Contenido confidencial.

Si un log se ha expuesto, avisa al responsable para evaluar la respuesta apropiada.

## Sesión práctica 1: leer un pipeline

Esta actividad enseña a reconocer las partes de un `Jenkinsfile`.

### Preparación

Utiliza el ejemplo:

```groovy
pipeline {
    agent any

    stages {
        stage('Bienvenida') {
            steps {
                echo 'Comienza la práctica'
            }
        }

        stage('Consultar agente') {
            steps {
                sh 'uname -s'
                sh 'whoami'
            }
        }
    }

    post {
        always {
            echo 'Ejecución terminada'
        }
    }
}
```

### Instrucciones

1. Lee el archivo sin ejecutarlo.
2. Identifica el agente.
3. Cuenta las etapas.
4. Identifica los pasos de cada etapa.
5. Explica cuándo se ejecuta el bloque `post`.
6. Señala qué comandos dependen de Linux.
7. Identifica qué información aparece en la consola.
8. Propón un nombre más descriptivo para cada etapa, si hace falta.

### Tabla de análisis

| Elemento | Ubicación | Función |
|---|---|---|
| Agente | | |
| Etapa 1 | | |
| Etapa 2 | | |
| `echo` | | |
| `sh` | | |
| `post` | | |

### Preguntas

- ¿Qué ocurriría si no hubiera un agente disponible?
- ¿Qué etapa fallaría en un agente Windows sin shell compatible?
- ¿Qué mensajes aparecerían?
- ¿Qué significa que `post` use `always`?

## Sesión práctica 2: crear el primer pipeline

Esta actividad ejecuta un mensaje sencillo en una instancia de laboratorio.

### Requisitos

- Acceso a Jenkins.
- Permiso para crear un job Pipeline o ejecutar un job preparado.
- Agente de laboratorio disponible.
- Sin credenciales externas.

### Crear el pipeline

Utiliza:

```groovy
pipeline {
    agent any

    stages {
        stage('Hola') {
            steps {
                echo 'Hola desde el primer pipeline'
            }
        }
    }
}
```

### Iniciar la ejecución

1. Guarda el job.
2. Inicia una ejecución manual.
3. Espera a que termine.
4. Abre la página de la ejecución.
5. Revisa la vista de etapas.
6. Abre la consola.
7. Comprueba el mensaje.
8. Anota el resultado.

### Hoja de observación

```text
Nombre del job:
Número de ejecución:
Agente:
Estado final:
Mensaje mostrado:
Duración:
Duda observada:
```

### Reflexión

- ¿Qué diferencia hay entre el job y la ejecución?
- ¿Qué agente utilizó Jenkins?
- ¿Qué pasos ejecutó el pipeline?
- ¿Qué información aporta la vista de etapas?
- ¿Qué información adicional aporta la consola?

## Sesión práctica 3: validar un archivo

Esta práctica añade una condición que puede pasar o fallar.

### Crear la estructura

En un repositorio de práctica:

```bash
mkdir -p app
printf 'Práctica introductoria de Jenkins\n' > app/mensaje.txt
```

Confirma que el archivo está en la ruta esperada.

### Jenkinsfile de validación

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar archivo') {
            steps {
                sh 'test -f app/mensaje.txt'
            }
        }

        stage('Comprobar contenido') {
            steps {
                sh 'grep -q "Jenkins" app/mensaje.txt'
            }
        }
    }

    post {
        success {
            echo 'Las validaciones han pasado.'
        }

        failure {
            echo 'Una validación ha fallado.'
        }
    }
}
```

### Ejecutar la versión correcta

Comprueba que `app/mensaje.txt` contiene `Jenkins`.

Ejecuta el pipeline.

Registra:

- Qué etapa pasó primero.
- Qué etapa comprobó el contenido.
- Qué resultado final apareció.
- Qué mensaje mostró `post`.

### Provocar un fallo controlado

Sustituye temporalmente el contenido por:

```text
Práctica introductoria
```

Guarda el cambio en una rama de laboratorio o sigue la instrucción del docente.

Ejecuta otra vez y observa:

- Qué etapa falla.
- Qué comando falló.
- Qué resultado final aparece.
- Si se ejecuta el bloque `post` de fallo.

### Corregir

Restaura un texto que incluya `Jenkins`.

Vuelve a ejecutar el pipeline.

Comprueba que el estado vuelve a ser correcto.

### Preguntas

- ¿Qué condición causó el fallo?
- ¿Cómo lo muestra la consola?
- ¿Por qué una etapa posterior no debería ejecutarse si una validación esencial falla?
- ¿Qué evidencia confirma que el cambio corrigió el problema?

## Sesión práctica 4: separar la validación en un script

Mantener el script fuera del `Jenkinsfile` puede mejorar su reutilización.

### Crear el script

Crea `scripts/validar.sh`:

```bash
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: falta $ARCHIVO"
  exit 1
fi

if grep -q "Jenkins" "$ARCHIVO"; then
  echo "OK: se encontró la palabra Jenkins"
else
  echo "ERROR: no se encontró la palabra Jenkins"
  exit 1
fi
```

### Revisar el script

Identifica:

- La condición de archivo existente.
- La búsqueda de texto.
- El mensaje de éxito.
- Los mensajes de error.
- El uso de `exit 1`.

### Jenkinsfile para ejecutar el script

```groovy
pipeline {
    agent any

    stages {
        stage('Validar entradas') {
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
}
```

### Diferencia entre `sh` y `bash`

`sh` es un paso de Jenkins que solicita ejecutar un comando de shell.

`bash` es un intérprete de comandos que puede estar instalado en el agente.

La disponibilidad y la shell predeterminada dependen del agente.

### Preguntas

- ¿Qué responsabilidad conserva el `Jenkinsfile`?
- ¿Qué responsabilidad tiene el script?
- ¿Qué parte se podría probar localmente?
- ¿Qué herramienta debe existir en el agente?

## Sesión práctica 5: crear y archivar un artefacto

Esta actividad añade una salida a la ejecución.

### Objetivo

El pipeline debe:

- Validar el archivo de entrada.
- Crear una carpeta de salida.
- Copiar el archivo.
- Archivar la copia.

### Jenkinsfile

```groovy
pipeline {
    agent any

    stages {
        stage('Validar entrada') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'grep -q "Jenkins" app/mensaje.txt'
            }
        }

        stage('Preparar salida') {
            steps {
                sh 'mkdir -p salida'
                sh 'cp app/mensaje.txt salida/mensaje.txt'
            }
        }

        stage('Archivar salida') {
            steps {
                archiveArtifacts artifacts: 'salida/mensaje.txt',
                                 fingerprint: true
            }
        }
    }
}
```

### Revisar el orden

La copia ocurre después de la validación.

El archivado ocurre después de la copia.

Si la validación falla, no conviene presentar como válida una salida que dependa de ella.

### Consultar el artefacto

Después de una ejecución correcta:

1. Abre la página de la ejecución.
2. Busca la sección de artefactos.
3. Localiza `salida/mensaje.txt`.
4. Comprueba su contenido, si está permitido.
5. Relaciona el archivo con el número de ejecución.
6. Anota cuánto tiempo se conserva, si se conoce.

### Preguntas

- ¿Qué archivo se conserva?
- ¿Qué diferencia hay entre el workspace y el artefacto?
- ¿Qué pasaría si la ruta de archivado no coincide?
- ¿Archivar significa desplegar?

## Sesión práctica 6: usar un agente etiquetado

Esta actividad ejecuta el pipeline en un agente designado.

### Preparación

El docente proporciona una etiqueta válida, por ejemplo:

```text
laboratorio
```

No utilices esta etiqueta si la instancia no la tiene.

### Jenkinsfile

```groovy
pipeline {
    agent {
        label 'ETIQUETA_AUTORIZADA'
    }

    stages {
        stage('Consultar agente') {
            steps {
                sh 'uname -s'
                sh 'whoami'
                sh 'pwd'
            }
        }

        stage('Validar archivo') {
            steps {
                sh 'test -f app/mensaje.txt'
            }
        }
    }
}
```

### Ejecutar

1. Sustituye el marcador por la etiqueta autorizada.
2. Revisa la configuración.
3. Inicia una ejecución.
4. Observa si Jenkins encuentra un agente.
5. Abre el log.
6. Identifica sistema, usuario y workspace.
7. Registra el resultado.

### Si queda en cola

Comprueba con el docente:

- Que la etiqueta existe.
- Que el nodo está conectado.
- Que hay un ejecutor disponible.
- Que el job no solicita una etiqueta incorrecta.

No cambies las etiquetas globales.

## Sesión práctica 7: utilizar variables de entorno

Esta actividad utiliza un valor no sensible.

### Jenkinsfile de ejemplo

```groovy
pipeline {
    agent any

    environment {
        MODO = 'practica'
    }

    stages {
        stage('Mostrar configuración') {
            steps {
                echo "Modo de ejecución: ${env.MODO}"
            }
        }
    }
}
```

### Actividad

1. Lee el pipeline.
2. Identifica dónde se define `MODO`.
3. Identifica dónde se utiliza.
4. Ejecuta el job.
5. Comprueba la salida.
6. Cambia el valor por otro no sensible.
7. Repite la ejecución.

### Preguntas

- ¿Qué valor se muestra?
- ¿Qué diferencia hay entre una variable Groovy y una variable del shell?
- ¿Qué valor no debería imprimirse nunca?
- ¿Qué control habría que añadir para validar un valor externo?

## Sesión práctica 8: añadir un parámetro seguro

Esta actividad utiliza un parámetro no sensible y limitado.

### Objetivo

El job aceptará un modo de ejecución entre dos opciones:

```text
simple
detallado
```

### Diseño

Antes de configurar el parámetro, acuerda:

- Qué hará cada opción.
- Qué valor será el predeterminado.
- Qué ocurre con un valor inesperado.
- Qué información adicional se muestra en modo detallado.

### Ejemplo conceptual

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Selecciona el nivel de salida de la práctica'
        )
    }

    stages {
        stage('Mostrar modo') {
            steps {
                echo "Modo seleccionado: ${params.MODO}"
            }
        }
    }
}
```

La sintaxis y las opciones disponibles pueden variar según Jenkins.

### Reglas de seguridad

- No agregues contraseñas como parámetros de texto.
- No permitas que el parámetro seleccione un servidor real.
- Mantén la lista de opciones limitada.
- Revisa el valor antes de utilizarlo en un comando.
- No imprimas variables sensibles.

### Prueba

Ejecuta el job con cada opción permitida.

Registra si la salida corresponde al modo seleccionado.

## Sesión práctica 9: añadir condiciones

Esta actividad muestra una etapa condicional de forma introductoria.

### Objetivo

Ejecutar una etapa únicamente cuando una condición acordada se cumple.

La condición concreta depende de la instancia y del tipo de job.

### Ejemplo conceptual por rama

```groovy
pipeline {
    agent any

    stages {
        stage('Validación general') {
            steps {
                echo 'Esta validación forma parte del flujo normal.'
            }
        }

        stage('Mensaje de rama principal') {
            when {
                branch 'main'
            }

            steps {
                echo 'La ejecución cumple la condición de rama.'
            }
        }
    }
}
```

El comportamiento de `branch` depende de cómo Jenkins obtiene y representa la rama.

No des por supuesto que una ejecución manual tiene el mismo contexto que un pipeline multibranch.

### Actividad

- Identifica las etapas condicionales.
- Determina qué información necesita Jenkins para evaluar la condición.
- Ejecuta en el contexto indicado por el docente.
- Observa si la etapa se ejecuta o se omite.
- Explica por qué una etapa omitida no es lo mismo que una etapa exitosa.

## Sesión práctica 10: analizar fallos y `post`

Esta actividad observa cómo se comunica un resultado.

### Jenkinsfile

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobación controlada') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'grep -q "Jenkins" app/mensaje.txt'
            }
        }
    }

    post {
        success {
            echo 'Resultado: comprobación correcta.'
        }

        failure {
            echo 'Resultado: comprobación fallida.'
        }

        always {
            echo 'Resultado: ejecución finalizada.'
        }
    }
}
```

### Prueba correcta

Asegúrate de que el archivo contiene `Jenkins`.

Ejecuta el pipeline y registra los mensajes de `post`.

### Prueba fallida

Cambia temporalmente el contenido para que no contenga la palabra esperada.

Ejecuta el pipeline y registra:

- Etapa fallida.
- Mensaje de fallo.
- Mensaje de ejecución finalizada.
- Estado final.

### Reflexión

- ¿Qué diferencia hay entre `success`, `failure` y `always`?
- ¿Se ejecutó `always` después de fallar?
- ¿Qué mensaje ayuda más a diagnosticar?
- ¿Qué cambio harías para que la causa fuera aún más clara?

## Sesión práctica 11: pipeline de punta a punta

Esta sesión reúne las prácticas anteriores en un proyecto pequeño.

### Estructura del proyecto

```text
proyecto/
├── Jenkinsfile
├── README.md
├── app/
│   └── mensaje.txt
└── scripts/
    └── validar.sh
```

### Contenido de `app/mensaje.txt`

```text
Proyecto de práctica de pipelines Jenkins
```

### Contenido de `scripts/validar.sh`

```bash
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
  echo "ERROR: falta la palabra Jenkins"
  exit 1
fi
```

### Jenkinsfile integrador

```groovy
pipeline {
    agent any

    options {
        timestamps()
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
            echo 'El flujo de práctica terminó correctamente.'
        }

        failure {
            echo 'El flujo falló. Revisa la etapa y la consola.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

La opción `timestamps()` requiere que la instancia admita esa opción.

Si no está disponible, sigue la variante proporcionada por el docente.

### Ejecutar localmente

Antes de usar Jenkins, puedes ejecutar el script localmente desde la raíz del proyecto:

```bash
bash scripts/validar.sh
```

Una validación local ayuda a separar errores del script de errores de configuración de Jenkins.

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

Revisa lo preparado:

```bash
git diff --cached
```

Crea un commit con un mensaje descriptivo:

```bash
git commit -m "Añade pipeline de validación"
```

### Ejecutar en Jenkins

Sigue la configuración del job indicada por el docente.

Comprueba:

- Que Jenkins obtiene el repositorio correcto.
- Que el agente dispone de Bash.
- Que el workspace contiene la estructura prevista.
- Que se ejecutan las etapas en orden.
- Que el artefacto aparece asociado a la ejecución.
- Que no se imprimen secretos.

### Prueba de fallo

Elimina temporalmente la palabra `Jenkins` del archivo de mensaje.

Crea una revisión de práctica y ejecuta de nuevo.

Identifica:

- Qué etapa falla.
- Qué comando devuelve error.
- Qué mensaje aparece.
- Si el artefacto se genera.
- Qué evidencia ayuda a corregirlo.

### Recuperación

Restaura el contenido válido.

Ejecuta de nuevo y confirma que:

- El pipeline obtiene la revisión corregida.
- La validación pasa.
- El artefacto aparece.
- El estado final corresponde al resultado.

## Sesión práctica 12: revisar un pipeline existente

Esta actividad se centra en mantenimiento y lectura crítica.

### Checklist de revisión

Abre un `Jenkinsfile` de práctica y comprueba:

- [ ] El agente está especificado.
- [ ] Las etapas tienen nombres claros.
- [ ] Los comandos tienen un propósito visible.
- [ ] Los errores importantes detienen el flujo.
- [ ] Las credenciales no aparecen en texto claro.
- [ ] Los artefactos se archivan con rutas específicas.
- [ ] Las condiciones tienen una explicación.
- [ ] Los pasos posteriores no ocultan fallos.
- [ ] No hay comandos destructivos inesperados.
- [ ] La documentación coincide con el comportamiento.

### Informe de revisión

```text
Nombre del pipeline:
Propósito:
Agente:
Etapas:
Entradas:
Salidas:
Credenciales referenciadas:
Riesgos:
Duda principal:
Mejora propuesta:
```

### Revisión por parejas

Intercambia el informe con otro grupo.

El otro grupo debería poder explicar el objetivo del pipeline sin ejecutar el código.

## Diagnóstico de pipelines

Un pipeline puede fallar por el código, la definición, el agente o un servicio externo.

### Identificar el primer fallo

Busca el primer paso que falló.

Los mensajes posteriores pueden ser resúmenes o consecuencias del error inicial.

### Comprobar el agente

Revisa:

- Nombre del agente.
- Etiqueta solicitada.
- Estado del nodo.
- Disponibilidad de ejecutores.
- Sistema operativo.
- Herramientas necesarias.
- Workspace.

### Comprobar el código

Revisa:

- Rama.
- Commit.
- Archivos obtenidos.
- Cambios recientes.
- Diferencias locales.
- Scripts invocados por el pipeline.

### Comprobar dependencias

Comprueba:

- Versiones de herramientas.
- Conectividad a repositorios.
- Archivos de configuración.
- Disponibilidad de servicios de prueba.
- Permisos del usuario de ejecución.

### Comprobar rutas

Las rutas relativas dependen del directorio de trabajo.

Un archivo que existe en tu ordenador puede no existir en el workspace del agente.

### Comprobar el resultado del comando

En muchos pasos de shell, un código de salida no nulo hace fallar la etapa.

No ignores errores con operadores o scripts que oculten el estado real.

### Informe de error

Utiliza este formato:

```text
Job:
Número de ejecución:
Commit:
Agente:
Etapa fallida:
Comando:
Mensaje principal:
Resultado esperado:
Resultado observado:
Hipótesis:
Próxima comprobación:
```

Elimina secretos y datos sensibles antes de compartir el informe.

## Problemas frecuentes

### Error de sintaxis en el `Jenkinsfile`

Posibles causas:

- Llaves desbalanceadas.
- Comillas sin cerrar.
- Bloques fuera de lugar.
- Sintaxis no compatible con la versión.
- Nombre de paso incorrecto.

Compara con un ejemplo válido de la misma versión.

### No hay agente disponible

Posibles causas:

- Etiqueta inexistente.
- Agente desconectado.
- Ejecutores ocupados.
- Restricción de uso.
- Error de configuración.

Consulta el mensaje de cola y no inicies muchas ejecuciones duplicadas.

### El comando `sh` no funciona

Posibles causas:

- El agente es Windows.
- No hay shell compatible.
- La etiqueta selecciona un nodo inesperado.
- El shell no está en el `PATH`.

Solicita la variante adecuada para el agente.

### El comando `bash` no existe

El agente puede tener `sh` sin tener Bash.

Confirma las herramientas del agente y utiliza solo la solución aprobada.

### Archivo ausente

Comprueba:

- Checkout.
- Rama.
- Commit.
- Directorio de trabajo.
- Ruta relativa.
- Estado del archivo en Git.
- Mayúsculas y minúsculas.

### Etapa omitida

Comprueba la condición `when` y el contexto de la ejecución.

Una etapa omitida no equivale necesariamente a una prueba superada.

### La ejecución se queda en cola

Revisa:

- Etiqueta.
- Agente.
- Ejecutores.
- Restricciones de concurrencia.
- Estado de la instancia.

### Artefacto no encontrado

Comprueba:

- Que el archivo se generó.
- Que la ruta coincide.
- Que el paso de archivado se ejecutó.
- Que la ejecución llegó a esa etapa.
- Que no hubo un error previo.

### El pipeline tarda demasiado

Busca:

- Descargas repetidas.
- Etapas lentas.
- Pruebas que esperan servicios.
- Falta de recursos.
- Agente saturado.
- Concurrencia excesiva.

No elimines pruebas sin evaluar qué riesgo cubren.

## Buenas prácticas

### Nombrar etapas por su propósito

Un nombre debería permitir entender el objetivo sin leer cada comando.

### Dividir pasos de forma legible

Agrupa acciones relacionadas.

Evita una sola línea enorme con muchas operaciones difíciles de diagnosticar.

### Fallar pronto

Ejecuta validaciones rápidas antes de operaciones más costosas.

### Evitar duplicación

Si varios proyectos repiten la misma lógica, considera una forma mantenible y autorizada de reutilizarla.

No introduzcas bibliotecas compartidas sin comprender sus consecuencias.

### Mantener el `Jenkinsfile` pequeño y claro

La lógica extensa puede extraerse a scripts versionados.

Documenta cómo se ejecutan los scripts y qué requisitos tienen.

### Registrar versiones necesarias

Fija o documenta las versiones de herramientas cuando sea importante para reproducibilidad.

### Usar nombres claros

Utiliza nombres descriptivos para:

- Jobs.
- Etapas.
- Parámetros.
- Artefactos.
- Scripts.

### Revisar cambios del pipeline

Como el `Jenkinsfile` ejecuta comandos, revísalo como parte del código.

### Limitar credenciales

Permite que cada job utilice solo las credenciales que necesita.

### Conservar resultados con criterio

Guarda los informes y artefactos útiles.

No archivas datos sensibles o directorios completos sin necesidad.

### Diseñar para diagnóstico

Incluye mensajes que ayuden a responder:

- Qué paso comenzó.
- Qué condición se validó.
- Qué resultado se esperaba.
- Qué información debe revisarse si falla.

## Errores de diseño que conviene evitar

### Pipeline como caja negra

Un flujo que nadie entiende será difícil de mantener.

Documenta el propósito de etapas y scripts.

### Mensajes engañosos

No imprimas “éxito” antes de validar que el comando anterior terminó correctamente.

### Ignorar fallos

No marques el flujo como exitoso si una comprobación esencial ha fallado.

### Credenciales en Groovy

No escribas claves directamente dentro del archivo.

Utiliza el almacén autorizado de credenciales.

### Dependencia del estado anterior

Un pipeline no debería pasar solo porque el workspace conserva un archivo de una ejecución anterior.

Define las entradas y el estado inicial.

### Comandos destructivos sin protección

No incluyas comandos de borrado, despliegue o modificación de infraestructura sin controles y autorización.

### Uso innecesario de paralelismo

El paralelismo añade complejidad y consume recursos.

Úsalo cuando las tareas sean independientes y el beneficio sea claro.

### Agente implícito sin documentación

Si el pipeline depende de una herramienta o sistema operativo específico, decláralo y documenta el requisito.

## Diferencias entre CI, entrega continua y despliegue continuo

Los pipelines pueden implementar varias prácticas de entrega.

### Integración continua

CI valida cambios con frecuencia.

Puede incluir:

- Checkout.
- Análisis.
- Pruebas.
- Construcción.
- Informes.

No requiere publicar automáticamente a producción.

### Entrega continua

La entrega continua procura que el software esté preparado para una publicación controlada.

Puede incluir una aprobación manual antes de producción.

### Despliegue continuo

El despliegue continuo publica automáticamente cambios que superan las condiciones definidas.

Requiere controles, observabilidad, permisos adecuados y una estrategia de recuperación.

### Un pipeline no determina la práctica por el nombre

Un job llamado `deploy` no demuestra que exista despliegue continuo.

Hay que revisar:

- Qué automatiza.
- Qué valida.
- Quién aprueba.
- A qué entorno publica.
- Qué sucede ante un error.

## Preguntas de repaso

1. ¿Qué es un pipeline de Jenkins?
2. ¿Qué diferencia hay entre una etapa y un paso?
3. ¿Qué función cumple `agent`?
4. ¿Qué significa `agent any`?
5. ¿Para qué sirve un `Jenkinsfile`?
6. ¿Qué diferencia hay entre pipeline declarativo y Scripted?
7. ¿Qué hace el bloque `post`?
8. ¿Qué significa un resultado de código distinto de cero en un paso de shell?
9. ¿Qué información puede incluir una variable de entorno?
10. ¿Por qué no se deben imprimir todas las variables?
11. ¿Qué problema resuelve un parámetro de selección?
12. ¿Qué diferencia hay entre archivar y desplegar?
13. ¿Por qué hay que revisar un `Jenkinsfile` como código?
14. ¿Qué puede hacer que un pipeline quede en cola?
15. ¿Qué diferencia hay entre una etapa fallida y una omitida?
16. ¿Por qué conviene validar pronto?
17. ¿Qué riesgos presenta el paralelismo?
18. ¿Qué datos ayudan a relacionar una ejecución con su código?
19. ¿Qué información debe ocultarse al compartir un log?
20. ¿Cómo diagnosticarías una etapa que falla solo en Jenkins?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Un pipeline describe una secuencia de trabajo automatizado».

### Afirmación 2

«Un pipeline exitoso demuestra que el sistema completo está libre de errores».

### Afirmación 3

«Un `Jenkinsfile` puede guardarse junto al código en Git».

### Afirmación 4

«`agent any` significa que Jenkins utilizará cualquier equipo conectado a Internet».

### Afirmación 5

«Un paso de shell puede hacer fallar una etapa si devuelve un código de error».

### Afirmación 6

«Una contraseña puede guardarse directamente en el `Jenkinsfile` si el repositorio es privado».

### Afirmación 7

«Una etapa puede omitirse por una condición sin que haya fallado».

### Afirmación 8

«Archivar un artefacto es lo mismo que desplegarlo».

### Afirmación 9

«Una etapa paralela puede reducir duración, pero requiere revisar recursos e interferencias».

### Afirmación 10

«El agente debe disponer de las herramientas requeridas».

### Afirmación 11

«Un parámetro de texto es un método adecuado para guardar credenciales».

### Afirmación 12

«El bloque `post` puede ejecutar acciones según el resultado del pipeline».

### Afirmación 13

«La consola puede contener información sensible».

### Afirmación 14

«Un job de CI necesita automáticamente acceso a producción».

### Afirmación 15

«El número de ejecución ayuda a localizar un resultado concreto».

## Respuestas orientativas

### Afirmación 1

**Correcta.** El pipeline describe etapas y pasos automatizados.

### Afirmación 2

**Incorrecta.** Solo sabemos que pasaron las verificaciones configuradas.

### Afirmación 3

**Correcta.** Es una forma habitual de versionar la definición.

### Afirmación 4

**Incorrecta.** Jenkins selecciona entre agentes configurados y disponibles.

### Afirmación 5

**Correcta.** El código de salida puede determinar el resultado del paso.

### Afirmación 6

**Incorrecta.** El repositorio privado no convierte el texto claro en un mecanismo seguro de secretos.

### Afirmación 7

**Correcta.** Una condición puede hacer que no se ejecute una etapa.

### Afirmación 8

**Incorrecta.** Archivar conserva un archivo; desplegar lo publica o activa en un entorno.

### Afirmación 9

**Correcta.** El paralelismo requiere comprobar dependencias y recursos.

### Afirmación 10

**Correcta.** La herramienta debe estar en el agente donde corre el paso.

### Afirmación 11

**Incorrecta.** Las credenciales deben gestionarse mediante un mecanismo seguro.

### Afirmación 12

**Correcta.** `post` permite definir acciones posteriores según condiciones.

### Afirmación 13

**Correcta.** Revisa los logs antes de compartirlos.

### Afirmación 14

**Incorrecta.** Los permisos deben limitarse a la tarea.

### Afirmación 15

**Correcta.** El número permite localizar una ejecución concreta.

## Glosario

- **Agente:** entorno donde se ejecutan los pasos del pipeline.
- **Artefacto:** archivo generado y conservado por una ejecución.
- **Declarativo:** estilo de pipeline con estructura predefinida.
- **Ejecución:** instancia concreta de un job o pipeline.
- **Etapa:** agrupación lógica de pasos.
- **`Jenkinsfile`:** archivo que contiene una definición de pipeline.
- **Job:** configuración de Jenkins que inicia o administra una tarea.
- **Parámetro:** valor que se proporciona a una ejecución.
- **Pipeline:** flujo automatizado de etapas y pasos.
- **Scripted:** estilo de pipeline basado en Groovy con mayor libertad de control.
- **Paso:** acción ejecutada dentro de una etapa.
- **Workspace:** directorio de trabajo asociado a una ejecución.
- **`agent`:** bloque que selecciona el entorno de ejecución.
- **`post`:** bloque que define acciones posteriores según el resultado.
- **`when`:** condición que puede controlar la ejecución de una etapa.
- **CI:** integración continua; validación frecuente de cambios integrados.
- **Entrega continua:** práctica de mantener el software listo para una publicación controlada.
- **Despliegue continuo:** publicación automática de cambios que superan las reglas establecidas.
- **Código de salida:** valor que comunica el resultado de un comando.
- **Trazabilidad:** relación entre código, ejecución, artefacto y despliegue.

## Síntesis final

Un pipeline de Jenkins convierte un proceso de validación, construcción o entrega en una definición ejecutable.

- `pipeline` contiene el flujo.
- `agent` selecciona dónde se ejecuta.
- `stages` organiza las etapas.
- `steps` contiene las acciones.
- `post` permite responder al resultado.
- Los parámetros y condiciones adaptan el flujo, pero deben diseñarse con límites.
- Los artefactos y los informes ayudan a conservar evidencia.
- El `Jenkinsfile` puede versionarse y revisarse con el código.
- Los agentes y las credenciales deben tener permisos mínimos.
- Un resultado exitoso solo demuestra que pasaron las comprobaciones configuradas.