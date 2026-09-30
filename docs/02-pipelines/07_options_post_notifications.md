# Options, post y notificaciones en Jenkins

Las directivas `options` y `post` ayudan a controlar cómo se ejecuta un pipeline y qué acciones se realizan al finalizar una etapa o la ejecución completa. `options` configura comportamientos como el tiempo máximo, la concurrencia y la retención de historial. `post` permite responder al resultado con limpieza, informes o notificaciones.

Una notificación útil no consiste solo en enviar un mensaje: debe corresponder al resultado real, identificar la ejecución, dirigir a una fuente de información y evitar exponer datos sensibles. Esta unidad explica los bloques con ejemplos declarativos y sesiones de laboratorio. Las prácticas utilizan mensajes de consola y archivos de salida; no despliegan software ni necesitan credenciales.

> **Uso seguro:** los ejemplos con plugins de correo o chat son ilustrativos. Úsalos únicamente si el administrador los ha instalado y autorizado. No incluyas contraseñas, tokens, datos personales ni secretos en el `Jenkinsfile`, los logs o el contenido de las notificaciones.

## Conceptos fundamentales

`options`, `post` y las notificaciones controlan aspectos diferentes del ciclo de vida de una ejecución.

### Qué hacen `options`, `post` y las notificaciones

- `options` configura el comportamiento del pipeline.
- `post` declara acciones posteriores a una etapa o al pipeline.
- Una notificación comunica un evento o resultado a una persona o sistema.
- Una acción `post` puede ser una notificación, pero no todas las acciones `post` son notificaciones.
- Una opción del pipeline no cambia por sí sola el resultado de las pruebas.
- Una notificación no corrige un fallo.
- Un mensaje de éxito no demuestra que se validara más de lo que el pipeline comprueba.

### Resultado de una ejecución

Jenkins asigna un resultado a la ejecución.

Los estados habituales incluyen:

- `SUCCESS`: la ejecución terminó correctamente.
- `FAILURE`: una etapa o acción falló.
- `UNSTABLE`: se completó, pero existe una condición de inestabilidad.
- `ABORTED`: se detuvo antes de completar normalmente.
- `NOT_BUILT`: la ejecución no llegó a construirse o ejecutarse de la forma esperada.

Los nombres y la presentación pueden variar según Jenkins y los plugins instalados.

### Resultado frente a mensaje

El resultado es el estado que Jenkins registra.

El mensaje es texto que una persona o integración puede mostrar.

Un texto como:

```text
¡Todo correcto!
```

no convierte una ejecución fallida en exitosa.

Diseña los mensajes para describir el resultado real.

### Pipeline completo y etapas

Un pipeline puede declarar acciones posteriores en dos niveles:

- `post` a nivel de pipeline.
- `post` dentro de una etapa.

El `post` de una etapa responde al resultado o finalización de esa etapa.

El `post` del pipeline responde al estado global de la ejecución.

No supongas que ambos bloques se ejecutan en el mismo agente o workspace.

### Qué significa notificar

Una notificación comunica información sobre un evento.

Puede informar de:

- Una ejecución fallida.
- Una ejecución que pasó.
- Un cambio de resultado.
- Una etapa que requiere atención.
- Un artefacto disponible.
- Un resumen de validaciones.

Debe ser breve, útil y segura.

### Notificación frente a log

El log contiene detalles técnicos de la ejecución.

La notificación debería resumir y dirigir a la información completa.

Evita copiar toda la consola en un mensaje.

### Cuándo notificar

Una notificación puede ser útil si:

- Una persona necesita actuar.
- El resultado requiere revisión.
- El equipo acordó recibir avisos de fallos.
- El estado cambió desde la ejecución anterior.
- Se necesita avisar de un artefacto o informe.

### Cuándo evitar notificar

Evita notificar si:

- El mensaje no requiere ninguna acción.
- Se envía para cada ejecución sin una necesidad clara.
- El canal ya muestra el estado automáticamente.
- El sistema genera duplicados.
- La frecuencia produce ruido.
- La información puede consultarse en Jenkins con facilidad.

### Resultados que conviene distinguir

Diseña el tratamiento para diferenciar:

- Éxito.
- Fallo.
- Inestabilidad.
- Cancelación.
- Resultado cambiado.
- Etapa omitida.
- Acción posterior fallida.

Una etapa omitida por una condición no equivale a una etapa superada.

## El bloque `options`

`options` configura aspectos del pipeline declarativo.

### Ubicación del bloque

Un bloque `options` a nivel de pipeline se declara dentro de `pipeline`.

Ejemplo:

```groovy
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Ejemplo') {
            steps {
                echo 'Pipeline con marcas de tiempo.'
            }
        }
    }
}
```

### Alcance de `options`

Las opciones a nivel de pipeline suelen afectar a toda la ejecución.

Algunas opciones también pueden declararse en una etapa, si la sintaxis de Jenkins lo admite.

Comprueba la documentación local de la versión y los plugins.

### Una opción debe tener un propósito

Antes de añadir una opción, explica:

- Qué comportamiento controla.
- A quién afecta.
- Qué valor se ha elegido.
- Qué ocurre al alcanzarlo.
- Cómo se diagnostica.
- Si depende de un plugin.

Evita copiar bloques de configuración sin revisar su efecto.

### Marcas de tiempo con `timestamps`

`timestamps()` añade marcas de tiempo a las líneas de consola, según la configuración disponible.

```groovy
options {
    timestamps()
}
```

Puede ayudar a:

- Comparar duración de pasos.
- Localizar pausas.
- Entender el orden de mensajes.
- Comparar ejecuciones.

No añade necesariamente marcas de tiempo a todos los registros externos.

### Límite de tiempo con `timeout`

`timeout` limita la duración de una ejecución o de un bloque.

```groovy
options {
    timeout(time: 20, unit: 'MINUTES')
}
```

Si se supera el límite, Jenkins interrumpe la ejecución de acuerdo con el comportamiento de la opción y la versión.

### Elegir un límite adecuado

El límite debería considerar:

- La duración normal de las tareas.
- La carga del agente.
- La espera por recursos.
- Las descargas de dependencias.
- Las pruebas más lentas.
- La posibilidad de que el pipeline quede bloqueado.
- La política del laboratorio o equipo.

Un límite demasiado corto interrumpe ejecuciones válidas.

Un límite demasiado largo deja tareas atascadas durante más tiempo.

### `timeout` para el pipeline completo

Una opción a nivel de pipeline puede incluir el tiempo de espera por agente, según el tipo de agente y la semántica aplicable.

Comprueba el comportamiento exacto en la versión de Jenkins.

No supongas que el cronómetro empieza solo cuando comienza el primer comando.

### `timeout` para una etapa o bloque

También puede aplicarse `timeout` a una etapa o un bloque concreto.

Ejemplo:

```groovy
stage('Validación') {
    options {
        timeout(time: 5, unit: 'MINUTES')
    }

    steps {
        sh 'bash scripts/validar.sh'
    }
}
```

El alcance puede ser útil si una prueba específica tiene un límite distinto.

### Timeout no es éxito ni rechazo

Cuando vence el tiempo:

- No se debe interpretar como aprobación.
- No demuestra que la validación haya pasado.
- Puede terminar la ejecución como abortada.
- Debe dejarse visible en los registros.
- Debe tener un comportamiento previsto.

### Evitar límites incompatibles

Un límite de etapa mayor que el límite global no amplía necesariamente el tiempo total.

El límite más restrictivo puede terminar primero.

Documenta el orden esperado.

### Concurrencia con `disableConcurrentBuilds`

La opción `disableConcurrentBuilds()` impide que varias ejecuciones del mismo pipeline se ejecuten simultáneamente, según la configuración.

```groovy
options {
    disableConcurrentBuilds()
}
```

Puede ayudar si dos ejecuciones interferirían entre sí.

### Cuándo limitar la concurrencia

Considera limitar ejecuciones simultáneas si comparten:

- Un entorno de pruebas.
- Datos con nombres fijos.
- Un recurso exclusivo.
- Un workspace externo.
- Un servicio con capacidad limitada.
- Una operación que no tolera concurrencia.

### No limitar por costumbre

La concurrencia puede ser deseable para trabajos independientes.

Desactivarla puede:

- Aumentar la cola.
- Retrasar validaciones.
- Reducir la capacidad del equipo.
- Ocultar dependencias mal diseñadas.

Añade la opción solo cuando el flujo lo necesite.

### Abortar una ejecución anterior

Algunas variantes de `disableConcurrentBuilds` permiten solicitar que una ejecución nueva aborte una anterior.

La sintaxis y el efecto dependen de la versión.

Ejemplo ilustrativo:

```groovy
options {
    disableConcurrentBuilds(abortPrevious: true)
}
```

Utiliza esta forma solo si la instancia la admite y el equipo aprueba ese comportamiento.

Interrumpir una ejecución puede detener pruebas o tareas en curso.

### Retención con `buildDiscarder`

`buildDiscarder` configura una política de conservación del historial y, según la opción, de artefactos asociados.

```groovy
options {
    buildDiscarder(
        logRotator(
            numToKeepStr: '10',
            artifactNumToKeepStr: '5'
        )
    )
}
```

Los campos disponibles y su significado dependen de Jenkins y la configuración.

### Por qué definir retención

La retención puede ayudar a:

- Controlar el espacio de almacenamiento.
- Conservar suficiente historial para diagnosticar.
- Evitar mantener salidas obsoletas.
- Alinear el job con una política de conservación.

### Elegir la retención

Considera:

- Frecuencia de ejecuciones.
- Tamaño de logs.
- Tamaño de artefactos.
- Necesidades de auditoría.
- Política de la organización.
- Tiempo razonable para diagnosticar fallos.

No uses valores de retención sin verificar la política local.

### Historial y artefactos

La conservación de logs y artefactos puede configurarse de forma diferente.

Comprueba qué queda disponible cuando una ejecución antigua se elimina.

Un artefacto de Jenkins no equivale a un respaldo permanente.

### `skipDefaultCheckout`

`skipDefaultCheckout()` puede desactivar un checkout automático en ciertos contextos.

```groovy
options {
    skipDefaultCheckout()
}
```

Úsala solo si el pipeline controla de forma explícita cuándo y dónde obtiene el código.

No la añadas si las etapas esperan encontrar un checkout automático.

### `quietPeriod`

`quietPeriod` configura un periodo de espera antes de iniciar una ejecución, en entornos donde se admite.

```groovy
options {
    quietPeriod(10)
}
```

Puede ayudar a agrupar eventos cercanos, dependiendo del tipo de job.

No sustituye la configuración correcta de webhooks ni evita por sí sola todos los duplicados.

### `preserveStashes`

En algunos pipelines, `preserveStashes` conserva stashes de ejecuciones recientes para reanudaciones o usos compatibles.

La disponibilidad y el propósito dependen del diseño del pipeline y de Jenkins.

No lo utilices para convertir `stash` en almacenamiento permanente.

### `disableResume`

`disableResume()` puede desactivar la reanudación de un pipeline después de determinados reinicios del controlador, según el contexto.

Evalúa el efecto con el administrador.

No es una opción genérica para mejorar cualquier job.

### `parallelsAlwaysFailFast`

`parallelsAlwaysFailFast()` puede controlar cómo reaccionan las ramas paralelas ante un fallo, cuando se usa con etapas paralelas y la configuración lo admite.

```groovy
options {
    parallelsAlwaysFailFast()
}
```

Confirma que detener ramas aún activas es adecuado para las pruebas.

### Opciones de plugins

Algunas opciones disponibles en instalaciones reales dependen de plugins.

Ejemplos posibles:

- Límites de concurrencia adicionales.
- Bloqueos de recursos.
- Reintentos.
- Integración con plataformas de chat.
- Gestión de pipelines por organización.

No asumas que una opción está disponible solo porque aparezca en un ejemplo de Internet.

### Opción desconocida

Si Jenkins informa de una opción desconocida:

- Comprueba la versión.
- Comprueba plugins instalados.
- Revisa la sintaxis.
- Busca si la opción es declarativa o de plugin.
- Consulta al administrador antes de instalar o modificar componentes.

## El bloque `post`

`post` define acciones que se ejecutan después de una etapa o del pipeline, según condiciones de resultado.

### Ubicación de `post`

Puede declararse:

- Dentro del bloque principal `pipeline`.
- Dentro de una etapa, en los contextos admitidos.

Ejemplo a nivel de pipeline:

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

    post {
        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

### `always`

`always` se ejecuta después de la finalización normal del flujo, con independencia del resultado habitual.

```groovy
post {
    always {
        echo 'La ejecución ha terminado.'
    }
}
```

Puede utilizarse para:

- Mostrar un mensaje final.
- Publicar un informe.
- Intentar limpiar archivos temporales.
- Recopilar datos no sensibles.

No lo trates como una garantía frente a cualquier caída externa o pérdida abrupta del controlador.

### `success`

`success` se ejecuta cuando Jenkins considera que la ejecución terminó correctamente.

```groovy
post {
    success {
        echo 'Las etapas configuradas terminaron correctamente.'
    }
}
```

El mensaje debe ser proporcional a las comprobaciones realizadas.

### `failure`

`failure` se ejecuta cuando Jenkins registra un fallo.

```groovy
post {
    failure {
        echo 'El pipeline falló. Consulta la primera etapa fallida.'
    }
}
```

Evita ocultar el error original con una operación posterior que falle por otro motivo.

### `unstable`

`unstable` responde a un resultado inestable.

```groovy
post {
    unstable {
        echo 'El pipeline terminó con resultado inestable.'
    }
}
```

Un resultado inestable puede proceder de pruebas, informes o pasos que marcan la ejecución de esa forma.

Consulta cómo lo produce el proyecto.

### `aborted`

`aborted` responde a una ejecución abortada.

Puede ocurrir por:

- Cancelación manual.
- Timeout.
- Interrupción de la ejecución.
- Otro mecanismo de terminación.

Un aborto no equivale necesariamente a un fallo de código.

### `unsuccessful`

`unsuccessful` se utiliza para resultados que no son exitosos, de acuerdo con la semántica declarativa disponible.

Puede abarcar resultados diferentes de `success`.

Comprueba la versión y las reglas de evaluación de Jenkins.

### `changed`

`changed` se ejecuta si el resultado actual difiere del resultado anterior, según el estado que Jenkins compara.

Puede servir para avisar solo cuando el estado cambia.

No significa que el código fuente haya cambiado.

### `fixed`

`fixed` puede ejecutarse cuando una ejecución vuelve a ser exitosa después de un resultado no exitoso, según el historial disponible.

Ayuda a comunicar la recuperación de un problema.

### `regression`

`regression` puede ejecutarse cuando una ejecución exitosa pasa a un resultado no exitoso.

La comparación depende de la historia y el estado del job.

### `cleanup`

`cleanup` se ejecuta como una condición posterior de limpieza en los contextos admitidos.

Suele colocarse después de otras condiciones `post` cuando se quiere que la limpieza ocurra al final de ese bloque.

Comprueba el orden y la disponibilidad en la versión utilizada.

### Varias condiciones `post`

Un bloque puede contener varias condiciones:

```groovy
post {
    success {
        echo 'Resultado correcto.'
    }

    failure {
        echo 'Resultado fallido.'
    }

    always {
        echo 'Fin del pipeline.'
    }
}
```

No uses el mismo mensaje genérico en todas las condiciones si eso oculta las diferencias.

### Condiciones y orden

Jenkins define reglas para evaluar las condiciones `post`.

El orden puede importar, especialmente para `cleanup` y para acciones que modifican el resultado.

Consulta la documentación de la versión antes de depender de un orden específico.

### `post` de pipeline

El `post` de pipeline puede resumir el resultado total.

Se suele utilizar para:

- Notificar el estado final.
- Publicar informes generales.
- Hacer una limpieza común.
- Escribir un resumen.

### `post` de etapa

El `post` de etapa puede responder a lo que ocurrió en una etapa concreta.

Puede servir para:

- Archivar una salida producida allí.
- Publicar un informe local a esa fase.
- Mostrar un mensaje de diagnóstico.
- Limpiar archivos temporales de la etapa.

### Evitar repetir acciones

Si el mismo correo se envía desde el `post` de una etapa y desde el `post` del pipeline, una ejecución puede generar duplicados.

Define un único responsable para cada notificación.

### `post` no sustituye el manejo de errores

`post` reacciona al resultado.

No reemplaza las validaciones, las excepciones ni la lógica de recuperación.

Un mensaje de `post` tampoco corrige una etapa que falló.

## Resultado de Jenkins y condiciones

Para escribir `post` con precisión, hay que entender cómo se determina el estado.

### Éxito

El pipeline se considera exitoso si las acciones que Jenkins evalúa terminaron correctamente y no existe una condición posterior que cambie el resultado.

### Fallo

Un paso puede fallar por:

- Código de salida no cero.
- Error de sintaxis.
- Agente no disponible.
- Excepción.
- Checkout fallido.
- Herramienta ausente.
- Timeout.
- Error de plugin.

La causa debe diagnosticarse en el log, no solo en el mensaje final.

### Inestabilidad

Una ejecución puede ser inestable aunque no se haya interrumpido de la misma forma que un fallo.

Por ejemplo, pruebas que marcan resultados inestables pueden utilizar esa categoría.

Comprueba el mecanismo exacto del proyecto.

### Aborto

Una ejecución puede abortarse voluntariamente o por timeout.

Distingue un aborto de una prueba que falló.

### Cambio de estado

`changed`, `fixed` y `regression` dependen de la comparación con ejecuciones anteriores.

En un job nuevo o sin historial suficiente, quizá no exista un estado previo útil.

### Primera ejecución

Una primera ejecución no siempre puede compararse con otra anterior.

No esperes que `changed`, `fixed` o `regression` se comporten como si ya existiera un historial.

### Historial eliminado

Si se elimina el historial, algunas comparaciones de resultado pueden dejar de tener contexto.

La política de retención puede influir en la disponibilidad de comparaciones.

### Estado modificado por acciones posteriores

Algunas acciones pueden marcar una ejecución como inestable o cambiar su resultado.

Comprueba qué pasos hacen esas modificaciones y en qué orden.

### Mostrar el estado actual

Dentro de un contexto de pipeline, Jenkins puede ofrecer propiedades de la ejecución, como `currentBuild.currentResult`.

La disponibilidad concreta depende del contexto.

No uses valores dinámicos para ocultar un fallo.

## Notificaciones

Una notificación debe ayudar a comprender o atender un resultado.

### Contenido mínimo

Una notificación útil puede incluir:

- Nombre del job.
- Número de ejecución.
- Estado.
- Rama o revisión, si está disponible y es seguro mostrarla.
- Enlace a Jenkins.
- Resumen de la acción requerida.

No incluyas secretos ni contenido completo de logs.

### Evitar mensajes ambiguos

Evita:

```text
Falló.
```

Prefiere:

```text
El pipeline de validación falló. Abre la ejecución en Jenkins y revisa la primera etapa fallida.
```

### Mensaje de éxito preciso

Evita afirmar que toda una aplicación es correcta si solo se ejecutó una comprobación básica.

Prefiere:

```text
Las validaciones configuradas para esta ejecución terminaron correctamente.
```

### Notificación de fallo

Un aviso de fallo debería incluir:

- Que la ejecución falló.
- Un enlace a la página del job o la ejecución.
- Una instrucción de diagnóstico.
- Un dato de identificación, como job y número.

No es necesario copiar todas las líneas del log.

### Notificación de recuperación

Un aviso `fixed` puede informar que el estado volvió a ser exitoso.

El mensaje debería indicar que el problema se resolvió, no que nunca existió.

### Notificación de regresión

Un aviso `regression` puede destacar un cambio de resultado.

Incluye el enlace a la ejecución actual y, si está disponible, el contexto de la anterior.

### Notificación ante cancelación

No siempre hace falta avisar de cada ejecución abortada.

Decide si la cancelación requiere:

- Registro solamente.
- Aviso al solicitante.
- Aviso a un grupo.
- Ninguna notificación adicional.

### Notificar solo cuando haga falta

Una política práctica puede ser:

- Notificar fallos.
- Notificar recuperaciones.
- No notificar cada éxito rutinario.
- Notificar aprobaciones pendientes solo a sus responsables.
- Notificar abortos si requieren una acción.

La política depende del equipo.

## Correo electrónico

El correo suele implementarse mediante plugins o la configuración de correo de Jenkins.

### Configuración requerida

Antes de usar correo, el administrador debe configurar:

- Servidor de correo.
- Remitente.
- Autenticación, si aplica.
- Seguridad de transporte.
- Límites de envío.
- Destinatarios autorizados.
- Plugin o paso disponible.

El `Jenkinsfile` por sí solo no configura el servicio de correo.

### Paso `mail`

Algunas instalaciones ofrecen el paso `mail`.

Ejemplo ilustrativo:

```groovy
post {
    failure {
        mail to: 'equipo-laboratorio@example.invalid',
             subject: "Fallo: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
             body: 'Consulta la ejecución en Jenkins.'
    }
}
```

La dirección `.invalid` es un marcador educativo.

No envíes correo a personas reales desde una práctica sin autorización.

### Paso `emailext`

Algunas instalaciones usan un plugin de correo extendido con el paso `emailext`.

Ejemplo ilustrativo:

```groovy
post {
    failure {
        emailext(
            subject: "Fallo: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: 'Revisa la ejecución y la primera etapa fallida.',
            recipientProviders: []
        )
    }
}
```

Los argumentos admitidos dependen del plugin y su versión.

### No copiar configuración a ciegas

Comprueba:

- Que el plugin está instalado.
- Que el paso existe.
- Que el servidor está configurado.
- Que el destinatario está autorizado.
- Que no se envía a una lista pública.
- Que el cuerpo no contiene secretos.
- Que la prueba puede hacerse sin enviar mensajes reales.

### Destinatarios

Los destinatarios pueden definirse en Jenkins, en el pipeline o mediante proveedores de destinatarios, según el plugin.

No permitas que un parámetro libre determine destinatarios sensibles sin controles.

### Asunto

Un asunto debe identificar:

- Estado.
- Job.
- Número de ejecución, si es útil.

Evita datos confidenciales en el asunto: puede aparecer en pantallas y notificaciones del dispositivo.

### Cuerpo

El cuerpo debe ser conciso.

Incluye un enlace o instrucciones para localizar el log.

No incluyas el contenido de credenciales ni variables de entorno.

### Prueba de correo

En un laboratorio:

- Usa un mecanismo simulado.
- Usa una dirección de prueba autorizada.
- Confirma con el docente antes de enviar.
- No envíes mensajes masivos.
- No uses una lista real de distribución.

## Notificaciones en chat y otros sistemas

Las notificaciones de chat suelen depender de plugins o integraciones externas.

### Plugin o integración

El paso disponible depende de:

- Plugin instalado.
- Versión.
- Configuración global.
- Canal autorizado.
- Credenciales.
- Política de la organización.

No supongas que el pipeline puede publicar mensajes en cualquier servicio.

### Ejemplo ilustrativo

```groovy
post {
    failure {
        echo 'Simulación de aviso: revisar el canal autorizado.'
    }
}
```

Este ejemplo no envía un mensaje externo.

Es una opción segura para practicar el flujo y revisar la condición.

### Notificación con integración real

Antes de habilitar una integración, confirma:

- Qué servicio recibe el mensaje.
- Qué canal se utiliza.
- Quién puede verlo.
- Qué credencial necesita el plugin.
- Qué datos se van a publicar.
- Cómo se revoca la integración.
- Cómo se evita el spam.

### Webhook

Un webhook puede publicar información en otro sistema si está configurado.

No guardes la URL secreta del webhook en Git.

No la imprimas en la consola.

Utiliza el mecanismo de credenciales aprobado.

### Canales de equipo

Elige un canal adecuado al propósito.

No publiques resultados internos en un canal público o compartido sin autorización.

### Tarjetas y formatos enriquecidos

Algunos plugins permiten mensajes enriquecidos.

El formato exacto depende de la integración.

Mantén una alternativa legible en texto y evita datos sensibles en campos visibles.

## Evitar ruido y duplicados

Una notificación pierde valor si el equipo recibe demasiadas.

### Notificar todo

Avisar de cada éxito puede generar cientos de mensajes.

El ruido hace que los fallos importantes sean más fáciles de pasar por alto.

### Notificar cambios

Las condiciones de cambio de estado pueden reducir mensajes repetidos.

Por ejemplo:

- Avisar en una regresión.
- Avisar cuando el estado se arregla.
- Evitar repetir el mismo aviso en cada ejecución fallida.

Confirma que el job conserva suficiente historial para comparar resultados.

### Una notificación por resultado

Elige un único lugar para cada aviso.

Evita que varias etapas y el `post` global envíen el mismo mensaje.

### Deduplicar por destinatario y evento

Si varias ejecuciones se disparan por un solo cambio, revisa:

- Triggers.
- Jobs duplicados.
- Reintentos.
- Webhooks.
- Sondeo SCM.
- Acciones `post`.

### Avisos que requieren acción

Prioriza mensajes que indiquen:

- Qué ocurrió.
- Quién debería actuar.
- Qué revisar.
- Dónde encontrar la ejecución.
- Cuándo vence una aprobación, si aplica.

### Resúmenes periódicos

Un resumen puede ser más adecuado que un mensaje por ejecución para resultados rutinarios.

La herramienta y la política del equipo determinarán si esta opción está disponible.

## Limpieza con `post`

La limpieza puede ser necesaria para retirar archivos temporales, cerrar recursos o reducir residuos.

### Limpieza en `always`

```groovy
post {
    always {
        echo 'La ejecución ha terminado.'
    }
}
```

`always` puede ser un lugar para intentar una limpieza que debe realizarse tanto en éxito como en fallo.

La limpieza debe tener un alcance limitado.

### Limpieza en `cleanup`

```groovy
post {
    success {
        echo 'Finalización correcta.'
    }

    cleanup {
        echo 'Ejecutando limpieza final.'
    }
}
```

`cleanup` puede permitir que la limpieza aparezca al final del bloque `post`, en los contextos admitidos.

Comprueba la versión y el comportamiento exacto.

### Limpieza de workspace

Si la instancia dispone del paso correspondiente, se puede limpiar un workspace.

La disponibilidad puede depender de plugins y configuración.

Antes de usarlo, considera:

- Si el workspace se comparte.
- Si hay ejecuciones concurrentes.
- Si los artefactos ya se archivaron.
- Si el job depende de archivos para diagnóstico.
- Si la limpieza está limitada al workspace actual.

### No borrar rutas amplias

Evita comandos que borren directorios del sistema o rutas construidas a partir de una entrada no validada.

No utilices patrones destructivos en una práctica introductoria.

### Limpiar después de archivar

Si un artefacto debe conservarse, archívalo antes de borrar el archivo del workspace.

Comprueba el orden de las etapas.

### La limpieza puede fallar

Una acción de limpieza también puede devolver un error.

Decide si ese fallo:

- Debe cambiar el resultado del pipeline.
- Debe registrarse como advertencia.
- Debe detener la ejecución.
- Debe notificarse.

No silencies todos los errores automáticamente.

## `post` a nivel de etapa y pipeline

El lugar del bloque define qué resultado se observa.

### `post` de etapa

```groovy
stage('Validar') {
    steps {
        sh 'bash scripts/validar.sh'
    }

    post {
        success {
            echo 'La etapa Validar terminó correctamente.'
        }

        failure {
            echo 'La etapa Validar falló.'
        }

        always {
            echo 'Terminó la etapa Validar.'
        }
    }
}
```

Las condiciones se relacionan con el resultado de esa etapa.

### `post` de pipeline

```groovy
post {
    success {
        echo 'El pipeline completo terminó correctamente.'
    }

    failure {
        echo 'El pipeline completo falló.'
    }

    always {
        echo 'Fin de la ejecución completa.'
    }
}
```

Este bloque proporciona un resumen global.

### Diferencias de alcance

Una etapa puede pasar mientras otra falla.

Por tanto:

- El `post` de la etapa puede informar éxito local.
- El `post` de pipeline puede informar fallo global.

Ambos mensajes pueden ser correctos si explican claramente su alcance.

### No confundir éxito parcial con éxito global

Un mensaje de etapa debería nombrar la etapa.

No utilices un mensaje como `Todo correcto` cuando solo terminó bien una parte del flujo.

### Usar ambos niveles con intención

El `post` de etapa puede archivar un resultado específico.

El `post` global puede enviar un único aviso final.

Evita duplicar la misma notificación en ambos niveles.

## Ejemplos completos

Los ejemplos son de laboratorio y no requieren plugins de notificación externos.

### Pipeline con opciones básicas

```groovy
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(
            logRotator(
                numToKeepStr: '10',
                artifactNumToKeepStr: '5'
            )
        )
    }

    stages {
        stage('Validación') {
            steps {
                echo 'Validación de laboratorio.'
            }
        }
    }

    post {
        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

### Pipeline con concurrencia limitada

```groovy
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    stages {
        stage('Trabajo compartido') {
            steps {
                echo 'Este ejemplo representa un recurso compartido.'
            }
        }
    }
}
```

El ejemplo demuestra la opción, pero no crea por sí mismo un recurso compartido.

### Pipeline con resultados diferenciados

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                sh 'test -f README.md'
            }
        }
    }

    post {
        success {
            echo 'Las comprobaciones declaradas pasaron.'
        }

        failure {
            echo 'Falló una comprobación o un paso.'
        }

        unstable {
            echo 'El resultado está marcado como inestable.'
        }

        aborted {
            echo 'La ejecución se interrumpió.'
        }

        always {
            echo 'Se evaluó la finalización del pipeline.'
        }
    }
}
```

### Pipeline con salida simulada de notificación

```groovy
pipeline {
    agent any

    stages {
        stage('Validación') {
            steps {
                sh 'test -f README.md'
            }
        }
    }

    post {
        success {
            echo 'SIMULACIÓN: avisar que las validaciones pasaron.'
        }

        failure {
            echo 'SIMULACIÓN: avisar que el pipeline requiere revisión.'
        }

        always {
            echo "Ejecución: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
    }
}
```

El mensaje utiliza información de ejecución no secreta.

### Pipeline con archivado y limpieza de mensaje

```groovy
pipeline {
    agent any

    stages {
        stage('Crear resultado') {
            steps {
                sh 'mkdir -p salida'
                sh 'printf "Resultado de laboratorio\\n" > salida/resultado.txt'
            }
        }

        stage('Archivar resultado') {
            steps {
                archiveArtifacts artifacts: 'salida/resultado.txt',
                                 fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'El resultado se archivó correctamente.'
        }

        failure {
            echo 'No se completó el flujo de archivado.'
        }

        cleanup {
            echo 'Fin de las acciones posteriores.'
        }
    }
}
```

La limpieza real del workspace depende de la configuración y del paso aprobado para la instancia.

### Pipeline con resultado cambiado

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                echo 'Validación de ejemplo.'
            }
        }
    }

    post {
        changed {
            echo 'El resultado difiere de la ejecución anterior.'
        }

        fixed {
            echo 'El pipeline volvió a un resultado exitoso.'
        }

        regression {
            echo 'El resultado pasó de exitoso a no exitoso.'
        }
    }
}
```

Prueba estas condiciones solo en un job con historial suficiente.

### Pipeline con correo ilustrativo

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                sh 'test -f README.md'
            }
        }
    }

    post {
        failure {
            echo 'En un entorno autorizado, aquí podría enviarse un correo.'
        }
    }
}
```

La versión utiliza `echo` para evitar envíos reales.

### Pipeline con plugin de correo

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                sh 'test -f README.md'
            }
        }
    }

    post {
        failure {
            mail to: 'DESTINATARIO_AUTORIZADO',
                 subject: "Fallo en ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: 'Consulte la ejecución en Jenkins.'
        }
    }
}
```

No ejecutes el ejemplo con un destinatario real hasta confirmar la configuración y la autorización.

### Pipeline con `emailext`

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                sh 'test -f README.md'
            }
        }
    }

    post {
        failure {
            emailext(
                subject: "Fallo en ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: 'Revise la primera etapa fallida en Jenkins.',
                recipientProviders: []
            )
        }
    }
}
```

Los argumentos y proveedores dependen del plugin de correo extendido.

## Sesiones prácticas para alumnos

Las prácticas avanzan desde opciones sencillas hasta una política simulada de avisos.

### Preparación general

Antes de comenzar:

- Utiliza un job de laboratorio.
- Confirma qué agente ejecutará el pipeline.
- No habilites correo ni chat real.
- Usa resultados no sensibles.
- Registra cada número de ejecución.
- No cambies la configuración global.
- Consulta al docente si una opción no está instalada.

### Sesión 1: explorar un pipeline sin `options`

**Objetivo:** obtener una línea base antes de configurar opciones.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Línea base') {
            steps {
                echo 'Primera ejecución de referencia.'
            }
        }
    }
}
```

#### Instrucciones

1. Guarda el pipeline en el job autorizado.
2. Ejecuta una vez.
3. Anota duración, estado y agente.
4. Revisa la consola.
5. Registra el número de ejecución.

#### Ficha

```text
Job:
Ejecución:
Duración aproximada:
Resultado:
Agente:
¿Hay marcas de tiempo?:
Observación:
```

### Sesión 2: añadir marcas de tiempo

**Objetivo:** observar mensajes de consola con contexto temporal.

#### Cambio

Añade:

```groovy
options {
    timestamps()
}
```

#### Instrucciones

1. Ejecuta el mismo pipeline.
2. Compara la consola con la línea base.
3. Localiza la hora de cada mensaje.
4. Explica qué problema podría ayudar a diagnosticar.

#### Preguntas

- ¿Qué información se añade?
- ¿Las marcas de tiempo cambian el resultado de las pruebas?
- ¿Qué no se puede deducir únicamente de la hora?

### Sesión 3: configurar un timeout

**Objetivo:** entender el efecto de un límite de tiempo.

#### Pipeline de laboratorio

```groovy
pipeline {
    agent any

    options {
        timeout(time: 2, unit: 'MINUTES')
    }

    stages {
        stage('Comprobación normal') {
            steps {
                echo 'Esta etapa termina rápidamente.'
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta el pipeline normal.
2. Registra el resultado.
3. Revisa cómo se representa el límite.
4. No añadas esperas largas ni bucles infinitos.
5. Explica qué podría ocurrir con una etapa bloqueada.

#### Preguntas

- ¿Qué protege el timeout?
- ¿Qué valor sería demasiado corto para una compilación real?
- ¿Qué evidencia indica que un timeout ocurrió?

### Sesión 4: practicar timeout en un bloque inocuo

**Objetivo:** observar el límite sin bloquear indefinidamente un agente compartido.

#### Advertencia

Realiza esta práctica únicamente con el valor corto indicado y en un agente de laboratorio.

No introduzcas esperas largas.

#### Ejemplo

```groovy
pipeline {
    agent any

    stages {
        stage('Límite de bloque') {
            steps {
                timeout(time: 10, unit: 'SECONDS') {
                    echo 'El bloque comienza.'
                    sleep time: 2, unit: 'SECONDS'
                    echo 'El bloque puede terminar antes del límite.'
                }
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta el ejemplo.
2. Confirma que termina antes del límite.
3. Anota el resultado.
4. No amplíes el tiempo de espera.
5. Comenta cómo cambiaría la observación si el bloque superara el límite.

### Sesión 5: limitar concurrencia de forma segura

**Objetivo:** conocer la opción sin sobrecargar la instancia.

#### Añadir la opción

```groovy
options {
    disableConcurrentBuilds()
}
```

#### Actividad

1. Guarda la definición.
2. Inicia una ejecución.
3. No inicies varias ejecuciones de forma simultánea salvo indicación del docente.
4. Revisa la configuración.
5. Describe qué comportamiento pretende evitar la opción.

#### Preguntas

- ¿Qué recurso compartido podría proteger?
- ¿Qué coste puede tener desactivar la concurrencia?
- ¿Cuándo podría ser innecesario?

### Sesión 6: limitar la retención

**Objetivo:** comprender para qué sirve `buildDiscarder`.

#### Ejemplo de laboratorio

```groovy
options {
    buildDiscarder(
        logRotator(
            numToKeepStr: '5',
            artifactNumToKeepStr: '2'
        )
    )
}
```

#### Actividad

1. Lee cada valor.
2. Describe qué historial pretende conservar.
3. Consulta la política del curso.
4. No alteres la retención de un job compartido sin autorización.
5. Explica por qué el laboratorio puede usar otra política.

#### Preguntas

- ¿Por qué conservar ejecuciones ocupa espacio?
- ¿Por qué conservar muy pocas puede dificultar el diagnóstico?
- ¿Logs y artefactos tienen necesariamente la misma retención?

### Sesión 7: construir un `post` con resultados básicos

**Objetivo:** distinguir éxito, fallo y finalización.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                sh 'test -f README.md'
            }
        }
    }

    post {
        success {
            echo 'Las validaciones configuradas han pasado.'
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

#### Instrucciones

1. Ejecuta con `README.md` presente.
2. Registra los mensajes.
3. Cambia la validación de forma controlada para que falle.
4. Ejecuta otra vez.
5. Compara `success`, `failure` y `always`.
6. Restaura la validación.

#### Preguntas

- ¿Qué bloque se ejecutó en cada caso?
- ¿Qué significa realmente el mensaje de éxito?
- ¿Por qué `always` no debe afirmar que todo pasó?

### Sesión 8: observar `aborted` y `unstable`

**Objetivo:** diferenciar estados de ejecución.

#### Actividad

1. Revisa la documentación del job de laboratorio.
2. Identifica si existen pasos que marquen el resultado como inestable.
3. Revisa cómo se cancela una ejecución autorizada.
4. No interrumpas una ejecución de otro grupo.
5. Anota la etiqueta de resultado que muestra Jenkins.
6. Explica por qué una cancelación no es lo mismo que un test fallido.

#### Preguntas

- ¿Qué significa `aborted`?
- ¿Qué significa `unstable` en el pipeline utilizado?
- ¿Qué sistema o plugin podría marcar un resultado como inestable?

### Sesión 9: diseñar una notificación sin enviarla

**Objetivo:** redactar un aviso útil y seguro.

#### Escenario

La etapa de validación falla.

#### Redacta un mensaje

Incluye:

- Nombre del job.
- Número de ejecución.
- Estado.
- Enlace o indicación para llegar a Jenkins.
- Acción recomendada.

No incluyas:

- Token.
- Contraseña.
- Variables completas.
- Salida completa del log.
- Datos personales innecesarios.

#### Ejemplo de salida simulada

```groovy
post {
    failure {
        echo 'SIMULACIÓN: validación fallida.'
        echo "Job: ${env.JOB_NAME}"
        echo "Ejecución: ${env.BUILD_NUMBER}"
        echo 'Acción: revisar la primera etapa fallida en Jenkins.'
    }
}
```

### Sesión 10: simular avisos de éxito y fallo

**Objetivo:** probar la lógica de notificación sin usar un servicio externo.

#### Pipeline de práctica

```groovy
pipeline {
    agent any

    stages {
        stage('Validación') {
            steps {
                sh 'test -f README.md'
            }
        }
    }

    post {
        success {
            echo 'SIMULACIÓN: las comprobaciones configuradas pasaron.'
        }

        failure {
            echo 'SIMULACIÓN: se requiere revisar la ejecución.'
        }

        always {
            echo "Referencia: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
    }
}
```

#### Instrucciones

1. Ejecuta con un `README.md` válido.
2. Comprueba el aviso simulado.
3. Provoca un fallo controlado.
4. Comprueba el aviso de fallo.
5. Registra si `always` aparece en ambos casos.
6. Restaura el estado válido.

### Sesión 11: evitar notificaciones duplicadas

**Objetivo:** encontrar avisos redundantes en un pipeline.

#### Ejemplo para revisar

```groovy
stage('Prueba') {
    steps {
        echo 'Ejecutando prueba.'
    }

    post {
        failure {
            echo 'Aviso: falló la prueba.'
        }
    }
}

post {
    failure {
        echo 'Aviso: falló el pipeline.'
    }
}
```

#### Actividad

1. Identifica cuántos mensajes podrían aparecer.
2. Decide si ambos son necesarios.
3. Diferencia aviso de etapa y aviso global.
4. Propón cuál debería ser la única notificación externa.
5. Deja el otro mensaje como información de consola, si resulta útil.

### Sesión 12: crear un resumen final

**Objetivo:** crear una salida de consola clara para una ejecución.

#### Resumen requerido

```text
Nombre del job:
Número de ejecución:
Estado:
Acción recomendada:
```

#### Pipeline ilustrativo

```groovy
post {
    always {
        echo "Job: ${env.JOB_NAME}"
        echo "Ejecución: ${env.BUILD_NUMBER}"
        echo "Resultado: ${currentBuild.currentResult}"
    }

    failure {
        echo 'Acción recomendada: revisar el primer error en la consola.'
    }
}
```

`currentBuild.currentResult` está disponible en contextos habituales de Pipeline, pero verifica su comportamiento local.

#### Preguntas

- ¿Qué campos ayudan a encontrar la ejecución?
- ¿Qué valor no debería imprimirse?
- ¿El resumen debería copiar el log completo?

### Sesión 13: archivar y limpiar en el orden correcto

**Objetivo:** conservar una salida antes de limpiar el workspace.

#### Pipeline de práctica

```groovy
pipeline {
    agent any

    stages {
        stage('Crear archivo') {
            steps {
                sh 'mkdir -p salida'
                sh 'printf "Resumen de laboratorio\\n" > salida/resumen.txt'
            }
        }

        stage('Archivar archivo') {
            steps {
                archiveArtifacts artifacts: 'salida/resumen.txt',
                                 fingerprint: true
            }
        }
    }

    post {
        always {
            echo 'La ejecución terminó.'
        }

        cleanup {
            echo 'La limpieza se simula en esta práctica.'
        }
    }
}
```

#### Instrucciones

1. Crea el archivo.
2. Archívalo.
3. Comprueba que aparece en la ejecución.
4. Revisa el bloque `cleanup`.
5. No añadas un comando de borrado amplio.
6. Explica qué orden se necesita si se limpia el workspace de verdad.

### Sesión 14: diseñar una política de avisos

**Objetivo:** decidir cuándo merece la pena enviar una notificación.

#### Completa la tabla

| Evento | ¿Avisar? | Destinatario | Motivo |
|---|---|---|---|
| Éxito rutinario | | | |
| Primer fallo | | | |
| Fallos repetidos | | | |
| Recuperación | | | |
| Cancelación manual | | | |
| Timeout | | | |
| Aprobación pendiente | | | |
| Artefacto generado | | | |

#### Reflexión

- ¿Quién necesita cada aviso?
- ¿Qué acción debe realizar?
- ¿Qué eventos generarían demasiado ruido?
- ¿Qué información puede consultarse en Jenkins?
- ¿Qué canal está autorizado?

### Sesión 15: revisar una configuración de correo

**Objetivo:** identificar requisitos antes de activar correo.

#### Actividad

Sin enviar mensajes:

1. Comprueba si hay un plugin de correo instalado.
2. Localiza la documentación local.
3. Averigua si existe un servidor configurado.
4. Pregunta qué destinatario de prueba se puede utilizar.
5. Revisa cómo se gestionan credenciales.
6. Prepara un mensaje de ejemplo.
7. Espera autorización antes de activar el paso.

#### Hoja de revisión

```text
Plugin:
Paso disponible:
Servidor configurado:
Destinatario autorizado:
Credencial necesaria:
Datos que aparecerían:
Método de prueba:
Persona que autoriza:
```

### Sesión 16: revisar condiciones `fixed` y `regression`

**Objetivo:** comprender avisos basados en cambios de estado.

#### Preparación

Utiliza un job de laboratorio con historial y una condición de validación reversible.

#### Actividad

1. Ejecuta una versión que pase.
2. Provoca un fallo controlado.
3. Ejecuta otra vez.
4. Restaura la validación.
5. Comprueba el mensaje correspondiente.
6. Anota qué resultado anterior necesitaba Jenkins para comparar.

#### Preguntas

- ¿Qué transición representa una regresión?
- ¿Qué transición representa una recuperación?
- ¿Qué puede cambiar si se elimina el historial?

### Sesión 17: redactar un mensaje de fallo

**Objetivo:** escribir una notificación útil sin ruido.

#### Plantilla

```text
Estado:
Job:
Ejecución:
Rama o revisión, si es seguro:
Etapa o resumen:
Acción recomendada:
Enlace:
```

#### Revisión por parejas

La otra persona debe poder responder:

- ¿Qué ocurrió?
- ¿Qué necesita hacer?
- ¿Dónde encuentra el detalle?
- ¿Hay información sensible?
- ¿El mensaje exagera el alcance del resultado?

### Sesión 18: probar el `post` de etapa

**Objetivo:** diferenciar resultado de una etapa y resultado global.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Primera validación') {
            steps {
                echo 'Esta etapa termina correctamente.'
            }

            post {
                success {
                    echo 'La primera validación terminó bien.'
                }

                always {
                    echo 'Fin de la primera etapa.'
                }
            }
        }

        stage('Segunda validación') {
            steps {
                echo 'Segunda etapa de laboratorio.'
            }
        }
    }

    post {
        success {
            echo 'El pipeline completo terminó correctamente.'
        }

        always {
            echo 'Fin global.'
        }
    }
}
```

#### Instrucciones

1. Ejecuta el pipeline.
2. Identifica qué mensajes pertenecen a la etapa.
3. Identifica qué mensajes pertenecen al pipeline.
4. Provoca un fallo en una etapa de práctica, si el docente lo autoriza.
5. Compara los resultados locales y globales.

### Sesión 19: revisar fallos en acciones `post`

**Objetivo:** evitar que una notificación esconda el fallo principal.

#### Escenario

Una etapa falla y la acción de notificación también falla.

#### Actividad

1. Identifica el primer error.
2. Identifica el error de `post`.
3. Determina si la notificación cambió o complicó el resultado.
4. Propón un mensaje alternativo.
5. Explica qué debería ocurrir si el servicio de correo no está disponible.

#### Preguntas

- ¿Cuál es el fallo original?
- ¿La notificación debería ser crítica para el resultado?
- ¿Qué información debería conservar el log?

### Sesión 20: revisión integral

**Objetivo:** auditar `options`, `post` y notificaciones antes de usar un pipeline.

#### Revisa

- Tiempo máximo.
- Concurrencia.
- Retención.
- Checkout.
- Condiciones `post`.
- Nivel de notificación.
- Destinatarios.
- Plugins.
- Credenciales.
- Mensajes.
- Limpieza.
- Resultado final.

#### Entregable

Entrega una lista con:

- Un elemento correcto.
- Un riesgo.
- Una mejora.
- Una pregunta para el administrador.

## Diagnóstico de problemas

Las opciones y los bloques `post` pueden fallar por sintaxis, versión, plugins o por una suposición incorrecta sobre el estado.

### Error de sintaxis en `options`

Comprueba:

- Posición del bloque.
- Llaves.
- Nombre exacto de la opción.
- Tipo de pipeline.
- Versión de Jenkins.
- Plugin requerido.

### Opción no reconocida

No la sustituyas por otra de nombre parecido sin revisar.

Comprueba si:

- Es una opción del núcleo de Pipeline.
- Depende de un plugin.
- Está disponible en la versión instalada.
- Requiere otra sintaxis.
- Se permite en el nivel de pipeline o etapa.

### Timeout inesperado

Comprueba:

- Si el tiempo incluye espera de agente.
- Si existe otro timeout más corto.
- Si una etapa tiene su propio límite.
- Si la unidad es correcta.
- Si la tarea está realmente bloqueada.
- Si hubo una interrupción externa.

### Una ejecución no se inicia en paralelo

Comprueba si `disableConcurrentBuilds()` está activo.

Revisa también:

- Si otra ejecución sigue activa.
- Si el job comparte recursos.
- Si un plugin impone una restricción adicional.
- Si el pipeline está en cola por falta de agente.

### Historial eliminado demasiado pronto

Comprueba:

- `buildDiscarder`.
- Configuración global.
- Retención del job.
- Política de artefactos.
- Tamaño de los archivos.
- Requisitos de diagnóstico o auditoría.

### Condición `post` no ejecutada

Comprueba:

- Estado final.
- Condición utilizada.
- Alcance del bloque.
- Etapa alcanzada.
- Interrupción externa.
- Error de sintaxis o de ejecución.

### `always` no se comporta como se esperaba

`always` cubre condiciones normales del ciclo de vida, pero no garantiza ejecución ante cualquier caída externa o pérdida abrupta.

Consulta el log y la documentación de Jenkins.

### `fixed` o `regression` no aparecen

Comprueba:

- Que existe una ejecución previa.
- Que el historial se conserva.
- Que el resultado anterior es el esperado.
- Que el job es el mismo.
- Que la condición se declaró correctamente.
- Que la comparación está disponible en el contexto.

### El aviso se envía dos veces

Busca:

- `post` de etapa.
- `post` del pipeline.
- Triggers duplicados.
- Varios jobs.
- Reintentos.
- Plugins que envían avisos automáticamente.
- Webhook y sondeo simultáneos.

### Notificación fallida

Comprueba:

- Plugin instalado.
- Paso disponible.
- Configuración de servicio.
- Destinatario.
- Permisos.
- Credencial referenciada.
- Acceso de red.
- Restricciones del servidor.

No imprimas el contenido de una credencial para diagnosticarla.

### Fallo de `emailext` o `mail`

La sintaxis y disponibilidad dependen del plugin y configuración.

Comprueba la referencia local del paso.

No supongas que un ejemplo de otra instancia se puede ejecutar sin cambios.

### Mensaje con datos equivocados

Comprueba:

- Variables usadas.
- Alcance de la etapa.
- Rama y commit.
- Número de build.
- Resultado real.
- Job que ejecutó la definición.

### Aviso de éxito pese a un fallo

Revisa:

- Si se ocultó el código de salida.
- Si se continuó después del error.
- Si un script devolvió `0` indebidamente.
- Si la etapa fallida fue omitida.
- Si el mensaje solo describe una etapa.
- Si algún bloque modificó el resultado.

### Error de limpieza

Comprueba:

- Que la ruta está dentro del workspace.
- Que el archivo no se necesita para archivar.
- Que no hay ejecuciones concurrentes.
- Que el agente permite la operación.
- Que el comando de limpieza está limitado.

### Agente ocupado en un `post`

Algunas acciones posteriores pueden necesitar un workspace o agente.

Comprueba:

- Dónde se ejecuta la acción.
- Si hay agente disponible.
- Si el pipeline usa `agent none`.
- Si el paso requiere archivos.
- Si la instancia necesita un patrón declarativo concreto.

### Diagnóstico ordenado

1. Anota job y número de ejecución.
2. Identifica el resultado final.
3. Localiza la primera etapa fallida.
4. Separa el error de negocio del error de notificación.
5. Comprueba las opciones aplicadas.
6. Comprueba plugins y versiones.
7. Revisa el alcance del `post`.
8. Reproduce con una ejecución no sensible.
9. Cambia una sola cosa.
10. Registra la solución.

## Seguridad y buenas prácticas

`options` y `post` influyen en recursos, visibilidad y comunicación.

### Mínimo privilegio

Las acciones posteriores no deben recibir más permisos de los necesarios.

Una notificación simulada no necesita una credencial.

### Credenciales en integraciones

Si un plugin necesita una credencial:

- Guárdala en el sistema de credenciales autorizado.
- Limita su alcance.
- Evita imprimirla.
- No la escribas en el `Jenkinsfile`.
- Limita qué jobs pueden usarla.
- Sigue el procedimiento de rotación.

### Evitar datos sensibles en avisos

No incluyas:

- Tokens.
- Contraseñas.
- Claves privadas.
- Variables completas.
- Datos personales innecesarios.
- Detalles internos no autorizados.
- Contenido completo del log.

### Mensajes proporcionales

Describe únicamente lo que las comprobaciones verificaron.

No afirmes que una aplicación está libre de defectos porque una validación básica haya pasado.

### Retención documentada

Conserva lo necesario para:

- Diagnóstico.
- Revisión.
- Entrega del curso.
- Auditoría autorizada.

No conserves datos innecesarios sin una razón.

### Concurrencia controlada

Limita la concurrencia solo cuando exista una dependencia compartida o una política que lo requiera.

### Limpieza segura

Limita la limpieza al workspace y al alcance acordado.

No borres datos fuera del entorno de práctica.

### Revisión del `Jenkinsfile`

Antes de fusionar un cambio, revisa:

- Nuevas opciones.
- Límites de tiempo.
- Retención.
- Notificaciones.
- Destinatarios.
- Credenciales.
- Limpieza.
- Condiciones `post`.
- Cambios del resultado.

### No depender de la notificación para conservar evidencia

La información principal debe estar en Jenkins o en el sistema de registros aprobado.

El mensaje puede perderse o retrasarse.

### Notificaciones accionables

Una notificación debería permitir responder:

- ¿Qué ocurrió?
- ¿Dónde está el detalle?
- ¿Quién debe actuar?
- ¿Qué paso sigue?
- ¿Qué plazo existe?

## Checklist de revisión

### `options`

- [ ] Cada opción tiene un propósito documentado.
- [ ] El timeout es razonable.
- [ ] La concurrencia coincide con el uso de recursos.
- [ ] La retención respeta la política local.
- [ ] Las opciones dependen de plugins conocidos.
- [ ] El checkout automático no se omite por accidente.
- [ ] El efecto sobre agentes y ejecutores se comprende.

### `post`

- [ ] Se distinguen éxito, fallo, inestabilidad y aborto.
- [ ] `always` no afirma éxito.
- [ ] El alcance del mensaje es claro.
- [ ] No se repiten acciones innecesariamente.
- [ ] La limpieza ocurre en un lugar apropiado.
- [ ] Las acciones posteriores no ocultan la causa original.
- [ ] Se consideran fallos de plugins o servicios externos.

### Notificaciones

- [ ] El destinatario está autorizado.
- [ ] El canal es adecuado.
- [ ] El mensaje es conciso.
- [ ] El mensaje incluye identificación útil.
- [ ] No contiene secretos ni datos innecesarios.
- [ ] No se generan duplicados.
- [ ] La integración se probó de manera segura.

### Seguridad

- [ ] Los secretos se gestionan con credenciales.
- [ ] Las credenciales tienen alcance mínimo.
- [ ] Los logs se revisan antes de compartirlos.
- [ ] La limpieza está limitada al workspace.
- [ ] El `Jenkinsfile` se revisa como código.
- [ ] No se usan destinatarios o URLs de prueba en producción.

## Ejercicios de repaso

1. ¿Qué diferencia hay entre `options` y `post`?
2. ¿Qué controla `timestamps()`?
3. ¿Qué función cumple `timeout`?
4. ¿Qué problemas puede resolver `disableConcurrentBuilds()`?
5. ¿Qué coste puede tener desactivar concurrencia?
6. ¿Para qué sirve `buildDiscarder`?
7. ¿Por qué la retención de logs y artefactos debe revisarse?
8. ¿Qué significa `always`?
9. ¿Qué diferencia hay entre `success` y `failure`?
10. ¿Qué significa `unstable`?
11. ¿Qué puede causar un estado `aborted`?
12. ¿Qué comparan `changed`, `fixed` y `regression`?
13. ¿Qué diferencia hay entre `post` de etapa y `post` de pipeline?
14. ¿Por qué una notificación no debería contener toda la consola?
15. ¿Qué configuración se necesita para enviar correo?
16. ¿Por qué se deben evitar avisos duplicados?
17. ¿Cuándo conviene limpiar un workspace?
18. ¿Por qué se archiva antes de limpiar?
19. ¿Qué debería incluir un mensaje de fallo?
20. ¿Qué deberías hacer si falla una integración de notificaciones?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«`options` configura aspectos del comportamiento del pipeline».

### Afirmación 2

«`post` puede reaccionar al resultado final».

### Afirmación 3

«`always` significa que cualquier acción se ejecutará incluso si el controlador se apaga».

### Afirmación 4

«Un timeout debe tratarse como aprobación si nadie responde».

### Afirmación 5

«`disableConcurrentBuilds()` puede evitar ejecuciones simultáneas del mismo pipeline».

### Afirmación 6

«Aumentar la retención siempre es mejor».

### Afirmación 7

«`failure` y `aborted` describen necesariamente el mismo evento».

### Afirmación 8

«Una notificación de éxito debe reflejar las comprobaciones reales».

### Afirmación 9

«Enviar un aviso en el `post` de una etapa y en el `post` global puede generar duplicados».

### Afirmación 10

«`mail` y `emailext` están disponibles de la misma manera en todas las instancias».

### Afirmación 11

«Los secretos pueden incluirse en el cuerpo del correo porque el destinatario es interno».

### Afirmación 12

«Un `buildDiscarder` puede afectar cuánto historial se conserva».

### Afirmación 13

«Una etapa exitosa garantiza que el pipeline completo sea exitoso».

### Afirmación 14

«Una acción de limpieza también puede fallar».

### Afirmación 15

«Una notificación debe dirigir a la información completa sin copiar necesariamente todos los logs».

## Respuestas orientativas

### Afirmación 1

**Correcta.** `options` configura aspectos del pipeline.

### Afirmación 2

**Correcta.** `post` puede declarar acciones posteriores según el resultado.

### Afirmación 3

**Incorrecta.** Un fallo externo puede impedir acciones posteriores.

### Afirmación 4

**Incorrecta.** La falta de respuesta no es aprobación.

### Afirmación 5

**Correcta.** Esa es una de sus funciones habituales.

### Afirmación 6

**Incorrecta.** Retención excesiva consume almacenamiento y puede contradecir políticas.

### Afirmación 7

**Incorrecta.** Fallo y aborto son estados distintos.

### Afirmación 8

**Correcta.** El mensaje debe ser preciso y limitado al alcance validado.

### Afirmación 9

**Correcta.** El mismo evento puede generar más de un mensaje.

### Afirmación 10

**Incorrecta.** Dependen de plugins y configuración.

### Afirmación 11

**Incorrecta.** Los secretos no deben incluirse en notificaciones.

### Afirmación 12

**Correcta.** Puede controlar la conservación del historial y, según la configuración, de artefactos.

### Afirmación 13

**Incorrecta.** Otra etapa puede fallar después.

### Afirmación 14

**Correcta.** La limpieza es una acción ejecutable y puede devolver errores.

### Afirmación 15

**Correcta.** Una notificación concisa suele ser más útil y segura.

## Plantilla de política de notificaciones

Completa esta plantilla para un job de laboratorio:

```text
Nombre del job:
Evento que requiere aviso:
Destinatario o canal:
Responsable:
Información incluida:
Información excluida:
Enlace de referencia:
Frecuencia:
Tratamiento de duplicados:
Tratamiento de fallos de notificación:
Retención asociada:
Plugin o integración:
Autorización:
```

No incluyas valores de credenciales ni datos de acceso.

## Plantilla de revisión de `post`

```text
Condición:
Acción:
Alcance:
Resultado que la activa:
Agente requerido:
Datos utilizados:
Posible fallo:
¿Puede duplicarse?:
¿Cambia el resultado?:
¿Expone información?:
```

## Glosario

- **Aborted:** estado de una ejecución interrumpida antes de completar normalmente.
- **Artefacto:** archivo generado y conservado asociado a una ejecución.
- **Build discarder:** política para retener o eliminar ejecuciones anteriores.
- **Concurrencia:** ejecución simultánea de varios trabajos o builds.
- **`post`:** bloque de acciones posteriores según etapa o resultado.
- **`options`:** bloque de configuración del pipeline declarativo.
- **Notificación:** mensaje enviado a una persona o sistema sobre un evento.
- **`always`:** condición posterior aplicable al finalizar el flujo en circunstancias normales.
- **`success`:** condición posterior para un resultado exitoso.
- **`failure`:** condición posterior para un resultado fallido.
- **`unstable`:** resultado que indica una ejecución no plenamente exitosa, según la configuración.
- **`timeout`:** límite temporal para una ejecución o bloque.
- **`fixed`:** condición asociada a una recuperación del resultado, según el historial.
- **`regression`:** condición asociada a un empeoramiento del resultado, según el historial.
- **`changed`:** condición asociada a un resultado diferente del anterior.
- **`cleanup`:** condición posterior para acciones de limpieza en los contextos admitidos.
- **Plugin:** extensión que añade pasos o funcionalidades a Jenkins.
- **Retención:** política que determina cuánto tiempo se conservan ejecuciones o artefactos.
- **Ruido de notificaciones:** avisos excesivos que reducen la visibilidad de eventos importantes.
- **Trazabilidad:** posibilidad de relacionar mensajes, ejecuciones, resultados y revisiones.

## Síntesis final

`options`, `post` y las notificaciones dan control y contexto al ciclo de vida del pipeline.

- `options` configura tiempo, concurrencia, checkout y retención.
- `post` responde a resultados como éxito, fallo, inestabilidad o aborto.
- El `post` de una etapa y el del pipeline tienen alcances distintos.
- Una notificación debería ser breve, precisa y accionable.
- Correo y chat dependen de plugins y configuración autorizada.
- Los timeouts y las políticas de concurrencia deben elegirse con criterio.
- La retención debe equilibrar diagnóstico, auditoría y almacenamiento.
- La limpieza debe limitarse al workspace y respetar el orden de archivado.
- Los secretos no deben aparecer en mensajes, logs o configuraciones versionadas.
- Una notificación comunica el resultado; no lo cambia ni sustituye las pruebas.