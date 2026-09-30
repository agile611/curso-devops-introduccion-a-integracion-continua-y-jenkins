# Pipeline distribuido de Jenkins

Un pipeline distribuido reparte etapas o tareas entre varios agentes de Jenkins. El controlador coordina el flujo y asigna trabajo; cada agente ejecuta los pasos que le corresponden en su propio entorno. Esto permite usar distintos sistemas operativos, separar tareas, aprovechar recursos disponibles y ejecutar validaciones independientes en paralelo.

La distribución requiere más que añadir agentes: hay que decidir qué ejecuta cada uno, cómo se comparten archivos, qué etiquetas se solicitan, cuánta concurrencia es segura y qué permisos necesita cada tarea. Esta documentación desarrolla esos conceptos mediante ejemplos declarativos y sesiones prácticas para un laboratorio.

> **Uso seguro:** practica únicamente en una instancia, repositorio y agentes autorizados. Los ejemplos no despliegan a producción ni requieren credenciales. Trata cualquier `Jenkinsfile` como código ejecutable y no incluyas secretos en archivos, parámetros, comandos o logs.

## Esquema de la página

- ## Fundamentos del pipeline distribuido
  - ### Qué significa distribuir un pipeline
  - ### Controlador, agente, nodo y ejecutor
  - ### Cuándo conviene distribuir
  - ### Qué no resuelve la distribución
- ## Diseño de la ejecución
  - ### Agente global y agente por etapa
  - ### Etiquetas y selección
  - ### Concurrencia y recursos
  - ### Orden, dependencias y paralelismo
- ## Transferencia de archivos
  - ### Workspace
  - ### `stash` y `unstash`
  - ### Artefactos
  - ### Cachés y almacenamiento externo
- ## Implementación declarativa
  - ### `agent none`
  - ### Etapas en agentes distintos
  - ### Etapas paralelas
  - ### Manejo de fallos y resultados
- ## Seguridad y operación
  - ### Permisos y confianza
  - ### Red y credenciales
  - ### Aislamiento y limpieza
  - ### Observabilidad y diagnóstico
- ## Sesiones prácticas
  - ### Inspeccionar agentes
  - ### Ejecutar en dos agentes
  - ### Compartir archivos
  - ### Probar paralelismo
  - ### Diagnosticar fallos
- ## Evaluación
  - ### Checklist
  - ### Preguntas
  - ### Glosario
  - ### Síntesis

## Fundamentos del pipeline distribuido

Un pipeline distribuido coordina trabajo que se ejecuta en uno o más agentes, posiblemente en sistemas distintos.

### Qué significa distribuir un pipeline

En un pipeline local sencillo, todas las etapas pueden ejecutarse en el mismo agente.

En un pipeline distribuido, distintas etapas pueden ejecutarse en distintos agentes.

Un agente puede ser:

- Una máquina Linux.
- Una máquina Windows.
- Una máquina virtual.
- Un contenedor.
- Un nodo temporal creado por una plataforma.
- Un sistema dedicado a una herramienta concreta.

El controlador decide qué tareas iniciar y dónde ejecutarlas, según la definición del pipeline y los agentes disponibles.

### Ejemplo conceptual

```text
Controlador Jenkins
    |
    +--> Agente Linux: checkout y validación
    |
    +--> Agente Windows: pruebas de compatibilidad
    |
    +--> Agente Linux: preparación del resultado
```

El diagrama representa un flujo posible.

La arquitectura real depende de la instancia, sus etiquetas y sus reglas de red.

### Controlador

El controlador es el componente central de Jenkins.

Puede encargarse de:

- Recibir solicitudes de ejecución.
- Leer la configuración del job.
- Programar etapas.
- Buscar agentes compatibles.
- Administrar la interfaz.
- Registrar resultados.
- Mantener la configuración de jobs.
- Coordinar el uso de ejecutores.

El controlador no tiene que ejecutar todos los comandos del pipeline.

### Agente y nodo

Un **nodo** es una máquina o entorno que Jenkins conoce.

Un **agente** es el proceso que permite ejecutar tareas en ese nodo y comunicarse con Jenkins.

En conversaciones habituales se usan ambos términos de forma intercambiable.

Para diagnosticar, conviene distinguir:

- Nodo: el sistema o entorno.
- Agente: el proceso de Jenkins asociado.
- Ejecutor: capacidad de ejecutar una tarea en ese nodo.
- Workspace: directorio de trabajo de una ejecución.

### Ejecutor

Un ejecutor representa capacidad de ejecución en un nodo.

Si un nodo tiene ejecutores disponibles, Jenkins puede asignarle trabajo.

Un ejecutor ocupado no puede aceptar otro trabajo, salvo que existan más ejecutores y recursos suficientes.

Aumentar ejecutores no garantiza más rapidez.

Los trabajos concurrentes compiten por:

- CPU.
- Memoria.
- Disco.
- Red.
- Servicios externos.
- Espacio de workspace.

### Workspace

El workspace es el directorio donde una ejecución trabaja en un agente.

Puede contener:

- Código obtenido desde un repositorio.
- Archivos temporales.
- Resultados de pruebas.
- Paquetes.
- Logs.
- Dependencias.
- Datos generados durante la ejecución.

El workspace de un agente no debe considerarse almacenamiento compartido entre todos los agentes.

### El controlador coordina; los agentes ejecutan

En una arquitectura distribuida:

- El controlador interpreta el flujo.
- Jenkins asigna etapas a agentes compatibles.
- El agente ejecuta los pasos.
- Los resultados vuelven a Jenkins.
- Los siguientes pasos esperan a que se cumplan sus dependencias.

El código de un paso se ejecuta en el agente elegido para ese paso.

### Cuándo conviene distribuir

Distribuir puede ser útil cuando:

- El proyecto debe probarse en varios sistemas operativos.
- Las tareas independientes pueden ejecutarse en paralelo.
- Un agente no tiene todas las herramientas necesarias.
- Hay que aislar tareas de distinta confianza.
- El controlador debe quedar dedicado a coordinar.
- El trabajo puede repartir carga entre varios nodos.
- Una etapa necesita hardware o software específico.

### Cuándo no aporta valor

Puede no convenir distribuir si:

- El pipeline tiene una sola tarea pequeña.
- La transferencia de archivos cuesta más que la ejecución.
- Los agentes disponibles son escasos.
- Las etapas dependen mucho unas de otras.
- La administración adicional no se justifica.
- No existe una necesidad de aislamiento o compatibilidad.

La distribución añade puntos que se deben configurar, mantener y diagnosticar.

### Qué no resuelve la distribución

Añadir agentes no garantiza automáticamente que:

- Los trabajos terminen antes.
- Los nodos tengan las herramientas requeridas.
- Los archivos pasen de un agente a otro.
- Las credenciales estén protegidas.
- Los agentes sean compatibles entre sí.
- El pipeline sea reproducible.
- Los resultados se conserven.
- La red permita alcanzar cualquier servicio.

Cada requisito debe diseñarse y verificarse.

### Distribución frente a paralelismo

**Distribución** significa que tareas se ejecutan en diferentes agentes.

**Paralelismo** significa que tareas independientes se ejecutan al mismo tiempo.

Un pipeline puede ser distribuido sin ejecutar etapas en paralelo.

Un pipeline puede ejecutarse en paralelo sobre un único nodo con varios ejecutores.

La instancia debe disponer de recursos para que el paralelismo sea efectivo.

## Diseño de la ejecución

El diseño define qué agente ejecuta cada etapa y qué dependencias existen entre ellas.

### Agente global

Un agente global se declara en el bloque principal.

Ejemplo:

```groovy
pipeline {
    agent any

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
}
```

Las etapas heredan el contexto del agente global, salvo que se defina una configuración distinta.

Este patrón puede ser sencillo si todas las tareas necesitan el mismo entorno.

### Agente global con etiqueta

```groovy
pipeline {
    agent {
        label 'linux-laboratorio'
    }

    stages {
        stage('Validar') {
            steps {
                sh 'uname -s'
            }
        }
    }
}
```

La etiqueta debe existir y representar una capacidad real.

No inventes etiquetas ni uses una de producción en una práctica.

### Agente por etapa

Un pipeline puede escoger un agente diferente para cada etapa.

Esto sirve cuando:

- Una etapa requiere Linux.
- Otra requiere Windows.
- Una etapa necesita una herramienta particular.
- Se necesita separar trabajo de distinta confianza.

La declaración de cada agente debe corresponder a una etiqueta existente.

### Usar `agent none`

`agent none` evita reservar un agente para todo el pipeline.

Cada etapa que ejecute trabajo deberá solicitar su propio agente.

Ejemplo:

```groovy
pipeline {
    agent none

    stages {
        stage('Validar en Linux') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                sh 'echo "Validación en Linux"'
            }
        }
    }
}
```

Este patrón puede reducir el tiempo durante el que un agente queda reservado.

También obliga a pensar dónde se ejecuta cada paso.

### Selección del agente

Jenkins selecciona un agente según condiciones como:

- Etiqueta solicitada.
- Estado conectado.
- Ejecutor disponible.
- Restricciones del job.
- Configuración de la instancia.
- Capacidad requerida.

Un agente desconectado no ejecutará la etapa hasta volver a estar disponible.

### Etiquetas

Las etiquetas describen nodos o capacidades.

Ejemplos ilustrativos:

```text
linux
windows
docker
laboratorio
pruebas
```

Una etiqueta útil debe tener un significado claro para quienes mantienen los jobs.

Por ejemplo:

- `linux-laboratorio`: Linux de práctica.
- `windows-pruebas`: Windows con herramientas de pruebas.
- `contenedor-builder`: entorno autorizado para construir contenedores.

Los nombres reales deben confirmarse con el administrador.

### Etiquetas compartidas

Una etiqueta puede pertenecer a varios agentes.

Jenkins podría asignar la etapa a cualquiera de los agentes compatibles que esté disponible.

Si varios nodos comparten una etiqueta, intenta que sus capacidades sean coherentes.

Por ejemplo, los agentes con la etiqueta `linux-con-git` deberían disponer de Git en una versión compatible con los jobs que la solicitan.

### Etiquetas demasiado específicas

Una etiqueta asociada a un solo agente puede hacer que el pipeline dependa de ese nodo.

Si el nodo se desconecta, la etapa puede quedar en cola.

Usa una etiqueta específica cuando exista una necesidad concreta, como hardware o una herramienta exclusiva.

Documenta esa dependencia.

### Orden entre etapas

Las etapas dentro de `stages` se ejecutan en el orden declarado, salvo que se configure paralelismo.

El orden debería representar dependencias reales.

Ejemplo:

```text
Validar archivos
       |
       v
Ejecutar pruebas
       |
       v
Preparar artefacto
```

No prepares una salida que dependa de una validación antes de ejecutar esa validación.

### Dependencias entre etapas

Antes de separar etapas en agentes distintos, identifica:

- Qué datos produce cada etapa.
- Qué etapa consume esos datos.
- Si se necesita compartir el workspace.
- Si basta con volver a obtener el código.
- Si hay que transferir un artefacto.
- Si el estado debe persistir.
- Qué ocurre si una etapa falla.

### Concurrencia y capacidad

Varios agentes pueden ejecutar trabajo simultáneamente.

La capacidad real depende de:

- Ejecutores disponibles.
- CPU y memoria.
- Velocidad de disco.
- Conexión de red.
- Límites de servicios externos.
- Concurrencia segura del proyecto.

Un pipeline distribuido puede seguir esperando si no hay ejecutores disponibles.

### Aumentar ejecutores con criterio

Antes de aumentar ejecutores, revisa:

- Uso de CPU.
- Memoria disponible.
- Espacio en disco.
- Duración de la cola.
- Duración de las tareas.
- Conflictos entre jobs.
- Capacidad de los servicios de prueba.

Más ejecutores pueden saturar el nodo y empeorar el tiempo de todas las ejecuciones.

### Concurrencia de pipelines

Varias ejecuciones de un mismo pipeline también pueden coincidir.

Esto puede causar problemas si modifican:

- El mismo entorno de prueba.
- Un directorio compartido.
- Datos comunes.
- Un servicio que solo admite una operación.
- Un recurso con nombre fijo.

Evalúa si hace falta limitar ejecuciones simultáneas.

### Distribuir por capacidad

El agente debe tener la capacidad que exige la etapa.

Por ejemplo:

- Linux para una validación Bash.
- Windows para probar una herramienta exclusiva de Windows.
- Agente con Git para obtener el repositorio.
- Agente autorizado con Docker para tareas de contenedores.

No elijas una etiqueta solo por su nombre.

### Distribuir por nivel de confianza

También puede convenir separar trabajos por riesgo:

- Código revisado y confiable.
- Ramas de desarrollo.
- Cambios externos no revisados.
- Pruebas que usan credenciales.
- Tareas de publicación.

No permitas que todo job acceda automáticamente a los mismos agentes y secretos.

## Transferencia de archivos

Los workspaces pertenecen a los agentes. Una etapa que cambia de agente no debe asumir que encontrará los archivos anteriores.

### El workspace no es necesariamente compartido

Cada agente puede tener su propio directorio.

Incluso dos etapas ejecutadas en agentes con la misma etiqueta podrían utilizar nodos distintos.

No asumas que un archivo generado en un agente aparecerá en otro.

### Volver a obtener el código

Una opción es que cada etapa ejecute su propio checkout desde el repositorio.

Puede ser adecuado cuando:

- El repositorio es accesible.
- La revisión es la misma.
- El checkout no es costoso.
- El resultado intermedio no contiene cambios generados que se necesiten.

Asegura que las etapas procesan el mismo commit.

### `stash` y `unstash`

`stash` guarda archivos de una ejecución para recuperarlos más adelante dentro del mismo pipeline.

`unstash` recupera esos archivos en otro workspace de esa ejecución.

Ejemplo conceptual:

```groovy
stash name: 'fuentes',
      includes: 'app/**,scripts/**'
```

Luego, en otra etapa:

```groovy
unstash 'fuentes'
```

La sintaxis de patrones sigue las reglas de Jenkins y puede requerir ajustes.

### Cuándo usar `stash`

Puede convenir para:

- Transferir archivos pequeños entre etapas.
- Compartir una salida temporal dentro de una ejecución.
- Pasar código generado de una etapa a otra.
- Evitar volver a descargar un conjunto pequeño de archivos.

### Límites de `stash`

`stash` no es un sistema general de almacenamiento permanente.

Puede no ser apropiado para:

- Archivos muy grandes.
- Retención prolongada.
- Distribución entre varios pipelines.
- Almacenamiento de productos de larga vida.
- Compartir datos entre jobs no relacionados.

Para esos casos, utiliza el sistema de artefactos aprobado.

### Definir el contenido de un stash

Limita el patrón de archivos a lo necesario.

Por ejemplo:

```groovy
stash name: 'proyecto',
      includes: 'app/**,scripts/**,README.md'
```

Evita incluir archivos sensibles o grandes sin necesidad.

### Excluir datos innecesarios

Si el patrón lo requiere, puedes excluir carpetas que no sean necesarias, como el historial local de Git.

Confirma la sintaxis con la versión y la documentación de la instancia.

No incluyas carpetas con credenciales o datos privados.

### Nombres de stash

El nombre debe explicar su contenido.

Ejemplos:

```text
fuentes
resultado-validacion
paquete-prueba
```

Evita nombres ambiguos como:

```text
tmp
datos
cosa
```

### `unstash` en un agente distinto

Al ejecutar `unstash`, los archivos se materializan en el workspace de la etapa actual.

El workspace de origen y el workspace de destino pueden ser diferentes.

Por eso, utiliza rutas relativas coherentes.

### Archivar un artefacto

`archiveArtifacts` conserva archivos asociados a una ejecución de Jenkins, según la configuración de retención.

Ejemplo:

```groovy
archiveArtifacts artifacts: 'salida/resultado.txt',
                 fingerprint: true
```

El patrón tiene que coincidir con un archivo que exista.

### Diferencia entre `stash` y artefacto

- `stash`: transferencia temporal dentro de la misma ejecución.
- `archiveArtifacts`: conservación de archivos asociados al resultado de una ejecución.
- Sistema externo de artefactos: almacenamiento y distribución según la plataforma de la organización.

No uses un artefacto archivado como sustituto de una transferencia entre etapas si el diseño requiere `stash`.

### Cachés

Una caché conserva datos reutilizables para acelerar trabajos.

Puede incluir:

- Dependencias.
- Capas de contenedor.
- Resultados de compilación.
- Descargas.

Las cachés requieren una política para:

- Evitar datos obsoletos.
- Reducir contaminación entre proyectos.
- Controlar el espacio.
- Limitar acceso entre jobs.
- Mantener reproducibilidad.

### Transferir resultados grandes

Para paquetes grandes, utiliza la plataforma aprobada por el curso o la organización.

Antes de transferir:

- Identifica el tamaño.
- Comprueba la retención.
- Comprueba permisos.
- Registra versión y origen.
- No uses workspaces compartidos como almacenamiento permanente.

## Implementación declarativa

Los ejemplos de esta sección muestran patrones de distribución con agentes distintos.

### Pipeline básico en dos etapas

Este ejemplo asigna una etapa a un agente Linux y otra a un agente Windows.

Las etiquetas son ilustrativas y deben sustituirse por las etiquetas autorizadas.

```groovy
pipeline {
    agent none

    stages {
        stage('Comprobación Linux') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                sh 'echo "Ejecutado en Linux"'
                sh 'uname -s'
            }
        }

        stage('Comprobación Windows') {
            agent {
                label 'windows-laboratorio'
            }

            steps {
                bat 'echo Ejecutado en Windows'
                bat 'ver'
            }
        }
    }
}
```

Las etapas se ejecutan una después de otra.

No hay transferencia de archivos en este ejemplo.

### Qué comprueba el ejemplo

El pipeline demuestra que:

- `agent none` evita elegir un agente global.
- Cada etapa solicita su propio agente.
- `sh` se utiliza para comandos de shell Unix.
- `bat` se utiliza para comandos de Windows.
- Las etiquetas deben existir.
- Los agentes deben estar conectados.

### Qué no comprueba el ejemplo

No demuestra que:

- Se haya compartido un workspace.
- Se haya obtenido código desde Git.
- Los agentes sean idénticos.
- Las herramientas del proyecto estén instaladas.
- Haya un artefacto permanente.
- La configuración sea adecuada para producción.

### Pipeline con `stash` y `unstash`

El ejemplo siguiente obtiene archivos en Linux, los guarda en un stash y los recupera en otro agente.

La práctica requiere que el repositorio y el agente estén configurados.

```groovy
pipeline {
    agent none

    stages {
        stage('Obtener y preparar fuentes') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                checkout scm
                sh 'test -f README.md'

                stash name: 'fuentes-practica',
                      includes: 'README.md,app/**,scripts/**'
            }
        }

        stage('Validar en otro agente') {
            agent {
                label 'linux-pruebas'
            }

            steps {
                unstash 'fuentes-practica'
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
            }
        }
    }
}
```

### Requisitos del ejemplo

El ejemplo presupone:

- Un job configurado para usar control de versiones.
- Agentes con las etiquetas indicadas.
- Un repositorio que contenga los archivos esperados.
- Permiso de lectura para el checkout.
- Un patrón de `stash` que incluya lo necesario.

### Por qué volver a comprobar los archivos

`unstash` debería materializar los archivos guardados.

La comprobación posterior confirma que la etapa receptora dispone de las entradas que necesita.

Esta validación hace más claros los errores de transferencia.

### Pipeline con paralelismo distribuido

Las etapas paralelas pueden ejecutarse en agentes distintos.

Cada rama paralela debería ser independiente.

```groovy
pipeline {
    agent none

    stages {
        stage('Validaciones paralelas') {
            parallel {
                stage('Prueba Linux') {
                    agent {
                        label 'linux-laboratorio'
                    }

                    steps {
                        checkout scm
                        sh 'test -f README.md'
                        sh 'echo "Validación Linux terminada"'
                    }
                }

                stage('Prueba Windows') {
                    agent {
                        label 'windows-laboratorio'
                    }

                    steps {
                        checkout scm
                        bat 'if exist README.md (echo README encontrado)'
                    }
                }
            }
        }
    }
}
```

### Condiciones para paralelizar

Comprueba que las ramas:

- No escriben sobre los mismos recursos.
- No alteran datos compartidos.
- Pueden ejecutarse al mismo tiempo.
- Tienen agentes disponibles.
- Producen resultados que se pueden identificar.
- Utilizan la misma revisión del código.

### Checkout dentro de cada rama

En el ejemplo, cada rama obtiene el código por separado.

Eso puede ser aceptable para un repositorio pequeño.

En un proyecto real, comprueba que ambas ramas obtienen el mismo commit y que repetir el checkout no crea un coste excesivo.

### Evitar colisiones de nombres

Si varias ramas paralelas producen archivos, utiliza rutas o nombres distintos.

Por ejemplo:

```text
salida/linux/
salida/windows/
```

Evita que ambas ramas escriban en un mismo archivo compartido.

### Pipeline integrado: preparación, pruebas y archivado

Este ejemplo prepara un archivo en Linux, lo transfiere y lo archiva.

```groovy
pipeline {
    agent none

    stages {
        stage('Preparar') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                checkout scm
                sh 'test -f app/mensaje.txt'
                sh 'mkdir -p salida'
                sh 'cp app/mensaje.txt salida/mensaje.txt'

                stash name: 'salida-practica',
                      includes: 'salida/mensaje.txt'
            }
        }

        stage('Comprobar salida') {
            agent {
                label 'linux-pruebas'
            }

            steps {
                unstash 'salida-practica'
                sh 'test -s salida/mensaje.txt'
                sh 'grep -q "Jenkins" salida/mensaje.txt'
            }
        }

        stage('Archivar') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                unstash 'salida-practica'
                archiveArtifacts artifacts: 'salida/mensaje.txt',
                                 fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'El flujo distribuido terminó correctamente.'
        }

        failure {
            echo 'Una etapa del flujo distribuido falló.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

### Aspectos que deben verificarse

Antes de ejecutar el ejemplo:

- Confirma que las etiquetas existen.
- Confirma que ambas apuntan a agentes adecuados.
- Revisa que el archivo contiene el texto esperado.
- Comprueba que el job está configurado para Git.
- Valida el patrón de `stash`.
- Verifica que el artefacto se archiva en la etapa final.

### Stash y archivos producidos

El ejemplo guarda el archivo `salida/mensaje.txt` después de crearlo.

Las etapas posteriores reciben ese archivo mediante `unstash`.

Si se modificara el archivo después del `stash`, las etapas posteriores recibirían la versión guardada anteriormente.

### Agente de archivado

El último agente podría ser distinto del agente de preparación.

El archivo se recupera con `unstash` en el workspace actual antes de archivarlo.

### Fallo antes de archivar

Si una etapa falla, el pipeline normalmente no debería continuar con etapas posteriores que dependan de ella.

El resultado final debe reflejar la validación fallida.

### Etapa `post`

El bloque `post` se encuentra a nivel de pipeline en este ejemplo.

Los mensajes no cambian la causa del fallo.

Sirven para comunicar el resultado de forma breve.

## Distribuir etapas paralelas

El paralelismo es útil cuando varias tareas se pueden ejecutar sin depender unas de otras.

### Ejemplo con validaciones independientes

```groovy
pipeline {
    agent none

    stages {
        stage('Validar ramas del proyecto') {
            parallel {
                stage('Validar mensaje') {
                    agent {
                        label 'linux-laboratorio'
                    }

                    steps {
                        checkout scm
                        sh 'test -f app/mensaje.txt'
                        sh 'grep -q "Jenkins" app/mensaje.txt'
                    }
                }

                stage('Validar documentación') {
                    agent {
                        label 'linux-laboratorio'
                    }

                    steps {
                        checkout scm
                        sh 'test -f README.md'
                        sh 'grep -q "práctica" README.md'
                    }
                }
            }
        }
    }
}
```

### Independencia de las ramas

Las ramas anteriores obtienen el repositorio por separado.

Una rama no depende del resultado producido por la otra.

Eso facilita paralelizarlas.

### Compartir datos entre ramas paralelas

Compartir datos producidos por una rama paralela con otra puede ser complejo.

Evita diseñar una dependencia entre ramas que se espera que empiecen simultáneamente.

Si una tarea necesita el resultado de otra, normalmente deben ser etapas secuenciales.

### Fallo de una rama

Si una rama paralela falla, el resultado conjunto puede fallar.

El comportamiento de interrupción de otras ramas depende de la configuración y las opciones utilizadas.

No añadas opciones de cancelación sin entender cómo afectan a las tareas en curso.

### Capacidad requerida

Una etapa paralela necesita un ejecutor disponible en un agente compatible.

Si solo existe un ejecutor y una tarea lo está utilizando, la otra puede esperar.

Paralelismo en el código no significa recursos ilimitados.

### Coste de ejecutar en paralelo

Evalúa:

- Tiempo total ahorrado.
- Tiempo de espera por agentes.
- Recursos consumidos.
- Coste de crear agentes temporales.
- Descargas duplicadas.
- Complejidad del diagnóstico.

El paralelismo es una decisión de diseño, no un adorno.

## Resultados, informes y artefactos

La distribución requiere decidir cómo recoger las salidas.

### Archivar desde la etapa productora

Si un archivo debe conservarse, una opción es archivarlo en la etapa que lo produce.

Esto reduce la necesidad de transferirlo a un tercer agente solo para conservarlo.

### Archivar después de validar

Si la salida solo debe conservarse cuando pasa una comprobación, archívala después de la validación.

El orden puede ser:

```text
Generar archivo
      |
      v
Validar archivo
      |
      v
Archivar archivo
```

### Publicar informes

Los informes de pruebas pueden generarse en un agente y publicarse desde la misma etapa.

Si deben moverse a otro agente, define una transferencia explícita.

### Resultado por plataforma

Si varias plataformas generan salidas, utiliza nombres claros:

```text
salida/linux/resultado.txt
salida/windows/resultado.txt
```

Esto evita sobrescrituras y facilita asociar la salida al sistema que la produjo.

### Fingerprinting

La opción de fingerprint puede ayudar a relacionar archivos entre ejecuciones.

Su utilidad depende de la configuración de Jenkins.

No sustituye a un sistema de control de versiones o de almacenamiento de artefactos.

### Retención

Define cuánto tiempo mantener:

- Logs.
- Artefactos.
- Informes.
- Workspaces.
- Cachés.

Sigue la política del laboratorio.

No asumas que una salida archivada se conserva indefinidamente.

## Seguridad y operación

Los agentes ejecutan código y se comunican con otros sistemas. Un pipeline distribuido necesita límites claros.

### Permisos por agente

Cada agente debe tener solo los permisos requeridos por sus trabajos.

Comprueba:

- Identidad del proceso.
- Acceso a archivos.
- Acceso al repositorio.
- Acceso de red.
- Credenciales disponibles.
- Permisos administrativos.
- Capacidad de modificar otros recursos.

### Separar trabajos por confianza

No uses automáticamente el mismo agente para:

- Código externo no revisado.
- Tareas internas confiables.
- Despliegues.
- Pruebas con credenciales.
- Validaciones sencillas sin secretos.

La separación puede reducir el impacto de una configuración o script malicioso.

### Credenciales

Un pipeline distribuido no debería exponer credenciales a todos sus agentes.

Limita:

- Qué job puede usar cada credencial.
- Qué etapa necesita la credencial.
- Qué agente puede acceder.
- Qué permisos tiene la credencial.
- Cuánto tiempo se mantiene válida.

No incluyas secretos en un stash o en un artefacto.

### Red

Cada agente solo debería alcanzar los destinos necesarios para sus tareas.

Antes de permitir una conexión, confirma:

- Qué servicio necesita el job.
- Qué agente debe alcanzarlo.
- Quién inicia la conexión.
- Qué protocolo se utiliza.
- Qué regla de red está autorizada.
- Si hay un proxy o una VPN.

No abras puertos ni amplíes reglas por cuenta propia.

### Workspace compartido

Dos agentes diferentes no deberían suponerse conectados al mismo workspace.

Evita que jobs de distintos proyectos compartan archivos o directorios de forma accidental.

### Limpieza

La limpieza debe ser:

- Limitada al workspace del job.
- Compatible con la retención de artefactos.
- Segura ante ejecuciones concurrentes.
- Aprobada por el responsable del agente.
- Documentada cuando afecte recursos compartidos.

No uses comandos de borrado amplios en un agente compartido.

### Agentes temporales

Un agente temporal puede reducir residuos entre ejecuciones si se crea y elimina correctamente.

Aun así, revisa:

- Volúmenes persistentes.
- Cachés.
- Archivos temporales.
- Logs.
- Secretos.
- Datos guardados fuera del contenedor.

### Contenedores

Un contenedor puede servir como entorno de ejecución, pero no elimina todos los riesgos.

Revisa:

- Usuario del contenedor.
- Permisos.
- Volúmenes.
- Acceso a red.
- Imagen base.
- Acceso a sockets del host.
- Datos que persisten.

### Controlador

No ejecutes trabajos en el controlador si la política indica que debe permanecer dedicado a coordinar.

No reduzcas protecciones del controlador para evitar configurar un agente.

### Logs

Los logs distribuidos pueden mostrar:

- Nombres de nodos.
- Rutas.
- Usuarios.
- Mensajes de servicios.
- Comandos.
- Datos de prueba.
- Errores de red.

Revisa los logs antes de compartirlos con otras personas.

## Observabilidad y diagnóstico

Para entender un pipeline distribuido, hay que saber dónde se ejecutó cada etapa y qué datos procesó.

### Datos de una ejecución

Registra:

- Job.
- Número de ejecución.
- Rama.
- Commit.
- Etapa.
- Agente o etiqueta.
- Duración.
- Resultado.
- Artefactos producidos.

### Identificar dónde se ejecutó una etapa

Consulta:

- Nombre del nodo en la consola.
- Etiqueta solicitada por la etapa.
- Estado del nodo.
- Mensajes de asignación.
- Información que muestre la interfaz.

No imprimas datos del sistema que no sean necesarios.

### Pipeline en cola

Un pipeline puede esperar porque:

- No existe un agente con la etiqueta.
- El agente está desconectado.
- Todos los ejecutores están ocupados.
- El agente no acepta trabajos.
- Hay límites de concurrencia.
- La infraestructura temporal no se ha creado.

Un job en cola no demuestra que el código fuente tenga un error.

### Etapa lenta

Una etapa distribuida puede tardar por:

- Espera de agente.
- Inicio de un agente temporal.
- Checkout.
- Descarga de dependencias.
- Transferencia de archivos.
- Pruebas.
- Saturación.
- Servicio externo lento.

Separa el tiempo de espera del tiempo de ejecución cuando la interfaz lo permita.

### Agente desconectado

Si un agente se desconecta:

- Comprueba si la etapa llegó a iniciar.
- Revisa el mensaje de estado.
- Anota la hora.
- Comprueba si otros jobs tienen el mismo problema.
- Consulta al responsable del nodo.
- No reinicies servicios compartidos sin permiso.

### Fallo de `stash`

Posibles causas:

- El patrón no incluye el archivo.
- La etapa productora falló antes del `stash`.
- El archivo no existe.
- El nombre del stash no coincide.
- El stash se creó en otra ejecución.
- La ruta se interpreta desde otro directorio.

### Fallo de `unstash`

Comprueba:

- Que la etapa anterior ejecutó `stash`.
- Que el nombre coincide exactamente.
- Que ambas etapas pertenecen al mismo pipeline.
- Que el patrón incluyó los archivos.
- Que el workspace receptor tiene espacio.
- Que Jenkins conserva los datos de la ejecución.

### Archivo ausente entre agentes

No asumas que el workspace se comparte.

Confirma si el archivo:

- Se incluyó en un `stash`.
- Se archivó.
- Se obtuvo de nuevo desde Git.
- Se generó en el agente actual.
- Está en la ruta prevista.

### Diferencias entre agentes

Dos agentes con etiquetas parecidas pueden tener:

- Sistemas operativos distintos.
- Herramientas con versiones diferentes.
- Certificados diferentes.
- Rutas diferentes.
- Permisos diferentes.
- Políticas de red diferentes.

Documenta las capacidades reales.

### Diagnóstico ordenado

1. Identifica el job y la ejecución.
2. Localiza la etapa afectada.
3. Confirma el agente asignado.
4. Comprueba si la etapa empezó.
5. Lee el primer error relevante.
6. Comprueba entradas y rutas.
7. Revisa el resultado de la etapa anterior.
8. Confirma si hubo transferencia de archivos.
9. Formula una hipótesis concreta.
10. Cambia una sola cosa y vuelve a probar.

### Informe de incidencia

```text
Job:
Ejecución:
Commit:
Etapa:
Agente:
Etiqueta solicitada:
Estado observado:
Mensaje relevante:
Archivo o herramienta implicada:
Hipótesis:
Próxima comprobación:
```

Elimina secretos y datos internos no autorizados antes de compartir el informe.

## Sesiones prácticas

Las sesiones están pensadas para una instancia de laboratorio y pueden hacerse en parejas.

### Sesión 1: mapear el flujo distribuido

**Objetivo:** representar qué agente ejecuta cada etapa.

#### Preparación

El docente proporciona un pipeline o diagrama que identifique:

- Controlador.
- Agentes disponibles.
- Etiquetas.
- Etapas.
- Archivos que se transfieren.

#### Actividad

Dibuja el flujo:

```text
Etapa:
Agente:
Etiqueta:
Entrada:
Salida:
Siguiente etapa:
¿Hay transferencia?:
```

#### Preguntas

- ¿Qué etapas se ejecutan en el mismo agente?
- ¿Qué etapas cambian de nodo?
- ¿Qué archivos necesitan las etapas posteriores?
- ¿Cómo llegan esos archivos?
- ¿Qué ocurriría si el agente no está disponible?

#### Entregable

Entrega un diagrama sin secretos ni direcciones de red privadas.

### Sesión 2: inspeccionar los agentes disponibles

**Objetivo:** identificar etiquetas y capacidades sin modificar la configuración.

#### Instrucciones

1. Abre la vista de nodos o agentes.
2. Consulta solo la información para la que tengas permiso.
3. Registra el nombre del agente.
4. Registra el estado.
5. Anota sus etiquetas.
6. Identifica ejecutores disponibles.
7. Anota herramientas conocidas, si están documentadas.
8. No cambies etiquetas o ejecutores.
9. Pregunta al docente si una capacidad no está clara.

#### Hoja de observación

| Dato | Observación |
|---|---|
| Nombre del nodo | |
| Estado | |
| Sistema operativo | |
| Etiquetas | |
| Ejecutores disponibles | |
| Herramientas conocidas | |
| Restricciones | |

#### Preguntas

- ¿Qué etiqueta utilizarías para un pipeline Linux?
- ¿Qué evidencia respalda esa elección?
- ¿Qué no se puede deducir solo del nombre del nodo?
- ¿Qué diferencia hay entre nodo conectado y agente preparado?

### Sesión 3: ejecutar etapas en agentes distintos

**Objetivo:** comprobar que etapas diferentes pueden ejecutarse en agentes diferentes.

#### Requisitos

- Etiqueta Linux de laboratorio.
- Etiqueta Windows de laboratorio, si está disponible.
- Permiso para ejecutar el job de práctica.
- Sin cambios en la configuración global.

#### Pipeline ilustrativo

```groovy
pipeline {
    agent none

    stages {
        stage('Consulta Linux') {
            agent {
                label 'ETIQUETA_LINUX_AUTORIZADA'
            }

            steps {
                sh 'echo "Etapa Linux"'
                sh 'uname -s'
            }
        }

        stage('Consulta Windows') {
            agent {
                label 'ETIQUETA_WINDOWS_AUTORIZADA'
            }

            steps {
                bat 'echo Etapa Windows'
                bat 'ver'
            }
        }
    }
}
```

Sustituye los marcadores solo con etiquetas confirmadas por el docente.

#### Instrucciones

1. Revisa el pipeline antes de ejecutarlo.
2. Identifica el agente de cada etapa.
3. Confirma que los pasos corresponden a cada sistema.
4. Inicia una ejecución.
5. Localiza el nombre del agente en la consola.
6. Compara los resultados.
7. Registra qué etapa se ejecutó primero.

#### Preguntas

- ¿Las etapas se ejecutaron en paralelo?
- ¿Qué señal muestra qué agente utilizó cada una?
- ¿Qué ocurriría si falta la etiqueta Windows?
- ¿Qué comando fallaría si se usara `sh` en un agente Windows?

### Sesión 4: transferir un archivo con `stash`

**Objetivo:** pasar un archivo pequeño de una etapa a otra.

#### Preparación

El proyecto debe contener:

```text
README.md
app/mensaje.txt
```

El archivo de mensaje debe contener la palabra `Jenkins`.

#### Pipeline de práctica

```groovy
pipeline {
    agent none

    stages {
        stage('Preparar archivo') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                checkout scm
                sh 'test -f app/mensaje.txt'

                stash name: 'mensaje-practica',
                      includes: 'app/mensaje.txt'
            }
        }

        stage('Verificar archivo') {
            agent {
                label 'linux-pruebas'
            }

            steps {
                unstash 'mensaje-practica'
                sh 'test -s app/mensaje.txt'
                sh 'grep -q "Jenkins" app/mensaje.txt'
            }
        }
    }
}
```

Las etiquetas son de ejemplo. Usa las autorizadas en la instancia.

#### Instrucciones

1. Identifica qué etapa produce el stash.
2. Identifica qué etapa lo recupera.
3. Comprueba el nombre usado en ambas etapas.
4. Ejecuta el pipeline.
5. Observa el estado de cada etapa.
6. Revisa la consola.
7. Registra el agente de cada etapa.

#### Preguntas

- ¿Qué archivo transfirió el stash?
- ¿Qué directorio se comprobó después de `unstash`?
- ¿El segundo workspace tiene que ser el mismo del primero?
- ¿Qué pasaría si el patrón no incluye el archivo?

### Sesión 5: diagnosticar un `unstash` fallido

**Objetivo:** localizar un error de transferencia de archivos.

#### Escenario

El stash incluye:

```text
app/mensaje.txt
```

La etapa receptora busca:

```text
salida/mensaje.txt
```

#### Actividad

1. Compara las rutas.
2. Identifica qué etapa crea cada una.
3. Comprueba si se necesita copiar el archivo.
4. Revisa los mensajes de la consola.
5. Propón el cambio mínimo.
6. Vuelve a ejecutar solo después de aprobar el cambio.

#### Preguntas

- ¿El archivo se transfirió o se buscó en una ruta distinta?
- ¿Qué directorio conserva `unstash`?
- ¿Cómo evitarías una ambigüedad de rutas?
- ¿Qué mensaje ayudaría a diagnosticar el problema?

### Sesión 6: ejecutar validaciones en paralelo

**Objetivo:** comparar duración y recursos de etapas independientes.

#### Preparación

Utiliza un proyecto que pueda obtenerse por separado en cada agente.

Las comprobaciones deben ser independientes y de solo lectura.

#### Pipeline ilustrativo

```groovy
pipeline {
    agent none

    stages {
        stage('Validaciones independientes') {
            parallel {
                stage('Validar aplicación') {
                    agent {
                        label 'linux-laboratorio'
                    }

                    steps {
                        checkout scm
                        sh 'test -f app/mensaje.txt'
                    }
                }

                stage('Validar documentación') {
                    agent {
                        label 'linux-laboratorio'
                    }

                    steps {
                        checkout scm
                        sh 'test -f README.md'
                    }
                }
            }
        }
    }
}
```

#### Instrucciones

1. Comprueba que las ramas son independientes.
2. Confirma que no escriben en el mismo archivo.
3. Ejecuta el pipeline una sola vez.
4. Observa el inicio y fin de cada rama.
5. Anota si ambas pudieron empezar.
6. Identifica si hubo espera por ejecutores.

#### Registro

```text
Duración total:
Rama de aplicación:
Rama de documentación:
¿Se ejecutaron simultáneamente?:
¿Hubo espera?:
Agente utilizado:
Observación:
```

#### Preguntas

- ¿Qué parte del resultado demuestra que hubo paralelismo?
- ¿Qué limitación de capacidad observaste?
- ¿Podrían las tareas ejecutarse de forma secuencial?
- ¿El paralelismo redujo el tiempo en esta práctica?

### Sesión 7: comparar `checkout` y `stash`

**Objetivo:** elegir cómo entregar las entradas a otra etapa.

#### Escenario A

Un repositorio pequeño y accesible desde todos los agentes.

#### Escenario B

Una etapa genera un resultado que no existe en Git.

#### Escenario C

Se genera un paquete grande que debe conservarse durante semanas.

#### Actividad

Para cada escenario, elige una estrategia:

- Checkout del repositorio.
- `stash` y `unstash`.
- Archivado de artefactos.
- Sistema externo aprobado.

#### Preguntas

- ¿Qué opción vuelve a obtener el código?
- ¿Qué opción transfiere datos dentro de la ejecución?
- ¿Qué opción conserva archivos asociados a un build?
- ¿Qué opción es más adecuada para almacenamiento duradero?

### Sesión 8: probar una etiqueta no disponible

**Objetivo:** distinguir un problema de asignación de un fallo de código.

El docente puede preparar una captura o una ejecución de ejemplo. No modifiques los agentes compartidos.

#### Escenario

Una etapa solicita una etiqueta que no tiene agentes conectados.

#### Actividad

1. Localiza la etiqueta solicitada.
2. Observa el estado del agente compatible.
3. Lee el motivo de la cola.
4. Confirma si se ejecutó algún paso.
5. Escribe una solicitud de soporte.
6. No cambies la etiqueta global sin permiso.

#### Informe

```text
Job:
Etapa:
Etiqueta:
Agente compatible:
Estado:
¿Se ejecutó el paso?:
Mensaje observado:
Información que falta:
```

### Sesión 9: investigar un agente saturado

**Objetivo:** comprender el efecto de ejecutores ocupados.

#### Escenario

Dos etapas piden la misma etiqueta, pero el nodo tiene un ejecutor ocupado.

#### Actividad

- Observa la cola.
- Anota cuántas ejecuciones esperan.
- Revisa si hay otro agente con la etiqueta.
- Distingue falta de capacidad de error del pipeline.
- Propón una mejora sin cambiar la configuración.

#### Preguntas

- ¿Aumentar ejecutores sería necesariamente seguro?
- ¿Qué métrica revisarías?
- ¿Se pueden mover tareas a otro agente?
- ¿El job necesita realmente esa etiqueta?

### Sesión 10: hacer una salida por plataforma

**Objetivo:** evitar colisiones cuando varias ramas generan resultados.

#### Diseño

Cada plataforma produce un archivo con un nombre distinto:

```text
salida/linux/resultado.txt
salida/windows/resultado.txt
```

#### Actividad

1. Dibuja la estructura final.
2. Identifica qué agente crea cada ruta.
3. Comprueba cómo se transfiere cada resultado.
4. Decide qué archivos se archivan.
5. Explica cómo reconocer el origen de cada archivo.

#### Preguntas

- ¿Qué problema evita separar los directorios?
- ¿Qué ocurriría si ambas etapas escriben en `salida/resultado.txt`?
- ¿Qué nombre de artefacto facilitaría el diagnóstico?

### Sesión 11: revisar seguridad de un pipeline distribuido

**Objetivo:** identificar permisos y exposición de datos.

#### Escenario

Un pipeline ejecuta código de una rama externa en un agente que puede acceder a una credencial de escritura.

#### Riesgos que deben considerarse

- Código no confiable con acceso a una credencial.
- Agente compartido con otros proyectos.
- Acceso de red excesivo.
- Workspace con residuos de ejecuciones anteriores.
- Logs con datos sensibles.
- Permisos de sistema demasiado amplios.
- Artefactos que incluyen archivos no previstos.

#### Propuesta de controles

Sugiere medidas como:

- Separar agentes por nivel de confianza.
- Limitar credenciales a jobs concretos.
- Usar credenciales de solo lectura cuando sea suficiente.
- Restringir acceso de red.
- Limpiar workspaces de forma segura.
- Revisar código antes de proporcionar secretos.
- Archivar solo archivos necesarios.

### Sesión 12: construir el pipeline integrador

**Objetivo:** distribuir una validación y conservar una salida.

#### Estructura de proyecto

```text
proyecto-distribuido/
├── Jenkinsfile
├── README.md
├── app/
│   └── mensaje.txt
└── scripts/
    └── validar.sh
```

#### Archivo de entrada

```text
Pipeline distribuido de práctica Jenkins
```

#### Script de validación

```bash
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: falta $ARCHIVO"
  exit 1
fi

if grep -q "Jenkins" "$ARCHIVO"; then
  echo "OK: el contenido es válido"
else
  echo "ERROR: falta la palabra Jenkins"
  exit 1
fi
```

#### Jenkinsfile integrador

```groovy
pipeline {
    agent none

    stages {
        stage('Preparar y validar') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                checkout scm
                sh 'test -f README.md'
                sh 'bash scripts/validar.sh'
                sh 'mkdir -p salida'
                sh 'cp app/mensaje.txt salida/mensaje.txt'

                stash name: 'salida-validada',
                      includes: 'salida/mensaje.txt'
            }
        }

        stage('Comprobar salida en otro agente') {
            agent {
                label 'linux-pruebas'
            }

            steps {
                unstash 'salida-validada'
                sh 'test -s salida/mensaje.txt'
                sh 'grep -q "Jenkins" salida/mensaje.txt'
            }
        }

        stage('Archivar resultado') {
            agent {
                label 'linux-laboratorio'
            }

            steps {
                unstash 'salida-validada'
                archiveArtifacts artifacts: 'salida/mensaje.txt',
                                 fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Pipeline distribuido validado.'
        }

        failure {
            echo 'Revisa la etapa fallida y el agente asignado.'
        }

        always {
            echo 'Fin del pipeline.'
        }
    }
}
```

Este ejemplo requiere adaptar las etiquetas a las autorizadas en el curso.

#### Prueba local

Antes de ejecutar Jenkins, prueba el script en el repositorio:

```bash
bash scripts/validar.sh
```

La salida debe ser correcta si el archivo contiene `Jenkins`.

#### Ejecución en Jenkins

1. Confirma la URL y la rama del repositorio.
2. Revisa las etiquetas.
3. Comprueba que los agentes están conectados.
4. Ejecuta el pipeline.
5. Registra el agente de cada etapa.
6. Comprueba el `stash` y el `unstash`.
7. Localiza el artefacto archivado.
8. Anota el resultado.

#### Fallo controlado

Cambia el contenido para que no contenga la palabra esperada.

Ejecuta el pipeline y comprueba:

- Qué etapa falla.
- Si se crea el stash.
- Si las etapas posteriores se ejecutan.
- Qué mensaje aparece.
- Qué resultado final se registra.

Después restaura el contenido y vuelve a ejecutar.

#### Informe de la práctica

```text
Job:
Ejecución correcta:
Ejecución fallida:
Agentes utilizados:
Etiquetas:
Archivo transferido:
Nombre del stash:
Artefacto:
Causa del fallo:
Corrección:
Mejora propuesta:
```

## Buenas prácticas de diseño

Un pipeline distribuido debe ser comprensible y reproducible.

### Separar etapas por propósito

Cada etapa debería tener una responsabilidad reconocible.

Ejemplos:

- `Obtener fuentes`
- `Validar código`
- `Ejecutar pruebas Linux`
- `Ejecutar pruebas Windows`
- `Archivar resultados`

### Seleccionar agentes por necesidad

Elige un agente porque ofrece una capacidad necesaria.

No elijas una etiqueta solo porque está disponible.

### Transferir únicamente lo necesario

Limita los patrones de `stash` y los artefactos.

Transferir archivos innecesarios puede aumentar el tiempo y exponer datos.

### Fijar la revisión de código

Asegura que todas las etapas validan el mismo commit.

Si cada etapa hace un checkout independiente, comprueba que la rama no haya cambiado entre las operaciones o utiliza el mecanismo de revisión de la ejecución.

### Evitar estado implícito

No dependas de archivos que casualmente quedaron en un workspace anterior.

Declara las entradas y transfiere explícitamente los resultados.

### Hacer visibles las dependencias

Si una etapa consume el resultado de otra, documenta esa relación.

Utiliza un flujo secuencial cuando exista una dependencia real.

### Mantener las ramas paralelas independientes

Las etapas paralelas no deberían depender de resultados producidos por otra rama al mismo tiempo.

### Nombrar artefactos con claridad

Usa nombres que comuniquen:

- Contenido.
- Plataforma.
- Versión.
- Ejecución o revisión, si procede.

### Controlar concurrencia

Revisa si el pipeline puede ejecutarse varias veces a la vez.

Evita interferencias con recursos compartidos.

### Documentar capacidades

Registra:

- Etiquetas.
- Sistema operativo.
- Herramientas.
- Restricciones.
- Responsable.
- Política de limpieza.

## Errores de diseño frecuentes

### Asumir que los workspaces se comparten

Un cambio de agente normalmente implica un workspace diferente.

Usa checkout, `stash` o el sistema de artefactos aprobado.

### Usar `stash` para archivos enormes

La transferencia puede ser lenta o inadecuada.

Utiliza un sistema de almacenamiento apropiado para resultados grandes.

### Usar la misma ruta en ramas paralelas

Dos ramas pueden sobrescribirse o producir resultados ambiguos.

Asigna rutas distintas o usa workspaces correctamente aislados.

### Paralelizar tareas dependientes

Si una tarea necesita el resultado de otra, ejecutarlas simultáneamente puede producir errores o carreras.

Ordénalas secuencialmente.

### Etiquetas desactualizadas

Una etiqueta que ya no representa las capacidades del nodo puede asignar trabajos incorrectos.

Mantén las etiquetas y la documentación alineadas.

### Demasiados ejecutores

Un nodo saturado puede hacer que todos los trabajos tarden más.

Mide la utilización antes de aumentar la concurrencia.

### Checkout diferente por etapa

Si cada agente obtiene una versión distinta del repositorio, los resultados no son comparables.

Registra y conserva la misma revisión.

### Artefacto sin validación

Archivar una salida antes de validarla puede conservar resultados inválidos.

Define claramente cuándo una salida se considera publicable.

### Credenciales visibles en todas las etapas

No expongas secretos en etapas o agentes que no los necesitan.

Limita el alcance de las credenciales.

## Checklist de revisión de un pipeline distribuido

### Agentes

- [ ] Cada etapa tiene un agente definido.
- [ ] Las etiquetas existen.
- [ ] Los nodos están autorizados.
- [ ] Los agentes tienen las herramientas necesarias.
- [ ] El uso del controlador respeta la política local.

### Dependencias

- [ ] Las etapas están ordenadas correctamente.
- [ ] Las dependencias entre etapas son explícitas.
- [ ] Los archivos se obtienen o transfieren.
- [ ] Las etapas paralelas son independientes.
- [ ] La revisión de código es coherente entre etapas.

### Recursos

- [ ] Hay ejecutores disponibles.
- [ ] La concurrencia es razonable.
- [ ] El disco es suficiente.
- [ ] Las pruebas no saturan servicios compartidos.
- [ ] El tiempo de transferencia está considerado.

### Seguridad

- [ ] Las credenciales tienen alcance limitado.
- [ ] El agente tiene permisos mínimos.
- [ ] La red necesaria está identificada.
- [ ] Los secretos no se imprimen.
- [ ] El workspace se gestiona según una política.

### Resultados

- [ ] Los archivos de salida tienen nombres claros.
- [ ] Los artefactos se archivan después de validarse.
- [ ] Los logs permiten identificar la etapa.
- [ ] El resultado final representa el estado real.
- [ ] La política de retención está definida.

## Preguntas de repaso

1. ¿Qué significa que un pipeline sea distribuido?
2. ¿Qué función cumple el controlador?
3. ¿Qué diferencia hay entre nodo, agente y ejecutor?
4. ¿Qué significa `agent none`?
5. ¿Cuándo conviene definir un agente por etapa?
6. ¿Qué representa una etiqueta?
7. ¿Por qué un agente conectado puede no ser compatible con un job?
8. ¿Qué es un workspace?
9. ¿Por qué no se debe asumir que dos agentes comparten workspace?
10. ¿Para qué sirven `stash` y `unstash`?
11. ¿Qué diferencia hay entre `stash` y `archiveArtifacts`?
12. ¿Qué tareas son buenas candidatas para paralelismo?
13. ¿Qué riesgos puede introducir la concurrencia?
14. ¿Qué puede causar que una etapa quede en cola?
15. ¿Cómo se puede asegurar que varias etapas procesan el mismo commit?
16. ¿Por qué no conviene usar `stash` para archivos muy grandes?
17. ¿Qué datos debería registrar un informe de incidencia?
18. ¿Por qué se deben separar agentes de distinta confianza?
19. ¿Qué información no debe aparecer en los logs?
20. ¿Qué revisarías primero si un `unstash` falla?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«El controlador coordina el trabajo y los agentes ejecutan los pasos asignados».

### Afirmación 2

«Todos los agentes comparten automáticamente el mismo workspace».

### Afirmación 3

«`agent none` puede permitir asignar agentes a etapas concretas».

### Afirmación 4

«Una etiqueta debe describir capacidades reales del agente».

### Afirmación 5

«Distribuir un pipeline garantiza que terminará antes».

### Afirmación 6

«`stash` y `unstash` pueden transferir archivos dentro de una ejecución».

### Afirmación 7

«`archiveArtifacts` es almacenamiento permanente garantizado».

### Afirmación 8

«Las ramas paralelas deberían ser independientes».

### Afirmación 9

«Un agente conectado siempre tiene las herramientas requeridas».

### Afirmación 10

«Aumentar ejecutores puede provocar competencia por recursos».

### Afirmación 11

«Un checkout independiente en cada etapa siempre obtiene exactamente el mismo commit».

### Afirmación 12

«Los secretos pueden guardarse en un stash para pasarlos entre agentes».

### Afirmación 13

«Un job en cola puede estar esperando un ejecutor».

### Afirmación 14

«Dos etapas paralelas que escriben en el mismo archivo podrían interferir».

### Afirmación 15

«Un contenedor elimina todos los riesgos de ejecución».

## Respuestas orientativas

### Afirmación 1

**Correcta.** Esa es la separación básica entre coordinación y ejecución.

### Afirmación 2

**Incorrecta.** Cada agente puede tener un workspace independiente.

### Afirmación 3

**Correcta.** Permite evitar un agente global y asignar agentes por etapa.

### Afirmación 4

**Correcta.** Las etiquetas deben reflejar capacidades comprobadas.

### Afirmación 5

**Incorrecta.** La distribución puede añadir espera, transferencia y complejidad.

### Afirmación 6

**Correcta.** Son mecanismos habituales para compartir archivos dentro de una ejecución.

### Afirmación 7

**Incorrecta.** La retención depende de la configuración y las políticas.

### Afirmación 8

**Correcta.** La independencia facilita ejecución paralela segura.

### Afirmación 9

**Incorrecta.** Conectividad no garantiza disponibilidad de herramientas.

### Afirmación 10

**Correcta.** Más trabajos simultáneos compiten por CPU, memoria, disco y red.

### Afirmación 11

**Incorrecta.** Depende del checkout, la rama y el momento de cada operación.

### Afirmación 12

**Incorrecta.** No se deben transferir secretos de esa forma.

### Afirmación 13

**Correcta.** Puede no haber un ejecutor disponible.

### Afirmación 14

**Correcta.** Las escrituras concurrentes pueden sobrescribirse o mezclarse.

### Afirmación 15

**Incorrecta.** La configuración del contenedor puede seguir exponiendo recursos y datos.

## Glosario

- **Agente:** proceso que permite ejecutar trabajo de Jenkins en un nodo.
- **Artefacto:** archivo generado y conservado asociado a una ejecución.
- **Controlador:** componente central que programa y coordina Jenkins.
- **Ejecutor:** capacidad de un nodo para ejecutar una tarea.
- **Etiqueta:** nombre asociado a una capacidad o grupo de agentes.
- **Etapa:** parte lógica de un pipeline.
- **Paralelismo:** ejecución simultánea de tareas independientes.
- **Pipeline distribuido:** flujo que ejecuta etapas o tareas en agentes diferentes.
- **Stash:** conjunto temporal de archivos conservado durante una ejecución.
- **Unstash:** recuperación de un stash en un workspace.
- **Workspace:** directorio de trabajo de una ejecución en un agente.
- **Checkout:** obtención de una revisión desde un repositorio.
- **Concurrencia:** ejecución de varios trabajos al mismo tiempo.
- **Agente temporal:** agente creado durante un periodo limitado.
- **Agente etiquetado:** agente seleccionado mediante una etiqueta.
- **Mínimo privilegio:** principio de conceder solo los permisos necesarios.
- **Caché:** datos reutilizables que pueden acelerar ejecuciones posteriores.
- **Trazabilidad:** relación entre código, ejecución, agente y resultado.
- **Nodo:** máquina o entorno registrado en Jenkins.

## Síntesis final

Un pipeline distribuido coordina trabajo entre agentes y permite asignar cada etapa al entorno adecuado.

- El controlador coordina; los agentes ejecutan.
- `agent none` permite definir agentes por etapa.
- Las etiquetas seleccionan nodos con capacidades concretas.
- Los workspaces no deben suponerse compartidos.
- `stash` y `unstash` sirven para transferencias temporales dentro de una ejecución.
- Los artefactos sirven para conservar salidas según la política de Jenkins.
- El paralelismo solo es seguro cuando las tareas son independientes y hay recursos.
- La distribución exige controlar permisos, red, credenciales, concurrencia y limpieza.
- La consola debe permitir identificar agente, etapa, entrada y resultado.
- Un pipeline distribuido bien diseñado es explícito, reproducible y diagnosticable.