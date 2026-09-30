# Anatomía de un Jenkinsfile

Un `Jenkinsfile` es un archivo de texto que define un pipeline de Jenkins como código. Su estructura determina dónde se ejecuta el trabajo, qué etapas contiene, qué pasos se realizan y cómo se comunica el resultado. Comprender su anatomía permite leer pipelines ajenos, crear flujos sencillos y detectar errores antes de ejecutarlos.

Esta unidad recorre las partes más importantes de un `Jenkinsfile` declarativo. Incluye ejemplos progresivos, sesiones prácticas y ejercicios de diagnóstico. Los ejemplos están preparados para un laboratorio: no despliegan software, no requieren credenciales y deben ejecutarse únicamente en un agente autorizado por el curso.

## Esquema de la página

- ## Conceptos fundamentales
  - ### Qué es un `Jenkinsfile`
  - ### Pipeline, job, ejecución, etapa y paso
  - ### Pipeline declarativo y Scripted
  - ### Cómo leer el archivo de arriba abajo
- ## Anatomía de un pipeline declarativo
  - ### `pipeline`
  - ### `agent`
  - ### `stages`, `stage` y `steps`
  - ### `post`
  - ### `environment`, `parameters`, `options` y `triggers`
- ## Sintaxis y componentes
  - ### Groovy, Jenkins y shell
  - ### Cadenas, llaves y anidamiento
  - ### Comandos y códigos de salida
  - ### Condiciones, herramientas y paralelismo
- ## Sesiones de práctica
  - ### Leer un Jenkinsfile
  - ### Crear un pipeline mínimo
  - ### Añadir validaciones y artefactos
  - ### Provocar y corregir fallos
  - ### Revisar seguridad y estilo
- ## Diagnóstico y evaluación
  - ### Errores frecuentes
  - ### Checklist de revisión
  - ### Ejercicios y respuestas
  - ### Glosario y síntesis

## Conceptos fundamentales

La anatomía de un `Jenkinsfile` se entiende mejor cuando se distinguen el flujo, su configuración y su ejecución.

### Qué es un `Jenkinsfile`

Un `Jenkinsfile` es un archivo que contiene una definición de pipeline de Jenkins.

Normalmente se guarda dentro del repositorio del proyecto.

El nombre habitual es:

```text
Jenkinsfile
```

Generalmente no lleva extensión, como `.txt` o `.groovy`.

El archivo puede encontrarse en:

- La raíz del repositorio.
- Una ruta definida en la configuración del job.
- Un repositorio de bibliotecas compartidas, si la organización lo utiliza.

### Para qué sirve

Un `Jenkinsfile` puede describir:

- El agente que ejecutará los pasos.
- Las etapas del flujo.
- Los comandos que se ejecutarán.
- Las variables de entorno.
- Los parámetros de entrada.
- Las condiciones de ejecución.
- Las herramientas requeridas.
- Las acciones posteriores.
- La publicación de resultados y artefactos.

### El `Jenkinsfile` es código ejecutable

El archivo no es solo documentación.

Puede provocar que Jenkins:

- Ejecute comandos.
- Lea o modifique archivos.
- Obtenga código desde Git.
- Utilice herramientas del agente.
- Acceda a servicios permitidos.
- Use credenciales configuradas.
- Genere o publique artefactos.

Por eso, revisa el `Jenkinsfile` antes de ejecutar código que no conoces.

### Qué no resuelve por sí solo

Un `Jenkinsfile` no configura automáticamente todo Jenkins.

No necesariamente:

- Crea agentes.
- Instala herramientas en los agentes.
- Configura credenciales.
- Autoriza a un usuario.
- Abre una conexión de red.
- Instala plugins.
- Crea un repositorio.
- Garantiza una publicación segura.
- Conserva archivos para siempre.

Es una pieza de la configuración, no toda la plataforma.

### Pipeline, job y ejecución

Conviene distinguir estos conceptos:

- **Pipeline:** definición del flujo de trabajo.
- **Job:** configuración que Jenkins administra y puede ejecutar.
- **Ejecución:** una instancia concreta del job.
- **Etapa:** una parte lógica del pipeline.
- **Paso:** una acción concreta dentro de una etapa.
- **Agente:** sistema donde se ejecutan los pasos.
- **Workspace:** directorio de trabajo de la ejecución.

Un job Pipeline puede ejecutar la definición contenida en un `Jenkinsfile`.

### Ejemplo de relación

```text
Repositorio Git
    └── Jenkinsfile
          └── Job de Jenkins
                ├── Ejecución #1
                ├── Ejecución #2
                └── Ejecución #3
```

El archivo describe el flujo.

El job permite que Jenkins lo encuentre y lo ejecute.

Cada ejecución guarda un resultado independiente.

### Pipeline declarativo y Scripted

Jenkins admite dos estilos principales para definir pipelines:

- **Declarativo:** utiliza una estructura reconocible y bloques predefinidos.
- **Scripted:** utiliza más directamente Groovy y ofrece mayor flexibilidad.

Esta unidad se centra en el estilo declarativo.

Es más sencillo para identificar las partes de un primer pipeline.

### Pipeline declarativo

Un pipeline declarativo suele tener una estructura similar a esta:

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

La estructura muestra con claridad:

- Dónde empieza el pipeline.
- Qué agente se solicita.
- Qué etapas contiene.
- Qué acciones se ejecutan.

### Pipeline Scripted

El estilo Scripted permite expresar lógica de forma más libre con Groovy.

Puede ser útil en casos avanzados, pero es más fácil crear flujos difíciles de entender si no se establecen buenas convenciones.

No elijas Scripted solo porque permita escribir más lógica en un mismo bloque.

### Cómo leer el archivo de arriba abajo

Al inspeccionar un `Jenkinsfile`, sigue este orden:

1. Identifica si es declarativo o Scripted.
2. Localiza el bloque principal.
3. Comprueba el agente.
4. Revisa opciones y variables.
5. Cuenta las etapas.
6. Lee los pasos de cada etapa.
7. Busca condiciones.
8. Localiza acciones posteriores.
9. Identifica credenciales y destinos.
10. Comprueba qué archivos se producen.

Este orden ayuda a entender el propósito antes de entrar en los detalles.

## Anatomía de un pipeline declarativo

El pipeline declarativo está formado por bloques y directivas con propósitos distintos.

### Estructura mínima

Una estructura mínima puede escribirse así:

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

La estructura exterior define el flujo completo.

Los bloques interiores describen el entorno y el trabajo.

### Bloque `pipeline`

`pipeline` es el bloque principal de una definición declarativa.

Dentro de él pueden aparecer elementos como:

- `agent`
- `stages`
- `post`
- `environment`
- `parameters`
- `options`
- `triggers`
- `tools`

No todos son obligatorios.

El ejemplo mínimo necesita un agente y una estructura de etapas.

### Llaves y anidamiento

Las llaves `{` y `}` marcan el inicio y el final de los bloques.

Cada bloque abierto necesita su cierre correspondiente.

En el ejemplo mínimo:

- Una llave abre `pipeline`.
- Otra llave abre `stages`.
- Otra llave abre `stage`.
- Otra llave abre `steps`.
- Cada una se cierra en el orden inverso.

La falta de una llave suele causar un error de sintaxis.

### Sangría

La sangría facilita entender la estructura.

Groovy no utiliza la sangría como delimitador obligatorio de bloques, pero una sangría clara ayuda a revisar el archivo.

Conviene mantener:

- El mismo número de espacios por nivel.
- Las llaves en posiciones consistentes.
- Una línea por instrucción cuando sea posible.
- Los bloques relacionados visualmente agrupados.

### Comentarios

Los comentarios explican decisiones o advertencias.

Un comentario de una línea puede comenzar con `//`:

```groovy
// Validación rápida antes de construir.
```

Los comentarios deberían aportar contexto, no repetir lo que ya indica el código.

Un comentario obsoleto puede ser más perjudicial que no tener comentario.

### Bloque `agent`

`agent` indica dónde se ejecutará el pipeline o una etapa.

La forma más simple es:

```groovy
agent any
```

Jenkins busca un agente disponible conforme a la configuración de la instancia.

No significa que el pipeline pueda ejecutarse en cualquier ordenador sin configuración.

### Agente con etiqueta

El pipeline puede solicitar una etiqueta:

```groovy
agent {
    label 'laboratorio'
}
```

La etiqueta debe existir en la instancia.

El agente asociado debe tener las herramientas y permisos requeridos.

Si el agente no está disponible, el job puede esperar en cola.

### Agente `none`

En algunos pipelines se puede usar `agent none` a nivel superior y asignar agentes a etapas específicas.

Esto puede evitar reservar un agente para etapas que no lo necesitan.

Debe diseñarse con cuidado, porque las etapas pueden terminar usando workspaces distintos.

### Agente por etapa

Una etapa puede solicitar su propio agente.

Esto resulta útil cuando:

- Una etapa necesita Linux.
- Otra necesita Windows.
- Una tarea requiere una herramienta específica.
- Se quiere separar capacidad de ejecución.

Antes de usar agentes distintos, identifica cómo compartir o archivar los archivos generados.

### Bloque `stages`

`stages` contiene las etapas principales.

Ejemplo:

```groovy
stages {
    stage('Validar') {
        steps {
            echo 'Validando'
        }
    }

    stage('Construir') {
        steps {
            echo 'Construyendo'
        }
    }
}
```

Las etapas representan partes comprensibles del flujo.

### Bloque `stage`

`stage` crea una etapa con nombre.

El nombre aparece en la interfaz de Jenkins y en la vista de etapas, si está disponible.

Prefiere nombres como:

- `Comprobar estructura`
- `Ejecutar pruebas`
- `Construir paquete`
- `Archivar informes`

Evita nombres sin significado para quienes mantienen el pipeline.

### Bloque `steps`

`steps` contiene las acciones de la etapa.

Un paso puede:

- Mostrar un mensaje.
- Ejecutar una shell.
- Ejecutar un comando de Windows.
- Archivar un archivo.
- Publicar un informe.
- Solicitar una aprobación, si la práctica lo permite.

### Paso `echo`

`echo` muestra un mensaje en la consola de la ejecución.

```groovy
echo 'Comienza la validación'
```

Es útil para indicar:

- Qué etapa empieza.
- Qué condición se comprobó.
- Qué resultado se obtuvo.
- Qué debe revisar una persona.

No imprimas secretos ni variables de entorno completas.

### Paso `sh`

`sh` ejecuta un comando de shell Unix en el agente.

```groovy
sh 'pwd'
```

El agente necesita una shell compatible.

Un comando válido en Linux puede fallar en un agente Windows.

### Paso `bat`

`bat` ejecuta comandos de Windows en agentes compatibles.

La sintaxis y las herramientas disponibles dependen del nodo.

Utiliza el ejemplo del curso si la práctica se realiza en Windows.

### Paso `script`

El bloque `script` permite escribir lógica Scripted dentro de un pipeline declarativo.

Ejemplo:

```groovy
script {
    echo 'Lógica Groovy dentro de un pipeline declarativo'
}
```

Es una herramienta para casos que necesitan lógica adicional.

Evita introducir bloques `script` grandes cuando un paso declarativo sencillo resuelve el problema.

### Bloque `post`

`post` define acciones después de las etapas.

Puede reaccionar a condiciones como:

- `success`
- `failure`
- `always`
- `unstable`
- `aborted`
- `changed`

La disponibilidad y los detalles dependen de la versión y configuración de Jenkins.

### Ejemplo de `post`

```groovy
post {
    success {
        echo 'El pipeline terminó correctamente.'
    }

    failure {
        echo 'El pipeline falló.'
    }

    always {
        echo 'La ejecución ha finalizado.'
    }
}
```

Una acción posterior no debería ocultar el resultado real de las etapas.

### Condición `success`

Se utiliza para acciones posteriores a una ejecución que Jenkins considera exitosa.

```groovy
success {
    echo 'Todas las validaciones configuradas han pasado.'
}
```

El mensaje debe describir solo lo que realmente se verificó.

### Condición `failure`

Se ejecuta cuando Jenkins considera que el pipeline ha fallado.

```groovy
failure {
    echo 'Consulta la consola para localizar el primer error.'
}
```

Un mensaje útil guía hacia el diagnóstico, sin repetir todo el log.

### Condición `always`

Se utiliza para una acción que debe intentarse al finalizar, sea cual sea el resultado.

```groovy
always {
    echo 'Fin de la ejecución.'
}
```

No la confundas con una garantía absoluta de que el bloque se ejecutará ante cualquier interrupción externa.

## Bloques comunes y su ubicación

Los bloques opcionales amplían la definición, pero conviene añadirlos solo cuando exista una necesidad.

### Bloque `environment`

`environment` define variables de entorno para el pipeline o una etapa.

Ejemplo:

```groovy
environment {
    MODO = 'laboratorio'
}
```

Utiliza valores no sensibles en ejemplos y prácticas introductorias.

### Bloque `parameters`

`parameters` declara valores que se pueden seleccionar al iniciar una ejecución.

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

La sintaxis y disponibilidad pueden variar según la versión de Jenkins.

### Bloque `options`

`options` define opciones aplicables al pipeline.

Según la instalación, puede usarse para:

- Limitar el tiempo.
- Controlar ejecuciones concurrentes.
- Configurar retención.
- Añadir marcas de tiempo.
- Ajustar el checkout.

Consulta las opciones disponibles en la versión utilizada.

### Bloque `triggers`

`triggers` configura formas automáticas de iniciar el pipeline.

Puede incluir:

- Programación.
- Sondeo de repositorio.
- Integración con eventos.
- Inicio por otro job.

Para una primera práctica, suele ser más sencillo iniciar el job manualmente.

### Bloque `tools`

`tools` puede seleccionar herramientas previamente configuradas en Jenkins.

No instala cualquier herramienta en cualquier agente por arte de magia.

Comprueba:

- Que la herramienta está configurada.
- Qué versión se utilizará.
- En qué nodo está disponible.
- Si el job tiene permiso para usarla.

### Bloque `when`

`when` permite que una etapa se ejecute solo cuando se cumple una condición.

Ejemplo conceptual:

```groovy
when {
    branch 'main'
}
```

La forma de evaluar la rama depende del tipo de job y del contexto de ejecución.

### Bloque `parallel`

`parallel` permite ejecutar etapas independientes al mismo tiempo.

Puede reducir la duración total, pero consume más capacidad y añade complejidad.

Comprueba que las ramas paralelas no modifiquen los mismos archivos o recursos.

### Estructura de referencia

Una plantilla común puede verse así:

```groovy
pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        MODO = 'laboratorio'
    }

    stages {
        stage('Validar') {
            steps {
                echo 'Validando proyecto'
            }
        }
    }

    post {
        always {
            echo 'Fin de la ejecución'
        }
    }
}
```

No copies todas las opciones a cada pipeline sin revisar si son necesarias.

## Sintaxis y ejecución

Un `Jenkinsfile` combina estructura declarativa, Groovy y comandos del agente.

### Qué interpreta Jenkins

Jenkins interpreta la estructura declarativa del archivo y organiza la ejecución.

Algunos pasos, como `sh`, delegan comandos a una shell del agente.

En un mismo archivo pueden aparecer varios niveles de interpretación.

### Groovy y shell

En este código:

```groovy
echo "Mensaje: ${env.MODO}"
```

la interpolación utiliza sintaxis de Groovy.

En este código:

```groovy
sh 'echo "$MODO"'
```

la expansión de `$MODO` se realiza en la shell del agente.

No mezcles ambas sintaxis sin entender qué componente procesa cada una.

### Comillas simples y dobles

Las comillas simples y dobles pueden comportarse de forma distinta cuando hay interpolación de Groovy.

Si necesitas valores dinámicos, comprueba cuidadosamente qué shell o intérprete recibirá el texto.

Para una primera práctica, utiliza comandos sencillos y sin variables complejas.

### Varias líneas de shell

Un paso de shell puede ejecutar varias líneas:

```groovy
sh '''
    echo "Inicio"
    pwd
    echo "Fin"
'''
```

Las cadenas multilínea pueden facilitar la lectura.

Comprueba que el script es válido en la shell del agente.

### Código de salida

Muchos comandos comunican el resultado mediante un código de salida:

- `0` suele significar éxito.
- Un valor distinto de `0` suele indicar error o una condición no satisfecha.

Jenkins suele tratar como fallido un paso de shell con código de error.

El comportamiento concreto puede depender del paso y de cómo se gestione el error.

### Comando `test`

`test` permite comprobar condiciones de archivos y directorios.

Ejemplo:

```bash
test -f README.md
```

El comando termina correctamente si la condición se cumple.

Puede utilizarse como una validación breve antes de pasos posteriores.

### Comando `grep`

`grep` busca texto en un archivo.

Ejemplo:

```bash
grep -q "Jenkins" app/mensaje.txt
```

La opción `-q` evita mostrar el texto coincidente.

El resultado se comunica mediante el código de salida.

### No ocultar errores

Evita comandos que fuercen un resultado exitoso aunque falle una comprobación esencial.

Un pipeline verde debería significar que las condiciones declaradas se cumplieron.

Si una comprobación es informativa y no bloqueante, documenta esa decisión.

### Rutas relativas

Una ruta relativa se interpreta desde el directorio de trabajo actual.

La ejecución puede utilizar un workspace diferente del directorio de tu ordenador.

Comprueba el contenido obtenido desde Git antes de asumir que la ruta existe.

### Sensibilidad a mayúsculas

Algunos sistemas de archivos distinguen entre mayúsculas y minúsculas.

Una ruta que funciona en un sistema puede fallar en otro si cambia una letra.

Mantén nombres de archivo consistentes.

### Códigos de salida en scripts

Un script puede terminar explícitamente con:

```bash
exit 1
```

Eso indica que la tarea ha fallado.

También puede finalizar normalmente con código `0`.

Asegúrate de que el script transmite el resultado que Jenkins debe observar.

## Agentes y recursos

El agente influye en cómo se ejecuta el `Jenkinsfile`.

### Agente `any`

`agent any` permite a Jenkins elegir entre los agentes disponibles que cumplen las condiciones del job.

No es una forma de solicitar un sistema operativo específico.

### Agente etiquetado

Una etiqueta puede expresar capacidades como:

```text
linux
laboratorio
docker
```

Los nombres reales dependen de la instancia.

Solicita solo una etiqueta confirmada por el docente o el administrador.

### Herramientas del agente

El agente debe disponer de las herramientas que necesita el pipeline.

Por ejemplo:

- Bash.
- Git.
- Java.
- Python.
- Un compilador.
- Un cliente de contenedores.

Comprueba las herramientas en el nodo donde se ejecutará el paso.

### Controlador y agente

Una herramienta instalada en el controlador puede no estar disponible en el agente.

Una herramienta instalada localmente en tu portátil tampoco tiene por qué estar disponible en Jenkins.

### Ejecución en paralelo

Varias etapas paralelas pueden consumir varios ejecutores.

Antes de paralelizar, comprueba:

- Recursos.
- Independencia de las tareas.
- Uso de archivos compartidos.
- Capacidad de servicios externos.
- Aislamiento de workspaces.

## Variables y parámetros en detalle

Las variables y los parámetros tienen propósitos diferentes.

### Variable de entorno

Una variable de entorno configura un valor utilizado durante el flujo.

Ejemplo:

```groovy
environment {
    ENTORNO = 'laboratorio'
}
```

El valor es fijo en la definición hasta que se cambie.

### Parámetro

Un parámetro se proporciona al iniciar una ejecución.

Puede variar entre ejecuciones sin editar el `Jenkinsfile`.

### Usar un parámetro

```groovy
echo "Modo: ${params.MODO}"
```

La forma exacta de referirse a un parámetro depende del contexto de Groovy.

### Validar entradas

Valida parámetros antes de utilizarlos.

Comprueba que:

- El valor pertenece a un conjunto esperado.
- No puede cambiar una ruta de forma peligrosa.
- No se usa para construir un comando inseguro.
- No incluye una credencial.
- No decide por sí solo un destino de producción.

### Parámetros secretos

No uses un parámetro de texto normal para una contraseña.

Los secretos deben guardarse en el almacén de credenciales o mecanismo aprobado.

### Variables sensibles

No imprimas variables que puedan contener:

- Tokens.
- Contraseñas.
- Claves privadas.
- Datos personales.
- Valores internos no públicos.

El enmascaramiento de Jenkins no es una defensa suficiente por sí sola.

## Condiciones y flujo de ejecución

Las condiciones controlan cuándo se ejecutan etapas.

### Etapa condicional

Una etapa puede ejecutarse solo si se cumple una condición.

El ejemplo siguiente es conceptual:

```groovy
stage('Mensaje de rama principal') {
    when {
        branch 'main'
    }

    steps {
        echo 'La condición se ha cumplido.'
    }
}
```

La evaluación depende de cómo Jenkins obtiene la rama.

### Etapa omitida

Una etapa omitida puede no haber sido necesaria en esa ejecución.

No significa que haya pasado una prueba.

Distingue entre:

- Ejecutada y exitosa.
- Ejecutada y fallida.
- Omitida por condición.
- Interrumpida.
- Pendiente de agente.

### Orden de las condiciones

Coloca las etapas según el flujo lógico del proyecto.

Una validación necesaria debería ejecutarse antes de una operación que dependa de ella.

### Operaciones condicionadas por rama

Una etapa de publicación puede depender de una rama concreta.

Para una práctica, utiliza solo entornos de laboratorio.

No añadas una etapa que publique o despliegue en producción sin revisión formal.

## Herramientas, opciones y triggers

Estos bloques permiten controlar aspectos de la ejecución.

### Herramientas configuradas

Un bloque `tools` puede solicitar herramientas administradas por Jenkins.

Comprueba que:

- La herramienta está configurada.
- La versión existe.
- El agente la puede utilizar.
- El nombre coincide con la configuración.

### Límite de tiempo

Un límite puede detener una tarea que queda bloqueada.

El valor debe permitir una ejecución válida.

Un límite demasiado corto puede interrumpir pruebas normales.

### Concurrencia

Limitar ejecuciones simultáneas puede proteger recursos compartidos.

Puede ser útil si el pipeline modifica:

- Una base de datos de prueba.
- Un directorio compartido.
- Un entorno común.
- Un recurso externo con acceso exclusivo.

### Retención

La retención controla cuánto historial o artefactos se conservan, según la configuración.

Considera:

- Espacio.
- Necesidad de diagnóstico.
- Requisitos del curso.
- Política de auditoría.
- Tamaño de artefactos.

### Triggers manuales

El inicio manual es útil para practicar y depurar.

Permite controlar cuándo se ejecuta el flujo.

### Triggers por cambios

Los cambios en Git pueden iniciar pipelines automáticamente.

Requieren configurar correctamente la integración y los permisos.

### Triggers programados

Una programación puede servir para tareas periódicas.

Define quién revisa los resultados y qué ocurre cuando falla.

## Paralelismo y matrices

El paralelismo puede acelerar tareas independientes, pero no es gratis.

### Cuándo puede ayudar

Puede ser útil si:

- Varias pruebas no dependen entre sí.
- Hay suficientes agentes.
- Los recursos no se comparten de forma conflictiva.
- La salida de cada tarea puede identificarse.

### Cuándo puede perjudicar

Puede empeorar el proceso si:

- El agente tiene pocos recursos.
- Varias tareas modifican los mismos archivos.
- Un servicio externo tiene límites.
- Las pruebas dependen del orden.
- El diagnóstico se vuelve confuso.

### Matriz de ejecuciones

Una matriz puede repetir validaciones con varias combinaciones.

Por ejemplo:

- Versiones de lenguaje.
- Sistemas operativos.
- Modos de configuración.

Una matriz puede multiplicar ejecuciones y consumo de recursos.

Utilízala cuando la cobertura justifique ese coste.

## Artefactos y reportes

Los artefactos y los informes proporcionan evidencia de una ejecución.

### Artefacto

Un artefacto es un archivo generado por el pipeline.

Ejemplos:

- Paquete.
- Informe.
- Archivo de salida.
- Imagen exportada.
- Documentación construida.

### Archivar un artefacto

```groovy
archiveArtifacts artifacts: 'salida/resultado.txt',
                 fingerprint: true
```

El patrón debe corresponder a una ruta existente dentro del workspace.

### Artefacto y workspace

El workspace es un área de trabajo.

El artefacto es una salida que se conserva mediante una acción explícita.

No asumas que los archivos temporales se conservarán si no se archivan.

### Informe de pruebas

Una prueba puede producir un informe que Jenkins presente si el formato y la configuración son compatibles.

Comprueba:

- La ruta de salida.
- El formato.
- La etapa que genera el informe.
- El comportamiento si no hay resultados.
- Si el informe contiene información sensible.

### Trazabilidad

Relaciona el artefacto con:

- Commit.
- Rama.
- Número de ejecución.
- Versión.
- Resultado de pruebas.
- Entorno donde se validó.

## Seguridad al escribir un Jenkinsfile

El pipeline puede ejecutar comandos con los permisos del agente.

### Revisar comandos

Antes de ejecutar un comando, pregunta:

- ¿Qué archivos puede leer?
- ¿Qué archivos puede modificar?
- ¿Qué red puede alcanzar?
- ¿Qué sucede si recibe un valor incorrecto?
- ¿Se ejecuta con permisos elevados?
- ¿Puede afectar otros jobs?

### Evitar comandos destructivos

No incluyas comandos de borrado o modificación del sistema en un ejercicio inicial.

Si una limpieza es necesaria, limita cuidadosamente la ruta y sigue el procedimiento autorizado.

### Credenciales

No guardes secretos en:

- El `Jenkinsfile`.
- Scripts versionados.
- Mensajes de consola.
- Parámetros de texto.
- Capturas.
- Documentación compartida.

Utiliza el almacén de credenciales aprobado.

### Mínimo privilegio

Un pipeline debería tener solo los permisos necesarios para su tarea.

Una validación de archivos no necesita credenciales de despliegue.

### Código de origen externo

Un `Jenkinsfile` puede contener comandos arbitrarios.

Antes de ejecutar uno que no conoces:

- Lee el archivo.
- Revisa scripts relacionados.
- Comprueba el agente.
- Limita credenciales.
- Limita conectividad.
- Consulta al responsable.

### Logs

La salida de consola puede ser visible para otras personas.

No incluyas en ella información confidencial.

## Sesión práctica 1: anatomía de un Jenkinsfile

Esta actividad consiste en leer un archivo antes de ejecutarlo.

### Jenkinsfile de análisis

```groovy
pipeline {
    agent any

    environment {
        MODO = 'practica'
    }

    stages {
        stage('Estructura') {
            steps {
                sh 'test -f README.md'
            }
        }

        stage('Validación') {
            steps {
                echo "Modo: ${env.MODO}"
                sh 'bash scripts/validar.sh'
            }
        }
    }

    post {
        success {
            echo 'Validación correcta.'
        }

        failure {
            echo 'Validación fallida.'
        }

        always {
            echo 'Fin.'
        }
    }
}
```

### Instrucciones

1. Lee el archivo de arriba abajo.
2. Localiza el agente.
3. Identifica la variable de entorno.
4. Cuenta las etapas.
5. Enumera los pasos de cada etapa.
6. Identifica las condiciones de `post`.
7. Busca comandos específicos de Unix.
8. Señala qué archivo debe existir.
9. Identifica qué salida aparecerá.
10. Indica qué información falta para ejecutarlo.

### Tabla de análisis

| Elemento | Ubicación | Propósito |
|---|---|---|
| Agente | | |
| Variable | | |
| Etapa `Estructura` | | |
| Etapa `Validación` | | |
| `sh` | | |
| `post` | | |

### Preguntas

- ¿Qué ocurriría si no existe `README.md`?
- ¿Qué ocurriría si falta el script?
- ¿En qué agente se ejecuta `bash`?
- ¿Qué mensajes aparecen ante el éxito?
- ¿Qué mensajes aparecen ante el fallo?

## Sesión práctica 2: crear el pipeline mínimo

### Objetivo

Crear una definición con una etapa y un paso.

### Archivo

```groovy
pipeline {
    agent any

    stages {
        stage('Saludo') {
            steps {
                echo 'Primer pipeline del curso'
            }
        }
    }
}
```

### Actividad

1. Copia el ejemplo en un job de laboratorio o en un `Jenkinsfile`.
2. Comprueba las llaves.
3. Guarda la definición.
4. Ejecuta manualmente.
5. Abre la consola.
6. Registra el estado.
7. Confirma el mensaje esperado.

### Preguntas

- ¿Qué hace cada bloque?
- ¿Cuál es el agente solicitado?
- ¿Cuántas etapas hay?
- ¿Qué diferencia hay entre la consola y la vista de etapas?
- ¿Qué cambiarías para añadir una validación?

## Sesión práctica 3: crear el proyecto de ejemplo

### Crear directorios

```bash
mkdir -p "$HOME/practicas-devops/anatomia-jenkinsfile"
cd "$HOME/practicas-devops/anatomia-jenkinsfile"
mkdir -p app scripts
```

### Crear el contenido

```bash
printf 'Anatomía de Jenkinsfile para el curso\n' > app/mensaje.txt
```

### Crear el script

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"
TEXTO="Jenkinsfile"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: falta $ARCHIVO"
  exit 1
fi

if grep -q "$TEXTO" "$ARCHIVO"; then
  echo "OK: se encontró el texto esperado"
else
  echo "ERROR: falta el texto esperado"
  exit 1
fi
EOF
```

### Comprobar los archivos

```bash
find . -maxdepth 3 -type f -print | sort
```

```bash
cat app/mensaje.txt
```

### Ejecutar localmente

```bash
bash scripts/validar.sh
```

Anota el resultado y el código de salida.

## Sesión práctica 4: añadir etapas gradualmente

Construye el pipeline de manera incremental.

### Etapa 1: comprobar estructura

```groovy
stage('Comprobar estructura') {
    steps {
        sh 'test -f app/mensaje.txt'
        sh 'test -f scripts/validar.sh'
    }
}
```

### Etapa 2: ejecutar validación

```groovy
stage('Ejecutar validación') {
    steps {
        sh 'bash scripts/validar.sh'
    }
}
```

### Etapa 3: preparar salida

```groovy
stage('Preparar salida') {
    steps {
        sh 'mkdir -p salida'
        sh 'cp app/mensaje.txt salida/mensaje.txt'
    }
}
```

### Pipeline completo

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

        stage('Ejecutar validación') {
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
    }
}
```

### Actividad

Añade una etapa cada vez.

Después de cada cambio:

- Lee el archivo completo.
- Comprueba el anidamiento.
- Ejecuta una validación local cuando corresponda.
- Ejecuta el job si el docente lo autoriza.
- Registra el resultado.

### Reflexión

- ¿Qué etapa debería ocurrir primero?
- ¿Qué paso depende de que la validación haya pasado?
- ¿Qué archivo se crea durante el pipeline?
- ¿Qué mensaje ayudaría a entender la etapa?

## Sesión práctica 5: añadir `post`

### Objetivo

Comunicar el resultado final.

### Pipeline de ejemplo

```groovy
pipeline {
    agent any

    stages {
        stage('Validar archivo') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'bash scripts/validar.sh'
            }
        }
    }

    post {
        success {
            echo 'La validación ha terminado correctamente.'
        }

        failure {
            echo 'La validación ha fallado.'
        }

        always {
            echo 'La ejecución ha terminado.'
        }
    }
}
```

### Prueba correcta

Ejecuta con el archivo válido.

Registra los mensajes y el estado.

### Prueba fallida

Elimina temporalmente la palabra esperada.

Ejecuta de nuevo.

Registra qué bloques de `post` aparecen.

### Preguntas

- ¿Qué mensaje corresponde al éxito?
- ¿Qué mensaje corresponde al fallo?
- ¿Qué mensaje se muestra siempre en condiciones normales?
- ¿El mensaje de `always` debería decir que el pipeline pasó?
- ¿Qué información adicional añadirías al mensaje de fallo?

## Sesión práctica 6: crear y archivar un artefacto

### Añadir el paso de archivado

Añade una etapa después de preparar la salida:

```groovy
stage('Archivar salida') {
    steps {
        archiveArtifacts artifacts: 'salida/mensaje.txt',
                         fingerprint: true
    }
}
```

### Comprobar la secuencia

El orden debería ser:

1. Validar la entrada.
2. Crear el archivo de salida.
3. Archivar el archivo.

### Ejecutar

1. Confirma que el archivo de entrada es válido.
2. Guarda el `Jenkinsfile`.
3. Inicia el job.
4. Espera a que termine.
5. Abre la página de la ejecución.
6. Localiza la sección de artefactos.
7. Comprueba el nombre.
8. Registra el número de ejecución.

### Preguntas

- ¿Qué patrón de archivo se utilizó?
- ¿Qué sucede si la ruta está mal escrita?
- ¿El artefacto se conserva para siempre?
- ¿Qué diferencia hay entre archivo de salida y workspace?
- ¿Qué demuestra el archivado y qué no demuestra?

## Sesión práctica 7: crear una variable de entorno

### Jenkinsfile de ejemplo

```groovy
pipeline {
    agent any

    environment {
        CURSO = 'Jenkins'
        MODO = 'practica'
    }

    stages {
        stage('Mostrar configuración') {
            steps {
                echo "Curso: ${env.CURSO}"
                echo "Modo: ${env.MODO}"
            }
        }
    }
}
```

### Actividad

1. Identifica dónde se declaran las variables.
2. Localiza dónde se utilizan.
3. Cambia un valor no sensible.
4. Ejecuta el pipeline.
5. Comprueba la consola.
6. Explica qué componente interpreta `${env.MODO}`.

### Precaución

No sustituyas las variables por contraseñas o tokens.

No imprimas todas las variables disponibles en el agente.

## Sesión práctica 8: añadir un parámetro limitado

### Ejemplo conceptual

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'NIVEL',
            choices: ['basico', 'detallado'],
            description: 'Nivel de mensajes de la práctica'
        )
    }

    stages {
        stage('Mostrar nivel') {
            steps {
                echo "Nivel: ${params.NIVEL}"
            }
        }
    }
}
```

La sintaxis puede variar según la versión y los plugins instalados.

### Actividad

1. Revisa las opciones permitidas.
2. Identifica el valor predeterminado.
3. Ejecuta el pipeline con cada opción.
4. Comprueba el resultado.
5. Explica qué ocurriría con un valor inesperado.
6. Propón una validación si el parámetro tuviera más valores.

### Seguridad

No uses parámetros de texto comunes para:

- Contraseñas.
- Tokens.
- Claves privadas.
- Direcciones de sistemas de producción.
- Comandos arbitrarios.

## Sesión práctica 9: elegir una etiqueta de agente

### Preparación

El docente proporciona una etiqueta válida.

Anota el nombre exacto:

```text
Etiqueta aprobada:
```

### Pipeline de ejemplo

```groovy
pipeline {
    agent {
        label 'ETIQUETA_APROBADA'
    }

    stages {
        stage('Identificar entorno') {
            steps {
                sh 'uname -s'
                sh 'whoami'
                sh 'pwd'
            }
        }
    }
}
```

### Actividad

1. Sustituye el marcador por la etiqueta autorizada.
2. Guarda el archivo.
3. Comprueba el nombre de la etiqueta.
4. Ejecuta el pipeline.
5. Observa si Jenkins asigna un agente.
6. Identifica el sistema operativo.
7. Registra el resultado.

### Si queda en cola

No cambies la etiqueta a `any` sin entender el propósito.

Pregunta al docente si:

- La etiqueta existe.
- El agente está conectado.
- Hay ejecutores disponibles.
- El job requiere un agente que no está disponible.

## Sesión práctica 10: revisión por parejas

### Objetivo

Aprender a detectar errores estructurales y riesgos antes de ejecutar.

### Instrucciones

Intercambia tu `Jenkinsfile` con otro grupo.

Revisa:

- Nombre y propósito de las etapas.
- Equilibrio de llaves.
- Comandos.
- Rutas.
- Agente.
- Variables.
- Parámetros.
- Uso de `post`.
- Archivado.
- Credenciales.
- Acciones destructivas.

### Lista de revisión

```text
¿Entiendo el propósito del pipeline?
¿Sé dónde se ejecuta?
¿Las etapas están en el orden correcto?
¿Los comandos son seguros?
¿Hay secretos?
¿El fallo se hace visible?
¿Los artefactos se generan antes de archivarse?
¿La consola contendría información sensible?
```

### Resultado

Entrega:

- Una observación positiva.
- Un riesgo potencial.
- Una mejora concreta.
- Una pregunta sobre el flujo.

## Sesión práctica 11: analizar un `Jenkinsfile` con fallos

Lee el siguiente archivo y busca problemas:

```groovy
pipeline {
    agent any

    stages {
        stage('Todo') {
            steps {
                echo 'Empieza'
                sh 'cp archivo-no-existe salida/resultado.txt'
                sh 'echo "Terminó correctamente"'
            }
        }
    }

    post {
        always {
            echo 'El pipeline fue exitoso.'
        }
    }
}
```

### Problemas que se pueden observar

- No se comprueba que la entrada exista.
- No se crea la carpeta `salida`.
- El texto de `post` puede ser engañoso.
- El nombre de la etapa no explica la tarea.
- No se archiva el archivo resultante.
- No se describe el agente requerido.
- El comando `cp` puede fallar antes del mensaje final.

### Reescribirlo

Propón una versión que:

- Compruebe la entrada.
- Cree la carpeta.
- Copie el archivo.
- Muestre un mensaje correcto.
- Comunique el fallo sin afirmar éxito.

### Preguntas

- ¿Qué comando falla primero?
- ¿Se ejecuta el paso siguiente si falla `cp`?
- ¿Qué estado final esperarías?
- ¿Por qué `always` no significa `success`?
- ¿Qué otra validación añadirías?

## Sesión práctica 12: documentar el pipeline

Completa la ficha:

```text
Nombre del pipeline:
Propósito:
Repositorio:
Rama:
Agente:
Herramientas:
Etapas:
Entradas:
Validaciones:
Artefactos:
Parámetros:
Credenciales:
Disparador:
Restricciones:
Responsable:
Procedimiento de fallo:
Fecha de revisión:
```

### Ejemplo de descripción

```text
Propósito:
Validar un archivo de mensaje en un proyecto educativo.

Agente:
Agente Linux de laboratorio con Bash y Git.

Etapas:
Comprobar estructura, ejecutar validación y archivar la salida.

Entradas:
Repositorio de práctica indicado por el docente.

Artefactos:
Copia validada del mensaje.

Restricciones:
No utiliza credenciales y no despliega software.
```

### Revisión

Comprueba que la ficha no incluye:

- Secretos.
- Tokens.
- Claves privadas.
- Datos personales innecesarios.
- Direcciones internas no autorizadas.

## Buenas prácticas de estilo

Un `Jenkinsfile` mantenible es fácil de leer antes de ejecutarlo.

### Nombres descriptivos

Utiliza nombres que expliquen:

- El propósito del pipeline.
- El objetivo de la etapa.
- El modo del parámetro.
- El nombre del artefacto.

### Sangría coherente

Mantén una convención consistente.

La sangría no sustituye a las llaves, pero hace más visibles los errores.

### Una acción por línea cuando ayude

Una línea por comando suele facilitar:

- Leer el flujo.
- Localizar un error.
- Revisar una diferencia en Git.
- Añadir mensajes explicativos.

### Etapas con propósito

Una etapa debería tener un objetivo reconocible.

Evita crear una etapa por cada comando trivial si eso hace más difícil seguir el flujo.

### Mensajes útiles

Utiliza mensajes que expliquen:

- Qué empieza.
- Qué terminó.
- Qué falló.
- Qué revisar después.

### Evitar comentarios obsoletos

Actualiza o elimina comentarios que ya no describen el comportamiento.

### Mantener lógica compleja fuera del archivo cuando convenga

Un script versionado puede resultar más fácil de probar localmente.

El `Jenkinsfile` puede coordinar cuándo se ejecuta ese script.

### Revisar el cambio completo

Antes de confirmar cambios, revisa:

- `Jenkinsfile`.
- Scripts invocados.
- Configuración relacionada.
- README.
- Archivos de salida.
- Exclusiones de Git.

## Errores frecuentes de estructura

### Falta una llave

Las llaves desbalanceadas pueden hacer que Jenkins no pueda interpretar el archivo.

Cuenta los bloques y revisa su anidamiento.

### Bloque en lugar incorrecto

Un bloque como `stages` debe estar en el lugar indicado por la sintaxis declarativa.

Compara con un ejemplo válido de la versión actual.

### `steps` fuera de `stage`

Los pasos deben estar dentro de la estructura de etapa apropiada.

### `stage` fuera de `stages`

En un pipeline declarativo, las etapas se agrupan normalmente dentro de `stages`.

### Mezcla de Groovy y shell

Una variable puede evaluarse en Groovy antes de llegar al agente.

Otra puede expandirse en la shell.

Determina qué intérprete procesa cada texto.

### `sh` en agente incompatible

Un pipeline con `sh` necesita un agente apropiado.

Para Windows puede ser necesario otro paso.

### Ruta incorrecta

La ruta puede estar escrita desde un directorio distinto al esperado.

Consulta `pwd` en un job de diagnóstico autorizado.

### Nombre incorrecto de archivo

Linux puede distinguir `README.md` de `readme.md`.

Comprueba el nombre real en Git y en el workspace.

## Errores frecuentes de comportamiento

### Pipeline verde con validación incompleta

Puede ocurrir si:

- No se ejecutó la comprobación esperada.
- El script siempre devuelve `0`.
- Un error fue ignorado.
- La etapa estaba omitida por una condición.
- Se ejecutó otra rama.

### Pipeline fallido antes de probar el código

Puede fallar por:

- Agente ausente.
- Herramienta no instalada.
- Error de checkout.
- Sintaxis incorrecta.
- Falta de permisos.
- Error de red.

### Archivo de artefacto ausente

Puede faltar porque:

- No se generó.
- El patrón es incorrecto.
- El paso de archivado no se ejecutó.
- La ruta cambia entre agentes.
- El workspace se limpió antes de archivar.

### Ejecución demasiado larga

Puede deberse a:

- Espera por agente.
- Descarga de dependencias.
- Prueba atascada.
- Agente saturado.
- Servicio externo lento.
- Bucle en un script.
- Límite de tiempo no configurado.

### Diferencia entre local y Jenkins

Compara:

- Sistema operativo.
- Versiones.
- Shell.
- Directorio.
- Permisos.
- Variables.
- Dependencias.
- Commit.
- Agente.

## Diagnóstico ordenado

Usa un método reproducible en lugar de cambiar varias cosas a la vez.

### Paso 1: localizar la ejecución

Anota:

- Job.
- Número de ejecución.
- Hora.
- Resultado.
- Rama.
- Commit.

### Paso 2: identificar el agente

Comprueba:

- Nombre o etiqueta.
- Estado.
- Sistema operativo.
- Herramientas.
- Workspace.

### Paso 3: localizar la primera etapa fallida

La primera etapa fallida suele ofrecer una pista más útil que el resumen final.

### Paso 4: identificar el comando

Lee el comando, el mensaje y el código de salida.

### Paso 5: formular una hipótesis

Ejemplo:

```text
Hipótesis:
El archivo no está en el workspace porque no se incluyó en el commit
que procesó Jenkins.
```

### Paso 6: comprobar con evidencia

Confirma:

- Commit.
- Checkout.
- Lista de archivos.
- Ruta.
- Agente.

### Paso 7: hacer un cambio controlado

Modifica una sola cosa y vuelve a ejecutar.

### Paso 8: registrar la solución

Documenta:

- Causa.
- Cambio.
- Resultado.
- Prevención.
- Actualización de la guía, si hace falta.

## Seguridad y mantenimiento

El pipeline forma parte del sistema que ejecuta código.

### Tratar el `Jenkinsfile` como código

El archivo debe revisarse en una revisión de cambios, igual que un script.

Comprueba:

- Qué comandos incorpora.
- Qué recursos modifica.
- Qué credenciales solicita.
- Qué rama puede ejecutarlo.
- Qué agente utiliza.
- Qué información imprime.

### Mínimo privilegio

El pipeline solo debería tener los permisos necesarios.

Una validación de texto no necesita:

- Acceso de administrador.
- Credenciales de producción.
- Permisos de escritura en repositorios.
- Acceso a redes ajenas al proyecto.

### Revisar código de origen no confiable

Antes de ejecutar un `Jenkinsfile` de una rama o repositorio desconocido:

- Inspecciona el archivo.
- Revisa los scripts asociados.
- Limita las credenciales.
- Selecciona un agente aislado.
- Limita la red.
- Sigue la política de revisión del equipo.

### Proteger los secretos

No escribas secretos en:

- El `Jenkinsfile`.
- Scripts confirmados en Git.
- Parámetros de texto.
- Mensajes de consola.
- README.
- Capturas de pantalla.

### Cuidar los logs

Los logs pueden incluir:

- Rutas.
- Usuarios.
- Mensajes de sistemas externos.
- Argumentos de comandos.
- Datos de prueba.
- Variables sensibles.

Revisa los logs antes de compartirlos.

### Actualizar dependencias

El pipeline puede depender de:

- Plugins.
- Herramientas del agente.
- Imágenes de contenedor.
- Scripts externos.
- Bibliotecas compartidas.

Documenta versiones importantes y sigue el proceso de actualización del curso o la organización.

### Retención

Define qué conservar:

- Consola.
- Resultados de pruebas.
- Artefactos.
- Historial.
- Informes.

Una retención ilimitada puede consumir almacenamiento.

Una retención demasiado corta puede dificultar el diagnóstico.

## Ejercicios de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Un `Jenkinsfile` define un pipeline y puede guardarse en Git».

### Afirmación 2

«`stages` contiene las acciones concretas de shell».

### Afirmación 3

«`steps` agrupa acciones dentro de una etapa».

### Afirmación 4

«Un agente debe tener las herramientas requeridas».

### Afirmación 5

«`agent any` selecciona cualquier equipo del mundo».

### Afirmación 6

«Un código de salida distinto de cero suele indicar un fallo de un comando».

### Afirmación 7

«Una etapa omitida por `when` ha superado todas las comprobaciones».

### Afirmación 8

«El bloque `post` puede presentar mensajes según el resultado».

### Afirmación 9

«Guardar un token en un repositorio privado lo hace seguro».

### Afirmación 10

«Archivar un archivo equivale a desplegarlo».

### Afirmación 11

«La consola puede contener datos que no deben compartirse».

### Afirmación 12

«Un `Jenkinsfile` puede ejecutar comandos arbitrarios en el agente».

### Afirmación 13

«Una etapa paralela puede aumentar el consumo de recursos».

### Afirmación 14

«Un pipeline exitoso demuestra que la aplicación completa está libre de errores».

### Afirmación 15

«El agente del pipeline puede ser distinto del controlador».

## Respuestas orientativas

### Afirmación 1

**Correcta.** Es una forma habitual de definir y versionar pipelines.

### Afirmación 2

**Incorrecta.** `stages` contiene etapas; los pasos suelen estar dentro de `steps`.

### Afirmación 3

**Correcta.** `steps` agrupa las acciones de una etapa.

### Afirmación 4

**Correcta.** Las herramientas deben estar disponibles en el nodo de ejecución.

### Afirmación 5

**Incorrecta.** Jenkins selecciona entre los agentes configurados y disponibles.

### Afirmación 6

**Correcta.** Es una convención común, aunque el detalle depende del comando.

### Afirmación 7

**Incorrecta.** Una etapa omitida no necesariamente se ejecutó ni validó.

### Afirmación 8

**Correcta.** `post` permite acciones posteriores condicionadas al resultado.

### Afirmación 9

**Incorrecta.** Un repositorio privado no convierte el texto claro en un mecanismo de secretos.

### Afirmación 10

**Incorrecta.** Archivar conserva un archivo; desplegar lo publica o activa en un entorno.

### Afirmación 11

**Correcta.** Revisa la consola antes de compartirla.

### Afirmación 12

**Correcta.** El pipeline ejecuta comandos con los permisos del agente.

### Afirmación 13

**Correcta.** La concurrencia puede consumir más recursos.

### Afirmación 14

**Incorrecta.** Solo indica que pasaron las comprobaciones configuradas.

### Afirmación 15

**Correcta.** El controlador puede asignar la ejecución a otro nodo.

## Preguntas de repaso

1. ¿Qué es un `Jenkinsfile`?
2. ¿Qué diferencia hay entre pipeline, job y ejecución?
3. ¿Qué función cumple el bloque `pipeline`?
4. ¿Qué significa `agent any`?
5. ¿Qué diferencia hay entre `stages`, `stage` y `steps`?
6. ¿Para qué sirve `post`?
7. ¿Qué diferencia hay entre `sh` y `bat`?
8. ¿Qué herramienta interpreta una línea de shell?
9. ¿Qué ocurre si un paso de shell devuelve un código de error?
10. ¿Qué hace `archiveArtifacts`?
11. ¿Qué diferencia hay entre una variable y un parámetro?
12. ¿Por qué no se debe usar un parámetro de texto para una contraseña?
13. ¿Qué debe revisarse antes de ejecutar un `Jenkinsfile` de una rama externa?
14. ¿Qué información relaciona una ejecución con su código?
15. ¿Qué datos evitarías imprimir en la consola?
16. ¿Por qué es útil probar un script localmente?
17. ¿Qué puede provocar que un pipeline quede en cola?
18. ¿Qué significa que una etapa se haya omitido?
19. ¿Qué ventajas ofrece versionar el `Jenkinsfile`?
20. ¿Qué aspecto mejorarías en el pipeline integrador?

## Glosario

- **Agente:** sistema donde se ejecutan los pasos del pipeline.
- **Artefacto:** archivo generado y conservado por una ejecución.
- **Bloque:** sección delimitada por llaves dentro del `Jenkinsfile`.
- **Código de salida:** valor que indica el resultado de un comando.
- **Declarativo:** estilo de pipeline con estructura predefinida.
- **Ejecución:** instancia concreta de un job o pipeline.
- **Etapa:** agrupación lógica de acciones.
- **Groovy:** lenguaje utilizado en la definición de pipelines de Jenkins.
- **Job:** configuración que Jenkins puede ejecutar.
- **Jenkinsfile:** archivo que contiene la definición de un pipeline.
- **Parámetro:** valor proporcionado al iniciar una ejecución.
- **Pipeline:** flujo automatizado de etapas y pasos.
- **Scripted:** estilo de pipeline basado en lógica Groovy más flexible.
- **Paso:** acción concreta dentro de una etapa.
- **Trigger:** evento o programación que inicia una ejecución.
- **Workspace:** directorio de trabajo asociado a una ejecución.
- **Checkout:** obtención de código desde un repositorio.
- **`agent`:** bloque que determina dónde se ejecuta el pipeline o una etapa.
- **`environment`:** bloque que define variables de entorno.
- **`post`:** bloque que define acciones posteriores según el resultado.
- **`stages`:** bloque que agrupa las etapas principales.
- **`when`:** condición que puede controlar la ejecución de una etapa.

## Síntesis final

La anatomía de un `Jenkinsfile` se entiende siguiendo sus bloques desde el exterior hacia el interior:

- `pipeline` contiene la definición.
- `agent` selecciona el entorno de ejecución.
- `stages` agrupa las etapas.
- `stage` nombra una parte del flujo.
- `steps` contiene las acciones.
- `environment`, `parameters`, `options` y `triggers` añaden configuración cuando hace falta.
- `post` comunica o gestiona el resultado final.

Un buen primer `Jenkinsfile` es pequeño, legible y seguro. Comprueba una condición real, muestra mensajes útiles y falla cuando una validación esencial no se cumple. Después puede ampliarse con Git, informes y artefactos, siempre manteniendo claro qué hace y qué no hace.