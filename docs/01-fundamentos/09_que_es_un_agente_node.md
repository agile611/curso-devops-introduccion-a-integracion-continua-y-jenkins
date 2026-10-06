# ¿Qué es un agente o nodo de Jenkins?

Un agente de Jenkins es un sistema donde se ejecutan los pasos de un job o pipeline. Puede ser una máquina física, una máquina virtual, un contenedor o un proceso que se conecta al controlador de Jenkins. Los agentes permiten ejecutar trabajos en entornos adecuados para cada tarea, distribuir carga y aislar la ejecución del código.

En Jenkins también se utiliza el término **nodo**. De forma práctica, un nodo representa una máquina o entorno conectado a Jenkins; un agente es el proceso que permite que Jenkins coordine trabajos en ese nodo. La terminología y algunos detalles de configuración pueden variar entre versiones, pero comprender la relación entre controlador, nodo, agente y ejecutor permite diseñar y diagnosticar pipelines con mayor claridad.

En esta unidad conocerás esos componentes, revisarás etiquetas y ejecutores, y practicarás cómo identificar en qué agente corre un job. Los ejercicios están diseñados para un laboratorio y no requieren modificar servidores compartidos ni conceder permisos administrativos.

> **Nota de seguridad:** el código ejecutado en un agente puede leer archivos y utilizar los permisos disponibles para el proceso. Los agentes deben tener solo el acceso necesario para sus tareas. Utiliza únicamente agentes y credenciales autorizados por el curso.

## Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Explicar qué es un nodo y qué es un agente de Jenkins.
- Diferenciar controlador, nodo, agente, ejecutor y workspace.
- Describir cómo se asigna un job a un agente.
- Comprender para qué sirven las etiquetas.
- Interpretar la disponibilidad y el uso de ejecutores.
- Identificar cuándo conviene aislar un tipo de trabajo en un agente separado.
- Reconocer métodos habituales de conexión de agentes.
- Ejecutar comandos de consulta en un agente de laboratorio.
- Configurar un job para que use una etiqueta autorizada.
- Identificar en los logs qué agente ejecutó un job.
- Diagnosticar problemas comunes de conexión y asignación.
- Aplicar el principio de mínimo privilegio a los agentes.
- Documentar las características de un agente.
- Comparar agentes persistentes, temporales y ejecutados en contenedores.

## Conceptos principales

Jenkins coordina trabajos y los ejecuta en nodos que disponen de capacidad suficiente.

### Controlador

El **controlador** es el componente central de Jenkins.

Puede encargarse de:

- Mostrar la interfaz web.
- Administrar la configuración de Jenkins.
- Mantener jobs y pipelines.
- Programar ejecuciones.
- Asignar trabajos a nodos.
- Recibir resultados.
- Mantener datos de Jenkins.
- Administrar plugins y credenciales, según los permisos.

El controlador coordina las ejecuciones, pero no necesita ser el lugar donde se ejecuten todos los comandos.

### Nodo

Un **nodo** es un sistema que Jenkins conoce y puede utilizar para realizar trabajo.

Un nodo puede ser:

- El sistema donde corre el controlador.
- Una máquina Linux separada.
- Una máquina Windows.
- Una máquina virtual.
- Un contenedor.
- Una instancia temporal creada para una ejecución.

Un nodo puede estar conectado, desconectado, temporalmente sin capacidad disponible o configurado para un conjunto concreto de tareas.

### Agente

Un **agente** es el proceso que permite ejecutar tareas en un nodo y comunicarse con el controlador.

En conversaciones cotidianas, «agente» y «nodo» a veces se usan de forma intercambiable. Es útil recordar la diferencia conceptual:

- El nodo es el sistema o entorno.
- El agente es el proceso de Jenkins que habilita la comunicación y la ejecución en ese entorno.

La interfaz puede emplear una terminología concreta según la versión instalada.

### Ejecutor

Un **ejecutor** representa una capacidad de un nodo para ejecutar una tarea.

Si un nodo tiene más de un ejecutor, puede admitir varias ejecuciones simultáneas.

!!! note "Sobre el número de ejecutores"
    Eso no significa que siempre convenga aumentar el número de ejecutores. Las tareas simultáneas compiten por recursos y pueden compartir archivos, servicios o datos.

### Workspace

El **workspace** es el directorio de trabajo que utiliza una ejecución en un nodo.

Puede contener:

- El código obtenido desde un repositorio.
- Archivos temporales.
- Dependencias descargadas.
- Resultados de pruebas.
- Artefactos todavía no archivados.
- Logs creados por los pasos.

El workspace pertenece a una ejecución o a un job según la configuración. No debe considerarse automáticamente almacenamiento permanente.

## Relación entre los componentes

Una ejecución comienza en el controlador, pero sus pasos pueden correr en otro nodo.

### Flujo conceptual

```text
Persona usuaria o evento
          |
          v
Controlador Jenkins
          |
          | selecciona un nodo compatible
          v
Agente en el nodo
          |
          +--> obtiene el código
          |
          +--> ejecuta comandos y pruebas
          |
          +--> genera resultados
          |
          v
Controlador muestra estado y logs
```

### Responsabilidades del controlador

El controlador puede:

- Aceptar solicitudes de ejecución.
- Evaluar las reglas del job.
- Buscar un nodo compatible.
- Reservar un ejecutor disponible.
- Enviar o coordinar tareas.
- Recibir el resultado.
- Actualizar la interfaz.

### Responsabilidades del agente

El agente puede:

- Ejecutar los pasos asignados.
- Acceder al workspace.
- Utilizar herramientas instaladas.
- Interactuar con servicios permitidos.
- Enviar salida y resultado al controlador.

### Responsabilidades del equipo

El equipo debe decidir:

- Qué tareas pueden ejecutarse en cada agente.
- Qué herramientas necesita cada agente.
- Qué permisos se conceden.
- Cuántas tareas simultáneas son aceptables.
- Cómo se actualiza y supervisa el agente.
- Qué hacer si un agente queda desconectado.

## Nodo integrado y controlador

Jenkins puede permitir ejecutar tareas en el mismo sistema que hospeda el controlador. En la interfaz, ese nodo puede aparecer como nodo integrado o incorporado.

### Usar el controlador para ejecutar trabajos

En un laboratorio pequeño, el controlador puede ejecutar trabajos sencillos. Esto facilita comenzar sin configurar máquinas adicionales.

Sin embargo, ejecutar trabajos en el controlador puede:

- Consumir recursos que necesita la interfaz.
- Mezclar la coordinación con la ejecución de código.
- Exponer archivos de configuración.
- Ampliar el impacto de un job malicioso o defectuoso.
- Dificultar el aislamiento entre tareas.

### Separar ejecución y coordinación

En entornos que requieren mayor aislamiento, se puede mantener el controlador dedicado a coordinar y ejecutar los trabajos en agentes separados.

Esta separación puede ayudar a:

- Limitar el impacto de un error.
- Elegir sistemas operativos distintos.
- Escalar la capacidad de ejecución.
- Administrar herramientas por tipo de tarea.
- Aislar código de diferentes proyectos.

Separar componentes añade también trabajo de administración y requiere configurar redes, credenciales y mantenimiento.

### Configuración por defecto

No des por hecho que el controlador acepta trabajos o que los rechaza.

Comprueba:

- Qué nodos aparecen en la instancia.
- Qué etiquetas tienen.
- Qué ejecutores están configurados.
- Qué agente indica el job.
- Qué política ha establecido el administrador.

No cambies la capacidad del controlador en una instancia compartida.

## Ejecutor y concurrencia

El número de ejecutores determina cuántos trabajos pueden ejecutarse simultáneamente en un nodo.

### Ejemplo sencillo

Si un nodo tiene un ejecutor ocupado, otro job que necesita ese nodo puede quedarse en cola.

Si el nodo tiene dos ejecutores disponibles, podría ejecutar dos trabajos al mismo tiempo, siempre que Jenkins, los recursos y la configuración lo permitan.

### Más ejecutores no siempre significan más rendimiento

Aumentar los ejecutores puede causar:

- Competencia por CPU.
- Agotamiento de memoria.
- Uso excesivo de disco.
- Descargas repetidas.
- Conflictos por archivos compartidos.
- Saturación de servicios de prueba.
- Resultados variables por falta de recursos.

### Cuándo puede tener sentido limitar la concurrencia

Puede ser adecuado limitarla si:

- El nodo tiene pocos recursos.
- Los trabajos modifican el mismo entorno.
- Las pruebas dependen de datos compartidos.
- El destino no soporta operaciones simultáneas.
- Se necesita evitar conflictos entre workspaces.
- El nodo ejecuta trabajos de distintos niveles de confianza.

### Preguntas para decidir la concurrencia

Antes de cambiar los ejecutores, pregunta:

- ¿Cuántos trabajos simultáneos puede soportar la máquina?
- ¿Se comparten directorios o servicios?
- ¿Cada ejecución tiene su propio workspace?
- ¿Qué sucede si dos despliegues se ejecutan a la vez?
- ¿Cuánto tardan los trabajos en cola?
- ¿Se satura algún recurso del agente?

## Etiquetas

Una **etiqueta** es un nombre que puede asignarse a uno o varios nodos. Permite expresar qué tipo de agente necesita un job.

### Para qué sirven

Las etiquetas pueden describir:

- Sistema operativo.
- Herramientas instaladas.
- Tipo de hardware.
- Ubicación del agente.
- Nivel de aislamiento.
- Capacidad de ejecutar una tarea concreta.
- Entorno de laboratorio.

Ejemplos de etiquetas conceptuales:

```text
linux
ubuntu
docker
pruebas
laboratorio
```

Las etiquetas reales dependen de la instancia.

### Etiquetas compartidas

Una etiqueta puede asignarse a varios nodos.

Un job que solicita esa etiqueta puede ejecutarse en cualquiera de los nodos compatibles que estén disponibles.

Eso facilita repartir carga, pero el equipo debe asegurarse de que los nodos con la misma etiqueta tienen capacidades suficientemente parecidas.

### Etiquetas específicas

Una etiqueta puede identificar un nodo o una capacidad poco común.

Si solo un nodo tiene esa etiqueta, el job dependerá de ese nodo. Si se desconecta, la ejecución puede quedarse en cola.

### Elegir una etiqueta para un job

Selecciona la etiqueta según los requisitos de la tarea.

Por ejemplo, un job que requiere Bash y Git debería usar un agente que tenga esas herramientas y cuya disponibilidad esté autorizada.

No elijas una etiqueta solo porque el nombre parece adecuado. Confirma las capacidades reales del nodo.

### Errores frecuentes con etiquetas

- La etiqueta está mal escrita.
- Ningún nodo tiene esa etiqueta.
- El único nodo compatible está desconectado.
- El agente tiene una etiqueta que ya no refleja su configuración.
- El job requiere varias capacidades y no existe un nodo que las reúna.
- La instancia interpreta la expresión de etiquetas de forma distinta a lo esperado.

## Cómo se asigna un job a un agente

La asignación depende del tipo de job y de su configuración.

### Job Freestyle

Un job Freestyle puede ejecutarse en:

- El nodo integrado.
- Cualquier nodo disponible.
- Un nodo que coincida con una etiqueta.
- Un nodo elegido según la configuración del job.

La interfaz exacta depende de la versión y la configuración de Jenkins.

### Pipeline declarativo

Un pipeline puede indicar un agente a nivel del flujo completo:

```groovy
pipeline {
    agent any

    stages {
        stage('Consulta') {
            steps {
                echo 'Ejecución de práctica'
            }
        }
    }
}
```

`agent any` solicita que Jenkins utilice cualquier agente disponible que cumpla la configuración aplicable.

### Pipeline con etiqueta

Un pipeline puede solicitar un nodo mediante una etiqueta:

```groovy
pipeline {
    agent {
        label 'laboratorio'
    }

    stages {
        stage('Consulta') {
            steps {
                echo 'Ejecutado en un agente de laboratorio'
            }
        }
    }
}
```

Utiliza una etiqueta real proporcionada por el administrador o por el docente.

### Agente por etapa

Algunos pipelines asignan etapas a distintos agentes.

Esto puede permitir que una etapa se ejecute en Linux y otra en un sistema diferente.

El diseño debe dejar claro:

- Qué archivos se transfieren entre etapas.
- Qué agente ejecuta cada paso.
- Qué herramientas se necesitan.
- Cómo se conserva el estado.
- Qué permisos tiene cada agente.

## Agentes permanentes y temporales

Los agentes pueden tener un ciclo de vida diferente.

### Agente permanente

Un agente permanente se mantiene disponible para varios jobs.

Puede ser una máquina física, virtual o un proceso que se inicia de manera persistente.

Ventajas posibles:

- Herramientas ya instaladas.
- Inicio rápido de los trabajos.
- Entorno estable para tareas recurrentes.

Aspectos que requieren mantenimiento:

- Actualización del sistema.
- Gestión de espacio.
- Limpieza de archivos temporales.
- Rotación de credenciales.
- Supervisión del proceso.
- Control de cambios de configuración.

### Agente temporal

Un agente temporal se crea para una ejecución o para un periodo corto.

Puede ser aprovisionado en una nube, un clúster o un sistema de contenedores.

Ventajas posibles:

- Aislamiento entre ejecuciones.
- Menor acumulación de archivos.
- Entorno reconstruible.
- Posibilidad de ajustar capacidad bajo demanda.

Aspectos que requieren atención:

- Tiempo de creación.
- Coste de recursos.
- Gestión de imágenes.
- Disponibilidad de credenciales durante la ejecución.
- Limpieza correcta.
- Persistencia de artefactos fuera del agente.

### Elegir entre permanente y temporal

La decisión puede considerar:

- Frecuencia de uso.
- Tiempo de inicio.
- Aislamiento requerido.
- Coste.
- Herramientas específicas.
- Facilidad de reconstrucción.
- Seguridad del código que se ejecuta.

No hay una opción universalmente adecuada para todos los proyectos.

## Agentes en máquinas virtuales

Una máquina virtual puede funcionar como agente de Jenkins.

### Ventajas

Puede proporcionar:

- Un sistema operativo completo.
- Separación del anfitrión.
- Herramientas instaladas de forma controlada.
- Un entorno reproducible mediante imágenes o aprovisionamiento.
- Posibilidad de practicar administración de Linux o Windows.

### Consideraciones

Una máquina virtual necesita:

- CPU.
- Memoria.
- Almacenamiento.
- Conectividad.
- Mantenimiento del sistema invitado.
- Una forma segura de ejecutar el agente.
- Una política para actualizar y limpiar el entorno.

### Máquina virtual del curso

El repositorio del curso `agile611/startusingjenkins` describe un laboratorio basado en Vagrant y VirtualBox.

La máquina virtual puede servir para aprender a separar el entorno de Jenkins del anfitrión, dependiendo de la configuración actual del repositorio.

Antes de iniciarla:

- Lee el `README.md`.
- Revisa el `Vagrantfile`.
- Comprueba los puertos.
- Identifica qué servicios se aprovisionan.
- Confirma que tienes autorización y recursos.
- No presupongas que una máquina virtual es un agente de Jenkins si la configuración no lo indica.

### VM y agente no son sinónimos

Una máquina virtual puede alojar un agente, pero no se convierte automáticamente en agente por el hecho de existir.

Debe haber una configuración que permita a Jenkins reconocerla y utilizarla.

## Agentes en contenedores

Un contenedor puede utilizarse como agente o como entorno de ejecución.

### Posibles usos

- Ejecutar pruebas con dependencias aisladas.
- Construir una aplicación.
- Proporcionar herramientas a un pipeline.
- Crear un entorno temporal.
- Asegurar que varias ejecuciones utilizan una imagen conocida.

### Ventajas

- Entorno empaquetado.
- Inicio relativamente rápido cuando la imagen está disponible.
- Reutilización de definiciones.
- Posibilidad de descartar el entorno tras la ejecución.
- Separación entre dependencias del job y del anfitrión.

### Límites y riesgos

- El contenedor comparte el núcleo del anfitrión.
- Los permisos pueden ser demasiado amplios.
- Las imágenes pueden contener vulnerabilidades.
- Los volúmenes pueden exponer archivos del anfitrión.
- Una imagen etiquetada de forma ambigua puede cambiar con el tiempo.
- El almacenamiento puede crecer por imágenes y capas antiguas.

### Dockerfiles del repositorio del curso

El repositorio menciona archivos llamados `DockerfileAgent2404` y `DockerfileAgentAlpine`.

Antes de utilizarlos:

- Inspecciona su contenido.
- Compara las imágenes base.
- Identifica los paquetes instalados.
- Revisa el usuario configurado.
- Comprueba los comandos de inicio.
- Averigua cómo se conecta el agente con Jenkins.
- Sigue la práctica actual del curso.

No asumas qué herramientas contienen solo por el nombre del archivo.

## Formas habituales de conectar agentes

La conexión depende del sistema, de la versión de Jenkins y de la política de la organización.

### Agente iniciado por el controlador mediante SSH

En algunos entornos, Jenkins inicia una conexión SSH hacia una máquina agente.

Esto puede requerir:

- Dirección alcanzable.
- Usuario autorizado.
- Clave o credencial gestionada de forma segura.
- Cliente y servidor compatibles.
- Configuración de red y cortafuegos.
- Permisos adecuados en el sistema remoto.

No copies una clave privada a un repositorio ni a una máquina compartida sin autorización.

### Agente iniciado desde el nodo

En otros entornos, el agente inicia una conexión hacia el controlador.

Puede ser útil cuando el agente está detrás de una red que no permite conexiones entrantes desde el controlador.

El mecanismo exacto depende de la instalación y debe seguir las instrucciones oficiales del entorno.

### WebSocket

Algunas configuraciones permiten que un agente utilice WebSocket a través de una conexión existente.

Puede simplificar ciertos escenarios de red, pero no elimina la necesidad de autenticación y control de acceso.

### Agentes efímeros

Una plataforma puede crear y eliminar agentes bajo demanda.

El controlador o un plugin puede integrarse con contenedores, Kubernetes o servicios de nube, según la arquitectura.

Esta configuración puede ser más compleja que un agente fijo y requiere supervisar aprovisionamiento, permisos y coste.

### No abrir puertos sin entenderlos

Antes de modificar una regla de red, confirma:

- Qué proceso necesita el puerto.
- Quién inicia la conexión.
- Desde qué red se accede.
- Si existe cifrado y autenticación.
- Qué equipo administra la infraestructura.
- Si el cambio está autorizado.

## Herramientas instaladas en un agente

Un agente solo puede ejecutar las tareas para las que dispone de herramientas y configuración apropiadas.

### Herramientas habituales

Según el proyecto, pueden necesitarse:

- Git.
- Bash o PowerShell.
- Java.
- Python.
- Node.js.
- Docker.
- Terraform.
- Ansible.
- Compiladores.
- Herramientas de pruebas.
- Utilidades para generar paquetes.

No instales todas las herramientas posibles en cada agente. Instala o utiliza solo lo que una tarea requiere.

### Verificar una herramienta

En un job autorizado, se puede consultar la versión de una herramienta, por ejemplo:

```bash
git --version
```

o:

```bash
python3 --version
```

Estos comandos ayudan a saber qué ofrece el agente.

No ejecutes comandos que impriman todas las variables de entorno: podrían incluir datos sensibles.

### Diferencia entre herramientas del controlador y del agente

Una herramienta instalada en el controlador no tiene por qué estar disponible en el agente.

Del mismo modo, una herramienta instalada en tu equipo local no está necesariamente disponible en Jenkins.

Comprueba la herramienta en el nodo que ejecutará el job.

## Identidad y permisos del proceso agente

Los comandos se ejecutan con una identidad del sistema operativo.

### Consultar el usuario

En un agente Linux de laboratorio, un comando de consulta puede ser:

```bash
whoami
```

El resultado muestra el usuario efectivo del proceso que ejecuta el comando.

### Permisos necesarios

Un agente suele necesitar:

- Leer el código del proyecto.
- Escribir en su workspace.
- Ejecutar las herramientas requeridas.
- Acceder a servicios autorizados.
- Enviar resultados a Jenkins.

No necesita automáticamente:

- Acceso administrativo.
- Acceso a todas las carpetas del sistema.
- Credenciales de producción.
- Acceso a todos los repositorios.
- Permisos para administrar el controlador.

### Mínimo privilegio

Concede el nivel de acceso necesario y evita permisos adicionales.

Esto reduce el impacto si:

- Un script está mal escrito.
- Una dependencia se compromete.
- Un job ejecuta código no previsto.
- Un repositorio contiene instrucciones maliciosas.
- Una credencial se expone accidentalmente.

## Seguridad de los agentes

Los agentes ejecutan código. Por eso forman parte de la superficie de seguridad de Jenkins.

### Código de confianza diferente

No todos los trabajos tienen el mismo nivel de confianza.

Puede haber diferencias entre:

- Un job interno revisado.
- Una rama de desarrollo.
- Una solicitud de cambios externa.
- Un script de laboratorio.
- Un pipeline con acceso a un servicio sensible.

Los trabajos con distintos niveles de confianza no deberían compartir automáticamente los mismos permisos y agentes.

### Separar credenciales

Una credencial no debería estar disponible para todo agente y job.

Limita:

- Qué jobs pueden usarla.
- Qué agente puede acceder a ella.
- Qué permisos tiene.
- Cuánto tiempo se conserva.
- Quién puede cambiar su configuración.

### Contenedores y aislamiento

Un contenedor puede ayudar a separar dependencias, pero no elimina todos los riesgos.

Revisa:

- Usuario del contenedor.
- Privilegios.
- Volúmenes montados.
- Acceso al socket de Docker.
- Acceso a la red.
- Imagen base y actualizaciones.
- Posibilidad de comunicarse con otros servicios.

### Agentes compartidos

Un agente compartido puede ejecutar trabajos de varias personas o equipos.

Comprueba:

- Si el workspace se aísla.
- Si se limpian archivos entre ejecuciones.
- Si hay restricciones de concurrencia.
- Qué información puede permanecer en disco.
- Quién puede acceder a los logs y archivos.

## Recursos y capacidad

Un agente necesita recursos suficientes para completar sus trabajos.

### CPU

La CPU se consume en:

- Compilación.
- Pruebas.
- Compresión.
- Análisis estático.
- Construcción de imágenes.
- Ejecución concurrente.

Una cola de trabajos puede indicar falta de capacidad, pero también puede deberse a etiquetas o restricciones de configuración.

### Memoria

La memoria puede agotarse por:

- Aplicaciones de pruebas.
- Compilaciones grandes.
- Contenedores.
- Procesos paralelos.
- Fugas de memoria.
- Concurrencia excesiva.

Un agente con poca memoria puede terminar procesos o ralentizar otras tareas.

### Disco

El disco se utiliza para:

- Workspaces.
- Dependencias.
- Imágenes de contenedor.
- Resultados de pruebas.
- Logs.
- Archivos temporales.
- Cachés.

La limpieza debe seguir una política y no afectar datos compartidos.

### Red

La red se utiliza para:

- Obtener código.
- Descargar dependencias.
- Publicar artefactos.
- Acceder a servicios de prueba.
- Comunicar el agente con el controlador.

Una restricción de red puede ser intencionada y forma parte de la seguridad del entorno.

## Agentes y cachés

Una caché puede acelerar trabajos repetidos conservando datos reutilizables.

### Posibles cachés

- Dependencias de un gestor de paquetes.
- Capas de imágenes.
- Resultados de compilación.
- Archivos descargados.
- Datos de herramientas.

### Ventajas

- Menos descargas.
- Menor duración de algunas ejecuciones.
- Menor uso de red.
- Reutilización de trabajo previo.

### Riesgos

- Datos obsoletos.
- Contaminación entre proyectos.
- Resultados no reproducibles.
- Consumo de disco.
- Exposición de información entre jobs.

### Cuándo limpiar una caché

La limpieza debe realizarse mediante el procedimiento autorizado.

No borres directorios compartidos porque una ejecución parezca lenta.

Primero determina si la caché es responsable del problema.

## Etiquetas: práctica conceptual

En esta sesión aprenderás a seleccionar un agente mediante una etiqueta existente.

No crees ni cambies etiquetas globales.

### Preparación

Pregunta al docente qué etiqueta de laboratorio puedes utilizar.

Anota exactamente la etiqueta, respetando mayúsculas, minúsculas y espacios.

### Revisar agentes disponibles

En la interfaz de Jenkins, consulta la sección de nodos o agentes, si tu usuario tiene permiso de lectura.

Registra:

- Nombre del nodo.
- Estado.
- Etiquetas visibles.
- Cantidad de ejecutores.
- Si tiene trabajos en cola.
- Información que el curso permita consultar.

No cambies la configuración del nodo.

### Comparar capacidades

Completa esta tabla:

| Requisito del job | ¿Lo ofrece el agente? | Evidencia |
|---|---|---|
| Shell requerida | | |
| Git | | |
| Sistema operativo | | |
| Acceso al repositorio | | |
| Espacio disponible | | |
| Etiqueta autorizada | | |

### Resultado

Debes poder explicar por qué el agente elegido es adecuado para el job.

## Ejemplo de pipeline con etiqueta

Este ejemplo es ilustrativo. Sustituye `laboratorio` por una etiqueta real autorizada por el docente.

```groovy
pipeline {
    agent {
        label 'laboratorio'
    }

    stages {
        stage('Identificar agente') {
            steps {
                sh 'echo "Agente de laboratorio seleccionado"'
                sh 'uname -s'
                sh 'whoami'
            }
        }
    }
}
```

### Qué comprueba

- Que Jenkins puede encontrar un agente con esa etiqueta.
- Que el agente puede ejecutar comandos de shell.
- Que los comandos producen salida.

### Qué no comprueba

El ejemplo no verifica por sí solo:

- La calidad del agente.
- Su nivel de seguridad.
- La disponibilidad de todas las herramientas.
- La capacidad para ejecutar un proyecto real.
- El aislamiento respecto a otros jobs.

### Si el pipeline queda en cola

Comprueba:

- Que la etiqueta está escrita correctamente.
- Que existe un nodo que la tiene.
- Que el nodo está conectado.
- Que tiene un ejecutor disponible.
- Que el agente admite la tarea.
- Que la configuración de pipeline permite usarlo.

## Sesión práctica 1: identificar el agente utilizado

Esta actividad utiliza un job Freestyle o pipeline preparado por el docente.

### Duración orientativa

- Exploración de la interfaz: 5 minutos.
- Ejecución: 10 minutos.
- Análisis y comparación: 15 minutos.

### Instrucciones

1. Abre el job de práctica.
2. Revisa su descripción.
3. Identifica el agente o etiqueta configurada.
4. Inicia una ejecución si el docente lo indica.
5. Abre el log de consola.
6. Busca mensajes del nodo o agente.
7. Anota el sistema operativo y el usuario si se muestran.
8. Comprueba las herramientas requeridas.
9. Anota el resultado.
10. Compara el resultado con tu equipo local.

### Hoja de registro

| Dato | Observación |
|---|---|
| Nombre del job | |
| Ejecución | |
| Agente o nodo | |
| Etiqueta solicitada | |
| Sistema operativo | |
| Usuario del proceso | |
| Herramientas consultadas | |
| Resultado | |
| Observaciones | |

### Preguntas

- ¿Dónde se ejecutó el comando?
- ¿Qué evidencia lo demuestra?
- ¿Qué diferencias observaste frente a tu equipo?
- ¿Qué herramienta faltaría para ejecutar una compilación?
- ¿Qué información no sería seguro publicar?

## Sesión práctica 2: job Freestyle con información del nodo

Esta actividad ejecuta consultas simples en un agente Linux de laboratorio.

### Requisitos

- Job Freestyle de laboratorio.
- Permiso para ejecutarlo.
- Agente Linux autorizado.
- Herramientas básicas instaladas.

### Comandos de ejemplo

```bash
echo "Identificación del entorno"
echo "Sistema:"
uname -s
echo "Usuario:"
whoami
echo "Directorio de trabajo:"
pwd
echo "Espacio de disco disponible:"
df -h .
```

El último comando consulta el espacio del sistema de archivos correspondiente al directorio actual.

No ejecutes `env` ni imprimas variables globales.

### Ejecutar

1. Guarda la configuración con el docente.
2. Comprueba que el job utiliza el agente de laboratorio.
3. Inicia una ejecución.
4. Abre la consola.
5. Registra la salida.
6. Comprueba el resultado.
7. No publiques rutas o datos internos sin autorización.

### Preguntas de análisis

- ¿Qué representa `pwd` en esta ejecución?
- ¿Qué usuario aparece?
- ¿Qué diferencia hay entre el espacio disponible en el agente y en tu equipo?
- ¿Por qué el job no debe imprimir todas las variables de entorno?
- ¿Qué recurso podría limitar trabajos simultáneos?

## Sesión práctica 3: identificar un agente desde el pipeline

Esta sesión utiliza un pipeline preparado por el docente o el ejemplo anterior.

### Objetivo

Comparar la información del agente con el entorno local.

### Instrucciones

1. Ejecuta el pipeline en un agente autorizado.
2. Anota el sistema operativo.
3. Consulta la versión de Git.
4. Consulta la ruta del workspace.
5. Compara con tu entorno local.
6. Identifica una diferencia que podría provocar un fallo.
7. Propón una forma de documentarla.

### Ejemplo de pasos de consulta

```groovy
pipeline {
    agent any

    stages {
        stage('Inspeccionar agente') {
            steps {
                sh 'echo "Sistema:"'
                sh 'uname -s'
                sh 'echo "Git:"'
                sh 'git --version'
                sh 'echo "Directorio:"'
                sh 'pwd'
            }
        }
    }
}
```

El ejemplo supone un agente compatible con shell Unix.

Si la instancia utiliza Windows, el docente debe proporcionar una variante apropiada.

### Registro comparativo

| Elemento | Equipo local | Agente Jenkins |
|---|---|---|
| Sistema operativo | | |
| Versión de Git | | |
| Shell | | |
| Ruta de trabajo | | |
| Herramientas | | |
| Diferencia importante | | |

## Sesión práctica 4: observar un agente desconectado o no disponible

Esta actividad puede realizarse mediante observación de una captura o un entorno preparado por el docente. No desconectes agentes compartidos.

### Escenario

Un job solicita una etiqueta que solo está asignada a un nodo desconectado.

### Analizar el estado

Determina:

- Qué etiqueta solicita el job.
- Qué nodo debería ejecutarlo.
- Si el nodo está conectado.
- Cuántos ejecutores tiene disponibles.
- Qué mensaje aparece en la cola.
- Qué acción corresponde al administrador.

### Preguntas

- ¿El código ya empezó a ejecutarse?
- ¿Qué diferencia hay entre esperar un agente y fallar una prueba?
- ¿Por qué iniciar otra ejecución no necesariamente resuelve el problema?
- ¿Qué dato debería enviar el alumno al administrador?
- ¿Qué cambio sería inadecuado hacer sin permiso?

### Resultado esperado

Explica por qué el job no se ha iniciado y qué información permitiría resolver la situación sin cambiar la configuración por cuenta propia.

## Sesión práctica 5: usar una etiqueta de laboratorio

Realiza la práctica solo con una etiqueta proporcionada por el docente.

### Obtener la etiqueta

Anota el nombre exacto:

```text
Etiqueta autorizada:
```

No inventes una etiqueta.

### Configurar Freestyle

En la configuración del job, selecciona la opción que limita la ejecución a un nodo o etiqueta.

La ubicación y el nombre de la opción pueden variar.

### Añadir un paso de consulta

```bash
echo "Etiqueta de laboratorio solicitada"
uname -s
whoami
```

### Ejecutar

1. Guarda el job.
2. Comprueba la etiqueta configurada.
3. Inicia una ejecución.
4. Confirma en el log que la ejecución se asignó a un agente.
5. Registra el resultado.
6. Comprueba si la ejecución esperó en cola.

### Interpretar la cola

Si el job queda esperando, no lo inicies repetidamente.

Verifica con el docente:

- La etiqueta.
- El estado del agente.
- La disponibilidad del ejecutor.
- La política de asignación.

### Reflexión

- ¿Qué ventaja ofrece limitar el job a una etiqueta?
- ¿Qué riesgo introduce depender de un único nodo?
- ¿Qué debería documentarse sobre ese agente?

## Sesión práctica 6: comparar herramientas locales y del agente

Un problema común es que un comando funcione localmente pero no en Jenkins.

### Preparar una lista de herramientas

Incluye solo las necesarias para el ejercicio:

```text
Git:
Shell:
Lenguaje:
Herramienta de pruebas:
Empaquetador:
Contenedor, si corresponde:
```

### Consultar en el equipo local

Desde la terminal, consulta solo las herramientas autorizadas y disponibles.

Ejemplos:

```bash
git --version
```

```bash
python3 --version
```

No ejecutes un comando que no esté instalado con el objetivo de modificar el sistema sin permiso.

### Consultar en el agente

Utiliza un job de consulta aprobado por el docente.

Por ejemplo:

```bash
git --version
```

Si el agente es Linux y Python forma parte del ejercicio:

```bash
python3 --version
```

### Comparar

Anota:

- Herramientas comunes.
- Versiones distintas.
- Herramientas ausentes.
- Diferencias de sistema operativo.
- Diferencias que afectan al código.
- Qué debería instalarse o fijarse en la imagen del agente.

### Conclusión

Una diferencia entre entornos no siempre requiere «instalar lo último».

Puede requerir:

- Utilizar la versión del proyecto.
- Actualizar la imagen del agente.
- Elegir otro agente.
- Documentar una dependencia.
- Adaptar el pipeline de forma controlada.

## Sesión práctica 7: etiquetar necesidades de un proyecto

Diseña requisitos de agente para tres tareas hipotéticas.

### Tarea A: validar Markdown

Necesita:

- Acceso a los archivos.
- Un validador de Markdown, si el curso lo solicita.
- Una shell compatible.
- Sin credenciales externas.

### Tarea B: ejecutar pruebas de una aplicación Java

Puede necesitar:

- Java compatible.
- Herramienta de construcción adecuada.
- Memoria suficiente.
- Acceso a dependencias.
- Sin permisos de producción.

### Tarea C: construir una imagen Docker

Puede necesitar:

- Cliente o servicio de construcción autorizado.
- Acceso a una imagen base.
- Espacio de disco.
- Permisos cuidadosamente limitados.
- Una política para publicar o conservar la imagen.

### Completar la matriz

| Tarea | Herramientas | Sistema operativo | Recursos | Acceso de red | Permisos |
|---|---|---|---|---|---|
| Validar Markdown | | | | | |
| Pruebas Java | | | | | |
| Construir imagen | | | | | |

### Discusión

- ¿Podrían las tres tareas compartir un agente?
- ¿Qué herramientas deberían estar separadas?
- ¿Qué acceso de red puede limitarse?
- ¿Qué tarea presenta mayor riesgo?
- ¿Qué etiquetas describirían capacidades sin revelar datos sensibles?

## Sesión práctica 8: revisar seguridad de un agente

Esta actividad analiza un escenario, no requiere cambiar la configuración.

### Escenario

Un agente comparte espacio con jobs de varios proyectos.

Tiene una credencial con acceso de escritura a varios repositorios y también puede iniciar despliegues.

Algunos jobs ejecutan cambios enviados por personas externas.

### Identificar riesgos

Anota los riesgos relacionados con:

- Credenciales.
- Código no confiable.
- Workspaces.
- Red.
- Permisos.
- Concurrencia.
- Logs.
- Persistencia de archivos.

### Proponer controles

Sugiere medidas como:

- Separar agentes por nivel de confianza.
- Limitar permisos de las credenciales.
- Restringir la red.
- Usar workspaces aislados.
- Revisar el código antes de proporcionar credenciales.
- Utilizar agentes temporales para determinadas tareas.
- Evitar acceso a producción desde jobs de pruebas.
- Limpiar recursos según una política revisada.

### Preguntas

- ¿Qué información adicional se necesita?
- ¿Qué control ofrecería mayor reducción de riesgo?
- ¿Qué medida podría romper una práctica legítima?
- ¿Cómo verificarías que el control funciona?

## Sesión práctica 9: redactar una ficha de agente

Completa la ficha para el agente usado en la práctica.

```text
Nombre:
Tipo de nodo:
Estado:
Sistema operativo:
Etiqueta:
Ejecutores:
Herramientas disponibles:
Forma de conexión, si se conoce:
Responsable:
Permisos:
Repositorios accesibles:
Red necesaria:
Workspace:
Política de limpieza:
Limitaciones:
Fecha de revisión:
```

No incluyas:

- Contraseñas.
- Tokens.
- Claves privadas.
- Direcciones internas no autorizadas.
- Datos personales innecesarios.

### Revisar la ficha

Comprueba que la información sea:

- Relevante.
- Actual.
- No sensible.
- Suficiente para seleccionar el agente.
- Fácil de entender para otro alumno.

## Agente Linux, Windows y otros sistemas

Jenkins puede ejecutar tareas en nodos con diferentes sistemas operativos.

### Agente Linux

Puede ser adecuado cuando los proyectos utilizan:

- Bash.
- Herramientas disponibles en distribuciones Linux.
- Contenedores Linux.
- Sistemas de construcción dirigidos a Linux.

Las rutas pueden distinguir mayúsculas y minúsculas.

### Agente Windows

Puede ser adecuado para:

- Aplicaciones que requieren herramientas de Windows.
- Pruebas de compatibilidad.
- Construcción de software específico de Windows.
- Ejecución de scripts de PowerShell o `bat`.

Los comandos de Bash no se ejecutan automáticamente como en Linux.

### Agente macOS

Puede ser necesario para tareas que dependan de herramientas o plataformas de Apple.

La administración y disponibilidad de estos nodos suelen tener requisitos específicos.

### Compatibilidad de scripts

Un script puede depender de:

- La shell.
- La ruta.
- Las utilidades del sistema.
- Los finales de línea.
- El formato de archivos.
- Los permisos de ejecución.
- La codificación.

Documenta el sistema operativo esperado y utiliza comandos compatibles con el agente elegido.

## Workspaces y concurrencia en agentes

El workspace es uno de los puntos donde el comportamiento del agente puede afectar una ejecución.

### Workspaces reutilizados

Un workspace reutilizado puede contener archivos de una ejecución anterior.

Esto puede provocar:

- Que una prueba pase por usar un archivo antiguo.
- Que una construcción omita un paso.
- Que el job consuma espacio adicional.
- Que una ejecución interfiera con otra.

### Workspaces concurrentes

Si varias ejecuciones comparten una ruta o recurso, podrían sobrescribirse archivos.

Comprueba que Jenkins proporcione un workspace adecuado a cada ejecución o que el job gestione la concurrencia.

### Limpieza controlada

Antes de limpiar:

- Confirma el directorio.
- Comprueba si es compartido.
- Determina qué archivos se perderán.
- Conserva artefactos requeridos.
- Sigue la política del administrador.

No uses un comando amplio de borrado para «arreglar» un workspace sin verificar la ruta.

## Agentes y Docker

Docker puede intervenir de distintas maneras en Jenkins. Conviene distinguir los casos.

### Docker como herramienta en un agente

El agente puede tener una herramienta Docker que utiliza para construir o ejecutar contenedores.

Esto puede requerir acceso al daemon y permisos que deben revisarse.

### Agente ejecutado dentro de un contenedor

El proceso agente puede ejecutarse dentro de un contenedor.

El contenedor debe incluir las herramientas requeridas por el job y una forma autorizada de comunicarse con Jenkins.

### Contenedor de aplicación

Un pipeline puede utilizar Docker para construir la aplicación, mientras el agente se ejecuta de otra manera.

No todos los contenedores de un pipeline son agentes.

### Acceso al socket de Docker

El acceso al socket del daemon puede conceder capacidades muy elevadas sobre el anfitrión.

No montes el socket en un contenedor sin entender el riesgo y seguir las instrucciones del administrador.

### Imágenes de agentes del curso

Si utilizas `DockerfileAgent2404` o `DockerfileAgentAlpine`:

- Inspecciona el Dockerfile.
- Comprueba la imagen base.
- Confirma las herramientas.
- Revisa el usuario.
- Averigua cómo se inicia el agente.
- Comprueba qué datos persisten.
- Sigue el procedimiento del curso.

## Agentes y credenciales

Las credenciales pueden estar disponibles para una ejecución en función del job, del agente y de las reglas de Jenkins.

### Credencial de lectura

Un job que solo necesita clonar un repositorio privado debería usar, si es posible, una credencial limitada a lectura.

### Credencial de publicación

Un agente que publica artefactos necesita acceso al destino autorizado, pero no necesariamente acceso a producción.

### Credencial de despliegue

Un job de despliegue puede requerir una credencial con permisos específicos.

Esa credencial no debería estar disponible para todos los jobs del agente.

### Preguntas para revisar una credencial

- ¿Qué recurso permite modificar?
- ¿Qué jobs pueden usarla?
- ¿Qué agente la necesita?
- ¿Puede limitarse a lectura?
- ¿Cómo se rota?
- ¿Qué sucede si se expone?
- ¿Cómo se evita que aparezca en los logs?

## Observabilidad del agente

Los nodos necesitan supervisión para que el equipo detecte problemas de capacidad o conectividad.

### Señales posibles

- Estado conectado o desconectado.
- Número de ejecutores disponibles.
- Trabajos en cola.
- Uso de CPU.
- Uso de memoria.
- Espacio de disco.
- Errores de conexión.
- Duración de las tareas.
- Cantidad de ejecuciones fallidas.

### Interpretar señales con contexto

Un agente desconectado puede deberse a:

- Mantenimiento.
- Problema de red.
- Proceso agente detenido.
- Sistema anfitrión apagado.
- Credencial caducada.
- Actualización.
- Configuración incorrecta.

Una señal aislada no identifica necesariamente la causa.

### Qué registrar en una incidencia

Anota:

- Nombre del nodo.
- Hora.
- Estado observado.
- Job afectado.
- Mensaje de Jenkins.
- Cambios recientes.
- Si otros nodos tienen el mismo problema.
- Qué consultas ya se realizaron.

## Diagnóstico de problemas de agentes

### El agente aparece desconectado

Comprueba, si tienes permiso:

- Si el sistema está encendido.
- Si el proceso agente está iniciado.
- Si el controlador es accesible.
- Si la red permite la comunicación.
- Si hubo una actualización o mantenimiento.
- Si la autenticación sigue vigente.

No reinicies servicios compartidos sin autorización.

### El job queda en cola

Posibles causas:

- No existe un nodo con la etiqueta.
- El nodo está desconectado.
- No hay ejecutores disponibles.
- El job requiere una capacidad no disponible.
- Hay una restricción de concurrencia.
- El agente no acepta nuevos trabajos.

Revisa el motivo que muestra Jenkins.

### El agente pierde conexión durante la ejecución

Posibles causas:

- Interrupción de red.
- Reinicio del nodo.
- Falta de memoria.
- Fallo del proceso agente.
- Mantenimiento.
- Inactividad del sistema.

El resultado puede quedar fallido o interrumpido según el momento y la configuración.

### El comando requerido no existe

Comprueba:

- La herramienta en el agente.
- La versión disponible.
- El `PATH`.
- El shell utilizado.
- Si el agente es el esperado.
- Si la imagen o máquina se actualizó.

No intentes instalar paquetes desde el job sin autorización.

### El job se asigna a un agente inadecuado

Comprueba:

- La etiqueta solicitada.
- Las etiquetas de los nodos.
- Las reglas del pipeline.
- La configuración del job.
- Si varios agentes comparten etiqueta pero tienen capacidades distintas.

Corrige las etiquetas mediante el procedimiento de administración, no desde una cuenta sin permisos.

### Falta espacio en disco

Comprueba:

- Tamaño de workspaces.
- Artefactos retenidos.
- Logs.
- Cachés.
- Imágenes de contenedor.
- Archivos temporales.

La limpieza corresponde al responsable del entorno y debe preservar datos necesarios.

### El agente no obtiene el repositorio

Comprueba:

- URL.
- Conectividad.
- Certificados.
- Credencial.
- Permisos de lectura.
- Rama.
- Configuración del plugin.
- Proxy o VPN.

No copies la credencial en el comando para evitar configurar el acceso correctamente.

## Método de diagnóstico paso a paso

Utiliza un proceso ordenado y evita cambiar varias cosas a la vez.

### Paso 1: identificar el síntoma

Describe qué ocurre:

- El job espera.
- El agente aparece desconectado.
- Un comando no existe.
- El checkout falla.
- El proceso se interrumpe.
- El job se ejecuta en un nodo inesperado.

### Paso 2: identificar el alcance

Comprueba:

- Si ocurre en un job o en varios.
- Si ocurre en un agente o en varios.
- Si empezó después de un cambio.
- Si otros alumnos ven el mismo problema.
- Si afecta a una herramienta o a toda la conectividad.

### Paso 3: consultar la evidencia

Revisa:

- Estado del agente.
- Cola del job.
- Consola de ejecución.
- Nombre del nodo.
- Etiquetas.
- Herramientas disponibles.
- Mensaje de error.

### Paso 4: formular una hipótesis

La hipótesis debe explicar la evidencia observada.

Ejemplo:

```text
El job está en cola porque la etiqueta solicitada no coincide
con ninguna etiqueta de un agente conectado.
```

### Paso 5: solicitar ayuda o realizar una comprobación autorizada

No cambies la configuración global para probar una hipótesis.

Consulta al administrador si el paso requiere acceso elevado.

### Paso 6: documentar el resultado

Anota:

- Causa confirmada.
- Cambio aplicado.
- Resultado después del cambio.
- Prevención propuesta.
- Si hay que actualizar la ficha del agente.

## Errores comunes de diseño

### Agente con demasiadas herramientas

Instalar todo en un único nodo aumenta mantenimiento y puede ampliar riesgos.

Asigna herramientas según necesidades reales.

### Agente compartido por trabajos de confianza distinta

Puede permitir que un trabajo acceda a datos o archivos de otro.

Considera aislamiento, credenciales y limpieza.

### Etiqueta que no refleja la realidad

Si una etiqueta afirma que un nodo tiene una herramienta que ya no está disponible, los jobs pueden fallar de manera inesperada.

Mantén las etiquetas y la documentación actualizadas.

### Demasiados ejecutores

Puede saturar el nodo y hacer que todos los trabajos tarden más.

Mide el uso de recursos antes de aumentar la concurrencia.

### Dependencia de archivos persistentes

Un job que solo funciona porque encuentra un archivo antiguo en el agente no es reproducible.

Incluye las entradas en el repositorio o documenta su origen mediante el mecanismo autorizado.

### Acceso de red ilimitado

Un agente que puede conectarse a cualquier destino tiene más capacidad de la necesaria.

Limita la red de acuerdo con las tareas que debe ejecutar.

### Credenciales compartidas en el nodo

No almacenes credenciales de forma manual en un archivo local del agente.

Utiliza el sistema de credenciales autorizado y limita su alcance.

## Buenas prácticas

### Documentar capacidades

Registra:

- Sistema operativo.
- Herramientas.
- Versiones relevantes.
- Etiquetas.
- Recursos.
- Restricciones.
- Responsable.

### Separar responsabilidades

Mantén clara la diferencia entre:

- Coordinación del controlador.
- Ejecución del agente.
- Configuración del job.
- Estado del workspace.
- Almacenamiento de artefactos.

### Limitar los permisos

Concede solo lo necesario a:

- Usuarios.
- Jobs.
- Credenciales.
- Agentes.
- Contenedores.

### Revisar las etiquetas

Las etiquetas deben reflejar capacidades reales, no ser nombres decorativos.

### Evitar ejecutar trabajo no confiable en agentes privilegiados

Aísla los trabajos que procesan código de origen desconocido o de confianza diferente.

### Supervisar recursos

Revisa CPU, memoria, disco, red, ejecutores y cola.

### Mantener imágenes y sistemas

Actualiza los agentes según un procedimiento planificado y prueba los cambios antes de afectar a jobs importantes.

### Limpiar con criterio

La limpieza debe estar documentada, limitada al área correspondiente y coordinada con la retención de artefactos.

## Ficha de documentación de un agente

Utiliza esta plantilla para registrar un agente de laboratorio.

```text
Nombre del nodo:
Tipo de entorno:
Estado:
Sistema operativo:
Versión:
Etiquetas:
Número de ejecutores:
Herramientas disponibles:
Workspace o política de workspace:
Método de conexión:
Red necesaria:
Repositorios accesibles:
Credenciales autorizadas:
Uso previsto:
Restricciones:
Responsable:
Procedimiento de mantenimiento:
Fecha de revisión:
```

### Evitar incluir información sensible

No añadas a la ficha:

- Contraseñas.
- Tokens.
- Claves privadas.
- Datos personales innecesarios.
- Direcciones internas no autorizadas.
- Detalles que expongan la seguridad del laboratorio.

## Checklist antes de asignar un job a un agente

- [ ] El agente está autorizado para el proyecto.
- [ ] La etiqueta corresponde a una capacidad real.
- [ ] El sistema operativo es compatible.
- [ ] Las herramientas requeridas están disponibles.
- [ ] El workspace es adecuado.
- [ ] Los permisos son mínimos.
- [ ] El acceso a red está justificado.
- [ ] Las credenciales no se comparten innecesariamente.
- [ ] La concurrencia es aceptable.
- [ ] El responsable del agente está identificado.
- [ ] El job no afecta sistemas fuera del laboratorio.

## Checklist al investigar un agente

- [ ] ¿Está conectado?
- [ ] ¿Qué etiqueta solicita el job?
- [ ] ¿Qué etiquetas tiene el nodo?
- [ ] ¿Tiene ejecutores disponibles?
- [ ] ¿Qué usuario ejecuta el proceso?
- [ ] ¿Qué herramientas están instaladas?
- [ ] ¿Hay espacio disponible?
- [ ] ¿El controlador puede comunicarse con el agente?
- [ ] ¿El job tiene permisos suficientes y no excesivos?
- [ ] ¿Se han revisado los logs pertinentes?
- [ ] ¿Se han ocultado secretos antes de compartir evidencia?

## Preguntas de repaso

1. ¿Qué diferencia hay entre el controlador y un agente?
2. ¿Qué representa un nodo?
3. ¿Qué función cumple un ejecutor?
4. ¿Qué información puede contener un workspace?
5. ¿Por qué no debe asumirse que un workspace es permanente?
6. ¿Qué problema resuelven las etiquetas?
7. ¿Qué puede ocurrir si un job solicita una etiqueta inexistente?
8. ¿Por qué aumentar ejecutores puede reducir el rendimiento?
9. ¿Qué diferencia hay entre un agente permanente y uno temporal?
10. ¿Qué ventajas puede ofrecer un agente en contenedor?
11. ¿Qué riesgo introduce el acceso al socket de Docker?
12. ¿Por qué conviene separar trabajos de distinto nivel de confianza?
13. ¿Qué permisos necesita un agente para ejecutar una validación sencilla?
14. ¿Qué información permite identificar dónde se ejecutó un job?
15. ¿Qué revisarías si el job queda en cola?
16. ¿Por qué no se deben guardar credenciales manualmente en el agente?
17. ¿Cómo pueden las diferencias entre Linux y Windows afectar a un job?
18. ¿Qué diferencia hay entre un contenedor y un agente?
19. ¿Qué métricas podrían indicar que un agente está saturado?
20. ¿Qué información incluirías en una ficha de agente?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«El controlador coordina Jenkins y el agente ejecuta las tareas asignadas».

### Afirmación 2

«Un nodo y un ejecutor son exactamente lo mismo».

### Afirmación 3

«Una etiqueta puede expresar qué capacidades necesita un job».

### Afirmación 4

«Un job con `agent any` puede utilizar cualquier máquina del mundo».

### Afirmación 5

«Un agente desconectado puede hacer que un job espere en cola».

### Afirmación 6

«Aumentar los ejecutores siempre hace que los jobs terminen antes».

### Afirmación 7

«Un contenedor puede utilizarse como entorno de agente».

### Afirmación 8

«Un contenedor elimina todos los riesgos de ejecutar código no confiable».

### Afirmación 9

«El agente debería tener acceso a las credenciales de producción para facilitar futuras tareas».

### Afirmación 10

«Las herramientas deben verificarse en el agente donde se ejecuta el job».

### Afirmación 11

«Una etiqueta debe representar capacidades que se mantienen actualizadas».

### Afirmación 12

«El controlador y el agente pueden estar en sistemas distintos».

### Afirmación 13

«Un workspace puede contener archivos temporales de una ejecución».

### Afirmación 14

«Si un job está en cola, siempre hay un error en el código fuente».

### Afirmación 15

«Un agente temporal puede ayudar a aislar ejecuciones si está configurado correctamente».

## Respuestas orientativas del ejercicio

### Afirmación 1

**Correcta.** Esa es la distinción básica entre coordinación y ejecución.

### Afirmación 2

**Incorrecta.** El nodo es el sistema o entorno; un ejecutor representa capacidad de ejecución.

### Afirmación 3

**Correcta.** Las etiquetas ayudan a seleccionar nodos compatibles.

### Afirmación 4

**Incorrecta.** `agent any` se refiere a los agentes disponibles y configurados en Jenkins.

### Afirmación 5

**Correcta.** Si no hay un agente compatible, el job puede quedarse esperando.

### Afirmación 6

**Incorrecta.** La concurrencia puede saturar recursos y ralentizar las tareas.

### Afirmación 7

**Correcta.** Un contenedor puede formar parte de la arquitectura de ejecución.

### Afirmación 8

**Incorrecta.** Los contenedores ofrecen aislamiento, pero no eliminan todos los riesgos.

### Afirmación 9

**Incorrecta.** Los permisos y credenciales deben limitarse a lo necesario.

### Afirmación 10

**Correcta.** Las herramientas locales no necesariamente están instaladas en el agente.

### Afirmación 11

**Correcta.** Las etiquetas obsoletas pueden enviar jobs al nodo equivocado.

### Afirmación 12

**Correcta.** Esa separación es habitual en arquitecturas distribuidas.

### Afirmación 13

**Correcta.** El workspace contiene datos de trabajo, normalmente temporales o sujetos a limpieza.

### Afirmación 14

**Incorrecta.** Puede faltar un agente, una etiqueta, un ejecutor o una conexión.

### Afirmación 15

**Correcta.** El aislamiento depende de cómo se cree, configure y limpie el agente.

## Glosario

- **Agente:** proceso que permite a Jenkins ejecutar tareas en un nodo.
- **Agente temporal:** agente creado para una ejecución o periodo limitado.
- **Controlador:** componente central que coordina Jenkins y presenta su interfaz.
- **Ejecutor:** capacidad de un nodo para ejecutar una tarea.
- **Etiqueta:** nombre que describe una capacidad o grupo de nodos.
- **Nodo:** máquina o entorno registrado en Jenkins.
- **Nodo integrado:** nodo asociado al sistema donde se ejecuta el controlador.
- **Concurrencia:** ejecución de varias tareas al mismo tiempo.
- **Workspace:** directorio de trabajo asociado a un job o ejecución.
- **Contenedor:** entorno aislado que ejecuta procesos sobre el núcleo del sistema anfitrión.
- **Máquina virtual:** entorno virtualizado que ejecuta un sistema operativo invitado.
- **Mínimo privilegio:** principio de conceder solo los permisos necesarios.
- **Job en cola:** ejecución que espera a que haya un agente compatible y disponible.
- **Agente desconectado:** nodo cuyo proceso agente no mantiene comunicación con el controlador.
- **Capacidad:** recursos y herramientas disponibles para ejecutar tareas.

## Resumen

- El controlador coordina Jenkins; los agentes ejecutan los pasos en nodos.
- Un nodo representa un sistema o entorno; un ejecutor representa capacidad para ejecutar trabajos.
- Las etiquetas permiten solicitar agentes con capacidades concretas.
- Un job puede quedar en cola si no hay un nodo compatible o un ejecutor disponible.
- Aumentar la concurrencia no siempre mejora el rendimiento.
- Los agentes pueden ser máquinas, máquinas virtuales, contenedores o entornos temporales.
- Las herramientas deben comprobarse en el agente que ejecutará el job.
- Los agentes deben tener permisos, credenciales y acceso de red limitados.
- La seguridad del agente es especialmente importante porque puede ejecutar código del repositorio.
- La documentación del nodo facilita seleccionar agentes y resolver problemas.