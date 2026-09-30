# Pipeline interactivo en Jenkins

Un pipeline interactivo permite que una persona proporcione una decisión mientras una ejecución está en marcha. Puede servir para solicitar una aprobación, elegir entre opciones permitidas o detener el flujo hasta que alguien confirme una acción. Esa interacción debe tener un propósito claro: los pipelines automatizados deberían avanzar sin intervención humana, salvo en los puntos donde una decisión manual aporte valor o control.

Esta unidad explica cómo diseñar esas pausas con el paso `input` y la directiva `input` de un pipeline declarativo. También cubre permisos, tiempos de espera, cancelaciones, parámetros de inicio y decisiones de aprobación. Las sesiones prácticas utilizan tareas inocuas y no despliegan software.

> **Uso seguro:** ejecuta los ejemplos solo en una instancia de laboratorio. No apruebes cambios ni despliegues en producción desde estas prácticas. Una persona autorizada debe revisar cualquier flujo que utilice credenciales o modifique sistemas. Una aprobación de Jenkins es un control de flujo, no una garantía de que la acción sea segura.

## Fundamentos de la interacción

Un pipeline interactivo se detiene en un punto definido para esperar una respuesta o una aprobación.

### Qué es un pipeline interactivo

Un pipeline interactivo es un flujo que combina pasos automáticos con una o más decisiones humanas.

Puede solicitar a una persona que:

- Confirme que se puede continuar.
- Revise una salida generada.
- Seleccione una opción de una lista.
- Indique un valor no sensible.
- Apruebe una etapa antes de seguir.
- Cancele una ejecución que ya no sea necesaria.

La pausa debe estar justificada por el proceso.

### Automatización e intervención humana

Un pipeline automatizado debería poder ejecutar sus comprobaciones sin que alguien tenga que vigilarlo constantemente.

La intervención humana puede ser apropiada cuando:

- Hay que revisar un resultado antes de continuar.
- La siguiente etapa requiere una aprobación formal.
- La persona responsable debe elegir entre opciones limitadas.
- Existe un control de cambio establecido.
- El flujo necesita una confirmación explícita antes de una operación con impacto.

No añadas una pausa solo porque el pipeline pueda incluirla.

### Parámetros al iniciar y entradas durante la ejecución

Jenkins puede pedir valores al iniciar una ejecución mediante parámetros del job.

También puede solicitar una respuesta cuando el pipeline ya está ejecutándose.

La diferencia principal es el momento:

- **Parámetro del job:** se proporciona antes de que el pipeline empiece.
- **Entrada interactiva:** se solicita en un punto del pipeline mientras la ejecución avanza.

### Ejemplo de parámetro inicial

Una persona elige el modo antes de iniciar el job:

```groovy
parameters {
    choice(
        name: 'MODO',
        choices: ['simple', 'detallado'],
        description: 'Selecciona el nivel de mensajes'
    )
}
```

Ese valor está disponible desde el principio de la ejecución.

### Ejemplo de entrada durante la ejecución

Una persona confirma después de que terminen las comprobaciones:

```text
Validaciones automáticas
        |
        v
Jenkins solicita aprobación
        |
        v
La persona revisa y responde
        |
        v
El pipeline continúa o se detiene
```

La decisión depende de información que quizá no estaba disponible al iniciar el job.

### Aprobación

Una aprobación es una respuesta que permite continuar con una parte del flujo.

La aprobación puede ser:

- Manual.
- Restringida a usuarios o grupos autorizados.
- Registrada como parte de la ejecución.
- Sujeta a un tiempo de espera.
- Independiente del autor del cambio, si la política lo requiere.

La configuración de Jenkins debe respetar las reglas de autorización del equipo.

### Decisión

Una decisión puede elegir entre varias rutas que ya están permitidas.

Por ejemplo:

- `continuar`
- `revisar`
- `cancelar`

Una lista limitada es preferible a pedir texto libre cuando solo existen unas pocas opciones válidas.

### Cancelación

Una persona puede decidir que el pipeline no debe continuar.

La cancelación puede marcar la ejecución como abortada, según cómo se exprese la respuesta y cómo esté escrito el pipeline.

Distingue entre:

- Una validación fallida.
- Una decisión de no continuar.
- Una ejecución abortada por una persona.
- Una ejecución detenida por timeout.
- Una ejecución completada correctamente.

### Cuándo pedir intervención

Una pausa puede ser útil si:

- La persona revisora tiene información que Jenkins no puede evaluar.
- La aprobación es un requisito formal.
- El tiempo de espera está controlado.
- La identidad de quien aprueba se puede verificar.
- La decisión queda documentada.
- No hay una forma fiable de automatizar la comprobación.

### Cuándo evitar una pausa

Evita la interacción humana si:

- La respuesta siempre es la misma.
- El pipeline puede validar la condición automáticamente.
- La pausa no tiene responsable.
- Las ejecuciones pueden quedar esperando indefinidamente.
- El resultado no queda registrado.
- El flujo solo se puede completar cuando alguien recuerda abrir la página.
- La aprobación no cambia nada significativo.

### Interacción no es sustituto de pruebas

Una persona puede aprobar una ejecución que no pasó las validaciones.

Las comprobaciones automáticas deben seguir ejecutándose y reportando sus resultados.

Una aprobación humana no debería convertir una prueba fallida en una prueba exitosa.

## Parámetros e interacción en distintos momentos

La interacción puede aparecer antes, durante o después de las validaciones automáticas.

### Preguntar al inicio

Los parámetros del job son adecuados para opciones conocidas antes de comenzar.

Ejemplos:

- Elegir una variante de prueba.
- Seleccionar un nivel de detalle.
- Indicar un identificador no sensible.
- Activar una comprobación opcional.

### Preguntar durante el flujo

`input` es adecuado para decisiones que deben tomarse después de observar un resultado.

Ejemplos:

- Confirmar la revisión de un informe.
- Autorizar una etapa posterior.
- Elegir entre dos acciones no destructivas.
- Registrar que una persona revisó un resultado.

### No duplicar opciones

Si una opción se conoce antes de iniciar, no hace falta volver a preguntarla durante el pipeline, salvo que el proceso requiera confirmación explícita.

Cada pregunta añade:

- Tiempo.
- Dependencia de una persona.
- Posibilidad de error.
- Posibilidad de una ejecución abandonada.

### Separar decisión y aprobación

Una aprobación pregunta, en general, si el flujo puede continuar.

Una selección pregunta qué opción limitada debe usar el flujo.

No conviertas una elección entre opciones en una pregunta abierta si el pipeline solo admite valores conocidos.

### Definir el significado de cada respuesta

Antes de implementar `input`, documenta:

- Quién puede responder.
- Qué significa cada opción.
- Qué ocurre al vencer el tiempo.
- Qué ocurre al cancelar.
- Qué etapa continúa.
- Qué información se registra.
- Qué permisos requiere la acción posterior.

## El paso `input`

El paso `input` detiene una ejecución hasta recibir una respuesta o hasta que ocurra una condición de interrupción.

### Sintaxis básica

Ejemplo sencillo:

```groovy
pipeline {
    agent any

    stages {
        stage('Pausa de laboratorio') {
            steps {
                input message: '¿Continuar con la siguiente etapa?',
                      ok: 'Continuar'
            }
        }

        stage('Continuar') {
            steps {
                echo 'La ejecución continúa.'
            }
        }
    }
}
```

La ejecución se detiene en `input` hasta que una persona autorizada responde o se cancela.

### Campos habituales

El paso `input` puede aceptar opciones como:

- `message`: texto que explica la solicitud.
- `ok`: texto del botón de confirmación.
- `submitter`: lista de usuarios o grupos autorizados, si la instancia lo permite.
- `submitterParameter`: nombre del dato donde registrar quién respondió.
- `parameters`: valores adicionales que se solicitan al responder.
- `id`: identificador asociado a la solicitud, cuando se utiliza.

La sintaxis exacta depende de Jenkins y de los plugins instalados.

### Escribir un mensaje claro

El mensaje debe explicar:

- Qué terminó.
- Qué se necesita revisar.
- Qué significa continuar.
- Qué ocurrirá después.
- Qué hacer si la revisión no se ha completado.

Evita mensajes ambiguos como:

```text
¿OK?
```

### Mensaje informativo

```groovy
input message: 'Revise el informe de validación antes de continuar.',
      ok: 'He revisado el informe'
```

El mensaje no debería afirmar que una acción fue revisada si la persona no tiene acceso al informe.

### Texto del botón

Un botón llamado `Continuar` deja claro qué hará la acción.

En contextos de aprobación, puedes utilizar un texto más específico, siempre que coincida con el proceso.

No uses un texto que sugiera una garantía que Jenkins no ofrece.

### Solicitar una selección

El paso `input` puede pedir parámetros adicionales.

Ejemplo con una elección limitada:

```groovy
script {
    def seleccion = input(
        message: 'Selecciona una opción de laboratorio.',
        ok: 'Enviar selección',
        parameters: [
            choice(
                name: 'OPCION',
                choices: ['observar', 'continuar'],
                description: 'Elige una opción permitida'
            )
        ]
    )

    echo "Opción seleccionada: ${seleccion}"
}
```

Cuando se pide un único parámetro, el valor devuelto puede ser ese valor. Comprueba el comportamiento de la versión instalada antes de depender de él.

### Solicitar varios valores

Si `input` solicita varios parámetros, el resultado puede estar disponible como una estructura con varios valores.

No des por sentado el formato sin verificarlo en la versión utilizada.

Para prácticas iniciales, solicita un único valor.

### Validar el valor elegido

Aunque la interfaz ofrezca opciones limitadas, el pipeline debe tratar la respuesta explícitamente.

```groovy
script {
    def seleccion = input(
        message: 'Selecciona el modo de laboratorio.',
        ok: 'Confirmar',
        parameters: [
            choice(
                name: 'MODO',
                choices: ['simple', 'detallado'],
                description: 'Modo disponible'
            )
        ]
    )

    if (!(seleccion in ['simple', 'detallado'])) {
        error 'La selección no está permitida.'
    }

    echo "Modo elegido: ${seleccion}"
}
```

La validación hace explícitas las opciones que acepta el pipeline.

### `submitter`

El campo `submitter` puede limitar quién responde a una entrada, según la configuración de Jenkins.

Ejemplo ilustrativo:

```groovy
input message: 'Aprobación de una etapa de laboratorio.',
      ok: 'Aprobar',
      submitter: 'grupo-revisores'
```

Sustituye el nombre por un usuario o grupo real únicamente si el administrador lo ha configurado y autorizado.

### No inventar grupos

Un nombre de grupo escrito en el pipeline no crea un grupo ni otorga permisos.

Comprueba con el administrador:

- El identificador aceptado.
- La integración de autenticación.
- Los permisos necesarios.
- Quién pertenece al grupo.
- Si existe un grupo separado para laboratorio.

### `submitterParameter`

`submitterParameter` puede registrar quién respondió, si la instancia admite ese comportamiento.

Ejemplo conceptual:

```groovy
input message: 'Registre la revisión de laboratorio.',
      ok: 'Confirmar',
      submitterParameter: 'RESPONDIO'
```

La forma exacta de recuperar el valor depende del paso y de si también se solicitaron otros parámetros.

No imprimas información innecesaria de identidad en una salida pública.

### Identificador de entrada

Un identificador puede distinguir una solicitud de entrada dentro de una ejecución.

Puede ser útil en ciertos flujos o integraciones.

Utiliza identificadores descriptivos, únicos cuando sea necesario y compatibles con la instancia.

### Aprobación con directiva declarativa

En pipelines declarativos, una etapa puede declarar una solicitud de entrada antes de asignar el agente de esa etapa.

Ejemplo ilustrativo:

```groovy
stage('Confirmación') {
    input {
        message 'Confirme que revisó el informe de laboratorio.'
        ok 'Continuar'
    }

    agent {
        label 'linux-laboratorio'
    }

    steps {
        echo 'La etapa continúa después de la confirmación.'
    }
}
```

La directiva `input` de una etapa tiene un lugar y un comportamiento concretos dentro del orden declarativo.

Comprueba la documentación de la versión utilizada.

### Entrada declarativa y recursos

En configuraciones declarativas, una entrada de etapa puede ocurrir antes de que se asigne el agente de esa etapa.

Esto puede evitar reservar un ejecutor mientras se espera.

No todos los patrones de pipeline se comportan igual.

Verifica el orden de `input`, `when`, `options` y `agent` en la versión local.

## Permisos de aprobación

Una entrada interactiva debe limitarse a las personas que pueden tomar esa decisión.

### Autorización de entrada

Los permisos pueden depender de:

- Autenticación de Jenkins.
- Roles.
- Grupos.
- Plugins de autorización.
- Configuración del job.
- Permisos de la ejecución.
- Reglas de la organización.

No asumas que una persona que puede ver el job puede también aprobarlo.

### Separación de responsabilidades

En procesos con revisión, puede ser importante que quien aprueba no sea la misma persona que propuso el cambio.

Esa regla no se obtiene automáticamente con `input`.

Debe establecerse y verificarse en la configuración de identidad y de proceso.

### Aprobación con grupo restringido

Limitar la respuesta a un grupo específico puede ser útil para flujos formales.

Antes de utilizarlo, comprueba:

- Que el grupo existe.
- Que su nombre es correcto.
- Que los miembros son apropiados.
- Que el alcance es el mínimo necesario.
- Que hay una persona responsable de atender la solicitud.

### Aprobación y permisos generales del job

Una restricción en `input` no sustituye la revisión de permisos del job.

Comprueba también quién puede:

- Modificar el `Jenkinsfile`.
- Iniciar el job.
- Cancelar ejecuciones.
- Modificar credenciales.
- Cambiar el agente.
- Editar el propio job.

### Acceso a una ejecución

La página de una ejecución puede contener:

- Parámetros.
- Logs.
- Artefactos.
- Nombres de agentes.
- Datos del repositorio.
- Solicitudes de aprobación.

Limita su acceso según la sensibilidad de esa información.

## Pausas y tiempos de espera

Una entrada puede permanecer pendiente. El pipeline debe tener un comportamiento definido para esa situación.

### Qué ocurre mientras espera Jenkins

Mientras espera una respuesta, la ejecución conserva su estado pendiente.

El efecto en los recursos depende de la estructura del pipeline y de dónde se coloque `input`.

Si la ejecución mantiene un agente o ejecutor, ese recurso podría quedar reservado durante la espera.

### Evitar reservar agentes sin necesidad

Para aprobaciones prolongadas, diseña el flujo para que la pausa no ocupe un recurso de ejecución innecesariamente.

En un pipeline declarativo, una entrada de etapa puede ejecutarse antes de asignar el agente de esa etapa.

Comprueba el comportamiento exacto de tu versión.

### Usar `timeout`

`timeout` limita cuánto tiempo puede durar un bloque.

Ejemplo:

```groovy
timeout(time: 5, unit: 'MINUTES') {
    input message: 'Confirme la revisión de laboratorio.',
          ok: 'Continuar'
}
```

El bloque termina si se agota el tiempo definido.

### Unidad de tiempo

Jenkins admite unidades de tiempo según la versión y el contexto.

Ejemplos habituales pueden incluir:

- `SECONDS`
- `MINUTES`
- `HOURS`
- `DAYS`

Confirma las unidades disponibles en la instancia.

### Elegir un tiempo razonable

El tiempo de espera debe considerar:

- Duración normal de la revisión.
- Horario del equipo.
- Criticidad del flujo.
- Capacidad del responsable.
- Qué ocurre al vencer.
- Cuánto tiempo puede permanecer una ejecución pendiente.

No uses un tiempo tan corto que impida una revisión real.

### Resultado del timeout

Un timeout suele interrumpir el bloque o la ejecución y puede dejarla como abortada.

No supongas que equivale a una aprobación denegada.

Define explícitamente qué estado y mensaje debe comunicarse.

### Manejar timeout en Groovy

En casos donde se necesite una respuesta alternativa, puede utilizarse manejo de excepciones, siempre que el diseño sea claro.

Ejemplo conceptual:

```groovy
script {
    try {
        timeout(time: 5, unit: 'MINUTES') {
            input message: 'Confirme la revisión.',
                  ok: 'Continuar'
        }
    } catch (err) {
        echo 'La espera terminó o fue interrumpida.'
        throw err
    }
}
```

Este ejemplo vuelve a propagar la excepción, por lo que la ejecución no continúa como si hubiera sido aprobada.

### No convertir un timeout en aprobación

Un timeout no debe tratarse como una respuesta afirmativa.

Si no hubo respuesta, el pipeline no tiene una aprobación humana registrada.

El comportamiento seguro habitual es detener o abortar la ruta que requiere esa aprobación.

### Cancelación manual

Una persona puede cancelar una ejecución desde Jenkins.

La cancelación no es equivalente a que una comprobación haya fallado.

Registra el resultado como cancelado o abortado, según lo muestre la instancia.

### Denegación explícita

Si el proceso necesita una respuesta explícita de `aprobar` o `rechazar`, utiliza opciones limitadas y trata cada caso de manera distinta.

No interpretes el cierre de la página o la falta de respuesta como una denegación documentada.

### Reanudar una ejecución

Una persona autorizada puede responder a una entrada pendiente desde la página de Jenkins.

La ubicación y los controles de la interfaz pueden variar.

Antes de responder, revisa:

- Job.
- Número de ejecución.
- Rama o revisión.
- Etapa actual.
- Informe asociado.
- Mensaje de la solicitud.
- Identidad del solicitante, cuando esté disponible.

### Abandonar una ejecución

Si una ejecución ya no debe continuar, sigue el proceso de cancelación autorizado.

No dejes ejecuciones pendientes sin responsable.

## Patrones de diseño

Los patrones siguientes muestran formas comunes de combinar automatización y revisión.

### Aprobación antes de una etapa

Una secuencia puede validar automáticamente y después esperar aprobación.

```text
Checkout
   |
   v
Validación automática
   |
   v
Aprobación manual
   |
   v
Etapa posterior
```

La validación debe ocurrir antes de solicitar aprobación si la persona revisora necesita sus resultados.

### Aprobación declarativa antes de asignar un agente

```groovy
pipeline {
    agent none

    stages {
        stage('Validar') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                echo 'Ejecutando validación automática.'
            }
        }

        stage('Aprobar continuación') {
            input {
                message 'Revise el resultado de la validación antes de continuar.'
                ok 'Aprobado para el siguiente paso'
                submitter 'revisores-laboratorio'
            }

            agent {
                label 'linux-laboratorio'
            }

            steps {
                echo 'La revisión se confirmó.'
            }
        }

        stage('Siguiente paso') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                echo 'Ejecutando una actividad inocua de laboratorio.'
            }
        }
    }
}
```

Este ejemplo usa una etiqueta y un grupo ilustrativos.

Sustitúyelos solo si el curso los proporciona.

### Aprobación dentro del paso `input`

```groovy
pipeline {
    agent any

    stages {
        stage('Revisar resultado') {
            steps {
                echo 'La salida está disponible para la persona revisora.'

                timeout(time: 10, unit: 'MINUTES') {
                    input message: '¿Se puede continuar con la práctica?',
                          ok: 'Continuar'
                }
            }
        }

        stage('Continuar') {
            steps {
                echo 'Se alcanzó la etapa posterior.'
            }
        }
    }
}
```

Este patrón es fácil de leer.

En un pipeline con un agente global, el agente puede permanecer asignado durante la pausa.

Para esperas largas, revisa la estrategia de asignación de agente.

### Seleccionar una acción inocua

```groovy
pipeline {
    agent any

    stages {
        stage('Elegir modo') {
            steps {
                script {
                    def modo = input(
                        message: 'Elija cómo presentar el resultado.',
                        ok: 'Guardar elección',
                        parameters: [
                            choice(
                                name: 'MODO',
                                choices: ['breve', 'detallado'],
                                description: 'No cambia recursos externos'
                            )
                        ]
                    )

                    if (modo == 'breve') {
                        echo 'Se eligió el resumen breve.'
                    } else if (modo == 'detallado') {
                        echo 'Se eligió el resumen detallado.'
                    } else {
                        error 'La opción recibida no está permitida.'
                    }
                }
            }
        }
    }
}
```

La selección cambia la presentación, no el acceso a un sistema externo.

### Separar aprobación y ejecución

Mantén la aprobación separada de la etapa que realiza la acción posterior.

Esto hace más sencillo identificar:

- Quién aprobó.
- Qué se aprobó.
- Qué paso se ejecutó.
- Si la ejecución llegó a completarse.
- En qué etapa ocurrió un fallo.

### Probar primero, pedir aprobación después

Si una persona necesita revisar un informe, genera el informe antes de solicitar la decisión.

El mensaje de entrada debería indicar dónde encontrarlo.

### Aprobación no destructiva en el laboratorio

En las prácticas, la etapa posterior a la aprobación puede limitarse a:

- Mostrar un mensaje.
- Crear un archivo de texto.
- Archivar un resultado de prueba.
- Continuar a una validación inocua.

No utilices el laboratorio para probar operaciones destructivas.

### Usar una lista cerrada

Cuando haya alternativas, ofrece una lista de opciones aprobadas.

Ejemplo:

```text
resumen
detalle
cancelar
```

No solicites una instrucción arbitraria para ejecutarla como comando.

### Confirmación doble

Para operaciones de alto impacto, una confirmación simple puede ser insuficiente.

La organización puede requerir:

- Dos personas distintas.
- Una ventana de cambio.
- Una aprobación externa.
- Una comprobación automática adicional.
- Una separación entre quien solicita y quien aprueba.

Jenkins no establece por sí solo todo ese proceso.

### Evitar aprobar información incompleta

Antes de pedir una aprobación, comprueba que la persona revisora dispone de:

- Resultado de pruebas.
- Identificador de commit.
- Rama.
- Informe relevante.
- Alcance de la acción.
- Consecuencias esperadas.
- Procedimiento para rechazar o cancelar.

### No automatizar una decisión humana con un valor predeterminado

No establezcas una respuesta automática equivalente a aprobar.

Una aprobación requiere una acción autorizada, salvo que la política defina otra cosa.

## Parámetros iniciales y entradas interactivas

Los parámetros y `input` pueden coexistir, pero cumplen propósitos distintos.

### Parámetro inicial

```groovy
parameters {
    choice(
        name: 'FORMATO',
        choices: ['breve', 'detallado'],
        description: 'Formato elegido al iniciar'
    )
}
```

La persona decide antes de que el pipeline empiece.

### Entrada interactiva

```groovy
input message: 'Revise el resultado y confirme si puede continuar.',
      ok: 'Confirmar'
```

La persona decide después de que el flujo ha llegado a ese punto.

### Criterio para elegir

Usa un parámetro inicial cuando:

- El valor se conoce al iniciar.
- No depende de resultados previos.
- La decisión no requiere revisión de un informe.

Usa `input` cuando:

- La respuesta depende de resultados generados.
- La decisión se produce en medio del flujo.
- Debe registrarse una aprobación en un punto concreto.

### No solicitar dos veces lo mismo

Evita pedir el mismo valor como parámetro y volver a solicitarlo en `input`, salvo que el proceso necesite confirmar expresamente que sigue siendo válido.

### Conservar la decisión

Registra la selección en una variable de ejecución, una salida o el registro de Jenkins según el caso.

No la escribas en un archivo compartido si contiene información sensible.

## Seguridad y operación

Un punto interactivo puede cambiar quién controla el avance del pipeline.

### Identidad de quien responde

Si el proceso necesita saber quién aprobó, utiliza un mecanismo admitido por Jenkins y configurado por el administrador.

No aceptes un nombre escrito por la misma persona como prueba de identidad.

### Auditoría

Para una decisión importante, conserva:

- Identificador del job.
- Número de ejecución.
- Rama.
- Commit.
- Etapa.
- Mensaje mostrado.
- Resultado.
- Identidad registrada, si la política lo requiere.
- Hora de la decisión, si Jenkins la registra.

La disponibilidad de estos datos depende de Jenkins y de los plugins instalados.

### Aprobación y código no confiable

Un `Jenkinsfile` de una rama puede modificar la forma en que se presenta la solicitud.

No dejes que un cambio no revisado:

- Elimine controles de aprobación.
- Cambie el grupo de aprobadores.
- Añada una acción de alto impacto.
- Muestre información engañosa.
- Exponga credenciales.

### Aprobación no significa confianza absoluta

Una persona puede cometer un error o interpretar mal una solicitud ambigua.

Refuerza la aprobación con:

- Mensajes claros.
- Evidencia visible.
- Permisos mínimos.
- Revisiones automáticas.
- Separación de funciones.
- Procedimientos definidos.

### No pedir contraseñas mediante `input`

No solicites contraseñas, tokens o claves privadas como respuesta interactiva del pipeline.

El paso puede registrar, almacenar o mostrar datos de forma que no sea apropiada para secretos.

Utiliza el almacén de credenciales autorizado.

### Información que se muestra en el mensaje

No incluyas en `message`:

- Tokens.
- Contraseñas.
- Datos personales innecesarios.
- URLs privadas no autorizadas.
- Detalles sensibles de sistemas.
- Instrucciones para saltarse controles.

Incluye la información mínima necesaria para identificar la decisión.

### Tiempo de espera y responsabilidad

Cada entrada pendiente necesita:

- Un responsable.
- Un tiempo máximo o política de caducidad.
- Una acción segura al vencer.
- Un procedimiento para cancelar.
- Una forma de localizar ejecuciones abandonadas.

### Evitar el bloqueo de recursos

Aprobaciones prolongadas pueden consumir ejecutores si el pipeline mantiene un agente asignado.

Revisa la ubicación del `input` y el uso de `agent`.

### Evitar muchas ejecuciones pendientes

Un flujo interactivo puede acumular ejecuciones esperando.

Considera:

- Limitar concurrencia.
- Cancelar ejecuciones obsoletas.
- Añadir expiración.
- Designar responsables.
- Resumir las aprobaciones pendientes en un sistema autorizado.

### Permisos de cancelación

Quien puede cancelar una ejecución también puede impedir que continúe.

Revisa que los permisos de cancelación sean coherentes con la responsabilidad operativa.

## Mensajes y experiencia de revisión

La calidad del mensaje afecta a la calidad de la decisión.

### Mensaje completo

Un mensaje de aprobación debería indicar:

- El propósito de la pausa.
- Qué revisar.
- Dónde encontrar la evidencia.
- Qué implica continuar.
- Cuánto tiempo hay para responder.
- A quién consultar si hay dudas.

### Mensaje demasiado corto

```text
¿Continuar?
```

Este mensaje no identifica qué se está autorizando.

### Mensaje más útil

```text
Revise el resultado de la validación de laboratorio para la revisión indicada en esta ejecución.
Si la comprobación es correcta, confirme para continuar con el siguiente paso no destructivo.
Si falta información, cancele y añada una nota al registro del curso.
```

### Mensaje objetivo

Utiliza lenguaje neutral.

No sugieras que la respuesta correcta es aprobar.

### Botones explícitos

Usa textos que describan la acción:

- `Confirmar revisión`
- `Continuar práctica`
- `Guardar selección`
- `Aprobar etapa`

Evita etiquetas que sean ambiguas fuera de contexto.

### Información para el revisor

Muestra o enlaza, según la política local:

- Commit.
- Rama.
- Resultado de pruebas.
- Informe.
- Artefacto.
- Resumen del cambio.

Comprueba que la persona tiene permiso para ver esos recursos.

### Accesibilidad

Facilita la revisión con:

- Mensajes breves y concretos.
- Instrucciones ordenadas.
- Nombres de etapas descriptivos.
- Opciones distinguibles.
- Evitar depender solo de colores.
- Indicar qué hacer si la información está incompleta.

## Observabilidad y trazabilidad

La ejecución debe explicar qué esperaba Jenkins y qué ocurrió.

### Estados posibles

Una ejecución interactiva puede terminar como:

- Exitosa.
- Fallida.
- Abandonada.
- Abortada.
- Interrumpida por timeout.
- Pendiente de respuesta.

Los nombres exactos y la interfaz pueden variar.

### Distinguir rechazo de timeout

Una elección explícita de `rechazar` es distinta de no recibir respuesta.

Registra ambos estados de forma diferente si el proceso necesita distinguirlos.

### Registrar la decisión sin exponer datos

Una salida como esta puede ser suficiente para una opción no sensible:

```text
Decisión de laboratorio: continuar
```

No registres datos personales adicionales salvo que la política lo requiera.

### Identificar la ejecución

Al documentar una decisión, relaciona el resultado con:

- Job.
- Número de ejecución.
- Commit.
- Rama.
- Etapa.
- Resultado final.

### Ver logs con cautela

La consola puede mostrar:

- Mensajes de entrada.
- Parámetros.
- Nombres de usuarios.
- Datos del repositorio.
- Rutas de workspace.
- Mensajes de plugins.

Revisa el contenido antes de compartirlo.

## Sesiones prácticas para alumnos

Las prácticas utilizan aprobaciones y decisiones que no modifican sistemas externos.

### Preparación general

Antes de las sesiones:

- Utiliza un job de laboratorio.
- Confirma el agente.
- Comprueba quién puede responder.
- No uses credenciales.
- Evita ejecutar ejemplos de producción.
- Anota cada número de ejecución.
- Cancela las ejecuciones pendientes al terminar, según el procedimiento del curso.

### Sesión 1: localizar una entrada pendiente

**Objetivo:** reconocer el estado de una ejecución que espera respuesta.

#### Pipeline de práctica

```groovy
pipeline {
    agent any

    stages {
        stage('Preparar revisión') {
            steps {
                echo 'La salida de laboratorio está lista para revisión.'
            }
        }

        stage('Esperar confirmación') {
            steps {
                input message: 'Confirme que ha revisado la salida de laboratorio.',
                      ok: 'Continuar práctica'
            }
        }

        stage('Después de la confirmación') {
            steps {
                echo 'El pipeline continuó después de la respuesta.'
            }
        }
    }
}
```

#### Instrucciones

1. Ejecuta el job de laboratorio.
2. Espera a que llegue a `Esperar confirmación`.
3. Observa el estado de la ejecución.
4. Localiza el mensaje en la interfaz.
5. Lee el mensaje antes de responder.
6. Confirma la ejecución con el botón correspondiente.
7. Comprueba la etapa posterior.
8. Registra el número de ejecución.

#### Preguntas

- ¿Qué etapa aparece pendiente?
- ¿Qué mensaje muestra la solicitud?
- ¿Qué ocurre antes de que se confirme?
- ¿Qué evidencia demuestra que el pipeline continuó?

### Sesión 2: aprobar una etapa de laboratorio

**Objetivo:** crear una pausa con un propósito explícito.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                echo 'Validación automática de laboratorio completada.'
            }
        }

        stage('Aprobación de práctica') {
            steps {
                input message: 'Revise el mensaje de validación antes de continuar.',
                      ok: 'Confirmar revisión'
            }
        }

        stage('Resultado posterior') {
            steps {
                echo 'La práctica continúa después de la confirmación.'
            }
        }
    }
}
```

#### Instrucciones

1. Comprueba que la etapa de validación aparece antes de la solicitud.
2. Ejecuta el job.
3. Lee la consola.
4. Espera a que aparezca la entrada.
5. Comprueba que la información necesaria está disponible.
6. Confirma.
7. Comprueba el resultado de la última etapa.

#### Entregable

```text
Job:
Ejecución:
Etapa que solicita aprobación:
Mensaje:
Acción elegida:
Resultado final:
```

### Sesión 3: añadir un timeout

**Objetivo:** limitar una espera.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Aprobación con límite') {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    input message: 'Confirme la revisión dentro del tiempo indicado.',
                          ok: 'Confirmar'
                }
            }
        }

        stage('Continuación') {
            steps {
                echo 'La ejecución llegó a la etapa posterior.'
            }
        }
    }
}
```

#### Prueba A: responder a tiempo

1. Inicia una ejecución.
2. Responde antes del límite.
3. Comprueba si llega a `Continuación`.
4. Registra el resultado.

#### Prueba B: no responder

1. Inicia otra ejecución.
2. No respondas durante el periodo de prueba.
3. Observa el resultado cuando venza el límite.
4. Comprueba si la ejecución quedó abortada o interrumpida.
5. Registra el estado mostrado por Jenkins.

#### Preguntas

- ¿Qué resultado tuvo cada prueba?
- ¿El timeout equivale a una aprobación?
- ¿Qué mensaje aparece cuando vence?
- ¿Qué harías con una ejecución pendiente que ya no es necesaria?

### Sesión 4: cancelar una entrada

**Objetivo:** distinguir cancelación de aprobación.

#### Instrucciones

1. Inicia el pipeline de la sesión 1.
2. Espera a que Jenkins solicite confirmación.
3. Utiliza el mecanismo autorizado para cancelar o abortar.
4. Revisa el resultado.
5. Comprueba si la etapa posterior se ejecutó.
6. Registra el estado sin interpretar más de lo que muestra Jenkins.

#### Preguntas

- ¿Qué diferencia hay entre cancelar y confirmar?
- ¿La ejecución terminó como éxito?
- ¿Qué mensaje quedó en consola?
- ¿Qué procedimiento se debe seguir si se cancela una ejecución importante?

### Sesión 5: elegir entre dos opciones

**Objetivo:** recoger una decisión limitada durante el pipeline.

#### Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Elegir formato') {
            steps {
                script {
                    def formato = input(
                        message: 'Seleccione cómo presentar el resumen de laboratorio.',
                        ok: 'Guardar elección',
                        parameters: [
                            choice(
                                name: 'FORMATO',
                                choices: ['breve', 'detallado'],
                                description: 'No cambia recursos externos'
                            )
                        ]
                    )

                    if (formato == 'breve') {
                        echo 'Se eligió un resumen breve.'
                    } else if (formato == 'detallado') {
                        echo 'Se eligió un resumen detallado.'
                    } else {
                        error 'La selección recibida no es válida.'
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Revisa las dos opciones.
2. Inicia el job.
3. Selecciona `breve`.
4. Registra la salida.
5. Inicia otra ejecución.
6. Selecciona `detallado`.
7. Compara ambos resultados.

#### Preguntas

- ¿Qué valor devuelve la entrada en esta práctica?
- ¿Qué lógica se ejecuta con cada opción?
- ¿Por qué hay una rama `else` de error?
- ¿Qué cambiarías si hubiera tres opciones?

### Sesión 6: restringir quién puede responder

**Objetivo:** reconocer que limitar aprobadores requiere configuración y permisos.

#### Preparación

El docente debe proporcionar el identificador de un usuario o grupo de laboratorio.

No inventes el nombre de un grupo.

#### Ejemplo ilustrativo

```groovy
pipeline {
    agent any

    stages {
        stage('Aprobación restringida') {
            steps {
                input message: 'Confirmación de una práctica no destructiva.',
                      ok: 'Confirmar',
                      submitter: 'GRUPO_AUTORIZADO'
            }
        }
    }
}
```

Sustituye `GRUPO_AUTORIZADO` solo con el valor facilitado por el administrador.

#### Instrucciones

1. Comprueba que el grupo o usuario existe.
2. Guarda el cambio en la rama de laboratorio.
3. Ejecuta el job.
4. Comprueba qué personas pueden responder.
5. No intentes modificar permisos para permitirte acceso.
6. Informa al docente si la configuración no coincide con lo esperado.

#### Preguntas

- ¿Qué función cumple `submitter`?
- ¿Crea automáticamente el grupo?
- ¿Qué otros permisos pueden afectar la respuesta?
- ¿Cómo se comprueba quién está autorizado?

### Sesión 7: revisar una solicitud ambigua

**Objetivo:** mejorar el texto de una entrada.

#### Mensaje inicial

```text
¿Seguimos?
```

#### Actividad

Reescribe el mensaje para incluir:

- Qué resultado se ha generado.
- Qué debe revisar la persona.
- Qué significa continuar.
- Qué hacer si falta información.
- Qué etapa se ejecutará después.

#### Comparación

| Elemento | Mensaje inicial | Mensaje mejorado |
|---|---|---|
| Propósito | | |
| Evidencia a revisar | | |
| Acción disponible | | |
| Consecuencia | | |
| Alternativa si hay dudas | | |

### Sesión 8: aprobar después de una validación

**Objetivo:** diseñar un orden que facilite una revisión informada.

#### Secuencia que se debe implementar

```text
Comprobar archivos
       |
       v
Ejecutar validación
       |
       v
Solicitar revisión
       |
       v
Mostrar confirmación
```

#### Actividad

1. Define una etapa de comprobación.
2. Define una etapa de validación.
3. Coloca la entrada después de las dos.
4. Redacta un mensaje que identifique la salida.
5. Añade una etapa posterior inocua.
6. Comprueba el orden en la interfaz.

#### Preguntas

- ¿Por qué no se solicita aprobación antes de ejecutar la validación?
- ¿Qué evidencia puede revisar la persona?
- ¿Qué debería ocurrir si la validación falla?

### Sesión 9: manejar explícitamente una elección

**Objetivo:** garantizar que las opciones tienen una consecuencia clara.

#### Opciones

```text
continuar
cancelar
```

#### Actividad

Diseña una etapa que:

- Solicite una selección.
- Continúe si se elige `continuar`.
- Detenga la ruta si se elige `cancelar`.
- Rechace cualquier valor inesperado.
- Registre el resultado sin datos personales innecesarios.

#### Revisión

Comprueba que:

- `cancelar` no se interpreta como aprobación.
- Una entrada inválida no llega a la etapa posterior.
- El mensaje explica cada opción.
- La consola refleja la decisión.

### Sesión 10: evitar reservar un agente durante la pausa

**Objetivo:** revisar el uso de recursos mientras se espera una respuesta.

#### Actividad

1. Observa un pipeline con agente global.
2. Revisa cuándo aparece la entrada.
3. Consulta, con permiso, si el nodo mantiene un ejecutor ocupado.
4. Revisa la alternativa declarativa con entrada de etapa antes del agente.
5. Compara el diseño sin modificar agentes compartidos.

#### Preguntas

- ¿Por qué una pausa prolongada puede afectar la cola?
- ¿Qué patrón permite separar la entrada de la asignación del agente?
- ¿Qué orden de ejecución debe verificarse?
- ¿Qué limitación de la instancia local podría cambiar el resultado?

### Sesión 11: crear un flujo interactivo de laboratorio

**Objetivo:** combinar validación, elección y continuación sin efectos externos.

#### Requisitos

- Un job autorizado.
- Una ejecución de laboratorio.
- Sin credenciales.
- Una salida de texto no sensible.

#### Flujo propuesto

1. Validar que exista `README.md`.
2. Mostrar un resumen automático.
3. Pedir una aprobación.
4. Pedir una opción de formato.
5. Mostrar el formato seleccionado.
6. Archivar un resultado de texto, si el curso lo requiere.

#### Documento de diseño

```text
Nombre del flujo:
Motivo de la aprobación:
Persona o grupo autorizado:
Tiempo de espera:
Opciones disponibles:
Comportamiento al cancelar:
Comportamiento al vencer:
Datos registrados:
Agente requerido:
Artefacto esperado:
```

### Sesión 12: revisar permisos y seguridad

**Objetivo:** analizar una aprobación antes de usarla en un flujo real.

#### Preguntas de revisión

- ¿Quién puede responder?
- ¿Cómo se verifica su identidad?
- ¿Puede la misma persona proponer y aprobar?
- ¿Qué información ve la persona revisora?
- ¿Qué credenciales están disponibles durante la etapa posterior?
- ¿Qué pasa si se agota el tiempo?
- ¿Qué pasa si se cancela?
- ¿Dónde se conserva el registro?
- ¿Cómo se revisa el código de la rama?

#### Entregable

Escribe una lista breve de controles necesarios.

No incluyas nombres reales, datos de acceso ni detalles internos en documentos públicos.

### Sesión 13: diagnosticar una ejecución pendiente

**Objetivo:** resolver de forma ordenada una espera sin respuesta.

#### Registro inicial

```text
Job:
Ejecución:
Etapa pendiente:
Mensaje:
Persona o grupo esperado:
Tiempo transcurrido:
Timeout configurado:
Estado del agente:
```

#### Actividad

1. Confirma que la ejecución está esperando `input`.
2. Verifica quién puede responder.
3. Comprueba si la entrada ha vencido.
4. Evita iniciar ejecuciones duplicadas sin revisar las existentes.
5. Consulta al responsable si no hay una persona asignada.
6. Cancela únicamente según el procedimiento autorizado.

### Sesión 14: revisión por parejas

**Objetivo:** revisar la claridad de un pipeline interactivo.

#### Una persona presenta

- Motivo de la entrada.
- Persona autorizada.
- Tiempo de espera.
- Opciones.
- Resultado de cada respuesta.

#### La otra persona revisa

- Mensajes ambiguos.
- Opciones no implementadas.
- Ausencia de timeout.
- Permisos demasiado amplios.
- Reserva innecesaria de agentes.
- Datos sensibles.
- Continuación tras un rechazo.

#### Resultado

Entrega:

- Una observación positiva.
- Un riesgo.
- Una mejora concreta.
- Una pregunta que la documentación debería responder.

## Diagnóstico de problemas

Los problemas de interacción suelen estar relacionados con permisos, estado pendiente, timeout o lógica de respuesta.

### El pipeline no muestra una entrada

Comprueba:

- Que la ejecución alcanzó la etapa correspondiente.
- Que una etapa anterior no falló.
- Que una condición `when` no omitió la etapa.
- Que el `input` está en el bloque correcto.
- Que se ejecuta la versión esperada del `Jenkinsfile`.
- Que el tipo de job admite el patrón utilizado.

### La persona no puede responder

Comprueba:

- Quién está autenticado.
- El valor configurado en `submitter`.
- El identificador del grupo.
- Los permisos globales.
- Los permisos del job.
- El estado de la ejecución.
- Si la entrada ya venció o fue cancelada.

No cambies permisos compartidos sin autorización.

### La ejecución queda pendiente indefinidamente

Comprueba:

- Si se configuró un timeout.
- Quién es responsable de responder.
- Si la notificación llegó.
- Si la ejecución sigue siendo necesaria.
- Si hay una política de cancelación.
- Si el pipeline reserva un agente.

### El timeout aparece como aborto

Un timeout puede provocar una interrupción o aborto.

Comprueba el estado y el log.

No lo describas como una aprobación denegada si no hubo una respuesta explícita.

### La etapa posterior no se ejecuta

Comprueba:

- Si se confirmó la entrada.
- Si la respuesta terminó con error.
- Si el pipeline fue cancelado.
- Si hubo timeout.
- Si otra condición omitió la etapa.
- Si la ejecución tiene un fallo anterior.

### No se reconoce el valor elegido

Comprueba:

- Nombre del parámetro de entrada.
- Número de valores solicitados.
- Tipo de retorno del paso.
- Espacios o diferencias de mayúsculas.
- Versión del plugin.
- Rama que contiene el código.
- Valor comparado en la lógica.

Para prácticas, empieza con un único parámetro de selección.

### Respuesta de `input` con varios parámetros

El valor devuelto puede ser una estructura en vez de una cadena simple.

Comprueba la documentación del paso en la versión local.

Evita tratar un mapa como si fuera el valor de una sola selección.

### Error de sintaxis en la entrada declarativa

Comprueba:

- Llaves.
- Ubicación de `input`.
- Orden declarativo.
- Versión de Jenkins.
- Plugins requeridos.
- Campos admitidos.

Compara con un ejemplo compatible con la instancia.

### El grupo no restringe como se esperaba

Comprueba:

- Nombre exacto del grupo.
- Plugin de autorización.
- Formato de usuario o grupo.
- Permisos de la ejecución.
- Configuración de seguridad.
- Si el usuario puede responder por otra regla general.

Consulta al administrador.

### El mensaje no contiene la información esperada

Comprueba:

- Que la etapa genera el informe antes del `input`.
- Que la referencia al artefacto es válida.
- Que la persona tiene permiso para verlo.
- Que el commit indicado es el de la ejecución actual.
- Que el mensaje no muestra datos sensibles.

### Agente ocupado durante la espera

Comprueba:

- Si el pipeline tiene un agente global.
- Si la etapa de entrada tiene un agente propio.
- Si la entrada está dentro de `steps`.
- Si el agente puede liberarse en el patrón utilizado.
- Si la ejecución ocupa un ejecutor.

No cambies la configuración global del nodo para resolver una única espera.

### Diferencia entre cancelar y rechazar

Una persona puede cancelar la ejecución o seleccionar una opción explícita de rechazo.

Esos eventos no son necesariamente equivalentes.

Si la distinción importa, registra cada caso de forma separada.

## Buenas prácticas

### Automatizar antes de solicitar aprobación

Ejecuta primero las comprobaciones que Jenkins puede realizar automáticamente.

Solicita la revisión después de generar evidencia útil.

### Limitar quién responde

Usa un grupo o usuario autorizado cuando el proceso lo requiera.

Comprueba que la configuración realmente restringe la respuesta.

### Añadir un timeout razonable

Las ejecuciones no deberían permanecer pendientes sin límite si el proceso requiere una decisión en un plazo definido.

### Definir una respuesta segura al timeout

Una espera vencida no debería continuar como si alguien hubiera aprobado.

### Explicar la consecuencia

La persona debe entender qué ocurrirá al confirmar y qué opción usar si no está de acuerdo.

### Evitar credenciales en la entrada

No pidas secretos mediante `input`.

### Evitar campos abiertos para decisiones cerradas

Usa opciones limitadas para alternativas conocidas.

### Registrar lo necesario

Conserva información suficiente para reconstruir la decisión, pero evita recopilar datos personales innecesarios.

### Evitar pausas prolongadas con agente asignado

Diseña el punto de entrada para no ocupar recursos durante una espera larga.

Verifica el orden de asignación del agente en la versión local.

### Probar todos los resultados

Prueba:

- Confirmación.
- Rechazo, si existe.
- Cancelación.
- Timeout.
- Valor inválido.
- Fallo de una etapa anterior.

### Revisar código y permisos

Un `Jenkinsfile` puede cambiar quién aprueba y qué ocurre después.

Revisa sus cambios mediante el procedimiento del equipo.

## Errores de diseño frecuentes

### Aprobar sin saber qué se autoriza

Un mensaje como `¿Continuar?` no explica el contexto.

### Entrada sin responsable

Si nadie sabe quién debe responder, la ejecución puede quedar esperando.

### Sin timeout ni limpieza

Las ejecuciones pendientes pueden acumularse y confundir a quienes revisan el job.

### Timeout que continúa automáticamente

Continuar al vencer el tiempo puede equivaler a aprobar sin revisión.

### Solicitar una contraseña en `input`

La entrada interactiva no es un almacén de credenciales.

### Mostrar una opción que no se implementa

Cada opción debe tener un resultado definido.

### Tratar cualquier respuesta como aprobación

Valida el resultado y define qué hace cada opción.

### Poner la entrada después de una etapa irreversible

La aprobación debe ocurrir antes de la acción que pretende controlar.

### Mantener un agente ocupado durante días

Una espera prolongada puede reservar capacidad innecesariamente.

### Depender de una sola persona ausente

Define un grupo o un suplente autorizado según la política del equipo.

### Registrar demasiado

No guardes información personal o sensible que no se necesite para auditar.

### Confundir aprobación con éxito técnico

Un paso manual no reemplaza las pruebas automáticas.

## Checklist de revisión

### Diseño

- [ ] La interacción tiene un propósito claro.
- [ ] La validación automática ocurre antes de la revisión cuando corresponde.
- [ ] El mensaje explica qué se debe revisar.
- [ ] Cada opción tiene una consecuencia definida.
- [ ] Cancelación y timeout están contemplados.
- [ ] La ejecución no continúa si no hay aprobación necesaria.

### Personas y permisos

- [ ] Se sabe quién puede responder.
- [ ] El grupo o usuario existe.
- [ ] Los permisos están limitados.
- [ ] La separación de funciones se ha considerado.
- [ ] La persona puede acceder a la evidencia necesaria.
- [ ] El control coincide con la política del equipo.

### Recursos

- [ ] Se ha considerado si la pausa ocupa un ejecutor.
- [ ] El agente se asigna en el momento adecuado.
- [ ] Hay una política para ejecuciones pendientes.
- [ ] El timeout es razonable.
- [ ] No se inician ejecuciones duplicadas sin necesidad.

### Seguridad

- [ ] No se solicitan secretos mediante `input`.
- [ ] El mensaje no expone información sensible.
- [ ] La rama que define el pipeline es de confianza adecuada.
- [ ] Las credenciales se limitan a las etapas necesarias.
- [ ] Los logs se revisan antes de compartirlos.

### Trazabilidad

- [ ] Se conoce el job y número de ejecución.
- [ ] Se puede identificar la rama y el commit.
- [ ] La decisión queda asociada a la ejecución.
- [ ] Se distingue aprobación, rechazo, cancelación y timeout.
- [ ] Se registra solo la información necesaria.

## Preguntas de repaso

1. ¿Qué es una pausa interactiva en Jenkins?
2. ¿Qué diferencia hay entre un parámetro inicial y una entrada durante la ejecución?
3. ¿Para qué sirve el paso `input`?
4. ¿Qué información debe incluir un mensaje de aprobación?
5. ¿Qué puede controlar el campo `submitter`?
6. ¿Qué limitaciones deben revisarse antes de usar `submitterParameter`?
7. ¿Qué función cumple `timeout`?
8. ¿Por qué un timeout no debe interpretarse como aprobación?
9. ¿Qué diferencia hay entre cancelar y rechazar?
10. ¿Por qué es importante no reservar un agente durante una espera larga?
11. ¿Qué opciones son candidatas a una lista `choice`?
12. ¿Por qué una aprobación no sustituye las pruebas automáticas?
13. ¿Qué debería revisar una persona antes de confirmar?
14. ¿Qué información ayuda a auditar una decisión?
15. ¿Por qué no se deben pedir secretos con `input`?
16. ¿Qué puede ocurrir si una etapa anterior falla?
17. ¿Qué revisarías si la entrada no aparece?
18. ¿Qué puede causar que una persona no esté autorizada a responder?
19. ¿Cómo evitarías una aprobación ambigua?
20. ¿Qué tratamiento darías a una ejecución pendiente obsoleta?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Un pipeline interactivo combina automatización con una decisión humana».

### Afirmación 2

«Un parámetro del job y una entrada `input` siempre se solicitan en el mismo momento».

### Afirmación 3

«El mensaje de una aprobación debería explicar qué se revisa».

### Afirmación 4

«Un timeout equivale a una aprobación si no hay respuesta».

### Afirmación 5

«`submitter` puede limitar quién responde, según la configuración».

### Afirmación 6

«Un nombre de grupo escrito en el pipeline crea automáticamente ese grupo».

### Afirmación 7

«Las opciones limitadas son preferibles a ejecutar texto libre como comando».

### Afirmación 8

«Una aprobación humana demuestra que las pruebas técnicas pasaron».

### Afirmación 9

«Una pausa puede mantener un agente ocupado, según el diseño».

### Afirmación 10

«Una ejecución cancelada y una aprobación denegada siempre son el mismo estado».

### Afirmación 11

«Una entrada interactiva es un lugar apropiado para solicitar una clave privada».

### Afirmación 12

«Debe definirse qué ocurre cuando una solicitud de entrada vence».

### Afirmación 13

«Un mensaje de aprobación debe indicar qué ocurrirá al continuar».

### Afirmación 14

«Un pipeline que solicita una aprobación no necesita revisar quién puede modificar el `Jenkinsfile`».

### Afirmación 15

«La identidad de quien responde puede ser útil para la trazabilidad».

## Respuestas orientativas

### Afirmación 1

**Correcta.** Esa es la idea central de la interacción.

### Afirmación 2

**Incorrecta.** Los parámetros iniciales se proporcionan al iniciar; `input` se solicita durante el flujo.

### Afirmación 3

**Correcta.** La persona necesita contexto para decidir.

### Afirmación 4

**Incorrecta.** La falta de respuesta no constituye una aprobación.

### Afirmación 5

**Correcta.** Depende de Jenkins, plugins y permisos.

### Afirmación 6

**Incorrecta.** El grupo debe existir en el sistema de identidad configurado.

### Afirmación 7

**Correcta.** Una lista cerrada limita entradas inesperadas.

### Afirmación 8

**Incorrecta.** La aprobación humana no sustituye la evidencia técnica.

### Afirmación 9

**Correcta.** El efecto depende de la ubicación de la entrada y del agente.

### Afirmación 10

**Incorrecta.** Son situaciones diferentes, aunque la interfaz varíe.

### Afirmación 11

**Incorrecta.** Los secretos deben gestionarse con el almacén de credenciales aprobado.

### Afirmación 12

**Correcta.** El pipeline necesita un comportamiento definido ante el vencimiento.

### Afirmación 13

**Correcta.** La consecuencia debe ser comprensible.

### Afirmación 14

**Incorrecta.** El `Jenkinsfile` controla el flujo y también debe revisarse.

### Afirmación 15

**Correcta.** Puede ayudar a reconstruir quién tomó una decisión.

## Plantilla de diseño de una entrada

Completa esta ficha antes de añadir `input`:

```text
Nombre del job:
Etapa que solicita la entrada:
Motivo:
Evidencia disponible:
Mensaje:
Texto del botón:
Persona o grupo autorizado:
Opciones:
Qué significa cada opción:
Timeout:
Comportamiento al vencer:
Comportamiento al cancelar:
Agente asignado durante la espera:
Datos registrados:
Responsable de revisar:
```

No incluyas contraseñas, tokens ni datos personales innecesarios.

## Glosario

- **Aprobación:** respuesta autorizada que permite continuar un flujo.
- **Entrada interactiva:** solicitud de respuesta durante una ejecución.
- **Parámetro inicial:** valor proporcionado al iniciar un job.
- **`input`:** paso o directiva que pausa el pipeline para recibir una respuesta.
- **`submitter`:** campo que puede restringir quién responde a una entrada.
- **`submitterParameter`:** campo que puede registrar la identidad de quien respondió, según la configuración.
- **`timeout`:** límite de tiempo para una operación o bloque.
- **Ejecución pendiente:** ejecución que espera una respuesta u otro recurso.
- **Abortada:** ejecución detenida antes de finalizar normalmente.
- **Agente:** sistema donde se ejecutan pasos del pipeline.
- **Ejecutor:** capacidad de un nodo para ejecutar trabajo.
- **Trazabilidad:** capacidad de relacionar una decisión con una ejecución, revisión y resultado.
- **Autorización:** permiso para realizar una acción.
- **Separación de responsabilidades:** distribución de funciones para evitar que una sola persona controle todos los pasos.
- **Opción cerrada:** valor elegido de una lista limitada y definida.
- **Revisión manual:** inspección humana de información antes de una decisión.

## Síntesis final

Un pipeline interactivo debe detenerse solo cuando la intervención humana aporta una decisión necesaria.

- Usa parámetros iniciales para valores conocidos antes de comenzar.
- Usa `input` cuando la respuesta depende de resultados obtenidos durante la ejecución.
- Escribe mensajes claros y explica las consecuencias.
- Limita quién puede aprobar cuando el proceso lo requiera.
- Define qué ocurre ante timeout, rechazo y cancelación.
- No trates la falta de respuesta como aprobación.
- Evita mantener agentes ocupados durante pausas prolongadas.
- No solicites secretos por medio de entradas interactivas.
- Registra decisiones de forma útil y proporcionada.
- Mantén las pruebas automáticas y la revisión humana como controles distintos.