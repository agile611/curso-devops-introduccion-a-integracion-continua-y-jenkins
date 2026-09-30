# Arquitectura e instalación de Jenkins

Jenkins es un servidor de automatización que ejecuta tareas como obtener código, realizar pruebas, construir artefactos y coordinar despliegues. Para utilizarlo correctamente, conviene entender primero sus componentes, cómo se comunican y qué recursos necesitan.

Esta unidad utiliza como referencia el repositorio del curso [`agile611/startusingjenkins`](https://github.com/agile611/startusingjenkins). Su documentación describe un entorno local educativo basado en Vagrant y VirtualBox, y menciona scripts relacionados con Docker, Jenkins y SonarQube. Los archivos del repositorio pueden cambiar: **comprueba siempre su contenido y el README antes de ejecutar comandos**.

La instalación de Jenkins debe realizarse únicamente en un equipo o entorno autorizado para prácticas. Los pasos de esta unidad priorizan la instalación local y aislada; no son una guía para exponer Jenkins directamente a Internet ni para configurar un servidor de producción.

## Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Describir los componentes principales de una instalación de Jenkins.
- Explicar la función del controlador y de los agentes.
- Entender el papel de los ejecutores, los jobs, los pipelines y los plugins.
- Comparar una instalación en máquina virtual con una instalación en contenedor.
- Inspeccionar la arquitectura definida en un `Vagrantfile`.
- Preparar un entorno local de laboratorio.
- Iniciar y detener una máquina virtual de práctica.
- Acceder a la interfaz web de Jenkins.
- Completar la configuración inicial de una instancia de laboratorio.
- Identificar riesgos relacionados con puertos, permisos y credenciales.
- Investigar errores habituales de instalación y conectividad.
- Documentar la configuración para que otra persona pueda reproducirla.

## Alcance de esta unidad

Esta página se centra en la **arquitectura básica y la instalación de Jenkins para aprendizaje**.

No pretende cubrir completamente:

- Una instalación de alta disponibilidad.
- La operación de Jenkins a gran escala.
- La gestión empresarial de identidades.
- La configuración de seguridad avanzada.
- El diseño de una plataforma de producción.
- La administración de una nube real.
- La publicación de Jenkins en una red pública.

Un servidor Jenkins expuesto de forma insegura puede permitir ejecutar código y acceder a recursos. Para entornos reales se necesita una revisión específica de seguridad, redes, credenciales, actualizaciones, copias de seguridad y controles de acceso.

## Jenkins en pocas palabras

Jenkins es un servidor de automatización extensible. Recibe trabajos, los ejecuta en uno o varios nodos y presenta los resultados en una interfaz web.

Puede utilizarse para:

- Ejecutar pruebas cuando cambia el código.
- Construir aplicaciones.
- Crear paquetes o imágenes de contenedor.
- Ejecutar análisis estático.
- Automatizar tareas repetitivas.
- Conservar artefactos e informes.
- Coordinar procesos de entrega y despliegue.

Jenkins no decide por sí solo qué significa «software de calidad». El equipo debe definir qué comprobar, cómo interpretar los resultados y qué hacer cuando algo falla.

### Jenkins no es solo una interfaz web

La interfaz permite configurar y consultar trabajos, pero el sistema también necesita:

- Un proceso servidor en ejecución.
- Un espacio de almacenamiento.
- Una configuración de seguridad.
- Java compatible con la versión instalada de Jenkins.
- Agentes o capacidad de ejecución.
- Acceso al código y a las dependencias.
- Una política para instalar y actualizar plugins.
- Una forma de respaldar la configuración y los datos importantes.

### Jenkins no reemplaza Git

Git guarda el historial del código. Jenkins puede obtener ese código y automatizar tareas sobre él.

Un flujo habitual es:

1. El código se guarda en un repositorio Git.
2. Un cambio llega al repositorio.
3. Jenkins detecta o recibe el evento.
4. Jenkins obtiene una revisión concreta.
5. Ejecuta el pipeline definido por el equipo.
6. Presenta los resultados.

El repositorio y Jenkins son componentes diferentes, aunque trabajen juntos.

### Jenkins no garantiza despliegues seguros

Un pipeline puede desplegar una aplicación de forma automática, pero eso no garantiza que el proceso sea seguro.

La seguridad depende, entre otros factores, de:

- Las pruebas ejecutadas.
- Los permisos del pipeline.
- La protección de credenciales.
- La revisión de los cambios.
- La configuración de los agentes.
- La estrategia de despliegue.
- La capacidad de observar y recuperar el servicio.

## Arquitectura básica de Jenkins

La arquitectura de Jenkins se puede entender separando la coordinación de la ejecución.

### Controlador de Jenkins

El **controlador** es el componente central que administra Jenkins.

Puede encargarse de:

- Servir la interfaz web.
- Administrar usuarios y permisos.
- Cargar la configuración.
- Programar y coordinar trabajos.
- Gestionar plugins.
- Registrar el estado de las ejecuciones.
- Comunicar resultados.
- Coordinar agentes.
- Conservar metadatos, informes y configuraciones.

El controlador necesita recursos propios, como memoria, CPU y almacenamiento. Una instalación de laboratorio puede ejecutar tareas sencillas en el mismo sistema, pero separar la coordinación y la ejecución suele facilitar la administración.

### Agentes de Jenkins

Un **agente** es un nodo donde Jenkins puede ejecutar tareas.

Un agente puede ser:

- El mismo sistema que ejecuta el controlador.
- Una máquina virtual.
- Un servidor remoto.
- Un contenedor.
- Un nodo temporal creado para una ejecución.

Los agentes permiten distribuir trabajo y utilizar entornos diferentes.

Por ejemplo, un equipo podría tener:

- Un agente Linux para pruebas generales.
- Un agente con Docker para construir imágenes.
- Un agente Windows para validar una aplicación de escritorio.
- Un agente temporal para una compilación aislada.

La configuración real depende del proyecto y de la infraestructura disponible.

### Ejecutores

Un **ejecutor** representa una capacidad de ejecución disponible en un nodo.

Si un agente tiene varios ejecutores, puede ejecutar más de un trabajo al mismo tiempo. Esto también significa que esos trabajos compiten por CPU, memoria, almacenamiento y acceso a servicios.

Aumentar el número de ejecutores sin revisar los recursos puede hacer que las ejecuciones sean más lentas o inestables.

### Espacio de trabajo

El **workspace** es el directorio donde Jenkins prepara los archivos de una ejecución.

Puede contener:

- Una copia del repositorio.
- Archivos generados.
- Resultados de pruebas.
- Paquetes temporales.
- Registros específicos de la ejecución.

No debe confundirse el workspace con un almacén permanente. Los archivos pueden borrarse o reemplazarse según la configuración del job y del agente.

### Pipeline

Un **pipeline** describe una secuencia de tareas automatizadas.

Puede incluir etapas para:

- Obtener el código.
- Validar archivos.
- Instalar dependencias.
- Ejecutar pruebas.
- Construir un artefacto.
- Publicar informes.
- Desplegar en un entorno.

En Jenkins, los pipelines pueden definirse en la interfaz o como código, habitualmente en un archivo llamado `Jenkinsfile`.

### Plugins

Los **plugins** amplían Jenkins e integran herramientas o servicios.

Pueden añadir:

- Nuevos tipos de pipeline.
- Integración con sistemas Git.
- Informes de pruebas.
- Conexiones con registros de artefactos.
- Autenticación externa.
- Integraciones con herramientas de análisis.

Los plugins también pueden introducir riesgos de mantenimiento o seguridad. Instala solo los necesarios y revisa su procedencia, compatibilidad y estado.

### Almacenamiento persistente

Jenkins conserva datos en su directorio de inicio, habitualmente conocido como `JENKINS_HOME`.

Según la instalación, puede almacenar:

- Configuración.
- Jobs.
- Historial de ejecuciones.
- Plugins.
- Credenciales cifradas.
- Registros.
- Metadatos.
- Configuración de agentes.

La ubicación exacta debe verificarse en la instalación concreta. Si Jenkins se ejecuta dentro de un contenedor, es importante entender cómo se persiste ese directorio.

## Flujo de comunicación

El controlador y los agentes necesitan comunicarse para coordinar tareas.

### Interfaz web

La interfaz web permite a las personas usuarias interactuar con Jenkins.

Puede utilizarse para:

- Consultar el estado general.
- Ver jobs y pipelines.
- Iniciar ejecuciones manuales.
- Consultar logs.
- Administrar plugins.
- Configurar usuarios y credenciales, según los permisos.

La dirección y el puerto dependen de la instalación.

El README del repositorio del curso menciona Jenkins en el puerto `8080` como valor habitual. **Comprueba el `Vagrantfile`, los scripts y la configuración real** antes de asumir que ese puerto se utiliza en tu entorno.

### Conexión a repositorios

Jenkins necesita obtener el código fuente.

Puede hacerlo mediante:

- HTTPS.
- SSH.
- Un webhook que avisa de cambios.
- Un sondeo periódico del repositorio.
- Una ejecución manual.

El acceso debe limitarse al repositorio necesario. No conviene otorgar permisos amplios si el job solo necesita leer código.

### Comunicación con agentes

El controlador necesita comunicarse con sus agentes según el método configurado.

En una instalación de laboratorio, puede que el agente y el controlador estén en la misma máquina. En una instalación distribuida, intervienen redes, certificados, permisos y reglas de cortafuegos.

No abras puertos adicionales sin conocer:

- Qué proceso los utiliza.
- Desde qué redes son accesibles.
- Qué método de comunicación está configurado.
- Qué controles de seguridad se aplican.

### Acceso a dependencias y servicios

Durante una ejecución, un pipeline puede necesitar conectarse a:

- Repositorios de paquetes.
- Registros de contenedores.
- Servicios de pruebas.
- Bases de datos de laboratorio.
- Sistemas de análisis.
- Almacenes de artefactos.

La conectividad necesaria debe definirse por tarea. Evita conceder acceso de red irrestricto a agentes que no lo necesitan.

## Diagrama conceptual

```text
Persona usuaria
      |
      | Navegador web
      v
Controlador Jenkins
      |
      | Programa una ejecución
      v
Agente Jenkins
      |
      +--> Obtiene código desde Git
      |
      +--> Ejecuta validaciones y pruebas
      |
      +--> Construye artefactos
      |
      +--> Publica resultados
      |
      +--> Despliega si el pipeline lo permite
```

Este esquema es conceptual. En una práctica pequeña, varios componentes pueden compartir una máquina. En una plataforma de mayor tamaño, pueden estar separados y ejecutarse en sistemas distintos.

## Componentes y responsabilidades

La siguiente tabla resume los componentes principales.

| Componente | Responsabilidad | Pregunta útil |
|---|---|---|
| Controlador | Coordinar Jenkins y presentar su interfaz | ¿Dónde se guarda la configuración? |
| Agente | Ejecutar tareas de un pipeline | ¿Qué permisos necesita? |
| Ejecutor | Determinar tareas simultáneas en un nodo | ¿Hay recursos para la concurrencia? |
| Workspace | Contener archivos de una ejecución | ¿Cuándo se limpia? |
| Plugin | Añadir una integración o función | ¿Es necesario y compatible? |
| Repositorio Git | Mantener código e historial | ¿Qué acceso requiere Jenkins? |
| Artefacto | Resultado generado por el pipeline | ¿Cómo se identifica y conserva? |

En la práctica, la instalación solo es una parte de la arquitectura. También hay que decidir qué usuarios pueden hacer qué, dónde se ejecuta el código y cómo se conservan los datos.

## Opciones de instalación

Jenkins puede instalarse de distintas maneras. La opción adecuada depende del objetivo de la práctica, del equipo y de los requisitos.

### Máquina virtual con Vagrant

El repositorio del curso utiliza Vagrant y VirtualBox como ruta de laboratorio.

Una máquina virtual permite ejecutar un sistema operativo separado del anfitrión. Puede facilitar la reproducción del entorno y reducir el impacto de cambios sobre el sistema principal.

Ventajas posibles:

- Aislamiento respecto al sistema anfitrión.
- Entorno definido en un `Vagrantfile`.
- Práctica de administración básica de Linux.
- Posibilidad de detener la máquina sin eliminarla.
- Aproximación a una instalación sobre servidor.

Aspectos que hay que considerar:

- Consumo de memoria y almacenamiento.
- Disponibilidad de virtualización.
- Descarga de cajas de Vagrant.
- Configuración de puertos.
- Tiempo de aprovisionamiento.
- Necesidad de inspeccionar el `Vagrantfile`.

### Contenedor Docker

El repositorio también incluye archivos y scripts relacionados con Docker.

Un contenedor puede resultar útil para practicar servicios o agentes sin crear una máquina virtual completa.

Ventajas posibles:

- Inicio rápido, si la imagen ya está disponible.
- Entorno empaquetado.
- Reutilización de imágenes.
- Facilidad para practicar redes y volúmenes.

Aspectos que hay que considerar:

- Necesidad de entender el `Dockerfile` y los argumentos.
- Persistencia de los datos de Jenkins.
- Permisos del daemon de Docker.
- Gestión de imágenes y volúmenes.
- Diferencias entre el contenedor y el anfitrión.
- Riesgos de ejecutar código dentro de un contenedor con privilegios excesivos.

### Instalación en un servidor Linux

Una instalación sobre Linux puede ser útil para aprender a administrar un servicio.

Requiere comprender:

- El sistema de paquetes.
- La versión de Java requerida.
- El servicio que ejecuta Jenkins.
- Los permisos del usuario del servicio.
- La configuración de red.
- Las actualizaciones.
- Los logs.
- La persistencia de datos.

Esta opción debe realizarse únicamente en una máquina de laboratorio o con autorización administrativa.

### Servicio gestionado

Algunas organizaciones utilizan plataformas gestionadas o servicios en la nube.

La administración del sistema subyacente puede quedar parcialmente a cargo del proveedor, pero siguen siendo necesarias decisiones sobre:

- Usuarios y permisos.
- Plugins e integraciones.
- Credenciales.
- Redes.
- Agentes.
- Retención de artefactos.
- Auditoría y recuperación.

Esta unidad no configura un servicio gestionado.

### Comparación de opciones

| Opción | Aislamiento | Administración del sistema | Adecuada para |
|---|---|---|---|
| Vagrant y VirtualBox | Máquina virtual | Parte importante | Laboratorio Linux reproducible |
| Docker | Contenedor | Depende del anfitrión | Servicios y agentes de práctica |
| Servidor Linux | Depende del servidor | Administración directa | Aprender operación del servicio |
| Servicio gestionado | Según el proveedor | Parcialmente delegada | Entornos organizativos |

La opción del curso debe determinarse por las instrucciones del laboratorio y no solo por preferencia personal.

## Instalación de referencia del curso

La ruta de referencia de esta unidad es el entorno del repositorio `agile611/startusingjenkins`.

La página del proyecto describe un entorno local con Vagrant y VirtualBox y menciona los siguientes comandos de referencia:

```bash
vagrant up
```

```bash
vagrant ssh jenkins
```

Los comandos solo deben utilizarse después de revisar el README y el `Vagrantfile` actuales, y de confirmar que el laboratorio permite crear la máquina.

### Qué aporta el repositorio

El repositorio ofrece archivos para explorar y utilizar en prácticas, entre ellos:

- `README.md`.
- `Vagrantfile`.
- Scripts relacionados con Docker.
- Scripts relacionados con Jenkins.
- Un script relacionado con SonarQube.
- Scripts de ayuda relacionados con Terraform y Ansible.
- Dockerfiles para agentes de Jenkins.
- `.gitignore`.

La presencia de un archivo no significa que debas ejecutarlo en todas las sesiones.

### Qué no se debe asumir

No asumas que:

- El puerto de Jenkins es siempre `8080`.
- SonarQube está instalado o iniciado por defecto.
- El sistema operativo de la máquina coincide con el de tu ordenador.
- Los scripts funcionan igual en todos los sistemas.
- Un contenedor conserva datos si se elimina.
- El entorno es adecuado para producción.
- El repositorio ha permanecido sin cambios desde que se redactó esta documentación.

Comprueba cada aspecto en la versión actual del proyecto.

## Preparar el equipo anfitrión

El **anfitrión** es el equipo que ejecuta Vagrant, VirtualBox o Docker. La máquina virtual o el contenedor son entornos invitados o aislados.

### Comprobar el sistema operativo

En Linux, ejecuta:

```bash
cat /etc/os-release
```

En Windows, utiliza la información del sistema o las herramientas del entorno que haya preparado el curso.

En macOS, consulta la información del sistema y las versiones de las herramientas indicadas por el laboratorio.

### Comprobar Git

```bash
git --version
```

Git se utiliza para clonar el repositorio y consultar sus cambios.

### Comprobar Vagrant

```bash
vagrant --version
```

Si el comando no existe, Vagrant puede no estar instalado o no estar en el `PATH`.

No instales una versión al azar en un equipo administrado. Sigue la guía del laboratorio.

### Comprobar VirtualBox

En algunos sistemas, este comando muestra la versión de VirtualBox:

```bash
VBoxManage --version
```

El nombre o la disponibilidad de la herramienta puede variar según la instalación.

### Revisar espacio libre

En Linux, puedes consultar el espacio disponible con:

```bash
df -h "$HOME"
```

Las cajas de Vagrant, las máquinas virtuales, las imágenes de Docker y los datos de Jenkins pueden ocupar bastante espacio.

### Revisar memoria

En Linux:

```bash
free -h
```

Si vas a ejecutar Jenkins y otras herramientas a la vez, cierra aplicaciones que no necesites. Sigue los requisitos indicados por el docente para asignar recursos a la máquina virtual.

## Clonar y explorar el repositorio

Trabaja desde un directorio dedicado.

### Crear el directorio de trabajo

```bash
mkdir -p "$HOME/repos"
cd "$HOME/repos"
```

### Clonar el repositorio

```bash
git clone https://github.com/agile611/startusingjenkins.git
```

### Entrar en el repositorio

```bash
cd startusingjenkins
```

### Comprobar el estado

```bash
git status
```

### Listar los archivos

```bash
ls -la
```

Para explorar hasta dos niveles:

```bash
find . -maxdepth 2 -type f -print | sort
```

### Leer el README

```bash
less README.md
```

Anota qué herramientas requiere el proyecto, qué comandos propone y qué puertos menciona.

### Leer el `Vagrantfile`

```bash
less Vagrantfile
```

Identifica qué máquina define, qué caja utiliza, qué recursos especifica y qué pasos de aprovisionamiento aparecen.

### Inspeccionar los scripts

Consulta los scripts sin ejecutarlos:

```bash
less docker.sh
```

```bash
less jenkins.sh
```

```bash
less sonarqube.sh
```

El nombre de un script no describe por completo sus efectos. Lee el contenido y contrástalo con el README.

## Revisar la arquitectura antes de iniciar Vagrant

La máquina virtual debe conocerse antes de crearla.

### Identificar la caja base

Busca referencias a la caja en el `Vagrantfile`:

```bash
grep -nEi 'box|config.vm' Vagrantfile
```

La caja base es una imagen utilizada para crear el sistema invitado.

Comprueba que la fuente y la versión coincidan con las instrucciones del curso.

### Revisar la red y los puertos

Busca configuraciones de red:

```bash
grep -nEi 'network|forwarded_port|private_network|public_network' Vagrantfile
```

Determina:

- Qué servicio escucha dentro de la máquina.
- Qué puerto se expone en el anfitrión.
- Si la dirección es local o accesible desde una red.
- Si existe riesgo de conflicto con otro servicio.

### Revisar los recursos asignados

Busca referencias a memoria y procesadores:

```bash
grep -nEi 'memory|cpus|processors' Vagrantfile
```

Puede que esos valores estén definidos en un bloque de configuración específico del proveedor.

No cambies recursos sin considerar la memoria disponible en el anfitrión.

### Revisar los pasos de aprovisionamiento

Busca configuraciones de aprovisionamiento:

```bash
grep -nEi 'provision|shell|ansible|docker|chef|puppet' Vagrantfile
```

Un paso de aprovisionamiento puede instalar paquetes o cambiar la configuración de la máquina.

Lee los archivos asociados antes de iniciar la máquina.

### Crear una hoja de inspección

Antes de ejecutar Vagrant, completa:

| Aspecto | Valor observado |
|---|---|
| Nombre de la máquina | |
| Caja base | |
| Proveedor | |
| Memoria configurada | |
| Procesadores configurados | |
| Puertos reenviados | |
| Carpetas compartidas | |
| Pasos de aprovisionamiento | |
| Riesgos o dudas | |

## Iniciar la máquina virtual de laboratorio

Realiza esta práctica solo si tienes Vagrant y VirtualBox disponibles y autorización para crear la máquina.

### Confirmar el directorio

El comando de Vagrant debe ejecutarse desde el directorio que contiene el `Vagrantfile`.

Compruébalo:

```bash
pwd
ls -l Vagrantfile
```

### Consultar el estado inicial

```bash
vagrant status
```

Si el directorio contiene una máquina definida, Vagrant informará de su estado.

### Iniciar el entorno

Después de revisar los archivos y confirmar los requisitos:

```bash
vagrant up
```

La primera ejecución puede tardar más porque Vagrant quizá tenga que descargar la caja y ejecutar el aprovisionamiento.

Lee los mensajes en lugar de cerrar la sesión inmediatamente si aparece una demora.

### Comprobar el estado final

```bash
vagrant status
```

### Conectarse a la máquina

El README del repositorio muestra esta forma de conexión:

```bash
vagrant ssh jenkins
```

Utiliza el nombre `jenkins` únicamente si coincide con la configuración actual del proyecto.

Al conectarte, ya estás en la máquina invitada. El directorio actual y las herramientas disponibles pueden ser distintos a los del anfitrión.

### Salir de la sesión remota

Para salir de la sesión SSH de Vagrant:

```bash
exit
```

Salir de la terminal remota no apaga necesariamente la máquina virtual.

### Detener la máquina

Desde el anfitrión y desde el directorio correspondiente:

```bash
vagrant halt
```

Este comando intenta apagar la máquina sin eliminarla.

### Destruir la máquina

La eliminación de una máquina puede borrar datos almacenados dentro de ella.

No uses `vagrant destroy` como método habitual para detener la práctica. Utilízalo solo cuando el curso indique limpiar completamente el laboratorio y hayas confirmado qué datos se perderán.

## Comprobar Jenkins después del inicio

El método de acceso depende de cómo esté configurado el entorno.

### Consultar la URL en el README

El README del repositorio menciona Jenkins en el puerto `8080` como valor por defecto configurable.

Comprueba la URL exacta en:

- El README actual.
- El `Vagrantfile`.
- El script de inicio.
- La configuración del servicio.
- Las indicaciones del docente.

### Abrir la interfaz web

Si la configuración lo indica, abre en un navegador la URL local correspondiente.

Una dirección de ejemplo podría utilizar `localhost` y el puerto asignado, pero no la uses hasta confirmar el mapeo real del laboratorio.

No asumas que todas las instalaciones exponen Jenkins en el mismo puerto.

### Verificar la conexión desde la terminal

Si `curl` está disponible y conoces la URL correcta:

```bash
curl -I URL_DE_JENKINS
```

Sustituye `URL_DE_JENKINS` por la dirección real proporcionada por la práctica.

Una respuesta HTTP demuestra que hay un servicio respondiendo, pero no confirma por sí sola que Jenkins esté completamente configurado.

### Si la página no carga

Comprueba, en este orden:

1. Que la máquina virtual está en ejecución.
2. Que Jenkins está iniciado dentro de la máquina.
3. Que la URL coincide con la configuración.
4. Que el puerto no está ocupado o mal reenviado.
5. Que el servicio ha terminado de iniciar.
6. Que el navegador accede al anfitrión correcto.
7. Que no se necesita VPN o una configuración de red específica.
8. Que los logs no muestran un error de inicio.

No reinicies la máquina repetidamente sin revisar los mensajes de error.

## Configuración inicial de Jenkins

Al abrir una instalación nueva de Jenkins, puede mostrarse un asistente de configuración inicial.

La interfaz y los pasos pueden variar según la versión instalada.

### Desbloqueo inicial

Jenkins puede solicitar una contraseña inicial de administrador.

El método para obtenerla depende de la instalación:

- Un paquete del sistema puede guardarla en una ruta indicada por la documentación.
- Una imagen de contenedor puede mostrarla en los logs iniciales.
- Un laboratorio educativo puede proporcionarla mediante un script o una guía.
- Una configuración administrada puede completar esa fase de otra forma.

Utiliza únicamente el procedimiento documentado para tu instancia.

No busques ni compartas contraseñas de una instalación ajena.

### Instalar plugins iniciales

El asistente puede ofrecer la instalación de plugins recomendados o la selección manual de plugins.

Para una práctica:

- Sigue la opción recomendada por el curso.
- Evita instalar plugins por curiosidad en una instancia compartida.
- Lee el nombre y la función del plugin.
- Ten en cuenta que la instalación puede tardar.
- No interrumpas el proceso salvo que el docente lo indique.

### Crear la cuenta administrativa

Utiliza una cuenta de laboratorio siguiendo las instrucciones del curso.

No reutilices la contraseña personal de correo, GitHub, la universidad o el trabajo.

En una instancia compartida, no cambies el acceso de otras personas ni intentes recuperar cuentas sin autorización.

### Configurar la URL

Jenkins puede pedir una URL de instancia.

Comprueba que:

- Coincida con la dirección que utiliza el laboratorio.
- Refleje el puerto reenviado correcto.
- No exponga por error una dirección interna.
- Sea accesible desde el navegador previsto.

### Terminar la configuración

Al finalizar:

- Comprueba que aparece el panel principal.
- Anota la URL del laboratorio.
- No guardes contraseñas en un documento público.
- Verifica que tu cuenta puede acceder a las funciones previstas.
- Pregunta al docente si la página de bienvenida difiere del ejemplo.

## Instalación mediante contenedor

El repositorio incluye archivos relacionados con Docker, pero el modo exacto de ejecución debe verificarse en la versión actual de sus scripts.

Esta sección explica los conceptos y propone una secuencia de inspección. No sustituye las instrucciones concretas del repositorio.

### Inspeccionar el script de Docker

Antes de ejecutar `docker.sh`:

```bash
less docker.sh
```

Anota:

- Las imágenes utilizadas.
- Los nombres de los contenedores.
- Los puertos publicados.
- Los volúmenes.
- Las redes creadas.
- Los comandos de limpieza.
- Las variables de configuración.
- Los permisos requeridos.

### Consultar el estado de Docker

```bash
docker --version
```

```bash
docker ps
```

El segundo comando puede fallar si Docker no está instalado, no está iniciado o el usuario no tiene permisos.

No cambies permisos del sistema para evitar el error sin consultar al administrador.

### Comprender la persistencia

Si Jenkins se ejecuta en un contenedor, su directorio de datos debería gestionarse de forma explícita.

Comprueba:

- Si se usa un volumen con nombre.
- Si se monta una carpeta del anfitrión.
- Qué sucede al detener el contenedor.
- Qué sucede al eliminarlo.
- Cómo se respaldan los datos.

No elimines volúmenes de laboratorio hasta confirmar que no contienen datos necesarios para el grupo.

### Contenedor efímero y contenedor persistente

Un contenedor puede ser:

- **Efímero:** se usa para una tarea temporal.
- **Persistente:** se combina con almacenamiento que conserva datos.

El ciclo de vida del contenedor y el del volumen son distintos. Eliminar un contenedor no necesariamente elimina el volumen; borrar un volumen sí puede eliminar los datos que contiene.

### No exponer servicios sin necesidad

Antes de publicar un puerto:

- Comprueba a qué interfaz de red se enlaza.
- Comprueba qué redes pueden acceder.
- Confirma el uso del puerto.
- Aplica las restricciones del laboratorio.
- No publiques Jenkins directamente en Internet para completar una práctica.

## Java y compatibilidad

Jenkins necesita una versión compatible de Java para la versión concreta de Jenkins instalada.

La versión requerida puede cambiar con el tiempo. No utilices una tabla de compatibilidad antigua sin verificarla en la documentación oficial de la versión que vas a instalar.

### Consultar Java

En la máquina donde se ejecuta Jenkins:

```bash
java -version
```

Si Jenkins corre dentro de un contenedor, comprueba Java dentro del contenedor o revisa la imagen utilizada.

### Comparar controlador y agentes

El controlador y los agentes pueden tener sistemas y herramientas distintas.

Comprueba:

- La versión de Java del controlador.
- La versión de Java requerida en los agentes.
- Las herramientas que utiliza el pipeline.
- El sistema operativo del agente.
- La compatibilidad de plugins.

No des por sentado que la versión de Java de tu ordenador local es la que usa Jenkins.

### Instalar Java

La instalación debe seguir el procedimiento adecuado para el sistema y la versión.

En una máquina de laboratorio Ubuntu, el curso puede proporcionar instrucciones con APT. No instales paquetes en un equipo compartido sin autorización.

Antes de instalar:

- Revisa el nombre del paquete.
- Comprueba la versión requerida.
- Confirma si el curso tiene un script de aprovisionamiento.
- Evita mantener instalaciones duplicadas sin necesidad.

## Recursos de la instalación

Jenkins consume recursos incluso cuando no hay trabajos activos. Las compilaciones y pruebas pueden consumir bastante más.

### Memoria

La memoria necesaria depende de:

- El número de jobs simultáneos.
- La cantidad de plugins.
- El tamaño del proyecto.
- Las herramientas ejecutadas.
- El número de agentes.
- El número de ejecutores.
- El uso de análisis o pruebas intensivas.

Un laboratorio pequeño no debe dimensionarse como una plataforma de producción.

### CPU

La CPU afecta a:

- La velocidad de las compilaciones.
- La ejecución de pruebas.
- El procesamiento de plugins.
- La respuesta de la interfaz.

Varios trabajos simultáneos pueden competir por procesador.

### Almacenamiento

El almacenamiento se utiliza para:

- Datos de Jenkins.
- Historial de ejecuciones.
- Workspaces.
- Plugins.
- Artefactos.
- Logs.
- Imágenes de contenedor.
- Cajas de Vagrant y discos virtuales.

Comprueba el espacio antes de iniciar una práctica con descargas grandes.

### Ejecutores y concurrencia

El número de ejecutores afecta a la cantidad de tareas simultáneas.

Un valor alto puede saturar el sistema si hay poca memoria o CPU.

Para un laboratorio, el objetivo principal es aprender el flujo, no maximizar la concurrencia.

## Puertos y acceso de red

El acceso de red debe limitarse al alcance necesario.

### Puerto de Jenkins

El README del repositorio del curso menciona `8080` como puerto por defecto configurable.

Confirma el puerto real en la configuración del laboratorio antes de abrir el navegador.

### Puerto de SonarQube

El README menciona `9000` para SonarQube como valor por defecto configurable.

SonarQube es opcional en algunas actividades. No es necesario iniciarlo para cada práctica de Jenkins.

### Detectar un conflicto de puerto

En Linux, este comando puede mostrar puertos TCP en escucha:

```bash
ss -ltn
```

La herramienta y su salida pueden variar según el sistema operativo.

No finalices un proceso que ocupa un puerto hasta identificarlo y comprobar que tienes autorización.

### Acceso local y acceso de red

`localhost` hace referencia al equipo desde el que se realiza la petición.

En una máquina virtual, el acceso puede depender de:

- Reenvío de puertos.
- Red privada.
- Red pública.
- Adaptadores de VirtualBox.
- Reglas de cortafuegos.
- La dirección del anfitrión.

La dirección que funciona dentro de la máquina virtual puede no funcionar desde el navegador del anfitrión, y viceversa.

### Protección de la interfaz web

En un laboratorio local:

- Limita el acceso a la máquina o red necesaria.
- Utiliza credenciales de práctica.
- No publiques la interfaz en una red abierta.
- No reutilices credenciales reales.
- Cierra o detén el laboratorio al terminar, según las instrucciones.

## Almacenamiento y copias de seguridad

La instalación de Jenkins debe conservar su configuración si se espera recuperar el entorno después de reiniciarlo.

### Datos importantes

Puede ser necesario conservar:

- Configuración de jobs.
- Pipeline y referencias de repositorio.
- Historial de ejecuciones.
- Plugins y sus versiones.
- Configuración de usuarios.
- Credenciales gestionadas.
- Metadatos de artefactos.
- Configuración de agentes.

El contenido exacto depende de la instalación.

### Respaldar una instalación de laboratorio

Para un laboratorio, sigue la guía proporcionada por el curso.

No copies el directorio de datos de Jenkins mientras el servicio está modificándolo, a menos que el procedimiento de respaldo garantice consistencia.

### Restaurar

Antes de restaurar:

- Comprueba la versión de Jenkins.
- Comprueba la compatibilidad de plugins.
- Asegúrate de que el respaldo procede de una fuente autorizada.
- Confirma dónde se restaurará.
- No sobrescribas los datos de otra persona.

### Limpiar el laboratorio

Distingue entre:

- Detener Jenkins.
- Detener un contenedor.
- Apagar una máquina virtual.
- Eliminar un contenedor.
- Eliminar un volumen.
- Destruir una máquina virtual.
- Borrar el directorio de datos.

Cada acción tiene efectos distintos. Sigue las instrucciones de limpieza de la práctica.

## Usuarios, credenciales y permisos

Jenkins ejecuta código y puede acceder a sistemas externos. La gestión de acceso es una parte importante de su arquitectura.

### Cuenta administrativa

Una cuenta administrativa puede cambiar plugins, usuarios, credenciales y configuración de Jenkins.

No utilices una cuenta administrativa para todas las tareas del día a día cuando el entorno requiera roles distintos.

### Usuarios del laboratorio

En un Jenkins compartido:

- Utiliza la cuenta asignada.
- No cambies permisos globales.
- No elimines jobs ajenos.
- No modifiques las credenciales de grupo.
- Pregunta antes de instalar plugins.
- Evita ejecutar trabajos que consuman recursos excesivos.

### Credenciales de Jenkins

Las credenciales deben almacenarse en el mecanismo de credenciales de Jenkins o en el sistema aprobado por el curso.

No las guardes en:

- Un `Jenkinsfile`.
- El código de la aplicación.
- El `README.md`.
- Un archivo de configuración confirmado en Git.
- Un log de consola.
- Una captura de pantalla compartida.

### Identificadores de credenciales

Los pipelines suelen referenciar credenciales mediante identificadores, no mediante su valor literal.

El identificador puede aparecer en un `Jenkinsfile`; el secreto no debería aparecer.

### Permisos del agente

Un agente debe tener únicamente los permisos requeridos para sus tareas.

Por ejemplo:

- Un agente de pruebas no necesita por defecto permisos de producción.
- Un agente de compilación no necesita administrar el controlador.
- Una tarea de análisis no debería poder borrar recursos de infraestructura.
- Una credencial de solo lectura no debería permitir modificar repositorios.

## Plugins y actualizaciones

Los plugins amplían Jenkins, pero pueden afectar a la estabilidad y seguridad.

### Elegir plugins

Antes de instalar un plugin, determina:

- Qué problema resuelve.
- Si Jenkins ya ofrece la función.
- Si el plugin es compatible con la versión instalada.
- Si se mantiene activamente.
- Qué permisos o integraciones requiere.
- Si la práctica realmente lo necesita.

### No instalar en una instancia compartida sin permiso

La instalación o actualización de plugins puede:

- Cambiar el comportamiento de Jenkins.
- Requerir reinicio.
- Afectar a otros usuarios.
- Introducir incompatibilidades.
- Aumentar la superficie de ataque.

En un laboratorio administrado, las modificaciones suelen corresponder a la persona responsable del entorno.

### Actualizar Jenkins

Antes de una actualización:

- Consulta la documentación de la versión.
- Revisa los requisitos de Java.
- Comprueba la compatibilidad de plugins.
- Respaldar la configuración según el procedimiento aprobado.
- Planifica una ventana de mantenimiento.
- Comprueba el resultado después de la actualización.

No actualices la instancia compartida como parte de una práctica sin autorización.

## Logs y diagnóstico

Los registros ayudan a entender por qué una instalación o un job fallan.

### Logs de la interfaz

La consola de un job muestra los comandos y resultados que Jenkins presenta para esa ejecución.

Comprueba:

- En qué etapa falla.
- Qué comando se estaba ejecutando.
- El código de salida.
- Si falta una herramienta.
- Si falló la conexión a un servicio.
- Si se expuso información sensible accidentalmente.

### Logs del servicio

Los logs del proceso Jenkins dependen de cómo se instaló.

Pueden consultarse mediante:

- La herramienta de servicios del sistema.
- La salida de un contenedor.
- Los registros de la máquina virtual.
- Un archivo de log indicado por la instalación.
- La documentación del laboratorio.

No supongas una ruta universal. Comprueba el método de instalación.

### Mensajes útiles

Un mensaje de diagnóstico debería ayudar a distinguir:

- Error de configuración.
- Error de red.
- Falta de memoria.
- Problema de permisos.
- Dependencia ausente.
- Fallo de plugin.
- Error del pipeline.
- Servicio todavía en proceso de inicio.

### No publicar logs completos sin revisarlos

Los logs pueden contener:

- Rutas personales.
- Nombres de usuarios.
- Direcciones internas.
- Variables de entorno.
- Información del repositorio.
- Datos sensibles impresos por un script.

Elimina secretos y datos que no deban compartirse antes de publicar un fragmento.

## Instalar Jenkins en un laboratorio Linux: modelo de comprensión

Esta sección describe los pasos conceptuales de una instalación de paquetes, pero no reemplaza las instrucciones vigentes del curso ni la documentación oficial de la versión concreta.

### Pasos conceptuales

Una instalación de Jenkins sobre Linux suele implicar:

1. Preparar el sistema.
2. Instalar una versión compatible de Java.
3. Configurar el repositorio de paquetes de Jenkins.
4. Instalar el paquete de Jenkins.
5. Iniciar el servicio.
6. Confirmar su estado.
7. Abrir el puerto necesario de forma controlada.
8. Completar la configuración inicial.
9. Revisar los logs.
10. Documentar la instalación.

Los comandos exactos cambian según la distribución y la versión.

### Confirmar la distribución

```bash
cat /etc/os-release
```

Sigue instrucciones diseñadas para esa distribución concreta.

No combines comandos de Ubuntu, Debian, Fedora y Alpine en una sola guía sin explicar sus diferencias.

### Confirmar Java

```bash
java -version
```

Verifica la versión requerida por la versión de Jenkins que vas a instalar.

### Instalar desde fuentes confiables

Si el curso indica instalar Jenkins mediante un repositorio de paquetes:

- Utiliza la guía oficial vigente.
- Comprueba la firma y la procedencia del repositorio.
- No descargues paquetes desde sitios desconocidos.
- No copies claves o comandos antiguos sin validar su vigencia.
- No desactives la verificación de certificados para evitar errores.

### Iniciar el servicio

El método depende de la instalación y del sistema de servicios.

En sistemas con `systemd`, el docente puede indicar el uso de `systemctl`. Comprueba antes el nombre real de la unidad y el procedimiento permitido.

No inicies, detengas o reinicies servicios compartidos sin autorización.

### Validar el resultado

Después de instalar, confirma:

- Que el paquete instalado es el esperado.
- Que Java es compatible.
- Que el proceso está activo.
- Que los logs no muestran errores graves.
- Que la interfaz responde en la dirección correcta.
- Que el puerto no queda expuesto fuera del alcance de laboratorio.

## Instalar Jenkins en Docker: modelo de comprensión

El repositorio del curso contiene recursos relacionados con Docker, pero el modo exacto de utilizar Jenkins en contenedores debe obtenerse del README y de los scripts actuales.

### Elementos de una instalación en contenedor

Comprueba:

- La imagen de Jenkins.
- La etiqueta de versión.
- Los puertos.
- Los volúmenes.
- Las variables de entorno.
- Los permisos.
- La red.
- La configuración de actualización.
- El procedimiento de parada y limpieza.

### Etiquetas de imagen

Una etiqueta indica una versión o variante de una imagen.

Evita utilizar una etiqueta ambigua en una práctica que requiera reproducibilidad.

Elige la versión indicada por el curso y registra cuál se utilizó.

### Montaje de datos

Si la configuración monta datos persistentes, comprueba el origen y el destino.

Una carpeta del anfitrión puede conservar información fuera del contenedor. Un volumen con nombre puede tener un ciclo de vida diferente.

No cambies rutas o permisos hasta entender qué directorio contiene la configuración de Jenkins.

### Agentes en contenedor

Los Dockerfiles `DockerfileAgent2404` y `DockerfileAgentAlpine` del repositorio parecen estar orientados a agentes. Inspecciona su contenido antes de construirlos.

Comprueba:

- Qué herramientas instalan.
- Qué usuario ejecuta los comandos.
- Qué directorios crean.
- Qué imagen base emplean.
- Qué necesita el controlador para conectarse al agente.
- Si la imagen está pensada para una práctica específica.

## Primera sesión con Jenkins

Una vez que la instancia esté en marcha y autorizada, utiliza una sesión breve para familiarizarte con la interfaz.

### Antes de iniciar sesión

Confirma:

- La URL.
- La cuenta de laboratorio.
- Si la instancia es compartida.
- Qué acciones están permitidas.
- Qué jobs puedes ejecutar.
- Qué recursos no debes modificar.

### Recorrer la página principal

Identifica:

- El nombre de la instancia.
- El menú principal.
- Los jobs visibles.
- El estado de las últimas ejecuciones.
- La sección de administración, si tu usuario puede verla.
- Los avisos de actualización o configuración.

No modifiques la configuración global durante esta exploración.

### Crear un job de prueba

Crea un job solo si la práctica lo solicita y tienes permisos.

Utiliza un nombre claro, por ejemplo:

```text
practica-entorno-alumno
```

Evita nombres que puedan confundirse con jobs compartidos o de producción.

### Ejecutar un comando inocuo

Si el ejercicio permite una tarea de shell, utiliza un comando de consulta que no cambie el sistema, por ejemplo:

```bash
echo "Ejecución de prueba"
```

Un job de Jenkins puede ejecutarse en un agente distinto del controlador. Comprueba en qué nodo corre.

### Consultar la consola

Después de la ejecución:

- Abre la salida de consola.
- Identifica el comando ejecutado.
- Revisa el resultado.
- Comprueba la duración.
- Distingue un job completado de uno que se haya omitido o cancelado.

### Eliminar un job de prueba

Elimina únicamente el job que creaste y solo si el ejercicio lo indica.

En una instancia compartida, confirma el nombre y la propiedad antes de borrar cualquier elemento.

## Sesión práctica 1: reconocer componentes de la arquitectura

Esta actividad se puede realizar en grupos pequeños.

### Duración

- Lectura del escenario: 5 minutos.
- Análisis del diagrama: 10 minutos.
- Presentación: 10 minutos.

### Escenario

Un equipo tiene Jenkins instalado en una máquina virtual.

El código está en GitHub.

Un agente Linux ejecuta las pruebas.

El pipeline guarda un paquete como artefacto.

El equipo consulta el resultado desde un navegador.

### Tarea

Identificad en el escenario:

- El controlador.
- El agente.
- El repositorio.
- El pipeline.
- El workspace.
- El artefacto.
- La interfaz web.
- La conexión de red más importante.

### Preguntas de discusión

- ¿Qué componente coordina la ejecución?
- ¿Dónde se ejecutan las pruebas?
- ¿Dónde vive el código antes de ser obtenido?
- ¿Qué datos podrían perderse si se elimina el workspace?
- ¿Qué datos conviene conservar como artefacto?
- ¿Qué componente debería tener acceso a una credencial de despliegue?
- ¿Necesita el controlador ejecutar todas las pruebas?

### Resultado

Dibujad un diagrama sencillo e indicad con flechas qué información viaja entre los componentes.

## Sesión práctica 2: inspeccionar la instalación del repositorio

Esta sesión se centra en descubrir la arquitectura antes de iniciarla.

### Preparación

Clona el repositorio si aún no lo tienes:

```bash
git clone https://github.com/agile611/startusingjenkins.git
```

Entra en su directorio:

```bash
cd startusingjenkins
```

### Revisar el estado y la estructura

```bash
git status
```

```bash
find . -maxdepth 2 -type f -print | sort
```

### Leer la documentación

```bash
less README.md
```

Anota qué herramientas y requisitos menciona.

### Inspeccionar Vagrant

```bash
less Vagrantfile
```

Completa:

```text
Sistema invitado:
Proveedor:
Nombre de la máquina:
Puertos:
Memoria:
Procesadores:
Pasos de aprovisionamiento:
Carpetas compartidas:
Dudas:
```

### Inspeccionar scripts relacionados

Lee los archivos que aparecen en el README antes de usarlos:

```bash
less docker.sh
```

```bash
less jenkins.sh
```

```bash
less sonarqube.sh
```

No ejecutes comandos que creen o borren recursos durante esta actividad.

### Puesta en común

Cada grupo debe presentar:

- Un componente de la arquitectura.
- Un requisito de instalación.
- Un riesgo que encontró.
- Una pregunta que todavía necesita respuesta.

## Sesión práctica 3: iniciar y detener la máquina virtual

Realiza esta actividad solo en un entorno autorizado y con los recursos necesarios.

### Paso 1: verificar herramientas

```bash
git --version
vagrant --version
```

Confirma también que VirtualBox está disponible mediante el método indicado por el sistema.

### Paso 2: revisar el directorio

```bash
pwd
ls -l Vagrantfile
```

### Paso 3: revisar el estado

```bash
vagrant status
```

### Paso 4: iniciar el entorno

Solo después de leer el `Vagrantfile` y recibir autorización:

```bash
vagrant up
```

Registra:

- El tiempo aproximado de inicio.
- Si se descargó una caja.
- Si se ejecutó aprovisionamiento.
- La última salida antes de completar.
- Cualquier advertencia relevante.

### Paso 5: comprobar el estado

```bash
vagrant status
```

### Paso 6: entrar en la máquina

Utiliza el comando y el nombre que indique la documentación actual del repositorio.

El README muestra como ejemplo:

```bash
vagrant ssh jenkins
```

### Paso 7: inspeccionar el sistema invitado

Dentro de la máquina, consulta:

```bash
whoami
```

```bash
pwd
```

```bash
cat /etc/os-release
```

```bash
java -version
```

El resultado puede diferir si la configuración cambió.

### Paso 8: salir y detener

Sal de la sesión remota:

```bash
exit
```

Detén la máquina siguiendo el procedimiento del curso. Para Vagrant, el comando habitual para apagarla es:

```bash
vagrant halt
```

### Preguntas

- ¿Qué comandos se ejecutaron en el anfitrión?
- ¿Qué comandos se ejecutaron en la máquina invitada?
- ¿Qué diferencia observaste entre las dos terminales?
- ¿Qué mensaje mostró Vagrant si algo no estaba instalado?
- ¿Qué archivos o recursos se conservaron al detener la máquina?

## Sesión práctica 4: comprobar el acceso a Jenkins

Esta actividad requiere que la instancia esté en marcha.

### Confirmar la dirección

Consulta el README y la configuración para conocer:

- El host.
- El puerto.
- Si se accede mediante reenvío de puertos.
- Si se necesita una dirección privada.
- Si el servicio ya terminó de iniciar.

No escribas una dirección de ejemplo como si fuera la configuración confirmada.

### Abrir la interfaz

Abre la URL indicada por el laboratorio en el navegador.

Comprueba si aparece:

- La página de desbloqueo.
- El asistente de configuración.
- La página principal.
- Una página de error.
- Una pantalla en blanco.

Registra cuál observas sin publicar información sensible.

### Consultar desde terminal

Si conoces la URL correcta, puedes usar:

```bash
curl -I URL_DE_LABORATORIO
```

Sustituye el marcador por la URL proporcionada por el curso.

### Diagnóstico

Si la interfaz no responde, comprueba:

- El estado de Vagrant.
- El estado del proceso Jenkins.
- El puerto reenviado.
- La dirección utilizada.
- Los logs.
- La disponibilidad de memoria y disco.
- La red o VPN exigida por el laboratorio.

### Resultado

Escribe una breve nota que incluya:

- La URL aprobada para el laboratorio.
- El resultado de la conexión.
- El método de verificación.
- El mensaje de error, si lo hubo, sin credenciales.

## Sesión práctica 5: primer job de diagnóstico

Esta actividad se realiza solo en una instancia de laboratorio y con los permisos indicados.

### Crear un job

Crea un job de prueba con el nombre acordado por el grupo.

Utiliza una configuración que ejecute únicamente consultas inocuas.

No utilices este job para instalar paquetes, modificar servicios o acceder a producción.

### Ejecutar consultas básicas

Si el agente es Linux y la práctica lo permite, puede ejecutarse una secuencia similar a esta:

```bash
echo "Sistema de ejecución:"
uname -a
echo "Directorio de trabajo:"
pwd
echo "Usuario:"
whoami
echo "Git:"
git --version
```

La salida depende del agente seleccionado.

### Interpretar el resultado

Anota:

- El nodo o agente utilizado.
- El sistema operativo informado.
- El directorio de trabajo.
- El usuario del proceso.
- Las herramientas disponibles.
- La duración del job.

### Comparar con el entorno local

Completa:

| Dato | Equipo local | Agente de Jenkins |
|---|---|---|
| Sistema operativo | | |
| Usuario | | |
| Directorio de trabajo | | |
| Git disponible | | |
| Shell disponible | | |
| Herramientas diferentes | | |

### Reflexión

- ¿Por qué el usuario de Jenkins puede ser distinto de tu usuario local?
- ¿Qué riesgo habría si el agente tuviera permisos administrativos innecesarios?
- ¿Qué debe instalarse en el agente para ejecutar un pipeline concreto?
- ¿Qué diferencia puede explicar un fallo que ocurre solo en Jenkins?

## Sesión práctica 6: revisar la salida de un pipeline

Esta sesión utiliza un pipeline de prueba suministrado por el docente o definido en el repositorio de prácticas.

### Observar las etapas

Identifica:

- El nombre de cada etapa.
- El comando principal.
- El resultado de la etapa.
- La duración aproximada.
- Los archivos producidos.
- El nodo que ejecutó los pasos.

### Interpretar un éxito

Un resultado exitoso indica que las etapas configuradas terminaron según las reglas definidas.

No significa que el sistema entero esté libre de defectos.

Escribe qué validaciones realizó realmente el pipeline.

### Interpretar un fallo

Si una etapa falla:

1. Identifica el nombre de la etapa.
2. Lee el mensaje desde el principio del error.
3. Busca el comando que falló.
4. Distingue entre error del proyecto y error del entorno.
5. Comprueba si el agente tenía las herramientas necesarias.
6. Registra la evidencia relevante.
7. Evita volver a ejecutar muchas veces sin entender la causa.

### Informe de diagnóstico

```text
Job:
Ejecución:
Etapa fallida:
Agente:
Comando relevante:
Resultado esperado:
Resultado observado:
Posible causa:
Próxima comprobación:
```

Elimina contraseñas, tokens y datos sensibles antes de compartir el informe.

## SonarQube como servicio opcional

El repositorio menciona SonarQube como servicio opcional de desarrollo.

SonarQube puede analizar código y presentar resultados relacionados con calidad y seguridad, según las reglas y la configuración utilizadas.

### Diferencia entre Jenkins y SonarQube

- Jenkins coordina la ejecución de pipelines.
- SonarQube analiza proyectos y presenta resultados de análisis.
- Un pipeline puede enviar código a SonarQube.
- SonarQube no reemplaza las pruebas ni el control de versiones.

### Puerto de ejemplo

El README del repositorio menciona `9000` como puerto por defecto configurable para SonarQube.

Confirma el puerto actual en la configuración antes de utilizarlo.

### Qué comprobar antes de iniciarlo

- Si la práctica realmente lo necesita.
- Qué recurso utiliza el script.
- Cuánta memoria consume.
- Si el puerto está libre.
- Dónde se conservan los datos.
- Cómo se detiene el servicio.
- Cómo se gestionan las credenciales de laboratorio.

### Actividad de análisis

Sin iniciar el servicio, inspecciona el script correspondiente y responde:

- ¿Qué servicio intenta iniciar?
- ¿Qué imagen o proceso parece usar?
- ¿Qué puerto publica?
- ¿Hay almacenamiento persistente?
- ¿Qué credenciales o parámetros necesita?
- ¿Qué información falta antes de ejecutarlo?

## Agentes del repositorio

El repositorio contiene dos archivos de agente mencionados como `DockerfileAgent2404` y `DockerfileAgentAlpine`.

El objetivo puede ser comparar agentes con bases diferentes, pero el comportamiento real depende del contenido de cada archivo.

### Inspeccionar los Dockerfiles

```bash
less DockerfileAgent2404
```

```bash
less DockerfileAgentAlpine
```

Compararlos:

```bash
diff -u DockerfileAgent2404 DockerfileAgentAlpine
```

### Registrar las diferencias

| Aspecto | Agente Ubuntu 24.04 | Agente Alpine |
|---|---|---|
| Imagen base | | |
| Gestor de paquetes | | |
| Herramientas instaladas | | |
| Usuario | | |
| Directorio de trabajo | | |
| Comando de inicio | | |
| Diferencias observadas | | |

### Discusión

- ¿Qué herramientas necesita un agente para ejecutar un pipeline?
- ¿Qué ventajas puede aportar una imagen pequeña?
- ¿Qué dependencias podrían no estar disponibles en Alpine?
- ¿Cómo se controla la identidad que ejecuta el proceso?
- ¿Qué información debe comunicarse al controlador?
- ¿Cómo se reconstruye la imagen cuando cambian sus dependencias?

## Arquitectura mínima recomendada para aprender

Para una práctica pequeña, una arquitectura sencilla puede bastar:

```text
Repositorio Git
      |
      v
Jenkins de laboratorio
      |
      v
Agente local o contenedor de práctica
      |
      v
Resultados y artefactos de ejemplo
```

Esta arquitectura simplifica el aprendizaje, pero no debe confundirse con una instalación robusta de producción.

### Decisiones explícitas

Aunque el laboratorio sea pequeño, conviene poder responder:

- ¿Dónde corre el controlador?
- ¿Dónde se ejecuta el pipeline?
- ¿Dónde se guardan los datos?
- ¿Qué redes necesita?
- ¿Qué credenciales utiliza?
- ¿Quién puede administrar Jenkins?
- ¿Qué se limpia al terminar la práctica?

### No ejecutar builds no confiables en el controlador

En instalaciones con agentes separados, la separación puede reducir riesgos.

El código de un repositorio puede ejecutar comandos arbitrarios durante una compilación. Por eso, el agente debe aislarse y tener permisos limitados.

No permitas que código no revisado acceda al sistema anfitrión o a credenciales de producción.

## Diferencia entre instalación local y producción

Una instalación local educativa favorece la experimentación. Una instalación de producción exige controles adicionales.

| Tema | Laboratorio | Producción |
|---|---|---|
| Usuarios | Cuentas de práctica | Identidad y permisos administrados |
| Red | Acceso local o restringido | Segmentación y controles formales |
| Almacenamiento | Datos temporales o de curso | Respaldo y retención definidos |
| Agentes | Pocos y sencillos | Aislados y dimensionados |
| Plugins | Los necesarios para el ejercicio | Inventario y mantenimiento controlados |
| Actualizaciones | Según las instrucciones del curso | Planificadas y probadas |
| Credenciales | Valores de laboratorio | Gestión centralizada y rotación |
| Recuperación | Reiniciar o recrear el entorno | Procedimientos probados |

No promociones una configuración de laboratorio a producción sin revisión especializada.

## Errores habituales de instalación

### `vagrant: command not found`

Posibles causas:

- Vagrant no está instalado.
- El ejecutable no está en el `PATH`.
- La terminal se abrió antes de una instalación reciente.
- El equipo del laboratorio utiliza otro método.

Comprueba la instalación con la guía del curso y no instales paquetes de fuentes desconocidas.

### VirtualBox no puede iniciar la máquina

Posibles causas:

- La virtualización está desactivada.
- El sistema anfitrión restringe el hipervisor.
- Faltan recursos.
- Hay un conflicto con otra plataforma de virtualización.
- La versión instalada no es compatible con el entorno.

Anota el mensaje y consulta al administrador. No cambies opciones de firmware en un equipo administrado sin autorización.

### Vagrant no encuentra una caja

Posibles causas:

- La caja no se ha descargado.
- La red no está disponible.
- La referencia de la caja cambió.
- La versión indicada no está disponible.
- La configuración utiliza una caja privada.

Comprueba el `Vagrantfile` y el README actuales.

### Jenkins tarda en iniciar

Posibles causas:

- El primer inicio realiza tareas adicionales.
- Se están instalando plugins.
- El equipo tiene recursos limitados.
- Java es incompatible.
- El servicio está descargando dependencias.
- Hay un problema de disco o permisos.

Consulta los logs y el estado del servicio en lugar de reiniciar repetidamente.

### `Connection refused`

Puede indicar:

- Jenkins no está escuchando.
- El servicio todavía inicia.
- La dirección o el puerto son incorrectos.
- El reenvío de puertos no está activo.
- Se está accediendo desde el lado equivocado de la máquina virtual.
- El servicio se detuvo.

Comprueba el estado de Vagrant y la configuración de red.

### `Address already in use`

El puerto puede estar ocupado por otro proceso.

No detengas un proceso sin identificarlo y confirmar que es tuyo.

Consulta al docente o utiliza el puerto indicado por el laboratorio.

### Error de Java

Comprueba:

- La versión instalada.
- La versión exigida por Jenkins.
- Qué Java utiliza el servicio.
- Si el proceso corre dentro de un contenedor o máquina virtual distinta.
- Si hay varias instalaciones de Java.

El Java de tu terminal local no necesariamente es el Java del servicio.

### No se puede desbloquear Jenkins

Comprueba:

- Que estás utilizando la instancia correcta.
- Que la contraseña procede del procedimiento del laboratorio.
- Que Jenkins terminó de iniciar.
- Que no estás utilizando datos de otra máquina.
- Que el archivo o método indicado pertenece a esa instalación.

No intentes recuperar credenciales de una instancia ajena.

### Los plugins no se instalan

Posibles causas:

- Falta de conectividad.
- Proxy no configurado.
- Certificados o restricciones de red.
- Incompatibilidad con la versión de Jenkins.
- Servicio de actualización temporalmente indisponible.
- Falta de almacenamiento.

En una instancia compartida, informa al administrador en lugar de cambiar la configuración global.

### Docker indica falta de permisos

La cuenta puede no tener permiso para comunicarse con el daemon.

No añadas el usuario a grupos privilegiados sin entender el riesgo y sin autorización.

### Se agota el disco

Revisa:

- Workspaces antiguos.
- Artefactos retenidos.
- Logs.
- Imágenes de contenedor.
- Volúmenes.
- Discos virtuales.

No borres recursos compartidos sin identificar quién los utiliza.

## Diagnóstico ordenado

Cuando Jenkins no funciona, resuelve el problema por capas.

### Capa 1: equipo anfitrión

Comprueba:

- ¿El equipo está encendido?
- ¿Tiene espacio libre?
- ¿Tiene memoria disponible?
- ¿Hay conexión a la red?
- ¿VirtualBox o Docker funcionan?

### Capa 2: entorno invitado

Comprueba:

- ¿La máquina virtual está activa?
- ¿El contenedor existe?
- ¿El proceso invitado responde?
- ¿La red entre anfitrión e invitado funciona?
- ¿Hay suficiente disco dentro del invitado?

### Capa 3: servicio Jenkins

Comprueba:

- ¿Jenkins está iniciado?
- ¿Java funciona?
- ¿Hay errores en los logs?
- ¿El puerto configurado está disponible?
- ¿El servicio terminó su secuencia de inicio?

### Capa 4: navegador y red

Comprueba:

- ¿La URL es correcta?
- ¿El puerto coincide?
- ¿El puerto se reenvía?
- ¿La VPN es necesaria?
- ¿El cortafuegos bloquea la conexión?

### Capa 5: usuario y permisos

Comprueba:

- ¿La cuenta está autorizada?
- ¿El job está disponible?
- ¿El usuario puede acceder al agente?
- ¿Las credenciales están configuradas por el administrador?

### Registrar antes de cambiar

Antes de modificar la instalación, anota:

- El estado observado.
- El comando ejecutado.
- El mensaje exacto.
- La hora del error.
- La capa donde aparece.
- El cambio más reciente realizado.

Una modificación no documentada puede dificultar encontrar la causa original.

## Seguridad de una instalación de laboratorio

Jenkins puede ejecutar código arbitrario en sus agentes. Trata la instancia como un sistema con capacidad de modificar archivos y comunicarse con otros servicios.

### Mantener Jenkins en una red controlada

Para prácticas locales:

- Utiliza solo la red requerida.
- Evita enlazar servicios a redes públicas.
- No publiques puertos en Internet.
- Cierra el acceso cuando el laboratorio indique hacerlo.
- No reutilices la configuración de laboratorio en producción.

### Usar cuentas distintas

No reutilices una contraseña personal.

Utiliza una cuenta de laboratorio con permisos limitados y sigue la política del curso.

### No guardar secretos en scripts

Los scripts del repositorio deben usar marcadores o valores no sensibles.

Los secretos reales deben proporcionarse mediante mecanismos aprobados, como el almacén de credenciales de Jenkins.

### Limitar agentes

No ejecutes un agente con permisos administrativos si no es necesario.

Evita montar carpetas sensibles del anfitrión dentro de un contenedor o agente.

### Actualizar con cautela

Las actualizaciones de Jenkins y plugins deben seguir un procedimiento.

En un laboratorio compartido, la actualización corresponde a quien administra el entorno.

### Limpiar de forma segura

Al terminar:

- Detén los servicios según las instrucciones.
- Conserva el estado si la siguiente sesión lo necesita.
- Elimina únicamente recursos propios.
- No borres volúmenes o directorios de otros alumnos.
- No copies credenciales a archivos de notas.

## Checklist antes de instalar

Antes de iniciar una instalación o máquina virtual:

- [ ] He leído el README actual.
- [ ] He inspeccionado el `Vagrantfile` o el script que utilizaré.
- [ ] Sé qué recursos se crearán.
- [ ] Tengo autorización para usar el equipo y el proveedor.
- [ ] Dispongo de espacio y memoria suficientes.
- [ ] Conozco los puertos que se utilizarán.
- [ ] Sé cómo detener el entorno.
- [ ] Sé cómo evitar borrar datos compartidos.
- [ ] No voy a utilizar credenciales de producción.
- [ ] He anotado mis dudas antes de continuar.

## Checklist después de instalar

Después de iniciar Jenkins:

- [ ] He confirmado que el proceso está activo.
- [ ] He consultado los logs si hubo errores.
- [ ] He verificado la URL y el puerto.
- [ ] He confirmado que la instancia pertenece al laboratorio.
- [ ] He completado la configuración inicial según la guía.
- [ ] No he compartido contraseñas o tokens.
- [ ] Sé dónde se ejecutan los jobs.
- [ ] Sé dónde se guardan los datos de Jenkins.
- [ ] Sé cómo detener el entorno.
- [ ] He registrado las versiones relevantes.

## Preguntas de repaso

1. ¿Qué funciones realiza el controlador de Jenkins?
2. ¿Qué es un agente?
3. ¿Qué representa un ejecutor?
4. ¿Qué información puede almacenarse en el directorio de datos de Jenkins?
5. ¿Qué diferencia hay entre una máquina virtual y un contenedor?
6. ¿Por qué conviene inspeccionar el `Vagrantfile` antes de ejecutar `vagrant up`?
7. ¿Qué puerto menciona el README para Jenkins y por qué debe verificarse?
8. ¿Qué puede ocurrir si se elimina un volumen de Jenkins?
9. ¿Por qué un agente no debería tener permisos administrativos innecesarios?
10. ¿Qué diferencia hay entre un workspace y un artefacto?
11. ¿Por qué instalar muchos plugins puede complicar el mantenimiento?
12. ¿Qué datos no se deben guardar en un `Jenkinsfile`?
13. ¿Cómo distinguirías un error de red de un error del servicio?
14. ¿Qué pasos seguirías ante un mensaje `Connection refused`?
15. ¿Por qué una instalación de laboratorio no debe exponerse directamente a Internet?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«El controlador de Jenkins coordina los trabajos y puede asignarlos a agentes».

### Afirmación 2

«Un agente puede ejecutar código del repositorio, así que sus permisos deben limitarse».

### Afirmación 3

«El puerto de Jenkins siempre es 8080 en cualquier instalación».

### Afirmación 4

«Un contenedor y una máquina virtual tienen exactamente el mismo nivel de aislamiento».

### Afirmación 5

«El README del repositorio sustituye la inspección del `Vagrantfile`».

### Afirmación 6

«Al detener una máquina virtual se destruyen necesariamente todos sus datos».

### Afirmación 7

«Instalar un plugin puede afectar la estabilidad y el mantenimiento de Jenkins».

### Afirmación 8

«Una respuesta de `curl -I` demuestra que todas las funciones de Jenkins están configuradas correctamente».

### Afirmación 9

«El workspace puede contener archivos temporales que no deben considerarse almacenamiento permanente».

### Afirmación 10

«Se puede borrar cualquier volumen de Docker después de terminar un job».

## Respuestas orientativas

### Afirmación 1

**Correcta.** El controlador administra la coordinación y puede asignar ejecuciones a agentes.

### Afirmación 2

**Correcta.** Un pipeline ejecuta comandos; los permisos del agente limitan el impacto de un error o abuso.

### Afirmación 3

**Incorrecta.** `8080` es un valor habitual mencionado por el repositorio, pero la configuración puede variar.

### Afirmación 4

**Incorrecta.** Una máquina virtual ejecuta un sistema operativo invitado; un contenedor aísla procesos y comparte el núcleo del anfitrión.

### Afirmación 5

**Incorrecta.** El README ofrece instrucciones, pero hay que comprobar cómo están implementadas en el archivo actual.

### Afirmación 6

**Incorrecta.** Detener una máquina suele conservarla; destruirla puede eliminar datos.

### Afirmación 7

**Correcta.** Los plugins pueden afectar compatibilidad, disponibilidad y seguridad.

### Afirmación 8

**Incorrecta.** Solo confirma que un servicio respondió a una petición, no que toda la configuración sea correcta.

### Afirmación 9

**Correcta.** El workspace puede limpiarse o reemplazarse según la configuración.

### Afirmación 10

**Incorrecta.** Un volumen puede contener información persistente necesaria para otras prácticas.

## Glosario

- **Agente:** nodo donde Jenkins ejecuta tareas.
- **Anfitrión:** sistema que ejecuta una máquina virtual o un contenedor.
- **Artefacto:** archivo o paquete generado por una ejecución.
- **Controlador:** componente que coordina Jenkins y ofrece su interfaz.
- **Ejecutor:** capacidad de un nodo para ejecutar tareas simultáneamente.
- **JENKINS_HOME:** directorio donde una instalación puede conservar configuración y datos de Jenkins.
- **Job:** unidad de trabajo configurada en Jenkins.
- **Jenkinsfile:** archivo que describe un pipeline de Jenkins como código.
- **Plugin:** extensión que añade capacidades o integraciones a Jenkins.
- **Puerto:** número utilizado para identificar un servicio de red.
- **Vagrant:** herramienta para definir y administrar entornos de máquinas virtuales.
- **VirtualBox:** plataforma de virtualización utilizada en la ruta de laboratorio del repositorio.
- **Volumen:** almacenamiento que puede conservar datos fuera del ciclo de vida de un contenedor.
- **Workspace:** directorio de trabajo asociado a una ejecución de Jenkins.

## Resumen

- Jenkins coordina pipelines y puede distribuir tareas entre agentes.
- El controlador, los agentes, los ejecutores, los workspaces y los plugins cumplen funciones diferentes.
- El repositorio del curso propone un laboratorio local basado en Vagrant y VirtualBox, con recursos complementarios relacionados con Docker y SonarQube.
- Antes de ejecutar `vagrant up` o cualquier script, inspecciona el README, el `Vagrantfile` y el contenido del archivo.
- El puerto `8080` se menciona como valor habitual configurable para Jenkins; confirma el valor real de tu entorno.
- Los datos de Jenkins deben persistirse de manera deliberada si se necesitan conservar.
- Los agentes ejecutan código y deben tener permisos limitados.
- Jenkins, los agentes y sus credenciales no deben exponerse sin controles adecuados.
- Un error se diagnostica revisando el anfitrión, el entorno invitado, el servicio, la red y los permisos, en ese orden.