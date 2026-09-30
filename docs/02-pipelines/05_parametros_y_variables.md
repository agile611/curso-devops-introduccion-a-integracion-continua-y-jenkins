# Parámetros y variables en Jenkins

Los parámetros y las variables permiten adaptar un pipeline sin duplicar su definición. Los parámetros reciben valores para una ejecución; las variables proporcionan valores que el pipeline y sus comandos pueden consultar. Entender dónde se definen, cómo se interpretan y quién puede verlos es esencial para escribir pipelines flexibles y seguros.

Esta unidad explica cómo declarar parámetros en un pipeline declarativo, cómo acceder a ellos desde Groovy y desde una shell, cómo definir variables de entorno y cómo validar entradas antes de utilizarlas. También incluye sesiones prácticas para que los alumnos puedan comparar ejecuciones, controlar qué etapas se ejecutan y reconocer por qué los secretos no deben tratarse como simples variables de texto.

> **Uso seguro:** practica únicamente en una instancia de laboratorio. Los ejemplos usan valores no sensibles. No pongas contraseñas, tokens ni claves privadas en parámetros de texto, archivos versionados, comandos, `echo` o logs. Para secretos, usa el almacén de credenciales autorizado.

## Conceptos fundamentales

Los parámetros y las variables pueden parecer similares, pero resuelven necesidades distintas.

### Qué es un parámetro

Un **parámetro** es un valor que se proporciona a una ejecución de un job o pipeline.

Puede permitir que una persona elija, por ejemplo:

- Un modo de validación.
- Un nombre de práctica.
- Una variante de prueba.
- Una opción que activa un paso no destructivo.
- Un nivel de detalle para los mensajes.

El conjunto de parámetros se define en la configuración del job o en el pipeline.

### Qué es una variable

Una **variable** es un valor que puede utilizarse durante una ejecución.

Puede representar:

- Una configuración fija.
- Un directorio.
- Un modo de trabajo.
- Una opción calculada durante la ejecución.
- Un valor proporcionado por Jenkins o el agente.

Una variable no es automáticamente secreta ni segura.

### Diferencia principal

- Un parámetro suele ser una entrada elegida antes o al iniciar la ejecución.
- Una variable suele estar disponible para pasos del pipeline durante la ejecución.
- Un parámetro puede estar disponible como valor en `params`.
- Una variable de entorno puede estar disponible como `env.NOMBRE` o en el entorno del proceso.
- Un secreto requiere tratamiento específico; no basta con ponerle un nombre de variable.

### Ejemplo conceptual

```text
Parámetro:
    MODO = "detallado"

Variable de entorno:
    CURSO = "jenkins-laboratorio"

Paso:
    muestra CURSO y cambia el mensaje según MODO
```

El parámetro selecciona un comportamiento.

La variable aporta un dato disponible durante la ejecución.

### Cuándo utilizar parámetros

Los parámetros pueden ser apropiados si:

- El valor debe variar entre ejecuciones.
- Las opciones posibles son conocidas.
- Quieres evitar duplicar jobs casi idénticos.
- La persona que inicia el job debe seleccionar un modo.
- El valor puede validarse de forma segura.

### Cuándo no utilizar parámetros

No uses parámetros para:

- Guardar credenciales.
- Ejecutar comandos arbitrarios.
- Elegir cualquier servidor o destino sin controles.
- Sustituir la configuración del proyecto.
- Evitar una revisión necesaria.
- Permitir que cualquier usuario modifique una tarea sensible.
- Introducir rutas de borrado sin validación.

### Cuándo utilizar variables

Las variables pueden ser adecuadas para:

- Configuración no sensible.
- Nombres reutilizados por varias etapas.
- Directorios de trabajo relativos.
- Valores de entorno del proyecto.
- Opciones constantes del pipeline.
- Valores derivados de una entrada previamente validada.

### Ciclo de vida

El ciclo de vida depende del tipo de dato y dónde se define.

Un parámetro se especifica para la ejecución.

Una variable de entorno puede aplicarse a todo el pipeline o a una etapa.

Una variable creada dentro de un script puede existir solo durante ese proceso.

Una variable local de shell puede desaparecer cuando termina el comando.

### Alcance

El **alcance** indica dónde está disponible un valor.

Puede ser:

- Todo el pipeline.
- Una sola etapa.
- Un bloque `withEnv`.
- Un paso.
- Un proceso de shell.
- Una función o bloque Groovy.

No supongas que una variable definida dentro de una shell existe automáticamente en pasos posteriores.

### Los parámetros no son secretos por defecto

Un parámetro normal puede mostrarse en:

- La página de ejecución.
- La configuración del job.
- La consola, si se imprime.
- Metadatos de Jenkins.
- Integraciones o informes.

No proporciones información confidencial como parámetro de texto normal.

### Las variables no son configuración global

Una variable definida en el `Jenkinsfile` afecta a las ejecuciones donde ese archivo se utiliza.

No necesariamente modifica la configuración global de Jenkins.

### Los nombres importan

Usa nombres que expliquen el propósito.

Ejemplos:

```text
MODO_VALIDACION
NOMBRE_PROYECTO
PUBLICAR_INFORME
DIRECTORIO_SALIDA
```

Evita nombres ambiguos:

```text
X
VALOR
COSAS
OPCION2
```

### Convenciones de nombres

Una convención clara facilita leer el código.

En variables de entorno suelen utilizarse nombres en mayúsculas:

```text
BUILD_MODE
REPORT_DIR
APP_NAME
```

En parámetros también se pueden utilizar nombres descriptivos:

```text
MODO
NIVEL_DETALLE
EJECUTAR_VALIDACION
```

El equipo debería utilizar una convención consistente.

## Parámetros de pipeline

Un pipeline declarativo puede declarar parámetros en un bloque `parameters`.

### Declarar parámetros

Ejemplo:

```groovy
pipeline {
    agent any

    parameters {
        string(
            name: 'NOMBRE',
            defaultValue: 'grupo-practica',
            description: 'Identificador no sensible de la práctica'
        )
    }

    stages {
        stage('Mostrar entrada') {
            steps {
                echo "Práctica: ${params.NOMBRE}"
            }
        }
    }
}
```

La declaración define el nombre, el valor predeterminado y la descripción.

### Momento en que se elige un parámetro

Según el tipo de job y la interfaz, Jenkins puede mostrar parámetros al iniciar una ejecución.

Cuando se añade un parámetro por primera vez, puede que la interfaz necesite una primera ejecución o una actualización de la configuración para mostrar el formulario.

El comportamiento puede variar con la versión y los plugins.

### Parámetro de texto `string`

`string` permite introducir una línea de texto.

Ejemplo:

```groovy
string(
    name: 'NOMBRE',
    defaultValue: 'grupo-practica',
    description: 'Nombre no sensible para la práctica'
)
```

Usa `string` para valores cortos y no confidenciales.

### Usos razonables de `string`

Puede servir para:

- Identificar un grupo de práctica.
- Indicar una versión educativa.
- Proporcionar un nombre de informe.
- Introducir una etiqueta de prueba conocida.
- Cambiar un mensaje de salida no sensible.

### Riesgos de `string`

Un valor de texto puede contener caracteres inesperados.

Si se inserta directamente en un comando, podría alterar su interpretación.

Valida el dato antes de utilizarlo en una shell.

### Parámetro de texto multilínea

`text` permite introducir texto en varias líneas.

Puede ser útil para una descripción de práctica o un bloque de configuración no sensible.

No es un método seguro para guardar contraseñas, tokens o claves.

El contenido podría quedar registrado o ser visible según la configuración.

### Ejemplo de parámetro `text`

```groovy
text(
    name: 'NOTAS',
    defaultValue: 'Validación de laboratorio',
    description: 'Notas no sensibles para esta ejecución'
)
```

No imprimas grandes bloques de texto sin necesidad.

### Parámetro booleano

`booleanParam` representa una opción activada o desactivada.

Ejemplo:

```groovy
booleanParam(
    name: 'MOSTRAR_DETALLES',
    defaultValue: false,
    description: 'Muestra mensajes adicionales de diagnóstico'
)
```

Un valor booleano es útil para opciones que solo tienen dos estados.

### Parámetro booleano en un pipeline

```groovy
pipeline {
    agent any

    parameters {
        booleanParam(
            name: 'MOSTRAR_DETALLES',
            defaultValue: false,
            description: 'Activa mensajes adicionales no sensibles'
        )
    }

    stages {
        stage('Informar') {
            steps {
                echo "Detalles activados: ${params.MOSTRAR_DETALLES}"
            }
        }
    }
}
```

El acceso mediante `params` permite comprobar el valor del parámetro.

### Parámetro de selección `choice`

`choice` presenta una lista limitada de opciones.

Ejemplo:

```groovy
choice(
    name: 'MODO',
    choices: ['simple', 'detallado'],
    description: 'Selecciona el modo de salida'
)
```

Una lista limita los valores posibles y reduce errores tipográficos.

### Selecciones con propósito

Las opciones deben ser:

- Claras.
- Mutuamente comprensibles.
- Seguras por defecto.
- Limitadas a lo que el pipeline admite.
- Documentadas.

No incluyas una opción que no esté implementada.

### Orden de opciones

El orden puede afectar a la experiencia de usuario.

Coloca primero el valor más frecuente o seguro.

Confirma qué valor selecciona Jenkins de forma predeterminada en la versión utilizada.

### No usar `choice` para eludir controles

Una selección restringida reduce entradas inesperadas, pero no sustituye:

- La autorización.
- La validación de parámetros.
- La revisión de código.
- Las aprobaciones.
- La limitación de credenciales.

### Parámetro de contraseña

Algunas configuraciones permiten declarar un parámetro de tipo contraseña.

No lo trates como un sustituto del almacén de credenciales.

El comportamiento de visualización, almacenamiento y enmascaramiento puede variar.

Para secretos reutilizables o acceso a sistemas, usa el almacén de credenciales aprobado.

### Parámetros de archivo

Algunas instalaciones o plugins admiten parámetros de archivo.

Antes de utilizarlos, comprueba:

- Qué tamaño permite la instancia.
- Dónde se almacena el archivo.
- Quién puede descargarlo.
- Si el archivo puede contener información sensible.
- Qué análisis se hace antes de procesarlo.
- Cómo se limpia después.

No aceptes archivos arbitrarios sin revisar el riesgo.

### Parámetros disponibles

El tipo de parámetro disponible depende de:

- La versión de Jenkins.
- Los plugins instalados.
- El tipo de job.
- La configuración global.
- Los permisos de la persona usuaria.

Consulta la interfaz del laboratorio y la documentación local.

### Parámetros con valores predeterminados

Un valor predeterminado puede reducir errores al iniciar una ejecución.

El valor predeterminado debería:

- Ser seguro.
- Ser válido.
- Estar documentado.
- No activar por accidente una operación importante.
- No contener información sensible.

### Parámetros y ejecuciones anteriores

Cambiar la definición del parámetro puede afectar futuras ejecuciones.

Las ejecuciones anteriores pueden conservar los valores que recibieron.

No asumas que editar un parámetro cambia retroactivamente una ejecución pasada.

## Acceder a parámetros

Jenkins expone los parámetros mediante el objeto `params` en pipelines declarativos.

### Acceso desde Groovy

```groovy
echo "Modo seleccionado: ${params.MODO}"
```

Esta expresión se procesa en el contexto Groovy del pipeline.

### Acceso a un booleano

```groovy
if (params.MOSTRAR_DETALLES) {
    echo 'Se mostrarán mensajes adicionales.'
}
```

El parámetro booleano se puede tratar como verdadero o falso en Groovy.

Comprueba que el parámetro está declarado y que el nombre coincide.

### Acceso a un parámetro de texto

```groovy
echo "Identificador: ${params.NOMBRE}"
```

No incluyas aquí un secreto.

### Acceso desde una shell

Jenkins suele exponer parámetros como variables de entorno durante la ejecución, dependiendo del tipo de job y la configuración.

Para un pipeline, la forma explícita y clara en Groovy es `params.NOMBRE`.

Si utilizas una shell, comprueba el comportamiento del job y evita interpolaciones inseguras.

### Separar valor y comando

No construyas comandos complejos concatenando texto no validado.

Un parámetro puede incluir comillas, espacios u otros caracteres que cambien el significado de un comando.

Valida primero y elige valores permitidos siempre que sea posible.

### Parámetro declarado frente a parámetro externo

Un job puede recibir valores desde una acción manual, un trigger o una integración.

La fuente del valor no elimina la necesidad de validarlo.

No confíes en una entrada solo porque procede de Jenkins.

### Nombre incorrecto

Un nombre mal escrito puede producir:

- Un valor vacío.
- Un valor nulo.
- Una condición que nunca se cumple.
- Un error de sintaxis o lógica.

Compara el nombre en la declaración y en el uso.

### Inspección segura

Para depurar, muestra solo valores no sensibles y necesarios.

No imprimas todos los parámetros si algunos pueden ser privados.

## Variables de entorno

Una variable de entorno permite que un proceso hijo, como una shell, reciba un valor.

### Bloque `environment`

Un bloque `environment` puede definirse a nivel de pipeline o etapa.

Ejemplo global:

```groovy
pipeline {
    agent any

    environment {
        MODO = 'laboratorio'
        DIRECTORIO_SALIDA = 'salida'
    }

    stages {
        stage('Mostrar configuración') {
            steps {
                echo "Modo: ${env.MODO}"
            }
        }
    }
}
```

### Acceso mediante `env`

Dentro de Groovy, las variables de entorno de Jenkins suelen consultarse mediante `env.NOMBRE`.

Ejemplo:

```groovy
echo "Modo configurado: ${env.MODO}"
```

### Acceso desde shell Unix

Dentro de una shell Unix, una variable de entorno se consulta con `$NOMBRE`.

Ejemplo:

```groovy
sh 'echo "$MODO"'
```

La shell interpreta `$MODO`.

### Acceso desde Windows

La sintaxis depende de si se usa `bat` o PowerShell.

No reutilices un comando Unix en un agente Windows sin adaptarlo.

Utiliza el ejemplo correspondiente a la práctica.

### Alcance global

Un bloque `environment` a nivel de `pipeline` aplica sus valores a las etapas del pipeline, según el contexto de ejecución.

Ejemplo:

```groovy
pipeline {
    agent any

    environment {
        PROYECTO = 'curso-jenkins'
    }

    stages {
        stage('Etapa A') {
            steps {
                echo "Proyecto: ${env.PROYECTO}"
            }
        }

        stage('Etapa B') {
            steps {
                echo "Proyecto: ${env.PROYECTO}"
            }
        }
    }
}
```

### Alcance por etapa

Un bloque `environment` dentro de una etapa limita la definición a esa etapa.

```groovy
stage('Pruebas') {
    environment {
        MODO_PRUEBA = 'rapido'
    }

    steps {
        echo "Modo: ${env.MODO_PRUEBA}"
    }
}
```

La disponibilidad dentro de subprocesos sigue las reglas del paso utilizado.

### Variables `withEnv`

`withEnv` puede definir variables para un bloque de pasos.

Ejemplo:

```groovy
withEnv(['MODO=practica']) {
    sh 'echo "$MODO"'
}
```

El ámbito se limita al bloque correspondiente.

La sintaxis y los detalles dependen del contexto del pipeline.

### No confundir variables Groovy y variables shell

En:

```groovy
echo "Modo: ${env.MODO}"
```

Groovy accede a la variable de entorno.

En:

```groovy
sh 'echo "$MODO"'
```

la shell expande la variable.

Los dos ejemplos se procesan en momentos distintos.

### Variables locales de shell

Una variable creada dentro de una shell puede no existir en el siguiente paso `sh`.

Ejemplo:

```groovy
sh 'TEMPORAL=valor'
sh 'echo "$TEMPORAL"'
```

La segunda shell puede no conocer `TEMPORAL`.

Cada paso de shell puede ejecutarse en un proceso separado.

### Mantener acciones en una misma shell

Si una variable debe utilizarse en varios comandos de una sola shell, agrúpalos:

```groovy
sh '''
    TEMPORAL="valor"
    echo "$TEMPORAL"
'''
```

Esta variable existe en ese proceso de shell.

No se convierte automáticamente en una variable Groovy del pipeline.

### Cambiar variables del entorno en un paso

Un proceso hijo puede modificar su propio entorno, pero esos cambios normalmente no se propagan al proceso padre ni a pasos posteriores.

Para compartir valores entre pasos, utiliza una estrategia explícita y adecuada al tipo de dato.

### Variables definidas por Jenkins

Jenkins puede proporcionar variables relacionadas con:

- Número de ejecución.
- URL del job.
- Rama.
- Workspace.
- Build.
- Nodo.

La disponibilidad depende del tipo de job, plugins y configuración.

Consulta la documentación y no asumas que todas existen en todas las ejecuciones.

### Variables definidas por el agente

El sistema operativo y las herramientas pueden definir variables adicionales.

Su presencia puede variar entre agentes.

No bases un pipeline en una variable no documentada sin comprobarla.

### Variables globales de Jenkins

La configuración global puede proporcionar variables o herramientas.

Los alumnos no deberían modificarlas en una instancia compartida.

Consulta al administrador si una variable global parece necesaria.

## Diferencias entre Groovy y shell

Un `Jenkinsfile` puede incluir código Groovy y comandos de shell dentro del mismo flujo.

### Interpolación de Groovy

Una cadena Groovy con comillas dobles puede interpolar expresiones Groovy.

Ejemplo:

```groovy
echo "Proyecto: ${env.PROYECTO}"
```

La expresión se evalúa antes de que exista una shell.

### Interpolación de shell

Una cadena de shell puede contener variables para que las expanda la shell.

Ejemplo:

```groovy
sh 'echo "$PROYECTO"'
```

Las comillas simples externas son parte de Groovy.

Las comillas dobles internas llegan a la shell.

### Riesgo con datos de usuario

Si un valor de usuario se inserta en una cadena Groovy que contiene un comando, el valor podría interpretarse antes de llegar a la shell.

No interpoles entradas no confiables en comandos sin validarlas.

### Enfoque conservador

Para valores de elección limitada:

- Valida el valor.
- Rechaza valores inesperados.
- Usa una lista cerrada cuando sea posible.
- Evita construir una línea de comando a partir de texto libre.

### Comillas multilínea

Un paso puede utilizar una cadena multilínea:

```groovy
sh '''
    echo "Comienza la comprobación"
    pwd
    echo "Termina la comprobación"
'''
```

La shell interpreta el contenido de la cadena.

Revisa cuidadosamente variables y comillas.

### Variable Groovy local

Una variable definida dentro de un bloque `script` puede utilizarse en ese contexto Groovy.

Ejemplo conceptual:

```groovy
script {
    def resultado = 'validacion'
    echo "Resultado: ${resultado}"
}
```

Una variable `def` no es automáticamente una variable de entorno.

No asumas que una shell posterior puede leerla.

### Convertir un valor a variable de entorno

Si necesitas que un paso hijo reciba un valor, utiliza el mecanismo de entorno apropiado, como `environment` o `withEnv`.

Comprueba el ámbito del bloque.

No uses este mecanismo para distribuir secretos sin revisar el comportamiento y la política de seguridad.

## Validación de parámetros

Toda entrada debe ser validada antes de utilizarse en operaciones importantes.

### Validar una selección

Una lista `choice` ya limita las opciones visibles.

Aun así, el pipeline debería comportarse de manera segura si recibe un valor no esperado por otra vía.

### Validar un texto

Para un parámetro libre, define:

- Longitud máxima razonable.
- Caracteres admitidos.
- Valores aceptados.
- Comportamiento ante vacío.
- Comportamiento ante valor inválido.

### Valor vacío

Decide explícitamente qué ocurre si el parámetro está vacío.

Opciones posibles:

- Usar un valor predeterminado.
- Marcar la ejecución como fallida.
- Mostrar un mensaje de error.
- Omitir una etapa no esencial.

No permitas que un valor vacío se convierta de manera accidental en una ruta o argumento ambiguo.

### Validar formato

Si se espera un identificador, restringe su formato.

Por ejemplo, para un nombre educativo se podrían aceptar letras, números y guiones.

La regla concreta depende de la práctica.

No permitas comandos completos cuando solo se espera un nombre.

### Validar contra una lista permitida

Una lista de opciones suele ser más segura que aceptar cualquier texto.

Por ejemplo:

```text
simple
detallado
```

El pipeline puede comprobar que el valor pertenece a esa lista antes de ejecutar acciones posteriores.

### Validación en Groovy

Ejemplo conceptual:

```groovy
script {
    def permitidos = ['simple', 'detallado']

    if (!permitidos.contains(params.MODO)) {
        error "El modo seleccionado no está permitido."
    }
}
```

La función `error` detiene el pipeline con un resultado de fallo.

Comprueba que la versión y el contexto admiten el ejemplo.

### Validación en shell

Una validación en shell puede comparar valores:

```bash
case "$MODO" in
  simple|detallado)
    echo "Modo aceptado"
    ;;
  *)
    echo "ERROR: modo no válido"
    exit 1
    ;;
esac
```

Asegúrate de que la variable llega a la shell y de que su valor se maneja de forma segura.

### No usar texto libre como comando

No permitas que una persona escriba una línea de shell y que el pipeline la ejecute directamente.

Eso convierte un parámetro en ejecución arbitraria de comandos.

### No usar texto libre como ruta destructiva

No utilices una entrada sin validar para decidir qué carpeta borrar o modificar.

Limita las rutas a directorios de laboratorio conocidos.

### No usar texto libre como destino de despliegue

Una entrada que elige un entorno de destino puede tener un impacto alto.

Utiliza opciones limitadas, autorización y controles adicionales.

### Validar antes de interpolar

El orden seguro es:

1. Leer el parámetro.
2. Comprobar que existe.
3. Validar el formato.
4. Compararlo con valores permitidos.
5. Utilizarlo de forma acotada.
6. Evitar imprimirlo si es sensible.

## Condiciones según parámetros

Un parámetro puede decidir si una etapa se ejecuta.

### Condición booleana

Ejemplo conceptual:

```groovy
stage('Mensajes adicionales') {
    when {
        expression {
            return params.MOSTRAR_DETALLES
        }
    }

    steps {
        echo 'Se muestran detalles no sensibles.'
    }
}
```

La condición solo controla la etapa; no sustituye una validación de seguridad.

### Condición de selección

```groovy
stage('Validación detallada') {
    when {
        expression {
            return params.MODO == 'detallado'
        }
    }

    steps {
        echo 'Ejecutando validación detallada.'
    }
}
```

Asegúrate de que `MODO` está declarado y que sus opciones están limitadas.

### Condición con `environment`

Una etapa puede depender de una variable de entorno.

Ejemplo conceptual:

```groovy
when {
    environment name: 'MODO', value: 'laboratorio'
}
```

Comprueba la sintaxis aceptada por la versión de Jenkins.

### Etapa omitida

Si una condición no se cumple, la etapa puede aparecer como omitida.

Omitida no significa que la validación haya pasado.

Registra qué condición decidió omitirla.

### Booleanos y cadenas

Un booleano real y una cadena con texto como `"false"` no son lo mismo.

Evita tratar una cadena no vacía como si fuera un booleano.

Utiliza `booleanParam` cuando la opción sea realmente de dos estados.

### Evitar condiciones confusas

Las condiciones deben ser:

- Simples.
- Visibles.
- Documentadas.
- Probadas con ambos valores.
- Seguras si el parámetro no existe o está vacío.

## Variables calculadas durante la ejecución

Un pipeline puede crear valores nuevos durante la ejecución.

### Valores derivados

Puede calcularse un nombre de informe o una ruta a partir de valores conocidos.

Mantén la transformación simple y valida los datos de origen.

### No mutar variables sin necesidad

Cambiar variables globales durante una ejecución puede hacer el flujo difícil de seguir.

Prefiere:

- Variables locales en un bloque limitado.
- Variables de entorno con alcance explícito.
- Nombres diferentes para valores derivados.
- Mensajes que expliquen el valor utilizado.

### Escribir un valor para otro paso

Algunas tareas necesitan compartir un valor calculado entre procesos.

Puede usarse un archivo de resultado u otro mecanismo explícito, según el contexto.

Evita depender de cambios en una variable local de shell que no pasan al siguiente proceso.

### Variables de build

Jenkins y plugins pueden proporcionar valores del build.

No supongas que una variable está disponible en todos los tipos de job.

Comprueba:

- Contexto.
- Documentación.
- Tipo de pipeline.
- Configuración.
- Agente.

## Secretos y credenciales

Los secretos requieren un mecanismo específico, no un nombre de variable llamativo.

### Qué se considera secreto

Puede considerarse secreto:

- Contraseña.
- Token.
- Clave privada.
- Secreto de agente.
- Credencial de API.
- Certificado privado.
- Código de recuperación.
- Credencial de base de datos.

### No guardar secretos como parámetros normales

Un parámetro de texto puede aparecer en la interfaz, metadatos o logs.

No lo uses para transmitir un secreto reutilizable.

### Almacén de credenciales

Jenkins puede ofrecer un almacén de credenciales con controles de acceso.

Utiliza solo el mecanismo aprobado por el administrador.

Limita la credencial a:

- El job necesario.
- El repositorio requerido.
- El agente autorizado.
- Los permisos mínimos.
- El tiempo estrictamente necesario.

### Credenciales en el pipeline

La forma concreta de consumir credenciales depende del tipo de credencial, plugins y configuración.

No copies ejemplos de `withCredentials` o `credentials()` sin comprobar:

- Tipo de credencial.
- Ámbito.
- Plugin disponible.
- Permisos.
- Comportamiento del agente.
- Política local.

### No imprimir el secreto

No uses `echo`, `print`, `cat` ni herramientas equivalentes para mostrar una credencial.

El enmascaramiento de consola puede no proteger todas las formas de exposición.

### Interpolación de secretos

Evita insertar secretos en cadenas Groovy que acaban en una shell.

La forma de interpolar puede revelar el valor en argumentos o logs.

Sigue las recomendaciones de la instancia y utiliza el mecanismo de credenciales aprobado.

### Limitar el bloque de uso

Si un secreto se necesita durante una sola operación, limita su disponibilidad a esa operación.

No lo expongas a todo el pipeline si solo una etapa lo necesita.

### Agentes y secretos

Un secreto disponible para una etapa puede quedar expuesto al código ejecutado en esa etapa.

No proporciones credenciales a:

- Código externo no revisado.
- Jobs de confianza menor.
- Agentes compartidos sin aislamiento suficiente.
- Scripts que imprimen entradas sin control.

### Rotación y exposición

Si un secreto aparece en un log o commit:

- Informa al responsable.
- Evita compartir más la salida.
- Sigue el procedimiento de respuesta.
- Solicita revocación o rotación si corresponde.
- No asumas que borrarlo del archivo resuelve el problema.

### Enmascaramiento no es una defensa completa

El enmascaramiento puede ayudar a ocultar algunos valores en la consola.

No protege contra:

- Procesos que leen el entorno.
- Código malicioso.
- Argumentos visibles.
- Archivos temporales.
- Salidas transformadas.
- Logs externos.
- Capturas de pantalla.

La prevención y el alcance limitado son más importantes.

## Ejemplos completos

Los ejemplos usan valores no sensibles y agentes de laboratorio.

### Pipeline con parámetro de selección

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
        stage('Mostrar modo') {
            steps {
                echo "Modo seleccionado: ${params.MODO}"
            }
        }

        stage('Detalles adicionales') {
            when {
                expression {
                    return params.MODO == 'detallado'
                }
            }

            steps {
                echo 'La ejecución utiliza salida detallada.'
            }
        }
    }
}
```

### Pipeline con booleano

```groovy
pipeline {
    agent any

    parameters {
        booleanParam(
            name: 'COMPROBAR_README',
            defaultValue: true,
            description: 'Comprueba la presencia del README'
        )
    }

    stages {
        stage('Comprobación opcional') {
            when {
                expression {
                    return params.COMPROBAR_README
                }
            }

            steps {
                sh 'test -f README.md'
                echo 'README encontrado.'
            }
        }
    }
}
```

Este ejemplo presupone un agente Unix.

### Pipeline con texto validado

```groovy
pipeline {
    agent any

    parameters {
        string(
            name: 'IDENTIFICADOR',
            defaultValue: 'grupo-1',
            description: 'Identificador no sensible: letras, números y guiones'
        )
    }

    stages {
        stage('Validar entrada') {
            steps {
                script {
                    if (!(params.IDENTIFICADOR ==~ /^[A-Za-z0-9-]{1,24}$/)) {
                        error 'El identificador no tiene un formato permitido.'
                    }
                }
            }
        }

        stage('Mostrar identificador') {
            steps {
                echo "Identificador aceptado: ${params.IDENTIFICADOR}"
            }
        }
    }
}
```

La expresión regular es ilustrativa.

Adáptala a los valores que realmente necesita el proyecto.

### Pipeline con variable global

```groovy
pipeline {
    agent any

    environment {
        NOMBRE_PROYECTO = 'practica-jenkins'
        DIRECTORIO_SALIDA = 'salida'
    }

    stages {
        stage('Crear salida') {
            steps {
                sh 'mkdir -p "$DIRECTORIO_SALIDA"'
                echo "Proyecto: ${env.NOMBRE_PROYECTO}"
            }
        }
    }
}
```

Este ejemplo presupone Bash o una shell compatible con la sintaxis indicada.

### Pipeline con variable limitada a una etapa

```groovy
pipeline {
    agent any

    stages {
        stage('Validación') {
            environment {
                MODO_VALIDACION = 'rapido'
            }

            steps {
                echo "Modo de etapa: ${env.MODO_VALIDACION}"
                sh 'test -f README.md'
            }
        }

        stage('Resumen') {
            steps {
                echo 'Resumen de la ejecución.'
            }
        }
    }
}
```

No supongas que `MODO_VALIDACION` sigue disponible fuera de su ámbito.

### Pipeline con `withEnv`

```groovy
pipeline {
    agent any

    stages {
        stage('Variable temporal') {
            steps {
                withEnv(['MODO_TEMPORAL=practica']) {
                    sh 'echo "$MODO_TEMPORAL"'
                }
            }
        }
    }
}
```

La variable se limita al bloque correspondiente.

### Pipeline con validación y `post`

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['simple', 'detallado'],
            description: 'Modo de práctica'
        )
    }

    environment {
        ARCHIVO_ENTRADA = 'app/mensaje.txt'
    }

    stages {
        stage('Comprobar entrada') {
            steps {
                sh 'test -f "$ARCHIVO_ENTRADA"'
                sh 'grep -q "Jenkins" "$ARCHIVO_ENTRADA"'
            }
        }

        stage('Mostrar resumen') {
            steps {
                echo "Modo: ${params.MODO}"
                echo "Archivo validado: ${env.ARCHIVO_ENTRADA}"
            }
        }
    }

    post {
        success {
            echo 'Las validaciones configuradas han pasado.'
        }

        failure {
            echo 'Una comprobación ha fallado.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

## Sesiones prácticas para alumnos

Las prácticas avanzan desde parámetros sencillos hasta validación de entradas.

### Organización sugerida

Cada sesión puede durar entre 15 y 35 minutos.

Se puede trabajar individualmente o en parejas.

En parejas:

- Una persona edita el pipeline.
- La otra revisa la sintaxis.
- Ambas predicen el resultado.
- Intercambian los roles en la siguiente ejecución.

No uses credenciales reales durante las prácticas.

### Sesión 1: leer parámetros y variables

**Objetivo:** localizar cada valor en un pipeline existente.

Utiliza este ejemplo:

```groovy
pipeline {
    agent any

    parameters {
        string(
            name: 'NOMBRE',
            defaultValue: 'grupo',
            description: 'Nombre no sensible'
        )
    }

    environment {
        CURSO = 'Jenkins'
    }

    stages {
        stage('Mostrar datos') {
            steps {
                echo "Nombre: ${params.NOMBRE}"
                echo "Curso: ${env.CURSO}"
            }
        }
    }
}
```

#### Instrucciones

1. Identifica el parámetro.
2. Identifica la variable de entorno.
3. Indica dónde se asigna cada valor.
4. Identifica cómo se accede a cada uno.
5. Predice qué mensajes aparecerán.
6. Ejecuta el job de laboratorio.
7. Compara el resultado con tu predicción.

#### Tabla

| Dato | Tipo | Se define en | Se consulta con |
|---|---|---|---|
| `NOMBRE` | | | |
| `CURSO` | | | |

#### Preguntas

- ¿Qué valor puede cambiar en cada ejecución?
- ¿Qué valor está fijado en el archivo?
- ¿Cuál es el alcance de `CURSO`?
- ¿Por qué ninguno de estos ejemplos debe contener un secreto?

### Sesión 2: declarar un parámetro de texto

**Objetivo:** permitir que cada ejecución reciba un identificador no sensible.

#### Pipeline

```groovy
pipeline {
    agent any

    parameters {
        string(
            name: 'ALUMNO',
            defaultValue: 'grupo-1',
            description: 'Código de grupo para la práctica'
        )
    }

    stages {
        stage('Mostrar grupo') {
            steps {
                echo "Grupo de práctica: ${params.ALUMNO}"
            }
        }
    }
}
```

#### Instrucciones

1. Crea o actualiza el job autorizado.
2. Guarda la definición.
3. Inicia una ejecución.
4. Selecciona un valor de práctica.
5. Revisa la consola.
6. Registra el valor y el resultado.
7. Repite con otro valor no sensible.

#### Preguntas

- ¿Qué parte del pipeline declara el parámetro?
- ¿Qué parte lo consulta?
- ¿Qué valor se usa si no se cambia la entrada?
- ¿Qué valores no sería seguro introducir?

### Sesión 3: parámetro booleano

**Objetivo:** controlar una validación opcional y no destructiva.

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
        stage('Comprobar README') {
            when {
                expression {
                    return params.REVISAR_README
                }
            }

            steps {
                sh 'test -f README.md'
                echo 'README presente.'
            }
        }

        stage('Mensaje final') {
            steps {
                echo 'Fin de la práctica.'
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta con el parámetro activado.
2. Comprueba si la etapa se ejecutó.
3. Ejecuta con el parámetro desactivado.
4. Observa la vista de etapas.
5. Registra si la etapa se omitió.
6. Confirma que el mensaje final aparece.

#### Preguntas

- ¿Qué diferencia hay entre etapa omitida y etapa exitosa?
- ¿Por qué el parámetro no debe controlar una operación destructiva?
- ¿Qué valor predeterminado es más seguro para esta práctica?

### Sesión 4: parámetro de selección

**Objetivo:** limitar las opciones aceptadas.

#### Pipeline

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'FORMATO',
            choices: ['breve', 'ampliado'],
            description: 'Selecciona el formato del informe'
        )
    }

    stages {
        stage('Generar mensaje') {
            steps {
                script {
                    if (params.FORMATO == 'breve') {
                        echo 'Informe breve seleccionado.'
                    } else if (params.FORMATO == 'ampliado') {
                        echo 'Informe ampliado seleccionado.'
                    } else {
                        error 'Formato no reconocido.'
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Revisa las opciones de la lista.
2. Predice qué rama lógica ejecutará cada una.
3. Ejecuta con `breve`.
4. Ejecuta con `ampliado`.
5. Registra la salida.
6. Explica qué hace el caso `else`.

#### Preguntas

- ¿Qué error tipográfico evita `choice`?
- ¿Qué ocurriría si el pipeline recibiera otro valor?
- ¿Por qué la lista debe reflejar opciones realmente implementadas?

### Sesión 5: variable global de entorno

**Objetivo:** definir una configuración compartida por varias etapas.

#### Pipeline

```groovy
pipeline {
    agent any

    environment {
        PROYECTO = 'practica-local'
        CARPETA = 'salida'
    }

    stages {
        stage('Preparar') {
            steps {
                sh 'mkdir -p "$CARPETA"'
                echo "Proyecto: ${env.PROYECTO}"
            }
        }

        stage('Comprobar') {
            steps {
                sh 'test -d "$CARPETA"'
                echo 'Carpeta de salida creada.'
            }
        }
    }
}
```

#### Instrucciones

1. Identifica dónde se definen las variables.
2. Localiza sus referencias en Groovy.
3. Localiza sus referencias en shell.
4. Ejecuta el job.
5. Confirma que ambas etapas pueden utilizarlas.
6. Comprueba la carpeta desde el resultado de la ejecución, si procede.

#### Preguntas

- ¿Qué intérprete expande `$CARPETA`?
- ¿Qué intérprete procesa `${env.PROYECTO}`?
- ¿Qué ocurre si cambias el nombre en un solo lugar?
- ¿Por qué es útil usar nombres descriptivos?

### Sesión 6: variable limitada a una etapa

**Objetivo:** observar el alcance de una variable de entorno.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Etapa con variable') {
            environment {
                MODO_LOCAL = 'solo-etapa'
            }

            steps {
                echo "Modo: ${env.MODO_LOCAL}"
            }
        }

        stage('Etapa sin variable') {
            steps {
                echo 'Esta etapa no declara MODO_LOCAL.'
            }
        }
    }
}
```

#### Instrucciones

1. Identifica el bloque donde se define `MODO_LOCAL`.
2. Predice en qué etapa está disponible.
3. Ejecuta el pipeline.
4. No imprimas todas las variables para investigar.
5. Explica el alcance que observaste.

#### Preguntas

- ¿La variable es global o de etapa?
- ¿Qué parte del archivo demuestra su alcance?
- ¿Qué alternativas hay si ambas etapas necesitan el mismo valor?

### Sesión 7: usar `withEnv`

**Objetivo:** limitar una variable a un bloque de pasos.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Configuración temporal') {
            steps {
                withEnv(['NIVEL=practica']) {
                    sh 'echo "$NIVEL"'
                    sh 'test "$NIVEL" = "practica"'
                }
            }
        }
    }
}
```

#### Instrucciones

1. Lee el bloque completo.
2. Indica dónde empieza y termina el alcance.
3. Ejecuta la práctica.
4. Comprueba el resultado de `test`.
5. Describe qué pasos reciben `NIVEL`.

#### Preguntas

- ¿Qué diferencia hay entre `withEnv` y un bloque global `environment`?
- ¿Por qué agrupar los comandos en el bloque?
- ¿Qué valor debería evitarse en un ejemplo compartido?

### Sesión 8: validar un parámetro de texto

**Objetivo:** aceptar solo identificadores seguros para la práctica.

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
        stage('Validar identificador') {
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
3. Prueba con espacios.
4. Prueba con un valor vacío, si la interfaz lo permite.
5. Observa qué valores acepta la expresión.
6. No introduzcas comandos ni datos personales.

#### Preguntas

- ¿Qué caracteres admite la expresión?
- ¿Qué longitud máxima admite?
- ¿Qué sucede con un espacio?
- ¿Por qué se valida antes de mostrar o utilizar el valor?

### Sesión 9: comparar un valor aceptado y uno rechazado

**Objetivo:** reconocer el efecto de una validación.

#### Tabla de pruebas

| Entrada | ¿Esperas que pase? | Resultado observado |
|---|---|---|
| `grupo-1` | | |
| `equipoA` | | |
| `grupo 1` | | |
| `grupo_1` | | |
| cadena vacía | | |
| texto demasiado largo | | |

#### Actividad

1. Completa las predicciones.
2. Ejecuta cada caso permitido por el curso.
3. Compara el resultado.
4. Ajusta la expresión si la regla educativa lo requiere.
5. Documenta la regla final.

#### Reflexión

La validación debe coincidir con el propósito del dato.

No restrinjas un valor de forma arbitraria ni aceptes cualquier entrada sin pensar en su uso.

### Sesión 10: utilizar un parámetro en una condición

**Objetivo:** ejecutar una etapa solo cuando se selecciona una opción.

#### Pipeline

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'MODO',
            choices: ['normal', 'detallado'],
            description: 'Nivel de mensajes'
        )
    }

    stages {
        stage('Validación general') {
            steps {
                sh 'test -f README.md'
            }
        }

        stage('Detalles adicionales') {
            when {
                expression {
                    return params.MODO == 'detallado'
                }
            }

            steps {
                echo 'La etapa detallada se ejecutó.'
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta con `normal`.
2. Observa si la etapa detallada se ejecuta.
3. Ejecuta con `detallado`.
4. Compara la vista de etapas.
5. Registra los mensajes de consola.
6. Explica por qué la validación general no depende de la elección.

### Sesión 11: detectar la diferencia entre booleano y texto

**Objetivo:** evitar condiciones ambiguas.

#### Ejemplo A: booleano

```groovy
booleanParam(
    name: 'ACTIVAR_DETALLES',
    defaultValue: false,
    description: 'Activa mensajes adicionales'
)
```

Uso:

```groovy
if (params.ACTIVAR_DETALLES) {
    echo 'Detalles activados.'
}
```

#### Ejemplo B: texto

```groovy
string(
    name: 'ACTIVAR_DETALLES',
    defaultValue: 'false',
    description: 'Ejemplo de texto, no recomendado para un booleano'
)
```

#### Actividad

1. Compara los tipos.
2. Explica por qué `"false"` como texto no equivale a un booleano `false`.
3. Determina cuál opción debe usarse para una casilla activada/desactivada.
4. No ejecutes lógica sensible con valores ambiguos.

### Sesión 12: no imprimir un entorno completo

**Objetivo:** reconocer la exposición accidental de datos.

#### Actividad de revisión

Inspecciona este fragmento sin ejecutarlo:

```groovy
stage('Diagnóstico') {
    steps {
        sh 'env'
    }
}
```

#### Preguntas

- ¿Qué puede imprimir `env`?
- ¿Podrían existir credenciales en el entorno?
- ¿Qué alternativa limitada usarías?
- ¿Cómo demostrarías que una variable concreta existe sin mostrar su valor?
- ¿Qué información revisarías antes de compartir la consola?

#### Alternativa de práctica

Utiliza un valor no sensible conocido:

```groovy
echo "Modo: ${env.MODO}"
```

No sustituyas `MODO` por un secreto.

### Sesión 13: separar parámetros y credenciales

**Objetivo:** escoger el mecanismo apropiado para cada tipo de dato.

#### Clasifica los siguientes valores

- Nombre del grupo.
- Modo `simple` o `detallado`.
- Token de un repositorio privado.
- Ruta relativa de salida.
- Contraseña de una base de datos.
- Indicador booleano de validación opcional.

#### Tabla

| Valor | Parámetro o variable | Credencial | Motivo |
|---|---|---|---|
| Nombre de grupo | | | |
| Modo | | | |
| Token | | | |
| Ruta | | | |
| Contraseña | | | |
| Indicador booleano | | | |

#### Resultado esperado

Los datos de autenticación deben gestionarse con el almacén de credenciales aprobado.

Los valores no sensibles pueden ser parámetros o variables si su uso está documentado.

### Sesión 14: informe de ejecución parametrizada

**Objetivo:** registrar los valores que explican una ejecución.

#### Plantilla

```text
Job:
Ejecución:
Parámetros no sensibles:
Rama:
Commit:
Agente:
Variables relevantes:
Etapas ejecutadas:
Etapas omitidas:
Resultado:
Artefactos:
Observaciones:
```

No escribas el valor de ningún secreto.

#### Revisión por pares

Otra persona debe poder identificar:

- Qué modo se ejecutó.
- Qué revisión se utilizó.
- Qué agente trabajó.
- Qué etapas se ejecutaron.
- Qué resultado se obtuvo.

## Diagnóstico de problemas con parámetros y variables

Los errores suelen deberse a nombres, tipos, alcance, interpolación o valores inesperados.

### Parámetro no aparece en la interfaz

Comprueba:

- Que está declarado en `parameters`.
- Que el job utiliza la versión actual del `Jenkinsfile`.
- Que la configuración se guardó.
- Que el tipo de job admite la declaración.
- Que la interfaz se ha actualizado o que el job se ejecutó según el comportamiento de la instancia.

### Parámetro vacío

Comprueba:

- Valor predeterminado.
- Nombre exacto.
- Cómo se inició la ejecución.
- Si el job recibió el parámetro.
- Si la rama contiene la declaración esperada.
- Si se está ejecutando otro job.

### Nombre de parámetro incorrecto

Compara el nombre:

- En `parameters`.
- En `params.NOMBRE`.
- En cualquier condición.
- En los mensajes de consola.

Respeta mayúsculas y minúsculas según el identificador utilizado.

### Condición que nunca se cumple

Comprueba:

- El tipo de parámetro.
- El valor real.
- Espacios.
- Diferencias de mayúsculas.
- Si se compara un booleano con una cadena.
- Si la etapa está en el pipeline esperado.

### Condición que siempre se cumple

Revisa si se está evaluando una cadena no vacía como booleano.

Una cadena como `"false"` puede seguir siendo un valor de texto no vacío.

Usa un `booleanParam` si el dato tiene dos estados.

### Variable vacía

Comprueba:

- Dónde se define.
- Alcance.
- Nombre.
- Si se accede mediante `env` o shell.
- Si el proceso hijo recibe el entorno.
- Si el bloque que la define contiene el paso.

### Variable local no existe en el paso siguiente

Las variables creadas dentro de un proceso de shell no suelen persistir en otro proceso.

Agrupa comandos en una misma shell o utiliza un mecanismo explícito de entorno o transferencia.

### Interpolación incorrecta

Identifica si la expresión la interpreta:

- Groovy.
- Jenkins.
- Bash.
- PowerShell.
- Otra herramienta.

Revisa las comillas y evita insertar entradas no confiables directamente en comandos.

### Shell imprime un valor diferente

Comprueba:

- Nombre de variable.
- Entorno del paso.
- Comillas.
- Expansión de shell.
- Espacios al final.
- Valor configurado.
- Si el agente ejecutó la revisión esperada.

### Parámetro modifica una ruta inesperada

No uses la entrada directamente para crear o borrar directorios.

Valida el formato y limita la operación a una carpeta de laboratorio.

### Parámetro de contraseña visible

Detén la práctica y no compartas la salida.

Consulta al responsable para determinar si el dato se expuso y qué acción procede.

No asumas que el tipo de parámetro o el enmascaramiento elimina todo riesgo.

### Secreto en la consola

Si aparece un secreto:

- No copies la consola a otros canales.
- Informa al responsable.
- Sigue el proceso de revocación o rotación.
- Revisa si el valor quedó en logs o artefactos.
- No intentes borrar el rastro sin autorización.

## Buenas prácticas

### Elegir el tipo de dato correcto

Utiliza:

- `string` para texto corto y no sensible.
- `text` para texto multilínea no sensible.
- `booleanParam` para dos estados.
- `choice` para una lista finita.
- El almacén de credenciales para secretos.

### Mantener listas limitadas

Las listas de selección deben contener solo opciones válidas y necesarias.

### Definir valores predeterminados seguros

Evita valores que activen operaciones de alto impacto sin confirmación.

### Validar entradas

Valida antes de usar el valor en:

- Shell.
- Rutas.
- Nombres de archivos.
- Selección de agentes.
- Acceso a servicios.
- Operaciones que modifican datos.

### Evitar concatenación de comandos

No construyas una orden de shell concatenando texto libre.

Prefiere valores limitados y validación explícita.

### Mantener el alcance pequeño

Define variables en el ámbito más pequeño que sea suficiente:

- Etapa si solo se usa allí.
- Pipeline si se comparte entre etapas.
- Bloque `withEnv` si se necesita temporalmente.

### Documentar las variables

Para cada variable importante, explica:

- Qué representa.
- Quién define su valor.
- Quién puede modificarlo.
- Qué valores acepta.
- Qué etapas lo usan.
- Si es sensible.

### No imprimir secretos

Los logs deben mostrar información útil, no valores confidenciales.

### Revisar permisos

Quien puede iniciar una ejecución con distintos parámetros puede cambiar el comportamiento del pipeline.

Revisa quién puede:

- Modificar parámetros.
- Cambiar definiciones.
- Usar credenciales.
- Aprobar operaciones.
- Acceder a logs.

### Tratar el pipeline como código

Un cambio en variables, parámetros o condiciones puede cambiar qué tareas se ejecutan.

Revisa esos cambios con el mismo cuidado que cualquier otro comando.

## Checklist para parámetros y variables

### Antes de declarar un parámetro

- [ ] El parámetro representa una decisión real por ejecución.
- [ ] El tipo coincide con el dato.
- [ ] El nombre es descriptivo.
- [ ] La descripción explica los valores permitidos.
- [ ] El valor predeterminado es seguro.
- [ ] El dato no es una credencial.
- [ ] El valor se valida antes de utilizarse.
- [ ] El pipeline maneja entradas vacías o inválidas.

### Antes de declarar una variable

- [ ] El valor es no sensible o tiene un mecanismo adecuado.
- [ ] El alcance es el necesario.
- [ ] El nombre es consistente.
- [ ] Se conoce qué intérprete la lee.
- [ ] No se depende de una variable local de shell entre pasos.
- [ ] El valor predeterminado está documentado.

### Antes de utilizar un parámetro en shell

- [ ] He validado formato y longitud.
- [ ] He limitado los valores posibles.
- [ ] No se construye una orden arbitraria.
- [ ] Las comillas son adecuadas.
- [ ] No se usa para seleccionar un destino sensible.
- [ ] No se imprime un valor confidencial.

### Antes de utilizar una credencial

- [ ] La credencial proviene del almacén aprobado.
- [ ] Tiene permisos mínimos.
- [ ] Solo la usa la etapa necesaria.
- [ ] El agente está autorizado.
- [ ] El código que la usa es confiable.
- [ ] No se imprime ni se guarda en un archivo.

## Errores de diseño que conviene evitar

### Parámetro para cada pequeño cambio

Demasiados parámetros hacen difícil entender la ejecución.

Añade un parámetro cuando una elección por ejecución tenga un propósito real.

### Parámetro de texto para una opción cerrada

Si solo hay dos o tres opciones válidas, usa una selección o un booleano.

### Variable global sin necesidad

Una variable global puede ampliar el alcance sin aportar valor.

Limita el ámbito cuando sea posible.

### Variable de entorno como almacén de secretos manual

No introduzcas un secreto fijo en `environment`.

Utiliza el sistema de credenciales aprobado.

### Confiar en valores de entrada

La entrada puede llegar desde usuarios, triggers o integraciones.

Valídala aunque Jenkins la muestre en un formulario.

### Asumir persistencia entre shells

Una variable definida en un paso de shell puede no existir en otro paso.

### Asumir que un valor booleano es una cadena

Usa el tipo adecuado para evitar condiciones ambiguas.

### Depurar imprimiendo todo

Imprimir el entorno completo puede exponer datos confidenciales.

Muestra solo valores no sensibles necesarios para el diagnóstico.

### Condiciones que omiten validaciones esenciales

No permitas que un parámetro desactive controles importantes sin una justificación, autorización y documentación.

### Parámetros que eligen recursos sin control

No aceptes libremente:

- Nodo.
- Destino.
- URL.
- Directorio de borrado.
- Entorno de despliegue.

Restringe las opciones y aplica autorización adicional.

## Ejercicios de repaso

1. ¿Qué diferencia hay entre un parámetro y una variable?
2. ¿Qué significa el alcance de una variable?
3. ¿Para qué sirve `params.NOMBRE`?
4. ¿Para qué sirve `env.NOMBRE`?
5. ¿Qué tipo de parámetro representa dos estados?
6. ¿Cuándo conviene utilizar `choice`?
7. ¿Por qué un parámetro de texto no es un almacén de credenciales?
8. ¿Qué diferencia hay entre una variable Groovy y una variable de shell?
9. ¿Por qué una variable de shell puede desaparecer entre pasos?
10. ¿Qué puede provocar una interpolación insegura?
11. ¿Por qué debe validarse una entrada antes de construir un comando?
12. ¿Qué diferencia hay entre etapa omitida y etapa superada?
13. ¿Qué debería hacer el pipeline con un valor inválido?
14. ¿Por qué el valor predeterminado debe ser seguro?
15. ¿Qué riesgos existen al imprimir todas las variables de entorno?
16. ¿Cómo se deberían almacenar credenciales?
17. ¿Qué significa limitar el uso de una credencial a una etapa?
18. ¿Por qué no basta con enmascarar un secreto en la consola?
19. ¿Qué revisarías si un parámetro aparece vacío?
20. ¿Qué información incluirías en la descripción de un parámetro?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Un parámetro suele ser una entrada asociada a una ejecución».

### Afirmación 2

«Toda variable de entorno es segura para imprimir».

### Afirmación 3

«`booleanParam` es apropiado para una opción activada o desactivada».

### Afirmación 4

«`choice` puede limitar la entrada a un conjunto de opciones».

### Afirmación 5

«Un parámetro de texto es el lugar recomendado para guardar un token».

### Afirmación 6

«`params.NOMBRE` permite consultar un parámetro del pipeline».

### Afirmación 7

«`env.NOMBRE` permite consultar una variable de entorno desde Groovy».

### Afirmación 8

«Una variable local de shell persiste automáticamente entre pasos `sh`».

### Afirmación 9

«Un valor de usuario debería validarse antes de utilizarse en una shell».

### Afirmación 10

«Una etapa omitida por condición ha ejecutado sus comandos correctamente».

### Afirmación 11

«El almacén de credenciales puede gestionar secretos con controles de acceso».

### Afirmación 12

«El enmascaramiento garantiza que un secreto no pueda exponerse».

### Afirmación 13

«Una variable puede tener alcance global o limitado a una etapa».

### Afirmación 14

«Una lista de selección elimina la necesidad de revisar permisos».

### Afirmación 15

«Un parámetro puede cambiar el comportamiento de un pipeline».

## Respuestas orientativas

### Afirmación 1

**Correcta.** Su valor se proporciona para una ejecución.

### Afirmación 2

**Incorrecta.** El entorno puede contener datos sensibles o internos.

### Afirmación 3

**Correcta.** Es el tipo apropiado para dos estados.

### Afirmación 4

**Correcta.** Permite ofrecer opciones limitadas.

### Afirmación 5

**Incorrecta.** Los secretos deben gestionarse con credenciales.

### Afirmación 6

**Correcta.** Es una forma habitual de acceder a parámetros en Groovy.

### Afirmación 7

**Correcta.** `env` permite consultar variables de entorno en el pipeline.

### Afirmación 8

**Incorrecta.** Los pasos pueden ejecutarse en procesos de shell distintos.

### Afirmación 9

**Correcta.** La validación reduce errores y riesgos.

### Afirmación 10

**Incorrecta.** Una etapa omitida no necesariamente se ejecutó.

### Afirmación 11

**Correcta.** Su uso depende de la configuración y la política de Jenkins.

### Afirmación 12

**Incorrecta.** El enmascaramiento no elimina todos los riesgos de exposición.

### Afirmación 13

**Correcta.** El alcance depende de dónde se declare la variable.

### Afirmación 14

**Incorrecta.** La lista no sustituye la autorización ni los controles de seguridad.

### Afirmación 15

**Correcta.** Puede seleccionar modos o activar etapas.

## Glosario

- **Alcance:** parte del pipeline o proceso donde un valor está disponible.
- **Booleano:** valor que representa verdadero o falso.
- **Credencial:** dato de autenticación gestionado para acceder a un recurso.
- **Entorno:** conjunto de variables disponibles para un proceso.
- **Interpolación:** sustitución de una expresión por su valor dentro de una cadena.
- **Parámetro:** valor proporcionado a una ejecución.
- **Parámetro `choice`:** parámetro que ofrece una lista limitada de opciones.
- **Parámetro `string`:** parámetro de texto de una línea.
- **Parámetro `text`:** parámetro de texto que puede tener varias líneas.
- **Parámetro booleano:** parámetro de dos estados.
- **Secreto:** dato confidencial utilizado para autenticación o acceso.
- **Variable:** valor nombrado disponible en un ámbito.
- **Variable de entorno:** valor entregado al entorno de un proceso.
- **`environment`:** bloque declarativo para definir variables de entorno.
- **`params`:** objeto de Jenkins que permite consultar parámetros.
- **`env`:** objeto de Jenkins que permite consultar variables de entorno.
- **`withEnv`:** mecanismo para aplicar variables a un bloque de pasos.
- **Validación:** comprobación de que una entrada cumple reglas esperadas.
- **Inyección de comandos:** alteración del comando debido a una entrada no controlada.
- **Mínimo privilegio:** principio de dar solo los permisos necesarios.

## Síntesis final

Los parámetros permiten variar una ejecución; las variables proporcionan valores durante el pipeline.

- Declara cada parámetro con un tipo apropiado.
- Usa `choice` para opciones limitadas y `booleanParam` para dos estados.
- Consulta parámetros con `params` y variables de entorno con `env`.
- Distingue Groovy de la shell que ejecuta los comandos.
- Define el alcance más pequeño que resuelva la necesidad.
- Valida entradas antes de usarlas en comandos o rutas.
- No imprimas el entorno completo.
- No uses parámetros de texto para almacenar secretos.
- Gestiona credenciales con el mecanismo autorizado y permisos mínimos.
- Una condición que omite una etapa no demuestra que sus pruebas hayan pasado.